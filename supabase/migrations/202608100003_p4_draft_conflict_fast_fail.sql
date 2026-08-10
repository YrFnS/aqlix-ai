begin;

-- Optimistic version conflicts are expected application outcomes, not
-- retryable PostgreSQL serialization failures. A dedicated SQLSTATE keeps
-- PostgREST from retrying the request until its upstream timeout while the
-- application still maps the conflict to HTTP 409.
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
    raise exception using
      errcode = 'P4091',
      message = 'draft version conflict';
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

commit;
