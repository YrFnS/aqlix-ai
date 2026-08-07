# Kiteb — Product Rebuild

> **Kiteb is a provisional working name.** Trademark, company-name, domain, handle, and Arabic-language clearance are required before public launch or permanent namespace migration.

Kiteb is being rebuilt as an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The repository previously presented a much broader “Iraqi AI Chat System” with agents, professional domains, payments, automation, voice, and compliance claims. The visible product and underlying integrations did not consistently support that story. The rebuild resets the product around one complete user journey.

## Current status

**Phase:** P0 complete — P1 is next  
**Foundation pull request:** `#2` targeting `develop`  
**Production ready:** No

P0 establishes:

- a focused product brief and phased roadmap;
- a provisional brand system with centralized product copy;
- an Arabic-first marketing and workspace shell;
- retained Arabic typography, RTL, LTR, and mixed-text foundations;
- an honest workspace entry screen without fake activity metrics;
- capability-neutral account and middleware boundaries;
- explicit separation between implemented, planned, deferred, quarantined, and audit-required work;
- reproducible Bun-based checks for the active product graph.

The following are **not yet complete product capabilities**:

- account registration, authentication, sessions, and authorization;
- real streamed AI conversations;
- persistent workspaces and message history;
- document processing and source-grounded citations;
- reusable draft creation and export;
- live payment-gateway integrations;
- production container and deployment validation;
- verified security, privacy, accessibility, performance, cultural, dialect, or compliance claims.

## Product loop

The first release is constrained to one workflow:

1. **Ask** — begin with a question or task in Arabic or English.
2. **Ground** — attach or select supporting documents and keep sources inspectable.
3. **Draft** — turn the result into a summary, comparison, email, memo, checklist, or decision note.
4. **Continue** — save the workspace, conversation, sources, and output for later work.

Payments, multi-agent surfaces, workflow builders, voice, desktop automation, native mobile clients, and specialist legal or medical modes are deferred until the core loop is complete and validated.

## Rebuild source of truth

- [Rebuild overview](./docs/rebuild/README.md)
- [Product brief](./docs/rebuild/00-PRODUCT-BRIEF.md)
- [Brand direction](./docs/rebuild/01-BRAND-DIRECTION.md)
- [Roadmap](./docs/rebuild/02-REBUILD-ROADMAP.md)
- [Implementation tracker](./docs/rebuild/03-IMPLEMENTATION-TRACKER.md)
- [Decision log](./docs/rebuild/04-DECISION-LOG.md)
- [Legacy system disposition](./docs/rebuild/05-LEGACY-DISPOSITION.md)

## Branch model

The former active branch heads were preserved before rebuild work began:

- `legacy/main-2026-08-07`
- `legacy/develop-2026-08-07`

The P0 foundation was developed from `develop` on:

- `agent/product-rebuild-foundation`

Starting from `develop` preserves potentially useful foundations for comparison. It does **not** approve all inherited code for continued use. Existing subsystems must be marked as retained, rewritten, quarantined, or removed.

## Development

### Requirements

- Bun `1.3.14`, pinned in the root `packageManager` field
- Node.js 20 or later where required by inherited packages
- Python and backend dependencies only when auditing or implementing the API
- configured environment variables only for the capability being exercised

P0 web builds do not require placeholder backend, model, payment, database-admin, or Supabase credentials.

### Web development

```bash
bun install --frozen-lockfile
bun run dev
```

### Required active quality gates

```bash
bun install --frozen-lockfile
bun run build:packages
bun run lint
bun run typecheck
bun run test:rebuild
cd apps/web && bun run build
```

The P0 pull-request head passed all of those commands in GitHub Actions, together with:

- PR title, change-scope, and rebuild-safeguard validation;
- Arabic and RTL foundation tests;
- accessibility foundation safeguards;
- product-language and public-claims safeguards.

These checks prove that the current web foundation builds and that its declared safeguards execute. They are not production-readiness, accessibility-certification, cultural-compliance, security-compliance, or dialect-accuracy claims.

### Legacy audit commands

Inherited tests and broader workspace checks remain available under explicit legacy commands, including:

```bash
bun run typecheck:legacy
bun run test:legacy
bun run test:legacy:integration
bun run test:legacy:e2e
```

They are audit inputs, not approved release gates. Each failure must be classified as retained product work, legacy debt, missing provenance, or removable scope.

## Architecture under review

The repository currently contains:

```text
apps/
├── web/       Next.js application and active P0 foundation
└── api/       FastAPI application and legacy service implementations

packages/      Shared TypeScript packages
examples/      Extracted or adapted reference material requiring provenance review
docs/          Legacy documentation plus the rebuild source of truth
```

Provisionally reusable areas include:

- Bun workspace structure;
- Next.js route groups and selected layout primitives;
- Arabic font loading and direction infrastructure;
- selected bidirectional UI utilities;
- evidence-based CI workflow structure;
- selected Supabase and API foundations after audit.

No legacy service is considered production-ready by inheritance. In particular, placeholder in-memory chat, simulated payment behavior, duplicate architecture, unfinished authentication, and unverified compliance systems must not be exposed as live capability.

## Product and engineering rules

1. Visible behavior must match documentation.
2. Placeholder states must be labelled as placeholders.
3. Arabic and English receive equal product-quality treatment.
4. Public claims require reproducible evidence.
5. One complete vertical slice comes before scope expansion.
6. Secrets, authorization, uploads, retention, and deletion are tested before beta.
7. Third-party code and assets require documented origin and compatible licensing.
8. Bun remains the single JavaScript package manager unless a later decision explicitly changes it.
9. Active rebuild gates and legacy audit checks remain visibly separate until inherited scope is classified.

## Licensing and provenance

Repository licensing and code provenance are under review. Historical package metadata or README statements should not be treated as a complete licensing determination for the entire repository.

The repository history references extracted or adapted work from multiple external projects. Those areas must be inventoried with source, license, modification history, and release compatibility before public or commercial distribution.

## What “ready” will mean

The first trustworthy release must let a user:

1. enter a persistent workspace;
2. upload an Arabic or English document;
3. ask a real model a question about it;
4. inspect the supporting source passage;
5. create and save a useful draft;
6. close the application and return to the same work.

That journey must be backed by persistent data, authorization checks, observable failures, and repeatable automated tests.
