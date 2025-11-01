# Performance Optimization Guide - Iraqi AI Chat System

## Overview

This guide covers performance optimization strategies for the Iraqi AI Chat System with specific focus on:

- Iraqi network conditions (3G/4G optimization)
- Core Web Vitals targets (LCP, CLS, FID)
- Arabic text rendering performance
- Mobile-first optimization (iPhone SE, Android devices)
- Resource caching strategies

---

## Core Web Vitals Targets

### Iraqi Network Performance Goals

| Network       | LCP Target | FID Target | CLS Target |
| ------------- | ---------- | ---------- | ---------- |
| 3G (384 Kbps) | < 4.0s     | < 150ms    | < 0.1      |
| 3G (2 Mbps)   | < 3.0s     | < 100ms    | < 0.1      |
| 4G (10 Mbps)  | < 2.5s     | < 75ms     | < 0.1      |
| 4G (50 Mbps)  | < 1.5s     | < 50ms     | < 0.05     |

### What Are Core Web Vitals?

**LCP (Largest Contentful Paint)**

- Measures loading performance
- Time until the largest content element becomes visible
- Target: < 2.5s (good), < 4.0s (needs improvement)

**FID (First Input Delay)**

- Measures interactivity
- Time from first user interaction to browser response
- Target: < 100ms (good), < 300ms (needs improvement)

**CLS (Cumulative Layout Shift)**

- Measures visual stability
- Sum of all unexpected layout shifts during page load
- Target: < 0.1 (good), < 0.25 (needs improvement)

---

## Next.js Configuration Optimizations

### Image Optimization

```typescript
// apps/web/next.config.ts
images: {
  formats: ["image/avif", "image/webp"], // Modern formats
  deviceSizes: [360, 375, 640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

**Device Sizes Breakdown:**

- **360px**: Common Android width
- **375px**: iPhone SE, iPhone 12 Mini
- **640px**: Small tablets
- **750px**: iPhone 12/13/14 Pro (2x)
- **1080px**: Desktop small
- **1920px**: Desktop HD

### Bundle Size Optimization

```typescript
experimental: {
  // Optimize package imports (tree-shaking)
  optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  // Optimize CSS delivery
  optimizeCss: true,
  // Reduce server action payloads for slower networks
  serverActions: {
    bodySizeLimit: "2mb",
  },
}
```

### Resource Caching Headers

```typescript
async headers() {
  return [
    // Static assets: 1 year cache (immutable)
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    // Images: 1 day cache (revalidate)
    {
      source: "/images/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, must-revalidate",
        },
      ],
    },
    // Fonts: 1 year cache (immutable)
    {
      source: "/fonts/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ];
}
```

---

## Layout Shift Prevention (CLS < 0.1)

### 1. Always Specify Image Dimensions

```tsx
// ❌ BAD - Causes layout shift
<Image src="/example.jpg" alt="Example" />

// ✅ GOOD - No layout shift
<Image
  src="/example.jpg"
  alt="Example"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

### 2. Use aspect-ratio for Responsive Images

```tsx
// For responsive fill images
<div className="relative w-full aspect-video">
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    sizes="100vw"
    className="object-cover"
  />
</div>
```

### 3. Reserve Space for Dynamic Content

```tsx
// Loading skeleton with fixed height
<div className="min-h-[200px]">
  {loading ? <Skeleton className="h-[200px]" /> : <DynamicContent />}
</div>
```

### 4. Font Loading Optimization

```tsx
// app/layout.tsx
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap", // Prevents layout shift during font load
  fallback: ["system-ui", "arial"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar-IQ" dir="rtl" className={cairo.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Arabic Text Rendering Performance

### 1. Font Optimization

**Use `font-display: swap`:**

```css
/* Prevents invisible text during font load */
@font-face {
  font-family: "Cairo";
  src: url("/fonts/cairo.woff2") format("woff2");
  font-display: swap;
  font-weight: 400;
  font-style: normal;
}
```

**Preload Critical Fonts:**

```tsx
// app/layout.tsx
export default function RootLayout() {
  return (
    <html>
      <head>
        <link
          rel="preload"
          href="/fonts/cairo-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>...</body>
    </html>
  );
}
```

### 2. RTL Direction Optimization

```tsx
// Optimize RTL switching with CSS containment
<div dir="rtl" lang="ar-IQ" className="contain-layout contain-paint">
  {arabicContent}
</div>
```

### 3. Text Rendering Hints

```css
/* Optimize Arabic text rendering */
.font-arabic {
  font-family:
    "Cairo",
    "Noto Sans Arabic",
    system-ui,
    -apple-system,
    sans-serif;
  font-feature-settings:
    "liga" 1,
    "kern" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## JavaScript Bundle Optimization

### 1. Code Splitting

```tsx
// Dynamic imports for non-critical components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false, // Disable SSR if not needed
});

export function Page() {
  return (
    <div>
      <CriticalContent />
      <HeavyComponent />
    </div>
  );
}
```

### 2. Route-Based Code Splitting

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import dynamic from "next/dynamic";

const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"));
const DashboardStats = dynamic(() => import("@/components/DashboardStats"));

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<ChartsSkeleton />}>
        <DashboardCharts />
      </Suspense>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
```

### 3. Optimize Third-Party Scripts

```tsx
// Use next/script with appropriate loading strategy
import Script from "next/script";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Load analytics after page is interactive */}
      <Script
        src="https://analytics.example.com/script.js"
        strategy="lazyOnload"
      />
    </>
  );
}
```

---

## Memory Optimization

### 1. Cleanup Effect Subscriptions

```tsx
import { useEffect } from "react";

export function ChatComponent() {
  useEffect(() => {
    const subscription = chatService.subscribe((message) => {
      // Handle message
    });

    // Cleanup subscription to prevent memory leaks
    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
```

### 2. Virtualize Long Lists

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

export function MessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated item height
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <MessageItem message={messages[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Debounce Expensive Operations

```tsx
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      // Expensive search operation
      performSearch(value);
    },
    500, // 500ms delay
  );

  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

---

## 3G Network Testing

### Using Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Click **Throttling** dropdown
4. Select **Slow 3G** (400ms RTT, 400 Kbps down, 400 Kbps up)
5. Reload page and measure Core Web Vitals

### Using Playwright (Automated Testing)

```typescript
// apps/web/tests/e2e/performance/3g-performance.spec.ts
import { test, expect } from "@playwright/test";

test("should load on Iraqi 3G network", async ({ page, context }) => {
  // Simulate Iraqi 3G: 384 Kbps down, 128 Kbps up, 300ms latency
  await context.route("**/*", (route) => {
    route.continue({
      // Simulate network delay
      postData: route.request().postData(),
    });
  });

  await page.goto("/");

  // Measure LCP
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      setTimeout(() => observer.disconnect(), 10000);
    });
  });

  // LCP should be < 4s on 3G
  expect(lcp as number).toBeLessThan(4000);
});
```

---

## Mobile Performance Optimization

### 1. Touch Target Sizes (Accessibility & UX)

```tsx
// Ensure touch targets are at least 44x44px
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  {/* Button content */}
</button>
```

### 2. Reduce JavaScript Execution Time

```tsx
// Use React.memo for expensive components
import { memo } from "react";

export const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
}: {
  data: Data;
}) {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

### 3. Optimize CSS Delivery

```tsx
// Inline critical CSS in <head>
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical above-the-fold CSS */
              body { margin: 0; font-family: system-ui; }
              .loading { display: flex; min-height: 100vh; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Performance Monitoring

### 1. Web Vitals Tracking

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 2. Custom Performance Tracking

```tsx
// lib/performance.ts
export function reportWebVitals(metric: NextWebVitalsMetric) {
  const { id, name, label, value } = metric;

  // Send to analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, {
      event_category: label === "web-vital" ? "Web Vitals" : "Next.js Metric",
      event_label: id,
      value: Math.round(name === "CLS" ? value * 1000 : value),
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}:`, value);
  }
}
```

### 3. Performance Budget Enforcement

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "build": "next build && npm run check-bundle-size"
  },
  "bundlewatch": {
    "files": [
      {
        "path": ".next/static/**/*.js",
        "maxSize": "500kb"
      }
    ]
  }
}
```

---

## Testing Checklist

### Core Web Vitals

- [ ] LCP < 2.5s on desktop, < 4s on 3G
- [ ] FID < 100ms
- [ ] CLS < 0.1

### Network Conditions

- [ ] Test on Slow 3G (384 Kbps)
- [ ] Test on Fast 3G (2 Mbps)
- [ ] Test on 4G (10 Mbps)

### Mobile Performance

- [ ] Test on iPhone SE (375px)
- [ ] Test on Android (360px)
- [ ] Touch targets ≥ 44x44px
- [ ] Mobile performance score > 90

### Resource Optimization

- [ ] JavaScript bundle < 500KB
- [ ] Images use lazy loading
- [ ] Fonts preloaded
- [ ] CSS inlined for critical path

### Arabic-Specific

- [ ] RTL layout no shift on switch
- [ ] Arabic fonts load < 500ms
- [ ] Text rendering optimized

---

## Performance Optimization Roadmap

### Phase 1: Immediate Wins (Completed ✅)

- ✅ Image optimization configuration
- ✅ Resource caching headers
- ✅ Bundle size optimization
- ✅ CSS optimization

### Phase 2: Code Splitting (Next)

- [ ] Dynamic imports for heavy components
- [ ] Route-based code splitting
- [ ] Lazy loading for below-the-fold content

### Phase 3: Advanced Optimizations

- [ ] Service Worker for offline support
- [ ] Web Workers for CPU-intensive tasks
- [ ] Request deduplication
- [ ] Optimistic UI updates

### Phase 4: Monitoring & Continuous Improvement

- [ ] Real User Monitoring (RUM) integration
- [ ] Performance regression testing in CI/CD
- [ ] Automated performance budgets
- [ ] Regular 3G network testing

---

## Common Performance Issues & Solutions

### Issue 1: Large LCP (> 2.5s)

**Symptoms**: Homepage loads slowly, first content takes too long to render

**Solutions**:

1. Preload critical images with `priority={true}`
2. Optimize image sizes (use appropriate `sizes` prop)
3. Reduce JavaScript bundle size
4. Enable compression (gzip/brotli)

### Issue 2: High CLS (> 0.1)

**Symptoms**: Content jumps around during load, layout shifts

**Solutions**:

1. Always specify image dimensions
2. Use `aspect-ratio` for responsive images
3. Reserve space for dynamic content
4. Use `font-display: swap` for web fonts

### Issue 3: Slow FID (> 100ms)

**Symptoms**: Page feels unresponsive to user input

**Solutions**:

1. Code splitting to reduce JavaScript execution time
2. Debounce expensive operations
3. Use React.memo for heavy components
4. Offload work to Web Workers

### Issue 4: Excessive Memory Usage

**Symptoms**: Page becomes sluggish after prolonged use

**Solutions**:

1. Cleanup useEffect subscriptions
2. Virtualize long lists
3. Avoid memory leaks in event listeners
4. Use WeakMap for caching

---

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Iraqi Internet Speed Data](https://www.speedtest.net/global-index/iraq)
- [WCAG Performance Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable)

---

**Last Updated**: 2025-11-01
**Version**: 1.0.0
