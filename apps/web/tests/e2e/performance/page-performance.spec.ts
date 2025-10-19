import { test, expect } from "@playwright/test";
import type { Metrics } from "@playwright/test";

/**
 * Performance Tests
 * Page load time, Core Web Vitals, and performance metrics
 */
test.describe("Page Performance", () => {
  test("homepage should load within performance budget", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("dashboard should meet Core Web Vitals thresholds", async ({ page }) => {
    await page.goto("/dashboard");

    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (performance.getEntriesByType) {
          const paintEntries = performance.getEntriesByType("paint");
          const fcp = paintEntries.find(
            (entry) => entry.name === "first-contentful-paint",
          );
          const navigationTiming = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming;

          resolve({
            fcp: fcp?.startTime || 0,
            domContentLoaded: navigationTiming?.domContentLoadedEventEnd || 0,
            loadComplete: navigationTiming?.loadEventEnd || 0,
          });
        }
      });
    });

    // @ts-expect-error - metrics from browser
    const { fcp, domContentLoaded, loadComplete } = metrics;

    // First Contentful Paint should be < 1.8s (good)
    expect(fcp).toBeLessThan(1800);

    // DOM Content Loaded should be < 2s
    expect(domContentLoaded).toBeLessThan(2000);

    // Full load should be < 3s
    expect(loadComplete).toBeLessThan(3000);
  });

  test("should have acceptable Time to Interactive (TTI)", async ({ page }) => {
    await page.goto("/");

    const tti = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ("PerformanceObserver" in window) {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // Simplified TTI estimation using domContentLoaded
              if (entry.entryType === "navigation") {
                const navEntry = entry as PerformanceNavigationTiming;
                resolve(navEntry.domContentLoadedEventEnd);
              }
            }
          });

          observer.observe({ entryTypes: ["navigation"] });

          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });

    // TTI should be < 3.8s (good threshold)
    expect(tti as number).toBeLessThan(3800);
  });

  test("should have minimal Cumulative Layout Shift (CLS)", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Wait for layout to stabilize
    await page.waitForTimeout(1000);

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;

        if ("PerformanceObserver" in window) {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // @ts-expect-error - layout shift entry
              if (!entry.hadRecentInput) {
                // @ts-expect-error - layout shift entry
                clsValue += entry.value;
              }
            }
          });

          observer.observe({ type: "layout-shift", buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 3000);
        } else {
          resolve(0);
        }
      });
    });

    // CLS should be < 0.1 (good)
    expect(cls as number).toBeLessThan(0.1);
  });

  test("should have acceptable Largest Contentful Paint (LCP)", async ({
    page,
  }) => {
    await page.goto("/");

    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ("PerformanceObserver" in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });

          observer.observe({
            type: "largest-contentful-paint",
            buffered: true,
          });

          setTimeout(() => {
            observer.disconnect();
          }, 5000);
        } else {
          resolve(0);
        }
      });
    });

    // LCP should be < 2.5s (good)
    expect(lcp as number).toBeLessThan(2500);
  });

  test("should have good First Input Delay (FID)", async ({ page }) => {
    await page.goto("/dashboard");

    // Simulate user interaction
    await page.waitForSelector('[data-testid="message-input"]');

    const startTime = Date.now();
    await page.click('[data-testid="message-input"]');
    const fid = Date.now() - startTime;

    // FID should be < 100ms (good)
    expect(fid).toBeLessThan(100);
  });

  test("should load images efficiently", async ({ page }) => {
    await page.goto("/");

    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll("img"));
      return images.map((img) => ({
        src: img.src,
        loading: img.loading,
        width: img.naturalWidth,
        height: img.naturalHeight,
        decoded: img.complete && img.naturalHeight !== 0,
      }));
    });

    // Verify images use lazy loading where appropriate
    const hasLazyLoading = imageMetrics.some((img) => img.loading === "lazy");
    expect(hasLazyLoading).toBeTruthy();

    // Verify all images decoded successfully
    const allDecoded = imageMetrics.every((img) => img.decoded);
    expect(allDecoded).toBeTruthy();
  });

  test("should load JavaScript bundles efficiently", async ({ page }) => {
    await page.goto("/");

    const scriptSizes = await page.evaluate(() => {
      return performance
        .getEntriesByType("resource")
        .filter((entry) => entry.name.endsWith(".js"))
        .map((entry) => ({
          name: entry.name,
          size: (entry as PerformanceResourceTiming).transferSize,
          duration: entry.duration,
        }));
    });

    // Total JS size should be reasonable (< 500KB for initial load)
    const totalSize = scriptSizes.reduce((sum, script) => sum + script.size, 0);
    expect(totalSize).toBeLessThan(500 * 1024); // 500KB

    // Individual scripts should load quickly (< 1s each)
    scriptSizes.forEach((script) => {
      expect(script.duration).toBeLessThan(1000);
    });
  });

  test("should cache resources effectively", async ({ page }) => {
    // First visit
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const firstLoadResources = await page.evaluate(() => {
      return performance.getEntriesByType("resource").length;
    });

    // Second visit (should use cache)
    await page.reload();
    await page.waitForLoadState("networkidle");

    const cachedResources = await page.evaluate(() => {
      return performance.getEntriesByType("resource").filter((entry) => {
        const timing = entry as PerformanceResourceTiming;
        return timing.transferSize === 0; // From cache
      }).length;
    });

    // At least 50% of resources should be cached
    expect(cachedResources).toBeGreaterThan(firstLoadResources * 0.5);
  });

  test("should handle Arabic text rendering performance", async ({ page }) => {
    await page.goto("/dashboard");

    // Switch to Arabic
    await page.click('[data-testid="language-switcher"]');

    const startTime = Date.now();
    await page.click('[data-testid="language-option-ar"]');

    // Wait for RTL to apply
    await page.waitForFunction(() => document.documentElement.dir === "rtl");

    const switchTime = Date.now() - startTime;

    // Language switch should be fast (< 500ms)
    expect(switchTime).toBeLessThan(500);

    // Verify no layout shift during switch
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        if ("PerformanceObserver" in window) {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // @ts-expect-error - layout shift entry
              if (!entry.hadRecentInput) {
                // @ts-expect-error - layout shift entry
                clsValue += entry.value;
              }
            }
          });

          observer.observe({ type: "layout-shift", buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        } else {
          resolve(0);
        }
      });
    });

    expect(cls as number).toBeLessThan(0.05);
  });

  test("should have acceptable memory usage", async ({ page }) => {
    await page.goto("/dashboard");

    // Perform multiple interactions
    for (let i = 0; i < 10; i++) {
      await page.fill('[data-testid="message-input"]', `Test message ${i}`);
      await page.click('[data-testid="send-button"]');
      await page.waitForTimeout(500);
    }

    // @ts-expect-error - performance.memory is Chrome-specific
    const memory = await page.evaluate(() => performance.memory);

    if (memory) {
      // Used JS heap should be reasonable (< 50MB)
      expect(memory.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test("should load fonts efficiently", async ({ page }) => {
    await page.goto("/");

    const fontMetrics = await page.evaluate(() => {
      return performance
        .getEntriesByType("resource")
        .filter(
          (entry) =>
            entry.name.includes("font") ||
            entry.name.endsWith(".woff2") ||
            entry.name.endsWith(".woff"),
        )
        .map((entry) => ({
          name: entry.name,
          duration: entry.duration,
          size: (entry as PerformanceResourceTiming).transferSize,
        }));
    });

    // Fonts should load quickly (< 500ms each)
    fontMetrics.forEach((font) => {
      expect(font.duration).toBeLessThan(500);
    });

    // Total font size should be reasonable (< 200KB)
    const totalFontSize = fontMetrics.reduce((sum, font) => sum + font.size, 0);
    expect(totalFontSize).toBeLessThan(200 * 1024);
  });
});
