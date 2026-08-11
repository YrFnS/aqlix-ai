begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;
revoke create on schema private from public, anon, authenticated, service_role;

-- Keep privileged implementations outside the PostgREST-exposed schema while
-- preserving the established RPC names through SECURITY INVOKER wrappers.
create temporary table exposed_definer_relocations on commit drop as
select
  p.oid,
  p.proname,
  pg_get_function_identity_arguments(p.oid) as identity_args,
  pg_get_function_arguments(p.oid) as declared_args,
  pg_get_function_result(p.oid) as result_type,
  cardinality(p.proargtypes::oid[]) as input_count,
  p.proretset,
  p.proisstrict,
  case p.provolatile
    when 'i' then 'immutable'
    when 's' then 'stable'
    else 'volatile'
  end as volatility,
  case p.proparallel
    when 's' then 'parallel safe'
    when 'r' then 'parallel restricted'
    else 'parallel unsafe'
  end as parallel_safety,
  coalesce(array_to_string(p.proconfig, ','), '') like '%vault%' as uses_vault
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef
  and has_function_privilege('authenticated', p.oid, 'EXECUTE');

do $$
declare
  function_record record;
  call_arguments text;
  wrapper_body text;
  strict_clause text;
begin
  if (select count(*) from exposed_definer_relocations) <> 33 then
    raise exception 'unexpected exposed SECURITY DEFINER function count';
  end if;

  for function_record in
    select * from exposed_definer_relocations
    order by proname, identity_args
  loop
    select coalesce(string_agg(format('$%s', position), ', '), '')
      into call_arguments
    from generate_series(1, function_record.input_count) as position;

    execute format(
      'alter function public.%I(%s) set schema private',
      function_record.proname,
      function_record.identity_args
    );

    if function_record.uses_vault then
      execute format(
        'alter function private.%I(%s) set search_path = pg_catalog, public, vault, pg_temp',
        function_record.proname,
        function_record.identity_args
      );
    else
      execute format(
        'alter function private.%I(%s) set search_path = pg_catalog, public, pg_temp',
        function_record.proname,
        function_record.identity_args
      );
    end if;

    execute format(
      'revoke all on function private.%I(%s) from public, anon',
      function_record.proname,
      function_record.identity_args
    );
    execute format(
      'grant execute on function private.%I(%s) to authenticated, service_role',
      function_record.proname,
      function_record.identity_args
    );

    wrapper_body := case
      when function_record.proretset then format(
        'select * from private.%I(%s)',
        function_record.proname,
        call_arguments
      )
      else format(
        'select private.%I(%s)',
        function_record.proname,
        call_arguments
      )
    end;
    strict_clause := case when function_record.proisstrict then 'strict' else '' end;

    execute format(
      'create or replace function public.%I(%s) returns %s language sql %s %s %s security invoker set search_path = pg_catalog, private as %L',
      function_record.proname,
      function_record.declared_args,
      function_record.result_type,
      function_record.volatility,
      function_record.parallel_safety,
      strict_clause,
      wrapper_body
    );

    execute format(
      'revoke all on function public.%I(%s) from public, anon, authenticated, service_role',
      function_record.proname,
      function_record.identity_args
    );
    execute format(
      'grant execute on function public.%I(%s) to service_role',
      function_record.proname,
      function_record.identity_args
    );

    if function_record.proname <> 'cache_validation_result' then
      execute format(
        'grant execute on function public.%I(%s) to authenticated',
        function_record.proname,
        function_record.identity_args
      );
    end if;
  end loop;
end;
$$;

-- The application server now resolves Vault material through a service-role
-- function bound to the already authenticated account ID. Browser sessions do
-- not receive EXECUTE on these functions.
create or replace function private.resolve_user_openrouter_credential_for_user(
  target_user_id uuid
)
returns table(api_key text)
language sql
stable
security definer
set search_path = pg_catalog, public, vault, pg_temp
as $$
  select secret.decrypted_secret
  from public.user_ai_settings settings
  join vault.decrypted_secrets secret
    on secret.id = settings.vault_secret_id
  where settings.user_id = target_user_id
    and settings.provider = 'openrouter'
    and char_length(secret.decrypted_secret) >= 16
  limit 1;
$$;

create or replace function private.resolve_user_openrouter_runtime_for_user(
  target_user_id uuid
)
returns table(api_key text, model_id text)
language sql
stable
security definer
set search_path = pg_catalog, public, vault, pg_temp
as $$
  select
    secret.decrypted_secret,
    settings.selected_model_id
  from public.user_ai_settings settings
  join vault.decrypted_secrets secret
    on secret.id = settings.vault_secret_id
  where settings.user_id = target_user_id
    and settings.provider = 'openrouter'
    and settings.selected_model_id is not null
    and char_length(secret.decrypted_secret) >= 16
  limit 1;
$$;

revoke all on function private.resolve_user_openrouter_credential_for_user(uuid)
  from public, anon, authenticated, service_role;
revoke all on function private.resolve_user_openrouter_runtime_for_user(uuid)
  from public, anon, authenticated, service_role;
grant execute on function private.resolve_user_openrouter_credential_for_user(uuid)
  to service_role;
grant execute on function private.resolve_user_openrouter_runtime_for_user(uuid)
  to service_role;

create or replace function public.resolve_user_openrouter_credential_for_user(
  target_user_id uuid
)
returns table(api_key text)
language sql
stable
security invoker
set search_path = pg_catalog, private
as $$
  select * from private.resolve_user_openrouter_credential_for_user($1);
$$;

create or replace function public.resolve_user_openrouter_runtime_for_user(
  target_user_id uuid
)
returns table(api_key text, model_id text)
language sql
stable
security invoker
set search_path = pg_catalog, private
as $$
  select * from private.resolve_user_openrouter_runtime_for_user($1);
$$;

revoke all on function public.resolve_user_openrouter_credential_for_user(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.resolve_user_openrouter_runtime_for_user(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.resolve_user_openrouter_credential_for_user(uuid)
  to service_role;
grant execute on function public.resolve_user_openrouter_runtime_for_user(uuid)
  to service_role;

commit;
