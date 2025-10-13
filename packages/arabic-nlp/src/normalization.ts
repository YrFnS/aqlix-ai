/**
 * Arabic text normalization utilities
 * Provides Unicode normalization, diacritic removal, and character variant handling
 * @module @iraqi-ai/arabic-nlp/normalization
 */

import type {
  ArabicNormalizationOptions,
  NormalizationResult,
} from "./types/index.js";
import {
  DIACRITICS_REGEX,
  TATWEEL_REGEX,
  ZERO_WIDTH_REGEX,
} from "./constants/diacritics.js";
import {
  ALL_VARIANTS,
  ALEF_VARIANTS,
  YEH_VARIANTS,
  HEH_VARIANTS,
  WAW_VARIANTS,
} from "./constants/character-variants.js";
import { IRAQI_KURDISH_CHARS } from "./constants/unicode-ranges.js";

/**
 * Normalize Arabic text with comprehensive options
 * Applies Unicode normalization, diacritic removal, character variants, and more
 *
 * @param text - The text to normalize
 * @param options - Normalization options
 * @returns Normalization result with metadata
 *
 * @example
 * ```typescript
 * const result = normalizeArabic("مُحَمَّد", { removeDiacritics: true });
 * console.log(result.text); // "محمد"
 * console.log(result.processingTime); // <5ms
 * ```
 */
export function normalizeArabic(
  text: string,
  options: ArabicNormalizationOptions = {},
): NormalizationResult {
  const startTime = performance.now();
  const original = text;
  let result = text;
  let changeCount = 0;

  // STEP 1: Unicode normalization (default NFC for storage)
  const form = options.form || "NFC";
  const normalized = result.normalize(form);
  if (normalized !== result) {
    changeCount++;
    result = normalized;
  }

  // STEP 2: Remove diacritics if requested
  if (options.removeDiacritics) {
    const noDiacritics = removeDiacritics(result);
    if (noDiacritics !== result) {
      changeCount++;
      result = noDiacritics;
    }
  }

  // STEP 3: Normalize character variants (default: true)
  if (options.normalizeVariants !== false) {
    const variantNormalized = normalizeCharacterVariants(result);
    if (variantNormalized !== result) {
      changeCount++;
      result = variantNormalized;
    }
  }

  // STEP 4: Remove tatweel (kashida) if requested
  if (options.removeTatweel) {
    const noTatweel = removeTatweel(result);
    if (noTatweel !== result) {
      changeCount++;
      result = noTatweel;
    }
  }

  // STEP 5: Remove zero-width characters if requested (default: true)
  if (options.removeZeroWidth !== false) {
    const noZeroWidth = result.replace(ZERO_WIDTH_REGEX, "");
    if (noZeroWidth !== result) {
      changeCount++;
      result = noZeroWidth;
    }
  }

  // CRITICAL: Verify Iraqi Kurdish characters preserved
  if (options.preserveIraqiChars !== false) {
    const originalKurdish = (original.match(IRAQI_KURDISH_CHARS.regex) || [])
      .length;
    const resultKurdish = (result.match(IRAQI_KURDISH_CHARS.regex) || [])
      .length;

    if (originalKurdish !== resultKurdish) {
      throw new Error(
        `Iraqi Kurdish character lost during normalization. Original: ${originalKurdish}, Result: ${resultKurdish}`,
      );
    }
  }

  const processingTime = performance.now() - startTime;

  return {
    text: result,
    original,
    modified: result !== original,
    changeCount,
    processingTime,
  };
}

/**
 * Remove Arabic diacritical marks from text
 * Uses NFD decomposition to separate diacritics, then removes them
 *
 * @param text - Text with diacritics
 * @returns Text without diacritics
 *
 * @example
 * ```typescript
 * removeDiacritics("مُحَمَّد"); // Returns "محمد"
 * removeDiacritics("الْحَمْدُ لِلَّهِ"); // Returns "الحمد لله"
 * ```
 */
export function removeDiacritics(text: string): string {
  // Step 1: Decompose to NFD form to separate diacritics from base characters
  const nfd = text.normalize("NFD");

  // Step 2: Remove diacritical marks using regex
  const noDiacritics = nfd.replace(DIACRITICS_REGEX, "");

  // Step 3: Re-compose to NFC form for storage
  return noDiacritics.normalize("NFC");
}

/**
 * Normalize Arabic character variants to their canonical forms
 * Maps variants like أ, إ, آ → ا
 *
 * @param text - Text with character variants
 * @returns Text with normalized characters
 *
 * @example
 * ```typescript
 * normalizeCharacterVariants("أحمد إبراهيم"); // Returns "احمد ابراهيم"
 * normalizeCharacterVariants("مُحَمَّد"); // Returns "محمد" (alef variants normalized)
 * ```
 */
export function normalizeCharacterVariants(text: string): string {
  let result = text;

  // Apply all variant mappings
  for (const [variant, base] of ALL_VARIANTS) {
    if (result.includes(variant)) {
      result = result.replace(new RegExp(variant, "g"), base);
    }
  }

  return result;
}

/**
 * Normalize specific Alef variants only
 * Useful when you want fine-grained control over normalization
 *
 * @param text - Text with Alef variants
 * @returns Text with normalized Alef characters
 *
 * @example
 * ```typescript
 * normalizeAlefVariants("أحمد"); // Returns "احمد"
 * normalizeAlefVariants("آمن"); // Returns "امن"
 * ```
 */
export function normalizeAlefVariants(text: string): string {
  let result = text;

  for (const [variant, base] of ALEF_VARIANTS) {
    if (result.includes(variant)) {
      result = result.replace(new RegExp(variant, "g"), base);
    }
  }

  return result;
}

/**
 * Normalize Yeh variants
 *
 * @param text - Text with Yeh variants
 * @returns Text with normalized Yeh characters
 *
 * @example
 * ```typescript
 * normalizeYehVariants("على"); // Returns "علي"
 * ```
 */
export function normalizeYehVariants(text: string): string {
  let result = text;

  for (const [variant, base] of YEH_VARIANTS) {
    if (result.includes(variant)) {
      result = result.replace(new RegExp(variant, "g"), base);
    }
  }

  return result;
}

/**
 * Normalize Heh variants (including Teh Marbuta)
 *
 * @param text - Text with Heh variants
 * @returns Text with normalized Heh characters
 *
 * @example
 * ```typescript
 * normalizeHehVariants("مدرسة"); // Returns "مدرسه"
 * ```
 */
export function normalizeHehVariants(text: string): string {
  let result = text;

  for (const [variant, base] of HEH_VARIANTS) {
    if (result.includes(variant)) {
      result = result.replace(new RegExp(variant, "g"), base);
    }
  }

  return result;
}

/**
 * Normalize Waw variants
 *
 * @param text - Text with Waw variants
 * @returns Text with normalized Waw characters
 *
 * @example
 * ```typescript
 * normalizeWawVariants("سؤال"); // Returns "سوال"
 * ```
 */
export function normalizeWawVariants(text: string): string {
  let result = text;

  for (const [variant, base] of WAW_VARIANTS) {
    if (result.includes(variant)) {
      result = result.replace(new RegExp(variant, "g"), base);
    }
  }

  return result;
}

/**
 * Remove tatweel (kashida) characters from text
 * Tatweel (ـ U+0640) is used for text justification but has no semantic meaning
 *
 * @param text - Text with tatweel characters
 * @returns Text without tatweel
 *
 * @example
 * ```typescript
 * removeTatweel("مـحـمـد"); // Returns "محمد"
 * removeTatweel("العــــربية"); // Returns "العربية"
 * ```
 */
export function removeTatweel(text: string): string {
  return text.replace(TATWEEL_REGEX, "");
}

/**
 * Remove all zero-width characters from text
 * Includes ZWSP, ZWNJ, ZWJ, BOM, etc.
 *
 * @param text - Text with zero-width characters
 * @returns Text without zero-width characters
 *
 * @example
 * ```typescript
 * removeZeroWidthChars("text\u200Bwith\u200Czero\u200Dwidth"); // Returns "textwithzerowidth"
 * ```
 */
export function removeZeroWidthChars(text: string): string {
  return text.replace(ZERO_WIDTH_REGEX, "");
}

/**
 * Normalize whitespace in Arabic text
 * Replaces multiple spaces with single space, trims, and normalizes line breaks
 *
 * @param text - Text with irregular whitespace
 * @returns Text with normalized whitespace
 *
 * @example
 * ```typescript
 * normalizeWhitespace("مرحبا    بكم  \n\n  في"); // Returns "مرحبا بكم\nفي"
 * ```
 */
export function normalizeWhitespace(text: string): string {
  return (
    text
      // Replace multiple spaces with single space
      .replace(/[ \t]+/g, " ")
      // Replace multiple line breaks with single line break
      .replace(/\n\n+/g, "\n")
      // Trim whitespace from start and end
      .trim()
  );
}

/**
 * Full normalization pipeline for Arabic text
 * Applies all normalization steps in optimal order
 *
 * @param text - Text to normalize
 * @returns Fully normalized text
 *
 * @example
 * ```typescript
 * const text = "أحـمـد   مُحَمَّد\u200B";
 * fullNormalization(text); // Returns "احمد محمد"
 * ```
 */
export function fullNormalization(text: string): string {
  const result = normalizeArabic(text, {
    form: "NFC",
    removeDiacritics: true,
    normalizeVariants: true,
    removeTatweel: true,
    removeZeroWidth: true,
    preserveIraqiChars: true,
  });

  return normalizeWhitespace(result.text);
}

/**
 * Light normalization - minimal changes for user-visible text
 * Only normalizes Unicode form and removes dangerous characters
 *
 * @param text - Text to normalize
 * @returns Lightly normalized text
 *
 * @example
 * ```typescript
 * lightNormalization("مُحَمَّد"); // Preserves diacritics
 * ```
 */
export function lightNormalization(text: string): string {
  const result = normalizeArabic(text, {
    form: "NFC",
    removeDiacritics: false, // Preserve diacritics
    normalizeVariants: false, // Preserve variants
    removeTatweel: false, // Preserve tatweel
    removeZeroWidth: true, // Remove only zero-width (security)
    preserveIraqiChars: true,
  });

  return result.text;
}
