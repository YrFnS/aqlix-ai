\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('91111111-1111-4111-8111-111111111111', 'p4-owner@example.test'),
  ('92222222-2222-4222-8222-222222222222', 'p4-editor@example.test'),
  ('93333333-3333-4333-8333-333333333333', 'p4-viewer@example.test'),
  ('94444444-4444-4444-8444-444444444444', 'p4-outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '91111111-1111-4111-8111-111111111111',
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
  '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '91111111-1111-4111-8111-111111111111',
  'مساحة مسودات P4',
  'Durable draft lifecycle fixture',
  'auto'
);

insert into public.workspace_members (workspace_id, user_id, role)
values
  (
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '92222222-2222-4222-8222-222222222222',
    'editor'
  ),
  (
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '93333333-3333-4333-8333-333333333333',
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
  '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '91111111-1111-4111-8111-111111111111',
  'قرار P4',
  'active'
);

-- Build one real ready source and one completed grounded assistant message.
do $$
declare
  begun record;
begin
  select *
  into begun
  from public.begin_attachment_processing(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'قرار P4.md',
    'text/markdown',
    180,
    repeat('f', 64),
    'kiteb-text',
    '1.0.0'
  );

  perform public.finalize_attachment_processing(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    begun.attachment_id,
    begun.processing_run_id,
    120,
    jsonb_build_array(
      jsonb_build_object(
        'ordinal', 0,
        'content', 'قرار P4 يحدد أن الإطلاق في 2026 مع English roadmap ومراجعة أسبوعية.',
        'page_number', null,
        'start_offset', 0,
        'end_offset', 70,
        'start_line', 1,
        'end_line', 1
      )
    )
  );

  perform set_config('p4.attachment_id', begun.attachment_id::text, false);

  select source.id::text
  into strict begun.object_path
  from public.sources source
  where source.attachment_id = begun.attachment_id
    and source.ordinal = 0;

  perform set_config('p4.source_id', begun.object_path, false);
end;
$$;

do $$
declare
  turn record;
begin
  select *
  into turn
  from public.begin_conversation_turn(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'ما هو قرار الإطلاق؟',
    'auto',
    'fixture',
    'fixture-bilingual-v1',
    null
  );

  perform public.set_generation_grounding_context(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'workspace_sources',
    1
  );

  perform public.finish_grounded_conversation_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    turn.assistant_message_id,
    turn.generation_id,
    'سيكون الإطلاق في 2026 مع مراجعة أسبوعية [S1].',
    'fixture-bilingual-v1',
    'fixture_p4_grounded',
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
        'source_id', current_setting('p4.source_id')::uuid
      )
    )
  );

  perform set_config('p4.message_id', turn.assistant_message_id::text, false);
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '92222222-2222-4222-8222-222222222222',
  false
);

-- Direct table mutation is no longer part of the authenticated product surface.
do $$
begin
  begin
    insert into public.drafts (
      workspace_id,
      created_by,
      title,
      content,
      direction,
      status
    )
    values (
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '92222222-2222-4222-8222-222222222222',
      'bypass',
      'bypass',
      'auto',
      'active'
    );
    raise exception 'direct draft insert unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Create one durable draft and atomically copy its source provenance.
do $$
declare
  created record;
begin
  select *
  into created
  from public.create_draft_from_message(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    current_setting('p4.message_id')::uuid,
    'memo',
    'مذكرة — قرار P4',
    '# مذكرة\n\nسيكون الإطلاق في 2026 مع مراجعة أسبوعية [S1].',
    'auto'
  );

  if created.current_version <> 1 or created.provenance_count <> 1 then
    raise exception 'initial draft counters are invalid';
  end if;

  perform set_config('p4.draft_id', created.draft_id::text, false);
end;
$$;

do $$
begin
  if not exists (
    select 1
    from public.drafts draft
    where draft.id = current_setting('p4.draft_id')::uuid
      and draft.workspace_id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
      and draft.created_by = '92222222-2222-4222-8222-222222222222'
      and draft.conversation_id = '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
      and draft.origin_message_id = current_setting('p4.message_id')::uuid
      and draft.kind = 'memo'
      and draft.status = 'active'
      and draft.current_version = 1
      and draft.version_count = 1
      and draft.provenance_count = 1
      and draft.last_saved_at is not null
  ) then
    raise exception 'current draft state is invalid';
  end if;

  if not exists (
    select 1
    from public.draft_versions version
    where version.draft_id = current_setting('p4.draft_id')::uuid
      and version.version_number = 1
      and version.source_kind = 'initial'
      and version.kind = 'memo'
      and version.generation_id is null
      and version.restored_from_version is null
  ) then
    raise exception 'initial immutable version is invalid';
  end if;

  if not exists (
    select 1
    from public.draft_provenance provenance
    where provenance.draft_id = current_setting('p4.draft_id')::uuid
      and provenance.origin_message_id = current_setting('p4.message_id')::uuid
      and provenance.source_id = current_setting('p4.source_id')::uuid
      and provenance.attachment_id = current_setting('p4.attachment_id')::uuid
      and provenance.citation_order = 0
      and provenance.label = 'S1'
      and provenance.file_name_snapshot = 'قرار P4.md'
      and provenance.media_type_snapshot = 'text/markdown'
      and provenance.source_ordinal_snapshot = 0
      and provenance.start_line_snapshot = 1
      and provenance.end_line_snapshot = 1
  ) then
    raise exception 'draft provenance snapshot is invalid';
  end if;
end;
$$;

-- An identical save is a no-op and does not manufacture a version.
do $$
declare
  saved record;
begin
  select *
  into saved
  from public.save_draft_version(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    1,
    'مذكرة — قرار P4',
    '# مذكرة\n\nسيكون الإطلاق في 2026 مع مراجعة أسبوعية [S1].',
    'auto',
    'memo',
    'manual',
    null
  );

  if saved.version_number <> 1 or saved.created then
    raise exception 'identical save created an unnecessary version';
  end if;
end;
$$;

-- A real manual change creates version two.
do $$
declare
  saved record;
begin
  select *
  into saved
  from public.save_draft_version(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    1,
    'مذكرة — قرار P4 محدثة',
    '# مذكرة\n\nنسخة عربية and English محدثة في 2026 [S1].',
    'auto',
    'memo',
    'manual',
    null
  );

  if saved.version_number <> 2 or not saved.created then
    raise exception 'manual save did not create version two';
  end if;
end;
$$;

-- A stale editor cannot overwrite a newer accepted version.
do $$
begin
  begin
    perform public.save_draft_version(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p4.draft_id')::uuid,
      1,
      'stale title',
      'stale content',
      'auto',
      'freeform',
      'manual',
      null
    );
    raise exception 'stale draft save unexpectedly succeeded';
  exception
    when serialization_failure then null;
  end;
end;
$$;

-- Restoring version one creates version three instead of rewriting history.
do $$
declare
  restored record;
begin
  select *
  into restored
  from public.save_draft_version(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    2,
    'مذكرة — قرار P4',
    '# مذكرة\n\nسيكون الإطلاق في 2026 مع مراجعة أسبوعية [S1].',
    'auto',
    'memo',
    'restored',
    1
  );

  if restored.version_number <> 3 or not restored.created then
    raise exception 'version restore did not create version three';
  end if;

  if not exists (
    select 1
    from public.draft_versions version
    where version.draft_id = current_setting('p4.draft_id')::uuid
      and version.version_number = 3
      and version.source_kind = 'restored'
      and version.restored_from_version = 1
  ) then
    raise exception 'restored version metadata is invalid';
  end if;
end;
$$;

-- Complete and apply one AI proposal as immutable version four.
do $$
declare
  begun record;
  applied_version integer;
begin
  select *
  into begun
  from public.begin_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    'improve',
    'Improve clarity and preserve [S1].',
    'fixture',
    'fixture-bilingual-v1'
  );

  if begun.base_version <> 3 then
    raise exception 'proposal did not snapshot the current version';
  end if;

  perform public.checkpoint_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id,
    'اقتراح جزئي [S1]',
    40
  );

  perform public.finish_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id,
    'complete',
    'اقتراح محسّن كامل يحافظ على المرجع [S1].',
    'fixture-bilingual-v1',
    'fixture_p4_apply',
    10,
    12,
    0,
    22,
    40,
    210,
    null,
    null
  );

  applied_version := public.apply_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id
  );

  if applied_version <> 4 then
    raise exception 'proposal did not apply as version four';
  end if;

  perform set_config('p4.applied_generation_id', begun.generation_id::text, false);
end;
$$;

do $$
begin
  if not exists (
    select 1
    from public.drafts draft
    where draft.id = current_setting('p4.draft_id')::uuid
      and draft.current_version = 4
      and draft.version_count = 4
      and draft.content = 'اقتراح محسّن كامل يحافظ على المرجع [S1].'
  ) then
    raise exception 'accepted draft did not move to applied content';
  end if;

  if not exists (
    select 1
    from public.draft_versions version
    where version.draft_id = current_setting('p4.draft_id')::uuid
      and version.version_number = 4
      and version.source_kind = 'ai'
      and version.generation_id = current_setting('p4.applied_generation_id')::uuid
  ) then
    raise exception 'AI version metadata is invalid';
  end if;

  if not exists (
    select 1
    from public.draft_generations generation
    where generation.id = current_setting('p4.applied_generation_id')::uuid
      and generation.status = 'applied'
      and generation.input_tokens = 10
      and generation.output_tokens = 12
      and generation.total_tokens = 22
      and generation.first_token_latency_ms = 40
      and generation.latency_ms = 210
      and generation.applied_at is not null
  ) then
    raise exception 'applied proposal telemetry is invalid';
  end if;
end;
$$;

-- Discard leaves accepted work unchanged.
do $$
declare
  begun record;
  discarded boolean;
begin
  select *
  into begun
  from public.begin_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    'shorten',
    'Shorten the draft.',
    'fixture',
    'fixture-bilingual-v1'
  );

  perform public.finish_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id,
    'complete',
    'اقتراح قصير [S1].',
    'fixture-bilingual-v1',
    'fixture_p4_discard',
    null,
    null,
    null,
    null,
    null,
    100,
    null,
    null
  );

  discarded := public.discard_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id
  );

  if not discarded then
    raise exception 'completed proposal was not discarded';
  end if;

  if (
    select draft.current_version
    from public.drafts draft
    where draft.id = current_setting('p4.draft_id')::uuid
  ) <> 4 then
    raise exception 'discard changed the accepted draft';
  end if;
end;
$$;

-- Cancellation preserves partial proposed content without changing the draft.
do $$
declare
  begun record;
begin
  select *
  into begun
  from public.begin_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    'continue',
    'Continue slowly.',
    'fixture',
    'fixture-bilingual-v1'
  );

  perform public.checkpoint_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id,
    'نص جزئي محفوظ',
    25
  );

  perform public.finish_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id,
    'cancelled',
    'نص جزئي محفوظ',
    null,
    null,
    null,
    null,
    null,
    null,
    25,
    80,
    'STREAM_CANCELLED',
    'Draft continuation was cancelled by the user.'
  );

  if not exists (
    select 1
    from public.draft_generations generation
    where generation.id = begun.generation_id
      and generation.status = 'cancelled'
      and generation.proposed_content = 'نص جزئي محفوظ'
      and generation.failure_code = 'STREAM_CANCELLED'
  ) then
    raise exception 'cancelled proposal was not preserved';
  end if;
end;
$$;

-- A proposal based on version four cannot overwrite a later manual version five.
do $$
declare
  begun record;
  saved record;
begin
  select *
  into begun
  from public.begin_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    'expand',
    'Expand the accepted draft.',
    'fixture',
    'fixture-bilingual-v1'
  );

  if begun.base_version <> 4 then
    raise exception 'stale-base fixture did not begin at version four';
  end if;

  select *
  into saved
  from public.save_draft_version(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    4,
    'مذكرة — قرار P4 بعد تعديل يدوي',
    'تعديل يدوي أحدث من الاقتراح [S1].',
    'auto',
    'memo',
    'manual',
    null
  );

  if saved.version_number <> 5 then
    raise exception 'manual change did not create version five';
  end if;

  perform public.finish_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id,
    'complete',
    'اقتراح متأخر يجب رفض تطبيقه [S1].',
    'fixture-bilingual-v1',
    'fixture_p4_stale',
    null,
    null,
    null,
    null,
    null,
    120,
    null,
    null
  );

  begin
    perform public.apply_draft_generation(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p4.draft_id')::uuid,
      begun.generation_id
    );
    raise exception 'stale proposal unexpectedly applied';
  exception
    when serialization_failure then null;
  end;

  perform public.discard_draft_generation(
    '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    current_setting('p4.draft_id')::uuid,
    begun.generation_id
  );

  if not exists (
    select 1
    from public.drafts draft
    where draft.id = current_setting('p4.draft_id')::uuid
      and draft.current_version = 5
      and draft.content = 'تعديل يدوي أحدث من الاقتراح [S1].'
  ) then
    raise exception 'stale proposal changed accepted work';
  end if;
end;
$$;

-- Viewer can inspect all durable history but cannot mutate or invoke the provider path.
select set_config(
  'request.jwt.claim.sub',
  '93333333-3333-4333-8333-333333333333',
  false
);

do $$
begin
  if not exists (
    select 1
    from public.drafts draft
    where draft.id = current_setting('p4.draft_id')::uuid
      and draft.current_version = 5
  ) then
    raise exception 'viewer cannot read current draft';
  end if;

  if (
    select count(*)
    from public.draft_versions version
    where version.draft_id = current_setting('p4.draft_id')::uuid
  ) <> 5 then
    raise exception 'viewer cannot read immutable versions';
  end if;

  if not exists (
    select 1
    from public.draft_provenance provenance
    where provenance.draft_id = current_setting('p4.draft_id')::uuid
      and provenance.label = 'S1'
  ) then
    raise exception 'viewer cannot read provenance';
  end if;

  if not exists (
    select 1
    from public.draft_generations generation
    where generation.draft_id = current_setting('p4.draft_id')::uuid
  ) then
    raise exception 'viewer cannot read proposal history';
  end if;

  begin
    perform public.save_draft_version(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p4.draft_id')::uuid,
      5,
      'viewer',
      'viewer',
      'auto',
      'freeform',
      'manual',
      null
    );
    raise exception 'viewer save unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.begin_draft_generation(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p4.draft_id')::uuid,
      'improve',
      'viewer proposal',
      'fixture',
      'fixture-bilingual-v1'
    );
    raise exception 'viewer proposal unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Outsider cannot infer any draft-owned row.
select set_config(
  'request.jwt.claim.sub',
  '94444444-4444-4444-8444-444444444444',
  false
);

do $$
begin
  if exists (
    select 1
    from public.drafts draft
    where draft.workspace_id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read drafts';
  end if;

  if exists (
    select 1
    from public.draft_versions version
    where version.workspace_id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read versions';
  end if;

  if exists (
    select 1
    from public.draft_provenance provenance
    where provenance.workspace_id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read provenance';
  end if;

  if exists (
    select 1
    from public.draft_generations generation
    where generation.workspace_id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read proposals';
  end if;
end;
$$;

-- Archived drafts are readable but reject save and proposal creation.
select set_config(
  'request.jwt.claim.sub',
  '92222222-2222-4222-8222-222222222222',
  false
);

select public.set_draft_archived(
  '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p4.draft_id')::uuid,
  true
);

do $$
begin
  if not exists (
    select 1
    from public.drafts draft
    where draft.id = current_setting('p4.draft_id')::uuid
      and draft.status = 'archived'
      and draft.archived_at is not null
  ) then
    raise exception 'draft was not archived consistently';
  end if;

  begin
    perform public.save_draft_version(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p4.draft_id')::uuid,
      5,
      'archived',
      'archived',
      'auto',
      'freeform',
      'manual',
      null
    );
    raise exception 'archived draft save unexpectedly succeeded';
  exception
    when others then
      if sqlerrm = 'archived draft save unexpectedly succeeded' then
        raise;
      end if;
  end;

  begin
    perform public.begin_draft_generation(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p4.draft_id')::uuid,
      'improve',
      'archived proposal',
      'fixture',
      'fixture-bilingual-v1'
    );
    raise exception 'archived draft proposal unexpectedly succeeded';
  exception
    when others then
      if sqlerrm = 'archived draft proposal unexpectedly succeeded' then
        raise;
      end if;
  end;
end;
$$;

select public.set_draft_archived(
  '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p4.draft_id')::uuid,
  false
);

-- Archived workspaces reject all draft mutations.
select set_config(
  'request.jwt.claim.sub',
  '91111111-1111-4111-8111-111111111111',
  false
);

update public.workspaces
set archived_at = timezone('utc', now())
where id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

select set_config(
  'request.jwt.claim.sub',
  '92222222-2222-4222-8222-222222222222',
  false
);

do $$
begin
  begin
    perform public.save_draft_version(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p4.draft_id')::uuid,
      5,
      'workspace archived',
      'workspace archived',
      'auto',
      'freeform',
      'manual',
      null
    );
    raise exception 'archived workspace draft save unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.create_draft_from_message(
      '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      current_setting('p4.message_id')::uuid,
      'summary',
      'archived workspace',
      'archived workspace',
      'auto'
    );
    raise exception 'archived workspace draft creation unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '91111111-1111-4111-8111-111111111111',
  false
);

update public.workspaces
set archived_at = null
where id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

-- Deleting the original source preserves an honest draft provenance snapshot.
select set_config(
  'request.jwt.claim.sub',
  '92222222-2222-4222-8222-222222222222',
  false
);

select public.delete_attachment_record(
  '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p4.attachment_id')::uuid
);

do $$
begin
  if not exists (
    select 1
    from public.draft_provenance provenance
    where provenance.draft_id = current_setting('p4.draft_id')::uuid
      and provenance.source_id is null
      and provenance.attachment_id is null
      and provenance.label = 'S1'
      and provenance.file_name_snapshot = 'قرار P4.md'
      and provenance.start_line_snapshot = 1
      and provenance.end_line_snapshot = 1
  ) then
    raise exception 'deleted source draft snapshot was not preserved';
  end if;
end;
$$;

-- Deleting the origin conversation keeps the reusable draft and nulls live origin IDs.
delete from public.conversations
where id = '9bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

do $$
begin
  if not exists (
    select 1
    from public.drafts draft
    where draft.id = current_setting('p4.draft_id')::uuid
      and draft.conversation_id is null
      and draft.origin_message_id is null
      and draft.current_version = 5
  ) then
    raise exception 'draft did not survive origin conversation deletion honestly';
  end if;

  if not exists (
    select 1
    from public.draft_provenance provenance
    where provenance.draft_id = current_setting('p4.draft_id')::uuid
      and provenance.conversation_id is null
      and provenance.origin_message_id is null
      and provenance.file_name_snapshot = 'قرار P4.md'
  ) then
    raise exception 'provenance snapshot did not survive conversation deletion';
  end if;
end;
$$;

-- Deleting the draft cascades every P4-owned child row.
select public.delete_draft_record(
  '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p4.draft_id')::uuid
);

do $$
begin
  if exists (
    select 1 from public.draft_versions
    where draft_id = current_setting('p4.draft_id')::uuid
  ) then
    raise exception 'draft versions did not cascade';
  end if;

  if exists (
    select 1 from public.draft_provenance
    where draft_id = current_setting('p4.draft_id')::uuid
  ) then
    raise exception 'draft provenance did not cascade';
  end if;

  if exists (
    select 1 from public.draft_generations
    where draft_id = current_setting('p4.draft_id')::uuid
  ) then
    raise exception 'draft generations did not cascade';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '91111111-1111-4111-8111-111111111111',
  false
);

delete from public.workspaces
where id = '9aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

reset role;
