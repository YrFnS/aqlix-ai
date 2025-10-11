/**
 * Character normalization mappings for Arabic text
 * Maps character variants to their canonical forms
 * @module @iraqi-ai/arabic-nlp/constants/character-variants
 */

/**
 * Alef (ا) variants mapping
 * All variants normalize to basic Alef (U+0627)
 */
export const ALEF_VARIANTS = new Map<string, string>([
  ["\u0622", "\u0627"], // آ (Alef with madda above) → ا
  ["\u0623", "\u0627"], // أ (Alef with hamza above) → ا
  ["\u0625", "\u0627"], // إ (Alef with hamza below) → ا
  ["\u0671", "\u0627"], // ٱ (Alef wasla) → ا
  ["\u0672", "\u0627"], // ٲ (Alef with wavy hamza above) → ا
  ["\u0673", "\u0627"], // ٳ (Alef with wavy hamza below) → ا
  ["\u0675", "\u0627"], // ٵ (High hamza alef) → ا
]);

/**
 * Yeh (ي) variants mapping
 * All variants normalize to basic Yeh (U+064A)
 */
export const YEH_VARIANTS = new Map<string, string>([
  ["\u0649", "\u064A"], // ى (Alef maksura) → ي
  ["\u064A", "\u064A"], // ي (Yeh) → ي (identity)
  ["\u06CC", "\u064A"], // ی (Farsi yeh) → ي
  ["\u06CD", "\u064A"], // ۍ (Yeh with tail) → ي
  ["\u06CE", "\u064A"], // ێ (Yeh with small v) → ي
]);

/**
 * Heh (ه) variants mapping
 * All variants normalize to basic Heh (U+0647)
 */
export const HEH_VARIANTS = new Map<string, string>([
  ["\u0629", "\u0647"], // ة (Teh marbuta) → ه
  ["\u06C0", "\u0647"], // ۀ (Heh with yeh above) → ه
  ["\u06C1", "\u0647"], // ہ (Heh goal) → ه
  ["\u06C2", "\u0647"], // ۂ (Heh goal with hamza above) → ه
  ["\u06D5", "\u0647"], // ە (Ae) → ه
]);

/**
 * Waw (و) variants mapping
 * All variants normalize to basic Waw (U+0648)
 */
export const WAW_VARIANTS = new Map<string, string>([
  ["\u0624", "\u0648"], // ؤ (Waw with hamza above) → و
  ["\u0648", "\u0648"], // و (Waw) → و (identity)
  ["\u06C7", "\u0648"], // ۇ (U) → و
  ["\u06C8", "\u0648"], // ۈ (U with hamza above) → و
  ["\u06C9", "\u0648"], // ۉ (Kirghiz yu) → و
  ["\u06CA", "\u0648"], // ۊ (Waw with two dots above) → و
  ["\u06CB", "\u0648"], // ۋ (Ve) → و
]);

/**
 * Combined variants map containing all character normalizations
 */
export const ALL_VARIANTS = new Map<string, string>([
  ...ALEF_VARIANTS,
  ...YEH_VARIANTS,
  ...HEH_VARIANTS,
  ...WAW_VARIANTS,
]);

/**
 * Regex pattern to match all variant characters
 */
export const VARIANTS_REGEX =
  /[\u0622\u0623\u0625\u0671-\u0673\u0675\u0649\u064A\u06CC-\u06CE\u0629\u06C0-\u06C2\u06D5\u0624\u0648\u06C7-\u06CB]/g;

/**
 * Alef variants as regex (for quick matching)
 */
export const ALEF_VARIANTS_REGEX = /[\u0622\u0623\u0625\u0671-\u0673\u0675]/g;

/**
 * Yeh variants as regex
 */
export const YEH_VARIANTS_REGEX = /[\u0649\u06CC-\u06CE]/g;

/**
 * Heh variants as regex
 */
export const HEH_VARIANTS_REGEX = /[\u0629\u06C0-\u06C2\u06D5]/g;

/**
 * Waw variants as regex
 */
export const WAW_VARIANTS_REGEX = /[\u0624\u06C7-\u06CB]/g;

/**
 * Hamza (ء) variants mapping
 * Hamza can appear in different positions and forms
 */
export const HAMZA_VARIANTS = new Map<string, string>([
  ["\u0621", "\u0621"], // ء (Hamza) → ء (identity)
  ["\u0654", "\u0621"], // ٔ (Hamza above) → ء
  ["\u0655", "\u0621"], // ٕ (Hamza below) → ء
]);

/**
 * Common ligatures and their decompositions
 * These are presentation forms that should normalize to separate characters
 */
export const LIGATURE_DECOMPOSITIONS = new Map<string, string>([
  ["\uFDF2", "\u0627\u0644\u0644\u0647"], // ﷲ (Allah ligature) → الله
  [
    "\uFDFA",
    "\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645",
  ], // ﷺ (PBUH ligature)
  [
    "\uFDFD",
    "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645",
  ], // ﷽ (Bismillah)
]);

/**
 * Presentation forms that should normalize to their base form
 * These are contextual forms used for rendering but should normalize for processing
 */
export const PRESENTATION_FORMS_MAP = new Map<string, string>([
  // Common presentation forms (FB50-FDFF range has hundreds of these)
  // We include the most common ones
  ["\uFB50", "\u0627"], // ﭐ → ا
  ["\uFB51", "\u0627"], // ﭑ → ا
  ["\uFB52", "\u0628"], // ﭒ → ب
  ["\uFB56", "\u067E"], // ﭖ → پ
  ["\uFB8A", "\u062C"], // ﮊ → ج
  ["\uFBAE", "\u062D"], // ﮮ → ح
  ["\uFBFC", "\u064A"], // ﯼ → ي
]);

/**
 * Normalize a single character to its canonical form
 * Returns the normalized form or the original if no mapping exists
 */
export function normalizeCharacter(char: string): string {
  return ALL_VARIANTS.get(char) ?? char;
}

/**
 * Check if a character is a variant form
 */
export function isVariantForm(char: string): boolean {
  return ALL_VARIANTS.has(char);
}

/**
 * Get all variants of a base character
 * Returns an array of variant forms that normalize to the given base
 */
export function getVariantsOf(baseChar: string): string[] {
  const variants: string[] = [];
  for (const [variant, base] of ALL_VARIANTS) {
    if (base === baseChar && variant !== baseChar) {
      variants.push(variant);
    }
  }
  return variants;
}

/**
 * Get the base form of a character
 * Returns the canonical form if the character is a variant, or the original otherwise
 */
export function getBaseForm(char: string): string {
  return ALL_VARIANTS.get(char) ?? char;
}

/**
 * Character normalization statistics
 */
export const NORMALIZATION_STATS = {
  totalVariants: ALL_VARIANTS.size,
  alefVariants: ALEF_VARIANTS.size,
  yehVariants: YEH_VARIANTS.size,
  hehVariants: HEH_VARIANTS.size,
  wawVariants: WAW_VARIANTS.size,
  hamzaVariants: HAMZA_VARIANTS.size,
} as const;

/**
 * Export commonly used base forms
 */
export const BASE_FORMS = {
  ALEF: "\u0627", // ا
  YEH: "\u064A", // ي
  HEH: "\u0647", // ه
  WAW: "\u0648", // و
  HAMZA: "\u0621", // ء
  TEH_MARBUTA: "\u0629", // ة
  ALEF_MAKSURA: "\u0649", // ى
} as const;
