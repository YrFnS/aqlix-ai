import { describe, test, expect } from "bun:test";
import {
  assertRTLDirection,
  assertTextAlignment,
  assertBidirectionalText,
  assertArabicFontLoaded,
} from "../rtl-assertions";

describe("RTL Assertions", () => {
  describe("assertRTLDirection", () => {
    test("validates RTL direction attribute", () => {
      const element = { dir: "rtl" };
      expect(() => assertRTLDirection(element)).not.toThrow();
    });

    test("fails for LTR direction", () => {
      const element = { dir: "ltr" };
      expect(() => assertRTLDirection(element)).toThrow(
        "Expected RTL direction",
      );
    });

    test("validates computed style direction", () => {
      const computedStyle = { direction: "rtl" };
      expect(() => assertRTLDirection(null, computedStyle)).not.toThrow();
    });
  });

  describe("assertTextAlignment", () => {
    test("validates right alignment for Arabic", () => {
      const style = { textAlign: "right" };
      expect(() => assertTextAlignment(style, "arabic")).not.toThrow();
    });

    test("validates left alignment for English", () => {
      const style = { textAlign: "left" };
      expect(() => assertTextAlignment(style, "english")).not.toThrow();
    });

    test("fails when Arabic text is left-aligned", () => {
      const style = { textAlign: "left" };
      expect(() => assertTextAlignment(style, "arabic")).toThrow(
        "Arabic text should be right-aligned",
      );
    });
  });

  describe("assertBidirectionalText", () => {
    test("validates mixed Arabic-English text", () => {
      const text = "Testing مرحبا mixed content";
      const result = assertBidirectionalText(text);

      expect(result.hasArabic).toBe(true);
      expect(result.hasEnglish).toBe(true);
      expect(result.isBidirectional).toBe(true);
    });

    test("detects pure Arabic text", () => {
      const text = "مرحبا كيف حالك؟";
      const result = assertBidirectionalText(text);

      expect(result.hasArabic).toBe(true);
      expect(result.hasEnglish).toBe(false);
      expect(result.isBidirectional).toBe(false);
    });
  });

  describe("assertArabicFontLoaded", () => {
    test("validates Arabic font is loaded", () => {
      const fontFamily = "Cairo, Arial";
      expect(() => assertArabicFontLoaded(fontFamily)).not.toThrow();
    });

    test("fails when no Arabic font present", () => {
      const fontFamily = "Arial, sans-serif";
      expect(() => assertArabicFontLoaded(fontFamily)).toThrow(
        "Arabic font not detected",
      );
    });
  });
});
