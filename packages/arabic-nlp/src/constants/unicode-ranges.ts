/**
 * Arabic Unicode ranges and blocks
 * @module @iraqi-ai/arabic-nlp/constants/unicode-ranges
 */

/**
 * Main Arabic Unicode block (U+0600..U+06FF)
 * Contains most Arabic letters, diacritics, and punctuation
 */
export const ARABIC_BLOCK = {
  start: 0x0600,
  end: 0x06ff,
  regex: /[\u0600-\u06FF]/,
  name: "Arabic",
} as const;

/**
 * Arabic Supplement block (U+0750..U+077F)
 * Contains additional Arabic letters used in some dialects
 */
export const ARABIC_SUPPLEMENT = {
  start: 0x0750,
  end: 0x077f,
  regex: /[\u0750-\u077F]/,
  name: "Arabic Supplement",
} as const;

/**
 * Arabic Extended-A block (U+08A0..U+08FF)
 * Contains additional Arabic letters and marks
 */
export const ARABIC_EXTENDED_A = {
  start: 0x08a0,
  end: 0x08ff,
  regex: /[\u08A0-\u08FF]/,
  name: "Arabic Extended-A",
} as const;

/**
 * Arabic Extended-B block (U+0870..U+089F)
 * Contains additional Arabic letters
 */
export const ARABIC_EXTENDED_B = {
  start: 0x0870,
  end: 0x089f,
  regex: /[\u0870-\u089F]/,
  name: "Arabic Extended-B",
} as const;

/**
 * Arabic Extended-C block (U+10EC0..U+10EFF)
 * Contains additional Arabic letters
 */
export const ARABIC_EXTENDED_C = {
  start: 0x10ec0,
  end: 0x10eff,
  regex: /[\u{10EC0}-\u{10EFF}]/u,
  name: "Arabic Extended-C",
} as const;

/**
 * Arabic Presentation Forms-A (U+FB50..U+FDFF)
 * Contains ligatures and presentation forms
 */
export const ARABIC_PRESENTATION_FORMS_A = {
  start: 0xfb50,
  end: 0xfdff,
  regex: /[\uFB50-\uFDFF]/,
  name: "Arabic Presentation Forms-A",
} as const;

/**
 * Arabic Presentation Forms-B (U+FE70..U+FEFF)
 * Contains contextual forms and ligatures
 */
export const ARABIC_PRESENTATION_FORMS_B = {
  start: 0xfe70,
  end: 0xfeff,
  regex: /[\uFE70-\uFEFF]/,
  name: "Arabic Presentation Forms-B",
} as const;

/**
 * All Arabic Unicode blocks combined
 */
export const ALL_ARABIC_BLOCKS = [
  ARABIC_BLOCK,
  ARABIC_SUPPLEMENT,
  ARABIC_EXTENDED_A,
  ARABIC_EXTENDED_B,
  ARABIC_EXTENDED_C,
  ARABIC_PRESENTATION_FORMS_A,
  ARABIC_PRESENTATION_FORMS_B,
] as const;

/**
 * Combined regex for all Arabic characters
 * Matches any character in any Arabic Unicode block
 */
export const ARABIC_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0870-\u089F\u{10EC0}-\u{10EFF}\uFB50-\uFDFF\uFE70-\uFEFF]/u;

/**
 * Arabic-Indic digits (٠-٩) U+0660..U+0669
 */
export const ARABIC_INDIC_DIGITS = {
  start: 0x0660,
  end: 0x0669,
  regex: /[\u0660-\u0669]/,
  name: "Arabic-Indic Digits",
} as const;

/**
 * Extended Arabic-Indic digits (۰-۹) U+06F0..U+06F9
 * Used in Persian, Urdu, and some other languages
 */
export const EXTENDED_ARABIC_INDIC_DIGITS = {
  start: 0x06f0,
  end: 0x06f9,
  regex: /[\u06F0-\u06F9]/,
  name: "Extended Arabic-Indic Digits",
} as const;

/**
 * Iraqi Kurdish characters (used in Iraqi Arabic dialect)
 * چ (U+0686), گ (U+06AF), ڤ (U+06A4), ژ (U+0698)
 */
export const IRAQI_KURDISH_CHARS = {
  chars: [0x0686, 0x06af, 0x06a4, 0x0698] as const,
  regex: /[چگڤژ]/,
  name: "Iraqi Kurdish Characters",
  list: ["چ", "گ", "ڤ", "ژ"] as const,
} as const;

/**
 * Arabic punctuation marks
 */
export const ARABIC_PUNCTUATION = {
  start: 0x060c,
  end: 0x061f,
  regex: /[\u060C-\u061F]/,
  name: "Arabic Punctuation",
  marks: {
    comma: "\u060C", // ،
    semicolon: "\u061B", // ؛
    questionMark: "\u061F", // ؟
    percent: "\u066A", // ٪
    decimal: "\u066B", // ٫
    thousands: "\u066C", // ٬
  },
} as const;

/**
 * Check if a codepoint is in an Arabic block
 */
export function isInArabicBlock(codepoint: number): boolean {
  return ALL_ARABIC_BLOCKS.some(
    (block) => codepoint >= block.start && codepoint <= block.end,
  );
}

/**
 * Get the block name for a codepoint
 */
export function getBlockName(codepoint: number): string | null {
  const block = ALL_ARABIC_BLOCKS.find(
    (b) => codepoint >= b.start && codepoint <= b.end,
  );
  return block?.name ?? null;
}
