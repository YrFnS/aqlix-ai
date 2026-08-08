# P4 Architecture — Durable Drafts and Reusable Work

**Branch:** `agent/p4-drafts-reusable-work`  
**Status:** In progress  
**Depends on:** P1 workspace/RLS, P2 persistent streaming, and P3 private documents, retrieval, and citations  
**Phase goal:** complete the trustworthy product loop: **Ask → Ground → Draft → Continue**.

## Product outcome

P4 must let an authorized user:

1. turn a completed assistant message into a durable draft;
2. choose a useful starting structure;
3. edit Arabic, English, or mixed-direction content;
4. see an explicit saved or unsaved state;
5. save immutable versions and reopen them after reload;
6. inspect the origin conversation, message, and source snapshots;
7. copy or export the accepted draft in implemented UTF-8 formats;
8. ask the existing provider for a proposed revision;
9. apply that proposal as a new version without erasing prior work;
10. archive, restore, reopen, and delete the draft.

P4 does not turn every assistant response into a draft automatically. The user chooses when a conversation result becomes reusable work.

## Starting structures

The first draft-creation action supports:

- `summary`;
- `comparison`;
- `email`;
- `memo`;
- `checklist`;
- `decision_note`;
- `freeform` for later direct creation.

The initial structure is deterministic and visible. It does not make an additional model call or pretend to have transformed the content intelligently. The selected assistant response is inserted into a bounded, editable scaffold appropriate to the chosen kind.

## Authoritative boundaries

### Identity and authorization

Supabase Auth remains the account/session identity authority.

Normal draft requests use the signed-in request-scoped Supabase client. PostgreSQL RLS and bounded security-definer functions enforce:

| Capability | Owner | Editor | Viewer |
| --- | ---: | ---: | ---: |
| List/open drafts, versions, provenance | Yes | Yes | Yes |
| Export accepted draft | Yes | Yes | Yes |
| Create/edit/save/restore version | Yes | Yes | No |
| Start/stop/apply/discard AI proposal | Yes | Yes | No |
| Archive/restore/delete draft | Yes | Yes | No |

Archived workspaces are read-only for every role. Archived drafts are readable and exportable, but cannot be edited or sent to the provider until restored.

### PostgreSQL

PostgreSQL remains authoritative for:

- current accepted draft state;
- immutable draft versions;
- conversation/message provenance;
- source citation snapshots;
- AI proposal attempts and telemetry;
- archive and deletion lifecycle.

No process-memory draft store is introduced.

### Provider

Draft continuation reuses the P2 server-only provider abstraction and normalized failure codes.

The provider receives:

- the current accepted draft content;
- a bounded user instruction;
- the draft kind and direction;
- explicit instructions to return revised draft content only.

The provider does not receive browser-owned workspace identity or arbitrary database history. The OpenAI Responses adapter continues to use `store: false`.

A completed provider response is a **proposal**, not an invisible overwrite. Applying it creates a new immutable draft version. Discarding it leaves the accepted draft unchanged.

## Data model

### `drafts` extensions

The existing P1 table remains the current-state record and gains:

- `kind` — `freeform`, `summary`, `comparison`, `email`, `memo`, `checklist`, or `decision_note`;
- `origin_message_id` — optional assistant message in the same workspace/conversation;
- `current_version` — accepted immutable version number;
- `version_count` — total accepted versions;
- `provenance_count` — copied source snapshot count;
- `last_saved_at` — accepted save timestamp;
- `archived_at` — explicit archive timestamp synchronized with status.

Current title, content, and direction remain denormalized on `drafts` for efficient list/detail reads. They must equal the current accepted version.

### `draft_versions`

Every accepted state is immutable:

- workspace and draft identity;
- contiguous `version_number` starting at one;
- title, content, direction, and draft kind snapshot;
- `source_kind`: `initial`, `manual`, `ai`, or `restored`;
- creator;
- optional originating AI generation ID;
- optional restored-from version number;
- created timestamp.

A save that does not change title, content, direction, or kind does not create a duplicate version.

### `draft_provenance`

Creation from an assistant message snapshots its persisted citations:

- citation order and label;
- live source and attachment IDs;
- filename, media type, source ordinal, and page/line locator snapshots;
- origin assistant message and conversation;
- created timestamp.

Live IDs use `ON DELETE SET NULL`. A deleted document therefore becomes explicitly unavailable while the original filename and locator remain inspectable.

### `draft_generations`

Each AI continuation attempt records:

- workspace, draft, creator, and base draft version;
- bounded instruction and requested action;
- provider, requested/returned model, and provider response ID;
- status: `pending`, `streaming`, `complete`, `failed`, `cancelled`, `applied`, or `discarded`;
- bounded proposed or partial content;
- token, first-token, and total latency telemetry;
- stable failure code and bounded message;
- started, completed, applied, discarded, created, and updated timestamps.

A proposal can be applied only when:

- its status is `complete`;
- the caller is owner/editor;
- the workspace and draft are active;
- the draft current version still equals the proposal base version.

That optimistic check prevents a late proposal from silently overwriting newer manual work.

## Atomic functions

### Create draft from message

`create_draft_from_message`:

1. validates active workspace owner/editor access;
2. validates the origin is a completed assistant message in the supplied conversation/workspace;
3. validates bounded deterministic title/content/kind/direction;
4. inserts the current draft record;
5. inserts immutable version 1;
6. copies all persisted message-citation snapshots in order;
7. returns the draft identity.

### Save accepted version

`save_draft_version`:

1. locks the draft;
2. validates active workspace/draft and expected current version;
3. returns the current version unchanged when content is identical;
4. inserts the next contiguous immutable version;
5. updates the denormalized draft current state and counters;
6. touches the workspace/draft timestamps.

### Begin and finish AI proposal

`begin_draft_generation` locks and snapshots the current version before provider work begins.

Checkpoint and finish functions preserve bounded partial output, telemetry, cancellation, and failure without changing the accepted draft.

### Apply or discard proposal

`apply_draft_generation` atomically inserts an `ai` version and marks the proposal applied. A stale base version raises a conflict.

`discard_draft_generation` marks a complete proposal discarded without changing the draft.

### Lifecycle

Bounded functions archive, restore, and delete drafts. Direct authenticated draft/version/provenance/generation mutation is revoked.

## Editor behavior

The draft canvas is a client component backed by server-authorized APIs.

It provides:

- title and content editing;
- automatic direction for mixed user content plus an explicit direction override;
- a visible `Saved`, `Unsaved changes`, `Saving`, or `Save failed` state;
- `Ctrl+S` / `Cmd+S` save;
- a browser-leave warning only while unsaved changes exist;
- optimistic version conflict feedback;
- no hidden autosave claim.

The accepted draft updates only after the save API succeeds.

## Version history

The detail page lists immutable versions newest first with:

- version number;
- source kind;
- creator/time metadata;
- title and content preview;
- link to inspect the full snapshot;
- restore action for owner/editor.

Restoring an older version creates a new `restored` version. History is never rewritten.

## Copy and export

### Copy

The client copies the current accepted draft content and reports success or failure. Clipboard failure does not imply export failure.

### Export

The same-origin export route supports only:

- UTF-8 plain text (`.txt`);
- UTF-8 Markdown (`.md`);
- standalone UTF-8 HTML (`.html`).

The HTML export:

- escapes title and content;
- declares UTF-8;
- preserves whitespace;
- uses `dir="auto"` for user content;
- includes no scripts, remote resources, or raw uploaded HTML.

PDF and DOCX are not claimed or exposed in P4.

## AI continuation UX

The user supplies a bounded instruction or selects a transparent preset such as:

- improve clarity;
- shorten;
- expand;
- translate to Arabic;
- translate to English;
- continue writing.

The proposal streams into a separate review panel. The current accepted editor content remains unchanged during generation.

Terminal states:

- `complete` — proposal can be applied or discarded;
- `failed` — partial output and stable failure code remain visible;
- `cancelled` — partial output remains visible and accepted content is unchanged;
- `applied` — a new accepted immutable version exists;
- `discarded` — accepted content is unchanged.

## Routes

```text
/workspaces/<workspace-id>/drafts
/workspaces/<workspace-id>/drafts/archived
/workspaces/<workspace-id>/drafts/<draft-id>
/workspaces/<workspace-id>/drafts/<draft-id>/versions/<version-number>

/api/v1/workspaces/<workspace-id>/drafts
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/versions
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/export
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/continue/stream
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/continue/<generation-id>/apply
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/continue/<generation-id>/discard
```

## Validation

### Contracts and unit tests

- draft kinds, lifecycle commands, save conflict inputs, export formats, and AI proposal events;
- deterministic six-kind scaffolds for Arabic, English, and mixed text;
- HTML escaping and UTF-8 export;
- saved/unsaved editor state helpers;
- provider source boundary and no raw HTML injection.

### PostgreSQL

- contiguous immutable versions;
- no-op save behavior;
- optimistic version conflict;
- owner/editor/viewer/outsider matrix;
- archived workspace/draft guards;
- origin message workspace integrity;
- citation snapshot copying and deleted-source preservation;
- generation checkpoint, completion, cancellation, failure, apply, discard, and stale-base conflict;
- draft/workspace/conversation cascades and conversation deletion provenance behavior;
- all P1–P3 regression tests.

### Browser

- real account/workspace/conversation/source flow;
- create each reusable draft kind from a completed assistant message;
- edit mixed Arabic-English content;
- explicit dirty/saved state and keyboard save;
- reload persistence;
- immutable version history and restore;
- provenance link to live passage and unavailable snapshot after deletion;
- copy feedback;
- TXT, Markdown, and HTML download bytes and direction preservation;
- streamed AI proposal, cancellation/failure, apply as new version, and discard;
- viewer mutation denial and outsider isolation;
- archive, restore, reopen, delete, responsive, keyboard, and hydration behavior.

## Completion boundary

P4 is complete only when the full **Ask → Ground → Draft → Continue** journey is persistent and repeatably tested on the final branch head.

P4 completion is not production readiness, collaborative editing, office-format fidelity, specialist reliability, deployment validation, backup/restore validation, security/privacy certification, accessibility certification, or product-name clearance.
