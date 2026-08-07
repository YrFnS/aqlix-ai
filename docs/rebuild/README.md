# Product Rebuild

This directory is the source of truth for the controlled rebuild of the repository formerly presented as **Iraqi AI Chat System / Aqlix AI**.

## Current status

- Working product name: **Kiteb**
- Status: **foundation and product reset**
- Active branch: `agent/product-rebuild-foundation`
- Legacy snapshots:
  - `legacy/main-2026-08-07`
  - `legacy/develop-2026-08-07`

`Kiteb` is a provisional working name. It must pass formal trademark, company-name, social-handle, and domain clearance before public launch.

## Product direction

Kiteb is being rebuilt as an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The first product loop is intentionally narrow:

1. Add context through a question, document, or both.
2. Receive an answer grounded in the available context.
3. Turn the result into a useful draft, summary, decision, or action.
4. Save the work in a persistent workspace.

## Operating rules

1. Build one complete vertical slice before expanding scope.
2. Arabic and English receive equal product-quality treatment.
3. Do not present placeholder behavior as implemented functionality.
4. Do not publish performance, security, compliance, or readiness claims without repeatable evidence.
5. Existing code is reusable only after it passes a product, architecture, security, and provenance review.
6. Payments, workflow builders, desktop automation, voice, and specialist legal or medical claims remain out of scope until the core workspace is proven.
7. Every phase must have explicit exit criteria and working tests.

## Rebuild documents

- [Product brief](./00-PRODUCT-BRIEF.md)
- [Brand direction](./01-BRAND-DIRECTION.md)
- [Roadmap](./02-REBUILD-ROADMAP.md)
- [Implementation tracker](./03-IMPLEMENTATION-TRACKER.md)
- [Decision log](./04-DECISION-LOG.md)

## Definition of a trustworthy release

A release is ready only when:

- its visible behavior matches its documentation;
- its primary user journey works against persistent data;
- the AI response path uses a real provider with failure handling;
- Arabic, English, RTL, LTR, mixed text, keyboard use, and responsive layouts are tested;
- secrets, authentication, authorization, uploads, and data retention have been reviewed;
- deployment can be reproduced from the repository;
- third-party code and assets have documented provenance and compatible licensing.
