\set ON_ERROR_STOP on

-- Privilege checks are intentionally independent from fixture data. They guard
-- the exposed PostgREST/RPC surface after the complete migration chain runs.
do $$
begin
  if has_function_privilege(
    'authenticated',
    'public.settle_ai_generation_permit(uuid,uuid,boolean,text,integer,integer,integer,integer,text)',
    'EXECUTE'
  ) then
    raise exception 'authenticated can execute direct AI permit settlement';
  end if;

  if has_function_privilege(
    'anon',
    'public.settle_ai_generation_permit(uuid,uuid,boolean,text,integer,integer,integer,integer,text)',
    'EXECUTE'
  ) then
    raise exception 'anonymous can execute direct AI permit settlement';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.reserve_ai_generation_permit(uuid,text,uuid,integer,integer)',
    'EXECUTE'
  ) then
    raise exception 'authenticated lost the bounded AI permit reservation RPC';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.checkpoint_conversation_generation(uuid,uuid,uuid,uuid,text,integer)',
    'EXECUTE'
  ) then
    raise exception 'authenticated lost the bounded conversation checkpoint RPC';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.finish_conversation_generation(uuid,uuid,uuid,uuid,text,text,text,text,integer,integer,integer,integer,integer,integer,text,text)',
    'EXECUTE'
  ) then
    raise exception 'authenticated lost the bounded conversation finalization RPC';
  end if;
end;
$$;

select 'p5 AI generation privilege boundary passed' as result;
