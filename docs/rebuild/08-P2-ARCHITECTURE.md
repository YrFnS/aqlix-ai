# P2 Architecture — Real Bilingual Conversation

**Branch:** `agent/p2-bilingual-conversation`  
**Status:** In progress  
**Depends on:** P1 account, workspace, PostgreSQL, session, and row-level-security foundation  
**Phase goal:** deliver one real, persistent, observable Arabic/English conversation path without introducing a second identity or data authority.

## Scope

P2 activates the conversation and message records created in P1.

P2 includes:

- persistent conversation creation, listing, opening, renaming, archiving, and deletion;
- persistent user and assistant messages;
- one server-side provider abstraction;
- one streamed response transport;
- explicit pending, streaming, complete, failed, and cancelled message states;
- retry as a new assistant attempt that preserves previous failed or cancelled output;
- provider response ID, model, token, latency, and failure telemetry;
- Arabic, English, code, URL, number, punctuation, and mixed-direction rendering;
- authorization through the existing workspace session and PostgreSQL RLS boundary;
- deterministic integration testing without presenting a fixture provider as production capability.

P2 does not include document upload, retrieval, citations, tools, web search, multi-agent routing, voice, image generation, background tasks, or drafts. Those remain P3 or later.

## Audit result: inherited chat implementation

The inherited FastAPI chat route and `ChatService` are not reused.

Reasons:

- sessions and messages are stored in process memory;
- responses are hard-coded placeholders;
- the route uses a separate custom authentication model;
- there is no streaming lifecycle;
- there is no durable cancellation, retry, provider-error, or token/cost record;
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

Production configuration rejects the fixture provider. The interface labels fixture output in stream metadata, and product documentation never describes it as a real model response.

### 9. Provider configuration is capability-scoped

Clean marketing, account, workspace, lint, type-check, and build paths remain possible without a provider key.

When a user attempts generation without valid provider configuration, the conversation route returns an explicit service-unavailable failure and does not claim that a response was generated.

## Data lifecycle

### New conversation

1. Owner or editor creates a conversation inside an authorized workspace.
2. PostgreSQL records `created_by`, title, status, and workspace ownership.
3. RLS protects the conversation and its later messages.

### New turn

1. The server validates the command and workspace role.
2. PostgreSQL locks the conversation and allocates the next sequence numbers.
3. The user message is inserted as complete.
4. The assistant message is inserted as pending.
5. A pending generation row is inserted.
6. The provider stream starts.
7. Assistant state becomes streaming after the first provider event.
8. Partial content is checkpointed at bounded intervals.
9. Completion, cancellation, or failure is persisted before the final application event is emitted.

### Read path

Conversation pages query PostgreSQL using the signed-in user session. There is no process-memory history cache.

## Authorization matrix

| Capability | Owner | Editor | Viewer |
| --- | ---: | ---: | ---: |
| List/open conversations | Yes | Yes | Yes |
| Read messages and generation status | Yes | Yes | Yes |
| Create/rename/archive conversation | Yes | Yes | No |
| Send message | Yes | Yes | No |
| Cancel own active browser stream | Yes | Yes | No |
| Retry failed/cancelled assistant message | Yes | Yes | No |
| Delete conversation | Yes | Yes | No |

Workspace deletion continues to cascade through conversations, messages, and generation rows.

## Server-only environment

- `AI_PROVIDER` — `openai` by default; `fixture` only with explicit test opt-in;
- `OPENAI_API_KEY` — required when the OpenAI adapter is used;
- `OPENAI_MODEL` — requested model, default `gpt-5-mini`;
- `OPENAI_BASE_URL` — optional validated override, default OpenAI API origin;
- `AI_REQUEST_TIMEOUT_MS` — bounded provider timeout;
- `AI_MAX_OUTPUT_TOKENS` — bounded response length;
- `P2_ALLOW_FIXTURE_PROVIDER` — test-only fixture gate.

None of these variables use the `NEXT_PUBLIC_` prefix.

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

Provider response bodies and secrets are not returned to the browser. Bounded diagnostic details may be recorded server-side and in the generation row.

## Validation plan

P2 validation is layered:

1. Zod contract tests for commands and stream events;
2. provider-adapter tests with deterministic SSE fixtures;
3. PostgreSQL tests for atomic turn creation, sequence allocation, roles, retry rules, telemetry ownership, and cascades;
4. focused web tests for route and environment boundaries;
5. production Next.js build without provider secrets;
6. local Supabase browser journey using the explicitly enabled fixture provider;
7. optional real-provider smoke test only when a protected key is intentionally supplied.

A fixture-provider browser test proves application streaming behavior, not external provider availability or model quality.

## P2 completion boundary

P2 is complete only when:

- an owner or editor can create and reopen a persistent conversation;
- Arabic, English, and mixed input stream into a durable assistant message;
- refresh returns the complete conversation history;
- Stop records a cancelled assistant message without deleting partial text;
- a failed or cancelled message can be retried without overwriting history;
- provider configuration and provider failures are explicit;
- a viewer cannot generate or mutate conversation content;
- a second account cannot access another workspace's conversation;
- token and latency metadata are stored when available;
- all required P0, P1, and P2 gates pass on the final branch head.
