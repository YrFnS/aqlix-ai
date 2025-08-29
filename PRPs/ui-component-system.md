name: "UI Component System Setup for Iraqi AI Chat System"
description: |
  Complete implementation of foundational UI component system using existing 44 shadcn/ui components with Iraqi cultural enhancements, Tailwind CSS integration, and Bun workspace architecture.

---

## Goal
Establish a production-ready UI component system by migrating and enhancing 44 existing shadcn/ui components from `examples/dyad-extracted/` into a proper `packages/ui/` workspace with Iraqi cultural support, RTL layouts, and accessibility compliance.

## Why
- **Unify fragmented UI**: Replace scattered component implementations with single source of truth
- **Iraqi cultural compliance**: Integrate Arabic RTL support, Islamic UI principles, and cultural color schemes
- **Production readiness**: Battle-tested shadcn/ui components with proper workspace architecture
- **Developer experience**: Consistent design system with TypeScript support and proper tooling

## What
Create `packages/ui/` workspace containing:
- All 44 enhanced shadcn/ui components with Iraqi cultural integration
- Tailwind CSS configuration with Arabic fonts and RTL utilities
- Core utilities (cn function, direction hooks, cultural variants)
- Proper TypeScript configuration with path aliases
- Cultural compliance validation and testing infrastructure

### Success Criteria
- [x] All 44 components migrated from examples/dyad-extracted/ to packages/ui/
- [x] Bun workspace configuration with proper dependencies
- [x] Tailwind CSS with Arabic font support and RTL utilities
- [x] Components render correctly in both LTR and RTL modes
- [x] WCAG 2.1 AA accessibility compliance maintained
- [x] Cultural compliance tests pass (95%+ threshold)
- [x] TypeScript integration with zero errors
- [x] Build succeeds with proper exports

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://ui.shadcn.com/docs/installation/next
  why: Installation patterns and CLI usage reference
  
- url: https://www.radix-ui.com/primitives
  why: Accessibility foundation for all components
  
- url: https://tailwindcss.com/docs/utility-first
  why: Utility patterns for RTL and cultural styling

- url: https://cva.style/docs  
  why: Class Variance Authority for component variants

- url: https://react.dev/learn/accessibility
  why: Accessibility best practices for Arabic interfaces

- file: examples/dyad-extracted/components.json
  why: Target shadcn/ui configuration structure

- file: examples/dyad-extracted/IRAQI_ENHANCEMENT_STRATEGY.md
  why: Complete enhancement patterns and implementation approach

- file: examples/dyad-extracted/COMPONENT_INVENTORY.md  
  why: All 44 components to migrate with enhancement requirements

- file: examples/arabic-rtl-integration/package.json
  why: RTL integration patterns and cultural validation thresholds

- docfile: CLAUDE.md
  why: Iraqi AI system requirements and agent delegation rules
```

### Current Codebase Tree
```bash
aqlix-ai/
├── examples/
│   ├── dyad-extracted/           # 44 shadcn/ui components (SOURCE)
│   │   ├── components.json       # Target configuration
│   │   ├── IRAQI_ENHANCEMENT_STRATEGY.md
│   │   ├── COMPONENT_INVENTORY.md
│   │   └── components/ui/        # All 44 .tsx components
│   └── arabic-rtl-integration/   # RTL patterns reference
├── packages/                     # Workspace packages (TARGET)
└── CLAUDE.md                     # Iraqi AI system rules
```

### Desired Codebase Tree
```bash
packages/
└── ui/                           # NEW workspace package
    ├── package.json              # Bun workspace config
    ├── tailwind.config.ts        # Tailwind with Arabic/RTL support
    ├── src/
    │   ├── index.ts              # Barrel exports
    │   ├── styles/
    │   │   └── globals.css       # Tailwind imports + Arabic fonts
    │   ├── lib/
    │   │   ├── utils.ts          # cn function + Iraqi utilities
    │   │   └── cultural.ts       # Cultural variants and direction hooks
    │   ├── hooks/
    │   │   ├── use-direction.ts  # RTL/LTR direction management
    │   │   └── use-iraqi-locale.ts # Iraqi localization hook
    │   └── components/
    │       └── ui/               # All 44 enhanced components
    │           ├── button.tsx    # Template with Iraqi enhancements
    │           ├── input.tsx     # Form template
    │           ├── card.tsx      # Layout template
    │           └── ...           # 41 other components
    └── tsconfig.json             # TypeScript config
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Bun workspace requires exact syntax
"dependencies": {
  "@iraqi-ai/ui": "workspace:*"  // Not "workspace:" alone
}

// GOTCHA: CVA (Class Variance Authority) version compatibility
// Must use compatible version with existing dyad components
"class-variance-authority": "^0.7.0"

// CRITICAL: Tailwind CSS v4 compatibility
// New @apply syntax may conflict with existing components
// Test all components after Tailwind config changes

// GOTCHA: Arabic font loading strategy
// font-arabic class must not override existing font-* classes
// Use CSS cascade properly: .font-arabic { font-family: "Noto Sans Arabic", system-ui; }

// CRITICAL: RTL direction conflicts
// Direction utilities must use :where() specificity to avoid conflicts
// Example: :where([dir="rtl"]) .rtl\:text-right { text-align: right; }
```

## Implementation Blueprint

### Data Models and Structure
Core cultural enhancement utilities and type definitions:
```typescript
// src/lib/cultural.ts
export type Direction = 'ltr' | 'rtl';
export type CulturalVariant = 'standard' | 'iraqi';

export interface IraqiComponentProps {
  cultural?: CulturalVariant;
  dir?: Direction;
}

// src/hooks/use-direction.ts  
export function useDirection(explicitDir?: Direction): Direction {
  // Auto-detect or use explicit direction
  // Priority: explicit > context > locale detection
}
```

### List of Tasks (Execution Order)

```yaml
Task 1 - Workspace Foundation:
CREATE packages/ui/package.json:
  - MIRROR pattern from: examples/arabic-rtl-integration/package.json
  - MODIFY for UI workspace dependencies
  - INCLUDE: workspace protocol, proper Bun scripts
  - ADD: shadcn/ui peer dependencies (React, Radix UI)

CREATE packages/ui/tsconfig.json:
  - PATTERN: Standard workspace TypeScript config
  - CONFIGURE: Path aliases (@/components, @/lib, @/hooks)
  - EXTEND: Root tsconfig with UI-specific overrides

Task 2 - Tailwind & Styling Foundation:
CREATE packages/ui/tailwind.config.ts:
  - MIRROR: examples/dyad-extracted/components.json structure
  - ADD: Arabic font family configuration
  - INCLUDE: RTL utilities and cultural color tokens
  - CONFIGURE: Content paths for component scanning

CREATE packages/ui/src/styles/globals.css:
  - PATTERN: Standard Tailwind imports (@tailwind base/components/utilities)
  - ADD: Arabic font loading (@import url for Noto Sans Arabic)
  - INCLUDE: RTL utility classes and cultural CSS variables

Task 3 - Core Utilities:
CREATE packages/ui/src/lib/utils.ts:
  - COPY: Standard cn function from dyad-extracted components
  - ENHANCE: Add cultural utility functions
  - PRESERVE: Existing clsx/tailwind-merge functionality

CREATE packages/ui/src/lib/cultural.ts:
  - IMPLEMENT: Cultural variant system (as shown in IRAQI_ENHANCEMENT_STRATEGY.md)
  - ADD: Direction detection utilities
  - CREATE: Iraqi color scheme tokens

CREATE packages/ui/src/hooks/use-direction.ts:
  - IMPLEMENT: RTL/LTR direction management hook
  - PATTERN: React context + localStorage persistence
  - INTEGRATE: With existing Arabic language detection

Task 4 - Component Migration (Template Components):
COPY examples/dyad-extracted/components/ui/button.tsx:
  - TARGET: packages/ui/src/components/ui/button.tsx
  - ENHANCE: Apply Iraqi enhancement template (see IRAQI_ENHANCEMENT_STRATEGY.md)
  - ADD: Cultural variants, RTL support, Arabic typography
  - PRESERVE: Existing functionality and API

COPY examples/dyad-extracted/components/ui/input.tsx:
  - APPLY: Same enhancement pattern as button
  - FOCUS: RTL text input, Arabic placeholder support
  - TEST: Form component template validation

COPY examples/dyad-extracted/components/ui/card.tsx:
  - APPLY: Layout component enhancement pattern
  - VALIDATE: RTL layout positioning

Task 5 - Mass Component Migration:
COPY remaining 41 components from examples/dyad-extracted/components/ui/:
  - BATCH: Copy all .tsx files to packages/ui/src/components/ui/
  - APPLY: Iraqi enhancement pattern systematically
  - MAINTAIN: Original component APIs and functionality
  - UPDATE: Import paths to use new utilities

Task 6 - Export Configuration:
CREATE packages/ui/src/components/ui/index.ts:
  - EXPORT: All 44 components with consistent naming
  - PATTERN: Named exports for tree-shaking

CREATE packages/ui/src/index.ts:
  - BARREL: Export components, hooks, and utilities
  - ORGANIZE: Logical groupings for developer experience
```

### Per Task Pseudocode

```typescript
// Task 2 - Tailwind Configuration
// packages/ui/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Noto Sans Arabic", "system-ui", "sans-serif"],
      },
      colors: {
        // Iraqi cultural colors
        iraqi: {
          green: "#0D8A4B",
          gold: "#FFD700",
        },
      },
    },
  },
  plugins: [
    // RTL support plugin
    require('@tailwindcss/typography'),
  ],
};

// Task 3 - Cultural Enhancement Pattern  
// Apply to ALL components following this template:
const ButtonVariants = cva(
  // Base classes with RTL support
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: { /* existing variants */ },
      cultural: {
        standard: "",
        iraqi: "font-arabic rtl:flex-row-reverse",
      },
    },
    defaultVariants: {
      cultural: "iraqi", // Default to Iraqi styling
    },
  }
);

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
          VariantProps<typeof ButtonVariants>,
          IraqiComponentProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ cultural = "iraqi", dir, className, ...props }, ref) => {
    const direction = useDirection(dir);
    
    return (
      <button
        className={cn(ButtonVariants({ cultural }), className)}
        dir={direction}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Integration Points
```yaml
WORKSPACE:
  - add to: root package.json workspaces array
  - pattern: "packages/*"
  
DEPENDENCIES:
  - consuming apps import: "@iraqi-ai/ui"
  - workspace protocol: "workspace:*"
  
TYPESCRIPT:
  - path aliases: "@/components" → "packages/ui/src/components"
  - extend: root tsconfig with UI-specific paths

BUILD:
  - bun build: packages/ui/dist/
  - exports: ESM modules with TypeScript declarations
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run from packages/ui/
bun run typecheck       # TypeScript validation - MUST pass
bun run lint           # ESLint validation - fix all errors

# Expected: Zero TypeScript errors, zero linting errors
# If errors: Read carefully, fix systematically, re-run
```

### Level 2: Component Testing  
```bash
# Test component rendering and functionality
bun test               # Unit tests for all components

# Cultural compliance testing
bun run test:cultural  # Iraqi cultural validation (95%+ threshold)
bun run test:arabic    # Arabic RTL rendering tests

# Expected: All tests pass with cultural compliance metrics
# If failing: Check RTL layouts, Arabic fonts, cultural colors
```

### Level 3: Integration Testing
```bash
# Build validation
bun run build         # Must produce clean dist/ output

# Import validation - create test file:
echo 'import { Button, Input, Card } from "@iraqi-ai/ui"' > test-import.ts
bun run typecheck test-import.ts  # Must resolve without errors

# Expected: Clean build, proper exports, TypeScript resolution
```

### Level 4: Visual Validation
```bash
# Start development environment  
bun run dev

# Manual validation checklist:
# ✅ Components render in both LTR and RTL modes
# ✅ Arabic text displays with font-arabic styling
# ✅ Cultural colors (Iraqi green/gold) applied correctly
# ✅ No layout breaks or visual regressions
# ✅ Accessibility features (keyboard nav, screen readers) work
```

## Final Validation Checklist
- [ ] All 44 components migrated: `ls packages/ui/src/components/ui/*.tsx | wc -l` (should be 44)
- [ ] TypeScript compiles cleanly: `bun run typecheck`
- [ ] All tests pass: `bun test`
- [ ] Cultural compliance achieved: `bun run test:cultural` (≥95%)
- [ ] Arabic RTL support validated: `bun run test:arabic` (≥99% accuracy)
- [ ] Build produces proper exports: `bun run build && ls packages/ui/dist/`
- [ ] Components importable in consuming apps: Test import resolution
- [ ] WCAG 2.1 AA compliance maintained: Accessibility audit
- [ ] No visual regressions: Manual testing in LTR/RTL modes

---

## Anti-Patterns to Avoid
- ❌ Don't modify component APIs during migration - preserve existing interfaces
- ❌ Don't skip cultural enhancement - all components need Iraqi integration
- ❌ Don't ignore TypeScript errors - fix systematically
- ❌ Don't break accessibility - maintain WCAG compliance throughout
- ❌ Don't hardcode cultural values - use configurable tokens
- ❌ Don't skip validation steps - each level must pass before proceeding

**PRP Confidence Score: 8/10** - High likelihood of one-pass success due to comprehensive existing component library, clear enhancement patterns, and systematic validation approach.