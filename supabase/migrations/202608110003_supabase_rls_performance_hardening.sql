begin;

-- Pin mutable helper search paths and keep cleanup service-only.
alter function public.update_updated_at_column()
  set search_path = pg_catalog, public;
alter function public.update_cultural_islamic_rules_updated_at()
  set search_path = pg_catalog, public;
alter function public.cleanup_expired_validation_results()
  set search_path = pg_catalog, public;
alter function public.update_cultural_islamic_knowledge_updated_at()
  set search_path = pg_catalog, public;
alter function public.update_user_compliance_preferences_updated_at()
  set search_path = pg_catalog, public;

revoke all on function public.cleanup_expired_validation_results()
  from public, anon, authenticated;
grant execute on function public.cleanup_expired_validation_results()
  to service_role;

-- Rewrite auth helper calls through initPlans while preserving each policy's
-- command, role list, and permissive/restrictive behavior.
do $$
declare
  policy_record record;
  rewritten_using text;
  rewritten_check text;
  roles_sql text;
  statement_sql text;
begin
  for policy_record in
    select *
    from pg_policies
    where schemaname = 'public'
      and (
        coalesce(qual, '') like '%auth.uid()%'
        or coalesce(with_check, '') like '%auth.uid()%'
        or coalesce(qual, '') like '%auth.role()%'
        or coalesce(with_check, '') like '%auth.role()%'
      )
  loop
    rewritten_using := policy_record.qual;
    rewritten_check := policy_record.with_check;

    if rewritten_using is not null then
      rewritten_using := regexp_replace(
        rewritten_using,
        '\(\s*select\s+auth\.uid\(\)\s+as\s+uid\s*\)',
        '__AUTH_UID_SELECT__',
        'gi'
      );
      rewritten_using := replace(rewritten_using, '(select auth.uid())', '__AUTH_UID_SELECT__');
      rewritten_using := replace(rewritten_using, '(SELECT auth.uid())', '__AUTH_UID_SELECT__');
      rewritten_using := replace(rewritten_using, 'auth.uid()', '(select auth.uid())');
      rewritten_using := replace(rewritten_using, '__AUTH_UID_SELECT__', '(select auth.uid())');

      rewritten_using := regexp_replace(
        rewritten_using,
        '\(\s*select\s+auth\.role\(\)\s+as\s+role\s*\)',
        '__AUTH_ROLE_SELECT__',
        'gi'
      );
      rewritten_using := replace(rewritten_using, '(select auth.role())', '__AUTH_ROLE_SELECT__');
      rewritten_using := replace(rewritten_using, '(SELECT auth.role())', '__AUTH_ROLE_SELECT__');
      rewritten_using := replace(rewritten_using, 'auth.role()', '(select auth.role())');
      rewritten_using := replace(rewritten_using, '__AUTH_ROLE_SELECT__', '(select auth.role())');
    end if;

    if rewritten_check is not null then
      rewritten_check := regexp_replace(
        rewritten_check,
        '\(\s*select\s+auth\.uid\(\)\s+as\s+uid\s*\)',
        '__AUTH_UID_SELECT__',
        'gi'
      );
      rewritten_check := replace(rewritten_check, '(select auth.uid())', '__AUTH_UID_SELECT__');
      rewritten_check := replace(rewritten_check, '(SELECT auth.uid())', '__AUTH_UID_SELECT__');
      rewritten_check := replace(rewritten_check, 'auth.uid()', '(select auth.uid())');
      rewritten_check := replace(rewritten_check, '__AUTH_UID_SELECT__', '(select auth.uid())');

      rewritten_check := regexp_replace(
        rewritten_check,
        '\(\s*select\s+auth\.role\(\)\s+as\s+role\s*\)',
        '__AUTH_ROLE_SELECT__',
        'gi'
      );
      rewritten_check := replace(rewritten_check, '(select auth.role())', '__AUTH_ROLE_SELECT__');
      rewritten_check := replace(rewritten_check, '(SELECT auth.role())', '__AUTH_ROLE_SELECT__');
      rewritten_check := replace(rewritten_check, 'auth.role()', '(select auth.role())');
      rewritten_check := replace(rewritten_check, '__AUTH_ROLE_SELECT__', '(select auth.role())');
    end if;

    select string_agg(quote_ident(role_name::text), ', ')
      into roles_sql
    from unnest(policy_record.roles) as role_name;

    execute format(
      'drop policy %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );

    statement_sql := format(
      'create policy %I on %I.%I as %s for %s to %s',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename,
      policy_record.permissive,
      policy_record.cmd,
      roles_sql
    );

    if rewritten_using is not null then
      statement_sql := statement_sql || format(' using (%s)', rewritten_using);
    end if;
    if rewritten_check is not null then
      statement_sql := statement_sql || format(' with check (%s)', rewritten_check);
    end if;

    execute statement_sql;
  end loop;
end;
$$;

-- Remove broad legacy grants and retain only the account-scoped operations that
-- have an explicit RLS contract.
revoke all on table
  public.iraqi_user_authentication,
  public.authentication_cultural_context,
  public.iraqi_authentication_sessions,
  public.professional_domain_authentication,
  public.cultural_mfa_configuration,
  public.cultural_islamic_rules,
  public.content_validation_results,
  public.user_compliance_preferences,
  public.compliance_violations,
  public.cultural_islamic_knowledge
from anon, authenticated;

grant select, insert, update on public.iraqi_user_authentication to authenticated;
grant select, insert, update on public.authentication_cultural_context to authenticated;
grant select, insert on public.iraqi_authentication_sessions to authenticated;
grant select, insert, update on public.professional_domain_authentication to authenticated;
grant select, insert, update on public.cultural_mfa_configuration to authenticated;
grant select on public.cultural_islamic_rules to authenticated;
grant select, insert, update, delete on public.user_compliance_preferences to authenticated;
grant select on public.compliance_violations to authenticated;
grant select on public.cultural_islamic_knowledge to authenticated;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select *
    from pg_policies
    where schemaname = 'public'
      and tablename = any(array[
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
  loop
    execute format(
      'drop policy %I on public.%I',
      policy_record.policyname,
      policy_record.tablename
    );
  end loop;
end;
$$;

create policy iraqi_user_authentication_select_own
  on public.iraqi_user_authentication for select to authenticated
  using (id = (select auth.uid()));
create policy iraqi_user_authentication_insert_own
  on public.iraqi_user_authentication for insert to authenticated
  with check (id = (select auth.uid()));
create policy iraqi_user_authentication_update_own
  on public.iraqi_user_authentication for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy authentication_cultural_context_select_own
  on public.authentication_cultural_context for select to authenticated
  using (user_id = (select auth.uid()));
create policy authentication_cultural_context_insert_own
  on public.authentication_cultural_context for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy authentication_cultural_context_update_own
  on public.authentication_cultural_context for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy iraqi_authentication_sessions_select_own
  on public.iraqi_authentication_sessions for select to authenticated
  using (user_id = (select auth.uid()));
create policy iraqi_authentication_sessions_insert_own
  on public.iraqi_authentication_sessions for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy professional_domain_authentication_select_own
  on public.professional_domain_authentication for select to authenticated
  using (user_id = (select auth.uid()));
create policy professional_domain_authentication_insert_own
  on public.professional_domain_authentication for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy professional_domain_authentication_update_own
  on public.professional_domain_authentication for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy cultural_mfa_configuration_select_own
  on public.cultural_mfa_configuration for select to authenticated
  using (user_id = (select auth.uid()));
create policy cultural_mfa_configuration_insert_own
  on public.cultural_mfa_configuration for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy cultural_mfa_configuration_update_own
  on public.cultural_mfa_configuration for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy cultural_islamic_rules_select_active
  on public.cultural_islamic_rules for select to authenticated
  using (is_active = true);

create policy user_compliance_preferences_select_own
  on public.user_compliance_preferences for select to authenticated
  using (user_id = (select auth.uid()));
create policy user_compliance_preferences_insert_own
  on public.user_compliance_preferences for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy user_compliance_preferences_update_own
  on public.user_compliance_preferences for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy user_compliance_preferences_delete_own
  on public.user_compliance_preferences for delete to authenticated
  using (user_id = (select auth.uid()));

create policy compliance_violations_select_own
  on public.compliance_violations for select to authenticated
  using (user_id = (select auth.uid()));

create policy cultural_islamic_knowledge_select_verified
  on public.cultural_islamic_knowledge for select to authenticated
  using (is_verified = true);

-- Add a covering index for every current public-schema foreign key that lacks
-- one. Names are deterministic from the constraint.
do $$
declare
  foreign_key record;
  index_name text;
  column_list text;
begin
  for foreign_key in
    select
      c.conrelid,
      c.conname,
      n.nspname as schema_name,
      t.relname as table_name,
      c.conkey
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.contype = 'f'
      and n.nspname = 'public'
      and not exists (
        select 1
        from pg_index i
        where i.indrelid = c.conrelid
          and i.indisvalid
          and i.indisready
          and i.indpred is null
          and (i.indkey::smallint[])[0:cardinality(c.conkey)-1] = c.conkey
      )
    order by t.relname, c.conname
  loop
    select string_agg(quote_ident(attribute.attname), ', ' order by key_column.ordinality)
      into column_list
    from unnest(foreign_key.conkey) with ordinality
      as key_column(attnum, ordinality)
    join pg_attribute attribute
      on attribute.attrelid = foreign_key.conrelid
      and attribute.attnum = key_column.attnum;

    index_name := left(
      regexp_replace(foreign_key.conname, '_fkey$|_fk$', '') || '_idx',
      63
    );

    execute format(
      'create index if not exists %I on %I.%I (%s)',
      index_name,
      foreign_key.schema_name,
      foreign_key.table_name,
      column_list
    );
  end loop;
end;
$$;

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and has_function_privilege('authenticated', p.oid, 'EXECUTE')
  ) then
    raise exception 'authenticated can still execute a public SECURITY DEFINER function';
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proconfig is null
      and p.proname in (
        'update_updated_at_column',
        'update_cultural_islamic_rules_updated_at',
        'cleanup_expired_validation_results',
        'update_cultural_islamic_knowledge_updated_at',
        'update_user_compliance_preferences_updated_at'
      )
  ) then
    raise exception 'mutable public function search path remains';
  end if;

  if has_function_privilege(
    'authenticated',
    'public.resolve_user_openrouter_runtime_for_user(uuid)',
    'EXECUTE'
  ) or has_function_privilege(
    'authenticated',
    'public.resolve_user_openrouter_credential_for_user(uuid)',
    'EXECUTE'
  ) then
    raise exception 'authenticated can resolve a service-role OpenRouter credential';
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
    raise exception 'an unoptimized auth call remains in an RLS policy';
  end if;

  if exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.contype = 'f'
      and n.nspname = 'public'
      and not exists (
        select 1
        from pg_index i
        where i.indrelid = c.conrelid
          and i.indisvalid
          and i.indisready
          and i.indpred is null
          and (i.indkey::smallint[])[0:cardinality(c.conkey)-1] = c.conkey
      )
  ) then
    raise exception 'one or more public foreign keys remain unindexed';
  end if;
end;
$$;

commit;
