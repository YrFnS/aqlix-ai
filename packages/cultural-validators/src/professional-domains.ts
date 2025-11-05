/**
 * Professional domain validation for Iraqi AI Chat System
 * Validates content for Iraqi professional contexts (legal, medical, educational, engineering, organizational)
 */

/**
 * Professional domain type
 */
export type ProfessionalDomain =
  | "legal"
  | "medical"
  | "educational"
  | "engineering"
  | "organizational";

/**
 * Professional domain validation result
 */
export interface ProfessionalDomainResult {
  appropriate: boolean;
  score: number; // 0.0 - 1.0
  violations: string[];
  recommendations: string[];
  domain: ProfessionalDomain;
}

/**
 * Domain-specific terminology patterns
 */
const DOMAIN_TERMINOLOGY = {
  legal: {
    positive: [
      /قانون عراقي/,
      /قانون/,
      /محكمة/,
      /عقد/,
      /دعوى/,
      /استشارة قانونية/,
      /المحكمة/,
      /القانون المدني/,
      /عقد البيع/,
      /iraqi law/i,
      /legal consultation/i,
      /law/i,
    ],
    required: [
      "وفقاً للقانون",
      "استشارة قانونية",
      "legal",
      "law",
      "قانون",
      "محكمة",
      "عقد",
    ],
  },
  medical: {
    positive: [
      /طبيب/,
      /استشارة طبية/,
      /تشخيص/,
      /علاج/,
      /وصفة طبية/,
      /فحص/,
      /السكري/,
      /الدم/,
      /medical/i,
      /diagnosis/i,
      /treatment/i,
    ],
    required: ["استشارة طبية", "medical", "doctor", "طبيب", "علاج", "وصفة"],
  },
  educational: {
    positive: [
      /تعليم/,
      /منهج/,
      /تدريس/,
      /طالب/,
      /معلم/,
      /المنهج/,
      /الدراسي/,
      /الصف/,
      /الجامعة/,
      /education/i,
      /curriculum/i,
      /student/i,
    ],
    required: ["تعليم", "education", "منهج", "المنهج", "الصف", "الجامعة"],
  },
  engineering: {
    positive: [
      /هندسة/,
      /مواصفة فنية/,
      /مخطط/,
      /تصميم/,
      /engineering/i,
      /technical/i,
      /design/i,
    ],
    required: ["هندسة", "مواصفة", "engineering"],
  },
  organizational: {
    positive: [
      /سير العمل/,
      /سياسة المؤسسة/,
      /إدارة/,
      /تنظيم/,
      /workflow/i,
      /policy/i,
      /management/i,
    ],
    required: ["سير العمل", "workflow", "organization"],
  },
};

/**
 * Professional disclaimers required for certain domains
 */
const REQUIRED_DISCLAIMERS = {
  legal: "يجب استشارة محامٍ مختص للحصول على المشورة القانونية الدقيقة",
  medical: "يرجى استشارة الطبيب المختص للحصول على التشخيص والعلاج الملائم",
  educational: "يجب اتباع المنهج المعتمد من وزارة التعليم",
};

/**
 * Validates content for professional domain appropriateness
 *
 * @example
 * ```typescript
 * const result = await validateProfessionalDomain(
 *   "استشارة قانونية وفقاً للقانون العراقي",
 *   "legal"
 * );
 * console.log(result.appropriate); // true
 * ```
 */
export async function validateProfessionalDomain(
  content: string,
  domain: ProfessionalDomain,
): Promise<ProfessionalDomainResult> {
  const violations: string[] = [];
  const recommendations: string[] = [];

  const terminology = DOMAIN_TERMINOLOGY[domain];

  // Check for domain-appropriate terminology
  const hasPositiveTerminology = terminology.positive.some((pattern) =>
    pattern.test(content),
  );

  // Check for required keywords
  const hasRequiredKeywords = terminology.required.some((keyword) =>
    content.toLowerCase().includes(keyword.toLowerCase()),
  );

  // Check for required disclaimer (for sensitive domains)
  const requiredDisclaimer = REQUIRED_DISCLAIMERS[domain];
  const hasRequiredDisclaimer = requiredDisclaimer
    ? content.includes(requiredDisclaimer) ||
      content.toLowerCase().includes("استشارة") ||
      content.toLowerCase().includes("consultation")
    : true;

  // Determine appropriateness
  const appropriate =
    hasPositiveTerminology || (hasRequiredKeywords && hasRequiredDisclaimer);

  // Calculate score
  let score = 0.5; // Base score
  if (appropriate) {
    score = 0.85; // Appropriate baseline
    if (hasPositiveTerminology && hasRequiredKeywords) {
      score = 0.95; // Excellent professional content
    }
  } else {
    score = 0.4; // Not domain-appropriate
  }

  // Add violations
  if (!hasPositiveTerminology && !hasRequiredKeywords) {
    violations.push(`Content lacks ${domain} domain-specific terminology`);
  }

  if (requiredDisclaimer && !hasRequiredDisclaimer) {
    violations.push(
      `Content should include appropriate disclaimer for ${domain} domain`,
    );
  }

  // Add recommendations
  if (appropriate && !hasRequiredDisclaimer && requiredDisclaimer) {
    recommendations.push(`Consider adding disclaimer: ${requiredDisclaimer}`);
  }

  if (!hasPositiveTerminology) {
    recommendations.push(
      `Consider using ${domain}-specific terminology to enhance professional relevance`,
    );
  }

  return {
    appropriate,
    score,
    violations,
    recommendations,
    domain,
  };
}

/**
 * Detects the most likely professional domain from content
 */
export function detectProfessionalDomain(
  content: string,
): ProfessionalDomain | null {
  const domains: ProfessionalDomain[] = [
    "legal",
    "medical",
    "educational",
    "engineering",
    "organizational",
  ];

  let maxMatches = 0;
  let detectedDomain: ProfessionalDomain | null = null;

  for (const domain of domains) {
    const terminology = DOMAIN_TERMINOLOGY[domain];
    const matches = terminology.positive.filter((pattern) =>
      pattern.test(content),
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      detectedDomain = domain;
    }
  }

  return maxMatches > 0 ? detectedDomain : null;
}

/**
 * Validates legal content for Iraqi context
 */
export function validateLegalContent(content: string): {
  isValid: boolean;
  jurisdiction: string;
  issues: string[];
} {
  const legalTerms = DOMAIN_TERMINOLOGY.legal.positive;
  const hasLegalTerms = legalTerms.some((term) => term.test(content));

  return {
    isValid: hasLegalTerms,
    jurisdiction: hasLegalTerms ? "iraqi" : "unknown",
    issues: hasLegalTerms ? [] : ["Content lacks Iraqi legal terminology"],
  };
}

/**
 * Validates medical content with appropriate disclaimers
 */
export function validateMedicalContent(content: string): {
  isValid: boolean;
  hasDisclaimer: boolean;
  issues: string[];
} {
  const medicalTerms = DOMAIN_TERMINOLOGY.medical.positive;
  const hasMedicalTerms = medicalTerms.some((term) => term.test(content));
  const disclaimerPatterns = [
    /استشر طبيب/,
    /استشارة طبية/,
    /consult.*doctor/i,
    /medical advice/i,
  ];
  const hasDisclaimer = disclaimerPatterns.some((pattern) =>
    pattern.test(content),
  );

  const issues: string[] = [];
  // Check if content gives medical advice (prescription-like instructions)
  // More specific patterns to reduce false positives:
  // - Arabic: خذ (take), تناول (consume), استخدم (use) + medical context
  // - Imperatives like "يجب أن تأخذ" (you must take), "خذ الدواء" (take the medicine)
  // - English: "take pill", "take tablet", "take medicine" (avoid standalone "take" or "use")
  const givesAdvice =
    /خذ\s+(حبة|دواء|علاج|الدواء)|تناول\s+(الدواء|حبة|علاج)|استخدم\s+(الدواء|الحبة|العلاج)|يجب\s+(أن\s+)?تأخذ|يجب\s+(أن\s+)?تناول|(take|use)\s+(pill|tablet|medicine|the\s+medicine)|prescription|وصفة\s+طبية/i.test(
      content,
    );

  // If content lacks medical terminology but gives medical advice, it's invalid
  if (!hasMedicalTerms && givesAdvice) {
    issues.push(
      "Content appears to give medical advice but lacks proper medical terminology",
    );
  }

  // If content has medical terms and gives advice without disclaimer, it's problematic
  if (hasMedicalTerms && givesAdvice && !hasDisclaimer) {
    issues.push("Medical content should include disclaimer to consult doctor");
  }

  return {
    isValid: hasMedicalTerms,
    hasDisclaimer,
    issues,
  };
}

/**
 * Validates educational content for Iraqi curriculum
 */
export function validateEducationalContent(content: string): {
  isValid: boolean;
  level: string;
  issues: string[];
} {
  const educationalTerms = DOMAIN_TERMINOLOGY.educational.positive;
  const hasEducationalTerms = educationalTerms.some((term) =>
    term.test(content),
  );

  // Detect educational level
  let level = "general";
  if (/جامعة|university/i.test(content)) level = "university";
  else if (/مدرسة|school/i.test(content)) level = "school";

  return {
    isValid: hasEducationalTerms,
    level,
    issues: hasEducationalTerms
      ? []
      : ["Content lacks Iraqi educational terminology"],
  };
}
