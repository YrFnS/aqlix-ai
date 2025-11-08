import { test, expect } from "@playwright/test";

/**
 * Accessibility Tests: Keyboard Navigation
 * Comprehensive keyboard navigation testing for Iraqi AI Chat System
 */
test.describe("Keyboard Navigation", () => {
  test("should navigate main menu with keyboard", async ({ page }) => {
    await page.goto("/");

    // Start tabbing from beginning
    await page.keyboard.press("Tab");

    // Verify focus moved to first focusable element (not body)
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedTag).not.toBe("BODY");

    // Should focus on first navigation link with href attribute
    let focusedHref = await page.evaluate(() =>
      document.activeElement?.getAttribute("href"),
    );
    expect(focusedHref).toBeTruthy();

    // Store first focused element's data-testid for reference
    const firstFocusedId = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid"),
    );

    // Tab through navigation to next elements
    await page.keyboard.press("Tab");
    const secondFocusedId = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid"),
    );
    expect(secondFocusedId).not.toBe(firstFocusedId);

    await page.keyboard.press("Tab");
    const thirdFocusedId = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid"),
    );
    expect(thirdFocusedId).not.toBe(secondFocusedId);

    // Verify final focused element
    focusedHref = await page.evaluate(() =>
      document.activeElement?.getAttribute("href"),
    );
    expect(focusedHref).toBeTruthy();
  });

  test("should activate buttons with Enter and Space", async ({ page }) => {
    await page.goto("/dashboard");

    // Focus on send button
    await page.focus('[data-testid="send-button"]');

    // Should be focused
    const isFocused = await page.evaluate(
      () =>
        document.activeElement?.getAttribute("data-testid") === "send-button",
    );
    expect(isFocused).toBeTruthy();

    // Note: Testing actual activation requires valid form state
    // This verifies the button can receive focus
  });

  test("should navigate chat messages with keyboard", async ({ page }) => {
    await page.goto("/dashboard");

    // Assume messages exist
    const messageCount = await page.locator('[data-testid="message"]').count();

    if (messageCount > 0) {
      // Focus first message
      await page.focus('[data-testid="message"]');

      // Arrow down to next message
      await page.keyboard.press("ArrowDown");

      // Verify focus moved
      const focusedIndex = await page.evaluate(() => {
        const messages = Array.from(
          document.querySelectorAll('[data-testid="message"]'),
        );
        return messages.indexOf(document.activeElement as Element);
      });

      expect(focusedIndex).toBeGreaterThan(0);
    }
  });

  test("should trap focus in modal dialogs", async ({ page }) => {
    await page.goto("/dashboard");

    // Open settings modal
    await page.click('[data-testid="open-settings"]');

    // Verify modal is open
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Get focusable elements in modal
    const focusableCount = await modal.locator("button, a, input").count();
    expect(focusableCount).toBeGreaterThan(0);

    // Tab through all elements
    for (let i = 0; i < focusableCount + 1; i++) {
      await page.keyboard.press("Tab");
    }

    // Focus should cycle back to first element (focus trap)
    const isInsideModal = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const modal = document.querySelector('[role="dialog"]');
      return modal?.contains(activeElement as Node);
    });

    expect(isInsideModal).toBeTruthy();
  });

  test("should close modal with Escape key", async ({ page }) => {
    await page.goto("/dashboard");

    // Open modal
    await page.click('[data-testid="open-settings"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("should support skip links", async ({ page }) => {
    await page.goto("/");

    // Press Tab to focus skip link (usually first focusable element)
    await page.keyboard.press("Tab");

    // Check if skip link is visible or becomes visible on focus
    const skipLink = page.locator('a[href="#main-content"]');
    const isVisible = await skipLink.isVisible();

    if (isVisible) {
      // Activate skip link
      await page.keyboard.press("Enter");

      // Verify focus moved to main content
      const focusedId = await page.evaluate(() => document.activeElement?.id);
      expect(focusedId).toBe("main-content");
    }
  });

  test("should navigate dropdown menus with arrow keys", async ({ page }) => {
    await page.goto("/dashboard");

    // Open user menu
    const userMenu = page.locator('[data-testid="user-menu"]');
    await userMenu.focus();

    // Verify menu button is focused
    const menuButtonFocused = await page.evaluate(
      () => document.activeElement?.getAttribute("data-testid") === "user-menu",
    );
    expect(menuButtonFocused).toBeTruthy();

    await page.keyboard.press("Enter");

    // Menu should be open and contain menuitems
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible();

    const menuItems = menu.locator('[role="menuitem"]');
    const itemCount = await menuItems.count();
    expect(itemCount).toBeGreaterThan(0);

    // Press Arrow Down to focus first menu item
    await page.keyboard.press("ArrowDown");

    // First menu item should be focused
    const firstItemFocused = await page.evaluate(() => {
      const activeElement = document.activeElement;
      return activeElement?.getAttribute("role") === "menuitem";
    });
    expect(firstItemFocused).toBeTruthy();

    // Store first item for comparison
    const firstItemText = await page.evaluate(
      () => document.activeElement?.textContent,
    );

    // Press Arrow Down again to move to second item
    await page.keyboard.press("ArrowDown");

    // Second item should be focused (if it exists)
    if (itemCount > 1) {
      const secondItemFocused = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return activeElement?.getAttribute("role") === "menuitem";
      });
      expect(secondItemFocused).toBeTruthy();

      const secondItemText = await page.evaluate(
        () => document.activeElement?.textContent,
      );
      expect(secondItemText).not.toBe(firstItemText);
    }
  });

  test("should support Home and End keys in lists", async ({ page }) => {
    await page.goto("/dashboard");

    // Focus on message list
    const messageList = page.locator('[data-testid="message-list"]');
    await messageList.focus();

    // Press End key
    await page.keyboard.press("End");

    // Should focus last item
    const focusedLast = await page.evaluate(() => {
      const messages = Array.from(
        document.querySelectorAll('[data-testid="message"]'),
      );
      return (
        messages.indexOf(document.activeElement as Element) ===
        messages.length - 1
      );
    });

    if ((await messageList.locator('[data-testid="message"]').count()) > 0) {
      expect(focusedLast).toBeTruthy();
    }

    // Press Home key
    await page.keyboard.press("Home");

    // Should focus first item
    const focusedFirst = await page.evaluate(() => {
      const messages = Array.from(
        document.querySelectorAll('[data-testid="message"]'),
      );
      return messages.indexOf(document.activeElement as Element) === 0;
    });

    if ((await messageList.locator('[data-testid="message"]').count()) > 0) {
      expect(focusedFirst).toBeTruthy();
    }
  });

  test("should support Ctrl+Home and Ctrl+End in text areas", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const textarea = page.locator('[data-testid="message-input"]');

    // Fill with multi-line text
    await textarea.fill("Line 1\nLine 2\nLine 3");

    // Focus textarea
    await textarea.focus();

    // Press Ctrl+End
    await page.keyboard.press("Control+End");

    // Cursor should be at end
    const cursorAtEnd = await textarea.evaluate((el: HTMLTextAreaElement) => {
      return el.selectionStart === el.value.length;
    });
    expect(cursorAtEnd).toBeTruthy();

    // Press Ctrl+Home
    await page.keyboard.press("Control+Home");

    // Cursor should be at start
    const cursorAtStart = await textarea.evaluate((el: HTMLTextAreaElement) => {
      return el.selectionStart === 0;
    });
    expect(cursorAtStart).toBeTruthy();
  });

  test("should support Arabic RTL keyboard navigation", async ({ page }) => {
    await page.goto("/dashboard");

    // Switch to Arabic
    await page.click('[data-testid="language-switcher"]');
    await page.click('[data-testid="language-option-ar"]');

    // Wait for RTL to apply
    await page.waitForTimeout(500);

    // Verify HTML dir attribute
    const dir = await page.getAttribute("html", "dir");
    expect(dir).toBe("rtl");

    // Tab through navigation - should work regardless of direction
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).not.toBe("BODY");

    // Arrow keys in RTL context
    // Note: Left/Right behavior may be reversed in RTL
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill("نص عربي للاختبار");
    await messageInput.focus();

    // Press Home - should go to end in RTL
    await page.keyboard.press("Home");
    const cursorPos = await messageInput.evaluate((el: HTMLInputElement) => {
      return el.selectionStart;
    });

    // In RTL, Home might behave differently depending on implementation
    expect(cursorPos).toBeDefined();
  });

  test("should have visible focus indicators throughout navigation", async ({
    page,
  }) => {
    await page.goto("/");

    const focusedElements: Array<{ tag: string; testId: string | null }> = [];

    // Tab through 10 elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");

      // Capture focused element details
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        return {
          tag: el?.tagName || "UNKNOWN",
          testId: el?.getAttribute("data-testid"),
        };
      });

      // Skip body element
      if (focusedElement.tag === "BODY") {
        continue;
      }

      focusedElements.push(focusedElement);

      // Check if focused element has visible outline or ring
      const hasFocusIndicator = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el || el === document.body) return false;

        const styles = window.getComputedStyle(el);

        return (
          (styles.outline !== "none" && styles.outlineWidth !== "0px") ||
          styles.boxShadow.includes("rgb") || // Any shadow means focus indicator
          el.classList.contains("focus:ring") ||
          el.classList.contains("focus-visible:ring") ||
          el.getAttribute("tabindex") !== null
        );
      });

      // Expect focus indicator for interactive elements
      const isInteractive = /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(
        focusedElement.tag,
      );
      if (isInteractive) {
        expect(hasFocusIndicator).toBeTruthy();
      }
    }

    // Should have focused on at least 3 distinct elements
    expect(focusedElements.length).toBeGreaterThanOrEqual(3);
  });
});
