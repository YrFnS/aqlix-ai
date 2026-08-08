begin;

-- The first P5 migration included explicit wrapper functions while the final
-- integration shape was still being selected. Terminal triggers provide the
-- stronger boundary: usage settlement commits or rolls back with the accepted
-- conversation/draft generation state, without duplicating logic in SSE routes.
drop function if exists public.finish_permitted_conversation_generation(
  uuid, uuid, uuid, uuid, uuid, boolean, text, text, text, text,
  integer, integer, integer, integer, integer, integer, text, text
);
drop function if exists public.finish_permitted_grounded_conversation_generation(
  uuid, uuid, uuid, uuid, uuid, boolean, text, text, text, integer,
  integer, integer, integer, integer, integer, jsonb
);
drop function if exists public.finish_permitted_draft_generation(
  uuid, uuid, uuid, uuid, boolean, text, text, text, text, integer,
  integer, integer, integer, integer, integer, text, text
);

create or replace function public.settle_ai_generation_permit_from_terminal(
  target_workspace_id uuid,
  requested_operation text,
  requested_generation_id uuid,
  final_generation_status text,
  provider_input_tokens integer,
  provider_output_tokens integer,
  provider_reasoning_tokens integer,
  provider_total_tokens integer,
  provider_failure_code text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  permit public.ai_generation_permits%rowtype;
  resolved_input integer;
  resolved_output integer;
  resolved_reasoning integer;
  resolved_total integer;
begin
  if requested_operation not in ('conversation', 'draft')
    or final_generation_status not in ('complete', 'failed', 'cancelled') then
    raise exception 'invalid terminal AI permit settlement';
  end if;

  select current_permit.*
  into permit
  from public.ai_generation_permits current_permit
  where current_permit.workspace_id = target_workspace_id
    and current_permit.operation = requested_operation
    and current_permit.target_generation_id = requested_generation_id
    and current_permit.status = 'reserved'
  for update;

  -- A generation may fail before provider reservation (for example, no
  -- relevant sources or invalid provider configuration). That terminal state
  -- legitimately has no permit to settle.
  if not found then
    return;
  end if;

  -- Once a permit exists, the controlled provider has begun its delegated
  -- stream. Missing provider usage is charged conservatively at the reserved
  -- amount so process/provider failures cannot bypass daily budgets.
  resolved_input := coalesce(
    provider_input_tokens,
    permit.reserved_input_tokens
  );
  resolved_output := coalesce(
    provider_output_tokens,
    permit.reserved_output_tokens
  );
  resolved_reasoning := coalesce(provider_reasoning_tokens, 0);
  resolved_total := coalesce(
    provider_total_tokens,
    resolved_input + resolved_output
  );

  update public.ai_generation_permits current_permit
  set
    status = 'settled',
    provider_started = true,
    terminal_status = final_generation_status,
    actual_input_tokens = resolved_input,
    actual_output_tokens = resolved_output,
    actual_reasoning_tokens = resolved_reasoning,
    actual_total_tokens = resolved_total,
    failure_code = case
      when final_generation_status = 'complete' then null
      else left(provider_failure_code, 120)
    end,
    settled_at = timezone('utc', now())
  where current_permit.id = permit.id;
end;
$$;

create or replace function public.settle_message_generation_permit_on_terminal()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.status in ('pending', 'streaming')
    and new.status in ('complete', 'failed', 'cancelled') then
    perform public.settle_ai_generation_permit_from_terminal(
      new.workspace_id,
      'conversation',
      new.id,
      new.status,
      new.input_tokens,
      new.output_tokens,
      new.reasoning_tokens,
      new.total_tokens,
      new.failure_code
    );
  end if;

  return new;
end;
$$;

create trigger message_generations_settle_ai_permit
after update of status on public.message_generations
for each row execute function public.settle_message_generation_permit_on_terminal();

create or replace function public.settle_draft_generation_permit_on_terminal()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.status in ('pending', 'streaming')
    and new.status in ('complete', 'failed', 'cancelled') then
    perform public.settle_ai_generation_permit_from_terminal(
      new.workspace_id,
      'draft',
      new.id,
      new.status,
      new.input_tokens,
      new.output_tokens,
      new.reasoning_tokens,
      new.total_tokens,
      new.failure_code
    );
  end if;

  return new;
end;
$$;

create trigger draft_generations_settle_ai_permit
after update of status on public.draft_generations
for each row execute function public.settle_draft_generation_permit_on_terminal();

revoke all on function public.settle_ai_generation_permit_from_terminal(
  uuid, text, uuid, text, integer, integer, integer, integer, text
) from public;
revoke all on function public.settle_message_generation_permit_on_terminal()
  from public;
revoke all on function public.settle_draft_generation_permit_on_terminal()
  from public;

commit;
