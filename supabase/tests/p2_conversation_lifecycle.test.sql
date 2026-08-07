\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('61111111-1111-4111-8111-111111111111', 'p2-owner@example.test'),
  ('62222222-2222-4222-8222-222222222222', 'p2-editor@example.test'),
  ('63333333-3333-4333-8333-333333333333', 'p2-viewer@example.test'),
  ('64444444-4444-4444-8444-444444444444', 'p2-outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '61111111-1111-4111-8111-111111111111',
  false
);

insert into public.workspaces (
  id,
  owner_id,
  name,
  description,
  default_language
)
values (
  '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '61111111-1111-4111-8111-111111111111',
  'مساحة P2',
  'Conversation lifecycle fixture',
  'auto'
);

insert into public.workspace_members (workspace_id, user_id, role)
values
  (
    '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '62222222-2222-4222-8222-222222222222',
    'editor'
  ),
  (
    '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '63333333-3333-4333-8333-333333333333',
    'viewer'
  );

select set_config(
  'request.jwt.claim.sub',
  '62222222-2222-4222-8222-222222222222',
  false
);

insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title
)
values (
  '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '62222222-2222-4222-8222-222222222222',
  'محادثة جديدة'
);

do $$
declare
  turn record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'مرحبا English 2026 https://example.test',
    'auto',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  if turn.user_sequence <> 0 or turn.assistant_sequence <> 1 then
    raise exception 'first turn sequence allocation is incorrect';
  end if;

  perform set_config('p2.user_message_id', turn.user_message_id::text, false);
  perform set_config('p2.assistant_message_id', turn.assistant_message_id::text, false);
  perform set_config('p2.generation_id', turn.generation_id::text, false);
end;
$$;

select public.checkpoint_conversation_generation(
  '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('p2.assistant_message_id')::uuid,
  current_setting('p2.generation_id')::uuid,
  'إجابة جزئية / partial response',
  120
);

select public.finish_conversation_generation(
  '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('p2.assistant_message_id')::uuid,
  current_setting('p2.generation_id')::uuid,
  'complete',
  'إجابة كاملة / complete response',
  'fixture-bilingual-v1',
  'fixture_response_1',
  12,
  18,
  0,
  30,
  120,
  540,
  null,
  null
);

do $$
begin
  if (
    select count(*)
    from public.messages
    where workspace_id = '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
      and conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) <> 2 then
    raise exception 'first turn did not create exactly two messages';
  end if;

  if not exists (
    select 1
    from public.messages
    where id = current_setting('p2.user_message_id')::uuid
      and role = 'user'
      and status = 'complete'
      and direction = 'auto'
      and sequence = 0
  ) then
    raise exception 'durable user message is invalid';
  end if;

  if not exists (
    select 1
    from public.messages
    where id = current_setting('p2.assistant_message_id')::uuid
      and role = 'assistant'
      and status = 'complete'
      and content = 'إجابة كاملة / complete response'
      and sequence = 1
  ) then
    raise exception 'assistant completion was not persisted';
  end if;

  if not exists (
    select 1
    from public.message_generations
    where id = current_setting('p2.generation_id')::uuid
      and status = 'complete'
      and provider = 'fixture'
      and requested_model = 'fixture-bilingual-v1'
      and returned_model = 'fixture-bilingual-v1'
      and provider_response_id = 'fixture_response_1'
      and input_tokens = 12
      and output_tokens = 18
      and reasoning_tokens = 0
      and total_tokens = 30
      and first_token_latency_ms = 120
      and latency_ms = 540
      and completed_at is not null
  ) then
    raise exception 'generation telemetry was not persisted';
  end if;

  if (
    select title
    from public.conversations
    where id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) = 'محادثة جديدة' then
    raise exception 'default conversation title was not derived from the first prompt';
  end if;
end;
$$;

-- Preserve a cancelled attempt and create a retry without duplicating its user prompt.
do $$
declare
  turn record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '[fixture:slow] أوقف هذه الاستجابة',
    'rtl',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  if turn.user_sequence <> 2 or turn.assistant_sequence <> 3 then
    raise exception 'second turn sequence allocation is incorrect';
  end if;

  perform set_config('p2.cancelled_message_id', turn.assistant_message_id::text, false);
  perform set_config('p2.cancelled_generation_id', turn.generation_id::text, false);
end;
$$;

select public.checkpoint_conversation_generation(
  '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('p2.cancelled_message_id')::uuid,
  current_setting('p2.cancelled_generation_id')::uuid,
  'نص جزئي محفوظ',
  80
);

select public.finish_conversation_generation(
  '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('p2.cancelled_message_id')::uuid,
  current_setting('p2.cancelled_generation_id')::uuid,
  'cancelled',
  'نص جزئي محفوظ',
  null,
  null,
  null,
  null,
  null,
  null,
  80,
  210,
  'STREAM_CANCELLED',
  'Generation was cancelled by the user.'
);

do $$
declare
  retry_turn record;
begin
  select *
  into retry_turn
  from public.begin_conversation_turn(
    '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    null,
    'auto',
    'fixture',
    'fixture-bilingual-v1',
    current_setting('p2.cancelled_message_id')::uuid
  );

  if retry_turn.user_message_id is not null
    or retry_turn.user_sequence is not null
    or retry_turn.assistant_sequence <> 4 then
    raise exception 'retry should create only a new assistant attempt';
  end if;

  if retry_turn.prompt_content <> '[fixture:slow] أوقف هذه الاستجابة' then
    raise exception 'retry did not resolve the preceding user prompt';
  end if;

  perform set_config('p2.retry_message_id', retry_turn.assistant_message_id::text, false);
  perform set_config('p2.retry_generation_id', retry_turn.generation_id::text, false);
end;
$$;

select public.finish_conversation_generation(
  '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('p2.retry_message_id')::uuid,
  current_setting('p2.retry_generation_id')::uuid,
  'complete',
  'نجحت إعادة المحاولة',
  'fixture-bilingual-v1',
  'fixture_response_retry',
  10,
  12,
  0,
  22,
  60,
  300,
  null,
  null
);

do $$
begin
  if (
    select count(*)
    from public.messages
    where conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) <> 5 then
    raise exception 'retry changed the expected message count';
  end if;

  if not exists (
    select 1
    from public.messages message
    join public.message_generations generation
      on generation.message_id = message.id
    where message.id = current_setting('p2.cancelled_message_id')::uuid
      and message.status = 'cancelled'
      and message.content = 'نص جزئي محفوظ'
      and generation.status = 'cancelled'
      and generation.failure_code = 'STREAM_CANCELLED'
  ) then
    raise exception 'cancelled attempt was overwritten or lost';
  end if;

  if not exists (
    select 1
    from public.messages
    where id = current_setting('p2.retry_message_id')::uuid
      and status = 'complete'
      and sequence = 4
  ) then
    raise exception 'retry assistant attempt was not completed';
  end if;
end;
$$;

-- Viewer can inspect the durable history but cannot start a turn or write telemetry.
select set_config(
  'request.jwt.claim.sub',
  '63333333-3333-4333-8333-333333333333',
  false
);

do $$
begin
  if (
    select count(*)
    from public.messages
    where conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) <> 5 then
    raise exception 'viewer cannot read the conversation history';
  end if;

  begin
    perform public.begin_conversation_turn(
      '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'viewer write attempt',
      'ltr',
      'fixture',
      'fixture-bilingual-v1',
      null
    );
    raise exception 'viewer generation unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    insert into public.message_generations (
      workspace_id,
      conversation_id,
      message_id,
      created_by,
      provider,
      requested_model
    )
    values (
      '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      current_setting('p2.retry_message_id')::uuid,
      '63333333-3333-4333-8333-333333333333',
      'fixture',
      'fixture-bilingual-v1'
    );
    raise exception 'viewer generation telemetry insert unexpectedly succeeded';
  exception
    when unique_violation then
      raise exception 'viewer reached uniqueness before authorization';
    when insufficient_privilege then null;
  end;
end;
$$;

-- Outsider sees no conversation, messages, or generation metadata.
select set_config(
  'request.jwt.claim.sub',
  '64444444-4444-4444-8444-444444444444',
  false
);

do $$
begin
  if exists (
    select 1
    from public.conversations
    where id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) then
    raise exception 'outsider can read the conversation';
  end if;

  if exists (
    select 1
    from public.messages
    where conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) then
    raise exception 'outsider can read messages';
  end if;

  if exists (
    select 1
    from public.message_generations
    where conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) then
    raise exception 'outsider can read generation telemetry';
  end if;
end;
$$;

-- Archived conversations reject new turns.
select set_config(
  'request.jwt.claim.sub',
  '62222222-2222-4222-8222-222222222222',
  false
);

update public.conversations
set status = 'archived'
where id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

do $$
begin
  begin
    perform public.begin_conversation_turn(
      '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'archived conversation attempt',
      'ltr',
      'fixture',
      'fixture-bilingual-v1',
      null
    );
    raise exception 'archived conversation generation unexpectedly succeeded';
  exception
    when raise_exception then
      if sqlerrm = 'archived conversation generation unexpectedly succeeded' then
        raise;
      end if;
  end;
end;
$$;

update public.conversations
set status = 'active'
where id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

-- Archived workspaces reject new conversation and message inserts at the DB boundary.
select set_config(
  'request.jwt.claim.sub',
  '61111111-1111-4111-8111-111111111111',
  false
);

update public.workspaces
set archived_at = timezone('utc', now())
where id = '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

select set_config(
  'request.jwt.claim.sub',
  '62222222-2222-4222-8222-222222222222',
  false
);

do $$
begin
  begin
    insert into public.conversations (
      workspace_id,
      created_by,
      title
    )
    values (
      '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '62222222-2222-4222-8222-222222222222',
      'should not exist'
    );
    raise exception 'conversation insert in archived workspace unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.begin_conversation_turn(
      '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'archived workspace attempt',
      'ltr',
      'fixture',
      'fixture-bilingual-v1',
      null
    );
    raise exception 'generation in archived workspace unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  if (
    select count(*)
    from public.messages
    where conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) <> 5 then
    raise exception 'archived workspace attempt left partial messages';
  end if;
end;
$$;

-- Restore, delete the conversation, and verify message/generation cascades.
select set_config(
  'request.jwt.claim.sub',
  '61111111-1111-4111-8111-111111111111',
  false
);

update public.workspaces
set archived_at = null
where id = '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

select set_config(
  'request.jwt.claim.sub',
  '62222222-2222-4222-8222-222222222222',
  false
);

delete from public.conversations
where id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

do $$
begin
  if exists (
    select 1
    from public.messages
    where conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) then
    raise exception 'conversation message rows did not cascade';
  end if;

  if exists (
    select 1
    from public.message_generations
    where conversation_id = '6bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ) then
    raise exception 'conversation generation rows did not cascade';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '61111111-1111-4111-8111-111111111111',
  false
);

delete from public.workspaces
where id = '6aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

reset role;
