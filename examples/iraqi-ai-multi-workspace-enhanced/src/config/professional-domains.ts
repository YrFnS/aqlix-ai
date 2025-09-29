/**
 * Iraqi Professional Domain Configuration
 * Comprehensive professional domain templates and requirements for Iraqi workspaces
 *
 * Supports 7 major Iraqi professional domains:
 * - Legal: Iraqi civil law, Islamic jurisprudence, court procedures
 * - Medical: Islamic medical ethics, patient privacy, halal medication guidelines
 * - Educational: Islamic education principles, Arabic language preservation
 * - Business: Halal business practices, Islamic finance compliance
 * - Engineering: Iraqi building codes, environmental compliance
 * - Government: Public sector requirements, regulatory compliance
 * - Religious: Islamic scholarly work, religious education
 */

export type ProfessionalDomain =
  | "legal"
  | "medical"
  | "educational"
  | "business"
  | "engineering"
  | "government"
  | "religious";

export type IraqiGovernorate =
  | "baghdad"
  | "basra"
  | "nineveh"
  | "arbil"
  | "najaf"
  | "karbala"
  | "babylon"
  | "anbar"
  | "diyala"
  | "kirkuk"
  | "saladin"
  | "wasit"
  | "maysan"
  | "muthanna"
  | "qadisiyyah"
  | "dhi_qar"
  | "sulaymaniyah"
  | "dahuk";

export interface ProfessionalLicense {
  id: string;
  type: "license" | "certification" | "registration" | "membership";
  authority: string;
  authorityAr: string;
  number: string;
  issuedDate: Date;
  expiryDate?: Date;
  status: "active" | "expired" | "suspended" | "pending";
  verificationUrl?: string;
  governorate?: IraqiGovernorate;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: "legal" | "ethical" | "religious" | "regulatory" | "technical";
  severity: "mandatory" | "recommended" | "optional";
  validationRules: string[];
  penalties?: string[];
  references?: {
    law?: string;
    article?: string;
    url?: string;
  };
}

export interface ProfessionalSpecialization {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  requirements: string[];
  certifications?: string[];
  experience?: {
    minYears: number;
    preferredYears: number;
  };
}

export interface WorkspaceFeature {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: "core" | "premium" | "enterprise" | "government";
  icon: string;
  permissions: string[];
  culturalRequirements?: string[];
  securityLevel: "basic" | "enhanced" | "maximum" | "government";
}

export interface ProfessionalDomainConfig {
  id: ProfessionalDomain;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  color: string;
  culturalCompliance: {
    islamicCompliance: boolean;
    culturalSensitivity: "basic" | "enhanced" | "maximum";
    religousContent: boolean;
    politicalNeutrality: boolean;
    sectarianSafety: boolean;
  };
  features: WorkspaceFeature[];
  specializations: ProfessionalSpecialization[];
  complianceRequirements: ComplianceRequirement[];
  licenseTypes: ProfessionalLicense["type"][];
  governorateSupport: IraqiGovernorate[];
  templates: {
    defaultSettings: Record<string, any>;
    culturalSettings: Record<string, any>;
    securitySettings: Record<string, any>;
  };
  pricing: {
    basic: number; // IQD per month
    premium: number;
    enterprise: number;
    government?: number;
  };
  supportedLanguages: ("ar" | "en" | "ku")[];
  requiredValidations: string[];
}

// Legal Professional Domain Configuration
export const legalDomainConfig: ProfessionalDomainConfig = {
  id: "legal",
  name: "Legal Services",
  nameAr: "الخدمات القانونية",
  description:
    "Iraqi legal practice management with Islamic jurisprudence and civil law compliance",
  descriptionAr:
    "إدارة الممارسة القانونية العراقية مع الفقه الإسلامي والامتثال للقانون المدني",
  icon: "⚖️",
  color: "#1f2937",
  culturalCompliance: {
    islamicCompliance: true,
    culturalSensitivity: "maximum",
    religousContent: true,
    politicalNeutrality: true,
    sectarianSafety: true,
  },
  features: [
    {
      id: "case-management",
      name: "Case Management",
      nameAr: "إدارة القضايا",
      description: "Comprehensive case tracking and management system",
      descriptionAr: "نظام شامل لتتبع وإدارة القضايا",
      category: "core",
      icon: "📁",
      permissions: ["view_cases", "create_cases", "edit_cases", "delete_cases"],
      culturalRequirements: ["islamic-jurisprudence", "iraqi-civil-law"],
      securityLevel: "enhanced",
    },
    {
      id: "client-consultation",
      name: "Client Consultation",
      nameAr: "استشارة العملاء",
      description: "Secure client consultation scheduling and management",
      descriptionAr: "جدولة وإدارة استشارات العملاء الآمنة",
      category: "core",
      icon: "👥",
      permissions: [
        "view_clients",
        "schedule_consultations",
        "manage_appointments",
      ],
      culturalRequirements: ["privacy-protection", "cultural-sensitivity"],
      securityLevel: "maximum",
    },
    {
      id: "legal-documents",
      name: "Legal Document Templates",
      nameAr: "قوالب المستندات القانونية",
      description: "Iraqi legal document templates and contract management",
      descriptionAr: "قوالب المستندات القانونية العراقية وإدارة العقود",
      category: "premium",
      icon: "📋",
      permissions: ["view_templates", "create_documents", "edit_templates"],
      culturalRequirements: ["iraqi-legal-format", "arabic-documentation"],
      securityLevel: "enhanced",
    },
    {
      id: "court-calendar",
      name: "Court Calendar Integration",
      nameAr: "تكامل تقويم المحكمة",
      description:
        "Integration with Iraqi court systems and calendar management",
      descriptionAr: "التكامل مع أنظمة المحاكم العراقية وإدارة التقويم",
      category: "enterprise",
      icon: "📅",
      permissions: ["view_calendar", "schedule_hearings", "court_integration"],
      culturalRequirements: [
        "court-procedure-compliance",
        "government-integration",
      ],
      securityLevel: "government",
    },
    {
      id: "fee-calculation",
      name: "Fee Calculation & Invoicing",
      nameAr: "حساب الرسوم والفوترة",
      description:
        "Automated fee calculation based on Iraqi Bar Association guidelines",
      descriptionAr:
        "حساب الرسوم الآلي على أساس إرشادات نقابة المحامين العراقيين",
      category: "premium",
      icon: "💰",
      permissions: ["calculate_fees", "generate_invoices", "payment_tracking"],
      culturalRequirements: ["halal-business-practices", "iraqi-taxation"],
      securityLevel: "enhanced",
    },
    {
      id: "legal-research",
      name: "Legal Research Database",
      nameAr: "قاعدة بيانات البحث القانوني",
      description:
        "Access to Iraqi legal precedents and Islamic jurisprudence database",
      descriptionAr:
        "الوصول إلى السوابق القانونية العراقية وقاعدة بيانات الفقه الإسلامي",
      category: "enterprise",
      icon: "🔍",
      permissions: [
        "research_access",
        "precedent_search",
        "jurisprudence_lookup",
      ],
      culturalRequirements: [
        "islamic-jurisprudence",
        "legal-precedent-validation",
      ],
      securityLevel: "enhanced",
    },
  ],
  specializations: [
    {
      id: "civil-law",
      name: "Civil Law",
      nameAr: "القانون المدني",
      description:
        "Iraqi civil law practice including contracts, property rights, and civil disputes",
      descriptionAr:
        "ممارسة القانون المدني العراقي بما في ذلك العقود وحقوق الملكية والنزاعات المدنية",
      requirements: [
        "Iraqi Bar Association membership",
        "Civil law certification",
      ],
      certifications: [
        "Iraqi Civil Law Certificate",
        "Contract Law Specialization",
      ],
      experience: { minYears: 2, preferredYears: 5 },
    },
    {
      id: "commercial-law",
      name: "Commercial Law",
      nameAr: "القانون التجاري",
      description:
        "Business law, corporate law, and commercial transactions in Iraqi context",
      descriptionAr:
        "قانون الأعمال وقانون الشركات والمعاملات التجارية في السياق العراقي",
      requirements: [
        "Commercial law certification",
        "Business registration knowledge",
      ],
      certifications: [
        "Iraqi Commercial Law Certificate",
        "Corporate Law Specialization",
      ],
      experience: { minYears: 3, preferredYears: 7 },
    },
    {
      id: "family-law",
      name: "Family Law",
      nameAr: "قانون الأسرة",
      description:
        "Islamic family law and personal status matters according to Iraqi regulations",
      descriptionAr:
        "قانون الأسرة الإسلامي ومسائل الأحوال الشخصية وفقا للأنظمة العراقية",
      requirements: [
        "Islamic jurisprudence knowledge",
        "Family law certification",
      ],
      certifications: [
        "Islamic Family Law Certificate",
        "Personal Status Law Specialization",
      ],
      experience: { minYears: 2, preferredYears: 5 },
    },
    {
      id: "criminal-law",
      name: "Criminal Law",
      nameAr: "القانون الجنائي",
      description: "Iraqi criminal law practice and defense representation",
      descriptionAr: "ممارسة القانون الجنائي العراقي وتمثيل الدفاع",
      requirements: ["Criminal law certification", "Court procedure knowledge"],
      certifications: [
        "Iraqi Criminal Law Certificate",
        "Defense Practice Specialization",
      ],
      experience: { minYears: 3, preferredYears: 8 },
    },
  ],
  complianceRequirements: [
    {
      id: "islamic-jurisprudence-compliance",
      name: "Islamic Jurisprudence Compliance",
      nameAr: "الامتثال للفقه الإسلامي",
      description:
        "All legal advice must align with Islamic principles and Sharia law",
      descriptionAr:
        "يجب أن تتماشى جميع الاستشارات القانونية مع المبادئ الإسلامية والشريعة الإسلامية",
      type: "religious",
      severity: "mandatory",
      validationRules: [
        "no_interest_based_contracts",
        "halal_business_practices",
        "islamic_inheritance_law",
        "sharia_compliant_contracts",
      ],
      penalties: ["license_suspension", "professional_review"],
      references: {
        law: "Iraqi Personal Status Law No. 188 of 1959",
        article: "Articles 1-5",
        url: "https://iraq-laws.gov.iq/personal-status-law",
      },
    },
    {
      id: "iraqi-civil-law-adherence",
      name: "Iraqi Civil Law Adherence",
      nameAr: "الالتزام بالقانون المدني العراقي",
      description:
        "Compliance with Iraqi Civil Code and procedural requirements",
      descriptionAr: "الامتثال للقانون المدني العراقي والمتطلبات الإجرائية",
      type: "legal",
      severity: "mandatory",
      validationRules: [
        "civil_code_compliance",
        "procedural_law_adherence",
        "court_filing_requirements",
        "legal_documentation_standards",
      ],
      penalties: ["case_dismissal", "professional_sanctions"],
      references: {
        law: "Iraqi Civil Code No. 40 of 1951",
        article: "All articles",
        url: "https://iraq-laws.gov.iq/civil-code",
      },
    },
    {
      id: "professional-ethics-standards",
      name: "Professional Ethics Standards",
      nameAr: "معايير الأخلاق المهنية",
      description: "Adherence to Iraqi Bar Association ethical guidelines",
      descriptionAr: "الالتزام بالإرشادات الأخلاقية لنقابة المحامين العراقيين",
      type: "ethical",
      severity: "mandatory",
      validationRules: [
        "client_confidentiality",
        "conflict_of_interest_avoidance",
        "professional_competence",
        "honest_representation",
      ],
      penalties: ["bar_suspension", "license_revocation"],
      references: {
        law: "Iraqi Bar Association Ethics Code",
        article: "Code of Professional Conduct",
        url: "https://iraqi-bar.org.iq/ethics-code",
      },
    },
    {
      id: "confidentiality-protocols",
      name: "Confidentiality Protocols",
      nameAr: "بروتوكولات السرية",
      description:
        "Strict client confidentiality and data protection requirements",
      descriptionAr: "سرية العميل الصارمة ومتطلبات حماية البيانات",
      type: "regulatory",
      severity: "mandatory",
      validationRules: [
        "attorney_client_privilege",
        "data_encryption",
        "secure_communication",
        "document_protection",
      ],
      penalties: ["client_lawsuit", "license_suspension"],
    },
  ],
  licenseTypes: ["license", "certification", "membership"],
  governorateSupport: [
    "baghdad",
    "basra",
    "nineveh",
    "arbil",
    "najaf",
    "karbala",
    "babylon",
    "anbar",
    "diyala",
    "kirkuk",
    "saladin",
    "wasit",
    "maysan",
    "muthanna",
    "qadisiyyah",
    "dhi_qar",
    "sulaymaniyah",
    "dahuk",
  ],
  templates: {
    defaultSettings: {
      workingHours: "08:00-17:00",
      prayerBreaks: true,
      fridayHours: "08:00-12:00",
      ramadanSchedule: "adjusted",
      culturalHolidays: "enabled",
    },
    culturalSettings: {
      islamicCompliance: true,
      arabicDocuments: true,
      culturalSensitivity: "maximum",
      religousConsiderations: true,
      sectarianNeutrality: true,
    },
    securitySettings: {
      encryptionLevel: "maximum",
      accessControl: "role-based",
      auditLogging: "comprehensive",
      dataRetention: "7-years",
      backupFrequency: "daily",
    },
  },
  pricing: {
    basic: 75000, // 75,000 IQD per month
    premium: 150000, // 150,000 IQD per month
    enterprise: 300000, // 300,000 IQD per month
    government: 500000, // 500,000 IQD per month
  },
  supportedLanguages: ["ar", "en"],
  requiredValidations: [
    "iraqi_bar_membership",
    "professional_license",
    "islamic_jurisprudence_cert",
    "cultural_compliance_training",
  ],
};

// Medical Professional Domain Configuration
export const medicalDomainConfig: ProfessionalDomainConfig = {
  id: "medical",
  name: "Medical Services",
  nameAr: "الخدمات الطبية",
  description:
    "Iraqi healthcare practice management with Islamic medical ethics and patient care",
  descriptionAr:
    "إدارة ممارسة الرعاية الصحية العراقية مع الأخلاق الطبية الإسلامية ورعاية المرضى",
  icon: "🏥",
  color: "#dc2626",
  culturalCompliance: {
    islamicCompliance: true,
    culturalSensitivity: "maximum",
    religousContent: true,
    politicalNeutrality: true,
    sectarianSafety: true,
  },
  features: [
    {
      id: "patient-records",
      name: "Patient Record Management",
      nameAr: "إدارة سجلات المرضى",
      description: "Secure and comprehensive patient record management system",
      descriptionAr: "نظام آمن وشامل لإدارة سجلات المرضى",
      category: "core",
      icon: "📋",
      permissions: [
        "view_patients",
        "create_records",
        "edit_records",
        "medical_history",
      ],
      culturalRequirements: ["patient-privacy", "islamic-medical-ethics"],
      securityLevel: "maximum",
    },
    {
      id: "appointment-scheduling",
      name: "Appointment Scheduling",
      nameAr: "جدولة المواعيد",
      description:
        "Prayer-aware appointment scheduling with cultural considerations",
      descriptionAr: "جدولة المواعيد مع مراعاة الصلاة والاعتبارات الثقافية",
      category: "core",
      icon: "📅",
      permissions: [
        "schedule_appointments",
        "manage_calendar",
        "patient_communication",
      ],
      culturalRequirements: [
        "prayer-time-awareness",
        "gender-sensitive-scheduling",
      ],
      securityLevel: "enhanced",
    },
    {
      id: "prescription-management",
      name: "Prescription Management",
      nameAr: "إدارة الوصفات الطبية",
      description: "Halal medication database and prescription management",
      descriptionAr: "قاعدة بيانات الأدوية الحلال وإدارة الوصفات الطبية",
      category: "premium",
      icon: "💊",
      permissions: [
        "prescribe_medication",
        "check_interactions",
        "halal_verification",
      ],
      culturalRequirements: [
        "halal-medication-compliance",
        "islamic-medical-guidelines",
      ],
      securityLevel: "enhanced",
    },
    {
      id: "medical-imaging",
      name: "Medical Imaging Integration",
      nameAr: "تكامل التصوير الطبي",
      description: "Integration with medical imaging systems and DICOM support",
      descriptionAr: "التكامل مع أنظمة التصوير الطبي ودعم DICOM",
      category: "enterprise",
      icon: "📸",
      permissions: ["view_images", "upload_scans", "image_analysis"],
      culturalRequirements: ["patient-modesty", "gender-appropriate-imaging"],
      securityLevel: "maximum",
    },
    {
      id: "telemedicine",
      name: "Telemedicine Support",
      nameAr: "دعم الطب عن بُعد",
      description:
        "Secure telemedicine consultations with cultural considerations",
      descriptionAr: "استشارات الطب عن بُعد الآمنة مع الاعتبارات الثقافية",
      category: "premium",
      icon: "💻",
      permissions: [
        "video_consultation",
        "remote_diagnosis",
        "digital_prescription",
      ],
      culturalRequirements: [
        "cultural-consultation-guidelines",
        "gender-appropriate-care",
      ],
      securityLevel: "maximum",
    },
    {
      id: "insurance-claims",
      name: "Insurance Claim Processing",
      nameAr: "معالجة مطالبات التأمين",
      description: "Integration with Iraqi health insurance systems",
      descriptionAr: "التكامل مع أنظمة التأمين الصحي العراقية",
      category: "enterprise",
      icon: "🏛️",
      permissions: [
        "submit_claims",
        "track_payments",
        "insurance_verification",
      ],
      culturalRequirements: [
        "iraqi-insurance-compliance",
        "government-integration",
      ],
      securityLevel: "government",
    },
  ],
  specializations: [
    {
      id: "general-medicine",
      name: "General Medicine",
      nameAr: "الطب العام",
      description: "General practice medicine with Islamic medical ethics",
      descriptionAr: "ممارسة الطب العام مع الأخلاق الطبية الإسلامية",
      requirements: ["Medical degree", "Iraqi Medical Association membership"],
      certifications: [
        "General Practice Certificate",
        "Islamic Medical Ethics",
      ],
      experience: { minYears: 1, preferredYears: 3 },
    },
    {
      id: "pediatrics",
      name: "Pediatrics",
      nameAr: "طب الأطفال",
      description:
        "Specialized pediatric care with cultural family considerations",
      descriptionAr: "رعاية طب الأطفال المتخصصة مع الاعتبارات الأسرية الثقافية",
      requirements: ["Pediatrics specialization", "Child care certification"],
      certifications: [
        "Pediatrics Board Certification",
        "Family Care Specialization",
      ],
      experience: { minYears: 3, preferredYears: 6 },
    },
    {
      id: "womens-health",
      name: "Women's Health",
      nameAr: "صحة المرأة",
      description:
        "Specialized care for women with Islamic modesty and cultural considerations",
      descriptionAr:
        "الرعاية المتخصصة للمرأة مع الحشمة الإسلامية والاعتبارات الثقافية",
      requirements: [
        "Gynecology specialization",
        "Cultural sensitivity training",
      ],
      certifications: [
        "OB/GYN Board Certification",
        "Islamic Medical Ethics for Women",
      ],
      experience: { minYears: 4, preferredYears: 8 },
    },
  ],
  complianceRequirements: [
    {
      id: "islamic-medical-ethics",
      name: "Islamic Medical Ethics Compliance",
      nameAr: "الامتثال للأخلاق الطبية الإسلامية",
      description:
        "All medical practice must align with Islamic medical ethics and principles",
      descriptionAr:
        "يجب أن تتماشى جميع الممارسات الطبية مع الأخلاق والمبادئ الطبية الإسلامية",
      type: "religious",
      severity: "mandatory",
      validationRules: [
        "halal_medication_only",
        "gender_appropriate_care",
        "patient_modesty_protection",
        "islamic_end_of_life_care",
      ],
      penalties: ["medical_license_suspension", "professional_review"],
    },
    {
      id: "patient-privacy-protection",
      name: "Patient Privacy Protection",
      nameAr: "حماية خصوصية المريض",
      description: "Strict patient confidentiality and medical data protection",
      descriptionAr: "السرية الصارمة للمريض وحماية البيانات الطبية",
      type: "regulatory",
      severity: "mandatory",
      validationRules: [
        "hipaa_equivalent_compliance",
        "medical_data_encryption",
        "access_control_strict",
        "audit_trail_complete",
      ],
      penalties: ["license_revocation", "legal_action"],
    },
  ],
  licenseTypes: ["license", "certification", "registration"],
  governorateSupport: [
    "baghdad",
    "basra",
    "nineveh",
    "arbil",
    "najaf",
    "karbala",
    "babylon",
    "anbar",
    "diyala",
    "kirkuk",
    "saladin",
    "wasit",
    "maysan",
    "muthanna",
    "qadisiyyah",
    "dhi_qar",
    "sulaymaniyah",
    "dahuk",
  ],
  templates: {
    defaultSettings: {
      workingHours: "08:00-20:00",
      prayerBreaks: true,
      emergencyHours: "24/7",
      ramadanSchedule: "adjusted",
      culturalHolidays: "enabled",
    },
    culturalSettings: {
      islamicCompliance: true,
      genderSeparation: true,
      modestyCare: true,
      halalMedication: true,
      culturalSensitivity: "maximum",
    },
    securitySettings: {
      encryptionLevel: "maximum",
      accessControl: "role-based-strict",
      auditLogging: "comprehensive",
      dataRetention: "lifetime",
      backupFrequency: "realtime",
    },
  },
  pricing: {
    basic: 100000, // 100,000 IQD per month
    premium: 200000, // 200,000 IQD per month
    enterprise: 400000, // 400,000 IQD per month
    government: 600000, // 600,000 IQD per month
  },
  supportedLanguages: ["ar", "en", "ku"],
  requiredValidations: [
    "iraqi_medical_license",
    "medical_association_membership",
    "islamic_medical_ethics_cert",
    "cultural_competency_training",
  ],
};

// Educational Professional Domain Configuration
export const educationalDomainConfig: ProfessionalDomainConfig = {
  id: "educational",
  name: "Educational Services",
  nameAr: "الخدمات التعليمية",
  description:
    "Iraqi educational institution management with Islamic education principles",
  descriptionAr: "إدارة المؤسسات التعليمية العراقية مع مبادئ التعليم الإسلامي",
  icon: "🎓",
  color: "#059669",
  culturalCompliance: {
    islamicCompliance: true,
    culturalSensitivity: "enhanced",
    religousContent: true,
    politicalNeutrality: true,
    sectarianSafety: true,
  },
  features: [
    {
      id: "student-management",
      name: "Student Management System",
      nameAr: "نظام إدارة الطلاب",
      description: "Comprehensive student record and progress tracking system",
      descriptionAr: "نظام شامل لسجلات الطلاب وتتبع التقدم",
      category: "core",
      icon: "👨‍🎓",
      permissions: [
        "view_students",
        "manage_records",
        "track_progress",
        "generate_reports",
      ],
      culturalRequirements: [
        "student-privacy",
        "islamic-educational-guidelines",
      ],
      securityLevel: "enhanced",
    },
    {
      id: "curriculum-management",
      name: "Curriculum Management",
      nameAr: "إدارة المناهج",
      description: "Islamic-compliant curriculum design and management tools",
      descriptionAr: "أدوات تصميم وإدارة المناهج المتوافقة مع الإسلام",
      category: "premium",
      icon: "📚",
      permissions: [
        "design_curriculum",
        "manage_courses",
        "islamic_studies_integration",
      ],
      culturalRequirements: [
        "islamic-education-compliance",
        "arabic-language-preservation",
      ],
      securityLevel: "enhanced",
    },
    {
      id: "parent-communication",
      name: "Parent Communication Portal",
      nameAr: "بوابة التواصل مع أولياء الأمور",
      description: "Secure communication platform for parents and teachers",
      descriptionAr: "منصة تواصل آمنة لأولياء الأمور والمعلمين",
      category: "core",
      icon: "👨‍👩‍👧‍👦",
      permissions: [
        "parent_communication",
        "progress_sharing",
        "event_notifications",
      ],
      culturalRequirements: [
        "family-involvement",
        "cultural-communication-norms",
      ],
      securityLevel: "enhanced",
    },
  ],
  specializations: [
    {
      id: "islamic-studies",
      name: "Islamic Studies",
      nameAr: "الدراسات الإسلامية",
      description: "Specialized Islamic education and Quranic studies",
      descriptionAr: "التعليم الإسلامي المتخصص والدراسات القرآنية",
      requirements: [
        "Islamic studies degree",
        "Religious education certification",
      ],
      certifications: [
        "Islamic Education Certificate",
        "Quranic Studies Specialization",
      ],
      experience: { minYears: 2, preferredYears: 5 },
    },
    {
      id: "arabic-language",
      name: "Arabic Language Education",
      nameAr: "تعليم اللغة العربية",
      description: "Arabic language instruction and literary studies",
      descriptionAr: "تدريس اللغة العربية والدراسات الأدبية",
      requirements: [
        "Arabic literature degree",
        "Language instruction certification",
      ],
      certifications: [
        "Arabic Language Teaching Certificate",
        "Literature Specialization",
      ],
      experience: { minYears: 2, preferredYears: 4 },
    },
  ],
  complianceRequirements: [
    {
      id: "islamic-education-principles",
      name: "Islamic Education Principles",
      nameAr: "مبادئ التعليم الإسلامي",
      description:
        "All educational content must align with Islamic values and principles",
      descriptionAr:
        "يجب أن يتماشى جميع المحتوى التعليمي مع القيم والمبادئ الإسلامية",
      type: "religious",
      severity: "mandatory",
      validationRules: [
        "islamic_values_integration",
        "halal_content_only",
        "prayer_time_accommodation",
        "cultural_sensitivity_education",
      ],
      penalties: ["curriculum_review", "certification_suspension"],
    },
  ],
  licenseTypes: ["license", "certification"],
  governorateSupport: [
    "baghdad",
    "basra",
    "nineveh",
    "arbil",
    "najaf",
    "karbala",
    "babylon",
    "anbar",
    "diyala",
    "kirkuk",
    "saladin",
    "wasit",
    "maysan",
    "muthanna",
    "qadisiyyah",
    "dhi_qar",
    "sulaymaniyah",
    "dahuk",
  ],
  templates: {
    defaultSettings: {
      workingHours: "07:00-14:00",
      prayerBreaks: true,
      fridayHours: "07:00-11:30",
      ramadanSchedule: "reduced",
      culturalHolidays: "extended",
    },
    culturalSettings: {
      islamicCompliance: true,
      arabicLanguagePreservation: true,
      culturalEducation: true,
      religiousStudiesIntegration: true,
      sectarianNeutrality: true,
    },
    securitySettings: {
      encryptionLevel: "enhanced",
      accessControl: "role-based",
      auditLogging: "standard",
      dataRetention: "10-years",
      backupFrequency: "daily",
    },
  },
  pricing: {
    basic: 50000, // 50,000 IQD per month
    premium: 100000, // 100,000 IQD per month
    enterprise: 200000, // 200,000 IQD per month
    government: 300000, // 300,000 IQD per month
  },
  supportedLanguages: ["ar", "en", "ku"],
  requiredValidations: [
    "teaching_license",
    "educational_ministry_approval",
    "islamic_education_cert",
    "cultural_competency_training",
  ],
};

// Comprehensive domain configuration registry
export const PROFESSIONAL_DOMAINS: Record<
  ProfessionalDomain,
  ProfessionalDomainConfig
> = {
  legal: legalDomainConfig,
  medical: medicalDomainConfig,
  educational: educationalDomainConfig,
  // Additional domains would be configured here
  business: {
    id: "business",
    name: "Business Services",
    nameAr: "الخدمات التجارية",
    description:
      "Iraqi business management with halal practices and Islamic finance",
    descriptionAr:
      "إدارة الأعمال العراقية مع الممارسات الحلال والتمويل الإسلامي",
    icon: "💼",
    color: "#1f2937",
    culturalCompliance: {
      islamicCompliance: true,
      culturalSensitivity: "enhanced",
      religousContent: false,
      politicalNeutrality: true,
      sectarianSafety: true,
    },
    features: [],
    specializations: [],
    complianceRequirements: [],
    licenseTypes: ["license", "registration"],
    governorateSupport: ["baghdad", "basra", "nineveh", "arbil"],
    templates: {
      defaultSettings: {},
      culturalSettings: {},
      securitySettings: {},
    },
    pricing: {
      basic: 60000,
      premium: 120000,
      enterprise: 250000,
    },
    supportedLanguages: ["ar", "en"],
    requiredValidations: [
      "business_registration",
      "chamber_of_commerce_membership",
    ],
  },
  engineering: {
    id: "engineering",
    name: "Engineering Services",
    nameAr: "الخدمات الهندسية",
    description:
      "Iraqi engineering practice with building codes and environmental compliance",
    descriptionAr:
      "الممارسة الهندسية العراقية مع قوانين البناء والامتثال البيئي",
    icon: "🏗️",
    color: "#374151",
    culturalCompliance: {
      islamicCompliance: true,
      culturalSensitivity: "basic",
      religousContent: false,
      politicalNeutrality: true,
      sectarianSafety: true,
    },
    features: [],
    specializations: [],
    complianceRequirements: [],
    licenseTypes: ["license", "certification"],
    governorateSupport: ["baghdad", "basra", "nineveh", "arbil"],
    templates: {
      defaultSettings: {},
      culturalSettings: {},
      securitySettings: {},
    },
    pricing: {
      basic: 80000,
      premium: 160000,
      enterprise: 320000,
    },
    supportedLanguages: ["ar", "en"],
    requiredValidations: ["engineering_license", "professional_certification"],
  },
  government: {
    id: "government",
    name: "Government Services",
    nameAr: "الخدمات الحكومية",
    description:
      "Iraqi government institution management and public service delivery",
    descriptionAr: "إدارة المؤسسات الحكومية العراقية وتقديم الخدمات العامة",
    icon: "🏛️",
    color: "#1f2937",
    culturalCompliance: {
      islamicCompliance: true,
      culturalSensitivity: "maximum",
      religousContent: false,
      politicalNeutrality: true,
      sectarianSafety: true,
    },
    features: [],
    specializations: [],
    complianceRequirements: [],
    licenseTypes: ["license", "registration"],
    governorateSupport: ["baghdad", "basra", "nineveh", "arbil"],
    templates: {
      defaultSettings: {},
      culturalSettings: {},
      securitySettings: {},
    },
    pricing: {
      basic: 200000,
      premium: 400000,
      enterprise: 800000,
      government: 1000000,
    },
    supportedLanguages: ["ar", "en", "ku"],
    requiredValidations: ["government_clearance", "security_certification"],
  },
  religious: {
    id: "religious",
    name: "Religious Services",
    nameAr: "الخدمات الدينية",
    description: "Islamic religious institution management and scholarly work",
    descriptionAr: "إدارة المؤسسات الدينية الإسلامية والعمل العلمي",
    icon: "🕌",
    color: "#059669",
    culturalCompliance: {
      islamicCompliance: true,
      culturalSensitivity: "maximum",
      religousContent: true,
      politicalNeutrality: true,
      sectarianSafety: true,
    },
    features: [],
    specializations: [],
    complianceRequirements: [],
    licenseTypes: ["certification", "registration"],
    governorateSupport: ["baghdad", "najaf", "karbala", "nineveh"],
    templates: {
      defaultSettings: {},
      culturalSettings: {},
      securitySettings: {},
    },
    pricing: {
      basic: 30000,
      premium: 60000,
      enterprise: 120000,
    },
    supportedLanguages: ["ar"],
    requiredValidations: ["religious_certification", "islamic_studies_degree"],
  },
};

// Utility functions for domain management
export function getDomainConfig(
  domain: ProfessionalDomain,
): ProfessionalDomainConfig {
  return PROFESSIONAL_DOMAINS[domain];
}

export function getDomainFeatures(
  domain: ProfessionalDomain,
): WorkspaceFeature[] {
  return getDomainConfig(domain).features;
}

export function getDomainSpecializations(
  domain: ProfessionalDomain,
): ProfessionalSpecialization[] {
  return getDomainConfig(domain).specializations;
}

export function getDomainComplianceRequirements(
  domain: ProfessionalDomain,
): ComplianceRequirement[] {
  return getDomainConfig(domain).complianceRequirements;
}

export function validateProfessionalLicense(
  license: ProfessionalLicense,
  domain: ProfessionalDomain,
): boolean {
  const domainConfig = getDomainConfig(domain);
  return (
    domainConfig.licenseTypes.includes(license.type) &&
    license.status === "active"
  );
}

export function calculateDomainPricing(
  domain: ProfessionalDomain,
  tier: "basic" | "premium" | "enterprise" | "government",
  governorate?: IraqiGovernorate,
): number {
  const domainConfig = getDomainConfig(domain);
  let basePrice = domainConfig.pricing[tier];

  // Apply governorate-specific pricing adjustments
  if (governorate) {
    const governorateMultipliers: Partial<Record<IraqiGovernorate, number>> = {
      baghdad: 1.2, // 20% higher for capital
      basra: 1.1, // 10% higher for major oil city
      arbil: 1.15, // 15% higher for KRG capital
      sulaymaniyah: 1.1,
      dahuk: 1.05,
    };

    const multiplier = governorateMultipliers[governorate] || 1.0;
    basePrice = Math.round(basePrice * multiplier);
  }

  return basePrice;
}

export function getSupportedLanguages(
  domain: ProfessionalDomain,
): ("ar" | "en" | "ku")[] {
  return getDomainConfig(domain).supportedLanguages;
}

export function getRequiredValidations(domain: ProfessionalDomain): string[] {
  return getDomainConfig(domain).requiredValidations;
}
