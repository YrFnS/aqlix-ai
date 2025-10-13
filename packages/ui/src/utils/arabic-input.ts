/**
 * Arabic Input Utility Functions
 * Helper utilities for Arabic text input handling
 * @module utils/arabic-input
 */

import { ARABIC_REGEX } from "./bidirectional";
import type { ValidationResult } from "@iraqi-ai/arabic-nlp";

/**
 * Detects if an Arabic keyboard layout is likely being used
 *
 * Uses heuristics to determine if the user is typing with an Arabic keyboard:
 * - Recent input contains Arabic characters
 * - Input direction is RTL
 * - Browser language settings include Arabic
 *
 * @param recentInput - Recent text input from the user
 * @returns True if Arabic keyboard is likely active
 *
 * @example
 * ```ts
 * detectArabicKeyboard('مرحبا') // true
 * detectArabicKeyboard('Hello') // false
 * detectArabicKeyboard('مرحبا Hello') // true (mixed content)
 * ```
 */
export function detectArabicKeyboard(recentInput: string): boolean {
  // Check if input contains Arabic characters
  if (ARABIC_REGEX.test(recentInput)) {
    return true;
  }

  // Check browser language settings
  if (typeof navigator !== "undefined") {
    const languages = navigator.languages || [navigator.language];
    return languages.some((lang) => lang.startsWith("ar"));
  }

  return false;
}

/**
 * Formats validation error messages in a user-friendly way
 *
 * Converts technical validation errors into clear, actionable messages
 * for users. Prioritizes the most severe errors and provides helpful
 * suggestions.
 *
 * @param result - Validation result from arabic-nlp validation
 * @param locale - Locale for message formatting ('ar' or 'en')
 * @returns Formatted error message or null if valid
 *
 * @example
 * ```ts
 * const result = {
 *   isValid: false,
 *   errors: [{ code: 'BIDI_THREAT', message: 'Bidi override detected', severity: 'error' }],
 *   warnings: [],
 *   threats: ['BIDI_OVERRIDE'],
 *   confidence: 0.5
 * };
 * formatValidationMessage(result, 'en')
 * // "Security threat detected: Bidirectional override characters found"
 * ```
 */
export function formatValidationMessage(
  result: ValidationResult,
  locale: "ar" | "en" = "en",
): string | null {
  if (result.isValid) {
    return null;
  }

  // Priority 1: Security threats
  if (result.threats.length > 0) {
    const threat = result.threats[0];
    // Extract threat type from threat object
    const threatKey =
      typeof threat === "object" && threat !== null
        ? threat.type.toString().toUpperCase().replace(/-/g, "_")
        : String(threat).toUpperCase().replace(/-/g, "_");

    if (locale === "ar") {
      switch (threatKey) {
        case "BIDI_OVERRIDE":
          return "تهديد أمني: تم اكتشاف أحرف تحكم ثنائية الاتجاه";
        case "ZERO_WIDTH_ABUSE":
          return "تهديد أمني: تم اكتشاف أحرف غير مرئية مشبوهة";
        default:
          return "تهديد أمني: تم اكتشاف محتوى مشبوه";
      }
    } else {
      switch (threatKey) {
        case "BIDI_OVERRIDE":
          return "Security threat: Bidirectional override characters detected";
        case "ZERO_WIDTH_ABUSE":
          return "Security threat: Suspicious invisible characters detected";
        default:
          return "Security threat: Suspicious content detected";
      }
    }
  }

  // Priority 2: Validation errors
  if (result.errors.length > 0) {
    const error = result.errors[0];
    if (locale === "ar") {
      // Return Arabic error message if available, otherwise default
      return error?.message || "خطأ في التحقق من النص";
    } else {
      return error?.message || "Text validation error";
    }
  }

  // Priority 3: Warnings
  if (result.warnings.length > 0) {
    const warning = result.warnings[0];
    if (locale === "ar") {
      return warning?.message || "تحذير: قد يكون هناك مشكلة في النص";
    } else {
      return warning?.message || "Warning: Potential text issue";
    }
  }

  return locale === "ar" ? "خطأ غير معروف" : "Unknown error";
}

/**
 * Counts input length using proper Unicode grapheme segmentation
 *
 * Correctly counts Arabic characters, including:
 * - Base characters with diacritics as single units
 * - Emoji and complex Unicode sequences
 * - Iraqi Kurdish characters (چ, گ, ڤ)
 *
 * Uses Intl.Segmenter when available, falls back to character counting.
 *
 * @param text - Input text to measure
 * @returns Number of user-perceived characters (graphemes)
 *
 * @example
 * ```ts
 * getInputLength('Hello') // 5
 * getInputLength('مرحبا') // 5
 * getInputLength('مَرْحَبًا') // 5 (diacritics don't add to count)
 * getInputLength('👨‍👩‍👧‍👦') // 1 (family emoji counted as one)
 * getInputLength('چگڤ') // 3 (Iraqi Kurdish chars)
 * ```
 */
export function getInputLength(text: string): number {
  if (!text) return 0;

  // Use Intl.Segmenter for proper grapheme counting (modern browsers)
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      // Type cast needed as Intl.Segmenter is not in all TS versions
      const IntlSegmenter = (Intl as any).Segmenter;
      const segmenter = new IntlSegmenter(undefined, {
        granularity: "grapheme",
      });
      const segments = segmenter.segment(text);
      return Array.from(segments).length;
    } catch {
      // Fall through to fallback if Segmenter fails
    }
  }

  // Fallback: Use Array.from for basic Unicode handling
  // This handles most cases including basic emoji and Arabic
  return Array.from(text).length;
}

/**
 * Checks if input contains mixed Arabic and English content
 *
 * @param text - Input text to check
 * @returns True if text contains both Arabic and Latin characters
 *
 * @example
 * ```ts
 * isMixedContent('مرحبا') // false (Arabic only)
 * isMixedContent('Hello') // false (English only)
 * isMixedContent('مرحبا Hello') // true (mixed)
 * isMixedContent('Name: الاسم') // true (mixed)
 * ```
 */
export function isMixedContent(text: string): boolean {
  const hasArabic = ARABIC_REGEX.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  return hasArabic && hasLatin;
}

/**
 * Gets the dominant script direction in mixed content
 *
 * @param text - Input text to analyze
 * @returns 'rtl' if Arabic is dominant, 'ltr' if Latin is dominant
 *
 * @example
 * ```ts
 * getDominantDirection('مرحبا') // 'rtl'
 * getDominantDirection('Hello') // 'ltr'
 * getDominantDirection('مرحبا Hello مرحبا') // 'rtl' (more Arabic)
 * getDominantDirection('Hello مرحبا Hello') // 'ltr' (more English)
 * ```
 */
export function getDominantDirection(text: string): "rtl" | "ltr" {
  const arabicCount = (text.match(ARABIC_REGEX) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;

  return arabicCount > latinCount ? "rtl" : "ltr";
}
