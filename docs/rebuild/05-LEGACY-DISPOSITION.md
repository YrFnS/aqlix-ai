# Legacy System Disposition

This document determines how inherited code is treated during the rebuild. A category is not a permanent technical decision; it defines the burden of proof before a subsystem may enter the new product.

## Categories

- **RETAIN** — aligned with the product and useful now; still requires normal validation.
- **AUDIT** — potentially reusable, but architecture, behavior, security, or duplication must be resolved first.
- **REWRITE** — the product need remains, but the current implementation does not provide a trustworthy vertical slice.
- **QUARANTINE** — outside active scope or carries provenance, safety, or complexity risk; do not import into the product path.
- **REMOVE LATER** — obsolete output or contradiction that should be deleted after provenance and dependency checks.

## Retain

| Area | Reason | Required follow-up |
| --- | --- | --- |
| Bun workspace foundation | Matches the chosen package-manager strategy | Make every local, CI, and container command Bun-consistent |
| Next.js route-group structure | Useful separation of marketing, auth, and application surfaces | Simplify routes as the final information architecture emerges |
| Arabic font loading | Directly supports the product | Validate rendering, loading behavior, and fallbacks |
| Direction provider and mixed-text utilities | Core differentiator for Arabic/English work | Accessibility, hydration, and bidirectional-content tests |
| Selected layout primitives | Small reusable foundation | Remove primitives that duplicate native layout or add no value |
| Semantic Tailwind tokens | Supports consistent theming | Keep design tokens centralized and documented |

## Audit before reuse

| Area | Concern | Audit question |
| --- | --- | --- |
| Supabase client packages | Multiple frontend/backend data paths may overlap | What is the single auth, database, storage, and RLS contract? |
| Authentication services | Large custom service layer around Supabase | Which controls are real, tested, and necessary for the first user journey? |
| Middleware | Authentication, CSRF, rate limiting, headers, and session logic overlap | Which boundary owns each security control, and is it effective in deployment? |
| FastAPI application structure | Useful route/service separation but broad startup behavior | Can the API start minimally without optional legacy systems? |
| Shared TypeScript packages | Package boundaries may reflect speculative architecture | Which packages have current consumers and stable responsibilities? |
| CI workflows | Useful structure but possible command and branch drift | Do clean Bun installs, lint, typecheck, build, and tests pass? |
| Existing test suites | Some tests assert interfaces that never existed | Does each test describe current intended behavior and fail for the right reason? |
| Database migrations | Multiple models and cultural/domain tables | Which schema supports the focused workspace, and which tables are legacy? |
| Document-processing code | Relevant capability but unproven end to end | Does it handle real Arabic/English fixtures, errors, ownership, and deletion? |

## Rewrite

| Area | Why rewrite is required | Target behavior |
| --- | --- | --- |
| Conversation service | Uses process memory and placeholder model output | Persistent, streamed, observable, provider-backed conversation |
| Dashboard/workspace experience | Former screen displayed invented analytics | Workspace-first navigation with real empty and activity states |
| Marketing experience | Former homepage exposed framework names, not a product | Focused promise, honest status, and the core workflow |
| Product documentation | Former docs mixed plans, demos, and unsupported claims | One current source of truth tied to implementation status |
| Deployment path | Web container used npm/yarn commands inconsistent with Bun scripts | Reproducible Bun build and runtime path |
| Product telemetry | Former metrics were claims or static UI values | Data-backed internal product, reliability, and cost measurements |
| Document Q&A integration | Pieces exist without a proven user journey | Upload → process → retrieve → cite → inspect → delete |
| Draft/output layer | Not represented as a durable product object | Editable, versioned work linked to its sources |

## Quarantine

| Area | Reason | Re-entry gate |
| --- | --- | --- |
| Extracted example repositories | Licensing and provenance are not yet inventoried | Source, license, modifications, dependency use, and release compatibility documented |
| 21-agent product and development system | Large speculative surface disconnected from the core journey | Validated user need and measurable advantage over a simpler service |
| Cultural and Islamic compliance engines | High-risk claims without a validated scope or benchmark | Qualified ownership, defined policy, evidence, and appropriate user controls |
| Iraqi dialect accuracy claims | No accepted test corpus or measured production behavior | Representative benchmark, methodology, limitations, and current results |
| Professional legal, medical, education, and government modes | Domain risk and unsupported breadth | Domain owner, sources, safeguards, evaluation, and liability review |
| Payment gateway services | Simulated behavior and placeholder URLs | Real commercial requirement, provider documentation, sandbox tests, webhook verification, reconciliation |
| Desktop and browser automation | Separate threat model and product category | Explicit customer demand and isolated security architecture |
| Voice and calling systems | Privacy, quality, latency, and cost implications | Validated workflow and dedicated evaluation plan |
| Visual workflow builder | Expands product before core loop is complete | Repeated automation demand after P4 |

## Remove later, after dependency and provenance checks

- committed test reports, screenshots, and generated output that should be CI artifacts;
- stale environment templates that conflict with the selected deployment contract;
- duplicate architecture, planning, and completion reports superseded by the rebuild documents;
- package-manager commands and lockfile references for npm or yarn;
- empty documentation files presented as completed controls;
- hard-coded benchmark, compliance, uptime, performance, and readiness claims;
- unused routes, components, packages, and migrations discovered by dependency analysis;
- legacy brand strings after permanent name clearance;
- production-facing payment and specialist-domain surfaces that remain outside scope.

## Required audit artifacts

Before P1 is considered complete, the repository should contain:

1. a dependency graph of active applications and packages;
2. a route and endpoint inventory with owners and consumers;
3. a database table and migration inventory;
4. a third-party code and asset provenance register;
5. an environment-variable and secret inventory;
6. a test map showing the behavior protected by each suite;
7. a deletion plan grouped into reversible pull requests.

## Deletion rule

No broad directory deletion occurs only because an area is out of scope. First record:

- whether active code imports it;
- whether migrations or deployed data depend on it;
- whether it contains third-party material requiring attribution or preservation;
- whether history alone is sufficient for recovery;
- which checks prove that its removal is safe.
