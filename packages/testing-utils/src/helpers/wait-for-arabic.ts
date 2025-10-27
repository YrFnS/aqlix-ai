/**
 * Utilities for waiting on Arabic text rendering and RTL layout
 * Provides async helpers for testing Arabic UI components
 */

/**
 * Waits for Arabic text to render with proper RTL layout
 *
 * @param element - HTMLElement to check
 * @param timeout - Maximum wait time in ms (default: 5000)
 * @returns Promise<boolean> - true if RTL rendered, false if timeout
 *
 * @example
 * ```typescript
 * const element = document.querySelector(".arabic-text");
 * const isRTL = await waitForArabicRendering(element);
 * expect(isRTL).toBe(true);
 * ```
 */
export async function waitForArabicRendering(
  element: HTMLElement | null | undefined,
  timeout: number = 5000,
): Promise<boolean> {
  // Guard: Validate element exists and is HTMLElement
  if (!element || !(element instanceof HTMLElement)) {
    return false;
  }

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const computedStyle = window.getComputedStyle(element);
      const direction = computedStyle.direction;
      const textAlign = computedStyle.textAlign;

      // Check if RTL is properly applied
      if (
        direction === "rtl" &&
        (textAlign === "right" || textAlign === "start")
      ) {
        return true;
      }
    } catch (error) {
      // Element might not be ready yet
    }

    // Wait 50ms before next check
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return false;
}

/**
 * Waits for Arabic font to load
 *
 * @param fontFamily - Font family to wait for (default: "Noto Sans Arabic")
 * @param timeout - Maximum wait time in ms (default: 5000)
 */
export async function waitForArabicFont(
  fontFamily: string = "Noto Sans Arabic",
  timeout: number = 5000,
): Promise<boolean> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return false;
  }

  try {
    // Use Promise.race to implement timeout for font loading
    const fontLoadPromise = document.fonts.load(`12px "${fontFamily}"`);
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Font load timeout")), timeout),
    );

    await Promise.race([fontLoadPromise, timeoutPromise]);
    return document.fonts.check(`12px "${fontFamily}"`);
  } catch (error) {
    return false;
  }
}

/**
 * Waits for element to contain Arabic text
 *
 * @param element - HTMLElement to check
 * @param timeout - Maximum wait time in ms (default: 5000)
 */
export async function waitForArabicContent(
  element: HTMLElement | null | undefined,
  timeout: number = 5000,
): Promise<boolean> {
  // Guard: Validate element exists and is HTMLElement
  if (!element || !(element instanceof HTMLElement)) {
    return false;
  }

  const startTime = Date.now();
  const arabicRegex = /[\u0600-\u06ff]/;

  while (Date.now() - startTime < timeout) {
    const text = element.textContent || "";
    if (arabicRegex.test(text)) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return false;
}

/**
 * Waits for multiple Arabic elements to render
 */
export async function waitForMultipleArabicElements(
  elements: (HTMLElement | null | undefined)[],
  timeout: number = 5000,
): Promise<boolean> {
  // Filter out null/undefined elements
  const validElements = elements.filter(
    (el): el is HTMLElement => el != null && el instanceof HTMLElement,
  );

  if (validElements.length === 0) {
    return false;
  }

  const promises = validElements.map((el) =>
    waitForArabicRendering(el, timeout),
  );

  const results = await Promise.all(promises);
  return results.every((result) => result === true);
}

/**
 * Waits for dir="rtl" attribute to be set on element
 */
export async function waitForRTLAttribute(
  element: HTMLElement | null | undefined,
  timeout: number = 5000,
): Promise<boolean> {
  // Guard: Validate element exists and is HTMLElement
  if (!element || !(element instanceof HTMLElement)) {
    return false;
  }

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const dir = element.getAttribute("dir");
    if (dir === "rtl") {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return false;
}

/**
 * Waits for element's computed direction to be RTL
 */
export async function waitForComputedRTL(
  element: HTMLElement | null | undefined,
  timeout: number = 5000,
): Promise<boolean> {
  // Guard: Validate element exists and is HTMLElement
  if (!element || !(element instanceof HTMLElement)) {
    return false;
  }

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.direction === "rtl") {
        return true;
      }
    } catch (error) {
      // Element might not be ready
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return false;
}

/**
 * Utility to wait for any condition with timeout
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 50,
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return false;
}
