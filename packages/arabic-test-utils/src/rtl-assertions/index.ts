/**
 * RTL (Right-to-Left) layout assertion utilities
 * Provides comprehensive validation for Arabic RTL rendering
 */

/**
 * Comprehensive list of Arabic font families for validation
 * Used across RTL layout validation and Arabic font detection
 */
const ARABIC_FONTS = [
  "noto sans arabic",
  "arabic",
  "traditional arabic",
  "geeza pro",
  "dubai",
  "cairo",
  "tajawal",
  "amiri",
] as const;

/**
 * Subset of CSSStyleDeclaration properties used for RTL validation
 * Provides type safety for computed style properties
 */
interface ComputedStyleSubset {
  direction: string;
  textAlign: string;
  unicodeBidi: string;
  fontFamily: string;
}

/**
 * Element-like object with dir attribute for RTL testing
 */
interface RTLElement {
  dir?: string;
}

export interface RTLLayoutValidation {
  hasRTLDirection: boolean;
  hasCorrectAlignment: boolean;
  hasArabicFont: boolean;
  hasProperSpacing: boolean;
  score: number; // 0.0 - 1.0
  violations: string[];
}

export interface RTLAssertionOptions {
  requireRTLDirection?: boolean;
  requireRightAlignment?: boolean;
  requireArabicFont?: boolean;
  minScore?: number;
  timeout?: number;
}

/**
 * Asserts that an element has proper RTL layout
 *
 * @example
 * ```typescript
 * await assertRTLLayout(element);
 * await assertRTLLayout(element, { minScore: 0.99 });
 * ```
 */
export async function assertRTLLayout(
  element: HTMLElement,
  options: RTLAssertionOptions = {},
): Promise<void> {
  const {
    requireRTLDirection = true,
    requireRightAlignment = true,
    requireArabicFont = false,
    minScore = 0.99,
    timeout = 5000,
  } = options;

  const validation = await validateRTLLayout(element, timeout);

  if (validation.score < minScore) {
    const violations = validation.violations.join("\n  - ");
    throw new Error(
      `RTL layout validation failed (score: ${validation.score.toFixed(2)}, required: ${minScore}):\n  - ${violations}`,
    );
  }

  if (requireRTLDirection && !validation.hasRTLDirection) {
    throw new Error(
      `Element must have RTL direction (current: ${getComputedStyle(element).direction})`,
    );
  }

  if (requireRightAlignment && !validation.hasCorrectAlignment) {
    throw new Error(
      `Element must be right-aligned (current: ${getComputedStyle(element).textAlign})`,
    );
  }

  if (requireArabicFont && !validation.hasArabicFont) {
    throw new Error(
      `Element must use Arabic font (current: ${getComputedStyle(element).fontFamily})`,
    );
  }
}

/**
 * Validates RTL layout without throwing errors
 * Returns detailed validation results
 */
export async function validateRTLLayout(
  element: HTMLElement,
  timeout: number = 5000,
): Promise<RTLLayoutValidation> {
  const violations: string[] = [];
  let score = 1.0;

  // Wait for element to render
  await waitForRender(element, timeout);

  const computedStyle = getComputedStyle(element);
  const direction = computedStyle.direction;
  const textAlign = computedStyle.textAlign;
  const fontFamily = computedStyle.fontFamily;

  // Check RTL direction
  const hasRTLDirection = direction === "rtl";
  if (!hasRTLDirection) {
    violations.push(`Direction is "${direction}" (expected "rtl")`);
    score -= 0.4;
  }

  // Check alignment
  const hasCorrectAlignment =
    textAlign === "right" || (textAlign === "start" && hasRTLDirection);
  if (!hasCorrectAlignment) {
    violations.push(
      `Text alignment is "${textAlign}" (expected "right" or "start" with RTL direction)`,
    );
    score -= 0.3;
  }

  // Check Arabic font
  const hasArabicFont = ARABIC_FONTS.some((font) =>
    fontFamily.toLowerCase().includes(font),
  );
  if (!hasArabicFont) {
    violations.push(
      `Font family "${fontFamily}" may not support Arabic glyphs`,
    );
    score -= 0.1;
  }

  // Check spacing (should not be too compressed)
  const wordSpacing = parseFloat(computedStyle.wordSpacing);
  const hasProperSpacing = !Number.isNaN(wordSpacing) && wordSpacing >= 0;
  if (Number.isNaN(wordSpacing)) {
    violations.push(`Invalid word spacing value (not a number)`);
    score -= 0.2;
  } else if (wordSpacing < 0) {
    violations.push(`Word spacing is negative (Arabic text may be compressed)`);
    score -= 0.2;
  }

  return {
    hasRTLDirection,
    hasCorrectAlignment,
    hasArabicFont,
    hasProperSpacing,
    score: Math.max(0, score),
    violations,
  };
}

/**
 * Asserts that an element has the specified text direction
 *
 * @example
 * ```typescript
 * assertTextDirection(element, "rtl");
 * assertTextDirection(element, "ltr");
 * ```
 */
export function assertTextDirection(
  element: HTMLElement,
  expectedDirection: "rtl" | "ltr",
): void {
  const actualDirection = getComputedStyle(element).direction;
  if (actualDirection !== expectedDirection) {
    throw new Error(
      `Expected text direction "${expectedDirection}", but got "${actualDirection}"`,
    );
  }
}

/**
 * Asserts that an element has the specified text alignment
 *
 * @example
 * ```typescript
 * assertRTLAlignment(element, "right");
 * assertRTLAlignment(element, "start");
 * ```
 */
export function assertRTLAlignment(
  element: HTMLElement,
  expectedAlignment: "right" | "start" | "end",
): void {
  const actualAlignment = getComputedStyle(element).textAlign;
  if (actualAlignment !== expectedAlignment) {
    throw new Error(
      `Expected text alignment "${expectedAlignment}", but got "${actualAlignment}"`,
    );
  }
}

/**
 * Gets detailed RTL layout information for debugging
 */
export function getRTLLayoutInfo(element: HTMLElement): Record<string, string> {
  const computedStyle = getComputedStyle(element);
  return {
    direction: computedStyle.direction,
    textAlign: computedStyle.textAlign,
    fontFamily: computedStyle.fontFamily,
    fontSize: computedStyle.fontSize,
    lineHeight: computedStyle.lineHeight,
    wordSpacing: computedStyle.wordSpacing,
    letterSpacing: computedStyle.letterSpacing,
    unicodeBidi: computedStyle.unicodeBidi,
    writingMode: computedStyle.writingMode,
  };
}

/**
 * Waits for element to be rendered in DOM
 */
async function waitForRender(
  element: HTMLElement,
  timeout: number,
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (element.offsetParent !== null || element === document.body) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Element did not render within ${timeout}ms`);
}

/**
 * Checks if an element contains Arabic text
 */
export function hasArabicText(element: HTMLElement): boolean {
  const arabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(element.textContent || "");
}

/**
 * Gets the percentage of Arabic characters in element text
 */
export function getArabicTextPercentage(element: HTMLElement): number {
  const text = element.textContent || "";
  if (text.length === 0) return 0;

  const arabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const arabicMatches = text.match(arabicRegex);
  const arabicCount = arabicMatches ? arabicMatches.length : 0;

  return arabicCount / text.length;
}

/**
 * Simplified RTL direction assertion
 * For testing DOM-like objects with dir attribute
 */
export function assertRTLDirection(
  element: RTLElement,
  computedStyle?: Partial<ComputedStyleSubset>,
): void {
  // Check computedStyle first if provided
  if (computedStyle && computedStyle.direction) {
    if (computedStyle.direction !== "rtl") {
      throw new Error(
        `Expected RTL direction, got "${computedStyle.direction}"`,
      );
    }
    return;
  }

  // Check element.dir
  if (!element || element.dir !== "rtl") {
    throw new Error(`Expected RTL direction, got "${element?.dir || "none"}"`);
  }
}

/**
 * Asserts text alignment based on language
 * "arabic" expects right alignment, "english" expects left alignment
 */
export function assertTextAlignment(
  style: Partial<ComputedStyleSubset>,
  language: string,
): void {
  const expectedAlignment = language === "arabic" ? "right" : "left";

  if (style.textAlign !== expectedAlignment) {
    if (language === "arabic") {
      throw new Error("Arabic text should be right-aligned");
    } else {
      throw new Error(
        `${language} text should be ${expectedAlignment}-aligned`,
      );
    }
  }
}

/**
 * Validates bidirectional text handling
 * Returns information about Arabic and English content
 */
export function assertBidirectionalText(text: string): {
  hasArabic: boolean;
  hasEnglish: boolean;
  isBidirectional: boolean;
} {
  const hasArabic =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      text,
    );
  const hasEnglish = /[a-zA-Z]/.test(text);
  const isBidirectional = hasArabic && hasEnglish;

  return {
    hasArabic,
    hasEnglish,
    isBidirectional,
  };
}

/**
 * Asserts that Arabic font is loaded
 * Accepts a font family string directly
 */
export function assertArabicFontLoaded(fontFamily: string): void {
  if (!fontFamily || typeof fontFamily !== "string") {
    throw new Error("Font family must be a string");
  }

  const hasArabicFont = ARABIC_FONTS.some((font) =>
    fontFamily.toLowerCase().includes(font),
  );

  if (!hasArabicFont) {
    throw new Error("Arabic font not detected");
  }
}
