begin;

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

  if should_archive and exists (
    select 1
    from public.draft_generations generation
    where generation.workspace_id = target_workspace_id
      and generation.draft_id = target_draft_id
      and generation.status in ('pending', 'streaming')
  ) then
    raise check_violation using message = 'active draft proposal must finish or stop before archive';
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

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if not exists (
    select 1
    from public.drafts draft
    where draft.workspace_id = target_workspace_id
      and draft.id = target_draft_id
      and draft.status = 'active'
  ) then
    raise insufficient_privilege using message = 'archived drafts are read-only';
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

  if final_status = 'complete' and not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces cannot complete draft proposals';
  end if;

  if final_status = 'complete' and not exists (
    select 1
    from public.drafts draft
    where draft.workspace_id = target_workspace_id
      and draft.id = target_draft_id
      and draft.status = 'active'
  ) then
    raise insufficient_privilege using message = 'archived drafts cannot complete proposals';
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

  if final_status = 'complete'
    and (provider_failure_code is not null or provider_failure_message is not null) then
    raise exception 'completed draft proposal cannot contain failure details';
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

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if not exists (
    select 1
    from public.drafts draft
    where draft.workspace_id = target_workspace_id
      and draft.id = target_draft_id
      and draft.status = 'active'
  ) then
    raise insufficient_privilege using message = 'archived drafts are read-only';
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

revoke all on function public.set_draft_archived(uuid, uuid, boolean) from public;
revoke all on function public.checkpoint_draft_generation(
  uuid, uuid, uuid, text, integer
) from public;
revoke all on function public.finish_draft_generation(
  uuid, uuid, uuid, text, text, text, text, integer, integer, integer,
  integer, integer, integer, text, text
) from public;
revoke all on function public.discard_draft_generation(uuid, uuid, uuid) from public;

grant execute on function public.set_draft_archived(uuid, uuid, boolean) to authenticated;
grant execute on function public.checkpoint_draft_generation(
  uuid, uuid, uuid, text, integer
) to authenticated;
grant execute on function public.finish_draft_generation(
  uuid, uuid, uuid, text, text, text, text, integer, integer, integer,
  integer, integer, integer, text, text
) to authenticated;
grant execute on function public.discard_draft_generation(uuid, uuid, uuid) to authenticated;

commit;
