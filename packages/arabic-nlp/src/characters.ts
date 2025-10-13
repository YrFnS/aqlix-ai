/**
 * Character classification and detection utilities for Arabic text
 * @module @iraqi-ai/arabic-nlp/characters
 */

import type { CharacterInfo, CharacterCategory } from "./types/index.js";
import {
  ARABIC_REGEX,
  IRAQI_KURDISH_CHARS,
  ARABIC_INDIC_DIGITS,
  EXTENDED_ARABIC_INDIC_DIGITS,
  ARABIC_PUNCTUATION,
} from "./constants/unicode-ranges.js";
import { isDiacritic as isDiacriticConstant } from "./constants/diacritics.js";

/**
 * Check if a character is an Arabic character
 * Tests against all Arabic Unicode blocks
 *
 * @param char - Single character to test
 * @returns True if the character is Arabic
 *
 * @example
 * ```typescript
 * isArabicCharacter("أ"); // true
 * isArabicCharacter("a"); // false
 * isArabicCharacter("١"); // true (Arabic-Indic digit)
 * isArabicCharacter("چ"); // true (Iraqi Kurdish)
 * ```
 */
export function isArabicCharacter(char: string): boolean {
  if (char.length === 0) return false;
  return ARABIC_REGEX.test(char);
}

/**
 * Check if a character is an Iraqi Kurdish character
 * Tests for چ (che), گ (gaf), ڤ (veh), ژ (zhe)
 *
 * @param char - Single character to test
 * @returns True if the character is an Iraqi Kurdish character
 *
 * @example
 * ```typescript
 * isIraqiKurdishChar("چ"); // true
 * isIraqiKurdishChar("گ"); // true
 * isIraqiKurdishChar("ڤ"); // true
 * isIraqiKurdishChar("ژ"); // true
 * isIraqiKurdishChar("ا"); // false
 * ```
 */
export function isIraqiKurdishChar(char: string): boolean {
  if (char.length === 0) return false;
  return IRAQI_KURDISH_CHARS.regex.test(char);
}

/**
 * Check if a character is a diacritic mark
 * Tests for combining marks and Arabic diacritics
 *
 * @param char - Single character to test
 * @returns True if the character is a diacritic
 *
 * @example
 * ```typescript
 * isDiacritic("َ"); // true (fatha)
 * isDiacritic("ّ"); // true (shadda)
 * isDiacritic("ا"); // false (base letter)
 * ```
 */
export function isDiacritic(char: string): boolean {
  return isDiacriticConstant(char);
}

/**
 * Check if a character is an Arabic digit
 * Includes both Arabic-Indic (٠-٩) and Extended Arabic-Indic (۰-۹)
 *
 * @param char - Single character to test
 * @returns True if the character is an Arabic digit
 *
 * @example
 * ```typescript
 * isArabicDigit("٥"); // true (Arabic-Indic 5)
 * isArabicDigit("۹"); // true (Extended Arabic-Indic 9)
 * isArabicDigit("5"); // false (Latin digit)
 * ```
 */
export function isArabicDigit(char: string): boolean {
  if (char.length === 0) return false;
  return (
    ARABIC_INDIC_DIGITS.regex.test(char) ||
    EXTENDED_ARABIC_INDIC_DIGITS.regex.test(char)
  );
}

/**
 * Check if a character is Arabic punctuation
 *
 * @param char - Single character to test
 * @returns True if the character is Arabic punctuation
 *
 * @example
 * ```typescript
 * isArabicPunctuation("،"); // true (Arabic comma)
 * isArabicPunctuation("؟"); // true (Arabic question mark)
 * isArabicPunctuation("."); // false (Latin period)
 * ```
 */
export function isArabicPunctuation(char: string): boolean {
  if (char.length === 0) return false;
  return ARABIC_PUNCTUATION.regex.test(char);
}

/**
 * Check if a character is whitespace
 *
 * @param char - Single character to test
 * @returns True if the character is whitespace
 */
export function isWhitespace(char: string): boolean {
  if (char.length === 0) return false;
  return /\s/.test(char);
}

/**
 * Check if a character is a control character
 *
 * @param char - Single character to test
 * @returns True if the character is a control character
 */
export function isControlChar(char: string): boolean {
  if (char.length === 0) return false;
  const code = char.codePointAt(0);
  if (code === undefined) return false;

  // C0 controls (U+0000..U+001F) and DEL (U+007F)
  if (code <= 0x001f || code === 0x007f) return true;

  // C1 controls (U+0080..U+009F)
  if (code >= 0x0080 && code <= 0x009f) return true;

  return false;
}

/**
 * Classify a character into a category
 *
 * @param char - Single character to classify
 * @returns Character category
 *
 * @example
 * ```typescript
 * classifyCharacter("أ"); // "letter"
 * classifyCharacter("َ"); // "diacritic"
 * classifyCharacter("٥"); // "number"
 * classifyCharacter("،"); // "punctuation"
 * classifyCharacter(" "); // "space"
 * ```
 */
export function classifyCharacter(char: string): CharacterCategory {
  if (char.length === 0) return "other";

  // Check in order of specificity
  if (isDiacritic(char)) return "diacritic";
  if (isWhitespace(char)) return "space";
  if (isControlChar(char)) return "control";
  if (isArabicDigit(char)) return "number";
  if (isArabicPunctuation(char)) return "punctuation";
  if (isArabicCharacter(char)) return "letter";

  return "other";
}

/**
 * Get comprehensive information about a character
 *
 * @param char - Single character to analyze
 * @returns Character information object
 *
 * @example
 * ```typescript
 * const info = getCharacterInfo("چ");
 * console.log(info.codepoint); // "U+0686"
 * console.log(info.category); // "letter"
 * console.log(info.isIraqiKurdish); // true
 * ```
 */
export function getCharacterInfo(char: string): CharacterInfo {
  const codepoint = char.codePointAt(0);
  const codepointStr =
    codepoint !== undefined
      ? `U+${codepoint.toString(16).toUpperCase().padStart(4, "0")}`
      : "U+0000";

  return {
    char,
    codepoint: codepointStr,
    category: classifyCharacter(char),
    isArabic: isArabicCharacter(char),
    isDiacritic: isDiacritic(char),
    isIraqiKurdish: isIraqiKurdishChar(char),
  };
}

/**
 * Get the Unicode codepoint of a character as a string
 *
 * @param char - Single character
 * @returns Codepoint in U+XXXX format
 *
 * @example
 * ```typescript
 * getCodepoint("أ"); // "U+0623"
 * getCodepoint("چ"); // "U+0686"
 * ```
 */
export function getCodepoint(char: string): string {
  const codepoint = char.codePointAt(0);
  return codepoint !== undefined
    ? `U+${codepoint.toString(16).toUpperCase().padStart(4, "0")}`
    : "U+0000";
}

/**
 * Get the Unicode codepoint as a number
 *
 * @param char - Single character
 * @returns Codepoint as number
 *
 * @example
 * ```typescript
 * getCodepointNumber("أ"); // 1571 (0x0623)
 * ```
 */
export function getCodepointNumber(char: string): number {
  return char.codePointAt(0) ?? 0;
}

/**
 * Convert a codepoint number to a character
 *
 * @param codepoint - Unicode codepoint number
 * @returns Character
 *
 * @example
 * ```typescript
 * fromCodepoint(0x0623); // "أ"
 * fromCodepoint(1571); // "أ"
 * ```
 */
export function fromCodepoint(codepoint: number): string {
  return String.fromCodePoint(codepoint);
}

/**
 * Get all characters in a text with their information
 *
 * @param text - Text to analyze
 * @returns Array of character information objects
 *
 * @example
 * ```typescript
 * const chars = getCharacters("أحمد");
 * console.log(chars.length); // 4
 * console.log(chars[0].char); // "أ"
 * console.log(chars[0].category); // "letter"
 * ```
 */
export function getCharacters(text: string): CharacterInfo[] {
  const chars: CharacterInfo[] = [];

  for (const char of text) {
    chars.push(getCharacterInfo(char));
  }

  return chars;
}

/**
 * Filter characters by category
 *
 * @param text - Text to filter
 * @param category - Category to filter by
 * @returns Array of characters matching the category
 *
 * @example
 * ```typescript
 * const text = "أحمد ٥";
 * filterByCategory(text, "letter"); // ["أ", "ح", "م", "د"]
 * filterByCategory(text, "number"); // ["٥"]
 * filterByCategory(text, "space"); // [" "]
 * ```
 */
export function filterByCategory(
  text: string,
  category: CharacterCategory,
): string[] {
  const result: string[] = [];

  for (const char of text) {
    if (classifyCharacter(char) === category) {
      result.push(char);
    }
  }

  return result;
}

/**
 * Count characters by category
 *
 * @param text - Text to analyze
 * @returns Object with counts for each category
 *
 * @example
 * ```typescript
 * const counts = countByCategory("أحمد ٥");
 * // { letter: 4, number: 1, space: 1, diacritic: 0, ... }
 * ```
 */
export function countByCategory(
  text: string,
): Record<CharacterCategory, number> {
  const counts: Record<CharacterCategory, number> = {
    letter: 0,
    diacritic: 0,
    number: 0,
    punctuation: 0,
    space: 0,
    control: 0,
    other: 0,
  };

  for (const char of text) {
    const category = classifyCharacter(char);
    counts[category]++;
  }

  return counts;
}

/**
 * Get all Arabic letters from text (excludes diacritics, numbers, etc.)
 *
 * @param text - Text to extract letters from
 * @returns Array of Arabic letters
 *
 * @example
 * ```typescript
 * getArabicLetters("أحمد ٥ ،"); // ["أ", "ح", "م", "د"]
 * getArabicLetters("مُحَمَّد"); // ["م", "ح", "م", "د"]
 * ```
 */
export function getArabicLetters(text: string): string[] {
  return filterByCategory(text, "letter");
}

/**
 * Get all diacritics from text
 *
 * @param text - Text to extract diacritics from
 * @returns Array of diacritic marks
 *
 * @example
 * ```typescript
 * getDiacritics("مُحَمَّد"); // ["ُ", "َ", "َّ"]
 * ```
 */
export function getDiacritics(text: string): string[] {
  return filterByCategory(text, "diacritic");
}

/**
 * Check if text contains any Arabic characters
 *
 * @param text - Text to check
 * @returns True if text contains at least one Arabic character
 *
 * @example
 * ```typescript
 * hasArabicCharacters("Hello أحمد"); // true
 * hasArabicCharacters("Hello World"); // false
 * ```
 */
export function hasArabicCharacters(text: string): boolean {
  return ARABIC_REGEX.test(text);
}

/**
 * Check if text contains only Arabic characters (and whitespace/punctuation)
 *
 * @param text - Text to check
 * @returns True if text is all Arabic
 *
 * @example
 * ```typescript
 * isAllArabic("أحمد محمد"); // true
 * isAllArabic("أحمد Ahmed"); // false
 * ```
 */
export function isAllArabic(text: string): boolean {
  if (text.length === 0) return false;

  for (const char of text) {
    const category = classifyCharacter(char);
    // Allow Arabic letters, diacritics, numbers, punctuation, and whitespace
    if (
      category !== "letter" &&
      category !== "diacritic" &&
      category !== "number" &&
      category !== "punctuation" &&
      category !== "space"
    ) {
      // If it's not one of these, check if it's at least Arabic
      if (!isArabicCharacter(char)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get the percentage of Arabic characters in text
 *
 * @param text - Text to analyze
 * @returns Percentage (0-100) of Arabic characters
 *
 * @example
 * ```typescript
 * getArabicPercentage("أحمد Ahmed"); // ~50
 * getArabicPercentage("أحمد"); // 100
 * ```
 */
export function getArabicPercentage(text: string): number {
  if (text.length === 0) return 0;

  let arabicCount = 0;
  let totalCount = 0;

  for (const char of text) {
    // Skip whitespace in count
    if (!isWhitespace(char)) {
      totalCount++;
      if (isArabicCharacter(char)) {
        arabicCount++;
      }
    }
  }

  if (totalCount === 0) return 0;
  return (arabicCount / totalCount) * 100;
}

/**
 * Check if text contains mixed Arabic-Latin content
 *
 * @param text - Text to check
 * @returns True if text contains both Arabic and Latin characters
 *
 * @example
 * ```typescript
 * isMixedContent("أحمد Ahmed"); // true
 * isMixedContent("أحمد محمد"); // false
 * isMixedContent("Ahmed"); // false
 * ```
 */
export function isMixedContent(text: string): boolean {
  const hasArabic = hasArabicCharacters(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  return hasArabic && hasLatin;
}
