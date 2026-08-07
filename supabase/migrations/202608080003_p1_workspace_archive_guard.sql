begin;

create or replace function public.enforce_workspace_privileged_fields()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.archived_at is distinct from old.archived_at
    and not public.has_workspace_role(old.id, array['owner']) then
    raise insufficient_privilege using
      message = 'only the workspace owner can archive or restore a workspace';
  end if;

  return new;
end;
$$;

create trigger workspaces_enforce_privileged_fields
before update of archived_at on public.workspaces
for each row execute function public.enforce_workspace_privileged_fields();

commit;
