import { describe, test, expect } from "bun:test";
import {
  validateArabicFontRendering,
  checkFontSupport,
  assertGlyphCorrectness,
} from "../font-rendering";

describe("Font Rendering", () => {
  describe("validateArabicFontRendering", () => {
    test("validates Arabic font rendering quality", () => {
      const result = validateArabicFontRendering("مرحبا");

      expect(result.isSupported).toBe(true);
      expect(result.quality).toBeGreaterThan(0.8);
    });
  });

  describe("checkFontSupport", () => {
    test("checks Arabic font availability", () => {
      const arabicFonts = ["Cairo", "Tajawal", "Amiri"];

      arabicFonts.forEach((font) => {
        const result = checkFontSupport(font);
        expect(result).toBeDefined();
      });
    });
  });

  describe("assertGlyphCorrectness", () => {
    test("validates glyph rendering", () => {
      const text = "مرحبا";
      expect(() => assertGlyphCorrectness(text)).not.toThrow();
    });
  });
});
