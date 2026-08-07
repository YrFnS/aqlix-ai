const RTL_LOCALE_PATTERN = /^(ar|fa|he|ur)(?:-|$)/i;
const ARABIC_SCRIPT_PATTERN = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/u;

export type ResolvedTextDirection = "ltr" | "rtl";

/** Resolve the document direction from a BCP 47-style locale. */
export function getLocaleDirection(locale: string): ResolvedTextDirection {
  return RTL_LOCALE_PATTERN.test(locale.trim()) ? "rtl" : "ltr";
}

/** Detect whether text contains at least one Arabic-script character. */
export function isArabicText(text: string): boolean {
  return ARABIC_SCRIPT_PATTERN.test(text);
}
