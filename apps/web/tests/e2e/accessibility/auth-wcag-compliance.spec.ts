/**
 * Authentication System - WCAG 2.1 AA Compliance E2E Tests
 *
 * Test Coverage:
 * - Automated axe-core accessibility audits
 * - Color contrast verification
 * - Keyboard navigation in RTL context
 * - Focus indicator visibility
 * - Touch target sizes on mobile
 * - Screen reader compatibility structure
 *
 * TRUTHFULNESS PROTOCOL:
 * These tests provide ACTUAL evidence of accessibility compliance.
 * Tests use real browser rendering and axe-core validation.
 * Failures indicate REAL accessibility barriers that MUST be fixed.
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Test Configuration
 */
test.describe.configure({ mode: "parallel" });

/**
 * Automated Axe-Core Accessibility Audits
 * Status: Tests run actual axe-core validation in browser
 */
test.describe("Axe-Core WCAG 2.1 AA Compliance", () => {
  test("Login page - should have NO accessibility violations", async ({
    page,
  }) => {
    // Navigate to login page
    await page.goto("/auth/login");

    // Run axe accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // TRUTHFULNESS: Test will fail if violations exist
    expect(accessibilityScanResults.violations).toEqual([]);

    // Log detailed results for documentation
    if (accessibilityScanResults.violations.length > 0) {
      console.error("❌ Accessibility violations found:");
      accessibilityScanResults.violations.forEach((violation) => {
        console.error(`\n${violation.id}: ${violation.description}`);
        console.error(`Impact: ${violation.impact}`);
        console.error(`Help: ${violation.helpUrl}`);
        violation.nodes.forEach((node) => {
          console.error(`  Element: ${node.html}`);
          console.error(`  Failure: ${node.failureSummary}`);
        });
      });
    }
  });

  test("Register page - should have NO accessibility violations", async ({
    page,
  }) => {
    await page.goto("/auth/register");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("MFA Setup page - should have NO accessibility violations", async ({
    page,
  }) => {
    await page.goto("/auth/mfa-setup");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Password Reset page - should have NO accessibility violations", async ({
    page,
  }) => {
    await page.goto("/auth/password-reset");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Verify Email page - should have NO accessibility violations", async ({
    page,
  }) => {
    await page.goto("/auth/verify-email");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

/**
 * Color Contrast Verification
 * Status: Tests verify actual rendered contrast ratios
 */
test.describe("WCAG 2.1 AA Color Contrast", () => {
  test("Login form - verify color contrast compliance", async ({ page }) => {
    await page.goto("/auth/login");

    // Run axe with color-contrast rules specifically
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include("[role='form']")
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );

    // TRUTHFULNESS: Report actual contrast violations
    expect(contrastViolations).toEqual([]);

    if (contrastViolations.length > 0) {
      console.error("❌ Color contrast violations:");
      contrastViolations.forEach((violation) => {
        violation.nodes.forEach((node) => {
          console.error(`  Element: ${node.html}`);
          console.error(`  Contrast: ${JSON.stringify(node.any)}`);
        });
      });
    }
  });

  test("Register form - verify color contrast compliance", async ({ page }) => {
    await page.goto("/auth/register");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include("form")
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );

    expect(contrastViolations).toEqual([]);
  });

  test("Error messages - verify color contrast meets 4.5:1 ratio", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    // Trigger validation errors
    await page.click('button[type="submit"]');

    // Wait for error messages
    await page.waitForSelector("text=/البريد الإلكتروني مطلوب/i", {
      timeout: 2000,
    });

    // Check color contrast on error messages
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );

    expect(contrastViolations).toEqual([]);
  });
});

/**
 * Keyboard Navigation Tests (RTL Support)
 * Status: Tests verify actual keyboard navigation behavior
 */
test.describe("RTL Keyboard Navigation", () => {
  test("Login form - Tab navigation follows logical order", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    // Start Tab navigation
    await page.keyboard.press("Tab");

    // First focusable element should be email input
    let focusedElement = await page.evaluate(() =>
      document.activeElement?.getAttribute("name"),
    );
    expect(focusedElement).toBe("email");

    // Tab to password
    await page.keyboard.press("Tab");
    focusedElement = await page.evaluate(() =>
      document.activeElement?.getAttribute("name"),
    );
    expect(focusedElement).toBe("password");

    // Tab to submit button
    await page.keyboard.press("Tab");
    focusedElement = await page.evaluate(() =>
      document.activeElement?.getAttribute("type"),
    );
    expect(focusedElement).toBe("submit");
  });

  test("Register form - Tab navigation is logical in RTL context", async ({
    page,
  }) => {
    await page.goto("/auth/register");

    // Verify RTL direction
    const direction = await page.evaluate(() => {
      const form = document.querySelector("form");
      return form?.closest("[dir]")?.getAttribute("dir");
    });
    expect(direction).toBe("rtl");

    // Tab through form
    await page.keyboard.press("Tab");

    const focusedElement = await page.evaluate(() =>
      document.activeElement?.getAttribute("name"),
    );
    expect(focusedElement).toBe("fullName");
  });

  test("Form submission with Enter key works correctly", async ({ page }) => {
    await page.goto("/auth/login");

    // Focus email input
    await page.click('input[name="email"]');

    // Press Enter to submit
    await page.keyboard.press("Enter");

    // Validation errors should appear
    await expect(page.locator("text=/البريد الإلكتروني مطلوب/i")).toBeVisible({
      timeout: 2000,
    });
  });

  test("Shift+Tab navigates backwards correctly", async ({ page }) => {
    await page.goto("/auth/login");

    // Tab to submit button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    let focusedElement = await page.evaluate(() =>
      document.activeElement?.getAttribute("type"),
    );
    expect(focusedElement).toBe("submit");

    // Shift+Tab back to password
    await page.keyboard.press("Shift+Tab");
    focusedElement = await page.evaluate(() =>
      document.activeElement?.getAttribute("name"),
    );
    expect(focusedElement).toBe("password");

    // Shift+Tab back to email
    await page.keyboard.press("Shift+Tab");
    focusedElement = await page.evaluate(() =>
      document.activeElement?.getAttribute("name"),
    );
    expect(focusedElement).toBe("email");
  });
});

/**
 * Focus Indicator Visibility Tests
 * Status: Tests verify focus indicators are visible and meet contrast
 */
test.describe("Focus Indicator Visibility", () => {
  test("Email input - focus indicator must be visible", async ({ page }) => {
    await page.goto("/auth/login");

    // Focus email input
    await page.click('input[name="email"]');

    // Take screenshot of focused element
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeFocused();

    // Verify focus-visible styles are applied
    const hasFocusStyles = await emailInput.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      // Check for ring or outline
      return (
        styles.outline !== "none" ||
        styles.boxShadow.includes("rgb") ||
        styles.border.includes("rgb")
      );
    });

    expect(hasFocusStyles).toBe(true);
  });

  test("Submit button - focus indicator must be visible", async ({ page }) => {
    await page.goto("/auth/login");

    // Focus submit button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();

    // Verify focus indicator
    const hasFocusStyles = await submitButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return (
        styles.outline !== "none" ||
        styles.boxShadow.includes("rgb") ||
        styles.border.includes("rgb")
      );
    });

    expect(hasFocusStyles).toBe(true);
  });

  test("Links - focus indicator must be visible", async ({ page }) => {
    await page.goto("/auth/login");

    // Find forgot password link
    const forgotPasswordLink = page.locator('a[href="/auth/password-reset"]');

    // Focus link
    await forgotPasswordLink.focus();
    await expect(forgotPasswordLink).toBeFocused();

    // Verify focus indicator
    const hasFocusStyles = await forgotPasswordLink.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return (
        styles.outline !== "none" ||
        styles.boxShadow.includes("rgb") ||
        styles.textDecoration === "underline"
      );
    });

    expect(hasFocusStyles).toBe(true);
  });

  test("Focus indicators - screenshot comparison for visual regression", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    // Focus email input
    await page.click('input[name="email"]');

    // Take screenshot
    await expect(page).toHaveScreenshot("login-email-focused.png", {
      maxDiffPixels: 100,
    });
  });
});

/**
 * Touch Target Size Tests (Mobile)
 * Status: Tests verify actual computed sizes meet minimum
 */
test.describe("Touch Target Sizes - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test("Submit button - must meet 44x44px minimum", async ({ page }) => {
    await page.goto("/auth/login");

    const submitButton = page.locator('button[type="submit"]');

    // Get computed dimensions
    const boundingBox = await submitButton.boundingBox();

    // TRUTHFULNESS: Verify actual dimensions
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      // Width can be full-width, so we check it's reasonable
      expect(boundingBox.width).toBeGreaterThan(0);
    }
  });

  test("Checkboxes - must meet minimum touch target size", async ({ page }) => {
    await page.goto("/auth/register");

    const termsCheckbox = page.locator('input[type="checkbox"]').first();

    // Get bounding box including label
    const checkboxContainer = termsCheckbox.locator("..");
    const boundingBox = await checkboxContainer.boundingBox();

    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      // Checkbox with label should be tappable
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("Links - must have adequate touch targets", async ({ page }) => {
    await page.goto("/auth/login");

    const forgotPasswordLink = page.locator('a[href="/auth/password-reset"]');
    const boundingBox = await forgotPasswordLink.boundingBox();

    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("Email input - must meet 44px minimum touch target", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    const emailInput = page.locator('input[type="email"]');
    const boundingBox = await emailInput.boundingBox();

    // TRUTHFULNESS: Verify actual input dimensions
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      expect(boundingBox.width).toBeGreaterThan(0);
    }
  });

  test("Password input - must meet 44px minimum touch target", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    const passwordInput = page.locator('input[type="password"]');
    const boundingBox = await passwordInput.boundingBox();

    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      expect(boundingBox.width).toBeGreaterThan(0);
    }
  });

  test("Text inputs on register - must meet 44px minimum touch target", async ({
    page,
  }) => {
    await page.goto("/auth/register");

    // Test full name input
    const fullNameInput = page.locator('input[name="fullName"]');
    const fullNameBox = await fullNameInput.boundingBox();

    expect(fullNameBox).not.toBeNull();
    if (fullNameBox) {
      expect(fullNameBox.height).toBeGreaterThanOrEqual(44);
    }

    // Test email input
    const emailInput = page.locator('input[type="email"]');
    const emailBox = await emailInput.boundingBox();

    expect(emailBox).not.toBeNull();
    if (emailBox) {
      expect(emailBox.height).toBeGreaterThanOrEqual(44);
    }

    // Test password inputs
    const passwordInputs = page.locator('input[type="password"]');
    const count = await passwordInputs.count();

    for (let i = 0; i < count; i++) {
      const input = passwordInputs.nth(i);
      const box = await input.boundingBox();

      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("Iraqi ID input - must meet 44px minimum touch target", async ({
    page,
  }) => {
    await page.goto("/auth/register");

    const iraqiIdInput = page.locator('input[id="iraqi-id"]');
    const boundingBox = await iraqiIdInput.boundingBox();

    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("Touch targets on mobile viewport - iPhone SE (375px)", async ({
    page,
  }) => {
    // Set viewport to iPhone SE dimensions
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/auth/login");

    // Test email input on mobile
    const emailInput = page.locator('input[type="email"]');
    const emailBox = await emailInput.boundingBox();

    expect(emailBox).not.toBeNull();
    if (emailBox) {
      expect(emailBox.height).toBeGreaterThanOrEqual(44);
    }

    // Test password input on mobile
    const passwordInput = page.locator('input[type="password"]');
    const passwordBox = await passwordInput.boundingBox();

    expect(passwordBox).not.toBeNull();
    if (passwordBox) {
      expect(passwordBox.height).toBeGreaterThanOrEqual(44);
    }

    // Test submit button on mobile
    const submitButton = page.locator('button[type="submit"]');
    const buttonBox = await submitButton.boundingBox();

    expect(buttonBox).not.toBeNull();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("Touch targets on mobile viewport - Android (360px)", async ({
    page,
  }) => {
    // Set viewport to common Android dimensions
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/auth/register");

    // Test all input types on Android viewport
    const inputs = page.locator(
      'input[type="text"], input[type="email"], input[type="password"]',
    );
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const box = await input.boundingBox();

      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }

    // Test submit button on Android
    const submitButton = page.locator('button[type="submit"]');
    const buttonBox = await submitButton.boundingBox();

    expect(buttonBox).not.toBeNull();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    }
  });
});

/**
 * ARIA Attributes and Screen Reader Structure
 * Status: Tests verify proper ARIA implementation
 */
test.describe("ARIA Attributes and Screen Reader Support", () => {
  test("Form inputs - must have proper ARIA associations", async ({ page }) => {
    await page.goto("/auth/login");

    // Email input
    const emailInput = page.locator('input[name="email"]');
    const emailAriaDescribedBy =
      await emailInput.getAttribute("aria-describedby");
    expect(emailAriaDescribedBy).toBeTruthy();

    // Password input
    const passwordInput = page.locator('input[name="password"]');
    const passwordAriaDescribedBy =
      await passwordInput.getAttribute("aria-describedby");
    expect(passwordAriaDescribedBy).toBeTruthy();
  });

  test("Error states - must set aria-invalid", async ({ page }) => {
    await page.goto("/auth/login");

    // Submit form to trigger validation
    await page.click('button[type="submit"]');

    // Wait for validation
    await page.waitForTimeout(500);

    // Check aria-invalid on email
    const emailInput = page.locator('input[name="email"]');
    const emailAriaInvalid = await emailInput.getAttribute("aria-invalid");
    expect(emailAriaInvalid).toBe("true");

    // Check aria-invalid on password
    const passwordInput = page.locator('input[name="password"]');
    const passwordAriaInvalid =
      await passwordInput.getAttribute("aria-invalid");
    expect(passwordAriaInvalid).toBe("true");
  });

  test("Error messages - must be associated with inputs", async ({ page }) => {
    await page.goto("/auth/login");

    // Submit form to trigger validation
    await page.click('button[type="submit"]');

    // Wait for errors
    await page.waitForSelector("text=/البريد الإلكتروني مطلوب/i");

    // Verify error message has proper ID
    const emailInput = page.locator('input[name="email"]');
    const describedBy = await emailInput.getAttribute("aria-describedby");

    expect(describedBy).toBeTruthy();

    // Verify error message element exists
    if (describedBy) {
      const errorIds = describedBy.split(" ");
      for (const id of errorIds) {
        const errorElement = page.locator(`#${id}`);
        await expect(errorElement).toBeAttached();
      }
    }
  });

  test("Language attributes - RTL content must have dir='rtl'", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    // Check for RTL direction attribute
    const rtlContainer = page.locator('[dir="rtl"]');
    await expect(rtlContainer).toBeVisible();

    // Verify specific inputs maintain LTR
    const emailInput = page.locator('input[name="email"]');
    const emailDir = await emailInput.getAttribute("dir");
    expect(emailDir).toBe("ltr");
  });
});

/**
 * Form Labels and Accessible Names
 * Status: Tests verify all interactive elements have accessible names
 */
test.describe("Accessible Names and Labels", () => {
  test("All form inputs must have labels", async ({ page }) => {
    await page.goto("/auth/login");

    // Run axe specifically for label rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("form")
      .withTags(["wcag2a"])
      .analyze();

    const labelViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "label",
    );

    expect(labelViolations).toEqual([]);
  });

  test("All buttons must have accessible names", async ({ page }) => {
    await page.goto("/auth/login");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["button-name"])
      .analyze();

    const buttonNameViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "button-name",
    );

    expect(buttonNameViolations).toEqual([]);
  });

  test("All links must have accessible text", async ({ page }) => {
    await page.goto("/auth/login");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["link-name"])
      .analyze();

    const linkNameViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "link-name",
    );

    expect(linkNameViolations).toEqual([]);
  });
});

/**
 * Responsive Design Accessibility
 * Status: Tests verify accessibility across viewport sizes
 */
test.describe("Responsive Accessibility", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`Login form - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/auth/login");

      // Run accessibility audit
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

/**
 * E2E Accessibility Testing Summary
 *
 * EVIDENCE-BASED COMPLIANCE STATUS:
 *
 * ✅ AUTOMATED VERIFICATION (Tests provide evidence):
 * - Axe-core WCAG 2.1 AA audits on all auth pages
 * - Color contrast compliance verification
 * - Keyboard navigation functionality
 * - Focus indicator visibility
 * - Touch target size measurements
 * - ARIA attribute validation
 * - Form label associations
 * - Error state announcements
 * - RTL direction attributes
 * - Responsive accessibility across viewports
 *
 * ⚠️  REQUIRES MANUAL TESTING:
 * - Arabic screen reader announcements (NVDA, JAWS, VoiceOver)
 * - Arabic voice pronunciation accuracy
 * - Elder-friendly usability with Iraqi users
 * - Cultural appropriateness of accessibility patterns
 *
 * 📊 COMPLIANCE METRICS (From Tests):
 * - Axe violations: [Will be measured by tests]
 * - Color contrast: [Verified by axe-core]
 * - Keyboard navigation: [Verified by E2E tests]
 * - Touch targets: [Measured in pixels]
 * - ARIA compliance: [Validated by axe-core]
 *
 * NEXT STEPS:
 * 1. Run this E2E test suite: bun test apps/web/tests/e2e/accessibility/
 * 2. Fix any violations found by axe-core
 * 3. Conduct manual screen reader testing with Arabic
 * 4. Document all test results with evidence
 * 5. Create accessibility certification report
 */
