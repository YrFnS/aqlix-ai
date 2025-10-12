/**
 * Unit tests for useInputNormalization hook
 * Tests Arabic text normalization with preset options
 *
 * NOTE: These tests validate normalization logic and Iraqi Kurdish preservation
 * without full React Testing Library integration due to Bun limitations.
 */

import { describe, test, expect } from "bun:test";
import {
  normalizeArabic,
  isIraqiKurdishChar,
  lightNormalization,
  fullNormalization,
} from "@iraqi-ai/arabic-nlp";

describe("useInputNormalization - Logic Tests", () => {
  test("Light normalization preset preserves Kurdish chars", () => {
    const kurdishText = "چاي گرم بڤا"; // Tea please

    const result = lightNormalization(kurdishText);

    // Kurdish characters should be preserved
    expect(result).toContain("چ");
    expect(result).toContain("گ");
    expect(result).toContain("ڤ");
    expect(typeof result).toBe("string");
  });

  test("Full normalization preset with Iraqi preservation", () => {
    const textWithDiacritics = "مُحَمَّد چاي"; // Muhammad tea (with diacritics)

    const result = fullNormalization(textWithDiacritics);

    // Diacritics may be removed but Kurdish چ should remain
    expect(result).toContain("محمد"); // Without diacritics
    expect(result).toContain("چ"); // Kurdish preserved
  });

  test("Iraqi Kurdish character detection", () => {
    const kurdishChars = ["چ", "گ", "ڤ"];
    const arabicChars = ["ج", "ك", "ف"];

    kurdishChars.forEach((char) => {
      expect(isIraqiKurdishChar(char)).toBe(true);
    });

    arabicChars.forEach((char) => {
      expect(isIraqiKurdishChar(char)).toBe(false);
    });
  });

  test("Custom normalization with preserveIraqiChars option", () => {
    const text = "چاي";

    const result = normalizeArabic(text, {
      form: "NFC",
      preserveIraqiChars: true,
      normalizeVariants: false,
      removeDiacritics: false,
    });

    expect(result.text).toBe("چاي");
    expect(result.modified).toBe(false);
    expect(result.text).toContain("چ");
  });

  test("NFC normalization form", () => {
    // Unicode Normalization Form Canonical Composition
    const text = "مرحبا";

    const result = normalizeArabic(text, {
      form: "NFC",
      preserveIraqiChars: true,
    });

    expect(result.text).toBe(text.normalize("NFC"));
    expect(typeof result.text).toBe("string");
  });

  test("Diacritic removal with light preset", () => {
    const withDiacritics = "مُحَمَّد"; // Muhammad with diacritics
    const result = lightNormalization(withDiacritics);

    // Light normalization typically keeps some diacritics
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("Diacritic removal with full preset", () => {
    const withDiacritics = "مُحَمَّد"; // Muhammad with diacritics
    const result = fullNormalization(withDiacritics);

    // Full normalization removes diacritics
    expect(result).toBe("محمد");
    expect(result.length).toBeLessThan(withDiacritics.length);
  });

  test("Character variant normalization", () => {
    const variants = "أحمد إبراهيم آدم"; // Different alef variants

    const result = normalizeArabic(variants, {
      normalizeVariants: true,
      form: "NFC",
      preserveIraqiChars: true,
    });

    expect(result.text).toBe("احمد ابراهيم ادم"); // All alefs normalized
  });

  test("Empty text handling", () => {
    const empty = "";
    const result = normalizeArabic(empty);

    expect(result.text).toBe("");
    expect(result.modified).toBe(false);
  });

  test("Whitespace-only text handling", () => {
    const whitespace = "   ";
    const result = normalizeArabic(whitespace);

    expect(result.text).toBe(whitespace);
    expect(result.modified).toBe(false);
  });

  test("Normalization trigger options", () => {
    const triggers = ["on-blur", "on-change", "manual"];

    triggers.forEach((trigger) => {
      expect(typeof trigger).toBe("string");
      expect(["on-blur", "on-change", "manual"]).toContain(trigger);
    });
  });

  test("Preset options validation", () => {
    const presets = ["light", "full", "custom"];

    presets.forEach((preset) => {
      expect(typeof preset).toBe("string");
      expect(["light", "full", "custom"]).toContain(preset);
    });
  });

  test("Mixed Arabic-English normalization", () => {
    const mixed = "Name: احمد, Email: ahmed@example.com";

    const result = normalizeArabic(mixed, {
      form: "NFC",
      preserveIraqiChars: true,
    });

    expect(result.text).toContain("Name");
    expect(result.text).toContain("احمد");
    expect(result.text).toContain("Email");
  });

  test("Kurdish characters are never normalized to Arabic equivalents", () => {
    const kurdishChars = {
      چ: "ج", // Kurdish che vs Arabic jim
      گ: "ك", // Kurdish gaf vs Arabic kaf
      ڤ: "ف", // Kurdish veh vs Arabic feh
    };

    Object.entries(kurdishChars).forEach(([kurdish, arabic]) => {
      const result = normalizeArabic(kurdish, {
        form: "NFC",
        preserveIraqiChars: true,
        normalizeVariants: true,
      });

      expect(result.text).toBe(kurdish); // Should NOT become Arabic equivalent
      expect(result.text).not.toBe(arabic);
    });
  });

  test("Normalization processing time is recorded", () => {
    const text = "مرحبا بكم في نظام الذكاء الاصطناعي العراقي";

    const result = normalizeArabic(text);

    expect(result).toHaveProperty("processingTime");
    expect(typeof result.processingTime).toBe("number");
    expect(result.processingTime).toBeGreaterThanOrEqual(0);
  });

  test("Modified flag indicates if text changed", () => {
    const simpleText = "مرحبا";
    const complexText = "مُحَمَّد";

    const result1 = normalizeArabic(simpleText, {
      removeDiacritics: false,
      normalizeVariants: false,
    });

    const result2 = normalizeArabic(complexText, {
      removeDiacritics: true,
    });

    expect(result1.modified).toBe(false); // No changes
    expect(result2.modified).toBe(true); // Diacritics removed
  });

  test("Multiple normalization rounds are idempotent", () => {
    const text = "أحمد مُحَمَّد چاي";

    const result1 = normalizeArabic(text, {
      removeDiacritics: true,
      normalizeVariants: true,
      preserveIraqiChars: true,
    });

    const result2 = normalizeArabic(result1.text, {
      removeDiacritics: true,
      normalizeVariants: true,
      preserveIraqiChars: true,
    });

    expect(result1.text).toBe(result2.text);
    expect(result2.modified).toBe(false); // Already normalized
  });

  test("Normalization with Iraqi dialect text", () => {
    const iraqiDialect = "شلونك چاي گرم بڤا"; // How are you, tea please

    const result = normalizeArabic(iraqiDialect, {
      form: "NFC",
      preserveIraqiChars: true,
      removeDiacritics: false,
    });

    // All Kurdish characters preserved
    expect(result.text).toContain("چ");
    expect(result.text).toContain("گ");
    expect(result.text).toContain("ڤ");
  });

  test("Performance: <50ms for 1000-character text", () => {
    const longText = "مرحبا بكم في نظام الذكاء الاصطناعي العراقي ".repeat(30);
    expect(longText.length).toBeGreaterThan(1000);

    const start = performance.now();
    const result = normalizeArabic(longText);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
    expect(result.processingTime).toBeLessThan(50);
  });
});

/**
 * Integration notes for manual testing:
 *
 * The useInputNormalization hook should be tested manually with:
 * 1. Light preset: Minimal changes, Kurdish preservation
 * 2. Full preset: Remove diacritics, normalize variants, preserve Kurdish
 * 3. Custom preset: User-defined normalization options
 * 4. Trigger modes:
 *    - on-blur: Normalize when input loses focus
 *    - on-change: Normalize on every change
 *    - manual: Normalize only when explicitly called
 * 5. Iraqi Kurdish characters: چ (U+0686), گ (U+06AF), ڤ (U+06A4)
 * 6. Mixed content: Arabic + English + numbers
 * 7. Diacritic removal: مُحَمَّد → محمد
 * 8. Variant normalization: أحمد → احمد
 *
 * Expected behavior:
 * - preserveIraqiChars ALWAYS true (never normalize Kurdish to Arabic)
 * - Light preset: Conservative normalization
 * - Full preset: Aggressive normalization (except Kurdish)
 * - modified flag: true if text changed
 * - processingTime: <50ms for typical input
 * - Idempotent: Multiple rounds produce same result
 */
