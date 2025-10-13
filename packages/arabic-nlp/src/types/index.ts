/**
 * Type definitions for Arabic text processing
 * @module @iraqi-ai/arabic-nlp/types
 */

import type { TextDirection, IraqiDialect } from "@iraqi-ai/types";

// Re-export types from @iraqi-ai/types for convenience
export type { TextDirection, IraqiDialect };

/**
 * Normalization options for Arabic text processing
 */
export interface ArabicNormalizationOptions {
  /** Unicode normalization form (default: "NFC") */
  form?: "NFC" | "NFD" | "NFKC" | "NFKD";

  /** Remove diacritical marks (default: false) */
  removeDiacritics?: boolean;

  /** Normalize character variants (أ, إ, آ → ا) (default: true) */
  normalizeVariants?: boolean;

  /** Remove tatweel/kashida (default: false) */
  removeTatweel?: boolean;

  /** Preserve Iraqi Kurdish characters (چ, گ, ڤ) (default: true) */
  preserveIraqiChars?: boolean;

  /** Remove zero-width characters (default: true) */
  removeZeroWidth?: boolean;
}

/**
 * Result of normalization with metadata
 */
export interface NormalizationResult {
  /** Normalized text */
  text: string;

  /** Original text for comparison */
  original: string;

  /** Whether text was modified */
  modified: boolean;

  /** Number of changes made */
  changeCount: number;

  /** Processing time in milliseconds */
  processingTime: number;
}

/**
 * Character classification result
 */
export interface CharacterInfo {
  /** The character */
  char: string;

  /** Unicode codepoint (e.g., "U+0627") */
  codepoint: string;

  /** Character category */
  category: CharacterCategory;

  /** Whether it's an Arabic character */
  isArabic: boolean;

  /** Whether it's a diacritic mark */
  isDiacritic: boolean;

  /** Whether it's an Iraqi Kurdish character */
  isIraqiKurdish: boolean;
}

/**
 * Character category classification
 */
export type CharacterCategory =
  | "letter" // Base Arabic letter
  | "diacritic" // Combining mark
  | "number" // Arabic numeral
  | "punctuation" // Arabic punctuation
  | "space" // Whitespace
  | "control" // Control character
  | "other"; // Other Unicode

/**
 * Validation result with security checks
 */
export interface ValidationResult {
  /** Whether text is valid */
  isValid: boolean;

  /** List of validation errors */
  errors: ValidationError[];

  /** List of warnings (non-blocking) */
  warnings: ValidationWarning[];

  /** Security threats detected */
  threats: SecurityThreat[];

  /** Confidence score (0-1) */
  confidence: number;
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Error code */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Position in text where error occurred (optional) */
  position?: number;

  /** Error severity */
  severity: "error" | "warning";
}

/**
 * Validation warning details
 */
export interface ValidationWarning {
  /** Warning code */
  code: string;

  /** Human-readable warning message */
  message: string;

  /** Position in text where warning occurred (optional) */
  position?: number;
}

/**
 * Security threat detection result
 */
export interface SecurityThreat {
  /** Type of security threat */
  type: "bidi-override" | "zero-width" | "homograph" | "rtl-override";

  /** Description of the threat */
  description: string;

  /** Position in text where threat was detected */
  position: number;

  /** Threat severity level */
  severity: "high" | "medium" | "low";

  /** The actual malicious character(s) detected */
  detected: string;
}

/**
 * String measurement result for Arabic text
 */
export interface StringMeasurement {
  /** Number of Unicode codepoints */
  codepoints: number;

  /** Number of grapheme clusters (visual characters) */
  graphemes: number;

  /** Number of base letters (excluding diacritics) */
  baseLetters: number;

  /** Number of words (whitespace-delimited) */
  words: number;

  /** Byte size in UTF-8 encoding */
  byteSize: number;
}

/**
 * Options for string truncation
 */
export interface TruncateOptions {
  /** Maximum length in grapheme clusters */
  maxLength: number;

  /** Ellipsis to append (default: "...") */
  ellipsis?: string;

  /** Preserve complete words when possible (default: true) */
  preserveWords?: boolean;
}

/**
 * Options for Arabic string comparison
 */
export interface CompareOptions {
  /** Normalize strings before comparison (default: true) */
  normalize?: boolean;

  /** Case-sensitive comparison (default: false) */
  caseSensitive?: boolean;

  /** Locale for comparison (default: "ar") */
  locale?: string;
}

/**
 * Options for text sanitization
 */
export interface SanitizationOptions {
  /** Aggressive mode - also normalizes character variants (default: false) */
  aggressive?: boolean;

  /** Remove all zero-width characters including legitimate ones (default: false) */
  removeAllZeroWidth?: boolean;

  /** Preserve specific characters even if normally removed */
  preserveChars?: string[];
}

/**
 * Options for validation
 */
export interface ValidationOptions {
  /** Minimum text length (default: 0) */
  minLength?: number;

  /** Maximum text length (default: Infinity) */
  maxLength?: number;

  /** Allow mixed Arabic-English content (default: true) */
  allowMixed?: boolean;

  /** Strict mode - treat warnings as errors (default: false) */
  strict?: boolean;
}
