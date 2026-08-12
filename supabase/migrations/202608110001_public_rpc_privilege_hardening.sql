begin;

-- Tuppra has no unauthenticated database RPC contract. Supabase's role grants
-- can leave functions executable by `anon` even after a migration revokes the
-- pseudo-role PUBLIC, so remove both paths across the complete exposed schema.
revoke execute on all functions in schema public from PUBLIC, anon;

-- Keep future migrations from silently reopening the anonymous RPC surface.
alter default privileges for role postgres in schema public
  revoke execute on functions from PUBLIC, anon;

-- These functions are implementation details owned by triggers or by other
-- trusted database functions. Signed-in clients must not be able to invoke
-- them directly and mutate permit accounting or lifecycle state.
revoke all on function public.settle_ai_generation_permit(
  uuid,
  uuid,
  boolean,
  text,
  integer,
  integer,
  integer,
  integer,
  text
) from authenticated;
revoke all on function public.settle_ai_generation_permit_from_terminal(
  uuid,
  text,
  uuid,
  text,
  integer,
  integer,
  integer,
  integer,
  text
) from authenticated;
revoke all on function public.settle_message_generation_permit_on_terminal()
  from authenticated;
revoke all on function public.settle_draft_generation_permit_on_terminal()
  from authenticated;
revoke all on function public.fail_expired_ai_generation_target()
  from authenticated;
revoke all on function public.cleanup_user_ai_vault_secret()
  from authenticated;
revoke all on function public.create_workspace_owner_membership()
  from authenticated;
revoke all on function public.initialize_workspace_ai_limits()
  from authenticated;
revoke all on function public.detach_draft_origins_before_conversation_delete()
  from authenticated;
revoke all on function public.enforce_workspace_privileged_fields()
  from authenticated;
revoke all on function public.prevent_workspace_owner_change()
  from authenticated;
revoke all on function public.protect_workspace_owner_membership()
  from authenticated;
revoke all on function public.require_active_workspace_insert()
  from authenticated;
revoke all on function public.touch_updated_at()
  from authenticated;
revoke all on function public.update_cultural_islamic_knowledge_updated_at()
  from authenticated;
revoke all on function public.update_cultural_islamic_rules_updated_at()
  from authenticated;
revoke all on function public.update_updated_at_column()
  from authenticated;
revoke all on function public.update_user_compliance_preferences_updated_at()
  from authenticated;

-- Fail the migration rather than accepting a partially hardened deployment.
do $$
begin
  if exists (
    select 1
    from pg_proc function_record
    join pg_namespace function_schema
      on function_schema.oid = function_record.pronamespace
    where function_schema.nspname = 'public'
      and has_function_privilege('anon', function_record.oid, 'EXECUTE')
  ) then
    raise exception 'anonymous role can still execute a public function';
  end if;

  if has_function_privilege(
    'authenticated',
    'public.settle_ai_generation_permit_from_terminal(uuid,text,uuid,text,integer,integer,integer,integer,text)',
    'EXECUTE'
  ) then
    raise exception 'authenticated role can execute terminal permit settlement';
  end if;
end;
$$;

commit;
