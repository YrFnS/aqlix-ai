import { describe, test, expect } from "bun:test";
import {
  detectDialect,
  isIraqiDialect,
  validateDialectAccuracy,
  getDialectConfidence,
} from "../dialect-recognition";

describe("Dialect Recognition", () => {
  describe("detectDialect", () => {
    test("detects Iraqi dialect", () => {
      const iraqiPhrases = ["شلونك؟", "شكو ماكو؟", "زين، الحمد لله"];

      iraqiPhrases.forEach((phrase) => {
        const result = detectDialect(phrase);
        expect(result).toBe("iraqi");
      });
    });

    test("detects Standard Arabic", () => {
      const standardArabic = "كيف حالك؟ أنا بخير";
      const result = detectDialect(standardArabic);

      expect(result).toBe("standard");
    });

    test("handles mixed dialects", () => {
      const mixedText = "شلونك؟ كيف حالك؟";
      const result = detectDialect(mixedText);

      expect(["iraqi", "mixed"]).toContain(result);
    });
  });

  describe("isIraqiDialect", () => {
    test("identifies Iraqi-specific words", () => {
      const iraqiWords = ["شلون", "ماكو", "وية", "صدك"];

      iraqiWords.forEach((word) => {
        expect(isIraqiDialect(word)).toBe(true);
      });
    });

    test("rejects non-Iraqi dialect", () => {
      const otherDialects = [
        "إزيك", // Egyptian
        "كيفك", // Levantine
        "لباس", // Moroccan
      ];

      otherDialects.forEach((word) => {
        expect(isIraqiDialect(word)).toBe(false);
      });
    });
  });

  describe("validateDialectAccuracy", () => {
    test("validates dialect detection accuracy", () => {
      const testCases = [
        { text: "شلونك؟", expectedDialect: "iraqi" },
        { text: "كيف حالك؟", expectedDialect: "standard" },
      ];

      testCases.forEach(({ text, expectedDialect }) => {
        const result = validateDialectAccuracy(text, expectedDialect);
        expect(result.isAccurate).toBe(true);
        expect(result.accuracy).toBeGreaterThan(0.8);
      });
    });
  });

  describe("getDialectConfidence", () => {
    test("returns high confidence for clear Iraqi dialect", () => {
      const clearIraqi = "شلونك؟ شكو ماكو؟";
      const confidence = getDialectConfidence(clearIraqi, "iraqi");

      expect(confidence).toBeGreaterThan(0.9);
    });

    test("returns lower confidence for ambiguous text", () => {
      const ambiguous = "مرحبا";
      const confidence = getDialectConfidence(ambiguous, "iraqi");

      expect(confidence).toBeLessThan(0.7);
    });
  });
});
