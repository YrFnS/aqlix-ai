begin;

create or replace function public.detach_draft_origins_before_conversation_delete()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- The original conversation foreign key predates origin_message_id and sets
  -- conversation_id to null independently. Detach both live origin identifiers
  -- first so the reusable draft and its provenance snapshots remain valid
  -- throughout the conversation/message cascade.
  update public.drafts draft
  set
    conversation_id = null,
    origin_message_id = null
  where draft.workspace_id = old.workspace_id
    and draft.conversation_id = old.id;

  update public.draft_provenance provenance
  set
    conversation_id = null,
    origin_message_id = null
  where provenance.workspace_id = old.workspace_id
    and provenance.conversation_id = old.id;

  return old;
end;
$$;

revoke all on function public.detach_draft_origins_before_conversation_delete()
from public;

drop trigger if exists conversations_detach_draft_origins_before_delete
on public.conversations;

create trigger conversations_detach_draft_origins_before_delete
before delete on public.conversations
for each row execute function public.detach_draft_origins_before_conversation_delete();

commit;
