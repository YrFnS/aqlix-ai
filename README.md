# Kiteb — Product Rebuild

> **Kiteb is a provisional working name.** Trademark, company-name, domain, handle, and Arabic-language clearance are required before public launch or permanent namespace migration.

Kiteb is being rebuilt as an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The repository previously presented a much broader “Iraqi AI Chat System” with agents, professional domains, payments, automation, voice, and compliance claims. The visible product and underlying integrations did not consistently support that story. This branch begins a controlled reset around one complete user journey.

## Current status

**Phase:** P0 — reset and trustworthy foundation  
**Active branch:** `agent/product-rebuild-foundation`  
**Production ready:** No

The current foundation includes:

- a focused product brief and phased roadmap;
- a provisional brand system with centralized product copy;
- an Arabic-first marketing and workspace shell;
- retained Arabic typography, RTL, LTR, and mixed-text foundations;
- an honest workspace entry screen without fake activity metrics;
- explicit separation between implemented, planned, deferred, and audit-required work.

The following are **not yet complete product capabilities**:

- real streamed AI conversations;
- persistent workspaces and message history;
- document processing and source-grounded citations;
- reusable draft creation and export;
- live payment-gateway integrations;
- production deployment validation;
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

## Branch model

The former active branch heads were preserved before rebuild work began:

- `legacy/main-2026-08-07`
- `legacy/develop-2026-08-07`

The rebuild starts from `develop` on:

- `agent/product-rebuild-foundation`

Starting from `develop` preserves potentially useful foundations for comparison. It does **not** approve all inherited code for continued use. Existing subsystems must be marked as retained, rewritten, quarantined, or removed.

## Development

### Requirements

- Bun
- Node.js 20 or later where required by the current packages
- Python and backend dependencies for API work
- configured environment variables for any service being exercised

### Web development

```bash
bun install
bun run dev
```

### Intended quality gates

```bash
bun run lint
bun run typecheck
bun run build
bun run test:unit
bun run test:e2e
```

These commands describe the repository’s intended workflow. A phase is not considered complete merely because commands are documented; they must run successfully in a clean, reproducible environment and in CI.

## Architecture under review

The repository currently contains:

```text
apps/
├── web/       Next.js application
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
- parts of the CI workflow structure;
- selected Supabase and API foundations after audit.

No legacy service is considered production-ready by inheritance. In particular, placeholder in-memory chat, simulated payment behavior, duplicate architecture, and unverified compliance systems must not be exposed as live capability.

## Product and engineering rules

1. Visible behavior must match documentation.
2. Placeholder states must be labelled as placeholders.
3. Arabic and English receive equal product-quality treatment.
4. Public claims require reproducible evidence.
5. One complete vertical slice comes before scope expansion.
6. Secrets, authorization, uploads, retention, and deletion are tested before beta.
7. Third-party code and assets require documented origin and compatible licensing.
8. Bun remains the single JavaScript package manager unless a later decision explicitly changes it.

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
