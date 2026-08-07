\set ON_ERROR_STOP on

insert into auth.users (id, email)
values (
  '55555555-5555-4555-8555-555555555555',
  'insert-returning-owner@example.test'
);

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '55555555-5555-4555-8555-555555555555',
  false
);

-- This mirrors the PostgREST/Supabase `.insert(...).select("*").single()` path.
-- The owner must be able to read the inserted row from RETURNING even though
-- the owner-membership trigger is part of the same statement lifecycle.
insert into public.workspaces (
  id,
  owner_id,
  name,
  description,
  default_language
)
values (
  '55555555-aaaa-4555-8555-555555555555',
  '55555555-5555-4555-8555-555555555555',
  'مساحة INSERT RETURNING',
  'Exact browser creation path',
  'auto'
)
returning id, owner_id, name;

do $$
begin
  if not exists (
    select 1
    from public.workspaces
    where id = '55555555-aaaa-4555-8555-555555555555'
      and owner_id = '55555555-5555-4555-8555-555555555555'
  ) then
    raise exception 'owner could not read the inserted workspace';
  end if;

  if not exists (
    select 1
    from public.workspace_members
    where workspace_id = '55555555-aaaa-4555-8555-555555555555'
      and user_id = '55555555-5555-4555-8555-555555555555'
      and role = 'owner'
  ) then
    raise exception 'owner membership was not created after insert returning';
  end if;
end;
$$;

delete from public.workspaces
where id = '55555555-aaaa-4555-8555-555555555555';

reset role;
