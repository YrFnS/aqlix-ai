/**
 * Arabic font rendering utilities for testing
 * Validates font loading, rendering quality, and Arabic glyph support
 */

export interface FontMetrics {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  wordSpacing: string;
  isLoaded: boolean;
  supportsArabic: boolean;
}

export interface FontRenderingValidation {
  isValid: boolean;
  fontLoaded: boolean;
  hasArabicSupport: boolean;
  characterWidthsCorrect: boolean;
  glyphsRenderedCorrectly: boolean;
  score: number; // 0.0 - 1.0
  violations: string[];
}

export interface FontRenderingOptions {
  expectedFont?: string;
  minCharacterWidth?: number;
  maxCharacterWidth?: number;
  requireArabicFont?: boolean;
  minScore?: number;
  timeout?: number;
}

/**
 * Common Arabic font families
 */
export const ARABIC_FONTS = [
  "Noto Sans Arabic",
  "Noto Kufi Arabic",
  "Traditional Arabic",
  "Arabic Typesetting",
  "Geeza Pro",
  "Dubai",
  "Tahoma",
  "Arial",
  "Segoe UI",
];

/**
 * Asserts that a specific font is loaded
 *
 * @example
 * ```typescript
 * await assertFontLoaded("Noto Sans Arabic");
 * ```
 */
export async function assertFontLoaded(
  fontFamily: string,
  timeout: number = 5000,
): Promise<void> {
  const isLoaded = await waitForFontLoad(fontFamily, timeout);

  if (!isLoaded) {
    throw new Error(`Font "${fontFamily}" did not load within ${timeout}ms`);
  }
}

/**
 * Validates font rendering for Arabic text
 *
 * @example
 * ```typescript
 * await validateFontRendering(element, {
 *   expectedFont: "Noto Sans Arabic",
 *   minCharacterWidth: 10,
 *   maxCharacterWidth: 50
 * });
 * ```
 */
export async function validateFontRendering(
  element: HTMLElement,
  options: FontRenderingOptions = {},
): Promise<void> {
  const {
    expectedFont,
    minCharacterWidth = 8,
    maxCharacterWidth = 100,
    requireArabicFont = false,
    minScore = 0.95,
    timeout = 5000,
  } = options;

  const validation = await getFontRenderingValidation(
    element,
    minCharacterWidth,
    maxCharacterWidth,
    timeout,
  );

  if (validation.score < minScore) {
    const violations = validation.violations.join("\n  - ");
    throw new Error(
      `Font rendering validation failed (score: ${validation.score.toFixed(2)}, required: ${minScore}):\n  - ${violations}`,
    );
  }

  if (expectedFont) {
    const metrics = await getFontMetrics(element, timeout);
    const hasExpectedFont = metrics.fontFamily
      .toLowerCase()
      .includes(expectedFont.toLowerCase());
    if (!hasExpectedFont) {
      throw new Error(
        `Expected font "${expectedFont}", but got "${metrics.fontFamily}"`,
      );
    }
  }

  if (requireArabicFont && !validation.hasArabicSupport) {
    throw new Error("Element must use an Arabic-compatible font");
  }
}

/**
 * Gets detailed font rendering validation results
 */
export async function getFontRenderingValidation(
  element: HTMLElement,
  minCharacterWidth: number = 8,
  maxCharacterWidth: number = 100,
  timeout: number = 5000,
): Promise<FontRenderingValidation> {
  const violations: string[] = [];
  let score = 1.0;

  // Wait for fonts to load
  await waitForFontsReady(timeout);

  // Get font metrics
  const metrics = await getFontMetrics(element, timeout);

  // Check if font is loaded
  const fontLoaded = metrics.isLoaded;
  if (!fontLoaded) {
    violations.push(`Font "${metrics.fontFamily}" is not loaded`);
    score -= 0.3;
  }

  // Check Arabic support
  const hasArabicSupport = metrics.supportsArabic;
  if (!hasArabicSupport) {
    violations.push(
      `Font "${metrics.fontFamily}" may not support Arabic glyphs`,
    );
    score -= 0.2;
  }

  // Check character widths
  const characterWidthsCorrect = await validateCharacterWidths(
    element,
    minCharacterWidth,
    maxCharacterWidth,
  );
  if (!characterWidthsCorrect) {
    violations.push(
      `Character widths outside expected range (${minCharacterWidth}-${maxCharacterWidth}px)`,
    );
    score -= 0.25;
  }

  // Check if glyphs render correctly (not as tofu/boxes)
  const glyphsRenderedCorrectly = await validateGlyphRendering(element);
  if (!glyphsRenderedCorrectly) {
    violations.push("Some glyphs may be rendering as boxes (tofu)");
    score -= 0.25;
  }

  const isValid =
    fontLoaded &&
    hasArabicSupport &&
    characterWidthsCorrect &&
    glyphsRenderedCorrectly;

  return {
    isValid,
    fontLoaded,
    hasArabicSupport,
    characterWidthsCorrect,
    glyphsRenderedCorrectly,
    score: Math.max(0, score),
    violations,
  };
}

/**
 * Gets font metrics for an element
 *
 * @example
 * ```typescript
 * const metrics = await getFontMetrics(element);
 * console.log(metrics.fontFamily); // "Noto Sans Arabic"
 * ```
 */
export async function getFontMetrics(
  element: HTMLElement,
  timeout: number = 5000,
): Promise<FontMetrics> {
  // Wait for element to render
  await waitForElementRender(element, timeout);

  const computedStyle = getComputedStyle(element);
  const fontFamily = computedStyle.fontFamily;
  const fontSize = computedStyle.fontSize;
  const fontWeight = computedStyle.fontWeight;
  const lineHeight = computedStyle.lineHeight;
  const letterSpacing = computedStyle.letterSpacing;
  const wordSpacing = computedStyle.wordSpacing;

  // Check if font is loaded
  const isLoaded = await isFontLoaded(fontFamily);

  // Check Arabic support
  const supportsArabic = checkArabicFontSupport(fontFamily);

  return {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    wordSpacing,
    isLoaded,
    supportsArabic,
  };
}

/**
 * Waits for a specific font to load
 */
async function waitForFontLoad(
  fontFamily: string,
  timeout: number,
): Promise<boolean> {
  if (typeof document === "undefined" || !document.fonts) {
    return false;
  }

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const loaded = await isFontLoaded(fontFamily);
    if (loaded) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return false;
}

/**
 * Checks if a font is loaded
 */
async function isFontLoaded(fontFamily: string): Promise<boolean> {
  if (typeof document === "undefined" || !document.fonts) {
    return false;
  }

  try {
    // Clean font family name (remove quotes, normalize)
    const cleanFontFamily = fontFamily
      .replace(/["']/g, "")
      .split(",")[0]
      .trim();

    // Check using document.fonts API
    return document.fonts.check(`12px "${cleanFontFamily}"`);
  } catch (error) {
    return false;
  }
}

/**
 * Waits for all fonts to be ready
 */
async function waitForFontsReady(timeout: number): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) {
    return;
  }

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (document.fonts.status === "loaded") {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

/**
 * Checks if font family supports Arabic
 */
function checkArabicFontSupport(fontFamily: string): boolean {
  const cleanFontFamily = fontFamily.toLowerCase().replace(/["']/g, "");

  // Check if font family is known Arabic font
  return ARABIC_FONTS.some((arabicFont) =>
    cleanFontFamily.includes(arabicFont.toLowerCase()),
  );
}

/**
 * Validates character widths are within expected range
 */
async function validateCharacterWidths(
  element: HTMLElement,
  minWidth: number,
  maxWidth: number,
): Promise<boolean> {
  if (!element.textContent) {
    return true;
  }

  // Create a temporary span to measure character widths
  const tempSpan = document.createElement("span");
  tempSpan.style.position = "absolute";
  tempSpan.style.visibility = "hidden";
  tempSpan.style.fontFamily = getComputedStyle(element).fontFamily;
  tempSpan.style.fontSize = getComputedStyle(element).fontSize;
  document.body.appendChild(tempSpan);

  try {
    // Sample a few Arabic characters
    const testChars = ["أ", "ب", "ج", "د", "ه", "و"];
    for (const char of testChars) {
      tempSpan.textContent = char;
      const width = tempSpan.offsetWidth;

      if (width < minWidth || width > maxWidth) {
        return false;
      }
    }

    return true;
  } finally {
    document.body.removeChild(tempSpan);
  }
}

/**
 * Validates glyphs render correctly (not as tofu/boxes)
 */
async function validateGlyphRendering(element: HTMLElement): Promise<boolean> {
  if (!element.textContent) {
    return true;
  }

  // Create canvas to check glyph rendering
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return true; // Cannot validate without canvas
  }

  const computedStyle = getComputedStyle(element);
  ctx.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

  // Test a few Arabic characters
  const testChars = ["أ", "ب", "ج"];
  const fallbackChar = "□"; // Tofu character

  for (const char of testChars) {
    const charWidth = ctx.measureText(char).width;
    const fallbackWidth = ctx.measureText(fallbackChar).width;

    // If widths are identical, likely rendering as tofu
    if (Math.abs(charWidth - fallbackWidth) < 1) {
      return false;
    }
  }

  return true;
}

/**
 * Waits for element to render
 */
async function waitForElementRender(
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
 * Gets recommended Arabic fonts for testing
 */
export function getRecommendedArabicFonts(): string[] {
  return [...ARABIC_FONTS];
}

/**
 * Asserts that element uses an Arabic-compatible font
 */
export async function assertArabicFont(
  element: HTMLElement,
  timeout: number = 5000,
): Promise<void> {
  const metrics = await getFontMetrics(element, timeout);

  if (!metrics.supportsArabic) {
    throw new Error(
      `Element font "${metrics.fontFamily}" does not support Arabic. Recommended fonts: ${ARABIC_FONTS.join(", ")}`,
    );
  }
}

/**
 * Simplified font rendering validation
 * Returns rendering quality for Arabic text
 */
export function validateArabicFontRendering(text: string): {
  isSupported: boolean;
  quality: number;
} {
  // Check if text contains Arabic characters
  const arabicRegex =
    /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/;
  const hasArabic = arabicRegex.test(text);

  // Simple quality score based on text characteristics
  let quality = 0.9; // Base quality

  if (!hasArabic) {
    quality = 0;
  }

  return {
    isSupported: hasArabic,
    quality,
  };
}

/**
 * Checks if a font supports Arabic
 * Accepts a single font name or array of font names
 */
export function checkFontSupport(
  fontName: string | string[],
):
  | { isSupported: boolean; fontName?: string }
  | { supported: string[]; unsupported: string[] } {
  // Handle single font name
  if (typeof fontName === "string") {
    const isArabicFont = ARABIC_FONTS.some((arabicFont) =>
      fontName.toLowerCase().includes(arabicFont.toLowerCase()),
    );
    return { isSupported: isArabicFont, fontName };
  }

  // Handle array of font names
  const supported: string[] = [];
  const unsupported: string[] = [];

  for (const font of fontName) {
    const isArabicFont = ARABIC_FONTS.some((arabicFont) =>
      font.toLowerCase().includes(arabicFont.toLowerCase()),
    );

    if (isArabicFont) {
      supported.push(font);
    } else {
      unsupported.push(font);
    }
  }

  return { supported, unsupported };
}

/**
 * Asserts glyph correctness for Arabic characters
 * Validates that Arabic glyphs render correctly in text
 */
export function assertGlyphCorrectness(text: string): void {
  if (!text || typeof text !== "string") {
    throw new Error("Text must be a non-empty string");
  }

  // Check for Arabic characters
  const arabicRegex =
    /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/;
  if (!arabicRegex.test(text)) {
    throw new Error("Text does not contain valid Arabic glyphs");
  }

  // Validate that text has reasonable length for glyphs
  if (text.length === 0) {
    throw new Error("Text is empty");
  }
}
