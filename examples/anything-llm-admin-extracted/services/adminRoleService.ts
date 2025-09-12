/**
 * Iraqi AI Admin Role Service
 * Manages Iraqi-specific admin roles, permissions, and cultural compliance
 * 
 * Features:
 * - Role-based access control with Iraqi professional domains
 * - Cultural compliance permission management
 * - Islamic compliance validation
 * - Professional domain expertise tracking
 * - Organizational hierarchy support
 */

import { 
  UserRole, 
  AdminPermissions, 
  OrganizationPermissions, 
  CulturalValidationPermissions,
  ProfessionalDomainPermissions,
  IraqiUser,
  IraqiOrganization,
  ProfessionalDomain,
  CulturalComplianceLevel
} from '../types/admin';

/**
 * Default permissions for each Iraqi admin role
 */
export const IRAQI_ROLE_PERMISSIONS: Record<UserRole, Partial<AdminPermissions>> = {
  'super-admin': {
    // Full system access
    systemManagement: true,
    userManagement: true,
    workspaceManagement: true,
    settingsManagement: true,
    contentModeration: true,
    culturalValidation: true,
    documentManagement: true,
    knowledgeBaseManagement: true,
    analyticsAccess: true,
    auditLogAccess: true,
    performanceMetrics: true,
    complianceReports: true,
    professionalDomainAccess: ['legal', 'medical', 'educational', 'business', 'engineering', 'government', 'general'],
    domainSpecificSettings: true,
    islamicComplianceSettings: true,
    culturalContentReview: true,
    politicalNeutralityMonitoring: true,
    apiKeyManagement: true,
    integrationManagement: true,
    paymentGatewaySettings: true,
    securitySettings: true,
    accessControlManagement: true,
    dataProtectionSettings: true
  },

  'organization-admin': {
    // Organization-level management
    userManagement: true,
    workspaceManagement: true,
    contentModeration: true,
    documentManagement: true,
    knowledgeBaseManagement: true,
    analyticsAccess: true,
    auditLogAccess: true,
    complianceReports: true,
    professionalDomainAccess: [], // Set per organization
    domainSpecificSettings: true,
    culturalContentReview: true,
    paymentGatewaySettings: false,
    securitySettings: false,
    accessControlManagement: true,
    dataProtectionSettings: false
  },

  'cultural-validator': {
    // Cultural and Islamic compliance focus
    contentModeration: true,
    culturalValidation: true,
    documentManagement: false,
    analyticsAccess: true,
    complianceReports: true,
    professionalDomainAccess: ['general'],
    islamicComplianceSettings: true,
    culturalContentReview: true,
    politicalNeutralityMonitoring: true,
    userManagement: false,
    workspaceManagement: false,
    systemManagement: false
  },

  'domain-expert': {
    // Professional domain specialist
    contentModeration: true,
    culturalValidation: false,
    documentManagement: true,
    knowledgeBaseManagement: true,
    analyticsAccess: true,
    complianceReports: true,
    professionalDomainAccess: [], // Set per expert's domain
    domainSpecificSettings: true,
    culturalContentReview: true,
    userManagement: false,
    workspaceManagement: false,
    systemManagement: false
  },

  'workspace-admin': {
    // Workspace-level administration
    userManagement: false,
    workspaceManagement: true,
    contentModeration: true,
    documentManagement: true,
    analyticsAccess: false,
    complianceReports: false,
    professionalDomainAccess: ['general'],
    culturalContentReview: true,
    systemManagement: false,
    settingsManagement: false
  },

  'user': {
    // Regular user - minimal permissions
    systemManagement: false,
    userManagement: false,
    workspaceManagement: false,
    settingsManagement: false,
    contentModeration: false,
    culturalValidation: false,
    documentManagement: false,
    knowledgeBaseManagement: false,
    analyticsAccess: false,
    auditLogAccess: false,
    performanceMetrics: false,
    complianceReports: false,
    professionalDomainAccess: ['general'],
    domainSpecificSettings: false,
    islamicComplianceSettings: false,
    culturalContentReview: false,
    politicalNeutralityMonitoring: false,
    apiKeyManagement: false,
    integrationManagement: false,
    paymentGatewaySettings: false,
    securitySettings: false,
    accessControlManagement: false,
    dataProtectionSettings: false
  },

  'guest': {
    // Guest access - no admin permissions
    systemManagement: false,
    userManagement: false,
    workspaceManagement: false,
    settingsManagement: false,
    contentModeration: false,
    culturalValidation: false,
    documentManagement: false,
    knowledgeBaseManagement: false,
    analyticsAccess: false,
    auditLogAccess: false,
    performanceMetrics: false,
    complianceReports: false,
    professionalDomainAccess: [],
    domainSpecificSettings: false,
    islamicComplianceSettings: false,
    culturalContentReview: false,
    politicalNeutralityMonitoring: false,
    apiKeyManagement: false,
    integrationManagement: false,
    paymentGatewaySettings: false,
    securitySettings: false,
    accessControlManagement: false,
    dataProtectionSettings: false
  }
};

/**
 * Professional domain requirements for Iraqi system
 */
export const PROFESSIONAL_DOMAIN_REQUIREMENTS: Record<ProfessionalDomain, {
  requiredPermissions: (keyof AdminPermissions)[];
  culturalComplianceLevel: CulturalComplianceLevel;
  islamicCompliance: boolean;
  specializedKnowledge: string[];
}> = {
  legal: {
    requiredPermissions: ['culturalValidation', 'complianceReports', 'documentManagement'],
    culturalComplianceLevel: 'strict',
    islamicCompliance: true,
    specializedKnowledge: ['Iraqi Civil Law', 'Islamic Law (Sharia)', 'Commercial Law', 'Court Procedures']
  },
  medical: {
    requiredPermissions: ['culturalValidation', 'complianceReports', 'documentManagement'],
    culturalComplianceLevel: 'strict',
    islamicCompliance: true,
    specializedKnowledge: ['Medical Ethics', 'Islamic Medical Ethics', 'Iraqi Healthcare System', 'Medical Arabic']
  },
  educational: {
    requiredPermissions: ['culturalValidation', 'knowledgeBaseManagement', 'documentManagement'],
    culturalComplianceLevel: 'moderate',
    islamicCompliance: true,
    specializedKnowledge: ['Iraqi Education System', 'Islamic Education', 'Arabic Literature', 'Curriculum Standards']
  },
  business: {
    requiredPermissions: ['documentManagement', 'paymentGatewaySettings'],
    culturalComplianceLevel: 'moderate',
    islamicCompliance: true,
    specializedKnowledge: ['Iraqi Business Law', 'Islamic Finance', 'Commercial Practices', 'Tax Regulations']
  },
  engineering: {
    requiredPermissions: ['documentManagement', 'knowledgeBaseManagement'],
    culturalComplianceLevel: 'flexible',
    islamicCompliance: false,
    specializedKnowledge: ['Iraqi Building Codes', 'Engineering Standards', 'Technical Arabic', 'Safety Regulations']
  },
  government: {
    requiredPermissions: ['culturalValidation', 'complianceReports', 'securitySettings', 'auditLogAccess'],
    culturalComplianceLevel: 'strict',
    islamicCompliance: true,
    specializedKnowledge: ['Government Procedures', 'Administrative Law', 'Public Service Ethics', 'Civic Engagement']
  },
  general: {
    requiredPermissions: ['culturalValidation'],
    culturalComplianceLevel: 'moderate',
    islamicCompliance: true,
    specializedKnowledge: ['Iraqi Culture', 'Basic Arabic', 'Islamic Principles', 'Social Etiquette']
  }
};

export class AdminRoleService {
  /**
   * Get permissions for a specific role
   */
  static getRolePermissions(role: UserRole): Partial<AdminPermissions> {
    return IRAQI_ROLE_PERMISSIONS[role] || {};
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(
    user: IraqiUser, 
    permission: keyof AdminPermissions
  ): boolean {
    const rolePermissions = this.getRolePermissions(user.role);
    return rolePermissions[permission] === true;
  }

  /**
   * Check if user can access professional domain
   */
  static canAccessDomain(
    user: IraqiUser, 
    domain: ProfessionalDomain
  ): boolean {
    const rolePermissions = this.getRolePermissions(user.role);
    const domainAccess = rolePermissions.professionalDomainAccess || [];
    return domainAccess.includes(domain) || user.professionalDomains.includes(domain);
  }

  /**
   * Validate cultural compliance permissions
   */
  static validateCulturalCompliance(
    user: IraqiUser,
    requiredLevel: CulturalComplianceLevel
  ): boolean {
    const userLevel = user.culturalSettings.islamicCompliance;
    const hasPermission = this.hasPermission(user, 'culturalValidation');
    
    // Check if user's compliance level meets requirement
    const complianceHierarchy: Record<CulturalComplianceLevel, number> = {
      'flexible': 1,
      'moderate': 2,
      'strict': 3,
      'custom': 4
    };
    
    const userLevelValue = complianceHierarchy[userLevel] || 0;
    const requiredLevelValue = complianceHierarchy[requiredLevel] || 0;
    
    return hasPermission && userLevelValue >= requiredLevelValue;
  }

  /**
   * Create organization-specific permissions
   */
  static createOrganizationPermissions(
    organization: IraqiOrganization,
    baseRole: UserRole
  ): OrganizationPermissions {
    const basePermissions = this.getRolePermissions(baseRole);
    
    return {
      ...basePermissions,
      organizationId: organization.id,
      organizationType: organization.type,
      workspaceCreation: true,
      userInvitation: true,
      billingManagement: baseRole === 'organization-admin',
      organizationSettings: true,
      professionalDomainAccess: organization.culturalSettings.professionalDomains
    };
  }

  /**
   * Create domain expert permissions
   */
  static createDomainExpertPermissions(
    domains: ProfessionalDomain[]
  ): ProfessionalDomainPermissions {
    const basePermissions = this.getRolePermissions('domain-expert');
    
    return {
      ...basePermissions,
      domains,
      domainSpecificSettings: true,
      professionalContentReview: true,
      domainKnowledgeManagement: true,
      professionalUserManagement: false,
      professionalDomainAccess: domains
    };
  }

  /**
   * Create cultural validator permissions
   */
  static createCulturalValidatorPermissions(): CulturalValidationPermissions {
    return {
      culturalContentReview: true,
      islamicComplianceSettings: true,
      politicalNeutralityMonitoring: true,
      contentModeration: true,
      complianceReports: true,
      analyticsAccess: true,
      professionalDomainAccess: ['general']
    };
  }

  /**
   * Validate role assignment based on Iraqi requirements
   */
  static validateRoleAssignment(
    user: Partial<IraqiUser>,
    targetRole: UserRole,
    organization?: IraqiOrganization
  ): {
    valid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    let valid = true;

    // Check cultural compliance requirements
    if (!user.culturalSettings?.islamicCompliance) {
      valid = false;
      reasons.push('Islamic compliance level must be set');
    }

    // Check professional domain requirements for domain experts
    if (targetRole === 'domain-expert' && (!user.professionalDomains || user.professionalDomains.length === 0)) {
      valid = false;
      reasons.push('Domain experts must have at least one professional domain');
    }

    // Check organization requirements for organization admins
    if (targetRole === 'organization-admin' && !organization) {
      valid = false;
      reasons.push('Organization admin role requires organization context');
    }

    // Check cultural validator requirements
    if (targetRole === 'cultural-validator') {
      if (user.culturalSettings?.islamicCompliance !== 'strict') {
        valid = false;
        reasons.push('Cultural validators must have strict Islamic compliance');
      }
      if (user.culturalSettings?.culturalSensitivity !== 'high') {
        valid = false;
        reasons.push('Cultural validators must have high cultural sensitivity');
      }
    }

    // Check super admin requirements (additional validation needed)
    if (targetRole === 'super-admin') {
      if (!user.culturalSettings?.politicalNeutrality) {
        valid = false;
        reasons.push('Super admins must maintain political neutrality');
      }
    }

    return { valid, reasons };
  }

  /**
   * Get required permissions for professional domain access
   */
  static getDomainRequirements(domain: ProfessionalDomain) {
    return PROFESSIONAL_DOMAIN_REQUIREMENTS[domain];
  }

  /**
   * Check if user meets domain requirements
   */
  static validateDomainExpertise(
    user: IraqiUser,
    domain: ProfessionalDomain
  ): {
    qualified: boolean;
    missingRequirements: string[];
  } {
    const requirements = this.getDomainRequirements(domain);
    const missingRequirements: string[] = [];
    let qualified = true;

    // Check required permissions
    for (const permission of requirements.requiredPermissions) {
      if (!this.hasPermission(user, permission)) {
        qualified = false;
        missingRequirements.push(`Missing permission: ${permission}`);
      }
    }

    // Check cultural compliance level
    if (!this.validateCulturalCompliance(user, requirements.culturalComplianceLevel)) {
      qualified = false;
      missingRequirements.push(`Insufficient cultural compliance level (required: ${requirements.culturalComplianceLevel})`);
    }

    // Check Islamic compliance if required
    if (requirements.islamicCompliance && user.culturalSettings.islamicCompliance === 'flexible') {
      qualified = false;
      missingRequirements.push('Islamic compliance required for this domain');
    }

    return { qualified, missingRequirements };
  }

  /**
   * Generate role hierarchy for organization
   */
  static getOrganizationRoleHierarchy(organizationType: IraqiOrganization['type']): UserRole[] {
    const hierarchies: Record<IraqiOrganization['type'], UserRole[]> = {
      'legal_firm': ['super-admin', 'organization-admin', 'domain-expert', 'cultural-validator', 'workspace-admin', 'user'],
      'hospital': ['super-admin', 'organization-admin', 'domain-expert', 'cultural-validator', 'workspace-admin', 'user'],
      'university': ['super-admin', 'organization-admin', 'domain-expert', 'cultural-validator', 'workspace-admin', 'user'],
      'business': ['super-admin', 'organization-admin', 'workspace-admin', 'user', 'guest'],
      'government': ['super-admin', 'organization-admin', 'domain-expert', 'cultural-validator', 'workspace-admin', 'user'],
      'ngo': ['super-admin', 'organization-admin', 'cultural-validator', 'workspace-admin', 'user', 'guest']
    };

    return hierarchies[organizationType] || ['super-admin', 'organization-admin', 'user'];
  }

  /**
   * Check if role change is allowed based on hierarchy
   */
  static isRoleChangeAllowed(
    currentUserRole: UserRole,
    targetUserRole: UserRole,
    organizationType: IraqiOrganization['type']
  ): boolean {
    const hierarchy = this.getOrganizationRoleHierarchy(organizationType);
    const currentIndex = hierarchy.indexOf(currentUserRole);
    const targetIndex = hierarchy.indexOf(targetUserRole);

    // Super admin can change anyone's role
    if (currentUserRole === 'super-admin') return true;

    // Can only change roles for users lower in hierarchy
    return currentIndex < targetIndex;
  }
}