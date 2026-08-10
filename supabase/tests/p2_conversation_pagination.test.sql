\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('65555555-5555-4555-8555-555555555555', 'p2-page-owner@example.test'),
  ('66666666-6666-4666-8666-666666666666', 'p2-page-outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '65555555-5555-4555-8555-555555555555',
  false
);

insert into public.workspaces (id, owner_id, name, default_language)
values (
  '6ccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '65555555-5555-4555-8555-555555555555',
  'مساحة pagination',
  'auto'
);

insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title,
  status
)
values
  (
    '6ddddddd-dddd-4ddd-8ddd-dddddddddddd',
    '6ccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '65555555-5555-4555-8555-555555555555',
    'Long bilingual history',
    'active'
  ),
  (
    '6eeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    '6ccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '65555555-5555-4555-8555-555555555555',
    'Archived history',
    'archived'
  );

insert into public.messages (
  workspace_id,
  conversation_id,
  created_by,
  role,
  status,
  content,
  direction,
  sequence,
  created_at
)
select
  '6ccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '6ddddddd-dddd-4ddd-8ddd-dddddddddddd',
  '65555555-5555-4555-8555-555555555555',
  case when sequence % 2 = 0 then 'user' else 'assistant' end,
  'complete',
  format('رسالة %s / message %s', sequence, sequence),
  'auto',
  sequence,
  '2026-08-10T00:00:00Z'::timestamptz + make_interval(secs => sequence)
from generate_series(0, 59) as sequence;

do $$
declare
  summary record;
  actual_last timestamptz;
begin
  select *
  into summary
  from public.list_conversation_summaries(
    '6ccccccc-cccc-4ccc-8ccc-cccccccccccc',
    false
  );

  select max(created_at)
  into actual_last
  from public.messages
  where conversation_id = '6ddddddd-dddd-4ddd-8ddd-dddddddddddd';

  if summary.id <> '6ddddddd-dddd-4ddd-8ddd-dddddddddddd'
    or summary.message_count <> 60
    or summary.last_message_at is distinct from actual_last then
    raise exception 'active conversation summary is incorrect';
  end if;

  if (
    select count(*)
    from public.list_conversation_summaries(
      '6ccccccc-cccc-4ccc-8ccc-cccccccccccc',
      true
    )
  ) <> 2 then
    raise exception 'archived summary inclusion is incorrect';
  end if;

  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'messages_workspace_conversation_sequence_desc_idx'
  ) then
    raise exception 'message cursor index is missing';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '66666666-6666-4666-8666-666666666666',
  false
);

do $$
begin
  if exists (
    select 1
    from public.list_conversation_summaries(
      '6ccccccc-cccc-4ccc-8ccc-cccccccccccc',
      true
    )
  ) then
    raise exception 'outsider can read conversation summaries';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '65555555-5555-4555-8555-555555555555',
  false
);

delete from public.workspaces
where id = '6ccccccc-cccc-4ccc-8ccc-cccccccccccc';

reset role;
