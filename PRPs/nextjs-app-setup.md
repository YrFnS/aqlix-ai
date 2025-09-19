name: "Next.js App Setup for Iraqi AI Chat System"
description: |

## Purpose
Establish foundational Next.js 15 application infrastructure for the Iraqi AI Chat System frontend with App Router, React 19, Tailwind CSS, and modern development workflow integrated into the Bun workspace.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Create a complete Next.js 15 application setup in the apps/web directory that enables:
- Modern React 19 development with Server Components and latest hooks
- App Router with proper routing structure and layouts
- Tailwind CSS v4 integration with zero-configuration approach
- TypeScript integration with workspace-aware path mapping
- Development workflow optimized for Iraqi AI features (Arabic support, cultural patterns)
- Foundation for future chat, document, payment, and Arabic processing features

## Why
- **Modern Foundation**: Leverage Next.js 15 and React 19 latest features for optimal performance
- **Scalability**: App Router structure that scales with Iraqi AI feature additions
- **Developer Experience**: Hot reloading, TypeScript support, and modern development tools
- **Cultural Readiness**: Structure prepared for Arabic RTL support and Iraqi cultural features
- **Integration**: Seamless integration with existing Bun workspace and shared packages

## What
A complete Next.js 15 application that provides:
- App Router configuration with layouts and routing structure
- React 19 integration with Server Components and new hooks
- Tailwind CSS v4 with inline theming and zero-configuration setup
- TypeScript configuration with workspace integration
- Development and build scripts optimized for the monorepo
- Foundation structure for future Iraqi AI features

### Success Criteria
- [ ] Next.js application builds successfully with no errors
- [ ] Development server runs with hot reloading working
- [ ] Tailwind CSS styles apply correctly with proper theming
- [ ] TypeScript compilation works with workspace path mapping
- [ ] App Router navigation functions properly
- [ ] Integration with Bun workspace dependencies works
- [ ] Foundation prepared for Arabic/RTL features

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app
  why: Official Next.js 15 App Router documentation and setup patterns
  section: Getting Started, Installation, App Router basics
  critical: App Router is the modern standard, replaces Pages Router

- url: https://nextjs.org/blog/next-15
  why: Next.js 15 release notes with React 19 support and new features
  section: Turbopack stable, React 19 support, caching changes
  critical: Default configurations changed in Next.js 15

- url: https://react.dev/blog/2024/12/05/react-19
  why: React 19 official release with Server Components and new hooks
  section: Server Components, Actions, new hooks (useActionState, useFormStatus)
  critical: React 19 is stable and includes breaking changes from React 18

- url: https://nextjs.org/docs/app/getting-started/installation
  why: Modern installation and setup process for Next.js 15
  section: create-next-app with TypeScript and Tailwind defaults
  critical: Built-in TypeScript, Tailwind, App Router, Turbopack support

- url: https://v3.tailwindcss.com/docs/guides/nextjs
  why: Tailwind CSS integration patterns with Next.js
  section: Installation, configuration, and build integration
  critical: Tailwind v4 uses zero-configuration with inline theming

- file: PRPs/bun-workspace-setup.md
  why: Complete workspace structure and patterns for Iraqi AI system
  section: Apps directory setup, workspace dependencies, TypeScript integration
  critical: Must follow established workspace patterns and @iraqi-ai/ namespace

- file: examples/agnai-persona-extracted/package.json
  why: Comprehensive Next.js package configuration with Iraqi cultural features
  section: Scripts, dependencies, ESLint/Prettier, cultural configurations
  critical: Shows Arabic support, cultural colors, and professional domains

- file: examples/lobe-chat-arabic-extracted/package.json
  why: Arabic-first Next.js configuration with RTL and cultural dependencies
  section: Arabic dependencies, font dependencies, cultural compliance
  critical: Comprehensive Arabic support patterns and dependency organization

- file: examples/phase3-reference-implementations/*/package.json
  why: Workspace dependency patterns using workspace:* syntax
  section: Dependencies section with @iraqi-ai/ packages
  critical: Shows how internal packages link in Bun workspaces

- docfile: CLAUDE.md
  why: Global rules, naming conventions, and Iraqi AI system requirements
  section: Agent delegation rules, cultural compliance, development standards
  critical: Must follow Iraqi cultural standards and agent-based architecture
```

### Current Codebase tree
```bash
aqlix-ai/
├── .claude/                    # Agent configurations (21 specialized agents)
├── docs/                      # Documentation
├── examples/                  # 79 Iraqi-enhanced reference implementations
│   ├── agnai-persona-extracted/     # Next.js with cultural features
│   ├── lobe-chat-arabic-extracted/  # Arabic-first Next.js patterns
│   └── phase3-reference-implementations/  # Workspace dependency examples
├── initials/                  # 56 system templates
├── project-context/           # Persistent knowledge base
├── PRPs/                     # Product Requirement Prompts
│   ├── bun-workspace-setup.md      # Complete workspace configuration
│   └── templates/                  # PRP templates
├── CLAUDE.md                 # Global rules and agent requirements
├── bun.json                  # Bun workspace configuration (from workspace setup)
├── package.json              # Root workspace configuration (from workspace setup)
└── [apps/ directory READY for Next.js setup]
```

### Desired Codebase tree with files to be added
```bash
aqlix-ai/
├── apps/
│   └── web/                   # Next.js 15 application (TO BE CREATED)
│       ├── package.json       # Next.js app configuration with workspace deps
│       ├── next.config.js     # Next.js 15 configuration
│       ├── tailwind.config.ts # Tailwind CSS v4 configuration (if needed)
│       ├── tsconfig.json      # TypeScript configuration with workspace refs
│       ├── .eslintrc.json     # ESLint configuration
│       ├── app/               # App Router structure
│       │   ├── layout.tsx     # Root layout with Arabic support
│       │   ├── page.tsx       # Homepage component
│       │   ├── globals.css    # Global styles with Tailwind and Iraqi themes
│       │   └── components/    # Component organization
│       ├── public/            # Static assets
│       └── README.md          # Development documentation
├── packages/                  # Existing shared packages (from workspace setup)
│   ├── ui/                    # Shared UI components
│   ├── types/                 # TypeScript types (@iraqi-ai/types)
│   └── ...                    # Other workspace packages
```

### Known Gotchas of Next.js 15 & React 19 & Library Quirks
```javascript
// CRITICAL: Next.js 15 uses React 19 RC - breaking changes from React 18
// Server Components are default, Client Components need 'use client' directive

// GOTCHA: Caching changes in Next.js 15
// GET Route Handlers and Client Router Cache are uncached by default now
// Previous behavior was cached by default

// GOTCHA: Turbopack is now default bundler (not webpack)
// Most webpack configurations won't work, use Turbopack-compatible patterns

// GOTCHA: create-next-app defaults changed
// Now includes TypeScript, Tailwind, App Router, and Turbopack by default
// Old --typescript flag is no longer needed

// CRITICAL: Tailwind CSS v4 zero-configuration
// No tailwind.config.js generated by default in 2025
// Use @theme inline in global.css for custom theming

// GOTCHA: React 19 hook changes
// useFormStatus and useActionState replace many custom form patterns
// Server Actions integrated - no need for separate API routes for simple cases

// GOTCHA: App Router vs Pages Router
// Don't mix patterns - App Router only (no pages/ directory)
// All routes must be in app/ directory with proper folder structure

// PERFORMANCE: TypeScript project references
// Use workspace references for incremental compilation
// Configure paths for workspace package imports

// CRITICAL: Server vs Client Component boundaries
// Server Components can't use useState, useEffect, or other client hooks
// Use 'use client' directive when client-side features needed

// GOTCHA: Bun workspace integration
// Use workspace:* for internal dependencies
// Bun handles TypeScript natively, no need for ts-node
```

## Implementation Blueprint

### Data models and structure
```typescript
// Next.js App Router structure for consistent organization
interface AppRouterStructure {
  app: {
    layout: "tsx";           // Root layout with Arabic support
    page: "tsx";             // Homepage component
    "globals.css": "css";    // Global styles with Tailwind
    components: {            // Reusable components
      ui: "directory";       // Basic UI components
      layout: "directory";   // Layout components
    };
  };
  public: {                  // Static assets
    icons: "directory";      // App icons and favicons
    images: "directory";     // Static images
  };
  configuration: {
    "package.json": "json";         // App configuration
    "next.config.js": "js";         // Next.js configuration
    "tsconfig.json": "json";        // TypeScript configuration
    ".eslintrc.json": "json";       // ESLint rules
    "tailwind.config.ts"?: "ts";    // Tailwind config (if needed)
  };
}

// Iraqi AI integration points for future features
interface IraqiAIIntegration {
  culturalSupport: {
    rtlLayout: boolean;           // Right-to-left layout support
    arabicFonts: string[];        // Arabic font integration
    culturalColors: object;       // Iraqi cultural color schemes
  };
  workspaceIntegration: {
    sharedPackages: string[];     // @iraqi-ai/ package dependencies
    typeReferences: string[];     // TypeScript project references
  };
  developmentWorkflow: {
    hotReload: boolean;           // Hot reloading support
    typeChecking: boolean;        // TypeScript validation
    linting: boolean;             // Code quality checks
  };
}
```

### List of tasks to be completed to fulfill the PRP in order

```yaml
Task 1: Create Next.js Application Structure
CREATE apps/web directory:
  - PATTERN: Standard Next.js application organization
  - PREPARE: App Router structure with proper folder hierarchy
  - FOUNDATION: Directory structure for Iraqi AI features

INITIALIZE Next.js app using create-next-app pattern:
  - USE: Modern Next.js 15 defaults (TypeScript, Tailwind, App Router, Turbopack)
  - CONFIGURE: For Bun workspace integration
  - AVOID: Manual setup - leverage automated tooling

Task 2: Configure Package Dependencies and Scripts
CREATE apps/web/package.json:
  - PATTERN: Mirror examples/agnai-persona-extracted/package.json structure
  - ADD: Next.js 15, React 19, Tailwind CSS, TypeScript dependencies
  - INCLUDE: Workspace dependencies (@iraqi-ai/types, @iraqi-ai/ui future packages)
  - SET: Development scripts optimized for Bun and workspace

UPDATE workspace integration:
  - ADD: apps/web to root workspace configuration (if not already included)
  - VERIFY: Bun workspace recognizes new app
  - TEST: Workspace dependency resolution

Task 3: Setup App Router Structure and Layouts
CREATE app/layout.tsx:
  - PATTERN: Root layout with HTML structure and metadata
  - INCLUDE: Arabic language support and RTL preparation
  - CONFIGURE: Font loading and global styling integration
  - PREPARE: Structure for future Iraqi cultural features

CREATE app/page.tsx:
  - PATTERN: Homepage component using React 19 patterns
  - DEMONSTRATE: Server Component usage (default behavior)
  - INCLUDE: Basic structure for future Iraqi AI features
  - STYLE: Using Tailwind CSS classes

CREATE app/globals.css:
  - PATTERN: Tailwind CSS v4 with inline theming
  - INCLUDE: Iraqi cultural color schemes from examples
  - CONFIGURE: Arabic font integration and RTL support preparation
  - SET: Base styles for consistent Iraqi AI design

Task 4: Configure TypeScript Integration
CREATE apps/web/tsconfig.json:
  - PATTERN: Next.js TypeScript configuration with workspace integration
  - EXTEND: Root workspace TypeScript configuration
  - CONFIGURE: Path mapping for workspace packages (@iraqi-ai/*)
  - SET: Project references for incremental compilation

UPDATE TypeScript workspace references:
  - ADD: apps/web reference to root tsconfig.json
  - CONFIGURE: Proper dependency order for compilation
  - OPTIMIZE: Incremental builds with workspace awareness

Task 5: Configure Development Tools
CREATE apps/web/.eslintrc.json:
  - PATTERN: Next.js ESLint configuration with cultural standards
  - EXTEND: next/core-web-vitals and TypeScript recommended rules
  - INCLUDE: Accessibility rules and cultural compliance patterns
  - INTEGRATE: Prettier configuration for consistent formatting

CREATE apps/web/next.config.js:
  - PATTERN: Next.js 15 configuration with App Router optimization
  - CONFIGURE: Turbopack integration (stable in Next.js 15)
  - PREPARE: Arabic/RTL support configuration
  - SET: Performance optimizations and build settings

CONFIGURE Tailwind CSS integration:
  - USE: Zero-configuration approach (Tailwind v4 default)
  - CREATE: tailwind.config.ts only if custom configuration needed
  - SET: Iraqi cultural design tokens and color schemes
  - PREPARE: RTL support classes and Arabic typography

Task 6: Setup Development Workflow
CREATE development scripts:
  - SET: dev, build, start, lint, typecheck scripts in package.json
  - CONFIGURE: Port allocation (3000 for web app, avoid conflicts)
  - INTEGRATE: Bun commands for optimal performance
  - PREPARE: Scripts for future Iraqi AI features

CREATE basic component structure:
  - CREATE: app/components/ui/ for reusable UI components
  - CREATE: app/components/layout/ for layout-specific components
  - PATTERN: Component organization for scalable Iraqi AI features
  - PREPARE: Structure for future Arabic and cultural components

Task 7: Implement Basic Pages and Components
CREATE app/components/ui/Button.tsx:
  - PATTERN: Basic button component with Tailwind styling
  - DEMONSTRATE: TypeScript integration and prop typing
  - INCLUDE: Variants for Iraqi cultural design system
  - PREPARE: Foundation for Iraqi AI interaction patterns

CREATE app/components/layout/Header.tsx:
  - PATTERN: Basic header component with navigation structure
  - PREPARE: Arabic language toggle and RTL support
  - INCLUDE: Iraqi branding elements and cultural design
  - STRUCTURE: For future authentication and user features

UPDATE app/page.tsx with basic content:
  - INCLUDE: Welcome message and basic Iraqi AI branding
  - DEMONSTRATE: Component composition and Tailwind usage
  - SHOW: Server Component patterns and modern React 19 features
  - PREPARE: Structure for future chat interface integration

Task 8: Validate and Test Setup
RUN development server:
  - EXECUTE: bun run dev in apps/web directory
  - VERIFY: Application loads without errors
  - TEST: Hot reloading functionality works
  - CHECK: TypeScript compilation is successful

TEST build process:
  - EXECUTE: bun run build in apps/web directory
  - VERIFY: Production build completes successfully
  - CHECK: Static generation works properly
  - VALIDATE: Turbopack bundling optimization

VERIFY workspace integration:
  - TEST: TypeScript path mapping works for workspace packages
  - CHECK: Bun workspace dependency resolution
  - VALIDATE: Incremental compilation with project references
  - ENSURE: Development workflow coordination
```

### Per task pseudocode

```bash
# Task 1: Create Next.js Application Structure
# Modern approach using create-next-app with defaults
cd apps/
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"
# PATTERN: Uses Next.js 15 defaults (TypeScript, Tailwind, App Router, Turbopack)
# CRITICAL: --app flag ensures App Router (not Pages Router)
# MODERN: Turbopack is now default bundler

# Task 2: Package Configuration
# apps/web/package.json structure
{
  "name": "iraqi-ai-web",                    // PATTERN: App naming convention
  "version": "1.0.0",
  "private": true,                           // CRITICAL: App packages should be private
  "type": "module",                          // MODERN: ESM modules
  "scripts": {
    "dev": "next dev -p 3000",              // GOTCHA: Explicit port to avoid conflicts
    "build": "next build",                   // TURBOPACK: Uses Turbopack by default
    "start": "next start",
    "lint": "next lint",                     // ESLINT: Next.js integrated linting
    "typecheck": "tsc --noEmit"             // TYPESCRIPT: Separate type checking
  },
  "dependencies": {
    // PATTERN: Next.js 15 and React 19 integration
    "next": "^15.0.0",                      // LATEST: Next.js 15 with App Router
    "react": "^19.0.0",                     // REACT 19: Stable release
    "react-dom": "^19.0.0",

    // WORKSPACE: Internal package dependencies
    "@iraqi-ai/types": "workspace:*",        // WORKSPACE: Shared TypeScript types
    "@iraqi-ai/ui": "workspace:*",          // WORKSPACE: Shared UI components (future)

    // STYLING: Tailwind CSS v4 integration
    "tailwindcss": "^4.0.0",               // TAILWIND V4: Zero-configuration
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  },
  "devDependencies": {
    "typescript": "^5.5.0",                 // TYPESCRIPT: Latest stable
    "@types/react": "^19.0.0",              // REACT 19: Updated type definitions
    "@types/react-dom": "^19.0.0",
    "@types/node": "^22.0.0",
    "eslint": "^8.57.0",                     // ESLINT: Code quality
    "eslint-config-next": "^15.0.0"         // NEXT.JS: ESLint integration
  }
}

# Task 3: App Router Structure
# app/layout.tsx - Root layout with Arabic support
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Iraqi AI Chat System',                    // BRANDING: Iraqi AI system
  description: 'Advanced AI chat system for Iraqi professionals',
  lang: 'ar',                                       // ARABIC: Default language
  dir: 'rtl'                                        // RTL: Right-to-left preparation
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="font-arabic">  {/* ARABIC: Language and direction */}
      <body className="bg-background text-foreground">  {/* TAILWIND: Semantic colors */}
        {children}
      </body>
    </html>
  )
}

# app/page.tsx - Homepage with React 19 patterns
export default function HomePage() {                 // SERVER COMPONENT: Default in App Router
  return (
    <main className="min-h-screen p-8">              // TAILWIND: Responsive layout
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-iraqi-600 mb-8">  {/* CULTURAL: Iraqi colors */}
          مرحباً بكم في نظام الذكاء الاصطناعي العراقي           {/* ARABIC: Welcome message */}
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          نظام متقدم للمحادثة بالذكاء الاصطناعي للمهنيين العراقيين
        </p>
        {/* STRUCTURE: Prepared for future chat interface */}
      </div>
    </main>
  )
}

# app/globals.css - Tailwind v4 with Iraqi theming
@import "tailwindcss";                              // TAILWIND V4: Zero-config import

@theme inline {                                      // TAILWIND V4: Inline theming
  --color-iraqi-50: #f0f9ff;                        // CULTURAL: Iraqi color palette
  --color-iraqi-500: #0ea5e9;
  --color-iraqi-600: #0284c7;
  --font-arabic: "Noto Sans Arabic", Arial, sans-serif;  // ARABIC: Font family
}

@layer base {
  body {
    font-family: var(--font-arabic);                 // ARABIC: Default Arabic font
    direction: rtl;                                   // RTL: Right-to-left direction
  }
}

# Task 6: TypeScript Configuration
# apps/web/tsconfig.json
{
  "extends": "../../tsconfig.json",                  // WORKSPACE: Inherit root config
  "compilerOptions": {
    "target": "ES2022",                              // MODERN: Latest stable target
    "lib": ["dom", "dom.iterable", "es6"],          // BROWSER: DOM and modern JS
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,                                  // NEXT.JS: Handles compilation
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",                   // TURBOPACK: Bundler resolution
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",                               // NEXT.JS: Preserves JSX for processing
    "incremental": true,
    "plugins": [
      {
        "name": "next"                               // NEXT.JS: TypeScript plugin
      }
    ],
    "baseUrl": ".",
    "paths": {
      // WORKSPACE: Path mapping for internal packages
      "@/*": ["./src/*"],                           // LOCAL: App-specific imports
      "@iraqi-ai/types": ["../../packages/types/src"],   // WORKSPACE: Shared types
      "@iraqi-ai/ui": ["../../packages/ui/src"]          // WORKSPACE: Shared components
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

# Task 8: Validation Commands
# Development server test
cd apps/web && bun run dev
# Expected: Server starts on http://localhost:3000, no TypeScript errors

# Build validation
cd apps/web && bun run build
# Expected: Successful production build with Turbopack optimization

# Type checking
cd apps/web && bun run typecheck
# Expected: No TypeScript errors, workspace types resolved

# Workspace integration test
cd apps/web && bun install
# Expected: workspace:* dependencies linked correctly
```

### Integration Points
```yaml
WORKSPACE_INTEGRATION:
  - workspace: "Proper integration with Bun workspace and @iraqi-ai/ packages"
  - typescript: "TypeScript project references and path mapping"
  - dependencies: "workspace:* syntax for internal package linking"

NEXT_JS_INTEGRATION:
  - app_router: "Modern App Router with proper layouts and Server Components"
  - react_19: "React 19 features including Server Components and new hooks"
  - turbopack: "Turbopack bundler for optimal development and build performance"

TAILWIND_INTEGRATION:
  - v4_zero_config: "Tailwind CSS v4 with zero-configuration setup"
  - inline_theming: "Custom Iraqi cultural themes using @theme inline"
  - rtl_preparation: "Structure ready for Arabic RTL layout support"

DEVELOPMENT_WORKFLOW:
  - hot_reload: "Fast development with Turbopack hot reloading"
  - type_safety: "Full TypeScript integration with workspace types"
  - code_quality: "ESLint and Prettier integration for consistent code"

CULTURAL_PREPARATION:
  - arabic_support: "Structure prepared for Arabic language and RTL layout"
  - iraqi_branding: "Cultural color schemes and Iraqi professional design"
  - scalable_architecture: "Component organization for future Iraqi AI features"
```

## Validation Loop

### Level 1: Application Structure and Dependencies
```bash
# Verify Next.js application structure created
ls -la apps/web/
# Expected: app/, public/, package.json, next.config.js, tsconfig.json

# Install dependencies and verify workspace linking
cd apps/web && bun install
# Expected: No errors, workspace packages linked, bun.lockb updated

# Verify TypeScript configuration
cd apps/web && bun run typecheck
# Expected: No TypeScript errors, workspace types resolved correctly
```

### Level 2: Development Server and Hot Reloading
```bash
# Start development server
cd apps/web && bun run dev
# Expected: Server starts on localhost:3000, no compilation errors

# Test hot reloading by modifying app/page.tsx
echo "// Test comment" >> apps/web/app/page.tsx
# Expected: Browser automatically refreshes with changes

# Verify Tailwind CSS works
# Check browser: Iraqi color classes apply, Arabic fonts load
# Expected: CSS styles render correctly, cultural colors visible
```

### Level 3: Build and Production Validation
```bash
# Test production build
cd apps/web && bun run build
# Expected: Successful build with Turbopack, optimized output created

# Test static generation
cd apps/web && bun run start
# Expected: Production server starts, static pages serve correctly

# Verify build output structure
ls -la apps/web/.next/
# Expected: static/, server/, optimized assets created
```

### Level 4: Workspace Integration Testing
```bash
# Test workspace dependency resolution
cd apps/web && node -e "console.log(require.resolve('@iraqi-ai/types'))"
# Expected: Resolves to workspace package, not external npm

# Verify TypeScript path mapping
cd apps/web && bun run typecheck
# Expected: Imports like "@iraqi-ai/types" resolve correctly

# Test incremental compilation
# Modify packages/types/src/index.ts, then build apps/web
cd packages/types && echo "export const test = 'updated';" >> src/index.ts
cd ../../apps/web && bun run build
# Expected: Incremental build, only necessary files recompiled
```

## Final Validation Checklist
- [ ] Next.js application structure created: `ls apps/web/app/`
- [ ] Dependencies installed correctly: `cd apps/web && bun install`
- [ ] Development server runs: `bun run dev` (no errors)
- [ ] TypeScript compilation works: `bun run typecheck` (no errors)
- [ ] Tailwind CSS applies: Check browser for styles and Iraqi colors
- [ ] App Router navigation: Test basic routing functionality
- [ ] Production build successful: `bun run build` (optimized output)
- [ ] Workspace integration: Path mapping and dependency resolution works
- [ ] Hot reloading functional: Modify files, see automatic updates
- [ ] Cultural preparation: Arabic fonts, RTL structure, Iraqi branding

---

## Anti-Patterns to Avoid
- ❌ Don't use Pages Router - App Router only for Next.js 15
- ❌ Don't manually configure Tailwind if zero-config works
- ❌ Don't mix React 18 patterns - use React 19 Server Components
- ❌ Don't ignore TypeScript errors - fix them before proceeding
- ❌ Don't hardcode ports - use environment variables or defaults
- ❌ Don't skip workspace integration - use workspace:* dependencies
- ❌ Don't use webpack configs - Turbopack is the default bundler
- ❌ Don't create custom layout patterns - follow App Router conventions

## Iraqi AI System Considerations
- **Cultural Foundation**: Structure prepared for Arabic RTL support and Iraqi cultural design
- **Scalable Architecture**: Component organization ready for chat, documents, payments features
- **Professional Integration**: Prepared for Iraqi legal, medical, educational domain features
- **Performance Optimization**: Turbopack and React 19 for optimal Iraqi user experience
- **Accessibility**: Foundation set for WCAG compliance and Arabic screen reader support

## Confidence Score: 9/10
This PRP provides comprehensive context for one-pass implementation including:
✅ Complete Next.js 15 and React 19 documentation and setup patterns
✅ Detailed Tailwind CSS v4 zero-configuration approach
✅ Specific workspace integration patterns from existing codebase
✅ Iraqi cultural preparation with Arabic support and design systems
✅ Executable validation steps with clear success criteria
✅ Anti-patterns to avoid common Next.js and React 19 pitfalls
✅ Complete codebase examples and established patterns
✅ Modern 2025 best practices with Turbopack and latest features

The high confidence score reflects the thorough research, comprehensive documentation references, practical examples from the codebase, and detailed validation approach that enables successful Next.js 15 implementation with Iraqi AI system integration.