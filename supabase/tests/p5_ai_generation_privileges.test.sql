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
end;
$$;

select 'p5 AI generation privilege boundary passed' as result;
