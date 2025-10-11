import { test, expect } from "@playwright/test";

test.describe("Error Handling", () => {
  test("should display error boundary on render error", async ({ page }) => {
    await page.goto("/test-errors");

    // Trigger render error
    await page.click("text=Trigger Render Error");

    // Should show error fallback
    await expect(page.locator("text=Something went wrong")).toBeVisible();

    // Should have retry button
    await expect(page.locator("text=Try again")).toBeVisible();
  });

  test("should handle async errors", async ({ page }) => {
    await page.goto("/test-errors");

    // Trigger async error
    await page.click("text=Trigger Async Error");

    // Should display error message
    await expect(page.locator("text=Test async error")).toBeVisible();
  });

  test("should recover from error on reset", async ({ page }) => {
    await page.goto("/test-errors");

    // Trigger error
    await page.click("text=Trigger Render Error");

    // Click reset
    await page.click("text=Try again");

    // Error should be cleared
    await expect(page.locator("text=Something went wrong")).not.toBeVisible();
  });

  test("should show 404 page for invalid routes", async ({ page }) => {
    const response = await page.goto("/this-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.locator("text=404 - Page Not Found")).toBeVisible();
  });
});
