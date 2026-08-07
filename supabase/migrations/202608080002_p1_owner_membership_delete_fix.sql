begin;

create or replace function public.protect_workspace_owner_membership()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' and old.role = 'owner' and pg_trigger_depth() = 1 then
    raise exception 'workspace owner membership cannot be deleted directly';
  end if;

  if tg_op = 'UPDATE' and old.role = 'owner' then
    if new.role <> 'owner' or new.user_id <> old.user_id then
      raise exception 'workspace owner membership cannot be reassigned';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

commit;
