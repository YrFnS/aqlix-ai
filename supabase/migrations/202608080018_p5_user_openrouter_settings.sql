begin;

create extension if not exists supabase_vault with schema vault;

alter table public.message_generations
  drop constraint message_generations_requested_model_length,
  drop constraint message_generations_returned_model_length,
  add constraint message_generations_requested_model_length check (
    char_length(btrim(requested_model)) between 1 and 255
  ),
  add constraint message_generations_returned_model_length check (
    returned_model is null
    or char_length(btrim(returned_model)) between 1 and 255
  );

alter table public.draft_generations
  drop constraint draft_generations_requested_model_length,
  drop constraint draft_generations_returned_model_length,
  add constraint draft_generations_requested_model_length check (
    char_length(btrim(requested_model)) between 1 and 255
  ),
  add constraint draft_generations_returned_model_length check (
    returned_model is null
    or char_length(btrim(returned_model)) between 1 and 255
  );

create table public.user_ai_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'openrouter',
  selected_model_id text,
  vault_secret_id uuid,
  key_last_four text,
  key_label text,
  key_is_free_tier boolean,
  connected_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_ai_settings_provider_check check (provider = 'openrouter'),
  constraint user_ai_settings_model_length check (
    selected_model_id is null
    or char_length(btrim(selected_model_id)) between 1 and 255
  ),
  constraint user_ai_settings_model_format check (
    selected_model_id is null
    or selected_model_id ~ '^[A-Za-z0-9][A-Za-z0-9._:/-]*$'
  ),
  constraint user_ai_settings_last_four_format check (
    key_last_four is null or key_last_four ~ '^[A-Za-z0-9_-]{4}$'
  ),
  constraint user_ai_settings_label_length check (
    key_label is null or char_length(key_label) <= 120
  ),
  constraint user_ai_settings_connection_consistent check (
    (
      vault_secret_id is null
      and key_last_four is null
      and key_label is null
      and key_is_free_tier is null
      and connected_at is null
    )
    or
    (
      vault_secret_id is not null
      and key_last_four is not null
      and connected_at is not null
    )
  )
);

create trigger user_ai_settings_touch_updated_at
before update on public.user_ai_settings
for each row execute function public.touch_updated_at();

alter table public.user_ai_settings enable row level security;

create policy user_ai_settings_select_own
on public.user_ai_settings
for select
to authenticated
using (user_id = auth.uid());

grant select on public.user_ai_settings to authenticated;
revoke insert, update, delete on public.user_ai_settings from authenticated;

revoke all on vault.secrets from anon, authenticated;
revoke all on vault.decrypted_secrets from anon, authenticated;

create or replace function public.get_user_ai_settings()
returns table (
  provider text,
  connected boolean,
  model_id text,
  key_last_four text,
  key_label text,
  is_free_tier boolean,
  connected_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, vault, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'authenticated user required';
  end if;

  return query
  select
    'openrouter'::text,
    settings.vault_secret_id is not null,
    settings.selected_model_id,
    settings.key_last_four,
    settings.key_label,
    settings.key_is_free_tier,
    settings.connected_at,
    settings.updated_at
  from (select 1) seed
  left join public.user_ai_settings settings
    on settings.user_id = current_user_id;
end;
$$;

create or replace function public.save_user_openrouter_credential(
  raw_api_key text,
  requested_key_label text default null,
  requested_is_free_tier boolean default null
)
returns table (
  provider text,
  connected boolean,
  model_id text,
  key_last_four text,
  key_label text,
  is_free_tier boolean,
  connected_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  resolved_secret_id uuid;
  resolved_name text;
  normalized_label text;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'authenticated user required';
  end if;

  if raw_api_key is null
    or char_length(btrim(raw_api_key)) < 16
    or char_length(btrim(raw_api_key)) > 512
    or btrim(raw_api_key) ~ '\s' then
    raise check_violation using message = 'invalid OpenRouter API key';
  end if;

  normalized_label := nullif(left(btrim(coalesce(requested_key_label, '')), 120), '');
  resolved_name := concat('openrouter-user-', current_user_id::text);

  select settings.vault_secret_id
  into resolved_secret_id
  from public.user_ai_settings settings
  where settings.user_id = current_user_id
  for update;

  if resolved_secret_id is null then
    select secret.id
    into resolved_secret_id
    from vault.secrets secret
    where secret.name = resolved_name
    limit 1;
  end if;

  if resolved_secret_id is null then
    select vault.create_secret(
      btrim(raw_api_key),
      resolved_name,
      'User-owned OpenRouter API key'
    )
    into resolved_secret_id;
  else
    perform vault.update_secret(
      resolved_secret_id,
      btrim(raw_api_key),
      resolved_name,
      'User-owned OpenRouter API key'
    );
  end if;

  insert into public.user_ai_settings (
    user_id,
    provider,
    vault_secret_id,
    key_last_four,
    key_label,
    key_is_free_tier,
    connected_at
  )
  values (
    current_user_id,
    'openrouter',
    resolved_secret_id,
    right(btrim(raw_api_key), 4),
    normalized_label,
    requested_is_free_tier,
    timezone('utc', now())
  )
  on conflict (user_id) do update
  set
    provider = 'openrouter',
    vault_secret_id = excluded.vault_secret_id,
    key_last_four = excluded.key_last_four,
    key_label = excluded.key_label,
    key_is_free_tier = excluded.key_is_free_tier,
    connected_at = excluded.connected_at;

  return query select * from public.get_user_ai_settings();
end;
$$;

create or replace function public.set_user_openrouter_model(
  requested_model_id text
)
returns table (
  provider text,
  connected boolean,
  model_id text,
  key_last_four text,
  key_label text,
  is_free_tier boolean,
  connected_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_model_id text := btrim(requested_model_id);
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'authenticated user required';
  end if;

  if char_length(normalized_model_id) not between 1 and 255
    or normalized_model_id !~ '^[A-Za-z0-9][A-Za-z0-9._:/-]*$' then
    raise check_violation using message = 'invalid OpenRouter model ID';
  end if;

  update public.user_ai_settings settings
  set selected_model_id = normalized_model_id
  where settings.user_id = current_user_id
    and settings.provider = 'openrouter'
    and settings.vault_secret_id is not null;

  if not found then
    raise check_violation using message = 'connect OpenRouter before selecting a model';
  end if;

  return query select * from public.get_user_ai_settings();
end;
$$;

create or replace function public.resolve_user_openrouter_runtime()
returns table (
  api_key text,
  model_id text
)
language plpgsql
stable
security definer
set search_path = public, vault, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'authenticated user required';
  end if;

  return query
  select
    secret.decrypted_secret,
    settings.selected_model_id
  from public.user_ai_settings settings
  join vault.decrypted_secrets secret
    on secret.id = settings.vault_secret_id
  where settings.user_id = current_user_id
    and settings.provider = 'openrouter'
    and settings.selected_model_id is not null
    and char_length(secret.decrypted_secret) >= 16
  limit 1;
end;
$$;

create or replace function public.disconnect_user_openrouter()
returns boolean
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  resolved_secret_id uuid;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'authenticated user required';
  end if;

  select settings.vault_secret_id
  into resolved_secret_id
  from public.user_ai_settings settings
  where settings.user_id = current_user_id
  for update;

  delete from public.user_ai_settings settings
  where settings.user_id = current_user_id;

  if resolved_secret_id is not null then
    delete from vault.secrets secret
    where secret.id = resolved_secret_id;
  end if;

  return found or resolved_secret_id is not null;
end;
$$;

create or replace function public.cleanup_user_ai_vault_secret()
returns trigger
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
begin
  if old.vault_secret_id is not null then
    delete from vault.secrets secret
    where secret.id = old.vault_secret_id;
  end if;

  return old;
end;
$$;

create trigger user_ai_settings_cleanup_vault_secret
before delete on public.user_ai_settings
for each row execute function public.cleanup_user_ai_vault_secret();

revoke all on function public.get_user_ai_settings() from public;
revoke all on function public.save_user_openrouter_credential(text, text, boolean) from public;
revoke all on function public.set_user_openrouter_model(text) from public;
revoke all on function public.resolve_user_openrouter_runtime() from public;
revoke all on function public.disconnect_user_openrouter() from public;
revoke all on function public.cleanup_user_ai_vault_secret() from public;

grant execute on function public.get_user_ai_settings() to authenticated;
grant execute on function public.save_user_openrouter_credential(text, text, boolean) to authenticated;
grant execute on function public.set_user_openrouter_model(text) to authenticated;
grant execute on function public.resolve_user_openrouter_runtime() to authenticated;
grant execute on function public.disconnect_user_openrouter() to authenticated;

commit;
