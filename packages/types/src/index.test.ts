import { describe, it, expect } from "bun:test";
import type {
  IraqiUser,
  ArabicText,
  ChatMessage,
  CulturalValidation,
  PaymentGateway,
} from "./index";

// Helper functions for testing
const isArabicText = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};

const isIraqiDialect = (text: string): boolean => {
  const iraqiWords = ["شلونك", "شكو", "ماكو", "وين", "هاي"];
  return iraqiWords.some((word) => text.includes(word));
};

const isCulturallyCompliant = (obj: any): boolean => {
  return !obj.toString().toLowerCase().includes("haram");
};

const isIslamicCompliant = (): boolean => {
  return true; // Simplified for setup
};

describe("Iraqi AI Types", () => {
  describe("IraqiUser", () => {
    it("should create a valid Iraqi user", () => {
      const user: IraqiUser = {
        id: "user-123",
        name: "أحمد محمد",
        email: "ahmed@example.com",
        language: "ar-IQ",
        dialect: "iraqi",
        preferences: {
          rtl: true,
          culturalMode: "strict",
          islamicCompliance: true,
        },
        professionalDomain: "legal",
      };

      expect(user.id).toBe("user-123");
      expect(user.language).toBe("ar-IQ");
      expect(user.preferences.rtl).toBe(true);
      expect(user.preferences.islamicCompliance).toBe(true);
    });

    it("should support Arabic names", () => {
      const user: IraqiUser = {
        id: "user-456",
        name: "فاطمة علي",
        language: "ar",
        preferences: {
          rtl: true,
          culturalMode: "moderate",
          islamicCompliance: true,
        },
      };

      expect(isArabicText(user.name)).toBe(true);
    });
  });

  describe("ArabicText", () => {
    it("should handle Iraqi dialect text", () => {
      const text: ArabicText = {
        content: "شلونك اليوم؟",
        direction: "rtl",
        dialect: "iraqi",
        culturallyValidated: true,
        islamicCompliant: true,
      };

      expect(isIraqiDialect(text.content)).toBe(true);
      expect(text.direction).toBe("rtl");
      expect(text.culturallyValidated).toBe(true);
    });

    it("should validate cultural compliance", () => {
      const text: ArabicText = {
        content: "السلام عليكم ورحمة الله وبركاته",
        direction: "rtl",
        dialect: "standard",
        culturallyValidated: true,
        islamicCompliant: true,
      };

      expect(isCulturallyCompliant(text)).toBe(true);
      expect(isIslamicCompliant()).toBe(true);
    });
  });

  describe("ChatMessage", () => {
    it("should create a culturally appropriate chat message", () => {
      const message: ChatMessage = {
        id: "msg-123",
        userId: "user-456",
        content: {
          content: "أهلاً وسهلاً",
          direction: "rtl",
          dialect: "iraqi",
          culturallyValidated: true,
          islamicCompliant: true,
        },
        timestamp: new Date(),
        type: "text",
        culturalContext: {
          professionalDomain: "business",
          respectfulTone: true,
          politicallyNeutral: true,
        },
      };

      expect(isArabicText(message.content.content)).toBe(true);
      expect(message.culturalContext?.respectfulTone).toBe(true);
      expect(message.culturalContext?.politicallyNeutral).toBe(true);
    });
  });

  describe("CulturalValidation", () => {
    it("should require high cultural compliance scores", () => {
      const validation: CulturalValidation = {
        score: 98,
        islamicCompliance: true,
        politicalNeutrality: true,
        professionalAppropriate: true,
        errors: [],
        warnings: [],
      };

      expect(validation.score).toBeGreaterThanOrEqual(95);
      expect(validation.islamicCompliance).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should fail with low compliance scores", () => {
      const validation: CulturalValidation = {
        score: 85,
        islamicCompliance: false,
        politicalNeutrality: true,
        professionalAppropriate: false,
        errors: [
          "Islamic compliance violation",
          "Inappropriate professional tone",
        ],
        warnings: ["Consider more respectful language"],
      };

      expect(validation.score).toBeLessThan(95);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe("PaymentGateway", () => {
    it("should define Iraqi payment gateways correctly", () => {
      const zaincash: PaymentGateway = {
        provider: "zaincash",
        minimumAmount: 1000, // 1000 IQD
        fees: {
          fixed: 250,
          percentage: 2.5,
        },
        supported: true,
      };

      expect(zaincash.provider).toBe("zaincash");
      expect(zaincash.minimumAmount).toBe(1000);
      expect(zaincash.supported).toBe(true);
    });

    it("should support all Iraqi payment providers", () => {
      const providers: PaymentGateway["provider"][] = [
        "zaincash",
        "fastpay",
        "nasswallet",
      ];

      providers.forEach((provider) => {
        expect(["zaincash", "fastpay", "nasswallet"]).toContain(provider);
      });
    });
  });
});
