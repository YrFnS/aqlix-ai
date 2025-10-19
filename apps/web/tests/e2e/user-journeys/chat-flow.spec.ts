import { test, expect } from "@playwright/test";

/**
 * User Journey: Chat Flow
 * Tests the complete user journey from landing page to active chat session
 */
test.describe("User Journey: Chat Flow", () => {
  test("should complete full chat journey from landing to conversation", async ({
    page,
  }) => {
    // Step 1: Land on homepage
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Iraqi AI Chat System");

    // Step 2: Navigate to dashboard
    const dashboardButton = page.locator('a[href="/dashboard"]');
    await expect(dashboardButton).toBeVisible();
    await dashboardButton.click();
    await expect(page).toHaveURL("/dashboard");

    // Step 3: Verify chat interface is loaded
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible({
      timeout: 10000,
    });

    // Step 4: Check for message input
    const messageInput = page.locator('[data-testid="message-input"]');
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toBeEnabled();

    // Step 5: Send a test message (English)
    await messageInput.fill("Hello, can you help me?");
    const sendButton = page.locator('[data-testid="send-button"]');
    await sendButton.click();

    // Step 6: Verify message appears in chat
    await expect(
      page.locator('[data-testid="user-message"]').last(),
    ).toContainText("Hello, can you help me?");

    // Step 7: Wait for AI response
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({
      timeout: 15000,
    });

    // Step 8: Verify AI response contains text
    const aiResponse = page.locator('[data-testid="ai-message"]').last();
    await expect(aiResponse).not.toBeEmpty();
  });

  test("should complete Arabic chat journey with proper RTL rendering", async ({
    page,
  }) => {
    // Navigate to dashboard
    await page.goto("/dashboard");
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible({
      timeout: 10000,
    });

    // Send Arabic message
    const messageInput = page.locator('[data-testid="message-input"]');
    const arabicMessage = "مرحبا، كيف يمكنك مساعدتي؟";
    await messageInput.fill(arabicMessage);
    await page.locator('[data-testid="send-button"]').click();

    // Verify Arabic message displays with RTL
    const userMessage = page.locator('[data-testid="user-message"]').last();
    await expect(userMessage).toContainText(arabicMessage);

    // Check RTL direction
    const direction = await userMessage.evaluate(
      (el) => window.getComputedStyle(el).direction,
    );
    expect(direction).toBe("rtl");

    // Wait for AI response in Arabic
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({
      timeout: 15000,
    });

    // Verify AI response has RTL direction
    const aiMessage = page.locator('[data-testid="ai-message"]').last();
    const aiDirection = await aiMessage.evaluate(
      (el) => window.getComputedStyle(el).direction,
    );
    expect(aiDirection).toBe("rtl");
  });

  test("should handle multi-turn conversation flow", async ({ page }) => {
    await page.goto("/dashboard");
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');

    // Turn 1
    await messageInput.fill("What is Iraqi AI?");
    await sendButton.click();
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({
      timeout: 15000,
    });

    // Turn 2
    await messageInput.fill("Tell me more");
    await sendButton.click();
    await expect(page.locator('[data-testid="ai-message"]').nth(1)).toBeVisible(
      {
        timeout: 15000,
      },
    );

    // Turn 3
    await messageInput.fill("What are the features?");
    await sendButton.click();
    await expect(page.locator('[data-testid="ai-message"]').nth(2)).toBeVisible(
      {
        timeout: 15000,
      },
    );

    // Verify conversation history preserved
    const allUserMessages = page.locator('[data-testid="user-message"]');
    await expect(allUserMessages).toHaveCount(3);

    const allAiMessages = page.locator('[data-testid="ai-message"]');
    await expect(allAiMessages).toHaveCount(3);
  });

  test("should handle new conversation creation", async ({ page }) => {
    await page.goto("/dashboard");

    // Send initial message
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill("First conversation");
    await page.locator('[data-testid="send-button"]').click();
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({
      timeout: 15000,
    });

    // Create new conversation
    const newChatButton = page.locator('[data-testid="new-chat-button"]');
    await newChatButton.click();

    // Verify chat is cleared
    await expect(page.locator('[data-testid="user-message"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="ai-message"]')).toHaveCount(0);

    // Send message in new conversation
    await messageInput.fill("Second conversation");
    await page.locator('[data-testid="send-button"]').click();
    await expect(page.locator('[data-testid="user-message"]')).toHaveCount(1);
  });

  test("should persist conversation across page refreshes", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    const messageInput = page.locator('[data-testid="message-input"]');

    // Send messages
    await messageInput.fill("Test message 1");
    await page.locator('[data-testid="send-button"]').click();
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({
      timeout: 15000,
    });

    await messageInput.fill("Test message 2");
    await page.locator('[data-testid="send-button"]').click();
    await expect(page.locator('[data-testid="ai-message"]').nth(1)).toBeVisible(
      {
        timeout: 15000,
      },
    );

    // Refresh page
    await page.reload();

    // Verify conversation persisted
    await expect(page.locator('[data-testid="user-message"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="ai-message"]')).toHaveCount(2);

    // Verify content
    await expect(
      page.locator('[data-testid="user-message"]').first(),
    ).toContainText("Test message 1");
    await expect(
      page.locator('[data-testid="user-message"]').last(),
    ).toContainText("Test message 2");
  });
});
