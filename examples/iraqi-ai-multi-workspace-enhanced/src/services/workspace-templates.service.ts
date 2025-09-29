/**
 * Iraqi AI Multi-Workspace Template Service
 * Professional domain workspace templates with comprehensive Iraqi cultural integration
 *
 * Features:
 * - 7 professional domain templates with Iraqi-specific configurations
 * - Cultural compliance validation and scoring
 * - Arabic-first template design with RTL support
 * - Professional license verification and requirement management
 * - Government and regulatory compliance templates
 * - Customizable template inheritance and override system
 */

import {
  ProfessionalDomain,
  ProfessionalDomainConfig,
  PROFESSIONAL_DOMAINS,
  getDomainConfig,
  validateProfessionalLicense,
  calculateDomainPricing,
  IraqiGovernorate,
  ProfessionalLicense,
  ComplianceRequirement,
  WorkspaceFeature,
} from "../config/professional-domains.js";
import {
  IraqiWorkspace,
  IraqiCulturalSettings,
  IraqiDialect,
  WorkspaceVisibility,
  MemberRole,
  CulturalComplianceScore,
} from "../types/workspace.types.js";

export interface WorkspaceTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  domain: ProfessionalDomain;
  category: "standard" | "premium" | "enterprise" | "government";
  icon: string;
  color: string;
  preview: {
    features: string[];
    featuresAr: string[];
    benefits: string[];
    benefitsAr: string[];
    requirements: string[];
    requirementsAr: string[];
  };
  configuration: {
    defaultSettings: Partial<IraqiWorkspace>;
    culturalSettings: IraqiCulturalSettings;
    securityLevel: "basic" | "enhanced" | "maximum" | "government";
    complianceRequirements: string[];
    requiredLicenses: string[];
    supportedLanguages: ("ar" | "en" | "ku")[];
    governorateSupport: IraqiGovernorate[];
  };
  pricing: {
    setupFee: number;
    monthlyFee: number;
    annualDiscount: number;
    governmentDiscount?: number;
  };
  customization: {
    allowedModifications: string[];
    restrictedSettings: string[];
    inheritanceChain: string[];
    overridePermissions: MemberRole[];
  };
}

export interface TemplateValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  culturalCompliance: CulturalComplianceScore;
  missingRequirements: string[];
  recommendedUpgrades: string[];
}

export interface TemplateCustomization {
  templateId: string;
  userId: string;
  modifications: Record<string, any>;
  culturalOverrides: Partial<IraqiCulturalSettings>;
  addedFeatures: string[];
  removedFeatures: string[];
  complianceLevel: "basic" | "enhanced" | "strict" | "maximum";
  governorateSpecific: IraqiGovernorate;
  validationResults: TemplateValidationResult;
}

export class IraqiWorkspaceTemplatesService {
  private templates: Map<string, WorkspaceTemplate> = new Map();
  private customizations: Map<string, TemplateCustomization> = new Map();

  constructor() {
    this.initializeStandardTemplates();
  }

  /**
   * Initialize all standard professional domain templates
   */
  private initializeStandardTemplates(): void {
    // Legal Professional Template
    this.templates.set("legal-standard", {
      id: "legal-standard",
      name: "Iraqi Legal Practice",
      nameAr: "الممارسة القانونية العراقية",
      description:
        "Complete legal practice management with Islamic jurisprudence and Iraqi civil law compliance",
      descriptionAr:
        "إدارة شاملة للممارسة القانونية مع الفقه الإسلامي والامتثال للقانون المدني العراقي",
      domain: "legal",
      category: "standard",
      icon: "⚖️",
      color: "#1f2937",
      preview: {
        features: [
          "Case Management & Tracking",
          "Client Consultation Scheduling",
          "Legal Document Templates (Iraqi Format)",
          "Court Calendar Integration",
          "Fee Calculation & Invoicing",
          "Legal Research Database Access",
          "Islamic Jurisprudence Compliance",
          "Arabic Document Generation",
        ],
        featuresAr: [
          "إدارة وتتبع القضايا",
          "جدولة استشارات العملاء",
          "قوالب المستندات القانونية (التنسيق العراقي)",
          "تكامل تقويم المحكمة",
          "حساب الرسوم والفوترة",
          "الوصول إلى قاعدة بيانات البحث القانوني",
          "الامتثال للفقه الإسلامي",
          "إنتاج المستندات العربية",
        ],
        benefits: [
          "Streamlined case management workflow",
          "Automated legal document generation",
          "Islamic law compliance validation",
          "Integrated billing with Iraqi payment gateways",
          "Multi-language support (Arabic/English)",
          "Secure client communication platform",
        ],
        benefitsAr: [
          "سير عمل مبسط لإدارة القضايا",
          "إنتاج آلي للمستندات القانونية",
          "التحقق من الامتثال للقانون الإسلامي",
          "الفوترة المتكاملة مع بوابات الدفع العراقية",
          "دعم متعدد اللغات (العربية/الإنجليزية)",
          "منصة تواصل آمنة مع العملاء",
        ],
        requirements: [
          "Iraqi Bar Association Membership",
          "Professional Legal License",
          "Islamic Jurisprudence Certification",
          "Cultural Compliance Training",
        ],
        requirementsAr: [
          "عضوية نقابة المحامين العراقيين",
          "رخصة قانونية مهنية",
          "شهادة الفقه الإسلامي",
          "تدريب الامتثال الثقافي",
        ],
      },
      configuration: {
        defaultSettings: {
          type: "legal",
          visibility: "organization",
          arabicSupport: true,
          dialectPreference: "general",
          maxMembers: 50,
          allowGuestAccess: false,
          requireApproval: true,
          dataRetentionPeriod: 2555, // 7 years in days
        },
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: "strict",
          prayerTimeReminders: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: true,
          culturalSensitivityLevel: "maximum",
          arabicContentPriority: true,
          islamicHolidayObservance: true,
          genderSeparationSupport: false,
          modestyCommunicationMode: true,
          governmentComplianceMode: true,
        },
        securityLevel: "maximum",
        complianceRequirements: [
          "islamic-jurisprudence-compliance",
          "iraqi-civil-law-adherence",
          "professional-ethics-standards",
          "confidentiality-protocols",
        ],
        requiredLicenses: [
          "iraqi_bar_membership",
          "professional_license",
          "islamic_jurisprudence_cert",
        ],
        supportedLanguages: ["ar", "en"],
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
      },
      pricing: {
        setupFee: 50000, // 50,000 IQD
        monthlyFee: 150000, // 150,000 IQD
        annualDiscount: 15, // 15% discount for annual payment
        governmentDiscount: 25, // 25% discount for government organizations
      },
      customization: {
        allowedModifications: [
          "cultural_settings",
          "member_limits",
          "feature_toggles",
          "notification_preferences",
          "language_preferences",
          "governorate_specific_settings",
        ],
        restrictedSettings: [
          "security_level",
          "compliance_requirements",
          "license_validation",
          "islamic_compliance_core",
        ],
        inheritanceChain: ["legal-base", "professional-base", "iraqi-base"],
        overridePermissions: ["owner", "admin"],
      },
    });

    // Medical Professional Template
    this.templates.set("medical-standard", {
      id: "medical-standard",
      name: "Iraqi Medical Practice",
      nameAr: "الممارسة الطبية العراقية",
      description:
        "Comprehensive healthcare practice management with Islamic medical ethics and patient care",
      descriptionAr:
        "إدارة شاملة لممارسة الرعاية الصحية مع الأخلاق الطبية الإسلامية ورعاية المرضى",
      domain: "medical",
      category: "standard",
      icon: "🏥",
      color: "#dc2626",
      preview: {
        features: [
          "Patient Record Management (HIPAA-compliant)",
          "Prayer-Aware Appointment Scheduling",
          "Halal Medication Database & Prescriptions",
          "Medical Imaging Integration (DICOM)",
          "Telemedicine Support with Cultural Considerations",
          "Insurance Claim Processing (Iraqi Systems)",
          "Islamic Medical Ethics Compliance",
          "Gender-Appropriate Care Protocols",
        ],
        featuresAr: [
          "إدارة سجلات المرضى (متوافق مع HIPAA)",
          "جدولة المواعيد مع مراعاة الصلاة",
          "قاعدة بيانات الأدوية الحلال والوصفات",
          "تكامل التصوير الطبي (DICOM)",
          "دعم الطب عن بُعد مع الاعتبارات الثقافية",
          "معالجة مطالبات التأمين (الأنظمة العراقية)",
          "الامتثال للأخلاق الطبية الإسلامية",
          "بروتوكولات الرعاية المناسبة للجنس",
        ],
        benefits: [
          "Secure patient data management",
          "Cultural and religious compliance",
          "Integrated insurance processing",
          "Telemedicine capabilities",
          "Islamic medical ethics integration",
          "Multi-language patient communication",
        ],
        benefitsAr: [
          "إدارة آمنة لبيانات المرضى",
          "الامتثال الثقافي والديني",
          "معالجة التأمين المتكاملة",
          "قدرات الطب عن بُعد",
          "تكامل الأخلاق الطبية الإسلامية",
          "التواصل متعدد اللغات مع المرضى",
        ],
        requirements: [
          "Iraqi Medical License",
          "Medical Association Membership",
          "Islamic Medical Ethics Certification",
          "Cultural Competency Training",
        ],
        requirementsAr: [
          "الرخصة الطبية العراقية",
          "عضوية النقابة الطبية",
          "شهادة الأخلاق الطبية الإسلامية",
          "تدريب الكفاءة الثقافية",
        ],
      },
      configuration: {
        defaultSettings: {
          type: "medical",
          visibility: "private",
          arabicSupport: true,
          dialectPreference: "general",
          maxMembers: 100,
          allowGuestAccess: false,
          requireApproval: true,
          dataRetentionPeriod: 3650, // 10 years for medical records
        },
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: "strict",
          prayerTimeReminders: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: true,
          culturalSensitivityLevel: "maximum",
          arabicContentPriority: true,
          islamicHolidayObservance: true,
          genderSeparationSupport: true,
          modestyCommunicationMode: true,
          governmentComplianceMode: true,
        },
        securityLevel: "maximum",
        complianceRequirements: [
          "islamic-medical-ethics",
          "patient-privacy-protection",
          "halal-medication-compliance",
          "gender-appropriate-care",
        ],
        requiredLicenses: [
          "iraqi_medical_license",
          "medical_association_membership",
          "islamic_medical_ethics_cert",
        ],
        supportedLanguages: ["ar", "en", "ku"],
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
      },
      pricing: {
        setupFee: 75000, // 75,000 IQD
        monthlyFee: 200000, // 200,000 IQD
        annualDiscount: 20, // 20% discount for annual payment
        governmentDiscount: 30, // 30% discount for government hospitals
      },
      customization: {
        allowedModifications: [
          "patient_communication_preferences",
          "appointment_scheduling_rules",
          "telemedicine_settings",
          "cultural_care_protocols",
          "language_preferences",
        ],
        restrictedSettings: [
          "patient_privacy_settings",
          "medical_ethics_compliance",
          "security_protocols",
          "data_retention_policies",
        ],
        inheritanceChain: ["medical-base", "healthcare-base", "iraqi-base"],
        overridePermissions: ["owner", "admin", "medical_director"],
      },
    });

    // Educational Professional Template
    this.templates.set("educational-standard", {
      id: "educational-standard",
      name: "Iraqi Educational Institution",
      nameAr: "المؤسسة التعليمية العراقية",
      description:
        "Complete educational institution management with Islamic education principles and Arabic language preservation",
      descriptionAr:
        "إدارة شاملة للمؤسسة التعليمية مع مبادئ التعليم الإسلامي والحفاظ على اللغة العربية",
      domain: "educational",
      category: "standard",
      icon: "🎓",
      color: "#059669",
      preview: {
        features: [
          "Student Management System",
          "Islamic-Compliant Curriculum Management",
          "Parent Communication Portal",
          "Teacher Performance Tracking",
          "Prayer Time Integration",
          "Arabic Language Preservation Tools",
          "Cultural Event Management",
          "Online Learning Platform (Halal Content)",
        ],
        featuresAr: [
          "نظام إدارة الطلاب",
          "إدارة المناهج المتوافقة مع الإسلام",
          "بوابة التواصل مع أولياء الأمور",
          "تتبع أداء المعلمين",
          "تكامل أوقات الصلاة",
          "أدوات الحفاظ على اللغة العربية",
          "إدارة الفعاليات الثقافية",
          "منصة التعلم الإلكتروني (المحتوى الحلال)",
        ],
        benefits: [
          "Comprehensive student tracking",
          "Islamic education integration",
          "Parent engagement platform",
          "Cultural preservation focus",
          "Multi-language support",
          "Prayer time accommodation",
        ],
        benefitsAr: [
          "تتبع شامل للطلاب",
          "تكامل التعليم الإسلامي",
          "منصة مشاركة أولياء الأمور",
          "التركيز على الحفاظ على الثقافة",
          "دعم متعدد اللغات",
          "استيعاب أوقات الصلاة",
        ],
        requirements: [
          "Teaching License",
          "Educational Ministry Approval",
          "Islamic Education Certification",
          "Cultural Competency Training",
        ],
        requirementsAr: [
          "رخصة التدريس",
          "موافقة وزارة التربية",
          "شهادة التعليم الإسلامي",
          "تدريب الكفاءة الثقافية",
        ],
      },
      configuration: {
        defaultSettings: {
          type: "educational",
          visibility: "organization",
          arabicSupport: true,
          dialectPreference: "general",
          maxMembers: 200,
          allowGuestAccess: true,
          requireApproval: false,
          dataRetentionPeriod: 3650, // 10 years for student records
        },
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: "enhanced",
          prayerTimeReminders: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: true,
          culturalSensitivityLevel: "enhanced",
          arabicContentPriority: true,
          islamicHolidayObservance: true,
          genderSeparationSupport: true,
          modestyCommunicationMode: false,
          governmentComplianceMode: false,
        },
        securityLevel: "enhanced",
        complianceRequirements: [
          "islamic-education-principles",
          "arabic-language-preservation",
          "cultural-education-standards",
          "student-privacy-protection",
        ],
        requiredLicenses: [
          "teaching_license",
          "educational_ministry_approval",
          "islamic_education_cert",
        ],
        supportedLanguages: ["ar", "en", "ku"],
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
      },
      pricing: {
        setupFee: 40000, // 40,000 IQD
        monthlyFee: 100000, // 100,000 IQD
        annualDiscount: 25, // 25% discount for annual payment
        governmentDiscount: 40, // 40% discount for public schools
      },
      customization: {
        allowedModifications: [
          "curriculum_customization",
          "parent_communication_settings",
          "student_assessment_methods",
          "cultural_event_planning",
          "language_instruction_preferences",
        ],
        restrictedSettings: [
          "islamic_compliance_core",
          "student_privacy_protection",
          "ministry_reporting_requirements",
          "cultural_preservation_mandates",
        ],
        inheritanceChain: [
          "educational-base",
          "institution-base",
          "iraqi-base",
        ],
        overridePermissions: ["owner", "admin", "principal"],
      },
    });

    // Add more templates for other domains...
    this.initializeBusinessTemplate();
    this.initializeGovernmentTemplate();
    this.initializeReligiousTemplate();
  }

  private initializeBusinessTemplate(): void {
    this.templates.set("business-standard", {
      id: "business-standard",
      name: "Iraqi Business Organization",
      nameAr: "المنظمة التجارية العراقية",
      description:
        "Comprehensive business management with halal practices and Islamic finance compliance",
      descriptionAr:
        "إدارة أعمال شاملة مع الممارسات الحلال والامتثال للتمويل الإسلامي",
      domain: "business",
      category: "standard",
      icon: "💼",
      color: "#1f2937",
      preview: {
        features: [
          "Halal Business Operations Management",
          "Islamic Finance Integration",
          "Project Management with Cultural Considerations",
          "Client Relationship Management (CRM)",
          "Invoice & Payment Processing (Iraqi Gateways)",
          "Team Collaboration Tools",
          "Business Analytics & Reporting",
          "Zakat Calculation & Management",
        ],
        featuresAr: [
          "إدارة العمليات التجارية الحلال",
          "تكامل التمويل الإسلامي",
          "إدارة المشاريع مع الاعتبارات الثقافية",
          "إدارة علاقات العملاء (CRM)",
          "معالجة الفواتير والدفع (البوابات العراقية)",
          "أدوات التعاون الجماعي",
          "تحليلات الأعمال والتقارير",
          "حساب وإدارة الزكاة",
        ],
        benefits: [
          "Sharia-compliant business operations",
          "Integrated Iraqi payment systems",
          "Cultural business practices",
          "Automated zakat calculations",
          "Multi-language business communications",
          "Government compliance tracking",
        ],
        benefitsAr: [
          "العمليات التجارية المتوافقة مع الشريعة",
          "أنظمة الدفع العراقية المتكاملة",
          "الممارسات التجارية الثقافية",
          "حسابات الزكاة الآلية",
          "الاتصالات التجارية متعددة اللغات",
          "تتبع الامتثال الحكومي",
        ],
        requirements: [
          "Business Registration Certificate",
          "Chamber of Commerce Membership",
          "Islamic Finance Certification",
          "Cultural Business Practices Training",
        ],
        requirementsAr: [
          "شهادة تسجيل الأعمال",
          "عضوية غرفة التجارة",
          "شهادة التمويل الإسلامي",
          "تدريب الممارسات التجارية الثقافية",
        ],
      },
      configuration: {
        defaultSettings: {
          type: "business",
          visibility: "organization",
          arabicSupport: true,
          dialectPreference: "general",
          maxMembers: 150,
          allowGuestAccess: true,
          requireApproval: false,
          dataRetentionPeriod: 2555, // 7 years for business records
        },
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: "enhanced",
          prayerTimeReminders: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: true,
          culturalSensitivityLevel: "enhanced",
          arabicContentPriority: true,
          islamicHolidayObservance: true,
          genderSeparationSupport: false,
          modestyCommunicationMode: false,
          governmentComplianceMode: true,
        },
        securityLevel: "enhanced",
        complianceRequirements: [
          "halal-business-practices",
          "islamic-finance-compliance",
          "government-business-regulations",
          "zakat-calculation-accuracy",
        ],
        requiredLicenses: [
          "business_registration",
          "chamber_of_commerce_membership",
          "islamic_finance_cert",
        ],
        supportedLanguages: ["ar", "en"],
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
      },
      pricing: {
        setupFee: 60000, // 60,000 IQD
        monthlyFee: 120000, // 120,000 IQD
        annualDiscount: 20, // 20% discount for annual payment
        governmentDiscount: 15, // 15% discount for government contractors
      },
      customization: {
        allowedModifications: [
          "business_process_workflows",
          "client_communication_preferences",
          "payment_gateway_selections",
          "zakat_calculation_methods",
          "cultural_business_protocols",
        ],
        restrictedSettings: [
          "islamic_finance_compliance",
          "halal_business_validation",
          "government_compliance_reporting",
          "religious_obligation_tracking",
        ],
        inheritanceChain: ["business-base", "commercial-base", "iraqi-base"],
        overridePermissions: ["owner", "admin", "business_manager"],
      },
    });
  }

  private initializeGovernmentTemplate(): void {
    this.templates.set("government-standard", {
      id: "government-standard",
      name: "Iraqi Government Institution",
      nameAr: "المؤسسة الحكومية العراقية",
      description:
        "Comprehensive government institution management with full regulatory compliance and public service delivery",
      descriptionAr:
        "إدارة شاملة للمؤسسة الحكومية مع الامتثال التنظيمي الكامل وتقديم الخدمات العامة",
      domain: "government",
      category: "government",
      icon: "🏛️",
      color: "#1f2937",
      preview: {
        features: [
          "Public Service Management",
          "Citizen Request Processing",
          "Government Document Management",
          "Inter-Agency Communication",
          "Regulatory Compliance Tracking",
          "Public Information Management",
          "Arabic-First Government Services",
          "Multi-Governorate Coordination",
        ],
        featuresAr: [
          "إدارة الخدمات العامة",
          "معالجة طلبات المواطنين",
          "إدارة الوثائق الحكومية",
          "التواصل بين الوكالات",
          "تتبع الامتثال التنظيمي",
          "إدارة المعلومات العامة",
          "الخدمات الحكومية العربية أولاً",
          "التنسيق متعدد المحافظات",
        ],
        benefits: [
          "Streamlined public service delivery",
          "Enhanced citizen engagement",
          "Transparent government operations",
          "Regulatory compliance automation",
          "Inter-agency coordination",
          "Multi-language citizen support",
        ],
        benefitsAr: [
          "تقديم خدمات عامة مبسطة",
          "تعزيز مشاركة المواطنين",
          "عمليات حكومية شفافة",
          "أتمتة الامتثال التنظيمي",
          "التنسيق بين الوكالات",
          "دعم متعدد اللغات للمواطنين",
        ],
        requirements: [
          "Government Security Clearance",
          "Public Service Certification",
          "Regulatory Compliance Training",
          "Cultural Sensitivity Training",
        ],
        requirementsAr: [
          "التخليص الأمني الحكومي",
          "شهادة الخدمة العامة",
          "تدريب الامتثال التنظيمي",
          "تدريب الحساسية الثقافية",
        ],
      },
      configuration: {
        defaultSettings: {
          type: "government",
          visibility: "organization",
          arabicSupport: true,
          dialectPreference: "general",
          maxMembers: 500,
          allowGuestAccess: false,
          requireApproval: true,
          dataRetentionPeriod: 7300, // 20 years for government records
        },
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: "strict",
          prayerTimeReminders: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: true,
          culturalSensitivityLevel: "maximum",
          arabicContentPriority: true,
          islamicHolidayObservance: true,
          genderSeparationSupport: true,
          modestyCommunicationMode: true,
          governmentComplianceMode: true,
        },
        securityLevel: "government",
        complianceRequirements: [
          "government-security-protocols",
          "public-service-standards",
          "transparency-requirements",
          "citizen-privacy-protection",
        ],
        requiredLicenses: [
          "government_clearance",
          "public_service_cert",
          "security_certification",
        ],
        supportedLanguages: ["ar", "en", "ku"],
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
      },
      pricing: {
        setupFee: 200000, // 200,000 IQD
        monthlyFee: 800000, // 800,000 IQD
        annualDiscount: 10, // 10% discount for annual payment
      },
      customization: {
        allowedModifications: [
          "public_service_workflows",
          "citizen_communication_channels",
          "inter_agency_protocols",
          "transparency_reporting_levels",
          "multi_governorate_coordination",
        ],
        restrictedSettings: [
          "security_protocols",
          "compliance_monitoring",
          "data_retention_policies",
          "audit_logging_requirements",
        ],
        inheritanceChain: [
          "government-base",
          "public-service-base",
          "iraqi-base",
        ],
        overridePermissions: ["owner", "admin", "department_head"],
      },
    });
  }

  private initializeReligiousTemplate(): void {
    this.templates.set("religious-standard", {
      id: "religious-standard",
      name: "Iraqi Religious Institution",
      nameAr: "المؤسسة الدينية العراقية",
      description:
        "Comprehensive Islamic religious institution management with scholarly work and community services",
      descriptionAr:
        "إدارة شاملة للمؤسسة الدينية الإسلامية مع العمل العلمي والخدمات المجتمعية",
      domain: "religious",
      category: "standard",
      icon: "🕌",
      color: "#059669",
      preview: {
        features: [
          "Islamic Scholarly Research Management",
          "Community Service Coordination",
          "Religious Education Programs",
          "Mosque & Center Management",
          "Islamic Event Planning",
          "Religious Consultation Services",
          "Quran & Hadith Database Access",
          "Islamic Calendar Integration",
        ],
        featuresAr: [
          "إدارة البحث العلمي الإسلامي",
          "تنسيق الخدمات المجتمعية",
          "برامج التعليم الديني",
          "إدارة المسجد والمركز",
          "تخطيط الفعاليات الإسلامية",
          "خدمات الاستشارة الدينية",
          "الوصول إلى قاعدة بيانات القرآن والحديث",
          "تكامل التقويم الإسلامي",
        ],
        benefits: [
          "Comprehensive Islamic resource management",
          "Community engagement platform",
          "Scholarly research support",
          "Religious event coordination",
          "Islamic education delivery",
          "Spiritual guidance services",
        ],
        benefitsAr: [
          "إدارة شاملة للموارد الإسلامية",
          "منصة مشاركة المجتمع",
          "دعم البحث العلمي",
          "تنسيق الفعاليات الدينية",
          "تقديم التعليم الإسلامي",
          "خدمات الإرشاد الروحي",
        ],
        requirements: [
          "Religious Certification",
          "Islamic Studies Degree",
          "Community Leadership Training",
          "Arabic Language Proficiency",
        ],
        requirementsAr: [
          "الشهادة الدينية",
          "درجة الدراسات الإسلامية",
          "تدريب القيادة المجتمعية",
          "إجادة اللغة العربية",
        ],
      },
      configuration: {
        defaultSettings: {
          type: "religious",
          visibility: "public",
          arabicSupport: true,
          dialectPreference: "general",
          maxMembers: 300,
          allowGuestAccess: true,
          requireApproval: false,
          dataRetentionPeriod: 3650, // 10 years for religious records
        },
        culturalSettings: {
          enableIslamicCompliance: true,
          strictnessLevel: "strict",
          prayerTimeReminders: true,
          halalContentFilter: true,
          politicalNeutralityMode: true,
          sectarianContentFilter: true,
          culturalSensitivityLevel: "maximum",
          arabicContentPriority: true,
          islamicHolidayObservance: true,
          genderSeparationSupport: true,
          modestyCommunicationMode: true,
          governmentComplianceMode: false,
        },
        securityLevel: "enhanced",
        complianceRequirements: [
          "islamic-religious-standards",
          "community-service-guidelines",
          "religious-education-compliance",
          "spiritual-guidance-ethics",
        ],
        requiredLicenses: [
          "religious_certification",
          "islamic_studies_degree",
          "community_leadership_cert",
        ],
        supportedLanguages: ["ar"],
        governorateSupport: [
          "baghdad",
          "najaf",
          "karbala",
          "nineveh",
          "basra",
          "arbil",
        ],
      },
      pricing: {
        setupFee: 20000, // 20,000 IQD
        monthlyFee: 60000, // 60,000 IQD
        annualDiscount: 30, // 30% discount for annual payment
      },
      customization: {
        allowedModifications: [
          "community_service_programs",
          "religious_education_curricula",
          "event_planning_templates",
          "spiritual_guidance_protocols",
          "islamic_calendar_customization",
        ],
        restrictedSettings: [
          "islamic_compliance_core",
          "religious_authority_validation",
          "spiritual_guidance_standards",
          "community_safety_protocols",
        ],
        inheritanceChain: ["religious-base", "islamic-base", "iraqi-base"],
        overridePermissions: ["owner", "admin", "imam", "religious_scholar"],
      },
    });
  }

  /**
   * Get all available workspace templates
   */
  public getAvailableTemplates(): WorkspaceTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates filtered by domain
   */
  public getTemplatesByDomain(domain: ProfessionalDomain): WorkspaceTemplate[] {
    return Array.from(this.templates.values()).filter(
      (template) => template.domain === domain,
    );
  }

  /**
   * Get templates filtered by category
   */
  public getTemplatesByCategory(
    category: WorkspaceTemplate["category"],
  ): WorkspaceTemplate[] {
    return Array.from(this.templates.values()).filter(
      (template) => template.category === category,
    );
  }

  /**
   * Get templates supported in specific governorate
   */
  public getTemplatesByGovernorate(
    governorate: IraqiGovernorate,
  ): WorkspaceTemplate[] {
    return Array.from(this.templates.values()).filter((template) =>
      template.configuration.governorateSupport.includes(governorate),
    );
  }

  /**
   * Get a specific template by ID
   */
  public getTemplate(templateId: string): WorkspaceTemplate | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Validate template requirements against user credentials
   */
  public validateTemplateRequirements(
    templateId: string,
    userLicenses: ProfessionalLicense[],
    userCertifications: string[],
    governorate?: IraqiGovernorate,
  ): TemplateValidationResult {
    const template = this.getTemplate(templateId);
    if (!template) {
      return {
        isValid: false,
        score: 0,
        errors: ["Template not found"],
        warnings: [],
        suggestions: [],
        culturalCompliance: {
          overallScore: 0,
          islamicCompliance: 0,
          culturalSensitivity: 0,
          arabicSupport: 0,
          professionalStandards: 0,
          governmentCompliance: 0,
        },
        missingRequirements: [],
        recommendedUpgrades: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const missingRequirements: string[] = [];
    const recommendedUpgrades: string[] = [];

    // Validate required licenses
    const requiredLicenses = template.configuration.requiredLicenses;
    for (const requiredLicense of requiredLicenses) {
      const hasValidLicense = userLicenses.some(
        (license) =>
          license.type === "license" &&
          license.status === "active" &&
          license.id.includes(requiredLicense),
      );

      if (!hasValidLicense) {
        missingRequirements.push(
          `Missing required license: ${requiredLicense}`,
        );
        errors.push(`Required license not found: ${requiredLicense}`);
      }
    }

    // Validate governorate support
    if (
      governorate &&
      !template.configuration.governorateSupport.includes(governorate)
    ) {
      errors.push(`Template not supported in governorate: ${governorate}`);
      suggestions.push(
        `Consider using a template that supports ${governorate} governorate`,
      );
    }

    // Calculate cultural compliance score
    const culturalCompliance: CulturalComplianceScore = {
      overallScore: 0.85, // Base score for template compliance
      islamicCompliance: template.configuration.culturalSettings
        .enableIslamicCompliance
        ? 1.0
        : 0.5,
      culturalSensitivity:
        template.configuration.culturalSettings.culturalSensitivityLevel ===
        "maximum"
          ? 1.0
          : 0.7,
      arabicSupport: template.configuration.defaultSettings.arabicSupport
        ? 1.0
        : 0.3,
      professionalStandards:
        template.domain === "legal" || template.domain === "medical"
          ? 1.0
          : 0.8,
      governmentCompliance: template.configuration.culturalSettings
        .governmentComplianceMode
        ? 1.0
        : 0.6,
    };

    culturalCompliance.overallScore =
      culturalCompliance.islamicCompliance * 0.3 +
      culturalCompliance.culturalSensitivity * 0.25 +
      culturalCompliance.arabicSupport * 0.2 +
      culturalCompliance.professionalStandards * 0.15 +
      culturalCompliance.governmentCompliance * 0.1;

    // Generate recommendations
    if (culturalCompliance.overallScore < 0.9) {
      recommendedUpgrades.push(
        "Consider upgrading to premium tier for enhanced cultural compliance",
      );
    }

    if (template.category === "standard" && userLicenses.length > 2) {
      recommendedUpgrades.push(
        "Your credentials qualify you for premium or enterprise tier",
      );
    }

    const validationScore = Math.max(
      0,
      1.0 - (errors.length * 0.3 + warnings.length * 0.1),
    );

    return {
      isValid: errors.length === 0,
      score: validationScore,
      errors,
      warnings,
      suggestions,
      culturalCompliance,
      missingRequirements,
      recommendedUpgrades,
    };
  }

  /**
   * Create workspace from template
   */
  public createWorkspaceFromTemplate(
    templateId: string,
    ownerId: string,
    customizations: Partial<TemplateCustomization> = {},
  ): Partial<IraqiWorkspace> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Apply template defaults with customizations
    const workspaceData: Partial<IraqiWorkspace> = {
      ...template.configuration.defaultSettings,
      ownerId,
      name: customizations.modifications?.name || template.name,
      nameAr: customizations.modifications?.nameAr || template.nameAr,
      culturalSettings: {
        ...template.configuration.culturalSettings,
        ...customizations.culturalOverrides,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      templateId,
      templateVersion: "1.0.0",
      customizations: customizations.modifications || {},
    };

    return workspaceData;
  }

  /**
   * Calculate template pricing with governorate adjustments
   */
  public calculateTemplatePricing(
    templateId: string,
    governorate?: IraqiGovernorate,
    isGovernmentOrganization = false,
    paymentTerm: "monthly" | "annual" = "monthly",
  ): {
    setupFee: number;
    monthlyFee: number;
    annualFee: number;
    totalFirstYear: number;
    savings: number;
    currency: string;
  } {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let { setupFee, monthlyFee, annualDiscount, governmentDiscount } =
      template.pricing;

    // Apply governorate-specific pricing
    const domainConfig = getDomainConfig(template.domain);
    monthlyFee = calculateDomainPricing(
      template.domain,
      "premium",
      governorate,
    );

    // Apply government discount
    if (isGovernmentOrganization && governmentDiscount) {
      setupFee = Math.round(setupFee * (1 - governmentDiscount / 100));
      monthlyFee = Math.round(monthlyFee * (1 - governmentDiscount / 100));
    }

    const annualFee = Math.round(monthlyFee * 12 * (1 - annualDiscount / 100));
    const totalFirstYear =
      paymentTerm === "annual"
        ? setupFee + annualFee
        : setupFee + monthlyFee * 12;
    const savings = paymentTerm === "annual" ? monthlyFee * 12 - annualFee : 0;

    return {
      setupFee,
      monthlyFee,
      annualFee,
      totalFirstYear,
      savings,
      currency: "IQD",
    };
  }

  /**
   * Get template recommendations based on user profile
   */
  public getTemplateRecommendations(userProfile: {
    domain?: ProfessionalDomain;
    licenses: ProfessionalLicense[];
    governorate?: IraqiGovernorate;
    organizationType:
      | "individual"
      | "small_business"
      | "organization"
      | "government";
    culturalPreferences: Partial<IraqiCulturalSettings>;
  }): WorkspaceTemplate[] {
    const templates = this.getAvailableTemplates();

    return templates
      .filter((template) => {
        // Filter by domain if specified
        if (userProfile.domain && template.domain !== userProfile.domain) {
          return false;
        }

        // Filter by governorate support
        if (
          userProfile.governorate &&
          !template.configuration.governorateSupport.includes(
            userProfile.governorate,
          )
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Score templates based on user profile match
        const scoreA = this.calculateTemplateScore(a, userProfile);
        const scoreB = this.calculateTemplateScore(b, userProfile);
        return scoreB - scoreA;
      })
      .slice(0, 5); // Return top 5 recommendations
  }

  private calculateTemplateScore(
    template: WorkspaceTemplate,
    userProfile: any,
  ): number {
    let score = 0;

    // Domain match
    if (userProfile.domain === template.domain) {
      score += 50;
    }

    // License compatibility
    const compatibleLicenses = userProfile.licenses.filter(
      (license: ProfessionalLicense) =>
        template.configuration.requiredLicenses.some((req) =>
          license.id.includes(req),
        ),
    );
    score += compatibleLicenses.length * 10;

    // Organization type compatibility
    const categoryScores = {
      individual: { standard: 30, premium: 20, enterprise: 10, government: 0 },
      small_business: {
        standard: 25,
        premium: 30,
        enterprise: 20,
        government: 5,
      },
      organization: {
        standard: 15,
        premium: 25,
        enterprise: 30,
        government: 10,
      },
      government: { standard: 5, premium: 10, enterprise: 20, government: 30 },
    };

    score +=
      categoryScores[userProfile.organizationType][template.category] || 0;

    // Cultural preferences alignment
    if (
      userProfile.culturalPreferences.enableIslamicCompliance &&
      template.configuration.culturalSettings.enableIslamicCompliance
    ) {
      score += 15;
    }

    return score;
  }
}

// Export the service instance
export const workspaceTemplatesService = new IraqiWorkspaceTemplatesService();
