# Decision Log

This log records product, brand, architecture, and delivery decisions that materially constrain the rebuild.

## 2026-08-07 — Preserve the repository and rebuild within it

**Decision:** Keep `YrFnS/aqlix-ai` as the historical repository rather than deleting it or starting an unrelated repository.

**Reason:** The repository contains reusable Arabic, RTL, layout, testing, and infrastructure work, while its history is valuable for audit and provenance. The product itself needs a reset, but deleting history would make reuse and accountability harder.

**Consequence:** Existing code is not automatically approved. Reuse is opt-in after audit.

## 2026-08-07 — Preserve both former active branch heads

**Decision:** Create:

- `legacy/main-2026-08-07`
- `legacy/develop-2026-08-07`

**Reason:** `main` and `develop` had diverged. Immutable snapshots prevent accidental loss while the rebuild changes product direction and repository structure.

## 2026-08-07 — Start from `develop`, then prune deliberately

**Decision:** Create `agent/product-rebuild-foundation` from `develop`.

**Reason:** `develop` contains the broadest set of potentially reusable foundations. Starting there makes comparison and selective reuse easier than an orphan branch.

**Consequence:** The rebuild branch initially carries legacy weight. P0 and P1 must classify and remove or quarantine unused systems before they become product dependencies.

## 2026-08-07 — Narrow the product to a document-centered AI workspace

**Decision:** Build an Arabic-first bilingual workspace around Ask → Ground → Draft → Continue.

**Reason:** The previous product attempted chat, agents, professional domains, payments, workflows, automation, voice, documents, and cultural systems simultaneously without completing the visible core experience.

**Consequence:** Features that do not strengthen the core loop are deferred.

## 2026-08-07 — Use Kiteb as a provisional working name

**Decision:** Use `Kiteb` in rebuild documentation and the first visible foundation.

**Reason:** The old repository and product names were inconsistent, and `Aqlix` is not suitable for continued use as the default identity. Kiteb gives design and implementation work a coherent temporary identity connected to writing and documents.

**Consequence:** This is not legal or commercial clearance. Permanent package namespaces, production domains, repository renaming, and public launch identity remain blocked until formal clearance.

## 2026-08-07 — Do not preserve unsupported claims

**Decision:** Remove or rewrite unverified readiness, compliance, performance, accuracy, uptime, coverage, payment, and production claims from primary product surfaces and the README.

**Reason:** Documentation and visible implementation did not provide reproducible evidence for those claims.

**Consequence:** Future claims require a named owner, test or measurement method, environment, date, and evidence.

## 2026-08-07 — Retain Arabic and RTL foundations provisionally

**Decision:** Keep the existing font loading, direction provider, mixed-text utilities, and selected layout primitives during P0.

**Reason:** These areas are aligned with the focused product and are more mature than the visible pages.

**Consequence:** They still require simplification, accessibility testing, and verification against the final workspace shell.

## 2026-08-07 — Replace fake dashboard analytics

**Decision:** Remove hard-coded usage numbers from the primary application dashboard.

**Reason:** Placeholder metrics were presented as live product state and did not help the core journey.

**Consequence:** The dashboard becomes a workspace entry surface. Operational analytics remain internal and data-backed when implemented.

## 2026-08-07 — Defer permanent package renaming

**Decision:** Do not immediately rename every `@iraqi-ai/*` package or the GitHub repository during P0.

**Reason:** A broad namespace migration creates noisy risk before the working name is cleared and before unused packages are removed.

**Consequence:** User-facing identity changes first. Package and repository naming is handled after the architecture and legal-name decisions are stable.

## 2026-08-07 — Require licensing and provenance review

**Decision:** Treat extracted examples and copied or adapted third-party material as quarantined until their origin, license, modifications, and release compatibility are documented.

**Reason:** The repository history references extraction from numerous external projects. Public or commercial release requires a dependable provenance record.

**Consequence:** No assumption is made that the repository as a whole can be distributed under a single license until the review is complete.

## 2026-08-07 — Use Bun as the JavaScript package manager

**Decision:** Keep Bun as the single JavaScript package manager and correct deployment files that invoke npm or yarn.

**Reason:** The workspace scripts and user preference already standardize on Bun. Multiple package-manager paths create lockfile and deployment drift.

## 2026-08-07 — Target the foundation pull request at `develop`

**Decision:** Open the initial rebuild pull request against `develop`, not `main`.

**Reason:** The rebuild branch starts from `develop`; targeting `main` would mix the entire pre-existing branch divergence into the foundation review.

**Consequence:** Promotion to `main` occurs only after the rebuild branch has passed its phase exit criteria and obsolete paths have been handled explicitly.

## 2026-08-07 — Keep P0 routes capability-neutral

**Decision:** Quarantine unfinished authentication, Supabase middleware, registration, recovery, MFA, verification, form demos, and manual error demos behind honest status pages or redirects.

**Reason:** Those routes imported missing modules, required undeclared runtime services, or presented incomplete behavior as usable product capability.

**Consequence:** The P0 web application compiles without fake authentication or placeholder secrets. P1 must introduce one complete authentication, session, persistence, and authorization contract rather than reviving fragments independently.

## 2026-08-07 — Separate active rebuild checks from legacy audits

**Decision:** Scope the required lint, type-check, and unit-test commands to the committed P0 product graph. Preserve the former broad checks behind explicit `*:legacy` commands.

**Reason:** The inherited monorepo contained speculative packages, stale tests, missing setup files, and routes unrelated to the active product. Treating all inherited code as a release gate either produced meaningless failures or encouraged disabling checks entirely.

**Consequence:** P0 has a strict, green gate for the active product. Legacy debt remains visible and must be audited or removed deliberately; it is not silently declared healthy.

## 2026-08-07 — Replace score echoes with evidence-based workflows

**Decision:** Replace hard-coded accessibility, cultural, dialect, and RTL percentages with executable source and package tests that state their actual scope.

**Reason:** Echoed scores and threshold claims were not derived from test output and could be mistaken for certification.

**Consequence:** Current workflows verify concrete foundations such as browser zoom, touch targets, navigation labels, Arabic text utilities, RTL defaults, fonts, and public-claim hygiene. They do not certify WCAG, cultural, religious, legal, medical, or dialect accuracy.

## 2026-08-07 — Pin the verified Bun runtime and modernize Actions

**Decision:** Pin Bun `1.3.14`, use `oven-sh/setup-bun@v2`, use `actions/checkout@v6`, and give read-only workflow permissions unless a later job needs more.

**Reason:** The exact Bun runtime passed dependency installation, package builds, lint, type-checking, tests, and the production web build. Modern Actions avoid the deprecated Node runtime used by the inherited workflow versions.

**Consequence:** JavaScript CI is reproducible from the root package metadata. Bun upgrades become intentional changes that must pass the same gates.

## 2026-08-07 — Close P0 only after the full production build passes

**Decision:** Treat P0 as complete only after the same pull-request head passes PR validation, dependency-ordered package builds, lint, focused type-checking, rebuild tests, the optimized Next.js build, Arabic/RTL safeguards, accessibility safeguards, and public-claims safeguards.

**Reason:** Earlier documentation described readiness without an executable foundation. The reset must establish the opposite habit.

**Consequence:** P1 begins from a buildable, honestly scoped web foundation. P0 completion is not production readiness and does not approve the legacy backend, data model, deployment containers, or third-party provenance.

## 2026-08-08 — Implement P1 on one focused branch and pull request

**Decision:** Create `agent/p1-workspace-foundation` from the merged `develop` head and use draft pull request `#3` as the single P1 integration point.

**Reason:** P1 crosses account access, sessions, database migrations, RLS, shared contracts, API routes, UI states, and browser validation. Keeping those changes together preserves the vertical slice while avoiding the branch proliferation that made earlier repository work difficult to follow.

**Consequence:** P1 is merged only after one final head passes every required account, data, web, Arabic/RTL, accessibility, claims, and browser gate.

## 2026-08-08 — Use Supabase Auth and PostgreSQL as the identity and persistence authority

**Decision:** Use Supabase Auth for account/session identity and PostgreSQL for the authoritative workspace-domain data model.

**Reason:** The repository already contained a Supabase client foundation, while Supabase provides one coherent session, database, migration, and row-level-security boundary for the first durable product slice.

**Consequence:** The inherited `test_users` model and custom authentication fragments are superseded. No second user, session, workspace, or membership model is approved.

## 2026-08-08 — Let Next.js own account and workspace operations

**Decision:** Implement sign-in, sign-up, sign-out, session refresh, protected pages, workspace commands, and same-origin `/api/v1` workspace endpoints in the Next.js application.

**Reason:** Routing basic account and workspace operations through both Next.js and FastAPI would create duplicate sessions, error envelopes, and data-access rules before the AI or document service is needed.

**Consequence:** FastAPI remains audit scope and may return in P2/P3 for model streaming, document processing, retrieval, and background jobs. It must consume the same identity/workspace contract rather than becoming a second authority.

## 2026-08-08 — Enforce authorization with workspace membership and RLS

**Decision:** Model `owner`, `editor`, and `viewer` membership in PostgreSQL and enforce access through row-level-security policies on every workspace-owned table.

**Reason:** Client checks and page redirects improve usability but cannot be the security boundary. The database must reject cross-workspace access and role-inappropriate mutations regardless of caller.

**Consequence:** Owner membership is created in the workspace insert transaction. Editors may update workspace metadata and content, viewers are read-only, and archive/restore/delete/member management are owner-only.

## 2026-08-08 — Keep server actions and API requests on the signed-in user session

**Decision:** Normal P1 requests use the signed-in user's Supabase session and RLS. The service-role key is not required by account or workspace requests.

**Reason:** Administrative bypass would hide authorization defects and increase the effect of a server-route mistake.

**Consequence:** `SUPABASE_SERVICE_ROLE_KEY` remains restricted to a later narrowly approved administrative or background operation and never enters browser-visible configuration.

## 2026-08-08 — Keep product contracts in the existing locked types package

**Decision:** Place shared Zod commands, domain entities, membership roles, lifecycle commands, and API envelopes under `@iraqi-ai/types/contracts` instead of introducing a new workspace package.

**Reason:** A temporary contracts package changed the Bun workspace graph without a regenerated committed lock. The existing types package already depends on Zod and is part of the verified lockfile.

**Consequence:** Web actions, API routes, generated database types, and future service adapters use one runtime/type contract while frozen Bun installation remains reproducible.

## 2026-08-08 — Use typed JSON envelopes and request IDs for workspace APIs

**Decision:** Same-origin workspace APIs return a discriminated `ok: true | false` envelope with stable error codes and an `x-request-id` header.

**Reason:** API clients need machine-readable `401`, `403`, `404`, `409`, `422`, and `503` behavior. Redirecting an API request to an HTML login page makes failure handling ambiguous.

**Consequence:** API authentication is non-redirecting and session-derived; pages continue using user-friendly redirects and bilingual status states.

## 2026-08-08 — Test the full account/workspace journey against local Supabase

**Decision:** Add a minimal committed local Supabase configuration and a dedicated Chromium Playwright workflow that starts real local Auth, PostgREST, and PostgreSQL services.

**Reason:** Source assertions and isolated SQL tests cannot prove session cookies, server actions, route protection, RLS-backed persistence, responsive navigation, offline feedback, and cross-account isolation work together.

**Consequence:** Hosted test credentials are not required. The required browser gate creates real accounts and exercises create, reload, API read, update, archive, restore, delete, sign-out, keyboard, mobile, offline, and hydration behavior.

## 2026-08-08 — Allow immutable owner visibility during workspace insert returning

**Decision:** Permit a workspace row to be selected when `owner_id = auth.uid()` or the user has workspace membership.

**Reason:** Supabase workspace creation uses `INSERT ... RETURNING`. The returned row is evaluated against the select policy during the same statement lifecycle in which the owner-membership trigger runs. Membership remains the general access model, but immutable `owner_id` is the safe owner path for immediate insert visibility.

**Consequence:** The exact authenticated `INSERT ... RETURNING` case is covered by PostgreSQL CI. Other accounts still require membership and remain unable to infer or access the row.

## 2026-08-08 — Do not combine broad legacy deletion with P1 implementation

**Decision:** Record active, retained, audit, quarantine, deferred, and later-removal areas in `07-P1-INVENTORY.md`, but perform no broad cleanup in PR `#3`.

**Reason:** Route, package, migration, artifact, and provenance cleanup has different rollback and review risks from the account/workspace vertical slice.

**Consequence:** Later cleanup uses separate reversible pull requests with import evidence, deployed-data review, provenance preservation, and the same active gates.
