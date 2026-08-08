begin;

create or replace function public.require_active_workspace_insert()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if exists (
    select 1
    from public.workspaces workspace
    where workspace.id = new.workspace_id
      and workspace.archived_at is not null
  ) then
    raise insufficient_privilege using
      message = 'archived workspaces are read-only';
  end if;

  return new;
end;
$$;

create trigger conversations_require_active_workspace
before insert on public.conversations
for each row execute function public.require_active_workspace_insert();

create trigger messages_require_active_workspace
before insert on public.messages
for each row execute function public.require_active_workspace_insert();

create trigger message_generations_require_active_workspace
before insert on public.message_generations
for each row execute function public.require_active_workspace_insert();

commit;
