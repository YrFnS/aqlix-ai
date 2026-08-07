\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'owner@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'editor@example.test'),
  ('33333333-3333-4333-8333-333333333333', 'viewer@example.test'),
  ('44444444-4444-4444-8444-444444444444', 'outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
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
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '11111111-1111-4111-8111-111111111111',
  'مساحة الاختبار',
  'Workspace isolation fixture',
  'auto'
);

do $$
begin
  if (
    select count(*)
    from public.workspace_members
    where workspace_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
      and user_id = '11111111-1111-4111-8111-111111111111'
      and role = 'owner'
  ) <> 1 then
    raise exception 'owner membership was not created transactionally';
  end if;
end;
$$;

insert into public.workspace_members (workspace_id, user_id, role)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    'editor'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '33333333-3333-4333-8333-333333333333',
    'viewer'
  );

select set_config(
  'request.jwt.claim.sub',
  '22222222-2222-4222-8222-222222222222',
  false
);

update public.workspaces
set name = 'مساحة محررة'
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

do $$
begin
  if (
    select name
    from public.workspaces
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) <> 'مساحة محررة' then
    raise exception 'editor could not update the workspace';
  end if;
end;
$$;

insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title
)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '22222222-2222-4222-8222-222222222222',
  'محادثة الاختبار'
);

select set_config(
  'request.jwt.claim.sub',
  '33333333-3333-4333-8333-333333333333',
  false
);

do $$
declare
  affected integer;
begin
  if (
    select count(*)
    from public.workspaces
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) <> 1 then
    raise exception 'viewer cannot read its workspace';
  end if;

  update public.workspaces
  set name = 'تعديل غير مسموح'
  where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'viewer unexpectedly updated the workspace';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '44444444-4444-4444-8444-444444444444',
  false
);

do $$
declare
  affected integer;
begin
  if (
    select count(*)
    from public.workspaces
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) <> 0 then
    raise exception 'outsider could read another workspace';
  end if;

  delete from public.workspaces
  where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  get diagnostics affected = row_count;
  if affected <> 0 then
    raise exception 'outsider unexpectedly deleted another workspace';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  false
);

do $$
begin
  begin
    delete from public.workspace_members
    where workspace_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
      and user_id = '11111111-1111-4111-8111-111111111111';

    raise exception 'owner membership deletion unexpectedly succeeded';
  exception
    when raise_exception then
      if sqlerrm = 'owner membership deletion unexpectedly succeeded' then
        raise;
      end if;
  end;
end;
$$;

delete from public.workspaces
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

reset role;

do $$
begin
  if exists (
    select 1
    from public.workspace_members
    where workspace_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'workspace membership rows did not cascade on deletion';
  end if;

  if exists (
    select 1
    from public.conversations
    where workspace_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'workspace content rows did not cascade on deletion';
  end if;
end;
$$;
