/**
 * Islamic compliance validation for Iraqi AI Chat System
 * Validates content against Islamic principles and values
 */
import { removeDiacritics } from "@iraqi-ai/arabic-test-utils";

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
 * Latin patterns use \b (ASCII word boundaries)
 * Arabic patterns use Unicode-aware boundaries: (?:^|[^\u0621-\u064A])TERM(?:$|[^\u0621-\u064A])
 * Arabic Unicode range: \u0621-\u064A covers most Arabic letters
 */
const PROHIBITED_PATTERNS = {
  alcohol: [
    /\balcohol\b/i,
    /\bbeer\b/i,
    /\bwine\b/i,
    /\bwhiskey\b/i,
    /(?:^|[^\u0621-\u064A])خمر(?:$|[^\u0621-\u064A])/,
    /(?:^|[^\u0621-\u064A])كحول(?:$|[^\u0621-\u064A])/,
    /(?:^|[^\u0621-\u064A])بيرة(?:$|[^\u0621-\u064A])/,
  ],
  pork: [
    /\bpork\b/i,
    /\bbacon\b/i,
    /\bham\b/i,
    /(?:^|[^\u0621-\u064A])لحم خنزير(?:$|[^\u0621-\u064A])/,
    /(?:^|[^\u0621-\u064A])خنزير(?:$|[^\u0621-\u064A])/,
  ],
  gambling: [
    /\bgambling\b/i,
    /\bcasino\b/i,
    /\blottery\b/i,
    /(?:^|[^\u0621-\u064A])قمار(?:$|[^\u0621-\u064A])/,
    /(?:^|[^\u0621-\u064A])كازينو(?:$|[^\u0621-\u064A])/,
    /(?:^|[^\u0621-\u064A])يانصيب(?:$|[^\u0621-\u064A])/,
  ],
  usury: [
    /\busury\b/i,
    /\binterest rate\b/i,
    /(?:^|[^\u0621-\u064A])ربا(?:$|[^\u0621-\u064A])/,
  ],
};

/**
 * Disrespectful patterns
 * Latin patterns use \b (ASCII word boundaries)
 * Arabic patterns use Unicode-aware boundaries for proper word isolation
 */
const DISRESPECTFUL_PATTERNS = [
  /\bblasphemy\b/i,
  /\bmocking\s+religion/i,
  /\bmock(?:ing|s)?\s+(?:Islam|religion|religious)/i,
  /\binappropriate\s+religious/i,
  /\breligious\s+jokes?\b/i,
  /\bjoke[sd]?\s+about\s+(?:Islam|religion|Allah|Prophet)/i,
  /\bdisrespect(?:ful|ing)?\s+(?:to\s+)?(?:Islam|religion|religious)/i,
  /(?:^|[^\u0621-\u064A])استهزاء(?:$|[^\u0621-\u064A])/,
  /(?:^|[^\u0621-\u064A])تجديف(?:$|[^\u0621-\u064A])/,
  /(?:^|[^\u0621-\u064A])إهانة(?:$|[^\u0621-\u064A])/,
  /(?:^|[^\u0621-\u064A])سخرية(?:$|[^\u0621-\u064A])/, // mockery in Arabic
];

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
  const normalizedContent = removeDiacritics(content);
  const violations: string[] = [];
  const recommendations: string[] = [];

  // Check for Islamic greetings
  const hasIslamicGreeting = ISLAMIC_GREETINGS.some((greeting) =>
    content.includes(greeting),
  );

  // Check for prohibited content
  let hasProhibitedContent = false;
  for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(normalizedContent))) {
      hasProhibitedContent = true;
      violations.push(
        `Content contains references to prohibited items in Islam: ${category}`,
      );
    }
  }

  // Check for disrespectful content
  let hasDisrespectfulContent = DISRESPECTFUL_PATTERNS.some((pattern) =>
    pattern.test(normalizedContent),
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
  const normalizedContent = removeDiacritics(content);
  return Object.values(PROHIBITED_PATTERNS)
    .flat()
    .some((pattern) => pattern.test(normalizedContent));
}

/**
 * Checks content for religious respect
 */
export function checkReligiousRespect(content: string): {
  isRespectful: boolean;
  issues: string[];
} {
  const normalizedContent = removeDiacritics(content);
  const issues: string[] = [];
  const hasDisrespectful = DISRESPECTFUL_PATTERNS.some((pattern) =>
    pattern.test(normalizedContent),
  );

  if (hasDisrespectful) {
    issues.push("Content contains disrespectful religious references");
  }

  // Check for mocking patterns combined with religious context
  // Latin uses \b, Arabic uses Unicode-aware boundaries
  const mockingPatterns = [
    /\bmock\b/i,
    /(?:^|[^\u0621-\u064A])استهزاء(?:$|[^\u0621-\u064A])/,
  ];
  const religiousContext = [
    /\breligion\b/i,
    /\bislam\b/i,
    /(?:^|[^\u0621-\u064A])الدين(?:$|[^\u0621-\u064A])/,
    /(?:^|[^\u0621-\u064A])الإسلام(?:$|[^\u0621-\u064A])/,
  ];

  const hasMocking = mockingPatterns.some((pattern) =>
    pattern.test(normalizedContent),
  );
  const hasReligiousContext = religiousContext.some((pattern) =>
    pattern.test(normalizedContent),
  );

  // Only flag if both mocking AND religious context are present
  if (hasMocking && hasReligiousContext) {
    issues.push("Content may contain mocking or joking about religion");
  }

  // Check for "joke" specifically combined with "religious"
  if (
    /religious.*joke/i.test(content) ||
    /joke.*religious/i.test(content) ||
    /inappropriate.*religious/i.test(content)
  ) {
    issues.push("Content contains inappropriate religious jokes");
  }

  // Specific check: explicit insulting verbs near religion terms
  // Using word boundaries and checking for patterns not already caught by DISRESPECTFUL_PATTERNS
  const specificMockingPattern =
    /\b(mock|ridicule|deride|taunt|scoff at)\b.*\b(religion|faith|church|mosque|synagogue|Islam|Christianity|Judaism)\b/i;
  const reverseMockingPattern =
    /\b(religion|faith|church|mosque|synagogue|Islam|Christianity|Judaism)\b.*\b(mock|ridicule|deride|taunt|scoff at)\b/i;

  if (
    !hasDisrespectful && // Only add if not already flagged by DISRESPECTFUL_PATTERNS
    (specificMockingPattern.test(content) ||
      reverseMockingPattern.test(content))
  ) {
    issues.push("Content contains explicit mockery of religious terms");
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
  const normalizedContent = removeDiacritics(content);
  const categories: string[] = [];
  const details: string[] = [];

  for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(normalizedContent))) {
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
