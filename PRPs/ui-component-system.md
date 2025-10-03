name: "UI Component System PRP"
description: |
  Complete implementation of shadcn/ui component system with Tailwind CSS,
  Radix UI primitives, and design tokens for the Iraqi AI Chat System.

## Goal

Set up a foundational UI component system for the Iraqi AI Chat System that provides reusable, accessible components with consistent styling and modern design patterns. This system will serve as the foundation for all future UI development.

## Why

- **Design Consistency**: Unified design language across the application
- **Developer Experience**: Reusable components speed up development
- **Accessibility**: WCAG-compliant components built on Radix UI primitives
- **Maintainability**: Centralized styling with design tokens
- **Scalability**: Component library can grow with application needs

## What

Implement a complete UI component system including:
- shadcn/ui integration with Next.js 15 + React 19
- Core component library (Button, Card, Input, Dialog, etc.)
- Design token system with CSS variables
- Accessibility-first patterns
- TypeScript support with proper typing
- Component variant system using CVA

### Success Criteria

- [ ] shadcn/ui successfully configured and integrated
- [ ] At least 10 core components implemented and tested
- [ ] All components are accessible (keyboard navigation, ARIA attributes)
- [ ] Design tokens configured and consistently applied
- [ ] TypeScript types working without errors
- [ ] All lint and type checks pass
- [ ] Components render correctly in both light and dark mode

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

- url: https://ui.shadcn.com/docs/installation/next
  why: Official Next.js installation guide with specific setup steps

- url: https://ui.shadcn.com/docs/components-json
  why: Configuration file structure and options

- url: https://ui.shadcn.com/docs/theming
  why: Design tokens and CSS variables setup

- url: https://cva.style/docs/getting-started/variants
  why: Component variant patterns using CVA

- url: https://www.radix-ui.com/primitives
  why: Understanding Radix UI primitives for complex components

- url: https://ui.shadcn.com/docs/react-19
  why: React 19 compatibility notes and considerations

- file: examples/dyad-extracted/components/ui/button.tsx
  why: Reference implementation of Button with CVA variants

- file: examples/dyad-extracted/components/ui/card.tsx
  why: Reference implementation of Card with composition pattern

- file: examples/dyad-extracted/components/ui/dialog.tsx
  why: Reference implementation using Radix UI primitives

- file: examples/dyad-extracted/lib/utils.ts
  why: cn() utility function for className merging
```

### Current Codebase Structure

```bash
apps/web/
├── src/
│   ├── app/                    # Next.js 15 app directory
│   │   ├── globals.css        # Tailwind + CSS variables
│   │   └── layout.tsx
│   ├── lib/                   # Utility functions
│   │   └── supabase/         # (existing)
│   └── types/                 # TypeScript types
├── tailwind.config.ts         # Basic config, needs plugins
├── tsconfig.json             # Has @/* path mapping
└── package.json              # Has CVA, clsx, lucide-react

packages/ui/
├── src/                      # EMPTY - ready for components
├── package.json              # Has react-aria, CVA, clsx
└── tsconfig.json

Root dependencies (already installed):
✅ class-variance-authority@^0.7.0
✅ clsx@^2.0.0
✅ lucide-react@^0.303.0
✅ framer-motion@^10.18.0
✅ @tailwindcss/typography@^0.5.10
✅ @tailwindcss/forms@^0.5.7
✅ @tailwindcss/aspect-ratio@^0.4.2

Missing dependencies:
❌ tailwind-merge
❌ radix-ui (mono package)
❌ tailwindcss-animate
```

### Desired Codebase Structure

```bash
apps/web/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── label.tsx
│   │       ├── badge.tsx
│   │       ├── alert.tsx
│   │       ├── separator.tsx
│   │       └── skeleton.tsx
│   ├── lib/
│   │   └── utils.ts         # cn() helper function
│   └── app/
│       └── globals.css      # Updated with design tokens
├── components.json          # shadcn/ui config
└── tailwind.config.ts       # Updated with plugins

packages/ui/
├── src/
│   ├── index.ts            # Export all components
│   ├── components/         # Shared components
│   └── lib/
│       └── utils.ts        # Shared utilities
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Bun workspace setup
// Install dependencies at ROOT level for workspace sharing
// Command: bun add tailwind-merge radix-ui tailwindcss-animate

// CRITICAL: Radix UI mono package (NEW approach)
// Use unified 'radix-ui' package instead of individual @radix-ui/react-* packages
// This prevents version conflicts and duplication
// Tree-shakeable, only ships components you use

// CRITICAL: React 19 compatibility
// Some packages may need --force or --legacy-peer-deps with npm
// Bun handles this automatically, no flags needed

// CRITICAL: CSS Variables vs Utility Classes
// Once you choose, you CANNOT change without reinstalling all components
// We're using cssVariables: true for flexibility

// CRITICAL: Path aliases
// Next.js uses @/* for src directory
// Workspace packages use @iraqi-ai/* pattern
// shadcn components.json needs correct alias configuration

// CRITICAL: TypeScript imports
// Use 'import type' for type-only imports with React 19
// Example: import type * as React from "react"

// CRITICAL: Component displayName
// Always set displayName for React.forwardRef components
// Helps with debugging and DevTools

// GOTCHA: tailwind-merge vs clsx
// clsx: Conditional className joining
// tailwind-merge: Resolves Tailwind conflicts
// cn() function combines both: twMerge(clsx(...))

// GOTCHA: Tailwind plugins
// Must be imported in tailwind.config.ts even if installed
// plugins: [require("tailwindcss-animate")]
```

## Implementation Blueprint

### Step 1: Install Dependencies

Install missing packages at root level for workspace sharing:

```bash
# At root directory
bun add tailwind-merge tailwindcss-animate
bun add radix-ui

# Verify installation
bun pm ls | grep -E "(tailwind-merge|radix-ui|tailwindcss-animate)"
```

### Step 2: Create shadcn/ui Configuration

Create `apps/web/components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Step 3: Set Up Utility Functions

Create `apps/web/src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Step 4: Update Tailwind Configuration

Modify `apps/web/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // Include workspace packages
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/features/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;

export default config;
```

### Step 5: Update Global CSS with Design Tokens

Modify `apps/web/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Step 6: Create Core Components

Use shadcn CLI to add components OR copy from examples:

**Option A: Using shadcn CLI (Recommended)**

```bash
cd apps/web

# Add core components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add badge
npx shadcn@latest add alert
npx shadcn@latest add separator
npx shadcn@latest add skeleton
```

**Option B: Manual Copy from Examples**

Copy components from `examples/dyad-extracted/components/ui/` to `apps/web/src/components/ui/`:

Priority components to copy:
1. button.tsx - Most common component
2. card.tsx - Layout component
3. input.tsx - Form component
4. label.tsx - Form component
5. dialog.tsx - Radix UI example
6. badge.tsx - Simple variant example
7. alert.tsx - Composition example
8. separator.tsx - Simple component
9. skeleton.tsx - Loading state

### Step 7: Create Component Index (packages/ui)

Create `packages/ui/src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create `packages/ui/src/index.ts`:

```typescript
// Export utility functions
export { cn } from "./lib/utils";

// Will export components here as we move them to packages/ui
// For now, components live in apps/web/src/components/ui
```

### Step 8: Verify Component Rendering

Create test page `apps/web/src/app/ui-test/page.tsx`:

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

export default function UITestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">UI Component Test</h1>

      {/* Button variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>

      {/* Form elements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Form Elements</h2>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      {/* Alert */}
      <Alert>
        <p>This is an alert component</p>
      </Alert>
    </div>
  );
}
```

## Validation Loop

### Level 1: Installation & Configuration

```bash
# Verify dependencies installed
bun pm ls | grep -E "(tailwind-merge|radix-ui|tailwindcss-animate)"

# Expected output:
# ├── tailwind-merge@2.x.x
# ├── radix-ui@1.x.x
# ├── tailwindcss-animate@1.x.x

# Verify files created
ls -la apps/web/components.json
ls -la apps/web/src/lib/utils.ts
ls -la apps/web/src/components/ui/

# Expected: All files exist
```

### Level 2: TypeScript & Linting

```bash
# Run type checking
cd apps/web
bun run typecheck

# Expected: No TypeScript errors

# Run linting
bun run lint

# Expected: No linting errors
```

### Level 3: Component Rendering

```bash
# Start dev server
cd apps/web
bun run dev

# Open browser: http://localhost:3000/ui-test
# Expected: All components render correctly in both light and dark mode

# Test dark mode toggle (if implemented in layout)
# Expected: Colors switch properly
```

### Level 4: Accessibility Testing

```bash
# Run E2E accessibility tests (create if needed)
bun run test:e2e

# Manual accessibility checklist:
# [ ] Tab navigation works for all interactive components
# [ ] Screen reader announces component labels correctly
# [ ] Focus visible on keyboard navigation
# [ ] Proper ARIA attributes on complex components (Dialog, etc.)
# [ ] Color contrast meets WCAG AA standards
```

### Level 5: Build Verification

```bash
# Build for production
bun run build

# Expected: Build succeeds with no errors

# Check bundle size
bun run analyze

# Expected: UI components tree-shaken properly
```

## Final Validation Checklist

- [ ] All dependencies installed: `bun pm ls | grep -E "(tailwind-merge|radix-ui|tailwindcss-animate)"`
- [ ] No TypeScript errors: `bun run typecheck`
- [ ] No linting errors: `bun run lint`
- [ ] Components render correctly: Visit http://localhost:3000/ui-test
- [ ] Dark mode works: Toggle theme and verify colors
- [ ] Keyboard navigation works: Tab through all components
- [ ] Production build succeeds: `bun run build`
- [ ] components.json exists with correct configuration
- [ ] globals.css has design tokens
- [ ] tailwind.config.ts has plugins and theme

## Integration Points

```yaml
NEXT.JS APP:
  - location: apps/web/src/app/layout.tsx
  - ensure: Dark mode provider configured (if using next-themes)
  - pattern: Import globals.css in root layout

TAILWIND CONFIG:
  - location: apps/web/tailwind.config.ts
  - ensure: Content paths include workspace packages
  - pattern: plugins array includes tailwindcss-animate

TYPESCRIPT PATHS:
  - location: apps/web/tsconfig.json
  - ensure: @/* alias points to ./src/*
  - ensure: All workspace package paths configured

WORKSPACE PACKAGES:
  - location: packages/ui/
  - future: Move shared components here
  - pattern: Export via packages/ui/src/index.ts
```

## Anti-Patterns to Avoid

- ❌ Don't install Radix packages individually - use radix-ui mono package
- ❌ Don't modify component files directly - extend with composition
- ❌ Don't use inline styles - use Tailwind classes and cn()
- ❌ Don't hardcode colors - use design tokens (--primary, --background, etc.)
- ❌ Don't skip displayName on forwardRef components
- ❌ Don't forget to export components from packages/ui/src/index.ts
- ❌ Don't use 'any' types - leverage CVA VariantProps
- ❌ Don't skip accessibility attributes (aria-*, role, etc.)

## Common Gotchas

### shadcn/ui CLI Issues

**Problem**: CLI can't find components.json
**Solution**: Run CLI from apps/web directory: `cd apps/web && npx shadcn@latest add button`

### Import Path Issues

**Problem**: Can't import components with @/components/ui
**Solution**: Verify tsconfig.json has `"@/*": ["./src/*"]` in paths

### Radix UI Peer Dependency Warnings

**Problem**: Peer dependency warnings with React 19
**Solution**: Using Bun handles this automatically, ignore warnings

### CSS Variables Not Applied

**Problem**: Design tokens not working
**Solution**: Verify globals.css imported in layout.tsx: `import './globals.css'`

### Tailwind Classes Not Applied

**Problem**: Styles not showing
**Solution**: Check tailwind.config.ts content paths include component directories

## Performance Considerations

- **Tree Shaking**: radix-ui package is tree-shakeable, only ships used components
- **Bundle Size**: Each shadcn component adds ~2-5KB minified
- **CSS Variables**: Minimal runtime overhead vs utility classes
- **Code Splitting**: Next.js automatically splits components

## Testing Strategy

```typescript
// Example component test pattern
// apps/web/src/components/ui/__tests__/button.test.tsx

import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

## Confidence Score

**8/10** - High confidence for one-pass implementation

**Reasoning**:
- ✅ Complete dependency list provided
- ✅ Clear step-by-step instructions
- ✅ Reference implementations in examples/
- ✅ All configuration files templated
- ✅ Validation gates are executable
- ✅ Common gotchas documented
- ⚠️ May need minor path adjustments
- ⚠️ Dark mode provider setup may vary

**Risk Mitigation**:
- Examples folder provides working reference
- Each step has verification command
- Multiple validation levels ensure correctness
- Clear error messages for common issues
