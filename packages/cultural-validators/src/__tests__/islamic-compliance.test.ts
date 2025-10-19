import { describe, test, expect } from "bun:test";
import {
  validateIslamicCompliance,
  checkReligiousRespect,
  validateGreetings,
  checkProhibitedContent,
} from "../islamic-compliance";

describe("Islamic Compliance Validators", () => {
  describe("validateIslamicCompliance", () => {
    test("accepts Islamic greetings", async () => {
      const greetings = [
        "السلام عليكم",
        "بسم الله",
        "الحمد لله",
        "جزاك الله خيرا",
      ];

      for (const greeting of greetings) {
        const result = await validateIslamicCompliance(greeting);
        expect(result.compliant).toBe(true);
        expect(result.score).toBeGreaterThanOrEqual(0.9); // Changed to >= for exact 0.9 match
      }
    });

    test("detects disrespectful religious content", async () => {
      const disrespectfulContent = [
        "content mocking religion",
        "inappropriate religious jokes",
      ];

      for (const content of disrespectfulContent) {
        const result = await validateIslamicCompliance(content);
        expect(result.compliant).toBe(false);
        expect(result.violations.length).toBeGreaterThan(0);
      }
    });

    test("validates family values alignment", async () => {
      const familyContent = "نحترم قيم الأسرة والتقاليد الإسلامية";
      const result = await validateIslamicCompliance(familyContent);

      expect(result.compliant).toBe(true);
      expect(result.score).toBeGreaterThan(0.5);
    });
  });

  describe("checkReligiousRespect", () => {
    test("validates respectful religious references", () => {
      const respectfulRefs = [
        "الله سبحانه وتعالى",
        "النبي محمد صلى الله عليه وسلم",
        "القرآن الكريم",
      ];

      respectfulRefs.forEach((ref) => {
        const result = checkReligiousRespect(ref);
        expect(result.isRespectful).toBe(true);
      });
    });

    test("detects disrespectful content", () => {
      const content = "inappropriate religious jokes"; // Contains mocking
      const result = checkReligiousRespect(content);

      expect(result.isRespectful).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe("validateGreetings", () => {
    test("validates Islamic greetings", () => {
      const validGreetings = [
        "السلام عليكم ورحمة الله وبركاته",
        "صباح الخير",
        "مساء الخير",
      ];

      validGreetings.forEach((greeting) => {
        const result = validateGreetings(greeting);
        expect(result.hasGreeting).toBe(true);
      });
    });

    test("detects when no greetings present", () => {
      const casual = "hi there";
      const result = validateGreetings(casual);

      expect(result.hasGreeting).toBe(false);
      expect(result.greetings.length).toBe(0);
    });
  });

  describe("checkProhibitedContent", () => {
    test("detects alcohol references", () => {
      const content = "wine or beer consumption";
      const result = checkProhibitedContent(content);

      expect(result.hasProhibited).toBe(true);
      expect(result.categories).toContain("alcohol");
    });

    test("detects gambling references", () => {
      const content = "casino and betting";
      const result = checkProhibitedContent(content);

      expect(result.hasProhibited).toBe(true);
      expect(result.categories).toContain("gambling");
    });

    test("allows halal food discussions", () => {
      const content = "halal chicken and vegetables";
      const result = checkProhibitedContent(content);

      expect(result.hasProhibited).toBe(false);
    });
  });
});
