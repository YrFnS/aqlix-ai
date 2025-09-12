/**
 * Iraqi AI Admin System - Type Definitions
 * Extracted and enhanced from anything-llm admin system
 * 
 * Features:
 * - Iraqi professional role management
 * - Cultural compliance tracking
 * - Arabic-first admin interface
 * - Government security integration
 */

// Iraqi Professional Roles
export type IraqiProfessionalRole = 
  | 'lawyer' 
  | 'doctor' 
  | 'teacher' 
  | 'engineer' 
  | 'administrator' 
  | 'manager' 
  | 'analyst';

// Admin Role Hierarchy
export type AdminRole = 
  | 'super_admin'      // System-wide control
  | 'organization_admin'  // Organization management
  | 'department_admin'    // Department management
  | 'supervisor'          // Team supervision
  | 'user_admin'          // User management only
  | 'viewer';             // Read-only access

// Cultural Compliance Levels
export type ComplianceLevel = 
  | 'full_compliance'      // 95%+ Islamic compliance
  | 'standard_compliance'  // 85%+ compliance
  | 'basic_compliance'     // 70%+ compliance
  | 'non_compliant';       // <70% compliance

// User Management Types
export interface IraqiUser {
  id: string;
  email: string;
  name: string;
  arabicName?: string;  // Optional Arabic name
  role: AdminRole;
  professionalRole?: IraqiProfessionalRole;
  organizationId: string;
  departmentId?: string;
  permissions: UserPermission[];
  preferences: UserPreferences;
  complianceStatus: ComplianceLevel;
  lastActivity: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Iraqi-specific fields
  governorateCode?: string;    // Iraqi governorate
  professionalLicenseId?: string;  // Professional license number
  securityClearanceLevel?: 'public' | 'restricted' | 'confidential' | 'secret';
  languagePreference: 'ar' | 'en' | 'both';
}

export interface UserPermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  scope: 'own' | 'department' | 'organization' | 'system';
  conditions?: Record<string, any>;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  layoutDirection: 'rtl' | 'ltr' | 'auto';
  timeZone: string;  // Default: 'Asia/Baghdad'
  dateFormat: 'gregorian' | 'hijri' | 'both';
  notifications: NotificationPreferences;
  
  // Cultural preferences
  prayerTimeReminders?: boolean;
  culturalFiltering?: boolean;
  professionalMode?: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  desktop: boolean;
  mobile: boolean;
  
  // Iraqi-specific notifications
  complianceAlerts: boolean;
  securityNotifications: boolean;
  administrativeUpdates: boolean;
}

// Organization Management
export interface IraqiOrganization {
  id: string;
  name: string;
  arabicName?: string;
  type: OrganizationType;
  governorateCode: string;
  registrationNumber?: string;  // Iraqi business registration
  contactInfo: ContactInfo;
  settings: OrganizationSettings;
  compliance: ComplianceMetrics;
  subscriptionTier: SubscriptionTier;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type OrganizationType = 
  | 'government'
  | 'ministry' 
  | 'university'
  | 'hospital'
  | 'law_firm'
  | 'engineering_firm'
  | 'ngo'
  | 'private_company'
  | 'school';

export interface ContactInfo {
  primaryEmail: string;
  phoneNumber: string;
  address: {
    street: string;
    district: string;
    city: string;
    governorate: string;
    postalCode?: string;
  };
  website?: string;
  socialMedia?: Record<string, string>;
}

export interface OrganizationSettings {
  // Language and Cultural Settings
  defaultLanguage: 'ar' | 'en';
  enabledLanguages: ('ar' | 'en')[];
  culturalFiltering: boolean;
  islamicCompliance: boolean;
  
  // Professional Settings
  professionalDomains: IraqiProfessionalRole[];
  documentRetentionDays: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  
  // Security Settings
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  passwordPolicy: PasswordPolicy;
  ipWhitelist?: string[];
  
  // Feature Settings
  enabledFeatures: string[];
  maxUsers: number;
  storageQuotaGB: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;  // days
  preventReuse: number;  // last N passwords
}

// System Metrics and Analytics
export interface SystemMetrics {
  overview: SystemOverview;
  userMetrics: UserMetrics;
  organizationMetrics: OrganizationMetrics;
  complianceMetrics: ComplianceMetrics;
  performanceMetrics: PerformanceMetrics;
  culturalMetrics: CulturalMetrics;
  timestamp: string;
}

export interface SystemOverview {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  activeOrganizations: number;
  totalConversations: number;
  averageResponseTime: number;
  systemUptime: number;
  errorRate: number;
}

export interface UserMetrics {
  newUsersToday: number;
  activeUsersToday: number;
  userGrowthRate: number;  // percentage
  averageSessionDuration: number;  // minutes
  topUsersByActivity: UserActivitySummary[];
  userRetentionRate: number;
  
  // Role distribution
  roleDistribution: Record<AdminRole, number>;
  professionalRoleDistribution: Record<IraqiProfessionalRole, number>;
  
  // Geographic distribution
  governorateDistribution: Record<string, number>;
}

export interface UserActivitySummary {
  userId: string;
  name: string;
  organizationName: string;
  conversationsCount: number;
  messagesCount: number;
  lastActivity: string;
  complianceScore: number;
}

export interface OrganizationMetrics {
  organizationGrowthRate: number;
  averageUsersPerOrganization: number;
  organizationTypeDistribution: Record<OrganizationType, number>;
  subscriptionTierDistribution: Record<SubscriptionTier, number>;
  organizationActivityRanking: OrganizationActivitySummary[];
}

export interface OrganizationActivitySummary {
  organizationId: string;
  name: string;
  type: OrganizationType;
  userCount: number;
  conversationsCount: number;
  complianceScore: number;
  subscriptionTier: SubscriptionTier;
}

export interface ComplianceMetrics {
  overallComplianceScore: number;
  islamicComplianceRate: number;
  culturalAppropriateness: number;
  contentFilteringEffectiveness: number;
  professionalStandardsAdherence: number;
  
  // Compliance by category
  complianceByRole: Record<IraqiProfessionalRole, number>;
  complianceByOrganizationType: Record<OrganizationType, number>;
  complianceByGovernorate: Record<string, number>;
  
  // Trend data
  complianceTrend: ComplianceTrendData[];
  violationsCount: number;
  resolvedViolationsCount: number;
  pendingReviewsCount: number;
}

export interface ComplianceTrendData {
  date: string;
  complianceScore: number;
  violationsCount: number;
  resolvedCount: number;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  apiLatency: number;
  errorRate: number;
  uptime: number;
  throughput: number;  // requests per second
  
  // Resource utilization
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  bandwidthUsage: number;
  
  // Performance by region
  performanceByGovernorate: Record<string, PerformanceData>;
}

export interface PerformanceData {
  responseTime: number;
  errorRate: number;
  userSatisfactionScore: number;
}

export interface CulturalMetrics {
  arabicContentPercentage: number;
  englishContentPercentage: number;
  mixedLanguageContentPercentage: number;
  
  // Cultural appropriateness
  culturallyAppropriateContentRate: number;
  flaggedContentCount: number;
  approvedContentAfterReviewCount: number;
  
  // Professional domain usage
  professionalDomainUsage: Record<IraqiProfessionalRole, number>;
  
  // Geographic and cultural distribution
  rtlInterfaceUsageRate: number;
  prayerTimeReminderUsage: number;
  hijriCalendarUsageRate: number;
}

// Subscription and Billing
export type SubscriptionTier = 
  | 'basic'
  | 'professional' 
  | 'enterprise'
  | 'government'
  | 'educational';

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  status: 'active' | 'suspended' | 'canceled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  features: string[];
  limits: SubscriptionLimits;
  billing: BillingInfo;
}

export interface SubscriptionLimits {
  maxUsers: number;
  maxConversationsPerMonth: number;
  maxStorageGB: number;
  maxApiCallsPerDay: number;
  maxWorkspaces: number;
}

export interface BillingInfo {
  currency: 'IQD' | 'USD';
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod: 'zaincash' | 'fastpay' | 'nasswallet' | 'bank_transfer';
  lastPaymentDate?: string;
  nextPaymentDate: string;
}

// API and Integration Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface FilterOptions {
  search?: string;
  role?: AdminRole;
  professionalRole?: IraqiProfessionalRole;
  organizationType?: OrganizationType;
  complianceLevel?: ComplianceLevel;
  status?: 'active' | 'inactive' | 'suspended';
  governorate?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Dashboard and UI Types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  arabicTitle?: string;
  config: WidgetConfig;
  permissions: string[];
  isVisible: boolean;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type WidgetType = 
  | 'metric_card'
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'table'
  | 'map'
  | 'compliance_gauge'
  | 'activity_feed'
  | 'user_list'
  | 'organization_list';

export interface WidgetConfig {
  dataSource: string;
  refreshInterval?: number;
  filters?: FilterOptions;
  displayOptions?: Record<string, any>;
  culturalSettings?: {
    showArabicLabels: boolean;
    useHijriDates: boolean;
    formatNumbers: 'arabic' | 'english';
  };
}

// Audit and Logging Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  organizationId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  // Iraqi-specific audit fields
  complianceImpact?: 'none' | 'low' | 'medium' | 'high' | 'critical';
  culturalSensitivity?: boolean;
  professionalContext?: IraqiProfessionalRole;
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  userId?: string;
  organizationId?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  ipAddress?: string;
  timestamp: string;
  additionalData?: Record<string, any>;
}

export type SecurityEventType = 
  | 'failed_login_attempt'
  | 'suspicious_activity'
  | 'unauthorized_access_attempt'
  | 'data_breach_attempt'
  | 'compliance_violation'
  | 'cultural_content_violation'
  | 'policy_violation'
  | 'account_compromise_suspected';

// Export all types for easy importing
export type {
  IraqiUser,
  IraqiOrganization,
  SystemMetrics,
  UserMetrics,
  OrganizationMetrics,
  ComplianceMetrics,
  PerformanceMetrics,
  CulturalMetrics,
  SubscriptionDetails,
  DashboardWidget,
  AuditLog,
  SecurityEvent
};