export interface IraqiUser {
  id: string;
  name: string;
  email?: string;
  language: "ar" | "en" | "ar-IQ";
  dialect?: "iraqi" | "standard";
  preferences: {
    rtl: boolean;
    culturalMode: "strict" | "moderate" | "flexible";
    islamicCompliance: boolean;
  };
  professionalDomain?:
    | "legal"
    | "medical"
    | "educational"
    | "engineering"
    | "business";
}
export interface ArabicText {
  content: string;
  direction: "rtl" | "ltr";
  dialect?: "iraqi" | "standard";
  culturallyValidated: boolean;
  islamicCompliant: boolean;
}
export interface ChatMessage {
  id: string;
  userId: string;
  content: ArabicText;
  timestamp: Date;
  type: "text" | "image" | "voice" | "document";
  culturalContext?: {
    professionalDomain?: string;
    respectfulTone: boolean;
    politicallyNeutral: boolean;
  };
}
export interface CulturalValidation {
  score: number;
  islamicCompliance: boolean;
  politicalNeutrality: boolean;
  professionalAppropriate: boolean;
  errors: string[];
  warnings: string[];
}
export interface PaymentGateway {
  provider: "zaincash" | "fastpay" | "nasswallet";
  minimumAmount: number;
  fees: {
    fixed: number;
    percentage: number;
  };
  supported: boolean;
}
export type LanguageCode = "ar" | "en" | "ar-IQ";
export type DialectCode = "iraqi" | "standard";
export type TextDirection = "rtl" | "ltr";
export * from "./env";
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  CompositeTypes,
} from "./database.types";
//# sourceMappingURL=index.d.ts.map
