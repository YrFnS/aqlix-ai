begin;

alter table public.drafts
  drop constraint if exists drafts_conversation_id_fkey;

alter table public.drafts
  add constraint drafts_workspace_conversation_fk
  foreign key (workspace_id, conversation_id)
  references public.conversations(workspace_id, id)
  on delete set null (conversation_id);

create index if not exists drafts_workspace_conversation_idx
  on public.drafts(workspace_id, conversation_id)
  where conversation_id is not null;

commit;
