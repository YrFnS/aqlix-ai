/**
 * Core testing types and interfaces for Iraqi AI Chat System
 * Provides type definitions for cultural validation, Arabic testing, and mock configurations
 */

/**
 * Generic test fixture with metadata
 */
export interface TestFixture<T = any> {
  id: string;
  name: string;
  description: string;
  data: T;
  metadata?: Record<string, any>;
}

/**
 * Cultural test case for Islamic compliance and Iraqi appropriateness validation
 */
export interface CulturalTestCase {
  id: string;
  category: "islamic" | "political" | "professional" | "general";
  content: string;
  expectedCompliance: number; // 0.0 - 1.0
  culturalContext: {
    domain?:
      | "legal"
      | "medical"
      | "educational"
      | "engineering"
      | "organizational";
    dialect?: "baghdad" | "basra" | "mosul" | "kurdish" | "standard";
    audience?: "professional" | "general" | "educational";
  };
}

/**
 * Arabic text test case for RTL accuracy and dialect recognition
 */
export interface ArabicTestCase {
  id: string;
  type: "rtl" | "dialect" | "mixed" | "font";
  content: string;
  expectedDirection: "rtl" | "ltr" | "auto";
  expectedDialect?: "baghdad" | "basra" | "mosul" | "kurdish" | "standard";
  expectedRTLAccuracy: number; // 0.0 - 1.0
}

/**
 * Mock service configuration for external dependencies
 */
export interface MockConfig {
  service: "anthropic" | "supabase" | "zaincash" | "fastpay" | "nasswallet";
  responses: Record<string, any>;
  latency?: number; // ms
  failureRate?: number; // 0.0 - 1.0
}

/**
 * Iraqi user fixture for testing user-specific features
 */
export interface IraqiUserFixture {
  id: string;
  name: string;
  nameArabic: string;
  dialect: "baghdad" | "basra" | "mosul" | "kurdish";
  domain:
    | "legal"
    | "medical"
    | "educational"
    | "engineering"
    | "organizational";
  preferences: {
    language: "ar-IQ" | "en-US";
    culturalCompliance: "strict" | "standard" | "relaxed";
  };
}

/**
 * Arabic text fixture for testing text processing
 */
export interface ArabicTextFixture {
  id: string;
  content: string;
  dialect: string;
  type: "formal" | "informal" | "professional" | "casual";
  expectedDirection: "rtl";
  culturallyAppropriate: boolean;
}

/**
 * Cultural validation result
 */
export interface CulturalValidationResult {
  score: number; // 0.0 - 1.0
  islamicCompliant: boolean;
  politicallyNeutral: boolean;
  violations: string[];
  recommendations: string[];
  islamicViolations?: string[];
  politicalViolations?: string[];
}

/**
 * Custom matcher types for Bun test
 * These extend the default Matchers interface
 */
declare module "bun:test" {
  interface Matchers<T> {
    toBeArabicText(): T;
    toBeRTLAligned(): T;
    toBeCulturallyAppropriate(threshold?: number): Promise<T>;
    toBeIslamicallyCompliant(threshold?: number): Promise<T>;
    toMatchIraqiDialect(dialect: string): T;
  }
}
