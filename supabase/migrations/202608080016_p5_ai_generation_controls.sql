begin;

create table public.workspace_ai_limits (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  enabled boolean not null default true,
  daily_request_limit integer not null default 100,
  daily_input_token_limit integer not null default 500000,
  daily_output_token_limit integer not null default 100000,
  max_concurrent_generations integer not null default 2,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint workspace_ai_limits_request_range check (
    daily_request_limit between 1 and 10000
  ),
  constraint workspace_ai_limits_input_range check (
    daily_input_token_limit between 1000 and 100000000
  ),
  constraint workspace_ai_limits_output_range check (
    daily_output_token_limit between 1000 and 100000000
  ),
  constraint workspace_ai_limits_concurrency_range check (
    max_concurrent_generations between 1 and 20
  )
);

create trigger workspace_ai_limits_touch_updated_at
before update on public.workspace_ai_limits
for each row execute function public.touch_updated_at();

insert into public.workspace_ai_limits (workspace_id)
select workspace.id
from public.workspaces workspace
on conflict (workspace_id) do nothing;

create or replace function public.initialize_workspace_ai_limits()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.workspace_ai_limits (workspace_id)
  values (new.id)
  on conflict (workspace_id) do nothing;

  return new;
end;
$$;

create trigger workspaces_initialize_ai_limits
after insert on public.workspaces
for each row execute function public.initialize_workspace_ai_limits();

create table public.ai_generation_permits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  operation text not null,
  target_generation_id uuid not null,
  status text not null default 'reserved',
  reserved_input_tokens integer not null,
  reserved_output_tokens integer not null,
  provider_started boolean,
  terminal_status text,
  actual_input_tokens integer,
  actual_output_tokens integer,
  actual_reasoning_tokens integer,
  actual_total_tokens integer,
  failure_code text,
  reserved_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null,
  settled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint ai_generation_permits_target_unique
    unique (operation, target_generation_id),
  constraint ai_generation_permits_operation_check check (
    operation in ('conversation', 'draft')
  ),
  constraint ai_generation_permits_status_check check (
    status in ('reserved', 'settled', 'expired')
  ),
  constraint ai_generation_permits_reserved_input_check check (
    reserved_input_tokens between 1 and 10000000
  ),
  constraint ai_generation_permits_reserved_output_check check (
    reserved_output_tokens between 1 and 100000
  ),
  constraint ai_generation_permits_actual_input_check check (
    actual_input_tokens is null or actual_input_tokens >= 0
  ),
  constraint ai_generation_permits_actual_output_check check (
    actual_output_tokens is null or actual_output_tokens >= 0
  ),
  constraint ai_generation_permits_actual_reasoning_check check (
    actual_reasoning_tokens is null or actual_reasoning_tokens >= 0
  ),
  constraint ai_generation_permits_actual_total_check check (
    actual_total_tokens is null or actual_total_tokens >= 0
  ),
  constraint ai_generation_permits_terminal_status_check check (
    terminal_status is null
    or terminal_status in ('complete', 'failed', 'cancelled')
  ),
  constraint ai_generation_permits_failure_code_length check (
    failure_code is null or char_length(failure_code) <= 120
  ),
  constraint ai_generation_permits_expiry_order check (
    expires_at > reserved_at
  ),
  constraint ai_generation_permits_terminal_state check (
    (
      status = 'reserved'
      and provider_started is null
      and terminal_status is null
      and actual_input_tokens is null
      and actual_output_tokens is null
      and actual_reasoning_tokens is null
      and actual_total_tokens is null
      and settled_at is null
    )
    or (
      status in ('settled', 'expired')
      and provider_started is not null
      and terminal_status is not null
      and actual_input_tokens is not null
      and actual_output_tokens is not null
      and actual_reasoning_tokens is not null
      and actual_total_tokens is not null
      and settled_at is not null
    )
  )
);

create index ai_generation_permits_workspace_created_idx
  on public.ai_generation_permits(workspace_id, created_at desc);
create index ai_generation_permits_workspace_active_idx
  on public.ai_generation_permits(workspace_id, expires_at)
  where status = 'reserved';

create trigger ai_generation_permits_touch_updated_at
before update on public.ai_generation_permits
for each row execute function public.touch_updated_at();

alter table public.workspace_ai_limits enable row level security;
alter table public.ai_generation_permits enable row level security;

create policy workspace_ai_limits_select_member
on public.workspace_ai_limits
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy ai_generation_permits_select_member
on public.ai_generation_permits
for select
to authenticated
using (public.is_workspace_member(workspace_id));

revoke insert, update, delete on public.workspace_ai_limits from authenticated;
revoke insert, update, delete on public.ai_generation_permits from authenticated;
grant select on public.workspace_ai_limits to authenticated;
grant select on public.ai_generation_permits to authenticated;

create or replace function public.get_workspace_ai_limits(
  target_workspace_id uuid
)
returns table (
  workspace_id uuid,
  enabled boolean,
  daily_request_limit integer,
  daily_input_token_limit integer,
  daily_output_token_limit integer,
  max_concurrent_generations integer,
  requests_used bigint,
  input_tokens_used bigint,
  output_tokens_used bigint,
  active_generations bigint,
  resets_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  day_start timestamptz :=
    date_trunc('day', timezone('utc', now())) at time zone 'utc';
begin
  if not public.is_workspace_member(target_workspace_id) then
    raise insufficient_privilege using message = 'workspace membership required';
  end if;

  return query
  with usage as (
    select
      count(*) filter (
        where permit.created_at >= day_start
      )::bigint as requests_used,
      coalesce(sum(
        case
          when permit.status = 'reserved' and permit.expires_at > timezone('utc', now())
            then permit.reserved_input_tokens
          else coalesce(permit.actual_input_tokens, permit.reserved_input_tokens)
        end
      ) filter (where permit.created_at >= day_start), 0)::bigint
        as input_tokens_used,
      coalesce(sum(
        case
          when permit.status = 'reserved' and permit.expires_at > timezone('utc', now())
            then permit.reserved_output_tokens
          else coalesce(permit.actual_output_tokens, permit.reserved_output_tokens)
        end
      ) filter (where permit.created_at >= day_start), 0)::bigint
        as output_tokens_used,
      count(*) filter (
        where permit.status = 'reserved'
          and permit.expires_at > timezone('utc', now())
      )::bigint as active_generations
    from public.ai_generation_permits permit
    where permit.workspace_id = target_workspace_id
  )
  select
    limits.workspace_id,
    limits.enabled,
    limits.daily_request_limit,
    limits.daily_input_token_limit,
    limits.daily_output_token_limit,
    limits.max_concurrent_generations,
    usage.requests_used,
    usage.input_tokens_used,
    usage.output_tokens_used,
    usage.active_generations,
    day_start + interval '1 day',
    limits.updated_at
  from public.workspace_ai_limits limits
  cross join usage
  where limits.workspace_id = target_workspace_id;
end;
$$;

create or replace function public.set_workspace_ai_limits(
  target_workspace_id uuid,
  requested_enabled boolean,
  requested_daily_request_limit integer,
  requested_daily_input_token_limit integer,
  requested_daily_output_token_limit integer,
  requested_max_concurrent_generations integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.has_workspace_role(target_workspace_id, array['owner']) then
    raise insufficient_privilege using message = 'workspace owner role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if requested_enabled is null
    or requested_daily_request_limit not between 1 and 10000
    or requested_daily_input_token_limit not between 1000 and 100000000
    or requested_daily_output_token_limit not between 1000 and 100000000
    or requested_max_concurrent_generations not between 1 and 20 then
    raise exception 'invalid workspace AI limits';
  end if;

  insert into public.workspace_ai_limits (
    workspace_id,
    enabled,
    daily_request_limit,
    daily_input_token_limit,
    daily_output_token_limit,
    max_concurrent_generations
  )
  values (
    target_workspace_id,
    requested_enabled,
    requested_daily_request_limit,
    requested_daily_input_token_limit,
    requested_daily_output_token_limit,
    requested_max_concurrent_generations
  )
  on conflict (workspace_id) do update
  set
    enabled = excluded.enabled,
    daily_request_limit = excluded.daily_request_limit,
    daily_input_token_limit = excluded.daily_input_token_limit,
    daily_output_token_limit = excluded.daily_output_token_limit,
    max_concurrent_generations = excluded.max_concurrent_generations;

  return true;
end;
$$;

create or replace function public.reserve_ai_generation_permit(
  target_workspace_id uuid,
  requested_operation text,
  requested_generation_id uuid,
  estimated_input_tokens integer,
  requested_output_tokens integer
)
returns table (
  permit_id uuid,
  allowed boolean,
  denial_code text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  limits public.workspace_ai_limits%rowtype;
  existing_permit public.ai_generation_permits%rowtype;
  day_start timestamptz :=
    date_trunc('day', timezone('utc', now())) at time zone 'utc';
  request_count bigint;
  input_count bigint;
  output_count bigint;
  concurrent_count bigint;
  generated_permit_id uuid;
begin
  if auth.uid() is null then
    raise insufficient_privilege using message = 'authenticated user required';
  end if;

  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if not public.is_workspace_active(target_workspace_id) then
    raise insufficient_privilege using message = 'archived workspaces are read-only';
  end if;

  if requested_operation not in ('conversation', 'draft')
    or requested_generation_id is null
    or estimated_input_tokens not between 1 and 10000000
    or requested_output_tokens not between 1 and 100000 then
    raise exception 'invalid AI generation reservation';
  end if;

  if requested_operation = 'conversation' then
    if not exists (
      select 1
      from public.message_generations generation
      where generation.workspace_id = target_workspace_id
        and generation.id = requested_generation_id
        and generation.created_by = auth.uid()
        and generation.status = 'pending'
    ) then
      raise exception 'conversation generation is unavailable for reservation';
    end if;
  else
    if not exists (
      select 1
      from public.draft_generations generation
      where generation.workspace_id = target_workspace_id
        and generation.id = requested_generation_id
        and generation.created_by = auth.uid()
        and generation.status = 'pending'
    ) then
      raise exception 'draft generation is unavailable for reservation';
    end if;
  end if;

  insert into public.workspace_ai_limits (workspace_id)
  values (target_workspace_id)
  on conflict (workspace_id) do nothing;

  select current_limits.*
  into limits
  from public.workspace_ai_limits current_limits
  where current_limits.workspace_id = target_workspace_id
  for update;

  update public.ai_generation_permits permit
  set
    status = 'expired',
    provider_started = true,
    terminal_status = 'failed',
    actual_input_tokens = permit.reserved_input_tokens,
    actual_output_tokens = permit.reserved_output_tokens,
    actual_reasoning_tokens = 0,
    actual_total_tokens = permit.reserved_input_tokens + permit.reserved_output_tokens,
    failure_code = 'PERMIT_EXPIRED',
    settled_at = timezone('utc', now())
  where permit.workspace_id = target_workspace_id
    and permit.status = 'reserved'
    and permit.expires_at <= timezone('utc', now());

  select permit.*
  into existing_permit
  from public.ai_generation_permits permit
  where permit.operation = requested_operation
    and permit.target_generation_id = requested_generation_id;

  if found then
    if existing_permit.status = 'reserved'
      and existing_permit.expires_at > timezone('utc', now()) then
      return query select existing_permit.id, true, null::text;
      return;
    end if;

    raise exception 'AI generation permit is already terminal';
  end if;

  select
    count(*) filter (where permit.created_at >= day_start),
    coalesce(sum(
      case
        when permit.status = 'reserved' then permit.reserved_input_tokens
        else coalesce(permit.actual_input_tokens, permit.reserved_input_tokens)
      end
    ) filter (where permit.created_at >= day_start), 0),
    coalesce(sum(
      case
        when permit.status = 'reserved' then permit.reserved_output_tokens
        else coalesce(permit.actual_output_tokens, permit.reserved_output_tokens)
      end
    ) filter (where permit.created_at >= day_start), 0),
    count(*) filter (where permit.status = 'reserved')
  into request_count, input_count, output_count, concurrent_count
  from public.ai_generation_permits permit
  where permit.workspace_id = target_workspace_id;

  if not limits.enabled then
    return query select null::uuid, false, 'PROVIDER_DISABLED'::text;
    return;
  end if;

  if concurrent_count >= limits.max_concurrent_generations then
    return query
    select null::uuid, false, 'PROVIDER_CONCURRENCY_LIMIT'::text;
    return;
  end if;

  if request_count + 1 > limits.daily_request_limit
    or input_count + estimated_input_tokens > limits.daily_input_token_limit
    or output_count + requested_output_tokens > limits.daily_output_token_limit then
    return query
    select null::uuid, false, 'PROVIDER_BUDGET_EXCEEDED'::text;
    return;
  end if;

  insert into public.ai_generation_permits (
    workspace_id,
    created_by,
    operation,
    target_generation_id,
    reserved_input_tokens,
    reserved_output_tokens,
    expires_at
  )
  values (
    target_workspace_id,
    auth.uid(),
    requested_operation,
    requested_generation_id,
    estimated_input_tokens,
    requested_output_tokens,
    timezone('utc', now()) + interval '10 minutes'
  )
  returning id into generated_permit_id;

  return query select generated_permit_id, true, null::text;
end;
$$;

create or replace function public.settle_ai_generation_permit(
  target_workspace_id uuid,
  target_permit_id uuid,
  did_start_provider boolean,
  final_generation_status text,
  provider_input_tokens integer default null,
  provider_output_tokens integer default null,
  provider_reasoning_tokens integer default null,
  provider_total_tokens integer default null,
  provider_failure_code text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  permit public.ai_generation_permits%rowtype;
  resolved_input integer;
  resolved_output integer;
  resolved_reasoning integer;
  resolved_total integer;
begin
  if not public.has_workspace_role(target_workspace_id, array['owner', 'editor']) then
    raise insufficient_privilege using message = 'workspace editor role required';
  end if;

  if did_start_provider is null
    or final_generation_status not in ('complete', 'failed', 'cancelled')
    or (provider_input_tokens is not null and provider_input_tokens < 0)
    or (provider_output_tokens is not null and provider_output_tokens < 0)
    or (provider_reasoning_tokens is not null and provider_reasoning_tokens < 0)
    or (provider_total_tokens is not null and provider_total_tokens < 0) then
    raise exception 'invalid AI generation settlement';
  end if;

  select current_permit.*
  into permit
  from public.ai_generation_permits current_permit
  where current_permit.workspace_id = target_workspace_id
    and current_permit.id = target_permit_id
    and current_permit.created_by = auth.uid()
    and current_permit.status = 'reserved'
  for update;

  if not found then
    raise exception 'active AI generation permit was not found';
  end if;

  resolved_input := coalesce(
    provider_input_tokens,
    case when did_start_provider then permit.reserved_input_tokens else 0 end
  );
  resolved_output := coalesce(
    provider_output_tokens,
    case when did_start_provider then permit.reserved_output_tokens else 0 end
  );
  resolved_reasoning := coalesce(provider_reasoning_tokens, 0);
  resolved_total := coalesce(
    provider_total_tokens,
    resolved_input + resolved_output
  );

  update public.ai_generation_permits current_permit
  set
    status = 'settled',
    provider_started = did_start_provider,
    terminal_status = final_generation_status,
    actual_input_tokens = resolved_input,
    actual_output_tokens = resolved_output,
    actual_reasoning_tokens = resolved_reasoning,
    actual_total_tokens = resolved_total,
    failure_code = case
      when final_generation_status = 'complete' then null
      else left(provider_failure_code, 120)
    end,
    settled_at = timezone('utc', now())
  where current_permit.id = target_permit_id;
end;
$$;

create or replace function public.finish_permitted_conversation_generation(
  target_workspace_id uuid,
  target_conversation_id uuid,
  target_message_id uuid,
  target_generation_id uuid,
  target_permit_id uuid,
  did_start_provider boolean,
  final_status text,
  final_content text,
  returned_provider_model text default null,
  provider_response_identifier text default null,
  provider_input_tokens integer default null,
  provider_output_tokens integer default null,
  provider_reasoning_tokens integer default null,
  provider_total_tokens integer default null,
  first_token_ms integer default null,
  total_latency_ms integer default null,
  provider_failure_code text default null,
  provider_failure_message text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.finish_conversation_generation(
    target_workspace_id,
    target_conversation_id,
    target_message_id,
    target_generation_id,
    final_status,
    final_content,
    returned_provider_model,
    provider_response_identifier,
    provider_input_tokens,
    provider_output_tokens,
    provider_reasoning_tokens,
    provider_total_tokens,
    first_token_ms,
    total_latency_ms,
    provider_failure_code,
    provider_failure_message
  );

  perform public.settle_ai_generation_permit(
    target_workspace_id,
    target_permit_id,
    did_start_provider,
    final_status,
    provider_input_tokens,
    provider_output_tokens,
    provider_reasoning_tokens,
    provider_total_tokens,
    provider_failure_code
  );
end;
$$;

create or replace function public.finish_permitted_grounded_conversation_generation(
  target_workspace_id uuid,
  target_conversation_id uuid,
  target_message_id uuid,
  target_generation_id uuid,
  target_permit_id uuid,
  did_start_provider boolean,
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
begin
  perform public.finish_grounded_conversation_generation(
    target_workspace_id,
    target_conversation_id,
    target_message_id,
    target_generation_id,
    final_content,
    returned_provider_model,
    provider_response_identifier,
    provider_input_tokens,
    provider_output_tokens,
    provider_reasoning_tokens,
    provider_total_tokens,
    first_token_ms,
    total_latency_ms,
    cited_sources
  );

  perform public.settle_ai_generation_permit(
    target_workspace_id,
    target_permit_id,
    did_start_provider,
    'complete',
    provider_input_tokens,
    provider_output_tokens,
    provider_reasoning_tokens,
    provider_total_tokens,
    null
  );
end;
$$;

create or replace function public.finish_permitted_draft_generation(
  target_workspace_id uuid,
  target_draft_id uuid,
  target_generation_id uuid,
  target_permit_id uuid,
  did_start_provider boolean,
  final_status text,
  final_content text,
  returned_provider_model text default null,
  provider_response_identifier text default null,
  provider_input_tokens integer default null,
  provider_output_tokens integer default null,
  provider_reasoning_tokens integer default null,
  provider_total_tokens integer default null,
  first_token_ms integer default null,
  total_latency_ms integer default null,
  provider_failure_code text default null,
  provider_failure_message text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.finish_draft_generation(
    target_workspace_id,
    target_draft_id,
    target_generation_id,
    final_status,
    final_content,
    returned_provider_model,
    provider_response_identifier,
    provider_input_tokens,
    provider_output_tokens,
    provider_reasoning_tokens,
    provider_total_tokens,
    first_token_ms,
    total_latency_ms,
    provider_failure_code,
    provider_failure_message
  );

  perform public.settle_ai_generation_permit(
    target_workspace_id,
    target_permit_id,
    did_start_provider,
    final_status,
    provider_input_tokens,
    provider_output_tokens,
    provider_reasoning_tokens,
    provider_total_tokens,
    provider_failure_code
  );
end;
$$;

revoke all on function public.initialize_workspace_ai_limits() from public;
revoke all on function public.get_workspace_ai_limits(uuid) from public;
revoke all on function public.set_workspace_ai_limits(
  uuid, boolean, integer, integer, integer, integer
) from public;
revoke all on function public.reserve_ai_generation_permit(
  uuid, text, uuid, integer, integer
) from public;
revoke all on function public.settle_ai_generation_permit(
  uuid, uuid, boolean, text, integer, integer, integer, integer, text
) from public;
revoke all on function public.finish_permitted_conversation_generation(
  uuid, uuid, uuid, uuid, uuid, boolean, text, text, text, text,
  integer, integer, integer, integer, integer, integer, text, text
) from public;
revoke all on function public.finish_permitted_grounded_conversation_generation(
  uuid, uuid, uuid, uuid, uuid, boolean, text, text, text, integer,
  integer, integer, integer, integer, integer, jsonb
) from public;
revoke all on function public.finish_permitted_draft_generation(
  uuid, uuid, uuid, uuid, boolean, text, text, text, text, integer,
  integer, integer, integer, integer, integer, text, text
) from public;

grant execute on function public.get_workspace_ai_limits(uuid) to authenticated;
grant execute on function public.set_workspace_ai_limits(
  uuid, boolean, integer, integer, integer, integer
) to authenticated;
grant execute on function public.reserve_ai_generation_permit(
  uuid, text, uuid, integer, integer
) to authenticated;
grant execute on function public.finish_permitted_conversation_generation(
  uuid, uuid, uuid, uuid, uuid, boolean, text, text, text, text,
  integer, integer, integer, integer, integer, integer, text, text
) to authenticated;
grant execute on function public.finish_permitted_grounded_conversation_generation(
  uuid, uuid, uuid, uuid, uuid, boolean, text, text, text, integer,
  integer, integer, integer, integer, integer, jsonb
) to authenticated;
grant execute on function public.finish_permitted_draft_generation(
  uuid, uuid, uuid, uuid, boolean, text, text, text, text, integer,
  integer, integer, integer, integer, integer, text, text
) to authenticated;

commit;
