/**
 * Cultural compliance assertion utilities for testing
 * Provides helpers to validate Iraqi cultural appropriateness and Islamic compliance
 */

/**
 * Placeholder validation function
 * This will be replaced with real implementation from @iraqi-ai/cultural-validators
 * in Task 6 when that package is created
 */
async function validateCulturalContent(
  content: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options?: { domain?: string },
): Promise<{
  score: number;
  violations: string[];
  recommendations: string[];
  islamicCompliant: boolean;
  politicallyNeutral: boolean;
  islamicViolations?: string[];
  politicalViolations?: string[];
}> {
  // TEMPORARY PLACEHOLDER - Will be replaced in Task 6
  const hasIslamicGreeting =
    content.includes("السلام عليكم") ||
    content.includes("بسم الله") ||
    content.includes("الحمد لله");

  const hasPoliticalContent =
    content.includes("حزب") ||
    content.includes("سياسي") ||
    content.includes("طائفي");

  const score = hasIslamicGreeting ? 1.0 : hasPoliticalContent ? 0.7 : 0.85;

  return {
    score,
    violations: [],
    recommendations: score < 0.9 ? ["Consider adding Islamic greetings"] : [],
    islamicCompliant: true,
    politicallyNeutral: !hasPoliticalContent,
  };
}

/**
 * Options for cultural compliance assertion
 */
export interface CulturalComplianceOptions {
  /** Minimum cultural appropriateness score (0.0 - 1.0) */
  minScore?: number;
  /** Require Islamic compliance */
  islamicCompliance?: boolean;
  /** Require political neutrality */
  politicalNeutrality?: boolean;
  /** Professional domain for context-specific validation */
  professionalDomain?: string;
}

/**
 * Asserts that content meets Iraqi cultural compliance standards
 *
 * @param content - Content to validate (must be non-empty string)
 * @param options - Validation options
 * @param options.minScore - Minimum score (0.0-1.0, default: 0.95)
 * @param options.islamicCompliance - Require Islamic compliance (default: true)
 * @param options.politicalNeutrality - Require political neutrality (default: true)
 * @param options.professionalDomain - Professional domain context
 *
 * @throws {TypeError} If content is not a string
 * @throws {Error} If content is empty
 * @throws {RangeError} If minScore is not between 0.0 and 1.0
 * @throws {Error} If content fails cultural compliance checks
 *
 * @example
 * ```typescript
 * await assertCulturalCompliance("السلام عليكم", {
 *   minScore: 0.95,
 *   islamicCompliance: true
 * });
 * ```
 */
export async function assertCulturalCompliance(
  content: string,
  options: CulturalComplianceOptions = {},
): Promise<void> {
  // Input validation: content must be a non-empty string
  if (typeof content !== "string") {
    throw new TypeError(
      `Expected content to be a string, got ${typeof content}`,
    );
  }

  if (content.trim().length === 0) {
    throw new Error("Content cannot be empty or whitespace-only");
  }

  const {
    minScore = 0.95,
    islamicCompliance = true,
    politicalNeutrality = true,
    professionalDomain,
  } = options;

  // Validate minScore range
  if (typeof minScore !== "number" || Number.isNaN(minScore)) {
    throw new TypeError(`minScore must be a number, got ${typeof minScore}`);
  }

  if (minScore < 0.0 || minScore > 1.0) {
    throw new RangeError(
      `minScore must be between 0.0 and 1.0, got ${minScore}`,
    );
  }

  // Validate boolean options
  if (typeof islamicCompliance !== "boolean") {
    throw new TypeError(
      `islamicCompliance must be a boolean, got ${typeof islamicCompliance}`,
    );
  }

  if (typeof politicalNeutrality !== "boolean") {
    throw new TypeError(
      `politicalNeutrality must be a boolean, got ${typeof politicalNeutrality}`,
    );
  }

  // Validate professionalDomain if provided
  if (
    professionalDomain !== undefined &&
    typeof professionalDomain !== "string"
  ) {
    throw new TypeError(
      `professionalDomain must be a string, got ${typeof professionalDomain}`,
    );
  }

  const validation = await validateCulturalContent(content, {
    domain: professionalDomain,
  });

  // Check overall cultural score
  if (validation.score < minScore) {
    throw new Error(
      `Cultural compliance score ${validation.score.toFixed(2)} below threshold ${minScore}\n` +
        (validation.violations.length > 0
          ? `Violations:\n  - ${validation.violations.join("\n  - ")}\n`
          : "") +
        (validation.recommendations.length > 0
          ? `Recommendations:\n  - ${validation.recommendations.join("\n  - ")}`
          : ""),
    );
  }

  // Check Islamic compliance
  if (islamicCompliance && !validation.islamicCompliant) {
    throw new Error(
      `Content fails Islamic compliance check\n` +
        (validation.islamicViolations
          ? `Violations:\n  - ${validation.islamicViolations.join("\n  - ")}`
          : ""),
    );
  }

  // Check political neutrality
  if (politicalNeutrality && !validation.politicallyNeutral) {
    throw new Error(
      `Content fails political neutrality check\n` +
        (validation.politicalViolations
          ? `Violations:\n  - ${validation.politicalViolations.join("\n  - ")}`
          : ""),
    );
  }
}

/**
 * Asserts that content is Islamically compliant
 *
 * @param content - Content to validate (must be non-empty string)
 * @param minScore - Minimum Islamic compliance score (0.0-1.0, default: 0.9)
 *
 * @throws {TypeError} If content is not a string or minScore is not a number
 * @throws {Error} If content is empty
 * @throws {RangeError} If minScore is not between 0.0 and 1.0
 */
export async function assertIslamicCompliance(
  content: string,
  minScore: number = 0.9,
): Promise<void> {
  // Input validation handled by assertCulturalCompliance
  await assertCulturalCompliance(content, {
    minScore,
    islamicCompliance: true,
    politicalNeutrality: false,
  });
}

/**
 * Asserts that content is politically neutral
 *
 * @param content - Content to validate (must be non-empty string)
 *
 * @throws {TypeError} If content is not a string
 * @throws {Error} If content is empty or politically biased
 */
export async function assertPoliticalNeutrality(
  content: string,
): Promise<void> {
  // Input validation handled by assertCulturalCompliance
  await assertCulturalCompliance(content, {
    minScore: 0.8,
    islamicCompliance: false,
    politicalNeutrality: true,
  });
}

/**
 * Asserts that professional content meets domain-specific standards
 *
 * @param content - Content to validate (must be non-empty string)
 * @param domain - Professional domain context (legal, medical, educational, engineering, organizational)
 * @param minScore - Minimum compliance score (0.0-1.0, default: 0.95)
 *
 * @throws {TypeError} If content is not a string, domain is invalid, or minScore is not a number
 * @throws {Error} If content is empty or fails domain-specific validation
 * @throws {RangeError} If minScore is not between 0.0 and 1.0
 */
export async function assertProfessionalCompliance(
  content: string,
  domain:
    | "legal"
    | "medical"
    | "educational"
    | "engineering"
    | "organizational",
  minScore: number = 0.95,
): Promise<void> {
  // Validate domain
  const validDomains = [
    "legal",
    "medical",
    "educational",
    "engineering",
    "organizational",
  ];
  if (!validDomains.includes(domain)) {
    throw new TypeError(
      `Invalid professional domain "${domain}". Must be one of: ${validDomains.join(", ")}`,
    );
  }

  // Input validation handled by assertCulturalCompliance
  await assertCulturalCompliance(content, {
    minScore,
    professionalDomain: domain,
    islamicCompliance: true,
    politicalNeutrality: true,
  });
}

/**
 * Batch assertion for multiple content items
 *
 * @param contentItems - Array of content strings to validate
 * @param options - Validation options applied to all items
 *
 * @throws {TypeError} If contentItems is not an array
 * @throws {Error} If array is empty or any content item fails validation
 *
 * @example
 * ```typescript
 * await assertBatchCulturalCompliance([
 *   "السلام عليكم",
 *   "بسم الله الرحمن الرحيم"
 * ], { minScore: 0.95 });
 * ```
 */
export async function assertBatchCulturalCompliance(
  contentItems: string[],
  options: CulturalComplianceOptions = {},
): Promise<void> {
  // Validate contentItems is an array
  if (!Array.isArray(contentItems)) {
    throw new TypeError(
      `Expected contentItems to be an array, got ${typeof contentItems}`,
    );
  }

  // Validate array is not empty
  if (contentItems.length === 0) {
    throw new Error("contentItems array cannot be empty");
  }

  // Validate all items are strings
  const nonStringItems = contentItems.filter(
    (item) => typeof item !== "string",
  );
  if (nonStringItems.length > 0) {
    throw new TypeError(
      `All contentItems must be strings. Found ${nonStringItems.length} non-string items`,
    );
  }

  const results = await Promise.allSettled(
    contentItems.map((content) => assertCulturalCompliance(content, options)),
  );

  const failures = results.filter((result) => result.status === "rejected");

  if (failures.length > 0) {
    const errors = failures.map((f: any) => f.reason.message).join("\n\n");
    throw new Error(
      `${failures.length} of ${contentItems.length} items failed cultural compliance:\n\n${errors}`,
    );
  }
}
