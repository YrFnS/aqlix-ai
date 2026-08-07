begin;

-- PostgreSQL evaluates the SELECT policy used by INSERT ... RETURNING while the
-- owner-membership AFTER trigger is still part of the same statement lifecycle.
-- The immutable owner_id is therefore a safe transient and permanent read path
-- for the workspace owner, while all other users continue through membership.
drop policy if exists workspaces_select_member on public.workspaces;

create policy workspaces_select_member_or_owner
on public.workspaces
for select
to authenticated
using (
  owner_id = auth.uid()
  or public.is_workspace_member(id)
);

commit;
