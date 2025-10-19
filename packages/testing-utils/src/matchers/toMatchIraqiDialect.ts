/**
 * Custom matcher to check if text matches specific Iraqi dialect
 * Part of Bun test framework extension for Iraqi AI testing
 */

import { expect } from "bun:test";

/**
 * Iraqi dialect patterns for detection
 */
const DIALECT_PATTERNS = {
  baghdad: [/شلونك/, /شكو ماكو/, /چاي/, /وين رايح/, /هسه/, /زين/],
  basra: [/شخبارك/, /كلشي زين/, /وياي/, /تفضل/, /هواي/],
  mosul: [/كيفك/, /شلون الحال/, /منو/, /هيچ/],
  kurdish: [/چون/, /باش/, /خوش/],
  standard: [/كيف حالك/, /ما هو/, /من فضلك/, /شكراً جزيلاً/],
};

/**
 * Checks if text matches the specified Iraqi dialect
 *
 * @example
 * ```typescript
 * expect("شلونك اليوم؟").toMatchIraqiDialect("baghdad"); // passes
 * expect("شخبارك؟").toMatchIraqiDialect("basra"); // passes
 * ```
 */
export function toMatchIraqiDialect(
  this: any,
  received: string,
  expectedDialect: "baghdad" | "basra" | "mosul" | "kurdish" | "standard",
) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () =>
        `toMatchIraqiDialect requires a string, received: ${typeof received}`,
    };
  }

  const patterns = DIALECT_PATTERNS[expectedDialect];
  if (!patterns) {
    return {
      pass: false,
      message: () =>
        `Invalid dialect: ${expectedDialect}. Valid dialects: baghdad, basra, mosul, kurdish, standard`,
    };
  }

  // Check if any pattern matches
  const matchCount = patterns.filter((pattern) =>
    pattern.test(received),
  ).length;
  const pass = matchCount > 0;

  // Detect which dialect(s) it actually matches
  const detectedDialects = (
    Object.keys(DIALECT_PATTERNS) as Array<keyof typeof DIALECT_PATTERNS>
  ).filter((dialect) =>
    DIALECT_PATTERNS[dialect].some((pattern) => pattern.test(received)),
  );

  return {
    pass,
    message: () =>
      pass
        ? `Expected text not to match ${expectedDialect} dialect`
        : `Expected text to match ${expectedDialect} dialect\n` +
          `  Received: "${received}"\n` +
          (detectedDialects.length > 0
            ? `  Detected dialects: ${detectedDialects.join(", ")}\n`
            : `  No dialect patterns detected\n`) +
          `  ${expectedDialect} patterns: ${patterns.map((p) => p.source).join(", ")}`,
  };
}

/**
 * Checks if text contains any Iraqi dialect markers
 */
export function toContainIraqiDialect(this: any, received: string) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () => `toContainIraqiDialect requires a string`,
    };
  }

  // Check all dialects
  const allPatterns = Object.values(DIALECT_PATTERNS)
    .flat()
    .filter((pattern) => pattern.test(received));

  const pass = allPatterns.length > 0;

  // Detect which dialect(s)
  const detectedDialects = (
    Object.keys(DIALECT_PATTERNS) as Array<keyof typeof DIALECT_PATTERNS>
  ).filter((dialect) =>
    DIALECT_PATTERNS[dialect].some((pattern) => pattern.test(received)),
  );

  return {
    pass,
    message: () =>
      pass
        ? `Expected text not to contain Iraqi dialect markers\n` +
          `  Detected dialects: ${detectedDialects.join(", ")}`
        : `Expected text to contain Iraqi dialect markers\n` +
          `  Received: "${received}"\n` +
          `  No Iraqi dialect patterns detected`,
  };
}

/**
 * Checks if text is in Standard Arabic (not dialectal)
 */
export function toBeStandardArabic(this: any, received: string) {
  if (typeof received !== "string") {
    return {
      pass: false,
      message: () => `toBeStandardArabic requires a string`,
    };
  }

  // Check if any dialectal patterns are present (excluding standard)
  const dialectalPatterns = Object.entries(DIALECT_PATTERNS)
    .filter(([dialect]) => dialect !== "standard")
    .flatMap(([_, patterns]) => patterns);

  const hasDialectalMarkers = dialectalPatterns.some((pattern) =>
    pattern.test(received),
  );

  const pass = !hasDialectalMarkers;

  return {
    pass,
    message: () =>
      pass
        ? `Expected text not to be Standard Arabic (expected dialectal markers)`
        : `Expected text to be Standard Arabic without dialectal markers\n` +
          `  Received: "${received}"\n` +
          `  Text contains dialectal markers`,
  };
}

// Register matchers with Bun test
expect.extend({
  toMatchIraqiDialect,
  toContainIraqiDialect,
  toBeStandardArabic,
});
