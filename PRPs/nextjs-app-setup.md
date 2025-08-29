name: "Next.js App Setup PRP - Foundation Frontend Application"
description: |
  Comprehensive PRP for setting up Next.js 15 application with App Router, React 19, and Tailwind CSS as the frontend foundation for the Iraqi AI Chat System workspace.

---

## Goal
Create a complete Next.js 15 application with App Router setup, React 19 integration, and Tailwind CSS configuration as the frontend foundation for the Iraqi AI Chat System. The application should follow modern Next.js patterns, support the workspace structure, and provide a clean foundation for future feature additions without implementing specific chat functionality or Arabic support initially.

## Why
- **Modern Foundation**: Leverage Next.js 15 with React 19 stable features (Actions, new hooks, Server Components) for optimal developer experience
- **Performance**: Utilize App Router's server-side rendering capabilities, React 19's built-in compiler optimizations, and Turbopack for fast development
- **Workspace Integration**: Proper integration with existing Bun workspace structure and shared packages
- **Scalability**: Clean architectural foundation that can support future Iraqi AI features (Arabic RTL, cultural validation, professional domain features)
- **Development Efficiency**: Hot reload, TypeScript support, and modern development tooling setup

## What
Set up a foundational Next.js 15 application featuring:
- Next.js 15 with App Router configuration using React 19 stable features
- Tailwind CSS integration with responsive design system
- Clean component organization and routing structure
- TypeScript configuration with workspace path mapping
- Development and build scripts optimized for Bun
- Basic layout system ready for future enhancements

### Success Criteria
- [ ] `bun run dev` starts development server without errors on port 3000
- [ ] Basic App Router navigation works correctly between pages
- [ ] Tailwind CSS classes render properly with responsive design
- [ ] TypeScript compilation passes without errors
- [ ] Production build completes successfully with `bun run build`
- [ ] All lint and typecheck commands pass validation
- [ ] Clean component structure ready for feature additions

## All Needed Context

### Documentation & References
```yaml
# CRITICAL READING - Next.js 15 and React 19 features
- url: https://nextjs.org/docs/app
  why: App Router documentation and routing patterns
  note: Core concepts for file-based routing structure

- url: https://nextjs.org/blog/next-15
  why: Next.js 15 release notes with React 19 integration details
  critical: Caching changes (uncached by default), Turbopack stable, new APIs

- url: https://nextjs.org/blog/next-15-5
  why: Latest Next.js 15.5 features including Typed Routes and Node.js middleware
  critical: TypeScript improvements and enhanced type safety

- url: https://react.dev/blog/2024/12/05/react-19
  why: React 19 stable release with new hooks and Server Components
  critical: useActionState, useOptimistic, useFormStatus, Actions API

- url: https://tailwindcss.com/docs/installation
  why: Tailwind CSS setup and configuration with Next.js
  
- url: https://bun.sh/docs/install/workspaces  
  why: Bun workspace integration patterns
  critical: Workspace protocol and dependency management

# EXISTING PATTERNS - Follow these conventions
- file: examples/ai-design-generation/package.json
  why: Bun scripts patterns, TypeScript configuration, workspace integration
  critical: Development workflow and build optimization

- file: NAMING_CONVENTIONS.md
  why: Professional terminology requirements for generated code
  critical: Use "professional/organization" not "government/ministry" in implementations

- file: CLAUDE.md
  why: Project standards, agent integration patterns, quality requirements
  critical: Bun usage mandate, TypeScript strict mode, code organization principles
```

### Current Codebase Structure
```bash
aqlix-ai/
├── examples/                    # Reference implementations (44 components)
│   ├── dyad-extracted/         # UI component patterns with Iraqi enhancements
│   ├── ai-design-generation/   # Bun + TypeScript patterns
│   └── ...                     # Other extraction examples
├── PRPs/                       # Project Requirements Prompts
├── packages/                   # Shared workspace packages (future)
├── apps/                      # Applications (to be created)
│   └── web/                   # Next.js app (TARGET LOCATION)
├── .claude/                   # Agent configurations
├── CLAUDE.md                  # Project standards and rules
├── NAMING_CONVENTIONS.md      # Professional terminology rules
└── package.json               # Root workspace configuration (to be created)
```

### Desired Codebase Structure After Implementation
```bash
aqlix-ai/
├── package.json              # NEW: Root Bun workspace configuration
├── apps/
│   └── web/                  # NEW: Next.js 15 application
│       ├── package.json      # Next.js dependencies and scripts
│       ├── next.config.mjs   # Next.js configuration
│       ├── tailwind.config.ts # Tailwind configuration
│       ├── tsconfig.json     # TypeScript configuration
│       ├── app/              # App Router structure
│       │   ├── layout.tsx    # Root layout component
│       │   ├── page.tsx      # Home page
│       │   ├── globals.css   # Global styles with Tailwind
│       │   └── (routes)/     # Route groups (future structure)
│       ├── components/       # Reusable UI components
│       │   ├── ui/          # Basic UI components
│       │   └── layout/      # Layout-specific components
│       ├── lib/             # Utility functions
│       │   └── utils.ts     # Tailwind CN utility and helpers
│       └── public/          # Static assets
├── packages/                # Shared workspace packages (future)
└── [existing files remain unchanged]
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Next.js 15 with React 19 considerations
// 1. React 19 stable requires specific package versions
// "react": "^19.0.0", "react-dom": "^19.0.0"

// 2. Next.js 15.5 caching changes - fetch requests uncached by default
// This affects data fetching patterns - be explicit about caching

// 3. Turbopack in development is stable but has different behavior
// Some webpack-specific configurations may need adjustment

// 4. App Router requires specific file naming conventions
// page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx

// 5. Server Components are default in App Router
// Use "use client" directive for client-side interactivity

// 6. Bun workspace protocol for internal dependencies
// "workspace:*" for local package references
```

## Implementation Blueprint

### Data Models and Structure
Create foundational Next.js application structure with TypeScript interfaces:
```typescript
// Essential type definitions for the application foundation
interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'production' | 'test';
}

interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[]>;
}

interface LayoutProps {
  children: React.ReactNode;
}
```

### List of Tasks to Complete the PRP (In Order)

```yaml
Task 1 - Root Workspace Configuration:
CREATE package.json (root):
  - ADD Bun workspace configuration with apps/web workspace
  - SET @aqlix-ai namespace for professional naming
  - CONFIGURE development and build scripts
  - ESTABLISH workspace dependency management

Task 2 - Next.js Application Setup:
CREATE apps/web/package.json:
  - ADD Next.js 15.x with React 19.x stable versions
  - INCLUDE Tailwind CSS, TypeScript, and development dependencies
  - SET Bun-optimized scripts (dev, build, start, lint, typecheck)
  - CONFIGURE proper dependency versions for React 19 compatibility

Task 3 - Next.js Configuration:
CREATE apps/web/next.config.mjs:
  - ENABLE Turbopack for development (stable in Next.js 15)
  - CONFIGURE TypeScript and experimental features
  - SET build optimizations and output configuration
  - PREPARE for future workspace integration

Task 4 - TypeScript Configuration:
CREATE apps/web/tsconfig.json:
  - EXTEND from Next.js TypeScript configuration
  - SET strict mode and workspace path mapping (@/ for src)
  - CONFIGURE module resolution for Bun compatibility
  - ENABLE type checking for React 19 features

Task 5 - Tailwind CSS Setup:
CREATE apps/web/tailwind.config.ts:
  - CONFIGURE content paths for App Router structure
  - SET custom theme extensions for future Iraqi cultural colors
  - ENABLE RTL plugin support (preparation for Arabic support)
  - CONFIGURE responsive design system

Task 6 - App Router Structure:
CREATE apps/web/app/ directory with:
  - layout.tsx: Root layout with HTML structure and metadata
  - page.tsx: Home page component with basic content
  - globals.css: Tailwind CSS imports and custom styles
  - loading.tsx: Global loading UI component

Task 7 - Component Organization:
CREATE apps/web/components/ structure:
  - ui/: Basic UI components directory (empty, ready for shadcn/ui)
  - layout/: Layout-specific components
  - lib/utils.ts: Utility functions including Tailwind CN helper

Task 8 - Development Workflow:
CONFIGURE development and build scripts:
  - VERIFY hot reload works correctly
  - TEST TypeScript compilation and type checking
  - VALIDATE Tailwind CSS processing
  - ENSURE all linting and formatting tools work
```

### Per Task Pseudocode

```typescript
// Task 1: Root Workspace Setup
// package.json (root)
{
  "name": "@aqlix-ai/workspace",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun run --parallel dev",
    "build": "bun run build --filter=./apps/*",
    "lint": "bun run --recursive lint",
    "typecheck": "bun run --recursive typecheck"
  }
}

// Task 2 & 3: Next.js App Setup with React 19
// apps/web/package.json dependencies
{
  "dependencies": {
    "next": "^15.5.0",           // Latest stable with React 19 support
    "react": "^19.0.0",          // React 19 stable 
    "react-dom": "^19.0.0"       // React DOM 19 stable
  }
}

// next.config.mjs - Enable Turbopack and React 19 features
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {}, // Stable Turbopack for development
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  }
};

// Task 4: TypeScript with React 19 hooks support
// PATTERN: Enable strict mode and React 19 type definitions
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "es6"],
    "paths": {
      "@/*": ["./src/*"],         // Workspace path mapping
      "@aqlix-ai/*": ["../../packages/*"]  // Future packages
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}

// Task 5: Tailwind with RTL preparation
// tailwind.config.ts - Ready for future Arabic RTL support
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Prepared for Arabic font integration
        sans: ['Inter', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'serif'], // Future Iraqi typography
      },
      colors: {
        // Professional color scheme, ready for Iraqi cultural colors
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
      }
    },
  },
  plugins: [
    // Ready for @tailwindcss/typography and RTL support
  ],
};

// Task 6: App Router with React 19 features
// app/layout.tsx - Root layout with metadata API
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" dir="ltr"> {/* Ready for RTL support */}
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

// app/page.tsx - Home page with modern React patterns
export default function HomePage() {
  // Ready for React 19 hooks (useActionState, useOptimistic)
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center">
        Next.js 15 with React 19
      </h1>
      <p className="text-center text-muted-foreground mt-4">
        Professional application foundation ready for feature development
      </p>
    </main>
  );
}
```

### Integration Points
```yaml
WORKSPACE:
  - integration: Root package.json with workspaces configuration
  - pattern: "workspaces: ['apps/*', 'packages/*']"
  
BUN_SCRIPTS:
  - add to: apps/web/package.json
  - pattern: "dev: 'next dev --turbo', build: 'next build', typecheck: 'tsc --noEmit'"
  
TYPESCRIPT:
  - integration: Workspace path mapping for future shared packages
  - pattern: "paths: { '@aqlix-ai/*': ['../../packages/*'] }"

TAILWIND:
  - integration: CSS processing with Next.js App Router
  - pattern: Content paths include app/ and components/ directories
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST from apps/web/ directory
bun run typecheck                    # TypeScript compilation check
bun run lint                        # ESLint validation  
bun run build                       # Production build test

# Expected: No errors. If errors exist, read carefully and fix systematically.
```

### Level 2: Development Server Testing
```bash
# Start development server
cd apps/web
bun run dev

# Expected: 
# - Server starts on http://localhost:3000 without errors
# - Hot reload works when editing components
# - Tailwind CSS classes apply correctly
# - TypeScript errors show in real-time
```

### Level 3: Build and Production Validation
```bash
# Production build and static analysis
bun run build                       # Next.js production build
bun run start                       # Production server test

# Expected:
# - Build completes without warnings
# - Static generation works for static pages
# - Production server serves correctly
```

### Level 4: React 19 Features Test
```typescript
// Create test component using React 19 features
"use client";

import { useActionState, useOptimistic } from 'react';

function TestReact19Features() {
  // Test React 19 hooks are available and working
  const [state, action] = useActionState(
    async (prev: string, formData: FormData) => {
      return `Updated: ${formData.get('message')}`;
    },
    'Initial state'
  );

  return (
    <form action={action}>
      <input name="message" />
      <button type="submit">Test React 19</button>
      <p>{state}</p>
    </form>
  );
}
```

## Final Validation Checklist
- [ ] All development commands work: `bun run dev`, `bun run build`, `bun run typecheck`
- [ ] Next.js 15 development server starts without errors using Turbopack
- [ ] React 19 features (hooks) are available and functional
- [ ] Tailwind CSS processes correctly and styles apply
- [ ] TypeScript compilation passes with strict mode enabled
- [ ] App Router navigation works between pages
- [ ] Production build generates optimized static files
- [ ] Workspace integration allows future package additions
- [ ] Code follows professional naming conventions (not "iraqi-" prefixes)
- [ ] Foundation is ready for future Iraqi AI feature integration

---

## Anti-Patterns to Avoid
- ❌ Don't use Pages Router - Next.js 15 optimized for App Router
- ❌ Don't disable TypeScript strict mode - required by project standards  
- ❌ Don't skip Turbopack setup - stable and faster in Next.js 15
- ❌ Don't hardcode Iraqi-specific features yet - keep foundation clean
- ❌ Don't ignore React 19 breaking changes - ensure compatibility
- ❌ Don't use npm/yarn scripts - project mandates Bun usage
- ❌ Don't create "iraqi-" prefixed components - use professional naming
- ❌ Don't skip workspace configuration - required for monorepo structure

## Confidence Score: 9/10

This PRP provides comprehensive context for implementing a Next.js 15 application with React 19, including:
- ✅ Complete Next.js 15 and React 19 feature documentation
- ✅ Specific version requirements and compatibility information  
- ✅ Existing codebase patterns and conventions
- ✅ Step-by-step implementation with executable validation
- ✅ Professional naming conventions and workspace integration
- ✅ Future-ready structure for Iraqi AI features

The high confidence score reflects thorough research, specific technical requirements, and comprehensive validation gates that enable successful one-pass implementation.