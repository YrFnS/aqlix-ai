# Product Rebuild

This directory is the source of truth for the controlled rebuild of the repository formerly presented as **Iraqi AI Chat System / Aqlix AI**.

## Current status

- Working product name: **Kiteb**
- P0: **complete and merged to `develop`**
- P1: **account and workspace foundation in progress**
- Active P1 pull request: `#3` targeting `develop`
- Active P1 branch: `agent/p1-workspace-foundation`
- Production ready: **No**
- Legacy snapshots:
  - `legacy/main-2026-08-07`
  - `legacy/develop-2026-08-07`

`Kiteb` is a provisional working name. It must pass formal trademark, company-name, social-handle, domain, and Arabic-language clearance before public launch or permanent namespace migration.

P1 now establishes one account, session, PostgreSQL, RLS, workspace, typed API, and responsive application-shell boundary. P1 is not complete until its final pull-request head passes the authenticated two-account browser journey and every existing required workflow.

Real model responses, document extraction, retrieval, citations, draft editing, export, deployment readiness, security review, and provenance clearance remain later-phase work.

## Product direction

Kiteb is being rebuilt as an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The first product loop is intentionally narrow:

1. Add context through a question, document, or both.
2. Receive an answer grounded in the available context.
3. Turn the result into a useful draft, summary, decision, or action.
4. Save the work in a persistent workspace.

P1 implements the durable container and access boundary required by step 4. P2–P4 implement the real conversation, sources, and reusable draft capabilities.

## Verified baseline and P1 exit gate

P0 passed:

- `CI Quality Gates`
- `PR Validation`
- `Arabic & RTL Foundation`
- `Accessibility Foundation`
- `Product Language & Claims Safeguards`

P1 adds two required workflows:

- `P1 Data Contract`
- `P1 Authenticated Browser Journey`

The P1 data workflow applies the canonical migrations to PostgreSQL and checks ownership, roles, RLS, tenant foreign keys, insert-returning visibility, and cascades. The browser workflow starts a local Supabase project and exercises real account creation, session cookies, persistence after reload, workspace update/archive/restore/delete, typed APIs, second-account isolation, keyboard use, responsive navigation, offline feedback, and hydration behavior.

These checks prove only their declared scope. They do not certify production readiness, WCAG conformance, cultural or religious compliance, security compliance, privacy compliance, or dialect accuracy.

## Operating rules

1. Build one complete vertical slice before expanding scope.
2. Arabic and English receive equal product-quality treatment.
3. Do not present placeholder behavior as implemented functionality.
4. Do not publish performance, security, compliance, or readiness claims without repeatable evidence.
5. Existing code is reusable only after it passes a product, architecture, security, and provenance review.
6. Payments, workflow builders, desktop automation, voice, and specialist legal or medical claims remain out of scope until the core workspace is proven.
7. Every phase must have explicit exit criteria and working tests.
8. Active rebuild gates and inherited legacy audits remain visibly separate.
9. Normal account and workspace requests use the signed-in session and RLS, not an administrative database bypass.
10. Broad legacy deletion is separated from product implementation into reversible cleanup pull requests.

## Rebuild documents

- [Product brief](./00-PRODUCT-BRIEF.md)
- [Brand direction](./01-BRAND-DIRECTION.md)
- [Roadmap](./02-REBUILD-ROADMAP.md)
- [Implementation tracker](./03-IMPLEMENTATION-TRACKER.md)
- [Decision log](./04-DECISION-LOG.md)
- [Legacy system disposition](./05-LEGACY-DISPOSITION.md)
- [P1 architecture](./06-P1-ARCHITECTURE.md)
- [P1 repository inventory](./07-P1-INVENTORY.md)

## Definition of a trustworthy release

A release is ready only when:

- its visible behavior matches its documentation;
- its primary user journey works against persistent data;
- the AI response path uses a real provider with failure handling;
- Arabic, English, RTL, LTR, mixed text, keyboard use, and responsive layouts are tested;
- secrets, authentication, authorization, uploads, and data retention have been reviewed;
- deployment can be reproduced from the repository;
- third-party code and assets have documented provenance and compatible licensing.
