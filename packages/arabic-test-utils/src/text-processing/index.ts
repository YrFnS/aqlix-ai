/**
 * Arabic text processing utilities for testing
 * Provides normalization, validation, and extraction of Arabic text
 */

export interface ArabicTextValidation {
  isValid: boolean;
  hasArabicCharacters: boolean;
  arabicPercentage: number;
  hasDiacritics: boolean;
  hasProperUnicode: boolean;
  violations: string[];
}

export interface ArabicTextInfo {
  totalCharacters: number;
  arabicCharacters: number;
  arabicPercentage: number;
  words: string[];
  hasRTLMarks: boolean;
  hasDiacritics: boolean;
  unicodeBlocks: string[];
}

/**
 * Arabic Unicode ranges
 */
export const ARABIC_UNICODE_RANGES = {
  basic: /[\u0600-\u06ff]/g, // Arabic (basic)
  supplement: /[\u0750-\u077f]/g, // Arabic Supplement
  extendedA: /[\u08a0-\u08ff]/g, // Arabic Extended-A
  presentationForms: /[\ufb50-\ufdff\ufe70-\ufeff]/g, // Arabic Presentation Forms
  diacritics: /[\u064b-\u065f\u0670]/g, // Arabic diacritical marks
};

/**
 * Combined Arabic character regex
 */
export const ARABIC_CHAR_REGEX =
  /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/g;

/**
 * Arabic diacritics (tashkeel) regex
 */
export const ARABIC_DIACRITICS_REGEX = /[\u064b-\u065f\u0670]/g;

/**
 * Normalizes Arabic text by removing diacritics and normalizing character forms
 *
 * @example
 * ```typescript
 * const normalized = normalizeArabicText("مَرْحَباً");
 * console.log(normalized); // "مرحبا"
 * ```
 */
export function normalizeArabicText(text: string): string {
  let normalized = text;

  // Remove Arabic diacritics (tashkeel)
  normalized = normalized.replace(ARABIC_DIACRITICS_REGEX, "");

  // Normalize Arabic letters
  normalized = normalized
    // Normalize Alef variations to basic Alef
    .replace(/[أإآ]/g, "ا")
    // Normalize Taa Marbuta to Haa
    .replace(/ة/g, "ه")
    // Normalize Hamza variations
    .replace(/[ؤئ]/g, "ء")
    // Normalize Yaa variations
    .replace(/ى/g, "ي")
    // Remove Tatweel (elongation)
    .replace(/ـ/g, "");

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * Validates Arabic text structure and Unicode correctness
 *
 * @example
 * ```typescript
 * const isValid = validateArabicText("السلام عليكم");
 * console.log(isValid); // true
 * ```
 */
export function validateArabicText(text: string): boolean {
  const validation = getArabicTextValidation(text);
  return validation.isValid;
}

/**
 * Gets detailed Arabic text validation results
 *
 * @example
 * ```typescript
 * const validation = getArabicTextValidation("مرحباً");
 * console.log(validation.arabicPercentage); // 1.0
 * console.log(validation.hasDiacritics); // true
 * ```
 */
export function getArabicTextValidation(text: string): ArabicTextValidation {
  const violations: string[] = [];

  // Check if text has Arabic characters
  const hasArabicCharacters = ARABIC_CHAR_REGEX.test(text);
  if (!hasArabicCharacters) {
    violations.push("Text does not contain Arabic characters");
  }

  // Calculate Arabic percentage
  const arabicMatches = text.match(ARABIC_CHAR_REGEX);
  const arabicCount = arabicMatches ? arabicMatches.length : 0;
  const totalChars = text.length;
  const arabicPercentage = totalChars > 0 ? arabicCount / totalChars : 0;

  // Check for diacritics
  const hasDiacritics = ARABIC_DIACRITICS_REGEX.test(text);

  // Check for proper Unicode (no mojibake or encoding issues)
  const hasProperUnicode = !text.includes("�") && !text.includes("?");
  if (!hasProperUnicode) {
    violations.push("Text contains invalid Unicode characters");
  }

  // Check for suspicious patterns (encoding issues)
  const hasSuspiciousPatterns = /[Ã�âˆš]/g.test(text);
  if (hasSuspiciousPatterns) {
    violations.push("Text may have encoding issues");
  }

  const isValid =
    hasArabicCharacters && hasProperUnicode && !hasSuspiciousPatterns;

  return {
    isValid,
    hasArabicCharacters,
    arabicPercentage,
    hasDiacritics,
    hasProperUnicode,
    violations,
  };
}

/**
 * Extracts Arabic words from mixed Arabic-English text
 *
 * @example
 * ```typescript
 * const words = extractArabicWords("Hello مرحبا World سلام");
 * console.log(words); // ["مرحبا", "سلام"]
 * ```
 */
export function extractArabicWords(text: string): string[] {
  const words: string[] = [];

  // Split by whitespace
  const tokens = text.split(/\s+/);

  for (const token of tokens) {
    // Check if token contains Arabic characters
    if (ARABIC_CHAR_REGEX.test(token)) {
      // Remove non-Arabic characters from edges
      const cleaned = token.replace(
        /^[^\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]+|[^\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]+$/g,
        "",
      );
      if (cleaned) {
        words.push(cleaned);
      }
    }
  }

  return words;
}

/**
 * Gets detailed information about Arabic text
 *
 * @example
 * ```typescript
 * const info = getArabicTextInfo("مرحباً بك في العراق");
 * console.log(info.arabicPercentage); // 1.0
 * console.log(info.words); // ["مرحباً", "بك", "في", "العراق"]
 * ```
 */
export function getArabicTextInfo(text: string): ArabicTextInfo {
  const arabicMatches = text.match(ARABIC_CHAR_REGEX);
  const arabicCharacters = arabicMatches ? arabicMatches.length : 0;
  const totalCharacters = text.length;
  const arabicPercentage =
    totalCharacters > 0 ? arabicCharacters / totalCharacters : 0;

  const words = extractArabicWords(text);
  const hasRTLMarks = /[\u200f\u202b\u202e]/g.test(text); // RTL marks
  const hasDiacritics = ARABIC_DIACRITICS_REGEX.test(text);

  // Detect Unicode blocks
  const unicodeBlocks: string[] = [];
  if (ARABIC_UNICODE_RANGES.basic.test(text)) unicodeBlocks.push("Arabic");
  if (ARABIC_UNICODE_RANGES.supplement.test(text))
    unicodeBlocks.push("Arabic Supplement");
  if (ARABIC_UNICODE_RANGES.extendedA.test(text))
    unicodeBlocks.push("Arabic Extended-A");
  if (ARABIC_UNICODE_RANGES.presentationForms.test(text))
    unicodeBlocks.push("Arabic Presentation Forms");

  return {
    totalCharacters,
    arabicCharacters,
    arabicPercentage,
    words,
    hasRTLMarks,
    hasDiacritics,
    unicodeBlocks,
  };
}

/**
 * Removes all diacritics from Arabic text
 *
 * @example
 * ```typescript
 * const text = removeDiacritics("مُحَمَّد");
 * console.log(text); // "محمد"
 * ```
 */
export function removeDiacritics(text: string): string {
  return text.replace(ARABIC_DIACRITICS_REGEX, "");
}

/**
 * Checks if text is purely Arabic (no Latin characters)
 */
export function isPureArabic(text: string): boolean {
  const withoutWhitespace = text.replace(/\s+/g, "");
  const arabicMatches = withoutWhitespace.match(ARABIC_CHAR_REGEX);
  const arabicCount = arabicMatches ? arabicMatches.length : 0;
  return (
    arabicCount === withoutWhitespace.length && withoutWhitespace.length > 0
  );
}

/**
 * Checks if text is mixed Arabic-English
 */
export function isMixedArabicEnglish(text: string): boolean {
  const hasArabic = ARABIC_CHAR_REGEX.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  return hasArabic && hasLatin;
}

/**
 * Asserts that text is valid Arabic
 * Throws error if validation fails
 */
export function assertValidArabicText(text: string): void {
  const validation = getArabicTextValidation(text);

  if (!validation.isValid) {
    const violations = validation.violations.join("\n  - ");
    throw new Error(`Invalid Arabic text:\n  - ${violations}`);
  }

  if (!validation.hasArabicCharacters) {
    throw new Error("Text does not contain Arabic characters");
  }
}

/**
 * Asserts that text has minimum Arabic percentage
 */
export function assertMinimumArabicPercentage(
  text: string,
  minPercentage: number = 0.5,
): void {
  const validation = getArabicTextValidation(text);

  if (validation.arabicPercentage < minPercentage) {
    throw new Error(
      `Arabic percentage ${(validation.arabicPercentage * 100).toFixed(0)}% below threshold ${(minPercentage * 100).toFixed(0)}%`,
    );
  }
}

/**
 * Counts Arabic words in text
 */
export function countArabicWords(text: string): number {
  return extractArabicWords(text).length;
}

/**
 * Gets the first N Arabic words from text
 */
export function getFirstArabicWords(text: string, count: number): string[] {
  const words = extractArabicWords(text);
  return words.slice(0, count);
}

/**
 * Removes Arabic diacritics from text (alias for removeDiacritics)
 */
export function removeArabicDiacritics(text: string): string {
  return removeDiacritics(text);
}

/**
 * Converts Western Arabic numerals (0-9) to Eastern Arabic numerals (٠-٩)
 */
export function convertToArabicNumerals(text: string): string {
  const numeralMap: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
  };

  return text.replace(/[0-9]/g, (digit) => numeralMap[digit] || digit);
}

/**
 * Validates Arabic text encoding
 */
export function validateArabicEncoding(text: string): {
  isValid: boolean;
  encoding: string;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for mojibake or encoding issues
  const hasMojibake = /[Ã�âˆš]/.test(text);
  if (hasMojibake) {
    issues.push("Text contains mojibake (encoding corruption)");
  }

  // Check for replacement characters
  const hasReplacementChars = /�/.test(text);
  if (hasReplacementChars) {
    issues.push("Text contains Unicode replacement characters");
  }

  // Check for proper Arabic Unicode ranges
  const hasValidArabic = ARABIC_CHAR_REGEX.test(text);
  if (!hasValidArabic && text.trim().length > 0) {
    issues.push("Text does not contain valid Arabic Unicode characters");
  }

  return {
    isValid: issues.length === 0 && hasValidArabic,
    encoding: "utf-8",
    issues,
  };
}
