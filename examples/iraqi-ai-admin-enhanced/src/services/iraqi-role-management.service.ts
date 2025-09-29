/**
 * Iraqi Admin Role Management Service
 *
 * Comprehensive role-based access control system designed for Iraqi organizations
 * with cultural compliance, professional domain expertise, and hierarchical structures.
 *
 * Features:
 * - 10 specialized Iraqi admin roles with cultural context
 * - Hierarchical permission inheritance
 * - Professional domain-specific access controls
 * - Cultural compliance validation for role assignments
 * - Audit logging with cultural impact assessment
 * - Arabic localization for all role descriptions
 * - Government/organizational structure alignment
 */

import { EventEmitter } from "events";

// Core Role Definitions
export enum IraqiAdminRole {
  SUPER_ADMIN = "super-admin",
  CULTURAL_VALIDATOR = "cultural-validator",
  ORGANIZATION_ADMIN = "organization-admin",
  DOMAIN_EXPERT = "domain-expert",
  SECURITY_OFFICER = "security-officer",
  CONTENT_MODERATOR = "content-moderator",
  USER_MANAGER = "user-manager",
  ANALYTICS_VIEWER = "analytics-viewer",
  SUPPORT_SPECIALIST = "support-specialist",
  VIEWER = "viewer",
}

// Permission Categories
export enum PermissionCategory {
  USER_MANAGEMENT = "user-management",
  CONTENT_MANAGEMENT = "content-management",
  CULTURAL_VALIDATION = "cultural-validation",
  SYSTEM_CONFIGURATION = "system-configuration",
  SECURITY_MANAGEMENT = "security-management",
  ANALYTICS_ACCESS = "analytics-access",
  PROFESSIONAL_DOMAINS = "professional-domains",
  ORGANIZATION_MANAGEMENT = "organization-management",
  AUDIT_ACCESS = "audit-access",
  SUPPORT_OPERATIONS = "support-operations",
}

// Professional Domains for Domain Expert Role
export enum ProfessionalDomain {
  LEGAL = "legal",
  MEDICAL = "medical",
  EDUCATIONAL = "educational",
  ENGINEERING = "engineering",
  BUSINESS = "business",
  GOVERNMENT = "government",
  RELIGIOUS = "religious",
  CULTURAL = "cultural",
}

// Iraqi Governorates for Regional Management
export enum IraqiGovernorate {
  BAGHDAD = "baghdad",
  BASRA = "basra",
  MOSUL = "mosul",
  ERBIL = "erbil",
  NAJAF = "najaf",
  KARBALA = "karbala",
  HILLAH = "hillah",
  RAMADI = "ramadi",
  KIRKUK = "kirkuk",
  DOHUK = "dohuk",
  SAMARRA = "samarra",
  KUT = "kut",
  AMARAH = "amarah",
  NASIRIYAH = "nasiriyah",
  DIWANIYAH = "diwaniyah",
  TIKRIT = "tikrit",
  HALABJA = "halabja",
  SULAYMANIYAH = "sulaymaniyah",
}

// Specific Permissions
export interface Permission {
  id: string;
  category: PermissionCategory;
  action: string;
  resource: string;
  description: string;
  descriptionAr: string;
  culturalContext?: string;
  professionalDomain?: ProfessionalDomain;
  securityLevel: "public" | "restricted" | "confidential" | "secret";
}

// Role Definition
export interface RoleDefinition {
  role: IraqiAdminRole;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  hierarchy: number; // 1-10, 1 being highest authority
  permissions: Permission[];
  culturalRequirements: CulturalRequirement[];
  professionalDomains?: ProfessionalDomain[];
  governorateRestrictions?: IraqiGovernorate[];
  inheritsFrom?: IraqiAdminRole[];
}

// Cultural Requirements
export interface CulturalRequirement {
  type:
    | "islamic-knowledge"
    | "arabic-fluency"
    | "cultural-sensitivity"
    | "professional-ethics";
  level: "basic" | "intermediate" | "advanced" | "expert";
  description: string;
  descriptionAr: string;
  validationRequired: boolean;
}

// Role Assignment
export interface RoleAssignment {
  userId: string;
  role: IraqiAdminRole;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  governorateRestriction?: IraqiGovernorate;
  professionalDomainRestriction?: ProfessionalDomain;
  culturalValidationScore: number; // 0-100
  isActive: boolean;
  assignments: {
    permissions: string[];
    restrictions: string[];
    culturalContext: string;
  };
}

// Permission Check Result
export interface PermissionCheckResult {
  hasPermission: boolean;
  role: IraqiAdminRole;
  permission: string;
  reason: string;
  culturalCompliance: boolean;
  securityClearance: boolean;
  auditEntry: AuditEntry;
}

// Audit Entry
export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  result: "granted" | "denied";
  reason: string;
  culturalImpact: "low" | "medium" | "high";
  securityLevel: string;
  governorate?: IraqiGovernorate;
  professionalDomain?: ProfessionalDomain;
}

export class IraqiRoleManagementService extends EventEmitter {
  private roleDefinitions: Map<IraqiAdminRole, RoleDefinition> = new Map();
  private userRoles: Map<string, RoleAssignment[]> = new Map();
  private auditLog: AuditEntry[] = [];
  private culturalValidator: any; // Integration with cultural validation service

  constructor() {
    super();
    this.initializeRoleDefinitions();
  }

  private initializeRoleDefinitions(): void {
    // Super Admin - Highest Authority
    this.roleDefinitions.set(IraqiAdminRole.SUPER_ADMIN, {
      role: IraqiAdminRole.SUPER_ADMIN,
      name: "Super Administrator",
      nameAr: "المدير العام",
      description:
        "Complete system control with cultural oversight responsibility",
      descriptionAr: "السيطرة الكاملة على النظام مع مسؤولية الإشراف الثقافي",
      hierarchy: 1,
      permissions: this.getAllPermissions(),
      culturalRequirements: [
        {
          type: "islamic-knowledge",
          level: "expert",
          description: "Deep understanding of Islamic principles and values",
          descriptionAr: "فهم عميق للمبادئ والقيم الإسلامية",
          validationRequired: true,
        },
        {
          type: "arabic-fluency",
          level: "expert",
          description:
            "Native or near-native Arabic fluency with Iraqi dialect knowledge",
          descriptionAr:
            "طلاقة عربية أصلية أو شبه أصلية مع معرفة اللهجة العراقية",
          validationRequired: true,
        },
        {
          type: "cultural-sensitivity",
          level: "expert",
          description:
            "Expert knowledge of Iraqi cultural norms and sensitivities",
          descriptionAr: "معرفة خبيرة بالأعراف والحساسيات الثقافية العراقية",
          validationRequired: true,
        },
      ],
    });

    // Cultural Validator - Islamic and Cultural Compliance
    this.roleDefinitions.set(IraqiAdminRole.CULTURAL_VALIDATOR, {
      role: IraqiAdminRole.CULTURAL_VALIDATOR,
      name: "Cultural Compliance Validator",
      nameAr: "مدقق الامتثال الثقافي",
      description:
        "Validates content and features for Islamic values and cultural appropriateness",
      descriptionAr:
        "يصادق على المحتوى والميزات للقيم الإسلامية والملاءمة الثقافية",
      hierarchy: 2,
      permissions: [
        {
          id: "cultural-validate",
          category: PermissionCategory.CULTURAL_VALIDATION,
          action: "validate",
          resource: "content",
          description: "Validate content for cultural and Islamic compliance",
          descriptionAr: "التحقق من المحتوى للامتثال الثقافي والإسلامي",
          securityLevel: "restricted",
        },
        {
          id: "cultural-approve",
          category: PermissionCategory.CULTURAL_VALIDATION,
          action: "approve",
          resource: "features",
          description: "Approve new features for cultural compliance",
          descriptionAr: "الموافقة على الميزات الجديدة للامتثال الثقافي",
          securityLevel: "restricted",
        },
        {
          id: "cultural-report",
          category: PermissionCategory.CULTURAL_VALIDATION,
          action: "generate",
          resource: "compliance-reports",
          description: "Generate cultural compliance reports",
          descriptionAr: "إنشاء تقارير الامتثال الثقافي",
          securityLevel: "confidential",
        },
      ],
      culturalRequirements: [
        {
          type: "islamic-knowledge",
          level: "expert",
          description:
            "Scholarly knowledge of Islamic jurisprudence and ethics",
          descriptionAr: "معرفة علمية بالفقه الإسلامي والأخلاق",
          validationRequired: true,
        },
        {
          type: "cultural-sensitivity",
          level: "expert",
          description: "Deep understanding of Iraqi cultural nuances",
          descriptionAr: "فهم عميق للفروق الثقافية العراقية الدقيقة",
          validationRequired: true,
        },
      ],
    });

    // Organization Admin - Organizational Management
    this.roleDefinitions.set(IraqiAdminRole.ORGANIZATION_ADMIN, {
      role: IraqiAdminRole.ORGANIZATION_ADMIN,
      name: "Organization Administrator",
      nameAr: "مدير المؤسسة",
      description:
        "Manages organizational structure, departments, and regional operations",
      descriptionAr: "يدير الهيكل التنظيمي والأقسام والعمليات الإقليمية",
      hierarchy: 3,
      permissions: [
        {
          id: "org-manage",
          category: PermissionCategory.ORGANIZATION_MANAGEMENT,
          action: "manage",
          resource: "organizations",
          description: "Create and manage organizational structures",
          descriptionAr: "إنشاء وإدارة الهياكل التنظيمية",
          securityLevel: "restricted",
        },
        {
          id: "dept-manage",
          category: PermissionCategory.ORGANIZATION_MANAGEMENT,
          action: "manage",
          resource: "departments",
          description: "Manage departmental structures and assignments",
          descriptionAr: "إدارة الهياكل القسمية والتعيينات",
          securityLevel: "restricted",
        },
        {
          id: "user-assign",
          category: PermissionCategory.USER_MANAGEMENT,
          action: "assign",
          resource: "roles",
          description: "Assign roles to users within organization",
          descriptionAr: "تعيين الأدوار للمستخدمين داخل المؤسسة",
          securityLevel: "restricted",
        },
      ],
      culturalRequirements: [
        {
          type: "professional-ethics",
          level: "advanced",
          description: "Strong understanding of Iraqi professional ethics",
          descriptionAr: "فهم قوي لأخلاقيات المهنة العراقية",
          validationRequired: true,
        },
      ],
    });

    // Domain Expert - Professional Domain Specialist
    this.roleDefinitions.set(IraqiAdminRole.DOMAIN_EXPERT, {
      role: IraqiAdminRole.DOMAIN_EXPERT,
      name: "Professional Domain Expert",
      nameAr: "خبير المجال المهني",
      description:
        "Subject matter expert for specific professional domains (legal, medical, etc.)",
      descriptionAr:
        "خبير موضوعي للمجالات المهنية المحددة (قانونية، طبية، إلخ)",
      hierarchy: 4,
      permissions: [
        {
          id: "domain-validate",
          category: PermissionCategory.PROFESSIONAL_DOMAINS,
          action: "validate",
          resource: "domain-content",
          description: "Validate content for professional domain accuracy",
          descriptionAr: "التحقق من المحتوى لدقة المجال المهني",
          securityLevel: "restricted",
        },
        {
          id: "domain-consult",
          category: PermissionCategory.PROFESSIONAL_DOMAINS,
          action: "provide",
          resource: "consultation",
          description: "Provide professional domain consultation",
          descriptionAr: "تقديم استشارات المجال المهني",
          securityLevel: "public",
        },
      ],
      professionalDomains: Object.values(ProfessionalDomain),
      culturalRequirements: [
        {
          type: "professional-ethics",
          level: "expert",
          description: "Expert knowledge of professional ethics and standards",
          descriptionAr: "معرفة خبيرة بأخلاقيات ومعايير المهنة",
          validationRequired: true,
        },
      ],
    });

    // Security Officer - System Security Management
    this.roleDefinitions.set(IraqiAdminRole.SECURITY_OFFICER, {
      role: IraqiAdminRole.SECURITY_OFFICER,
      name: "Security Officer",
      nameAr: "ضابط الأمن",
      description:
        "Manages system security, access controls, and threat monitoring",
      descriptionAr: "يدير أمان النظام وضوابط الوصول ومراقبة التهديدات",
      hierarchy: 3,
      permissions: [
        {
          id: "security-config",
          category: PermissionCategory.SECURITY_MANAGEMENT,
          action: "configure",
          resource: "security-settings",
          description: "Configure system security settings",
          descriptionAr: "تكوين إعدادات أمان النظام",
          securityLevel: "secret",
        },
        {
          id: "audit-access",
          category: PermissionCategory.AUDIT_ACCESS,
          action: "access",
          resource: "audit-logs",
          description: "Access and analyze system audit logs",
          descriptionAr: "الوصول إلى وتحليل سجلات التدقيق",
          securityLevel: "confidential",
        },
        {
          id: "threat-monitor",
          category: PermissionCategory.SECURITY_MANAGEMENT,
          action: "monitor",
          resource: "threats",
          description: "Monitor and respond to security threats",
          descriptionAr: "مراقبة والاستجابة للتهديدات الأمنية",
          securityLevel: "secret",
        },
      ],
      culturalRequirements: [
        {
          type: "professional-ethics",
          level: "expert",
          description: "Highest standards of professional ethics and integrity",
          descriptionAr: "أعلى معايير الأخلاق المهنية والنزاهة",
          validationRequired: true,
        },
      ],
    });

    // Content Moderator - Content Management and Moderation
    this.roleDefinitions.set(IraqiAdminRole.CONTENT_MODERATOR, {
      role: IraqiAdminRole.CONTENT_MODERATOR,
      name: "Content Moderator",
      nameAr: "مشرف المحتوى",
      description:
        "Moderates user content for appropriateness and cultural compliance",
      descriptionAr: "يشرف على محتوى المستخدم للملاءمة والامتثال الثقافي",
      hierarchy: 5,
      permissions: [
        {
          id: "content-moderate",
          category: PermissionCategory.CONTENT_MANAGEMENT,
          action: "moderate",
          resource: "user-content",
          description: "Moderate user-generated content",
          descriptionAr: "الإشراف على المحتوى المُنشأ من المستخدمين",
          securityLevel: "restricted",
        },
        {
          id: "content-flag",
          category: PermissionCategory.CONTENT_MANAGEMENT,
          action: "flag",
          resource: "inappropriate-content",
          description: "Flag inappropriate or non-compliant content",
          descriptionAr: "وضع علامة على المحتوى غير المناسب أو غير المتوافق",
          securityLevel: "public",
        },
      ],
      culturalRequirements: [
        {
          type: "cultural-sensitivity",
          level: "advanced",
          description: "Strong cultural sensitivity and judgment",
          descriptionAr: "حساسية ثقافية قوية وحكم سليم",
          validationRequired: true,
        },
        {
          type: "islamic-knowledge",
          level: "intermediate",
          description: "Good understanding of Islamic values and ethics",
          descriptionAr: "فهم جيد للقيم والأخلاق الإسلامية",
          validationRequired: true,
        },
      ],
    });

    // User Manager - User Account Management
    this.roleDefinitions.set(IraqiAdminRole.USER_MANAGER, {
      role: IraqiAdminRole.USER_MANAGER,
      name: "User Manager",
      nameAr: "مدير المستخدمين",
      description:
        "Manages user accounts, profiles, and basic access permissions",
      descriptionAr:
        "يدير حسابات المستخدمين والملفات الشخصية وأذونات الوصول الأساسية",
      hierarchy: 6,
      permissions: [
        {
          id: "user-create",
          category: PermissionCategory.USER_MANAGEMENT,
          action: "create",
          resource: "users",
          description: "Create new user accounts",
          descriptionAr: "إنشاء حسابات مستخدمين جديدة",
          securityLevel: "restricted",
        },
        {
          id: "user-edit",
          category: PermissionCategory.USER_MANAGEMENT,
          action: "edit",
          resource: "user-profiles",
          description: "Edit user profiles and basic information",
          descriptionAr: "تحرير ملفات المستخدمين والمعلومات الأساسية",
          securityLevel: "restricted",
        },
        {
          id: "user-deactivate",
          category: PermissionCategory.USER_MANAGEMENT,
          action: "deactivate",
          resource: "users",
          description: "Deactivate user accounts",
          descriptionAr: "إلغاء تفعيل حسابات المستخدمين",
          securityLevel: "restricted",
        },
      ],
      culturalRequirements: [
        {
          type: "professional-ethics",
          level: "intermediate",
          description: "Understanding of privacy and professional ethics",
          descriptionAr: "فهم الخصوصية والأخلاق المهنية",
          validationRequired: false,
        },
      ],
    });

    // Analytics Viewer - Data and Analytics Access
    this.roleDefinitions.set(IraqiAdminRole.ANALYTICS_VIEWER, {
      role: IraqiAdminRole.ANALYTICS_VIEWER,
      name: "Analytics Viewer",
      nameAr: "عارض التحليلات",
      description: "Views system analytics, reports, and performance metrics",
      descriptionAr: "يعرض تحليلات النظام والتقارير ومقاييس الأداء",
      hierarchy: 7,
      permissions: [
        {
          id: "analytics-view",
          category: PermissionCategory.ANALYTICS_ACCESS,
          action: "view",
          resource: "analytics",
          description: "View system analytics and reports",
          descriptionAr: "عرض تحليلات وتقارير النظام",
          securityLevel: "restricted",
        },
        {
          id: "metrics-export",
          category: PermissionCategory.ANALYTICS_ACCESS,
          action: "export",
          resource: "metrics",
          description: "Export metrics and reports",
          descriptionAr: "تصدير المقاييس والتقارير",
          securityLevel: "restricted",
        },
      ],
      culturalRequirements: [],
    });

    // Support Specialist - User Support Operations
    this.roleDefinitions.set(IraqiAdminRole.SUPPORT_SPECIALIST, {
      role: IraqiAdminRole.SUPPORT_SPECIALIST,
      name: "Support Specialist",
      nameAr: "أخصائي الدعم",
      description:
        "Provides user support and assistance with cultural sensitivity",
      descriptionAr: "يقدم دعم ومساعدة المستخدمين مع الحساسية الثقافية",
      hierarchy: 8,
      permissions: [
        {
          id: "support-assist",
          category: PermissionCategory.SUPPORT_OPERATIONS,
          action: "assist",
          resource: "users",
          description: "Provide user support and assistance",
          descriptionAr: "تقديم دعم ومساعدة المستخدمين",
          securityLevel: "public",
        },
        {
          id: "support-escalate",
          category: PermissionCategory.SUPPORT_OPERATIONS,
          action: "escalate",
          resource: "issues",
          description: "Escalate complex issues to higher authorities",
          descriptionAr: "تصعيد القضايا المعقدة إلى السلطات العليا",
          securityLevel: "restricted",
        },
      ],
      culturalRequirements: [
        {
          type: "arabic-fluency",
          level: "advanced",
          description: "Strong Arabic communication skills",
          descriptionAr: "مهارات تواصل عربية قوية",
          validationRequired: true,
        },
        {
          type: "cultural-sensitivity",
          level: "intermediate",
          description: "Cultural sensitivity in user interactions",
          descriptionAr: "حساسية ثقافية في تفاعلات المستخدمين",
          validationRequired: false,
        },
      ],
    });

    // Viewer - Read-Only Access
    this.roleDefinitions.set(IraqiAdminRole.VIEWER, {
      role: IraqiAdminRole.VIEWER,
      name: "Viewer",
      nameAr: "مشاهد",
      description:
        "Read-only access to basic system information and public content",
      descriptionAr: "وصول للقراءة فقط لمعلومات النظام الأساسية والمحتوى العام",
      hierarchy: 10,
      permissions: [
        {
          id: "system-view",
          category: PermissionCategory.ANALYTICS_ACCESS,
          action: "view",
          resource: "public-info",
          description: "View basic system information",
          descriptionAr: "عرض معلومات النظام الأساسية",
          securityLevel: "public",
        },
      ],
      culturalRequirements: [],
    });
  }

  private getAllPermissions(): Permission[] {
    const allPermissions: Permission[] = [];

    // Collect all permissions from all roles
    for (const [, roleDefinition] of this.roleDefinitions) {
      allPermissions.push(...roleDefinition.permissions);
    }

    // Add super admin specific permissions
    allPermissions.push(
      {
        id: "system-control",
        category: PermissionCategory.SYSTEM_CONFIGURATION,
        action: "control",
        resource: "entire-system",
        description: "Complete system control and configuration",
        descriptionAr: "السيطرة والتحكم الكامل بالنظام",
        securityLevel: "secret",
      },
      {
        id: "role-assign-all",
        category: PermissionCategory.USER_MANAGEMENT,
        action: "assign",
        resource: "all-roles",
        description: "Assign any role to any user",
        descriptionAr: "تعيين أي دور لأي مستخدم",
        securityLevel: "secret",
      },
    );

    return allPermissions;
  }

  // Role Assignment Methods
  public async assignRole(
    userId: string,
    role: IraqiAdminRole,
    assignedBy: string,
    options: {
      expiresAt?: Date;
      governorateRestriction?: IraqiGovernorate;
      professionalDomainRestriction?: ProfessionalDomain;
    } = {},
  ): Promise<RoleAssignment> {
    // Validate cultural requirements
    const culturalScore = await this.validateCulturalRequirements(userId, role);

    if (culturalScore < 70) {
      throw new Error(
        `Cultural validation failed for role ${role}. Score: ${culturalScore}`,
      );
    }

    const assignment: RoleAssignment = {
      userId,
      role,
      assignedBy,
      assignedAt: new Date(),
      expiresAt: options.expiresAt,
      governorateRestriction: options.governorateRestriction,
      professionalDomainRestriction: options.professionalDomainRestriction,
      culturalValidationScore: culturalScore,
      isActive: true,
      assignments: {
        permissions: this.getRolePermissions(role).map((p) => p.id),
        restrictions: [],
        culturalContext: this.getCulturalContextForRole(role),
      },
    };

    // Store assignment
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, []);
    }
    this.userRoles.get(userId)!.push(assignment);

    // Log assignment
    this.logAuditEntry({
      id: `role-assign-${Date.now()}`,
      timestamp: new Date(),
      userId: assignedBy,
      action: "assign-role",
      resource: `role:${role}`,
      result: "granted",
      reason: `Role ${role} assigned to user ${userId}`,
      culturalImpact: this.getCulturalImpact(role),
      securityLevel: this.getSecurityLevel(role),
      governorate: options.governorateRestriction,
      professionalDomain: options.professionalDomainRestriction,
    });

    this.emit("roleAssigned", { userId, role, assignment });
    return assignment;
  }

  public revokeRole(
    userId: string,
    role: IraqiAdminRole,
    revokedBy: string,
  ): boolean {
    const userRoles = this.userRoles.get(userId);
    if (!userRoles) return false;

    const roleIndex = userRoles.findIndex((r) => r.role === role && r.isActive);
    if (roleIndex === -1) return false;

    userRoles[roleIndex].isActive = false;

    this.logAuditEntry({
      id: `role-revoke-${Date.now()}`,
      timestamp: new Date(),
      userId: revokedBy,
      action: "revoke-role",
      resource: `role:${role}`,
      result: "granted",
      reason: `Role ${role} revoked from user ${userId}`,
      culturalImpact: this.getCulturalImpact(role),
      securityLevel: this.getSecurityLevel(role),
    });

    this.emit("roleRevoked", { userId, role, revokedBy });
    return true;
  }

  // Permission Checking
  public checkPermission(
    userId: string,
    permissionId: string,
    resource?: string,
    context?: {
      governorate?: IraqiGovernorate;
      professionalDomain?: ProfessionalDomain;
    },
  ): PermissionCheckResult {
    const userRoles = this.getUserActiveRoles(userId);

    for (const roleAssignment of userRoles) {
      const roleDefinition = this.roleDefinitions.get(roleAssignment.role);
      if (!roleDefinition) continue;

      const hasPermission = roleDefinition.permissions.some(
        (p) => p.id === permissionId,
      );
      if (hasPermission) {
        // Check governorate restriction
        if (
          roleAssignment.governorateRestriction &&
          context?.governorate &&
          roleAssignment.governorateRestriction !== context.governorate
        ) {
          continue;
        }

        // Check professional domain restriction
        if (
          roleAssignment.professionalDomainRestriction &&
          context?.professionalDomain &&
          roleAssignment.professionalDomainRestriction !==
            context.professionalDomain
        ) {
          continue;
        }

        const auditEntry: AuditEntry = {
          id: `perm-check-${Date.now()}`,
          timestamp: new Date(),
          userId,
          action: "check-permission",
          resource: resource || "unknown",
          result: "granted",
          reason: `Permission ${permissionId} granted via role ${roleAssignment.role}`,
          culturalImpact: "low",
          securityLevel: this.getPermissionSecurityLevel(permissionId),
          governorate: context?.governorate,
          professionalDomain: context?.professionalDomain,
        };

        this.logAuditEntry(auditEntry);

        return {
          hasPermission: true,
          role: roleAssignment.role,
          permission: permissionId,
          reason: `Granted via role ${roleAssignment.role}`,
          culturalCompliance: roleAssignment.culturalValidationScore >= 70,
          securityClearance: true,
          auditEntry,
        };
      }
    }

    const auditEntry: AuditEntry = {
      id: `perm-deny-${Date.now()}`,
      timestamp: new Date(),
      userId,
      action: "check-permission",
      resource: resource || "unknown",
      result: "denied",
      reason: `Permission ${permissionId} not found in user roles`,
      culturalImpact: "low",
      securityLevel: "public",
    };

    this.logAuditEntry(auditEntry);

    return {
      hasPermission: false,
      role: IraqiAdminRole.VIEWER,
      permission: permissionId,
      reason: "Permission not granted by any assigned role",
      culturalCompliance: false,
      securityClearance: false,
      auditEntry,
    };
  }

  // Role Information Methods
  public getRoleDefinition(role: IraqiAdminRole): RoleDefinition | undefined {
    return this.roleDefinitions.get(role);
  }

  public getRolePermissions(role: IraqiAdminRole): Permission[] {
    const roleDefinition = this.roleDefinitions.get(role);
    return roleDefinition?.permissions || [];
  }

  public getUserRoles(userId: string): RoleAssignment[] {
    return this.userRoles.get(userId) || [];
  }

  public getUserActiveRoles(userId: string): RoleAssignment[] {
    const roles = this.userRoles.get(userId) || [];
    return roles.filter(
      (r) => r.isActive && (!r.expiresAt || r.expiresAt > new Date()),
    );
  }

  // Cultural Validation
  private async validateCulturalRequirements(
    userId: string,
    role: IraqiAdminRole,
  ): Promise<number> {
    const roleDefinition = this.roleDefinitions.get(role);
    if (!roleDefinition || roleDefinition.culturalRequirements.length === 0) {
      return 100; // No requirements
    }

    // This would integrate with the cultural validation service
    // For now, we'll simulate validation
    let totalScore = 0;
    let totalWeight = 0;

    for (const requirement of roleDefinition.culturalRequirements) {
      const weight = this.getCulturalRequirementWeight(
        requirement.type,
        requirement.level,
      );
      const score = await this.mockValidateCulturalRequirement(
        userId,
        requirement,
      );

      totalScore += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 100;
  }

  private getCulturalRequirementWeight(type: string, level: string): number {
    const typeWeights = {
      "islamic-knowledge": 4,
      "arabic-fluency": 3,
      "cultural-sensitivity": 3,
      "professional-ethics": 2,
    };

    const levelMultipliers = {
      basic: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };

    return (typeWeights[type] || 2) * (levelMultipliers[level] || 1);
  }

  private async mockValidateCulturalRequirement(
    userId: string,
    requirement: CulturalRequirement,
  ): Promise<number> {
    // Mock validation - in real implementation, this would check user's cultural validation scores
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  }

  private getCulturalContextForRole(role: IraqiAdminRole): string {
    const contexts = {
      [IraqiAdminRole.SUPER_ADMIN]:
        "Full cultural oversight and responsibility",
      [IraqiAdminRole.CULTURAL_VALIDATOR]:
        "Islamic and cultural compliance focus",
      [IraqiAdminRole.ORGANIZATION_ADMIN]: "Organizational cultural alignment",
      [IraqiAdminRole.DOMAIN_EXPERT]: "Professional domain cultural context",
      [IraqiAdminRole.SECURITY_OFFICER]: "Security with cultural awareness",
      [IraqiAdminRole.CONTENT_MODERATOR]: "Content cultural appropriateness",
      [IraqiAdminRole.USER_MANAGER]: "User interaction cultural sensitivity",
      [IraqiAdminRole.ANALYTICS_VIEWER]: "Data interpretation cultural context",
      [IraqiAdminRole.SUPPORT_SPECIALIST]: "User support cultural sensitivity",
      [IraqiAdminRole.VIEWER]: "Basic cultural awareness",
    };

    return contexts[role] || "General cultural awareness";
  }

  private getCulturalImpact(role: IraqiAdminRole): "low" | "medium" | "high" {
    const highImpactRoles = [
      IraqiAdminRole.SUPER_ADMIN,
      IraqiAdminRole.CULTURAL_VALIDATOR,
    ];
    const mediumImpactRoles = [
      IraqiAdminRole.ORGANIZATION_ADMIN,
      IraqiAdminRole.DOMAIN_EXPERT,
      IraqiAdminRole.CONTENT_MODERATOR,
    ];

    if (highImpactRoles.includes(role)) return "high";
    if (mediumImpactRoles.includes(role)) return "medium";
    return "low";
  }

  private getSecurityLevel(role: IraqiAdminRole): string {
    const securityLevels = {
      [IraqiAdminRole.SUPER_ADMIN]: "secret",
      [IraqiAdminRole.SECURITY_OFFICER]: "secret",
      [IraqiAdminRole.CULTURAL_VALIDATOR]: "confidential",
      [IraqiAdminRole.ORGANIZATION_ADMIN]: "restricted",
      [IraqiAdminRole.DOMAIN_EXPERT]: "restricted",
      [IraqiAdminRole.CONTENT_MODERATOR]: "restricted",
      [IraqiAdminRole.USER_MANAGER]: "restricted",
      [IraqiAdminRole.ANALYTICS_VIEWER]: "restricted",
      [IraqiAdminRole.SUPPORT_SPECIALIST]: "public",
      [IraqiAdminRole.VIEWER]: "public",
    };

    return securityLevels[role] || "public";
  }

  private getPermissionSecurityLevel(permissionId: string): string {
    // In real implementation, this would look up the permission and return its security level
    return "restricted";
  }

  private logAuditEntry(entry: AuditEntry): void {
    this.auditLog.push(entry);

    // Keep only last 10000 entries
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }

    this.emit("auditEntry", entry);
  }

  // Utility Methods
  public getAllRoles(): IraqiAdminRole[] {
    return Object.values(IraqiAdminRole);
  }

  public getRoleHierarchy(): {
    role: IraqiAdminRole;
    hierarchy: number;
    name: string;
    nameAr: string;
  }[] {
    const roles = [];
    for (const [role, definition] of this.roleDefinitions) {
      roles.push({
        role,
        hierarchy: definition.hierarchy,
        name: definition.name,
        nameAr: definition.nameAr,
      });
    }
    return roles.sort((a, b) => a.hierarchy - b.hierarchy);
  }

  public getAuditLog(filters?: {
    userId?: string;
    action?: string;
    result?: "granted" | "denied";
    culturalImpact?: "low" | "medium" | "high";
    limit?: number;
  }): AuditEntry[] {
    let filtered = [...this.auditLog];

    if (filters) {
      if (filters.userId) {
        filtered = filtered.filter((entry) => entry.userId === filters.userId);
      }
      if (filters.action) {
        filtered = filtered.filter((entry) => entry.action === filters.action);
      }
      if (filters.result) {
        filtered = filtered.filter((entry) => entry.result === filters.result);
      }
      if (filters.culturalImpact) {
        filtered = filtered.filter(
          (entry) => entry.culturalImpact === filters.culturalImpact,
        );
      }
    }

    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, filters?.limit || 1000);
  }

  // Localization Methods
  public getRoleNameInArabic(role: IraqiAdminRole): string {
    const definition = this.roleDefinitions.get(role);
    return definition?.nameAr || role;
  }

  public getGovernorateNameInArabic(governorate: IraqiGovernorate): string {
    const arabicNames = {
      [IraqiGovernorate.BAGHDAD]: "بغداد",
      [IraqiGovernorate.BASRA]: "البصرة",
      [IraqiGovernorate.MOSUL]: "الموصل",
      [IraqiGovernorate.ERBIL]: "أربيل",
      [IraqiGovernorate.NAJAF]: "النجف",
      [IraqiGovernorate.KARBALA]: "كربلاء",
      [IraqiGovernorate.HILLAH]: "الحلة",
      [IraqiGovernorate.RAMADI]: "الرمادي",
      [IraqiGovernorate.KIRKUK]: "كركوك",
      [IraqiGovernorate.DOHUK]: "دهوك",
      [IraqiGovernorate.SAMARRA]: "سامراء",
      [IraqiGovernorate.KUT]: "الكوت",
      [IraqiGovernorate.AMARAH]: "العمارة",
      [IraqiGovernorate.NASIRIYAH]: "الناصرية",
      [IraqiGovernorate.DIWANIYAH]: "الديوانية",
      [IraqiGovernorate.TIKRIT]: "تكريت",
      [IraqiGovernorate.HALABJA]: "حلبجة",
      [IraqiGovernorate.SULAYMANIYAH]: "السليمانية",
    };

    return arabicNames[governorate] || governorate;
  }

  public getProfessionalDomainNameInArabic(domain: ProfessionalDomain): string {
    const arabicNames = {
      [ProfessionalDomain.LEGAL]: "قانوني",
      [ProfessionalDomain.MEDICAL]: "طبي",
      [ProfessionalDomain.EDUCATIONAL]: "تعليمي",
      [ProfessionalDomain.ENGINEERING]: "هندسي",
      [ProfessionalDomain.BUSINESS]: "تجاري",
      [ProfessionalDomain.GOVERNMENT]: "حكومي",
      [ProfessionalDomain.RELIGIOUS]: "ديني",
      [ProfessionalDomain.CULTURAL]: "ثقافي",
    };

    return arabicNames[domain] || domain;
  }
}

export default IraqiRoleManagementService;
