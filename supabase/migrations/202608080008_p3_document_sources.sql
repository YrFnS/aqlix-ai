begin;

alter table public.attachments
  add column content_sha256 text,
  add column failure_code text,
  add column processor_version text,
  add column source_count integer not null default 0,
  add column processed_at timestamptz;

alter table public.attachments
  add constraint attachments_content_sha256_format check (
    content_sha256 is null or content_sha256 ~ '^[0-9a-f]{64}$'
  ),
  add constraint attachments_failure_code_length check (
    failure_code is null or char_length(failure_code) between 1 and 80
  ),
  add constraint attachments_processor_version_length check (
    processor_version is null or char_length(processor_version) between 1 and 120
  ),
  add constraint attachments_source_count_nonnegative check (source_count >= 0);

create unique index attachments_workspace_active_hash_unique
  on public.attachments(workspace_id, content_sha256)
  where content_sha256 is not null
    and deleted_at is null
    and status in ('pending', 'processing', 'ready');

alter table public.sources
  add column start_line integer,
  add column end_line integer,
  add column search_vector tsvector
    generated always as (to_tsvector('simple'::regconfig, content)) stored;

alter table public.sources
  add constraint sources_start_line_positive check (
    start_line is null or start_line > 0
  ),
  add constraint sources_end_line_positive check (
    end_line is null or end_line > 0
  ),
  add constraint sources_line_order check (
    start_line is null or end_line is null or end_line >= start_line
  ),
  add constraint sources_content_bounded check (char_length(content) <= 4000);

create index sources_search_vector_idx
  on public.sources using gin(search_vector);

create table public.attachment_processing_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  attachment_id uuid not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  attempt integer not null,
  processor text not null,
  processor_version text not null,
  status text not null default 'processing',
  source_count integer not null default 0,
  character_count integer not null default 0,
  failure_code text,
  failure_message text,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint attachment_processing_runs_workspace_attachment_fk
    foreign key (workspace_id, attachment_id)
    references public.attachments(workspace_id, id)
    on delete cascade,
  constraint attachment_processing_runs_attempt_positive check (attempt > 0),
  constraint attachment_processing_runs_processor_length check (
    char_length(btrim(processor)) between 1 and 120
  ),
  constraint attachment_processing_runs_version_length check (
    char_length(btrim(processor_version)) between 1 and 120
  ),
  constraint attachment_processing_runs_status check (
    status in ('processing', 'complete', 'failed')
  ),
  constraint attachment_processing_runs_source_count_nonnegative check (
    source_count >= 0
  ),
  constraint attachment_processing_runs_character_count_nonnegative check (
    character_count >= 0
  ),
  constraint attachment_processing_runs_failure_code_length check (
    failure_code is null or char_length(failure_code) between 1 and 80
  ),
  constraint attachment_processing_runs_failure_message_length check (
    failure_message is null or char_length(failure_message) <= 500
  ),
  constraint attachment_processing_runs_attachment_attempt_unique
    unique (attachment_id, attempt),
  constraint attachment_processing_runs_workspace_id_id_unique
    unique (workspace_id, id)
);

create index attachment_processing_runs_attachment_created_idx
  on public.attachment_processing_runs(attachment_id, created_at desc);

create trigger attachment_processing_runs_touch_updated_at
before update on public.attachment_processing_runs
for each row execute function public.touch_updated_at();

create trigger attachments_require_active_workspace
before insert on public.attachments
for each row execute function public.require_active_workspace_insert();

create trigger sources_require_active_workspace
before insert on public.sources
for each row execute function public.require_active_workspace_insert();

create trigger attachment_processing_runs_require_active_workspace
before insert on public.attachment_processing_runs
for each row execute function public.require_active_workspace_insert();

create or replace function public.is_workspace_active(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.workspaces workspace
      where workspace.id = target_workspace_id
        and workspace.archived_at is null
    );
$$;

create or replace function public.workspace_id_from_storage_path(object_name text)
returns uuid
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  first_segment text;
begin
  first_segment := split_part(object_name, '/', 1);

  if first_segment !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return null;
  end if;

  return first_segment::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

revoke all on function public.is_workspace_active(uuid) from public;
revoke all on function public.workspace_id_from_storage_path(text) from public;
grant execute on function public.is_workspace_active(uuid) to authenticated;
grant execute on function public.workspace_id_from_storage_path(text) to authenticated;

alter table public.attachment_processing_runs enable row level security;

create policy attachment_processing_runs_select_member
on public.attachment_processing_runs
for select
to authenticated
using (public.is_workspace_member(workspace_id));

-- P3 document mutations are owned by bounded security-definer functions. This
-- removes the broad P1 editor mutation surface while preserving member reads.
drop policy attachments_insert_editor on public.attachments;
drop policy attachments_update_editor on public.attachments;
drop policy attachments_delete_editor on public.attachments;
drop policy sources_insert_editor on public.sources;
drop policy sources_update_editor on public.sources;
drop policy sources_delete_editor on public.sources;

revoke insert, update, delete on public.attachments from authenticated;
revoke insert, update, delete on public.sources from authenticated;
grant select on public.attachment_processing_runs to authenticated;

create or replace function public.begin_attachment_processing(
  target_workspace_id uuid,
  original_file_name text,
  normalized_media_type text,
  original_byte_size bigint,
  original_content_sha256 text,
  requested_processor text,
  requested_processor_version text
)
returns table (
  attachment_id uuid,
  processing_run_id uuid,
  object_path text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  generated_attachment_id uuid := gen_random_uuid();
  generated_processing_run_id uuid := gen_random_uuid();
  generated_object_path text;
  normalized_extension text;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if char_length(btrim(original_file_name)) not between 1 and 255 then
    raise exception 'invalid document filename';
  end if;

  if position('/' in original_file_name) > 0 or position(chr(92) in original_file_name) > 0 then
    raise exception 'document filename must not contain path separators';
  end if;

  if normalized_media_type = 'text/plain' then
    normalized_extension := 'txt';
  elsif normalized_media_type = 'text/markdown' then
    normalized_extension := 'md';
  else
    raise exception 'unsupported document media type';
  end if;

  if original_byte_size < 1 or original_byte_size > 2097152 then
    raise exception 'document byte size is outside the supported range';
  end if;

  if original_content_sha256 !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid document content hash';
  end if;

  if char_length(btrim(requested_processor)) not between 1 and 120
    or char_length(btrim(requested_processor_version)) not between 1 and 120 then
    raise exception 'invalid document processor identity';
  end if;

  generated_object_path := concat(
    target_workspace_id::text,
    '/',
    generated_attachment_id::text,
    '/document.',
    normalized_extension
  );

  insert into public.attachments (
    id,
    workspace_id,
    uploaded_by,
    file_name,
    media_type,
    byte_size,
    storage_path,
    status,
    content_sha256,
    processor_version
  )
  values (
    generated_attachment_id,
    target_workspace_id,
    auth.uid(),
    btrim(original_file_name),
    normalized_media_type,
    original_byte_size,
    generated_object_path,
    'processing',
    original_content_sha256,
    btrim(requested_processor_version)
  );

  insert into public.attachment_processing_runs (
    id,
    workspace_id,
    attachment_id,
    created_by,
    attempt,
    processor,
    processor_version,
    status
  )
  values (
    generated_processing_run_id,
    target_workspace_id,
    generated_attachment_id,
    auth.uid(),
    1,
    btrim(requested_processor),
    btrim(requested_processor_version),
    'processing'
  );

  return query
  select
    generated_attachment_id,
    generated_processing_run_id,
    generated_object_path;
end;
$$;

create or replace function public.finalize_attachment_processing(
  target_workspace_id uuid,
  target_attachment_id uuid,
  target_processing_run_id uuid,
  normalized_character_count integer,
  extracted_passages jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  passage_count integer;
  distinct_ordinal_count integer;
  minimum_ordinal integer;
  maximum_ordinal integer;
  maximum_end_offset integer;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if normalized_character_count < 1 or normalized_character_count > 2097152 then
    raise exception 'normalized character count is outside the supported range';
  end if;

  if jsonb_typeof(extracted_passages) <> 'array' then
    raise exception 'extracted passages must be an array';
  end if;

  perform 1
  from public.attachments attachment
  where attachment.workspace_id = target_workspace_id
    and attachment.id = target_attachment_id
    and attachment.status = 'processing'
  for update;

  if not found then
    raise exception 'attachment is not in processing state';
  end if;

  perform 1
  from public.attachment_processing_runs processing_run
  where processing_run.workspace_id = target_workspace_id
    and processing_run.attachment_id = target_attachment_id
    and processing_run.id = target_processing_run_id
    and processing_run.status = 'processing'
  for update;

  if not found then
    raise exception 'processing run is not active';
  end if;

  select
    count(*)::integer,
    count(distinct passage.ordinal)::integer,
    min(passage.ordinal),
    max(passage.ordinal),
    max(passage.end_offset)
  into
    passage_count,
    distinct_ordinal_count,
    minimum_ordinal,
    maximum_ordinal,
    maximum_end_offset
  from jsonb_to_recordset(extracted_passages) as passage(
    ordinal integer,
    content text,
    page_number integer,
    start_offset integer,
    end_offset integer,
    start_line integer,
    end_line integer
  );

  if passage_count < 1 or passage_count > 4096 then
    raise exception 'invalid passage count';
  end if;

  if distinct_ordinal_count <> passage_count
    or minimum_ordinal <> 0
    or maximum_ordinal <> passage_count - 1 then
    raise exception 'passage ordinals must be contiguous from zero';
  end if;

  if maximum_end_offset > normalized_character_count then
    raise exception 'passage offset exceeds normalized document length';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(extracted_passages) as passage(
      ordinal integer,
      content text,
      page_number integer,
      start_offset integer,
      end_offset integer,
      start_line integer,
      end_line integer
    )
    where passage.content is null
      or char_length(passage.content) < 1
      or char_length(passage.content) > 4000
      or passage.start_offset is null
      or passage.end_offset is null
      or passage.start_offset < 0
      or passage.end_offset <= passage.start_offset
      or passage.start_line is null
      or passage.end_line is null
      or passage.start_line < 1
      or passage.end_line < passage.start_line
      or passage.page_number is not null
  ) then
    raise exception 'one or more passages are invalid';
  end if;

  delete from public.sources source
  where source.workspace_id = target_workspace_id
    and source.attachment_id = target_attachment_id;

  insert into public.sources (
    workspace_id,
    attachment_id,
    ordinal,
    content,
    page_number,
    start_offset,
    end_offset,
    start_line,
    end_line
  )
  select
    target_workspace_id,
    target_attachment_id,
    passage.ordinal,
    passage.content,
    passage.page_number,
    passage.start_offset,
    passage.end_offset,
    passage.start_line,
    passage.end_line
  from jsonb_to_recordset(extracted_passages) as passage(
    ordinal integer,
    content text,
    page_number integer,
    start_offset integer,
    end_offset integer,
    start_line integer,
    end_line integer
  )
  order by passage.ordinal;

  update public.attachment_processing_runs
  set
    status = 'complete',
    source_count = passage_count,
    character_count = normalized_character_count,
    failure_code = null,
    failure_message = null,
    completed_at = timezone('utc', now())
  where workspace_id = target_workspace_id
    and attachment_id = target_attachment_id
    and id = target_processing_run_id;

  update public.attachments
  set
    status = 'ready',
    source_count = passage_count,
    failure_code = null,
    failure_reason = null,
    processed_at = timezone('utc', now())
  where workspace_id = target_workspace_id
    and id = target_attachment_id;
end;
$$;

create or replace function public.fail_attachment_processing(
  target_workspace_id uuid,
  target_attachment_id uuid,
  target_processing_run_id uuid,
  processing_failure_code text,
  processing_failure_message text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if char_length(btrim(processing_failure_code)) not between 1 and 80
    or char_length(coalesce(processing_failure_message, '')) > 500 then
    raise exception 'invalid processing failure details';
  end if;

  update public.attachment_processing_runs
  set
    status = 'failed',
    failure_code = btrim(processing_failure_code),
    failure_message = nullif(processing_failure_message, ''),
    completed_at = timezone('utc', now())
  where workspace_id = target_workspace_id
    and attachment_id = target_attachment_id
    and id = target_processing_run_id
    and status = 'processing';

  update public.attachments
  set
    status = 'failed',
    source_count = 0,
    failure_code = btrim(processing_failure_code),
    failure_reason = nullif(processing_failure_message, ''),
    processed_at = timezone('utc', now())
  where workspace_id = target_workspace_id
    and id = target_attachment_id
    and status = 'processing';
end;
$$;

create or replace function public.delete_attachment_record(
  target_workspace_id uuid,
  target_attachment_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  deleted_count integer;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  delete from public.attachments attachment
  where attachment.workspace_id = target_workspace_id
    and attachment.id = target_attachment_id;

  get diagnostics deleted_count = row_count;
  return deleted_count = 1;
end;
$$;

create or replace function public.search_workspace_sources(
  target_workspace_id uuid,
  source_query text,
  result_limit integer default 8
)
returns table (
  source_id uuid,
  attachment_id uuid,
  file_name text,
  media_type text,
  ordinal integer,
  content text,
  page_number integer,
  start_line integer,
  end_line integer,
  rank real
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  parsed_query tsquery;
  bounded_limit integer;
begin
  if not public.is_workspace_member(target_workspace_id) then
    raise insufficient_privilege using message = 'workspace membership required';
  end if;

  if char_length(btrim(source_query)) < 1 or char_length(source_query) > 500 then
    raise exception 'source query is outside the supported range';
  end if;

  bounded_limit := least(greatest(result_limit, 1), 20);
  parsed_query := websearch_to_tsquery('simple'::regconfig, btrim(source_query));

  return query
  select
    source.id,
    source.attachment_id,
    attachment.file_name,
    attachment.media_type,
    source.ordinal,
    source.content,
    source.page_number,
    source.start_line,
    source.end_line,
    ts_rank_cd(source.search_vector, parsed_query)::real as rank
  from public.sources source
  join public.attachments attachment
    on attachment.workspace_id = source.workspace_id
    and attachment.id = source.attachment_id
  where source.workspace_id = target_workspace_id
    and attachment.status = 'ready'
    and attachment.deleted_at is null
    and source.search_vector @@ parsed_query
  order by
    ts_rank_cd(source.search_vector, parsed_query) desc,
    attachment.created_at desc,
    source.ordinal asc,
    source.id asc
  limit bounded_limit;
end;
$$;

revoke all on function public.begin_attachment_processing(
  uuid, text, text, bigint, text, text, text
) from public;
revoke all on function public.finalize_attachment_processing(
  uuid, uuid, uuid, integer, jsonb
) from public;
revoke all on function public.fail_attachment_processing(
  uuid, uuid, uuid, text, text
) from public;
revoke all on function public.delete_attachment_record(uuid, uuid) from public;
revoke all on function public.search_workspace_sources(uuid, text, integer) from public;

grant execute on function public.begin_attachment_processing(
  uuid, text, text, bigint, text, text, text
) to authenticated;
grant execute on function public.finalize_attachment_processing(
  uuid, uuid, uuid, integer, jsonb
) to authenticated;
grant execute on function public.fail_attachment_processing(
  uuid, uuid, uuid, text, text
) to authenticated;
grant execute on function public.delete_attachment_record(uuid, uuid) to authenticated;
grant execute on function public.search_workspace_sources(uuid, text, integer) to authenticated;

-- Storage may be absent in the lightweight PostgreSQL contract harness. The
-- bucket and object policies are created when running in a real Supabase
-- database, and are exercised by the P3 local-Supabase Storage workflow.
do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (
      id,
      name,
      public,
      file_size_limit,
      allowed_mime_types
    )
    values (
      'workspace-documents',
      'workspace-documents',
      false,
      2097152,
      array['text/plain', 'text/markdown']::text[]
    )
    on conflict (id) do update
    set
      public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
  end if;
end;
$$;

do $$
begin
  if to_regclass('storage.objects') is not null then
    execute 'drop policy if exists workspace_documents_select_member on storage.objects';
    execute 'drop policy if exists workspace_documents_insert_editor on storage.objects';
    execute 'drop policy if exists workspace_documents_delete_editor on storage.objects';

    execute $policy$
      create policy workspace_documents_select_member
      on storage.objects
      for select
      to authenticated
      using (
        bucket_id = 'workspace-documents'
        and public.is_workspace_member(
          public.workspace_id_from_storage_path(name)
        )
      )
    $policy$;

    execute $policy$
      create policy workspace_documents_insert_editor
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'workspace-documents'
        and public.has_workspace_role(
          public.workspace_id_from_storage_path(name),
          array['owner', 'editor']
        )
        and public.is_workspace_active(
          public.workspace_id_from_storage_path(name)
        )
      )
    $policy$;

    execute $policy$
      create policy workspace_documents_delete_editor
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'workspace-documents'
        and public.has_workspace_role(
          public.workspace_id_from_storage_path(name),
          array['owner', 'editor']
        )
        and public.is_workspace_active(
          public.workspace_id_from_storage_path(name)
        )
      )
    $policy$;
  end if;
end;
$$;

commit;
