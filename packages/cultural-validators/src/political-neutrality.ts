/**
 * Political neutrality validation for Iraqi AI Chat System
 * Ensures content avoids sectarian, political, and tribal references
 */

/**
 * Political neutrality validation result
 */
export interface PoliticalNeutralityResult {
  neutral: boolean;
  score: number; // 0.0 - 1.0
  violations: string[];
  recommendations: string[];
  details: {
    hasSectarianContent: boolean;
    hasPoliticalContent: boolean;
    hasTribalContent: boolean;
  };
}

/**
 * Sectarian keywords to avoid
 */
const SECTARIAN_PATTERNS = [
  /طائفي/,
  /سني/,
  /شيعي/,
  /sectarian/i,
  /sunni/i,
  /shia/i,
  /shiite/i,
];

/**
 * Political keywords to avoid
 */
const POLITICAL_PATTERNS = [
  /حزب سياسي/,
  /سياسي/,
  /انتخابات/,
  /political party/i,
  /election/i,
  /government party/i,
];

/**
 * Tribal keywords to avoid
 */
const TRIBAL_PATTERNS = [/عشيرة/, /قبيلة/, /tribal/i, /clan/i];

/**
 * Neutral service phrases (allowed)
 */
const NEUTRAL_PHRASES = [
  "نحن نخدم جميع العراقيين",
  "نعمل معاً",
  "خدماتنا متاحة للجميع",
  "we serve all Iraqis",
  "available to all",
];

/**
 * Validates content for political neutrality
 *
 * @example
 * ```typescript
 * const result = await validatePoliticalNeutrality("نحن نخدم جميع العراقيين");
 * console.log(result.neutral); // true
 * console.log(result.score); // 0.95
 * ```
 */
export async function validatePoliticalNeutrality(
  content: string,
): Promise<PoliticalNeutralityResult> {
  const violations: string[] = [];
  const recommendations: string[] = [];

  // Check for sectarian content
  const hasSectarianContent = SECTARIAN_PATTERNS.some((pattern) =>
    pattern.test(content),
  );
  if (hasSectarianContent) {
    violations.push(
      "Content contains sectarian references that should be avoided",
    );
  }

  // Check for political content
  const hasPoliticalContent = POLITICAL_PATTERNS.some((pattern) =>
    pattern.test(content),
  );
  if (hasPoliticalContent) {
    violations.push(
      "Content contains political references that should be avoided",
    );
  }

  // Check for tribal content
  const hasTribalContent = TRIBAL_PATTERNS.some((pattern) =>
    pattern.test(content),
  );
  if (hasTribalContent) {
    violations.push(
      "Content contains tribal references that should be avoided",
    );
  }

  // Check for neutral phrases (bonus)
  const hasNeutralPhrase = NEUTRAL_PHRASES.some((phrase) =>
    content.includes(phrase),
  );

  // Determine neutrality
  const neutral =
    !hasSectarianContent && !hasPoliticalContent && !hasTribalContent;

  // Calculate score
  let score = 0.5; // Base score
  if (neutral) {
    score = 0.9; // Neutral baseline
    if (hasNeutralPhrase) {
      score = 0.95; // Bonus for explicitly inclusive language
    }
  } else {
    score = 0.3; // Non-neutral
  }

  // Add recommendations
  if (neutral && !hasNeutralPhrase) {
    recommendations.push(
      "Consider using explicitly inclusive language like 'نحن نخدم جميع العراقيين'",
    );
  }

  return {
    neutral,
    score,
    violations,
    recommendations,
    details: {
      hasSectarianContent,
      hasPoliticalContent,
      hasTribalContent,
    },
  };
}

/**
 * Checks if content contains sectarian references
 */
export function hasSectarianReferences(content: string): boolean {
  return SECTARIAN_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Checks if content contains political references
 */
export function hasPoliticalReferences(content: string): boolean {
  return POLITICAL_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Checks if content contains tribal references
 */
export function hasTribalReferences(content: string): boolean {
  return TRIBAL_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Checks for sectarian content
 */
export function checkSectarianContent(content: string): {
  hasSectarian: boolean;
  patterns: string[];
} {
  const patterns: string[] = [];
  SECTARIAN_PATTERNS.forEach((pattern) => {
    if (pattern.test(content)) {
      patterns.push(pattern.source);
    }
  });

  return {
    hasSectarian: patterns.length > 0,
    patterns,
  };
}

/**
 * Validates tribal sensitivity
 */
export function validateTribalSensitivity(content: string): {
  isSensitive: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const hasTribal = TRIBAL_PATTERNS.some((pattern) => pattern.test(content));

  if (hasTribal) {
    issues.push("Content contains tribal references that may be divisive");
  }

  return {
    isSensitive: hasTribal,
    issues,
  };
}

/**
 * Checks government references for neutrality
 */
export function checkGovernmentReferences(content: string): {
  hasReferences: boolean;
  type: "neutral" | "partisan" | "none";
} {
  const hasPolitical = POLITICAL_PATTERNS.some((pattern) =>
    pattern.test(content),
  );

  if (hasPolitical) {
    return {
      hasReferences: true,
      type: "partisan",
    };
  }

  // Check for neutral government terms
  const neutralTerms = [/حكومة/, /وزارة/, /government/i, /ministry/i];
  const hasNeutral = neutralTerms.some((term) => term.test(content));

  return {
    hasReferences: hasNeutral,
    type: hasNeutral ? "neutral" : "none",
  };
}
