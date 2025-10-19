import { describe, test, expect } from "bun:test";
import {
  normalizeArabicText,
  removeArabicDiacritics,
  convertToArabicNumerals,
  validateArabicEncoding,
} from "../text-processing";

describe("Text Processing", () => {
  describe("normalizeArabicText", () => {
    test("normalizes Arabic characters", () => {
      const text = "مرحبا";
      const normalized = normalizeArabicText(text);

      expect(normalized).toBeDefined();
      expect(normalized.length).toBeGreaterThan(0);
    });

    test("handles mixed Arabic-English", () => {
      const text = "Testing مرحبا 123";
      const normalized = normalizeArabicText(text);

      expect(normalized).toContain("Testing");
      expect(normalized).toContain("مرحبا");
    });
  });

  describe("removeArabicDiacritics", () => {
    test("removes diacritical marks", () => {
      const textWithDiacritics = "مَرْحَبًا";
      const result = removeArabicDiacritics(textWithDiacritics);

      expect(result).toBe("مرحبا");
    });
  });

  describe("convertToArabicNumerals", () => {
    test("converts Western to Eastern Arabic numerals", () => {
      const western = "123";
      const eastern = convertToArabicNumerals(western);

      expect(eastern).toBe("١٢٣");
    });
  });

  describe("validateArabicEncoding", () => {
    test("validates UTF-8 encoding", () => {
      const text = "مرحبا";
      const result = validateArabicEncoding(text);

      expect(result.isValid).toBe(true);
      expect(result.encoding).toBe("utf-8");
    });
  });
});
