begin;

create or replace function public.fail_expired_ai_generation_target()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected_conversation_id uuid;
  affected_message_id uuid;
begin
  if old.status <> 'reserved' or new.status <> 'expired' then
    return new;
  end if;

  if new.operation = 'conversation' then
    update public.message_generations generation
    set
      status = 'failed',
      failure_code = 'PROVIDER_TIMEOUT',
      failure_message =
        'The generation lease expired before durable completion.',
      completed_at = coalesce(
        generation.completed_at,
        timezone('utc', now())
      )
    where generation.workspace_id = new.workspace_id
      and generation.id = new.target_generation_id
      and generation.status in ('pending', 'streaming')
    returning generation.conversation_id, generation.message_id
    into affected_conversation_id, affected_message_id;

    if affected_message_id is not null then
      update public.messages message
      set status = 'failed'
      where message.workspace_id = new.workspace_id
        and message.conversation_id = affected_conversation_id
        and message.id = affected_message_id
        and message.status in ('pending', 'streaming');

      update public.conversations conversation
      set updated_at = timezone('utc', now())
      where conversation.workspace_id = new.workspace_id
        and conversation.id = affected_conversation_id;
    end if;
  elsif new.operation = 'draft' then
    update public.draft_generations generation
    set
      status = 'failed',
      failure_code = 'PROVIDER_TIMEOUT',
      failure_message =
        'The draft-generation lease expired before durable completion.',
      completed_at = coalesce(
        generation.completed_at,
        timezone('utc', now())
      )
    where generation.workspace_id = new.workspace_id
      and generation.id = new.target_generation_id
      and generation.status in ('pending', 'streaming');
  end if;

  return new;
end;
$$;

create trigger ai_generation_permits_fail_expired_target
after update of status on public.ai_generation_permits
for each row execute function public.fail_expired_ai_generation_target();

revoke all on function public.fail_expired_ai_generation_target() from public;

commit;
