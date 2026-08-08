\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('71111111-1111-4111-8111-111111111111', 'p3-owner@example.test'),
  ('72222222-2222-4222-8222-222222222222', 'p3-editor@example.test'),
  ('73333333-3333-4333-8333-333333333333', 'p3-viewer@example.test'),
  ('74444444-4444-4444-8444-444444444444', 'p3-outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '71111111-1111-4111-8111-111111111111',
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
  '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '71111111-1111-4111-8111-111111111111',
  'مساحة مصادر P3',
  'Document source lifecycle fixture',
  'auto'
);

insert into public.workspace_members (workspace_id, user_id, role)
values
  (
    '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '72222222-2222-4222-8222-222222222222',
    'editor'
  ),
  (
    '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '73333333-3333-4333-8333-333333333333',
    'viewer'
  );

select set_config(
  'request.jwt.claim.sub',
  '72222222-2222-4222-8222-222222222222',
  false
);

-- Direct editor writes are intentionally removed. Document lifecycle mutations
-- must pass through the bounded security-definer functions.
do $$
begin
  begin
    insert into public.attachments (
      workspace_id,
      uploaded_by,
      file_name,
      media_type,
      byte_size,
      storage_path,
      status
    )
    values (
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '72222222-2222-4222-8222-222222222222',
      'bypass.txt',
      'text/plain',
      10,
      'bypass/path',
      'ready'
    );
    raise exception 'direct attachment insert unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    insert into public.sources (
      workspace_id,
      attachment_id,
      ordinal,
      content
    )
    values (
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      gen_random_uuid(),
      0,
      'bypass source'
    );
    raise exception 'direct source insert unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

do $$
declare
  begun record;
begin
  select *
  into begun
  from public.begin_attachment_processing(
    '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'قرار المشروع.md',
    'text/markdown',
    320,
    repeat('a', 64),
    'kiteb-text',
    '1.0.0'
  );

  if begun.attachment_id is null
    or begun.processing_run_id is null
    or begun.object_path <> concat(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/',
      begun.attachment_id::text,
      '/document.md'
    ) then
    raise exception 'generated attachment identity or storage path is invalid';
  end if;

  if position('قرار' in begun.object_path) > 0 then
    raise exception 'user filename leaked into object path';
  end if;

  perform set_config('p3.attachment_id', begun.attachment_id::text, false);
  perform set_config('p3.processing_run_id', begun.processing_run_id::text, false);
  perform set_config('p3.object_path', begun.object_path, false);
end;
$$;

select public.finalize_attachment_processing(
  '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p3.attachment_id')::uuid,
  current_setting('p3.processing_run_id')::uuid,
  140,
  jsonb_build_array(
    jsonb_build_object(
      'ordinal', 0,
      'content', 'قرار المشروع يحدد الأولويات العربية وEnglish roadmap 2026.',
      'page_number', null,
      'start_offset', 0,
      'end_offset', 58,
      'start_line', 1,
      'end_line', 1
    ),
    jsonb_build_object(
      'ordinal', 1,
      'content', 'المسؤول عن التنفيذ هو فريق المنصة مع مراجعة أسبوعية.',
      'page_number', null,
      'start_offset', 60,
      'end_offset', 112,
      'start_line', 3,
      'end_line', 3
    )
  )
);

do $$
begin
  if not exists (
    select 1
    from public.attachments
    where id = current_setting('p3.attachment_id')::uuid
      and workspace_id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
      and uploaded_by = '72222222-2222-4222-8222-222222222222'
      and status = 'ready'
      and content_sha256 = repeat('a', 64)
      and processor_version = '1.0.0'
      and source_count = 2
      and processed_at is not null
  ) then
    raise exception 'ready attachment metadata is invalid';
  end if;

  if not exists (
    select 1
    from public.attachment_processing_runs
    where id = current_setting('p3.processing_run_id')::uuid
      and status = 'complete'
      and source_count = 2
      and character_count = 140
      and completed_at is not null
  ) then
    raise exception 'processing attempt was not completed';
  end if;

  if (
    select count(*)
    from public.sources
    where attachment_id = current_setting('p3.attachment_id')::uuid
  ) <> 2 then
    raise exception 'source passages were not finalized';
  end if;

  if not exists (
    select 1
    from public.sources
    where attachment_id = current_setting('p3.attachment_id')::uuid
      and ordinal = 0
      and page_number is null
      and start_line = 1
      and end_line = 1
      and start_offset = 0
      and end_offset = 58
      and search_vector @@ websearch_to_tsquery('simple', 'قرار')
  ) then
    raise exception 'source locator or generated search vector is invalid';
  end if;
end;
$$;

-- The active hash index closes concurrent duplicate races.
do $$
begin
  begin
    perform public.begin_attachment_processing(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'duplicate.txt',
      'text/plain',
      320,
      repeat('a', 64),
      'kiteb-text',
      '1.0.0'
    );
    raise exception 'active duplicate unexpectedly succeeded';
  exception
    when unique_violation then null;
  end;
end;
$$;

-- A failed record releases its hash so a clean upload can be attempted again.
do $$
declare
  failed_begin record;
  retry_begin record;
begin
  select *
  into failed_begin
  from public.begin_attachment_processing(
    '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'retry.txt',
    'text/plain',
    50,
    repeat('b', 64),
    'kiteb-text',
    '1.0.0'
  );

  perform public.fail_attachment_processing(
    '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    failed_begin.attachment_id,
    failed_begin.processing_run_id,
    'STORAGE_UPLOAD_FAILED',
    'fixture storage failure'
  );

  if not exists (
    select 1
    from public.attachments
    where id = failed_begin.attachment_id
      and status = 'failed'
      and failure_code = 'STORAGE_UPLOAD_FAILED'
  ) then
    raise exception 'failed attachment state was not recorded';
  end if;

  select *
  into retry_begin
  from public.begin_attachment_processing(
    '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'retry-again.txt',
    'text/plain',
    50,
    repeat('b', 64),
    'kiteb-text',
    '1.0.0'
  );

  perform set_config('p3.failed_attachment_id', failed_begin.attachment_id::text, false);
  perform set_config('p3.retry_attachment_id', retry_begin.attachment_id::text, false);
end;
$$;

-- Search is workspace-scoped and deterministic for members.
do $$
declare
  result record;
begin
  select *
  into result
  from public.search_workspace_sources(
    '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'قرار roadmap',
    8
  )
  limit 1;

  if result.source_id is null
    or result.attachment_id <> current_setting('p3.attachment_id')::uuid
    or result.file_name <> 'قرار المشروع.md'
    or result.start_line <> 1
    or result.rank <= 0 then
    raise exception 'workspace source search returned an invalid result';
  end if;
end;
$$;

-- Viewer can inspect and search, but cannot mutate.
select set_config(
  'request.jwt.claim.sub',
  '73333333-3333-4333-8333-333333333333',
  false
);

do $$
begin
  if (
    select count(*)
    from public.sources
    where attachment_id = current_setting('p3.attachment_id')::uuid
  ) <> 2 then
    raise exception 'viewer cannot read finalized passages';
  end if;

  if not exists (
    select 1
    from public.search_workspace_sources(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'English',
      8
    )
  ) then
    raise exception 'viewer cannot search workspace passages';
  end if;

  begin
    perform public.begin_attachment_processing(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'viewer.txt',
      'text/plain',
      10,
      repeat('c', 64),
      'kiteb-text',
      '1.0.0'
    );
    raise exception 'viewer upload unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.delete_attachment_record(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p3.attachment_id')::uuid
    );
    raise exception 'viewer delete unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Outsider cannot infer attachment, passage, run, or search state.
select set_config(
  'request.jwt.claim.sub',
  '74444444-4444-4444-8444-444444444444',
  false
);

do $$
begin
  if exists (
    select 1
    from public.attachments
    where workspace_id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read attachments';
  end if;

  if exists (
    select 1
    from public.sources
    where workspace_id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read source passages';
  end if;

  if exists (
    select 1
    from public.attachment_processing_runs
    where workspace_id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  ) then
    raise exception 'outsider can read processing attempts';
  end if;

  begin
    perform public.search_workspace_sources(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'قرار',
      8
    );
    raise exception 'outsider search unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Archived workspaces are read-only at the processing function boundary.
select set_config(
  'request.jwt.claim.sub',
  '71111111-1111-4111-8111-111111111111',
  false
);

update public.workspaces
set archived_at = timezone('utc', now())
where id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

select set_config(
  'request.jwt.claim.sub',
  '72222222-2222-4222-8222-222222222222',
  false
);

do $$
begin
  begin
    perform public.begin_attachment_processing(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'archived.txt',
      'text/plain',
      10,
      repeat('d', 64),
      'kiteb-text',
      '1.0.0'
    );
    raise exception 'archived workspace upload unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.delete_attachment_record(
      '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      current_setting('p3.attachment_id')::uuid
    );
    raise exception 'archived workspace delete unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Restore and verify hard-delete cascades.
select set_config(
  'request.jwt.claim.sub',
  '71111111-1111-4111-8111-111111111111',
  false
);

update public.workspaces
set archived_at = null
where id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

select set_config(
  'request.jwt.claim.sub',
  '72222222-2222-4222-8222-222222222222',
  false
);

select public.delete_attachment_record(
  '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p3.attachment_id')::uuid
);

select public.delete_attachment_record(
  '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p3.failed_attachment_id')::uuid
);

select public.delete_attachment_record(
  '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('p3.retry_attachment_id')::uuid
);

do $$
begin
  if exists (
    select 1
    from public.sources
    where attachment_id = current_setting('p3.attachment_id')::uuid
  ) then
    raise exception 'source rows did not cascade';
  end if;

  if exists (
    select 1
    from public.attachment_processing_runs
    where attachment_id = current_setting('p3.attachment_id')::uuid
  ) then
    raise exception 'processing runs did not cascade';
  end if;
end;
$$;

select set_config(
  'request.jwt.claim.sub',
  '71111111-1111-4111-8111-111111111111',
  false
);

delete from public.workspaces
where id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

reset role;
