/**
 * Security-focused text sanitization for Arabic input
 * Removes dangerous Unicode while preserving Iraqi dialect authenticity
 * @module @iraqi-ai/arabic-nlp/sanitization
 */

import type { SanitizationOptions } from "./types/index.js";
import {
  BIDI_OVERRIDE_REGEX,
  MALICIOUS_ZERO_WIDTH_REGEX,
  ALL_ZERO_WIDTH_REGEX,
  SUSPICIOUS_CONTROL_REGEX,
} from "./constants/security-patterns.js";
import { IRAQI_KURDISH_CHARS } from "./constants/unicode-ranges.js";
import { normalizeCharacterVariants } from "./normalization.js";

/**
 * Sanitize Arabic input for safe storage and display
 * Removes all security threats while preserving Iraqi dialect markers
 *
 * @param text - Text to sanitize
 * @param options - Sanitization options
 * @returns Sanitized text safe for storage/display
 *
 * @example
 * ```typescript
 * // Remove bidi override attack
 * sanitizeArabicInput("test\u202Emalicious\u202C"); // "testmalicious"
 *
 * // Preserve Iraqi Kurdish characters
 * sanitizeArabicInput("چاي گرم"); // "چاي گرم" (unchanged)
 *
 * // Aggressive mode normalizes variants
 * sanitizeArabicInput("أحمد", { aggressive: true }); // "احمد"
 * ```
 */
export function sanitizeArabicInput(
  text: string,
  options: SanitizationOptions = {},
): string {
  const {
    aggressive = false,
    removeAllZeroWidth = false,
    // preserveChars reserved for future use
  } = options;

  let result = text;

  // SECURITY STEP 1: Strip ALL bidi override characters (CRITICAL)
  // U+202A..U+202E: LRE, RLE, PDF, LRO, RLO
  // U+2066..U+2069: LRI, RLI, FSI, PDI
  result = stripBidiOverrides(result);

  // SECURITY STEP 2: Strip dangerous zero-width characters
  if (removeAllZeroWidth) {
    // Remove all zero-width including legitimate ZWNJ/ZWJ
    result = result.replace(ALL_ZERO_WIDTH_REGEX, "");
  } else {
    // Remove only always-malicious zero-width (preserve ZWNJ/ZWJ for Arabic)
    result = stripDangerousUnicode(result);
  }

  // SECURITY STEP 3: Remove suspicious control characters
  result = result.replace(SUSPICIOUS_CONTROL_REGEX, "");

  // STEP 4: Normalize to NFC (canonical composition)
  result = result.normalize("NFC");

  // STEP 5: If aggressive mode, also normalize character variants
  if (aggressive) {
    result = normalizeCharacterVariants(result);
  }

  // VERIFICATION: Ensure Iraqi Kurdish characters preserved
  const originalKurdish = (text.match(IRAQI_KURDISH_CHARS.regex) || []).length;
  const resultKurdish = (result.match(IRAQI_KURDISH_CHARS.regex) || []).length;

  if (originalKurdish !== resultKurdish) {
    // This should NEVER happen - it's a bug if it does
    console.error(
      `CRITICAL: Iraqi Kurdish characters lost during sanitization. Original: ${originalKurdish}, Result: ${resultKurdish}`,
    );
  }

  return result;
}

/**
 * Strip bidirectional override characters
 * Removes all bidi control characters that enable Trojan Source attacks
 *
 * @param text - Text with potential bidi overrides
 * @returns Text without bidi overrides
 *
 * @example
 * ```typescript
 * stripBidiOverrides("test\u202Emalicious\u202C"); // "testmalicious"
 * stripBidiOverrides("\u202Aاليمين\u202C"); // "اليمين"
 * ```
 */
export function stripBidiOverrides(text: string): string {
  return text.replace(BIDI_OVERRIDE_REGEX, "");
}

/**
 * Strip dangerous Unicode characters
 * Removes zero-width characters that are almost always malicious
 * Preserves ZWNJ and ZWJ as they have legitimate uses in Arabic
 *
 * @param text - Text with potential dangerous characters
 * @returns Text without dangerous Unicode
 *
 * @example
 * ```typescript
 * stripDangerousUnicode("text\u200Bwith\u200Bzwsp"); // "textwithzwsp"
 * stripDangerousUnicode("text\u200Cwith\u200Dzwnj"); // Preserves ZWNJ/ZWJ
 * ```
 */
export function stripDangerousUnicode(text: string): string {
  // Remove only malicious zero-width (ZWSP, BOM, etc.)
  // Keep ZWNJ (U+200C) and ZWJ (U+200D) as they're used in Arabic
  return text.replace(MALICIOUS_ZERO_WIDTH_REGEX, "");
}

/**
 * Escape text for safe HTML display
 * Prevents XSS while preserving Arabic characters
 *
 * @param text - Text to escape
 * @returns HTML-safe text
 *
 * @example
 * ```typescript
 * escapeForDisplay("<script>alert('xss')</script>");
 * // "&lt;script&gt;alert('xss')&lt;/script&gt;"
 *
 * escapeForDisplay("مرحبا"); // "مرحبا" (Arabic preserved)
 * ```
 */
export function escapeForDisplay(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strip all control characters (including newlines and tabs)
 * Use with caution - removes all whitespace control characters
 *
 * @param text - Text with control characters
 * @returns Text without control characters
 *
 * @example
 * ```typescript
 * stripAllControlChars("text\nwith\tcontrols"); // "textwithcontrols"
 * ```
 */
export function stripAllControlChars(text: string): string {
  return text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
}

/**
 * Sanitize for database storage
 * Comprehensive sanitization for safe database insertion
 *
 * @param text - Text to sanitize
 * @returns Database-safe text
 *
 * @example
 * ```typescript
 * sanitizeForDatabase("أحمد\u202E\u200B"); // "أحمد" (clean)
 * ```
 */
export function sanitizeForDatabase(text: string): string {
  return sanitizeArabicInput(text, {
    aggressive: false, // Don't normalize variants in database
    removeAllZeroWidth: false, // Preserve legitimate ZWNJ/ZWJ
  });
}

/**
 * Sanitize for search/comparison
 * Aggressive normalization for fuzzy matching
 *
 * @param text - Text to sanitize
 * @returns Search-optimized text
 *
 * @example
 * ```typescript
 * sanitizeForSearch("أحمد مُحَمَّد"); // "احمد محمد"
 * ```
 */
export function sanitizeForSearch(text: string): string {
  let result = sanitizeArabicInput(text, {
    aggressive: true, // Normalize all variants
    removeAllZeroWidth: true, // Remove all zero-width
  });

  // Also normalize whitespace
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

/**
 * Sanitize user input from forms
 * Balanced sanitization for user-facing text
 *
 * @param text - User input text
 * @returns Form-safe text
 *
 * @example
 * ```typescript
 * sanitizeFormInput("  أحمد\u202E  "); // "أحمد"
 * ```
 */
export function sanitizeFormInput(text: string): string {
  let result = sanitizeArabicInput(text, {
    aggressive: false,
    removeAllZeroWidth: false,
  });

  // Trim whitespace
  result = result.trim();

  // Normalize excessive whitespace
  result = result.replace(/\s+/g, " ");

  return result;
}

/**
 * Sanitize filename for safe file system operations
 * Removes characters unsafe for filenames
 *
 * @param filename - Filename to sanitize
 * @returns Safe filename
 *
 * @example
 * ```typescript
 * sanitizeFilename("ملف<>محمد.txt"); // "ملف_محمد.txt"
 * ```
 */
export function sanitizeFilename(filename: string): string {
  let result = sanitizeArabicInput(filename, {
    aggressive: false,
    removeAllZeroWidth: true,
  });

  // Remove filesystem-unsafe characters
  result = result
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "");

  // Limit length (255 bytes is common filesystem limit)
  if (new Blob([result]).size > 255) {
    // Truncate safely
    let truncated = "";
    for (const char of result) {
      const test = truncated + char;
      if (new Blob([test]).size <= 255) {
        truncated = test;
      } else {
        break;
      }
    }
    result = truncated;
  }

  return result || "unnamed";
}

/**
 * Sanitize URL parameter value
 * Encodes special characters for safe URL usage
 *
 * @param value - Parameter value
 * @returns URL-safe value
 *
 * @example
 * ```typescript
 * sanitizeUrlParam("أحمد محمد"); // Encoded for URL
 * ```
 */
export function sanitizeUrlParam(value: string): string {
  const sanitized = sanitizeArabicInput(value, {
    aggressive: false,
    removeAllZeroWidth: true,
  });

  return encodeURIComponent(sanitized);
}

/**
 * Batch sanitize multiple texts
 * Useful for sanitizing arrays of user input
 *
 * @param texts - Array of texts to sanitize
 * @param options - Sanitization options
 * @returns Array of sanitized texts
 *
 * @example
 * ```typescript
 * const clean = batchSanitize(["أحمد\u202E", "محمد", "علي\u200B"]);
 * // ["أحمد", "محمد", "علي"]
 * ```
 */
export function batchSanitize(
  texts: string[],
  options: SanitizationOptions = {},
): string[] {
  return texts.map((text) => sanitizeArabicInput(text, options));
}

/**
 * Check if text needs sanitization
 * Quick check without actually sanitizing
 *
 * @param text - Text to check
 * @returns True if text contains threats that need sanitization
 *
 * @example
 * ```typescript
 * needsSanitization("مرحبا"); // false
 * needsSanitization("test\u202E"); // true
 * ```
 */
export function needsSanitization(text: string): boolean {
  BIDI_OVERRIDE_REGEX.lastIndex = 0;
  if (BIDI_OVERRIDE_REGEX.test(text)) return true;

  MALICIOUS_ZERO_WIDTH_REGEX.lastIndex = 0;
  if (MALICIOUS_ZERO_WIDTH_REGEX.test(text)) return true;

  SUSPICIOUS_CONTROL_REGEX.lastIndex = 0;
  if (SUSPICIOUS_CONTROL_REGEX.test(text)) return true;

  return false;
}

/**
 * Get sanitization report
 * Returns what would be removed without actually sanitizing
 *
 * @param text - Text to analyze
 * @returns Report of what would be sanitized
 *
 * @example
 * ```typescript
 * const report = getSanitizationReport("test\u202E\u200B");
 * console.log(report.bidiOverrides); // 1
 * console.log(report.zeroWidth); // 1
 * console.log(report.needsSanitization); // true
 * ```
 */
export function getSanitizationReport(text: string): {
  bidiOverrides: number;
  zeroWidth: number;
  controlChars: number;
  needsSanitization: boolean;
  preview: string;
} {
  const bidiOverrides = (text.match(BIDI_OVERRIDE_REGEX) || []).length;
  const zeroWidth = (text.match(MALICIOUS_ZERO_WIDTH_REGEX) || []).length;
  const controlChars = (text.match(SUSPICIOUS_CONTROL_REGEX) || []).length;

  const needsSanitization =
    bidiOverrides > 0 || zeroWidth > 0 || controlChars > 0;

  const preview = sanitizeArabicInput(text);

  return {
    bidiOverrides,
    zeroWidth,
    controlChars,
    needsSanitization,
    preview,
  };
}
