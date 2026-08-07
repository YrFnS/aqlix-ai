# P1 Repository Inventory

**Branch:** `agent/p1-workspace-foundation`  
**Purpose:** record the active P1 product graph, its authoritative data and environment boundaries, and the inherited areas that remain audit or quarantine scope.

This inventory is an implementation aid, not a licensing clearance or production-readiness certificate. It records what is intentionally active in P1 and makes later deletion groups reversible.

## Classification key

- **ACTIVE** — imported by the P1 account/workspace journey and protected by required CI.
- **RETAIN** — useful shared foundation with current consumers; continue validating.
- **AUDIT** — potentially reusable later, but not an approved P1 dependency.
- **QUARANTINE** — outside the active product path or carrying provenance, security, or scope risk.
- **DEFERRED** — product capability accepted for a later phase.
- **REMOVE LATER** — candidate for a separate reversible cleanup after dependency and provenance checks.

## Application inventory

| Application | Status | P1 responsibility | Boundary |
| --- | --- | --- | --- |
| `apps/web` | ACTIVE | Marketing, account access, session refresh, protected workspace shell, workspace commands, same-origin `/api/v1` | Only active user-facing application in P1 |
| `apps/api` | AUDIT | Inherited FastAPI and service code | Must not own identity, sessions, workspaces, memberships, or a parallel persistence model; reserved for later model/document capabilities after audit |
| `apps/mobile` | DEFERRED | Placeholder native application | Re-entry requires a measured limitation in the validated web product |

## Active web route inventory

### Public and account routes

| Route | Status | Owner | Notes |
| --- | --- | --- | --- |
| `/` | ACTIVE | Web marketing | Honest product direction and current phase |
| `/docs` | ACTIVE | Rebuild documentation | Product and implementation source of truth |
| `/login` | ACTIVE | P1 account boundary | Email/password sign-in through Supabase Auth; configured and unconfigured states |
| `/register` | ACTIVE | P1 account boundary | Email/password sign-up; optional verification callback |
| `/auth/confirm` | ACTIVE | P1 account boundary | PKCE code or email OTP verification with safe internal return paths |
| `/auth/password-reset` | DEFERRED | Account boundary | Redirected to `/login`; recovery is not represented as implemented |
| `/auth/mfa-setup` | DEFERRED | Account boundary | Redirected to `/login`; MFA is not represented as implemented |
| `/auth/verify-email` | DEFERRED | Account boundary | Superseded by the single callback route |
| `/auth/error` | DEFERRED | Account boundary | Legacy error surface remains redirected/quarantined |

### Authenticated application routes

| Route | Status | Authorization | Notes |
| --- | --- | --- | --- |
| `/dashboard` | REMOVE LATER | Authenticated | Compatibility redirect to `/workspaces` |
| `/workspaces` | ACTIVE | Authenticated member list | Persistent list, real empty/failure states, workspace creation |
| `/workspaces/archived` | ACTIVE | Authenticated member list | Archived workspaces visible only through membership |
| `/workspaces/[workspaceId]` | ACTIVE | Workspace member | Role and lifecycle state; P2–P4 surfaces explicitly labelled inactive |
| `/workspaces/[workspaceId]/settings` | ACTIVE | Member; mutation by role | Owner/editor metadata updates, owner-only archive/restore/delete |
| `/profile` | DEFERRED | Middleware-protected compatibility prefix | No active product route; remove or implement in a later scoped change |
| `/settings` | DEFERRED | Middleware-protected compatibility prefix | No active global settings route; remove or implement later |

### Same-origin API routes

All API routes derive identity from the server-validated Supabase session and return JSON envelopes with request IDs. They do not redirect to HTML account pages.

| Route | Methods | Status | Contract |
| --- | --- | --- | --- |
| `/api/v1/workspaces` | `GET`, `POST` | ACTIVE | List active/all memberships; create owner workspace |
| `/api/v1/workspaces/[workspaceId]` | `GET`, `PATCH`, `DELETE` | ACTIVE | Member read; owner/editor update; owner-only confirmed delete |
| `/api/v1/workspaces/[workspaceId]/archive` | `POST` | ACTIVE | Owner-only archive or restore command |

### Quarantined demo routes

| Route | Status | Reason |
| --- | --- | --- |
| `/examples/forms` | QUARANTINE | Inherited demonstration page; not linked from product navigation |
| `/test-errors` | QUARANTINE | Manual inherited test surface; not linked from product navigation |

## Package inventory

| Package | Status | P1 responsibility | Follow-up |
| --- | --- | --- | --- |
| `@iraqi-ai/types` | ACTIVE | Generated database types, shared Zod commands/entities, API envelopes | Permanent namespace rename deferred until name clearance |
| `@iraqi-ai/supabase-client` | ACTIVE | Request-scoped browser/server/middleware clients; optional admin client remains restricted | Keep service-role use out of normal workspace requests |
| `@iraqi-ai/ui` | RETAIN | Selected shared direction/input utilities exercised by Arabic/RTL workflows | Continue reducing duplicate component layers |
| `@iraqi-ai/arabic-nlp` | RETAIN | Arabic text utilities exercised by current workflows | No dialect-accuracy claim is approved |
| `@iraqi-ai/api-client` | AUDIT | Legacy/future service client boundary | Define consumers when P2 introduces a capability service |
| `@iraqi-ai/features` | AUDIT | Speculative shared feature package | Keep outside active imports until a stable responsibility exists |
| `@iraqi-ai/cultural-validators` | QUARANTINE | Inherited high-risk validation claims | Qualified policy ownership and evidence required before re-entry |
| `@iraqi-ai/arabic-test-utils` | AUDIT | Inherited test helpers | Retain only helpers used by an approved benchmark or active suite |
| `@iraqi-ai/testing-utils` | AUDIT | Broad inherited testing package | Large dependency surface; active rebuild tests do not depend on it |

## Database and migration inventory

### P1 canonical schema

Canonical P1 SQL lives in `supabase/migrations/` and is mirrored by `packages/types/src/database.types.ts`.

| Table | Status | Ownership boundary | Phase behavior |
| --- | --- | --- | --- |
| `workspaces` | ACTIVE | `owner_id` plus member RLS | Create, read, edit, archive, restore, delete |
| `workspace_members` | ACTIVE | Composite workspace/user key; one owner | Owner membership created transactionally; owner/editor/viewer roles |
| `conversations` | SCHEMA-READY | `workspace_id` RLS | Durable container reserved for P2 |
| `messages` | SCHEMA-READY | Same-workspace conversation FK and RLS | Lifecycle states reserved for P2 |
| `attachments` | SCHEMA-READY | `workspace_id`, uploader, RLS | Metadata contract reserved for P3 |
| `sources` | SCHEMA-READY | Same-workspace attachment FK and RLS | Passage contract reserved for P3 |
| `drafts` | SCHEMA-READY | Same-workspace optional conversation FK and RLS | Durable object reserved for P4 |

### P1 migrations

| Migration | Purpose |
| --- | --- |
| `202608080001_p1_workspace_foundation.sql` | Tables, indexes, timestamp triggers, owner membership, helper functions, grants, and RLS policies |
| `202608080002_p1_owner_membership_delete_fix.sql` | Prevent direct owner-membership removal while permitting workspace cascades |
| `202608080003_p1_workspace_archive_guard.sql` | Enforce owner-only archive and restore at the database boundary |
| `202608080004_p1_draft_workspace_integrity.sql` | Prevent cross-workspace draft/conversation links and preserve workspace ownership when an optional conversation is deleted |

### Legacy database scope

Any migration or generated database model outside the four P1 migrations remains **AUDIT** or **QUARANTINE** until it is mapped to a retained capability. The former `test_users` generated type is superseded and is not part of the canonical contract.

## Environment and secret inventory

### Browser-visible variables

| Variable | Required when | Secret | Consumer |
| --- | --- | ---: | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Account/workspace capability is used | No | Web environment, browser/server Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Account/workspace capability is used | No | Web environment, browser/server Supabase clients; access remains constrained by sessions and RLS |
| `NEXT_PUBLIC_API_URL` | Future capability service calls | No | Public web configuration; defaults to local API URL |
| `NEXT_PUBLIC_APP_ENV` | Optional environment labeling | No | Public web configuration |
| `NEXT_PUBLIC_SENTRY_DSN` | Monitoring is intentionally enabled | No | Optional public monitoring configuration |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics is intentionally enabled | No | Optional public analytics configuration |
| `NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES` | Explicit experiment gating | No | Public feature configuration |
| `NEXT_PUBLIC_ENABLE_MULTIMODAL` | Later multimodal capability | No | Deferred flag; not evidence of an active feature |
| `NEXT_PUBLIC_ENABLE_OFFLINE_MODE` | Later offline persistence mode | No | Deferred flag; P1 only provides an offline notice |

### Server-only variables

| Variable | Status | Rule |
| --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | RESTRICTED / not required by normal P1 requests | May be used only by narrowly approved administrative or background operations; never exposed to the browser or used to bypass member RLS for ordinary workspace traffic |
| Model-provider keys | DEFERRED to P2 | Introduce with provider ownership, cost controls, failure handling, and secret inventory |
| Storage or document-worker credentials | DEFERRED to P3 | Introduce only with upload, retention, deletion, and worker boundaries |
| Payment credentials | QUARANTINE | No active payment capability or production-facing configuration |

### Local and CI environments

- Clean lint, type-check, contract-test, and production-build jobs do not require Supabase credentials.
- The authenticated browser workflow starts a local Supabase project and exports its local public URL/key only for that job.
- Hosted Supabase secrets are not required by repository CI.
- `.env.local` and real secrets remain uncommitted.

## Test and workflow map

| Suite or workflow | Status | Protected behavior |
| --- | --- | --- |
| `packages/types/src/contracts/*.test.ts` | ACTIVE | Workspace command normalization and typed API envelopes |
| `apps/web/tests/rebuild/account-boundary.test.ts` | ACTIVE | Session-derived identity, safe callbacks, configured/unconfigured account states |
| `apps/web/tests/rebuild/p1-workspace-foundation.test.ts` | ACTIVE | Route graph, shared contracts, RLS presence, API error boundary, no dead navigation |
| Other `apps/web/tests/rebuild/*` | ACTIVE | Brand claims, RTL defaults, environment boundary, accessibility foundation, route scope |
| `supabase/tests/p1_workspace_rls.test.sql` | ACTIVE | Owner membership, roles, tenant isolation, archive guard, cross-workspace FK integrity, cascades |
| `P1 Data Contract` | REQUIRED | Applies P1 migrations to PostgreSQL 16 and executes RLS/integrity tests |
| `P1 Authenticated Browser Journey` | REQUIRED | Real local Auth/session, CRUD lifecycle, API envelopes, second-account isolation, keyboard, mobile, offline notice, hydration |
| `CI Quality Gates` | REQUIRED | Frozen install, package builds, lint, focused type-check, P1 tests, optimized web build |
| `PR Validation` | REQUIRED | Semantic title, full change-scope report, active rebuild safeguards |
| Arabic/RTL, Accessibility, Product Claims workflows | REQUIRED | Existing concrete foundation safeguards and honest claim limits |
| `*:legacy` commands | AUDIT | Inherited tests and broad checks; failures require classification rather than automatic release blocking |

## Third-party and provenance status

### Approved for P1 use through normal dependency metadata

- Next.js, React, Bun, Supabase client/SSR, Zod, Playwright, Lucide, Tailwind, and the selected package dependencies remain governed by their package metadata and lockfile entries.
- This statement does not replace a release-level license report.

### Quarantined provenance scope

- `examples/` and extracted/adapted repository material;
- copied screenshots, generated reports, or assets whose origin is not recorded;
- inherited specialist, payment, cultural, agent, voice, automation, and benchmark code;
- legacy documentation that claims completed controls or certifications without evidence.

A full file-level origin, license, modification, and release-compatibility register remains required before public or commercial distribution.

## Reversible cleanup groups

No cleanup group should be combined with product implementation. Each group requires import/search evidence and a green active gate.

1. **Compatibility routes:** remove `/dashboard` after all consumers use `/workspaces`.
2. **Unlinked demos:** remove form and manual-error routes after confirming no documentation or test consumer.
3. **Deferred account fragments:** remove old recovery/MFA/verification components after the final account roadmap decides whether they will be rebuilt.
4. **Unused packages:** remove speculative feature, validator, or test packages one package at a time after consumer and provenance checks.
5. **Legacy database assets:** remove superseded migrations only after deployed-data and rollback review.
6. **Generated artifacts:** move committed reports/screenshots/build output to CI artifacts.
7. **Namespace cleanup:** rename inherited `@iraqi-ai/*` packages only after permanent product-name clearance.

## P1 deletion rule

P1 does not perform broad deletion. The active account/workspace slice is introduced first; inherited scope is removed only through separate pull requests that demonstrate:

- no active imports or runtime consumers;
- no deployed-data dependency;
- preserved attribution or provenance records where required;
- a reversible migration or history path;
- green active build, contract, RLS, and browser gates.
