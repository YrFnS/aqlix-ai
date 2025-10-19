import { describe, test, expect } from "bun:test";
import {
  validateProfessionalDomain,
  validateLegalContent,
  validateMedicalContent,
  validateEducationalContent,
} from "../professional-domains";

describe("Professional Domain Validators", () => {
  describe("validateProfessionalDomain", () => {
    test("validates legal domain content", async () => {
      const legalContent = "عقد قانوني وفقا للقانون العراقي";
      const result = await validateProfessionalDomain(legalContent, "legal");

      expect(result.domain).toBe("legal");
      expect(result.appropriate).toBe(true);
    });

    test("validates medical domain content", async () => {
      const medicalContent = "استشارة طبية حول العلاج";
      const result = await validateProfessionalDomain(
        medicalContent,
        "medical",
      );

      expect(result.domain).toBe("medical");
      expect(result.appropriate).toBeDefined();
    });

    test("validates educational domain content", async () => {
      const eduContent = "منهج دراسي للجامعات العراقية";
      const result = await validateProfessionalDomain(
        eduContent,
        "educational",
      );

      expect(result.domain).toBe("educational");
      expect(result.appropriate).toBeDefined();
    });
  });

  describe("validateLegalContent", () => {
    test("validates Iraqi legal terminology", () => {
      const legalTerms = [
        "المحكمة الاتحادية",
        "القانون المدني العراقي",
        "عقد البيع",
      ];

      legalTerms.forEach((term) => {
        const result = validateLegalContent(term);
        expect(result.isValid).toBe(true);
        expect(result.jurisdiction).toBe("iraqi");
      });
    });

    test("detects content lacking legal terminology", () => {
      const generalContent = "hello world";
      const result = validateLegalContent(generalContent);

      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    test("validates legal terminology present", () => {
      const contractLang = "القانون المدني العراقي عقد قانوني";
      const result = validateLegalContent(contractLang);

      expect(result.isValid).toBe(true);
      expect(result.jurisdiction).toBe("iraqi");
    });
  });

  describe("validateMedicalContent", () => {
    test("validates medical terminology", () => {
      const medicalTerms = ["علاج السكري", "فحص الدم", "وصفة طبية"];

      medicalTerms.forEach((term) => {
        const result = validateMedicalContent(term);
        expect(result.isValid).toBe(true);
      });
    });

    test("detects content requiring medical disclaimer", () => {
      const healthAdvice = "استشر طبيب يجب تناول هذا الدواء يوميا";
      const result = validateMedicalContent(healthAdvice);

      expect(result.isValid).toBe(true);
      expect(result.hasDisclaimer).toBe(true);
    });

    test("detects content lacking medical disclaimer", () => {
      const prescription = "خذ حبتين ثلاث مرات يوميا";
      const result = validateMedicalContent(prescription);

      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe("validateEducationalContent", () => {
    test("validates Iraqi curriculum terminology", () => {
      const curriculumTerms = [
        "المنهج الدراسي",
        "الصف السادس الابتدائي",
        "الجامعة",
      ];

      curriculumTerms.forEach((term) => {
        const result = validateEducationalContent(term);
        expect(result.isValid).toBe(true);
      });
    });

    test("identifies academic level", () => {
      const content = "طلاب الجامعة في السنة الأولى";
      const result = validateEducationalContent(content);

      expect(result.level).toBe("university");
    });

    test("detects content lacking educational terminology", () => {
      const content = "general discussion";
      const result = validateEducationalContent(content);

      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });
});
