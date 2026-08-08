# Implementation Tracker

Status values:

- `DONE` — implemented, documented, and validated for its declared scope
- `IN PROGRESS` — active or awaiting a required final gate
- `BLOCKED` — cannot continue until a named dependency is resolved
- `PLANNED` — accepted scope, not yet started
- `DEFERRED` — deliberately outside the active product scope
- `AUDIT` — inherited implementation must be verified before reuse

## Current phase

**P0 — Reset and trustworthy foundation: DONE**  
**P1 — Account, workspace, persistence, and authorization: DONE**  
**P2 — Persistent bilingual conversation: DONE**  
**P3 — Private documents, inspectable sources, and grounded citations: DONE**  
**P4 — Durable drafts and reusable work: DONE**  
**P5 — Operational readiness: IN PROGRESS**  
**Active branch:** `agent/p5-operational-readiness`  
**Draft pull request:** `#7`

P4 merged through PR `#6` at `bb96c3300ec86118f03b0acd142209be3994d424` after the complete P0–P4 matrix passed.

P5.0’s local release baseline is implemented. P5.1’s Render Blueprint, ordered migration path, and rollback runbook are committed. P5.2’s OpenRouter BYOK, Vault credential storage, live catalog, dynamic model selection, and selected-model generation path are implemented. These P5 slices remain `IN PROGRESS` until the final exact PR head passes every required gate.

A hosted staging Supabase project, Render deployment, smoke test, rollback, and forward recovery exercise have **not** been completed.

Production deployment, quotas, monitoring, backup/restore, security/privacy review, accessibility review, and provenance clearance remain incomplete.

## P0 — Reset and trustworthy foundation

| Work item | Status | Evidence |
| --- | --- | --- |
| Preserve divergent repository history | DONE | `legacy/main-2026-08-07`, `legacy/develop-2026-08-07` |
| Establish rebuild source of truth | DONE | `docs/rebuild/` |
| Narrow product loop | DONE | Ask → Ground → Draft → Continue |
| Working product identity | DONE | Kiteb configuration and clearance warning |
| Remove unsupported public claims and fake analytics | DONE | Public-claims safeguards and rebuilt surfaces |
| Retain Arabic, RTL, and mixed-text foundations | DONE | Fonts, direction utilities, focused tests |
| Quarantine incomplete inherited capabilities | DONE | Legacy disposition and honest route states |
| Bun-managed active workflow | DONE | Bun `1.3.14`, frozen install, supported Actions |
| Active lint, type, test, and build gates | DONE | CI Quality Gates and PR Validation |
| Full release provenance clearance | PLANNED | Required in P5 before public/commercial distribution |

## P1 — Account, workspace, persistence, and authorization

| Work item | Status | Evidence |
| --- | --- | --- |
| Supabase Auth account/session boundary | DONE | Sign-up, sign-in, confirmation, refresh, sign-out |
| Protected application shell | DONE | Server-validated session and request-scoped clients |
| Canonical PostgreSQL workspace schema | DONE | Workspaces, members, conversations, messages, attachments, sources, drafts |
| Row-level security | DONE | Owner/editor/viewer policies on workspace-owned data |
| Workspace lifecycle | DONE | Create, list, reload, edit, archive, restore, delete |
| Typed workspace APIs | DONE | Same-origin `/api/v1` routes and request IDs |
| Empty/loading/failure/offline states | DONE | Arabic-first responsive surfaces |
| PostgreSQL ownership/isolation tests | DONE | P1 Data Contract |
| Real two-account browser journey | DONE | P1 Authenticated Browser Journey |
| Merge | DONE | PR `#3` |

## P2 — Persistent bilingual conversation

| Work item | Status | Evidence |
| --- | --- | --- |
| Reject inherited in-memory placeholder chat | DONE | P2 architecture audit |
| Persistent conversation lifecycle | DONE | Create, open, rename, archive, restore, delete |
| Ordered durable messages | DONE | PostgreSQL sequence allocation |
| Provider attempt telemetry | DONE | `message_generations` |
| Server-only provider abstraction | DONE | Normalized provider interface and test fixture |
| One normalized streaming transport | DONE | `ready`, `delta`, `complete`, `failed`, `cancelled`, `heartbeat` |
| Stop/cancel partial persistence | DONE | AbortController plus durable cancelled state |
| Retry history preservation | DONE | New assistant attempt, old attempt retained |
| Explicit provider failures | DONE | Stable machine-readable failure codes |
| Arabic/English/mixed renderer | DONE | Safe URLs, numbers, fenced code, no raw HTML |
| Role and outsider enforcement | DONE | Owner/editor write, viewer read, outsider hidden |
| Archived conversation/workspace guards | DONE | Page, API, stream, and PostgreSQL boundaries |
| PostgreSQL lifecycle tests | DONE | P2 Conversation Data Contract |
| Full browser journey | DONE | P2 Bilingual Conversation Journey |
| OpenRouter selected-user runtime | IN PROGRESS | P5.2 exact-head gate |
| Merge | DONE | PR `#4` |

## P3 — Private documents, inspectable sources, and grounded citations

| Work item | Status | Evidence |
| --- | --- | --- |
| Audit inherited placeholder document service | DONE | P3 architecture audit |
| Private Storage bucket | DONE | `workspace-documents` and Storage policies |
| Bounded supported uploads | DONE | UTF-8 TXT/Markdown, 2 MiB |
| Strict upload validation | DONE | Type, size, UTF-8, controls, lines, duplicate hash |
| Generated object paths | DONE | Workspace/attachment UUID path, no user filename |
| Deterministic extraction | DONE | Paragraph-aware chunks, offsets, line locators |
| Durable processing attempts | DONE | Attachment processing lifecycle and failure codes |
| Workspace-scoped search | DONE | PostgreSQL FTS with mixed-script normalization and broad ranked fallback |
| Inspectable source viewer | DONE | Stable anchors, real locator, signed private download |
| Storage and database isolation | DONE | Owner/editor/viewer/outsider policies and tests |
| Coordinated deletion | DONE | Object first, metadata/passages cascade second |
| Grounded conversation mode | DONE | Explicit opt-in only |
| Persistent message citations | DONE | Source and locator snapshots |
| Invalid/missing citation rejection | DONE | Grounded completion cannot persist without a valid label |
| Deleted-source honesty | DONE | Live IDs null, snapshots remain |
| Data and Storage/browser gates | DONE | P3 data and private-source journeys |
| Grounded browser journey | DONE | Citation links open exact source passages |
| Complex parsers and OCR | DEFERRED | Require isolated worker, sandboxing, and real fixtures |
| Merge | DONE | PR `#5` |

## P4 — Durable drafts and reusable work

| Work item | Status | Evidence |
| --- | --- | --- |
| P4 architecture and threat model | DONE | `11-P4-ARCHITECTURE.md` |
| Extend existing draft authority | DONE | P1 `drafts` table retained and hardened |
| Immutable draft versions | DONE | `draft_versions` with contiguous version numbers |
| Draft provenance snapshots | DONE | `draft_provenance` copied from message citations |
| Durable proposal attempts | DONE | `draft_generations` telemetry and terminal states |
| Revoke direct history mutation | DONE | Bounded security-definer functions only |
| Deterministic message-to-draft conversion | DONE | Summary, comparison, email, memo, checklist, decision note |
| No hidden provider call during creation | DONE | Deterministic scaffolds |
| Arabic/English/mixed editor | DONE | Explicit direction plus automatic mixed content |
| Saved/unsaved/saving/failure state | DONE | Explicit editor state |
| Keyboard save and leave warning | DONE | `Ctrl+S` / `Cmd+S`, `beforeunload` while dirty |
| No-op save detection | DONE | Identical content does not create a version |
| Stale-write protection | DONE | Expected-version conflict |
| Version inspection | DONE | Read-only immutable snapshot route |
| Restore as a new version | DONE | History never rewritten |
| Provenance links and unavailable snapshots | DONE | Exact source link or honest deleted state |
| Copy accepted content | DONE | Explicit clipboard success/failure |
| Safe UTF-8 TXT/Markdown/HTML export | DONE | Escaped standalone HTML, no scripts/remotes |
| PDF/DOCX export claims | DEFERRED | Not implemented or exposed |
| Server-only AI continuation | DONE | P2 provider boundary reused |
| Separate proposal review | DONE | Accepted editor unchanged during generation |
| Stop with partial proposal persistence | DONE | Durable cancelled proposal |
| Apply proposal as a new version | DONE | Atomic optimistic apply |
| Discard proposal without changing accepted work | DONE | Durable discarded state |
| Stale proposal rejection | DONE | Base version must still be current |
| Explicit proposal failure | DONE | Stable provider failure and partial content |
| Draft archive/restore/delete | DONE | Current draft and all P4 child lifecycle |
| Origin conversation deletion integrity | DONE | Atomic pre-delete live-ID detachment |
| Role and outsider enforcement | DONE | Viewer read/export only; outsider hidden |
| Archived workspace/draft guards | DONE | Read/export only until restore |
| Loading/error/not-found states | DONE | Draft library and detail route states |
| Shared contracts and unit boundaries | DONE | Draft contract, scaffold, export, dirty-state, source safeguards |
| PostgreSQL P4 lifecycle gate | DONE | P4 Durable Draft Data Contract |
| Complete browser journey | DONE | P4 Ask Ground Draft Continue Journey |
| Exact-head matrix and merge | DONE | PR `#6`, merge `bb96c3300ec86118f03b0acd142209be3994d424` |

## P5.0 — Operational architecture and local release baseline

| Work item | Status | Evidence |
| --- | --- | --- |
| P5 architecture and release threat model | DONE | `12-P5-OPERATIONAL-READINESS.md` |
| Environment contract | DONE | Development, test, staging, production validation |
| Ownership and incident authority | DONE | Release, service, data, provider, security, observability roles |
| Release identity | DONE | Explicit, Render, and GitHub commit SHA resolution |
| Fixture-provider production rejection | DONE | Runtime schema and tests |
| Liveness endpoint | DONE | `/api/health/live` |
| Fail-closed readiness endpoint | DONE | `/api/health/ready`, bounded Supabase Auth probe |
| Bun dependency/workspace path | DONE | Bun `1.3.14`, frozen `bun.lock` |
| Node Next.js release runtime | DONE | Node `24.14.1` build and start scripts |
| Single active React runtime | DONE | Root React/React DOM `19.1.1`; mobile React 18 nested |
| Shared UI dependency externalization | DONE | Browser target, peer React, `--packages external` |
| Focused fatal release type graph | DONE | `tsconfig.rebuild.json`, build errors not ignored |
| Global unmatched-route boundary | DONE | Standalone Arabic-first `global-not-found.tsx` |
| Full production build | IN PROGRESS | Final exact-head P5 Operational Baseline |
| Production process startup | IN PROGRESS | Final exact-head P5 Operational Baseline |
| Liveness/readiness evidence | IN PROGRESS | Final exact-head non-secret artifact |

## P5.1 — Staging deployment, migrations, and rollback

| Work item | Status | Evidence / blocker |
| --- | --- | --- |
| Render staging topology | DONE | `render.yaml`: Frankfurt, starter, manual promotion |
| Pinned staging runtimes | DONE | Node `24.14.1`, Bun `1.3.14` |
| Frozen build script | DONE | `scripts/render/build.sh` |
| Ordered migration pre-deploy | DONE | `scripts/render/pre-deploy.sh` |
| Migration history inspection | DONE | Linked migration list before/after |
| Migration dry run before apply | DONE | `supabase db push --dry-run` before apply |
| Production migration lock | DONE | Explicit `ALLOW_PRODUCTION_MIGRATIONS=true` required |
| Health-based traffic promotion | DONE | `/api/health/ready` Blueprint path |
| Graceful shutdown | DONE | 60-second maximum shutdown delay |
| OpenRouter deployment without provider secret | DONE | No platform key or model in Blueprint |
| Application rollback runbook | DONE | `13-P5-DEPLOYMENT-AND-ROLLBACK.md` |
| Forward-only database recovery | DONE | Expand/contract and new corrective migration guidance |
| Separate hosted Supabase staging project | BLOCKED | Requires external project provisioning and credentials |
| Render staging service | BLOCKED | Requires external account/service provisioning |
| Clean hosted staging deployment | BLOCKED | Depends on staging services and secrets |
| Authenticated staging smoke checklist | BLOCKED | Depends on successful hosted deployment |
| Application rollback exercise | BLOCKED | Depends on at least two hosted staging releases |
| Forward recovery rehearsal | BLOCKED | Depends on isolated hosted staging database |

## P5.2 — OpenRouter BYOK and dynamic models

| Work item | Status | Evidence / gate |
| --- | --- | --- |
| OpenRouter account settings contracts | DONE | `ai-settings.ts` and contract tests |
| Account-scoped settings page | DONE | `/settings/ai` |
| Key validation before storage | DONE | OpenRouter current-key endpoint through server route |
| Encrypted key storage | DONE | Supabase Vault migration and RPC |
| Masked settings response | DONE | Last four, label, free-tier metadata only |
| Public table contains no raw key | DONE | `user_ai_settings` metadata plus Vault UUID |
| Account RLS and outsider isolation | DONE | Own-row policy and two-account test contract |
| Live user-filtered model catalog | DONE | OpenRouter `/models/user`, `no-store` |
| Search and sort | DONE | Name/ID/description plus context/price/newest sorting |
| Free-only filter | DONE | Current catalog price and `:free` observation |
| Model metadata display | DONE | Context, modalities, current pricing |
| Copy model ID | DONE | Clipboard control |
| Manual model ID entry | DONE | Same exact validation path as cards |
| Exact current model validation | DONE | Must match current user catalog before persistence |
| No hardcoded production model | DONE | Selected model resolved from user settings |
| Conversation selected-model runtime | DONE | OpenRouter server stream path |
| Draft selected-model runtime | DONE | Same account runtime in continuation route |
| Normalized provider failures | DONE | Auth, budget, rate limit, timeout, unavailable, invalid response |
| Usage/model telemetry persistence | DONE | Existing generation records |
| Disconnect deletes Vault secret | DONE | RPC and cleanup trigger |
| Failure after disconnect | DONE | Persisted `PROVIDER_UNCONFIGURED` |
| Local deterministic OpenRouter API | DONE | Test-only endpoint override |
| Vault SQL lifecycle gate | IN PROGRESS | Final exact-head P5 OpenRouter BYOK Journey |
| Full Chromium BYOK journey | IN PROGRESS | Final exact-head P5 OpenRouter BYOK Journey |
| Disposable real-key staging smoke | BLOCKED | Requires hosted staging and approved disposable user key |

## P5.3–P5.8 — Remaining operational readiness

| Work item | Status | Notes |
| --- | --- | --- |
| Account/workspace quotas | PLANNED | Messages, output ceilings, uploads, storage, drafts, exports |
| Rate limits and abuse controls | PLANNED | Account, workspace, IP, provider, upload |
| Concurrent-generation leases | PLANNED | Protect server resources even with BYOK |
| Retry limits and circuit breakers | PLANNED | Provider and model failure containment |
| Monitoring and structured logs | PLANNED | Frontend, routes, database, Storage, Vault, provider |
| Alerting and incident response | PLANNED | Named owners and tested procedures |
| Database backup and restore exercise | PLANNED | Execute, measure, and document |
| Object-storage backup/restore strategy | PLANNED | Original private documents and deletion semantics |
| Vault deletion and reconnection exercise | PLANNED | Never export user secrets into backups/evidence |
| Security and privacy review | PLANNED | Sessions, RLS, Vault, prompts, uploads, retention, deletion, logs |
| Accessibility validation beyond foundation | PLANNED | Keyboard, screen reader, contrast, reflow, focus |
| Dependency and provenance clearance | PLANNED | Code, packages, fonts, assets, screenshots, generated material |
| Beta readiness gate | PLANNED | Named evidence and unresolved-risk register |
| Production readiness gate | PLANNED | No inferred readiness from feature completion |

### Current exact-head workflow requirements

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
- `P5 Operational Baseline`
- `P5 OpenRouter BYOK Journey`

## Deferred product areas

| Area | Status | Re-entry condition |
| --- | --- | --- |
| PDF, office, OCR, image, spreadsheet, presentation parsing | DEFERRED | Isolated worker, parser security model, real fixtures |
| PDF/DOCX export | DEFERRED | Arabic/mixed-layout fidelity and tested renderer |
| Collaborative realtime editing | DEFERRED | Conflict, presence, audit, and privacy model |
| Iraqi payment gateways | DEFERRED | Validated commercial model and real provider plan |
| Multi-agent surface | DEFERRED | Proven need not served by the core loop |
| Workflow builder | DEFERRED | Repeated automation demand after stable core adoption |
| Voice | DEFERRED | Validated workflow, privacy model, quality benchmark |
| Desktop/browser automation | DEFERRED | Separate threat model and explicit demand |
| Specialist legal/medical/financial modes | DEFERRED | Domain owner, source policy, safeguards, liability review |
| Native mobile app | DEFERRED | Measured mobile-web limitation after adoption |
