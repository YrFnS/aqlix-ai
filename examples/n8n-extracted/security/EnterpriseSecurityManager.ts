/**
 * Enterprise Security Manager for Iraqi AI Workflow System
 * Government-grade security with role-based access control
 *
 * Key Features:
 * - Role-based access control (RBAC) for ministry deployment
 * - Iraqi government security compliance
 * - Audit trail and monitoring
 * - Encryption and data protection
 * - Multi-factor authentication support
 */

import { EventEmitter } from "events";
import type {
  INode,
  IWorkflowExecuteAdditionalData,
} from "../workflow-engine/types";

export interface SecurityRole {
  id: string;
  name: string;
  ministry?:
    | "health"
    | "education"
    | "interior"
    | "justice"
    | "finance"
    | "general";
  permissions: SecurityPermission[];
  level: "read" | "write" | "admin" | "super_admin";
  restrictions: {
    timeBasedAccess?: {
      allowedHours: { start: string; end: string };
      excludeFriday?: boolean;
      respectPrayerTimes?: boolean;
    };
    ipRestrictions?: string[];
    deviceRestrictions?: string[];
    locationRestrictions?: string[];
  };
}

export interface SecurityPermission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete" | "execute")[];
  conditions?: {
    ministry?: string;
    department?: string;
    securityLevel?: "public" | "internal" | "confidential" | "secret";
  };
}

export interface SecurityContext {
  userId: string;
  sessionId: string;
  roles: SecurityRole[];
  ministry?: string;
  department?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  authMethod: "password" | "mfa" | "certificate" | "smart_card";
  securityClearance: "basic" | "elevated" | "high" | "top_secret";
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  ministry?: string;
  result: "success" | "failure" | "blocked";
  riskLevel: "low" | "medium" | "high" | "critical";
  details: {
    ipAddress: string;
    userAgent: string;
    executionId?: string;
    workflowId?: string;
    nodeId?: string;
    errorMessage?: string;
    culturalCompliance?: boolean;
  };
  metadata: {
    sessionId: string;
    requestId: string;
    culturalContext?: "islamic_compliant" | "review_required" | "blocked";
  };
}

export interface SecurityPolicy {
  id: string;
  name: string;
  ministry?: string;
  rules: SecurityRule[];
  enabled: boolean;
  priority: number;
  culturalCompliance: {
    islamicPrinciples: boolean;
    arabicContentHandling: boolean;
    governmentStandards: boolean;
  };
}

export interface SecurityRule {
  id: string;
  type: "access" | "execution" | "data" | "audit" | "cultural";
  condition: string;
  action: "allow" | "deny" | "require_approval" | "log_and_continue";
  message?: string;
  severity: "info" | "warning" | "error" | "critical";
}

export interface SecurityValidationResult {
  allowed: boolean;
  requiresApproval: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
  issues: string[];
  recommendations: string[];
  auditRequired: boolean;
  culturalCompliance: boolean;
}

export class EnterpriseSecurityManager extends EventEmitter {
  private policies: Map<string, SecurityPolicy> = new Map();
  private auditLog: AuditLogEntry[] = [];
  private activeSessions: Map<string, SecurityContext> = new Map();
  private encryptionKey: string;
  private auditRetentionDays: number = 2555; // 7 years for government compliance

  // Iraqi government security standards
  private readonly GOVERNMENT_SECURITY_LEVELS = {
    public: { encryption: "AES-128", audit: "basic", approval: false },
    internal: { encryption: "AES-256", audit: "detailed", approval: false },
    confidential: {
      encryption: "AES-256-GCM",
      audit: "comprehensive",
      approval: true,
    },
    secret: {
      encryption: "ChaCha20-Poly1305",
      audit: "comprehensive",
      approval: true,
    },
  };

  // Ministry-specific security requirements
  private readonly MINISTRY_REQUIREMENTS = {
    health: {
      dataProtection: "patient_privacy",
      auditLevel: "comprehensive",
      approvalRequired: ["patient_data_access", "medical_record_update"],
      culturalRequirements: ["islamic_medical_ethics", "family_consent"],
    },
    education: {
      dataProtection: "student_privacy",
      auditLevel: "detailed",
      approvalRequired: ["grade_modification", "student_record_access"],
      culturalRequirements: [
        "parental_consent",
        "islamic_education_principles",
      ],
    },
    interior: {
      dataProtection: "citizen_privacy",
      auditLevel: "comprehensive",
      approvalRequired: ["citizen_data_access", "identity_verification"],
      culturalRequirements: ["citizen_rights", "cultural_sensitivity"],
    },
    justice: {
      dataProtection: "legal_confidentiality",
      auditLevel: "comprehensive",
      approvalRequired: ["case_access", "legal_document_modification"],
      culturalRequirements: ["islamic_law_compliance", "fair_trial_principles"],
    },
    finance: {
      dataProtection: "financial_confidentiality",
      auditLevel: "comprehensive",
      approvalRequired: ["financial_data_access", "budget_modification"],
      culturalRequirements: ["islamic_finance_principles", "transparency"],
    },
  };

  constructor(encryptionKey?: string) {
    super();
    this.encryptionKey = encryptionKey || this.generateEncryptionKey();
    this.initializeDefaultPolicies();
    this.startAuditCleanup();
  }

  /**
   * Initialize default security policies for Iraqi government deployment
   */
  private initializeDefaultPolicies(): void {
    // Islamic Compliance Policy
    const islamicCompliancePolicy: SecurityPolicy = {
      id: "islamic-compliance",
      name: "Islamic Values Compliance Policy",
      rules: [
        {
          id: "prayer-time-respect",
          type: "execution",
          condition: "current_time_near_prayer",
          action: "require_approval",
          message: "Execution during prayer time requires approval",
          severity: "warning",
        },
        {
          id: "friday-restrictions",
          type: "execution",
          condition: "friday_prayer_time",
          action: "deny",
          message: "Non-emergency operations blocked during Friday prayer",
          severity: "info",
        },
        {
          id: "ramadan-sensitivity",
          type: "execution",
          condition: "ramadan_iftar_time",
          action: "require_approval",
          message: "Operations during Iftar time require approval",
          severity: "warning",
        },
      ],
      enabled: true,
      priority: 1,
      culturalCompliance: {
        islamicPrinciples: true,
        arabicContentHandling: true,
        governmentStandards: true,
      },
    };

    // Ministry Access Control Policy
    const ministryAccessPolicy: SecurityPolicy = {
      id: "ministry-access-control",
      name: "Ministry-based Access Control",
      rules: [
        {
          id: "cross-ministry-access",
          type: "access",
          condition: "user_ministry != resource_ministry",
          action: "require_approval",
          message: "Cross-ministry access requires approval",
          severity: "warning",
        },
        {
          id: "sensitive-data-access",
          type: "data",
          condition: "security_level >= confidential",
          action: "require_approval",
          message: "Confidential data access requires approval",
          severity: "error",
        },
      ],
      enabled: true,
      priority: 2,
      culturalCompliance: {
        islamicPrinciples: false,
        arabicContentHandling: false,
        governmentStandards: true,
      },
    };

    // Cultural Content Policy
    const culturalContentPolicy: SecurityPolicy = {
      id: "cultural-content",
      name: "Cultural Content Validation",
      rules: [
        {
          id: "inappropriate-content",
          type: "cultural",
          condition: "contains_inappropriate_content",
          action: "deny",
          message: "Content violates cultural standards",
          severity: "critical",
        },
        {
          id: "arabic-text-processing",
          type: "cultural",
          condition: "arabic_text_without_rtl",
          action: "log_and_continue",
          message: "Arabic text should use RTL formatting",
          severity: "warning",
        },
      ],
      enabled: true,
      priority: 3,
      culturalCompliance: {
        islamicPrinciples: true,
        arabicContentHandling: true,
        governmentStandards: true,
      },
    };

    this.policies.set(islamicCompliancePolicy.id, islamicCompliancePolicy);
    this.policies.set(ministryAccessPolicy.id, ministryAccessPolicy);
    this.policies.set(culturalContentPolicy.id, culturalContentPolicy);
  }

  /**
   * Validate security context and permissions for workflow execution
   */
  async validateWorkflowExecution(
    workflowId: string,
    context: SecurityContext,
    additionalData: IWorkflowExecuteAdditionalData,
  ): Promise<SecurityValidationResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    let requiresApproval = false;
    let culturalCompliance = true;

    try {
      // Validate session
      const sessionValidation = await this.validateSession(context);
      if (!sessionValidation.valid) {
        return {
          allowed: false,
          requiresApproval: false,
          riskLevel: "critical",
          issues: ["Invalid or expired session"],
          recommendations: ["Re-authenticate before executing workflow"],
          auditRequired: true,
          culturalCompliance: false,
        };
      }

      // Check role-based permissions
      const roleValidation = await this.validateRolePermissions(
        context,
        "workflow:execute",
      );
      if (!roleValidation.allowed) {
        issues.push("Insufficient role permissions for workflow execution");
        riskLevel = "high";
      }

      // Apply security policies
      for (const policy of this.policies.values()) {
        if (!policy.enabled) continue;

        const policyResult = await this.evaluatePolicy(policy, context, {
          workflowId,
        });

        if (!policyResult.allowed) {
          issues.push(`Policy violation: ${policy.name}`);
          riskLevel = this.escalateRiskLevel(riskLevel, "high");
        }

        if (policyResult.requiresApproval) {
          requiresApproval = true;
        }

        if (!policyResult.culturalCompliance) {
          culturalCompliance = false;
        }
      }

      // Ministry-specific validation
      if (context.ministry) {
        const ministryValidation = await this.validateMinistryRequirements(
          context,
          workflowId,
        );
        if (!ministryValidation.allowed) {
          issues.push(...ministryValidation.issues);
          recommendations.push(...ministryValidation.recommendations);
          riskLevel = this.escalateRiskLevel(
            riskLevel,
            ministryValidation.riskLevel,
          );
        }
      }

      // Time-based access validation
      const timeValidation = this.validateTimeBasedAccess(context);
      if (!timeValidation.allowed) {
        issues.push("Access outside allowed time window");
        recommendations.push("Schedule execution during allowed hours");
        riskLevel = this.escalateRiskLevel(riskLevel, "medium");
      }

      // Log security validation
      await this.logSecurityEvent(context, "workflow:validation", {
        workflowId,
        result: issues.length === 0 ? "success" : "blocked",
        riskLevel,
        culturalCompliance,
      });

      return {
        allowed: issues.length === 0,
        requiresApproval,
        riskLevel,
        issues,
        recommendations,
        auditRequired: true,
        culturalCompliance,
      };
    } catch (error) {
      await this.logSecurityEvent(context, "workflow:validation:error", {
        workflowId,
        error: error.message,
        result: "failure",
        riskLevel: "critical",
      });

      return {
        allowed: false,
        requiresApproval: false,
        riskLevel: "critical",
        issues: [`Security validation error: ${error.message}`],
        recommendations: ["Contact system administrator"],
        auditRequired: true,
        culturalCompliance: false,
      };
    }
  }

  /**
   * Validate node execution permissions
   */
  async validateNodeExecution(
    node: INode,
    context: SecurityContext,
  ): Promise<SecurityValidationResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    let culturalCompliance = true;

    // Check node-specific permissions
    const nodePermission = `node:${node.type}:execute`;
    const roleValidation = await this.validateRolePermissions(
      context,
      nodePermission,
    );

    if (!roleValidation.allowed) {
      issues.push(`No permission to execute node type: ${node.type}`);
      riskLevel = "high";
    }

    // Validate node cultural settings
    if (node.culturalSettings) {
      const culturalValidation = this.validateNodeCulturalSettings(
        node,
        context,
      );
      if (!culturalValidation.valid) {
        culturalCompliance = false;
        issues.push("Node cultural settings validation failed");
        recommendations.push("Review node cultural configuration");
      }
    }

    // Check for sensitive node types
    const sensitiveNodes = [
      "database",
      "file-system",
      "api-call",
      "email",
      "webhook",
    ];
    if (sensitiveNodes.includes(node.type)) {
      riskLevel = this.escalateRiskLevel(riskLevel, "medium");

      if (context.securityClearance === "basic") {
        issues.push(`Insufficient security clearance for ${node.type} node`);
        riskLevel = "high";
      }
    }

    await this.logSecurityEvent(context, "node:validation", {
      nodeId: node.id,
      nodeType: node.type,
      result: issues.length === 0 ? "success" : "blocked",
      riskLevel,
      culturalCompliance,
    });

    return {
      allowed: issues.length === 0,
      requiresApproval: false,
      riskLevel,
      issues,
      recommendations,
      auditRequired: riskLevel !== "low",
      culturalCompliance,
    };
  }

  /**
   * Validate session security
   */
  private async validateSession(
    context: SecurityContext,
  ): Promise<{ valid: boolean; reason?: string }> {
    const session = this.activeSessions.get(context.sessionId);

    if (!session) {
      return { valid: false, reason: "Session not found" };
    }

    // Check session expiry (8 hours for government systems)
    const sessionAge = Date.now() - session.timestamp.getTime();
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours

    if (sessionAge > maxAge) {
      this.activeSessions.delete(context.sessionId);
      return { valid: false, reason: "Session expired" };
    }

    // Validate IP consistency for security
    if (session.ipAddress !== context.ipAddress) {
      return { valid: false, reason: "IP address mismatch" };
    }

    return { valid: true };
  }

  /**
   * Validate role-based permissions
   */
  private async validateRolePermissions(
    context: SecurityContext,
    permission: string,
  ): Promise<{ allowed: boolean; reason?: string }> {
    for (const role of context.roles) {
      for (const perm of role.permissions) {
        if (this.matchesPermission(perm, permission)) {
          return { allowed: true };
        }
      }
    }

    return { allowed: false, reason: `No role has permission: ${permission}` };
  }

  /**
   * Check if permission matches required action
   */
  private matchesPermission(
    permission: SecurityPermission,
    required: string,
  ): boolean {
    const [resource, action] = required.split(":");

    if (permission.resource !== resource && permission.resource !== "*") {
      return false;
    }

    return (
      permission.actions.includes(action as any) ||
      permission.actions.includes("*" as any)
    );
  }

  /**
   * Evaluate security policy
   */
  private async evaluatePolicy(
    policy: SecurityPolicy,
    context: SecurityContext,
    data: any,
  ): Promise<{
    allowed: boolean;
    requiresApproval: boolean;
    culturalCompliance: boolean;
  }> {
    let allowed = true;
    let requiresApproval = false;
    let culturalCompliance = policy.culturalCompliance.islamicPrinciples;

    for (const rule of policy.rules) {
      const ruleResult = await this.evaluateRule(rule, context, data);

      if (ruleResult.action === "deny") {
        allowed = false;
      } else if (ruleResult.action === "require_approval") {
        requiresApproval = true;
      }

      if (rule.type === "cultural" && ruleResult.triggered) {
        culturalCompliance = false;
      }
    }

    return { allowed, requiresApproval, culturalCompliance };
  }

  /**
   * Evaluate individual security rule
   */
  private async evaluateRule(
    rule: SecurityRule,
    context: SecurityContext,
    data: any,
  ): Promise<{ triggered: boolean; action: string }> {
    // Simplified rule evaluation - in production, this would be more sophisticated
    let triggered = false;

    switch (rule.condition) {
      case "current_time_near_prayer":
        triggered = this.isNearPrayerTime();
        break;
      case "friday_prayer_time":
        triggered = this.isFridayPrayerTime();
        break;
      case "ramadan_iftar_time":
        triggered = this.isRamadanIftarTime();
        break;
      case "user_ministry != resource_ministry":
        triggered = context.ministry !== data.ministry;
        break;
      case "security_level >= confidential":
        triggered = this.hasHighSecurityLevel(data);
        break;
      case "contains_inappropriate_content":
        triggered = this.containsInappropriateContent(data);
        break;
      case "arabic_text_without_rtl":
        triggered = this.hasArabicWithoutRTL(data);
        break;
    }

    return { triggered, action: triggered ? rule.action : "allow" };
  }

  /**
   * Validate ministry-specific requirements
   */
  private async validateMinistryRequirements(
    context: SecurityContext,
    workflowId: string,
  ): Promise<SecurityValidationResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";

    const ministry = context.ministry;
    if (!ministry || !this.MINISTRY_REQUIREMENTS[ministry]) {
      return {
        allowed: true,
        requiresApproval: false,
        riskLevel: "low",
        issues: [],
        recommendations: [],
        auditRequired: false,
        culturalCompliance: true,
      };
    }

    const requirements = this.MINISTRY_REQUIREMENTS[ministry];

    // Check security clearance for ministry
    if (
      requirements.auditLevel === "comprehensive" &&
      context.securityClearance === "basic"
    ) {
      issues.push(
        `Insufficient security clearance for ${ministry} ministry operations`,
      );
      riskLevel = "high";
    }

    // Check cultural requirements compliance
    for (const culturalReq of requirements.culturalRequirements) {
      // This would integrate with cultural validation systems
      if (!this.validateCulturalRequirement(culturalReq, context)) {
        issues.push(`Cultural requirement not met: ${culturalReq}`);
        recommendations.push(
          `Ensure ${culturalReq} compliance before execution`,
        );
        riskLevel = this.escalateRiskLevel(riskLevel, "medium");
      }
    }

    return {
      allowed: issues.length === 0,
      requiresApproval: requirements.approvalRequired.length > 0,
      riskLevel,
      issues,
      recommendations,
      auditRequired: requirements.auditLevel !== "basic",
      culturalCompliance: issues.length === 0,
    };
  }

  /**
   * Validate time-based access restrictions
   */
  private validateTimeBasedAccess(context: SecurityContext): {
    allowed: boolean;
  } {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const currentDay = now.getDay();

    for (const role of context.roles) {
      if (role.restrictions?.timeBasedAccess) {
        const timeRestriction = role.restrictions.timeBasedAccess;

        // Check allowed hours
        if (timeRestriction.allowedHours) {
          const start = timeRestriction.allowedHours.start;
          const end = timeRestriction.allowedHours.end;

          if (currentTime < start || currentTime > end) {
            return { allowed: false };
          }
        }

        // Check Friday restrictions
        if (timeRestriction.excludeFriday && currentDay === 5) {
          return { allowed: false };
        }

        // Check prayer time restrictions
        if (timeRestriction.respectPrayerTimes && this.isNearPrayerTime()) {
          return { allowed: false };
        }
      }
    }

    return { allowed: true };
  }

  /**
   * Log security events for audit trail
   */
  private async logSecurityEvent(
    context: SecurityContext,
    action: string,
    details: any,
  ): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      userId: context.userId,
      action,
      resource: details.workflowId || details.nodeId || "system",
      ministry: context.ministry,
      result: details.result || "success",
      riskLevel: details.riskLevel || "low",
      details: {
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        executionId: details.executionId,
        workflowId: details.workflowId,
        nodeId: details.nodeId,
        errorMessage: details.error,
        culturalCompliance: details.culturalCompliance,
      },
      metadata: {
        sessionId: context.sessionId,
        requestId: this.generateId(),
        culturalContext: details.culturalCompliance
          ? "islamic_compliant"
          : "review_required",
      },
    };

    this.auditLog.push(auditEntry);
    this.emit("securityEvent", auditEntry);

    // Alert on high-risk events
    if (
      auditEntry.riskLevel === "high" ||
      auditEntry.riskLevel === "critical"
    ) {
      this.emit("securityAlert", auditEntry);
    }
  }

  /**
   * Helper methods for rule evaluation
   */
  private isNearPrayerTime(): boolean {
    // Simplified - would use actual prayer time calculation
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Prayer times for Baghdad (simplified)
    const prayerTimes = [
      { hour: 5, minute: 30 }, // Fajr
      { hour: 12, minute: 30 }, // Dhuhr
      { hour: 15, minute: 45 }, // Asr
      { hour: 18, minute: 15 }, // Maghrib
      { hour: 19, minute: 30 }, // Isha
    ];

    for (const prayer of prayerTimes) {
      const timeDiff = Math.abs(
        hour * 60 + minute - (prayer.hour * 60 + prayer.minute),
      );
      if (timeDiff <= 15) {
        // 15 minutes before/after
        return true;
      }
    }

    return false;
  }

  private isFridayPrayerTime(): boolean {
    const now = new Date();
    return now.getDay() === 5 && now.getHours() >= 11 && now.getHours() <= 14;
  }

  private isRamadanIftarTime(): boolean {
    // Simplified - would check actual Ramadan dates and Maghrib time
    const now = new Date();
    return (
      now.getHours() === 18 && now.getMinutes() >= 0 && now.getMinutes() <= 30
    );
  }

  private hasHighSecurityLevel(data: any): boolean {
    return (
      data.securityLevel === "confidential" || data.securityLevel === "secret"
    );
  }

  private containsInappropriateContent(data: any): boolean {
    // Simplified - would use comprehensive content filtering
    const content = JSON.stringify(data).toLowerCase();
    const inappropriate = ["gambling", "alcohol", "adult_content"];
    return inappropriate.some((term) => content.includes(term));
  }

  private hasArabicWithoutRTL(data: any): boolean {
    const content = JSON.stringify(data);
    const hasArabic = /[\u0600-\u06FF]/.test(content);
    const hasRTL = content.includes('dir="rtl"');
    return hasArabic && !hasRTL;
  }

  private validateCulturalRequirement(
    requirement: string,
    context: SecurityContext,
  ): boolean {
    // Simplified - would integrate with cultural validation systems
    return true;
  }

  private validateNodeCulturalSettings(
    node: INode,
    context: SecurityContext,
  ): { valid: boolean } {
    if (!node.culturalSettings) {
      return { valid: false };
    }

    return {
      valid: node.culturalSettings.islamicCompliant === true,
    };
  }

  private escalateRiskLevel(
    current: "low" | "medium" | "high" | "critical",
    new_level: "low" | "medium" | "high" | "critical",
  ): "low" | "medium" | "high" | "critical" {
    const levels = ["low", "medium", "high", "critical"];
    const currentIndex = levels.indexOf(current);
    const newIndex = levels.indexOf(new_level);
    return levels[Math.max(currentIndex, newIndex)] as any;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateEncryptionKey(): string {
    // In production, use proper key management
    return "iraqi-ai-system-encryption-key-" + Date.now();
  }

  private startAuditCleanup(): void {
    // Clean up old audit logs every 24 hours
    setInterval(
      () => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.auditRetentionDays);

        this.auditLog = this.auditLog.filter(
          (entry) => entry.timestamp > cutoffDate,
        );
      },
      24 * 60 * 60 * 1000,
    );
  }

  /**
   * Public API methods
   */

  /**
   * Create new user session
   */
  createSession(context: SecurityContext): string {
    const sessionId = this.generateId();
    this.activeSessions.set(sessionId, { ...context, sessionId });
    return sessionId;
  }

  /**
   * Invalidate user session
   */
  invalidateSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  /**
   * Get audit log entries
   */
  getAuditLog(filters?: {
    userId?: string;
    ministry?: string;
    riskLevel?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLogEntry[] {
    let filteredLog = [...this.auditLog];

    if (filters) {
      if (filters.userId) {
        filteredLog = filteredLog.filter(
          (entry) => entry.userId === filters.userId,
        );
      }
      if (filters.ministry) {
        filteredLog = filteredLog.filter(
          (entry) => entry.ministry === filters.ministry,
        );
      }
      if (filters.riskLevel) {
        filteredLog = filteredLog.filter(
          (entry) => entry.riskLevel === filters.riskLevel,
        );
      }
      if (filters.startDate) {
        filteredLog = filteredLog.filter(
          (entry) => entry.timestamp >= filters.startDate!,
        );
      }
      if (filters.endDate) {
        filteredLog = filteredLog.filter(
          (entry) => entry.timestamp <= filters.endDate!,
        );
      }
    }

    return filteredLog;
  }

  /**
   * Add security policy
   */
  addSecurityPolicy(policy: SecurityPolicy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Remove security policy
   */
  removeSecurityPolicy(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  /**
   * Get system security status
   */
  getSecurityStatus(): {
    activeSessions: number;
    auditLogSize: number;
    policiesCount: number;
    riskDistribution: { [key: string]: number };
  } {
    const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 };

    this.auditLog.forEach((entry) => {
      riskDistribution[entry.riskLevel]++;
    });

    return {
      activeSessions: this.activeSessions.size,
      auditLogSize: this.auditLog.length,
      policiesCount: this.policies.size,
      riskDistribution,
    };
  }
}
