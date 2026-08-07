# P1 Architecture — Application Shell and Data Contract

**Branch:** `agent/p1-workspace-foundation`  
**Status:** In progress  
**Phase goal:** establish one durable account, workspace, persistence, authorization, and contract boundary before conversation or document capabilities are added.

## Scope

P1 is intentionally limited to the product structure required by the first complete journey:

- account access and session continuity;
- persistent workspaces and memberships;
- a responsive Arabic-first workspace shell;
- schema placeholders for conversations, messages, attachments, sources, and drafts;
- typed commands and HTTP responses;
- explicit loading, empty, failure, offline, and permission states;
- tested tenant isolation.

P1 does not call a model, process documents, generate citations, or create production-ready exports. Those capabilities remain in P2–P4.

## Authoritative architecture decisions

### 1. Supabase Auth and PostgreSQL are the identity and data authority

Supabase is selected because the repository already contains a Supabase client package and because it can provide one coherent contract for:

- email/password account access;
- server-validated sessions;
- PostgreSQL persistence;
- row-level security;
- later object storage integration.

The existing Supabase utilities are reused only after simplification. The former `test_users` generated type and unverified custom authentication layer are not accepted as the P1 contract.

### 2. Next.js owns the interactive account and workspace boundary

The web application owns:

- sign-in, sign-up, sign-out, and session refresh;
- protected application routes;
- workspace commands and queries;
- same-origin `/api/v1` workspace endpoints;
- translating domain failures into user-facing states.

This avoids routing simple account and workspace operations through two server frameworks.

### 3. FastAPI remains a later capability service, not a second data authority

The inherited FastAPI application remains under audit. P2 and P3 may use it for model streaming, document processing, retrieval, and background jobs after its startup and security boundaries are simplified.

FastAPI must not create a parallel user, workspace, membership, or session model. It will consume the same identity and workspace contract when introduced.

### 4. SQL migrations are canonical

Canonical database changes live under:

```text
supabase/migrations/
```

Generated TypeScript database types mirror those migrations. A handwritten type without a matching migration is not considered an implemented table.

### 5. Row-level security is the authorization boundary

Every workspace-owned table includes `workspace_id`. Access is granted through `workspace_members` and evaluated in PostgreSQL policies.

Application checks improve error messages, but they do not replace database enforcement.

### 6. Shared Zod contracts define commands and responses

Runtime schemas and inferred TypeScript types live under `@iraqi-ai/types/contracts`. Keeping them inside the existing locked shared package avoids adding a parallel workspace solely for contracts while still providing one import surface for the web application and future service adapters.

The contracts cover:

- workspace creation, rename, archive, restore, and deletion;
- persisted workspace-domain objects;
- standardized success and failure envelopes;
- validation and authorization error codes.

Permanent namespace migration is deferred until the public name is cleared.

## Data model

### `workspaces`

Represents the durable container for the user journey.

Required fields:

- `id`
- `owner_id`
- `name`
- `description`
- `default_language`
- `created_at`
- `updated_at`
- `archived_at`

### `workspace_members`

Defines access to a workspace.

Roles:

- `owner` — full workspace and membership control;
- `editor` — read and modify workspace content;
- `viewer` — read workspace content.

A workspace creation trigger inserts the owner membership in the same transaction.

### `conversations`

A durable conversation container. P1 creates the schema and shell boundary; P2 implements the real provider-backed message flow.

### `messages`

Stores ordered conversation messages and explicit states. P2 adds streaming lifecycle and provider metadata.

### `attachments`

Stores attachment metadata, ownership, processing state, and storage path. P3 implements upload and extraction.

### `sources`

Represents inspectable source passages connected to an attachment. P3 implements extraction, retrieval, and citation resolution.

### `drafts`

Represents reusable work linked to its workspace and optional source conversation. P4 implements editing, versioning, and export.

## Request and session flow

1. Middleware refreshes the Supabase session when configuration is present.
2. Protected application routes require a server-validated user.
3. Server actions and `/api/v1` route handlers obtain the user from Supabase, never from client-supplied identifiers.
4. Commands are parsed with shared Zod schemas.
5. PostgreSQL RLS enforces workspace membership and role access.
6. Responses use a discriminated `ok: true | false` envelope.
7. User-facing pages translate errors into Arabic-first bilingual states.

## Authorization matrix

| Capability | Owner | Editor | Viewer |
| --- | ---: | ---: | ---: |
| Read workspace | Yes | Yes | Yes |
| Rename or edit workspace | Yes | Yes | No |
| Create or edit workspace content | Yes | Yes | No |
| Archive workspace | Yes | No | No |
| Restore workspace | Yes | No | No |
| Delete workspace | Yes | No | No |
| Manage members | Yes | No | No |

## Environment boundary

Browser-visible configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- non-secret public feature and environment flags

Server-only configuration:

- `SUPABASE_SERVICE_ROLE_KEY` only for narrowly approved administrative or background operations;
- future internal API credentials;
- model-provider secrets introduced in P2.

The browser must never receive the service-role key. Normal workspace requests use the signed-in user session and RLS, not administrative bypass.

## Failure and state model

P1 provides explicit states for:

- no workspaces;
- workspace loading;
- validation failure;
- unauthenticated access;
- forbidden access;
- missing workspace;
- persistence failure;
- unavailable Supabase configuration;
- browser offline status.

No empty state is presented as live user data.

## Validation plan

P1 validation is layered:

1. contract tests for command parsing and response envelopes;
2. PostgreSQL migration and RLS integration tests;
3. web source and component tests for route protection and state coverage;
4. optimized Next.js production build;
5. browser tests for Arabic, English, mixed-direction, keyboard, mobile, and hydration behavior;
6. manual Supabase environment validation before a deployment is described as usable.

## P1 completion boundary

P1 is complete only when:

- a configured user can sign in or create an account;
- the user can create, rename, open, archive, restore, and delete a workspace;
- workspace data survives application restart because it is stored in PostgreSQL;
- a second user cannot read or mutate another workspace without membership;
- the application shell handles Arabic, English, and mixed-direction content;
- all required CI jobs pass on the final branch head.
