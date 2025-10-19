import { test, expect } from "@playwright/test";

/**
 * User Journey: Authentication Flow
 * Tests complete authentication user journey
 */
test.describe("User Journey: Authentication Flow", () => {
  test("should complete sign-up journey", async ({ page }) => {
    // Step 1: Navigate to sign-up page
    await page.goto("/auth/signup");
    await expect(page.locator("h1")).toContainText("Sign Up");

    // Step 2: Fill registration form
    await page.fill('[data-testid="signup-email"]', "test@example.com");
    await page.fill('[data-testid="signup-password"]', "SecureP@ssw0rd123");
    await page.fill(
      '[data-testid="signup-confirm-password"]',
      "SecureP@ssw0rd123",
    );

    // Step 3: Accept terms
    await page.check('[data-testid="accept-terms"]');

    // Step 4: Submit form
    await page.click('[data-testid="signup-submit"]');

    // Step 5: Verify verification email notice
    await expect(
      page.locator('[data-testid="verification-notice"]'),
    ).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.locator('[data-testid="verification-notice"]'),
    ).toContainText("check your email");
  });

  test("should complete sign-in journey", async ({ page }) => {
    // Navigate to sign-in
    await page.goto("/auth/signin");
    await expect(page.locator("h1")).toContainText("Sign In");

    // Fill credentials
    await page.fill('[data-testid="signin-email"]', "test@example.com");
    await page.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");

    // Submit
    await page.click('[data-testid="signin-submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });

    // Verify user menu appears
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test("should handle password reset flow", async ({ page }) => {
    // Navigate to sign-in
    await page.goto("/auth/signin");

    // Click forgot password
    await page.click('[data-testid="forgot-password-link"]');
    await expect(page).toHaveURL("/auth/reset-password");

    // Fill email
    await page.fill('[data-testid="reset-email"]', "test@example.com");

    // Submit
    await page.click('[data-testid="reset-submit"]');

    // Verify success message
    await expect(page.locator('[data-testid="reset-success"]')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('[data-testid="reset-success"]')).toContainText(
      "reset link",
    );
  });

  test("should handle sign-out flow", async ({ page, context }) => {
    // Assume user is signed in (use authentication state)
    await context.addCookies([
      {
        name: "auth-token",
        value: "mock-token-for-testing",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/dashboard");

    // Open user menu
    await page.click('[data-testid="user-menu"]');

    // Click sign out
    await page.click('[data-testid="signout-button"]');

    // Should redirect to home
    await expect(page).toHaveURL("/", { timeout: 10000 });

    // Verify sign in button is visible
    await expect(page.locator('[data-testid="signin-button"]')).toBeVisible();
  });

  test("should handle protected route access without auth", async ({
    page,
  }) => {
    // Try to access dashboard without auth
    await page.goto("/dashboard");

    // Should redirect to sign-in
    await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 10000 });

    // Should show redirect notice
    await expect(page.locator('[data-testid="redirect-notice"]')).toContainText(
      "sign in to continue",
    );
  });

  test("should persist authentication across page refreshes", async ({
    page,
    context,
  }) => {
    // Set auth state
    await context.addCookies([
      {
        name: "auth-token",
        value: "mock-token-for-testing",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/dashboard");
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Refresh page
    await page.reload();

    // Auth should persist
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page).toHaveURL("/dashboard");
  });

  test("should handle OAuth sign-in flow", async ({ page }) => {
    await page.goto("/auth/signin");

    // Click Google OAuth button
    const googleButton = page.locator('[data-testid="oauth-google"]');
    await expect(googleButton).toBeVisible();

    // Note: In real tests, you'd mock OAuth or use test credentials
    // This verifies the button triggers OAuth flow
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      googleButton.click(),
    ]);

    // Verify OAuth popup opened
    await expect(popup).toHaveURL(/accounts\.google\.com/, {
      timeout: 10000,
    });
  });

  test("should validate form inputs and show errors", async ({ page }) => {
    await page.goto("/auth/signup");

    // Submit without filling form
    await page.click('[data-testid="signup-submit"]');

    // Verify error messages
    await expect(page.locator('[data-testid="email-error"]')).toContainText(
      "required",
    );
    await expect(page.locator('[data-testid="password-error"]')).toContainText(
      "required",
    );

    // Fill invalid email
    await page.fill('[data-testid="signup-email"]', "invalid-email");
    await page.blur('[data-testid="signup-email"]');
    await expect(page.locator('[data-testid="email-error"]')).toContainText(
      "valid email",
    );

    // Fill weak password
    await page.fill('[data-testid="signup-password"]', "weak");
    await page.blur('[data-testid="signup-password"]');
    await expect(page.locator('[data-testid="password-error"]')).toContainText(
      "at least 8 characters",
    );

    // Fill mismatched passwords
    await page.fill('[data-testid="signup-password"]', "StrongP@ss123");
    await page.fill('[data-testid="signup-confirm-password"]', "Different123");
    await page.blur('[data-testid="signup-confirm-password"]');
    await expect(
      page.locator('[data-testid="confirm-password-error"]'),
    ).toContainText("match");
  });
});
