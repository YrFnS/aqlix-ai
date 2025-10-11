/**
 * Arabic diacritical marks and combining characters
 * @module @iraqi-ai/arabic-nlp/constants/diacritics
 */

/**
 * Arabic diacritical marks (U+064B..U+0652)
 * These are combining marks that modify the pronunciation of base letters
 */
export const ARABIC_DIACRITICS = {
  // Tanween (nunation)
  FATHATAN: "\u064B", // ً (double fatha)
  DAMMATAN: "\u064C", // ٌ (double damma)
  KASRATAN: "\u064D", // ٍ (double kasra)

  // Short vowels
  FATHA: "\u064E", // َ (a)
  DAMMA: "\u064F", // ُ (u)
  KASRA: "\u0650", // ِ (i)

  // Additional marks
  SHADDA: "\u0651", // ّ (gemination/doubling)
  SUKUN: "\u0652", // ْ (absence of vowel)

  // Special marks
  MADDAH: "\u0653", // ٓ (elongation)
  HAMZA_ABOVE: "\u0654", // ٔ (hamza above)
  HAMZA_BELOW: "\u0655", // ٕ (hamza below)
  SUBSCRIPT_ALEF: "\u0656", // ٖ (subscript alef)
  INVERTED_DAMMA: "\u0657", // ٗ (inverted damma)
  MARK_NOON_GHUNNA: "\u0658", // ٘ (mark noon ghunna)
  ZWARAKAY: "\u0659", // ٙ (zwarakay)
  VOWEL_SIGN_SMALL_V_ABOVE: "\u065A", // ٚ (vowel sign small v above)
  VOWEL_SIGN_INVERTED_SMALL_V_ABOVE: "\u065B", // ٛ (vowel sign inverted small v above)
  VOWEL_SIGN_DOT_BELOW: "\u065C", // ٜ (vowel sign dot below)
  REVERSED_DAMMA: "\u065D", // ٝ (reversed damma)
  FATHA_WITH_TWO_DOTS: "\u065E", // ٞ (fatha with two dots)
  WAVY_HAMZA_BELOW: "\u065F", // ٟ (wavy hamza below)
} as const;

/**
 * Array of all common diacritical marks for easy iteration
 */
export const DIACRITIC_MARKS = [
  ARABIC_DIACRITICS.FATHATAN,
  ARABIC_DIACRITICS.DAMMATAN,
  ARABIC_DIACRITICS.KASRATAN,
  ARABIC_DIACRITICS.FATHA,
  ARABIC_DIACRITICS.DAMMA,
  ARABIC_DIACRITICS.KASRA,
  ARABIC_DIACRITICS.SHADDA,
  ARABIC_DIACRITICS.SUKUN,
  ARABIC_DIACRITICS.MADDAH,
  ARABIC_DIACRITICS.HAMZA_ABOVE,
  ARABIC_DIACRITICS.HAMZA_BELOW,
] as const;

/**
 * Regex pattern to match Arabic diacritics
 * Matches the main diacritic range (U+064B..U+065F)
 */
export const DIACRITICS_REGEX = /[\u064B-\u065F]/g;

/**
 * Extended diacritics regex including additional marks
 */
export const EXTENDED_DIACRITICS_REGEX =
  /[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED]/g;

/**
 * Tatweel (Kashida) - U+0640
 * Used for text justification and stylistic elongation
 * Not technically a diacritic but often treated as one for normalization
 */
export const TATWEEL = "\u0640"; // ـ

/**
 * Regex pattern to match tatweel
 */
export const TATWEEL_REGEX = /\u0640/g;

/**
 * Zero-width characters used in Arabic text
 */
export const ZERO_WIDTH_CHARS = {
  ZERO_WIDTH_SPACE: "\u200B", // Zero-width space (ZWSP)
  ZERO_WIDTH_NON_JOINER: "\u200C", // Zero-width non-joiner (ZWNJ)
  ZERO_WIDTH_JOINER: "\u200D", // Zero-width joiner (ZWJ)
  BYTE_ORDER_MARK: "\uFEFF", // Zero-width no-break space (BOM)
  WORD_JOINER: "\u2060", // Word joiner
  INVISIBLE_SEPARATOR: "\u2063", // Invisible separator
  INVISIBLE_PLUS: "\u2064", // Invisible plus
} as const;

/**
 * Regex to match zero-width characters
 * Note: ZWNJ and ZWJ are legitimate in Arabic text, so handle with care
 */
export const ZERO_WIDTH_REGEX = /[\u200B\u200C\u200D\uFEFF\u2060\u2063\u2064]/g;

/**
 * Regex to match dangerous zero-width characters (excluding legitimate ZWNJ/ZWJ)
 * These are almost always malicious in user input
 */
export const DANGEROUS_ZERO_WIDTH_REGEX = /[\u200B\uFEFF\u2060\u2063\u2064]/g;

/**
 * Combining character marks (general Unicode combining marks in Arabic range)
 */
export const COMBINING_MARKS = {
  ARABIC_LETTER_SUPERSCRIPT_ALEF: "\u0670", // ٰ
  COMBINING_DOT_ABOVE: "\u0307",
  COMBINING_DOT_BELOW: "\u0323",
  COMBINING_RING_ABOVE: "\u030A",
  COMBINING_RING_BELOW: "\u0325",
} as const;

/**
 * Quranic annotation marks (U+06D6..U+06ED)
 * Used in Quran text for recitation guidance
 */
export const QURANIC_MARKS = {
  SMALL_HIGH_LIGATURE_SAD_WITH_LAM_WITH_ALEF_MAKSURA: "\u06D6",
  SMALL_HIGH_LIGATURE_QAF_WITH_LAM_WITH_ALEF_MAKSURA: "\u06D7",
  SMALL_HIGH_MEEM_INITIAL_FORM: "\u06D8",
  SMALL_HIGH_LAM_ALEF: "\u06D9",
  SMALL_HIGH_JEEM: "\u06DA",
  SMALL_HIGH_THREE_DOTS: "\u06DB",
  SMALL_HIGH_SEEN: "\u06DC",
  SMALL_HIGH_ROUNDED_ZERO: "\u06DF",
  SMALL_HIGH_UPRIGHT_RECTANGULAR_ZERO: "\u06E0",
  SMALL_HIGH_DOTLESS_HEAD_OF_KHAH: "\u06E1",
  SMALL_HIGH_MEEM_ISOLATED_FORM: "\u06E2",
  SMALL_LOW_SEEN: "\u06E3",
  SMALL_HIGH_MADDA: "\u06E4",
  SMALL_WAW: "\u06E5",
  SMALL_YEH: "\u06E6",
  SMALL_HIGH_YEH: "\u06E7",
  SMALL_HIGH_NOON: "\u06E8",
  PLACE_OF_SAJDAH: "\u06E9",
  EMPTY_CENTRE_LOW_STOP: "\u06EA",
  EMPTY_CENTRE_HIGH_STOP: "\u06EB",
  ROUNDED_HIGH_STOP_WITH_FILLED_CENTRE: "\u06EC",
  SMALL_LOW_MEEM: "\u06ED",
} as const;

/**
 * Regex to match Quranic annotation marks
 */
export const QURANIC_MARKS_REGEX = /[\u06D6-\u06ED]/g;

/**
 * Check if a character is a diacritic
 */
export function isDiacritic(char: string): boolean {
  if (char.length === 0) return false;
  const code = char.codePointAt(0);
  if (code === undefined) return false;

  // Main diacritic range
  if (code >= 0x064b && code <= 0x065f) return true;

  // Extended diacritics
  if (code === 0x0670) return true; // Superscript alef
  if (code >= 0x06d6 && code <= 0x06dc) return true; // Quranic marks
  if (code >= 0x06df && code <= 0x06e4) return true; // Quranic marks
  if (code >= 0x06e7 && code <= 0x06e8) return true; // Quranic marks
  if (code >= 0x06ea && code <= 0x06ed) return true; // Quranic marks

  return false;
}

/**
 * Get the name of a diacritic mark
 */
export function getDiacriticName(char: string): string | null {
  const entries = Object.entries(ARABIC_DIACRITICS);
  for (const [name, value] of entries) {
    if (value === char) {
      return name;
    }
  }
  return null;
}
