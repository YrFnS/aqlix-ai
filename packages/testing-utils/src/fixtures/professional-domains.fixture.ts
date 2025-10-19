/**
 * Professional domain fixtures for testing domain-specific features
 * Provides terminology and scenarios across Iraqi professional domains
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
 * Professional terminology fixture
 */
export interface ProfessionalTerminology {
  id: string;
  domain: ProfessionalDomain;
  termArabic: string;
  termEnglish: string;
  description: string;
  usage: string;
}

/**
 * Professional scenario fixture
 */
export interface ProfessionalScenario {
  id: string;
  domain: ProfessionalDomain;
  title: string;
  description: string;
  sampleQuery: string;
  expectedResponsePattern: string;
}

/**
 * Legal domain terminology
 */
export const legalTerminology: ProfessionalTerminology[] = [
  {
    id: "legal_contract",
    domain: "legal",
    termArabic: "عقد",
    termEnglish: "Contract",
    description: "Legal agreement between parties",
    usage: "نحتاج إلى مراجعة العقد قبل التوقيع",
  },
  {
    id: "legal_lawsuit",
    domain: "legal",
    termArabic: "دعوى قضائية",
    termEnglish: "Lawsuit",
    description: "Legal action in court",
    usage: "تم رفع دعوى قضائية ضد الطرف المخالف",
  },
  {
    id: "legal_arbitration",
    domain: "legal",
    termArabic: "تحكيم",
    termEnglish: "Arbitration",
    description: "Alternative dispute resolution",
    usage: "نفضل اللجوء إلى التحكيم بدلاً من المحكمة",
  },
];

/**
 * Medical domain terminology
 */
export const medicalTerminology: ProfessionalTerminology[] = [
  {
    id: "medical_diagnosis",
    domain: "medical",
    termArabic: "تشخيص",
    termEnglish: "Diagnosis",
    description: "Medical identification of condition",
    usage: "يجب الحصول على تشخيص دقيق من الطبيب المختص",
  },
  {
    id: "medical_prescription",
    domain: "medical",
    termArabic: "وصفة طبية",
    termEnglish: "Prescription",
    description: "Medical prescription for treatment",
    usage: "يرجى الالتزام بالوصفة الطبية المحددة",
  },
  {
    id: "medical_consultation",
    domain: "medical",
    termArabic: "استشارة طبية",
    termEnglish: "Medical Consultation",
    description: "Professional medical advice",
    usage: "احجز استشارة طبية مع الطبيب المختص",
  },
];

/**
 * Educational domain terminology
 */
export const educationalTerminology: ProfessionalTerminology[] = [
  {
    id: "educational_curriculum",
    domain: "educational",
    termArabic: "منهج دراسي",
    termEnglish: "Curriculum",
    description: "Course of study",
    usage: "المنهج الدراسي معتمد من وزارة التعليم",
  },
  {
    id: "educational_assessment",
    domain: "educational",
    termArabic: "تقييم",
    termEnglish: "Assessment",
    description: "Evaluation of learning",
    usage: "التقييم النهائي سيكون في نهاية الفصل الدراسي",
  },
  {
    id: "educational_accreditation",
    domain: "educational",
    termArabic: "اعتماد أكاديمي",
    termEnglish: "Academic Accreditation",
    description: "Official recognition of educational quality",
    usage: "المؤسسة حاصلة على الاعتماد الأكاديمي الكامل",
  },
];

/**
 * Engineering domain terminology
 */
export const engineeringTerminology: ProfessionalTerminology[] = [
  {
    id: "engineering_specification",
    domain: "engineering",
    termArabic: "مواصفة فنية",
    termEnglish: "Technical Specification",
    description: "Detailed requirements for engineering work",
    usage: "يجب الالتزام بالمواصفات الفنية المحددة",
  },
  {
    id: "engineering_blueprint",
    domain: "engineering",
    termArabic: "مخطط هندسي",
    termEnglish: "Engineering Blueprint",
    description: "Technical drawing or plan",
    usage: "المخطط الهندسي معتمد من الجهات المختصة",
  },
];

/**
 * Organizational domain terminology
 */
export const organizationalTerminology: ProfessionalTerminology[] = [
  {
    id: "organizational_workflow",
    domain: "organizational",
    termArabic: "سير العمل",
    termEnglish: "Workflow",
    description: "Sequence of processes",
    usage: "نحتاج إلى تحسين سير العمل في القسم",
  },
  {
    id: "organizational_policy",
    domain: "organizational",
    termArabic: "سياسة المؤسسة",
    termEnglish: "Organizational Policy",
    description: "Formal guidelines and procedures",
    usage: "يجب الالتزام بسياسة المؤسسة",
  },
];

/**
 * Professional scenarios for testing
 */
export const professionalScenarios: ProfessionalScenario[] = [
  {
    id: "legal_contract_review",
    domain: "legal",
    title: "Contract Review",
    description: "Iraqi legal professional needs contract review",
    sampleQuery: "هل يمكنك مراجعة هذا العقد التجاري؟",
    expectedResponsePattern:
      "يجب مراجعة العقد وفقاً للقانون العراقي.*القانون المدني",
  },
  {
    id: "medical_diagnosis_inquiry",
    domain: "medical",
    title: "Diagnosis Inquiry",
    description: "Iraqi medical professional seeks diagnostic guidance",
    sampleQuery: "ما هي الفحوصات اللازمة لتشخيص هذه الحالة؟",
    expectedResponsePattern: "يجب استشارة الطبيب المختص.*الفحوصات الطبية",
  },
  {
    id: "educational_curriculum_planning",
    domain: "educational",
    title: "Curriculum Planning",
    description: "Iraqi educator plans curriculum",
    sampleQuery: "كيف أخطط للمنهج الدراسي الجديد؟",
    expectedResponsePattern: "يجب اتباع معايير.*وزارة التعليم",
  },
];

/**
 * Get terminology by domain
 */
export function getTerminologyByDomain(
  domain: ProfessionalDomain,
): ProfessionalTerminology[] {
  const allTerminology = [
    ...legalTerminology,
    ...medicalTerminology,
    ...educationalTerminology,
    ...engineeringTerminology,
    ...organizationalTerminology,
  ];

  return allTerminology.filter((term) => term.domain === domain);
}

/**
 * Get scenarios by domain
 */
export function getScenariosByDomain(
  domain: ProfessionalDomain,
): ProfessionalScenario[] {
  return professionalScenarios.filter((scenario) => scenario.domain === domain);
}

/**
 * Get all professional terminology
 */
export function getAllProfessionalTerminology(): ProfessionalTerminology[] {
  return [
    ...legalTerminology,
    ...medicalTerminology,
    ...educationalTerminology,
    ...engineeringTerminology,
    ...organizationalTerminology,
  ];
}

/**
 * Get all professional scenarios
 */
export function getAllProfessionalScenarios(): ProfessionalScenario[] {
  return professionalScenarios;
}
