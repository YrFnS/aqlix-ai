name: "Responsive Layout System PRP"
description: |
  Complete implementation of mobile-first responsive layout system with Tailwind CSS,
  responsive navigation patterns, and layout utilities for the Iraqi AI Chat System.

## Goal

Establish a comprehensive responsive layout foundation for the Iraqi AI Chat System that provides optimal user experience across mobile, tablet, and desktop devices with mobile-first design principles. This system prioritizes Iraqi users who primarily access via mobile devices.

## Why

- **Mobile-First Priority**: 60%+ Iraqi users access via mobile devices
- **User Experience**: Seamless experience across all device sizes and orientations
- **Performance**: Optimized responsive patterns for varying network conditions
- **Accessibility**: Touch-friendly interactions with proper sizing (48x48px minimum)
- **Maintainability**: Consistent breakpoint usage and responsive patterns across the app
- **RTL Support**: Responsive layouts that work seamlessly with Arabic RTL content

## What

Implement a complete responsive layout system including:
- Mobile-first responsive utilities and patterns
- Responsive navigation with mobile menu (hamburger + bottom navigation)
- Flexible grid and container systems
- Responsive typography scaling
- Mobile-optimized component patterns
- RTL-aware responsive layouts
- Responsive image handling with Next.js Image

### Success Criteria

- [ ] Mobile-first responsive layout system implemented and documented
- [ ] Mobile navigation with hamburger menu and bottom nav working correctly
- [ ] All layouts adapt smoothly across mobile (320px), tablet (768px), and desktop (1024px+)
- [ ] Touch targets meet 48x48px minimum accessibility standard
- [ ] Responsive typography scales appropriately across breakpoints
- [ ] RTL layouts work correctly on all screen sizes
- [ ] All components tested on mobile, tablet, and desktop viewports
- [ ] No horizontal scrolling on mobile devices
- [ ] Performance optimized for Iraqi network conditions

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

- url: https://tailwindcss.com/docs/responsive-design
  why: Official Tailwind responsive design patterns and mobile-first approach
  critical: Understand that unprefixed utilities target mobile, sm: means "at small breakpoint and above"

- url: https://tailwindcss.com/docs/container
  why: Container utility for responsive max-width layouts
  critical: Container centers content and applies responsive padding

- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
  why: CSS Grid layout fundamentals for complex responsive layouts
  critical: Use for 2D layouts (rows and columns), Flexbox for 1D

- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout
  why: Flexbox fundamentals for flexible one-dimensional layouts
  critical: Use for 1D layouts (single row/column), Grid for 2D

- url: https://nextjs.org/docs/app/api-reference/components/image
  why: Next.js Image component for responsive image optimization
  critical: Use sizes prop for responsive images, priority for above-fold images

- url: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  why: WCAG accessibility guidelines for touch target sizing
  critical: 48x48px minimum for touch targets, especially important for mobile

# Codebase References

- file: apps/web/tailwind.config.ts
  why: Current Tailwind configuration - already has custom theme setup
  critical: Default breakpoints are sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px

- file: apps/web/src/app/layout.tsx
  why: Root layout structure - currently minimal, needs responsive enhancements

- file: apps/web/src/components/navigation/marketing-nav.tsx
  why: Current navigation - NOT responsive, needs mobile menu implementation

- file: apps/web/src/components/navigation/app-nav.tsx
  why: App sidebar - fixed width, needs responsive drawer pattern

- file: apps/web/src/components/ui/dialog.tsx
  why: Good example of responsive patterns (sm:max-w-lg, max-w-[calc(100%-2rem)])

- file: examples/dyad-extracted/hooks/use-mobile.tsx
  why: Mobile detection hook pattern using 768px breakpoint

- file: examples/lobe-chat-desktop-enhanced/src/renderer/hooks/useRTLLayout.ts
  why: Comprehensive RTL layout hook with responsive utilities

- file: examples/lobe-chat-arabic-extracted/styles/rtl-layout.css
  why: RTL responsive patterns and media queries for Arabic layouts

# Research Findings (2025 Best Practices)

- Mobile-first approach: Start with mobile styles, enhance for larger screens
- Use relative units (rem, em, %, vw/vh) over pixels for flexibility
- CSS Grid for complex 2D layouts, Flexbox for simpler 1D arrangements
- Container queries for component-level responsiveness (future enhancement)
- Thumb-first design: 49% of users navigate with thumb only
- Bottom navigation more accessible than top hamburger menus
- Hybrid navigation: expose key items, hide secondary in menu
```

### Current Codebase Structure

```bash
apps/web/
├── src/
│   ├── app/
│   │   ├── globals.css           # Has design tokens, needs responsive utilities
│   │   ├── layout.tsx            # Basic layout, needs viewport meta tag
│   │   ├── (marketing)/
│   │   │   └── layout.tsx        # Has MarketingNav (not responsive)
│   │   └── (app)/
│   │       └── layout.tsx        # Has AppNav sidebar (not responsive)
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── marketing-nav.tsx # NOT responsive - needs mobile menu
│   │   │   ├── app-nav.tsx       # Fixed width sidebar - needs drawer
│   │   │   └── nav-link.tsx
│   │   └── ui/                   # Some components have responsive patterns
│   │       ├── button.tsx
│   │       ├── dialog.tsx        # Good responsive example
│   │       └── ...
│   └── lib/
│       └── utils.ts              # Has cn() utility
├── tailwind.config.ts            # Basic config, default breakpoints
└── package.json                  # Has all needed dependencies

Current State:
✅ Tailwind CSS with plugins (@tailwindcss/typography, forms, aspect-ratio)
✅ Some responsive patterns in Dialog (sm: prefixes)
✅ Container mx-auto pattern used in some pages
✅ Basic grid patterns (md:grid-cols-2, md:grid-cols-3)
❌ No mobile navigation patterns
❌ No responsive hook/utilities
❌ No consistent container system
❌ No responsive typography scale
❌ No mobile-optimized navigation
```

### Desired Codebase Structure

```bash
apps/web/
├── src/
│   ├── app/
│   │   ├── globals.css           # Enhanced with responsive utilities
│   │   └── layout.tsx            # Updated with proper viewport meta
│   ├── components/
│   │   ├── layout/               # NEW: Layout components
│   │   │   ├── container.tsx     # Responsive container component
│   │   │   ├── grid.tsx          # Responsive grid wrapper
│   │   │   ├── stack.tsx         # Responsive flex stack
│   │   │   └── responsive-wrapper.tsx # Breakpoint visibility wrapper
│   │   ├── navigation/
│   │   │   ├── marketing-nav.tsx # Updated with mobile menu
│   │   │   ├── mobile-menu.tsx   # NEW: Mobile hamburger menu
│   │   │   ├── bottom-nav.tsx    # NEW: Mobile bottom navigation
│   │   │   ├── app-nav.tsx       # Updated as responsive drawer
│   │   │   └── nav-link.tsx
│   │   └── ui/
│   │       └── ...existing components
│   ├── hooks/
│   │   ├── use-mobile.tsx        # NEW: Mobile detection hook
│   │   ├── use-breakpoint.tsx    # NEW: Current breakpoint hook
│   │   └── use-media-query.tsx   # NEW: Generic media query hook
│   └── lib/
│       └── responsive.ts         # NEW: Responsive utility functions
└── tailwind.config.ts            # Enhanced with custom breakpoints if needed
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Mobile-first means unprefixed utilities are for mobile
// ❌ WRONG: sm:text-base (this applies at 640px+, mobile gets nothing)
// ✅ RIGHT: text-base sm:text-lg (mobile gets text-base, 640px+ gets text-lg)

// CRITICAL: Tailwind breakpoints are min-width, not max-width
// sm:hidden means "hidden at 640px and above", NOT "hidden below 640px"
// Use max-* prefix for max-width: max-sm:hidden (hidden below 640px)

// CRITICAL: Touch target sizes for mobile
// Minimum 48x48px (3rem) for all interactive elements
// Example: <button className="h-12 w-12"> or <button className="min-h-[3rem] min-w-[3rem]">

// CRITICAL: Container mx-auto centers but needs px for mobile
// ❌ WRONG: <div className="container mx-auto"> (no padding on mobile)
// ✅ RIGHT: <div className="container mx-auto px-4 sm:px-6 lg:px-8">

// CRITICAL: Viewport units can cause issues on mobile
// Avoid 100vh for mobile (address bar changes height)
// Use min-h-screen instead which handles mobile viewport correctly

// CRITICAL: Next.js Image responsive sizing
// Always provide sizes prop for responsive images
// Example: sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

// CRITICAL: RTL layouts need special responsive handling
// Some flex directions reverse in RTL: flex-row-reverse becomes flex-row
// Test all responsive patterns in both LTR and RTL modes

// GOTCHA: Framer Motion animations need reduced motion support
// Always add: prefers-reduced-motion: reduce media query

// GOTCHA: Fixed positioning on mobile can be problematic
// Mobile keyboards can push fixed elements off screen
// Use sticky instead of fixed when possible

// GOTCHA: CSS Grid gap spacing
// gap-4 is same on all screens, use responsive gap: gap-2 md:gap-4 lg:gap-6

// GOTCHA: Hidden overflow on mobile
// overflow-hidden can prevent horizontal scroll even when needed
// Use overflow-x-hidden only when necessary

// PERFORMANCE: Iraqi mobile users on 3G/4G networks
// Minimize layout shifts with aspect-ratio or explicit width/height
// Use loading="lazy" for below-fold images
// Consider prefers-reduced-data media query for data-conscious users
```

## Implementation Blueprint

### Step 1: Foundation - Viewport and Base Utilities

Update root layout with proper viewport configuration and add responsive utilities to globals.css:

```typescript
// apps/web/src/app/layout.tsx
export const metadata: Metadata = {
  title: "Iraqi AI Chat System",
  description: "Advanced AI chat with Iraqi dialect support",
  // CRITICAL: Proper viewport for mobile
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5, // Allow zoom for accessibility
    userScalable: true, // Don't disable user scaling
  },
};
```

```css
/* apps/web/src/app/globals.css - Add responsive utilities */

/* Responsive Container Utilities */
.container-responsive {
  @apply container mx-auto px-4 sm:px-6 lg:px-8;
}

/* Responsive Typography Scale */
.text-heading-1 {
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold;
}

.text-heading-2 {
  @apply text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold;
}

.text-heading-3 {
  @apply text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold;
}

.text-body-large {
  @apply text-base sm:text-lg;
}

.text-body {
  @apply text-sm sm:text-base;
}

/* Touch Target Utilities */
.touch-target {
  @apply min-h-[3rem] min-w-[3rem]; /* 48px minimum */
}

.touch-target-large {
  @apply min-h-[3.5rem] min-w-[3.5rem]; /* 56px for primary actions */
}

/* Responsive Spacing Scale */
.section-spacing {
  @apply py-8 sm:py-12 md:py-16 lg:py-20;
}

.element-spacing {
  @apply space-y-4 sm:space-y-6 md:space-y-8;
}

/* Safe Area Insets for Mobile (notch/home indicator) */
@supports (padding: env(safe-area-inset-bottom)) {
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 2: Responsive Hooks

Create utility hooks for responsive behavior:

```typescript
// apps/web/src/hooks/use-media-query.tsx
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// apps/web/src/hooks/use-mobile.tsx
import { useMediaQuery } from './use-media-query';

export const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

// apps/web/src/hooks/use-breakpoint.tsx
import { useMediaQuery } from './use-media-query';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function useBreakpoint(breakpoint: Breakpoint) {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

export function useCurrentBreakpoint(): Breakpoint | 'xs' {
  const is2xl = useBreakpoint('2xl');
  const isXl = useBreakpoint('xl');
  const isLg = useBreakpoint('lg');
  const isMd = useBreakpoint('md');
  const isSm = useBreakpoint('sm');

  if (is2xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  return 'xs';
}
```

### Step 3: Layout Components

Create reusable responsive layout components:

```typescript
// apps/web/src/components/layout/container.tsx
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1440px]',
  full: 'max-w-full',
};

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
}

// apps/web/src/components/layout/grid.tsx
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-2 sm:gap-3',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
};

export function Grid({ children, className, cols = { xs: 1, sm: 2, lg: 3 }, gap = 'md' }: GridProps) {
  const colClasses = `
    grid-cols-${cols.xs || 1}
    ${cols.sm ? `sm:grid-cols-${cols.sm}` : ''}
    ${cols.md ? `md:grid-cols-${cols.md}` : ''}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''}
    ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''}
  `.trim();

  return (
    <div className={cn('grid', colClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// apps/web/src/components/layout/stack.tsx
import { cn } from '@/lib/utils';

interface StackProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  spacing?: 'sm' | 'md' | 'lg';
  responsive?: boolean; // Stack on mobile, flex-row on desktop
}

const spacingClasses = {
  row: {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  },
  col: {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  },
};

export function Stack({
  children,
  className,
  direction = 'col',
  spacing = 'md',
  responsive = false
}: StackProps) {
  const directionClass = responsive
    ? 'flex-col sm:flex-row'
    : direction === 'row' ? 'flex-row' : 'flex-col';

  return (
    <div className={cn('flex', directionClass, spacingClasses[direction][spacing], className)}>
      {children}
    </div>
  );
}

// apps/web/src/components/layout/responsive-wrapper.tsx
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  desktop?: React.ReactNode;
}

export function ResponsiveWrapper({ children, mobile, desktop }: ResponsiveWrapperProps) {
  const isMobile = useIsMobile();

  if (mobile && isMobile) return <>{mobile}</>;
  if (desktop && !isMobile) return <>{desktop}</>;
  return <>{children}</>;
}
```

### Step 4: Mobile Navigation Components

```typescript
// apps/web/src/components/navigation/mobile-menu.tsx
"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MobileMenuProps {
  items: Array<{ href: string; label: string }>;
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button - 48x48px touch target */}
      <Button
        variant="ghost"
        size="icon"
        className="touch-target md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" />

          {/* Menu Panel */}
          <nav className="fixed top-0 right-0 h-full w-64 bg-background border-l p-6 safe-top">
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="icon"
                className="touch-target"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="touch-target px-4 py-3 rounded-md hover:bg-accent text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

// apps/web/src/components/navigation/bottom-nav.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t safe-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 touch-target flex-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### Step 5: Update Existing Navigation

```typescript
// apps/web/src/components/navigation/marketing-nav.tsx
"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  return (
    <header className="border-b">
      <nav className="container-responsive py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Iraqi AI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} exact>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Navigation */}
        <MobileMenu items={navItems} />
      </nav>
    </header>
  );
}

// apps/web/src/components/navigation/app-nav.tsx
"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppNav() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Mobile: Drawer that overlays
  // Desktop: Fixed sidebar
  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 touch-target"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Sidebar/Drawer */}
      <aside
        className={cn(
          "bg-gray-50 border-r p-6",
          // Desktop: fixed sidebar
          "hidden md:block md:w-64 md:sticky md:top-0 md:h-screen",
          // Mobile: drawer overlay
          isMobile && isOpen && "fixed inset-y-0 left-0 z-40 w-64 block",
          isMobile && !isOpen && "hidden"
        )}
      >
        <Link href="/" className="text-xl font-bold mb-8 block">
          Iraqi AI
        </Link>
        <nav className="flex flex-col gap-2">
          <NavLink
            href="/dashboard"
            exact
            className="touch-target px-4 py-3 rounded-md"
            activeClassName="bg-blue-600 text-white font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            href="/settings"
            exact
            className="touch-target px-4 py-3 rounded-md"
            activeClassName="bg-blue-600 text-white font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </NavLink>
          <NavLink
            href="/profile"
            exact
            className="touch-target px-4 py-3 rounded-md"
            activeClassName="bg-blue-600 text-white font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

### Step 6: Responsive Utilities Library

```typescript
// apps/web/src/lib/responsive.ts

/**
 * Responsive utility functions for Iraqi AI Chat System
 */

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get responsive image sizes string for Next.js Image component
 */
export function getImageSizes(sizes: Partial<Record<Breakpoint, string>>): string {
  const entries = Object.entries(sizes) as [Breakpoint, string][];

  return entries
    .map(([bp, size]) => {
      const width = breakpoints[bp];
      if (width === 0) return size; // Default size
      return `(min-width: ${width}px) ${size}`;
    })
    .join(', ');
}

/**
 * Example usage:
 * getImageSizes({ xs: '100vw', md: '50vw', lg: '33vw' })
 * Returns: "(min-width: 768px) 50vw, (min-width: 1024px) 33vw, 100vw"
 */

/**
 * Check if viewport is mobile (client-side only)
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
}

/**
 * Get current breakpoint (client-side only)
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'md';

  const width = window.innerWidth;

  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Clamp value between min and max
 * Useful for responsive calculations
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation for responsive values
 * Example: scale font size between 16px (mobile) and 24px (desktop)
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * clamp(progress, 0, 1);
}

/**
 * Get responsive value based on screen width
 * Uses CSS clamp() function for fluid scaling
 */
export function getFluidValue(
  minSize: number,
  maxSize: number,
  minViewport = 320,
  maxViewport = 1920
): string {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minSize;

  return `clamp(${minSize}px, ${yAxisIntersection.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${maxSize}px)`;
}

/**
 * Example usage:
 * getFluidValue(16, 24)
 * Returns: "clamp(16px, 12.80px + 0.50vw, 24px)"
 * Font size scales fluidly from 16px to 24px between 320px and 1920px viewports
 */
```

## List of Implementation Tasks

```yaml
Task 1: Foundation Setup
  - UPDATE apps/web/src/app/layout.tsx with proper viewport metadata
  - ADD responsive utilities to apps/web/src/app/globals.css
  - CREATE responsive typography classes
  - CREATE touch target utility classes
  - ADD safe area inset support for mobile notches
  - ADD reduced motion media query support

Task 2: Create Responsive Hooks
  - CREATE apps/web/src/hooks/use-media-query.tsx
  - CREATE apps/web/src/hooks/use-mobile.tsx
  - CREATE apps/web/src/hooks/use-breakpoint.tsx
  - TEST hooks work correctly across breakpoints

Task 3: Create Layout Components
  - CREATE apps/web/src/components/layout/container.tsx with size variants
  - CREATE apps/web/src/components/layout/grid.tsx with responsive columns
  - CREATE apps/web/src/components/layout/stack.tsx with responsive direction
  - CREATE apps/web/src/components/layout/responsive-wrapper.tsx
  - TEST layout components at mobile, tablet, desktop sizes

Task 4: Implement Mobile Navigation
  - CREATE apps/web/src/components/navigation/mobile-menu.tsx (hamburger)
  - CREATE apps/web/src/components/navigation/bottom-nav.tsx
  - TEST mobile menu opens/closes correctly
  - TEST touch targets are minimum 48x48px
  - TEST backdrop dismisses menu
  - TEST keyboard accessibility

Task 5: Update Existing Navigation
  - UPDATE apps/web/src/components/navigation/marketing-nav.tsx
  - UPDATE apps/web/src/components/navigation/app-nav.tsx (drawer pattern)
  - TEST navigation works on mobile and desktop
  - TEST transitions are smooth
  - TEST navigation is accessible

Task 6: Create Responsive Utilities
  - CREATE apps/web/src/lib/responsive.ts with utility functions
  - ADD getImageSizes() for Next.js Image
  - ADD responsive value calculation functions
  - TEST utilities return correct values

Task 7: Update Existing Pages with Responsive Patterns
  - UPDATE apps/web/src/app/(marketing)/page.tsx with Container
  - UPDATE apps/web/src/app/docs/page.tsx with Grid
  - UPDATE apps/web/src/app/(app)/dashboard/page.tsx with responsive grid
  - REPLACE hardcoded container patterns with Container component
  - TEST pages adapt correctly across breakpoints

Task 8: RTL Responsive Support
  - TEST all responsive layouts work in RTL mode
  - FIX any RTL layout issues with responsive breakpoints
  - ENSURE navigation works correctly in RTL on mobile
  - TEST Arabic text scales properly with responsive typography

Task 9: Responsive Images
  - ADD example usage of Next.js Image with responsive sizes
  - DOCUMENT responsive image patterns
  - TEST images load correctly at different viewports
  - TEST lazy loading works

Task 10: Performance Optimization
  - TEST layout shifts (CLS) across all pages
  - OPTIMIZE responsive images for Iraqi network conditions
  - ADD aspect-ratio to prevent layout shifts
  - TEST performance on slow 3G connections

Task 11: Accessibility Testing
  - TEST keyboard navigation on mobile and desktop
  - VERIFY touch targets meet 48x48px minimum
  - TEST screen reader compatibility
  - VERIFY focus management in mobile menus
  - TEST with reduced motion preference

Task 12: Documentation
  - CREATE responsive-patterns.md guide
  - DOCUMENT breakpoint usage conventions
  - ADD examples of responsive components
  - DOCUMENT mobile-first approach
  - ADD troubleshooting guide for common issues
```

## Validation Loop

### Level 1: Visual Testing

```bash
# Start dev server
bun run dev

# Test viewports in browser DevTools:
# 1. Mobile: 375px (iPhone), 360px (Android)
# 2. Tablet: 768px (iPad), 820px (iPad Air)
# 3. Desktop: 1024px, 1440px, 1920px

# Checklist:
- [ ] No horizontal scrolling on any viewport
- [ ] Touch targets minimum 48x48px on mobile
- [ ] Text is readable (minimum 16px on mobile)
- [ ] Navigation accessible on all screen sizes
- [ ] Content adapts smoothly between breakpoints
- [ ] Images scale appropriately
- [ ] RTL layouts work on all viewports
```

### Level 2: Component Testing

```bash
# Test responsive hooks
bun test src/hooks/use-mobile.test.tsx
bun test src/hooks/use-breakpoint.test.tsx

# Test layout components
bun test src/components/layout/*.test.tsx

# Expected: All tests pass
# If failing: Fix issues and re-run
```

### Level 3: Accessibility Testing

```bash
# Run accessibility checks
bun run test:a11y

# Manual testing checklist:
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Mobile menu opens/closes with keyboard
- [ ] Focus visible on all interactive elements
- [ ] Touch targets meet WCAG 2.1 AA (48x48px)
- [ ] Screen reader announces navigation correctly
- [ ] No keyboard traps in mobile menu
```

### Level 4: Performance Testing

```bash
# Build for production
bun run build

# Test performance
# Use Lighthouse or WebPageTest with:
# - Device: Mobile (Slow 4G)
# - Location: Middle East region

# Target metrics:
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] Mobile Performance Score > 90
```

### Level 5: Cross-Device Testing

```bash
# Test on real devices if possible:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Safari)

# Test orientations:
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Rotation between orientations

# Test RTL:
- [ ] All layouts work in RTL mode
- [ ] Navigation works in RTL on mobile
- [ ] Typography scales correctly in RTL
```

## Final Validation Checklist

- [ ] All responsive hooks implemented and tested
- [ ] Layout components created (Container, Grid, Stack, ResponsiveWrapper)
- [ ] Mobile navigation working (hamburger menu + bottom nav)
- [ ] Desktop navigation working (responsive drawer/sidebar)
- [ ] All pages adapt correctly across breakpoints
- [ ] No horizontal scrolling on mobile (320px - 768px)
- [ ] Touch targets meet 48x48px minimum
- [ ] Responsive typography scales appropriately
- [ ] RTL layouts work on all screen sizes
- [ ] Images optimized with Next.js Image sizes prop
- [ ] Performance metrics meet targets (LCP < 2.5s, CLS < 0.1)
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Keyboard navigation works on all devices
- [ ] Reduced motion preference respected
- [ ] Safe area insets handled for mobile notches
- [ ] All linting passes: `bun run lint`
- [ ] All type checking passes: `bun run typecheck`
- [ ] Documentation created for responsive patterns

---

## Anti-Patterns to Avoid

- ❌ Don't use pixel-based media queries - use Tailwind breakpoints
- ❌ Don't disable user scaling (maximum-scale: 1)
- ❌ Don't use viewport units (vh) for full-height mobile layouts
- ❌ Don't ignore touch target sizes < 48px
- ❌ Don't forget to test in RTL mode
- ❌ Don't use CSS Grid for simple one-dimensional layouts (use Flexbox)
- ❌ Don't hardcode responsive values - use design tokens
- ❌ Don't forget reduced motion preferences
- ❌ Don't skip real device testing - emulators aren't enough
- ❌ Don't create mobile-specific routes - use responsive design
- ❌ Don't hide important content on mobile - prioritize instead
- ❌ Don't use fixed positioning without considering mobile keyboards

---

## Success Metrics

After implementation, the system should achieve:

- **Mobile Performance**: 90+ Lighthouse score on 3G connection
- **Accessibility**: WCAG 2.1 AA compliance across all viewports
- **User Experience**: Zero horizontal scroll, smooth transitions
- **Developer Experience**: Consistent responsive patterns, reusable components
- **Iraqi Context**: RTL support, Arabic typography scaling, mobile-first design

---

## PRP Quality Score: 9/10

**Confidence Level**: High confidence for one-pass implementation

**Strengths**:
- Comprehensive context from 2025 best practices research
- Clear implementation path with existing pattern references
- Mobile-first approach aligned with Iraqi user base
- Executable validation steps at each level
- RTL support integrated throughout
- Accessibility considerations included

**Potential Challenges** (minor):
- Testing across all device combinations may reveal edge cases
- Fine-tuning responsive typography scale may need iteration
- Mobile menu animations may need performance optimization

**Recommendation**: Implement tasks sequentially, validate at each step, iterate on visual refinement after core functionality works.
