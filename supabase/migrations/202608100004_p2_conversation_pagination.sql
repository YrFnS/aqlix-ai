begin;

create index if not exists messages_workspace_conversation_sequence_desc_idx
  on public.messages(workspace_id, conversation_id, sequence desc);

create or replace function public.list_conversation_summaries(
  target_workspace_id uuid,
  requested_include_archived boolean default false
)
returns table (
  id uuid,
  workspace_id uuid,
  created_by uuid,
  title text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  message_count integer,
  last_message_at timestamptz
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    conversation.id,
    conversation.workspace_id,
    conversation.created_by,
    conversation.title,
    conversation.status,
    conversation.created_at,
    conversation.updated_at,
    count(message.id)::integer as message_count,
    max(message.created_at) as last_message_at
  from public.conversations conversation
  left join public.messages message
    on message.workspace_id = conversation.workspace_id
    and message.conversation_id = conversation.id
  where conversation.workspace_id = target_workspace_id
    and public.is_workspace_member(target_workspace_id)
    and (
      requested_include_archived
      or conversation.status = 'active'
    )
  group by
    conversation.id,
    conversation.workspace_id,
    conversation.created_by,
    conversation.title,
    conversation.status,
    conversation.created_at,
    conversation.updated_at
  order by conversation.updated_at desc;
$$;

revoke all on function public.list_conversation_summaries(uuid, boolean)
from public;
grant execute on function public.list_conversation_summaries(uuid, boolean)
to authenticated;

comment on function public.list_conversation_summaries(uuid, boolean) is
  'Returns member-authorized conversation metadata with database-side message counts.';

commit;
