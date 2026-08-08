\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('81111111-1111-4111-8111-111111111111', 'p3-ground-owner@example.test'),
  ('82222222-2222-4222-8222-222222222222', 'p3-ground-viewer@example.test'),
  ('83333333-3333-4333-8333-333333333333', 'p3-ground-outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '81111111-1111-4111-8111-111111111111',
  false
);

insert into public.workspaces (
  id,
  owner_id,
  name,
  description,
  default_language
)
values (
  '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '81111111-1111-4111-8111-111111111111',
  'مساحة مراجع P3',
  'Grounded citation lifecycle fixture',
  'auto'
);

insert into public.workspace_members (workspace_id, user_id, role)
values (
  '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '82222222-2222-4222-8222-222222222222',
  'viewer'
);

insert into public.conversations (
  id,
  workspace_id,
  created_by,
  title,
  status
)
values (
  '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '81111111-1111-4111-8111-111111111111',
  'محادثة موثقة',
  'active'
);

do $$
declare
  begun record;
begin
  select *
  into begun
  from public.begin_attachment_processing(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'قرار المراجعة.md',
    'text/markdown',
    200,
    repeat('e', 64),
    'kiteb-text',
    '1.0.0'
  );

  perform public.finalize_attachment_processing(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    begun.attachment_id,
    begun.processing_run_id,
    120,
    jsonb_build_array(
      jsonb_build_object(
        'ordinal', 0,
        'content', 'قرار المراجعة يثبت أن الإطلاق سيكون في 2026 مع English roadmap.',
        'page_number', null,
        'start_offset', 0,
        'end_offset', 65,
        'start_line', 1,
        'end_line', 1
      )
    )
  );

  perform set_config('p3.ground_attachment_id', begun.attachment_id::text, false);

  select source.id::text
  into strict begun.object_path
  from public.sources source
  where source.attachment_id = begun.attachment_id
    and source.ordinal = 0;

  perform set_config('p3.ground_source_id', begun.object_path, false);
end;
$$;

do $$
declare
  turn record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'متى سيكون الإطلاق؟',
    'auto',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  perform public.set_generation_grounding_context(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'workspace_sources',
    1
  );

  perform public.finish_grounded_conversation_generation(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'سيكون الإطلاق في 2026 وفق القرار المحفوظ [S1].',
    'fixture-bilingual-v1',
    'fixture_grounded_1',
    12,
    18,
    0,
    30,
    20,
    90,
    jsonb_build_array(
      jsonb_build_object(
        'citation_order', 0,
        'label', 'S1',
        'source_id', current_setting('p3.ground_source_id')::uuid
      )
    )
  );

  perform set_config('p3.ground_message_id', turn.assistant_message_id::text, false);
  perform set_config('p3.ground_generation_id', turn.generation_id::text, false);
end;
$$;

do $$
begin
  if not exists (
    select 1
    from public.messages message
    where message.id = current_setting('p3.ground_message_id')::uuid
      and message.status = 'complete'
      and message.content like '%[S1]%'
  ) then
    raise exception 'grounded assistant message was not completed';
  end if;

  if not exists (
    select 1
    from public.message_generations generation
    where generation.id = current_setting('p3.ground_generation_id')::uuid
      and generation.status = 'complete'
      and generation.grounding_mode = 'workspace_sources'
      and generation.retrieved_source_count = 1
      and generation.citation_count = 1
  ) then
    raise exception 'grounding telemetry was not persisted';
  end if;

  if not exists (
    select 1
    from public.message_citations citation
    where citation.message_id = current_setting('p3.ground_message_id')::uuid
      and citation.source_id = current_setting('p3.ground_source_id')::uuid
      and citation.attachment_id = current_setting('p3.ground_attachment_id')::uuid
      and citation.citation_order = 0
      and citation.label = 'S1'
      and citation.file_name_snapshot = 'قرار المراجعة.md'
      and citation.media_type_snapshot = 'text/markdown'
      and citation.source_ordinal_snapshot = 0
      and citation.page_number_snapshot is null
      and citation.start_line_snapshot = 1
      and citation.end_line_snapshot = 1
  ) then
    raise exception 'citation target or snapshot metadata is invalid';
  end if;
end;
$$;

-- Direct citation mutation is not part of the authenticated application surface.
do $$
begin
  begin
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
      source_ordinal_snapshot
    )
    values (
      '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      current_setting('p3.ground_message_id')::uuid,
      current_setting('p3.ground_source_id')::uuid,
      current_setting('p3.ground_attachment_id')::uuid,
      1,
      'S2',
      'bypass.txt',
      'text/plain',
      0
    );
    raise exception 'direct citation insert unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- A grounded completion without a citation rolls back and remains retryable.
do $$
declare
  turn record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'اختبار غياب المرجع',
    'auto',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  perform public.set_generation_grounding_context(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'workspace_sources',
    1
  );

  begin
    perform public.finish_grounded_conversation_generation(
      '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      turn.assistant_message_id,
      turn.generation_id,
      'إجابة بلا مرجع',
      'fixture-bilingual-v1',
      'fixture_missing_citation',
      null,
      null,
      null,
      null,
      null,
      null,
      '[]'::jsonb
    );
    raise exception 'citation-free grounded completion unexpectedly succeeded';
  exception
    when others then
      if sqlerrm = 'citation-free grounded completion unexpectedly succeeded' then
        raise;
      end if;
  end;

  if not exists (
    select 1
    from public.message_generations generation
    where generation.id = turn.generation_id
      and generation.status = 'pending'
      and generation.citation_count = 0
  ) then
    raise exception 'failed grounded transaction did not roll back';
  end if;

  perform public.finish_conversation_generation(
    '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'failed',
    'إجابة بلا مرجع',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    'CITATION_REQUIRED',
    'A grounded response completed without a valid source citation.'
  );
end;
$$;

-- Viewer can read the citation, while an outsider cannot infer it.
select set_config(
  'request.jwt.claim.sub',
  '82222222-2222-4222-8222-222222222222',
  false
);

do $$
begin
  if not exists (
    select 1
    from public.message_citations citation
    where citation.message_id = current_setting('p3.ground_message_id')::uuid
      and citation.label = 'S1'
  ) then
    raise exception 'viewer cannot read grounded citation metadata';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '83333333-3333-4333-8333-333333333333',
  false
);

do $$
begin
  if exists (
    select 1
    from public.message_citations citation
    where citation.workspace_id = '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read grounded citation metadata';
  end if;
end;
$$;

-- Deleting the original object metadata preserves an honest citation snapshot.
select set_config(
  'request.jwt.claim.sub',
  '81111111-1111-4111-8111-111111111111',
  false
);

select public.delete_attachment_record(
  '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p3.ground_attachment_id')::uuid
);

do $$
begin
  if not exists (
    select 1
    from public.message_citations citation
    where citation.message_id = current_setting('p3.ground_message_id')::uuid
      and citation.source_id is null
      and citation.attachment_id is null
      and citation.file_name_snapshot = 'قرار المراجعة.md'
      and citation.label = 'S1'
  ) then
    raise exception 'deleted source citation snapshot was not preserved';
  end if;
end;
$$;

delete from public.workspaces
where id = '8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

reset role;
