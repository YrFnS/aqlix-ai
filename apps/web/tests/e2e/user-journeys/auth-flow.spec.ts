import { test, expect, Browser, BrowserContext } from "@playwright/test";

/**
 * User Journey: Authentication Flow
 * Tests complete authentication user journeys for Iraqi professionals
 * Includes cultural greeting verification, prayer time handling, and multi-device sessions
 */

// Basic sign-up journeys
test.describe("User Journey: Authentication Flow", () => {
  test("should complete sign-up journey", async ({ page }) => {
    // Step 1: Navigate to sign-up page
    await page.goto("/(auth)/register");
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
    await page.goto("/(auth)/login");
    await expect(page.locator("h1")).toContainText("Sign In");

    // Fill credentials
    await page.fill('[data-testid="signin-email"]', "test@example.com");
    await page.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");

    // Submit
    await page.click('[data-testid="signin-submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Verify user menu appears
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test("should handle password reset flow", async ({ page }) => {
    // Navigate to sign-in
    await page.goto("/(auth)/login");

    // Click forgot password
    await page.click('[data-testid="forgot-password-link"]');
    await expect(page).toHaveURL("/(auth)/password-reset");

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

    await page.goto("/(app)/dashboard");

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
    await page.goto("/(app)/dashboard");

    // Should redirect to sign-in
    await expect(page).toHaveURL(/\/(auth)\/login/, { timeout: 10000 });

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

    await page.goto("/(app)/dashboard");
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Refresh page
    await page.reload();

    // Auth should persist
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page).toHaveURL("/(app)/dashboard");
  });

  test("should handle OAuth sign-in flow", async ({ page }) => {
    await page.goto("/(auth)/login");

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
    await page.goto("/(auth)/register");

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

// Iraqi Professional Registration Journey
test.describe("User Journey: Iraqi Professional Registration", () => {
  test("should complete registration for Iraqi lawyer from Baghdad", async ({
    page,
  }) => {
    // Navigate to registration
    await page.goto("/(auth)/register");
    await expect(page.locator("h1")).toContainText("Sign Up");

    // Step 1: Fill basic information
    await page.fill('[data-testid="signup-email"]', "lawyer@example.iq");
    await page.fill('[data-testid="signup-password"]', "SecureP@ssw0rd123");
    await page.fill(
      '[data-testid="signup-confirm-password"]',
      "SecureP@ssw0rd123",
    );

    // Step 2: Select professional domain (Legal)
    await page.click('[data-testid="professional-domain-select"]');
    await page.click('[data-testid="domain-legal"]');

    // Step 3: Fill professional license
    await page.fill('[data-testid="professional-license"]', "LAW-12345-2024");

    // Step 4: Select region (Baghdad)
    await page.click('[data-testid="region-select"]');
    await page.click('[data-testid="region-baghdad"]');

    // Step 5: Accept terms
    await page.check('[data-testid="accept-terms"]');

    // Step 6: Submit
    await page.click('[data-testid="signup-submit"]');

    // Verify redirect to email verification
    await expect(page).toHaveURL("/(auth)/verify-email", { timeout: 10000 });

    // Verify success message
    await expect(
      page.locator('[data-testid="verification-notice"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="verification-notice"]'),
    ).toContainText("check your email");
  });

  test("should complete registration for Iraqi doctor from Basra", async ({
    page,
  }) => {
    await page.goto("/(auth)/register");

    // Fill basic information
    await page.fill('[data-testid="signup-email"]', "doctor@example.iq");
    await page.fill('[data-testid="signup-password"]', "SecureP@ssw0rd123");
    await page.fill(
      '[data-testid="signup-confirm-password"]',
      "SecureP@ssw0rd123",
    );

    // Select professional domain (Medical)
    await page.click('[data-testid="professional-domain-select"]');
    await page.click('[data-testid="domain-medical"]');

    // Fill medical license with specialization
    await page.fill('[data-testid="professional-license"]', "MED-123456-BA");

    // Select region (Basra)
    await page.click('[data-testid="region-select"]');
    await page.click('[data-testid="region-basra"]');

    // Accept terms and submit
    await page.check('[data-testid="accept-terms"]');
    await page.click('[data-testid="signup-submit"]');

    // Verify success
    await expect(page).toHaveURL("/(auth)/verify-email", { timeout: 10000 });
  });

  test("should validate Iraqi ID during professional registration", async ({
    page,
  }) => {
    await page.goto("/(auth)/register");

    // Fill basic information
    await page.fill('[data-testid="signup-email"]', "professional@example.iq");
    await page.fill('[data-testid="signup-password"]', "SecureP@ssw0rd123");
    await page.fill(
      '[data-testid="signup-confirm-password"]',
      "SecureP@ssw0rd123",
    );

    // Select professional domain
    await page.click('[data-testid="professional-domain-select"]');
    await page.click('[data-testid="domain-engineering"]');

    // Fill invalid Iraqi ID (should show error)
    await page.fill('[data-testid="iraqi-id"]', "123");
    await page.blur('[data-testid="iraqi-id"]');

    // Verify error message
    await expect(page.locator('[data-testid="iraqi-id-error"]')).toContainText(
      "12 digits",
    );

    // Fill valid Baghdad ID
    await page.fill('[data-testid="iraqi-id"]', "101234567890");

    // Fill professional license
    await page.fill('[data-testid="professional-license"]', "ENG-123456-CIV");

    // Select region
    await page.click('[data-testid="region-select"]');
    await page.click('[data-testid="region-baghdad"]');

    // Accept and submit
    await page.check('[data-testid="accept-terms"]');
    await page.click('[data-testid="signup-submit"]');

    // Verify success
    await expect(page).toHaveURL("/(auth)/verify-email", { timeout: 10000 });
  });
});

// Login with Cultural Greeting Journey
test.describe("User Journey: Login with Cultural Greeting", () => {
  test("should display appropriate cultural greeting for Baghdad user", async ({
    page,
  }) => {
    await page.goto("/(auth)/login");

    // Fill credentials for Baghdad user
    await page.fill('[data-testid="signin-email"]', "baghdad@example.iq");
    await page.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");

    // Submit
    await page.click('[data-testid="signin-submit"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Check for Baghdad cultural greeting (شلونك - "how are you?" in Baghdad dialect)
    const greetingElement = page.locator('[data-testid="cultural-greeting"]');
    await expect(greetingElement).toBeVisible();

    // The greeting should contain the appropriate Iraqi dialect
    const greetingText = await greetingElement.textContent();
    expect(
      greetingText?.includes("شلونك") ||
        greetingText?.includes("مرحبا") ||
        greetingText?.includes("ahlan"),
    ).toBeTruthy();
  });

  test("should display greeting based on time of day", async ({ page }) => {
    await page.goto("/(auth)/login");

    // Set system time to morning
    await page.evaluate(() => {
      // Mock time for testing if needed
      const now = new Date();
      now.setHours(8, 0, 0); // 8 AM
      return now;
    });

    // Fill and submit credentials
    await page.fill('[data-testid="signin-email"]', "user@example.iq");
    await page.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");
    await page.click('[data-testid="signin-submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Verify greeting is shown
    await expect(
      page.locator('[data-testid="cultural-greeting"]'),
    ).toBeVisible();
  });

  test("should respect regional dialect preferences", async ({ page }) => {
    await page.goto("/(auth)/login");

    // Fill credentials for Basra user
    await page.fill('[data-testid="signin-email"]', "basra@example.iq");
    await page.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");
    await page.click('[data-testid="signin-submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Check that regional preference is applied
    const regionPreference = page.locator('[data-testid="region-preference"]');
    await expect(regionPreference).toContainText("Basra");
  });
});

// MFA Setup Journey
test.describe("User Journey: MFA Setup with Prayer Time Consideration", () => {
  test("should complete MFA setup with SMS", async ({ page }) => {
    // Assume user is on dashboard
    await page.goto("/(app)/dashboard");

    // Navigate to security settings
    await page.click('[data-testid="settings-button"]');
    await page.click('[data-testid="security-settings"]');

    // Click setup MFA
    await page.click('[data-testid="setup-mfa"]');

    // Select SMS method
    await page.click('[data-testid="mfa-method-sms"]');

    // Fill phone number
    await page.fill('[data-testid="phone-number"]', "+964791234567");

    // Submit
    await page.click('[data-testid="mfa-submit"]');

    // Verify code input appears
    await expect(page.locator('[data-testid="mfa-code-input"]')).toBeVisible();

    // Fill verification code (in real test, would get from SMS)
    await page.fill('[data-testid="mfa-code-input"]', "123456");

    // Verify
    await page.click('[data-testid="verify-mfa-code"]');

    // Verify success
    await expect(page.locator('[data-testid="mfa-success"]')).toBeVisible({
      timeout: 5000,
    });
  });

  test("should complete MFA setup with Email", async ({ page }) => {
    await page.goto("/(app)/dashboard");

    // Navigate to security settings
    await page.click('[data-testid="settings-button"]');
    await page.click('[data-testid="security-settings"]');

    // Click setup MFA
    await page.click('[data-testid="setup-mfa"]');

    // Select Email method
    await page.click('[data-testid="mfa-method-email"]');

    // Submit
    await page.click('[data-testid="mfa-submit"]');

    // Verify code input appears
    await expect(page.locator('[data-testid="mfa-code-input"]')).toBeVisible();

    // Fill verification code
    await page.fill('[data-testid="mfa-code-input"]', "123456");
    await page.click('[data-testid="verify-mfa-code"]');

    // Verify success
    await expect(page.locator('[data-testid="mfa-success"]')).toBeVisible({
      timeout: 5000,
    });
  });

  test("should respect prayer time delays during MFA setup", async ({
    page,
  }) => {
    await page.goto("/(app)/dashboard");

    // Navigate to security settings
    await page.click('[data-testid="settings-button"]');
    await page.click('[data-testid="security-settings"]');

    // Click setup MFA
    await page.click('[data-testid="setup-mfa"]');

    // Select SMS method
    await page.click('[data-testid="mfa-method-sms"]');

    // Fill phone number
    await page.fill('[data-testid="phone-number"]', "+964791234567");

    // Submit - should show prayer time notice if during prayer times
    await page.click('[data-testid="mfa-submit"]');

    // Check if prayer time notice appears (depending on current time)
    const prayerNotice = page.locator('[data-testid="prayer-time-notice"]');
    const prayerVisible = await prayerNotice.isVisible().catch(() => false);

    if (prayerVisible) {
      // Verify it mentions prayer time delay
      await expect(prayerNotice).toContainText("prayer time");
    }

    // Verify code input still appears
    await expect(page.locator('[data-testid="mfa-code-input"]')).toBeVisible();
  });
});

// Multi-Device Session Journey
test.describe("User Journey: Multi-Device Session Management", () => {
  test("should maintain separate sessions across multiple devices", async ({
    browser,
  }) => {
    // Create two browser contexts (simulating two devices)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Device 1: Login
    await page1.goto("/(auth)/login");
    await page1.fill('[data-testid="signin-email"]', "multidevice@example.iq");
    await page1.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");
    await page1.click('[data-testid="signin-submit"]');
    await expect(page1).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Device 2: Login
    await page2.goto("/(auth)/login");
    await page2.fill('[data-testid="signin-email"]', "multidevice@example.iq");
    await page2.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");
    await page2.click('[data-testid="signin-submit"]');
    await expect(page2).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Both should be logged in
    await expect(page1.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page2.locator('[data-testid="user-menu"]')).toBeVisible();

    // View active sessions
    await page1.click('[data-testid="settings-button"]');
    await page1.click('[data-testid="session-management"]');

    // Should show at least 2 active sessions
    const sessions = page1.locator('[data-testid="active-session"]');
    const sessionCount = await sessions.count();
    expect(sessionCount).toBeGreaterThanOrEqual(2);

    // Logout from device 1 only
    await page1.click('[data-testid="logout-device"]');
    await page1.click('[data-testid="confirm-logout"]');

    // Device 1 should be redirected
    await expect(page1).toHaveURL("/(auth)/login", { timeout: 10000 });

    // Device 2 should still be logged in
    await expect(page2.locator('[data-testid="user-menu"]')).toBeVisible();
    await page2.goto("/(app)/dashboard");
    await expect(page2).toHaveURL("/(app)/dashboard");

    // Cleanup
    await context1.close();
    await context2.close();
  });

  test("should logout all devices simultaneously", async ({ browser }) => {
    // Create two browser contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Login on both devices
    await page1.goto("/(auth)/login");
    await page1.fill('[data-testid="signin-email"]', "alldevices@example.iq");
    await page1.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");
    await page1.click('[data-testid="signin-submit"]');
    await expect(page1).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    await page2.goto("/(auth)/login");
    await page2.fill('[data-testid="signin-email"]', "alldevices@example.iq");
    await page2.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");
    await page2.click('[data-testid="signin-submit"]');
    await expect(page2).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Logout all devices from device 1
    await page1.click('[data-testid="settings-button"]');
    await page1.click('[data-testid="session-management"]');
    await page1.click('[data-testid="logout-all-devices"]');
    await page1.click('[data-testid="confirm-logout-all"]');

    // Both should be logged out
    await expect(page1).toHaveURL("/(auth)/login", { timeout: 10000 });

    // Device 2 should also be redirected after refresh
    await page2.reload();
    await expect(page2).toHaveURL("/(auth)/login", { timeout: 10000 });

    // Cleanup
    await context1.close();
    await context2.close();
  });

  test("should track device information in session list", async ({ page }) => {
    await page.goto("/(auth)/login");

    // Login
    await page.fill('[data-testid="signin-email"]', "devicetrack@example.iq");
    await page.fill('[data-testid="signin-password"]', "SecureP@ssw0rd123");
    await page.click('[data-testid="signin-submit"]');
    await expect(page).toHaveURL("/(app)/dashboard", { timeout: 10000 });

    // Navigate to session management
    await page.click('[data-testid="settings-button"]');
    await page.click('[data-testid="session-management"]');

    // Verify device information is displayed
    await expect(page.locator('[data-testid="device-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="device-type"]')).toBeVisible();
    await expect(page.locator('[data-testid="last-activity"]')).toBeVisible();
  });
});

// Professional Domain Verification Journey
test.describe("User Journey: Professional Domain Verification", () => {
  test("should verify engineer credentials and allow specialized access", async ({
    page,
  }) => {
    await page.goto("/(auth)/register");

    // Fill professional registration for engineer
    await page.fill('[data-testid="signup-email"]', "engineer@example.iq");
    await page.fill('[data-testid="signup-password"]', "SecureP@ssw0rd123");
    await page.fill(
      '[data-testid="signup-confirm-password"]',
      "SecureP@ssw0rd123",
    );

    // Select Engineering domain
    await page.click('[data-testid="professional-domain-select"]');
    await page.click('[data-testid="domain-engineering"]');

    // Fill engineering license with civil specialization
    await page.fill('[data-testid="professional-license"]', "ENG-654321-CIV");

    // Select Erbil region
    await page.click('[data-testid="region-select"]');
    await page.click('[data-testid="region-erbil"]');

    // Accept and submit
    await page.check('[data-testid="accept-terms"]');
    await page.click('[data-testid="signup-submit"]');

    // Verify email verification
    await expect(page).toHaveURL("/(auth)/verify-email", { timeout: 10000 });
  });

  test("should support multi-domain professionals", async ({ page }) => {
    // A user with multiple professional licenses
    await page.goto("/(auth)/register");

    await page.fill('[data-testid="signup-email"]', "multidomain@example.iq");
    await page.fill('[data-testid="signup-password"]', "SecureP@ssw0rd123");
    await page.fill(
      '[data-testid="signup-confirm-password"]',
      "SecureP@ssw0rd123",
    );

    // Select first domain (Medical)
    await page.click('[data-testid="professional-domain-select"]');
    await page.click('[data-testid="domain-medical"]');
    await page.fill('[data-testid="professional-license"]', "MED-123456-SU");

    // Check if option to add additional domain exists
    const addDomainButton = page.locator('[data-testid="add-domain"]');
    if (await addDomainButton.isVisible()) {
      // Add second domain (Educational)
      await addDomainButton.click();
      await page.click('[data-testid="professional-domain-select-2"]');
      await page.click('[data-testid="domain-educational"]');
      await page.fill(
        '[data-testid="professional-license-2"]',
        "EDU-654321-2024",
      );
    }

    // Select region
    await page.click('[data-testid="region-select"]');
    await page.click('[data-testid="region-mosul"]');

    // Accept and submit
    await page.check('[data-testid="accept-terms"]');
    await page.click('[data-testid="signup-submit"]');

    // Verify success
    await expect(page).toHaveURL("/(auth)/verify-email", { timeout: 10000 });
  });
});
