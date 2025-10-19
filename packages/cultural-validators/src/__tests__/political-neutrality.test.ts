import { describe, test, expect } from "bun:test";
import {
  validatePoliticalNeutrality,
  checkSectarianContent,
  validateTribalSensitivity,
  checkGovernmentReferences,
} from "../political-neutrality";

describe("Political Neutrality Validators", () => {
  describe("validatePoliticalNeutrality", () => {
    test("accepts politically neutral content", async () => {
      const neutralContent = [
        "نقدم خدمات تقنية للجميع",
        "نحن نخدم جميع العراقيين",
        "تطبيق مفيد لكل المواطنين",
      ];

      for (const content of neutralContent) {
        const result = await validatePoliticalNeutrality(content);
        expect(result.neutral).toBe(true);
        expect(result.score).toBeGreaterThan(0.8);
      }
    });

    test("detects political party references", async () => {
      const politicalContent = "political party mention";
      const result = await validatePoliticalNeutrality(politicalContent);

      expect(result.neutral).toBe(false);
      expect(result.violations).toBeDefined();
    });

    test("detects sectarian content", async () => {
      const sectarianContent = "سني شيعي";
      const result = await validatePoliticalNeutrality(sectarianContent);

      expect(result.neutral).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });

  describe("checkSectarianContent", () => {
    test("detects sectarian language", () => {
      const sectarianTerms = ["sectarian division", "سني شيعي"];

      sectarianTerms.forEach((term) => {
        const result = checkSectarianContent(term);
        expect(result.hasSectarian).toBe(true);
        expect(result.patterns.length).toBeGreaterThan(0);
      });
    });

    test("accepts religious unity language", () => {
      const unityContent = "نحن جميعا مسلمون إخوة";
      const result = checkSectarianContent(unityContent);

      expect(result.hasSectarian).toBe(false);
    });
  });

  describe("validateTribalSensitivity", () => {
    test("detects tribal references", () => {
      const tribalContent = "عشيرة قبيلة tribal clan";
      const result = validateTribalSensitivity(tribalContent);

      expect(result.isSensitive).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    test("accepts content without tribal references", () => {
      const neutralContent = "خدمات للمواطنين";
      const result = validateTribalSensitivity(neutralContent);

      expect(result.isSensitive).toBe(false);
    });
  });

  describe("checkGovernmentReferences", () => {
    test("detects political party references", () => {
      const content = "political party mention";
      const result = checkGovernmentReferences(content);

      expect(result.hasReferences).toBe(true);
      expect(result.type).toBe("partisan");
    });

    test("allows neutral government mentions", () => {
      const content = "الحكومة العراقية";
      const result = checkGovernmentReferences(content);

      expect(result.hasReferences).toBe(true);
      expect(result.type).toBe("neutral");
    });
  });
});
