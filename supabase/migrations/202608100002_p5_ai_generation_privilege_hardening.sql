begin;

-- The legacy direct-settlement RPC is not part of the browser contract. The
-- terminal database triggers introduced later in the migration chain own
-- permit settlement. Revoke the default and role-specific execute paths
-- explicitly so an authenticated client cannot settle or rewrite its own
-- accounting record.
revoke all on function public.settle_ai_generation_permit(
  uuid,
  uuid,
  boolean,
  text,
  integer,
  integer,
  integer,
  integer,
  text
) from public, anon, authenticated;

-- Conversation checkpoints are allowed only for the account that created the
-- active assistant generation. Workspace editor membership alone must not let
-- one editor mutate another editor's in-flight response.
create or replace function public.checkpoint_conversation_generation(
  target_workspace_id uuid,
  target_conversation_id uuid,
  target_message_id uuid,
  target_generation_id uuid,
  partial_content text,
  first_token_ms integer default null
)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(
    target_workspace_id,
    array['owner', 'editor']
  ) then
    raise insufficient_privilege using message = 'workspace write access required';
  end if;

  update public.messages message
  set
    content = coalesce(partial_content, ''),
    status = 'streaming'
  where message.id = target_message_id
    and message.workspace_id = target_workspace_id
    and message.conversation_id = target_conversation_id
    and message.created_by = auth.uid()
    and message.role = 'assistant'
    and message.status in ('pending', 'streaming');

  if not found then
    raise insufficient_privilege using message =
      'assistant message is unavailable for this account';
  end if;

  update public.message_generations generation
  set
    status = 'streaming',
    first_token_latency_ms = coalesce(
      generation.first_token_latency_ms,
      greatest(first_token_ms, 0)
    )
  where generation.id = target_generation_id
    and generation.workspace_id = target_workspace_id
    and generation.conversation_id = target_conversation_id
    and generation.message_id = target_message_id
    and generation.created_by = auth.uid()
    and generation.status in ('pending', 'streaming');

  if not found then
    raise insufficient_privilege using message =
      'generation is unavailable for this account';
  end if;
end;
$$;

-- Apply the same creator boundary to terminal conversation updates. Provider
-- output and telemetry remain tied to the account that began the durable turn.
create or replace function public.finish_conversation_generation(
  target_workspace_id uuid,
  target_conversation_id uuid,
  target_message_id uuid,
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
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(
    target_workspace_id,
    array['owner', 'editor']
  ) then
    raise insufficient_privilege using message = 'workspace write access required';
  end if;

  if final_status not in ('complete', 'failed', 'cancelled') then
    raise exception 'invalid final generation status';
  end if;

  update public.messages message
  set
    content = coalesce(final_content, ''),
    status = final_status
  where message.id = target_message_id
    and message.workspace_id = target_workspace_id
    and message.conversation_id = target_conversation_id
    and message.created_by = auth.uid()
    and message.role = 'assistant'
    and message.status in ('pending', 'streaming');

  if not found then
    raise insufficient_privilege using message =
      'assistant message is unavailable for this account';
  end if;

  update public.message_generations generation
  set
    status = final_status,
    returned_model = nullif(btrim(returned_provider_model), ''),
    provider_response_id = nullif(provider_response_identifier, ''),
    input_tokens = provider_input_tokens,
    output_tokens = provider_output_tokens,
    reasoning_tokens = provider_reasoning_tokens,
    total_tokens = provider_total_tokens,
    first_token_latency_ms = coalesce(
      generation.first_token_latency_ms,
      greatest(first_token_ms, 0)
    ),
    latency_ms = greatest(total_latency_ms, 0),
    failure_code = case
      when final_status = 'complete' then null
      else left(provider_failure_code, 120)
    end,
    failure_message = case
      when final_status = 'complete' then null
      else left(provider_failure_message, 2000)
    end,
    completed_at = timezone('utc', now())
  where generation.id = target_generation_id
    and generation.workspace_id = target_workspace_id
    and generation.conversation_id = target_conversation_id
    and generation.message_id = target_message_id
    and generation.created_by = auth.uid()
    and generation.status in ('pending', 'streaming');

  if not found then
    raise insufficient_privilege using message =
      'generation is unavailable for this account';
  end if;

  update public.conversations conversation
  set updated_at = timezone('utc', now())
  where conversation.id = target_conversation_id
    and conversation.workspace_id = target_workspace_id;
end;
$$;

revoke all on function public.checkpoint_conversation_generation(
  uuid,
  uuid,
  uuid,
  uuid,
  text,
  integer
) from public;
revoke all on function public.finish_conversation_generation(
  uuid,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  text,
  text
) from public;

grant execute on function public.checkpoint_conversation_generation(
  uuid,
  uuid,
  uuid,
  uuid,
  text,
  integer
) to authenticated;
grant execute on function public.finish_conversation_generation(
  uuid,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  integer,
  integer,
  integer,
  integer,
  integer,
  integer,
  text,
  text
) to authenticated;

commit;
