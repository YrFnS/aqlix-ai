# Implementation Tracker

Status values:

- `DONE` — implemented, documented, and validated for its declared scope
- `IN PROGRESS` — active on the rebuild branch or awaiting its final required gate
- `BLOCKED` — cannot be completed until a named dependency is resolved
- `PLANNED` — accepted scope, not yet started
- `DEFERRED` — deliberately outside the active product scope
- `AUDIT` — inherited implementation must be verified before reuse

## Current phase

**P0 — Reset and trustworthy foundation: DONE**  
**P1 — Application shell and data contract: IN PROGRESS**  
**Active branch:** `agent/p1-workspace-foundation`  
**Draft pull request:** `#3`

The P1 account, persistence, authorization, workspace lifecycle, API, state, and inventory work is implemented. P1 remains `IN PROGRESS` until the final branch head passes the authenticated browser journey together with every existing required workflow.

P1 completion will prove a durable account/workspace boundary. It will not mean model streaming, document processing, retrieval, citations, draft editing, export, deployment readiness, security certification, accessibility certification, or provenance clearance is complete.

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
| Reworked homepage | DONE | Honest product direction and labelled workspace preview |
| Reworked marketing navigation and footer | DONE | Former identity and stale date removed |
| Reworked root metadata | DONE | Provisional brand and accurate product description |
| Honest account boundary | DONE | Incomplete auth actions replaced by a labelled P1 status experience |
| Capability-neutral middleware | DONE | No unfinished Supabase, secret, route-protection, or cultural-profile dependency in P0 |
| Remove fake dashboard analytics | DONE | Replaced with workspace-foundation and roadmap states |
| Rebuild visual tokens | DONE | Warm neutral and evergreen semantic theme |
| Restore active utility graph | DONE | Fonts, RTL utilities, class utilities, mobile hook, and shared UI utility committed |
| Rewrite root README | DONE | Unsupported claims removed; verified status documented |
| Existing architecture disposition map | DONE | `docs/rebuild/05-LEGACY-DISPOSITION.md` |
| Quarantine broken demo routes | DONE | Auth, form, and manual error demos no longer enter the active capability surface |
| Review complete branch diff | DONE | PR `#2` reports full change scope against `develop` |
| Build packages in dependency order | DONE | Required CI job passes with the pinned Bun runtime |
| Lint active web application | DONE | Required CI job passes |
| Focused TypeScript validation | DONE | Active routes, middleware, config, providers, navigation, and utilities pass |
| Active rebuild tests | DONE | Brand, claims, RTL, accessibility, environment, account, and route-scope guards pass |
| Optimized Next.js production build | DONE | Required build job passes and uploads artifacts |
| PR validation | DONE | Semantic title, change-scope report, and rebuild safeguards pass |
| Arabic and RTL foundation workflow | DONE | Arabic utilities, bidirectional UI, RTL defaults, and font configuration pass |
| Accessibility foundation workflow | DONE | Zoom, touch-target, navigation-label, icon-semantics, and focused type safeguards pass |
| Product-language and public-claims workflow | DONE | Arabic utility tests and unsupported-claim guard pass |
| Modern Actions runtime | DONE | `actions/checkout@v6` and `oven-sh/setup-bun@v2` with read-only permissions |
| Pin verified Bun runtime | DONE | Root `packageManager` pins Bun `1.3.14` |
| Resilient frozen dependency install | DONE | Every required workflow uses a bounded retry and clears Bun's cache only after a failed or timed-out first attempt |
| Licensing and provenance requirement | DONE | Third-party material remains quarantined pending the full inventory |
| Full licensing and code-provenance inventory | PLANNED | Required before public or commercial release and before broad deletion |

### P0 required workflow result

Pull request `#2` passed:

- `CI Quality Gates`
- `PR Validation`
- `Arabic & RTL Foundation`
- `Accessibility Foundation`
- `Product Language & Claims Safeguards`

## P1 — Application shell and data contract

| Work item | Status | Evidence or next action |
| --- | --- | --- |
| Create focused P1 branch and draft PR | DONE | `agent/p1-workspace-foundation`, PR `#3` against `develop` |
| P1 architecture decision record | DONE | `docs/rebuild/06-P1-ARCHITECTURE.md` |
| Workspace information architecture | DONE | `/workspaces`, archive, detail, settings, loading, error, and inaccessible states |
| Persistence strategy decision | DONE | Supabase Auth plus canonical PostgreSQL migrations; Next.js owns account/workspace operations |
| Persistent workspace-domain schema | DONE | Workspace, membership, conversation, message, attachment, source, and draft tables |
| Generated database type replacement | DONE | Former `test_users` placeholder superseded by the P1 migration contract |
| Shared runtime/type contracts | DONE | Zod commands, entities, roles, lifecycle inputs, and API envelopes under `@iraqi-ai/types/contracts` |
| Authentication boundary audit | DONE | Inherited overlapping auth fragments quarantined; one Supabase session boundary approved |
| Sign-up and sign-in | DONE | Server actions, configured/unconfigured states, safe return paths |
| Session refresh and protected routes | DONE | Request-scoped Supabase middleware client and server-validated `getUser()` |
| Confirmation callback | DONE | PKCE code or email OTP verification through one safe internal callback |
| Sign-out | DONE | Server action clears the active session and returns to a truthful account state |
| Workspace creation | DONE | Session-derived owner, validated input, PostgreSQL persistence, owner membership trigger |
| Workspace list and reload persistence | DONE | Membership-backed active/archive lists; no example or process-memory records |
| Workspace edit | DONE | Owner/editor metadata mutation with viewer rejection |
| Workspace archive and restore | DONE | Owner-only in UI, API, and database trigger guard |
| Workspace deletion | DONE | Owner-only exact-name confirmation and database cascades |
| Authorization model | DONE | Owner/editor/viewer RLS on every workspace-owned table |
| Tenant foreign-key integrity | DONE | Messages, sources, and drafts cannot point across workspaces |
| Owner insert-returning policy | DONE | Immutable owner path plus exact authenticated `INSERT ... RETURNING` regression test |
| Typed same-origin workspace API | DONE | `/api/v1` collection, item, and lifecycle routes with request IDs and stable error codes |
| Service-role restriction | DONE | Normal account/workspace paths use the signed-in session and RLS; no administrative bypass |
| Environment and secret inventory | DONE | Public, server-only, local, CI, deferred, and restricted variables documented |
| Route and package dependency inventory | DONE | `docs/rebuild/07-P1-INVENTORY.md` with reversible cleanup groups |
| Database and migration inventory | DONE | Four foundational migrations plus owner-insert visibility policy classified and tested |
| Empty state | DONE | No-workspace and empty-archive states contain no fabricated activity |
| Loading state | DONE | List and detail loading shells with live-region semantics |
| Runtime failure state | DONE | Route error boundary and persistence-specific status messages |
| Missing/forbidden state | DONE | Shared non-disclosing inaccessible-workspace page and API `404` behavior |
| Offline state | DONE | Browser connectivity notice without claiming offline persistence |
| Responsive authenticated navigation | DONE | Real routes only, account identity, sign-out, labelled mobile overlay |
| Mixed-direction content handling | DONE | User workspace name/description rendered with automatic text direction |
| Contract tests | DONE | Shared input/envelope tests and active P1 source safeguards |
| PostgreSQL migration and RLS workflow | DONE | PostgreSQL 16 applies all P1 migrations and tests roles, tenant isolation, FKs, and cascades |
| Local Supabase project | DONE | Minimal Auth, PostgREST, and PostgreSQL configuration committed for reproducible browser CI |
| Authenticated browser journey | IN PROGRESS | Final head must pass real two-account lifecycle, API, isolation, keyboard, mobile, offline, and hydration checks |
| Final branch diff and PR description | IN PROGRESS | Update after final browser and all required workflow results are green |

### P1 required workflow result

The final PR `#3` head must pass all of the following before P1 can be marked `DONE` or merged:

- `CI Quality Gates`
- `PR Validation`
- `Arabic & RTL Foundation`
- `Accessibility Foundation`
- `Product Language & Claims Safeguards`
- `P1 Data Contract`
- `P1 Authenticated Browser Journey`

A failed gate is fixed or explicitly re-scoped with evidence; it is not bypassed by changing the completion label.

## P2 — Real bilingual conversation

| Work item | Status | Notes |
| --- | --- | --- |
| Provider abstraction | AUDIT | Existing provider and agent code must prove value before reuse |
| Streaming transport | PLANNED | Select one supported path; avoid duplicate SSE and WebSocket stacks |
| Persistent conversation service | PLANNED | Use the P1 workspace/conversation/message schema; replace process-memory storage |
| Failure, retry, cancellation, and timeout | PLANNED | Required before beta |
| Cost and latency telemetry | PLANNED | No public targets before baseline data exists |
| Arabic and English rendering tests | PLANNED | Include code, numbers, URLs, punctuation, markdown, and mixed text |

## P3 — Documents and sources

| Work item | Status | Notes |
| --- | --- | --- |
| Upload contract | PLANNED | File type, size, retention, ownership, status, and deletion |
| Extraction pipeline | AUDIT | Existing document code must be tested against real fixtures |
| Retrieval and citation model | PLANNED | Passage-level source links required |
| Source viewer | PLANNED | Keep supporting context inspectable |
| Malicious and corrupt file handling | PLANNED | Security tests required |

## P4 — Drafts and reusable work

| Work item | Status | Notes |
| --- | --- | --- |
| Draft persistence contract | DONE | P1 schema preserves workspace and optional conversation provenance |
| Draft canvas | PLANNED | Arabic, English, and mixed-direction editing |
| Reusable output actions | PLANNED | Summary, comparison, email, memo, checklist, and decision note |
| Versioning and provenance | PLANNED | Required before export |
| Export behavior | PLANNED | Validate Arabic and mixed-direction output when implemented |

## P5 — Operational readiness

| Work item | Status | Notes |
| --- | --- | --- |
| Clean web build baseline | DONE | Next.js build passes in clean CI with no placeholder provider or administrative secrets |
| Local account/data integration environment | DONE | P1 local Supabase stack is reproducible in CI |
| Bun-only deployment path | PLANNED | Existing container and runtime commands still require audit and correction |
| Full application deployment build | PLANNED | Web, future capability service, migrations, workers, and runtime config together |
| Backup and restore exercise | PLANNED | Must be executed, not documented only |
| Security and privacy review | PLANNED | Include authorization, uploads, secrets, retention, deletion, and logs |
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
