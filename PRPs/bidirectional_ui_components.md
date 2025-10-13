# Bidirectional UI Components - Direction-Aware Component System

## Purpose

Implement a comprehensive bidirectional UI component system that provides direction-aware components, mixed content support, and adaptive UI elements for seamless Arabic and English interfaces in the Iraqi AI Chat System.

## Core Principles

1. **Context is King**: Leverage existing RTL infrastructure and patterns
2. **Validation Loops**: Test with RTL and LTR layouts, mixed content scenarios
3. **Information Dense**: Use CSS logical properties and Radix DirectionProvider
4. **Progressive Success**: Start with base components, validate, then enhance
5. **Global rules**: Follow all rules in CLAUDE.md, especially Iraqi cultural compliance

---

## Goal

Build a complete bidirectional UI component library that:
- Wraps Radix UI components with direction awareness
- Provides reusable direction-aware primitives (Button, Card, Navigation, Form, etc.)
- Handles icon mirroring automatically
- Supports mixed Arabic-English content rendering
- Integrates seamlessly with existing DirectionProvider context
- Uses CSS logical properties for all directional styling
- Maintains WCAG 2.1 AA accessibility compliance

## Why

- **User Experience**: Iraqi users need seamless transitions between Arabic and English
- **Developer Efficiency**: Direction-aware components prevent directional bugs
- **Cultural Compliance**: Proper Arabic text rendering respects Iraqi cultural expectations
- **Maintainability**: Centralized bidirectional logic reduces code duplication
- **Scalability**: Foundation for all future UI components in the system

## What

### User-Visible Behavior
- Components automatically adapt to RTL/LTR based on content direction
- Icons mirror appropriately (arrows, navigation indicators)
- Mixed content (Arabic + English) renders with proper boundaries
- Form inputs align correctly for Arabic text
- Navigation elements flow naturally in both directions
- Animations and transitions respect text direction

### Technical Requirements
- TypeScript strict mode compliance
- React 19 + Next.js 15 compatibility
- Radix UI DirectionProvider integration
- CSS logical properties throughout
- Zero `any` types
- Tree-shakeable exports
- < 50KB bundle size for core components

### Success Criteria

- [ ] All components support RTL and LTR directions
- [ ] Icon mirroring works automatically for directional icons
- [ ] Mixed content components render correctly with proper text isolation
- [ ] Forms handle Arabic input with proper alignment
- [ ] Navigation components adapt to direction changes
- [ ] All components pass accessibility tests (WCAG 2.1 AA)
- [ ] Unit tests cover RTL, LTR, and mixed content scenarios
- [ ] E2E tests validate direction switching without page refresh
- [ ] Bundle size < 50KB for core component set

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Documentation
- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
  why: |
    CSS logical properties (margin-inline-start, padding-inline-end, inset-inline-start)
    are the foundation of bidirectional layouts. MDN updated July 14, 2025.
  critical: |
    Use inline-start/inline-end instead of left/right
    Use block-start/block-end instead of top/bottom
    Use logical properties for all directional styling

- url: https://www.radix-ui.com/primitives/docs/utilities/direction-provider
  why: |
    Radix UI provides DirectionProvider for automatic RTL support
    Essential for shadcn/ui component compatibility
  critical: |
    Wrap app with DirectionProvider
    Set dir prop on root element
    Use Radix primitives for automatic direction handling

- url: https://m2.material.io/design/usability/bidirectionality.html
  why: |
    Material Design bidirectionality guidelines for icon mirroring
    Comprehensive rules for what should and shouldn't mirror
  critical: |
    Only mirror directional icons (arrows, navigation)
    Don't mirror content icons (text, media, objects)
    Question marks mirror in Arabic/Farsi, not Hebrew

- url: https://github.com/shadcn-ui/ui/pull/1638
  why: |
    shadcn/ui RTL support PR showing logical properties pattern
    Reference for converting components to bidirectional
  critical: |
    Replace physical properties with logical properties
    Add rtl:space-x-reverse where needed
    Use Radix DirectionProvider

# MUST READ - Existing Codebase Files
- file: apps/web/src/lib/utils/rtl.ts
  why: |
    Core RTL utilities: isArabicText, detectIraqiDialect, formatMixedContent
    Direction detection and text analysis functions
  critical: |
    Use formatMixedContent for mixed Arabic-English rendering
    Use detectIraqiDialect for dialect-specific handling
    Use getDirectionClasses for direction-aware CSS

- file: apps/web/src/components/providers/DirectionProvider.tsx
  why: |
    Existing DirectionProvider with hooks and context
    Manages global RTL state and localStorage persistence
  critical: |
    Components must use useDirection() hook
    Use useDirectionClasses() for className generation
    Direction changes automatically update document.dir

- file: packages/types/src/rtl.ts
  why: |
    Type definitions for RTL system
    TextDirection, RTLConfig, DirectionContext interfaces
  critical: |
    Import types from @iraqi-ai/types
    Use TextDirection type for direction props
    Follow RTLConfig structure for configuration

- file: apps/web/src/styles/rtl.css
  why: |
    Existing RTL CSS utilities and patterns
    CSS custom properties for direction
  critical: |
    Extend existing CSS patterns
    Use CSS custom properties (--text-align-start, --inset-start)
    Follow .rtl-* naming convention for utility classes

- file: examples/lobe-chat-arabic-extracted/components/RTLProvider.tsx
  why: |
    Advanced RTL provider with cultural adaptation
    Shows pattern for CulturalDirection and MixedContent components
  critical: |
    Cultural adaptation settings pattern
    Mixed content segmentation approach
    HOC pattern (withRTL) for wrapping components

- file: examples/lobe-chat-desktop-enhanced/src/renderer/hooks/useRTLLayout.ts
  why: |
    Comprehensive RTL hook with layout helpers
    Shows direction-aware margin, padding, border helpers
  critical: |
    Direction-aware helper pattern (getMarginStart, getPaddingStart)
    Memoization with useMemo for performance
    CSS custom property integration

# Current Codebase Tree
- apps/web/src/
  - components/
    - providers/
      - DirectionProvider.tsx (existing)
    - ui/ (shadcn/ui components - to be enhanced)
  - lib/
    - utils/
      - rtl.ts (existing utilities)
  - styles/
    - rtl.css (existing RTL styles)

- packages/
  - types/src/
    - rtl.ts (existing types)
  - ui/src/
    - index.ts (empty - components will be added here)
    - lib/
      - utils.ts (cn utility exists)
```

### Desired Codebase Tree with New Files

```bash
packages/ui/src/
├── components/
│   ├── bidirectional/
│   │   ├── BiButton.tsx              # Direction-aware button with icon mirroring
│   │   ├── BiCard.tsx                # Direction-aware card with proper padding
│   │   ├── BiForm.tsx                # Direction-aware form with field alignment
│   │   ├── BiInput.tsx               # Direction-aware input with placeholder alignment
│   │   ├── BiNavigation.tsx          # Direction-aware navigation with menu flow
│   │   ├── BiGrid.tsx                # Direction-aware grid with proper flow
│   │   ├── BiList.tsx                # Direction-aware list with item alignment
│   │   ├── BiDialog.tsx              # Direction-aware dialog with positioning
│   │   ├── BiTooltip.tsx             # Direction-aware tooltip positioning
│   │   ├── BiDropdown.tsx            # Direction-aware dropdown positioning
│   │   ├── MixedContent.tsx          # Mixed Arabic-English content renderer
│   │   ├── DirectionalIcon.tsx       # Icon wrapper with automatic mirroring
│   │   └── index.ts                  # Export all bidirectional components
│   └── index.ts
├── hooks/
│   ├── useBidirectional.ts           # Hook for direction-aware logic
│   ├── useIconMirror.ts              # Hook for icon mirroring logic
│   └── index.ts
├── utils/
│   ├── bidirectional.ts              # Bidirectional utility functions
│   ├── icon-mirror.ts                # Icon mirroring configuration
│   └── index.ts
├── types/
│   ├── bidirectional.ts              # Bidirectional component types
│   └── index.ts
└── index.ts

apps/web/src/
├── components/
│   └── ui/
│       ├── button.tsx                 # MODIFY: Add bidirectional support
│       ├── card.tsx                   # MODIFY: Add bidirectional support
│       ├── input.tsx                  # MODIFY: Add bidirectional support
│       └── ... (other shadcn/ui components)
└── app/
    └── layout.tsx                     # MODIFY: Add Radix DirectionProvider
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Radix UI DirectionProvider Integration
// Radix DirectionProvider must wrap the entire app
// Set dir prop on root element to match DirectionProvider
// Example from shadcn/ui RTL PR:
import { DirectionProvider } from '@radix-ui/react-direction';

<DirectionProvider dir={direction}>
  <html dir={direction}>
    {children}
  </html>
</DirectionProvider>

// GOTCHA: CSS Logical Properties Browser Support
// CSS logical properties supported in all modern browsers (2025)
// Firefox supports them since 2018
// Safari supports them since 2019
// No fallbacks needed for our target browsers

// GOTCHA: Icon Mirroring Rules (Material Design)
// ✅ Mirror: Arrows (→, ←, ↑, ↓), Navigation (back, forward, drawer)
// ✅ Mirror: Directional indicators (chevrons, carets)
// ❌ Don't Mirror: Content icons (user, settings, search, bell)
// ❌ Don't Mirror: Media icons (play, pause, volume)
// ❌ Don't Mirror: Object icons (file, folder, document)
// Special: Question marks mirror in Arabic/Farsi, not Hebrew

// GOTCHA: Flexbox Direction
// Use flex-direction: row-reverse for RTL
// Tailwind classes: rtl:flex-row-reverse
// CSS logical properties don't affect flexbox direction

// GOTCHA: Grid Auto-Flow
// Use direction: rtl on grid container for RTL flow
// Grid respects direction property automatically
// No need for grid-auto-flow changes

// GOTCHA: Text Alignment
// Use text-align: start (not left)
// Use text-align: end (not right)
// Automatically adapts to direction

// GOTCHA: Absolute Positioning
// Use inset-inline-start instead of left
// Use inset-inline-end instead of right
// Use inset-block-start instead of top
// Use inset-block-end instead of bottom

// CRITICAL: Mixed Content Handling
// Use unicode-bidi: plaintext for mixed content
// Use <bdi> for isolated bidirectional content
// Don't use unicode-bidi: bidi-override (breaks natural flow)

// CRITICAL: Form Inputs
// Set dir attribute on input elements
// Set text-align based on content direction
// Placeholder text aligns with input text

// GOTCHA: Animation Direction
// Transforms need direction awareness
// translateX(100%) in RTL should move left
// Use directional classes for animations

// CRITICAL: Bun Runtime
// Use bun run for all commands (30x faster than npm)
// Bun native TypeScript support (no transpilation)
// Use absolute imports: @/ for src, @iraqi-ai/ for workspaces

// CRITICAL: Package Dependencies
// radix-ui: ^1.4.3 (already installed)
// tailwind-merge: ^3.3.1 (already installed)
// No additional packages needed

// CRITICAL: Testing Requirements
// Test ALL components in RTL and LTR modes
// Test mixed content scenarios
// Test direction switching without page refresh
// Test icon mirroring for directional icons
// Validate WCAG 2.1 AA accessibility
```

## Implementation Blueprint

### Data Models and Types

```typescript
// packages/ui/src/types/bidirectional.ts

import type { TextDirection } from "@iraqi-ai/types";

/**
 * Direction-aware component base props
 */
export interface BidirectionalProps {
  /** Force specific direction (overrides context) */
  direction?: TextDirection;

  /** Whether to mirror icons in RTL mode */
  mirrorIcons?: boolean;

  /** Additional direction-aware classes */
  directionClasses?: string;
}

/**
 * Icon mirroring configuration
 */
export interface IconMirrorConfig {
  /** Icon name or identifier */
  icon: string;

  /** Whether this icon should mirror in RTL */
  shouldMirror: boolean;

  /** Reason for mirroring decision */
  reason?: string;
}

/**
 * Mixed content segment
 */
export interface MixedContentSegment {
  /** Text content */
  content: string;

  /** Direction of this segment */
  direction: TextDirection;

  /** Start position in original text */
  start?: number;

  /** End position in original text */
  end?: number;
}

/**
 * Directional spacing configuration
 */
export interface DirectionalSpacing {
  /** Inline start (right in RTL, left in LTR) */
  inlineStart?: string | number;

  /** Inline end (left in RTL, right in LTR) */
  inlineEnd?: string | number;

  /** Block start (top) */
  blockStart?: string | number;

  /** Block end (bottom) */
  blockEnd?: string | number;
}

/**
 * Direction-aware layout classes
 */
export interface DirectionalClasses {
  container: string;
  content: string;
  icon: string;
  text: string;
}
```

### Task List (Implementation Order)

```yaml
Task 1: Setup Radix DirectionProvider Integration
  MODIFY apps/web/src/app/layout.tsx:
    - IMPORT DirectionProvider from '@radix-ui/react-direction'
    - WRAP existing DirectionProvider with Radix DirectionProvider
    - SET dir prop on <html> element from context
    - ENSURE direction syncs between React context and Radix

  CREATE apps/web/tests/unit/direction-provider-integration.test.tsx:
    - TEST Radix DirectionProvider wraps app correctly
    - TEST dir attribute updates on direction change
    - TEST context value matches Radix direction
    - VALIDATE no hydration mismatches

Task 2: Create Bidirectional Utility Functions
  CREATE packages/ui/src/utils/bidirectional.ts:
    - IMPLEMENT getDirectionalClasses(direction, baseClasses)
    - IMPLEMENT getLogicalSpacing(spacing)
    - IMPLEMENT normalizeDirection(direction, text)
    - IMPLEMENT getOppositeDirection(direction)
    - ADD JSDoc documentation with examples

  CREATE packages/ui/src/utils/icon-mirror.ts:
    - DEFINE iconMirrorConfig with Material Design rules
    - IMPLEMENT shouldMirrorIcon(iconName)
    - IMPLEMENT getMirroredIconName(iconName)
    - ADD comprehensive documentation

  CREATE packages/ui/tests/unit/bidirectional-utils.test.ts:
    - TEST getDirectionalClasses with RTL/LTR
    - TEST getLogicalSpacing conversion
    - TEST icon mirroring logic
    - VALIDATE edge cases

Task 3: Create Core Bidirectional Hooks
  CREATE packages/ui/src/hooks/useBidirectional.ts:
    - IMPLEMENT useBidirectional() hook
    - USE existing useDirection() hook
    - ADD direction-aware helpers (getInlineStart, getInlineEnd)
    - ADD layout class generators
    - MEMOIZE expensive computations
    - EXPORT TypeScript types

  CREATE packages/ui/src/hooks/useIconMirror.ts:
    - IMPLEMENT useIconMirror(iconName) hook
    - USE shouldMirrorIcon utility
    - RETURN mirrored state and transform CSS
    - MEMOIZE results

  CREATE packages/ui/tests/unit/bidirectional-hooks.test.ts:
    - TEST useBidirectional returns correct values
    - TEST useIconMirror mirroring logic
    - TEST memoization works correctly
    - VALIDATE hook error handling

Task 4: Implement BiButton Component
  CREATE packages/ui/src/components/bidirectional/BiButton.tsx:
    - IMPORT existing Button from shadcn/ui (if exists)
    - EXTEND with BidirectionalProps
    - USE useBidirectional hook
    - ADD icon mirroring logic
    - USE CSS logical properties (padding-inline-start)
    - SUPPORT icon position (leading/trailing)
    - HANDLE icon-only buttons
    - ADD comprehensive JSDoc

  CREATE packages/ui/tests/unit/BiButton.test.tsx:
    - TEST RTL rendering with icon
    - TEST LTR rendering with icon
    - TEST icon mirroring for directional icons
    - TEST no mirroring for content icons
    - VALIDATE accessibility

Task 5: Implement BiCard Component
  CREATE packages/ui/src/components/bidirectional/BiCard.tsx:
    - CREATE Card, CardHeader, CardContent, CardFooter
    - USE CSS logical properties for padding/margin
    - SUPPORT header alignment (start/end/center)
    - ADD direction-aware flex layouts
    - HANDLE mixed content in card body

  CREATE packages/ui/tests/unit/BiCard.test.tsx:
    - TEST RTL card layout
    - TEST LTR card layout
    - TEST header alignment
    - TEST mixed content rendering

Task 6: Implement Form Components
  CREATE packages/ui/src/components/bidirectional/BiInput.tsx:
    - USE CSS logical properties for padding
    - SET dir attribute based on content
    - ALIGN placeholder with input direction
    - SUPPORT leading/trailing icons
    - HANDLE mixed content detection

  CREATE packages/ui/src/components/bidirectional/BiForm.tsx:
    - CREATE form wrapper with direction awareness
    - ALIGN labels correctly (inline-start)
    - POSITION validation messages
    - SUPPORT field groups

  CREATE packages/ui/tests/unit/BiForm.test.tsx:
    - TEST Arabic input alignment
    - TEST English input alignment
    - TEST mixed content input
    - TEST label positioning
    - VALIDATE form submission

Task 7: Implement Navigation Components
  CREATE packages/ui/src/components/bidirectional/BiNavigation.tsx:
    - USE flex-row-reverse for RTL
    - MIRROR navigation icons
    - POSITION dropdowns correctly
    - HANDLE breadcrumbs with direction

  CREATE packages/ui/src/components/bidirectional/BiDropdown.tsx:
    - USE inset-inline-start for positioning
    - MIRROR dropdown arrow
    - ALIGN menu items
    - HANDLE nested dropdowns

  CREATE packages/ui/tests/unit/BiNavigation.test.tsx:
    - TEST RTL navigation flow
    - TEST LTR navigation flow
    - TEST icon mirroring
    - TEST dropdown positioning

Task 8: Implement Grid and List Components
  CREATE packages/ui/src/components/bidirectional/BiGrid.tsx:
    - SET direction: rtl on grid container for RTL
    - USE logical properties for gap
    - SUPPORT auto-flow direction

  CREATE packages/ui/src/components/bidirectional/BiList.tsx:
    - ALIGN list items (text-align: start)
    - POSITION list markers correctly
    - SUPPORT icon lists with mirroring

  CREATE packages/ui/tests/unit/BiGrid.test.tsx:
    - TEST grid flow in RTL
    - TEST grid flow in LTR
    - TEST responsive layouts

Task 9: Implement Dialog and Overlay Components
  CREATE packages/ui/src/components/bidirectional/BiDialog.tsx:
    - USE inset-inline-* for positioning
    - MIRROR close button position
    - ALIGN content correctly

  CREATE packages/ui/src/components/bidirectional/BiTooltip.tsx:
    - USE inset-inline-* for positioning
    - MIRROR tooltip arrow
    - HANDLE edge cases

  CREATE packages/ui/tests/unit/BiDialog.test.tsx:
    - TEST dialog positioning in RTL
    - TEST dialog positioning in LTR
    - TEST close button mirroring

Task 10: Implement Mixed Content Components
  CREATE packages/ui/src/components/bidirectional/MixedContent.tsx:
    - USE formatMixedContent utility
    - RENDER segments with proper isolation
    - USE unicode-bidi: plaintext
    - SUPPORT inline and block rendering

  CREATE packages/ui/src/components/bidirectional/DirectionalIcon.tsx:
    - WRAP icon with direction awareness
    - APPLY transform: scaleX(-1) for mirroring
    - USE useIconMirror hook
    - SUPPORT custom mirror rules

  CREATE packages/ui/tests/unit/MixedContent.test.tsx:
    - TEST Arabic + English rendering
    - TEST segment isolation
    - TEST bidirectional algorithm
    - VALIDATE visual output

Task 11: Create Component Index and Exports
  CREATE packages/ui/src/components/bidirectional/index.ts:
    - EXPORT all bidirectional components
    - EXPORT component types
    - ADD JSDoc for package

  MODIFY packages/ui/src/index.ts:
    - EXPORT * from './components/bidirectional'
    - EXPORT * from './hooks'
    - EXPORT * from './utils/bidirectional'

Task 12: Update Existing shadcn/ui Components
  MODIFY apps/web/src/components/ui/button.tsx:
    - ADD bidirectional support using BiButton patterns
    - PRESERVE existing API
    - ADD direction prop

  MODIFY apps/web/src/components/ui/card.tsx:
    - ADD bidirectional support using BiCard patterns
    - PRESERVE existing API

  MODIFY apps/web/src/components/ui/input.tsx:
    - ADD bidirectional support using BiInput patterns
    - PRESERVE existing API

Task 13: Create E2E Tests
  CREATE apps/web/tests/e2e/bidirectional-ui.spec.ts:
    - TEST direction switching without page refresh
    - TEST component adaptation to direction changes
    - TEST icon mirroring visual appearance
    - TEST mixed content rendering
    - TEST form input with Arabic text
    - VALIDATE accessibility with screen readers

Task 14: Create Documentation
  CREATE packages/ui/README.md:
    - DOCUMENT all bidirectional components
    - ADD usage examples for each component
    - ADD migration guide from non-bidirectional
    - DOCUMENT icon mirroring rules
    - ADD troubleshooting guide

  CREATE packages/ui/docs/BIDIRECTIONAL_GUIDE.md:
    - EXPLAIN bidirectional UI concepts
    - SHOW CSS logical properties usage
    - DOCUMENT best practices
    - ADD accessibility guidelines

Task 15: Performance Optimization
  MODIFY packages/ui/src/components/bidirectional/*.tsx:
    - ADD React.memo where appropriate
    - OPTIMIZE re-renders with useMemo
    - LAZY LOAD heavy components
    - VALIDATE bundle size < 50KB
```

### Pseudocode for Critical Components

```typescript
// Task 4: BiButton Component
// packages/ui/src/components/bidirectional/BiButton.tsx

import React from 'react';
import { useBidirectional } from '../../hooks/useBidirectional';
import { useIconMirror } from '../../hooks/useIconMirror';
import type { BidirectionalProps } from '../../types/bidirectional';

interface BiButtonProps extends BidirectionalProps {
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  iconName?: string; // For automatic mirroring
  children?: React.ReactNode;
  className?: string;
  // ... other button props
}

export const BiButton = React.memo(({
  icon,
  iconPosition = 'leading',
  iconName,
  direction: propDirection,
  mirrorIcons = true,
  children,
  className = '',
  ...props
}: BiButtonProps) => {
  // PATTERN: Use bidirectional hook for direction awareness
  const { direction, getInlineStart, getDirectionClasses } = useBidirectional(propDirection);

  // PATTERN: Use icon mirror hook if icon should be mirrored
  const { shouldMirror, mirrorTransform } = useIconMirror(iconName, mirrorIcons);

  // PATTERN: Generate direction-aware classes
  const directionClasses = getDirectionClasses('button', className);

  // PATTERN: Icon positioning based on direction and iconPosition
  const iconOrder = React.useMemo(() => {
    // trailing in LTR = inlineEnd, trailing in RTL = inlineStart (reversed)
    if (direction === 'rtl') {
      return iconPosition === 'leading' ? 'order-1' : 'order-0';
    }
    return iconPosition === 'leading' ? 'order-0' : 'order-1';
  }, [direction, iconPosition]);

  return (
    <button
      className={directionClasses}
      dir={direction}
      {...props}
    >
      {icon && (
        <span
          className={iconOrder}
          style={shouldMirror ? { transform: mirrorTransform } : undefined}
        >
          {icon}
        </span>
      )}
      <span className="button-content">
        {children}
      </span>
    </button>
  );
});

// CSS (using logical properties)
// .button {
//   padding-inline-start: 1rem;
//   padding-inline-end: 1rem;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem; /* gap is direction-aware */
// }

// Task 10: MixedContent Component
// packages/ui/src/components/bidirectional/MixedContent.tsx

import React from 'react';
import { formatMixedContent } from '@/lib/utils/rtl';
import type { DirectionalTextSegment } from '@iraqi-ai/types';

interface MixedContentProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MixedContent: React.FC<MixedContentProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  // PATTERN: Use existing formatMixedContent utility
  const segments: DirectionalTextSegment[] = React.useMemo(
    () => formatMixedContent(content),
    [content]
  );

  // CRITICAL: Use unicode-bidi: plaintext for natural bidirectional flow
  const ContainerTag = inline ? 'span' : 'div';

  return (
    <ContainerTag
      className={`mixed-content ${className}`}
      style={{ unicodeBidi: 'plaintext' }}
    >
      {segments.map((segment, index) => (
        <span
          key={index}
          dir={segment.direction}
          className={`segment-${segment.direction}`}
          style={{
            // CRITICAL: Use unicode-bidi: embed for segment isolation
            unicodeBidi: 'embed',
            textAlign: segment.direction === 'rtl' ? 'right' : 'left',
          }}
        >
          {segment.content}
        </span>
      ))}
    </ContainerTag>
  );
};

// Task 3: useBidirectional Hook
// packages/ui/src/hooks/useBidirectional.ts

import { useMemo } from 'react';
import { useDirection } from '@/components/providers/DirectionProvider';
import type { TextDirection } from '@iraqi-ai/types';

export const useBidirectional = (overrideDirection?: TextDirection) => {
  const { config, isRTL, getTextDirection } = useDirection();

  // PATTERN: Allow component-level direction override
  const direction = overrideDirection || config.direction;
  const isComponentRTL = direction === 'rtl';

  // PATTERN: Memoize direction-aware helpers for performance
  const helpers = useMemo(() => ({
    getInlineStart: (): string => isComponentRTL ? 'right' : 'left',
    getInlineEnd: (): string => isComponentRTL ? 'left' : 'right',
    getBlockStart: (): string => 'top',
    getBlockEnd: (): string => 'bottom',

    // PATTERN: Generate direction-aware Tailwind classes
    getDirectionClasses: (base: string, additional = ''): string => {
      const dirClass = isComponentRTL ? 'rtl' : 'ltr';
      const alignClass = isComponentRTL ? 'text-right' : 'text-left';
      return `${base} ${dirClass} ${alignClass} ${additional}`.trim();
    },

    // PATTERN: Get spacing classes with logical properties
    getSpacingClass: (type: 'margin' | 'padding', side: 'start' | 'end', value: string): string => {
      return `${type}-inline-${side}-${value}`;
    },
  }), [isComponentRTL]);

  return {
    direction,
    isRTL: isComponentRTL,
    isLTR: !isComponentRTL,
    ...helpers,
  };
};

// Task 3: useIconMirror Hook
// packages/ui/src/hooks/useIconMirror.ts

import { useMemo } from 'react';
import { useDirection } from '@/components/providers/DirectionProvider';
import { shouldMirrorIcon } from '../utils/icon-mirror';

export const useIconMirror = (iconName?: string, enabled = true) => {
  const { isRTL } = useDirection();

  // PATTERN: Memoize mirroring decision
  const mirrorState = useMemo(() => {
    if (!enabled || !iconName || !isRTL) {
      return {
        shouldMirror: false,
        mirrorTransform: 'none',
        mirrorClass: '',
      };
    }

    const shouldMirror = shouldMirrorIcon(iconName);

    return {
      shouldMirror,
      mirrorTransform: shouldMirror ? 'scaleX(-1)' : 'none',
      mirrorClass: shouldMirror ? 'icon-mirrored' : '',
    };
  }, [enabled, iconName, isRTL]);

  return mirrorState;
};
```

### Integration Points

```yaml
RADIX_UI:
  - wrap: "apps/web/src/app/layout.tsx with DirectionProvider"
  - sync: "DirectionProvider direction with Radix dir prop"
  - pattern: "<DirectionProvider dir={direction}><html dir={direction}>"

EXISTING_RTL_SYSTEM:
  - use: "apps/web/src/lib/utils/rtl.ts utilities"
  - extend: "apps/web/src/components/providers/DirectionProvider.tsx"
  - import: "packages/types/src/rtl.ts types"

SHADCN_UI:
  - enhance: "apps/web/src/components/ui/*.tsx with bidirectional support"
  - preserve: "Existing component APIs"
  - pattern: "Wrap with BiButton/BiCard patterns"

CSS_SYSTEM:
  - extend: "apps/web/src/styles/rtl.css"
  - add: "Logical property utilities"
  - pattern: "Use --inset-start, --inset-end custom properties"

TYPE_SYSTEM:
  - export: "packages/types/src/rtl.ts"
  - add: "packages/ui/src/types/bidirectional.ts"
  - pattern: "Import from @iraqi-ai/types"

TESTING_SYSTEM:
  - unit: "packages/ui/tests/unit/*.test.tsx"
  - e2e: "apps/web/tests/e2e/bidirectional-ui.spec.ts"
  - pattern: "Test RTL, LTR, and mixed content scenarios"
```

## Validation Loop

### Level 1: Type Checking & Linting

```bash
# Run from project root
bun run typecheck  # TypeScript type checking across all packages
bun run lint       # ESLint validation

# Expected: No errors
# If errors: READ the error message, understand root cause, fix code, re-run
```

### Level 2: Unit Tests

```bash
# Run unit tests for bidirectional components
bun test packages/ui/tests/unit/

# Expected: All tests pass
# Test coverage: RTL rendering, LTR rendering, icon mirroring, mixed content

# Specific test patterns:
# 1. RTL Button Test
bun test packages/ui/tests/unit/BiButton.test.tsx

# 2. Mixed Content Test
bun test packages/ui/tests/unit/MixedContent.test.tsx

# 3. Icon Mirroring Test
bun test packages/ui/tests/unit/useIconMirror.test.ts

# If failing: Read error, understand root cause, fix code, re-run
# NEVER mock to pass - ensure actual functionality works
```

### Level 3: E2E Tests

```bash
# Run E2E tests for bidirectional UI
bun run test:e2e

# Expected: All bidirectional UI scenarios pass
# 1. Direction switching without page refresh
# 2. Component adaptation to direction changes
# 3. Icon mirroring visual appearance
# 4. Mixed content rendering
# 5. Form input with Arabic text

# If failing: Check browser console for errors
# Check screenshots in test-results/
# Validate network requests for external resources
```

### Level 4: Visual Testing

```bash
# Start dev server
bun run dev

# Manual visual tests:
# 1. Navigate to /components/bidirectional
# 2. Toggle direction (RTL ↔ LTR)
# 3. Verify components adapt correctly
# 4. Check icon mirroring for arrows
# 5. Test mixed content rendering
# 6. Validate form input alignment

# Test URLs:
# - http://localhost:3000/test/bidirectional-button
# - http://localhost:3000/test/bidirectional-form
# - http://localhost:3000/test/mixed-content

# Expected: Seamless direction switching, proper alignment, correct icon mirroring
```

### Level 5: Accessibility Testing

```bash
# Run accessibility tests
bun run test:accessibility

# Manual accessibility tests:
# 1. Use screen reader (NVDA, JAWS, VoiceOver)
# 2. Test keyboard navigation
# 3. Verify focus indicators
# 4. Check ARIA attributes
# 5. Validate color contrast

# Expected: WCAG 2.1 AA compliance
# No accessibility violations in automated tests
```

### Level 6: Bundle Size Validation

```bash
# Build and analyze bundle
bun run build
bun run build:analyze

# Check bundle size for @iraqi-ai/ui
# Expected: < 50KB for core bidirectional components
# Tree-shaking should remove unused components

# If bundle too large:
# - Review imports (ensure tree-shakeable)
# - Check for duplicate dependencies
# - Optimize heavy components with lazy loading
```

## Final Validation Checklist

- [ ] All unit tests pass: `bun test packages/ui/tests/unit/`
- [ ] All E2E tests pass: `bun run test:e2e`
- [ ] No TypeScript errors: `bun run typecheck`
- [ ] No linting errors: `bun run lint`
- [ ] Bundle size < 50KB: `bun run build:analyze`
- [ ] Visual testing completed: All components render correctly in RTL/LTR
- [ ] Accessibility tests pass: WCAG 2.1 AA compliance
- [ ] Icon mirroring works: Directional icons mirror, content icons don't
- [ ] Mixed content renders correctly: Arabic and English isolated properly
- [ ] Direction switching works: No page refresh required
- [ ] Forms handle Arabic input: Proper alignment and placeholder
- [ ] Documentation updated: README and BIDIRECTIONAL_GUIDE complete
- [ ] Examples created: Storybook or demo pages for all components

---

## Anti-Patterns to Avoid

- ❌ Don't use left/right properties - use logical properties (inline-start/inline-end)
- ❌ Don't mirror all icons - only mirror directional icons (arrows, navigation)
- ❌ Don't use unicode-bidi: bidi-override - breaks natural bidirectional flow
- ❌ Don't hardcode direction - use context and hooks
- ❌ Don't forget to set dir attribute on elements with text content
- ❌ Don't use flex-direction without considering RTL (use flex-row-reverse)
- ❌ Don't ignore CSS custom properties - use existing --inset-start variables
- ❌ Don't create new patterns when existing ones work
- ❌ Don't skip accessibility testing - WCAG 2.1 AA is mandatory
- ❌ Don't forget to test mixed content scenarios
- ❌ Don't use transform: translateX without considering direction
- ❌ Don't forget to memoize expensive computations (useMemo, React.memo)

---

## Performance Considerations

```typescript
// CRITICAL: Memoize direction-aware computations
const directionClasses = useMemo(() =>
  getDirectionClasses(base, additional),
  [base, additional, direction]
);

// CRITICAL: Use React.memo for components that re-render frequently
export const BiButton = React.memo(BiButtonComponent);

// CRITICAL: Lazy load heavy components
const BiDialog = lazy(() => import('./components/bidirectional/BiDialog'));

// CRITICAL: Optimize icon mirroring with CSS transforms (GPU-accelerated)
// Use transform: scaleX(-1) instead of rotating or flipping
```

---

## Additional Resources

```yaml
# CSS Logical Properties
- MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- W3C Spec: https://drafts.csswg.org/css-logical-1/
- Browser Support: https://caniuse.com/css-logical-props

# Radix UI Direction
- Docs: https://www.radix-ui.com/primitives/docs/utilities/direction-provider
- GitHub: https://github.com/radix-ui/primitives

# Material Design Bidirectionality
- Guidelines: https://m2.material.io/design/usability/bidirectionality.html

# shadcn/ui RTL Support
- PR #1638: https://github.com/shadcn-ui/ui/pull/1638

# React Bidirectional Patterns
- Airbnb react-with-direction: https://github.com/airbnb/react-with-direction
- React Spectrum RTL: https://react-spectrum.adobe.com/blog/rtl-date-time.html

# Testing
- Playwright: https://playwright.dev/
- React Testing Library: https://testing-library.com/react
```

---

## Success Metrics

```yaml
# Code Quality
- TypeScript Strict: 100% (zero 'any' types)
- Test Coverage: >90% for bidirectional components
- Bundle Size: <50KB for core components
- Tree-Shaking: All components tree-shakeable

# User Experience
- Direction Switch: <100ms without page refresh
- Icon Mirroring: Automatic for all directional icons
- Mixed Content: Proper isolation and alignment
- Accessibility: WCAG 2.1 AA compliance

# Developer Experience
- Component API: Consistent and intuitive
- Documentation: Comprehensive with examples
- TypeScript: Full type safety
- Migration: Clear guide from non-bidirectional
```

---

**PRP Confidence Score: 9/10**

**Reasoning:**
- ✅ Comprehensive context with existing codebase patterns
- ✅ Detailed implementation plan with task breakdown
- ✅ Executable validation loops (typecheck, lint, test)
- ✅ Clear pseudocode with critical patterns
- ✅ External documentation with specific URLs
- ✅ Known gotchas and library quirks documented
- ✅ Performance optimizations included
- ✅ Accessibility requirements specified
- ⚠️ Minor risk: shadcn/ui RTL support is in progress (PR #1638), may need adjustments

**Expected Outcome:** One-pass implementation success with minor iterative refinements for visual polish and edge cases.
