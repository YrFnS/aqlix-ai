/**
 * @iraqi-ai/arabic-nlp
 *
 * Comprehensive Arabic text processing library for foundational text handling,
 * normalization, character manipulation, and security-focused input validation.
 *
 * Features:
 * - Unicode normalization with Arabic-specific character handling
 * - Character classification and manipulation utilities
 * - Arabic-aware string utilities (length, truncation, comparison)
 * - Security-focused validation (prevents bidi injection attacks)
 * - Input sanitization while preserving Iraqi dialect authenticity
 *
 * @module @iraqi-ai/arabic-nlp
 */

// Export types
export type {
  TextDirection,
  IraqiDialect,
  ArabicNormalizationOptions,
  NormalizationResult,
  CharacterInfo,
  CharacterCategory,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SecurityThreat,
  StringMeasurement,
  TruncateOptions,
  CompareOptions,
  SanitizationOptions,
  ValidationOptions,
} from "./types/index.js";

// Export constants
export * from "./constants/index.js";

// Export normalization functions
export * from "./normalization.js";

// Export character utilities (re-export to resolve isDiacritic ambiguity)
export {
  isArabicCharacter,
  isIraqiKurdishChar,
  isDiacritic,
  isArabicDigit,
  isArabicPunctuation,
  isWhitespace,
  isControlChar,
  classifyCharacter,
  getCharacterInfo,
  getCodepoint,
  getCodepointNumber,
  fromCodepoint,
  getCharacters,
  filterByCategory,
  countByCategory,
  getArabicLetters,
  getDiacritics,
  hasArabicCharacters,
  isAllArabic,
  getArabicPercentage,
  isMixedContent,
} from "./characters.js";

// Export string utilities
export * from "./strings.js";

// Export validation functions
export * from "./validation.js";

// Export sanitization functions
export * from "./sanitization.js";
