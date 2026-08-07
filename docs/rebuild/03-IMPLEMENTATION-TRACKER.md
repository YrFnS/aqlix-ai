# Implementation Tracker

Status values:

- `DONE` — implemented, documented, and validated for its declared scope
- `IN PROGRESS` — active on the rebuild branch
- `BLOCKED` — cannot be completed until a named dependency is resolved
- `PLANNED` — accepted scope, not yet started
- `DEFERRED` — deliberately outside the active product scope
- `AUDIT` — inherited implementation must be verified before reuse

## Current phase

**P0 — Reset and trustworthy foundation: DONE**  
**Next:** P1 — application shell and data contract

P0 completion means the active web foundation is honestly scoped, buildable, and protected by executable safeguards. It does **not** mean the product, backend, data layer, authentication, deployment, security program, accessibility program, or third-party provenance is complete.

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
| Licensing and provenance requirement | DONE | Third-party material remains quarantined pending the full inventory |
| Full licensing and code-provenance inventory | PLANNED | Required before public or commercial release and before broad deletion |

### P0 required workflow result

Pull request `#2` must remain green for all of the following on its final head:

- `CI Quality Gates`
- `PR Validation`
- `Arabic & RTL Foundation`
- `Accessibility Foundation`
- `Product Language & Claims Safeguards`

The final documentation-only closeout commit is subject to the same gate before merge.

## P1 — Application shell and data contract

| Work item | Status | Notes |
| --- | --- | --- |
| Workspace information architecture | PLANNED | Home, workspace rail, conversation, sources, draft, and settings |
| Persistent schema | PLANNED | Workspace, membership, conversation, message, attachment, source, and draft |
| Persistence strategy decision | PLANNED | Select one authoritative database and migration path |
| Authentication boundary audit | AUDIT | Existing Supabase and custom auth overlap is quarantined, not approved |
| Authentication implementation | PLANNED | One provider and session lifecycle introduced end to end |
| Authorization model | PLANNED | User, membership, and workspace ownership enforced server-side |
| Typed API contract | PLANNED | Select one contract-generation and error-envelope strategy |
| Environment and secret inventory | PLANNED | Public, server, build, local, staging, and production boundaries |
| Empty, loading, failure, and permission states | PLANNED | Designed with the real shell and data contract |
| RTL/LTR shell browser tests | PLANNED | Include mixed-direction, keyboard, responsive, and hydration behavior |
| Route and package dependency inventory | PLANNED | Identify retained consumers and reversible deletion groups |
| Database and migration inventory | PLANNED | Classify active, legacy, and removable tables and migrations |

## P2 — Real bilingual conversation

| Work item | Status | Notes |
| --- | --- | --- |
| Provider abstraction | AUDIT | Existing provider and agent code must prove value before reuse |
| Streaming transport | PLANNED | Select one supported path; avoid duplicate SSE and WebSocket stacks |
| Persistent conversation service | PLANNED | Replace process-memory storage |
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
| Draft data model | PLANNED | Preserve relationship to source conversation and documents |
| Draft canvas | PLANNED | Arabic, English, and mixed-direction editing |
| Reusable output actions | PLANNED | Summary, comparison, email, memo, checklist, and decision note |
| Versioning and provenance | PLANNED | Required before export |
| Export behavior | PLANNED | Validate Arabic and mixed-direction output when implemented |

## P5 — Operational readiness

| Work item | Status | Notes |
| --- | --- | --- |
| Clean web build baseline | DONE | P0 Next.js build passes in clean CI with no placeholder service secrets |
| Bun-only deployment path | PLANNED | Existing container and runtime commands still require audit and correction |
| Full application deployment build | PLANNED | Web, API, migrations, workers, and runtime config together |
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
