/**
 * E2E Tests for RTL Foundation
 *
 * Tests for HTML dir attribute, locale changes, and localStorage persistence.
 * Validates that RTL direction is properly applied and persists across sessions.
 */

import { test, expect } from "@playwright/test";

test.describe("RTL Foundation", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("should set dir attribute on html element", async ({ page }) => {
    await page.goto("/");

    // Check that dir attribute is set to rtl
    const htmlDir = await page.evaluate(() => document.documentElement.dir);
    expect(htmlDir).toBe("rtl");

    // Verify the lang attribute is also set correctly
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    expect(htmlLang).toBe("ar");
  });

  test("should apply direction to document on locale change", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify initial RTL direction
    let direction = await page.evaluate(() => document.dir);
    expect(direction).toBe("rtl");

    // Verify initial locale in localStorage
    const config = await page.evaluate(() => {
      const stored = localStorage.getItem("iraqi-rtl-config");
      return stored ? JSON.parse(stored) : null;
    });
    expect(config?.direction).toBe("rtl");
    expect(config?.locale).toBe("ar-IQ");

    // Switch to English (LTR) by updating localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "iraqi-rtl-config",
        JSON.stringify({
          locale: "en-US",
          direction: "ltr",
          dialectPreference: "standard",
          layoutPreferences: {
            textAlignment: "auto",
            navigationDirection: "ltr",
            contentFlow: "natural",
          },
        }),
      );
    });

    // Reload to apply changes
    await page.reload();

    // Verify direction changed to LTR
    direction = await page.evaluate(() => document.dir);
    expect(direction).toBe("ltr");

    // Verify locale changed to English
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    expect(htmlLang).toBe("en-US");
  });

  test("should persist direction preference in localStorage", async ({
    page,
  }) => {
    await page.goto("/");

    // Check that localStorage contains RTL config
    const config = await page.evaluate(() => {
      return localStorage.getItem("iraqi-rtl-config");
    });

    expect(config).toBeTruthy();

    // Parse and validate config structure
    const parsed = JSON.parse(config!);
    expect(parsed).toHaveProperty("direction");
    expect(parsed).toHaveProperty("locale");
    expect(parsed).toHaveProperty("dialectPreference");
    expect(parsed).toHaveProperty("layoutPreferences");

    // Validate default values
    expect(parsed.direction).toBe("rtl");
    expect(parsed.locale).toBe("ar-IQ");
    expect(parsed.dialectPreference).toBe("baghdad");
  });

  test("should apply direction class to body element", async ({ page }) => {
    await page.goto("/");

    // Check that body has rtl class
    const bodyClasses = await page.evaluate(() => {
      return document.body.className;
    });

    expect(bodyClasses).toContain("rtl");
  });

  test("should maintain direction after page navigation", async ({ page }) => {
    await page.goto("/");

    // Verify initial direction
    let direction = await page.evaluate(() => document.dir);
    expect(direction).toBe("rtl");

    // Navigate to a different page (if available)
    // For now, just reload the page
    await page.reload();

    // Verify direction is maintained
    direction = await page.evaluate(() => document.dir);
    expect(direction).toBe("rtl");

    // Verify localStorage still has the config
    const config = await page.evaluate(() => {
      return localStorage.getItem("iraqi-rtl-config");
    });
    expect(config).toBeTruthy();
  });

  test("should handle corrupt localStorage gracefully", async ({ page }) => {
    await page.goto("/");

    // Set invalid JSON in localStorage
    await page.evaluate(() => {
      localStorage.setItem("iraqi-rtl-config", "invalid-json{]");
    });

    // Reload and verify defaults are used
    await page.reload();

    const direction = await page.evaluate(() => document.dir);
    expect(direction).toBe("rtl"); // Should fallback to default

    // Verify localStorage was corrected with valid config
    const config = await page.evaluate(() => {
      const stored = localStorage.getItem("iraqi-rtl-config");
      try {
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    });
    expect(config).toBeTruthy();
    expect(config?.direction).toBe("rtl");
  });

  test("should set correct CSS custom properties for RTL", async ({ page }) => {
    await page.goto("/");

    // Check CSS custom properties for RTL
    const customProps = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        textAlignStart: styles.getPropertyValue("--text-align-start").trim(),
        textAlignEnd: styles.getPropertyValue("--text-align-end").trim(),
        insetStart: styles.getPropertyValue("--inset-start").trim(),
        insetEnd: styles.getPropertyValue("--inset-end").trim(),
      };
    });

    expect(customProps.textAlignStart).toBe("right");
    expect(customProps.textAlignEnd).toBe("left");
    expect(customProps.insetStart).toBe("right");
    expect(customProps.insetEnd).toBe("left");
  });
});
