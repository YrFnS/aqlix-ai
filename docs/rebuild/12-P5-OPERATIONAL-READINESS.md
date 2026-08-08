# P5 Operational Readiness

## Status

**P5 is in progress.**

P0–P4 prove the local product loop:

**Ask → Ground → Draft → Continue**

P5 does not add a broader product surface. It turns the proven loop into a deployable, observable, recoverable, cost-controlled, reviewed beta and production system.

**Production ready: No.**

This record is the P5 architecture, environment, ownership, and exit-criteria source of truth. Public readiness claims remain blocked until every named production gate has evidence.

## P5 sequencing

P5 follows this order:

1. **P5.0 — architecture, environments, ownership, and health contract**
2. **P5.1 — release build, deployment, migrations, and rollback**
3. **P5.2 — real-provider smoke path and provider controls**
4. **P5.3 — quotas, rate limits, and abuse controls**
5. **P5.4 — monitoring, alerting, and incident response**
6. **P5.5 — backup, restore, and disaster recovery**
7. **P5.6 — security and privacy review**
8. **P5.7 — accessibility and bilingual product-quality validation**
9. **P5.8 — provenance, licensing, and release clearance**

Later steps may be designed in parallel, but a production claim cannot skip an earlier blocking gate.

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
  `-- OpenAI API through server-only routes
```

### Active runtime

- One stateless Next.js web service owns the public application, authenticated routes, same-origin APIs, conversation streaming, document handling, draft operations, and health endpoints.
- Bun `1.3.14` remains the only JavaScript package manager and release command runner.
- The web service is built from one Git commit and receives a required `RELEASE_SHA` in staging and production.
- The service is horizontally replaceable. PostgreSQL and private Storage remain the durable authorities.

### Managed data services

- Hosted Supabase owns account identity, sessions, PostgreSQL, RLS, and original private document objects.
- Supabase migrations in `supabase/migrations/` are the only approved schema history.
- Production traffic uses signed-in request-scoped clients and RLS. The service-role key is not a normal request dependency.

### Provider

- OpenAI is the initial production generation provider.
- Provider access remains server-only.
- The deterministic fixture provider is restricted to explicitly authorized development and test environments.
- Provider budgets, concurrency, retry, circuit breaking, and protected smoke evidence are P5.2 work and are not implied by this topology decision.

### Excluded from the initial production topology

- The inherited FastAPI application is not a required production service for P0–P5 core behavior.
- There is no second identity, workspace, conversation, document, or draft authority.
- There is no queue or worker until an approved capability requires asynchronous execution.
- Complex parsers, OCR, native mobile, payments, voice, workflow builders, multi-agent surfaces, and collaborative realtime editing remain deferred.

## Environment contract

| Environment | Purpose | Data | Provider | Release identity | Dependency probes |
| --- | --- | --- | --- | --- | --- |
| `development` | Local interactive work | Local Supabase by default | OpenAI or explicitly enabled fixture | Optional | Optional |
| `test` | Deterministic automated evidence | Isolated local/test Supabase | Explicit fixture | Optional | Enabled by integration gates |
| `staging` | Production-like release rehearsal | Separate hosted staging project | OpenAI only | Required | Required |
| `production` | Public beta/production traffic | Dedicated hosted production project | OpenAI only | Required | Required |

### Required runtime variables

All ready environments require:

- `APP_ENV`
- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `AI_PROVIDER`

Staging and production also require:

- `RELEASE_SHA`
- `OPENAI_API_KEY`

Operational health controls:

- `READINESS_PROBE_DEPENDENCIES`
- `READINESS_TIMEOUT_MS`

Provider-specific model and timeout variables remain defined by the existing server-only provider contract.

### Environment rules

- `APP_ENV` and `NEXT_PUBLIC_APP_ENV` must agree in staging and production.
- `RELEASE_SHA` must identify the deployed Git commit in staging and production.
- `AI_PROVIDER=fixture` is rejected in staging and production.
- Fixture use requires `P2_ALLOW_FIXTURE_PROVIDER=true` and a development or test environment.
- Runtime readiness fails closed when required configuration is invalid.
- Health responses expose stable status and failure codes, not credentials or raw configuration values.

## Secrets and configuration ownership

| Value | Classification | Storage | Browser-visible | Owner |
| --- | --- | --- | ---: | --- |
| Supabase project URL | Public configuration | Deployment environment | Yes | Data-service owner |
| Supabase anon/publishable key | Public configuration protected by RLS | Deployment environment | Yes | Data-service owner |
| Supabase service-role key | Restricted administrative secret | Approved secret manager only | No | Data-service owner |
| OpenAI API key | Restricted provider secret | Approved secret manager only | No | Provider-cost owner |
| Release SHA | Public build metadata | Deployment environment | Health metadata only | Release authority |
| Domain and certificate material | Restricted platform configuration | Managed TLS/platform | No | Release authority |
| Monitoring DSN/token | Restricted operational configuration | Approved secret manager | DSN only when intentionally public | Observability owner |

No real secret belongs in the repository, committed example files, browser bundles, logs, screenshots, or workflow artifacts.

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

- Supabase projects, migrations, RLS, Storage policies, backups, restores, and data recovery;
- service-role key custody;
- retention and deletion execution.

### Provider-cost owner

Responsibilities:

- OpenAI key custody;
- model change approval;
- spend caps, budgets, concurrency, and provider incident response.

### Security and privacy owner

Responsibilities:

- session, RLS, Storage, prompt, upload, retention, deletion, logging, and abuse review;
- acceptance or closure of security/privacy findings.

### Observability owner

Responsibilities:

- structured logs, redaction, dashboards, alerts, retention, and failure drills.

### Incident authority

The release authority is the default incident commander until a separate on-call rotation is recorded.

The incident commander may:

- disable generation;
- block new uploads or writes;
- roll back a release;
- revoke or rotate credentials;
- place the application into maintenance/read-only mode;
- coordinate user communication and recovery.

## Health contract

P5.0 introduces two unauthenticated infrastructure endpoints:

### `GET /api/health/live`

Purpose: prove the web process can answer HTTP.

- does not call Supabase or OpenAI;
- returns `200` while the process is alive;
- returns minimal service, release, time, uptime, and request-ID metadata;
- never returns configuration or secrets.

### `GET /api/health/ready`

Purpose: prove the process is configured to serve the selected environment.

- validates the operational runtime contract;
- optionally probes Supabase Auth with a bounded timeout;
- returns `200` only when required checks pass;
- returns `503` with stable non-secret failure codes when not ready;
- does not call the model provider or spend tokens;
- does not use the Supabase service-role key.

Provider availability and budget validation require the protected P5.2 smoke path, not a public readiness probe.

## Bun-only release commands

P5 establishes dedicated commands separate from fast compile-mode browser builds:

```bash
bun install --frozen-lockfile
bun run build:release
bun run start:release
```

`build:release` builds shared packages, then executes a full Next.js production build for the active web service. `start:release` starts only that web service. The inherited FastAPI and mobile placeholders are not started by the P5 release path.

## P5.0 acceptance criteria

P5.0 is complete only when:

- this topology and environment contract are committed;
- ownership roles and incident authority are explicit;
- staging and production configuration rules reject invalid or fixture-provider deployments;
- liveness and readiness endpoints are implemented and tested;
- readiness fails closed and does not expose secrets;
- one Bun-only release build and startup path exists;
- a workflow starts local dependencies, launches the release build, and verifies both health endpoints;
- README, roadmap, tracker, and pull request state remain honest about production readiness.

## Beta gate

Beta approval requires named evidence for at least:

- clean-environment deployment;
- ordered migration and failed-deploy recovery;
- protected real-provider smoke test;
- account/workspace quotas and provider budgets;
- structured logs and actionable alerts;
- database and object restore exercise;
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
