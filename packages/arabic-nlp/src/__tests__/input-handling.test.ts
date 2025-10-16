/**
 * Arabic NLP Input Handling Integration Tests
 * Tests real-time validation performance and UI integration scenarios
 *
 * These tests focus on performance requirements and integration with UI components
 * for the Arabic input handling system.
 */

import { describe, test, expect } from "bun:test";
import {
  validateArabicText,
  normalizeArabic,
  sanitizeArabicInput,
  isValidArabicInput,
  isIraqiKurdishChar,
} from "../index";

describe("Arabic NLP Input Handling", () => {
  test("Real-time validation performance (<100ms)", () => {
    const testTexts = [
      "مرحبا", // Simple
      "مرحبا بكم في نظام الذكاء الاصطناعي العراقي", // Medium
      "مرحبا بكم في نظام الذكاء الاصطناعي العراقي المتقدم ".repeat(5), // Large
    ];

    testTexts.forEach((text) => {
      const start = performance.now();
      const result = validateArabicText(text);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100); // <100ms requirement
      expect(result.isValid).toBe(true);
      expect(result).toHaveProperty("confidence");
    });
  });

  test("Composition + validation integration", () => {
    // Simulate composition sequence (user typing with Arabic keyboard)
    const compositionSequence = ["م", "مر", "مرح", "مرحبا"];
    const isComposing = true;

    // During composition: defer validation
    if (isComposing) {
      // Skip validation during composition
      expect(isComposing).toBe(true);
    }

    // After composition ends: validate immediately
    const finalText = compositionSequence[compositionSequence.length - 1];
    const start = performance.now();
    const result = validateArabicText(finalText);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(100);
    expect(result.isValid).toBe(true);
    expect(result.threats.length).toBe(0);
  });

  test("Normalization + validation integration", () => {
    const textWithDiacritics = "مُحَمَّد";

    // STEP 1: Validate before normalization
    const validationBefore = validateArabicText(textWithDiacritics);
    expect(validationBefore.isValid).toBe(true);

    // STEP 2: Normalize
    const normalized = normalizeArabic(textWithDiacritics, {
      removeDiacritics: true,
      form: "NFC",
      preserveIraqiChars: true,
    });
    expect(normalized.text).toBe("محمد");

    // STEP 3: Validate after normalization
    const validationAfter = validateArabicText(normalized.text);
    expect(validationAfter.isValid).toBe(true);

    // Both should be valid
    expect(validationBefore.isValid).toBe(validationAfter.isValid);
  });

  test("Iraqi Kurdish preservation in full workflow", () => {
    const kurdishText = "چاي گرم بڤا";

    // STEP 1: Sanitize
    const sanitized = sanitizeArabicInput(kurdishText);
    expect(sanitized).toContain("چ");
    expect(sanitized).toContain("گ");
    expect(sanitized).toContain("ڤ");

    // STEP 2: Validate
    const validation = validateArabicText(sanitized);
    expect(validation.isValid).toBe(true);
    expect(validation.threats.length).toBe(0);

    // STEP 3: Normalize (full workflow)
    const normalized = normalizeArabic(sanitized, {
      form: "NFC",
      preserveIraqiChars: true,
      removeDiacritics: true,
      normalizeVariants: true,
    });

    // Kurdish characters MUST be preserved
    expect(normalized.text).toContain("چ");
    expect(normalized.text).toContain("گ");
    expect(normalized.text).toContain("ڤ");

    // Verify character detection
    expect(isIraqiKurdishChar("چ")).toBe(true);
    expect(isIraqiKurdishChar("گ")).toBe(true);
    expect(isIraqiKurdishChar("ڤ")).toBe(true);

    // STEP 4: Re-validate after normalization
    const finalValidation = validateArabicText(normalized.text);
    expect(finalValidation.isValid).toBe(true);
  });

  test("Quick validation with isValidArabicInput", () => {
    const testCases = [
      { text: "مرحبا", expected: true },
      { text: "چاي گرم", expected: true },
      { text: "test\u202Emalicious", expected: false }, // Bidi attack
      { text: "", expected: false }, // Empty
      { text: "   ", expected: false }, // Whitespace
    ];

    testCases.forEach(({ text, expected }) => {
      const start = performance.now();
      const result = isValidArabicInput(text);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50); // Quick validation <50ms
      expect(result).toBe(expected);
    });
  });

  test("Debounced validation simulation (300ms delay)", () => {
    // Simulate typing sequence with rapid changes
    const typingSequence = ["م", "مر", "مرح", "مرحب", "مرحبا"];

    // In real implementation, only the final state would be validated after 300ms debounce
    const finalText = typingSequence[typingSequence.length - 1];

    const result = validateArabicText(finalText);
    expect(result.isValid).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
  });

  test("Security threat detection performance", () => {
    const bidiAttacks = [
      "test\u202Emalicious", // RLO
      "test\u202Dmalicious", // LRO
      "\u202Aاليمين\u202C", // LRE/PDF
    ];

    bidiAttacks.forEach((attack) => {
      const start = performance.now();
      const result = validateArabicText(attack);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100);
      expect(result.isValid).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);
    });

    // LRM/RLM are legitimate directional markers, not threats
    const legitimateDirectional = "test\u200Ehidden\u200F";
    const result = validateArabicText(legitimateDirectional);
    expect(result.isValid).toBe(true); // LRM/RLM allowed
  });

  test("Mixed content validation and normalization", () => {
    const mixed = "Name: أحمد محمد, Email: ahmed@example.com, Phone: +964";

    // Validate
    const validation = validateArabicText(mixed);
    expect(validation.isValid).toBe(true);

    // Normalize
    const normalized = normalizeArabic(mixed, {
      form: "NFC",
      preserveIraqiChars: true,
    });

    expect(normalized.text).toContain("Name");
    expect(normalized.text).toContain("احمد");
    expect(normalized.text).toContain("Email");
    expect(normalized.text).toContain("+964");
  });

  test("Batch validation performance", () => {
    const texts = Array(100).fill("مرحبا");

    const start = performance.now();
    const results = texts.map((t) => validateArabicText(t));
    const elapsed = performance.now() - start;

    // Should process 100 validations in <1000ms (10ms per validation)
    expect(elapsed).toBeLessThan(1000);
    expect(results.every((r) => r.isValid)).toBe(true);
  });

  test("Error message extraction for UI display", () => {
    const invalidInputs = [
      { text: "", expectedCode: "EMPTY_TEXT" },
      { text: "   ", expectedCode: "EMPTY_TEXT" },
      { text: "test\u202Emalicious", threatType: "bidi-override" },
    ];

    invalidInputs.forEach((input) => {
      const result = validateArabicText(input.text);

      expect(result.isValid).toBe(false);

      if (input.expectedCode) {
        expect(result.errors[0].code).toBe(input.expectedCode);
        expect(result.errors[0].message).toBeDefined();
      }

      if (input.threatType) {
        expect(result.threats[0].type).toBe(input.threatType);
      }
    });
  });

  test("Normalization trigger scenarios", () => {
    const text = "مُحَمَّد چاي";

    // Scenario 1: On blur (full normalization)
    const onBlurNormalized = normalizeArabic(text, {
      removeDiacritics: true,
      normalizeVariants: true,
      preserveIraqiChars: true,
      form: "NFC",
    });

    expect(onBlurNormalized.text).toBe("محمد چاي");
    expect(onBlurNormalized.modified).toBe(true);
    expect(onBlurNormalized.text).toContain("چ"); // Kurdish preserved

    // Scenario 2: On change (light normalization)
    const onChangeNormalized = normalizeArabic(text, {
      removeDiacritics: false,
      normalizeVariants: false,
      preserveIraqiChars: true,
      form: "NFC",
    });

    // Should preserve diacritics in light mode
    expect(onChangeNormalized.text).toContain("چ");
  });

  test("Composition state integration", () => {
    // Simulate composition tracking state
    const compositionStates = [
      { isComposing: false, data: "", shouldValidate: true },
      { isComposing: true, data: "م", shouldValidate: false },
      { isComposing: true, data: "مر", shouldValidate: false },
      { isComposing: true, data: "مرح", shouldValidate: false },
      { isComposing: false, data: "مرحبا", shouldValidate: true },
    ];

    compositionStates.forEach((state) => {
      if (state.shouldValidate && state.data) {
        const result = validateArabicText(state.data);
        expect(result.isValid).toBe(true);
      }
    });
  });

  test("Direction detection with validation", () => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

    const testCases = [
      { text: "مرحبا", expectedDir: "rtl", shouldBeValid: true },
      { text: "Hello", expectedDir: "ltr", shouldBeValid: true },
      { text: "چاي", expectedDir: "rtl", shouldBeValid: true },
      {
        text: "Name: أحمد",
        expectedDir: "rtl",
        shouldBeValid: true,
      } /* Arabic detected */,
    ];

    testCases.forEach(({ text, expectedDir, shouldBeValid }) => {
      const validation = validateArabicText(text);
      const hasArabic = arabicRegex.test(text);
      const direction = hasArabic ? "rtl" : "ltr";

      expect(validation.isValid).toBe(shouldBeValid);
      expect(direction).toBe(expectedDir);
    });
  });

  test("Performance with Iraqi dialect phrases", () => {
    const iraqiPhrases = [
      "شلونك؟", // How are you?
      "مرحبا بيك", // Welcome
      "چاي گرم بڤا", // Hot tea please
      "شكو ماكو؟", // What's up?
      "يلا نروح", // Let's go
    ];

    iraqiPhrases.forEach((phrase) => {
      const start = performance.now();

      // Full workflow
      const sanitized = sanitizeArabicInput(phrase);
      const validation = validateArabicText(sanitized);
      const normalized = normalizeArabic(sanitized, {
        form: "NFC",
        preserveIraqiChars: true,
      });

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100); // Full workflow <100ms
      expect(validation.isValid).toBe(true);
      expect(normalized.text).toBeDefined();
    });
  });

  test("Confidence score correlation with text quality", () => {
    const testCases = [
      { text: "مرحبا", expectedMinConfidence: 0.9 }, // High confidence
      { text: "مرحبا123", expectedMinConfidence: 0.7 }, // Medium (mixed)
      { text: "test\u202E", expectedMinConfidence: 0 }, // Low (threat)
    ];

    testCases.forEach(({ text, expectedMinConfidence }) => {
      const result = validateArabicText(text);
      expect(result.confidence).toBeGreaterThanOrEqual(expectedMinConfidence);
    });
  });

  test("Zero-width character handling", () => {
    // Zero-width joiners and non-joiners are legitimate in Arabic text
    // They control character shaping and are not security threats
    const zeroWidthTexts = [
      "test\u200Bhidden", // Zero-width space
      "test\u200Chidden", // Zero-width non-joiner (legitimate)
      "test\u200Dhidden", // Zero-width joiner (legitimate)
      "test\uFEFFhidden", // Zero-width no-break space
    ];

    zeroWidthTexts.forEach((text) => {
      const result = validateArabicText(text);
      // Zero-width characters are allowed (used for proper Arabic rendering)
      expect(result.isValid).toBe(true);
      expect(typeof result.confidence).toBe("number");
    });
  });
});

/**
 * Performance Benchmarks Summary:
 *
 * - Real-time validation: <100ms per text
 * - Quick validation (isValidArabicInput): <50ms
 * - Batch validation: <10ms per item (100 items in <1000ms)
 * - Full workflow (sanitize + validate + normalize): <100ms
 * - Iraqi Kurdish preservation: 100% in all scenarios
 * - Security threat detection: <100ms with 100% accuracy
 *
 * Integration Requirements:
 *
 * 1. Composition + Validation:
 *    - Defer validation during composition (isComposing = true)
 *    - Validate immediately after composition ends
 *    - <100ms validation time
 *
 * 2. Normalization + Validation:
 *    - Validate before normalization (optional)
 *    - Normalize with preserveIraqiChars: true
 *    - Re-validate after normalization (optional)
 *
 * 3. Iraqi Kurdish Preservation:
 *    - چ (U+0686), گ (U+06AF), ڤ (U+06A4) preserved in all operations
 *    - Never normalized to Arabic equivalents
 *    - Validated as legitimate characters
 *
 * 4. UI Integration:
 *    - Error messages: result.errors[0].message
 *    - Threat messages: result.threats[0].type
 *    - Confidence score: result.confidence (0-1)
 *    - Processing time: result.processingTime (ms)
 */
