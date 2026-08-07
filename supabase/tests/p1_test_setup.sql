\set ON_ERROR_STOP on

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key,
  email text unique
);

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

do $$
begin
  create role authenticated nologin;
exception
  when duplicate_object then null;
end;
$$;

grant usage on schema auth to authenticated;
grant select on auth.users to authenticated;
