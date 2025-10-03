# name: "Basic Routing System - Next.js 15 App Router Setup"
description: |
  Comprehensive PRP for implementing foundational routing infrastructure with Next.js 15 App Router,
  including navigation components with active states, route groups for organization, dynamic routes,
  and proper error handling. Context-rich for one-pass implementation success.

---

## Goal

Set up a **complete and well-organized routing system** for the Iraqi AI Chat System using Next.js 15 App Router that provides:
- Clean navigation between pages with active link highlighting
- Organized route structure using route groups
- Dynamic route parameter handling
- Type-safe navigation with TypeScript
- Proper error handling and 404 pages (enhance existing)
- SEO-friendly URL patterns

**End State**: A production-ready routing foundation that supports future feature expansion without architectural changes.

## Why

- **User Experience**: Intuitive navigation is fundamental to any web application
- **Scalability**: Proper route organization prevents routing chaos as the app grows
- **Developer Experience**: Type-safe routing reduces bugs and improves productivity
- **Performance**: Leverages Next.js 15 prefetching and optimizations for fast navigation
- **Foundation**: Routing infrastructure enables all future features (chat, documents, payments, etc.)

**Impact**: This is the navigation backbone of the Iraqi AI Chat System - every user interaction depends on it.

## What

Enhance the existing basic routing setup with:

### User-Visible Behavior
- Navigation bar with active link highlighting (know where you are)
- Smooth client-side navigation between pages
- Dynamic routes for user profiles, documents, etc.
- Organized URLs that make sense (e.g., `/dashboard/settings`, `/docs/[slug]`)
- Proper 404 and error pages (already exist, may enhance)

### Technical Requirements
- Route groups for logical organization: `(marketing)`, `(app)`, `(auth)`
- Dynamic routes with type-safe parameters
- Active link detection using `usePathname()`
- Navigation components as client components (required for hooks)
- TypeScript types for all route parameters
- Test coverage for navigation flows

### Success Criteria

- [ ] Navigation bar shows active state for current route
- [ ] Route groups organize app into logical sections without affecting URLs
- [ ] At least 2 dynamic routes implemented with parameter extraction
- [ ] All navigation links use Next.js `<Link>` component with proper prefetching
- [ ] TypeScript provides type safety for route parameters
- [ ] Playwright tests validate navigation flows
- [ ] All lint and type checks pass
- [ ] No console errors or warnings in browser

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Official Next.js 15 Documentation
- url: https://nextjs.org/docs/app/building-your-application/routing
  why: Core App Router concepts, pages, layouts, routing fundamentals
  key_concepts:
    - File-system based routing (folders = route segments)
    - page.tsx creates routes, layout.tsx creates shared UI
    - Nested routes via folder nesting
    - Root layout MUST contain <html> and <body>

- url: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
  why: Link component, usePathname, useRouter, navigation patterns
  key_concepts:
    - <Link> component for client-side navigation
    - Automatic prefetching when links enter viewport
    - usePathname() for active link detection (client component only)
    - useRouter() for programmatic navigation

- url: https://nextjs.org/docs/app/building-your-application/routing/route-groups
  why: Organizing routes without affecting URL structure
  key_concepts:
    - (folderName) syntax excludes folder from URL path
    - Use for organizing by feature/team/concern
    - Can create multiple root layouts
    - Routes in different groups cannot resolve to same URL

- url: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
  why: Parameter handling and type-safe routing
  key_concepts:
    - [slug] for dynamic segments
    - [...slug] for catch-all routes
    - [[...slug]] for optional catch-all
    - params prop typed with TypeScript

- url: https://nextjs.org/docs/app/building-your-application/routing/error-handling
  why: Error boundaries and 404 pages
  key_concepts:
    - error.tsx for error boundaries (must be client component)
    - not-found.tsx for 404 pages
    - Automatic error recovery with reset() function

# CRITICAL BLOG POSTS - Active Link Implementation
- url: https://spacejelly.dev/posts/how-to-style-active-links-in-next-js-app-router
  why: Practical guide for active link styling in App Router
  pattern: |
    'use client'
    import { usePathname } from 'next/navigation'

    const pathname = usePathname()
    const isActive = pathname === href
    className={isActive ? 'active-class' : 'default-class'}

- url: https://medium.com/@ShariarHasan/building-active-links-in-next-js-app-router-a-simple-guide-a3f47d646dc1
  why: Complete example with reusable NavLink component
  pattern: Client component wrapper for Link with pathname comparison

# CODEBASE PATTERNS - Learn from existing code
- file: apps/web/src/app/layout.tsx
  why: Root layout pattern - shows Header/Footer integration, metadata setup
  keep: Current structure with Header/Footer, HTML/body tags

- file: apps/web/src/app/components/header.tsx
  why: Current navigation - NEEDS ENHANCEMENT for active states
  todo: Convert to client component, add usePathname() for active detection

- file: apps/web/src/app/page.tsx
  why: Home page example - simple, clean pattern to follow

- file: apps/web/src/app/about/page.tsx
  why: Basic page example - shows standard page structure

- file: apps/web/src/app/not-found.tsx
  why: Existing 404 page - good pattern, may enhance styling

- file: apps/web/src/app/error.tsx
  why: Existing error boundary - client component pattern with useEffect

- file: examples/dyad-extracted/components/ui/navigation-menu.tsx
  why: Advanced navigation example using Radix UI
  note: Only reference if building complex dropdowns - keep it simple first

- file: apps/web/tests/e2e/arabic-rtl.spec.ts
  why: Playwright test patterns for navigation testing
  pattern: Use page.goto(), expect(element).toBeVisible(), navigation assertions

# PROJECT CONFIGURATION
- file: apps/web/tsconfig.json
  why: TypeScript path mappings for imports
  paths: '@/*' maps to './src/*', workspace packages configured

- file: apps/web/next.config.ts
  why: Next.js configuration, transpilePackages for monorepo
  note: Environment validation runs on startup
```

### Current Codebase Structure

```bash
apps/web/src/
├── app/                          # App Router directory
│   ├── layout.tsx               # Root layout (Header/Footer)
│   ├── page.tsx                 # Home page "/"
│   ├── error.tsx                # Error boundary (client component)
│   ├── not-found.tsx            # 404 page
│   ├── globals.css              # Global styles
│   ├── about/                   # /about route
│   │   └── page.tsx
│   ├── ui-test/                 # /ui-test route
│   │   └── page.tsx
│   └── components/              # App-specific components
│       ├── header.tsx           # Navigation header (NEEDS ENHANCEMENT)
│       └── footer.tsx           # Footer component
├── components/                   # Shared UI components
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ... (10+ components)
├── config/                      # Configuration
│   ├── env.ts                   # Environment validation
│   └── __tests__/
└── types/                       # TypeScript types
    └── env.d.ts

# KEY FILES TO MODIFY/CREATE:
# - apps/web/src/app/components/header.tsx → Convert to client component with active links
# - apps/web/src/app/(marketing)/... → New route group for marketing pages
# - apps/web/src/app/(app)/... → New route group for app pages
# - apps/web/src/app/docs/[slug]/page.tsx → Example dynamic route
# - apps/web/src/components/navigation/ → New navigation components
```

### Desired Codebase Structure (After Implementation)

```bash
apps/web/src/
├── app/
│   ├── layout.tsx                          # Root layout (unchanged)
│   ├── page.tsx                            # Home page → Move to (marketing)
│   ├── error.tsx                           # Global error boundary
│   ├── not-found.tsx                       # Global 404
│   ├── globals.css
│   │
│   ├── (marketing)/                        # PUBLIC: Marketing pages (no auth)
│   │   ├── page.tsx                        # Home "/" (moved from root)
│   │   ├── about/
│   │   │   └── page.tsx                    # "/about"
│   │   ├── pricing/
│   │   │   └── page.tsx                    # "/pricing" (new)
│   │   └── contact/
│   │       └── page.tsx                    # "/contact" (new)
│   │
│   ├── (app)/                              # PROTECTED: App pages (future auth)
│   │   ├── layout.tsx                      # App-specific layout (nav sidebar)
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # "/dashboard" (new)
│   │   ├── settings/
│   │   │   └── page.tsx                    # "/settings" (new)
│   │   └── profile/
│   │       └── page.tsx                    # "/profile" (new)
│   │
│   ├── docs/                               # DYNAMIC: Documentation
│   │   ├── page.tsx                        # "/docs" - docs home
│   │   └── [slug]/
│   │       └── page.tsx                    # "/docs/[slug]" - individual doc
│   │
│   ├── blog/                               # DYNAMIC: Blog posts
│   │   ├── page.tsx                        # "/blog" - blog home
│   │   └── [slug]/
│   │       └── page.tsx                    # "/blog/[slug]" - individual post
│   │
│   └── components/
│       ├── header.tsx                      # REMOVED (move to components/navigation)
│       └── footer.tsx
│
├── components/
│   ├── navigation/                         # NEW: Navigation components
│   │   ├── marketing-nav.tsx              # Marketing nav (home, about, etc)
│   │   ├── app-nav.tsx                    # App nav (dashboard, settings, etc)
│   │   ├── nav-link.tsx                   # Reusable active link component
│   │   └── mobile-nav.tsx                 # Mobile navigation (future)
│   └── ui/                                 # (unchanged)
│
└── types/
    └── routes.ts                           # NEW: Route parameter types

# RESPONSIBILITIES:
# - (marketing)/ → Public marketing content, SEO pages
# - (app)/ → Protected app pages (auth added later)
# - docs/[slug]/ → Dynamic documentation pages
# - blog/[slug]/ → Dynamic blog posts
# - components/navigation/ → All navigation UI components
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Next.js 15 App Router Gotchas

// 1. usePathname REQUIRES Client Component
// ❌ WRONG - This will error
import { usePathname } from 'next/navigation'
export default function Nav() {
  const pathname = usePathname() // Error: usePathname must be used in client component
}

// ✅ CORRECT - Add "use client" directive
'use client'
import { usePathname } from 'next/navigation'
export default function Nav() {
  const pathname = usePathname() // Works!
}

// 2. Route Groups - URL Collision Error
// ❌ WRONG - Same URL in different groups
// app/(marketing)/about/page.tsx  → /about
// app/(shop)/about/page.tsx        → /about  (ERROR! Duplicate route)

// ✅ CORRECT - Unique URLs per route group
// app/(marketing)/about/page.tsx   → /about
// app/(shop)/info/page.tsx         → /info

// 3. Multiple Root Layouts - Full Page Reload
// When navigating between route groups with different root layouts:
// app/(marketing)/layout.tsx (custom root layout)
// app/(shop)/layout.tsx (different root layout)
// Navigation triggers FULL PAGE RELOAD (not SPA navigation)
// SOLUTION: Use same root layout, vary child layouts only

// 4. Dynamic Route Params - Type Safety
// ✅ CORRECT - Type your params
interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params
  // Now slug is typed!
}

// 5. Link Prefetching - Performance Gotcha
// By default, ALL links prefetch when visible
// Can disable for dynamic content:
<Link href="/heavy-page" prefetch={false}>
  No Prefetch
</Link>

// 6. Navigation Events - No Router Events in App Router
// ❌ OLD (Pages Router): router.events.on('routeChangeStart', ...)
// ✅ NEW (App Router): Use loading.tsx and Suspense instead

// 7. Metadata - Must be Server Component or Exported Object
export const metadata = {
  title: 'Page Title',
  description: 'Description',
}
// Cannot use hooks like usePathname in metadata generation

// 8. Active Link Detection - Exact vs Partial Match
const pathname = usePathname()

// Exact match
const isActive = pathname === '/dashboard'  // Only matches /dashboard

// Partial match (for nested routes)
const isActive = pathname.startsWith('/dashboard')  // Matches /dashboard, /dashboard/settings, etc.

// Better pattern for nested routes:
const isActive = pathname === href || pathname.startsWith(`${href}/`)
```

## Implementation Blueprint

### Phase 1: Enhance Navigation with Active States

Convert existing header to client component with active link detection.

```typescript
// apps/web/src/components/navigation/nav-link.tsx
// PATTERN: Reusable active link component
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'  // From existing shadcn setup

interface NavLinkProps {
  href: string
  children: React.ReactNode
  exact?: boolean  // Exact match vs starts-with match
  className?: string
  activeClassName?: string
}

export function NavLink({
  href,
  children,
  exact = true,
  className,
  activeClassName = 'text-blue-600 font-semibold',
}: NavLinkProps) {
  const pathname = usePathname()

  // Determine if link is active
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-blue-600',
        isActive ? activeClassName : 'text-gray-700',
        className
      )}
    >
      {children}
    </Link>
  )
}

// apps/web/src/components/navigation/marketing-nav.tsx
// PATTERN: Marketing navigation with active states
'use client'

import Link from 'next/link'
import { NavLink } from './nav-link'

export function MarketingNav() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Iraqi AI
        </Link>
        <div className="flex gap-4">
          <NavLink href="/" exact>
            Home
          </NavLink>
          <NavLink href="/about" exact>
            About
          </NavLink>
          <NavLink href="/pricing" exact>
            Pricing
          </NavLink>
          <NavLink href="/contact" exact>
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
```

### Phase 2: Create Route Groups Structure

Organize routes into logical groups without affecting URLs.

```typescript
// apps/web/src/app/(marketing)/layout.tsx
// PATTERN: Marketing-specific layout (no root HTML, use child layout)
import { MarketingNav } from '@/components/navigation/marketing-nav'
import { Footer } from '@/app/components/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

// apps/web/src/app/(marketing)/page.tsx
// MOVED from apps/web/src/app/page.tsx
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Iraqi AI Chat System</h1>
        <p className="text-lg text-gray-600">
          Next.js 15 + React 19 + Tailwind CSS
        </p>
      </div>
    </div>
  )
}

// apps/web/src/app/(app)/layout.tsx
// PATTERN: App-specific layout with sidebar navigation (placeholder)
import { AppNav } from '@/components/navigation/app-nav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AppNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

### Phase 3: Implement Dynamic Routes

Create type-safe dynamic routes with parameter extraction.

```typescript
// apps/web/src/types/routes.ts
// PATTERN: Type-safe route parameters
export interface DocPageParams {
  slug: string
}

export interface BlogPageParams {
  slug: string
}

// apps/web/src/app/docs/[slug]/page.tsx
// PATTERN: Dynamic route with typed params
import { DocPageParams } from '@/types/routes'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<DocPageParams>
}

// Mock docs data (replace with real data fetching)
const docs = {
  'getting-started': { title: 'Getting Started', content: '...' },
  'api-reference': { title: 'API Reference', content: '...' },
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params

  const doc = docs[slug as keyof typeof docs]

  if (!doc) {
    notFound()  // Triggers not-found.tsx
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>
      <div className="prose prose-lg">
        {doc.content}
      </div>
    </article>
  )
}

// Generate static params for known docs (optional, for static generation)
export async function generateStaticParams() {
  return [
    { slug: 'getting-started' },
    { slug: 'api-reference' },
  ]
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const doc = docs[slug as keyof typeof docs]

  return {
    title: doc ? `${doc.title} | Iraqi AI Docs` : 'Doc Not Found',
    description: doc ? `Documentation: ${doc.title}` : undefined,
  }
}
```

### List of Tasks (Implementation Order)

```yaml
Task 1: Create reusable navigation components
  CREATE apps/web/src/components/navigation/nav-link.tsx:
    - Client component with "use client" directive
    - Import Link from next/link, usePathname from next/navigation
    - Accept href, children, exact, className, activeClassName props
    - Compare pathname to href for active state detection
    - Return Link with conditional className based on isActive
    - Use cn() utility from existing @/lib/utils

  CREATE apps/web/src/components/navigation/marketing-nav.tsx:
    - Client component using NavLink components
    - Navigation bar with Home, About, Pricing, Contact links
    - Iraqi AI logo/brand
    - Responsive layout with Tailwind

  CREATE apps/web/src/components/navigation/app-nav.tsx:
    - Client component for app section
    - Sidebar-style navigation (or top nav)
    - Links: Dashboard, Settings, Profile
    - Active state highlighting

Task 2: Set up route groups structure
  CREATE apps/web/src/app/(marketing)/layout.tsx:
    - Server component (no "use client")
    - Import MarketingNav and Footer
    - Render MarketingNav, children, Footer
    - NO <html> or <body> tags (not root layout)

  MOVE apps/web/src/app/page.tsx → apps/web/src/app/(marketing)/page.tsx:
    - Keep same content, just move file

  MOVE apps/web/src/app/about/page.tsx → apps/web/src/app/(marketing)/about/page.tsx:
    - Keep same content, just move file

  CREATE apps/web/src/app/(marketing)/pricing/page.tsx:
    - Basic pricing page placeholder
    - Container with pricing info

  CREATE apps/web/src/app/(marketing)/contact/page.tsx:
    - Basic contact page placeholder
    - Container with contact form or info

Task 3: Create app route group
  CREATE apps/web/src/app/(app)/layout.tsx:
    - Import AppNav component
    - Render AppNav and children in flex layout
    - Sidebar + main content area

  CREATE apps/web/src/app/(app)/dashboard/page.tsx:
    - Dashboard page placeholder
    - "Dashboard" heading + description

  CREATE apps/web/src/app/(app)/settings/page.tsx:
    - Settings page placeholder
    - "Settings" heading + description

  CREATE apps/web/src/app/(app)/profile/page.tsx:
    - Profile page placeholder
    - "Profile" heading + description

Task 4: Implement dynamic routes
  CREATE apps/web/src/types/routes.ts:
    - Export DocPageParams interface { slug: string }
    - Export BlogPageParams interface { slug: string }

  CREATE apps/web/src/app/docs/page.tsx:
    - Docs homepage listing all docs
    - Links to individual doc pages

  CREATE apps/web/src/app/docs/[slug]/page.tsx:
    - Import DocPageParams type
    - Type params prop correctly
    - Extract slug from params (await params)
    - Fetch doc content (mock data for now)
    - Call notFound() if doc doesn't exist
    - Render article with doc title and content
    - Implement generateMetadata for SEO
    - Implement generateStaticParams for known docs

  CREATE apps/web/src/app/blog/page.tsx:
    - Blog homepage listing all posts
    - Links to individual blog posts

  CREATE apps/web/src/app/blog/[slug]/page.tsx:
    - Similar pattern to docs/[slug]/page.tsx
    - Mock blog post data
    - Type-safe params with BlogPageParams

Task 5: Update root layout
  MODIFY apps/web/src/app/layout.tsx:
    - KEEP <html> and <body> tags (root layout requirement)
    - REMOVE Header and Footer imports (now in route group layouts)
    - Render only {children}
    - Keep metadata export
    - Keep globals.css import

Task 6: Delete old components
  DELETE apps/web/src/app/components/header.tsx:
    - Replaced by components/navigation/marketing-nav.tsx

  KEEP apps/web/src/app/components/footer.tsx:
    - Still used in marketing layout

Task 7: Add navigation utilities
  CREATE apps/web/src/lib/utils.ts (if not exists):
    - Export cn() function for className merging
    - Use clsx and tailwind-merge
    - Pattern: export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

  Note: This might already exist from shadcn/ui setup - check first

Task 8: Enhance error pages
  MODIFY apps/web/src/app/not-found.tsx (optional):
    - Improve styling to match brand
    - Add navigation back to home
    - Keep existing structure if already good

  MODIFY apps/web/src/app/error.tsx (optional):
    - Improve error message display
    - Add navigation options
    - Keep reset() functionality
```

### Integration Points

```yaml
TYPESCRIPT:
  - Update tsconfig.json (already configured):
    - paths: '@/*': ['./src/*']  ✅ Already set
    - strict mode enabled  ✅ Already set

  - Create types/routes.ts:
    - DocPageParams, BlogPageParams interfaces
    - Export for use in page components

COMPONENTS:
  - Create components/navigation/ directory:
    - nav-link.tsx (reusable active link)
    - marketing-nav.tsx (public pages nav)
    - app-nav.tsx (app pages nav)

  - Use existing shadcn/ui components:
    - Button, Card, etc. from components/ui/

LAYOUTS:
  - Root layout (apps/web/src/app/layout.tsx):
    - Keep minimal - just HTML wrapper
    - Remove Header/Footer (move to route groups)

  - Route group layouts:
    - (marketing)/layout.tsx - MarketingNav + Footer
    - (app)/layout.tsx - AppNav + main area

ROUTING:
  - File-based routing with App Router
  - Route groups: (marketing), (app)
  - Dynamic routes: docs/[slug], blog/[slug]
  - No changes to next.config.ts needed

TESTING:
  - Playwright tests for navigation flows
  - Pattern from apps/web/tests/e2e/arabic-rtl.spec.ts
  - Test active states, dynamic routes, error pages
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
cd apps/web

# Linting
bun run lint
# Expected: No errors
# If errors: Read the error message, fix the issue, re-run

# Type checking
bun run typecheck
# Expected: No type errors
# If errors: Add proper types, check async/await usage for params

# Format check (if configured)
# bun run format:check
```

### Level 2: Unit Tests (Future - Create test files)

```typescript
// tests/navigation/nav-link.test.tsx
import { render, screen } from '@testing-library/react'
import { NavLink } from '@/components/navigation/nav-link'

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/about',
}))

describe('NavLink', () => {
  test('applies active class when pathname matches', () => {
    render(
      <NavLink href="/about" activeClassName="active">
        About
      </NavLink>
    )

    const link = screen.getByText('About')
    expect(link).toHaveClass('active')
  })

  test('does not apply active class when pathname does not match', () => {
    render(
      <NavLink href="/contact" activeClassName="active">
        Contact
      </NavLink>
    )

    const link = screen.getByText('Contact')
    expect(link).not.toHaveClass('active')
  })
})
```

```bash
# Run unit tests (when created)
bun test
# Expected: All tests pass
# If failing: Read error, understand root cause, fix code (never mock to pass)
```

### Level 3: E2E Tests with Playwright

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between pages and show active states', async ({ page }) => {
    // Start at home
    await page.goto('/')
    await expect(page).toHaveURL('/')

    // Check home link is active
    const homeLink = page.locator('nav a[href="/"]')
    await expect(homeLink).toHaveClass(/text-blue-600/)

    // Navigate to about
    await page.click('a[href="/about"]')
    await expect(page).toHaveURL('/about')

    // Check about link is active
    const aboutLink = page.locator('nav a[href="/about"]')
    await expect(aboutLink).toHaveClass(/text-blue-600/)
  })

  test('should handle dynamic routes correctly', async ({ page }) => {
    await page.goto('/docs/getting-started')

    // Check page renders
    await expect(page.locator('h1')).toContainText('Getting Started')

    // Check URL matches
    await expect(page).toHaveURL('/docs/getting-started')
  })

  test('should show 404 for invalid dynamic route', async ({ page }) => {
    await page.goto('/docs/invalid-slug-xyz')

    // Should show not-found page
    await expect(page.locator('h2')).toContainText('404')
  })

  test('should navigate between route groups seamlessly', async ({ page }) => {
    // Marketing page
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()

    // App page
    await page.goto('/dashboard')
    await expect(page.locator('nav')).toBeVisible()

    // Should maintain navigation (no full page reload visual glitch)
  })
})
```

```bash
# Run E2E tests
bun run test:e2e
# Expected: All tests pass with no navigation errors
# If failing: Check browser console for errors, verify routes exist

# Run with UI for debugging
bun run test:e2e:ui
```

### Level 4: Manual Testing Checklist

```bash
# Start dev server
bun run dev

# Open http://localhost:3000 in browser
# Test these scenarios:

1. Active Link States:
   ✓ Home link highlighted when on "/"
   ✓ About link highlighted when on "/about"
   ✓ Pricing link highlighted when on "/pricing"
   ✓ Contact link highlighted when on "/contact"

2. Route Groups:
   ✓ Marketing pages show MarketingNav
   ✓ App pages show AppNav
   ✓ URLs don't include (marketing) or (app) in path
   ✓ Layouts apply correctly

3. Dynamic Routes:
   ✓ /docs loads docs homepage
   ✓ /docs/getting-started loads specific doc
   ✓ /docs/invalid-slug shows 404
   ✓ /blog/[slug] works similarly

4. Navigation Performance:
   ✓ Links prefetch on hover (network tab shows prefetch requests)
   ✓ Client-side navigation (no full page reload)
   ✓ Smooth transitions

5. Error Handling:
   ✓ /nonexistent-route shows 404 page
   ✓ Error boundary catches errors (test with throw new Error())
   ✓ Reset button works on error page

# Check browser console: 0 errors, 0 warnings
```

## Final Validation Checklist

- [ ] All tests pass: `bun test`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] E2E tests pass: `bun run test:e2e`
- [ ] Manual test: Active links highlight correctly
- [ ] Manual test: Route groups work without URL pollution
- [ ] Manual test: Dynamic routes load and show 404 for invalid slugs
- [ ] Manual test: Navigation is smooth (no full page reloads)
- [ ] Browser console: 0 errors, 0 warnings
- [ ] Lighthouse: Performance score > 90 (optional)
- [ ] Documentation: README updated with routing structure (optional)

---

## Anti-Patterns to Avoid

- ❌ Don't use `<a>` tags - always use Next.js `<Link>` component
- ❌ Don't use usePathname in Server Components - convert to Client Component
- ❌ Don't create duplicate URLs in different route groups
- ❌ Don't create multiple root layouts unless absolutely necessary (causes full page reload)
- ❌ Don't hardcode URLs - use constants or route helpers for maintainability
- ❌ Don't skip TypeScript types for route params - type safety prevents bugs
- ❌ Don't use router.events (Pages Router pattern) - use loading.tsx instead
- ❌ Don't prefetch heavy pages by default - use prefetch={false} when needed
- ❌ Don't forget to handle loading states with loading.tsx or Suspense
- ❌ Don't mix Server and Client Component patterns incorrectly

---

## Success Metrics

**Technical Metrics:**
- 100% type coverage for route params
- 0 linting/type errors
- All E2E tests passing
- <100ms navigation time (client-side)

**User Experience Metrics:**
- Clear visual feedback for active page
- Smooth navigation without flicker
- Intuitive URL structure
- Proper 404 handling

**Confidence Score: 9/10**

This PRP provides comprehensive context for one-pass implementation success, including:
- ✅ Complete documentation with specific URLs and key concepts
- ✅ Existing codebase patterns to follow
- ✅ Detailed implementation blueprint with pseudocode
- ✅ Known gotchas and solutions
- ✅ Type-safe patterns with TypeScript
- ✅ Testing strategy with executable commands
- ✅ Step-by-step task breakdown
- ✅ Integration points clearly defined

**Deduction of 1 point**: Complex routing patterns may require iteration, especially for dynamic route edge cases and SEO optimization. However, the foundation provided should enable successful implementation with minimal adjustments.
