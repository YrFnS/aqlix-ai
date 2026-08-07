begin;

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  default_language text not null default 'auto',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz,
  constraint workspaces_name_length check (char_length(btrim(name)) between 1 and 120),
  constraint workspaces_description_length check (
    description is null or char_length(description) <= 1000
  ),
  constraint workspaces_default_language check (
    default_language in ('auto', 'ar', 'en')
  )
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (workspace_id, user_id),
  constraint workspace_members_role check (role in ('owner', 'editor', 'viewer'))
);

create unique index workspace_members_single_owner_idx
  on public.workspace_members(workspace_id)
  where role = 'owner';

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null default 'محادثة جديدة',
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint conversations_title_length check (char_length(btrim(title)) between 1 and 200),
  constraint conversations_status check (status in ('active', 'archived'))
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  role text not null,
  status text not null default 'pending',
  content text not null default '',
  direction text not null default 'auto',
  sequence integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint messages_role check (role in ('system', 'user', 'assistant', 'tool')),
  constraint messages_status check (
    status in ('pending', 'streaming', 'complete', 'failed', 'cancelled')
  ),
  constraint messages_direction check (direction in ('auto', 'rtl', 'ltr')),
  constraint messages_sequence_nonnegative check (sequence >= 0),
  unique (conversation_id, sequence),
  constraint messages_workspace_conversation_fk
    foreign key (workspace_id, conversation_id)
    references public.conversations(workspace_id, id)
    on delete cascade
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  file_name text not null,
  media_type text not null,
  byte_size bigint not null,
  storage_path text not null,
  status text not null default 'pending',
  failure_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  constraint attachments_file_name_length check (char_length(btrim(file_name)) between 1 and 255),
  constraint attachments_media_type_length check (char_length(btrim(media_type)) between 1 and 255),
  constraint attachments_byte_size_nonnegative check (byte_size >= 0),
  constraint attachments_storage_path_length check (char_length(btrim(storage_path)) >= 1),
  constraint attachments_status check (
    status in ('pending', 'processing', 'ready', 'failed', 'deleted')
  )
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  attachment_id uuid not null references public.attachments(id) on delete cascade,
  ordinal integer not null,
  content text not null,
  page_number integer,
  start_offset integer,
  end_offset integer,
  created_at timestamptz not null default timezone('utc', now()),
  constraint sources_ordinal_nonnegative check (ordinal >= 0),
  constraint sources_content_nonempty check (char_length(content) >= 1),
  constraint sources_page_positive check (page_number is null or page_number > 0),
  constraint sources_start_offset_nonnegative check (start_offset is null or start_offset >= 0),
  constraint sources_end_offset_nonnegative check (end_offset is null or end_offset >= 0),
  constraint sources_offset_order check (
    start_offset is null or end_offset is null or end_offset >= start_offset
  ),
  unique (attachment_id, ordinal),
  constraint sources_workspace_attachment_fk
    foreign key (workspace_id, attachment_id)
    references public.attachments(workspace_id, id)
    on delete cascade
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null default 'مسودة جديدة',
  content text not null default '',
  direction text not null default 'auto',
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint drafts_title_length check (char_length(btrim(title)) between 1 and 200),
  constraint drafts_direction check (direction in ('auto', 'rtl', 'ltr')),
  constraint drafts_status check (status in ('active', 'archived'))
);

alter table public.conversations
  add constraint conversations_workspace_id_id_unique unique (workspace_id, id);

alter table public.attachments
  add constraint attachments_workspace_id_id_unique unique (workspace_id, id);

create index workspaces_owner_updated_idx
  on public.workspaces(owner_id, updated_at desc);
create index workspace_members_user_idx
  on public.workspace_members(user_id, workspace_id);
create index conversations_workspace_updated_idx
  on public.conversations(workspace_id, updated_at desc);
create index messages_conversation_sequence_idx
  on public.messages(conversation_id, sequence);
create index attachments_workspace_created_idx
  on public.attachments(workspace_id, created_at desc);
create index sources_workspace_attachment_idx
  on public.sources(workspace_id, attachment_id, ordinal);
create index drafts_workspace_updated_idx
  on public.drafts(workspace_id, updated_at desc);

create trigger workspaces_touch_updated_at
before update on public.workspaces
for each row execute function public.touch_updated_at();

create trigger conversations_touch_updated_at
before update on public.conversations
for each row execute function public.touch_updated_at();

create trigger messages_touch_updated_at
before update on public.messages
for each row execute function public.touch_updated_at();

create trigger attachments_touch_updated_at
before update on public.attachments
for each row execute function public.touch_updated_at();

create trigger drafts_touch_updated_at
before update on public.drafts
for each row execute function public.touch_updated_at();

create or replace function public.prevent_workspace_owner_change()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'workspace owner cannot be changed';
  end if;
  return new;
end;
$$;

create trigger workspaces_prevent_owner_change
before update of owner_id on public.workspaces
for each row execute function public.prevent_workspace_owner_change();

create or replace function public.protect_workspace_owner_membership()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' and old.role = 'owner' then
    raise exception 'workspace owner membership cannot be deleted';
  end if;

  if tg_op = 'UPDATE' and old.role = 'owner' then
    if new.role <> 'owner' or new.user_id <> old.user_id then
      raise exception 'workspace owner membership cannot be reassigned';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger workspace_members_protect_owner
before update or delete on public.workspace_members
for each row execute function public.protect_workspace_owner_membership();

create or replace function public.create_workspace_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

create trigger workspaces_create_owner_membership
after insert on public.workspaces
for each row execute function public.create_workspace_owner_membership();

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.workspace_members member
      where member.workspace_id = target_workspace_id
        and member.user_id = auth.uid()
    );
$$;

create or replace function public.has_workspace_role(
  target_workspace_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.workspace_members member
      where member.workspace_id = target_workspace_id
        and member.user_id = auth.uid()
        and member.role = any(allowed_roles)
    );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.has_workspace_role(uuid, text[]) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.has_workspace_role(uuid, text[]) to authenticated;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.attachments enable row level security;
alter table public.sources enable row level security;
alter table public.drafts enable row level security;

create policy workspaces_select_member
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(id));

create policy workspaces_insert_owner
on public.workspaces
for insert
to authenticated
with check (owner_id = auth.uid());

create policy workspaces_update_editor
on public.workspaces
for update
to authenticated
using (public.has_workspace_role(id, array['owner', 'editor']))
with check (public.has_workspace_role(id, array['owner', 'editor']));

create policy workspaces_delete_owner
on public.workspaces
for delete
to authenticated
using (public.has_workspace_role(id, array['owner']));

create policy workspace_members_select_member
on public.workspace_members
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy workspace_members_insert_owner
on public.workspace_members
for insert
to authenticated
with check (public.has_workspace_role(workspace_id, array['owner']));

create policy workspace_members_update_owner
on public.workspace_members
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner']))
with check (public.has_workspace_role(workspace_id, array['owner']));

create policy workspace_members_delete_owner
on public.workspace_members
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner']));

create policy conversations_select_member
on public.conversations
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy conversations_insert_editor
on public.conversations
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.has_workspace_role(workspace_id, array['owner', 'editor'])
);

create policy conversations_update_editor
on public.conversations
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']))
with check (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy conversations_delete_editor
on public.conversations
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy messages_select_member
on public.messages
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy messages_insert_editor
on public.messages
for insert
to authenticated
with check (
  (created_by is null or created_by = auth.uid())
  and public.has_workspace_role(workspace_id, array['owner', 'editor'])
);

create policy messages_update_editor
on public.messages
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']))
with check (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy messages_delete_editor
on public.messages
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy attachments_select_member
on public.attachments
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy attachments_insert_editor
on public.attachments
for insert
to authenticated
with check (
  uploaded_by = auth.uid()
  and public.has_workspace_role(workspace_id, array['owner', 'editor'])
);

create policy attachments_update_editor
on public.attachments
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']))
with check (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy attachments_delete_editor
on public.attachments
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy sources_select_member
on public.sources
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy sources_insert_editor
on public.sources
for insert
to authenticated
with check (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy sources_update_editor
on public.sources
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']))
with check (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy sources_delete_editor
on public.sources
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy drafts_select_member
on public.drafts
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy drafts_insert_editor
on public.drafts
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.has_workspace_role(workspace_id, array['owner', 'editor'])
);

create policy drafts_update_editor
on public.drafts
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']))
with check (public.has_workspace_role(workspace_id, array['owner', 'editor']));

create policy drafts_delete_editor
on public.drafts
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'editor']));

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant select, insert, update, delete on public.conversations to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, insert, update, delete on public.attachments to authenticated;
grant select, insert, update, delete on public.sources to authenticated;
grant select, insert, update, delete on public.drafts to authenticated;

commit;
