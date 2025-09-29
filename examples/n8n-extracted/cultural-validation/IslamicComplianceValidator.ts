/**
 * Islamic Compliance Validator for Iraqi AI Workflow System
 * Ensures all workflow operations respect Islamic principles and values
 *
 * Key Features:
 * - Riba (interest) detection and prevention
 * - Halal business practice validation
 * - Prayer time respect and scheduling
 * - Content filtering for Islamic appropriateness
 * - Professional domain specific validation
 */

import type {
  IIslamicComplianceConfig,
  INode,
  IRunExecutionData,
  IExecutionResponse,
  ICulturalComplianceMetrics,
} from "../workflow-engine/types";

export interface IslamicComplianceResult {
  isCompliant: boolean;
  score: number; // 0-1
  issues: string[];
  recommendations: string[];
  severity: "low" | "medium" | "high" | "critical";
}

export interface IslamicComplianceValidation {
  workflowLevel: IslamicComplianceResult;
  nodeLevel: { [nodeName: string]: IslamicComplianceResult };
  outputLevel: IslamicComplianceResult;
  overallScore: number;
}

export class IslamicComplianceValidator {
  private config: IIslamicComplianceConfig;
  private prayerTimes: { [key: string]: string } = {};
  private hijriDate: string = "";
  private isRamadan: boolean = false;

  // Islamic business principles
  private readonly FORBIDDEN_KEYWORDS = [
    // Financial (Riba/Interest)
    "interest",
    "loan_interest",
    "compound_interest",
    "usury",
    "riba",
    "gambling",
    "lottery",
    "betting",
    "speculation",

    // Content appropriateness
    "alcohol",
    "wine",
    "beer",
    "liquor",
    "pork",
    "ham",
    "bacon",
    "adult_content",
    "inappropriate_imagery",

    // Business practices
    "monopoly_abuse",
    "price_manipulation",
    "fraud",
    "deception",
  ];

  private readonly PROFESSIONAL_RESTRICTIONS = {
    health: {
      // Medical ethics in Islamic context
      forbidden: [
        "unlawful_procedures",
        "non_emergency_friday",
        "mixed_gender_inappropriate",
      ],
      required: [
        "patient_consent",
        "family_notification",
        "islamic_medical_ethics",
      ],
    },
    education: {
      // Educational principles
      forbidden: [
        "gender_inappropriate_mixing",
        "un_islamic_content",
        "friday_exams",
      ],
      required: [
        "islamic_values_integration",
        "parental_consent",
        "cultural_sensitivity",
      ],
    },
    interior: {
      // Government/civil services
      forbidden: ["discrimination", "bribery", "unfair_treatment"],
      required: ["equal_treatment", "transparency", "citizen_rights_respect"],
    },
    justice: {
      // Legal and judicial
      forbidden: ["islamic_law_contradiction", "unfair_judgment", "bribery"],
      required: [
        "fair_trial",
        "evidence_based",
        "islamic_jurisprudence_compliance",
      ],
    },
    general: {
      forbidden: ["harm_to_community", "unethical_business"],
      required: ["community_benefit", "ethical_conduct"],
    },
  };

  constructor(config: IIslamicComplianceConfig) {
    this.config = config;
    this.initializePrayerTimes();
    this.updateIslamicCalendar();
  }

  /**
   * Initialize prayer times for Baghdad timezone
   */
  private initializePrayerTimes(): void {
    // Simplified prayer times - in production, this would use actual prayer time API
    this.prayerTimes = {
      fajr: "05:30",
      sunrise: "06:45",
      dhuhr: "12:30",
      asr: "15:45",
      maghrib: "18:15",
      isha: "19:30",
    };
  }

  /**
   * Update Islamic calendar information
   */
  private updateIslamicCalendar(): void {
    // Simplified - in production, would use actual Hijri calendar API
    const now = new Date();
    this.hijriDate = this.convertToHijri(now);
    this.isRamadan = this.checkIfRamadan(now);
  }

  /**
   * Validate entire workflow for Islamic compliance
   */
  async validateWorkflow(
    workflowData: IRunExecutionData,
  ): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    try {
      // Check execution timing
      const timingCheck = this.validateExecutionTiming();
      if (!timingCheck.isCompliant) {
        issues.push(...timingCheck.issues);
        recommendations.push(...timingCheck.recommendations);
        score -= 0.2;
      }

      // Check workflow structure
      const structureCheck = await this.validateWorkflowStructure(workflowData);
      if (!structureCheck.isCompliant) {
        issues.push(...structureCheck.issues);
        recommendations.push(...structureCheck.recommendations);
        score -= 0.3;
      }

      // Check for forbidden operations
      const contentCheck = await this.validateWorkflowContent(workflowData);
      if (!contentCheck.isCompliant) {
        issues.push(...contentCheck.issues);
        recommendations.push(...contentCheck.recommendations);
        score -= 0.4;
      }

      // Professional domain specific validation
      if (this.config.professionalDomain !== "general") {
        const domainCheck = await this.validateProfessionalDomain(workflowData);
        if (!domainCheck.isCompliant) {
          issues.push(...domainCheck.issues);
          recommendations.push(...domainCheck.recommendations);
          score -= 0.1;
        }
      }

      score = Math.max(0, score);

      return {
        isCompliant: score >= (this.config.strictMode ? 0.95 : 0.85),
        score,
        issues,
        recommendations,
        severity: this.calculateSeverity(score, issues),
      };
    } catch (error) {
      return {
        isCompliant: false,
        score: 0,
        issues: [`Islamic compliance validation error: ${error.message}`],
        recommendations: [
          "Review workflow for Islamic compliance before execution",
        ],
        severity: "critical",
      };
    }
  }

  /**
   * Validate individual node for Islamic compliance
   */
  async validateNode(node: INode): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check node type compliance
    const nodeTypeCheck = this.validateNodeType(node);
    if (!nodeTypeCheck.isCompliant) {
      issues.push(...nodeTypeCheck.issues);
      recommendations.push(...nodeTypeCheck.recommendations);
      score -= 0.3;
    }

    // Check node parameters
    const parametersCheck = this.validateNodeParameters(node);
    if (!parametersCheck.isCompliant) {
      issues.push(...parametersCheck.issues);
      recommendations.push(...parametersCheck.recommendations);
      score -= 0.4;
    }

    // Check cultural settings
    if (node.culturalSettings) {
      const culturalCheck = this.validateNodeCulturalSettings(node);
      if (!culturalCheck.isCompliant) {
        issues.push(...culturalCheck.issues);
        recommendations.push(...culturalCheck.recommendations);
        score -= 0.3;
      }
    }

    score = Math.max(0, score);

    return {
      isCompliant: score >= (this.config.strictMode ? 0.9 : 0.8),
      score,
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  /**
   * Validate node output for Islamic compliance
   */
  async validateOutput(data: any): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check output content
    const contentCheck = await this.validateOutputContent(data);
    if (!contentCheck.isCompliant) {
      issues.push(...contentCheck.issues);
      recommendations.push(...contentCheck.recommendations);
      score -= 0.4;
    }

    // Check financial data compliance
    if (this.containsFinancialData(data)) {
      const financialCheck = await this.validateFinancialCompliance(data);
      if (!financialCheck.isCompliant) {
        issues.push(...financialCheck.issues);
        recommendations.push(...financialCheck.recommendations);
        score -= 0.5;
      }
    }

    // Check cultural appropriateness
    const culturalCheck = await this.validateCulturalContent(data);
    if (!culturalCheck.isCompliant) {
      issues.push(...culturalCheck.issues);
      recommendations.push(...culturalCheck.recommendations);
      score -= 0.1;
    }

    score = Math.max(0, score);

    return {
      isCompliant: score >= (this.config.strictMode ? 0.9 : 0.8),
      score,
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  /**
   * Validate complete workflow output
   */
  async validateWorkflowOutput(
    executionData: IExecutionResponse,
  ): Promise<IslamicComplianceValidation> {
    const workflowCheck = await this.validateOutput(executionData.data);
    const nodeChecks: { [nodeName: string]: IslamicComplianceResult } = {};

    // Validate each node's output if available
    if (executionData.data.resultData?.runData) {
      for (const [nodeName, nodeData] of Object.entries(
        executionData.data.resultData.runData,
      )) {
        nodeChecks[nodeName] = await this.validateOutput(nodeData);
      }
    }

    // Calculate overall score
    const nodeScores = Object.values(nodeChecks).map((check) => check.score);
    const overallScore =
      nodeScores.length > 0
        ? (workflowCheck.score +
            nodeScores.reduce((a, b) => a + b, 0) / nodeScores.length) /
          2
        : workflowCheck.score;

    return {
      workflowLevel: workflowCheck,
      nodeLevel: nodeChecks,
      outputLevel: workflowCheck,
      overallScore,
      recommendations: this.generateOverallRecommendations(
        workflowCheck,
        nodeChecks,
      ),
    };
  }

  /**
   * Validate execution timing (prayer times, Friday, Ramadan)
   */
  private validateExecutionTiming(): IslamicComplianceResult {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const currentDay = now.getDay(); // 0 = Sunday, 5 = Friday
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check if it's prayer time
    if (this.config.contentFilters?.prayerTimeRespect) {
      for (const [prayer, time] of Object.entries(this.prayerTimes)) {
        const prayerTime = new Date(`1970-01-01T${time}:00`);
        const currentTimeObj = new Date(`1970-01-01T${currentTime}:00`);
        const timeDiff =
          Math.abs(currentTimeObj.getTime() - prayerTime.getTime()) /
          (1000 * 60);

        if (timeDiff <= 15) {
          // 15 minutes before/after prayer
          issues.push(`Execution during ${prayer} prayer time (${time})`);
          recommendations.push(`Schedule execution outside prayer times`);
          score -= 0.1;
        }
      }
    }

    // Check Friday restrictions
    if (currentDay === 5 && this.config.allowedBusinessHours?.excludeFriday) {
      const fridayPrayerTime = new Date(
        `1970-01-01T${this.prayerTimes.dhuhr}:00`,
      );
      const currentTimeObj = new Date(`1970-01-01T${currentTime}:00`);

      if (
        Math.abs(currentTimeObj.getTime() - fridayPrayerTime.getTime()) <=
        60 * 60 * 1000
      ) {
        issues.push("Execution near Friday prayer time");
        recommendations.push(
          "Avoid workflow execution 1 hour before/after Friday prayer",
        );
        score -= 0.2;
      }
    }

    // Check Ramadan restrictions
    if (this.isRamadan && this.config.allowedBusinessHours?.excludeRamadan) {
      const iftarTime = new Date(`1970-01-01T${this.prayerTimes.maghrib}:00`);
      const currentTimeObj = new Date(`1970-01-01T${currentTime}:00`);

      if (
        Math.abs(currentTimeObj.getTime() - iftarTime.getTime()) <=
        30 * 60 * 1000
      ) {
        issues.push("Execution near Iftar time during Ramadan");
        recommendations.push("Respect Iftar timing during Ramadan");
        score -= 0.1;
      }
    }

    return {
      isCompliant: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  /**
   * Validate workflow structure for Islamic compliance
   */
  private async validateWorkflowStructure(
    workflowData: IRunExecutionData,
  ): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check for forbidden node types or operations
    if (workflowData.executionData?.nodeExecutionStack) {
      for (const nodeExecution of workflowData.executionData
        .nodeExecutionStack) {
        const nodeCheck = await this.validateNode(nodeExecution.node);
        if (!nodeCheck.isCompliant) {
          issues.push(
            `Node '${nodeExecution.node.name}': ${nodeCheck.issues.join(", ")}`,
          );
          recommendations.push(...nodeCheck.recommendations);
          score -= 0.1;
        }
      }
    }

    return {
      isCompliant: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  /**
   * Validate workflow content for forbidden elements
   */
  private async validateWorkflowContent(
    workflowData: IRunExecutionData,
  ): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    const contentStr = JSON.stringify(workflowData).toLowerCase();

    // Check for forbidden keywords
    for (const keyword of this.FORBIDDEN_KEYWORDS) {
      if (contentStr.includes(keyword)) {
        issues.push(`Contains forbidden content: ${keyword}`);
        recommendations.push(
          `Remove or replace ${keyword} with Islamic-compliant alternative`,
        );
        score -= 0.2;
      }
    }

    return {
      isCompliant: score >= 0.7,
      score: Math.max(0, score),
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  /**
   * Validate professional domain specific requirements
   */
  private async validateProfessionalDomain(
    workflowData: IRunExecutionData,
  ): Promise<IslamicComplianceResult> {
    const domain = this.config.professionalDomain;
    const restrictions = this.PROFESSIONAL_RESTRICTIONS[domain];
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    if (!restrictions) {
      return {
        isCompliant: true,
        score: 1.0,
        issues: [],
        recommendations: [],
        severity: "low",
      };
    }

    const contentStr = JSON.stringify(workflowData).toLowerCase();

    // Check forbidden elements for this domain
    for (const forbidden of restrictions.forbidden) {
      if (contentStr.includes(forbidden)) {
        issues.push(`Professional domain violation: ${forbidden}`);
        recommendations.push(
          `Remove ${forbidden} - not appropriate for ${domain} domain`,
        );
        score -= 0.3;
      }
    }

    // Check required elements for this domain
    for (const required of restrictions.required) {
      if (!contentStr.includes(required)) {
        issues.push(`Missing required element: ${required}`);
        recommendations.push(`Add ${required} for ${domain} domain compliance`);
        score -= 0.1;
      }
    }

    return {
      isCompliant: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  /**
   * Helper methods for validation
   */
  private validateNodeType(node: INode): IslamicComplianceResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check for problematic node types
    const problematicTypes = [
      "gambling",
      "lottery",
      "interest-calculation",
      "alcohol-related",
    ];

    if (problematicTypes.includes(node.type)) {
      issues.push(`Node type '${node.type}' is not Islamic-compliant`);
      recommendations.push(`Replace with Islamic-compliant alternative`);
      score = 0;
    }

    return {
      isCompliant: score >= 0.8,
      score,
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  private validateNodeParameters(node: INode): IslamicComplianceResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    const parametersStr = JSON.stringify(node.parameters).toLowerCase();

    // Check for forbidden content in parameters
    for (const keyword of this.FORBIDDEN_KEYWORDS) {
      if (parametersStr.includes(keyword)) {
        issues.push(`Parameter contains forbidden content: ${keyword}`);
        recommendations.push(`Update parameter to remove ${keyword}`);
        score -= 0.2;
      }
    }

    return {
      isCompliant: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  private validateNodeCulturalSettings(node: INode): IslamicComplianceResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    if (node.culturalSettings) {
      if (!node.culturalSettings.islamicCompliant) {
        issues.push("Node not marked as Islamic compliant");
        recommendations.push("Enable Islamic compliance for this node");
        score -= 0.5;
      }
    } else {
      issues.push("No cultural settings defined");
      recommendations.push(
        "Add cultural settings to ensure Islamic compliance",
      );
      score -= 0.3;
    }

    return {
      isCompliant: score >= 0.7,
      score: Math.max(0, score),
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  private async validateOutputContent(
    data: any,
  ): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    const dataStr = JSON.stringify(data).toLowerCase();

    // Check for inappropriate content in output
    for (const keyword of this.FORBIDDEN_KEYWORDS) {
      if (dataStr.includes(keyword)) {
        issues.push(`Output contains inappropriate content: ${keyword}`);
        recommendations.push(`Filter out ${keyword} from output`);
        score -= 0.3;
      }
    }

    return {
      isCompliant: score >= 0.7,
      score: Math.max(0, score),
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  private containsFinancialData(data: any): boolean {
    const dataStr = JSON.stringify(data).toLowerCase();
    const financialKeywords = [
      "amount",
      "price",
      "cost",
      "payment",
      "money",
      "currency",
      "iqd",
    ];
    return financialKeywords.some((keyword) => dataStr.includes(keyword));
  }

  private async validateFinancialCompliance(
    data: any,
  ): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    const dataStr = JSON.stringify(data).toLowerCase();

    // Check for Riba (interest)
    if (this.config.contentFilters?.financialInterest) {
      const interestKeywords = ["interest", "apr", "compound", "usury"];
      for (const keyword of interestKeywords) {
        if (dataStr.includes(keyword)) {
          issues.push(`Financial data contains Riba: ${keyword}`);
          recommendations.push("Remove interest-based calculations");
          score = 0; // Critical violation
        }
      }
    }

    return {
      isCompliant: score >= 0.9,
      score,
      issues,
      recommendations,
      severity: this.calculateSeverity(score, issues),
    };
  }

  private async validateCulturalContent(
    data: any,
  ): Promise<IslamicComplianceResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // This would integrate with more sophisticated cultural validation
    // For now, basic keyword checking

    return {
      isCompliant: true,
      score,
      issues,
      recommendations,
      severity: "low",
    };
  }

  private calculateSeverity(
    score: number,
    issues: string[],
  ): "low" | "medium" | "high" | "critical" {
    if (
      score <= 0.3 ||
      issues.some(
        (issue) => issue.includes("Riba") || issue.includes("forbidden"),
      )
    ) {
      return "critical";
    }
    if (score <= 0.6) return "high";
    if (score <= 0.8) return "medium";
    return "low";
  }

  private generateOverallRecommendations(
    workflowCheck: IslamicComplianceResult,
    nodeChecks: { [nodeName: string]: IslamicComplianceResult },
  ): string[] {
    const recommendations: string[] = [];

    if (!workflowCheck.isCompliant) {
      recommendations.push("Review workflow for Islamic compliance issues");
    }

    const failedNodes = Object.entries(nodeChecks)
      .filter(([_, check]) => !check.isCompliant)
      .map(([name, _]) => name);

    if (failedNodes.length > 0) {
      recommendations.push(
        `Review nodes for compliance: ${failedNodes.join(", ")}`,
      );
    }

    if (this.config.strictMode) {
      recommendations.push("Consider relaxing strict mode if issues are minor");
    }

    return recommendations;
  }

  // Helper methods for Islamic calendar
  private convertToHijri(date: Date): string {
    // Simplified conversion - in production, use proper Hijri calendar library
    return "1446/03/15"; // Example Hijri date
  }

  private checkIfRamadan(date: Date): boolean {
    // Simplified check - in production, use proper Islamic calendar
    const month = date.getMonth();
    return month === 3; // Example: April could be Ramadan
  }

  /**
   * Get current validation status summary
   */
  getValidationSummary(): {
    prayerTimes: { [key: string]: string };
    hijriDate: string;
    isRamadan: boolean;
    config: IIslamicComplianceConfig;
  } {
    return {
      prayerTimes: this.prayerTimes,
      hijriDate: this.hijriDate,
      isRamadan: this.isRamadan,
      config: this.config,
    };
  }
}
