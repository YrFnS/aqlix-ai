begin;

create or replace function public.resolve_user_openrouter_credential()
returns table (
  api_key text
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
  select secret.decrypted_secret
  from public.user_ai_settings settings
  join vault.decrypted_secrets secret
    on secret.id = settings.vault_secret_id
  where settings.user_id = current_user_id
    and settings.provider = 'openrouter'
    and char_length(secret.decrypted_secret) >= 16
  limit 1;
end;
$$;

revoke all on function public.resolve_user_openrouter_credential() from public;
grant execute on function public.resolve_user_openrouter_credential() to authenticated;

commit;
