# Kiteb — Product Rebuild

> **Kiteb is the selected working product name.** Trademark, company-name, domain, handle, and Arabic-language clearance are still required before public launch. The recommended repository slug is `kiteb`.

Kiteb is an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The rebuild deliberately narrows the inherited repository to one trustworthy product loop:

**Ask → Ground → Draft → Continue**

## Current status

- **P0 — reset and trustworthy foundation:** complete and merged
- **P1 — account, workspace, persistence, and authorization:** complete and merged
- **P2 — persistent bilingual conversation:** complete and merged
- **P3 — private documents, inspectable sources, and grounded citations:** complete and merged
- **P4 — durable drafts and reusable work:** complete and merged
- **P5 — operational readiness:** in progress on draft PR `#7`
- **OpenRouter BYOK foundation:** implemented; final exact-head validation in progress
- **Hosted staging deployment completed:** No
- **Production ready:** No

P0–P4 prove the complete application loop against local Supabase Auth, PostgreSQL, RLS, private Storage, the normalized provider boundary, and Chromium.

P5 has established a reproducible local release baseline and is adding user-owned OpenRouter credentials, a live model catalog, deployment safeguards, quotas, monitoring, recovery, and release review. It does not yet prove a hosted staging deployment, current public-provider availability, backup/restore, security/privacy clearance, or public-launch readiness.

## What works now

### Ask

- Create an authenticated workspace.
- Start persistent Arabic, English, or mixed-direction conversations.
- Stream assistant output through one normalized server-sent-event contract.
- Stop a response while preserving partial text.
- Retry failed or cancelled attempts without overwriting history.
- Inspect provider, selected model, token, latency, cancellation, and failure state.

### Ground

- Upload private UTF-8 TXT or Markdown files up to 2 MiB.
- Validate filename, extension, media type, byte size, UTF-8, control content, line length, and duplicate hash.
- Store original bytes in a private Supabase Storage bucket.
- Extract deterministic, bounded passages with real line and offset locators.
- Search passages only inside the authorized workspace.
- Open the exact supporting passage.
- Enable grounded conversation mode explicitly.
- Persist citation snapshots and reject a grounded completion without valid references.
- Preserve an honest unavailable-source snapshot after a document is deleted.

PDF, DOCX, OCR, images, spreadsheets, presentations, archives, audio, and video remain unsupported until real parser/worker paths and security fixtures exist.

### Draft

- Turn a completed assistant message into one of six deterministic structures:
  - summary
  - comparison
  - email
  - memo
  - checklist
  - decision note
- Create the initial draft without an extra provider request.
- Copy persisted message citations into durable draft provenance.
- Edit Arabic, English, or mixed-direction content.
- See explicit saved, unsaved, saving, and failed-save states.
- Save with `Ctrl+S` / `Cmd+S`.
- Create immutable versions only when accepted content changes.
- Restore an older snapshot as a new version rather than rewriting history.
- Archive, restore, reopen, and delete drafts.

### Continue

- Request a bounded proposal to improve, shorten, expand, translate, continue, or custom-revise the accepted draft.
- Stream the proposal into a separate review panel.
- Keep accepted content unchanged during generation.
- Stop and preserve partial proposal text.
- Apply a complete proposal as a new immutable version.
- Discard a proposal without changing accepted work.
- Reject a late proposal when the draft changed after generation began.
- Persist provider telemetry and explicit failure state.

### Reuse

- Copy the accepted draft.
- Export the latest saved version as:
  - UTF-8 plain text
  - UTF-8 Markdown
  - standalone escaped UTF-8 HTML
- Keep HTML exports script-free and free of remote resources.

PDF and DOCX export are not implemented or claimed.

## OpenRouter: user-owned key and live models

Kiteb does not require a platform-owned OpenRouter or OpenAI key for the selected production design.

Each signed-in user can open **AI Settings** and:

1. paste their own OpenRouter API key;
2. validate it before storage;
3. store it encrypted in Supabase Vault;
4. search the current model catalog available to that key;
5. filter free models;
6. sort and inspect model metadata;
7. copy or paste an exact model ID;
8. validate and select that model;
9. change models later without a deployment;
10. disconnect and remove the stored Vault secret.

Important boundaries:

- The raw key is never returned to the browser after connection.
- Public tables store only masked metadata, the selected model ID, and a Vault secret reference.
- Model names are not hardcoded into production configuration.
- A selected model is validated against the live user-filtered catalog before persistence.
- A missing key or model produces an explicit persisted `PROVIDER_UNCONFIGURED` failure.
- Model price, availability, context length, and free-tier status can change at OpenRouter; Kiteb displays current catalog data rather than promising permanence.
- Managed OpenAI remains an optional compatibility mode when a deployment explicitly supplies both a server key and model ID. It is not required by the OpenRouter BYOK path.

## Authorization model

Normal account, workspace, conversation, source, citation, draft, and AI-settings traffic uses the signed-in request-scoped Supabase client. It does not use the service-role key.

| Capability | Owner | Editor | Viewer | Outsider |
| --- | ---: | ---: | ---: | ---: |
| Read workspace data | Yes | Yes | Yes | No |
| Send conversation messages | Yes | Yes | No | No |
| Upload/delete source documents | Yes | Yes | No | No |
| Search and inspect passages | Yes | Yes | Yes | No |
| Create/edit/version drafts | Yes | Yes | No | No |
| Export accepted drafts | Yes | Yes | Yes | No |
| Start/apply/discard proposals | Yes | Yes | No | No |
| Archive/restore/delete drafts | Yes | Yes | No | No |

AI provider settings are account-scoped rather than workspace-scoped. Each authenticated account can read and change only its own masked settings, Vault credential, and selected model.

Archived workspaces are read-only for every role. Archived drafts remain readable and exportable, but cannot be edited or sent to a provider until restored.

## Data authority

PostgreSQL remains authoritative for:

- workspace membership and roles;
- conversations and ordered messages;
- provider attempts and telemetry;
- attachments and processing attempts;
- extracted source passages and search indexes;
- message citations;
- current draft state;
- immutable draft versions;
- draft provenance snapshots;
- draft proposal attempts and telemetry;
- masked AI connection metadata and selected model IDs.

Supabase Storage owns original private document bytes. Supabase Vault owns encrypted user OpenRouter keys. Provider-hosted conversation or draft state is not used as the application source of truth.

## Operational baseline

### Runtime ownership

- **Bun `1.3.14`** owns dependency installation, the committed lockfile, workspace scripts, package builds, tests, and command orchestration.
- **Node.js `24.14.1`** executes the supported Next.js production compiler and self-hosted server.
- Root `react` and `react-dom` are pinned to `19.1.1` for Next and the web workspace.
- The deferred mobile workspace retains its nested React 18 dependency without changing the active web runtime.
- `@iraqi-ai/ui` treats React as a peer and externalizes package imports instead of bundling another React copy.

### Health endpoints

- `GET /api/health/live` proves the web process can answer HTTP without calling dependencies.
- `GET /api/health/ready` validates the operational environment and performs a bounded Supabase Auth health probe.
- Readiness returns stable non-secret failure codes.
- Readiness never decrypts user keys, lists models, calls OpenRouter, or spends user credits.

### Staging delivery intent

The committed first rehearsal target is one manually promoted Render service in Frankfurt backed by a separate hosted Supabase staging project.

The Blueprint and runbooks define:

- immutable release identity;
- frozen dependency installation;
- full production build and startup;
- ordered migration history inspection;
- migration dry run before apply;
- health-based traffic promotion;
- application rollback;
- forward-only database recovery;
- production migration lock;
- OpenRouter BYOK without a platform provider secret or hardcoded model.

They are infrastructure intent, not evidence that a hosted staging service has already been provisioned.

## Validation

The current branch keeps the complete P0–P4 matrix and adds:

- **P5 Operational Baseline**
- **P5 OpenRouter BYOK Journey**

The OpenRouter gate uses a deterministic local OpenRouter-compatible API and local Supabase Vault. It verifies:

- key validation before storage;
- encrypted Vault storage;
- masked settings responses;
- account isolation;
- live catalog search and free-only filtering;
- exact dynamic model validation;
- selected-model conversation streaming;
- persisted provider/model/token telemetry;
- Vault deletion on disconnect;
- explicit generation failure after disconnect.

This proves Kiteb's integration mechanics without committing a real user key or claiming public-provider uptime or model quality.

The full exact-head matrix includes:

- **CI Quality Gates**
- **PR Validation**
- **Arabic & RTL Foundation**
- **Accessibility Foundation**
- **Product Language & Claims Safeguards**
- **P1 Data Contract**
- **P1 Authenticated Browser Journey**
- **P2 Conversation Data Contract**
- **P2 Bilingual Conversation Journey**
- **P3 Document Source Data Contract**
- **P3 Private Document Source Journey**
- **P4 Durable Draft Data Contract**
- **P4 Ask Ground Draft Continue Journey**
- **P5 Operational Baseline**
- **P5 OpenRouter BYOK Journey**

## Rebuild source of truth

- [Rebuild overview](./docs/rebuild/README.md)
- [Product brief](./docs/rebuild/00-PRODUCT-BRIEF.md)
- [Brand direction](./docs/rebuild/01-BRAND-DIRECTION.md)
- [Roadmap](./docs/rebuild/02-REBUILD-ROADMAP.md)
- [Implementation tracker](./docs/rebuild/03-IMPLEMENTATION-TRACKER.md)
- [Decision log](./docs/rebuild/04-DECISION-LOG.md)
- [Legacy disposition](./docs/rebuild/05-LEGACY-DISPOSITION.md)
- [P1 architecture](./docs/rebuild/06-P1-ARCHITECTURE.md)
- [P1 repository inventory](./docs/rebuild/07-P1-INVENTORY.md)
- [P2 conversation architecture](./docs/rebuild/08-P2-ARCHITECTURE.md)
- [P3 source architecture](./docs/rebuild/09-P3-ARCHITECTURE.md)
- [P3 grounded conversation architecture](./docs/rebuild/10-P3-GROUNDED-CONVERSATIONS.md)
- [P4 draft architecture](./docs/rebuild/11-P4-ARCHITECTURE.md)
- [P5 operational readiness](./docs/rebuild/12-P5-OPERATIONAL-READINESS.md)
- [P5 deployment and rollback](./docs/rebuild/13-P5-DEPLOYMENT-AND-ROLLBACK.md)

## Development

### Requirements

- Bun `1.3.14`, pinned in the root `packageManager` field
- Node.js `24.14.1` for the Next.js release build and server
- Docker for local Supabase
- Supabase CLI through the locked root dependency
- an OpenRouter account and user-owned API key only when exercising the real provider path

### Install

```bash
bun install --frozen-lockfile
```

### Start local Supabase

```bash
bunx supabase start
bunx supabase status -o env
```

Configure `apps/web/.env.local` with local public values:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-public-key>
NEXT_PUBLIC_APP_ENV=development
APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000
AI_PROVIDER=openrouter
AI_REQUEST_TIMEOUT_MS=60000
AI_MAX_OUTPUT_TOKENS=2048
```

Run the application, register, then connect the personal key and choose a current model at `/settings/ai`. No OpenRouter key or model ID is required in `.env.local`.

For deterministic local fixture-provider testing only:

```env
APP_ENV=test
AI_PROVIDER=fixture
P2_ALLOW_FIXTURE_PROVIDER=true
```

For the dedicated OpenRouter-compatible integration harness only:

```env
APP_ENV=test
AI_PROVIDER=openrouter
OPENROUTER_BASE_URL=http://127.0.0.1:4011/api/v1
```

The base-URL override is ignored in staging and production.

Optional managed OpenAI compatibility mode:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=<server-only-key>
OPENAI_MODEL=<explicit-current-model-id>
OPENAI_BASE_URL=https://api.openai.com/v1
```

Staging and production reject the fixture provider even when the opt-in flag is present.

### Run locally

```bash
bun run dev
```

### Active quality gates

```bash
bun install --frozen-lockfile
bun run build:packages
bun run lint
bun run typecheck
bun run test:p5
cd apps/web && bun run build
```

### Release build and startup

With the complete runtime environment configured:

```bash
bun run validate:release-env
bun run build:release
bun run start:release
```

Bun invokes the scripts; the Next.js production build and server execute under the pinned Node LTS runtime.

With local Supabase configured:

```bash
bun run test:e2e:p1
bun run test:e2e:p2
bun run test:e2e:p3
bun run test:e2e:p4
bun run test:e2e:p5
```

Stop local Supabase with:

```bash
bunx supabase stop --no-backup
```

## Architecture boundary

```text
apps/
├── web/       Active Next.js product application
├── api/       Inherited FastAPI capability service under audit
└── mobile/    Deferred placeholder application with isolated React 18

packages/
├── types/             Generated database types and runtime contracts
├── supabase-client/   Request-scoped browser/server/middleware clients
├── ui/                Shared browser-targeted UI with external peer dependencies
├── arabic-nlp/        Retained Arabic text utilities
└── ...                 Audit or quarantine packages listed in rebuild inventories

supabase/
├── config.toml        Reproducible local Auth/API/DB/Storage/Vault project
├── migrations/        Canonical authorization and lifecycle contracts
└── tests/             Ownership, isolation, lifecycle, Vault, and cascade regressions
```

FastAPI is not a second identity, workspace, conversation, document, draft, credential, or model authority. It may return for isolated background work only after audit, using the same account and workspace contract.

## Remaining P5 work

1. Finish the exact-head OpenRouter BYOK and release-startup gates.
2. Provision a separate hosted Supabase staging project.
3. Execute one clean manual Render deployment through the migration and readiness path.
4. Run the authenticated staging smoke checklist with a disposable user-owned OpenRouter key.
5. Exercise application rollback and forward database recovery.
6. Add account/workspace quotas, rate limits, concurrency limits, and request ceilings.
7. Add structured logs, dashboards, actionable alerts, and incident response.
8. Execute database, private-object, and Vault deletion/recovery exercises.
9. Complete security, privacy, retention, deletion, accessibility, and bilingual quality reviews.
10. Clear third-party dependency, code, font, asset, screenshot, and generated-material provenance.

## What “ready” will mean

A public release is ready only when:

- visible behavior matches documentation;
- deployment, migrations, rollback, backup, and restore are reproducible;
- provider request ceilings and abuse controls exist even with BYOK;
- monitoring and incident response are exercised;
- secrets, Vault, sessions, RLS, uploads, retention, deletion, and logs are reviewed;
- Arabic, English, RTL, LTR, mixed text, keyboard use, and responsive layouts are validated;
- third-party code and assets have documented provenance and compatible licensing;
- public claims have named evidence and owners.

Until then, **production ready remains No**.
