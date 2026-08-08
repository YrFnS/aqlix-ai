# Kiteb — Product Rebuild

> **Kiteb is a provisional working name.** Trademark, company-name, domain, handle, and Arabic-language clearance are required before public launch or permanent namespace migration.

Kiteb is an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The rebuild deliberately narrows the inherited repository to one trustworthy product loop:

**Ask → Ground → Draft → Continue**

## Current status

- **P0 — reset and trustworthy foundation:** complete and merged
- **P1 — account, workspace, persistence, and authorization:** complete and merged
- **P2 — persistent bilingual conversation:** complete and merged
- **P3 — private documents, inspectable sources, and grounded citations:** complete and merged
- **P4 — durable drafts and reusable work:** implemented on PR `#6`, in final exact-head closeout
- **Next:** P5 — operational readiness
- **Production ready:** No

P4 completion proves the core application loop against local Supabase Auth, PostgreSQL, RLS, private Storage, the normalized provider boundary, and Chromium. It does not certify production deployment, security, privacy, accessibility, model quality, or public-launch readiness.

## What works now

### Ask

- Create an authenticated workspace.
- Start persistent Arabic, English, or mixed-direction conversations.
- Stream assistant output through one normalized server-sent-event contract.
- Stop a response while preserving partial text.
- Retry failed or cancelled attempts without overwriting history.
- Inspect provider, model, token, latency, cancellation, and failure state.

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
- Create immutable versions only when accepted content actually changes.
- Restore an older snapshot as a new version rather than rewriting history.
- Archive, restore, reopen, and delete drafts.

### Continue

- Request a bounded provider proposal to improve, shorten, expand, translate, continue, or custom-revise the accepted draft.
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

## Authorization model

Normal account, workspace, conversation, source, citation, and draft traffic uses the signed-in request-scoped Supabase client. It does not use the service-role key.

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
- draft proposal attempts and telemetry.

Supabase Storage owns original private document bytes. Provider-hosted conversation or draft state is not used as the application source of truth.

## Validation

The P4 branch requires the complete P0–P4 matrix:

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

The P4 PostgreSQL gate validates each earlier phase at its own schema boundary, migrates forward, then proves:

- direct authenticated draft-history mutation is revoked;
- atomic draft creation from a completed assistant message;
- copied citation provenance;
- immutable version one;
- no-op save detection;
- manual versions;
- stale-write rejection;
- restore as a new version;
- proposal checkpoint, completion, apply, discard, cancellation, and failure;
- stale proposal rejection;
- viewer and outsider isolation;
- archived draft and workspace guards;
- deleted-source snapshots;
- atomic origin detachment before conversation deletion;
- draft-child cascades.

The P4 Chromium journey validates:

- real sign-up and workspace creation;
- private document upload and grounded cited answer;
- all six draft structures;
- explicit edit/save/reload behavior;
- clipboard copy;
- TXT, Markdown, and safe HTML export;
- version inspection and restore;
- provider proposal discard, apply, Stop, partial persistence, and failure;
- deleted-source provenance;
- viewer read/export-only behavior;
- outsider non-disclosure;
- draft archive/restore;
- workspace read-only behavior;
- responsive mobile layout;
- deletion, sign-out, and hydration monitoring.

The browser journeys use an explicitly enabled deterministic fixture provider. They prove application streaming, persistence, authorization, and lifecycle mechanics. They do not prove external provider availability or model quality.

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

## Development

### Requirements

- Bun `1.3.14`, pinned in the root `packageManager` field
- Docker for local Supabase
- Supabase CLI through the locked root dependency
- Node.js 20 or later where required by inherited packages
- an OpenAI API key only when intentionally exercising the real provider adapter

### Install

```bash
bun install --frozen-lockfile
```

### Start local Supabase

```bash
bunx supabase start
bunx supabase status -o env
```

Configure `apps/web/.env.local` with the local public values:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-public-key>
NEXT_PUBLIC_APP_ENV=development
APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For the real provider adapter, add server-only values:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=<server-only-key>
OPENAI_MODEL=gpt-5-mini
OPENAI_BASE_URL=https://api.openai.com/v1
AI_REQUEST_TIMEOUT_MS=60000
AI_MAX_OUTPUT_TOKENS=2048
```

For deterministic local integration testing only:

```env
APP_ENV=test
AI_PROVIDER=fixture
P2_ALLOW_FIXTURE_PROVIDER=true
```

Staging and production reject the fixture provider even when the opt-in flag is present.

### Run

```bash
bun run dev
```

### Active quality gates

```bash
bun install --frozen-lockfile
bun run build:packages
bun run lint
bun run typecheck
bun run test:p4
cd apps/web && bun run build
```

With local Supabase configured:

```bash
bun run test:e2e:p1
bun run test:e2e:p2
bun run test:e2e:p3
bun run test:e2e:p4
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
└── mobile/    Deferred placeholder application

packages/
├── types/             Generated database types and runtime contracts
├── supabase-client/   Request-scoped browser/server/middleware clients
├── ui/                Selected shared RTL and input utilities
├── arabic-nlp/        Retained Arabic text utilities
└── ...                 Audit or quarantine packages listed in rebuild inventories

supabase/
├── config.toml        Reproducible local Auth/API/DB/Storage project
├── migrations/        Canonical authorization and lifecycle contracts
└── tests/             P1–P4 ownership, isolation, lifecycle, and cascade regressions
```

FastAPI is not a second identity, workspace, conversation, document, or draft authority. It may return for isolated background work only after audit, using the same account and workspace contract.

## Next phase: P5 operational readiness

P5 begins after P4 is merged. Its required outcomes include:

1. one documented deployment topology and Bun-only release path;
2. protected real-provider smoke validation in a cost-controlled environment;
3. account/workspace quotas, rate limits, and provider budgets;
4. monitoring, structured logs, alerts, and incident response;
5. reproducible database and object-storage backup and restore exercises;
6. security and privacy review for sessions, RLS, prompts, uploads, retention, deletion, and logs;
7. dependency, license, asset, and code-provenance clearance;
8. production migration, rollback, and disaster-recovery procedures;
9. measured accessibility and responsive validation beyond the focused foundation;
10. explicit beta and production exit criteria.

## What “ready” will mean

A public release is ready only when:

- visible behavior matches documentation;
- deployment, migrations, rollback, backup, and restore are reproducible;
- provider budgets and abuse controls exist;
- monitoring and incident response are exercised;
- secrets, sessions, RLS, uploads, retention, deletion, and logs are reviewed;
- Arabic, English, RTL, LTR, mixed text, keyboard use, and responsive layouts are validated;
- third-party code and assets have documented provenance and compatible licensing;
- public claims have named evidence and owners.

Until then, **production ready remains No**.
