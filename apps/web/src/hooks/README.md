# Responsive Hooks - Quick Reference

React hooks for responsive behavior in the Iraqi AI Chat System.

## Hooks

### useIsMobile

Detect if viewport is mobile-sized (< 768px).

```tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function Component() {
  const isMobile = useIsMobile();

  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
}
```

**Returns**: `boolean`
**Breakpoint**: 768px (md breakpoint)

---

### useMediaQuery

Generic media query hook for custom conditions.

```tsx
"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function Component() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isPrint = useMediaQuery("print");

  return (
    <div>
      <p>Small screen: {isSmallScreen ? "Yes" : "No"}</p>
      <p>Dark mode: {isDarkMode ? "Yes" : "No"}</p>
      <p>Landscape: {isLandscape ? "Yes" : "No"}</p>
      <p>Print mode: {isPrint ? "Yes" : "No"}</p>
    </div>
  );
}
```

**Parameters**: `query: string` - CSS media query
**Returns**: `boolean`

---

### useBreakpoint

Detect specific breakpoint activation.

```tsx
"use client";

import { useBreakpoint } from "@/hooks/use-breakpoint";

export function Component() {
  const isSm = useBreakpoint("sm");
  const isMd = useBreakpoint("md");
  const isLg = useBreakpoint("lg");
  const isXl = useBreakpoint("xl");
  const is2xl = useBreakpoint("2xl");

  return (
    <div>
      <p>Small: {isSm ? "Yes" : "No"}</p>
      <p>Medium: {isMd ? "Yes" : "No"}</p>
      <p>Large: {isLg ? "Yes" : "No"}</p>
    </div>
  );
}
```

**Parameters**: `breakpoint: "sm" | "md" | "lg" | "xl" | "2xl"`
**Returns**: `boolean` (true if viewport >= breakpoint)

---

### useCurrentBreakpoint

Get the current active breakpoint.

```tsx
"use client";

import { useCurrentBreakpoint } from "@/hooks/use-breakpoint";

export function Component() {
  const breakpoint = useCurrentBreakpoint();

  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>

      {breakpoint === "xs" && <p>Extra small viewport</p>}
      {breakpoint === "sm" && <p>Small viewport</p>}
      {breakpoint === "md" && <p>Medium viewport</p>}
      {breakpoint === "lg" && <p>Large viewport</p>}
      {breakpoint === "xl" && <p>Extra large viewport</p>}
      {breakpoint === "2xl" && <p>Ultra wide viewport</p>}
    </div>
  );
}
```

**Returns**: `"xs" | "sm" | "md" | "lg" | "xl" | "2xl"`

---

## Complete Documentation

For comprehensive documentation, examples, and best practices, see:

**[Responsive Patterns Guide](C:\Users\Itokoro\Documents\projects\aqlix-ai\docs\responsive-patterns.md)**

---

## Breakpoints Reference

| Breakpoint | Min Width | Device        | Hook Returns True When |
| ---------- | --------- | ------------- | ---------------------- |
| xs         | 0px       | Mobile        | Always (default)       |
| sm         | 640px     | Large mobile  | Width >= 640px         |
| md         | 768px     | Tablet        | Width >= 768px         |
| lg         | 1024px    | Desktop       | Width >= 1024px        |
| xl         | 1280px    | Large desktop | Width >= 1280px        |
| 2xl        | 1536px    | Ultra-wide    | Width >= 1536px        |

---

## Common Patterns

### Mobile-Specific Features

```tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function FeatureComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Always show */}
      <BasicContent />

      {/* Mobile-only features */}
      {isMobile && <TouchGestures />}
      {isMobile && <BottomSheet />}

      {/* Desktop-only features */}
      {!isMobile && <AdvancedTools />}
      {!isMobile && <ContextMenu />}
    </div>
  );
}
```

### Responsive Layout

```tsx
"use client";

import { useBreakpoint } from "@/hooks/use-breakpoint";

export function ResponsiveGrid() {
  const isLg = useBreakpoint("lg");
  const isMd = useBreakpoint("md");

  const columns = isLg ? 4 : isMd ? 3 : 2;

  return (
    <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </div>
  );
}
```

### Conditional Data Loading

```tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import useSWR from "swr";

export function DataComponent() {
  const isMobile = useIsMobile();

  // Load less data on mobile
  const { data } = useSWR(
    isMobile ? "/api/data?limit=10" : "/api/data?limit=50",
  );

  return (
    <div>
      {data?.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
}
```

### Responsive Image Loading

```tsx
"use client";

import { useCurrentBreakpoint } from "@/hooks/use-breakpoint";

export function ResponsiveImage() {
  const breakpoint = useCurrentBreakpoint();

  const imageSize = {
    xs: "small",
    sm: "medium",
    md: "medium",
    lg: "large",
    xl: "xlarge",
    "2xl": "xxlarge",
  }[breakpoint];

  return (
    <img src={`/images/hero-${imageSize}.jpg`} alt="Hero" loading="lazy" />
  );
}
```

### Dark Mode Detection

```tsx
"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function ThemeComponent() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <div className={prefersDark ? "dark" : "light"}>
      <p>Current theme: {prefersDark ? "Dark" : "Light"}</p>
    </div>
  );
}
```

### Print-Specific Rendering

```tsx
"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function PrintableComponent() {
  const isPrint = useMediaQuery("print");

  return (
    <div>
      {!isPrint && <InteractiveControls />}

      <Content />

      {isPrint && <PrintFooter />}
    </div>
  );
}
```

### Orientation Detection

```tsx
"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function OrientationComponent() {
  const isLandscape = useMediaQuery("(orientation: landscape)");

  return (
    <div className={isLandscape ? "landscape-layout" : "portrait-layout"}>
      {isLandscape ? <WideView /> : <TallView />}
    </div>
  );
}
```

---

## Important Notes

### Client-Side Only

All responsive hooks **require client-side rendering**. Always add `"use client"` directive:

```tsx
"use client"; // Required for hooks

import { useIsMobile } from "@/hooks/use-mobile";

export function Component() {
  const isMobile = useIsMobile();
  // ...
}
```

### Server-Side Rendering

Hooks return default values during SSR:

- `useIsMobile()`: `false` (assumes desktop)
- `useCurrentBreakpoint()`: `"md"` (medium breakpoint)
- `useMediaQuery(query)`: `false`

Handle SSR gracefully:

```tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export function Component() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <DefaultView />;
  }

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### Performance

Hooks use `window.matchMedia` with event listeners for optimal performance:

- ✅ No polling or resize listeners
- ✅ Browser-native media query matching
- ✅ Automatic cleanup on unmount
- ✅ Minimal re-renders

---

## Prefer CSS When Possible

For simple responsive layouts, **prefer CSS over JavaScript hooks**:

```tsx
// Good: CSS-based (no JavaScript, better performance)
<div className="flex-col md:flex-row">
  <div>Left</div>
  <div>Right</div>
</div>;

// Avoid: Hook-based (unnecessary JavaScript)
const isMd = useBreakpoint("md");
<div className={isMd ? "flex-row" : "flex-col"}>
  <div>Left</div>
  <div>Right</div>
</div>;
```

Use hooks only when you need:

- Conditional component rendering
- Different component logic
- Dynamic calculations
- API calls based on viewport

---

## TypeScript Support

All hooks are fully typed:

```tsx
import { useMediaQuery } from "@/hooks/use-media-query";
import { useBreakpoint, useCurrentBreakpoint } from "@/hooks/use-breakpoint";

// useMediaQuery returns boolean
const isMobile: boolean = useMediaQuery("(max-width: 767px)");

// useBreakpoint returns boolean
const isDesktop: boolean = useBreakpoint("lg");

// useCurrentBreakpoint returns specific type
const current: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" =
  useCurrentBreakpoint();
```

---

## Testing

Mock hooks in tests:

```tsx
import { vi } from "vitest";

// Mock useIsMobile
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: vi.fn(() => true), // Simulate mobile
}));

// Mock useMediaQuery
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: vi.fn(() => false),
}));

// Mock useBreakpoint
vi.mock("@/hooks/use-breakpoint", () => ({
  useBreakpoint: vi.fn(() => true),
  useCurrentBreakpoint: vi.fn(() => "md"),
}));
```

---

## Related

- **Layout Components**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\components\layout\README.md`
- **Navigation Components**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\components\navigation\README.md`
- **Responsive Utilities**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\apps\web\src\lib\responsive.ts`
