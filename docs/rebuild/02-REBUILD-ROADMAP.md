# Rebuild Roadmap

The rebuild is organized around complete, testable product slices. Phase numbers describe dependency order, not marketing milestones.

## P0 — Reset and trustworthy foundation

### Goal

Create one source of truth for the product, remove misleading presentation, and establish a coherent visible foundation without pretending the full product exists.

### Deliverables

- preserve the former `main` and `develop` branch heads;
- create the dedicated rebuild branch;
- define the focused product brief, brand direction, roadmap, tracker, and decision log;
- introduce centralized provisional brand configuration;
- replace the placeholder homepage, navigation, metadata, footer, and fake dashboard metrics;
- update the root README to describe the real state of the product;
- identify retained, rewritten, quarantined, and removed subsystems;
- establish a licensing and provenance review requirement;
- document validation limitations and avoid false green status.

### Exit criteria

- visible product copy matches the rebuild scope;
- no fake analytics or unverified feature claims remain in the primary surfaces;
- the new direction is understandable from the README and homepage;
- the app still has one package manager and one documented development path;
- the first pull request remains draft until automated checks run successfully.

## P1 — Application shell and data contract

### Goal

Create the durable workspace structure and data model required by the core journey.

### Deliverables

- responsive workspace shell and navigation;
- workspace, conversation, message, attachment, source, and draft schemas;
- one selected persistence strategy with migrations;
- authentication boundary and authorization model;
- typed frontend-to-API contract;
- loading, empty, failure, offline, and permission states;
- removal or quarantine of duplicate and unused architecture.

### Exit criteria

- a signed-in user can create, rename, open, and delete a persistent workspace;
- the same data is returned after process restart;
- tenant and user access rules are integration-tested;
- Arabic, English, RTL, LTR, and mixed-text shell behavior passes UI tests.

## P2 — Real bilingual conversation

### Goal

Replace the placeholder response path with a reliable, observable AI conversation flow.

### Deliverables

- real model-provider abstraction;
- streamed responses;
- cancellation, retry, timeout, quota, and provider-failure behavior;
- persistent messages and conversation history;
- safe system-instruction construction;
- model and token/cost observability;
- input and output rendering for Arabic, English, code, numbers, and mixed text.

### Exit criteria

- the complete conversation journey works against persistent storage and a real provider;
- failed and interrupted responses recover safely;
- provider secrets remain server-side;
- model, latency, error, and cost metadata is observable;
- automated tests cover Arabic, English, and mixed-direction conversations.

## P3 — Documents and source-grounded answers

### Goal

Make documents a first-class part of the workspace and keep supporting context inspectable.

### Deliverables

- validated upload and deletion flow;
- processing status and failure recovery;
- extraction for the first supported document formats;
- chunking, indexing, retrieval, and citation model;
- source viewer with passage-level navigation;
- explicit distinction between source-grounded and general output;
- retention, size, and file-type policies.

### Exit criteria

- a user can upload an Arabic or English document, ask about it, inspect the supporting passage, and delete it;
- unsupported, corrupt, duplicate, oversized, and malicious files have tested outcomes;
- citations resolve to the correct document and passage;
- document data is isolated by workspace and user.

## P4 — Drafts and reusable work

### Goal

Turn conversation results into durable outputs rather than ending at a chat response.

### Deliverables

- draft canvas linked to its source conversation and documents;
- summary, comparison, email, memo, checklist, and decision-note starting actions;
- edit, rename, version, copy, export, and continue-with-AI actions;
- clear saved and unsaved states;
- output history and provenance.

### Exit criteria

- the full Ask → Ground → Draft → Continue journey is complete;
- saved outputs survive refresh and process restart;
- exports preserve Arabic and mixed-direction text correctly;
- source provenance remains attached to derived work.

## P5 — Operational readiness

### Goal

Prepare a narrow beta that can be operated responsibly.

### Deliverables

- reproducible Bun-based builds and container images;
- staging and production environment contracts;
- migrations, backups, restore test, and rollback procedure;
- monitoring, alerting, audit events, and cost controls;
- accessibility, security, privacy, dependency, and provenance reviews;
- realistic onboarding, support, and data-deletion paths;
- measured baseline product and reliability metrics.

### Exit criteria

- deployment is reproducible from a clean environment;
- restore and rollback exercises succeed;
- critical security and authorization tests pass;
- an operator can identify failures, cost spikes, and degraded providers;
- all public claims are supported by current evidence.

## Deferred capability gate

Payments, specialist domains, agents, workflows, voice, desktop automation, mobile clients, and integrations can be considered only after P4 is complete and the proposed capability has:

1. a validated user problem;
2. a clear owner;
3. an end-to-end design;
4. security and data implications;
5. measurable acceptance criteria;
6. a reason it belongs in the core product rather than an integration or separate product.
