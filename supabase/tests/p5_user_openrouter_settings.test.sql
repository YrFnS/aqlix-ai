\set ON_ERROR_STOP on

insert into auth.users (id, email)
values
  ('81111111-1111-4111-8111-111111111111', 'p5-openrouter-owner@example.test'),
  ('82222222-2222-4222-8222-222222222222', 'p5-openrouter-outsider@example.test');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '81111111-1111-4111-8111-111111111111',
  false
);

do $$
declare
  settings record;
begin
  select * into settings from public.get_user_ai_settings();

  if settings.provider <> 'openrouter'
    or settings.connected
    or settings.model_id is not null
    or settings.key_last_four is not null then
    raise exception 'new user AI settings are not safely disconnected';
  end if;
end;
$$;

select *
from public.save_user_openrouter_credential(
  'openrouter-test-user-owned-key-2026',
  'P5 database fixture key',
  true
);

do $$
declare
  settings record;
begin
  select * into settings from public.get_user_ai_settings();

  if not settings.connected
    or settings.key_last_four <> '2026'
    or settings.key_label <> 'P5 database fixture key'
    or settings.is_free_tier is not true
    or settings.model_id is not null then
    raise exception 'masked OpenRouter settings are invalid after save';
  end if;

  if exists (
    select 1
    from public.user_ai_settings
    where user_id = '81111111-1111-4111-8111-111111111111'
      and (
        selected_model_id is not null
        or key_last_four <> '2026'
        or vault_secret_id is null
      )
  ) then
    raise exception 'public OpenRouter settings metadata is invalid';
  end if;
end;
$$;

select *
from public.set_user_openrouter_model('fixture/live-free-model:free');

-- The compatibility resolver remains account-scoped during the staged rollout.
-- The application itself uses the service-role resolver tested below.
do $$
declare
  runtime record;
  credential record;
begin
  select * into credential from public.resolve_user_openrouter_credential();
  select * into runtime from public.resolve_user_openrouter_runtime();

  if credential.api_key <> 'openrouter-test-user-owned-key-2026'
    or runtime.api_key <> 'openrouter-test-user-owned-key-2026'
    or runtime.model_id <> 'fixture/live-free-model:free' then
    raise exception 'compatibility resolver lost the owner credential or model';
  end if;
end;
$$;

-- Browser/authenticated sessions cannot call the new server-only resolver.
do $$
begin
  begin
    perform public.resolve_user_openrouter_credential_for_user(
      '81111111-1111-4111-8111-111111111111'
    );
    raise exception 'authenticated called the server-only credential resolver';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.resolve_user_openrouter_runtime_for_user(
      '81111111-1111-4111-8111-111111111111'
    );
    raise exception 'authenticated called the server-only runtime resolver';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

reset role;
set role service_role;

do $$
declare
  runtime record;
  credential record;
begin
  select *
  into credential
  from public.resolve_user_openrouter_credential_for_user(
    '81111111-1111-4111-8111-111111111111'
  );

  select *
  into runtime
  from public.resolve_user_openrouter_runtime_for_user(
    '81111111-1111-4111-8111-111111111111'
  );

  if credential.api_key <> 'openrouter-test-user-owned-key-2026'
    or runtime.api_key <> 'openrouter-test-user-owned-key-2026'
    or runtime.model_id <> 'fixture/live-free-model:free' then
    raise exception 'service-role resolver could not resolve the requested account';
  end if;

  if exists (
    select 1
    from public.resolve_user_openrouter_credential_for_user(
      '82222222-2222-4222-8222-222222222222'
    )
  ) then
    raise exception 'service-role resolver returned a credential for an unconfigured account';
  end if;
end;
$$;

reset role;
set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '82222222-2222-4222-8222-222222222222',
  false
);

do $$
declare
  settings record;
begin
  select * into settings from public.get_user_ai_settings();

  if settings.connected
    or settings.model_id is not null
    or settings.key_last_four is not null then
    raise exception 'outsider can infer another user OpenRouter settings';
  end if;

  if exists (select 1 from public.user_ai_settings) then
    raise exception 'outsider can read another user settings row';
  end if;

  if exists (select 1 from public.resolve_user_openrouter_credential()) then
    raise exception 'outsider can resolve another user credential';
  end if;

  begin
    perform public.set_user_openrouter_model('fixture/live-paid-model');
    raise exception 'outsider selected a model without a connected key';
  exception
    when check_violation then null;
  end;
end;
$$;

reset role;

do $$
declare
  stored_secret_id uuid;
  decrypted_value text;
begin
  select vault_secret_id
  into stored_secret_id
  from public.user_ai_settings
  where user_id = '81111111-1111-4111-8111-111111111111';

  if stored_secret_id is null then
    raise exception 'Vault secret ID was not stored';
  end if;

  select decrypted_secret
  into decrypted_value
  from vault.decrypted_secrets
  where id = stored_secret_id;

  if decrypted_value <> 'openrouter-test-user-owned-key-2026' then
    raise exception 'Vault did not retain the expected encrypted credential';
  end if;

  if exists (
    select 1
    from public.user_ai_settings
    where row_to_json(user_ai_settings)::text like '%openrouter-test-user-owned-key-2026%'
  ) then
    raise exception 'raw OpenRouter key leaked into public settings metadata';
  end if;
end;
$$;

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '81111111-1111-4111-8111-111111111111',
  false
);

select public.disconnect_user_openrouter();

do $$
begin
  if exists (
    select 1
    from public.user_ai_settings
    where user_id = '81111111-1111-4111-8111-111111111111'
  ) then
    raise exception 'disconnect did not remove user AI settings';
  end if;
end;
$$;

reset role;

do $$
begin
  if exists (
    select 1
    from vault.secrets
    where name = 'openrouter-user-81111111-1111-4111-8111-111111111111'
  ) then
    raise exception 'disconnect did not remove the Vault secret';
  end if;
end;
$$;

delete from auth.users
where id in (
  '81111111-1111-4111-8111-111111111111',
  '82222222-2222-4222-8222-222222222222'
);
