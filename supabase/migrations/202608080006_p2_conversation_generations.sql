begin;

alter table public.messages
  add constraint messages_workspace_conversation_id_unique
  unique (workspace_id, conversation_id, id);

create table public.message_generations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  conversation_id uuid not null,
  message_id uuid not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  provider text not null,
  requested_model text not null,
  returned_model text,
  provider_response_id text,
  status text not null default 'pending',
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint message_generations_message_unique unique (message_id),
  constraint message_generations_message_fk
    foreign key (workspace_id, conversation_id, message_id)
    references public.messages(workspace_id, conversation_id, id)
    on delete cascade,
  constraint message_generations_provider_length check (
    char_length(btrim(provider)) between 1 and 64
  ),
  constraint message_generations_requested_model_length check (
    char_length(btrim(requested_model)) between 1 and 160
  ),
  constraint message_generations_returned_model_length check (
    returned_model is null or char_length(btrim(returned_model)) between 1 and 160
  ),
  constraint message_generations_provider_response_id_length check (
    provider_response_id is null or char_length(provider_response_id) <= 255
  ),
  constraint message_generations_status check (
    status in ('pending', 'streaming', 'complete', 'failed', 'cancelled')
  ),
  constraint message_generations_input_tokens_nonnegative check (
    input_tokens is null or input_tokens >= 0
  ),
  constraint message_generations_output_tokens_nonnegative check (
    output_tokens is null or output_tokens >= 0
  ),
  constraint message_generations_reasoning_tokens_nonnegative check (
    reasoning_tokens is null or reasoning_tokens >= 0
  ),
  constraint message_generations_total_tokens_nonnegative check (
    total_tokens is null or total_tokens >= 0
  ),
  constraint message_generations_first_token_latency_nonnegative check (
    first_token_latency_ms is null or first_token_latency_ms >= 0
  ),
  constraint message_generations_latency_nonnegative check (
    latency_ms is null or latency_ms >= 0
  ),
  constraint message_generations_failure_code_length check (
    failure_code is null or char_length(failure_code) <= 120
  ),
  constraint message_generations_failure_message_length check (
    failure_message is null or char_length(failure_message) <= 2000
  ),
  constraint message_generations_completion_state check (
    (status in ('pending', 'streaming') and completed_at is null)
    or (status in ('complete', 'failed', 'cancelled') and completed_at is not null)
  )
);

create index message_generations_workspace_created_idx
  on public.message_generations(workspace_id, created_at desc);
create index message_generations_conversation_created_idx
  on public.message_generations(conversation_id, created_at desc);
create index message_generations_status_idx
  on public.message_generations(status, started_at)
  where status in ('pending', 'streaming');

create trigger message_generations_touch_updated_at
before update on public.message_generations
for each row execute function public.touch_updated_at();

alter table public.message_generations enable row level security;

create policy message_generations_select_member
on public.message_generations
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy message_generations_insert_editor
on public.message_generations
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.has_workspace_role(workspace_id, array['owner', 'editor'])
);

create policy message_generations_update_editor
on public.message_generations
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']))
with check (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy message_generations_delete_editor
on public.message_generations
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']));

grant select, insert, update, delete on public.message_generations to authenticated;

create or replace function public.begin_conversation_turn(
  target_workspace_id uuid,
  target_conversation_id uuid,
  message_content text,
  message_direction text,
  requested_provider text,
  requested_model text,
  retry_message_id uuid default null
)
returns table (
  user_message_id uuid,
  assistant_message_id uuid,
  generation_id uuid,
  user_sequence integer,
  assistant_sequence integer,
  prompt_content text
)
language plpgsql
set search_path = public, pg_temp
as $$
declare
  next_sequence integer;
  resolved_prompt text;
  resolved_user_message_id uuid;
  resolved_assistant_message_id uuid;
  resolved_generation_id uuid;
  resolved_user_sequence integer;
  resolved_assistant_sequence integer;
  retry_sequence integer;
begin
  if auth.uid() is null then
    raise insufficient_privilege using message = 'authenticated user required';
  end if;

  if not public.has_workspace_role(
    target_workspace_id,
    array['owner', 'editor']
  ) then
    raise insufficient_privilege using message = 'workspace write access required';
  end if;

  if message_direction not in ('auto', 'rtl', 'ltr') then
    raise exception 'invalid message direction';
  end if;

  if char_length(btrim(requested_provider)) not between 1 and 64 then
    raise exception 'invalid provider';
  end if;

  if char_length(btrim(requested_model)) not between 1 and 160 then
    raise exception 'invalid requested model';
  end if;

  perform 1
  from public.conversations conversation
  where conversation.id = target_conversation_id
    and conversation.workspace_id = target_workspace_id
    and conversation.status = 'active'
  for update;

  if not found then
    raise exception 'conversation not found, archived, or unavailable';
  end if;

  select coalesce(max(message.sequence) + 1, 0)
  into next_sequence
  from public.messages message
  where message.workspace_id = target_workspace_id
    and message.conversation_id = target_conversation_id;

  if retry_message_id is null then
    resolved_prompt := btrim(coalesce(message_content, ''));

    if char_length(resolved_prompt) not between 1 and 20000 then
      raise exception 'message content must contain 1 to 20000 characters';
    end if;

    resolved_user_sequence := next_sequence;

    insert into public.messages (
      workspace_id,
      conversation_id,
      created_by,
      role,
      status,
      content,
      direction,
      sequence
    )
    values (
      target_workspace_id,
      target_conversation_id,
      auth.uid(),
      'user',
      'complete',
      resolved_prompt,
      message_direction,
      resolved_user_sequence
    )
    returning id into resolved_user_message_id;

    resolved_assistant_sequence := next_sequence + 1;

    update public.conversations
    set
      title = case
        when title = 'محادثة جديدة' then
          left(regexp_replace(resolved_prompt, '[[:space:]]+', ' ', 'g'), 80)
        else title
      end,
      updated_at = timezone('utc', now())
    where id = target_conversation_id
      and workspace_id = target_workspace_id;
  else
    select message.sequence
    into retry_sequence
    from public.messages message
    where message.id = retry_message_id
      and message.workspace_id = target_workspace_id
      and message.conversation_id = target_conversation_id
      and message.role = 'assistant'
      and message.status in ('failed', 'cancelled');

    if not found then
      raise exception 'retry target must be a failed or cancelled assistant message';
    end if;

    select message.content
    into resolved_prompt
    from public.messages message
    where message.workspace_id = target_workspace_id
      and message.conversation_id = target_conversation_id
      and message.role = 'user'
      and message.sequence < retry_sequence
    order by message.sequence desc
    limit 1;

    if resolved_prompt is null then
      raise exception 'retry target has no preceding user message';
    end if;

    resolved_user_message_id := null;
    resolved_user_sequence := null;
    resolved_assistant_sequence := next_sequence;

    update public.conversations
    set updated_at = timezone('utc', now())
    where id = target_conversation_id
      and workspace_id = target_workspace_id;
  end if;

  insert into public.messages (
    workspace_id,
    conversation_id,
    created_by,
    role,
    status,
    content,
    direction,
    sequence
  )
  values (
    target_workspace_id,
    target_conversation_id,
    auth.uid(),
    'assistant',
    'pending',
    '',
    'auto',
    resolved_assistant_sequence
  )
  returning id into resolved_assistant_message_id;

  insert into public.message_generations (
    workspace_id,
    conversation_id,
    message_id,
    created_by,
    provider,
    requested_model,
    status
  )
  values (
    target_workspace_id,
    target_conversation_id,
    resolved_assistant_message_id,
    auth.uid(),
    btrim(requested_provider),
    btrim(requested_model),
    'pending'
  )
  returning id into resolved_generation_id;

  return query
  select
    resolved_user_message_id,
    resolved_assistant_message_id,
    resolved_generation_id,
    resolved_user_sequence,
    resolved_assistant_sequence,
    resolved_prompt;
end;
$$;

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

  update public.messages
  set
    content = coalesce(partial_content, ''),
    status = 'streaming'
  where id = target_message_id
    and workspace_id = target_workspace_id
    and conversation_id = target_conversation_id
    and role = 'assistant'
    and status in ('pending', 'streaming');

  if not found then
    raise exception 'assistant message is unavailable for checkpoint';
  end if;

  update public.message_generations
  set
    status = 'streaming',
    first_token_latency_ms = coalesce(
      first_token_latency_ms,
      greatest(first_token_ms, 0)
    )
  where id = target_generation_id
    and workspace_id = target_workspace_id
    and conversation_id = target_conversation_id
    and message_id = target_message_id
    and status in ('pending', 'streaming');

  if not found then
    raise exception 'generation is unavailable for checkpoint';
  end if;
end;
$$;

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

  update public.messages
  set
    content = coalesce(final_content, ''),
    status = final_status
  where id = target_message_id
    and workspace_id = target_workspace_id
    and conversation_id = target_conversation_id
    and role = 'assistant'
    and status in ('pending', 'streaming');

  if not found then
    raise exception 'assistant message is unavailable for finalization';
  end if;

  update public.message_generations
  set
    status = final_status,
    returned_model = nullif(btrim(returned_provider_model), ''),
    provider_response_id = nullif(provider_response_identifier, ''),
    input_tokens = provider_input_tokens,
    output_tokens = provider_output_tokens,
    reasoning_tokens = provider_reasoning_tokens,
    total_tokens = provider_total_tokens,
    first_token_latency_ms = coalesce(
      first_token_latency_ms,
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
  where id = target_generation_id
    and workspace_id = target_workspace_id
    and conversation_id = target_conversation_id
    and message_id = target_message_id
    and status in ('pending', 'streaming');

  if not found then
    raise exception 'generation is unavailable for finalization';
  end if;

  update public.conversations
  set updated_at = timezone('utc', now())
  where id = target_conversation_id
    and workspace_id = target_workspace_id;
end;
$$;

revoke all on function public.begin_conversation_turn(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  uuid
) from public;
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

grant execute on function public.begin_conversation_turn(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  uuid
) to authenticated;
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
