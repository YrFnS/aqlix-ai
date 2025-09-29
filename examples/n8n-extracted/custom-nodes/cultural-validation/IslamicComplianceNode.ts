/**
 * Islamic Compliance Validation Node
 *
 * Comprehensive n8n custom node for Islamic compliance validation with prayer time awareness,
 * riba detection, halal business validation, and cultural appropriateness analysis.
 * Essential for Iraqi government workflows to ensure all operations respect Islamic values.
 *
 * Key Features:
 * - Real-time prayer time checking with regional accuracy
 * - Riba (interest) detection in financial transactions
 * - Halal business practice validation
 * - Islamic calendar integration and holiday awareness
 * - Cultural appropriateness scoring with ministry-specific rules
 * - Professional Islamic terminology validation
 * - Comprehensive audit logging with Islamic compliance metrics
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  ILoadOptionsFunctions,
  NodeOperationError,
  NodeApiError,
} from "n8n-workflow";

import {
  IraqiGovernmentNodeBase,
  IIraqiNodeTypeDescription,
  ICulturalIntelligenceConfig,
} from "../base/IraqiGovernmentNodeBase";

// ================================
// Islamic Compliance Interfaces
// ================================

export interface IIslamicComplianceValidation {
  inputData: any;
  validationType:
    | "prayer-time"
    | "riba-detection"
    | "halal-business"
    | "cultural-appropriateness"
    | "calendar-event"
    | "comprehensive";
  strictnessLevel: "strict" | "moderate" | "lenient";
  ministry: string;
  region: "baghdad" | "basra" | "mosul" | "erbil" | "najaf" | "general";
  professionalDomain:
    | "medical"
    | "legal"
    | "educational"
    | "administrative"
    | "financial"
    | "general";
  customRules?: IIslamicCustomRule[];
}

export interface IIslamicCustomRule {
  id: string;
  name: string;
  nameArabic: string;
  category: "financial" | "social" | "professional" | "cultural" | "business";
  rule: string;
  severity: "warning" | "error" | "critical";
  ministry?: string;
  enabled: boolean;
}

export interface IIslamicComplianceReport {
  validationId: string;
  timestamp: Date;
  inputData: any;
  overallCompliance: {
    isCompliant: boolean;
    score: number; // 0-100
    level: "excellent" | "good" | "acceptable" | "poor" | "non-compliant";
  };
  prayerTimeValidation: IPrayerTimeValidationResult;
  ribaValidation: IRibaValidationResult;
  halalValidation: IHalalValidationResult;
  culturalValidation: ICulturalAppropriatenessResult;
  calendarValidation: IIslamicCalendarValidationResult;
  violations: IIslamicViolation[];
  recommendations: IIslamicRecommendation[];
  auditTrail: IIslamicAuditEntry[];
  nextActions: IIslamicNextAction[];
}

export interface IPrayerTimeValidationResult {
  currentTime: Date;
  region: string;
  timezone: string;
  isPrayerTime: boolean;
  currentPrayer?: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
  nextPrayer: {
    name: string;
    time: Date;
    timeUntil: number; // milliseconds
  };
  todaysPrayerTimes: {
    fajr: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
  };
  workflowImpact: {
    shouldPause: boolean;
    pauseDuration: number; // milliseconds
    resumeTime: Date;
    prayerTimeConflict: boolean;
  };
}

export interface IRibaValidationResult {
  ribaDetected: boolean;
  ribaScore: number; // 0-100, higher means more likely to be riba
  suspiciousTransactions: IRibaSuspiciousTransaction[];
  interestCalculations: IInterestCalculation[];
  recommendations: string[];
  alternativeStructures: IIslamicFinancialAlternative[];
  complianceLevel: "compliant" | "suspicious" | "non-compliant";
}

export interface IRibaSuspiciousTransaction {
  transactionId: string;
  type: "loan" | "investment" | "deposit" | "credit" | "insurance" | "unknown";
  amount: number;
  currency: string;
  interestRate?: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  reason: string;
  reasonArabic: string;
  suggestedAction: string;
}

export interface IInterestCalculation {
  amount: number;
  rate: number;
  period: string;
  calculatedInterest: number;
  isRiba: boolean;
  islamicAlternative?: string;
}

export interface IIslamicFinancialAlternative {
  currentStructure: string;
  islamicAlternative: string;
  alternativeArabic: string;
  benefits: string[];
  implementation: string;
  shariahCompliance: number; // 0-100
}

export interface IHalalValidationResult {
  isHalal: boolean;
  halalScore: number; // 0-100
  businessType: string;
  industry: string;
  violations: IHalalViolation[];
  certifications: IHalalCertification[];
  recommendations: string[];
  ministrySpecificRequirements: string[];
}

export interface IHalalViolation {
  type: "product" | "service" | "process" | "partner" | "supply-chain";
  severity: "minor" | "major" | "critical";
  description: string;
  descriptionArabic: string;
  impact: string;
  remediation: string;
  timeline: string;
}

export interface IHalalCertification {
  authority: string;
  certificateNumber: string;
  validFrom: Date;
  validUntil: Date;
  scope: string;
  status: "valid" | "expired" | "suspended" | "revoked";
}

export interface ICulturalAppropriatenessResult {
  isAppropriate: boolean;
  appropriatenessScore: number; // 0-100
  culturalSensitivityLevel: "high" | "medium" | "low";
  languageAppropriate: boolean;
  contextAppropriate: boolean;
  professionalAppropriate: boolean;
  issues: ICulturalIssue[];
  recommendations: string[];
  ministrySpecificGuidance: string[];
}

export interface ICulturalIssue {
  category:
    | "language"
    | "imagery"
    | "behavior"
    | "tradition"
    | "religious"
    | "professional";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  descriptionArabic: string;
  context: string;
  suggestion: string;
  culturalNote: string;
}

export interface IIslamicCalendarValidationResult {
  currentDate: {
    gregorian: Date;
    hijri: string;
    isIslamicHoliday: boolean;
    isWorkingDay: boolean;
  };
  upcomingEvents: IIslamicCalendarEvent[];
  workflowImpact: {
    shouldScheduleAround: boolean;
    affectedDates: Date[];
    alternativeSchedule: Date[];
  };
  ministry: string;
  region: string;
}

export interface IIslamicCalendarEvent {
  name: string;
  nameArabic: string;
  date: Date;
  hijriDate: string;
  type: "holiday" | "observance" | "fast" | "celebration" | "commemoration";
  significance: "major" | "minor";
  workImpact: "no-work" | "reduced-hours" | "normal" | "special-considerations";
  duration: number; // days
  customsAndTraditions: string[];
}

export interface IIslamicViolation {
  id: string;
  type:
    | "prayer-conflict"
    | "riba-detected"
    | "haram-content"
    | "cultural-inappropriate"
    | "calendar-conflict";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  impact: string;
  remediation: string;
  remediationArabic: string;
  timeToResolve: string;
  responsibleParty: string;
}

export interface IIslamicRecommendation {
  id: string;
  category: "immediate" | "short-term" | "long-term" | "best-practice";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  implementation: string;
  benefits: string[];
  estimatedImpact: number; // 0-100
  timeframe: string;
}

export interface IIslamicAuditEntry {
  timestamp: Date;
  validationType: string;
  inputDataHash: string;
  complianceScore: number;
  violations: number;
  recommendations: number;
  ministry: string;
  region: string;
  userId: string;
  sessionId: string;
  culturalContext: any;
}

export interface IIslamicNextAction {
  id: string;
  type:
    | "validation"
    | "remediation"
    | "monitoring"
    | "consultation"
    | "approval";
  title: string;
  titleArabic: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  assignedTo: string;
  dueDate: Date;
  dependencies: string[];
  estimatedEffort: string;
}

// ================================
// Main Islamic Compliance Node
// ================================

export class IslamicComplianceNode extends IraqiGovernmentNodeBase {
  description: IIraqiNodeTypeDescription = {
    displayName: "Islamic Compliance Validator / مدقق الامتثال الإسلامي",
    name: "islamicComplianceValidator",
    icon: "fa:mosque",
    group: ["validation", "cultural", "islamic"],
    version: 1,
    description:
      "Validate content and operations for Islamic compliance with prayer time awareness, riba detection, and cultural appropriateness",
    descriptionArabic:
      "التحقق من الامتثال الإسلامي للمحتوى والعمليات مع الوعي بأوقات الصلاة واكتشاف الربا والملاءمة الثقافية",

    // Node configuration
    ministry: "general",
    culturalIntelligence: {
      arabicSupport: true,
      dialectRecognition: ["baghdadi", "basri", "moslawi", "standard"],
      culturalValidation: true,
      professionalTerminology: "general",
      islamicCompliance: true,
      prayerTimeAwareness: true,
      ministrySpecificRules: [
        "islamic-compliance-validation",
        "prayer-time-awareness",
        "riba-detection",
        "halal-business-validation",
        "cultural-appropriateness",
      ],
      culturalSensitivityLevel: "strict",
      rtlLayoutSupport: true,
      mixedContentHandling: true,
    },

    islamicCompliance: {
      enabled: true,
      strictness: "strict",
      prayerTimeValidation: true,
      ribaDetection: true,
      halalBusinessValidation: true,
      islamicCalendarSupport: true,
      culturalEventAwareness: true,
      professionalEthicsValidation: true,
    },

    arabicProcessing: {
      enabled: true,
      rtlSupport: true,
      dialectSupport: ["baghdadi", "basri", "moslawi", "standard"],
      transliterationSupport: true,
      professionalTerminologyMapping: true,
      culturalContextValidation: true,
      mixedLanguageSupport: true,
      diacriticHandling: true,
    },

    securityRequirements: {
      clearanceLevel: "public",
      encryptionRequired: false,
      auditLogging: true,
      biometricValidation: false,
      ministryAuthentication: false,
      accessControlValidation: false,
      dataClassification: "public",
      retentionPolicy: "7-years",
    },

    auditLevel: "comprehensive",

    defaults: {
      name: "Islamic Compliance Validator",
    },

    inputs: ["main"],
    outputs: ["main"],

    properties: [
      {
        displayName: "Validation Type / نوع التحقق",
        name: "validationType",
        type: "options",
        options: [
          {
            name: "Comprehensive Validation / التحقق الشامل",
            value: "comprehensive",
            description:
              "Complete Islamic compliance validation including all aspects",
          },
          {
            name: "Prayer Time Check / فحص وقت الصلاة",
            value: "prayer-time",
            description: "Check current prayer time and workflow scheduling",
          },
          {
            name: "Riba Detection / كشف الربا",
            value: "riba-detection",
            description:
              "Detect interest-based transactions (riba) in financial data",
          },
          {
            name: "Halal Business Validation / التحقق من الأعمال الحلال",
            value: "halal-business",
            description: "Validate business practices for halal compliance",
          },
          {
            name: "Cultural Appropriateness / الملاءمة الثقافية",
            value: "cultural-appropriateness",
            description:
              "Check content for cultural and religious appropriateness",
          },
          {
            name: "Islamic Calendar Events / أحداث التقويم الإسلامي",
            value: "calendar-event",
            description:
              "Check Islamic calendar for holidays and significant dates",
          },
        ],
        default: "comprehensive",
        required: true,
      },

      {
        displayName: "Strictness Level / مستوى الصرامة",
        name: "strictnessLevel",
        type: "options",
        options: [
          {
            name: "Strict / صارم",
            value: "strict",
            description: "Highest level of Islamic compliance validation",
          },
          {
            name: "Moderate / معتدل",
            value: "moderate",
            description: "Balanced approach with reasonable flexibility",
          },
          {
            name: "Lenient / متساهل",
            value: "lenient",
            description: "Flexible validation with focus on major issues only",
          },
        ],
        default: "moderate",
        required: true,
      },

      {
        displayName: "Region / المنطقة",
        name: "region",
        type: "options",
        options: [
          {
            name: "Baghdad / بغداد",
            value: "baghdad",
          },
          {
            name: "Basra / البصرة",
            value: "basra",
          },
          {
            name: "Mosul / الموصل",
            value: "mosul",
          },
          {
            name: "Erbil / أربيل",
            value: "erbil",
          },
          {
            name: "Najaf / النجف",
            value: "najaf",
          },
          {
            name: "General / عام",
            value: "general",
          },
        ],
        default: "baghdad",
        required: true,
      },

      {
        displayName: "Ministry / الوزارة",
        name: "ministry",
        type: "options",
        options: [
          {
            name: "Health / الصحة",
            value: "health",
          },
          {
            name: "Education / التربية",
            value: "education",
          },
          {
            name: "Interior / الداخلية",
            value: "interior",
          },
          {
            name: "Justice / العدل",
            value: "justice",
          },
          {
            name: "Finance / المالية",
            value: "finance",
          },
          {
            name: "Planning / التخطيط",
            value: "planning",
          },
          {
            name: "General / عام",
            value: "general",
          },
        ],
        default: "general",
        required: true,
      },

      {
        displayName: "Professional Domain / المجال المهني",
        name: "professionalDomain",
        type: "options",
        options: [
          {
            name: "Medical / طبي",
            value: "medical",
          },
          {
            name: "Legal / قانوني",
            value: "legal",
          },
          {
            name: "Educational / تعليمي",
            value: "educational",
          },
          {
            name: "Administrative / إداري",
            value: "administrative",
          },
          {
            name: "Financial / مالي",
            value: "financial",
          },
          {
            name: "General / عام",
            value: "general",
          },
        ],
        default: "general",
        required: true,
      },

      {
        displayName: "Input Data Source / مصدر البيانات",
        name: "inputDataSource",
        type: "options",
        options: [
          {
            name: "Previous Node / العقدة السابقة",
            value: "previous-node",
            description: "Use data from previous workflow node",
          },
          {
            name: "Manual Input / إدخال يدوي",
            value: "manual-input",
            description: "Manually specify data to validate",
          },
          {
            name: "JSON Object / كائن JSON",
            value: "json-object",
            description: "Provide JSON object for validation",
          },
        ],
        default: "previous-node",
        required: true,
      },

      {
        displayName: "Manual Input Data / البيانات المدخلة يدوياً",
        name: "manualInputData",
        type: "json",
        displayOptions: {
          show: {
            inputDataSource: ["manual-input", "json-object"],
          },
        },
        default: "{}",
        description: "JSON data to validate for Islamic compliance",
        required: false,
      },

      {
        displayName:
          "Include Prayer Time Validation / تضمين التحقق من وقت الصلاة",
        name: "includePrayerTime",
        type: "boolean",
        default: true,
        description: "Include real-time prayer time checking in validation",
        displayOptions: {
          show: {
            validationType: ["comprehensive"],
          },
        },
      },

      {
        displayName: "Include Riba Detection / تضمين كشف الربا",
        name: "includeRibaDetection",
        type: "boolean",
        default: true,
        description: "Include riba (interest) detection in financial data",
        displayOptions: {
          show: {
            validationType: ["comprehensive"],
          },
        },
      },

      {
        displayName: "Include Halal Validation / تضمين التحقق من الحلال",
        name: "includeHalalValidation",
        type: "boolean",
        default: true,
        description: "Include halal business practice validation",
        displayOptions: {
          show: {
            validationType: ["comprehensive"],
          },
        },
      },

      {
        displayName: "Include Cultural Check / تضمين الفحص الثقافي",
        name: "includeCulturalCheck",
        type: "boolean",
        default: true,
        description: "Include cultural appropriateness validation",
        displayOptions: {
          show: {
            validationType: ["comprehensive"],
          },
        },
      },

      {
        displayName: "Generate Detailed Report / إنشاء تقرير مفصل",
        name: "generateDetailedReport",
        type: "boolean",
        default: true,
        description: "Generate comprehensive Islamic compliance report",
      },

      {
        displayName: "Output Format / تنسيق الخرج",
        name: "outputFormat",
        type: "options",
        options: [
          {
            name: "Summary Only / الملخص فقط",
            value: "summary",
            description: "Basic compliance summary with pass/fail result",
          },
          {
            name: "Detailed Report / تقرير مفصل",
            value: "detailed",
            description: "Comprehensive report with recommendations",
          },
          {
            name: "Full Analysis / التحليل الكامل",
            value: "full",
            description: "Complete analysis with audit trail and next actions",
          },
        ],
        default: "detailed",
        required: true,
      },

      {
        displayName: "Custom Rules / القواعد المخصصة",
        name: "customRules",
        type: "collection",
        placeholder: "Add Custom Rule",
        default: {},
        options: [
          {
            displayName: "Rule Name / اسم القاعدة",
            name: "name",
            type: "string",
            default: "",
            required: true,
          },
          {
            displayName: "Rule Name (Arabic) / اسم القاعدة (عربي)",
            name: "nameArabic",
            type: "string",
            default: "",
            required: true,
          },
          {
            displayName: "Category / الفئة",
            name: "category",
            type: "options",
            options: [
              {
                name: "Financial / مالي",
                value: "financial",
              },
              {
                name: "Social / اجتماعي",
                value: "social",
              },
              {
                name: "Professional / مهني",
                value: "professional",
              },
              {
                name: "Cultural / ثقافي",
                value: "cultural",
              },
              {
                name: "Business / تجاري",
                value: "business",
              },
            ],
            default: "general",
            required: true,
          },
          {
            displayName: "Rule Description / وصف القاعدة",
            name: "rule",
            type: "string",
            default: "",
            required: true,
          },
          {
            displayName: "Severity / الخطورة",
            name: "severity",
            type: "options",
            options: [
              {
                name: "Warning / تحذير",
                value: "warning",
              },
              {
                name: "Error / خطأ",
                value: "error",
              },
              {
                name: "Critical / حرج",
                value: "critical",
              },
            ],
            default: "warning",
            required: true,
          },
          {
            displayName: "Enabled / مفعل",
            name: "enabled",
            type: "boolean",
            default: true,
          },
        ],
      },
    ],
  };

  /**
   * Execute Islamic compliance validation with comprehensive analysis
   */
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Get node parameters
    const validationType = this.getNodeParameter("validationType", 0) as string;
    const strictnessLevel = this.getNodeParameter(
      "strictnessLevel",
      0,
    ) as string;
    const region = this.getNodeParameter("region", 0) as string;
    const ministry = this.getNodeParameter("ministry", 0) as string;
    const professionalDomain = this.getNodeParameter(
      "professionalDomain",
      0,
    ) as string;
    const inputDataSource = this.getNodeParameter(
      "inputDataSource",
      0,
    ) as string;
    const outputFormat = this.getNodeParameter("outputFormat", 0) as string;
    const generateDetailedReport = this.getNodeParameter(
      "generateDetailedReport",
      0,
    ) as boolean;

    try {
      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        // Get input data based on source configuration
        let inputData: any;

        if (
          inputDataSource === "manual-input" ||
          inputDataSource === "json-object"
        ) {
          const manualData = this.getNodeParameter(
            "manualInputData",
            itemIndex,
          ) as string;
          try {
            inputData =
              typeof manualData === "string"
                ? JSON.parse(manualData)
                : manualData;
          } catch (error) {
            throw new NodeOperationError(
              this.getNode(),
              `Invalid JSON in manual input data: ${error.message}`,
            );
          }
        } else {
          inputData = items[itemIndex].json;
        }

        // Create validation configuration
        const validationConfig: IIslamicComplianceValidation = {
          inputData,
          validationType: validationType as any,
          strictnessLevel: strictnessLevel as any,
          ministry,
          region: region as any,
          professionalDomain: professionalDomain as any,
          customRules: this.getNodeParameter(
            "customRules",
            itemIndex,
            [],
          ) as IIslamicCustomRule[],
        };

        // Perform Islamic compliance validation
        const complianceReport =
          await this.performIslamicCompliance(validationConfig);

        // Log audit entry
        await this.logAuditEntry({
          action: "Islamic compliance validation performed",
          actionArabic: "تم إجراء التحقق من الامتثال الإسلامي",
          severity: complianceReport.overallCompliance.isCompliant
            ? "low"
            : "high",
          culturalCompliance: complianceReport.overallCompliance.score,
          islamicCompliance: complianceReport.overallCompliance.isCompliant,
          details: {
            validationType,
            strictnessLevel,
            region,
            ministry,
            complianceScore: complianceReport.overallCompliance.score,
            violationsCount: complianceReport.violations.length,
            recommendationsCount: complianceReport.recommendations.length,
          },
        });

        // Format output based on requested format
        let outputData: any;

        switch (outputFormat) {
          case "summary":
            outputData = this.formatSummaryOutput(complianceReport);
            break;
          case "detailed":
            outputData = this.formatDetailedOutput(complianceReport);
            break;
          case "full":
            outputData = this.formatFullOutput(complianceReport);
            break;
          default:
            outputData = this.formatDetailedOutput(complianceReport);
        }

        // Add cultural alerts if needed
        if (!complianceReport.overallCompliance.isCompliant) {
          await this.sendCulturalAlert(
            `Islamic compliance validation failed with score ${complianceReport.overallCompliance.score}`,
            "high",
          );
        }

        returnData.push({
          json: outputData,
          pairedItem: itemIndex,
        });
      }

      return [returnData];
    } catch (error) {
      // Handle execution error with cultural context
      await this.logAuditEntry({
        action: "Islamic compliance validation failed",
        actionArabic: "فشل التحقق من الامتثال الإسلامي",
        severity: "critical",
        culturalCompliance: 0,
        islamicCompliance: false,
        details: {
          error: error.message,
          validationType,
          ministry,
          region,
        },
      });

      throw new NodeOperationError(
        this.getNode(),
        `Islamic compliance validation failed: ${error.message}`,
      );
    }
  }

  /**
   * Perform comprehensive Islamic compliance validation
   */
  private async performIslamicCompliance(
    config: IIslamicComplianceValidation,
  ): Promise<IIslamicComplianceReport> {
    const validationId = `islamic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();

    // Initialize report structure
    const report: IIslamicComplianceReport = {
      validationId,
      timestamp,
      inputData: config.inputData,
      overallCompliance: {
        isCompliant: true,
        score: 100,
        level: "excellent",
      },
      prayerTimeValidation: {} as IPrayerTimeValidationResult,
      ribaValidation: {} as IRibaValidationResult,
      halalValidation: {} as IHalalValidationResult,
      culturalValidation: {} as ICulturalAppropriatenessResult,
      calendarValidation: {} as IIslamicCalendarValidationResult,
      violations: [],
      recommendations: [],
      auditTrail: [],
      nextActions: [],
    };

    try {
      // Perform validation based on type
      switch (config.validationType) {
        case "comprehensive":
          await this.performComprehensiveValidation(config, report);
          break;
        case "prayer-time":
          report.prayerTimeValidation = await this.validatePrayerTime(config);
          break;
        case "riba-detection":
          report.ribaValidation = await this.validateRiba(config);
          break;
        case "halal-business":
          report.halalValidation = await this.validateHalal(config);
          break;
        case "cultural-appropriateness":
          report.culturalValidation =
            await this.validateCulturalAppropriateness(config);
          break;
        case "calendar-event":
          report.calendarValidation =
            await this.validateIslamicCalendar(config);
          break;
      }

      // Apply custom rules if provided
      if (config.customRules && config.customRules.length > 0) {
        await this.applyCustomRules(config, report);
      }

      // Calculate overall compliance score
      this.calculateOverallCompliance(report);

      // Generate recommendations and next actions
      await this.generateRecommendations(config, report);
      await this.generateNextActions(config, report);

      // Create audit trail entry
      report.auditTrail.push({
        timestamp,
        validationType: config.validationType,
        inputDataHash: this.generateDataHash(config.inputData),
        complianceScore: report.overallCompliance.score,
        violations: report.violations.length,
        recommendations: report.recommendations.length,
        ministry: config.ministry,
        region: config.region,
        userId: "current-user", // Would be actual user ID
        sessionId: "session-id", // Would be actual session ID
        culturalContext: {
          strictnessLevel: config.strictnessLevel,
          professionalDomain: config.professionalDomain,
          customRulesCount: config.customRules?.length || 0,
        },
      });

      return report;
    } catch (error) {
      report.overallCompliance.isCompliant = false;
      report.overallCompliance.score = 0;
      report.overallCompliance.level = "non-compliant";

      report.violations.push({
        id: `validation_error_${Date.now()}`,
        type: "prayer-conflict",
        severity: "critical",
        title: "Validation Process Error",
        titleArabic: "خطأ في عملية التحقق",
        description: `Failed to complete Islamic compliance validation: ${error.message}`,
        descriptionArabic: `فشل في إكمال التحقق من الامتثال الإسلامي: ${error.message}`,
        impact: "Unable to verify Islamic compliance",
        remediation: "Review input data and validation configuration",
        remediationArabic: "مراجعة البيانات المدخلة وإعداد التحقق",
        timeToResolve: "Immediate",
        responsibleParty: "System Administrator",
      });

      return report;
    }
  }

  /**
   * Perform comprehensive validation including all aspects
   */
  private async performComprehensiveValidation(
    config: IIslamicComplianceValidation,
    report: IIslamicComplianceReport,
  ): Promise<void> {
    // Prayer time validation
    report.prayerTimeValidation = await this.validatePrayerTime(config);

    // Riba detection for financial data
    if (this.containsFinancialData(config.inputData)) {
      report.ribaValidation = await this.validateRiba(config);
    }

    // Halal business validation
    if (this.containsBusinessData(config.inputData)) {
      report.halalValidation = await this.validateHalal(config);
    }

    // Cultural appropriateness validation
    report.culturalValidation =
      await this.validateCulturalAppropriateness(config);

    // Islamic calendar validation
    report.calendarValidation = await this.validateIslamicCalendar(config);
  }

  /**
   * Validate prayer time and workflow scheduling
   */
  private async validatePrayerTime(
    config: IIslamicComplianceValidation,
  ): Promise<IPrayerTimeValidationResult> {
    const currentTime = new Date();
    const prayerTimes = await this.getPrayerTimes(config.region);

    return {
      currentTime,
      region: config.region,
      timezone: "Asia/Baghdad",
      isPrayerTime: prayerTimes.isCurrentlyPrayerTime,
      currentPrayer: prayerTimes.isCurrentlyPrayerTime
        ? this.getCurrentPrayer(prayerTimes)
        : undefined,
      nextPrayer: {
        name: prayerTimes.nextPrayerName,
        time: prayerTimes.nextPrayerTime,
        timeUntil: prayerTimes.nextPrayerTime.getTime() - currentTime.getTime(),
      },
      todaysPrayerTimes: {
        fajr: prayerTimes.fajr,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha,
      },
      workflowImpact: {
        shouldPause: prayerTimes.isCurrentlyPrayerTime,
        pauseDuration: prayerTimes.isCurrentlyPrayerTime ? 30 * 60 * 1000 : 0, // 30 minutes
        resumeTime: prayerTimes.isCurrentlyPrayerTime
          ? new Date(prayerTimes.nextPrayerTime.getTime() + 30 * 60 * 1000)
          : currentTime,
        prayerTimeConflict: prayerTimes.isCurrentlyPrayerTime,
      },
    };
  }

  /**
   * Validate for riba (interest) in financial transactions
   */
  private async validateRiba(
    config: IIslamicComplianceValidation,
  ): Promise<IRibaValidationResult> {
    const financialData = this.extractFinancialData(config.inputData);
    const suspiciousTransactions: IRibaSuspiciousTransaction[] = [];
    const interestCalculations: IInterestCalculation[] = [];
    let ribaScore = 0;

    // Analyze financial transactions for riba
    for (const transaction of financialData) {
      if (this.isRibaTransaction(transaction)) {
        suspiciousTransactions.push({
          transactionId: transaction.id || `tx_${Date.now()}`,
          type: transaction.type || "unknown",
          amount: transaction.amount || 0,
          currency: transaction.currency || "IQD",
          interestRate: transaction.interestRate,
          riskLevel: this.calculateRibaRisk(transaction),
          reason: "Interest-based transaction detected",
          reasonArabic: "تم اكتشاف معاملة ربوية",
          suggestedAction: "Replace with Islamic financial alternative",
        });

        ribaScore += 25; // Each riba transaction adds to score
      }

      if (transaction.interest && transaction.interest > 0) {
        interestCalculations.push({
          amount: transaction.amount || 0,
          rate: transaction.interestRate || 0,
          period: transaction.period || "unknown",
          calculatedInterest: transaction.interest,
          isRiba: true,
          islamicAlternative: "Murabaha or Ijara financing",
        });
      }
    }

    return {
      ribaDetected: suspiciousTransactions.length > 0,
      ribaScore: Math.min(ribaScore, 100),
      suspiciousTransactions,
      interestCalculations,
      recommendations: this.generateRibaRecommendations(suspiciousTransactions),
      alternativeStructures: this.generateIslamicAlternatives(
        suspiciousTransactions,
      ),
      complianceLevel:
        suspiciousTransactions.length === 0
          ? "compliant"
          : ribaScore < 50
            ? "suspicious"
            : "non-compliant",
    };
  }

  /**
   * Validate halal business practices
   */
  private async validateHalal(
    config: IIslamicComplianceValidation,
  ): Promise<IHalalValidationResult> {
    const businessData = this.extractBusinessData(config.inputData);
    const violations: IHalalViolation[] = [];
    let halalScore = 100;

    // Check for haram business activities
    const haramKeywords = [
      "alcohol",
      "gambling",
      "pork",
      "interest",
      "lottery",
      "casino",
    ];
    const businessContent = JSON.stringify(businessData).toLowerCase();

    for (const keyword of haramKeywords) {
      if (businessContent.includes(keyword)) {
        violations.push({
          type: "product",
          severity: "critical",
          description: `Haram content detected: ${keyword}`,
          descriptionArabic: `تم اكتشاف محتوى حرام: ${keyword}`,
          impact: "Business may not be halal compliant",
          remediation: `Remove or replace ${keyword}-related activities`,
          timeline: "Immediate",
        });
        halalScore -= 20;
      }
    }

    return {
      isHalal: violations.length === 0,
      halalScore: Math.max(halalScore, 0),
      businessType: businessData.type || "unknown",
      industry: businessData.industry || "unknown",
      violations,
      certifications: [], // Would be populated from actual certification data
      recommendations: this.generateHalalRecommendations(violations),
      ministrySpecificRequirements: this.getMinistryHalalRequirements(
        config.ministry,
      ),
    };
  }

  /**
   * Validate cultural appropriateness
   */
  private async validateCulturalAppropriateness(
    config: IIslamicComplianceValidation,
  ): Promise<ICulturalAppropriatenessResult> {
    const culturalResult = await this.validateCulturalSensitivity(
      config.inputData,
      {
        ministry: config.ministry,
        audience: "public",
        islamicCompliance: true,
        professionalContext: config.professionalDomain,
        sensitivityLevel: config.strictnessLevel,
        culturalEvents: [],
      },
    );

    const issues: ICulturalIssue[] = culturalResult.violations.map(
      (violation) => ({
        category: "cultural",
        severity: "medium",
        description: violation,
        descriptionArabic: violation, // Would be translated
        context: config.professionalDomain,
        suggestion: "Review content for cultural appropriateness",
        culturalNote: "Consider Iraqi cultural context and Islamic values",
      }),
    );

    return {
      isAppropriate: culturalResult.isAppropriate,
      appropriatenessScore: culturalResult.score,
      culturalSensitivityLevel:
        config.strictnessLevel === "strict"
          ? "high"
          : config.strictnessLevel === "moderate"
            ? "medium"
            : "low",
      languageAppropriate: true, // Would be determined by Arabic processing
      contextAppropriate: culturalResult.professionalAppropriate,
      professionalAppropriate: culturalResult.professionalAppropriate,
      issues,
      recommendations: culturalResult.recommendations,
      ministrySpecificGuidance: this.getMinistryCulturalGuidance(
        config.ministry,
      ),
    };
  }

  /**
   * Validate Islamic calendar events
   */
  private async validateIslamicCalendar(
    config: IIslamicComplianceValidation,
  ): Promise<IIslamicCalendarValidationResult> {
    const currentDate = new Date();
    const hijriDate = this.convertToHijri(currentDate);
    const islamicEvents = await this.getIslamicCalendarEvents(config.region);

    return {
      currentDate: {
        gregorian: currentDate,
        hijri: hijriDate,
        isIslamicHoliday: this.isIslamicHoliday(currentDate, islamicEvents),
        isWorkingDay: this.isWorkingDay(
          currentDate,
          islamicEvents,
          config.ministry,
        ),
      },
      upcomingEvents: islamicEvents,
      workflowImpact: {
        shouldScheduleAround: this.shouldScheduleAroundEvents(islamicEvents),
        affectedDates: this.getAffectedDates(islamicEvents),
        alternativeSchedule: this.getAlternativeSchedule(islamicEvents),
      },
      ministry: config.ministry,
      region: config.region,
    };
  }

  // ================================
  // Helper Methods
  // ================================

  private containsFinancialData(data: any): boolean {
    const financialKeywords = [
      "amount",
      "price",
      "cost",
      "payment",
      "transaction",
      "money",
      "currency",
    ];
    const dataString = JSON.stringify(data).toLowerCase();
    return financialKeywords.some((keyword) => dataString.includes(keyword));
  }

  private containsBusinessData(data: any): boolean {
    const businessKeywords = [
      "business",
      "company",
      "service",
      "product",
      "industry",
      "commercial",
    ];
    const dataString = JSON.stringify(data).toLowerCase();
    return businessKeywords.some((keyword) => dataString.includes(keyword));
  }

  private extractFinancialData(data: any): any[] {
    // Extract financial transactions from input data
    if (Array.isArray(data)) {
      return data.filter((item) => this.containsFinancialData(item));
    }
    return this.containsFinancialData(data) ? [data] : [];
  }

  private extractBusinessData(data: any): any {
    // Extract business-related data
    return data.business || data.company || data;
  }

  private isRibaTransaction(transaction: any): boolean {
    return (
      transaction.interestRate > 0 ||
      transaction.interest > 0 ||
      (transaction.type === "loan" && transaction.fee > 0)
    );
  }

  private calculateRibaRisk(
    transaction: any,
  ): "low" | "medium" | "high" | "critical" {
    if (transaction.interestRate > 10) return "critical";
    if (transaction.interestRate > 5) return "high";
    if (transaction.interestRate > 0) return "medium";
    return "low";
  }

  private generateRibaRecommendations(
    transactions: IRibaSuspiciousTransaction[],
  ): string[] {
    const recommendations = [
      "Replace interest-based transactions with Islamic financial instruments",
      "Consider Murabaha (cost-plus financing) for purchase transactions",
      "Use Ijara (leasing) for asset financing",
      "Implement profit-and-loss sharing (Musharakah) for partnerships",
    ];

    return recommendations.slice(
      0,
      Math.min(transactions.length + 1, recommendations.length),
    );
  }

  private generateIslamicAlternatives(
    transactions: IRibaSuspiciousTransaction[],
  ): IIslamicFinancialAlternative[] {
    return transactions.map((tx) => ({
      currentStructure: `${tx.type} with ${tx.interestRate}% interest`,
      islamicAlternative: this.getIslamicAlternativeForType(tx.type),
      alternativeArabic: this.getIslamicAlternativeArabic(tx.type),
      benefits: ["Sharia compliant", "Risk sharing", "Asset-backed"],
      implementation: "Contact Islamic banking specialists",
      shariahCompliance: 100,
    }));
  }

  private getIslamicAlternativeForType(type: string): string {
    const alternatives: Record<string, string> = {
      loan: "Qard Hassan (interest-free loan) or Murabaha",
      investment: "Musharakah (profit-sharing partnership)",
      deposit: "Wadiah (safekeeping) or Mudharabah",
      credit: "Murabaha (cost-plus sale)",
      insurance: "Takaful (Islamic insurance)",
    };
    return alternatives[type] || "Islamic financial instrument";
  }

  private getIslamicAlternativeArabic(type: string): string {
    const alternatives: Record<string, string> = {
      loan: "قرض حسن أو مرابحة",
      investment: "مشاركة",
      deposit: "وديعة أو مضاربة",
      credit: "مرابحة",
      insurance: "تكافل",
    };
    return alternatives[type] || "أداة مالية إسلامية";
  }

  private generateHalalRecommendations(
    violations: IHalalViolation[],
  ): string[] {
    const recommendations = [
      "Obtain halal certification from recognized authority",
      "Review supply chain for halal compliance",
      "Implement halal monitoring procedures",
      "Train staff on halal requirements",
    ];

    return violations.length > 0
      ? recommendations
      : ["Continue maintaining halal standards"];
  }

  private getMinistryHalalRequirements(ministry: string): string[] {
    const requirements: Record<string, string[]> = {
      health: ["Halal pharmaceuticals", "Islamic medical ethics"],
      education: ["Halal food in schools", "Islamic educational content"],
      finance: ["Islamic banking compliance", "Riba-free transactions"],
      interior: ["Halal government services", "Cultural sensitivity"],
      justice: ["Islamic jurisprudence alignment", "Sharia compliance"],
    };

    return requirements[ministry] || ["General halal compliance"];
  }

  private getMinistryCulturalGuidance(ministry: string): string[] {
    const guidance: Record<string, string[]> = {
      health: [
        "Respect Islamic medical ethics",
        "Consider prayer times for appointments",
      ],
      education: [
        "Promote Islamic values",
        "Use culturally appropriate content",
      ],
      finance: [
        "Follow Islamic financial principles",
        "Avoid riba-based transactions",
      ],
      interior: [
        "Maintain cultural sensitivity",
        "Respect religious practices",
      ],
      justice: [
        "Align with Islamic jurisprudence",
        "Consider Sharia principles",
      ],
    };

    return guidance[ministry] || ["Follow general Islamic guidelines"];
  }

  private getCurrentPrayer(
    prayerTimes: any,
  ): "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" {
    const now = new Date();
    const times = prayerTimes;

    if (now >= times.fajr && now < times.dhuhr) return "fajr";
    if (now >= times.dhuhr && now < times.asr) return "dhuhr";
    if (now >= times.asr && now < times.maghrib) return "asr";
    if (now >= times.maghrib && now < times.isha) return "maghrib";
    return "isha";
  }

  private convertToHijri(date: Date): string {
    // Simplified Hijri conversion - in production, use proper Hijri calendar library
    const hijriYear = Math.floor((date.getFullYear() - 622) * 1.030684);
    return `${hijriYear} هـ`;
  }

  private async getIslamicCalendarEvents(
    region: string,
  ): Promise<IIslamicCalendarEvent[]> {
    // Mock Islamic calendar events - in production, integrate with Islamic calendar API
    return [
      {
        name: "Eid al-Fitr",
        nameArabic: "عيد الفطر",
        date: new Date("2024-04-10"),
        hijriDate: "1 شوال 1445",
        type: "holiday",
        significance: "major",
        workImpact: "no-work",
        duration: 3,
        customsAndTraditions: ["Family gatherings", "Charity", "Festive meals"],
      },
    ];
  }

  private isIslamicHoliday(
    date: Date,
    events: IIslamicCalendarEvent[],
  ): boolean {
    return events.some(
      (event) =>
        event.type === "holiday" &&
        event.date.toDateString() === date.toDateString(),
    );
  }

  private isWorkingDay(
    date: Date,
    events: IIslamicCalendarEvent[],
    ministry: string,
  ): boolean {
    const isHoliday = this.isIslamicHoliday(date, events);
    const isFriday = date.getDay() === 5; // Friday is weekend in Iraq
    return !isHoliday && !isFriday;
  }

  private shouldScheduleAroundEvents(events: IIslamicCalendarEvent[]): boolean {
    return events.some(
      (event) =>
        event.workImpact === "no-work" || event.workImpact === "reduced-hours",
    );
  }

  private getAffectedDates(events: IIslamicCalendarEvent[]): Date[] {
    return events
      .filter((event) => event.workImpact !== "normal")
      .map((event) => event.date);
  }

  private getAlternativeSchedule(events: IIslamicCalendarEvent[]): Date[] {
    // Generate alternative dates avoiding Islamic holidays
    const alternatives: Date[] = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const altDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      if (!this.isIslamicHoliday(altDate, events) && altDate.getDay() !== 5) {
        alternatives.push(altDate);
      }
    }

    return alternatives.slice(0, 5); // Return first 5 alternative dates
  }

  private applyCustomRules(
    config: IIslamicComplianceValidation,
    report: IIslamicComplianceReport,
  ): void {
    if (!config.customRules) return;

    for (const rule of config.customRules.filter((r) => r.enabled)) {
      // Simple rule evaluation - in production, implement proper rule engine
      const dataString = JSON.stringify(config.inputData).toLowerCase();
      const ruleString = rule.rule.toLowerCase();

      if (dataString.includes(ruleString)) {
        report.violations.push({
          id: `custom_rule_${rule.id || Date.now()}`,
          type: "cultural-inappropriate",
          severity: rule.severity as any,
          title: rule.name,
          titleArabic: rule.nameArabic,
          description: `Custom rule violation: ${rule.rule}`,
          descriptionArabic: `انتهاك قاعدة مخصصة: ${rule.rule}`,
          impact: "Custom compliance requirement not met",
          remediation: "Address custom rule requirement",
          remediationArabic: "معالجة متطلبات القاعدة المخصصة",
          timeToResolve: "As per rule requirements",
          responsibleParty: "Content reviewer",
        });
      }
    }
  }

  private calculateOverallCompliance(report: IIslamicComplianceReport): void {
    let totalScore = 0;
    let componentCount = 0;

    // Add prayer time score
    if (report.prayerTimeValidation) {
      totalScore += report.prayerTimeValidation.workflowImpact
        ?.prayerTimeConflict
        ? 70
        : 100;
      componentCount++;
    }

    // Add riba score
    if (report.ribaValidation) {
      totalScore += 100 - report.ribaValidation.ribaScore;
      componentCount++;
    }

    // Add halal score
    if (report.halalValidation) {
      totalScore += report.halalValidation.halalScore;
      componentCount++;
    }

    // Add cultural score
    if (report.culturalValidation) {
      totalScore += report.culturalValidation.appropriatenessScore;
      componentCount++;
    }

    // Calculate overall score
    const overallScore =
      componentCount > 0 ? Math.round(totalScore / componentCount) : 100;

    // Adjust for violations
    const violationPenalty = report.violations.length * 5;
    const finalScore = Math.max(0, overallScore - violationPenalty);

    report.overallCompliance.score = finalScore;
    report.overallCompliance.isCompliant =
      finalScore >= 70 && report.violations.length === 0;

    if (finalScore >= 90) report.overallCompliance.level = "excellent";
    else if (finalScore >= 80) report.overallCompliance.level = "good";
    else if (finalScore >= 70) report.overallCompliance.level = "acceptable";
    else if (finalScore >= 50) report.overallCompliance.level = "poor";
    else report.overallCompliance.level = "non-compliant";
  }

  private async generateRecommendations(
    config: IIslamicComplianceValidation,
    report: IIslamicComplianceReport,
  ): Promise<void> {
    const recommendations: IIslamicRecommendation[] = [];

    // Prayer time recommendations
    if (report.prayerTimeValidation?.workflowImpact?.prayerTimeConflict) {
      recommendations.push({
        id: `prayer_rec_${Date.now()}`,
        category: "immediate",
        priority: "high",
        title: "Reschedule for After Prayer Time",
        titleArabic: "إعادة الجدولة بعد وقت الصلاة",
        description:
          "Current operation conflicts with prayer time. Reschedule to maintain Islamic compliance.",
        descriptionArabic:
          "العملية الحالية تتعارض مع وقت الصلاة. يجب إعادة الجدولة للحفاظ على الامتثال الإسلامي.",
        implementation:
          "Implement prayer time awareness in workflow scheduling",
        benefits: [
          "Maintains Islamic compliance",
          "Respects religious obligations",
        ],
        estimatedImpact: 95,
        timeframe: "Immediate",
      });
    }

    // Riba recommendations
    if (report.ribaValidation?.ribaDetected) {
      recommendations.push({
        id: `riba_rec_${Date.now()}`,
        category: "immediate",
        priority: "critical",
        title: "Replace Interest-Based Transactions",
        titleArabic: "استبدال المعاملات الربوية",
        description:
          "Riba detected in financial transactions. Replace with Islamic financial alternatives.",
        descriptionArabic:
          "تم اكتشاف الربا في المعاملات المالية. يجب الاستبدال بالبدائل المالية الإسلامية.",
        implementation:
          "Consult Islamic banking specialists for Sharia-compliant alternatives",
        benefits: [
          "Sharia compliance",
          "Ethical business practices",
          "Risk sharing",
        ],
        estimatedImpact: 100,
        timeframe: "Immediate",
      });
    }

    report.recommendations = recommendations;
  }

  private async generateNextActions(
    config: IIslamicComplianceValidation,
    report: IIslamicComplianceReport,
  ): Promise<void> {
    const nextActions: IIslamicNextAction[] = [];

    if (!report.overallCompliance.isCompliant) {
      nextActions.push({
        id: `action_review_${Date.now()}`,
        type: "validation",
        title: "Review Compliance Violations",
        titleArabic: "مراجعة انتهاكات الامتثال",
        description:
          "Comprehensive review of all identified compliance violations",
        priority: "high",
        assignedTo: "Compliance Officer",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        dependencies: [],
        estimatedEffort: "2-4 hours",
      });
    }

    if (report.violations.some((v) => v.severity === "critical")) {
      nextActions.push({
        id: `action_critical_${Date.now()}`,
        type: "remediation",
        title: "Address Critical Violations",
        titleArabic: "معالجة الانتهاكات الحرجة",
        description:
          "Immediate action required for critical Islamic compliance violations",
        priority: "urgent",
        assignedTo: "Islamic Compliance Specialist",
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        dependencies: [],
        estimatedEffort: "1-2 hours",
      });
    }

    report.nextActions = nextActions;
  }

  private generateDataHash(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString("base64").substr(0, 16);
  }

  private formatSummaryOutput(report: IIslamicComplianceReport): any {
    return {
      validationId: report.validationId,
      timestamp: report.timestamp,
      isCompliant: report.overallCompliance.isCompliant,
      complianceScore: report.overallCompliance.score,
      complianceLevel: report.overallCompliance.level,
      violationsCount: report.violations.length,
      recommendationsCount: report.recommendations.length,
      summary: {
        english: `Islamic compliance validation ${report.overallCompliance.isCompliant ? "passed" : "failed"} with score ${report.overallCompliance.score}/100`,
        arabic: `${report.overallCompliance.isCompliant ? "نجح" : "فشل"} التحقق من الامتثال الإسلامي بنتيجة ${report.overallCompliance.score}/100`,
      },
    };
  }

  private formatDetailedOutput(report: IIslamicComplianceReport): any {
    return {
      ...this.formatSummaryOutput(report),
      prayerTimeValidation: report.prayerTimeValidation,
      ribaValidation: report.ribaValidation,
      halalValidation: report.halalValidation,
      culturalValidation: report.culturalValidation,
      calendarValidation: report.calendarValidation,
      violations: report.violations,
      recommendations: report.recommendations,
    };
  }

  private formatFullOutput(report: IIslamicComplianceReport): any {
    return {
      ...this.formatDetailedOutput(report),
      auditTrail: report.auditTrail,
      nextActions: report.nextActions,
      fullReport: report,
    };
  }
}

// Export the node
export { IslamicComplianceNode as default };
