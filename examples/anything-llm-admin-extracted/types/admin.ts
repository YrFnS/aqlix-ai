/**
 * Iraqi AI Admin System - Type Definitions
 * Enhanced for Iraqi cultural compliance and professional domain management
 *
 * Features:
 * - Iraqi-specific admin roles and permissions
 * - Cultural compliance monitoring
 * - Professional domain administration
 * - Arabic-first interface support
 * - Islamic compliance validation
 */

export type UserRole =
  | 'super-admin' // Full system access
  | 'organization-admin' // Organization-level admin
  | 'cultural-validator' // Cultural and Islamic compliance
  | 'domain-expert' // Professional domain specialist
  | 'workspace-admin' // Workspace-level admin
  | 'user' // Regular user
  | 'guest'; // Guest access

export type ProfessionalDomain =
  | 'legal' // Iraqi legal system
  | 'medical' // Iraqi healthcare
  | 'educational' // Iraqi education system
  | 'business' // Iraqi business sector
  | 'engineering' // Iraqi engineering/technical
  | 'government' // Iraqi government services
  | 'general'; // General use

export type CulturalComplianceLevel =
  | 'strict' // Full Islamic compliance required
  | 'moderate' // Basic cultural sensitivity
  | 'flexible' // Minimal restrictions
  | 'custom'; // Custom compliance rules

export interface AdminPermissions {
  // System Management
  systemManagement: boolean;
  userManagement: boolean;
  workspaceManagement: boolean;
  settingsManagement: boolean;

  // Content Management
  contentModeration: boolean;
  culturalValidation: boolean;
  documentManagement: boolean;
  knowledgeBaseManagement: boolean;

  // Analytics & Monitoring
  analyticsAccess: boolean;
  auditLogAccess: boolean;
  performanceMetrics: boolean;
  complianceReports: boolean;

  // Professional Domains
  professionalDomainAccess: ProfessionalDomain[];
  domainSpecificSettings: boolean;

  // Cultural & Islamic Compliance
  islamicComplianceSettings: boolean;
  culturalContentReview: boolean;
  politicalNeutralityMonitoring: boolean;

  // API & Integration
  apiKeyManagement: boolean;
  integrationManagement: boolean;
  paymentGatewaySettings: boolean;

  // Security
  securitySettings: boolean;
  accessControlManagement: boolean;
  dataProtectionSettings: boolean;
}

export interface OrganizationPermissions extends Partial<AdminPermissions> {
  organizationId: string;
  organizationType: 'legal_firm' | 'hospital' | 'university' | 'business' | 'government' | 'ngo';
  workspaceCreation: boolean;
  userInvitation: boolean;
  billingManagement: boolean;
  organizationSettings: boolean;
}

export interface CulturalValidationPermissions extends Partial<AdminPermissions> {
  culturalContentReview: true;
  islamicComplianceSettings: true;
  politicalNeutralityMonitoring: true;
  contentModeration: true;
  complianceReports: true;
}

export interface ProfessionalDomainPermissions extends Partial<AdminPermissions> {
  domains: ProfessionalDomain[];
  domainSpecificSettings: true;
  professionalContentReview: boolean;
  domainKnowledgeManagement: boolean;
  professionalUserManagement: boolean;
}

export interface IraqiUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  arabicName?: string;
  role: UserRole;
  permissions:
    | AdminPermissions
    | OrganizationPermissions
    | CulturalValidationPermissions
    | ProfessionalDomainPermissions;

  // Iraqi-specific fields
  professionalDomains: ProfessionalDomain[];
  arabicPreference: boolean;
  dialectPreference: 'iraqi' | 'baghdad' | 'basra' | 'mosul' | 'standard';
  culturalSettings: {
    islamicCompliance: CulturalComplianceLevel;
    politicalNeutrality: boolean;
    culturalSensitivity: 'high' | 'medium' | 'low';
  };

  // Organization & Workspace
  organizationId?: string;
  workspaceIds: string[];

  // Account Status
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  lastLogin?: Date;
  loginAttempts: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}

export interface IraqiOrganization {
  id: string;
  name: string;
  arabicName?: string;
  type: 'legal_firm' | 'hospital' | 'university' | 'business' | 'government' | 'ngo';

  // Iraqi Business Information
  registrationNumber?: string;
  taxId?: string;
  city: 'Baghdad' | 'Basra' | 'Erbil' | 'Mosul' | 'Najaf' | 'Karbala' | 'Sulaymaniyah' | 'Other';
  province: string;

  // Settings
  culturalSettings: {
    islamicCompliance: CulturalComplianceLevel;
    arabicFirst: boolean;
    dialectPreference: 'iraqi' | 'baghdad' | 'basra' | 'mosul' | 'standard';
    professionalDomains: ProfessionalDomain[];
  };

  // Subscription & Billing
  subscriptionTier: 'basic' | 'professional' | 'enterprise' | 'government';
  paymentMethods: ('zaincash' | 'fastpay' | 'nasswallet' | 'bank_transfer')[];

  // Members
  adminIds: string[];
  memberCount: number;
  maxMembers: number;

  // Status
  status: 'active' | 'inactive' | 'suspended';
  verificationStatus: 'pending' | 'verified' | 'rejected';

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}

export interface SystemMetrics {
  // Usage Statistics
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  totalWorkspaces: number;
  totalDocuments: number;
  totalConversations: number;

  // Performance Metrics
  averageResponseTime: number;
  systemUptime: number;
  errorRate: number;
  apiCallsPerMinute: number;

  // Cultural Compliance Metrics
  culturalComplianceRate: number;
  islamicComplianceViolations: number;
  politicalNeutralityAlerts: number;
  contentModerationActions: number;

  // Professional Domain Usage
  professionalDomainUsage: Record<
    ProfessionalDomain,
    {
      users: number;
      conversations: number;
      documents: number;
      complianceRate: number;
    }
  >;

  // Arabic & RTL Metrics
  arabicContentPercentage: number;
  rtlLayoutUsage: number;
  dialectDistribution: Record<string, number>;

  // Payment & Subscription
  subscriptionDistribution: Record<string, number>;
  paymentMethodUsage: Record<string, number>;
  revenueMetrics: {
    monthly: number;
    annual: number;
    averagePerUser: number;
  };

  // System Health
  databaseHealth: 'healthy' | 'warning' | 'critical';
  cacheHealth: 'healthy' | 'warning' | 'critical';
  storageUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;

  // Request Information
  ipAddress: string;
  userAgent: string;
  location?: {
    city: string;
    country: string;
    region: string;
  };

  // Action Details
  details: Record<string, any>;
  success: boolean;
  errorMessage?: string;

  // Cultural Context
  culturalContext?: {
    arabicContent: boolean;
    professionalDomain: ProfessionalDomain;
    complianceLevel: CulturalComplianceLevel;
  };

  // Severity for monitoring
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface ComplianceReport {
  id: string;
  reportType: 'cultural' | 'islamic' | 'political' | 'professional' | 'security';
  generatedAt: Date;
  generatedBy: string;

  // Report Period
  startDate: Date;
  endDate: Date;

  // Compliance Metrics
  overallScore: number;
  violations: number;
  improvements: number;
  warnings: number;

  // Detailed Analysis
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    actionItems: string[];
  };

  // Domain-Specific Results
  domainResults: Record<
    ProfessionalDomain,
    {
      score: number;
      violations: number;
      recommendations: string[];
    }
  >;

  // Status
  status: 'draft' | 'final' | 'approved' | 'archived';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface AdminDashboardData {
  metrics: SystemMetrics;
  recentAuditLogs: AuditLogEntry[];
  complianceAlerts: ComplianceAlert[];
  systemAlerts: SystemAlert[];
  userActivity: UserActivitySummary[];
  organizationActivity: OrganizationActivitySummary[];
}

export interface ComplianceAlert {
  id: string;
  type: 'cultural' | 'islamic' | 'political' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedUsers: number;
  affectedContent: number;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'maintenance' | 'error';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  affectedServices: string[];
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface UserActivitySummary {
  userId: string;
  username: string;
  role: UserRole;
  lastLogin: Date;
  conversationsCount: number;
  documentsUploaded: number;
  complianceViolations: number;
  status: 'active' | 'inactive' | 'flagged';
}

export interface OrganizationActivitySummary {
  organizationId: string;
  organizationName: string;
  type: IraqiOrganization['type'];
  memberCount: number;
  activeMembers: number;
  subscriptionTier: IraqiOrganization['subscriptionTier'];
  complianceScore: number;
  monthlyUsage: number;
  status: 'active' | 'inactive' | 'flagged';
}
