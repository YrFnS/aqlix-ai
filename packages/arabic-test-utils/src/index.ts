/**
 * @iraqi-ai/arabic-test-utils
 * Arabic and RTL testing utilities for Iraqi AI Chat System
 */

// RTL Assertions
export {
  assertRTLLayout,
  validateRTLLayout,
  assertTextDirection,
  assertRTLAlignment,
  getRTLLayoutInfo,
  hasArabicText,
  getArabicTextPercentage,
  type RTLLayoutValidation,
  type RTLAssertionOptions,
} from "./rtl-assertions/index.js";

// Dialect Recognition
export {
  detectDialect,
  validateDialect,
  getDialectValidation,
  getDialectPatterns,
  hasDialectMarkers,
  countDialectMarkers,
  assertDialect,
  getDialectMatchDescription,
  DIALECT_PATTERNS,
  type IraqiDialect,
  type DialectMatch,
  type DialectValidationResult,
} from "./dialect-recognition/index.js";

// Text Processing
export {
  normalizeArabicText,
  validateArabicText,
  getArabicTextValidation,
  extractArabicWords,
  getArabicTextInfo,
  removeDiacritics,
  isPureArabic,
  isMixedArabicEnglish,
  assertValidArabicText,
  assertMinimumArabicPercentage,
  countArabicWords,
  getFirstArabicWords,
  ARABIC_UNICODE_RANGES,
  ARABIC_CHAR_REGEX,
  ARABIC_DIACRITICS_REGEX,
  type ArabicTextValidation,
  type ArabicTextInfo,
} from "./text-processing/index.js";

// Font Rendering
export {
  assertFontLoaded,
  validateFontRendering,
  getFontRenderingValidation,
  getFontMetrics,
  getRecommendedArabicFonts,
  assertArabicFont,
  ARABIC_FONTS,
  type FontMetrics,
  type FontRenderingValidation,
  type FontRenderingOptions,
} from "./font-rendering/index.js";
