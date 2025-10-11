/**
 * Integration tests for Arabic text processing
 * Tests full workflow: sanitize → validate → normalize
 */

import { describe, test, expect } from "bun:test";
import {
  normalizeArabic,
  validateArabicText,
  sanitizeArabicInput,
  measureString,
  isIraqiKurdishChar,
} from "../index.js";

describe("Arabic Text Processing Integration", () => {
  test("Full workflow: sanitize → validate → normalize", () => {
    // Malicious input with bidi override
    const malicious = "مرحبا\u202Emalicious\u202Cبكم";

    // STEP 1: Sanitize
    const sanitized = sanitizeArabicInput(malicious);
    expect(sanitized).not.toContain("\u202E"); // Bidi override removed
    expect(sanitized).not.toContain("\u202C"); // Pop removed
    expect(sanitized).toBe("مرحباmaliciousبكم");

    // STEP 2: Validate
    const validation = validateArabicText(sanitized);
    expect(validation.isValid).toBe(true);
    expect(validation.threats.length).toBe(0);

    // STEP 3: Normalize
    const { text, modified } = normalizeArabic(sanitized, {
      normalizeVariants: true,
      removeDiacritics: false,
    });
    expect(text).toBe("مرحباmaliciousبكم");
    expect(modified).toBe(false); // Already normalized
  });

  test("Iraqi dialect text preserves Kurdish characters", () => {
    const iraqiText = "چاي گرم بڤا"; // Hot tea please (Kurdish-influenced)

    // Verify Kurdish characters present
    expect(iraqiText).toContain("چ");
    expect(iraqiText).toContain("گ");
    expect(iraqiText).toContain("ڤ");

    // Sanitize
    const sanitized = sanitizeArabicInput(iraqiText);
    expect(sanitized).toContain("چ");
    expect(sanitized).toContain("گ");
    expect(sanitized).toContain("ڤ");

    // Normalize
    const { text } = normalizeArabic(sanitized);
    expect(text).toContain("چ");
    expect(text).toContain("گ");
    expect(text).toContain("ڤ");

    // Verify character detection
    expect(isIraqiKurdishChar("چ")).toBe(true);
    expect(isIraqiKurdishChar("گ")).toBe(true);
    expect(isIraqiKurdishChar("ڤ")).toBe(true);
  });

  test("Performance: <50ms for 1000-character text", () => {
    const longText = "مرحبا بكم في نظام الذكاء الاصطناعي العراقي ".repeat(30);
    expect(longText.length).toBeGreaterThan(1000);

    const start = performance.now();
    const { text, processingTime } = normalizeArabic(longText);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
    expect(processingTime).toBeLessThan(50);
    expect(text.length).toBeGreaterThan(0);
  });

  test("Mixed Arabic-English content handling", () => {
    const mixed =
      "Name: أحمد محمد, Email: ahmed@example.com, Phone: +964 123 456";

    const sanitized = sanitizeArabicInput(mixed);
    const validation = validateArabicText(sanitized);
    expect(validation.isValid).toBe(true);

    const measurement = measureString(sanitized);
    expect(measurement.codepoints).toBeGreaterThan(0);
    expect(measurement.graphemes).toBeGreaterThan(0);
    expect(measurement.words).toBeGreaterThan(5);
  });

  test("Security: Bidi attack prevention", () => {
    const attacks = [
      "test\u202Emalicious", // RLO attack
      "test\u202Dmalicious", // LRO attack
      "\u202Aاليمين\u202C", // LRE/PDF attack
    ];

    for (const attack of attacks) {
      const validation = validateArabicText(attack);
      expect(validation.isValid).toBe(false);
      expect(validation.threats.length).toBeGreaterThan(0);
      expect(validation.threats[0].type).toBe("bidi-override");

      const sanitized = sanitizeArabicInput(attack);
      expect(sanitized).not.toContain("\u202E");
      expect(sanitized).not.toContain("\u202D");
      expect(sanitized).not.toContain("\u202A");
      expect(sanitized).not.toContain("\u202C");
    }
  });

  test("Diacritic removal preserves base text", () => {
    const withDiacritics = "مُحَمَّد"; // Muhammad with diacritics
    const { text } = normalizeArabic(withDiacritics, {
      removeDiacritics: true,
    });

    expect(text).toBe("محمد"); // Without diacritics
    expect(text.length).toBeLessThan(withDiacritics.length);
  });

  test("Character variant normalization", () => {
    const variants = "أحمد إبراهيم آدم"; // Different alef variants
    const { text } = normalizeArabic(variants, {
      normalizeVariants: true,
    });

    expect(text).toBe("احمد ابراهيم ادم"); // All alefs normalized
  });

  test("Empty and whitespace handling", () => {
    const empty = "";
    const whitespace = "   ";

    const validation1 = validateArabicText(empty);
    expect(validation1.isValid).toBe(false);
    expect(validation1.errors[0].code).toBe("EMPTY_TEXT");

    const validation2 = validateArabicText(whitespace);
    expect(validation2.isValid).toBe(false);
    expect(validation2.errors[0].code).toBe("EMPTY_TEXT");
  });

  test("Batch processing", () => {
    const texts = ["مرحبا", "test\u202E", "أحمد", "چاي"];

    const results = texts.map((t) => validateArabicText(t));
    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(false); // Bidi attack
    expect(results[2].isValid).toBe(true);
    expect(results[3].isValid).toBe(true);
  });
});
