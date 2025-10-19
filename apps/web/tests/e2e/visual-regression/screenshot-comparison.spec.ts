import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests
 * Screenshot comparison tests for UI consistency
 */
test.describe("Visual Regression: Screenshot Comparison", () => {
  test("homepage should match visual baseline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("dashboard should match visual baseline", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("dashboard.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("chat interface should match visual baseline", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector('[data-testid="chat-container"]');

    // Screenshot just the chat area
    const chatContainer = page.locator('[data-testid="chat-container"]');
    await expect(chatContainer).toHaveScreenshot("chat-interface.png", {
      animations: "disabled",
    });
  });

  test("Arabic RTL layout should match visual baseline", async ({ page }) => {
    await page.goto("/dashboard");

    // Switch to Arabic
    await page.click('[data-testid="language-switcher"]');
    await page.click('[data-testid="language-option-ar"]');
    await page.waitForTimeout(500); // Wait for RTL transition

    await expect(page).toHaveScreenshot("dashboard-rtl.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("navigation menu should match visual baseline", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");

    await expect(nav).toHaveScreenshot("navigation-menu.png", {
      animations: "disabled",
    });
  });

  test("settings page should match visual baseline", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("settings-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("modal dialogs should match visual baseline", async ({ page }) => {
    await page.goto("/dashboard");

    // Open settings modal
    await page.click('[data-testid="open-settings"]');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await expect(modal).toHaveScreenshot("settings-modal.png", {
      animations: "disabled",
    });
  });

  test("form inputs should match visual baseline", async ({ page }) => {
    await page.goto("/settings");

    // Focus on first input to show focus state
    await page.focus("input:first-of-type");

    const form = page.locator("form").first();
    await expect(form).toHaveScreenshot("form-inputs.png", {
      animations: "disabled",
    });
  });

  test("buttons in different states should match baseline", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Primary button
    const sendButton = page.locator('[data-testid="send-button"]');
    await expect(sendButton).toHaveScreenshot("button-primary.png");

    // Hover state
    await sendButton.hover();
    await expect(sendButton).toHaveScreenshot("button-primary-hover.png");

    // Focus state
    await sendButton.focus();
    await expect(sendButton).toHaveScreenshot("button-primary-focus.png");

    // Disabled state
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="send-button"]',
      ) as HTMLButtonElement;
      button.disabled = true;
    });
    await expect(sendButton).toHaveScreenshot("button-primary-disabled.png");
  });

  test("chat messages should match visual baseline", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for messages to load
    await page.waitForSelector('[data-testid="message"]', { timeout: 5000 });

    const messageContainer = page
      .locator('[data-testid="message-container"]')
      .first();
    await expect(messageContainer).toHaveScreenshot("chat-messages.png", {
      animations: "disabled",
    });
  });

  test("dark mode should match visual baseline", async ({ page }) => {
    await page.goto("/");

    // Enable dark mode
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(300); // Wait for theme transition

    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("responsive mobile layout should match baseline", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("responsive tablet layout should match baseline", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-tablet.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("loading states should match visual baseline", async ({ page }) => {
    // Intercept API calls to simulate loading
    await page.route("**/api/chat/**", async (route) => {
      await page.waitForTimeout(2000); // Delay response
      await route.continue();
    });

    await page.goto("/dashboard");

    // Trigger loading state
    await page.fill('[data-testid="message-input"]', "Test message");
    await page.click('[data-testid="send-button"]');

    // Capture loading state
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
    await expect(loadingIndicator).toHaveScreenshot("loading-state.png");
  });

  test("error states should match visual baseline", async ({ page }) => {
    // Intercept API to return error
    await page.route("**/api/chat/**", async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("/dashboard");

    // Trigger error
    await page.fill('[data-testid="message-input"]', "Test message");
    await page.click('[data-testid="send-button"]');

    // Wait for error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toHaveScreenshot("error-state.png");
  });

  test("empty states should match visual baseline", async ({ page }) => {
    await page.goto("/dashboard");

    // Clear all messages (if any exist)
    const newChatButton = page.locator('[data-testid="new-chat-button"]');
    if (await newChatButton.isVisible()) {
      await newChatButton.click();
    }

    // Screenshot empty chat state
    const chatContainer = page.locator('[data-testid="chat-container"]');
    await expect(chatContainer).toHaveScreenshot("empty-chat-state.png", {
      animations: "disabled",
    });
  });

  test("Arabic text rendering should match baseline", async ({ page }) => {
    await page.goto("/dashboard");

    // Send Arabic message
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill(
      "مرحبا! هذا اختبار للنص العربي مع علامات الترقيم، والأرقام ١٢٣.",
    );
    await page.click('[data-testid="send-button"]');

    // Wait for message to appear
    await page.waitForSelector('[data-testid="user-message"]');

    const arabicMessage = page.locator('[data-testid="user-message"]').last();
    await expect(arabicMessage).toHaveScreenshot("arabic-text-rendering.png");
  });

  test("bidirectional text should match baseline", async ({ page }) => {
    await page.goto("/dashboard");

    // Send mixed Arabic-English message
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill("Testing mixed text: مرحبا Hello العربية English");
    await page.click('[data-testid="send-button"]');

    await page.waitForSelector('[data-testid="user-message"]');

    const mixedMessage = page.locator('[data-testid="user-message"]').last();
    await expect(mixedMessage).toHaveScreenshot("bidirectional-text.png");
  });

  test("font rendering should match baseline across browsers", async ({
    page,
  }) => {
    await page.goto("/");

    // Test English text
    const englishHeading = page.locator("h1").first();
    await expect(englishHeading).toHaveScreenshot("font-english.png");

    // Switch to Arabic
    await page.click('[data-testid="language-switcher"]');
    await page.click('[data-testid="language-option-ar"]');
    await page.waitForTimeout(500);

    // Test Arabic font
    const arabicHeading = page.locator("h1").first();
    await expect(arabicHeading).toHaveScreenshot("font-arabic.png");
  });
});
