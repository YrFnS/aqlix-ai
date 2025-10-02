name: "Next.js 15 App Setup with React 19 and Tailwind CSS"
description: |
  Complete Next.js 15 application setup with App Router, React 19 integration,
  Tailwind CSS configuration, and clean component organization for the Iraqi AI
  Chat System frontend. This establishes the core application structure without
  specific features.

---

## Goal

Set up the core Next.js 15 application structure for the Iraqi AI Chat System frontend with:
- Next.js 15 App Router with proper routing configuration
- React 19 integration with latest features
- Tailwind CSS v4 styling setup with zero-config approach
- Basic layout system and component organization
- Development workflow with hot reload and build optimization
- Clean foundation for future feature integration

## Why

- **Modern Stack**: Next.js 15 + React 19 provides the latest features and performance improvements
- **Type Safety**: TypeScript integration already configured in workspace
- **Styling Foundation**: Tailwind CSS enables rapid UI development with consistent design
- **Developer Experience**: Fast development server with hot reload and Turbopack support
- **Scalability**: Clean App Router structure supports complex routing and layouts
- **Monorepo Integration**: Seamless workspace package integration (@iraqi-ai/*)

## What

**User-visible behavior:**
- Developers can run `bun run dev` and see a working Next.js application
- Basic routing works with App Router patterns
- Tailwind CSS classes apply correctly to components
- Hot reload updates instantly during development
- Build process generates optimized production bundle

**Technical requirements:**
- App Router directory structure (app/layout.tsx, app/page.tsx)
- Tailwind CSS configuration (tailwind.config.ts, postcss.config.mjs)
- Global styles with Tailwind imports (app/globals.css)
- Basic layout components (RootLayout, navigation)
- Example pages demonstrating routing
- Component organization structure
- Development and build scripts working

### Success Criteria

- [ ] Next.js dev server runs successfully on port 3000
- [ ] Root layout renders with proper HTML structure
- [ ] Tailwind CSS classes work correctly on components
- [ ] Basic routing with multiple pages works
- [ ] Hot reload updates components without full refresh
- [ ] Production build completes without errors
- [ ] TypeScript type checking passes
- [ ] All workspace packages can be imported
- [ ] No console errors in browser during development

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app/getting-started/installation
  why: Official Next.js 15 installation and setup guide
  critical: App Router structure, layout.tsx and page.tsx patterns

- url: https://nextjs.org/docs/app
  why: Complete App Router documentation
  section: Routing, Layouts, Pages, Components
  critical: File-based routing conventions, layout nesting

- url: https://nextjs.org/blog/next-15
  why: Next.js 15 release notes and new features
  critical: React 19 support, caching changes, Turbopack stability
  note: Caching defaults changed to uncached for GET routes

- url: https://react.dev/blog/2024/12/05/react-19
  why: React 19 stable release features and breaking changes
  critical: Actions API, Server Components, new hooks (useActionState)
  note: useFormState replaced by useActionState

- url: https://tailwindcss.com/docs/guides/nextjs
  why: Official Tailwind CSS setup for Next.js
  critical: PostCSS configuration, globals.css import pattern
  note: Tailwind v4 uses zero-config but we can add config for customization

- url: https://ui.shadcn.com/docs/react-19
  why: React 19 compatibility notes for UI components
  critical: Understanding React 19 changes that affect UI libraries

- file: apps/web/next.config.ts
  why: Existing Next.js configuration with workspace integration
  pattern: Shows transpilePackages for monorepo, i18n setup, security headers
  note: Environment validation already configured

- file: apps/web/package.json
  why: Existing dependencies and scripts
  note: Next.js 15, React 19, Tailwind CSS already installed

- file: apps/web/tsconfig.json
  why: TypeScript configuration with workspace references
  pattern: Path mappings already set up (@/, @iraqi-ai/*)

- file: apps/web/src/config/env.ts
  why: Environment configuration pattern
  pattern: Zod validation, type-safe env access
  note: Already validates all required env vars

- file: PRPs/typescript-foundation-setup.md
  why: Reference for TypeScript setup patterns
  pattern: Shows how workspace integration works

- docfile: node_modules/tailwindcss/stubs/tailwind.config.ts
  why: TypeScript Tailwind config stub
  pattern: Type-safe config pattern
```

### Current Codebase Tree (relevant parts)

```bash
aqlix-ai/
├── apps/
│   └── web/
│       ├── next.config.ts         # EXISTS - Configured with workspace, i18n, headers
│       ├── package.json           # EXISTS - Next 15, React 19, Tailwind installed
│       ├── tsconfig.json          # EXISTS - TypeScript with workspace refs
│       ├── playwright.config.ts   # EXISTS - E2E testing configured
│       ├── src/
│       │   ├── app/               # EMPTY - No layout, pages, or globals.css
│       │   ├── config/
│       │   │   └── env.ts         # EXISTS - Zod env validation
│       │   ├── lib/
│       │   │   └── supabase/      # EXISTS - Supabase client setup
│       │   ├── middleware.ts      # EXISTS - Next.js middleware
│       │   └── types/
│       │       └── env.d.ts       # EXISTS - Environment types
│       └── tests/
│           └── e2e/               # EXISTS - Playwright tests
├── packages/                      # EXISTS - Workspace packages
│   ├── ui/                        # @iraqi-ai/ui
│   ├── types/                     # @iraqi-ai/types
│   ├── features/                  # @iraqi-ai/features
│   ├── api-client/                # @iraqi-ai/api-client
│   └── arabic-nlp/                # @iraqi-ai/arabic-nlp
└── examples/                      # Reference implementations

# NOTE: apps/web/src/app directory is completely EMPTY
# NO tailwind.config.ts or postcss.config.mjs exists yet
# NO globals.css exists yet
```

### Desired Codebase Tree with Files to be Added

```bash
aqlix-ai/apps/web/
├── tailwind.config.ts             # NEW - Tailwind configuration with content paths
├── postcss.config.mjs             # NEW - PostCSS with Tailwind plugin
├── src/
│   └── app/
│       ├── globals.css            # NEW - Tailwind imports and global styles
│       ├── layout.tsx             # NEW - Root layout with HTML structure
│       ├── page.tsx               # NEW - Home page component
│       ├── about/
│       │   └── page.tsx           # NEW - About page (routing example)
│       ├── components/            # NEW - App-specific components
│       │   ├── header.tsx         # NEW - Header navigation component
│       │   └── footer.tsx         # NEW - Footer component
│       └── error.tsx              # NEW - Error boundary component
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Next.js 15 + React 19 specific issues

// 1. Caching Changes in Next.js 15
// GET Route Handlers and Client Router Cache are now UNCACHED by default
// This is a BREAKING CHANGE from Next.js 14
// If you need caching, explicitly set cache headers

// 2. React 19 Breaking Changes
// - useFormState is replaced by useActionState
// - Server Components are now stable (no longer experimental)
// - New Actions API for form handling

// 3. Tailwind CSS v4 Zero-Config
// - No tailwind.config.js generated by default
// - Can still create one for customization
// - Uses @import "tailwindcss" instead of @tailwind directives

// 4. App Router File Conventions
// - layout.tsx: Shared UI for route segments (preserves state)
// - page.tsx: Unique UI for a route (unmounts on navigation)
// - error.tsx: Error UI boundary
// - loading.tsx: Loading UI with Suspense
// - not-found.tsx: 404 UI

// 5. Turbopack in Next.js 15
// Turbopack is now stable for dev mode (use --turbo flag)
// GOTCHA: Some plugins may not work with Turbopack yet
// Current script uses: "dev": "next dev --turbo --port 3000"

// 6. Workspace Package Imports
// CRITICAL: Ensure transpilePackages in next.config.ts includes all workspace packages
// Already configured: "@/types", "@/ui", "@/features", "@/api-client", "@/arabic-nlp"

// 7. TypeScript with App Router
// - All components are Server Components by default
// - Add 'use client' directive for client components
// - Server Components cannot use hooks or browser APIs

// 8. Metadata API
// Use generateMetadata() or export metadata object in layouts/pages
// Replaces next/head in App Router

// 9. CSS Import Order
// globals.css must be imported in layout.tsx, not _app.tsx (Pages Router pattern)
// Tailwind base/components/utilities will be automatically included

// 10. Bun + Next.js
// Bun works great with Next.js but ensure using Bun for all commands
// Some npm-specific features may behave differently
```

## Implementation Blueprint

### Data Models and Structure

Since this is frontend infrastructure setup, we don't have database models.
However, we establish TypeScript types for component props and layouts:

```typescript
// Component prop types follow existing patterns from workspace packages
// Example: Basic prop interfaces for layouts

interface RootLayoutProps {
  children: React.ReactNode;
}

interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}

// Re-use existing types from @iraqi-ai/types workspace package
```

### List of Tasks (in order of completion)

```yaml
Task 1: Create Tailwind CSS Configuration Files
  DESCRIPTION: Set up Tailwind CSS v4 with TypeScript config and PostCSS

  CREATE apps/web/tailwind.config.ts:
    - Use TypeScript for type safety
    - Set content paths for all files that use Tailwind
    - Include workspace packages in content array
    - Configure theme extensions (fonts, colors) - basic only
    - Export config satisfying Tailwind Config type

  CREATE apps/web/postcss.config.mjs:
    - Use ESM format (.mjs extension)
    - Configure @tailwindcss/postcss plugin
    - No other plugins needed for basic setup

  VALIDATION:
    - Config files have no TypeScript errors
    - Content paths cover all component locations

Task 2: Create Global Styles File
  DESCRIPTION: Set up globals.css with Tailwind imports and base styles

  CREATE apps/web/src/app/globals.css:
    - Import Tailwind CSS using @import "tailwindcss"
    - Add CSS custom properties for theme (optional, basic only)
    - Include body defaults (font, background)
    - Keep minimal - no complex styles yet

  PATTERN: Follow Tailwind v4 import pattern
  NOTE: Do NOT use old @tailwind directives

  VALIDATION:
    - File imports without errors
    - CSS variables defined correctly

Task 3: Create Root Layout Component
  DESCRIPTION: Build the root layout with HTML structure and global imports

  CREATE apps/web/src/app/layout.tsx:
    - Import globals.css (must be in root layout)
    - Define RootLayout component with children prop
    - Return proper HTML structure (<html>, <body>)
    - Set lang="en" on <html> (i18n already in next.config.ts)
    - Add viewport and metadata exports
    - Keep Server Component (no 'use client')

  CRITICAL: This is the root of all pages, must have HTML structure
  PATTERN: Standard Next.js App Router root layout

  VALIDATION:
    - Layout renders without errors
    - globals.css imported and applied
    - HTML structure valid

Task 4: Create Home Page Component
  DESCRIPTION: Build the main landing page with basic content

  CREATE apps/web/src/app/page.tsx:
    - Default export function named Home or Page
    - Use Tailwind classes for styling
    - Include heading with Iraqi AI Chat System title
    - Add basic welcome content
    - Demonstrate Tailwind utility classes
    - Keep Server Component initially

  VALIDATION:
    - Page renders at localhost:3000
    - Tailwind classes apply correctly
    - No console errors

Task 5: Create Header and Footer Components
  DESCRIPTION: Build reusable navigation and footer components

  CREATE apps/web/src/app/components/header.tsx:
    - Export Header component
    - Include navigation with basic links
    - Use Tailwind for styling
    - Keep responsive (mobile-friendly)
    - Server Component (no interactivity yet)

  CREATE apps/web/src/app/components/footer.tsx:
    - Export Footer component
    - Basic copyright and links
    - Tailwind styling
    - Server Component

  UPDATE apps/web/src/app/layout.tsx:
    - Import Header and Footer
    - Wrap children with Header and Footer
    - Maintain proper layout structure

  VALIDATION:
    - Header and Footer visible on all pages
    - Navigation renders correctly
    - Layout structure maintained

Task 6: Create Example Route (About Page)
  DESCRIPTION: Demonstrate App Router routing with a second page

  CREATE apps/web/src/app/about/page.tsx:
    - Follow same pattern as home page
    - Include different content
    - Use Tailwind for styling
    - Demonstrate nested routing

  UPDATE apps/web/src/app/components/header.tsx:
    - Add Link to About page using next/link
    - Show active state (optional)

  VALIDATION:
    - Navigation to /about works
    - Layout persists between routes
    - Shared header/footer maintained

Task 7: Create Error Boundary
  DESCRIPTION: Add error handling UI for the application

  CREATE apps/web/src/app/error.tsx:
    - Must be Client Component ('use client')
    - Accept error and reset props
    - Display user-friendly error message
    - Include reset button
    - Use Tailwind for styling

  PATTERN: Follow Next.js error.tsx conventions

  VALIDATION:
    - Error boundary catches runtime errors
    - Reset button works
    - UI is user-friendly

Task 8: Test Development Workflow
  DESCRIPTION: Verify hot reload and development experience

  TEST STEPS:
    1. Run `bun run dev`
    2. Verify server starts on port 3000
    3. Make change to page.tsx
    4. Verify hot reload without full refresh
    5. Test Tailwind class changes update instantly
    6. Check browser console for errors

  VALIDATION:
    - Dev server starts successfully
    - Hot reload works for all file types
    - No console errors
    - Changes appear immediately

Task 9: Test Production Build
  DESCRIPTION: Ensure production build works correctly

  TEST STEPS:
    1. Run `bun run build`
    2. Verify build completes without errors
    3. Run `bun run start`
    4. Test production server
    5. Verify optimizations applied

  VALIDATION:
    - Build succeeds with no errors
    - Production server runs
    - Pages render correctly in production
    - No runtime errors

Task 10: Verify Workspace Integration
  DESCRIPTION: Test that workspace packages can be imported

  TEST:
    - Try importing from @iraqi-ai/types
    - Try importing from @iraqi-ai/ui (if any exports exist)
    - Verify TypeScript recognizes imports
    - Ensure no module resolution errors

  OPTIONAL (if packages have exports):
    - Import and use a type from @iraqi-ai/types
    - Import a component from @iraqi-ai/ui

  VALIDATION:
    - Workspace imports work without errors
    - TypeScript resolves paths correctly
    - No build/runtime issues
```

### Per Task Pseudocode

```typescript
// Task 1: Tailwind Configuration
// apps/web/tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  // CRITICAL: Include all paths where Tailwind classes are used
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // Include workspace packages that use Tailwind
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Keep minimal for now - can extend later
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Already installed: @tailwindcss/typography, @tailwindcss/forms, @tailwindcss/aspect-ratio
    // Add if needed: require('@tailwindcss/typography'),
  ],
} satisfies Config;

export default config;

// ---

// apps/web/postcss.config.mjs

const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;

// ---

// Task 2: Global Styles
// apps/web/src/app/globals.css

@import "tailwindcss";

/* CSS Custom Properties (optional, basic) */
:root {
  --background: #ffffff;
  --foreground: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;
    --foreground: #ffffff;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: system-ui, -apple-system, sans-serif;
}

// ---

// Task 3: Root Layout
// apps/web/src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css'; // CRITICAL: Import in root layout

export const metadata: Metadata = {
  title: 'Iraqi AI Chat System',
  description: 'Advanced AI chat with Iraqi dialect support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}

// ---

// Task 4: Home Page
// apps/web/src/app/page.tsx

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Iraqi AI Chat System
        </h1>
        <p className="text-lg text-gray-600">
          Next.js 15 + React 19 + Tailwind CSS
        </p>
      </div>
    </main>
  );
}

// ---

// Task 5: Header Component
// apps/web/src/app/components/header.tsx

import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Iraqi AI
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}

// apps/web/src/app/components/footer.tsx

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
        © 2025 Iraqi AI Chat System. All rights reserved.
      </div>
    </footer>
  );
}

// UPDATE apps/web/src/app/layout.tsx to include Header and Footer
// Wrap children with Header and Footer components

// ---

// Task 6: About Page
// apps/web/src/app/about/page.tsx

export default function About() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-gray-700">
        Iraqi AI Chat System - Modern chat application built with Next.js 15
      </p>
    </main>
  );
}

// ---

// Task 7: Error Boundary
// apps/web/src/app/error.tsx

'use client'; // CRITICAL: Must be Client Component

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

### Integration Points

```yaml
WORKSPACE_PACKAGES:
  - action: "Import from workspace packages using @iraqi-ai/* aliases"
  - note: "Path mappings already configured in tsconfig.json"
  - test: "Try importing type from @iraqi-ai/types in a component"

NEXT_CONFIG:
  - already_configured: "transpilePackages includes all workspace packages"
  - already_configured: "i18n with locales: ['en', 'ar', 'ar-IQ']"
  - already_configured: "Security headers and RTL support"
  - no_changes_needed: "Configuration is complete"

ENVIRONMENT:
  - already_configured: "env.ts with Zod validation"
  - already_configured: "Environment types in env.d.ts"
  - import_pattern: "import { env } from '@/config/env'"
  - no_changes_needed: "Environment setup is complete"

TYPESCRIPT:
  - already_configured: "tsconfig.json with workspace references"
  - already_configured: "Path mappings for @/ and @iraqi-ai/*"
  - verify: "Run bun run typecheck to ensure no errors"

SCRIPTS:
  - dev: "bun run dev (already uses --turbo flag)"
  - build: "bun run build (configured in package.json)"
  - test: "Playwright E2E tests already set up"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding

# TypeScript type checking
bun run typecheck
# Expected: No errors. If errors, read and fix type issues.

# ESLint (if configured)
bun run lint
# Expected: No linting errors. Fix any issues found.

# Check Next.js configuration
bun run build --dry-run
# Expected: Configuration valid, no errors.
```

### Level 2: Development Server Test

```bash
# Start development server
bun run dev

# Verify in browser:
# 1. Navigate to http://localhost:3000
# 2. Check that home page renders
# 3. Verify Tailwind classes apply (inspect element)
# 4. Click navigation to /about
# 5. Check header/footer persist across routes
# 6. Open browser console - should be no errors

# Test hot reload:
# 1. Edit apps/web/src/app/page.tsx
# 2. Save file
# 3. Verify change appears without full refresh
# 4. Edit Tailwind classes
# 5. Verify styles update instantly

# Expected:
# - Server starts without errors
# - Pages render correctly
# - Tailwind styling works
# - Hot reload updates instantly
# - No console errors
```

### Level 3: Production Build Test

```bash
# Build for production
bun run build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Creating an optimized production build
# ✓ Collecting page data
# ✓ Finalizing page optimization

# Start production server
bun run start

# Test in browser:
# 1. Navigate to http://localhost:3000
# 2. Verify all pages work
# 3. Check network tab for optimized bundles
# 4. Verify no errors in console

# Expected:
# - Build completes successfully
# - Production server runs
# - All routes accessible
# - Optimizations applied (check bundle sizes)
```

### Level 4: Workspace Integration Test

```typescript
// Test workspace imports in a component

// apps/web/src/app/test-imports.tsx (temporary test file)

// Try importing from workspace packages
import type { SomeType } from '@iraqi-ai/types'; // if exports exist
// import { SomeComponent } from '@iraqi-ai/ui'; // if exports exist

export default function TestImports() {
  return <div>Testing workspace imports</div>;
}

// Run typecheck
// bun run typecheck

// Expected: No module resolution errors, TypeScript recognizes imports
```

```bash
# Verify workspace integration
bun run typecheck

# Expected:
# - No "Cannot find module" errors
# - All @iraqi-ai/* imports resolve correctly
# - TypeScript compilation succeeds
```

## Final Validation Checklist

- [ ] All config files created (tailwind.config.ts, postcss.config.mjs)
- [ ] globals.css created with Tailwind import
- [ ] Root layout created with proper HTML structure
- [ ] Home page renders successfully
- [ ] About page demonstrates routing
- [ ] Header and Footer components created and integrated
- [ ] Error boundary implemented
- [ ] Development server runs: `bun run dev`
- [ ] Hot reload works for all file types
- [ ] Production build succeeds: `bun run build`
- [ ] Production server runs: `bun run start`
- [ ] TypeScript type checking passes: `bun run typecheck`
- [ ] Linting passes (if configured): `bun run lint`
- [ ] Tailwind CSS classes apply correctly
- [ ] All routes accessible (/, /about)
- [ ] No console errors in browser
- [ ] Workspace packages can be imported (@iraqi-ai/*)
- [ ] Next.js configuration unchanged (already optimized)
- [ ] No changes needed to environment setup (already complete)

---

## Anti-Patterns to Avoid

- ❌ Don't use old @tailwind directives - use @import "tailwindcss" for v4
- ❌ Don't import globals.css in pages - must be in root layout only
- ❌ Don't add 'use client' unnecessarily - keep Server Components by default
- ❌ Don't use useFormState - React 19 uses useActionState instead
- ❌ Don't modify next.config.ts - it's already configured correctly
- ❌ Don't create custom _app.tsx or _document.tsx - use App Router patterns
- ❌ Don't use next/head - use Metadata API in App Router
- ❌ Don't install additional Tailwind plugins unless needed
- ❌ Don't add complex features - this PRP is ONLY for basic setup
- ❌ Don't add Arabic support, RTL, or cultural features - those are separate PRPs
- ❌ Don't add chat functionality - that's a separate feature
- ❌ Don't modify tsconfig.json - TypeScript is already configured
- ❌ Don't change environment configuration - it's already complete

---

## Additional Notes

**Scope Limitations:**
- This PRP covers ONLY Next.js application setup
- NO chat features, Arabic support, or cultural compliance
- NO payment integrations or Iraqi-specific features
- NO authentication or user management
- Those features belong in separate PRPs

**What's Already Done:**
- TypeScript configuration (tsconfig.json, tsconfig.base.json)
- Environment variable setup (env.ts with Zod validation)
- Next.js configuration (next.config.ts with i18n, headers, workspace)
- Supabase client setup (lib/supabase/*)
- E2E testing setup (Playwright)
- Workspace package structure

**What This PRP Adds:**
- App Router directory structure
- Tailwind CSS configuration
- Global styles
- Basic layouts and pages
- Component organization
- Routing examples
- Error handling
- Development workflow validation

**Next Steps After This PRP:**
- Arabic RTL support (separate PRP)
- Cultural validation integration (separate PRP)
- Chat interface components (separate PRP)
- Authentication flow (separate PRP)
- Payment integration (separate PRP)

---

## PRP Confidence Score: 9/10

**Why 9/10:**
- ✅ All necessary documentation URLs provided with specific sections
- ✅ Clear task breakdown with specific file paths
- ✅ Existing codebase thoroughly analyzed
- ✅ Known gotchas documented (Next.js 15 changes, React 19 breaking changes)
- ✅ Validation gates are executable and specific
- ✅ TypeScript patterns from existing code referenced
- ✅ Anti-patterns clearly listed
- ✅ Workspace integration already understood and documented
- ✅ Tailwind v4 zero-config approach explained

**Minor Risk (-1):**
- Potential version-specific edge cases with Next.js 15 + React 19 + Tailwind v4 combination
- All three are relatively new (React 19 just went stable in Dec 2024)
- However, risk is minimal because:
  - Dependencies already installed in package.json
  - Documentation is comprehensive
  - Patterns are well-established

**Mitigation:**
- Follow official documentation closely
- Test each component after creation
- Use provided validation loops at each step
- Refer to existing Next.js config for workspace integration patterns

This PRP provides sufficient context for one-pass implementation with high confidence.
