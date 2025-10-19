/**
 * Custom matcher to check if text contains Arabic characters
 * Part of Bun test framework extension for Iraqi AI testing
 */

import { expect } from "bun:test";

/**
 * Checks if the received value contains Arabic text
 *
 * @example
 * ```typescript
 * expect("مرحباً").toBeArabicText(); // passes
 * expect("Hello").toBeArabicText(); // fails
 * ```
 */
export function toBeArabicText(this: any, received: string) {
  // Arabic Unicode range: \u0600-\u06ff (includes Arabic letters and diacritics)
  // Extended Arabic ranges:
  // - Arabic Supplement: \u0750-\u077f
  // - Arabic Extended-A: \u08a0-\u08ff
  // - Arabic Presentation Forms-A: \ufb50-\ufdff
  // - Arabic Presentation Forms-B: \ufe70-\ufeff
  const arabicRegex =
    /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/;
  const hasArabic = arabicRegex.test(received);

  return {
    pass: hasArabic,
    message: () =>
      hasArabic
        ? `Expected "${received}" not to contain Arabic text`
        : `Expected "${received}" to contain Arabic text (Unicode range: \\u0600-\\u06ff)`,
  };
}

/**
 * Checks if the received value contains ONLY Arabic text (no English)
 */
export function toBeOnlyArabicText(this: any, received: string) {
  const arabicRegex =
    /^[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff\s\u060c\u061f\u061b,.!?؛،]+$/;
  const isOnlyArabic = arabicRegex.test(received);

  return {
    pass: isOnlyArabic,
    message: () =>
      isOnlyArabic
        ? `Expected "${received}" not to contain only Arabic text`
        : `Expected "${received}" to contain only Arabic text (found non-Arabic characters)`,
  };
}

/**
 * Checks if text contains mixed Arabic and English content
 */
export function toBeMixedArabicEnglishText(this: any, received: string) {
  const hasArabic = /[\u0600-\u06ff]/.test(received);
  const hasEnglish = /[a-zA-Z]/.test(received);
  const isMixed = hasArabic && hasEnglish;

  return {
    pass: isMixed,
    message: () =>
      isMixed
        ? `Expected "${received}" not to contain mixed Arabic and English text`
        : `Expected "${received}" to contain mixed Arabic and English text (Arabic: ${hasArabic}, English: ${hasEnglish})`,
  };
}

// Register matchers with Bun test
expect.extend({
  toBeArabicText,
  toBeOnlyArabicText,
  toBeMixedArabicEnglishText,
});
