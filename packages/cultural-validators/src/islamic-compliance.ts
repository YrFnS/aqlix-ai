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
    /\bvodka\b/i,
    /\brum\b/i,
    /\bgin\b/i,
    /الخمر/,
    /الكحول/,
  ],
  pork: [/\bpork\b/i, /\bham\b/i, /\bbacon\b/i, /خنزير/, /لحم الخنزير/],
  gambling: [/\bgambl/i, /\blottery\b/i, /\bpoker\b/i, /قمار/, /الميسر/],
};

/**
 * Disrespectful content patterns
 */
const DISRESPECTFUL_PATTERNS = [
  /mock|استهزاء/,
  /insult|إهانة/,
  /profan/,
  /curse|شتم/,
  /degrad|اهانة/,
  /hate|كراهية/,
  /discriminat|تمييز/,
];

/**
 * Checks if content contains Islamic greeting
 */
export function hasIslamicGreeting(content: string): boolean {
  return ISLAMIC_GREETINGS.some((greeting) => content.includes(greeting));
}

/**
 * Checks if content contains prohibited references
 */
export function hasProhibitedReferences(content: string): boolean {
  for (const patterns of Object.values(PROHIBITED_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(content))) {
      return true;
    }
  }
  return false;
}

/**
 * Validates if content is Islamic compliant
 */
export async function validateIslamicCompliance(
  content: string,
): Promise<IslamicComplianceResult> {
  const violations: string[] = [];
  const recommendations: string[] = [];

  // Check for Islamic greeting
  const hasGreeting = hasIslamicGreeting(content);

  // Check for prohibited content
  let hasProhibitedContent = false;
  for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
    const found = patterns.some((pattern) => pattern.test(content));
    if (found) {
      violations.push(`Content contains prohibited ${category}`);
      hasProhibitedContent = true;
    }
  }

  // Check for disrespectful content
  let hasDisrespectfulContent = false;
  const hasMocking = DISRESPECTFUL_PATTERNS.some((pattern) =>
    pattern.test(content),
  );
  const hasReligiousContext = [/religion/i, /islam/i, /الدين/, /الإسلام/].some(
    (pattern) => pattern.test(content),
  );

  if (hasMocking && hasReligiousContext) {
    violations.push("Content may contain mocking or disrespectful language");
    hasDisrespectfulContent = true;
  }

  if (/religious.*joke/i.test(content) || /joke.*religious/i.test(content)) {
    violations.push("Content contains inappropriate religious jokes");
    hasDisrespectfulContent = true;
  }

  // Add recommendations
  if (!hasGreeting) {
    recommendations.push("Consider using Islamic greetings for respect");
  }

  // Calculate score
  let score = 1.0;
  if (hasProhibitedContent) score -= 0.5;
  if (hasDisrespectfulContent) score -= 0.3;
  score = Math.max(0, Math.min(1, score));

  const compliant =
    score >= 0.8 && !hasProhibitedContent && !hasDisrespectfulContent;

  return {
    compliant,
    score,
    violations,
    recommendations,
    details: {
      hasIslamicGreeting: hasGreeting,
      hasProhibitedContent,
      hasDisrespectfulContent,
    },
  };
}
