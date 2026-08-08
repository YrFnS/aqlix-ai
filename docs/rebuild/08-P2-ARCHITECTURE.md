# P2 Architecture — Real Bilingual Conversation

**Branch:** `agent/p2-bilingual-conversation`  
**Pull request:** `#4`  
**Status:** Complete for the declared P2 scope; final documentation head pending merge validation  
**Depends on:** P1 account, workspace, PostgreSQL, session, and row-level-security foundation  
**Phase outcome:** one persistent, observable Arabic/English conversation path is implemented without introducing a second identity or data authority.

## Scope delivered

P2 activates the conversation and message records created in P1.

P2 includes:

- persistent conversation creation, listing, opening, renaming, archiving, restoring, and deletion;
- persistent user and assistant messages;
- one server-side provider abstraction;
- one streamed response transport;
- explicit pending, streaming, complete, failed, and cancelled message states;
- retry as a new assistant attempt that preserves previous failed or cancelled output;
- provider response ID, model, token, latency, and failure telemetry;
- Arabic, English, code, URL, number, punctuation, and mixed-direction rendering;
- authorization through the existing workspace session and PostgreSQL RLS boundary;
- deterministic full-stack validation without presenting a fixture provider as production capability.

P2 does not include document upload, retrieval, citations, tools, web search, multi-agent routing, voice, image generation, background tasks, or editable drafts. Those remain P3 or later.

## Audit result: inherited chat implementation

The inherited FastAPI chat route and `ChatService` are not reused.

Reasons:

- sessions and messages are stored in process memory;
- responses are hard-coded placeholders;
- the route uses a separate custom authentication model;
- there is no streaming lifecycle;
- there is no durable cancellation, retry, provider-error, or token record;
- startup requires unrelated payment, cultural, service-role, Redis, database, and provider configuration;
- the service would become a second conversation and authorization authority beside P1.

The inherited API remains audit scope. It can be reduced and reintroduced only when a later capability requires an independently deployable worker or service.

## Authoritative decisions

### 1. Next.js remains the interactive conversation boundary

P2 conversation routes live in the existing Next.js application because it already owns:

- the authenticated Supabase session;
- workspace membership checks;
- same-origin APIs;
- PostgreSQL access through the signed-in user's RLS context;
- the application shell and browser streaming lifecycle.

This keeps account, workspace, conversation, and message operations on one trusted path.

### 2. PostgreSQL remains the only conversation state authority

The application does not use provider-hosted conversation state as its source of truth.

Every turn is reconstructed from authorized, persisted messages. Provider requests set `store: false` so application continuity depends on the P1/P2 database contract rather than provider retention.

### 3. The first real provider adapter is OpenAI Responses

P2 introduces a small server-only adapter for the OpenAI Responses API.

The adapter:

- reads `OPENAI_API_KEY` only on the server;
- reads `OPENAI_MODEL` with a conservative default;
- sends the authorized conversation history for each turn;
- requests streamed output;
- normalizes provider events into the application stream contract;
- records provider response ID, returned model, usage, latency, and failures;
- does not expose the provider key or raw provider event stream to the browser.

The adapter is isolated behind a provider interface so another provider can be added later without changing persistence, UI, or transport semantics.

No protected OpenAI credential was supplied to repository CI. Therefore the external provider endpoint itself has not been smoke-tested by this pull request. The adapter, request boundary, stream normalization, failure mapping, and server-only configuration are covered by source, contract, type, build, and deterministic integration checks. A real-provider smoke test remains an environment-specific deployment validation.

### 4. One transport: normalized server-sent events over `fetch`

The browser sends a POST request and consumes a `text/event-stream` response using the Fetch Streams API.

The normalized event set is intentionally small:

- `ready` — the durable user/assistant records exist;
- `delta` — append assistant text;
- `complete` — durable completion metadata;
- `failed` — durable provider or persistence failure;
- `cancelled` — durable user cancellation;
- `heartbeat` — keeps long streams observable through proxies.

WebSockets and a second SSE implementation are not introduced.

Terminal application events are emitted only after their corresponding database finalization succeeds. A browser never receives a `complete`, `failed`, or `cancelled` claim for a state that the route failed to persist.

### 5. Browser cancellation uses `AbortController`

The Stop action aborts the active fetch. The route propagates cancellation to the provider request and records the assistant message and generation as `cancelled`.

Cancellation is not represented as deletion. Partial text remains inspectable.

### 6. Retry preserves history

Retry does not overwrite a failed or cancelled assistant message.

A retry:

1. verifies the referenced assistant message is failed or cancelled;
2. resolves its preceding user message inside the same conversation;
3. creates a new assistant message and generation record;
4. streams a new provider attempt.

This keeps failures and later recovery auditable.

### 7. Generation telemetry is a separate durable record

`message_generations` stores one provider attempt for each assistant message:

- workspace, conversation, and message ownership;
- provider and requested model;
- returned model and provider response ID;
- pending, streaming, complete, failed, or cancelled status;
- input, output, reasoning, and total token counts when returned;
- first-token and total latency;
- stable failure code and bounded failure detail;
- start and completion timestamps.

No public quality or cost claim is derived until real operating data exists.

### 8. Fixture provider is test-only and fail-closed

A deterministic fixture adapter may run only when both conditions are true:

- `AI_PROVIDER=fixture`;
- `P2_ALLOW_FIXTURE_PROVIDER=true`.

`APP_ENV=staging` and `APP_ENV=production` reject the fixture provider regardless of the opt-in flag. Fixture output is labelled through generation metadata, and product documentation never describes it as a real model response.

### 9. Provider configuration is capability-scoped

Clean marketing, account, workspace, lint, type-check, contract-test, and production-build paths remain possible without a provider key.

When a user attempts generation without valid provider configuration, the conversation route records and returns an explicit provider-unconfigured failure instead of fabricating a response.

### 10. Archived workspaces are read-only at every layer

The page, server actions, JSON APIs, stream route, and PostgreSQL insert triggers reject conversation mutations when the parent workspace is archived.

Existing messages and generation telemetry remain readable. Restore returns to the active conversation list and the user reopens the conversation through a clean route transition, avoiding a same-path App Router transition that left the browser shell blank despite a valid server response.

## Data lifecycle

### New conversation

1. Owner or editor creates a conversation inside an active authorized workspace.
2. PostgreSQL records `created_by`, title, status, and workspace ownership.
3. RLS protects the conversation and its later messages.

### New turn

1. The server validates the command, workspace state, and role.
2. PostgreSQL locks the conversation and allocates the next sequence numbers.
3. The user message is inserted as complete.
4. The assistant message is inserted as pending.
5. A pending generation row is inserted.
6. The provider stream starts.
7. Assistant state becomes streaming after the first provider event.
8. Partial content is checkpointed at bounded intervals.
9. Completion, cancellation, or failure is persisted before the final application event is emitted.

### Retry

1. PostgreSQL verifies that the referenced assistant message is failed or cancelled.
2. The preceding user prompt is resolved inside the same conversation.
3. A new assistant message and generation row receive the next sequence.
4. The prior failed or cancelled message remains unchanged.

### Read path

Conversation pages query PostgreSQL using the signed-in user session. There is no process-memory history cache.

## Authorization matrix

| Capability | Owner | Editor | Viewer |
| --- | ---: | ---: | ---: |
| List/open conversations | Yes | Yes | Yes |
| Read messages and generation status | Yes | Yes | Yes |
| Create/rename/archive/restore conversation | Yes | Yes | No |
| Send message | Yes | Yes | No |
| Cancel own active browser stream | Yes | Yes | No |
| Retry failed/cancelled assistant message | Yes | Yes | No |
| Delete conversation | Yes | Yes | No |

Archived workspaces are read-only for all roles. Workspace deletion continues to cascade through conversations, messages, and generation rows.

## Server-only environment

- `APP_ENV` — `development`, `test`, `staging`, or `production` capability guard;
- `AI_PROVIDER` — `openai` by default; `fixture` only with explicit local/test opt-in;
- `OPENAI_API_KEY` — required when the OpenAI adapter is used;
- `OPENAI_MODEL` — requested model, default `gpt-5-mini`;
- `OPENAI_BASE_URL` — optional validated override, default OpenAI API origin;
- `AI_REQUEST_TIMEOUT_MS` — bounded provider timeout;
- `AI_MAX_OUTPUT_TOKENS` — bounded response length;
- `P2_ALLOW_FIXTURE_PROVIDER` — local/test-only fixture gate.

None of these values use the `NEXT_PUBLIC_` prefix.

## Failure model

Stable application failure codes include:

- `PROVIDER_UNCONFIGURED`
- `PROVIDER_AUTHENTICATION`
- `PROVIDER_RATE_LIMITED`
- `PROVIDER_TIMEOUT`
- `PROVIDER_UNAVAILABLE`
- `PROVIDER_RESPONSE_INVALID`
- `STREAM_CANCELLED`
- `PERSISTENCE_ERROR`
- `UNKNOWN_PROVIDER_ERROR`

Provider response bodies and secrets are not returned to the browser. Bounded diagnostic details may be recorded server-side and in the generation row.

## Validation result

Implementation head `82a7b8ac2a6ab45c41f5cda2a64f72b40426e297` passed:

- `CI Quality Gates`
- `PR Validation`
- `Arabic & RTL Foundation`
- `Accessibility Foundation`
- `Product Language & Claims Safeguards`
- `P1 Data Contract`
- `P1 Authenticated Browser Journey`
- `P2 Conversation Data Contract`
- `P2 Bilingual Conversation Journey`

Validation includes:

1. Zod contract tests for conversation commands, provider failure codes, and normalized stream events;
2. source safeguards for server-only secrets, `store: false`, raw-HTML avoidance, and fixture deployment guards;
3. PostgreSQL tests for atomic turn creation, sequence allocation, generation telemetry, cancellation, retry preservation, viewer denial, outsider isolation, archived conversation/workspace guards, and cascades;
4. focused TypeScript validation covering every active P2 route, provider, repository, action, and component;
5. optimized Next.js production build without provider credentials;
6. the full P1 two-account browser regression;
7. a local-Supabase P2 browser journey using the explicitly enabled fixture provider.

The P2 browser journey proved:

- mixed Arabic-English streamed output;
- durable reload persistence;
- provider/model/token/latency presentation;
- Stop with partial-text persistence;
- retry without overwriting cancelled history;
- explicit provider failure persistence;
- second-account API and page isolation;
- archive/read-only/restore/reopen behavior;
- mobile composer visibility;
- conversation deletion cascades;
- sign-out;
- no captured hydration errors.

A fixture-provider browser test proves application streaming mechanics and persistence, not external provider availability or model quality.

## P2 completion boundary

P2 is considered implemented because:

- an owner or editor can create and reopen a persistent conversation;
- Arabic, English, and mixed input stream into a durable assistant message;
- refresh returns the complete conversation history;
- Stop records a cancelled assistant message without deleting partial text;
- a failed or cancelled message can be retried without overwriting history;
- provider configuration and provider failures are explicit;
- a viewer cannot generate or mutate conversation content;
- a second account cannot access another workspace's conversation;
- token and latency metadata are stored when available;
- archived conversations and workspaces enforce read-only behavior;
- all required P0, P1, and P2 gates passed on the implementation head.

This is not production readiness. A protected real-provider smoke test, deployment validation, monitoring, budget limits, backup/restore, security/privacy review, document handling, citations, and provenance clearance remain later work.
