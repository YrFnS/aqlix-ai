# P4 Architecture — Durable Drafts and Reusable Work

**Branch:** `agent/p4-drafts-reusable-work`  
**Pull request:** `#6`  
**Status:** Complete for the declared P4 scope; final documentation-head validation pending merge  
**Depends on:** P1 workspace/RLS, P2 persistent streaming, and P3 private documents, retrieval, and citations  
**Phase outcome:** complete the trustworthy product loop: **Ask → Ground → Draft → Continue**.

## Scope delivered

P4 lets an authorized user:

1. turn a completed assistant message into a durable draft;
2. choose a deterministic reusable structure;
3. preserve the origin conversation, message, and source-citation snapshots;
4. edit Arabic, English, or mixed-direction content;
5. see explicit saved, unsaved, saving, conflict, and failure states;
6. save immutable versions and reopen them after reload;
7. inspect and restore historical snapshots without rewriting history;
8. copy or export the accepted version in implemented UTF-8 formats;
9. request a separate streamed provider proposal;
10. stop, apply, or discard that proposal without invisible overwrites;
11. archive, restore, reopen, and delete the draft;
12. preserve honest provenance when the source or origin conversation is deleted.

P4 does not create a draft automatically for every answer. The user decides when a conversation result becomes reusable work.

## Starting structures

The message-to-draft action supports:

- `summary`;
- `comparison`;
- `email`;
- `memo`;
- `checklist`;
- `decision_note`.

`freeform` remains a valid draft kind for accepted editing and future direct creation, but it is not exposed as a message-conversion scaffold.

The initial structure is deterministic and visible. It does not call a provider or describe template insertion as intelligent transformation.

## Authoritative boundaries

### Identity and authorization

Supabase Auth remains the only account/session identity authority.

Normal draft requests use the signed-in request-scoped Supabase client. PostgreSQL RLS and bounded security-definer functions enforce:

| Capability | Owner | Editor | Viewer | Outsider |
| --- | ---: | ---: | ---: | ---: |
| List/open drafts, versions, provenance | Yes | Yes | Yes | No |
| Export accepted draft | Yes | Yes | Yes | No |
| Create/edit/save/restore version | Yes | Yes | No | No |
| Start/stop/apply/discard proposal | Yes | Yes | No | No |
| Archive/restore/delete draft | Yes | Yes | No | No |

Archived workspaces are read-only for every role. Archived drafts are readable and exportable, but cannot be edited or sent to the provider until restored.

### PostgreSQL

PostgreSQL remains authoritative for:

- current accepted draft state;
- immutable draft versions;
- conversation/message provenance;
- source-citation snapshots;
- proposal attempts and telemetry;
- archive and deletion lifecycle.

No process-memory draft store or browser-only accepted state is introduced.

### Provider

Draft continuation reuses the P2 server-only provider abstraction and normalized failure codes.

The provider receives only:

- the current accepted draft title and content;
- draft kind and direction;
- a bounded action and user instruction;
- system instructions that treat every draft field as untrusted data.

The OpenAI adapter continues to use `store: false`.

A completed provider response is a **proposal**. It never silently writes over accepted work. Applying it creates a new immutable version; discarding it leaves the draft unchanged.

## Data model

### `drafts`

The existing P1 table remains the current-state record and gains:

- `kind`;
- `origin_message_id`;
- `current_version`;
- `version_count`;
- `provenance_count`;
- `last_saved_at`;
- `archived_at`.

Current title, content, direction, and kind are denormalized for efficient reads and must equal the current accepted version.

### `draft_versions`

Every accepted state is immutable and stores:

- workspace and draft identity;
- contiguous version number starting at one;
- title, content, direction, and kind snapshot;
- source kind: `initial`, `manual`, `ai`, or `restored`;
- creator and created timestamp;
- optional proposal generation ID;
- optional restored-from version number.

An identical save returns the current version without manufacturing a duplicate snapshot.

### `draft_provenance`

Draft creation snapshots persisted message citations:

- citation order and label;
- live source and attachment IDs;
- filename and media-type snapshot;
- source ordinal and page/line locator snapshot;
- origin message and conversation IDs.

Live source/attachment IDs use `ON DELETE SET NULL`; snapshots remain. A deleted source is shown as unavailable rather than silently re-linked.

### `draft_generations`

Each provider proposal attempt stores:

- workspace, draft, creator, and base version;
- action and bounded instruction;
- provider, requested/returned model, and provider response ID;
- pending, streaming, complete, failed, cancelled, applied, or discarded status;
- proposed or partial content;
- tokens, first-token latency, and total latency;
- stable failure code and bounded detail;
- start, completion, apply, discard, create, and update timestamps.

A proposal can be applied only while its base version is still the current accepted version.

## Atomic functions

### Create from message

`create_draft_from_message`:

1. validates active owner/editor workspace access;
2. validates a completed assistant message in the supplied conversation/workspace;
3. validates bounded title, content, kind, and direction;
4. inserts the current draft;
5. inserts immutable version one;
6. copies persisted message-citation snapshots in order;
7. returns the draft identity and counters.

### Save accepted work

`save_draft_version`:

1. locks the draft;
2. validates active workspace/draft and expected current version;
3. detects an identical no-op save;
4. inserts the next contiguous immutable version when changed;
5. updates the denormalized current state and counters;
6. returns the accepted version number.

A stale expected version raises a serialization conflict rather than overwriting newer work.

### Proposal lifecycle

`begin_draft_generation` snapshots the current version before provider work.

`checkpoint_draft_generation` preserves bounded partial output and first-token latency.

`finish_draft_generation` persists complete, failed, or cancelled terminal state and telemetry.

`apply_draft_generation` atomically creates an `ai` version and marks the proposal applied. It rejects a stale base version.

`discard_draft_generation` marks a completed proposal discarded without changing accepted work.

### Archive and delete

`set_draft_archived` blocks archive while a proposal is active and synchronizes status/timestamp.

`delete_draft_record` removes the draft and cascades versions, provenance, and proposal attempts without deleting the origin conversation or source document.

A P4 pre-delete conversation trigger atomically nulls both live conversation and origin-message IDs before the conversation/message cascade. The reusable draft and provenance snapshots therefore survive without transient constraint violations.

Direct authenticated insert/update/delete on draft history, provenance, and proposal tables is revoked.

## Editor behavior

The draft canvas provides:

- title, kind, direction, and content editing;
- `dir="auto"` and explicit RTL/LTR override;
- visible `Saved`, `Unsaved changes`, `Saving`, and `Save failed` states;
- `Ctrl+S` / `Cmd+S`;
- browser-leave warning only while dirty;
- optimistic conflict feedback;
- no hidden autosave claim.

The accepted draft updates only after the save API succeeds.

## Version history

Versions appear newest first with:

- version number;
- source kind;
- created time;
- title/content preview;
- full read-only snapshot route;
- restore action for owner/editor.

Restoring a historical snapshot creates a new `restored` version. Existing snapshots are never changed.

## Copy and export

The accepted saved version can be copied and exported as:

- UTF-8 plain text (`.txt`);
- UTF-8 Markdown (`.md`);
- standalone UTF-8 HTML (`.html`).

The HTML export:

- escapes title and content;
- declares UTF-8;
- preserves whitespace;
- uses automatic direction for user content;
- includes no scripts or remote resources;
- uses `nosniff` and private no-store response headers.

PDF and DOCX are not implemented, exposed, or claimed in P4.

## Proposal UX

Available actions:

- improve clarity;
- shorten;
- expand;
- translate to Arabic;
- translate to English;
- continue writing;
- custom bounded instruction.

The proposal streams into a separate review panel. Accepted editor content remains unchanged.

Terminal behavior:

- `complete` — apply or discard;
- `failed` — stable failure and partial content remain inspectable;
- `cancelled` — partial content remains inspectable;
- `applied` — accepted as a new immutable version;
- `discarded` — accepted work unchanged.

## Route graph

```text
/workspaces/<workspace-id>/drafts
/workspaces/<workspace-id>/drafts/archived
/workspaces/<workspace-id>/drafts/<draft-id>
/workspaces/<workspace-id>/drafts/<draft-id>/versions/<version-number>

/api/v1/workspaces/<workspace-id>/drafts
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/archive
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/versions
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/export
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/continue/stream
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/continue/<generation-id>/apply
/api/v1/workspaces/<workspace-id>/drafts/<draft-id>/continue/<generation-id>/discard
```

## Failure model

P4 uses existing API envelopes and provider failure codes. Important conflicts include:

- stale accepted-version save;
- stale proposal base version;
- archived workspace;
- archived draft;
- active proposal during archive;
- viewer mutation attempt;
- outsider lookup;
- provider configuration, timeout, availability, invalid response, cancellation, and persistence failures.

A failed or cancelled proposal never changes accepted work.

## Validation result

P4-specific validation includes:

### Contract and source safeguards

- draft command and stream-event Zod contracts;
- all six deterministic scaffolds;
- explicit dirty-state detection;
- UTF-8 TXT/Markdown export;
- escaped script-free standalone HTML;
- complete route graph;
- PostgreSQL-only accepted/version/provenance authority;
- no provider call during initial deterministic creation;
- separate proposal stream and apply boundary;
- no raw provider events or raw HTML injection;
- no PDF/DOCX claim.

### PostgreSQL contract

The P4 data workflow validates P1–P3 at their schema boundaries, migrates forward, then proves:

- direct authenticated draft mutation is revoked;
- atomic creation and provenance copy;
- immutable version one;
- no-op save detection;
- manual versions;
- stale-write rejection;
- restore as a new version;
- proposal checkpoint, complete, apply, discard, cancel, and failure states;
- token and latency telemetry;
- stale proposal rejection;
- viewer and outsider isolation;
- archived draft/workspace guards;
- deleted-source provenance snapshots;
- atomic origin detachment before conversation deletion;
- draft-child cascades.

### Chromium product journey

The P4 browser workflow starts local Supabase Auth, PostgREST, PostgreSQL, and private Storage, then proves:

- sign-up and workspace creation;
- private source upload;
- grounded cited answer;
- deterministic creation of all six draft structures;
- edit, explicit save, reload, and clipboard copy;
- safe TXT, Markdown, and HTML export;
- immutable version inspection and restore;
- proposal discard, apply, Stop with partial persistence, and explicit provider failure;
- deleted-source provenance;
- viewer read/export-only behavior;
- outsider API/page non-disclosure;
- draft archive/restore;
- archived workspace read-only behavior;
- responsive mobile canvas;
- deletion, sign-out, and hydration monitoring.

The journey uses the explicitly enabled deterministic fixture provider. It proves the application contract, not external provider availability or model quality.

## P4 completion boundary

P4 is complete for its declared scope because:

- a completed answer can become durable reusable work;
- citations become inspectable provenance;
- accepted changes are explicit and versioned;
- history is immutable;
- exports are real and bounded;
- provider output remains a separate proposal until accepted;
- Stop, failure, discard, and stale-base behavior are durable;
- viewer and outsider restrictions hold;
- source and conversation deletion preserve honest snapshots;
- P4 data and browser gates passed with all inherited gates on the implementation branch.

The final documentation head must repeat the complete P0–P4 workflow matrix before PR `#6` leaves draft.

P4 completion is not production readiness. P5 owns deployment, live-provider validation, quotas, budgets, monitoring, backup/restore, security/privacy review, accessibility expansion, and provenance clearance.
