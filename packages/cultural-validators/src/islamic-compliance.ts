/**
 * Islamic compliance validation for Iraqi AI Chat System
 * Validates content against Islamic principles and values
 */

/**
 * Islamic compliance validation result
 */
export interface IslamicComplianceResult {
  compliant: boolean;
  score: number; // 0.0 - 1.0
  violations: string[];
  recommendations: string[];
  details: {
    hasIslamicGreeting: boolean;
    hasProhibitedContent: boolean;
    hasDisrespectfulContent: boolean;
  };
}

/**
 * Islamic greetings and phrases
 */
const ISLAMIC_GREETINGS = [
  "السلام عليكم",
  "بسم الله",
  "الحمد لله",
  "إن شاء الله",
  "ما شاء الله",
  "بارك الله فيك",
  "جزاك الله خيراً",
  "أستغفر الله",
  "لا حول ولا قوة إلا بالله",
  "صباح الخير",
  "مساء الخير",
];

/**
 * Prohibited content patterns in Islam
 */
const PROHIBITED_PATTERNS = {
  alcohol: [/alcohol/i, /beer/i, /wine/i, /whiskey/i, /خمر/, /كحول/, /بيرة/],
  pork: [/pork/i, /bacon/i, /ham/i, /لحم خنزير/, /خنزير/],
  gambling: [/gambling/i, /casino/i, /lottery/i, /قمار/, /كازينو/, /يانصيب/],
  usury: [/usury/i, /interest rate/i, /ربا/],
};

/**
 * Disrespectful patterns
 */
const DISRESPECTFUL_PATTERNS = [/blasphemy/i, /استهزاء/, /تجديف/, /إهانة/];

/**
 * Validates content for Islamic compliance
 *
 * @example
 * ```typescript
 * const result = await validateIslamicCompliance("السلام عليكم");
 * console.log(result.compliant); // true
 * console.log(result.score); // 1.0
 * ```
 */
export async function validateIslamicCompliance(
  content: string,
): Promise<IslamicComplianceResult> {
  const violations: string[] = [];
  const recommendations: string[] = [];

  // Check for Islamic greetings
  const hasIslamicGreeting = ISLAMIC_GREETINGS.some((greeting) =>
    content.includes(greeting),
  );

  // Check for prohibited content
  let hasProhibitedContent = false;
  for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(content))) {
      hasProhibitedContent = true;
      violations.push(
        `Content contains references to prohibited items in Islam: ${category}`,
      );
    }
  }

  // Check for disrespectful content
  let hasDisrespectfulContent = DISRESPECTFUL_PATTERNS.some((pattern) =>
    pattern.test(content),
  );

  // Also check with checkReligiousRespect function for additional patterns
  const respectResult = checkReligiousRespect(content);
  if (!respectResult.isRespectful) {
    hasDisrespectfulContent = true;
    violations.push(...respectResult.issues);
  } else if (hasDisrespectfulContent) {
    violations.push("Content contains disrespectful or blasphemous references");
  }

  // Determine compliance
  const compliant = !hasProhibitedContent && !hasDisrespectfulContent;

  // Calculate score
  let score = 0.5; // Base score
  if (compliant) {
    score = 0.9; // Compliant baseline
    if (hasIslamicGreeting) {
      score = 1.0; // Perfect score with Islamic greeting
    }
  } else {
    score = 0.3; // Non-compliant
  }

  // Add recommendations
  if (compliant && !hasIslamicGreeting) {
    recommendations.push(
      "Consider using Islamic greetings like 'السلام عليكم' to enhance Islamic appropriateness",
    );
  }

  return {
    compliant,
    score,
    violations,
    recommendations,
    details: {
      hasIslamicGreeting,
      hasProhibitedContent,
      hasDisrespectfulContent,
    },
  };
}

/**
 * Checks if content contains Islamic greetings
 */
export function hasIslamicGreeting(content: string): boolean {
  return ISLAMIC_GREETINGS.some((greeting) => content.includes(greeting));
}

/**
 * Checks if content contains prohibited references
 */
export function hasProhibitedReferences(content: string): boolean {
  return Object.values(PROHIBITED_PATTERNS)
    .flat()
    .some((pattern) => pattern.test(content));
}

/**
 * Checks content for religious respect
 */
export function checkReligiousRespect(content: string): {
  isRespectful: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const hasDisrespectful = DISRESPECTFUL_PATTERNS.some((pattern) =>
    pattern.test(content),
  );

  if (hasDisrespectful) {
    issues.push("Content contains disrespectful religious references");
  }

  // Check for mocking patterns combined with religious context
  const mockingPatterns = [/mock/i, /استهزاء/];
  const religiousContext = [/religion/i, /islam/i, /الدين/, /الإسلام/];

  const hasMocking = mockingPatterns.some((pattern) => pattern.test(content));
  const hasReligiousContext = religiousContext.some((pattern) =>
    pattern.test(content),
  );

  // Only flag if both mocking AND religious context are present
  if (hasMocking && hasReligiousContext) {
    issues.push("Content may contain mocking or joking about religion");
  }

  // Check for "joke" specifically combined with "religious"
  if (/religious.*joke/i.test(content) || /joke.*religious/i.test(content)) {
    issues.push("Content contains inappropriate religious jokes");
  }

  return {
    isRespectful: issues.length === 0,
    issues,
  };
}

/**
 * Validates Islamic greetings in content
 */
export function validateGreetings(content: string): {
  hasGreeting: boolean;
  greetings: string[];
} {
  const foundGreetings = ISLAMIC_GREETINGS.filter((greeting) =>
    content.includes(greeting),
  );

  return {
    hasGreeting: foundGreetings.length > 0,
    greetings: foundGreetings,
  };
}

/**
 * Checks for prohibited content according to Islamic principles
 */
export function checkProhibitedContent(content: string): {
  hasProhibited: boolean;
  categories: string[];
  details: string[];
} {
  const categories: string[] = [];
  const details: string[] = [];

  for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(content))) {
      categories.push(category);
      details.push(`Content contains ${category} references`);
    }
  }

  return {
    hasProhibited: categories.length > 0,
    categories,
    details,
  };
}
