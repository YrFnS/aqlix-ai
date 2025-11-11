/**
 * Custom matcher to check if content is culturally appropriate for Iraqi context
 * Part of Bun test framework extension for Iraqi AI testing
 */

import { expect } from "bun:test";

/**
 * Placeholder validation function
 * This will be replaced with real implementation from @iraqi-ai/cultural-validators
 * in Task 6 when that package is created
 */
async function validateCulturalContent(content: string): Promise<{
  score: number;
  violations: string[];
  recommendations: string[];
  islamicCompliant: boolean;
  politicallyNeutral: boolean;
}> {
  // TEMPORARY PLACEHOLDER IMPLEMENTATION
  // This will be replaced with real validation in Task 6

  // Simple heuristic checks for demo purposes
  const hasIslamicGreeting =
    content.includes("السلام عليكم") ||
    content.includes("بسم الله") ||
    content.includes("الحمد لله");

  const hasPoliticalContent =
    content.includes("حزب") ||
    content.includes("سياسي") ||
    content.includes("طائفي");

  const hasInappropriateContent =
    content.toLowerCase().includes("alcohol") ||
    content.toLowerCase().includes("pork");

  const score = hasIslamicGreeting
    ? 1.0
    : hasInappropriateContent
      ? 0.3
      : hasPoliticalContent
        ? 0.7
        : 0.85;

  return {
    score,
    violations: hasInappropriateContent
      ? ["Content contains culturally inappropriate references"]
      : [],
    recommendations: score < 0.9 ? ["Consider adding Islamic greetings"] : [],
    islamicCompliant: !hasInappropriateContent,
    politicallyNeutral: !hasPoliticalContent,
  };
}

/**
 * Checks if content is culturally appropriate for Iraqi context
 *
 * @param threshold - Minimum cultural appropriateness score (0.0 - 1.0), default: 0.95
 *
 * @example
 * ```typescript
 * await expect("السلام عليكم").toBeCulturallyAppropriate(); // passes
 * await expect("السلام عليكم").toBeCulturallyAppropriate(0.95); // passes with custom threshold
 * ```
 */
export async function toBeCulturallyAppropriate(
  this: any,
  received: unknown,
  threshold: number = 0.95,
) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () =>
        `toBeCulturallyAppropriate requires a string, received: ${typeof received}`,
    };
  }

  try {
    const validation = await validateCulturalContent(received);
    const pass = validation.score >= threshold;

    return {
      pass,
      message: () =>
        pass
          ? `Expected content not to be culturally appropriate (score: ${validation.score.toFixed(2)})`
          : `Expected content to be culturally appropriate with score >= ${threshold}, but got ${validation.score.toFixed(2)}\n` +
            (validation.violations.length > 0
              ? `  Violations:\n    - ${validation.violations.join("\n    - ")}\n`
              : "") +
            (validation.recommendations.length > 0
              ? `  Recommendations:\n    - ${validation.recommendations.join("\n    - ")}`
              : ""),
    };
  } catch (error: any) {
    return {
      pass: false,
      message: () =>
        `Failed to validate cultural appropriateness: ${error.message}`,
    };
  }
}

/**
 * Checks if content is politically neutral
 */
export async function toBePoliticallyNeutral(this: any, received: unknown) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () => `toBePoliticallyNeutral requires a string`,
    };
  }

  try {
    const validation = await validateCulturalContent(received);
    const pass = validation.politicallyNeutral;

    return {
      pass,
      message: () =>
        pass
          ? `Expected content not to be politically neutral`
          : `Expected content to be politically neutral\n` +
            `  Content may contain sectarian, political, or tribal references`,
    };
  } catch (error: any) {
    return {
      pass: false,
      message: () =>
        `Failed to validate political neutrality: ${error.message}`,
    };
  }
}

/**
 * Checks if content respects Iraqi family values
 */
export async function toRespectIraqiFamilyValues(this: any, received: unknown) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () => `toRespectIraqiFamilyValues requires a string`,
    };
  }

  // Simple heuristic check
  const hasDisrespectfulContent =
    received.toLowerCase().includes("divorce") &&
    !received.includes("استشارة") && // Unless it's consultation context
    !received.includes("قانوني"); // or legal context

  const pass = !hasDisrespectfulContent;

  return {
    pass,
    message: () =>
      pass
        ? `Expected content not to respect Iraqi family values`
        : `Expected content to respect Iraqi family values\n` +
          `  Content may contain references that conflict with family values`,
  };
}

// Register matchers with Bun test
expect.extend({
  toBeCulturallyAppropriate,
  toBePoliticallyNeutral,
  toRespectIraqiFamilyValues,
});
