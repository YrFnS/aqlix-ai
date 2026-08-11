\set ON_ERROR_STOP on

-- Privilege checks are intentionally independent from fixture data. They guard
-- the exposed PostgREST/RPC surface after the complete migration chain runs.
do $$
declare
  exposed_function text;
  internal_signature text;
  required_signature text;
begin
  select function_record.oid::regprocedure::text
  into exposed_function
  from pg_proc function_record
  join pg_namespace function_schema
    on function_schema.oid = function_record.pronamespace
  where function_schema.nspname = 'public'
    and has_function_privilege('anon', function_record.oid, 'EXECUTE')
  order by function_record.oid::regprocedure::text
  limit 1;

  if exposed_function is not null then
    raise exception 'anonymous can execute public function %', exposed_function;
  end if;

  if exists (
    select 1
    from pg_proc function_record
    join pg_namespace function_schema
      on function_schema.oid = function_record.pronamespace
    where function_schema.nspname = 'public'
      and function_record.prosecdef
      and has_function_privilege(
        'authenticated',
        function_record.oid,
        'EXECUTE'
      )
  ) then
    raise exception 'authenticated can execute an exposed SECURITY DEFINER function';
  end if;

  if not exists (
    select 1
    from pg_namespace
    where nspname = 'private'
  ) then
    raise exception 'private implementation schema is missing';
  end if;

  if (
    select count(*)
    from pg_proc function_record
    join pg_namespace function_schema
      on function_schema.oid = function_record.pronamespace
    where function_schema.nspname = 'private'
      and function_record.prosecdef
  ) < 33 then
    raise exception 'privileged implementations were not relocated';
  end if;

  if has_function_privilege(
    'authenticated',
    'public.resolve_user_openrouter_credential_for_user(uuid)',
    'EXECUTE'
  ) or has_function_privilege(
    'authenticated',
    'public.resolve_user_openrouter_runtime_for_user(uuid)',
    'EXECUTE'
  ) then
    raise exception 'authenticated can call service-role Vault resolvers';
  end if;

  if not has_function_privilege(
    'service_role',
    'public.resolve_user_openrouter_credential_for_user(uuid)',
    'EXECUTE'
  ) or not has_function_privilege(
    'service_role',
    'public.resolve_user_openrouter_runtime_for_user(uuid)',
    'EXECUTE'
  ) then
    raise exception 'service role lost the server-only Vault resolver contract';
  end if;

  if has_function_privilege(
    'authenticated',
    'public.settle_ai_generation_permit(uuid,uuid,boolean,text,integer,integer,integer,integer,text)',
    'EXECUTE'
  ) then
    raise exception 'authenticated can execute direct AI permit settlement';
  end if;

  foreach internal_signature in array array[
    'public.settle_ai_generation_permit_from_terminal(uuid,text,uuid,text,integer,integer,integer,integer,text)',
    'public.settle_message_generation_permit_on_terminal()',
    'public.settle_draft_generation_permit_on_terminal()',
    'public.fail_expired_ai_generation_target()',
    'public.cleanup_user_ai_vault_secret()',
    'public.create_workspace_owner_membership()',
    'public.initialize_workspace_ai_limits()',
    'public.detach_draft_origins_before_conversation_delete()'
  ] loop
    if has_function_privilege('authenticated', internal_signature, 'EXECUTE') then
      raise exception 'authenticated can execute internal function %', internal_signature;
    end if;
  end loop;

  foreach required_signature in array array[
    'public.reserve_ai_generation_permit(uuid,text,uuid,integer,integer)',
    'public.begin_conversation_turn(uuid,uuid,text,text,text,text,uuid)',
    'public.checkpoint_conversation_generation(uuid,uuid,uuid,uuid,text,integer)',
    'public.finish_conversation_generation(uuid,uuid,uuid,uuid,text,text,text,text,integer,integer,integer,integer,integer,integer,text,text)',
    'public.list_conversation_summaries(uuid,boolean)',
    'public.save_draft_version(uuid,uuid,integer,text,text,text,text,text,integer)'
  ] loop
    if not has_function_privilege(
      'authenticated',
      required_signature,
      'EXECUTE'
    ) then
      raise exception 'authenticated lost required RPC %', required_signature;
    end if;
  end loop;

  if exists (
    select 1
    from pg_proc function_record
    join pg_namespace function_schema
      on function_schema.oid = function_record.pronamespace
    where function_schema.nspname = 'public'
      and function_record.proname in (
        'update_updated_at_column',
        'update_cultural_islamic_rules_updated_at',
        'cleanup_expired_validation_results',
        'update_cultural_islamic_knowledge_updated_at',
        'update_user_compliance_preferences_updated_at'
      )
      and not exists (
        select 1
        from unnest(coalesce(function_record.proconfig, array[]::text[])) setting
        where setting like 'search_path=%'
      )
  ) then
    raise exception 'a mutable public function search path remains';
  end if;

  if exists (
    select 1
    from pg_policies policy
    where policy.schemaname = 'public'
      and (
        regexp_replace(
          coalesce(policy.qual, ''),
          '\(\s*select\s+auth\.(uid|role)\(\)\s+as\s+(uid|role)\s*\)',
          '',
          'gi'
        ) ~ 'auth\.(uid|role)\(\)'
        or regexp_replace(
          coalesce(policy.with_check, ''),
          '\(\s*select\s+auth\.(uid|role)\(\)\s+as\s+(uid|role)\s*\)',
          '',
          'gi'
        ) ~ 'auth\.(uid|role)\(\)'
      )
  ) then
    raise exception 'an RLS policy still evaluates auth helpers per row';
  end if;

  if exists (
    select 1
    from pg_constraint constraint_record
    join pg_class table_record
      on table_record.oid = constraint_record.conrelid
    join pg_namespace table_schema
      on table_schema.oid = table_record.relnamespace
    where constraint_record.contype = 'f'
      and table_schema.nspname = 'public'
      and not exists (
        select 1
        from pg_index index_record
        where index_record.indrelid = constraint_record.conrelid
          and index_record.indisvalid
          and index_record.indisready
          and index_record.indpred is null
          and (index_record.indkey::smallint[])[
            0:cardinality(constraint_record.conkey)-1
          ] = constraint_record.conkey
      )
  ) then
    raise exception 'a public foreign key is missing a covering index';
  end if;

  if exists (
    select 1
    from information_schema.role_table_grants table_grant
    where table_grant.table_schema = 'public'
      and table_grant.grantee = 'anon'
      and table_grant.table_name = any(array[
        'iraqi_user_authentication',
        'authentication_cultural_context',
        'iraqi_authentication_sessions',
        'professional_domain_authentication',
        'cultural_mfa_configuration',
        'cultural_islamic_rules',
        'content_validation_results',
        'user_compliance_preferences',
        'compliance_violations',
        'cultural_islamic_knowledge'
      ])
  ) then
    raise exception 'anonymous retained a legacy table grant';
  end if;

  if exists (
    select 1
    from information_schema.role_table_grants table_grant
    where table_grant.table_schema = 'public'
      and table_grant.grantee = 'authenticated'
      and table_grant.table_name = any(array[
        'iraqi_user_authentication',
        'authentication_cultural_context',
        'iraqi_authentication_sessions',
        'professional_domain_authentication',
        'cultural_mfa_configuration',
        'cultural_islamic_rules',
        'content_validation_results',
        'user_compliance_preferences',
        'compliance_violations',
        'cultural_islamic_knowledge'
      ])
      and (
        table_grant.privilege_type in ('REFERENCES', 'TRIGGER', 'TRUNCATE')
        or table_grant.table_name = 'content_validation_results'
      )
  ) then
    raise exception 'authenticated retained a broad legacy table grant';
  end if;
end;
$$;

select 'Supabase advisor and P5 privilege boundaries passed' as result;
