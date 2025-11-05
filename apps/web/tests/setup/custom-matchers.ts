/**
 * Custom Bun test matchers for Iraqi AI Chat System
 * Extends expect with Iraqi-specific validation matchers
 */

import { expect } from "bun:test";
import {
  validateCulturalContent,
  type CulturalAppropriatenessResult,
} from "@iraqi-ai/cultural-validators";
import {
  validateRTLLayout,
  validateDialect,
  validateArabicText,
  type RTLLayoutValidation,
} from "@iraqi-ai/arabic-test-utils";

/**
 * Custom matcher: toBeCulturallyAppropriate
 * Validates content for Iraqi cultural appropriateness (95%+ threshold)
 */
expect.extend({
  async toBeCulturallyAppropriate(
    this: any,
    received: string,
    minScore: number = 0.95,
  ) {
    const result: CulturalAppropriatenessResult = await validateCulturalContent(
      received,
      { minScore },
    );

    const pass = result.appropriate && result.score >= minScore;

    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected content NOT to be culturally appropriate, but got score ${result.score.toFixed(2)}`,
      };
    } else {
      const violations = result.violations.join("\n  - ");
      return {
        pass: false,
        message: () =>
          `Expected content to be culturally appropriate (min score: ${minScore}):\n` +
          `  Score: ${result.score.toFixed(2)}\n` +
          `  Islamic Compliant: ${result.islamicCompliant}\n` +
          `  Politically Neutral: ${result.politicallyNeutral}\n` +
          `  Violations:\n  - ${violations}`,
      };
    }
  },
});

/**
 * Custom matcher: toBeIslamicCompliant
 * Validates content for Islamic compliance (90%+ threshold)
 */
expect.extend({
  async toBeIslamicCompliant(
    this: any,
    received: string,
    minScore: number = 0.9,
  ) {
    const result = await validateCulturalContent(received, { minScore });

    const pass = result.islamicCompliant && result.islamicScore >= minScore;

    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected content NOT to be Islamic compliant, but got score ${result.islamicScore.toFixed(2)}`,
      };
    } else {
      const violations = result.islamicViolations?.join("\n  - ") || "None";
      return {
        pass: false,
        message: () =>
          `Expected content to be Islamic compliant (min score: ${minScore}):\n` +
          `  Score: ${result.islamicScore.toFixed(2)}\n` +
          `  Violations:\n  - ${violations}`,
      };
    }
  },
});

/**
 * Custom matcher: toBePoliticallyNeutral
 * Validates content for political neutrality
 */
expect.extend({
  async toBePoliticallyNeutral(this: any, received: string) {
    const result = await validateCulturalContent(received);

    const pass = result.politicallyNeutral;

    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected content NOT to be politically neutral, but it was (score: ${result.politicalScore.toFixed(2)})`,
      };
    } else {
      const violations = result.politicalViolations?.join("\n  - ") || "None";
      return {
        pass: false,
        message: () =>
          `Expected content to be politically neutral:\n` +
          `  Score: ${result.politicalScore.toFixed(2)}\n` +
          `  Violations:\n  - ${violations}`,
      };
    }
  },
});

/**
 * Custom matcher: toHaveRTLLayout
 * Validates element has proper RTL layout (99%+ accuracy)
 */
expect.extend({
  async toHaveRTLLayout(
    this: any,
    received: HTMLElement,
    minScore: number = 0.99,
  ) {
    const validation: RTLLayoutValidation = await validateRTLLayout(
      received,
      5000,
    );

    const pass = validation.score >= minScore;

    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected element NOT to have RTL layout, but got score ${validation.score.toFixed(2)}`,
      };
    } else {
      const violations = validation.violations.join("\n  - ");
      return {
        pass: false,
        message: () =>
          `Expected element to have RTL layout (min score: ${minScore}):\n` +
          `  Score: ${validation.score.toFixed(2)}\n` +
          `  RTL Direction: ${validation.hasRTLDirection}\n` +
          `  Correct Alignment: ${validation.hasCorrectAlignment}\n` +
          `  Arabic Font: ${validation.hasArabicFont}\n` +
          `  Violations:\n  - ${violations}`,
      };
    }
  },
});

/**
 * Custom matcher: toMatchIraqiDialect
 * Validates text matches expected Iraqi dialect (85%+ confidence)
 */
expect.extend({
  toMatchIraqiDialect(
    this: any,
    received: string,
    expectedDialect: "baghdad" | "basra" | "mosul" | "kurdish" | "standard",
    minConfidence: number = 0.85,
  ) {
    const isValid = validateDialect(received, expectedDialect, minConfidence);

    if (isValid) {
      return {
        pass: true,
        message: () =>
          `Expected text NOT to match ${expectedDialect} dialect, but it did`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected text to match ${expectedDialect} dialect with confidence >= ${minConfidence}\n` +
          `  Text: "${received}"`,
      };
    }
  },
});

/**
 * Custom matcher: toBeValidArabicText
 * Validates text is valid Arabic (proper Unicode, no encoding issues)
 */
expect.extend({
  toBeValidArabicText(this: any, received: string) {
    const validation = validateArabicText(received);

    if (validation) {
      return {
        pass: true,
        message: () => `Expected text NOT to be valid Arabic, but it was`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected text to be valid Arabic:\n  Text: "${received}"`,
      };
    }
  },
});

/**
 * TypeScript declarations for custom matchers
 * Using Bun test matcher types (not Jest)
 */
declare module "bun:test" {
  interface Matchers<T = unknown> {
    toBeCulturallyAppropriate(minScore?: number): Promise<T>;
    toBeIslamicCompliant(minScore?: number): Promise<T>;
    toBePoliticallyNeutral(): Promise<T>;
    toHaveRTLLayout(minScore?: number): Promise<T>;
    toMatchIraqiDialect(
      expectedDialect: "baghdad" | "basra" | "mosul" | "kurdish" | "standard",
      minConfidence?: number,
    ): T;
    toBeValidArabicText(): T;
  }
}

export {};
