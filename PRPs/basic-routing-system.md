name: "Basic Routing System for Iraqi AI Chat System"
description: |

## Purpose
Implement foundational routing system using Next.js 15 App Router with navigation components, route groups, and URL management for the Iraqi AI Chat System. This PRP provides comprehensive context and validation gates for one-pass implementation success.

---

## Goal
Implement a clean, foundational routing system for the Iraqi AI Chat System that enables navigation between pages, proper URL structure, and basic navigation components using Next.js 15 App Router patterns.

## Why
- **Foundation for Growth**: Establishes the routing infrastructure needed for future Iraqi-specific features (chat, documents, payments)
- **User Experience**: Provides intuitive navigation patterns that will support both Arabic RTL and English interfaces
- **SEO Readiness**: Clean URL structure with proper metadata handling for Iraqi market visibility
- **Scalable Architecture**: Route organization that supports the planned multi-agent system and professional domains

## What
User-visible behavior and technical requirements:

### Success Criteria
- [ ] Navigation between Home, About, and Contact pages works seamlessly
- [ ] Navigation bar highlights the currently active route
- [ ] Clean, SEO-friendly URLs (/, /about, /contact)
- [ ] 404 page displays for invalid routes
- [ ] Error boundary handles runtime navigation errors gracefully
- [ ] Mobile-responsive navigation for Iraqi users
- [ ] TypeScript type safety for all navigation components
- [ ] Fast navigation with Next.js Link prefetching

## All Needed Context

### Documentation & References (Required Reading)
```yaml
# CRITICAL: Next.js 15 App Router Official Documentation
- url: https://nextjs.org/docs/app/building-your-application/routing
  why: Core App Router concepts and file conventions
  
- url: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
  why: Link component usage and navigation patterns
  
- url: https://nextjs.org/docs/app/api-reference/functions/use-router
  why: useRouter hook in App Router (next/navigation not next/router)
  
- url: https://nextjs.org/docs/app/building-your-application/routing/route-groups
  why: Route organization with (folderName) syntax
  
- url: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
  why: 404 page handling and known limitations

# PREREQUISITE: Must complete this PRP first
- file: PRPs/nextjs-app-setup.md
  why: Establishes apps/web/ structure, Next.js 15, Bun workspace

# REFERENCE PATTERNS: Follow these existing components
- file: examples/dyad-extracted/components/ui/navigation-menu.tsx
  why: Navigation component structure and Radix UI integration
  
- file: examples/kortix-suna-extracted/frontend/agents/agent-config-modal.tsx
  why: useRouter usage pattern in existing codebase
```

### Current Codebase Structure
```bash
# Expected structure after Next.js App Setup PRP
aqlix-ai/
├── apps/web/                    # Next.js 15 application
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page  
│   │   └── globals.css         # Tailwind CSS
│   ├── components/
│   │   └── ui/                 # Future UI components
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── package.json            # Next.js 15 + React 19
│   ├── next.config.mjs         # Turbopack enabled
│   ├── tsconfig.json           # TypeScript configuration
│   └── tailwind.config.ts      # Tailwind with RTL prep
├── examples/dyad-extracted/     # Reference UI components
└── PRPs/                       # Implementation guides
```

### Target Codebase Structure (After This PRP)
```bash
apps/web/
├── app/
│   ├── (main)/                 # Route group for main pages
│   │   ├── about/
│   │   │   └── page.tsx        # About page
│   │   └── contact/
│   │       └── page.tsx        # Contact page
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page (updated)
│   ├── not-found.tsx           # Global 404 page
│   ├── error.tsx               # Global error boundary
│   └── loading.tsx             # Global loading UI
├── components/
│   └── navigation/
│       ├── nav-bar.tsx         # Main navigation component
│       ├── nav-link.tsx        # Individual nav link with active state
│       └── mobile-nav.tsx      # Mobile navigation drawer
├── lib/
│   ├── navigation.ts           # Navigation configuration
│   └── types.ts                # Navigation-related types
└── hooks/
    └── use-active-route.ts     # Custom hook for route detection
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Next.js 15 App Router Navigation Changes
// 1. Use next/navigation NOT next/router for App Router
import { useRouter } from 'next/navigation' // ✅ Correct
import { useRouter } from 'next/router'     // ❌ Pages Router only

// 2. Navigation hooks require 'use client' directive
'use client'  // Required for useRouter, usePathname, useSearchParams

// 3. Route Groups and not-found.tsx Known Issue
// Route groups (folderName) have broken not-found.tsx handling
// Workaround: Use catch-all routes or global not-found.tsx

// 4. Link component prefetching behavior
// Next.js 15 prefetches routes automatically when Link enters viewport
// Control with prefetch={false} if needed

// 5. Dynamic imports for mobile navigation
// Use dynamic imports for mobile-specific components to reduce bundle

// 6. Bun workspace imports  
import { cn } from '@/lib/utils'           // Local imports
import { Button } from '@/components/ui'   // Future workspace packages
```

## Implementation Blueprint

### Data Models and Structure
Create TypeScript interfaces for navigation system:
```typescript
// Navigation configuration types
interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

interface NavigationConfig {
  main: NavigationItem[];
  mobile: NavigationItem[];
  footer?: NavigationItem[];
}

// Component prop types
interface NavBarProps {
  className?: string;
}

interface NavLinkProps {
  item: NavigationItem;
  isActive: boolean;
  className?: string;
}
```

### List of Tasks to Complete the PRP (In Order)

```yaml
Task 1 - Route Organization Setup:
CREATE apps/web/app/(main)/ directory:
  - ORGANIZE main application routes in route group
  - PREPARE for future route groups (admin, auth, etc.)
  - AVOID URL path pollution with organizational folders

Task 2 - Basic Page Routes:
CREATE apps/web/app/(main)/about/page.tsx:
  - IMPLEMENT About page with basic Iraqi AI system description
  - FOLLOW existing page.tsx patterns from root
  - INCLUDE proper TypeScript PageProps interface

CREATE apps/web/app/(main)/contact/page.tsx:
  - IMPLEMENT Contact page with support information
  - PREPARE structure for future Iraqi contact methods
  - ENSURE responsive design with Tailwind classes

Task 3 - Navigation Configuration:
CREATE apps/web/lib/navigation.ts:
  - DEFINE navigation items configuration
  - STRUCTURE for main navigation and mobile navigation  
  - PREPARE for future Iraqi-specific menu items

CREATE apps/web/lib/types.ts:
  - DEFINE NavigationItem and NavigationConfig interfaces
  - EXPORT reusable navigation types
  - INCLUDE future extensibility for Iraqi features

Task 4 - Navigation Components:
CREATE apps/web/components/navigation/nav-link.tsx:
  - IMPLEMENT individual navigation link component
  - HANDLE active state highlighting with usePathname
  - FOLLOW Link component best practices

CREATE apps/web/components/navigation/nav-bar.tsx:
  - IMPLEMENT main navigation bar component
  - INTEGRATE nav-link components with active detection
  - PREPARE responsive design for Arabic RTL future support

CREATE apps/web/components/navigation/mobile-nav.tsx:
  - IMPLEMENT mobile navigation drawer/menu
  - USE dynamic import for performance optimization
  - ENSURE accessibility for Iraqi mobile users

Task 5 - Layout Integration:
MODIFY apps/web/app/layout.tsx:
  - INTEGRATE navigation component into root layout
  - MAINTAIN existing HTML structure and metadata
  - ENSURE navigation appears on all pages

Task 6 - Error Handling:
CREATE apps/web/app/not-found.tsx:
  - IMPLEMENT global 404 page with Iraqi branding preparation
  - INCLUDE navigation back to home page
  - PREPARE for future Arabic language support

CREATE apps/web/app/error.tsx:
  - IMPLEMENT error boundary for navigation errors
  - LOG errors appropriately without exposing system info
  - PROVIDE user-friendly error recovery options

Task 7 - Custom Navigation Hook:
CREATE apps/web/hooks/use-active-route.ts:
  - IMPLEMENT custom hook for active route detection
  - ABSTRACT usePathname logic for reusability
  - HANDLE complex route matching patterns

Task 8 - Navigation Testing:
UPDATE existing pages:
  - ENSURE all pages work with new navigation
  - TEST navigation state management
  - VERIFY mobile responsiveness
```

### Per Task Pseudocode

```typescript
// Task 3: Navigation Configuration
// lib/navigation.ts
export const navigationConfig: NavigationConfig = {
  main: [
    { title: 'Home', href: '/', description: 'Iraqi AI Chat System' },
    { title: 'About', href: '/about', description: 'Learn about our AI system' },
    { title: 'Contact', href: '/contact', description: 'Get support' }
  ],
  mobile: [
    // Same as main, but optimized for mobile layout
  ]
};

// Task 4: Navigation Link Component
// components/navigation/nav-link.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ item, className }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  
  return (
    <Link 
      href={item.href}
      className={cn(
        "nav-link-base-styles",
        isActive && "nav-link-active-styles",
        className
      )}
    >
      {item.title}
    </Link>
  )
}

// Task 4: Main Navigation Bar
// components/navigation/nav-bar.tsx  
'use client'
import { navigationConfig } from '@/lib/navigation'
import { NavLink } from './nav-link'

export function NavBar({ className }: NavBarProps) {
  return (
    <nav className={cn("nav-container", className)}>
      <div className="nav-content">
        <Link href="/" className="brand-logo">
          Iraqi AI Chat
        </Link>
        
        <div className="nav-links desktop-only">
          {navigationConfig.main.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
        
        <MobileNav className="mobile-only" />
      </div>
    </nav>
  )
}

// Task 6: Not Found Page
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/" className="back-home-link">
        Return Home
      </Link>
    </div>
  )
}

// Task 7: Active Route Hook
// hooks/use-active-route.ts
'use client'
import { usePathname } from 'next/navigation'

export function useActiveRoute() {
  const pathname = usePathname()
  
  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }
  
  return { pathname, isActive }
}
```

### Integration Points
```yaml
LAYOUT INTEGRATION:
  - modify: apps/web/app/layout.tsx
  - pattern: Import NavBar and add to body structure
  - preserve: existing HTML, head, and metadata configurations

STYLING INTEGRATION:
  - extend: apps/web/tailwind.config.ts with navigation-specific styles
  - pattern: Add nav-specific color variables for theme consistency
  - prepare: RTL-ready classes for future Arabic support

TYPESCRIPT INTEGRATION:
  - extend: apps/web/lib/types.ts with navigation interfaces
  - pattern: Export navigation types for component reusability
  - ensure: Strict type checking for all navigation components

COMPONENT INTEGRATION:
  - reference: examples/dyad-extracted/components/ui/ for styling patterns
  - pattern: Follow existing component structure and naming conventions
  - prepare: Integration points for future Iraqi-specific components
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST from apps/web/ directory
cd apps/web

# TypeScript compilation and type checking
bun run typecheck

# Next.js build verification
bun run build

# Expected: No errors. If errors, READ and fix systematically.
```

### Level 2: Development Testing
```bash
# Start development server
cd apps/web && bun run dev

# Manual Testing Checklist:
# 1. Navigate to http://localhost:3000 - home page loads
# 2. Click "About" - /about page loads with active highlighting
# 3. Click "Contact" - /contact page loads with active highlighting  
# 4. Visit invalid URL - 404 page displays correctly
# 5. Test mobile responsive navigation (browser dev tools)
# 6. Verify no console errors in browser
```

### Level 3: Navigation Flow Testing
```bash
# Test all navigation paths systematically
curl -I http://localhost:3000/         # Should return 200
curl -I http://localhost:3000/about    # Should return 200  
curl -I http://localhost:3000/contact  # Should return 200
curl -I http://localhost:3000/invalid  # Should return 404

# Browser Testing (using dev tools):
# 1. Verify Link prefetching works (Network tab)
# 2. Test navigation without page refreshes
# 3. Confirm active state highlighting updates
# 4. Test mobile navigation drawer functionality
```

## Final Validation Checklist
- [ ] All routes navigate without page refresh: `Test manually in browser`
- [ ] Active route highlighting works correctly: `Check navbar state changes`
- [ ] 404 page displays for invalid routes: `Visit /invalid-route`
- [ ] Mobile navigation functions properly: `Test responsive breakpoints`
- [ ] No TypeScript errors: `bun run typecheck`
- [ ] Production build succeeds: `bun run build`
- [ ] All links prefetch correctly: `Check network tab in dev tools`
- [ ] Navigation performance is smooth: `No visible lag on route changes`

---

## Anti-Patterns to Avoid
- ❌ Don't use next/router imports (Pages Router) - use next/navigation
- ❌ Don't forget 'use client' directive for navigation hooks
- ❌ Don't rely on route group not-found.tsx (known bug)
- ❌ Don't hardcode navigation items - use configuration file
- ❌ Don't create navigation without mobile responsiveness
- ❌ Don't implement navigation without TypeScript types
- ❌ Don't skip Link component prefetching optimization

---

## PRP Success Confidence: 8.5/10

**High Confidence Factors:**
- ✅ Comprehensive official documentation references
- ✅ Clear prerequisite dependency (Next.js App Setup PRP)
- ✅ Real codebase examples and patterns to follow
- ✅ Known gotchas documented with workarounds
- ✅ Executable validation gates for iterative testing
- ✅ Step-by-step task breakdown with specific file creation
- ✅ TypeScript interfaces defined for type safety

**Potential Risk Factors:**
- ⚠️ Route group not-found.tsx limitation may require workaround
- ⚠️ Mobile navigation complexity might need iteration
- ⚠️ Integration with existing layout may require adjustments

This PRP provides comprehensive context for successful one-pass implementation of basic routing foundation for the Iraqi AI Chat System.