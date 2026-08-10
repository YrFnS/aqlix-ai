# UI Experience Rework

**Branch:** `agent/ui-experience-rework`  
**Base:** `main` at `a19f75a43d9f37e6558a964b0dd5b3d72c729876`  
**Draft pull request:** `#10`  
**Status:** UI P0 engineering and UI P1–P5 source implementation complete; browser review waived

This branch improves Tuppra's interface without changing its authenticated data, authorization, provider, source, citation, draft, or operational contracts.

## Direction

Tuppra should feel like **living paper with intelligent ink**: calm, precise, bilingual, and focused on active work rather than implementation phases or dashboard decoration.

The supplied references informed principles rather than copied components:

- strong component-level craft;
- motion that explains hierarchy, navigation, and state;
- restrained transitions instead of continuous decoration;
- AI activity indicators reserved for meaningful processing;
- contextual controls that do not compete with the primary work surface.

## Browser-review decision

On **August 10, 2026**, the product owner explicitly chose to skip the browser-review gate and continue source implementation.

This remains a waiver, not evidence that the following checks passed:

- light and dark visual review;
- RTL, LTR, and mixed-direction visual review;
- keyboard focus-order review in a real browser;
- mobile and tablet reflow review on physical or emulated devices;
- reduced-motion browser review;
- animation and streaming performance review under representative device conditions.

The residual visual risk remains open and must be revisited before the interface is represented as release-ready.

## UI P0 — Visual and motion foundation

### Implemented

- consolidated competing colour layers into one authoritative light and dark semantic token system;
- introduced canvas, surface, ink, line, brand, radius, elevation, focus, and motion variables;
- removed active ownership from the retired `rebuild.css` layer;
- added explicit Inter and Arabic font variables with natural glyph fallback;
- added a global `MotionConfig` boundary that respects user reduced-motion preferences;
- introduced reusable page reveal, stagger, interaction, page-shell, header, section, and surface primitives;
- migrated active animation dependencies and imports to exact `motion` `12.43.0` through `motion/react`;
- regenerated `bun.lock` using repository-pinned Bun `1.3.14`;
- migrated representative workspace list and overview surfaces to the shared system;
- removed user-facing implementation-phase labels from workspace surfaces;
- added permanent regression coverage for token ownership, typography, Motion migration, lockfile state, reduced motion, primitives, and shared controls.

### Completion boundary

UI P0 engineering is complete. Browser-facing review remains waived and unverified.

## UI P1 — Marketing and authentication

### Implemented

- replaced rebuild-oriented public language with a product-focused homepage;
- introduced a finite, user-controlled Ask → Ground → Draft preview;
- limited source examples to implemented TXT and Markdown capabilities;
- added a reusable Tuppra brand mark;
- rebuilt marketing navigation, mobile sheet, footer, workflow, capability, principle, and final-action sections;
- introduced one shared authentication frame and semantic status notices;
- redesigned sign-in and registration while preserving Supabase configuration gates, safe return paths, and server actions;
- removed implementation-phase labels from public and account surfaces;
- added focused safeguards for supported claims, motion preferences, navigation accessibility, and the shared account shell.

### Completion boundary

UI P1 source implementation is complete. The waived browser-review items remain residual risk.

## UI P2 — Authenticated product shell

### Implemented

- replaced the fixed documentation-like sidebar and separate page wrapper with one adaptive authenticated shell;
- added a collapsible desktop workspace rail with locally persisted preference;
- kept global destinations limited to implemented workspaces, AI settings, and documentation routes;
- added contextual workspace navigation for overview, conversations, sources, drafts, and settings;
- added active-route semantics through `aria-current="page"` and token-driven states;
- introduced a sticky contextual command bar with compact breadcrumbs;
- added a searchable `Command/Ctrl + K` route palette for global and current-workspace destinations;
- added a compact account menu with account identity, AI settings, documentation, and sign-out;
- replaced the old mobile overlay with a Motion-powered modal sheet;
- added Escape handling, route-change cleanup, click-away behavior, and scroll locking;
- moved authenticated route transitions into the shell with pathname keys and reduced-motion fallbacks;
- removed release-phase explanations and implementation-status copy from authenticated navigation.

### Validation findings corrected

- an unused icon import rejected by TypeScript;
- a reduced-motion assertion coupled to source formatting rather than behavior;
- a public-claims safeguard that misread CSS `calc(100%...)` syntax as a marketing metric.

### Completion boundary

UI P2 source implementation is complete. The waived browser-review items remain residual risk.

## UI P3 — Workspace and conversation experience

### Conversation discovery

- rebuilt active and archived conversation lists with shared page and surface primitives;
- made each conversation one complete keyboard-focusable item;
- surfaced message count and last activity without exposing implementation phases;
- retained real create, archive, restore, and persistence boundaries without sample conversations or artificial messages.

### Focused conversation workspace

- replaced the long detail page with a bounded workspace where the message canvas remains dominant;
- separated conversation history, the active conversation, and contextual secondary controls;
- added responsive history and inspector sheets with dialog semantics, Escape handling, route cleanup, and scroll locking;
- added searchable workspace-scoped conversation switching with active-route state, activity timestamps, archive access, and a direct create path;
- moved title editing, archive or restore, deletion, draft conversion, access metadata, and trust notes into the inspector;
- kept destructive actions inside a collapsed disclosure.

### Messages, composer, and generation feedback

- made assistant responses quieter and document-like while keeping user messages distinct;
- collapsed provider, model, token, latency, grounding, and generation status behind an inspectable details disclosure;
- replaced the generic spinner with reduced-motion-aware working, searching, composing, and shaping activity orbs;
- added an auto-sizing composer with a controlled height cap, IME-safe Enter handling, Shift+Enter, character count, source grounding, and compact send or stop controls;
- added near-bottom tracking and a return-to-latest control so streaming does not pull users away from older messages;
- preserved streamed deltas, retries, cancellation, partial persistence, server-owned history, and refresh behavior.

### Citation inspection and draft conversion

- kept citations derived only from persisted `message.citations` records;
- added inline citation inspection using the existing authorized document-detail API and `documentDetailSchema` validation;
- rendered the exact cited passage as safe text while retaining the full document route and deleted-source snapshot behavior;
- did not add an unrestricted source endpoint or weaken storage authorization;
- converted draft creation into a compact contextual control while preserving deterministic scaffolds, origin snapshots, citation copying, existing kinds, and API contracts.

### Validation evidence

The P3 implementation passed all normal repository safeguards, including **139 web rebuild tests across 22 files**, the optimized Next.js build, PR scope validation, Arabic and RTL checks, accessibility checks, and claims safeguards.

The first validation pass found one stale test coupled to the old oversized source-toggle wording. It was updated to protect the new explicit grounding control and persisted-citation inspector.

### Completion boundary

UI P3 source implementation is complete. The waived browser-review items remain residual risk.

## UI P4 — Sources, drafts, and AI settings

### Source library

- rebuilt the workspace source route as a searchable document library using shared page, section, surface, stagger, focus, and elevation primitives;
- added document metrics for total files, search-ready files, extracted passages, and failed processing states;
- made each document one complete keyboard-focusable card with status, size, passage count, upload time, and a direct document route;
- added server-backed passage search with exact result links into the source document and persisted source identifier;
- retained explicit product limits: TXT and Markdown, UTF-8, private bucket, RLS, 2 MiB, no PDF, and no OCR claim;
- kept document search scoped to the authorized workspace and preserved fail-closed behavior when no relevant passage exists.

### Upload and document passage workspace

- replaced the plain file input with a focused drag-and-drop upload surface while preserving local and server validation;
- used the working activity state only while the file is actually being validated, uploaded, stored, and extracted;
- added a bounded three-part document workspace: passage navigation, safe reading canvas, and contextual metadata inspector;
- added passage filtering, URL-hash selection, exact passage anchors, previous and next navigation, passage copy, and stable-link copy;
- added responsive passage and metadata sheets with dialog semantics, Escape handling, and scroll locking;
- moved processing attempts, SHA-256, processor identity, private-download access, and coordinated deletion into the metadata inspector;
- preserved safe text rendering through `whitespace-pre-wrap` without raw HTML injection;
- preserved the existing signed-in RLS client, private Storage bucket, deterministic processor, processing RPCs, download route, and deletion ordering.

### Draft libraries

- rebuilt active and archived draft routes with shared page and surface primitives;
- added title and content search to both active work and archive views;
- surfaced active draft count, immutable version count, and provenance count;
- made each draft one complete keyboard-focusable card with kind, status, preview, version count, provenance count, and last save time;
- removed implementation-phase labels from draft-facing surfaces;
- kept draft creation tied to completed conversation answers and the existing deterministic scaffold API.

### Draft workbench

- replaced the stacked draft page with a bounded workbench containing an immutable version timeline, accepted editor, proposal review, and contextual inspector;
- added responsive version and inspector sheets with dialog semantics, Escape handling, route cleanup, and scroll locking;
- added explicit saved, unsaved, saving, and failed states plus `Ctrl/Cmd+S` support;
- preserved optimistic version identity and the `save_draft_version` RPC boundary;
- kept version snapshots read-only and made restore create a new version rather than rewriting history;
- redesigned the immutable version page around a clear snapshot canvas and metadata;
- kept provenance links attached to persisted source snapshots and retained deleted-source behavior;
- kept TXT, Markdown, and standalone safe HTML exports while explicitly leaving PDF and DOCX disabled;
- moved archive, restore, and delete operations into a contextual lifecycle section;
- retained before-unload protection for unsaved editor changes.

### Proposal review

- separated accepted content from AI-proposed content into explicit editor and proposal modes;
- kept the provider request based on the last accepted persisted version rather than unsaved browser state;
- added action templates, bounded instructions, shaping activity feedback, stream cancellation, and partial proposal persistence;
- displayed accepted and proposed content side by side on wide screens;
- kept model and generation telemetry behind a secondary disclosure;
- preserved normalized proposal stream events and the server-only provider boundary;
- kept apply and discard explicit: apply creates a new immutable version through the existing RPC, while discard leaves accepted work unchanged.

### AI connection and model selection

- rebuilt AI settings as one clear BYOK connection and live model-selection flow;
- retained password-style one-time key entry, server validation, Vault storage, masked key metadata, and explicit disconnect;
- added a live model catalog with search, sorting, free-only filtering, current-model state, pricing, context length, and model-ID copy;
- kept advanced exact model-ID selection available without making it the primary path;
- retained live user-filtered OpenRouter catalog requests and exact-model validation before persistence;
- did not add local or session storage for credentials or model state;
- retained the absence of a platform-owned OpenRouter key or fixed model ID.

### Validation evidence

The recorded P4 implementation passed every normal repository safeguard, including **44 shared contract tests across 8 files**, **145 active web rebuild tests across 23 files**, the optimized Next.js build, PR scope validation, Arabic and RTL checks, accessibility checks, and claims safeguards.

Validation and review caught and corrected:

- a client component prop named `document` shadowing the browser `document` object during scroll locking;
- an unused draft icon import rejected by exact TypeScript validation;
- an existing source-boundary safeguard that needed to follow the new safe-rendering component boundary.

### Completion boundary

UI P4 source implementation is complete. The waived browser-review items remain residual risk.

## UI P5 — Final quality hardening

### Keyboard and assistive-technology runtime

- added one global skip link that focuses and scrolls the real `main` element instead of relying on inconsistent route IDs;
- added polite route announcements derived from the active document title after pathname changes;
- added a global focus boundary for visible modal dialogs with Tab and Shift+Tab containment;
- restores focus to the launching control when the final modal closes;
- preserves each component's existing Escape handling, route cleanup, and scroll locking rather than creating a second lifecycle authority;
- retains browser zoom up to the existing supported maximum and adds `viewport-fit=cover` for safe-area-aware layouts.

### Mobile, contrast, and reduced-transparency resilience

- added dynamic-viewport-height support for modern mobile browsers while retaining the existing fallback;
- added safe-area utility rules for inset-aware inline and block padding;
- preserved 100% text-size adjustment and added touch-action handling for links and buttons;
- added focus scroll margins so keyboard targets are less likely to remain hidden behind sticky application chrome;
- added `prefers-reduced-transparency` fallbacks that remove backdrop blur and restore opaque semantic surfaces;
- added stronger semantic tokens and focus outlines for `prefers-contrast: more`;
- added forced-colour fallbacks for Canvas, CanvasText, Highlight focus, active navigation, shadows, blur, and decorative glow suppression.

### Loading, failure, and offline states

- introduced shared responsive `RouteLoadingState` and `RouteFailureState` primitives using the same page, surface, focus, radius, and elevation system as normal product routes;
- migrated the root loading boundary and conversation, source, and draft library loading routes to one responsive skeleton language;
- replaced legacy root and global error screens with honest Arabic-first recovery surfaces;
- replaced conversation, source, and draft route errors that still exposed implementation-phase labels;
- retained development-only error detail while production surfaces expose only a safe digest reference;
- preserved explicit retry and return paths without presenting substitute data or implying that failed work was saved;
- redesigned the offline notice as an inset-aware semantic surface and explicitly warns users not to assume a new save or generation completed while disconnected.

### Regression coverage

Focused P5 safeguards verify:

- installation of the global skip link, route announcer, modal focus containment, and focus restoration;
- mobile viewport, safe-area, reduced-transparency, higher-contrast, and forced-colour fallbacks;
- removal of legacy blue, red, grey, English-only, and implementation-phase failure surfaces;
- use of one responsive loading boundary across the primary work libraries;
- semantic, safe-area-aware offline messaging;
- continued ownership of page and surface primitives through the shared loading and failure boundaries.

### Validation findings corrected

The P5 validation pass caught and corrected:

- two stale source assertions that still expected root loading markup and one exact offline phrase inside individual route files instead of following the new shared boundary;
- strict TypeScript uncertainty around the first and last focusable elements after an empty-list guard;
- a separate stylesheet using Tailwind `@layer` without owning the matching Tailwind directives; the fallback rules now compile as ordinary global CSS.

### Exact-head evidence before this status record

The P5 implementation head `db38e3aa174506087431f929266859f21ab44f39` passed:

1. frozen Bun dependency installation;
2. all shared-package builds;
3. ESLint and focused strict TypeScript validation;
4. **44 shared contract tests across 8 files** with 93 assertions;
5. **150 active web rebuild tests across 24 files** with 1,053 assertions;
6. the optimized Next.js web build and build artifact upload;
7. PR title and scope validation;
8. Arabic and RTL foundation checks;
9. accessibility foundation checks;
10. product language and public-claims safeguards;
11. Arabic text and bidirectional-input utility tests.

### Completion boundary

UI P5 source implementation and automated quality hardening are complete. All planned UI source phases P0–P5 are implemented on this branch.

The explicitly waived browser and physical-device review remains unverified. This document therefore does **not** claim final visual approval, public-release readiness, or production readiness.

## Remaining human gate

Before any release-readiness claim, the residual review should still cover:

- light and dark appearance in supported browsers;
- Arabic RTL, English LTR, and mixed-direction content;
- complete keyboard order and real focus behavior across menus, sheets, dialogs, editors, and destructive flows;
- mobile and tablet reflow across marketing, account, shell, conversation, source, draft, and settings surfaces;
- reduced-motion and reduced-transparency behavior;
- streaming, long-document, and animation performance on representative devices.

## Guardrails

- Motion communicates hierarchy, navigation, progress, and state change; it is not continuous background decoration.
- Reduced-motion users receive stable layouts without transform-based entrances or hover movement.
- Arabic remains the default document direction, while user content continues to use automatic direction where required.
- No P1–P5 product capability is renamed, removed, or represented as more complete than its existing evidence.
- Waived human review is documented as residual risk rather than silently counted as passed evidence.
