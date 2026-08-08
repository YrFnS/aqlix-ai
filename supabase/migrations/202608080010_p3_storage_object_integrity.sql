begin;

create or replace function public.attachment_id_from_storage_path(object_name text)
returns uuid
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  second_segment text;
begin
  second_segment := split_part(object_name, '/', 2);

  if second_segment !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return null;
  end if;

  return second_segment::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

create or replace function public.can_read_workspace_document_object(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.attachments attachment
      where attachment.workspace_id = public.workspace_id_from_storage_path(object_name)
        and attachment.id = public.attachment_id_from_storage_path(object_name)
        and attachment.storage_path = object_name
        and attachment.status = 'ready'
        and attachment.deleted_at is null
        and public.is_workspace_member(attachment.workspace_id)
    );
$$;

create or replace function public.can_insert_workspace_document_object(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.attachments attachment
      where attachment.workspace_id = public.workspace_id_from_storage_path(object_name)
        and attachment.id = public.attachment_id_from_storage_path(object_name)
        and attachment.storage_path = object_name
        and attachment.status = 'processing'
        and attachment.deleted_at is null
        and attachment.uploaded_by = auth.uid()
        and public.has_workspace_role(
          attachment.workspace_id,
          array['owner', 'editor']
        )
        and public.is_workspace_active(attachment.workspace_id)
    );
$$;

create or replace function public.can_delete_workspace_document_object(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.attachments attachment
      where attachment.workspace_id = public.workspace_id_from_storage_path(object_name)
        and attachment.id = public.attachment_id_from_storage_path(object_name)
        and attachment.storage_path = object_name
        and attachment.status in ('pending', 'processing', 'ready', 'failed')
        and attachment.deleted_at is null
        and public.has_workspace_role(
          attachment.workspace_id,
          array['owner', 'editor']
        )
        and public.is_workspace_active(attachment.workspace_id)
    );
$$;

revoke all on function public.attachment_id_from_storage_path(text) from public;
revoke all on function public.can_read_workspace_document_object(text) from public;
revoke all on function public.can_insert_workspace_document_object(text) from public;
revoke all on function public.can_delete_workspace_document_object(text) from public;
grant execute on function public.attachment_id_from_storage_path(text) to authenticated;
grant execute on function public.can_read_workspace_document_object(text) to authenticated;
grant execute on function public.can_insert_workspace_document_object(text) to authenticated;
grant execute on function public.can_delete_workspace_document_object(text) to authenticated;

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
  parsed_query := websearch_to_tsquery(
    'simple'::regconfig,
    public.normalize_mixed_script_search_text(btrim(source_query))
  );

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

revoke all on function public.search_workspace_sources(uuid, text, integer) from public;
grant execute on function public.search_workspace_sources(uuid, text, integer) to authenticated;

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
        and public.can_read_workspace_document_object(name)
      )
    $policy$;

    execute $policy$
      create policy workspace_documents_insert_editor
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'workspace-documents'
        and public.can_insert_workspace_document_object(name)
      )
    $policy$;

    execute $policy$
      create policy workspace_documents_delete_editor
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'workspace-documents'
        and public.can_delete_workspace_document_object(name)
      )
    $policy$;
  end if;
end;
$$;

commit;
