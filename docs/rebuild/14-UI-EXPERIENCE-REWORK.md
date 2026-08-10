# UI Experience Rework

**Branch:** `agent/ui-experience-rework`  
**Base:** `main` at `a19f75a43d9f37e6558a964b0dd5b3d72c729876`  
**Status:** UI P0 in progress

This work improves the interface without changing Tuppra's authenticated data, authorization, provider, source, citation, draft, or operational contracts.

## Direction

Tuppra should feel like **living paper with intelligent ink**: calm, precise, bilingual, and focused on the active work rather than implementation phases or dashboard decoration.

The reference products are used for principles, not copied components:

- strong component-level craft;
- motion that explains state and hierarchy;
- polished transitions with restrained visual noise;
- AI activity indicators reserved for real processing states.

## UI P0 — Visual and motion foundation

### Implemented in the first slice

- one authoritative light and dark semantic token system in `globals.css`;
- canvas, surface, ink, line, brand, radius, elevation, and motion variables;
- removal of duplicate colour ownership and active `rebuild.css` imports;
- explicit Inter and Arabic font variables with natural glyph fallback;
- consistent typography on both the root layout and standalone not-found route;
- a global `MotionConfig` boundary that respects reduced-motion preferences;
- reusable page reveal, stagger, and interactive motion primitives;
- shared `PageShell`, `PageHeader`, `PageSection`, and `Surface` primitives;
- the authenticated application frame wired to the new canvas and page-reveal boundary;
- a representative root loading state built from the new primitives;
- a token-driven shared button with no hard-coded focus colour;
- static regression tests for token ownership, typography, reduced motion, primitives, and shared controls.

### Remaining before UI P0 is complete

- migrate the existing animation dependency and imports from the legacy `framer-motion` package name to the current `motion/react` entry point with a regenerated frozen Bun lockfile;
- run the full Bun lint, focused typecheck, rebuild tests, and production build on the exact branch head;
- perform browser review for light, dark, RTL, LTR, mixed text, keyboard focus, mobile reflow, and reduced motion;
- apply the new primitives to a small representative group of existing product surfaces before beginning the marketing and authentication redesign.

## Guardrails

- Motion communicates hierarchy, navigation, progress, and state change; it is not continuous background decoration.
- Reduced-motion users receive stable layouts without transform-based entrances or hover movement.
- Arabic remains the default document direction, while user content continues to use automatic direction where required.
- No P1–P5 product capability is renamed, removed, or represented as more complete than its existing evidence.
- Broad page redesign starts only after this foundation is validated.
