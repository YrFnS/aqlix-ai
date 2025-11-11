/**
 * E2E Tests for Critical User Flows
 * Tests MVP critical paths using Playwright
 */

import { test, expect, Page } from "@playwright/test";

// Configure test settings
test.describe.configure({ mode: "parallel" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Test data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: "SecurePassword123!",
  fullName: "Test User",
  phone: "+96407811234567",
};

test.describe("User Registration & Authentication", () => {
  test("should complete user registration flow", async ({ page }) => {
    // Navigate to registration page
    await page.goto(`${BASE_URL}/register`);
    await expect(page).toHaveTitle(/Register|sign up/i);

    // Fill registration form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="fullName"]', testUser.fullName);
    await page.fill('input[name="phone"]', testUser.phone);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);

    // Accept terms
    await page.click('input[name="agreeToTerms"]');

    // Submit form
    await page.click('button:has-text("Register")');

    // Should redirect to email verification
    await page.waitForURL(/verify-email|confirmation/i);
    await expect(page.locator("text=/verify|confirmation/i")).toBeVisible();
  });

  test("should handle login with valid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Submit form
    await page.click('button:has-text("Login")');

    // Should redirect to dashboard or chat
    await page.waitForURL(/dashboard|chat/i);
    await expect(page).toHaveURL(/dashboard|chat/i);
  });

  test("should validate email format", async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Try invalid email
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="fullName"]', testUser.fullName);
    await page.fill('input[name="password"]', testUser.password);

    // Submit should fail
    const error = await page.locator("text=/invalid|email/i").first();
    await expect(error).toBeVisible();
  });
});

test.describe("Chat Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each chat test
    await loginUser(page);
  });

  test("should create new chat session", async ({ page }) => {
    // Navigate to chat
    await page.goto(`${BASE_URL}/dashboard`);

    // Click "New Chat" button
    await page.click('button:has-text("New Chat")');

    // Verify chat session created
    await expect(page.locator("text=/Chat|Session/i")).toBeVisible();
  });

  test("should send message and receive response", async ({ page }) => {
    // Go to active chat
    await page.goto(`${BASE_URL}/dashboard`);
    await page.click(".chat-item:first-child");

    // Type message
    const messageInput = page.locator('textarea[placeholder*="message"]');
    await messageInput.fill("Hello, how are you?");

    // Send message
    await page.click('button[aria-label="Send message"]');

    // Wait for response
    await page.waitForSelector(".chat-message:has-text(/Assistant|response/i)");
    const response = await page.locator(".chat-message:last-child");
    await expect(response).toBeVisible();
  });

  test("should display Arabic/RTL content properly", async ({ page }) => {
    // Send Arabic message
    await page.goto(`${BASE_URL}/dashboard`);
    const messageInput = page.locator('textarea[placeholder*="message"]');

    const arabicMessage = "السلام عليكم ورحمة الله وبركاته";
    await messageInput.fill(arabicMessage);
    await page.click('button[aria-label="Send message"]');

    // Verify message sent
    await page.waitForSelector(".chat-message");
    const userMessage = page.locator(
      ".chat-message:has-text(" + arabicMessage + ")",
    );

    // Check RTL direction
    const computedStyle = await userMessage.evaluate(
      (el) => window.getComputedStyle(el).direction,
    );
    expect(computedStyle).toBe("rtl");
  });
});

test.describe("Document Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test("should upload and display document", async ({ page }) => {
    // Navigate to documents
    await page.goto(`${BASE_URL}/documents`);

    // Find upload input
    const fileInput = page.locator('input[type="file"]');

    // Upload test file
    await fileInput.setInputFiles({
      name: "test-document.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Test document content"),
    });

    // Wait for upload to complete
    await page.waitForSelector(".document-item");
    const uploadedDoc = page.locator(".document-item:first-child");

    await expect(uploadedDoc).toBeVisible();
    await expect(uploadedDoc).toContainText("test-document");
  });

  test("should process document with AI", async ({ page }) => {
    // Navigate to documents
    await page.goto(`${BASE_URL}/documents`);

    // Find and click document
    const document = page.locator(".document-item:first-child");
    await document.click();

    // Click process button
    await page.click('button:has-text("Process")');

    // Wait for processing to complete
    await page.waitForSelector(".processing-result", { timeout: 10000 });

    const result = page.locator(".processing-result");
    await expect(result).toBeVisible();
  });
});

test.describe("Payment Processing", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test("should initiate payment with ZainCash", async ({ page }) => {
    // Navigate to payments
    await page.goto(`${BASE_URL}/settings/billing`);

    // Select payment plan
    await page.click('button:has-text("Upgrade")');

    // Select ZainCash
    await page.click("text=ZainCash");

    // Verify payment initiation
    await page.waitForURL(/payment|checkout/i);
    await expect(page).toHaveURL(/payment|checkout/i);
  });

  test("should validate minimum transaction amount", async ({ page }) => {
    // Try payment with amount < 500 IQD (FastPay minimum)
    await page.goto(`${BASE_URL}/settings/billing`);

    // Attempt payment with too small amount
    await page.fill('input[name="amount"]', "100");
    await page.click('button:has-text("Pay")');

    // Should show error
    const error = page.locator("text=/minimum|amount/i");
    await expect(error).toBeVisible();
  });
});

test.describe("RTL & Arabic Support", () => {
  test("should switch to Arabic language", async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // Click language selector
    await page.click('[aria-label="Language"]');
    await page.click('button:has-text("العربية")');

    // Verify language switched
    await page.waitForURL(/\/ar\//);

    // Check RTL direction
    const htmlDir = await page.locator("html").getAttribute("dir");
    expect(htmlDir).toBe("rtl");
  });

  test("should render RTL layout correctly", async ({ page }) => {
    // Set Arabic locale
    await page.goto(`${BASE_URL}/ar`);

    // Check layout direction
    const mainContent = page.locator("main");
    const computedStyle = await mainContent.evaluate(
      (el) => window.getComputedStyle(el).direction,
    );
    expect(computedStyle).toBe("rtl");
  });
});

test.describe("Error Handling", () => {
  test("should display error for network failure", async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    await page.goto(`${BASE_URL}`);

    // Try to load chat
    const chat = page.locator('a[href="/dashboard"]');
    if (await chat.isVisible()) {
      await chat.click();
    }

    // Should show offline error
    await page.waitForSelector("text=/offline|connection/i");
    const error = page.locator("text=/offline|connection/i");
    await expect(error).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });

  test("should handle 404 errors gracefully", async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page`);

    // Should display 404 page
    await expect(page).toHaveTitle(/404|not found/i);
  });
});

test.describe("Performance", () => {
  test("should load chat in under 2 seconds", async ({ page }) => {
    await loginUser(page);

    const startTime = Date.now();
    await page.goto(`${BASE_URL}/dashboard`);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test("should load document list in under 1 second", async ({ page }) => {
    await loginUser(page);

    const startTime = Date.now();
    await page.goto(`${BASE_URL}/documents`);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(1000);
  });
});

// Helper functions
async function loginUser(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.click('button:has-text("Login")');
  await page.waitForURL(/dashboard/);
}
