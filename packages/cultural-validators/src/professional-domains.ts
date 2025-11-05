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
/**
 * Minimum match thresholds per domain (configurable)
 */
const DOMAIN_THRESHOLDS: Record<ProfessionalDomain, number> = {
  legal: 2,
  medical: 2,
  engineering: 2,
  educational: 2,
  organizational: 2,
};

export async function validateProfessionalDomain(
  content: string,
  domain: ProfessionalDomain,
): Promise<ProfessionalDomainResult> {
  const violations: string[] = [];
  const recommendations: string[] = [];

  const terminology = DOMAIN_TERMINOLOGY[domain];
  const threshold = DOMAIN_THRESHOLDS[domain] || 2;

  // Count matching positive terminology patterns
  const positiveMatches = terminology.positive.filter((pattern) =>
    pattern.test(content),
  ).length;

  // Count matching required keywords
  const requiredMatches = terminology.required.filter((keyword) =>
    content.toLowerCase().includes(keyword.toLowerCase()),
  ).length;

  // Total matches
  const totalMatches = positiveMatches + requiredMatches;

  // Check for required disclaimer (for sensitive domains) - no broad fallback
  const requiredDisclaimer = REQUIRED_DISCLAIMERS[domain];
  const hasRequiredDisclaimer = requiredDisclaimer
    ? content.includes(requiredDisclaimer)
    : true;

  // Require minimum threshold
  const meetsThreshold = totalMatches >= threshold;

  // Determine appropriateness based on threshold and disclaimer
  const appropriate = meetsThreshold && hasRequiredDisclaimer;

  // Calculate graduated proportional score
  let score = 0.4; // Base score

  if (totalMatches > 0) {
    // Graduated score based on match fraction
    const maxPossibleMatches =
      terminology.positive.length + terminology.required.length;
    const matchFraction = totalMatches / maxPossibleMatches;
    score = 0.4 + matchFraction * 0.5; // Scale from 0.4 to 0.9 based on match fraction

    // Bonus for meeting threshold
    if (meetsThreshold) {
      score = Math.min(score + 0.03, 0.93); // Small bonus, capped at 0.93
    }

    // Bonus for disclaimer
    if (hasRequiredDisclaimer && requiredDisclaimer) {
      score = Math.min(score + 0.02, 0.95); // Final bonus, capped at 0.95
    }
  }

  // Add violations with counts and thresholds
  if (totalMatches === 0) {
    violations.push(`Content lacks ${domain} domain-specific terminology`);
  } else if (!meetsThreshold) {
    violations.push(
      `Content has ${totalMatches} domain terms but requires at least ${threshold} for ${domain} domain`,
    );
  }

  if (requiredDisclaimer && !hasRequiredDisclaimer) {
    violations.push(
      `Content should include disclaimer for ${domain} domain: "${requiredDisclaimer}"`,
    );
  }

  // Add recommendations with specific counts
  if (totalMatches > 0 && totalMatches < threshold) {
    const needed = threshold - totalMatches;
    recommendations.push(
      `Add ${needed} more ${domain} term${needed > 1 ? "s" : ""} to reach minimum threshold of ${threshold}`,
    );
  }

  if (meetsThreshold && !hasRequiredDisclaimer && requiredDisclaimer) {
    recommendations.push(
      `Consider adding required disclaimer: "${requiredDisclaimer}"`,
    );
  }

  if (totalMatches === 0) {
    recommendations.push(
      `Add ${domain}-specific terminology to enhance professional relevance`,
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

  if (!hasLegalTerms) {
    return {
      isValid: false,
      jurisdiction: "unknown",
      issues: ["Content lacks legal terminology"],
    };
  }

  // Iraq-specific patterns (governorates, institutions, explicit Iraq references)
  const iraqiSpecificPatterns = [
    /العراق|عراقي|عراقية/i, // Iraq, Iraqi
    /بغداد|البصرة|النجف|كربلاء|أربيل|الأنبار|نينوى|دهوك|السليمانية|ديالي|كربلاء|واسط|صلاح الدين|بابل|ذي قار|ميسان|مثنى|القادسية|كركوك|حلبجة/i, // Governorates
    /القانون المدني العراقي|قانون المرافعات|قانون العقوبات العراقي/i, // Iraqi laws
    /المحكمة الاتحادية|محكمة عراقية/i, // Iraqi courts
    /بغدادية|البصرة|نجفية|كربلائية/i, // Adjectives
    /القانون رقم \d+|قانون رقم\s*\d+/i, // Legal article numbers in Iraqi format
    /وزارة العدل العراقية/i, // Iraqi Ministry of Justice
    /بغداد - العراق|عراق - بغداد/i, // Explicit location
  ];

  const hasIraqiSpecific = iraqiSpecificPatterns.some((pattern) =>
    pattern.test(content),
  );

  if (hasIraqiSpecific) {
    return {
      isValid: true,
      jurisdiction: "iraqi",
      issues: [],
    };
  }

  // Check if there are generic legal terms with Iraq indicators
  const iraqIndicators = [
    /في العراق|بالعراق|موقع في العراق/i, // "in Iraq"
    /حسب القانون العراقي/i, // "according to Iraqi law"
    /عراقي/i, // Iraqi
  ];

  const hasGenericLegal = legalTerms.some((term) => term.test(content));
  const hasIraqIndicator = iraqIndicators.some((pattern) =>
    pattern.test(content),
  );

  if (hasGenericLegal && hasIraqIndicator) {
    return {
      isValid: true,
      jurisdiction: "iraqi",
      issues: [],
    };
  }

  // Only generic legal terms found, no Iraqi context
  return {
    isValid: true, // Still valid legal content, but jurisdiction unknown
    jurisdiction: "unknown",
    issues: [
      "Content contains generic legal terminology but lacks Iraqi-specific context",
    ],
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
