/**
 * Custom matcher to check if content is Islamically compliant
 * Part of Bun test framework extension for Iraqi AI testing
 */

import { expect } from "bun:test";

/**
 * Placeholder validation function
 * This will be replaced with real implementation from @iraqi-ai/cultural-validators
 * in Task 6 when that package is created
 */
async function validateIslamicCompliance(content: string): Promise<{
  compliant: boolean;
  score: number;
  violations: string[];
  recommendations: string[];
}> {
  // CRITICAL: This is a placeholder implementation that MUST NOT be used in production
  // Throw error unless explicitly enabled for development/testing
  if (process.env.ENABLE_PLACEHOLDER_VALIDATORS !== "true") {
    throw new Error(
      "Islamic compliance validation not implemented - this is a placeholder that always returns basic heuristic checks. " +
        "Set ENABLE_PLACEHOLDER_VALIDATORS=true to bypass this error for development/testing (NOT FOR PRODUCTION). " +
        "For production use, implement proper validation in @iraqi-ai/cultural-validators package.",
    );
  }

  // TEMPORARY PLACEHOLDER IMPLEMENTATION
  // This will be replaced with real validation in Task 6

  // Simple heuristic checks for demo purposes (NOT PRODUCTION-READY)
  const hasIslamicGreeting =
    content.includes("السلام عليكم") ||
    content.includes("بسم الله") ||
    content.includes("الحمد لله") ||
    content.includes("إن شاء الله") ||
    content.includes("ما شاء الله");

  const hasProhibitedContent =
    content.toLowerCase().includes("alcohol") ||
    content.toLowerCase().includes("pork") ||
    content.toLowerCase().includes("gambling") ||
    content.includes("خمر") ||
    content.includes("لحم خنزير") ||
    content.includes("قمار");

  const hasDisrespectfulContent =
    content.toLowerCase().includes("blasphemy") || content.includes("استهزاء");

  const violations: string[] = [];
  if (hasProhibitedContent) {
    violations.push("Content contains references to prohibited items in Islam");
  }
  if (hasDisrespectfulContent) {
    violations.push("Content contains disrespectful references");
  }

  const compliant = !hasProhibitedContent && !hasDisrespectfulContent;

  const score = compliant ? (hasIslamicGreeting ? 1.0 : 0.9) : 0.3;

  return {
    compliant,
    score,
    violations,
    recommendations:
      !hasIslamicGreeting && compliant
        ? [
            "Consider using Islamic greetings to enhance Islamic appropriateness",
          ]
        : [],
  };
}

/**
 * Checks if content is Islamically compliant
 *
 * @param threshold - Minimum Islamic compliance score (0.0 - 1.0), default: 0.90
 *
 * @example
 * ```typescript
 * await expect("السلام عليكم").toBeIslamicallyCompliant(); // passes
 * await expect("بسم الله الرحمن الرحيم").toBeIslamicallyCompliant(0.95); // passes
 * ```
 */
export async function toBeIslamicallyCompliant(
  this: any,
  received: unknown,
  threshold: number = 0.9,
) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () =>
        `toBeIslamicallyCompliant requires a string, received: ${typeof received}`,
    };
  }

  try {
    const validation = await validateIslamicCompliance(received);
    const pass = validation.compliant && validation.score >= threshold;

    return {
      pass,
      message: () =>
        pass
          ? `Expected content not to be Islamically compliant (score: ${validation.score.toFixed(2)})`
          : `Expected content to be Islamically compliant with score >= ${threshold}, but got ${validation.score.toFixed(2)}\n` +
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
      message: () => `Failed to validate Islamic compliance: ${error.message}`,
    };
  }
}

/**
 * Checks if content contains Islamic greetings
 */
export function toContainIslamicGreeting(this: any, received: unknown) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () => `toContainIslamicGreeting requires a string`,
    };
  }

  const islamicGreetings = [
    "السلام عليكم",
    "بسم الله",
    "الحمد لله",
    "إن شاء الله",
    "ما شاء الله",
    "بارك الله فيك",
    "جزاك الله خيراً",
  ];

  const hasGreeting = islamicGreetings.some((greeting) =>
    received.includes(greeting),
  );

  return {
    pass: hasGreeting,
    message: () =>
      hasGreeting
        ? `Expected content not to contain Islamic greeting`
        : `Expected content to contain Islamic greeting\n` +
          `  Common greetings: ${islamicGreetings.join(", ")}`,
  };
}

/**
 * Checks if content avoids prohibited references
 */
export async function toAvoidProhibitedReferences(
  this: any,
  received: unknown,
) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () => `toAvoidProhibitedReferences requires a string`,
    };
  }

  const validation = await validateIslamicCompliance(received);
  const pass = !validation.violations.some((v) => v.includes("prohibited"));

  return {
    pass,
    message: () =>
      pass
        ? `Expected content to contain prohibited references`
        : `Expected content to avoid prohibited references (alcohol, pork, gambling, etc.)\n` +
          `  Violations: ${validation.violations.join(", ")}`,
  };
}

// Register matchers with Bun test
expect.extend({
  toBeIslamicallyCompliant,
  toContainIslamicGreeting,
  toAvoidProhibitedReferences,
});
