# P5 Deployment, Migration, and Rollback

## Status

**P5.1 is in progress. No hosted staging deployment has been executed or approved yet.**

This runbook defines the first reproducible deployment path and its failure boundaries. It does not claim availability, uptime, backup, disaster recovery, security certification, or production readiness.

**Production ready: No.**

## Selected staging platform

The first staging rehearsal uses:

- one paid Render web service using the native Node.js/Bun runtime;
- Render region `frankfurt`;
- Bun `1.3.14`;
- branch `develop`;
- one separate hosted Supabase staging project;
- OpenAI through the existing server-only provider boundary;
- manual deployment while the staging process is being proven;
- `/api/health/ready` as the traffic-promotion health check.

The committed `render.yaml` is infrastructure intent, not evidence that a Render service exists.

## Why staging starts with manual deploys

`autoDeployTrigger: off` is deliberate for the first rehearsal. It prevents every change on `develop` from mutating the staging database before these items are exercised:

1. environment and secret setup;
2. clean release build;
3. migration dry run;
4. migration application;
5. health-based traffic promotion;
6. authenticated product smoke checks;
7. application rollback;
8. forward database recovery.

After repeated successful rehearsals, a later reviewed change may switch staging to `checksPass`. Production remains a separate decision and service definition.

## Environment separation

| Environment | Application | Supabase | Provider | Deployment |
| --- | --- | --- | --- | --- |
| Development | Local Next.js | Local Supabase | Fixture or OpenAI | Manual local |
| Test | CI release build | Isolated local Supabase | Fixture | GitHub Actions |
| Staging | Render `kiteb-staging` | Dedicated staging project | OpenAI | Manual initially |
| Production | Not provisioned by this change | Dedicated production project required | OpenAI | Blocked |

Staging and production must never share a Supabase project, database password, service-role key, provider key, or retention policy.

## Render service contract

`render.yaml` defines one service with:

- a paid `starter` instance so the pre-deploy migration command is available;
- the native `node` runtime with `BUN_VERSION=1.3.14`;
- a Bun-only build and start path;
- a 60-second graceful shutdown window for active server-sent-event responses;
- manual deployment from `develop`;
- a readiness health check before traffic promotion;
- secret placeholders using `sync: false` rather than committed values.

Render provides `RENDER_GIT_COMMIT` and `RENDER_EXTERNAL_URL`. The build script uses them as the immutable release identity and public same-origin API URL. The application also accepts `GITHUB_SHA` for CI and an explicit `RELEASE_SHA` for other approved platforms.

## Required staging values

These values are entered in the Render dashboard or an approved secret manager, never committed:

| Variable | Classification | Purpose | Owner |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public configuration | Staging Supabase URL | Data-service owner |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public configuration protected by RLS | Browser/server public client | Data-service owner |
| `OPENAI_API_KEY` | Restricted secret | Server-only model access | Provider-cost owner |
| `SUPABASE_ACCESS_TOKEN` | Restricted administrative secret | Supabase CLI project access | Data-service owner |
| `SUPABASE_DB_PASSWORD` | Restricted administrative secret | Remote migration connection | Data-service owner |
| `SUPABASE_PROJECT_ID` | Restricted operational identifier | Exact staging project link | Data-service owner |

A production service would additionally require `ALLOW_PRODUCTION_MIGRATIONS=true` during an explicitly approved migration window. That flag is intentionally absent from the staging Blueprint.

## Build sequence

Render runs `scripts/render/build.sh`:

1. enter the repository root;
2. require Render's commit SHA and external URL;
3. derive `RELEASE_SHA` and `NEXT_PUBLIC_API_URL`;
4. require matching staging or production environment labels;
5. install exactly the committed Bun lockfile;
6. validate the runtime environment without printing secrets;
7. build shared packages;
8. execute the full Next.js production build.

Any failure stops the deployment before the migration or traffic-promotion stages.

## Migration sequence

Render runs `scripts/render/pre-deploy.sh` after a successful build and before starting the new service version:

1. require a staging or production environment;
2. require the Supabase access token, database password, and exact project reference;
3. refuse production unless `ALLOW_PRODUCTION_MIGRATIONS=true`;
4. link the repository to the exact hosted project;
5. print local and remote migration history;
6. dry-run `supabase db push`;
7. apply only committed pending migrations in timestamp order;
8. print migration history again.

The script deliberately does **not** use:

- `supabase db reset`;
- `supabase migration repair`;
- `--include-all`;
- seed-data deployment;
- the Supabase service-role key.

A migration-history mismatch, authentication failure, SQL failure, or network failure stops the deployment. It must not be bypassed by editing remote history during an incident.

## Schema change rules

Every hosted schema change must be represented by an immutable file under `supabase/migrations/`.

For changes that can affect a running previous application version, use expand-and-contract delivery:

1. **Expand:** add nullable columns, new tables, new functions, or compatible policies.
2. Deploy application code that can work with both old and new shapes.
3. Backfill or migrate data with bounded, observable work.
4. Verify both application and data behavior.
5. **Contract:** remove old fields or behavior in a later separately approved migration.

Do not combine irreversible destructive changes with the application version that first stops using the old schema.

## Traffic promotion

The new service version is eligible for traffic only after:

1. build success;
2. migration success;
3. process startup;
4. `GET /api/health/live` returns `200`;
5. `GET /api/health/ready` returns `200` with configuration and Supabase checks passing.

The public readiness probe does not call OpenAI or spend tokens. A protected provider smoke test is a separate P5.2 gate.

## Staging smoke checklist

After health-based promotion, the release authority records the release SHA and verifies against staging only:

- marketing page and global 404;
- registration, sign-in, refresh, and sign-out;
- workspace create, reload, archive, and restore;
- one Arabic/English conversation;
- one private TXT or Markdown upload;
- one grounded answer with an inspectable citation;
- one draft save, version, export, and provider proposal;
- viewer read-only behavior;
- outsider non-disclosure;
- request IDs and non-secret error output.

Real-provider smoke usage must be bounded and approved by the provider-cost owner.

## Application rollback

Use an application rollback when the schema remains compatible but the new web release is faulty.

1. Stop further deploy attempts.
2. Record the failing release SHA and incident reason.
3. Select the last known-good Render deploy.
4. Redeploy that exact artifact or commit.
5. Verify liveness, readiness, and the focused smoke checklist.
6. Keep the incident open until the failed release and data compatibility are understood.

Never rebuild an old branch with current dependencies and call it the same release. Rollback evidence must identify an immutable prior commit or artifact.

## Database recovery

Hosted database rollback is **forward recovery**, not a reset.

When a migration has already applied:

1. do not run `db reset` against staging or production;
2. do not delete or falsify migration-history rows during the incident;
3. assess whether the prior application remains compatible;
4. create a new timestamped migration that restores safe behavior or introduces a compatibility bridge;
5. test that migration locally and against a staging copy or backup;
6. dry-run and apply it through the same pre-deploy path;
7. verify data invariants and application behavior.

Data restoration from backup is a separate P5.5 disaster-recovery action and must not be improvised as a normal release rollback.

## Rollback decision table

| Situation | Application action | Database action |
| --- | --- | --- |
| Build fails | Keep current release | None |
| Migration dry run fails | Keep current release | Investigate history/schema |
| Migration application fails transactionally | Keep current release | Verify partial effects, then forward-fix if needed |
| Startup or readiness fails after compatible migration | Redeploy last known-good application | Usually none |
| New application corrupts or miswrites data | Disable writes/provider as needed | Contain, assess, forward-fix, consider P5.5 restore |
| Destructive migration breaks old release | Do not blindly roll back app | Compatibility migration or controlled recovery required |
| Secret exposure | Stop deploy, rotate/revoke | Audit access and affected records |

## Release evidence record

Every staging rehearsal must record:

- date and environment;
- Git commit SHA;
- Render deploy identifier;
- migration history before and after;
- build, pre-deploy, startup, liveness, and readiness result;
- smoke checklist result;
- provider tokens and cost for approved smoke calls;
- rollback exercise result;
- operator and approver;
- unresolved findings.

## P5.1 exit criteria

P5.1 is complete only after:

- the Render Blueprint and scripts pass repository safeguards;
- the P5 operational baseline proves a full local production build and startup;
- a separate hosted Supabase staging project exists;
- a manual Render staging deployment succeeds from a clean environment;
- migrations run through the dry-run/apply path;
- health checks promote the correct release SHA;
- the staging product smoke checklist passes;
- one application rollback is exercised;
- one forward database recovery migration is rehearsed safely;
- evidence is committed or linked without secrets.

Until those hosted exercises exist, this document is a reviewed runbook—not deployment evidence.
