begin;

alter table public.drafts
  add constraint drafts_workspace_id_id_unique unique (workspace_id, id),
  add column kind text not null default 'freeform',
  add column origin_message_id uuid,
  add column current_version integer not null default 0,
  add column version_count integer not null default 0,
  add column provenance_count integer not null default 0,
  add column last_saved_at timestamptz,
  add column archived_at timestamptz;

alter table public.drafts
  add constraint drafts_kind_check check (
    kind in (
      'freeform',
      'summary',
      'comparison',
      'email',
      'memo',
      'checklist',
      'decision_note'
    )
  ),
  add constraint drafts_content_bounded check (char_length(content) <= 100000),
  add constraint drafts_current_version_nonnegative check (current_version >= 0),
  add constraint drafts_version_count_nonnegative check (version_count >= 0),
  add constraint drafts_provenance_count_nonnegative check (provenance_count >= 0),
  add constraint drafts_version_count_consistent check (
    current_version <= version_count
  ),
  add constraint drafts_origin_requires_conversation check (
    origin_message_id is null or conversation_id is not null
  ),
  add constraint drafts_archive_state_consistent check (
    (status = 'active' and archived_at is null)
    or (status = 'archived' and archived_at is not null)
  ),
  add constraint drafts_workspace_origin_message_fk
    foreign key (workspace_id, conversation_id, origin_message_id)
    references public.messages(workspace_id, conversation_id, id)
    on delete set null (origin_message_id);

update public.drafts
set archived_at = coalesce(archived_at, updated_at)
where status = 'archived';

create table public.draft_generations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  draft_id uuid not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  base_version integer not null,
  action text not null,
  instruction text not null,
  provider text not null,
  requested_model text not null,
  returned_model text,
  provider_response_id text,
  status text not null default 'pending',
  proposed_content text not null default '',
  input_tokens integer,
  output_tokens integer,
  reasoning_tokens integer,
  total_tokens integer,
  first_token_latency_ms integer,
  latency_ms integer,
  failure_code text,
  failure_message text,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  applied_at timestamptz,
  discarded_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint draft_generations_workspace_draft_fk
    foreign key (workspace_id, draft_id)
    references public.drafts(workspace_id, id)
    on delete cascade,
  constraint draft_generations_workspace_id_id_unique
    unique (workspace_id, id),
  constraint draft_generations_base_version_positive check (base_version > 0),
  constraint draft_generations_action_check check (
    action in (
      'improve',
      'shorten',
      'expand',
      'translate_ar',
      'translate_en',
      'continue',
      'custom'
    )
  ),
  constraint draft_generations_instruction_length check (
    char_length(btrim(instruction)) between 1 and 2000
  ),
  constraint draft_generations_provider_length check (
    char_length(btrim(provider)) between 1 and 64
  ),
  constraint draft_generations_requested_model_length check (
    char_length(btrim(requested_model)) between 1 and 160
  ),
  constraint draft_generations_returned_model_length check (
    returned_model is null or char_length(btrim(returned_model)) between 1 and 160
  ),
  constraint draft_generations_response_id_length check (
    provider_response_id is null or char_length(provider_response_id) <= 255
  ),
  constraint draft_generations_status_check check (
    status in (
      'pending',
      'streaming',
      'complete',
      'failed',
      'cancelled',
      'applied',
      'discarded'
    )
  ),
  constraint draft_generations_content_bounded check (
    char_length(proposed_content) <= 100000
  ),
  constraint draft_generations_input_tokens_nonnegative check (
    input_tokens is null or input_tokens >= 0
  ),
  constraint draft_generations_output_tokens_nonnegative check (
    output_tokens is null or output_tokens >= 0
  ),
  constraint draft_generations_reasoning_tokens_nonnegative check (
    reasoning_tokens is null or reasoning_tokens >= 0
  ),
  constraint draft_generations_total_tokens_nonnegative check (
    total_tokens is null or total_tokens >= 0
  ),
  constraint draft_generations_first_token_nonnegative check (
    first_token_latency_ms is null or first_token_latency_ms >= 0
  ),
  constraint draft_generations_latency_nonnegative check (
    latency_ms is null or latency_ms >= 0
  ),
  constraint draft_generations_failure_code_length check (
    failure_code is null or char_length(failure_code) between 1 and 120
  ),
  constraint draft_generations_failure_message_length check (
    failure_message is null or char_length(failure_message) <= 2000
  )
);

create unique index draft_generations_one_active_per_draft
  on public.draft_generations(draft_id)
  where status in ('pending', 'streaming');

create index draft_generations_draft_created_idx
  on public.draft_generations(draft_id, created_at desc);

create table public.draft_versions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  draft_id uuid not null,
  version_number integer not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  source_kind text not null,
  title text not null,
  content text not null,
  direction text not null,
  kind text not null,
  generation_id uuid,
  restored_from_version integer,
  created_at timestamptz not null default timezone('utc', now()),
  constraint draft_versions_workspace_draft_fk
    foreign key (workspace_id, draft_id)
    references public.drafts(workspace_id, id)
    on delete cascade,
  constraint draft_versions_workspace_generation_fk
    foreign key (workspace_id, generation_id)
    references public.draft_generations(workspace_id, id)
    on delete set null (generation_id),
  constraint draft_versions_workspace_id_id_unique
    unique (workspace_id, id),
  constraint draft_versions_draft_number_unique
    unique (draft_id, version_number),
  constraint draft_versions_version_positive check (version_number > 0),
  constraint draft_versions_source_kind_check check (
    source_kind in ('initial', 'manual', 'ai', 'restored')
  ),
  constraint draft_versions_title_length check (
    char_length(btrim(title)) between 1 and 200
  ),
  constraint draft_versions_content_bounded check (
    char_length(content) <= 100000
  ),
  constraint draft_versions_direction_check check (
    direction in ('auto', 'rtl', 'ltr')
  ),
  constraint draft_versions_kind_check check (
    kind in (
      'freeform',
      'summary',
      'comparison',
      'email',
      'memo',
      'checklist',
      'decision_note'
    )
  ),
  constraint draft_versions_restore_reference_positive check (
    restored_from_version is null or restored_from_version > 0
  ),
  constraint draft_versions_source_metadata_consistent check (
    (source_kind = 'ai' and generation_id is not null and restored_from_version is null)
    or
    (source_kind = 'restored' and generation_id is null and restored_from_version is not null)
    or
    (source_kind in ('initial', 'manual') and generation_id is null and restored_from_version is null)
  )
);

create index draft_versions_draft_created_idx
  on public.draft_versions(draft_id, version_number desc);

create table public.draft_provenance (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  draft_id uuid not null,
  conversation_id uuid,
  origin_message_id uuid,
  source_id uuid references public.sources(id) on delete set null,
  attachment_id uuid references public.attachments(id) on delete set null,
  citation_order integer not null,
  label text not null,
  file_name_snapshot text not null,
  media_type_snapshot text not null,
  source_ordinal_snapshot integer not null,
  page_number_snapshot integer,
  start_line_snapshot integer,
  end_line_snapshot integer,
  created_at timestamptz not null default timezone('utc', now()),
  constraint draft_provenance_workspace_draft_fk
    foreign key (workspace_id, draft_id)
    references public.drafts(workspace_id, id)
    on delete cascade,
  constraint draft_provenance_workspace_message_fk
    foreign key (workspace_id, conversation_id, origin_message_id)
    references public.messages(workspace_id, conversation_id, id)
    on delete set null (conversation_id, origin_message_id),
  constraint draft_provenance_workspace_id_id_unique
    unique (workspace_id, id),
  constraint draft_provenance_draft_order_unique
    unique (draft_id, citation_order),
  constraint draft_provenance_draft_label_unique
    unique (draft_id, label),
  constraint draft_provenance_citation_order_nonnegative check (
    citation_order >= 0
  ),
  constraint draft_provenance_label_format check (
    label ~ '^S[1-9][0-9]*$'
  ),
  constraint draft_provenance_file_name_length check (
    char_length(file_name_snapshot) between 1 and 255
  ),
  constraint draft_provenance_media_type_length check (
    char_length(media_type_snapshot) between 1 and 255
  ),
  constraint draft_provenance_source_ordinal_nonnegative check (
    source_ordinal_snapshot >= 0
  ),
  constraint draft_provenance_page_positive check (
    page_number_snapshot is null or page_number_snapshot > 0
  ),
  constraint draft_provenance_start_line_positive check (
    start_line_snapshot is null or start_line_snapshot > 0
  ),
  constraint draft_provenance_end_line_positive check (
    end_line_snapshot is null or end_line_snapshot > 0
  ),
  constraint draft_provenance_line_order check (
    start_line_snapshot is null
    or end_line_snapshot is null
    or end_line_snapshot >= start_line_snapshot
  )
);

create index draft_provenance_source_idx
  on public.draft_provenance(source_id)
  where source_id is not null;
create index draft_provenance_attachment_idx
  on public.draft_provenance(attachment_id)
  where attachment_id is not null;

insert into public.draft_versions (
  workspace_id,
  draft_id,
  version_number,
  created_by,
  source_kind,
  title,
  content,
  direction,
  kind,
  created_at
)
select
  draft.workspace_id,
  draft.id,
  1,
  draft.created_by,
  'initial',
  draft.title,
  draft.content,
  draft.direction,
  draft.kind,
  draft.created_at
from public.drafts draft;

update public.drafts
set
  current_version = 1,
  version_count = 1,
  last_saved_at = coalesce(last_saved_at, updated_at);

alter table public.drafts
  alter column current_version set default 1,
  alter column version_count set default 1,
  alter column last_saved_at set default timezone('utc', now()),
  alter column last_saved_at set not null;

create trigger draft_generations_touch_updated_at
before update on public.draft_generations
for each row execute function public.touch_updated_at();

create trigger drafts_require_active_workspace
before insert on public.drafts
for each row execute function public.require_active_workspace_insert();

create trigger draft_versions_require_active_workspace
before insert on public.draft_versions
for each row execute function public.require_active_workspace_insert();

create trigger draft_provenance_require_active_workspace
before insert on public.draft_provenance
for each row execute function public.require_active_workspace_insert();

create trigger draft_generations_require_active_workspace
before insert on public.draft_generations
for each row execute function public.require_active_workspace_insert();

alter table public.draft_versions enable row level security;
alter table public.draft_provenance enable row level security;
alter table public.draft_generations enable row level security;

create policy draft_versions_select_member
on public.draft_versions
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy draft_provenance_select_member
on public.draft_provenance
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy draft_generations_select_member
on public.draft_generations
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy drafts_insert_editor on public.drafts;
drop policy drafts_update_editor on public.drafts;
drop policy drafts_delete_editor on public.drafts;

revoke insert, update, delete on public.drafts from authenticated;
revoke insert, update, delete on public.draft_versions from authenticated;
revoke insert, update, delete on public.draft_provenance from authenticated;
revoke insert, update, delete on public.draft_generations from authenticated;

grant select on public.draft_versions to authenticated;
grant select on public.draft_provenance to authenticated;
grant select on public.draft_generations to authenticated;

create or replace function public.create_draft_from_message(
  target_workspace_id uuid,
  target_conversation_id uuid,
  target_message_id uuid,
  requested_kind text,
  requested_title text,
  requested_content text,
  requested_direction text
)
returns table (
  draft_id uuid,
  current_version integer,
  provenance_count integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  generated_draft_id uuid := gen_random_uuid();
  copied_provenance_count integer;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if requested_kind not in (
    'freeform',
    'summary',
    'comparison',
    'email',
    'memo',
    'checklist',
    'decision_note'
  ) then
    raise exception 'invalid draft kind';
  end if;

  if char_length(btrim(requested_title)) not between 1 and 200
    or char_length(requested_content) > 100000
    or requested_direction not in ('auto', 'rtl', 'ltr') then
    raise exception 'invalid draft content';
  end if;

  perform 1
  from public.messages message
  where message.workspace_id = target_workspace_id
    and message.conversation_id = target_conversation_id
    and message.id = target_message_id
    and message.role = 'assistant'
    and message.status = 'complete';

  if not found then
    raise exception 'completed assistant message is required';
  end if;

  insert into public.drafts (
    id,
    workspace_id,
    conversation_id,
    origin_message_id,
    created_by,
    title,
    content,
    direction,
    kind,
    status,
    current_version,
    version_count,
    provenance_count,
    last_saved_at
  )
  values (
    generated_draft_id,
    target_workspace_id,
    target_conversation_id,
    target_message_id,
    auth.uid(),
    btrim(requested_title),
    requested_content,
    requested_direction,
    requested_kind,
    'active',
    1,
    1,
    0,
    timezone('utc', now())
  );

  insert into public.draft_versions (
    workspace_id,
    draft_id,
    version_number,
    created_by,
    source_kind,
    title,
    content,
    direction,
    kind
  )
  values (
    target_workspace_id,
    generated_draft_id,
    1,
    auth.uid(),
    'initial',
    btrim(requested_title),
    requested_content,
    requested_direction,
    requested_kind
  );

  insert into public.draft_provenance (
    workspace_id,
    draft_id,
    conversation_id,
    origin_message_id,
    source_id,
    attachment_id,
    citation_order,
    label,
    file_name_snapshot,
    media_type_snapshot,
    source_ordinal_snapshot,
    page_number_snapshot,
    start_line_snapshot,
    end_line_snapshot
  )
  select
    target_workspace_id,
    generated_draft_id,
    target_conversation_id,
    target_message_id,
    citation.source_id,
    citation.attachment_id,
    citation.citation_order,
    citation.label,
    citation.file_name_snapshot,
    citation.media_type_snapshot,
    citation.source_ordinal_snapshot,
    citation.page_number_snapshot,
    citation.start_line_snapshot,
    citation.end_line_snapshot
  from public.message_citations citation
  where citation.workspace_id = target_workspace_id
    and citation.conversation_id = target_conversation_id
    and citation.message_id = target_message_id
  order by citation.citation_order;

  get diagnostics copied_provenance_count = row_count;

  update public.drafts draft
  set provenance_count = copied_provenance_count
  where draft.id = generated_draft_id;

  return query
  select generated_draft_id, 1, copied_provenance_count;
end;
$$;

create or replace function public.save_draft_version(
  target_workspace_id uuid,
  target_draft_id uuid,
  expected_version integer,
  requested_title text,
  requested_content text,
  requested_direction text,
  requested_kind text,
  requested_source_kind text default 'manual',
  requested_restored_from_version integer default null
)
returns table (
  version_number integer,
  created boolean
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  draft_record public.drafts%rowtype;
  next_version integer;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if requested_source_kind not in ('manual', 'restored') then
    raise exception 'invalid draft revision source';
  end if;

  if requested_source_kind = 'manual' and requested_restored_from_version is not null then
    raise exception 'manual save cannot reference a restored version';
  end if;

  if requested_source_kind = 'restored'
    and (requested_restored_from_version is null or requested_restored_from_version < 1) then
    raise exception 'restored save requires a source version';
  end if;

  if char_length(btrim(requested_title)) not between 1 and 200
    or char_length(requested_content) > 100000
    or requested_direction not in ('auto', 'rtl', 'ltr')
    or requested_kind not in (
      'freeform',
      'summary',
      'comparison',
      'email',
      'memo',
      'checklist',
      'decision_note'
    ) then
    raise exception 'invalid draft revision';
  end if;

  select draft.*
  into draft_record
  from public.drafts draft
  where draft.workspace_id = target_workspace_id
    and draft.id = target_draft_id
    and draft.status = 'active'
  for update;

  if not found then
    raise exception 'active draft was not found';
  end if;

  if draft_record.current_version <> expected_version then
    raise serialization_failure using message = 'draft version conflict';
  end if;

  if requested_source_kind = 'restored' and not exists (
    select 1
    from public.draft_versions version
    where version.workspace_id = target_workspace_id
      and version.draft_id = target_draft_id
      and version.version_number = requested_restored_from_version
  ) then
    raise exception 'restored draft version was not found';
  end if;

  if draft_record.title = btrim(requested_title)
    and draft_record.content = requested_content
    and draft_record.direction = requested_direction
    and draft_record.kind = requested_kind then
    return query select draft_record.current_version, false;
    return;
  end if;

  next_version := draft_record.current_version + 1;

  insert into public.draft_versions (
    workspace_id,
    draft_id,
    version_number,
    created_by,
    source_kind,
    title,
    content,
    direction,
    kind,
    restored_from_version
  )
  values (
    target_workspace_id,
    target_draft_id,
    next_version,
    auth.uid(),
    requested_source_kind,
    btrim(requested_title),
    requested_content,
    requested_direction,
    requested_kind,
    requested_restored_from_version
  );

  update public.drafts draft
  set
    title = btrim(requested_title),
    content = requested_content,
    direction = requested_direction,
    kind = requested_kind,
    current_version = next_version,
    version_count = next_version,
    last_saved_at = timezone('utc', now())
  where draft.workspace_id = target_workspace_id
    and draft.id = target_draft_id;

  return query select next_version, true;
end;
$$;

create or replace function public.set_draft_archived(
  target_workspace_id uuid,
  target_draft_id uuid,
  should_archive boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  update public.drafts draft
  set
    status = case when should_archive then 'archived' else 'active' end,
    archived_at = case
      when should_archive then timezone('utc', now())
      else null
    end
  where draft.workspace_id = target_workspace_id
    and draft.id = target_draft_id
    and draft.status <> case when should_archive then 'archived' else 'active' end;

  return found;
end;
$$;

create or replace function public.delete_draft_record(
  target_workspace_id uuid,
  target_draft_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  delete from public.drafts draft
  where draft.workspace_id = target_workspace_id
    and draft.id = target_draft_id;

  return found;
end;
$$;

create or replace function public.begin_draft_generation(
  target_workspace_id uuid,
  target_draft_id uuid,
  requested_action text,
  requested_instruction text,
  requested_provider text,
  requested_model text
)
returns table (
  generation_id uuid,
  base_version integer,
  base_title text,
  base_content text,
  base_direction text,
  draft_kind text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  draft_record public.drafts%rowtype;
  generated_id uuid := gen_random_uuid();
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if requested_action not in (
    'improve',
    'shorten',
    'expand',
    'translate_ar',
    'translate_en',
    'continue',
    'custom'
  )
    or char_length(btrim(requested_instruction)) not between 1 and 2000
    or char_length(btrim(requested_provider)) not between 1 and 64
    or char_length(btrim(requested_model)) not between 1 and 160 then
    raise exception 'invalid draft generation request';
  end if;

  select draft.*
  into draft_record
  from public.drafts draft
  where draft.workspace_id = target_workspace_id
    and draft.id = target_draft_id
    and draft.status = 'active'
  for update;

  if not found then
    raise exception 'active draft was not found';
  end if;

  insert into public.draft_generations (
    id,
    workspace_id,
    draft_id,
    created_by,
    base_version,
    action,
    instruction,
    provider,
    requested_model,
    status
  )
  values (
    generated_id,
    target_workspace_id,
    target_draft_id,
    auth.uid(),
    draft_record.current_version,
    requested_action,
    btrim(requested_instruction),
    btrim(requested_provider),
    btrim(requested_model),
    'pending'
  );

  return query
  select
    generated_id,
    draft_record.current_version,
    draft_record.title,
    draft_record.content,
    draft_record.direction,
    draft_record.kind;
end;
$$;

create or replace function public.checkpoint_draft_generation(
  target_workspace_id uuid,
  target_draft_id uuid,
  target_generation_id uuid,
  partial_content text,
  first_token_ms integer default null
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

  if char_length(partial_content) > 100000
    or (first_token_ms is not null and first_token_ms < 0) then
    raise exception 'invalid draft generation checkpoint';
  end if;

  update public.draft_generations generation
  set
    status = 'streaming',
    proposed_content = partial_content,
    first_token_latency_ms = coalesce(
      generation.first_token_latency_ms,
      first_token_ms
    )
  where generation.workspace_id = target_workspace_id
    and generation.draft_id = target_draft_id
    and generation.id = target_generation_id
    and generation.created_by = auth.uid()
    and generation.status in ('pending', 'streaming');

  if not found then
    raise exception 'active draft generation was not found';
  end if;
end;
$$;

create or replace function public.finish_draft_generation(
  target_workspace_id uuid,
  target_draft_id uuid,
  target_generation_id uuid,
  final_status text,
  final_content text,
  returned_provider_model text default null,
  provider_response_identifier text default null,
  provider_input_tokens integer default null,
  provider_output_tokens integer default null,
  provider_reasoning_tokens integer default null,
  provider_total_tokens integer default null,
  first_token_ms integer default null,
  total_latency_ms integer default null,
  provider_failure_code text default null,
  provider_failure_message text default null
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

  if final_status not in ('complete', 'failed', 'cancelled')
    or char_length(final_content) > 100000
    or (returned_provider_model is not null and char_length(returned_provider_model) > 160)
    or (provider_response_identifier is not null and char_length(provider_response_identifier) > 255)
    or (provider_failure_code is not null and char_length(provider_failure_code) > 120)
    or (provider_failure_message is not null and char_length(provider_failure_message) > 2000)
    or (provider_input_tokens is not null and provider_input_tokens < 0)
    or (provider_output_tokens is not null and provider_output_tokens < 0)
    or (provider_reasoning_tokens is not null and provider_reasoning_tokens < 0)
    or (provider_total_tokens is not null and provider_total_tokens < 0)
    or (first_token_ms is not null and first_token_ms < 0)
    or (total_latency_ms is not null and total_latency_ms < 0) then
    raise exception 'invalid draft generation finalization';
  end if;

  if final_status = 'complete' and char_length(btrim(final_content)) < 1 then
    raise exception 'completed draft proposal cannot be empty';
  end if;

  update public.draft_generations generation
  set
    status = final_status,
    proposed_content = final_content,
    returned_model = returned_provider_model,
    provider_response_id = provider_response_identifier,
    input_tokens = provider_input_tokens,
    output_tokens = provider_output_tokens,
    reasoning_tokens = provider_reasoning_tokens,
    total_tokens = provider_total_tokens,
    first_token_latency_ms = coalesce(
      generation.first_token_latency_ms,
      first_token_ms
    ),
    latency_ms = total_latency_ms,
    failure_code = provider_failure_code,
    failure_message = provider_failure_message,
    completed_at = timezone('utc', now())
  where generation.workspace_id = target_workspace_id
    and generation.draft_id = target_draft_id
    and generation.id = target_generation_id
    and generation.created_by = auth.uid()
    and generation.status in ('pending', 'streaming');

  if not found then
    raise exception 'active draft generation was not found';
  end if;
end;
$$;

create or replace function public.apply_draft_generation(
  target_workspace_id uuid,
  target_draft_id uuid,
  target_generation_id uuid
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  draft_record public.drafts%rowtype;
  generation_record public.draft_generations%rowtype;
  next_version integer;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  select generation.*
  into generation_record
  from public.draft_generations generation
  where generation.workspace_id = target_workspace_id
    and generation.draft_id = target_draft_id
    and generation.id = target_generation_id
    and generation.status = 'complete'
  for update;

  if not found then
    raise exception 'completed draft proposal was not found';
  end if;

  select draft.*
  into draft_record
  from public.drafts draft
  where draft.workspace_id = target_workspace_id
    and draft.id = target_draft_id
    and draft.status = 'active'
  for update;

  if not found then
    raise exception 'active draft was not found';
  end if;

  if draft_record.current_version <> generation_record.base_version then
    raise serialization_failure using message = 'draft changed after proposal started';
  end if;

  next_version := draft_record.current_version + 1;

  insert into public.draft_versions (
    workspace_id,
    draft_id,
    version_number,
    created_by,
    source_kind,
    title,
    content,
    direction,
    kind,
    generation_id
  )
  values (
    target_workspace_id,
    target_draft_id,
    next_version,
    auth.uid(),
    'ai',
    draft_record.title,
    generation_record.proposed_content,
    draft_record.direction,
    draft_record.kind,
    target_generation_id
  );

  update public.drafts draft
  set
    content = generation_record.proposed_content,
    current_version = next_version,
    version_count = next_version,
    last_saved_at = timezone('utc', now())
  where draft.workspace_id = target_workspace_id
    and draft.id = target_draft_id;

  update public.draft_generations generation
  set
    status = 'applied',
    applied_at = timezone('utc', now())
  where generation.id = target_generation_id;

  return next_version;
end;
$$;

create or replace function public.discard_draft_generation(
  target_workspace_id uuid,
  target_draft_id uuid,
  target_generation_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  update public.draft_generations generation
  set
    status = 'discarded',
    discarded_at = timezone('utc', now())
  where generation.workspace_id = target_workspace_id
    and generation.draft_id = target_draft_id
    and generation.id = target_generation_id
    and generation.status = 'complete';

  return found;
end;
$$;

revoke all on function public.create_draft_from_message(
  uuid, uuid, uuid, text, text, text, text
) from public;
revoke all on function public.save_draft_version(
  uuid, uuid, integer, text, text, text, text, text, integer
) from public;
revoke all on function public.set_draft_archived(uuid, uuid, boolean) from public;
revoke all on function public.delete_draft_record(uuid, uuid) from public;
revoke all on function public.begin_draft_generation(
  uuid, uuid, text, text, text, text
) from public;
revoke all on function public.checkpoint_draft_generation(
  uuid, uuid, uuid, text, integer
) from public;
revoke all on function public.finish_draft_generation(
  uuid, uuid, uuid, text, text, text, text, integer, integer, integer,
  integer, integer, integer, text, text
) from public;
revoke all on function public.apply_draft_generation(uuid, uuid, uuid) from public;
revoke all on function public.discard_draft_generation(uuid, uuid, uuid) from public;

grant execute on function public.create_draft_from_message(
  uuid, uuid, uuid, text, text, text, text
) to authenticated;
grant execute on function public.save_draft_version(
  uuid, uuid, integer, text, text, text, text, text, integer
) to authenticated;
grant execute on function public.set_draft_archived(uuid, uuid, boolean) to authenticated;
grant execute on function public.delete_draft_record(uuid, uuid) to authenticated;
grant execute on function public.begin_draft_generation(
  uuid, uuid, text, text, text, text
) to authenticated;
grant execute on function public.checkpoint_draft_generation(
  uuid, uuid, uuid, text, integer
) to authenticated;
grant execute on function public.finish_draft_generation(
  uuid, uuid, uuid, text, text, text, text, integer, integer, integer,
  integer, integer, integer, text, text
) to authenticated;
grant execute on function public.apply_draft_generation(uuid, uuid, uuid) to authenticated;
grant execute on function public.discard_draft_generation(uuid, uuid, uuid) to authenticated;

commit;
