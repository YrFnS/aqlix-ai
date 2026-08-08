# P5 Operational Readiness

## Status

**P5 is in progress.**

P0–P4 prove the local product loop:

**Ask → Ground → Draft → Continue**

P5 does not add a broad second product. It turns the proven loop into a deployable, observable, recoverable, cost-controlled, reviewed beta and production system.

**P5.0 local operational baseline:** implemented; exact-head closeout remains required.  
**P5.1 hosted staging rehearsal:** not executed.  
**P5.2 OpenRouter BYOK foundation:** implemented; exact-head Vault, catalog, model-selection, and streaming evidence remains required.  
**Production ready: No.**

This record is the P5 architecture, environment, ownership, and exit-criteria source of truth. Public readiness claims remain blocked until every named production gate has evidence.

## P5 sequencing

P5 follows this order:

1. **P5.0 — architecture, environments, ownership, and health contract**
2. **P5.1 — release build, deployment, migrations, and rollback**
3. **P5.2 — user-owned provider credentials, live models, and provider controls**
4. **P5.3 — quotas, rate limits, and abuse controls**
5. **P5.4 — monitoring, alerting, and incident response**
6. **P5.5 — backup, restore, and disaster recovery**
7. **P5.6 — security and privacy review**
8. **P5.7 — accessibility and bilingual product-quality validation**
9. **P5.8 — provenance, licensing, and release clearance**

Later steps may be designed in parallel, but a beta or production claim cannot skip an earlier blocking gate.

## Selected production topology

The initial production topology is intentionally narrow:

```text
Internet
  |
Managed TLS / load balancer
  |
one stateless Next.js web service
  |-- Supabase Auth
  |-- Hosted Supabase PostgreSQL + RLS
  |-- Hosted Supabase private Storage
  |-- Supabase Vault for each user's OpenRouter key
  `-- OpenRouter API through authenticated server-only routes
```

### Active runtime

- One stateless Next.js web service owns the public application, authenticated routes, same-origin APIs, conversation streaming, document handling, draft operations, AI settings, and health endpoints.
- Bun `1.3.14` owns dependency installation, the committed lockfile, workspace scripts, package builds, tests, and release-command orchestration.
- Node.js `24.14.1` executes the supported Next.js production compiler and self-hosted server.
- Root `react` and `react-dom` are pinned to `19.1.1` so Next, the web workspace, and shared UI resolve one runtime.
- The deferred mobile workspace keeps React 18 nested under its own workspace and cannot control the active web runtime.
- `@iraqi-ai/ui` declares React as a peer and builds for the browser with package imports externalized; it does not bundle another React copy.
- The web service is built from one Git commit and receives a required immutable release identity in staging and production.
- The service is horizontally replaceable. PostgreSQL, private Storage, and Vault remain the durable authorities.

### Managed data services

- Hosted Supabase owns account identity, sessions, PostgreSQL, RLS, original private document objects, and encrypted per-user OpenRouter credentials.
- Supabase migrations in `supabase/migrations/` are the only approved schema history.
- Production traffic uses signed-in request-scoped clients and RLS.
- The Supabase service-role key is not a normal browser, generation, catalog, or draft request dependency.
- Raw OpenRouter keys are not stored in public tables. Public account settings retain only masked metadata, the selected model ID, and the Vault secret identifier.

### Provider

- OpenRouter is the default provider boundary for staging and production.
- Each signed-in user supplies and owns their own OpenRouter API key.
- The server validates the key against OpenRouter before encrypted storage.
- Model IDs are not hardcoded into the product or deployment configuration.
- The model catalog is loaded from OpenRouter for the connected user, searched and filtered in the UI, and refreshed without an application release.
- An exact model ID is validated against the current user-filtered catalog before it is stored.
- Conversations and draft continuation resolve the signed-in user's encrypted key and selected model at request time.
- Provider calls remain server-only; the browser never receives the decrypted key.
- The deterministic fixture provider is restricted to explicitly authorized development and test environments.
- Managed OpenAI remains an optional compatibility mode only when a deployment intentionally supplies both a server key and a model ID. It is not required by the selected OpenRouter BYOK topology.
- Application quotas, request concurrency, retry, circuit breaking, and abuse controls are P5.3 work and are not implied by BYOK.

### Excluded from the initial production topology

- The inherited FastAPI application is not a required production service for P0–P5 core behavior.
- There is no second identity, workspace, conversation, document, draft, model-catalog, or provider-credential authority.
- There is no queue or worker until an approved capability requires asynchronous execution.
- Complex parsers, OCR, native mobile, payments, voice, workflow builders, multi-agent surfaces, and collaborative realtime editing remain deferred.

## Environment contract

| Environment | Purpose | Data | Provider | Release identity | Dependency probes |
| --- | --- | --- | --- | --- | --- |
| `development` | Local interactive work | Local Supabase by default | OpenRouter BYOK, optional managed OpenAI, or explicitly enabled fixture | Optional | Optional |
| `test` | Deterministic automated evidence | Isolated local/test Supabase | Fixture or deterministic OpenRouter API harness | Optional | Enabled by integration gates |
| `staging` | Production-like release rehearsal | Separate hosted staging project | OpenRouter BYOK by default | Required | Required |
| `production` | Public beta/production traffic | Dedicated hosted production project | OpenRouter BYOK by default | Required | Required |

### Required deployment variables

All ready environments require:

- `APP_ENV`
- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `AI_PROVIDER`

Staging and production also require one release identity from:

- `RELEASE_SHA`
- `RENDER_GIT_COMMIT`
- `GITHUB_SHA`

OpenRouter BYOK staging and production do **not** require:

- `OPENROUTER_API_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- a hardcoded OpenRouter model ID

Managed OpenAI mode, when intentionally selected, requires both:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Operational health controls:

- `READINESS_PROBE_DEPENDENCIES`
- `READINESS_TIMEOUT_MS`

Provider request timeout and output-token ceilings remain deployment controls. The selected OpenRouter model remains user-owned state.

### Environment rules

- `APP_ENV` and `NEXT_PUBLIC_APP_ENV` must agree in staging and production.
- The resolved release SHA must identify the deployed Git commit in staging and production.
- `AI_PROVIDER=fixture` is rejected in staging and production.
- Fixture use requires `P2_ALLOW_FIXTURE_PROVIDER=true` and a development or test environment.
- A local `OPENROUTER_BASE_URL` override is accepted only in development or test; staging and production always resolve the official OpenRouter API endpoint.
- Runtime readiness validates deployment configuration, not individual users' provider connections.
- A user without a connected key and selected model receives an explicit persisted `PROVIDER_UNCONFIGURED` generation failure.
- Health responses expose stable status and failure codes, not credentials, selected models, or raw configuration values.

## Secrets and configuration ownership

| Value | Classification | Storage | Browser-visible | Owner |
| --- | --- | --- | ---: | --- |
| Supabase project URL | Public configuration | Deployment environment | Yes | Data-service owner |
| Supabase anon/publishable key | Public configuration protected by RLS | Deployment environment | Yes | Data-service owner |
| Supabase service-role key | Restricted administrative secret | Approved secret manager only | No | Data-service owner |
| User OpenRouter API key | Restricted user secret | Supabase Vault | No | Individual user |
| Selected OpenRouter model ID | User configuration | PostgreSQL under RLS | Yes to the owning user | Individual user |
| Managed OpenAI key, when enabled | Restricted deployment secret | Approved secret manager only | No | Provider-cost owner |
| Release SHA | Public build metadata | Deployment environment | Health metadata only | Release authority |
| Domain and certificate material | Restricted platform configuration | Managed TLS/platform | No | Release authority |
| Monitoring DSN/token | Restricted operational configuration | Approved secret manager | DSN only when intentionally public | Observability owner |

No real secret belongs in the repository, committed example files, browser bundles, logs, screenshots, workflow artifacts, query strings, or provider telemetry records.

## OpenRouter BYOK security contract

### Connect

1. The authenticated browser sends the key once to the same-origin settings API over TLS.
2. The server validates it against OpenRouter's current-key endpoint.
3. Only a validated key is written to Supabase Vault.
4. The browser receives masked metadata, never the decrypted key.
5. Replacing a key updates the Vault secret and clears no unrelated account data.

### Catalog and model selection

1. The server resolves the authenticated user's Vault credential.
2. The server loads the current user-filtered OpenRouter model catalog with `no-store` semantics.
3. The browser can search, sort, filter free models, copy model IDs, or paste a model ID manually.
4. Before persistence, the server confirms an exact matching model exists in the current catalog for that key.
5. The selected model ID is stored under the owning user's RLS-protected settings row.

### Generation

1. The conversation or draft route verifies workspace authorization first.
2. It resolves the authenticated user's key and selected model from Supabase.
3. It calls OpenRouter from the server with the selected model ID.
4. Only normalized deltas, completion state, usage, and bounded provider errors enter application persistence.
5. Disconnecting removes the settings row and its Vault secret; later generation fails explicitly until the user reconnects.

### Non-goals

- The application does not promise that a model remains available forever.
- A `:free` model or zero price observed in the live catalog is not a permanent pricing guarantee.
- The application does not silently select a replacement when a chosen model disappears.
- BYOK does not remove the need for application-level quotas, abuse controls, or safe logging.

## Ownership and decision authority

P5 begins with role-based ownership. A named person or team must be assigned before beta approval.

### Release authority

The repository owner is the default release authority until delegation is recorded.

Responsibilities:

- approve staging and production promotion;
- approve rollback or halt decisions;
- verify exact-head evidence;
- prevent public readiness claims without completed gates.

### Service owner

Responsibilities:

- Next.js runtime, release build, health endpoints, route availability, and rollback;
- dependency upgrades affecting the active product graph;
- capacity and saturation response.

### Data-service owner

Responsibilities:

- Supabase projects, migrations, RLS, Storage policies, Vault availability, backups, restores, and data recovery;
- service-role key custody;
- retention and deletion execution.

### Provider-control owner

Responsibilities:

- maintain the OpenRouter server boundary and live-catalog compatibility;
- define application ceilings, concurrency, retry, circuit-breaking, and abuse controls;
- never assume custody of an individual user's OpenRouter key or external account spend;
- approve any optional managed-provider mode.

### Individual user

Responsibilities:

- own and manage the OpenRouter account and API key they connect;
- choose a model currently available to that key;
- understand that OpenRouter/model-provider pricing, limits, and availability may change;
- disconnect or rotate the key when required.

### Security and privacy owner

Responsibilities:

- session, RLS, Vault, Storage, prompt, upload, retention, deletion, logging, and abuse review;
- acceptance or closure of security/privacy findings.

### Observability owner

Responsibilities:

- structured logs, redaction, dashboards, alerts, retention, and failure drills.

### Incident authority

The release authority is the default incident commander until a separate on-call rotation is recorded.

The incident commander may:

- disable generation or model-catalog access;
- block new uploads or writes;
- roll back a release;
- revoke or rotate deployment credentials;
- place the application into maintenance/read-only mode;
- coordinate user communication and recovery.

The application cannot rotate an external user-owned OpenRouter key on the user's behalf; it can disconnect the stored credential and instruct the user to rotate it in OpenRouter.

## Health contract

P5.0 introduces two unauthenticated infrastructure endpoints.

### `GET /api/health/live`

Purpose: prove the web process can answer HTTP.

- does not call Supabase or a model provider;
- returns `200` while the process is alive;
- returns minimal service, release, time, uptime, and request-ID metadata;
- never returns configuration, selected models, or secrets.

### `GET /api/health/ready`

Purpose: prove the process is configured to serve the selected environment.

- validates the operational runtime contract;
- optionally probes Supabase Auth with a bounded timeout;
- returns `200` only when required deployment checks pass;
- returns `503` with stable non-secret failure codes when not ready;
- does not call OpenRouter, inspect user keys, list models, or spend user credits;
- does not use the Supabase service-role key.

Individual OpenRouter connectivity is tested only inside an authenticated account flow. It is not a public infrastructure-health requirement.

## Bun-managed Node release commands

P5 establishes dedicated commands separate from fast compile-mode browser builds:

```bash
bun install --frozen-lockfile
bun run validate:release-env
bun run build:release
bun run start:release
```

Bun resolves the lockfile, builds shared packages, and invokes the release scripts. `build:release` runs the full Next.js production compiler under Node LTS. `start:release` starts only the Next.js web service under Node LTS. The inherited FastAPI and mobile placeholders are not started by the P5 release path.

## P5.0 validation evidence

The operational workflow must prove all of the following together on one exact head:

- frozen Bun installation;
- root React 19 and React DOM 19;
- mobile React 18 isolation;
- external shared-UI package dependencies;
- release environment preflight;
- deployment-script syntax;
- focused TypeScript and P0–P5 tests;
- full Next.js production rendering;
- Node production-server startup;
- liveness response;
- readiness response with configuration and Supabase Auth checks passing;
- non-secret evidence artifact upload.

## P5.2 BYOK validation evidence

The OpenRouter BYOK gate must prove all of the following without a real provider secret in CI:

- a user key is validated before persistence;
- the encrypted value is stored in Vault and not in the public settings row;
- a second account cannot read or resolve the first account's settings or key;
- the current user-filtered model catalog is fetched live from the configured provider endpoint;
- search, free-only filtering, exact model validation, and model selection work;
- a conversation streams through the selected dynamic model ID;
- provider/model/usage metadata persists with the generation;
- disconnect deletes the Vault secret;
- generation after disconnect fails explicitly rather than falling back to a platform model;
- the test endpoint override is unavailable in staging and production.

This deterministic gate proves our integration behavior. It does not prove current public OpenRouter uptime, a specific model's quality, or a permanent free tier.

## P5.0 acceptance criteria

P5.0 is complete only when:

- this topology and environment contract are committed;
- ownership roles and incident authority are explicit;
- staging and production configuration rules reject invalid or fixture-provider deployments;
- liveness and readiness endpoints are implemented and tested;
- readiness fails closed and does not expose secrets;
- a frozen Bun dependency path and Node LTS Next release path exist;
- one React runtime owns the active web graph;
- a workflow starts local dependencies, launches the release build, and verifies both health endpoints;
- the final exact PR head repeats every required operational and P0–P4 regression gate;
- README, roadmap, tracker, and pull request state remain honest about production readiness.

## Beta gate

Beta approval requires named evidence for at least:

- clean-environment deployment;
- ordered migration and failed-deploy recovery;
- authenticated user-owned provider-key and live-model flow;
- account/workspace quotas and provider request ceilings;
- structured logs and actionable alerts;
- database, object, and Vault-secret recovery/deletion exercises;
- security/privacy review with accepted findings;
- keyboard, screen-reader, RTL/LTR, and responsive validation;
- dependency and provenance clearance for distributed material.

## Production gate

Production approval additionally requires:

- exercised rollback and disaster recovery;
- measured recovery point and recovery time;
- active incident ownership and communication runbook;
- validated retention and deletion behavior;
- capacity and abuse thresholds;
- no unresolved release-blocking security, privacy, accessibility, licensing, or provenance finding;
- exact deployment evidence tied to one release SHA.

Until every production gate is satisfied, repository and public documentation must continue to state:

**Production ready: No.**
