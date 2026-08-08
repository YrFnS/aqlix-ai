# Rebuild Roadmap

The rebuild is organized around complete, testable product slices. Phase numbers describe dependency order, not marketing milestones.

## Phase status

| Phase | Outcome | Status |
| --- | --- | --- |
| P0 | Reset and trustworthy foundation | DONE |
| P1 | Account, workspace, persistence, and authorization | DONE |
| P2 | Persistent bilingual conversation | DONE |
| P3 | Private documents, inspectable sources, and grounded citations | DONE |
| P4 | Durable drafts and reusable work | DONE |
| P5 | Operational readiness | IN PROGRESS |

Feature completion through P4 does not imply production readiness. P5 owns the evidence required for beta and public release.

Current P5 position:

- P5.0 local release baseline implemented; final exact-head confirmation remains required;
- P5.1 staging Blueprint, migration path, and rollback runbook committed;
- P5.2 OpenRouter BYOK, Vault storage, live model discovery, and selected-model streaming implemented; final exact-head journey remains required;
- no hosted staging deployment or rollback exercise has been completed;
- production ready remains **No**.

## P0 — Reset and trustworthy foundation

### Goal

Create one source of truth, narrow the product, remove misleading presentation, preserve useful history, and establish active quality gates.

### Delivered

- preserved former branch heads;
- focused the product on Ask → Ground → Draft → Continue;
- selected the working Kiteb identity with explicit clearance requirements;
- removed fake metrics and unsupported readiness, performance, compliance, and payment claims;
- retained selected Arabic, RTL, mixed-text, and layout foundations;
- quarantined incomplete inherited capabilities;
- standardized on Bun for dependency and workspace management;
- separated active rebuild gates from legacy audits;
- documented provenance review as a release requirement.

### Exit evidence

Active lint, focused TypeScript, tests, optimized web build, Arabic/RTL safeguards, accessibility safeguards, and product-language safeguards passed.

## P1 — Account, workspace, persistence, and authorization

### Goal

Create one identity, session, database, authorization, and workspace authority.

### Delivered

- Supabase Auth sign-up, sign-in, confirmation, refresh, and sign-out;
- protected Next.js application shell;
- request-scoped Supabase clients;
- PostgreSQL workspaces and memberships;
- owner, editor, and viewer roles;
- RLS for workspace-owned tables;
- workspace create, list, edit, archive, restore, delete, and reload;
- typed APIs and request IDs;
- loading, empty, failure, unavailable, and offline states;
- local Supabase configuration;
- PostgreSQL ownership/isolation tests;
- real two-account Chromium journey.

### Exit evidence

P1 Data Contract and P1 Authenticated Browser Journey passed with all P0 gates.

## P2 — Persistent bilingual conversation

### Goal

Add one real, durable Arabic/English conversation path without creating a second identity or state authority.

### Delivered

- persistent conversations and ordered messages;
- atomic turn creation and sequence allocation;
- server-only provider abstraction;
- normalized `ready`, `delta`, `complete`, `failed`, `cancelled`, and `heartbeat` events;
- provider attempt telemetry;
- Stop with partial persistence;
- retry as a new attempt;
- stable provider failures;
- Arabic, English, mixed-direction, URL, number, and fenced-code rendering;
- owner/editor write, viewer read, outsider isolation;
- archived conversation/workspace guards;
- deterministic local/test fixture rejected in staging and production.

P2 initially proved the boundary with an OpenAI adapter and deterministic fixture. P5 extends the same normalized boundary with account-scoped OpenRouter BYOK rather than replacing the conversation authority.

### Exit evidence

P2 Conversation Data Contract and P2 Bilingual Conversation Journey passed with P0–P1 regressions.

## P3 — Private documents, inspectable sources, and grounded citations

### Goal

Add an honest path from private upload to inspectable supporting passage and persist valid answer citations.

### Delivered

- private workspace document bucket;
- strict TXT and Markdown upload contract, 2 MiB limit;
- generated object paths;
- durable attachment-processing attempts;
- strict UTF-8 decoding and bounded deterministic chunking;
- offsets and real line locators;
- mixed-script search normalization and ranked workspace search;
- source list/detail, stable anchors, signed download, and coordinated deletion;
- Storage and PostgreSQL role policies;
- explicit grounded conversation opt-in;
- bounded source retrieval and prompt boundary;
- required valid citation labels;
- persistent message citations;
- exact passage links;
- honest deleted-source snapshots.

### Exit evidence

P3 data, private-source browser, and grounded-conversation journeys passed with P0–P2 regressions.

### Deliberately deferred

PDF, DOCX, OCR, office files, images, spreadsheets, presentations, archives, audio, and video require an isolated worker, parser security model, decompression/resource limits, patch management, and real malicious/corrupt fixtures.

## P4 — Durable drafts and reusable work

### Goal

Complete Ask → Ground → Draft → Continue by turning a persisted conversation result into accepted, versioned, inspectable, exportable work.

### Delivered

- deterministic summary, comparison, email, memo, checklist, and decision-note scaffolds;
- draft creation from a completed assistant message without an additional provider call;
- copied citation provenance;
- current accepted draft state in PostgreSQL;
- immutable draft versions;
- no-op-save detection;
- explicit saved, unsaved, saving, and save-failure states;
- `Ctrl+S` / `Cmd+S` and unsaved-leave warning;
- optimistic stale-write conflicts;
- read-only version inspector;
- restore as a new version;
- provenance links to exact passages and honest unavailable-source snapshots;
- copy accepted content;
- UTF-8 TXT, Markdown, and standalone escaped HTML export;
- separate server-only provider proposals;
- improve, shorten, expand, translate, continue, and custom actions;
- proposal checkpointing, Stop, partial persistence, explicit failures, and telemetry;
- apply as a new immutable version;
- discard without changing accepted work;
- stale proposal rejection;
- draft archive, restore, reopen, and delete;
- atomic origin detachment before origin-conversation deletion;
- owner/editor write, viewer read/export, outsider isolation;
- archived workspace/draft read-only behavior;
- responsive route states and complete browser journey.

### Exit evidence

P4 Durable Draft Data Contract and P4 Ask Ground Draft Continue Journey passed with the full P0–P3 matrix. PR `#6` merged to `develop` at `bb96c3300ec86118f03b0acd142209be3994d424`.

### Deliberately deferred

- PDF and DOCX export;
- office-suite layout fidelity;
- collaborative realtime editing;
- autonomous workflows that apply provider output without review.

## P5 — Operational readiness

### Goal

Turn the proven local product loop into a deployable, observable, recoverable, cost-controlled, reviewed beta and production system.

### P5.0 — Architecture, environments, ownership, and local release baseline

#### Implemented

- development, test, staging, and production environment contracts;
- one stateless Next.js topology backed by hosted Supabase and a server-only provider boundary;
- release, service, data, provider-control, security/privacy, observability, and incident roles;
- non-secret liveness and fail-closed readiness endpoints;
- immutable release identity from explicit, Render, or GitHub commit metadata;
- fixture-provider rejection in staging and production;
- frozen Bun `1.3.14` dependency and workspace path;
- Node.js `24.14.1` Next.js production compiler and server path;
- root React/React DOM `19.1.1` for the active web graph;
- nested mobile React 18 isolation;
- external shared-UI React peer dependencies;
- full production build, process startup, liveness, and Supabase-backed readiness workflow;
- non-secret evidence artifact.

#### Remaining closeout

- repeat every operational and P0–P4 gate on the final documentation head;
- update PR and tracker evidence without adding an unvalidated commit afterward.

### P5.1 — Deployment and migrations

#### Implemented as infrastructure intent

- manual Render staging Blueprint in Frankfurt;
- pinned Node and Bun versions;
- frozen dependency installation;
- exact commit and external-URL derivation;
- separate Supabase secret placeholders;
- no platform provider key or hardcoded model for OpenRouter BYOK;
- paid pre-deploy migration command;
- migration history inspection;
- dry run before apply;
- production migration approval lock;
- health-based traffic promotion;
- graceful shutdown window;
- application rollback runbook;
- expand-and-contract schema guidance;
- forward-only database recovery runbook.

#### Still required

- provision a separate hosted Supabase staging project;
- provision the Render staging service;
- execute a clean manual deployment;
- verify Storage, Vault, and RLS policies against staging;
- run the authenticated staging smoke checklist;
- exercise application rollback;
- rehearse a forward recovery migration;
- record evidence without secrets.

### P5.2 — OpenRouter BYOK and live model selection

#### Implemented

- account-scoped AI settings page;
- user-owned key validation against OpenRouter before persistence;
- encrypted key storage in Supabase Vault;
- masked public settings metadata only;
- per-account RLS and credential isolation;
- current user-filtered OpenRouter catalog loaded with `no-store` semantics;
- live search, sorting, free-only filtering, pricing/context display, and refresh;
- model-ID copy and manual paste support;
- exact current model validation before persistence;
- dynamic selected-model resolution for conversations and draft continuation;
- normalized OpenRouter streaming and usage telemetry;
- explicit authentication, budget, rate-limit, timeout, unavailable, and invalid-response failures;
- disconnect removes the Vault secret;
- missing key/model fails explicitly without a platform fallback;
- deployment no longer requires a provider key or model ID;
- deterministic OpenRouter-compatible API, Vault SQL contract, and Chromium journey.

#### Remaining closeout

- obtain exact-head success for Vault, catalog, selected-model streaming, disconnect, and two-account isolation;
- exercise one disposable real user key in an approved staging account without recording the secret or generated content;
- document current public-provider observations as time-bound evidence, not an uptime or quality guarantee.

### P5.3 — Quotas, rate limits, and abuse controls

- limit account creation and authentication abuse;
- limit messages, concurrent streams, output ceilings, uploads, storage, searches, drafts, and exports;
- add account, workspace, and IP controls where appropriate;
- preserve BYOK while enforcing application resource protection;
- add retry limits and provider circuit breaking;
- keep error responses non-disclosing;
- validate fail-closed behavior when quota services are unavailable.

### P5.4 — Monitoring and incident response

- structured request IDs and logs across browser, routes, database, Storage, Vault, and provider;
- metrics for availability, latency, errors, saturation, token use, and storage;
- dashboards and actionable alerts;
- log redaction and retention rules;
- named on-call or response ownership;
- incident triage, containment, communication, and recovery runbooks;
- execute at least one failure drill.

### P5.5 — Backup, restore, and disaster recovery

- define PostgreSQL backup schedule and retention;
- define original-object backup and restore strategy;
- define Vault credential deletion/reconnection behavior without exporting user secrets;
- test full workspace recovery including conversations, citations, drafts, versions, and provenance;
- verify deleted data is not silently restored into active state;
- measure recovery-point and recovery-time results;
- document disaster-recovery procedures and owners.

### P5.6 — Security and privacy review

- review session, cookie, CSRF, request-origin, and redirect behavior;
- review every RLS, Storage, and Vault boundary;
- review security-definer functions and grants;
- review prompt data, provider retention, logging, and redaction;
- review key connection, replacement, disconnect, and account deletion behavior;
- review upload, parser, retention, deletion, and download behavior;
- define data classification and retention periods;
- add dependency and secret scanning;
- perform a focused abuse and tenant-isolation review;
- resolve findings before beta/production claims.

### P5.7 — Accessibility and product-quality validation

- keyboard-only walkthrough of the full product loop and AI settings;
- screen-reader validation for forms, streams, citations, editor state, versions, proposals, catalog filters, and model selection;
- focus management and route transition review;
- contrast, zoom, reflow, reduced-motion, RTL, LTR, mixed text, and mobile validation;
- Arabic and English copy review;
- document exact tested scope without claiming certification unless independently established.

### P5.8 — Provenance and licensing

- inventory source and license for inherited code, packages, fonts, assets, screenshots, and generated material;
- remove or replace unresolved material;
- confirm repository and distribution licensing;
- document third-party notices;
- block public/commercial release until clearance is complete.

### P5 exit criteria

P5 is complete only when:

- deployment from a clean environment is reproducible;
- migrations and rollback are exercised;
- the authenticated user-owned provider path is verified with application quotas and abuse controls;
- monitoring and alerts are active;
- backup and restore are executed successfully;
- security/privacy findings are resolved or explicitly accepted by an owner;
- accessibility and bilingual product-quality scope is documented;
- provenance and licensing are cleared;
- beta and production gates have named evidence;
- public documentation still says **Production ready: No** until every production gate passes.

## Later and deferred areas

The following remain outside P5 unless a separately approved plan brings them back:

- payment gateways;
- multi-agent user surfaces;
- workflow builders;
- voice;
- desktop/browser automation;
- specialist legal, medical, or financial modes;
- native mobile applications;
- complex document parsers;
- collaborative realtime editing.
