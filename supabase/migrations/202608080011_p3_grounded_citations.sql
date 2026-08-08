begin;

alter table public.message_generations
  add column grounding_mode text not null default 'off',
  add column retrieved_source_count integer not null default 0,
  add column citation_count integer not null default 0;

alter table public.message_generations
  add constraint message_generations_grounding_mode_check check (
    grounding_mode in ('off', 'workspace_sources')
  ),
  add constraint message_generations_retrieved_source_count_nonnegative check (
    retrieved_source_count >= 0
  ),
  add constraint message_generations_citation_count_nonnegative check (
    citation_count >= 0
  ),
  add constraint message_generations_grounding_counts_consistent check (
    (grounding_mode = 'off' and retrieved_source_count = 0 and citation_count = 0)
    or
    (grounding_mode = 'workspace_sources' and citation_count <= retrieved_source_count)
  );

create table public.message_citations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid not null,
  message_id uuid not null,
  source_id uuid references public.sources(id) on delete set null,
  attachment_id uuid references public.attachments(id) on delete set null,
  citation_order integer not null,
  label text not null,
  file_name_snapshot text not null,
  media_type_snapshot text not null,
  source_ordinal_snapshot integer not null,
  page_number_snapshot integer,
  start_line_snapshot integer,
  end_line_snapshot integer,
  created_at timestamptz not null default timezone('utc', now()),
  constraint message_citations_workspace_message_fk
    foreign key (workspace_id, conversation_id, message_id)
    references public.messages(workspace_id, conversation_id, id)
    on delete cascade,
  constraint message_citations_order_nonnegative check (citation_order >= 0),
  constraint message_citations_label_format check (label ~ '^S[1-9][0-9]*$'),
  constraint message_citations_file_name_length check (
    char_length(file_name_snapshot) between 1 and 255
  ),
  constraint message_citations_media_type_length check (
    char_length(media_type_snapshot) between 1 and 255
  ),
  constraint message_citations_source_ordinal_nonnegative check (
    source_ordinal_snapshot >= 0
  ),
  constraint message_citations_page_positive check (
    page_number_snapshot is null or page_number_snapshot > 0
  ),
  constraint message_citations_start_line_positive check (
    start_line_snapshot is null or start_line_snapshot > 0
  ),
  constraint message_citations_end_line_positive check (
    end_line_snapshot is null or end_line_snapshot > 0
  ),
  constraint message_citations_line_order check (
    start_line_snapshot is null
    or end_line_snapshot is null
    or end_line_snapshot >= start_line_snapshot
  ),
  constraint message_citations_message_order_unique
    unique (message_id, citation_order),
  constraint message_citations_message_label_unique
    unique (message_id, label),
  constraint message_citations_message_source_unique
    unique (message_id, source_id)
);

create index message_citations_message_order_idx
  on public.message_citations(message_id, citation_order);
create index message_citations_source_idx
  on public.message_citations(source_id)
  where source_id is not null;
create index message_citations_attachment_idx
  on public.message_citations(attachment_id)
  where attachment_id is not null;

alter table public.message_citations enable row level security;

create policy message_citations_select_member
on public.message_citations
for select
to authenticated
using (public.is_workspace_member(workspace_id));

revoke insert, update, delete on public.message_citations from authenticated;
grant select on public.message_citations to authenticated;

create or replace function public.set_generation_grounding_context(
  target_workspace_id uuid,
  target_conversation_id uuid,
  target_message_id uuid,
  target_generation_id uuid,
  requested_grounding_mode text,
  retrieved_sources integer
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if requested_grounding_mode not in ('off', 'workspace_sources') then
    raise exception 'invalid grounding mode';
  end if;

  if retrieved_sources < 0 or retrieved_sources > 20 then
    raise exception 'retrieved source count is outside the supported range';
  end if;

  if requested_grounding_mode = 'off' and retrieved_sources <> 0 then
    raise exception 'ungrounded generations cannot record retrieved sources';
  end if;

  update public.message_generations generation
  set
    grounding_mode = requested_grounding_mode,
    retrieved_source_count = retrieved_sources,
    citation_count = 0
  where generation.workspace_id = target_workspace_id
    and generation.conversation_id = target_conversation_id
    and generation.message_id = target_message_id
    and generation.id = target_generation_id
    and generation.created_by = auth.uid()
    and generation.status in ('pending', 'streaming');

  if not found then
    raise exception 'generation grounding context could not be updated';
  end if;
end;
$$;

create or replace function public.finish_grounded_conversation_generation(
  target_workspace_id uuid,
  target_conversation_id uuid,
  target_message_id uuid,
  target_generation_id uuid,
  final_content text,
  returned_provider_model text default null,
  provider_response_identifier text default null,
  provider_input_tokens integer default null,
  provider_output_tokens integer default null,
  provider_reasoning_tokens integer default null,
  provider_total_tokens integer default null,
  first_token_ms integer default null,
  total_latency_ms integer default null,
  cited_sources jsonb default '[]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  citation_total integer;
  distinct_label_total integer;
  distinct_source_total integer;
  generation_retrieved_count integer;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if jsonb_typeof(cited_sources) <> 'array' then
    raise exception 'grounded citations must be an array';
  end if;

  select generation.retrieved_source_count
  into generation_retrieved_count
  from public.message_generations generation
  where generation.workspace_id = target_workspace_id
    and generation.conversation_id = target_conversation_id
    and generation.message_id = target_message_id
    and generation.id = target_generation_id
    and generation.created_by = auth.uid()
    and generation.grounding_mode = 'workspace_sources'
    and generation.status in ('pending', 'streaming')
  for update;

  if not found then
    raise exception 'grounded generation is not active';
  end if;

  select
    count(*)::integer,
    count(distinct citation.label)::integer,
    count(distinct citation.source_id)::integer
  into
    citation_total,
    distinct_label_total,
    distinct_source_total
  from jsonb_to_recordset(cited_sources) as citation(
    citation_order integer,
    label text,
    source_id uuid
  );

  if citation_total < 1
    or citation_total > 20
    or citation_total > generation_retrieved_count then
    raise exception 'grounded citation count is invalid';
  end if;

  if distinct_label_total <> citation_total
    or distinct_source_total <> citation_total then
    raise exception 'grounded citation labels and sources must be unique';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(cited_sources) as citation(
      citation_order integer,
      label text,
      source_id uuid
    )
    where citation.citation_order is null
      or citation.citation_order < 0
      or citation.label is null
      or citation.label !~ '^S[1-9][0-9]*$'
      or citation.source_id is null
  ) then
    raise exception 'one or more grounded citations are invalid';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(cited_sources) as citation(
      citation_order integer,
      label text,
      source_id uuid
    )
    left join public.sources source
      on source.id = citation.source_id
      and source.workspace_id = target_workspace_id
    left join public.attachments attachment
      on attachment.id = source.attachment_id
      and attachment.workspace_id = source.workspace_id
    where source.id is null
      or attachment.id is null
      or attachment.status <> 'ready'
      or attachment.deleted_at is not null
  ) then
    raise exception 'one or more grounded sources are unavailable';
  end if;

  perform public.finish_conversation_generation(
    target_workspace_id,
    target_conversation_id,
    target_message_id,
    target_generation_id,
    'complete',
    final_content,
    returned_provider_model,
    provider_response_identifier,
    provider_input_tokens,
    provider_output_tokens,
    provider_reasoning_tokens,
    provider_total_tokens,
    first_token_ms,
    total_latency_ms,
    null,
    null
  );

  delete from public.message_citations citation
  where citation.workspace_id = target_workspace_id
    and citation.conversation_id = target_conversation_id
    and citation.message_id = target_message_id;

  insert into public.message_citations (
    workspace_id,
    conversation_id,
    message_id,
    source_id,
    attachment_id,
    citation_order,
    label,
    file_name_snapshot,
    media_type_snapshot,
    source_ordinal_snapshot,
    page_number_snapshot,
    start_line_snapshot,
    end_line_snapshot
  )
  select
    target_workspace_id,
    target_conversation_id,
    target_message_id,
    source.id,
    attachment.id,
    citation.citation_order,
    citation.label,
    attachment.file_name,
    attachment.media_type,
    source.ordinal,
    source.page_number,
    source.start_line,
    source.end_line
  from jsonb_to_recordset(cited_sources) as citation(
    citation_order integer,
    label text,
    source_id uuid
  )
  join public.sources source
    on source.id = citation.source_id
    and source.workspace_id = target_workspace_id
  join public.attachments attachment
    on attachment.id = source.attachment_id
    and attachment.workspace_id = source.workspace_id
  order by citation.citation_order;

  update public.message_generations generation
  set citation_count = citation_total
  where generation.workspace_id = target_workspace_id
    and generation.conversation_id = target_conversation_id
    and generation.message_id = target_message_id
    and generation.id = target_generation_id;
end;
$$;

revoke all on function public.set_generation_grounding_context(
  uuid, uuid, uuid, uuid, text, integer
) from public;
revoke all on function public.finish_grounded_conversation_generation(
  uuid, uuid, uuid, uuid, text, text, text, integer, integer, integer,
  integer, integer, integer, jsonb
) from public;

grant execute on function public.set_generation_grounding_context(
  uuid, uuid, uuid, uuid, text, integer
) to authenticated;
grant execute on function public.finish_grounded_conversation_generation(
  uuid, uuid, uuid, uuid, text, text, text, integer, integer, integer,
  integer, integer, integer, jsonb
) to authenticated;

commit;
