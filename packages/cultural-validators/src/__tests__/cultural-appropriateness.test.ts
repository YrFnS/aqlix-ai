import { describe, test, expect } from "bun:test";
import {
  validateCulturalAppropriateness,
  checkIraqiCustoms,
  validateSocialEtiquette,
  checkGenderSensitivity,
} from "../cultural-appropriateness";

describe("Cultural Appropriateness Validators", () => {
  describe("validateCulturalAppropriateness", () => {
    test("accepts culturally appropriate content with Islamic greeting", async () => {
      const appropriateContent = [
        "السلام عليكم، احترام الكبار واجب",
        "بسم الله، الضيافة العراقية معروفة",
        "الحمد لله، نحترم جميع الثقافات",
      ];

      for (const content of appropriateContent) {
        const result = await validateCulturalAppropriateness(content);
        expect(result.appropriate).toBe(true);
        expect(result.score).toBeGreaterThan(0.7);
      }
    });

    test("accepts content without Islamic greeting but politically neutral", async () => {
      const neutralContent = "نحن نخدم جميع العراقيين";
      const result = await validateCulturalAppropriateness(neutralContent);

      expect(result.appropriate).toBeDefined();
      expect(result.score).toBeGreaterThan(0);
    });

    test("validates family value alignment", async () => {
      const familyContent = "بسم الله، الأسرة هي أساس المجتمع";
      const result = await validateCulturalAppropriateness(familyContent);

      expect(result.appropriate).toBe(true);
      expect(result.score).toBeGreaterThan(0.7);
    });
  });

  describe("checkIraqiCustoms", () => {
    test("validates Iraqi hospitality references", () => {
      const hospitalityContent = "الضيافة العراقية معروفة";
      const result = checkIraqiCustoms(hospitalityContent);

      expect(result.aligned).toBe(true);
      expect(result.customs).toContain("hospitality");
    });

    test("validates respect for elders", () => {
      const respectContent = "احترام الكبار من عاداتنا";
      const result = checkIraqiCustoms(respectContent);

      expect(result.aligned).toBe(true);
      expect(result.customs).toContain("respect_for_elders");
    });

    test("detects content without Iraqi customs", () => {
      const neutralContent = "general content";
      const result = checkIraqiCustoms(neutralContent);

      expect(result.aligned).toBe(false);
      expect(result.customs.length).toBe(0);
    });
  });

  describe("validateSocialEtiquette", () => {
    test("validates proper greetings", () => {
      const greetings = ["أهلا وسهلا", "تشرفنا", "حياك الله"];

      greetings.forEach((greeting) => {
        const result = validateSocialEtiquette(greeting);
        expect(result.isAppropriate).toBe(true);
      });
    });

    test("validates formal language for professional contexts", () => {
      const formalContent = "نود أن نعرب عن تقديرنا";
      const result = validateSocialEtiquette(formalContent);

      expect(result.isAppropriate).toBe(true);
      expect(result.violations.length).toBe(0);
    });

    test("detects rude or impolite language", () => {
      const rudeContent = "shut up stupid";
      const result = validateSocialEtiquette(rudeContent);

      expect(result.isAppropriate).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });

  describe("checkGenderSensitivity", () => {
    test("validates gender-neutral professional language", () => {
      const neutralContent = "الموظف أو الموظفة";
      const result = checkGenderSensitivity(neutralContent);

      expect(result.isSensitive).toBe(true);
    });

    test("validates culturally appropriate gender references", () => {
      const appropriateContent = "سيدة محترمة";
      const result = checkGenderSensitivity(appropriateContent);

      expect(result.isSensitive).toBe(true);
      expect(result.issues.length).toBe(0);
    });

    test("detects gender-insensitive language", () => {
      const insensitiveContent = "only men can do this";
      const result = checkGenderSensitivity(insensitiveContent);

      expect(result.isSensitive).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    test("validates family role respect", () => {
      const familyContent = "دور الأم والأب في الأسرة";
      const result = checkGenderSensitivity(familyContent);

      expect(result.isSensitive).toBe(true);
      expect(result.issues.length).toBe(0);
    });
  });
});
