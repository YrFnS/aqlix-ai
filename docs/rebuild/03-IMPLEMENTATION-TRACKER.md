# Implementation Tracker

Status values:

- `DONE` — implemented and documented
- `IN PROGRESS` — active on the rebuild branch
- `BLOCKED` — cannot be completed until a named dependency is resolved
- `PLANNED` — accepted scope, not yet started
- `DEFERRED` — deliberately outside the active product scope
- `AUDIT` — existing implementation must be verified before reuse

## P0 — Reset and trustworthy foundation

| Work item | Status | Evidence or next action |
| --- | --- | --- |
| Preserve former `main` head | DONE | `legacy/main-2026-08-07` |
| Preserve former `develop` head | DONE | `legacy/develop-2026-08-07` |
| Create rebuild branch | DONE | `agent/product-rebuild-foundation` |
| Focused product brief | DONE | `docs/rebuild/00-PRODUCT-BRIEF.md` |
| Provisional brand direction | DONE | `docs/rebuild/01-BRAND-DIRECTION.md` |
| Phased roadmap | DONE | `docs/rebuild/02-REBUILD-ROADMAP.md` |
| Decision log | DONE | `docs/rebuild/04-DECISION-LOG.md` |
| Central brand configuration | DONE | `apps/web/src/config/brand.ts` |
| Reworked homepage | DONE | Honest product direction and labelled preview |
| Reworked marketing navigation and footer | DONE | Former identity and stale date removed |
| Reworked root metadata | DONE | Provisional brand and accurate product description |
| Reworked authentication shell | DONE | Brand, bilingual copy, and App Router links aligned |
| Remove fake dashboard analytics | DONE | Replaced with workspace-foundation and roadmap states |
| Rebuild visual tokens | DONE | Warm neutral and evergreen semantic theme |
| Rewrite root README | DONE | Unsupported claims removed; current state documented |
| Existing architecture disposition map | DONE | `docs/rebuild/05-LEGACY-DISPOSITION.md` |
| Review complete branch diff | IN PROGRESS | Inspect scope and static risk before draft PR |
| Build, lint, and type-check | BLOCKED | Requires an execution environment with repository access and dependencies |
| Automated CI result | PLANNED | Open draft PR against `develop` to trigger pull-request workflows |
| Licensing and code-provenance inventory | PLANNED | Required before code deletion, reuse, or public release |

## P1 — Application shell and data contract

| Work item | Status | Notes |
| --- | --- | --- |
| Workspace information architecture | PLANNED | Home, workspace rail, conversation, sources, draft, settings |
| Persistent schema | PLANNED | Workspace, conversation, message, attachment, source, draft |
| Authentication boundary audit | AUDIT | Existing Supabase and custom auth overlap must be resolved |
| Authorization model | PLANNED | User and workspace ownership enforced server-side |
| Typed API contract | PLANNED | Select one contract-generation strategy |
| Empty/loading/failure states | PLANNED | Must be designed with the shell |
| RTL/LTR shell tests | PLANNED | Include mixed-direction and keyboard flows |

## P2 — Real bilingual conversation

| Work item | Status | Notes |
| --- | --- | --- |
| Provider abstraction | AUDIT | Existing provider and agent code must prove value before reuse |
| Streaming transport | PLANNED | Select one supported path; avoid duplicate SSE/WebSocket stacks |
| Persistent conversation service | PLANNED | Replace process-memory storage |
| Failure, retry, cancellation, timeout | PLANNED | Required before beta |
| Cost and latency telemetry | PLANNED | No public targets before baseline |
| Arabic/English rendering tests | PLANNED | Include code, numbers, URLs, punctuation, and mixed text |

## P3 — Documents and sources

| Work item | Status | Notes |
| --- | --- | --- |
| Upload contract | PLANNED | File type, size, retention, ownership, and deletion |
| Extraction pipeline | AUDIT | Existing document code must be tested against real fixtures |
| Retrieval and citation model | PLANNED | Passage-level source links required |
| Source viewer | PLANNED | Keep supporting context inspectable |
| Malicious and corrupt file handling | PLANNED | Security tests required |

## P4 — Drafts and reusable work

| Work item | Status | Notes |
| --- | --- | --- |
| Draft data model | PLANNED | Preserve relationship to source conversation and documents |
| Draft canvas | PLANNED | Arabic, English, and mixed-direction editing |
| Reusable output actions | PLANNED | Summary, comparison, email, memo, checklist, decision note |
| Versioning and provenance | PLANNED | Required before export |
| Export behavior | PLANNED | Validate Arabic PDF and document output when implemented |

## P5 — Operational readiness

| Work item | Status | Notes |
| --- | --- | --- |
| Bun-only deployment path | PLANNED | Existing web Dockerfile uses conflicting package-manager commands |
| Reproducible clean build | PLANNED | Required before readiness claims |
| Backup and restore exercise | PLANNED | Must be executed, not documented only |
| Security and privacy review | PLANNED | Include authorization, uploads, secrets, retention, and logs |
| Dependency and provenance review | PLANNED | Resolve extracted-example licensing before release |
| Monitoring and cost controls | PLANNED | Provider, API, database, document jobs, and frontend |

## Deferred product areas

| Area | Status | Re-entry condition |
| --- | --- | --- |
| Iraqi payment gateways | DEFERRED | Validated commercial model and real provider integration plan |
| Multi-agent product surface | DEFERRED | Proven user need that cannot be served by the core workflow |
| Workflow builder | DEFERRED | Stable core data model and repeated automation demand |
| Voice | DEFERRED | Validated workflow, privacy model, and quality benchmark |
| Desktop/browser automation | DEFERRED | Separate threat model and explicit customer demand |
| Legal/medical/financial specialist modes | DEFERRED | Domain owner, source policy, safeguards, and liability review |
| Native mobile application | DEFERRED | Measured mobile-web limitation after core product adoption |
