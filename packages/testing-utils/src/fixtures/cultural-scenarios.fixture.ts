/**
 * Cultural test scenarios for Islamic compliance and Iraqi appropriateness validation
 * Provides comprehensive test cases across different cultural contexts
 */

import type { CulturalTestCase } from "../types";

/**
 * Collection of cultural test scenarios for validation testing
 */
export const culturalScenarios: CulturalTestCase[] = [
  // Islamic compliance scenarios
  {
    id: "islamic_greeting_formal",
    category: "islamic",
    content: "السلام عليكم ورحمة الله وبركاته",
    expectedCompliance: 1.0,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "islamic_thanks_formal",
    category: "islamic",
    content: "الحمد لله، نشكر الله على نعمه",
    expectedCompliance: 1.0,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "islamic_invocation",
    category: "islamic",
    content: "بسم الله الرحمن الرحيم",
    expectedCompliance: 1.0,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "islamic_farewell",
    category: "islamic",
    content: "في أمان الله، بارك الله فيك",
    expectedCompliance: 1.0,
    culturalContext: {
      audience: "general",
    },
  },

  // Political neutrality scenarios
  {
    id: "political_neutral_service",
    category: "political",
    content: "نحن نخدم جميع العراقيين بغض النظر عن انتمائهم",
    expectedCompliance: 0.95,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "political_neutral_unity",
    category: "political",
    content: "نعمل معاً من أجل مستقبل أفضل لجميع المواطنين",
    expectedCompliance: 0.95,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "political_neutral_professional",
    category: "political",
    content: "خدماتنا متاحة لجميع المهنيين في العراق",
    expectedCompliance: 0.95,
    culturalContext: {
      audience: "professional",
    },
  },

  // Professional domain scenarios - Legal
  {
    id: "legal_professional_service",
    category: "professional",
    content: "يسعدنا خدمتكم في مجال القانون العراقي",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "legal",
      audience: "professional",
    },
  },
  {
    id: "legal_professional_compliance",
    category: "professional",
    content: "نلتزم بتقديم استشارات قانونية وفقاً للقانون العراقي",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "legal",
      audience: "professional",
    },
  },

  // Professional domain scenarios - Medical
  {
    id: "medical_professional_service",
    category: "professional",
    content: "نقدم خدمات طبية متميزة لجميع المرضى",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "medical",
      audience: "professional",
    },
  },
  {
    id: "medical_professional_privacy",
    category: "professional",
    content: "نحترم خصوصية المريض ونلتزم بالسرية الطبية",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "medical",
      audience: "professional",
    },
  },

  // Professional domain scenarios - Educational
  {
    id: "educational_professional_service",
    category: "professional",
    content: "نساهم في تطوير التعليم والبحث العلمي في العراق",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "educational",
      audience: "professional",
    },
  },
  {
    id: "educational_professional_values",
    category: "professional",
    content: "نهتم بالقيم الأخلاقية والمهنية في التعليم",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "educational",
      audience: "professional",
    },
  },

  // Professional domain scenarios - Engineering
  {
    id: "engineering_professional_service",
    category: "professional",
    content: "نقدم حلولاً هندسية مبتكرة ومتوافقة مع المعايير العراقية",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "engineering",
      audience: "professional",
    },
  },

  // Professional domain scenarios - Organizational
  {
    id: "organizational_professional_service",
    category: "professional",
    content: "نساعدكم في تنظيم العمل بما يتناسب مع احتياجاتكم",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "organizational",
      audience: "professional",
    },
  },

  // General cultural appropriateness
  {
    id: "general_respectful_address",
    category: "general",
    content: "تفضلوا، نحن في خدمتكم",
    expectedCompliance: 0.95,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "general_hospitality",
    category: "general",
    content: "أهلاً وسهلاً بكم، نتمنى لكم تجربة مميزة",
    expectedCompliance: 0.95,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "general_family_values",
    category: "general",
    content: "نحترم قيم العائلة العراقية ونقدرها",
    expectedCompliance: 0.95,
    culturalContext: {
      audience: "general",
    },
  },
];

/**
 * Get cultural scenarios by category
 */
export function getCulturalScenariosByCategory(
  category: "islamic" | "political" | "professional" | "general",
): CulturalTestCase[] {
  return culturalScenarios.filter((scenario) => scenario.category === category);
}

/**
 * Get cultural scenarios by professional domain
 */
export function getCulturalScenariosByDomain(
  domain:
    | "legal"
    | "medical"
    | "educational"
    | "engineering"
    | "organizational",
): CulturalTestCase[] {
  return culturalScenarios.filter(
    (scenario) => scenario.culturalContext.domain === domain,
  );
}

/**
 * Get cultural scenarios by audience type
 */
export function getCulturalScenariosByAudience(
  audience: "professional" | "general" | "educational",
): CulturalTestCase[] {
  return culturalScenarios.filter(
    (scenario) => scenario.culturalContext.audience === audience,
  );
}

/**
 * Get highly compliant scenarios (>= 0.95)
 */
export function getHighlyCompliantScenarios(): CulturalTestCase[] {
  return culturalScenarios.filter(
    (scenario) => scenario.expectedCompliance >= 0.95,
  );
}

/**
 * Get Islamic compliance scenarios
 */
export function getIslamicComplianceScenarios(): CulturalTestCase[] {
  return getCulturalScenariosByCategory("islamic");
}

/**
 * Get political neutrality scenarios
 */
export function getPoliticalNeutralityScenarios(): CulturalTestCase[] {
  return getCulturalScenariosByCategory("political");
}
