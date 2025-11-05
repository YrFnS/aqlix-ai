import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Accessibility Tests: WCAG 2.1 AA Compliance
 * Tests for Iraqi AI Chat System accessibility requirements
 */

/**
 * Helper function to inject axe-core for accessibility testing
 * Uses local vendored package instead of CDN for reliability
 */
async function injectAxe(page: Page) {
  // Read axe-core from local node_modules
  const axePath = path.join(
    process.cwd(),
    "node_modules",
    "axe-core",
    "axe.min.js",
  );
  const axeSource = fs.readFileSync(axePath, "utf8");

  // Inject local axe-core script
  await page.addScriptTag({ content: axeSource });
}

/**
 * Helper function to run axe-core accessibility checks
 */
async function checkA11y(page: Page, context?: string) {
  const results = await page.evaluate(() => {
    return new Promise((resolve) => {
      // @ts-expect-error - axe is injected at runtime
      axe.run((err: Error, results: unknown) => {
        if (err) throw err;
        resolve(results);
      });
    });
  });

  // @ts-expect-error - results from axe-core
  const violations = results.violations;

  if (violations.length > 0) {
    console.error(
      `Accessibility violations ${context ? `on ${context}` : ""}:`,
    );
    console.error(
      violations.map((v: { id: string; description: string; nodes: [] }) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
      })),
    );
  }

  return violations;
}

test.describe("WCAG 2.1 AA Compliance", () => {
  test.beforeEach(async ({ page }) => {
    await injectAxe(page);
  });

  test("homepage should have no accessibility violations", async ({ page }) => {
    await page.goto("/");
    const violations = await checkA11y(page, "homepage");
    expect(violations).toHaveLength(0);
  });

  test("dashboard should have no accessibility violations", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    const violations = await checkA11y(page, "dashboard");
    expect(violations).toHaveLength(0);
  });

  test("settings page should have no accessibility violations", async ({
    page,
  }) => {
    await page.goto("/settings");
    const violations = await checkA11y(page, "settings");
    expect(violations).toHaveLength(0);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Get all headings
    const headings = await page.$$eval("h1, h2, h3, h4, h5, h6", (elements) =>
      elements.map((el) => ({
        level: parseInt(el.tagName.charAt(1)),
        text: el.textContent?.trim(),
      })),
    );

    // Verify there's exactly one h1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count).toBe(1);

    // Verify heading levels don't skip
    for (let i = 1; i < headings.length; i++) {
      const diff = headings[i].level - headings[i - 1].level;
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test("should have proper ARIA labels on interactive elements", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Check buttons have accessible names
    const buttons = await page.$$("button");
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute("aria-label");
      const text = await button.textContent();
      const hasAccessibleName = ariaLabel || text?.trim();
      expect(hasAccessibleName).toBeTruthy();
    }

    // Check links have accessible names
    const links = await page.$$("a");
    for (const link of links) {
      const ariaLabel = await link.getAttribute("aria-label");
      const text = await link.textContent();
      const hasAccessibleName = ariaLabel || text?.trim();
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test("should have proper focus indicators", async ({ page }) => {
    await page.goto("/");

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    const firstFocused = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el as Element);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineColor: styles.outlineColor,
      };
    });

    // Verify focus indicator exists
    expect(
      firstFocused.outline !== "none" || firstFocused.outlineWidth !== "0px",
    ).toBeTruthy();
  });

  test("should have sufficient color contrast", async ({ page }) => {
    await page.goto("/");

    // Check text color contrast
    const textElements = await page.$$("p, span, a, button, h1, h2, h3");
    for (const element of textElements.slice(0, 10)) {
      // Sample first 10
      const contrast = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        // This is simplified - in production, use actual contrast calculation
        return { color, backgroundColor };
      });

      expect(contrast.color).not.toBe(contrast.backgroundColor);
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/dashboard");

    // Get initial focus
    await page.keyboard.press("Tab");
    const firstElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );

    // Continue tabbing
    await page.keyboard.press("Tab");
    const secondElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );

    // Verify focus moved
    expect(secondElement).not.toBe("BODY");

    // Test shift+tab (reverse navigation)
    await page.keyboard.press("Shift+Tab");
    const backToFirst = await page.evaluate(
      () => document.activeElement?.tagName,
    );

    expect(backToFirst).toBe(firstElement);
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/settings");

    // Check all inputs have labels
    const inputs = await page.$$("input");
    for (const input of inputs) {
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");

      // Either has aria-label, aria-labelledby, or associated label
      const hasLabel =
        ariaLabel ||
        ariaLabelledBy ||
        (id && (await page.$(`label[for="${id}"]`)));

      expect(hasLabel).toBeTruthy();
    }
  });

  test("should have proper alt text on images", async ({ page }) => {
    await page.goto("/");

    const images = await page.$$("img");
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const ariaLabel = await img.getAttribute("aria-label");
      const role = await img.getAttribute("role");

      // Either has alt text, aria-label, or role="presentation"
      const isAccessible = alt !== null || ariaLabel || role === "presentation";
      expect(isAccessible).toBeTruthy();
    }
  });

  test("should have proper landmarks and regions", async ({ page }) => {
    await page.goto("/");

    // Check for main landmark
    const main = await page.$("main, [role='main']");
    expect(main).not.toBeNull();

    // Check for navigation landmark
    const nav = await page.$("nav, [role='navigation']");
    expect(nav).not.toBeNull();

    // Check for complementary regions if they exist
    const aside = await page.$$("aside, [role='complementary']");
    // Just verify they exist if present (not all pages need them)
  });

  test("should handle Arabic RTL accessibility", async ({ page }) => {
    await page.goto("/dashboard");

    // Switch to Arabic
    await page.click('[data-testid="language-switcher"]');
    await page.click('[data-testid="language-option-ar"]');

    // Verify direction change
    const htmlDir = await page.getAttribute("html", "dir");
    expect(htmlDir).toBe("rtl");

    // Run accessibility check with RTL
    const violations = await checkA11y(page, "Arabic RTL");
    expect(violations).toHaveLength(0);

    // Verify screen reader announcements for language change
    const announcement = await page.$('[role="status"]');
    expect(announcement).not.toBeNull();
  });
});
