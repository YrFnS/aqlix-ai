/**
 * Custom matcher to check if element has RTL (Right-To-Left) layout
 * Part of Bun test framework extension for Iraqi AI testing
 */

import { expect } from "bun:test";

/**
 * Checks if the received HTMLElement has RTL direction and right-aligned text
 *
 * @example
 * ```typescript
 * const element = document.querySelector(".arabic-text");
 * expect(element).toBeRTLAligned(); // passes if element has dir="rtl" and text-align: right
 * ```
 */
export function toBeRTLAligned(this: any, received: any) {
  // Validate that received is an HTMLElement
  if (typeof received !== "object" || !received) {
    return {
      pass: false,
      message: () =>
        "toBeRTLAligned requires an HTMLElement, received: " + typeof received,
    };
  }

  // Check if running in DOM environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      pass: false,
      message: () =>
        "toBeRTLAligned requires a DOM environment (window and document must be defined)",
    };
  }

  try {
    // Get computed styles
    const computedStyle = window.getComputedStyle(received as HTMLElement);
    const direction = computedStyle.direction;
    const textAlign = computedStyle.textAlign;

    // Check RTL direction
    const hasRTLDirection = direction === "rtl";

    // Check right alignment (or 'start' which means right in RTL context)
    const isRightAligned =
      textAlign === "right" || (textAlign === "start" && hasRTLDirection);

    const pass = hasRTLDirection && isRightAligned;

    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to be RTL aligned (direction: ${direction}, textAlign: ${textAlign})`
          : `Expected element to be RTL aligned with right text alignment\n` +
            `  Actual:\n` +
            `    direction: ${direction} (expected: rtl)\n` +
            `    textAlign: ${textAlign} (expected: right or start)\n` +
            `  Tip: Ensure the element or its parent has dir="rtl" attribute and appropriate CSS`,
    };
  } catch (error: any) {
    return {
      pass: false,
      message: () =>
        `Failed to check RTL alignment: ${error.message}\n` +
        `Ensure the element is properly rendered in a DOM environment`,
    };
  }
}

/**
 * Checks if element has RTL direction attribute
 */
export function toHaveRTLDirection(this: any, received: any) {
  if (
    typeof received !== "object" ||
    !received ||
    !("getAttribute" in received)
  ) {
    return {
      pass: false,
      message: () =>
        "toHaveRTLDirection requires an HTMLElement with getAttribute method",
    };
  }

  const dirAttribute = (received as HTMLElement).getAttribute("dir");
  const pass = dirAttribute === "rtl";

  return {
    pass,
    message: () =>
      pass
        ? `Expected element not to have dir="rtl" attribute`
        : `Expected element to have dir="rtl" attribute, but got: ${dirAttribute || "no dir attribute"}`,
  };
}

/**
 * Checks if element or its ancestors have RTL direction
 */
export function toBeInRTLContext(this: any, received: any) {
  if (typeof received !== "object" || !received) {
    return {
      pass: false,
      message: () => "toBeInRTLContext requires an HTMLElement",
    };
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      pass: false,
      message: () => "toBeInRTLContext requires a DOM environment",
    };
  }

  try {
    let element: HTMLElement | null = received as HTMLElement;
    let foundRTL = false;

    // Check element and ancestors up to document.body
    while (element && element !== document.body) {
      const dir = element.getAttribute("dir");
      if (dir === "rtl") {
        foundRTL = true;
        break;
      }
      element = element.parentElement;
    }

    // Also check computed direction as fallback
    if (!foundRTL) {
      const computedStyle = window.getComputedStyle(received as HTMLElement);
      foundRTL = computedStyle.direction === "rtl";
    }

    return {
      pass: foundRTL,
      message: () =>
        foundRTL
          ? `Expected element not to be in RTL context`
          : `Expected element to be in RTL context (element or ancestors should have dir="rtl")`,
    };
  } catch (error: any) {
    return {
      pass: false,
      message: () => `Failed to check RTL context: ${error.message}`,
    };
  }
}

// Register matchers with Bun test
expect.extend({
  toBeRTLAligned,
  toHaveRTLDirection,
  toBeInRTLContext,
});
