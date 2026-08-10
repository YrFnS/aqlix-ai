\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('a1111111-1111-4111-8111-111111111111', 'p5-controls-owner@example.test'),
  ('a2222222-2222-4222-8222-222222222222', 'p5-controls-editor@example.test'),
  ('a3333333-3333-4333-8333-333333333333', 'p5-controls-viewer@example.test'),
  ('a4444444-4444-4444-8444-444444444444', 'p5-controls-outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  'a1111111-1111-4111-8111-111111111111',
  false
);

insert into public.workspaces (
  id,
  owner_id,
  name,
  description,
  default_language
)
values
  (
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1111111-1111-4111-8111-111111111111',
    'P5 concurrency controls',
    'Request, concurrency, disabled, and archive fixtures',
    'auto'
  ),
  (
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1111111-1111-4111-8111-111111111111',
    'P5 token budgets',
    'Input and output budget fixtures',
    'auto'
  ),
  (
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1111111-1111-4111-8111-111111111111',
    'P5 draft controls',
    'Draft permit and expiry fixtures',
    'auto'
  ),
  (
    'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1111111-1111-4111-8111-111111111111',
    'P5 lease recovery',
    'Expired conversation permit fixture',
    'auto'
  );

insert into public.workspace_members (workspace_id, user_id, role)
select workspace_id, user_id, role
from (
  values
    ('a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a2222222-2222-4222-8222-222222222222'::uuid, 'editor'::text),
    ('a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a3333333-3333-4333-8333-333333333333'::uuid, 'viewer'::text),
    ('a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a2222222-2222-4222-8222-222222222222'::uuid, 'editor'::text),
    ('a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a3333333-3333-4333-8333-333333333333'::uuid, 'viewer'::text),
    ('a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a2222222-2222-4222-8222-222222222222'::uuid, 'editor'::text),
    ('a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a3333333-3333-4333-8333-333333333333'::uuid, 'viewer'::text),
    ('a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a2222222-2222-4222-8222-222222222222'::uuid, 'editor'::text),
    ('a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'a3333333-3333-4333-8333-333333333333'::uuid, 'viewer'::text)
) as membership(workspace_id, user_id, role);

-- Every workspace receives conservative defaults through the workspace trigger.
do $$
begin
  if (
    select count(*)
    from public.workspace_ai_limits limits
    where limits.workspace_id in (
      'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    )
      and limits.enabled
      and limits.daily_request_limit = 100
      and limits.daily_input_token_limit = 500000
      and limits.daily_output_token_limit = 100000
      and limits.max_concurrent_generations = 2
  ) <> 4 then
    raise exception 'workspace AI defaults were not initialized';
  end if;

  begin
    update public.workspace_ai_limits
    set daily_request_limit = 999
    where workspace_id = 'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    raise exception 'direct AI limit update unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select public.set_workspace_ai_limits(
  'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  true,
  2,
  10000,
  10000,
  1
);

select public.set_workspace_ai_limits(
  'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  true,
  100,
  1000,
  1000,
  2
);

select public.set_workspace_ai_limits(
  'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  true,
  100,
  10000,
  10000,
  2
);

select public.set_workspace_ai_limits(
  'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  true,
  100,
  10000,
  10000,
  1
);

-- Editors can generate but cannot rewrite owner-managed limits.
select set_config(
  'request.jwt.claim.sub',
  'a2222222-2222-4222-8222-222222222222',
  false
);

do $$
begin
  begin
    perform public.set_workspace_ai_limits(
      'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      true,
      10,
      10000,
      10000,
      2
    );
    raise exception 'editor changed owner-managed AI limits';
  exception
    when insufficient_privilege then null;
  end;

  begin
    insert into public.ai_generation_permits (
      workspace_id,
      created_by,
      operation,
      target_generation_id,
      reserved_input_tokens,
      reserved_output_tokens,
      expires_at
    )
    values (
      'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'a2222222-2222-4222-8222-222222222222',
      'conversation',
      gen_random_uuid(),
      10,
      10,
      timezone('utc', now()) + interval '10 minutes'
    );
    raise exception 'direct permit insert unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title
)
values (
  'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a2222222-2222-4222-8222-222222222222',
  'P5 concurrency conversation'
);

-- Reserve the first conversation permit and prove reservation idempotency.
do $$
declare
  turn record;
  reservation record;
  repeated record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'first controlled generation',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    200
  );

  select *
  into repeated
  from public.reserve_ai_generation_permit(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    200
  );

  if not reservation.allowed
    or reservation.permit_id is null
    or repeated.permit_id <> reservation.permit_id then
    raise exception 'conversation permit reservation is not idempotent';
  end if;

  perform set_config('p5c.message1', turn.assistant_message_id::text, false);
  perform set_config('p5c.generation1', turn.generation_id::text, false);
  perform set_config('p5c.permit1', reservation.permit_id::text, false);
end;
$$;

-- A second active generation is denied by the one-generation concurrency lease.
do $$
declare
  turn record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'second controlled generation',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    100
  );

  if reservation.allowed
    or reservation.permit_id is not null
    or reservation.denial_code <> 'PROVIDER_CONCURRENCY_LIMIT' then
    raise exception 'concurrent generation was not denied';
  end if;

  perform set_config('p5c.message2', turn.assistant_message_id::text, false);
  perform set_config('p5c.generation2', turn.generation_id::text, false);
end;
$$;

-- Viewers may inspect usage but never reserve provider capacity.
select set_config(
  'request.jwt.claim.sub',
  'a3333333-3333-4333-8333-333333333333',
  false
);

do $$
declare
  limits record;
begin
  select *
  into limits
  from public.get_workspace_ai_limits(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  );

  if limits.requests_used <> 1
    or limits.active_generations <> 1
    or limits.input_tokens_used <> 100
    or limits.output_tokens_used <> 200 then
    raise exception 'viewer received invalid live AI usage';
  end if;

  begin
    perform public.reserve_ai_generation_permit(
      'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'conversation',
      current_setting('p5c.generation2')::uuid,
      100,
      100
    );
    raise exception 'viewer reserved provider capacity';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Terminal generation updates settle permits atomically through database triggers.
select set_config(
  'request.jwt.claim.sub',
  'a2222222-2222-4222-8222-222222222222',
  false
);

select public.finish_conversation_generation(
  'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('p5c.message1')::uuid,
  current_setting('p5c.generation1')::uuid,
  'complete',
  'first controlled response',
  'fixture-bilingual-v1',
  'p5_control_response_1',
  40,
  60,
  0,
  100,
  10,
  100,
  null,
  null
);

do $$
declare
  reservation record;
begin
  if not exists (
    select 1
    from public.ai_generation_permits permit
    where permit.id = current_setting('p5c.permit1')::uuid
      and permit.status = 'settled'
      and permit.provider_started
      and permit.terminal_status = 'complete'
      and permit.actual_input_tokens = 40
      and permit.actual_output_tokens = 60
      and permit.actual_total_tokens = 100
      and permit.failure_code is null
  ) then
    raise exception 'completed conversation permit was not settled';
  end if;

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    current_setting('p5c.generation2')::uuid,
    100,
    100
  );

  if not reservation.allowed or reservation.permit_id is null then
    raise exception 'settled permit did not release concurrency';
  end if;

  perform set_config('p5c.permit2', reservation.permit_id::text, false);
end;
$$;

select public.finish_conversation_generation(
  'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('p5c.message2')::uuid,
  current_setting('p5c.generation2')::uuid,
  'cancelled',
  'partial controlled response',
  null,
  null,
  null,
  null,
  null,
  null,
  20,
  90,
  'STREAM_CANCELLED',
  'Generation was cancelled by the user.'
);

do $$
declare
  turn record;
  reservation record;
  limits record;
begin
  if not exists (
    select 1
    from public.ai_generation_permits permit
    where permit.id = current_setting('p5c.permit2')::uuid
      and permit.status = 'settled'
      and permit.terminal_status = 'cancelled'
      and permit.actual_input_tokens = 100
      and permit.actual_output_tokens = 100
      and permit.actual_total_tokens = 200
      and permit.failure_code = 'STREAM_CANCELLED'
  ) then
    raise exception 'cancelled permit was not conservatively settled';
  end if;

  select *
  into turn
  from public.begin_conversation_turn(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'third controlled generation',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    100
  );

  if reservation.allowed
    or reservation.denial_code <> 'PROVIDER_BUDGET_EXCEEDED' then
    raise exception 'daily request limit was not enforced';
  end if;

  perform public.finish_conversation_generation(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'failed',
    '',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    5,
    'PROVIDER_BUDGET_EXCEEDED',
    'The workspace reached its daily request limit.'
  );

  select *
  into limits
  from public.get_workspace_ai_limits(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  );

  if limits.requests_used <> 2
    or limits.input_tokens_used <> 140
    or limits.output_tokens_used <> 160
    or limits.active_generations <> 0 then
    raise exception 'settled workspace usage is invalid';
  end if;
end;
$$;

-- Disabled workspaces fail before a provider permit is created.
select set_config(
  'request.jwt.claim.sub',
  'a1111111-1111-4111-8111-111111111111',
  false
);
select public.set_workspace_ai_limits(
  'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  false,
  100,
  10000,
  10000,
  1
);

select set_config(
  'request.jwt.claim.sub',
  'a2222222-2222-4222-8222-222222222222',
  false
);

do $$
declare
  turn record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'disabled generation',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    100
  );

  if reservation.allowed
    or reservation.denial_code <> 'PROVIDER_DISABLED' then
    raise exception 'disabled workspace generation was not denied';
  end if;

  perform public.finish_conversation_generation(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'failed',
    '',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    5,
    'PROVIDER_DISABLED',
    'AI generation is disabled for this workspace.'
  );
end;
$$;

-- Token budgets count actual terminal usage and reject requests that exceed either ceiling.
insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title
)
values (
  'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a2222222-2222-4222-8222-222222222222',
  'P5 token budget conversation'
);

do $$
declare
  turn record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'baseline token usage',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    100
  );

  if not reservation.allowed then
    raise exception 'baseline token permit was denied';
  end if;

  perform public.finish_conversation_generation(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'complete',
    'baseline token response',
    'fixture-bilingual-v1',
    'p5_budget_baseline',
    100,
    100,
    0,
    200,
    5,
    50,
    null,
    null
  );
end;
$$;

do $$
declare
  turn record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'input budget overflow',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    901,
    100
  );

  if reservation.allowed
    or reservation.denial_code <> 'PROVIDER_BUDGET_EXCEEDED' then
    raise exception 'daily input budget was not enforced';
  end if;

  perform public.finish_conversation_generation(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'failed',
    '',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    5,
    'PROVIDER_BUDGET_EXCEEDED',
    'The workspace reached its daily input budget.'
  );
end;
$$;

do $$
declare
  turn record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'output budget overflow',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    901
  );

  if reservation.allowed
    or reservation.denial_code <> 'PROVIDER_BUDGET_EXCEEDED' then
    raise exception 'daily output budget was not enforced';
  end if;

  perform public.finish_conversation_generation(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'failed',
    '',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    5,
    'PROVIDER_BUDGET_EXCEEDED',
    'The workspace reached its daily output budget.'
  );
end;
$$;

do $$
declare
  turn record;
  reservation record;
  limits record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'exact remaining budget',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    900,
    900
  );

  if not reservation.allowed then
    raise exception 'exact remaining token budget was denied';
  end if;

  perform public.finish_conversation_generation(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'complete',
    'exact budget response',
    'fixture-bilingual-v1',
    'p5_budget_exact',
    200,
    300,
    0,
    500,
    5,
    50,
    null,
    null
  );

  select *
  into limits
  from public.get_workspace_ai_limits(
    'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  );

  if limits.requests_used <> 2
    or limits.input_tokens_used <> 300
    or limits.output_tokens_used <> 400
    or limits.active_generations <> 0 then
    raise exception 'actual token settlement did not replace reservations';
  end if;
end;
$$;

-- Draft continuation uses the same permit authority and cannot settle itself directly.
insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title
)
values (
  'a3bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a2222222-2222-4222-8222-222222222222',
  'P5 draft control conversation'
);

do $$
declare
  turn record;
  created record;
  generation record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a3bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'create a draft control source',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  perform public.finish_conversation_generation(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a3bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'complete',
    'draft control source response',
    'fixture-bilingual-v1',
    'p5_draft_source',
    10,
    20,
    0,
    30,
    5,
    30,
    null,
    null
  );

  select *
  into created
  from public.create_draft_from_message(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a3bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    'memo',
    'P5 controlled memo',
    'Initial controlled memo.',
    'ltr'
  );

  select *
  into generation
  from public.begin_draft_generation(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    created.draft_id,
    'improve',
    'Improve this controlled memo.',
    'fixture',
    'fixture-bilingual-v1'
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'draft',
    generation.generation_id,
    200,
    300
  );

  if not reservation.allowed or reservation.permit_id is null then
    raise exception 'draft generation permit was denied';
  end if;

  begin
    perform public.settle_ai_generation_permit(
      'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      reservation.permit_id,
      true,
      'complete',
      50,
      75,
      0,
      125,
      null
    );
    raise exception 'authenticated client settled a permit directly';
  exception
    when insufficient_privilege then null;
  end;

  perform public.finish_draft_generation(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    created.draft_id,
    generation.generation_id,
    'complete',
    'Improved controlled memo.',
    'fixture-bilingual-v1',
    'p5_draft_generation',
    50,
    75,
    0,
    125,
    5,
    40,
    null,
    null
  );

  if not exists (
    select 1
    from public.ai_generation_permits permit
    where permit.id = reservation.permit_id
      and permit.operation = 'draft'
      and permit.status = 'settled'
      and permit.actual_input_tokens = 50
      and permit.actual_output_tokens = 75
      and permit.actual_total_tokens = 125
  ) then
    raise exception 'draft permit was not settled by the terminal trigger';
  end if;

  perform set_config('p5c.draft_id', created.draft_id::text, false);
end;
$$;

-- Expiring a draft permit fails the proposal while preserving its partial text.
do $$
declare
  generation record;
  reservation record;
begin
  select *
  into generation
  from public.begin_draft_generation(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p5c.draft_id')::uuid,
    'continue',
    'Continue slowly.',
    'fixture',
    'fixture-bilingual-v1'
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'draft',
    generation.generation_id,
    150,
    250
  );

  perform public.checkpoint_draft_generation(
    'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p5c.draft_id')::uuid,
    generation.generation_id,
    'partial draft proposal',
    10
  );

  perform set_config('p5c.expired_draft_generation', generation.generation_id::text, false);
  perform set_config('p5c.expired_draft_permit', reservation.permit_id::text, false);
end;
$$;

reset role;
update public.ai_generation_permits permit
set
  status = 'expired',
  provider_started = true,
  terminal_status = 'failed',
  actual_input_tokens = permit.reserved_input_tokens,
  actual_output_tokens = permit.reserved_output_tokens,
  actual_reasoning_tokens = 0,
  actual_total_tokens = permit.reserved_input_tokens + permit.reserved_output_tokens,
  failure_code = 'PERMIT_EXPIRED',
  settled_at = timezone('utc', now())
where permit.id = current_setting('p5c.expired_draft_permit')::uuid;

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  'a2222222-2222-4222-8222-222222222222',
  false
);

do $$
begin
  if not exists (
    select 1
    from public.draft_generations generation
    where generation.id = current_setting('p5c.expired_draft_generation')::uuid
      and generation.status = 'failed'
      and generation.proposed_content = 'partial draft proposal'
      and generation.failure_code = 'PROVIDER_TIMEOUT'
      and generation.completed_at is not null
  ) then
    raise exception 'expired draft permit did not fail its proposal honestly';
  end if;
end;
$$;

-- Expired conversation leases release concurrency and fail stale pending messages.
insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title
)
values (
  'a4bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a2222222-2222-4222-8222-222222222222',
  'P5 lease recovery conversation'
);

do $$
declare
  turn record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a4bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'expired lease request',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    300,
    400
  );

  perform public.checkpoint_conversation_generation(
    'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a4bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'partial expired response',
    15
  );

  perform set_config('p5c.expired_message', turn.assistant_message_id::text, false);
  perform set_config('p5c.expired_generation', turn.generation_id::text, false);
  perform set_config('p5c.expired_permit', reservation.permit_id::text, false);
end;
$$;

reset role;
update public.ai_generation_permits
set
  reserved_at = timezone('utc', now()) - interval '20 minutes',
  expires_at = timezone('utc', now()) - interval '10 minutes'
where id = current_setting('p5c.expired_permit')::uuid;

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  'a2222222-2222-4222-8222-222222222222',
  false
);

do $$
declare
  turn record;
  reservation record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a4bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'replacement after expired lease',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  select *
  into reservation
  from public.reserve_ai_generation_permit(
    'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'conversation',
    turn.generation_id,
    100,
    100
  );

  if not reservation.allowed then
    raise exception 'expired lease did not release concurrency';
  end if;

  perform public.finish_conversation_generation(
    'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a4bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'complete',
    'replacement response',
    'fixture-bilingual-v1',
    'p5_replacement_response',
    20,
    30,
    0,
    50,
    5,
    40,
    null,
    null
  );
end;
$$;

do $$
begin
  if not exists (
    select 1
    from public.ai_generation_permits permit
    where permit.id = current_setting('p5c.expired_permit')::uuid
      and permit.status = 'expired'
      and permit.terminal_status = 'failed'
      and permit.failure_code = 'PERMIT_EXPIRED'
      and permit.actual_input_tokens = 300
      and permit.actual_output_tokens = 400
  ) then
    raise exception 'expired conversation permit was not settled conservatively';
  end if;

  if not exists (
    select 1
    from public.message_generations generation
    join public.messages message on message.id = generation.message_id
    where generation.id = current_setting('p5c.expired_generation')::uuid
      and generation.status = 'failed'
      and generation.failure_code = 'PROVIDER_TIMEOUT'
      and generation.completed_at is not null
      and message.id = current_setting('p5c.expired_message')::uuid
      and message.status = 'failed'
      and message.content = 'partial expired response'
  ) then
    raise exception 'expired conversation lease did not preserve and fail partial text';
  end if;
end;
$$;

-- Archived workspaces cannot change limits or reserve a pending permit.
select set_config(
  'request.jwt.claim.sub',
  'a1111111-1111-4111-8111-111111111111',
  false
);
select public.set_workspace_ai_limits(
  'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  true,
  100,
  10000,
  10000,
  1
);

select set_config(
  'request.jwt.claim.sub',
  'a2222222-2222-4222-8222-222222222222',
  false
);

do $$
declare
  turn record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a1bbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'pending before archive',
    'ltr',
    'fixture',
    'fixture-bilingual-v1',
    null
  );
  perform set_config('p5c.archived_generation', turn.generation_id::text, false);
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  'a1111111-1111-4111-8111-111111111111',
  false
);
update public.workspaces
set archived_at = timezone('utc', now())
where id = 'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

do $$
begin
  begin
    perform public.set_workspace_ai_limits(
      'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      true,
      100,
      10000,
      10000,
      1
    );
    raise exception 'archived workspace limits changed';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  'a2222222-2222-4222-8222-222222222222',
  false
);

do $$
begin
  begin
    perform public.reserve_ai_generation_permit(
      'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'conversation',
      current_setting('p5c.archived_generation')::uuid,
      100,
      100
    );
    raise exception 'archived workspace reserved provider capacity';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Outsiders cannot infer limits, permits, or usage.
select set_config(
  'request.jwt.claim.sub',
  'a4444444-4444-4444-8444-444444444444',
  false
);

do $$
begin
  if exists (select 1 from public.workspace_ai_limits) then
    raise exception 'outsider can read workspace AI limits';
  end if;

  if exists (select 1 from public.ai_generation_permits) then
    raise exception 'outsider can read AI permits';
  end if;

  begin
    perform public.get_workspace_ai_limits(
      'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    );
    raise exception 'outsider resolved workspace AI usage';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Clean up through the owner boundary, then remove fixture accounts.
select set_config(
  'request.jwt.claim.sub',
  'a1111111-1111-4111-8111-111111111111',
  false
);

update public.workspaces
set archived_at = null
where id = 'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

delete from public.workspaces
where id in (
  'a1aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a2aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a3aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'a4aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

reset role;
delete from auth.users
where id in (
  'a1111111-1111-4111-8111-111111111111',
  'a2222222-2222-4222-8222-222222222222',
  'a3333333-3333-4333-8333-333333333333',
  'a4444444-4444-4444-8444-444444444444'
);
