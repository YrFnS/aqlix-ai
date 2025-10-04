# Responsive Layout System - Iraqi AI Chat System

**Comprehensive guide to building responsive, mobile-first interfaces with cultural compliance and RTL support.**

## Table of Contents

1. [Overview](#overview)
2. [Mobile-First Approach](#mobile-first-approach)
3. [Breakpoint System](#breakpoint-system)
4. [Layout Components](#layout-components)
5. [Navigation Patterns](#navigation-patterns)
6. [Responsive Hooks](#responsive-hooks)
7. [Responsive Utilities](#responsive-utilities)
8. [CSS Utilities](#css-utilities)
9. [RTL Considerations](#rtl-considerations)
10. [Best Practices](#best-practices)
11. [Anti-Patterns](#anti-patterns)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The Iraqi AI Chat System implements a comprehensive responsive layout system designed to provide optimal user experiences across all device sizes while maintaining cultural compliance and RTL support.

### Key Features

- **Mobile-First Design**: Base styles for mobile, enhanced for larger screens
- **Tailwind Breakpoints**: Standard breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)
- **Responsive Components**: Pre-built Container, Grid, Stack, and ResponsiveWrapper components
- **Navigation Patterns**: Mobile menu, bottom navigation, drawer navigation
- **Custom Hooks**: useIsMobile, useMediaQuery, useBreakpoint
- **Utility Library**: Helper functions for responsive calculations
- **CSS Utilities**: Typography scales, touch targets, spacing, safe areas
- **RTL Support**: Right-to-left layout considerations (refinement in progress)

### Performance Targets

- **Mobile Load Time**: <3s on 3G networks
- **Desktop Load Time**: <1s on broadband
- **Layout Shift (CLS)**: <0.1
- **First Contentful Paint**: <1.5s
- **Touch Target Compliance**: 100% WCAG 2.1 AA

---

## Mobile-First Approach

### Philosophy

All styles start with mobile devices and progressively enhance for larger screens. This ensures fast performance on mobile devices and leverages the natural cascade of CSS.

### Basic Pattern

```tsx
// Mobile: full width, stacked
// Tablet (md): side-by-side
// Desktop (lg): with increased spacing

<div className="
  flex flex-col gap-4          /* Mobile: stack vertically */
  md:flex-row md:gap-6         /* Tablet: row layout */
  lg:gap-8                     /* Desktop: more spacing */
">
  {/* Content */}
</div>
```

### Progressive Enhancement Example

```tsx
// Typography scaling from mobile to desktop
<h1 className="
  text-2xl font-bold           /* Mobile: 24px */
  sm:text-3xl                  /* Small: 30px */
  md:text-4xl                  /* Tablet: 36px */
  lg:text-5xl                  /* Desktop: 48px */
">
  Iraqi AI Chat System
</h1>
```

---

## Breakpoint System

### Tailwind Breakpoints

The system uses Tailwind's standard breakpoints for consistency:

| Breakpoint | Min Width | Typical Device | Usage |
|------------|-----------|----------------|-------|
| `xs` | 0px | Mobile (default) | Base styles |
| `sm` | 640px | Large mobile | Enhanced mobile |
| `md` | 768px | Tablet | Tablet optimization |
| `lg` | 1024px | Desktop | Desktop layouts |
| `xl` | 1280px | Large desktop | Wide screens |
| `2xl` | 1536px | Ultra-wide | Extra-large displays |

### Breakpoint Configuration

```typescript
// apps/web/src/lib/responsive.ts
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;
```

### Mobile Detection

```typescript
// Mobile is defined as screens smaller than 768px (md breakpoint)
export const MOBILE_BREAKPOINT = 768;

// Client-side detection
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoints.md;
}
```

### Getting Current Breakpoint

```typescript
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "md";

  const width = window.innerWidth;

  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}
```

---

## Layout Components

### Container Component

The Container component provides responsive padding and max-width constraints.

#### Basic Usage

```tsx
import { Container } from "@/components/layout/container";

export function Page() {
  return (
    <Container>
      <h1>My Page Content</h1>
      <p>Content is automatically centered and padded.</p>
    </Container>
  );
}
```

#### Size Variants

```tsx
// Small container (max-width: 48rem / 768px)
<Container size="sm">
  <p>Narrow content like blog posts</p>
</Container>

// Medium container (max-width: 64rem / 1024px) - Default
<Container size="md">
  <p>Standard content width</p>
</Container>

// Large container (max-width: 80rem / 1280px)
<Container size="lg">
  <p>Wide content areas</p>
</Container>

// Extra-large container (max-width: 1440px)
<Container size="xl">
  <p>Very wide content</p>
</Container>

// Full-width container
<Container size="full">
  <p>No max-width constraint</p>
</Container>
```

#### Responsive Padding

The Container automatically applies responsive padding:

```css
/* Mobile: 16px horizontal padding */
px-4

/* Small devices: 24px horizontal padding */
sm:px-6

/* Large devices: 32px horizontal padding */
lg:px-8
```

#### Implementation

```tsx
// apps/web/src/components/layout/container.tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1440px]",
  full: "max-w-full",
};

export function Container({
  children,
  className,
  size = "lg",
}: ContainerProps) {
  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 lg:px-8",
      sizeClasses[size],
      className,
    )}>
      {children}
    </div>
  );
}
```

### Grid Component

Responsive grid layouts with configurable columns and gaps.

#### Basic Usage

```tsx
import { Grid } from "@/components/layout/grid";

export function ProductGrid() {
  return (
    <Grid>
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </Grid>
  );
}
```

#### Custom Column Configuration

```tsx
// 1 column on mobile, 2 on tablet, 3 on desktop
<Grid cols={{ xs: 1, md: 2, lg: 3 }}>
  {items.map(item => <Card key={item.id} {...item} />)}
</Grid>

// 2 columns on mobile, 3 on tablet, 4 on desktop
<Grid cols={{ xs: 2, md: 3, lg: 4 }}>
  {items.map(item => <Card key={item.id} {...item} />)}
</Grid>

// Complex layout
<Grid cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
  {items.map(item => <Card key={item.id} {...item} />)}
</Grid>
```

#### Gap Sizes

```tsx
// Small gap (8px mobile, 12px tablet)
<Grid gap="sm">
  {/* Content */}
</Grid>

// Medium gap (16px mobile, 24px tablet) - Default
<Grid gap="md">
  {/* Content */}
</Grid>

// Large gap (24px mobile, 32px tablet)
<Grid gap="lg">
  {/* Content */}
</Grid>
```

#### Implementation

```tsx
// apps/web/src/components/layout/grid.tsx
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
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-2 sm:gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
};

export function Grid({
  children,
  className,
  cols = { xs: 1, sm: 2, lg: 3 },
  gap = "md",
}: GridProps) {
  const colClasses = `
    grid-cols-${cols.xs || 1}
    ${cols.sm ? `sm:grid-cols-${cols.sm}` : ""}
    ${cols.md ? `md:grid-cols-${cols.md}` : ""}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ""}
    ${cols.xl ? `xl:grid-cols-${cols.xl}` : ""}
  `.trim();

  return (
    <div className={cn("grid", colClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
}
```

### Stack Component

Flexible vertical or horizontal stacking with responsive direction changes.

#### Basic Usage

```tsx
import { Stack } from "@/components/layout/stack";

// Vertical stack (default)
<Stack>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Horizontal stack
<Stack direction="row">
  <Button>Cancel</Button>
  <Button>Submit</Button>
</Stack>
```

#### Responsive Direction

```tsx
// Stack vertically on mobile, horizontally on desktop
<Stack responsive>
  <div className="flex-1">Left content</div>
  <div className="flex-1">Right content</div>
</Stack>
```

#### Spacing Options

```tsx
// Small spacing (8px)
<Stack spacing="sm">
  {/* Content */}
</Stack>

// Medium spacing (16px) - Default
<Stack spacing="md">
  {/* Content */}
</Stack>

// Large spacing (24px)
<Stack spacing="lg">
  {/* Content */}
</Stack>
```

#### Practical Examples

```tsx
// Form layout - stacked on mobile, side-by-side on desktop
<Stack responsive spacing="md">
  <Input placeholder="First Name" />
  <Input placeholder="Last Name" />
</Stack>

// Action buttons - responsive with consistent spacing
<Stack direction="row" spacing="sm" className="justify-end">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</Stack>
```

#### Implementation

```tsx
// apps/web/src/components/layout/stack.tsx
interface StackProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "col";
  spacing?: "sm" | "md" | "lg";
  responsive?: boolean;
}

export function Stack({
  children,
  className,
  direction = "col",
  spacing = "md",
  responsive = false,
}: StackProps) {
  const directionClass = responsive
    ? "flex-col sm:flex-row"
    : direction === "row"
      ? "flex-row"
      : "flex-col";

  const spacingClasses = {
    row: { sm: "gap-2", md: "gap-4", lg: "gap-6" },
    col: { sm: "gap-2", md: "gap-4", lg: "gap-6" },
  };

  return (
    <div className={cn(
      "flex",
      directionClass,
      spacingClasses[direction][spacing],
      className,
    )}>
      {children}
    </div>
  );
}
```

### ResponsiveWrapper Component

Render different components or layouts based on device type.

#### Basic Usage

```tsx
import { ResponsiveWrapper } from "@/components/layout/responsive-wrapper";

<ResponsiveWrapper
  mobile={<MobileView />}
  desktop={<DesktopView />}
/>
```

#### Conditional Rendering

```tsx
// Only render on mobile
<ResponsiveWrapper mobile={<MobileOnlyFeature />}>
  <DefaultView />
</ResponsiveWrapper>

// Only render on desktop
<ResponsiveWrapper desktop={<DesktopOnlyFeature />}>
  <DefaultView />
</ResponsiveWrapper>
```

#### Complex Layout Example

```tsx
export function Dashboard() {
  return (
    <ResponsiveWrapper
      mobile={
        <div className="space-y-4">
          <MobileHeader />
          <MobileStats />
          <MobileChart />
        </div>
      }
      desktop={
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <DesktopChart />
          </div>
          <div>
            <DesktopStats />
          </div>
        </div>
      }
    />
  );
}
```

#### Implementation

```tsx
// apps/web/src/components/layout/responsive-wrapper.tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  desktop?: React.ReactNode;
}

export function ResponsiveWrapper({
  children,
  mobile,
  desktop,
}: ResponsiveWrapperProps) {
  const isMobile = useIsMobile();

  if (mobile && isMobile) return <>{mobile}</>;
  if (desktop && !isMobile) return <>{desktop}</>;
  return <>{children}</>;
}
```

---

## Navigation Patterns

### Mobile Menu (Hamburger)

Slide-in navigation panel for mobile devices.

#### Usage

```tsx
import { MobileMenu } from "@/components/navigation/mobile-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="border-b">
      <nav className="container flex justify-between items-center py-4">
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map(item => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile navigation */}
        <MobileMenu items={navItems} />
      </nav>
    </header>
  );
}
```

#### Features

- **Touch-Optimized**: 48x48px touch targets (WCAG 2.1 AA compliant)
- **Slide Animation**: Smooth right-to-left slide transition
- **Backdrop Overlay**: Semi-transparent backdrop with click-to-close
- **Safe Area Support**: Respects device notches and home indicators
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Implementation Details

```tsx
// apps/web/src/components/navigation/mobile-menu.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

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
```

### Bottom Navigation

Mobile-first bottom navigation bar for primary app navigation.

#### Usage

```tsx
import { BottomNav } from "@/components/navigation/bottom-nav";

export function AppLayout({ children }) {
  return (
    <div>
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
```

#### Features

- **Mobile-Only**: Hidden on desktop (md breakpoint and above)
- **Fixed Position**: Stays at bottom during scroll
- **Icon + Label**: Clear visual hierarchy
- **Active State**: Highlights current route
- **Safe Area Support**: Respects device home indicators

#### Customization

```tsx
// apps/web/src/components/navigation/bottom-nav.tsx
const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/profile", icon: User, label: "Profile" },
];

// Customize by editing the navItems array
```

#### Implementation

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
                isActive ? "text-primary" : "text-muted-foreground",
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

### Drawer Navigation (Sidebar)

Responsive sidebar that transforms into a drawer on mobile.

#### Usage

```tsx
import { AppNav } from "@/components/navigation/app-nav";

export function AppLayout({ children }) {
  return (
    <div className="flex">
      <AppNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

#### Features

- **Dual Behavior**:
  - Desktop: Fixed sidebar (always visible)
  - Mobile: Drawer overlay (toggle with hamburger)
- **Smooth Transitions**: Animated open/close
- **Backdrop Overlay**: Semi-transparent on mobile
- **Touch Targets**: All links meet 48x48px minimum
- **Auto-Close**: Closes on navigation (mobile)

#### Implementation

```tsx
// apps/web/src/components/navigation/app-nav.tsx
"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";

export function AppNav() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 touch-target"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Sidebar/Drawer */}
      <aside className={cn(
        "bg-gray-50 border-r p-6",
        // Desktop: fixed sidebar
        "hidden md:block md:w-64 md:sticky md:top-0 md:h-screen",
        // Mobile: drawer overlay
        isMobile && isOpen && "fixed inset-y-0 left-0 z-40 w-64 block",
        isMobile && !isOpen && "hidden",
      )}>
        <Link href="/" className="text-xl font-bold mb-8 block">
          Iraqi AI
        </Link>
        <nav className="flex flex-col gap-2">
          {/* Navigation links */}
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

### NavLink Component

Active route-aware navigation link with styling.

#### Usage

```tsx
import { NavLink } from "@/components/navigation/nav-link";

// Basic usage
<NavLink href="/dashboard">Dashboard</NavLink>

// Custom active styling
<NavLink
  href="/settings"
  activeClassName="bg-blue-600 text-white"
>
  Settings
</NavLink>

// Non-exact matching (matches /blog and /blog/*)
<NavLink href="/blog" exact={false}>
  Blog
</NavLink>
```

#### Implementation

```tsx
// apps/web/src/components/navigation/nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
}

export function NavLink({
  href,
  children,
  exact = true,
  className,
  activeClassName = "text-blue-600 font-semibold",
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-blue-600",
        isActive ? activeClassName : "text-gray-700",
        className,
      )}
    >
      {children}
    </Link>
  );
}
```

---

## Responsive Hooks

### useIsMobile

Detect if the viewport is mobile-sized (< 768px).

#### Usage

```tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

#### Implementation

```tsx
// apps/web/src/hooks/use-mobile.tsx
import { useMediaQuery } from "./use-media-query";

export const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}
```

### useMediaQuery

Generic media query hook for custom breakpoints.

#### Usage

```tsx
"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function Component() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isLandscape = useMediaQuery("(orientation: landscape)");

  return (
    <div>
      <p>Small screen: {isSmallScreen ? "Yes" : "No"}</p>
      <p>Dark mode: {isDarkMode ? "Yes" : "No"}</p>
      <p>Landscape: {isLandscape ? "Yes" : "No"}</p>
    </div>
  );
}
```

#### Implementation

```tsx
// apps/web/src/hooks/use-media-query.tsx
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

### useBreakpoint

Detect specific breakpoint activation.

#### Usage

```tsx
"use client";

import { useBreakpoint, useCurrentBreakpoint } from "@/hooks/use-breakpoint";

export function Component() {
  const isDesktop = useBreakpoint("lg");
  const currentBreakpoint = useCurrentBreakpoint();

  return (
    <div>
      <p>Desktop: {isDesktop ? "Yes" : "No"}</p>
      <p>Current breakpoint: {currentBreakpoint}</p>
    </div>
  );
}
```

#### Implementation

```tsx
// apps/web/src/hooks/use-breakpoint.tsx
import { useMediaQuery } from "./use-media-query";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function useBreakpoint(breakpoint: Breakpoint) {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

export function useCurrentBreakpoint(): Breakpoint | "xs" {
  const is2xl = useBreakpoint("2xl");
  const isXl = useBreakpoint("xl");
  const isLg = useBreakpoint("lg");
  const isMd = useBreakpoint("md");
  const isSm = useBreakpoint("sm");

  if (is2xl) return "2xl";
  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  return "xs";
}
```

---

## Responsive Utilities

### Image Sizes Helper

Generate responsive image sizes for Next.js Image component.

#### Usage

```tsx
import Image from "next/image";
import { getImageSizes } from "@/lib/responsive";

export function ResponsiveImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      sizes={getImageSizes({
        xs: "100vw",
        md: "50vw",
        lg: "33vw"
      })}
    />
  );
}
```

#### Implementation

```tsx
// apps/web/src/lib/responsive.ts
export function getImageSizes(
  sizes: Partial<Record<Breakpoint, string>>,
): string {
  const entries = Object.entries(sizes) as [Breakpoint, string][];

  return entries
    .map(([bp, size]) => {
      const width = breakpoints[bp];
      if (width === 0) return size; // Default size
      return `(min-width: ${width}px) ${size}`;
    })
    .join(", ");
}

// Example output:
// "(min-width: 768px) 50vw, (min-width: 1024px) 33vw, 100vw"
```

### Viewport Detection

Client-side viewport size detection.

#### Usage

```tsx
import { isMobileViewport, getCurrentBreakpoint } from "@/lib/responsive";

// In client-side code
if (isMobileViewport()) {
  // Mobile-specific logic
}

const breakpoint = getCurrentBreakpoint();
console.log(`Current breakpoint: ${breakpoint}`);
```

### Fluid Value Calculation

Generate CSS clamp() for fluid scaling between breakpoints.

#### Usage

```tsx
import { getFluidValue } from "@/lib/responsive";

// Scale font size from 16px to 24px
const fluidFontSize = getFluidValue(16, 24);
// Returns: "clamp(16px, 12.80px + 0.50vw, 24px)"

// Use in inline styles
<h1 style={{ fontSize: getFluidValue(24, 48) }}>
  Fluid Typography
</h1>
```

#### Implementation

```tsx
// apps/web/src/lib/responsive.ts
export function getFluidValue(
  minSize: number,
  maxSize: number,
  minViewport = 320,
  maxViewport = 1920,
): string {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minSize;

  return `clamp(${minSize}px, ${yAxisIntersection.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${maxSize}px)`;
}
```

### Mathematical Utilities

Helper functions for responsive calculations.

#### Usage

```tsx
import { clamp, lerp } from "@/lib/responsive";

// Clamp value between min and max
const value = clamp(150, 100, 200); // 150
const tooLow = clamp(50, 100, 200); // 100
const tooHigh = clamp(250, 100, 200); // 200

// Linear interpolation
const progress = 0.5; // 50%
const interpolated = lerp(0, 100, progress); // 50

// Responsive padding calculation
const padding = lerp(16, 32, progress); // 24
```

#### Implementation

```tsx
// apps/web/src/lib/responsive.ts

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * clamp(progress, 0, 1);
}
```

---

## CSS Utilities

### Responsive Typography

Pre-built responsive typography scales in `globals.css`.

#### Usage

```tsx
// Heading levels with automatic scaling
<h1 className="text-heading-1">
  Main Title
</h1>

<h2 className="text-heading-2">
  Section Title
</h2>

<h3 className="text-heading-3">
  Subsection Title
</h3>

// Body text variants
<p className="text-body-large">
  Large body text for important content
</p>

<p className="text-body">
  Standard body text
</p>
```

#### Typography Scale

```css
/* apps/web/src/app/globals.css */

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
```

### Touch Targets

WCAG 2.1 AA compliant touch target sizes.

#### Usage

```tsx
// Standard touch target (48x48px minimum)
<button className="touch-target">
  Click me
</button>

// Large touch target (56x56px for primary actions)
<button className="touch-target-large">
  Primary Action
</button>
```

#### Implementation

```css
/* apps/web/src/app/globals.css */

.touch-target {
  @apply min-h-[3rem] min-w-[3rem]; /* 48px minimum */
}

.touch-target-large {
  @apply min-h-[3.5rem] min-w-[3.5rem]; /* 56px for primary actions */
}
```

### Responsive Spacing

Consistent spacing scales that grow with viewport.

#### Usage

```tsx
// Section spacing (vertical padding)
<section className="section-spacing">
  <h2>Section Title</h2>
  <p>Section content</p>
</section>

// Element spacing (vertical gap between elements)
<div className="element-spacing">
  <div>Element 1</div>
  <div>Element 2</div>
  <div>Element 3</div>
</div>
```

#### Implementation

```css
/* apps/web/src/app/globals.css */

.section-spacing {
  @apply py-8 sm:py-12 md:py-16 lg:py-20;
}

.element-spacing {
  @apply space-y-4 sm:space-y-6 md:space-y-8;
}
```

### Safe Area Support

Handle device notches and home indicators on iOS.

#### Usage

```tsx
// Bottom navigation with safe area
<nav className="fixed bottom-0 safe-bottom">
  {/* Navigation content */}
</nav>

// Top header with safe area
<header className="fixed top-0 safe-top">
  {/* Header content */}
</header>
```

#### Implementation

```css
/* apps/web/src/app/globals.css */

@supports (padding: env(safe-area-inset-bottom)) {
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
}
```

### Reduced Motion

Respect user preferences for reduced motion.

#### Automatic Application

```css
/* apps/web/src/app/globals.css */

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations and transitions automatically respect the `prefers-reduced-motion` media query without additional code.

---

## RTL Considerations

### Current RTL Support

The responsive system includes basic RTL considerations, but **RTL support requires refinement** per feedback from the `arabic-rtl-processor` agent.

#### Basic RTL Patterns

```tsx
// RTL-aware text alignment
<p className="text-right rtl:text-right ltr:text-left">
  Arabic text with proper alignment
</p>

// RTL-aware spacing
<div className="ml-4 rtl:mr-4 rtl:ml-0">
  Margin adjusts for text direction
</div>

// RTL-aware flex direction
<div className="flex flex-row rtl:flex-row-reverse">
  <div>First</div>
  <div>Second</div>
</div>
```

#### RTL Improvements Needed

Based on agent feedback, the following areas need enhancement:

1. **Directional Utilities**: Comprehensive RTL/LTR utility classes
2. **Navigation RTL**: Mobile menu and bottom nav RTL animations
3. **Grid Layouts**: RTL-aware grid ordering
4. **Typography**: Arabic font optimization and line-height adjustments
5. **Forms**: RTL input field styling and validation messages

#### Cultural Validation Required

All RTL implementations must pass through the `iraqi-cultural-validator` and `arabic-rtl-processor` agents to ensure:

- 95%+ cultural appropriateness
- 99%+ RTL accuracy
- 85%+ Iraqi dialect recognition
- Proper mixed Arabic-English content handling

### Next Steps for RTL

1. Consult `arabic-rtl-processor` agent for comprehensive RTL utilities
2. Implement directional CSS custom properties
3. Add RTL variants to all responsive components
4. Test with Iraqi Arabic content
5. Validate with cultural compliance checks

---

## Best Practices

### 1. Mobile-First Development

**Always start with mobile styles and enhance for larger screens.**

```tsx
// Good: Mobile-first approach
<div className="
  flex-col         /* Mobile: stack */
  md:flex-row      /* Tablet+: side-by-side */
">

// Avoid: Desktop-first approach
<div className="
  flex-row         /* Desktop */
  md:flex-col      /* Tablet (confusing) */
">
```

### 2. Semantic HTML

**Use appropriate semantic elements for better accessibility and SEO.**

```tsx
// Good: Semantic structure
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// Avoid: Div soup
<div className="nav">
  <div>
    <div><a href="/">Home</a></div>
  </div>
</div>
```

### 3. Touch Target Compliance

**Ensure all interactive elements meet minimum 48x48px size on mobile.**

```tsx
// Good: Proper touch target
<button className="touch-target p-3">
  Click me
</button>

// Avoid: Too small on mobile
<button className="p-1">
  Tiny button
</button>
```

### 4. Performance Optimization

**Use responsive images with proper sizes attribute.**

```tsx
// Good: Responsive image loading
<Image
  src="/large-image.jpg"
  alt="Description"
  width={1200}
  height={600}
  sizes={getImageSizes({ xs: "100vw", md: "50vw", lg: "33vw" })}
/>

// Avoid: Loading full-size image on mobile
<img src="/large-image.jpg" alt="Description" />
```

### 5. Consistent Breakpoints

**Use standard breakpoints consistently across the app.**

```tsx
// Good: Using standard breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Avoid: Custom breakpoints without reason
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
```

### 6. Progressive Enhancement

**Add features progressively, ensuring basic functionality works everywhere.**

```tsx
// Good: Works without JavaScript, enhanced with it
export function EnhancedComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Basic content always visible */}
      <BasicContent />

      {/* Enhanced features for capable devices */}
      {!isMobile && <AdvancedFeatures />}
    </div>
  );
}
```

### 7. Accessibility First

**Consider accessibility at every step, not as an afterthought.**

```tsx
// Good: Accessible navigation
<button
  onClick={() => setOpen(!open)}
  aria-label="Toggle menu"
  aria-expanded={open}
  className="touch-target"
>
  <Menu className="h-6 w-6" />
</button>

// Avoid: Inaccessible navigation
<div onClick={() => setOpen(!open)}>
  <Menu />
</div>
```

### 8. Cultural Compliance

**Validate all content for Iraqi cultural appropriateness (95%+ required).**

```tsx
// Good: Culturally validated content
<div className="font-arabic text-right">
  {/* Arabic content validated by iraqi-cultural-validator */}
  مرحباً بك في نظام الذكاء الاصطناعي العراقي
</div>

// Requires validation: New Arabic content
// Use Task tool to delegate to iraqi-cultural-validator
```

### 9. Testing Across Devices

**Test on actual devices, not just browser DevTools.**

```bash
# Run tests including responsive tests
bun test

# Test on specific viewports
bun test:mobile
bun test:tablet
bun test:desktop
```

### 10. Documentation

**Document responsive behavior for complex components.**

```tsx
/**
 * DashboardLayout - Responsive dashboard container
 *
 * Mobile (<768px): Stacked vertical layout with bottom navigation
 * Tablet (768px-1024px): 2-column grid with side navigation
 * Desktop (>1024px): 3-column grid with persistent sidebar
 *
 * @example
 * <DashboardLayout>
 *   <DashboardWidget />
 * </DashboardLayout>
 */
export function DashboardLayout({ children }) {
  // Implementation
}
```

---

## Anti-Patterns

### 1. Desktop-First Design

**Avoid:**

```tsx
// Starting with desktop, cramming down to mobile
<div className="grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
```

**Instead:**

```tsx
// Start with mobile, enhance for desktop
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### 2. Fixed Pixel Widths

**Avoid:**

```tsx
// Fixed widths don't adapt
<div className="w-[800px]">
```

**Instead:**

```tsx
// Use max-width with percentages
<div className="w-full max-w-4xl">
```

### 3. Viewport Units Without Constraints

**Avoid:**

```tsx
// Can become too large or too small
<h1 style={{ fontSize: "5vw" }}>
```

**Instead:**

```tsx
// Use clamp() for fluid but constrained sizing
<h1 style={{ fontSize: getFluidValue(24, 48) }}>
```

### 4. Hidden Content Without Alternative

**Avoid:**

```tsx
// Important content only on desktop
<div className="hidden lg:block">
  <ImportantFeature />
</div>
```

**Instead:**

```tsx
// Provide mobile alternative or make it responsive
<ResponsiveWrapper
  mobile={<MobileImportantFeature />}
  desktop={<DesktopImportantFeature />}
/>
```

### 5. Tiny Touch Targets

**Avoid:**

```tsx
// Too small for touch interaction
<button className="p-1 text-xs">
  Tap me
</button>
```

**Instead:**

```tsx
// Proper touch target size
<button className="touch-target">
  Tap me
</button>
```

### 6. Inconsistent Breakpoints

**Avoid:**

```tsx
// Mixing breakpoint logic
<div className="sm:flex md:hidden lg:flex xl:hidden">
```

**Instead:**

```tsx
// Clear, consistent breakpoint usage
<div className="hidden md:flex">
```

### 7. Over-reliance on JavaScript

**Avoid:**

```tsx
// Responsive layout only with JavaScript
const [cols, setCols] = useState(1);

useEffect(() => {
  const updateCols = () => {
    setCols(window.innerWidth > 768 ? 3 : 1);
  };
  window.addEventListener("resize", updateCols);
  return () => window.removeEventListener("resize", updateCols);
}, []);

return <div style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
```

**Instead:**

```tsx
// Use CSS for responsive layouts
<div className="grid grid-cols-1 md:grid-cols-3">
```

### 8. Ignoring Loading States

**Avoid:**

```tsx
// No loading state on mobile
export function DataComponent() {
  const { data } = useSWR("/api/data");
  return <div>{data.map(...)}</div>;
}
```

**Instead:**

```tsx
// Responsive loading states
export function DataComponent() {
  const { data, isLoading } = useSWR("/api/data");
  const isMobile = useIsMobile();

  if (isLoading) {
    return isMobile ? <MobileSkeleton /> : <DesktopSkeleton />;
  }

  return <div>{data.map(...)}</div>;
}
```

### 9. Fixed Position Without Safe Areas

**Avoid:**

```tsx
// Overlaps with device UI on iOS
<nav className="fixed bottom-0">
```

**Instead:**

```tsx
// Respects safe areas
<nav className="fixed bottom-0 safe-bottom">
```

### 10. Skipping Cultural Validation

**Avoid:**

```tsx
// Adding Arabic content without validation
<p className="text-right">
  {untranslatedArabicText}
</p>
```

**Instead:**

```tsx
// Validate through iraqi-cultural-validator agent
// Ensure 95%+ cultural appropriateness
// Confirm RTL accuracy through arabic-rtl-processor
```

---

## Troubleshooting

### Layout Shifts on Load

**Problem:** Content jumps when JavaScript loads and detects viewport size.

**Solution:** Use CSS-based responsive design instead of JavaScript detection.

```tsx
// Avoid: JavaScript-based layout
const isMobile = useIsMobile();
return isMobile ? <MobileLayout /> : <DesktopLayout />;

// Prefer: CSS-based responsive design
return (
  <div className="flex flex-col md:flex-row">
    {/* Content adapts with CSS */}
  </div>
);
```

### Touch Targets Too Small

**Problem:** Buttons and links are hard to tap on mobile.

**Solution:** Apply `touch-target` class and ensure proper padding.

```tsx
// Fix small touch targets
<button className="touch-target px-4 py-3">
  Click me
</button>

// For icon-only buttons
<button className="touch-target" aria-label="Close">
  <X className="h-6 w-6" />
</button>
```

### Horizontal Scroll on Mobile

**Problem:** Content overflows viewport width causing horizontal scrolling.

**Solution:** Use `w-full` and `max-w-full` to constrain width.

```tsx
// Prevent overflow
<div className="w-full max-w-full overflow-hidden">
  <div className="container-responsive">
    {/* Content */}
  </div>
</div>

// Check for fixed widths
// Avoid: w-[800px]
// Use: w-full max-w-4xl
```

### Images Not Responsive

**Problem:** Images overflow container or don't scale properly.

**Solution:** Use Next.js Image with proper sizes attribute.

```tsx
import Image from "next/image";
import { getImageSizes } from "@/lib/responsive";

<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={600}
  className="w-full h-auto"
  sizes={getImageSizes({ xs: "100vw", md: "50vw", lg: "33vw" })}
/>
```

### Navigation Drawer Not Closing

**Problem:** Drawer stays open after navigation on mobile.

**Solution:** Close drawer on route change.

```tsx
const [isOpen, setIsOpen] = useState(false);
const pathname = usePathname();

useEffect(() => {
  setIsOpen(false);
}, [pathname]);
```

### Breakpoint Hooks Not Working

**Problem:** `useIsMobile()` or `useBreakpoint()` always returns false.

**Solution:** Ensure component is client-side with `"use client"` directive.

```tsx
"use client"; // Add this at the top of the file

import { useIsMobile } from "@/hooks/use-mobile";

export function Component() {
  const isMobile = useIsMobile();
  // Now works correctly
}
```

### RTL Content Not Aligning Properly

**Problem:** Arabic text not aligning to the right or mixed content issues.

**Solution:** Use `dir` attribute and RTL-aware utilities.

```tsx
<div dir="rtl" className="text-right font-arabic">
  {arabicText}
</div>

// For mixed content, consult arabic-rtl-processor agent
// This area requires refinement
```

### Safe Area Insets Not Applied

**Problem:** Content overlaps with device notches or home indicators.

**Solution:** Use `safe-top` and `safe-bottom` classes.

```tsx
// Fixed header
<header className="fixed top-0 safe-top">

// Fixed bottom navigation
<nav className="fixed bottom-0 safe-bottom">
```

### Grid Columns Not Responsive

**Problem:** Grid doesn't change columns at breakpoints.

**Solution:** Ensure Tailwind includes your column values in safelist.

```tsx
// This works (Tailwind includes 1-12 by default)
<Grid cols={{ xs: 1, md: 2, lg: 3 }} />

// This might not work (values > 12)
<Grid cols={{ xs: 1, md: 15 }} />

// Solution: Use custom CSS or stick to 1-12
```

### Performance Issues on Mobile

**Problem:** Slow rendering or janky animations on mobile devices.

**Solution:** Optimize images, reduce JavaScript, use CSS animations.

```tsx
// Optimize images
<Image
  src="/large.jpg"
  alt="Image"
  sizes={getImageSizes({ xs: "100vw", md: "50vw" })}
  priority={isAboveFold}
/>

// Use CSS animations instead of JS
<div className="transition-transform duration-300 hover:scale-105">

// Lazy load components
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
});
```

### Cultural Validation Failures

**Problem:** Content fails cultural appropriateness validation.

**Solution:** Use Task tool to delegate to `iraqi-cultural-validator` agent.

```typescript
// Validate all Arabic content
// Ensure Islamic compliance (95%+ required)
// Test Iraqi dialect recognition (85%+ required)
// Consult iraqi-cultural-validator for guidance
```

---

## Additional Resources

### Related Documentation

- [**WCAG 2.1 Guidelines**](https://www.w3.org/WAI/WCAG21/quickref/) - Web accessibility standards
- [**Tailwind CSS Responsive Design**](https://tailwindcss.com/docs/responsive-design) - Official Tailwind docs
- [**Next.js Image Optimization**](https://nextjs.org/docs/basic-features/image-optimization) - Image component guide
- [**Cultural Guidelines**](./CULTURAL_GUIDELINES.md) - Iraqi cultural compliance requirements

### Iraqi AI System Documentation

- **Main README**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\README.md`
- **Developer Guide**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\docs\developer\GETTING_STARTED.md`
- **Arabic Processing**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\docs\features\ARABIC_PROCESSING.md`
- **Cultural Validation**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\docs\features\CULTURAL_VALIDATION.md`

### Component Files

- **Layout Components**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\components\layout\`
  - `container.tsx` - Responsive container component
  - `grid.tsx` - Responsive grid component
  - `stack.tsx` - Flexible stack component
  - `responsive-wrapper.tsx` - Conditional rendering wrapper

- **Navigation Components**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\components\navigation\`
  - `mobile-menu.tsx` - Mobile hamburger menu
  - `bottom-nav.tsx` - Mobile bottom navigation
  - `app-nav.tsx` - Responsive drawer/sidebar navigation
  - `nav-link.tsx` - Active route-aware link component

- **Hooks**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\hooks\`
  - `use-mobile.tsx` - Mobile detection hook
  - `use-media-query.tsx` - Generic media query hook
  - `use-breakpoint.tsx` - Breakpoint detection hook

- **Utilities**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\lib\responsive.ts`
- **Styles**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\app\globals.css`

---

## Summary

The Iraqi AI Chat System's responsive layout system provides a comprehensive, mobile-first approach to building adaptive interfaces. Key takeaways:

1. **Mobile-First**: Always start with mobile styles and enhance progressively
2. **Standard Breakpoints**: Use consistent Tailwind breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)
3. **Component Library**: Leverage pre-built Container, Grid, Stack, and ResponsiveWrapper components
4. **Navigation Patterns**: Implement mobile menu, bottom nav, or drawer navigation as appropriate
5. **Custom Hooks**: Use useIsMobile, useMediaQuery, and useBreakpoint for responsive behavior
6. **Utility Functions**: Apply responsive helpers for images, calculations, and viewport detection
7. **CSS Utilities**: Utilize typography scales, touch targets, spacing, and safe areas
8. **Accessibility**: Ensure WCAG 2.1 AA compliance with proper touch targets and semantic HTML
9. **Cultural Compliance**: Validate all content through Iraqi cultural validator (95%+ required)
10. **RTL Refinement**: Note that RTL support needs enhancement per arabic-rtl-processor feedback

For questions or cultural validation requirements, consult the appropriate Iraqi AI agents via the Task tool.

---

**Last Updated**: 2025-10-04
**Version**: 1.0.0
**Maintainer**: Iraqi AI Chat System Documentation Team
