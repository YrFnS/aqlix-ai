# Product Rebuild

This directory is the source of truth for the controlled rebuild of the repository formerly presented as **Iraqi AI Chat System / Aqlix AI**.

## Current status

- Working product name: **Kiteb**
- P0 — reset and trustworthy foundation: **complete and merged**
- P1 — account, workspace, persistence, and authorization: **complete and merged**
- P2 — persistent bilingual conversation: **complete and merged**
- P3 — private documents, inspectable passages, and grounded citations: **complete and merged**
- P4 — durable drafts and reusable work: **implemented; PR `#6` in exact-head closeout**
- Next: **P5 — operational readiness**
- Production ready: **No**
- Legacy snapshots:
  - `legacy/main-2026-08-07`
  - `legacy/develop-2026-08-07`

`Kiteb` is a provisional working name. It must pass formal trademark, company-name, social-handle, domain, and Arabic-language clearance before public launch or permanent namespace migration.

## Product direction

Kiteb is an **Arabic-first, bilingual AI workspace for turning conversations and documents into clear, reusable work**.

The complete product loop is:

1. **Ask** — begin with a question or task in Arabic or English.
2. **Ground** — use private documents and inspect the exact supporting passages.
3. **Draft** — convert a completed answer into editable reusable work.
4. **Continue** — review a provider proposal, then apply it as a new version or discard it.

P0–P4 implement and validate this loop against persistent authorized data. P5 addresses deployment, operations, security/privacy review, budgets, monitoring, backup/restore, and release readiness.

## Delivered through P4

### Account and workspace

- Supabase Auth identity and session boundary.
- Request-scoped browser/server clients.
- PostgreSQL and RLS authorization.
- Owner, editor, and viewer roles.
- Workspace create, edit, archive, restore, delete, reload, mobile navigation, and outsider isolation.

### Persistent bilingual conversation

- Ordered user and assistant messages.
- Normalized streamed events.
- Stop with partial persistence.
- Retry without overwriting failed or cancelled history.
- Provider/model/token/latency/failure telemetry.
- Arabic, English, mixed-direction text, URLs, numbers, and safe fenced code.

### Private sources and citations

- Private Supabase Storage bucket.
- Bounded UTF-8 TXT and Markdown upload.
- Strict type, size, UTF-8, content, duplicate, and archived-state validation.
- Deterministic passage extraction with real offsets and line locators.
- Workspace-scoped PostgreSQL search.
- Inspectable source viewer and signed download.
- Opt-in grounded conversation mode.
- Persistent citations and explicit rejection when valid references are missing.
- Honest snapshots after a source is deleted.

### Durable drafts and reusable work

- Deterministic summary, comparison, email, memo, checklist, and decision-note scaffolds.
- Creation from a completed assistant message without an extra provider request.
- Copied message-citation provenance.
- Explicit saved/unsaved/saving/failure state.
- `Ctrl+S` / `Cmd+S` and leave warning for unsaved changes.
- Immutable versions, no-op-save detection, stale-write protection, snapshot inspection, and restore-as-new-version.
- UTF-8 TXT, Markdown, and standalone escaped HTML export.
- Separate streamed provider proposals for improve, shorten, expand, translate, continue, or custom revision.
- Stop with partial proposal persistence.
- Apply as a new version or discard without changing accepted work.
- Draft archive, restore, reopen, delete, viewer read/export-only access, and outsider isolation.

## Validation

P4 requires all of these workflows on one exact head:

- `CI Quality Gates`
- `PR Validation`
- `Arabic & RTL Foundation`
- `Accessibility Foundation`
- `Product Language & Claims Safeguards`
- `P1 Data Contract`
- `P1 Authenticated Browser Journey`
- `P2 Conversation Data Contract`
- `P2 Bilingual Conversation Journey`
- `P3 Document Source Data Contract`
- `P3 Private Document Source Journey`
- `P4 Durable Draft Data Contract`
- `P4 Ask Ground Draft Continue Journey`

The P4 data gate validates P1–P3 at their own schema boundaries, migrates forward, then proves immutable versions, no-op saves, stale conflicts, provenance, proposal apply/discard/cancel/failure, role isolation, archive guards, origin detachment, deleted-source snapshots, and cascades.

The P4 browser gate completes the real local journey from sign-up through source upload, grounded answer, all six draft structures, save/reload, copy/export, versions/restore, proposal lifecycle, viewer/outsider isolation, archive/restore, mobile layout, deletion, sign-out, and hydration monitoring.

The browser journeys use an explicitly enabled deterministic fixture provider. They prove application mechanics, not external provider availability or model quality.

## Explicit boundaries

The rebuild does not yet certify or claim:

- production deployment readiness;
- protected live-provider availability or output quality;
- account/workspace quotas, rate limits, or provider budgets;
- monitoring or incident-response readiness;
- tested backup and restore;
- complete security or privacy review;
- WCAG certification;
- PDF, DOCX, office, OCR, image, archive, audio, or video parsing;
- PDF or DOCX export;
- collaborative realtime editing;
- specialist legal, medical, or financial reliability;
- complete third-party code, asset, and license provenance clearance.

## Operating rules

1. Visible behavior must match documentation.
2. Fixture and placeholder behavior must be labelled honestly.
3. Arabic and English receive equal product-quality treatment.
4. Public claims require reproducible evidence.
5. PostgreSQL remains the durable application authority.
6. Normal user traffic uses sessions and RLS, not administrative bypass.
7. Provider output cannot silently overwrite accepted work.
8. Terminal stream events must represent successfully persisted states.
9. Deleted sources remain explicitly unavailable rather than silently re-linked.
10. Active rebuild gates and inherited legacy audits remain visibly separate.
11. Third-party code and assets require documented origin and compatible licensing.
12. Bun remains the single JavaScript package manager unless a recorded decision changes it.

## Rebuild documents

- [Product brief](./00-PRODUCT-BRIEF.md)
- [Brand direction](./01-BRAND-DIRECTION.md)
- [Roadmap](./02-REBUILD-ROADMAP.md)
- [Implementation tracker](./03-IMPLEMENTATION-TRACKER.md)
- [Decision log](./04-DECISION-LOG.md)
- [Legacy system disposition](./05-LEGACY-DISPOSITION.md)
- [P1 architecture](./06-P1-ARCHITECTURE.md)
- [P1 repository inventory](./07-P1-INVENTORY.md)
- [P2 conversation architecture](./08-P2-ARCHITECTURE.md)
- [P3 private source architecture](./09-P3-ARCHITECTURE.md)
- [P3 grounded conversation architecture](./10-P3-GROUNDED-CONVERSATIONS.md)
- [P4 draft architecture](./11-P4-ARCHITECTURE.md)

## Next phase: P5

P5 begins only after P4 is merged. Its first tasks are:

1. define one production deployment topology and Bun-only release path;
2. add protected live-provider smoke validation and cost controls;
3. implement account/workspace quotas and rate limits;
4. add structured monitoring, alerts, and incident response;
5. execute database and object-storage backup and restore exercises;
6. review sessions, RLS, prompts, uploads, retention, deletion, and logs;
7. audit dependencies, licenses, code, and assets for release provenance;
8. define production migration, rollback, disaster recovery, beta, and launch gates.

## Definition of a trustworthy release

A public release is ready only when:

- visible behavior and documentation match;
- the complete product loop works against persistent authorized data;
- production deployment, migration, rollback, backup, and restore are reproducible;
- provider budgets, rate limits, and abuse controls exist;
- monitoring and incident response are exercised;
- security, privacy, retention, deletion, and logging are reviewed;
- Arabic, English, RTL, LTR, mixed text, keyboard use, and responsive layouts are validated;
- third-party code and assets have documented compatible provenance;
- every public claim has named evidence and ownership.
