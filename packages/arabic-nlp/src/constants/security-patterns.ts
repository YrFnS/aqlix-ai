/**
 * Security threat patterns for Arabic text processing
 * Defines dangerous Unicode characters and attack patterns
 * @module @iraqi-ai/arabic-nlp/constants/security-patterns
 */

/**
 * Bidirectional (Bidi) override characters
 * These enable "Trojan Source" attacks by manipulating text direction
 * Reference: https://securityonline.info/bidi-swap-a-decade-old-unicode-flaw-still-enables-url-spoofing/
 */
export const BIDI_OVERRIDE_CHARS = {
  LRE: "\u202A", // Left-to-Right Embedding
  RLE: "\u202B", // Right-to-Left Embedding
  PDF: "\u202C", // Pop Directional Formatting
  LRO: "\u202D", // Left-to-Right Override
  RLO: "\u202E", // Right-to-Left Override
  LRI: "\u2066", // Left-to-Right Isolate
  RLI: "\u2067", // Right-to-Left Isolate
  FSI: "\u2068", // First Strong Isolate
  PDI: "\u2069", // Pop Directional Isolate
} as const;

/**
 * Array of all bidi override characters for easy iteration
 */
export const BIDI_OVERRIDE_ARRAY = [
  BIDI_OVERRIDE_CHARS.LRE,
  BIDI_OVERRIDE_CHARS.RLE,
  BIDI_OVERRIDE_CHARS.PDF,
  BIDI_OVERRIDE_CHARS.LRO,
  BIDI_OVERRIDE_CHARS.RLO,
  BIDI_OVERRIDE_CHARS.LRI,
  BIDI_OVERRIDE_CHARS.RLI,
  BIDI_OVERRIDE_CHARS.FSI,
  BIDI_OVERRIDE_CHARS.PDI,
] as const;

/**
 * Regex to match all bidi override characters
 * CRITICAL: These must be stripped from user input
 */
export const BIDI_OVERRIDE_REGEX = /[\u202A-\u202E\u2066-\u2069]/g;

/**
 * Most dangerous bidi override characters (high severity)
 * RLO and LRO are the primary attack vectors
 */
export const HIGH_SEVERITY_BIDI = [
  BIDI_OVERRIDE_CHARS.RLO, // Right-to-Left Override
  BIDI_OVERRIDE_CHARS.LRO, // Left-to-Right Override
] as const;

/**
 * Dangerous zero-width characters
 * These can be used for obfuscation and homograph attacks
 */
export const DANGEROUS_ZERO_WIDTH = {
  ZWSP: "\u200B", // Zero-Width Space
  ZWNJ: "\u200C", // Zero-Width Non-Joiner (legitimate in Arabic)
  ZWJ: "\u200D", // Zero-Width Joiner (legitimate in Arabic)
  BOM: "\uFEFF", // Byte Order Mark / Zero-Width No-Break Space
  WORD_JOINER: "\u2060", // Word Joiner
  INVISIBLE_SEPARATOR: "\u2063", // Invisible Separator
  INVISIBLE_PLUS: "\u2064", // Invisible Plus
  INVISIBLE_TIMES: "\u2062", // Invisible Times
} as const;

/**
 * Zero-width characters that are almost always malicious
 * Note: ZWNJ and ZWJ are excluded as they have legitimate uses in Arabic
 */
export const ALWAYS_MALICIOUS_ZERO_WIDTH = [
  DANGEROUS_ZERO_WIDTH.ZWSP,
  DANGEROUS_ZERO_WIDTH.BOM,
  DANGEROUS_ZERO_WIDTH.WORD_JOINER,
  DANGEROUS_ZERO_WIDTH.INVISIBLE_SEPARATOR,
  DANGEROUS_ZERO_WIDTH.INVISIBLE_PLUS,
  DANGEROUS_ZERO_WIDTH.INVISIBLE_TIMES,
] as const;

/**
 * Regex to match always-malicious zero-width characters
 */
export const MALICIOUS_ZERO_WIDTH_REGEX = /[\u200B\uFEFF\u2060\u2062-\u2064]/g;

/**
 * Regex to match all zero-width characters (including legitimate ones)
 * Uses alternation to avoid character class issues
 */
export const ALL_ZERO_WIDTH_REGEX = new RegExp(
  "(?:\\u200B|\\u200C|\\u200D|\\uFEFF|\\u2060|\\u2062|\\u2063|\\u2064)",
  "g",
);

/**
 * Control characters that are suspicious in text input
 */
export const SUSPICIOUS_CONTROL_CHARS = {
  NULL: "\u0000", // Null character
  BACKSPACE: "\u0008", // Backspace
  VERTICAL_TAB: "\u000B", // Vertical tab
  FORM_FEED: "\u000C", // Form feed
  ESCAPE: "\u001B", // Escape
  DELETE: "\u007F", // Delete
  // Additional control characters (C0 and C1 controls)
  C0_START: "\u0000",
  C0_END: "\u001F",
  C1_START: "\u0080",
  C1_END: "\u009F",
} as const;

/**
 * Regex to match suspicious control characters
 * Excludes common whitespace (tab, newline, carriage return)
 * Uses alternation to avoid character class control bytes
 */
export const SUSPICIOUS_CONTROL_REGEX = new RegExp(
  "(?:" +
    "\\u0000|\\u0001|\\u0002|\\u0003|\\u0004|\\u0005|\\u0006|\\u0007|" +
    "\\u0008|\\u000B|\\u000C|\\u000E|\\u000F|\\u0010|\\u0011|\\u0012|" +
    "\\u0013|\\u0014|\\u0015|\\u0016|\\u0017|\\u0018|\\u0019|\\u001A|" +
    "\\u001B|\\u001C|\\u001D|\\u001E|\\u001F|\\u007F|\\u0080|\\u0081|" +
    "\\u0082|\\u0083|\\u0084|\\u0085|\\u0086|\\u0087|\\u0088|\\u0089|" +
    "\\u008A|\\u008B|\\u008C|\\u008D|\\u008E|\\u008F|\\u0090|\\u0091|" +
    "\\u0092|\\u0093|\\u0094|\\u0095|\\u0096|\\u0097|\\u0098|\\u0099|" +
    "\\u009A|\\u009B|\\u009C|\\u009D|\\u009E|\\u009F" +
    ")",
  "g",
);

/**
 * Homograph attack pairs - characters that look similar but are different
 * These can be used for phishing and spoofing attacks
 */
export const HOMOGRAPH_PAIRS = [
  // Latin vs Cyrillic
  { latin: "a", cyrillic: "а", note: "Latin 'a' vs Cyrillic 'а'" },
  { latin: "e", cyrillic: "е", note: "Latin 'e' vs Cyrillic 'е'" },
  { latin: "o", cyrillic: "о", note: "Latin 'o' vs Cyrillic 'о'" },
  { latin: "p", cyrillic: "р", note: "Latin 'p' vs Cyrillic 'р'" },
  { latin: "c", cyrillic: "с", note: "Latin 'c' vs Cyrillic 'с'" },
  { latin: "x", cyrillic: "х", note: "Latin 'x' vs Cyrillic 'х'" },
  { latin: "y", cyrillic: "у", note: "Latin 'y' vs Cyrillic 'у'" },

  // Arabic vs similar-looking characters
  { arabic: "و", similar: "ω", note: "Arabic Waw vs Greek Omega" },
  { arabic: "ر", similar: "ο", note: "Arabic Ra vs Greek Omicron" },
] as const;

/**
 * Regex to detect mixed scripts that could indicate homograph attacks
 * Matches Cyrillic characters that look like Latin
 */
export const CYRILLIC_LOOKALIKE_REGEX = /[аеорсхуАЕОРСХУ]/g;

/**
 * Combined dangerous Unicode pattern - matches all security threats
 * Uses alternation to avoid character class control bytes
 */
export const ALL_DANGEROUS_UNICODE_REGEX = new RegExp(
  "(?:" +
    // Bidi override characters
    "\\u202A|\\u202B|\\u202C|\\u202D|\\u202E|\\u2066|\\u2067|\\u2068|" +
    "\\u2069|" +
    // Zero-width characters
    "\\u200B|\\u200C|\\u200D|\\uFEFF|\\u2060|\\u2062|\\u2063|" +
    "\\u2064|" +
    // Control characters (C0 controls except tab, newline, carriage return)
    "\\u0000|\\u0001|\\u0002|\\u0003|\\u0004|\\u0005|\\u0006|\\u0007|" +
    "\\u0008|\\u000B|\\u000C|\\u000E|\\u000F|\\u0010|\\u0011|\\u0012|" +
    "\\u0013|\\u0014|\\u0015|\\u0016|\\u0017|\\u0018|\\u0019|\\u001A|" +
    "\\u001B|\\u001C|\\u001D|\\u001E|\\u001F|\\u007F|" +
    // C1 control characters
    "\\u0080|\\u0081|\\u0082|\\u0083|\\u0084|\\u0085|\\u0086|\\u0087|" +
    "\\u0088|\\u0089|\\u008A|\\u008B|\\u008C|\\u008D|\\u008E|\\u008F|" +
    "\\u0090|\\u0091|\\u0092|\\u0093|\\u0094|\\u0095|\\u0096|\\u0097|" +
    "\\u0098|\\u0099|\\u009A|\\u009B|\\u009C|\\u009D|\\u009E|\\u009F" +
    ")",
  "g",
);

/**
 * Whitelist of safe zero-width characters for Arabic text
 * ZWNJ and ZWJ are necessary for proper Arabic rendering
 */
export const SAFE_ZERO_WIDTH_IN_ARABIC = [
  DANGEROUS_ZERO_WIDTH.ZWNJ, // Used to prevent ligatures
  DANGEROUS_ZERO_WIDTH.ZWJ, // Used to force ligatures
] as const;

/**
 * Type-safe Set instances for efficient membership checks
 * Cast to Set<string> to allow broader string type checking
 */
const BIDI_OVERRIDE_SET = new Set(BIDI_OVERRIDE_ARRAY) as Set<string>;
const ALWAYS_MALICIOUS_ZERO_WIDTH_SET = new Set(
  ALWAYS_MALICIOUS_ZERO_WIDTH,
) as Set<string>;
const SAFE_ZERO_WIDTH_IN_ARABIC_SET = new Set(
  SAFE_ZERO_WIDTH_IN_ARABIC,
) as Set<string>;
const HIGH_SEVERITY_BIDI_SET = new Set(HIGH_SEVERITY_BIDI) as Set<string>;

/**
 * Maximum consecutive zero-width characters before flagging as suspicious
 * More than 2 consecutive zero-width chars is likely malicious
 */
export const MAX_CONSECUTIVE_ZERO_WIDTH = 2;

/**
 * Security threat severity levels
 */
export const THREAT_SEVERITY = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

/**
 * Threat type classifications
 */
export const THREAT_TYPES = {
  BIDI_OVERRIDE: "bidi-override",
  ZERO_WIDTH: "zero-width",
  HOMOGRAPH: "homograph",
  RTL_OVERRIDE: "rtl-override",
  CONTROL_CHAR: "control-char",
} as const;

/**
 * Check if a character is a bidi override character
 */
export function isBidiOverride(char: string): boolean {
  return BIDI_OVERRIDE_SET.has(char);
}

/**
 * Check if a character is dangerous zero-width
 */
export function isDangerousZeroWidth(char: string): boolean {
  return ALWAYS_MALICIOUS_ZERO_WIDTH_SET.has(char);
}

/**
 * Check if a character is a safe zero-width character in Arabic context
 */
export function isSafeZeroWidthInArabic(char: string): boolean {
  return SAFE_ZERO_WIDTH_IN_ARABIC_SET.has(char);
}

/**
 * Get threat level for a character
 */
export function getThreatLevel(char: string): "high" | "medium" | "low" | null {
  if (HIGH_SEVERITY_BIDI_SET.has(char)) {
    return "high";
  }
  if (isBidiOverride(char)) {
    return "medium";
  }
  if (isDangerousZeroWidth(char)) {
    return "medium";
  }
  if (SUSPICIOUS_CONTROL_REGEX.test(char)) {
    return "low";
  }
  return null;
}

/**
 * Common attack patterns for detection
 */
export const ATTACK_PATTERNS = {
  // Bidi swap: legitimate text + RLO + malicious text + PDF
  BIDI_SWAP: /(.+)[\u202E\u202D](.+)[\u202C]/,

  // Multiple consecutive zero-width characters
  EXCESSIVE_ZERO_WIDTH: /[\u200B-\u200D\uFEFF\u2060\u2062-\u2064]{3,}/g,

  // Mixed Cyrillic-Latin in short strings (potential homograph)
  MIXED_CYRILLIC_LATIN: /(?=.*[a-zA-Z])(?=.*[а-яА-Я]).{1,50}/,

  // Hidden characters at start/end of strings
  HIDDEN_PREFIX: /^[\u200B-\u200D\uFEFF\u2060\u2062-\u2064]+/,
  HIDDEN_SUFFIX: /[\u200B-\u200D\uFEFF\u2060\u2062-\u2064]+$/,
} as const;

/**
 * URLs and references for security research
 */
export const SECURITY_REFERENCES = {
  TROJAN_SOURCE: "https://trojansource.codes/",
  BIDI_SWAP_2025:
    "https://securityonline.info/bidi-swap-a-decade-old-unicode-flaw-still-enables-url-spoofing/",
  UNICODE_SECURITY: "https://unicode.org/reports/tr36/",
  HOMOGRAPH_ATTACKS: "https://en.wikipedia.org/wiki/IDN_homograph_attack",
} as const;
