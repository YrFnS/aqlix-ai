/**
 * Arabic-aware string utilities
 * Provides accurate string measurement, truncation, and comparison
 * @module @iraqi-ai/arabic-nlp/strings
 */

import type {
  StringMeasurement,
  TruncateOptions,
  CompareOptions,
} from "./types/index.js";
import { isDiacritic } from "./characters.js";
import { normalizeArabic } from "./normalization.js";

/**
 * Measure string with Arabic-aware metrics
 * Provides accurate measurements considering diacritics and grapheme clusters
 *
 * @param text - Text to measure
 * @returns String measurement object with multiple metrics
 *
 * @example
 * ```typescript
 * const measurement = measureString("مُحَمَّد");
 * console.log(measurement.codepoints); // 7 (includes diacritics)
 * console.log(measurement.graphemes); // 4 (visual characters)
 * console.log(measurement.baseLetters); // 4 (excluding diacritics)
 * ```
 */
export function measureString(text: string): StringMeasurement {
  // Codepoints: Simple length
  const codepoints = Array.from(text).length;
  // Graphemes: Use Intl.Segmenter if available, fallback to manual count
  let graphemes = 0;
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as any).Segmenter("ar", {
      granularity: "grapheme",
    });
    graphemes = Array.from(segmenter.segment(text)).length;
  } else {
    // Fallback: Count characters excluding combining marks
    graphemes = countGraphemesFallback(text);
  }

  // Base letters: Count non-diacritic characters
  let baseLetters = 0;
  for (const char of text) {
    if (!isDiacritic(char) && !/\s/.test(char)) {
      baseLetters++;
    }
  }

  // Words: Split by whitespace
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  // Byte size: UTF-8 encoding
  const byteSize = new Blob([text]).size;

  return {
    codepoints,
    graphemes,
    baseLetters,
    words,
    byteSize,
  };
}

/**
 * Fallback grapheme counting for environments without Intl.Segmenter
 * Counts base characters (excluding combining marks)
 */
function countGraphemesFallback(text: string): number {
  let count = 0;

  for (const char of text) {
    const isCombining = isDiacritic(char);

    if (!isCombining) {
      count++;
    }
  }

  return count;
}

/**
 * Truncate Arabic text to maximum length (in graphemes)
 * Preserves complete grapheme clusters and optionally complete words
 *
 * @param text - Text to truncate
 * @param options - Truncation options or max length number
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * ```typescript
 * truncateArabic("مرحبا بكم في العراق", { maxLength: 10 });
 * // Returns "مرحبا بكم..."
 *
 * truncateArabic("مُحَمَّد أحمد", { maxLength: 5, preserveWords: true });
 * // Returns "مُحَمَّد..." (preserves complete word)
 * ```
 */
export function truncateArabic(
  text: string,
  options: TruncateOptions | number,
): string {
  // Normalize options
  const opts: TruncateOptions =
    typeof options === "number" ? { maxLength: options } : options;

  const { maxLength, ellipsis = "...", preserveWords = true } = opts;

  const measurement = measureString(text);

  // If text is already short enough, return as-is
  if (measurement.graphemes <= maxLength) {
    return text;
  }

  // Use Intl.Segmenter if available
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return truncateWithSegmenter(text, maxLength, ellipsis, preserveWords);
  }

  // Fallback: Manual truncation
  return truncateFallback(text, maxLength, ellipsis, preserveWords);
}

/**
 * Truncate using Intl.Segmenter (modern approach)
 */
function truncateWithSegmenter(
  text: string,
  maxLength: number,
  ellipsis: string,
  preserveWords: boolean,
): string {
  const segmenter = new (Intl as any).Segmenter("ar", {
    granularity: "grapheme",
  });
  const segments = Array.from(segmenter.segment(text));

  // Account for ellipsis length
  const targetLength = maxLength - ellipsis.length;
  if (targetLength <= 0) return ellipsis;

  let truncated = "";
  let count = 0;

  for (const segment of segments) {
    if (count >= targetLength) break;
    truncated += (segment as any).segment;
    count++;
  }

  // If preserving words, backtrack to last complete word
  if (preserveWords && count < segments.length) {
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }
  }

  return truncated.trimEnd() + ellipsis;
}

/**
 * Fallback truncation without Intl.Segmenter
 */
function truncateFallback(
  text: string,
  maxLength: number,
  ellipsis: string,
  preserveWords: boolean,
): string {
  const targetLength = maxLength - ellipsis.length;
  if (targetLength <= 0) return ellipsis;

  let truncated = "";
  let count = 0;

  for (const char of text) {
    if (count >= targetLength) break;

    truncated += char;

    // Only count non-diacritic characters
    if (!isDiacritic(char)) {
      count++;
    }
  }

  // If preserving words, backtrack to last complete word
  if (preserveWords) {
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }
  }

  return truncated.trimEnd() + ellipsis;
}

/**
 * Reverse Arabic text while preserving grapheme clusters
 * Handles diacritics correctly by keeping them attached to base letters
 *
 * @param text - Text to reverse
 * @returns Reversed text with diacritics properly attached
 *
 * @example
 * ```typescript
 * reverseArabic("أحمد"); // Returns "دمحأ"
 * reverseArabic("مُحَمَّد"); // Preserves diacritic attachment
 * ```
 */
export function reverseArabic(text: string): string {
  // Use Intl.Segmenter if available
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as any).Segmenter("ar", {
      granularity: "grapheme",
    });
    const segments = Array.from(segmenter.segment(text));
    return segments
      .map((s: any) => s.segment)
      .reverse()
      .join("");
  }

  // Fallback: Manual reversal with diacritic handling
  return reverseWithDiacritics(text);
}

/**
 * Reverse text manually while keeping diacritics with their base letters
 */
function reverseWithDiacritics(text: string): string {
  const graphemes: string[] = [];
  let currentGrapheme = "";

  for (const char of text) {
    if (isDiacritic(char)) {
      // Attach diacritic to current grapheme
      currentGrapheme += char;
    } else {
      // Start new grapheme
      if (currentGrapheme) {
        graphemes.push(currentGrapheme);
      }
      currentGrapheme = char;
    }
  }

  // Don't forget the last grapheme
  if (currentGrapheme) {
    graphemes.push(currentGrapheme);
  }

  return graphemes.reverse().join("");
}

/**
 * Compare two Arabic strings with normalization
 * Uses Arabic locale for proper collation
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Comparison options
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 *
 * @example
 * ```typescript
 * compareArabicStrings("أحمد", "محمد"); // -1
 * compareArabicStrings("أحمد", "أحمد"); // 0
 * compareArabicStrings("محمد", "أحمد"); // 1
 * ```
 */
export function compareArabicStrings(
  a: string,
  b: string,
  options: CompareOptions = {},
): number {
  const { normalize = true, caseSensitive = false, locale = "ar" } = options;

  let str1 = a;
  let str2 = b;

  // Normalize if requested
  if (normalize) {
    str1 = normalizeArabic(str1, {
      removeDiacritics: false,
      normalizeVariants: true,
    }).text;
    str2 = normalizeArabic(str2, {
      removeDiacritics: false,
      normalizeVariants: true,
    }).text;
  }

  // Use localeCompare with Arabic locale
  const result = str1.localeCompare(str2, locale, {
    sensitivity: caseSensitive ? "case" : "base",
  });

  // Normalize result to -1, 0, or 1
  return result < 0 ? -1 : result > 0 ? 1 : 0;
}

/**
 * Get the display length of Arabic text (visual width)
 * Useful for aligning text in monospace displays
 *
 * @param text - Text to measure
 * @returns Visual display length
 *
 * @example
 * ```typescript
 * getDisplayLength("مرحبا"); // 5 (5 base letters)
 * getDisplayLength("مُحَمَّد"); // 4 (4 base letters, diacritics don't add width)
 * ```
 */
export function getDisplayLength(text: string): number {
  return measureString(text).baseLetters;
}

/**
 * Pad Arabic text to a specific length
 * Accounts for visual display length, not codepoint count
 *
 * @param text - Text to pad
 * @param targetLength - Target display length
 * @param padChar - Character to use for padding (default: space)
 * @param padStart - Pad at start (true) or end (false)
 * @returns Padded text
 *
 * @example
 * ```typescript
 * padArabic("أحمد", 10); // "أحمد      " (pad at end)
 * padArabic("أحمد", 10, " ", true); // "      أحمد" (pad at start)
 * ```
 */
export function padArabic(
  text: string,
  targetLength: number,
  padChar = " ",
  padStart = false,
): string {
  const currentLength = getDisplayLength(text);
  if (currentLength >= targetLength) return text;

  const padding = padChar.repeat(targetLength - currentLength);
  return padStart ? padding + text : text + padding;
}

/**
 * Wrap Arabic text to fit within a maximum line length
 * Preserves complete words and respects RTL text direction
 *
 * @param text - Text to wrap
 * @param maxLength - Maximum characters per line
 * @returns Array of wrapped lines
 *
 * @example
 * ```typescript
 * const lines = wrapArabicText("مرحبا بكم في نظام الذكاء", 10);
 * // ["مرحبا بكم", "في نظام", "الذكاء"]
 * ```
 */
export function wrapArabicText(text: string, maxLength: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const wordLength = getDisplayLength(word);

    // If adding this word would exceed max length, start new line
    if (
      currentLine &&
      getDisplayLength(currentLine) + wordLength + 1 > maxLength
    ) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }

  // Don't forget the last line
  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines;
}

/**
 * Extract initials from Arabic name
 * Useful for avatars and abbreviations
 *
 * @param name - Arabic name
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials string
 *
 * @example
 * ```typescript
 * getInitials("أحمد محمد علي"); // "أم"
 * getInitials("محمد", 1); // "م"
 * ```
 */
export function getInitials(name: string, maxInitials = 2): string {
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, maxInitials)
    .map((word) => {
      // Get first non-diacritic character
      for (const char of word) {
        if (!isDiacritic(char)) {
          return char;
        }
      }
      return "";
    })
    .join("");

  return initials;
}

/**
 * Check if two Arabic strings are equal after normalization
 * Useful for fuzzy matching and search
 *
 * @param a - First string
 * @param b - Second string
 * @param ignoreDiacritics - Whether to ignore diacritics in comparison
 * @returns True if strings are equal after normalization
 *
 * @example
 * ```typescript
 * areEqual("أحمد", "احمد", true); // true (ignoring diacritics)
 * areEqual("مُحَمَّد", "محمد", true); // true
 * areEqual("أحمد", "محمد"); // false
 * ```
 */
export function areEqual(
  a: string,
  b: string,
  ignoreDiacritics = false,
): boolean {
  const normalized1 = normalizeArabic(a, {
    removeDiacritics: ignoreDiacritics,
    normalizeVariants: true,
  }).text;

  const normalized2 = normalizeArabic(b, {
    removeDiacritics: ignoreDiacritics,
    normalizeVariants: true,
  }).text;

  return normalized1 === normalized2;
}
