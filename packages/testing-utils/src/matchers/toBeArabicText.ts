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
export function toBeArabicText(this: any, received: unknown) {
  const receivedStr = String(received);
  // Arabic Unicode range: \u0600-\u06ff (includes Arabic letters and diacritics)
  // Extended Arabic ranges:
  // - Arabic Supplement: \u0750-\u077f
  // - Arabic Extended-A: \u08a0-\u08ff
  // - Arabic Presentation Forms-A: \ufb50-\ufdff
  // - Arabic Presentation Forms-B: \ufe70-\ufeff
  const arabicRegex =
    /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/;
  const hasArabic = arabicRegex.test(receivedStr);

  return {
    pass: hasArabic,
    message: () =>
      hasArabic
        ? `Expected "${receivedStr}" not to contain Arabic text`
        : `Expected "${receivedStr}" to contain Arabic text (Unicode range: \\u0600-\\u06ff)`,
  };
}

/**
 * Checks if the received value contains ONLY Arabic text (no English)
 */
export function toBeOnlyArabicText(this: any, received: unknown) {
  const receivedStr = String(received);
  const arabicRegex =
    /^[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff\s\u060c\u061f\u061b,.!?؛،]+$/;
  const isOnlyArabic = arabicRegex.test(receivedStr);

  return {
    pass: isOnlyArabic,
    message: () =>
      isOnlyArabic
        ? `Expected "${receivedStr}" not to contain only Arabic text`
        : `Expected "${receivedStr}" to contain only Arabic text (found non-Arabic characters)`,
  };
}

/**
 * Checks if text contains mixed Arabic and English content
 */
export function toBeMixedArabicEnglishText(this: any, received: unknown) {
  const receivedStr = String(received);
  const hasArabic = /[\u0600-\u06ff]/.test(receivedStr);
  const hasEnglish = /[a-zA-Z]/.test(receivedStr);
  const isMixed = hasArabic && hasEnglish;

  return {
    pass: isMixed,
    message: () =>
      isMixed
        ? `Expected "${receivedStr}" not to contain mixed Arabic and English text`
        : `Expected "${receivedStr}" to contain mixed Arabic and English text (Arabic: ${hasArabic}, English: ${hasEnglish})`,
  };
}

// Register matchers with Bun test
expect.extend({
  toBeArabicText,
  toBeOnlyArabicText,
  toBeMixedArabicEnglishText,
});
