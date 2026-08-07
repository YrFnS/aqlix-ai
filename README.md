# Kiteb — Product Rebuild

> **Kiteb is a provisional working name.** Trademark, company-name, domain, handle, and Arabic-language clearance are required before public launch or permanent namespace migration.

Kiteb is being rebuilt as an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The repository previously presented a much broader system with agents, professional domains, payments, automation, voice, and compliance claims. The rebuild narrows the product to one complete journey:

**Ask → Ground → Draft → Continue**

## Current status

- **P0:** complete and merged to `develop`
- **P1:** account and persistent workspace foundation in progress on `agent/p1-workspace-foundation`
- **P1 pull request:** `#3` against `develop`
- **Production ready:** No

P1 currently implements:

- Supabase email/password account creation, sign-in, confirmation, session refresh, and sign-out;
- protected Next.js application routes;
- persistent PostgreSQL workspaces and memberships;
- owner, editor, and viewer authorization through row-level security;
- workspace create, list, open, edit, archive, restore, and confirmed deletion;
- typed same-origin `/api/v1` workspace endpoints with stable JSON errors and request IDs;
- real loading, empty, inaccessible, persistence-failure, offline, and responsive-navigation states;
- schema-ready conversation, message, attachment, source, and draft records for later phases;
- PostgreSQL migration/RLS tests and a real two-account browser journey using local Supabase.

P1 remains incomplete until the **final PR head** passes every required workflow, including the authenticated browser journey.

The following are not yet product capabilities:

- real model streaming and persistent AI messages;
- document upload, extraction, retrieval, and source citations;
- editable reusable drafts, versioning, and export;
- production containers and deployment validation;
- backup and restore validation;
- security, privacy, accessibility, cultural, dialect, legal, medical, or financial certification;
- third-party code and asset provenance clearance.

## Product loop

The first trustworthy release must eventually let a user:

1. **Ask** — begin with a question or task in Arabic or English.
2. **Ground** — attach supporting documents and inspect the source passages.
3. **Draft** — turn the result into a reusable summary, comparison, email, memo, checklist, or decision note.
4. **Continue** — close the application and return to the same authorized workspace, conversation, sources, and draft.

P1 builds the durable account, membership, workspace, and data contract required for that journey. P2–P4 implement the real conversation, documents/sources, and draft experiences.

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

## Branch model

The former active heads are preserved as:

- `legacy/main-2026-08-07`
- `legacy/develop-2026-08-07`

P0 was merged through PR `#2`. P1 is developed on one focused branch and draft pull request:

- `agent/p1-workspace-foundation`
- PR `#3` → `develop`

Starting from `develop` preserves potentially useful history. It does not approve inherited code for continued use. Existing subsystems remain active, retained, audit, quarantine, deferred, or later-removal scope as recorded in the inventory.

## Development

### Requirements

- Bun `1.3.14`, pinned in the root `packageManager` field
- Docker for the local Supabase stack
- Supabase CLI through the locked root dependency (`bunx supabase`)
- Node.js 20 or later where required by inherited packages
- Python only when auditing or later implementing the FastAPI capability service

### Install

```bash
bun install --frozen-lockfile
```

### Run the web foundation without account services

```bash
bun run dev
```

The marketing surfaces and clean production build do not require placeholder service credentials. Account and workspace routes fail closed and explain that Supabase configuration is unavailable.

### Run P1 with local Supabase

```bash
bunx supabase start
bunx supabase status -o env
```

Copy the local `API_URL` and anonymous/publishable key into `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local public key>
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then start the web application:

```bash
bun run dev
```

The service-role key is not required for normal account or workspace requests. Those requests use the signed-in user session and PostgreSQL RLS.

Stop the local stack with:

```bash
bunx supabase stop --no-backup
```

## Active quality gates

```bash
bun install --frozen-lockfile
bun run build:packages
bun run lint
bun run typecheck
bun run test:p1
cd apps/web && bun run build
```

P1 also requires CI workflows that:

- apply all P1 migrations to PostgreSQL and validate owner membership, roles, tenant isolation, foreign keys, insert-returning visibility, and cascades;
- start a local Supabase project and run the focused Chromium account/workspace journey.

The browser journey covers real signup/session cookies, mixed Arabic-English content, persistence after reload, typed API reads, second-account isolation, edit, archive, restore, offline feedback, responsive navigation, deletion, sign-out, keyboard use, and hydration errors.

## Legacy audit commands

Inherited tests and broad workspace checks remain available behind explicit legacy commands:

```bash
bun run typecheck:legacy
bun run test:legacy
bun run test:legacy:integration
bun run test:legacy:e2e
```

They are audit inputs, not approved release gates. Failures must be classified as retained work, legacy debt, missing provenance, or removable scope.

## Architecture boundary

```text
apps/
├── web/       Active Next.js account and workspace application
├── api/       FastAPI capability service under audit for P2/P3
└── mobile/    Deferred placeholder application

packages/
├── types/             Generated database types and shared runtime contracts
├── supabase-client/   Request-scoped browser/server/middleware clients
├── ui/                Selected shared RTL and input utilities
├── arabic-nlp/        Retained Arabic text utilities
└── ...                 Audit or quarantine packages listed in the P1 inventory

supabase/
├── config.toml        Minimal reproducible local Auth/API/DB project
├── migrations/        Canonical P1 PostgreSQL schema and authorization changes
└── tests/             Owner, role, tenant, FK, and cascade regression tests
```

FastAPI is not a second identity or workspace authority. It may return for model streaming, document processing, retrieval, and background jobs only after audit, using the same account and workspace contract.

## Product and engineering rules

1. Visible behavior must match documentation.
2. Placeholder states must be labelled as placeholders.
3. Arabic and English receive equal product-quality treatment.
4. Public claims require reproducible evidence.
5. One complete vertical slice comes before scope expansion.
6. Normal user traffic uses sessions and RLS, not administrative bypass.
7. Secrets, authorization, uploads, retention, and deletion are tested before beta.
8. Third-party code and assets require documented origin and compatible licensing.
9. Bun remains the single JavaScript package manager unless a recorded decision changes it.
10. Active rebuild gates and inherited legacy audits remain visibly separate.
11. Broad legacy deletion is performed in separate reversible pull requests.

## Licensing and provenance

Repository licensing and code provenance remain under review. Historical package metadata or README statements are not a complete licensing determination for the repository.

Extracted examples, adapted code, screenshots, reports, generated assets, specialist systems, payment integrations, and inherited benchmarks remain quarantined until their source, license, modifications, and release compatibility are documented.

## What “ready” will mean

The first trustworthy release must complete the whole Ask → Ground → Draft → Continue journey with:

- persistent authorized data;
- a real model provider and observable failures;
- inspectable source passages;
- reusable saved drafts;
- Arabic, English, RTL, LTR, mixed text, keyboard, and responsive validation;
- reviewed secrets, uploads, retention, deletion, and logs;
- reproducible deployment, backup, and restore;
- documented third-party provenance.
