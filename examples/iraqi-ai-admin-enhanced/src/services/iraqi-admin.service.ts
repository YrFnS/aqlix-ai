/**
 * Iraqi AI Advanced Admin Service
 * Comprehensive administrative system with cultural compliance, professional domain support,
 * and enterprise-grade user management for Iraqi organizations
 */

import { EventEmitter } from "events";

// Core Types
export interface IraqiAdminUser {
  id: string;
  username: string;
  email: string;
  phone?: string;

  // Personal Information
  fullName: string;
  fullNameAr: string;
  dateOfBirth?: Date;
  gender: "male" | "female";
  nationalId?: string;

  // Location Information
  governorate: IraqiGovernorate;
  city: string;
  cityAr: string;
  address?: string;
  addressAr?: string;

  // Professional Information
  profession: IraqiProfession;
  organization: string;
  organizationAr: string;
  organizationType: OrganizationType;
  professionalId?: string; // License/registration number
  specialization?: string;
  yearsOfExperience?: number;

  // System Access
  roles: IraqiAdminRole[];
  permissions: AdminPermission[];
  securityClearance: SecurityClearance;
  accountStatus: AccountStatus;
  lastLogin?: Date;
  loginAttempts: number;

  // Cultural & Compliance
  preferredLanguage: "ar" | "en" | "both";
  preferredDialect: IraqiDialect;
  culturalSettings: CulturalSettings;
  complianceScore: number;

  // Audit Information
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  modifiedBy?: string;
  notes?: string;
}

export type IraqiGovernorate =
  | "baghdad"
  | "basra"
  | "nineveh"
  | "erbil"
  | "sulaymaniyah"
  | "najaf"
  | "karbala"
  | "babylon"
  | "wasit"
  | "maysan"
  | "qadisiyyah"
  | "muthanna"
  | "anbar"
  | "saladin"
  | "kirkuk"
  | "duhok"
  | "diyala"
  | "thi-qar";

export type IraqiProfession =
  | "lawyer"
  | "judge"
  | "prosecutor"
  | "legal_advisor"
  | "doctor"
  | "nurse"
  | "pharmacist"
  | "medical_researcher"
  | "teacher"
  | "professor"
  | "researcher"
  | "principal"
  | "engineer"
  | "architect"
  | "consultant"
  | "technician"
  | "businessman"
  | "accountant"
  | "manager"
  | "entrepreneur"
  | "government_official"
  | "civil_servant"
  | "diplomat"
  | "military"
  | "imam"
  | "religious_scholar"
  | "cultural_expert"
  | "journalist"
  | "translator"
  | "artist"
  | "other";

export type OrganizationType =
  | "government_ministry"
  | "government_department"
  | "governorate_office"
  | "university"
  | "school"
  | "research_institute"
  | "hospital"
  | "clinic"
  | "medical_center"
  | "pharmacy"
  | "law_firm"
  | "court"
  | "legal_office"
  | "engineering_firm"
  | "construction_company"
  | "consulting_firm"
  | "private_company"
  | "startup"
  | "ngo"
  | "mosque"
  | "cultural_center";

export type IraqiAdminRole =
  | "super-admin"
  | "system-admin"
  | "organization-admin"
  | "cultural-validator"
  | "compliance-officer"
  | "domain-expert"
  | "user-manager"
  | "content-moderator"
  | "analyst"
  | "viewer";

export type SecurityClearance =
  | "public"
  | "restricted"
  | "confidential"
  | "secret";

export type AccountStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "pending_approval"
  | "locked";

export type IraqiDialect =
  | "baghdad"
  | "basra"
  | "mosul"
  | "southern"
  | "kurdish-arabic"
  | "standard";

export interface CulturalSettings {
  islamicCompliance: {
    level: "strict" | "moderate" | "flexible";
    prayerTimeNotifications: boolean;
    islamicCalendar: boolean;
    halalContentOnly: boolean;
  };
  professionalStandards: {
    formalLanguage: boolean;
    titleRespect: boolean;
    hierarchyAwareness: boolean;
  };
  culturalSensitivity: {
    familyValues: boolean;
    elderRespect: boolean;
    genderConsiderations: boolean;
  };
}

export interface AdminPermission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete" | "approve")[];
  conditions?: any;
  scope?: "organization" | "governorate" | "domain" | "personal";
}

export interface SystemMetrics {
  users: UserMetrics;
  compliance: ComplianceMetrics;
  performance: PerformanceMetrics;
  cultural: CulturalMetrics;
  professional: ProfessionalMetrics;
  security: SecurityMetrics;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  usersByGovernorate: { [K in IraqiGovernorate]: number };
  usersByProfession: { [K in IraqiProfession]: number };
  usersByRole: { [K in IraqiAdminRole]: number };
  averageSessionDuration: number;
  topActiveUsers: Array<{ id: string; name: string; sessions: number }>;
}

export interface ComplianceMetrics {
  overallScore: number;
  islamicCompliance: {
    score: number;
    violations: number;
    resolvedViolations: number;
    trendsLast30Days: number[];
  };
  culturalCompliance: {
    score: number;
    violations: number;
    resolvedViolations: number;
    trendsLast30Days: number[];
  };
  professionalCompliance: {
    score: number;
    violations: number;
    resolvedViolations: number;
    trendsLast30Days: number[];
  };
  contentModeration: {
    totalReviewed: number;
    approved: number;
    rejected: number;
    pending: number;
  };
}

export interface PerformanceMetrics {
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
  throughputPerMinute: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  databaseConnections: number;
}

export interface CulturalMetrics {
  languageDistribution: {
    arabic: number;
    english: number;
    mixed: number;
  };
  dialectUsage: { [K in IraqiDialect]: number };
  culturalContentTypes: {
    religious: number;
    professional: number;
    educational: number;
    cultural: number;
  };
  prayerTimeEngagement: {
    notificationsEnabled: number;
    averageResponseTime: number;
    complianceRate: number;
  };
}

export interface ProfessionalMetrics {
  domainDistribution: { [K in IraqiProfession]: number };
  organizationTypes: { [K in OrganizationType]: number };
  professionalEngagement: {
    averageSessionsPerProfession: { [K in IraqiProfession]: number };
    contentCreatedByDomain: { [K in IraqiProfession]: number };
    crossDomainCollaboration: number;
  };
  certificationTracking: {
    verified: number;
    pending: number;
    expired: number;
  };
}

export interface SecurityMetrics {
  loginAttempts: {
    successful: number;
    failed: number;
    blocked: number;
  };
  securityEvents: {
    total: number;
    resolved: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  accountSecurity: {
    twoFactorEnabled: number;
    passwordStrength: {
      strong: number;
      medium: number;
      weak: number;
    };
  };
}

export interface ComplianceViolation {
  id: string;
  type: "islamic" | "cultural" | "professional" | "security";
  severity: "low" | "medium" | "high" | "critical";
  userId: string;
  userDetails: {
    name: string;
    profession: IraqiProfession;
    organization: string;
  };
  description: string;
  descriptionAr: string;
  content?: string;
  detectedAt: Date;
  status: "open" | "investigating" | "resolved" | "dismissed";
  assignedTo?: string;
  resolvedAt?: Date;
  resolution?: string;
  resolutionAr?: string;
  category: string;
  impact: "low" | "medium" | "high" | "critical";
  tags: string[];
}

export interface SystemAlert {
  id: string;
  type: "performance" | "security" | "compliance" | "system";
  priority: "info" | "warning" | "error" | "critical";
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata?: any;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userDetails: {
    name: string;
    role: IraqiAdminRole;
    organization: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  changes?: {
    before: any;
    after: any;
  };
  result: "success" | "failure" | "partial";
  ipAddress: string;
  userAgent: string;
  culturalImpact?: {
    score: number;
    description: string;
  };
  timestamp: Date;
  metadata?: any;
}

// Main Admin Service
export class IraqiAdminService extends EventEmitter {
  private apiBaseUrl: string;
  private authToken?: string;
  private metricsUpdateInterval?: NodeJS.Timeout;

  constructor(config: { apiBaseUrl: string; authToken?: string }) {
    super();
    this.apiBaseUrl = config.apiBaseUrl;
    this.authToken = config.authToken;
  }

  /**
   * User Management
   */
  async getUsers(filters?: {
    role?: IraqiAdminRole;
    profession?: IraqiProfession;
    governorate?: IraqiGovernorate;
    status?: AccountStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: IraqiAdminUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.makeRequest(`/admin/users?${queryParams}`);
    return response;
  }

  async getUserById(userId: string): Promise<IraqiAdminUser> {
    return this.makeRequest(`/admin/users/${userId}`);
  }

  async createUser(
    user: Omit<
      IraqiAdminUser,
      "id" | "createdAt" | "updatedAt" | "loginAttempts"
    >,
  ): Promise<IraqiAdminUser> {
    return this.makeRequest("/admin/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async updateUser(
    userId: string,
    updates: Partial<IraqiAdminUser>,
  ): Promise<IraqiAdminUser> {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.makeRequest(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  async suspendUser(
    userId: string,
    reason: string,
    duration?: number,
  ): Promise<void> {
    await this.makeRequest(`/admin/users/${userId}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason, duration }),
    });
  }

  async reactivateUser(userId: string): Promise<void> {
    await this.makeRequest(`/admin/users/${userId}/reactivate`, {
      method: "POST",
    });
  }

  /**
   * Role and Permission Management
   */
  async updateUserRoles(
    userId: string,
    roles: IraqiAdminRole[],
  ): Promise<void> {
    await this.makeRequest(`/admin/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify({ roles }),
    });
  }

  async updateUserPermissions(
    userId: string,
    permissions: AdminPermission[],
  ): Promise<void> {
    await this.makeRequest(`/admin/users/${userId}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  }

  async bulkUpdateRoles(
    userIds: string[],
    roles: IraqiAdminRole[],
  ): Promise<void> {
    await this.makeRequest("/admin/users/bulk/roles", {
      method: "PUT",
      body: JSON.stringify({ userIds, roles }),
    });
  }

  /**
   * Metrics and Analytics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.makeRequest("/admin/metrics");
  }

  async getUserMetrics(
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h",
  ): Promise<UserMetrics> {
    return this.makeRequest(`/admin/metrics/users?timeRange=${timeRange}`);
  }

  async getComplianceMetrics(
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h",
  ): Promise<ComplianceMetrics> {
    return this.makeRequest(`/admin/metrics/compliance?timeRange=${timeRange}`);
  }

  async getCulturalMetrics(
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h",
  ): Promise<CulturalMetrics> {
    return this.makeRequest(`/admin/metrics/cultural?timeRange=${timeRange}`);
  }

  async getProfessionalMetrics(
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h",
  ): Promise<ProfessionalMetrics> {
    return this.makeRequest(
      `/admin/metrics/professional?timeRange=${timeRange}`,
    );
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return this.makeRequest("/admin/metrics/performance");
  }

  async getSecurityMetrics(
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h",
  ): Promise<SecurityMetrics> {
    return this.makeRequest(`/admin/metrics/security?timeRange=${timeRange}`);
  }

  /**
   * Compliance Management
   */
  async getComplianceViolations(filters?: {
    type?: "islamic" | "cultural" | "professional" | "security";
    severity?: "low" | "medium" | "high" | "critical";
    status?: "open" | "investigating" | "resolved" | "dismissed";
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    violations: ComplianceViolation[];
    total: number;
    summary: {
      open: number;
      investigating: number;
      resolved: number;
      dismissed: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return this.makeRequest(`/admin/compliance/violations?${queryParams}`);
  }

  async updateViolationStatus(
    violationId: string,
    status: "investigating" | "resolved" | "dismissed",
    resolution?: string,
    resolutionAr?: string,
  ): Promise<void> {
    await this.makeRequest(`/admin/compliance/violations/${violationId}`, {
      method: "PUT",
      body: JSON.stringify({ status, resolution, resolutionAr }),
    });
  }

  async bulkUpdateViolations(
    violationIds: string[],
    updates: { status?: string; assignedTo?: string; tags?: string[] },
  ): Promise<void> {
    await this.makeRequest("/admin/compliance/violations/bulk", {
      method: "PUT",
      body: JSON.stringify({ violationIds, updates }),
    });
  }

  /**
   * System Alerts
   */
  async getAlerts(filters?: {
    type?: "performance" | "security" | "compliance" | "system";
    priority?: "info" | "warning" | "error" | "critical";
    acknowledged?: boolean;
    resolved?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    alerts: SystemAlert[];
    total: number;
    unacknowledged: number;
    unresolved: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.makeRequest(`/admin/alerts?${queryParams}`);
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await this.makeRequest(`/admin/alerts/${alertId}/acknowledge`, {
      method: "POST",
    });
  }

  async resolveAlert(alertId: string): Promise<void> {
    await this.makeRequest(`/admin/alerts/${alertId}/resolve`, {
      method: "POST",
    });
  }

  async bulkAcknowledgeAlerts(alertIds: string[]): Promise<void> {
    await this.makeRequest("/admin/alerts/bulk/acknowledge", {
      method: "POST",
      body: JSON.stringify({ alertIds }),
    });
  }

  /**
   * Audit Logging
   */
  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    result?: "success" | "failure" | "partial";
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: AuditLogEntry[];
    total: number;
    summary: {
      success: number;
      failure: number;
      partial: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return this.makeRequest(`/admin/audit?${queryParams}`);
  }

  /**
   * Organization Management
   */
  async getOrganizations(filters?: {
    type?: OrganizationType;
    governorate?: IraqiGovernorate;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    organizations: any[];
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.makeRequest(`/admin/organizations?${queryParams}`);
  }

  /**
   * Content Moderation
   */
  async getContentModerationQueue(filters?: {
    type?: string;
    status?: "pending" | "approved" | "rejected";
    priority?: "low" | "medium" | "high" | "critical";
    page?: number;
    limit?: number;
  }): Promise<{
    items: any[];
    total: number;
    pending: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.makeRequest(`/admin/moderation?${queryParams}`);
  }

  async moderateContent(
    itemId: string,
    action: "approve" | "reject",
    reason?: string,
  ): Promise<void> {
    await this.makeRequest(`/admin/moderation/${itemId}`, {
      method: "POST",
      body: JSON.stringify({ action, reason }),
    });
  }

  /**
   * System Configuration
   */
  async getSystemConfig(): Promise<any> {
    return this.makeRequest("/admin/config");
  }

  async updateSystemConfig(config: any): Promise<void> {
    await this.makeRequest("/admin/config", {
      method: "PUT",
      body: JSON.stringify(config),
    });
  }

  /**
   * Backup and Export
   */
  async exportUserData(
    format: "csv" | "json" | "xlsx",
    filters?: any,
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append("format", format);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${this.apiBaseUrl}/admin/export/users?${queryParams}`,
      {
        headers: this.getAuthHeaders(),
      },
    );

    return response.blob();
  }

  async exportComplianceReport(
    timeRange: "7d" | "30d" | "90d" | "1y",
    format: "pdf" | "xlsx",
  ): Promise<Blob> {
    const response = await fetch(
      `${this.apiBaseUrl}/admin/export/compliance?timeRange=${timeRange}&format=${format}`,
      {
        headers: this.getAuthHeaders(),
      },
    );

    return response.blob();
  }

  /**
   * Real-time Updates
   */
  startMetricsStream(): void {
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
    }

    this.metricsUpdateInterval = setInterval(async () => {
      try {
        const metrics = await this.getSystemMetrics();
        this.emit("metrics-update", metrics);
      } catch (error) {
        this.emit("metrics-error", error);
      }
    }, 30000); // Update every 30 seconds
  }

  stopMetricsStream(): void {
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = undefined;
    }
  }

  /**
   * Helper Methods
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    const url = `${this.apiBaseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private getAuthHeaders(): Record<string, string> {
    return this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {};
  }

  /**
   * Authentication
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  /**
   * Utility Methods
   */
  static getGovernorateDisplayName(
    governorate: IraqiGovernorate,
    locale: "ar" | "en" = "ar",
  ): string {
    const names: { [K in IraqiGovernorate]: { ar: string; en: string } } = {
      baghdad: { ar: "بغداد", en: "Baghdad" },
      basra: { ar: "البصرة", en: "Basra" },
      nineveh: { ar: "نينوى", en: "Nineveh" },
      erbil: { ar: "أربيل", en: "Erbil" },
      sulaymaniyah: { ar: "السليمانية", en: "Sulaymaniyah" },
      najaf: { ar: "النجف", en: "Najaf" },
      karbala: { ar: "كربلاء", en: "Karbala" },
      babylon: { ar: "بابل", en: "Babylon" },
      wasit: { ar: "واسط", en: "Wasit" },
      maysan: { ar: "ميسان", en: "Maysan" },
      qadisiyyah: { ar: "القادسية", en: "Al-Qadisiyyah" },
      muthanna: { ar: "المثنى", en: "Al-Muthanna" },
      anbar: { ar: "الأنبار", en: "Anbar" },
      saladin: { ar: "صلاح الدين", en: "Saladin" },
      kirkuk: { ar: "كركوك", en: "Kirkuk" },
      duhok: { ar: "دهوك", en: "Duhok" },
      diyala: { ar: "ديالى", en: "Diyala" },
      "thi-qar": { ar: "ذي قار", en: "Thi-Qar" },
    };

    return names[governorate][locale];
  }

  static getProfessionDisplayName(
    profession: IraqiProfession,
    locale: "ar" | "en" = "ar",
  ): string {
    const names: { [K in IraqiProfession]: { ar: string; en: string } } = {
      lawyer: { ar: "محامي", en: "Lawyer" },
      judge: { ar: "قاضي", en: "Judge" },
      prosecutor: { ar: "مدعي عام", en: "Prosecutor" },
      legal_advisor: { ar: "مستشار قانوني", en: "Legal Advisor" },
      doctor: { ar: "طبيب", en: "Doctor" },
      nurse: { ar: "ممرض/ممرضة", en: "Nurse" },
      pharmacist: { ar: "صيدلي", en: "Pharmacist" },
      medical_researcher: { ar: "باحث طبي", en: "Medical Researcher" },
      teacher: { ar: "مدرس", en: "Teacher" },
      professor: { ar: "أستاذ", en: "Professor" },
      researcher: { ar: "باحث", en: "Researcher" },
      principal: { ar: "مدير", en: "Principal" },
      engineer: { ar: "مهندس", en: "Engineer" },
      architect: { ar: "معمار", en: "Architect" },
      consultant: { ar: "مستشار", en: "Consultant" },
      technician: { ar: "فني", en: "Technician" },
      businessman: { ar: "رجل أعمال", en: "Businessman" },
      accountant: { ar: "محاسب", en: "Accountant" },
      manager: { ar: "مدير", en: "Manager" },
      entrepreneur: { ar: "ريادي أعمال", en: "Entrepreneur" },
      government_official: { ar: "موظف حكومي", en: "Government Official" },
      civil_servant: { ar: "موظف مدني", en: "Civil Servant" },
      diplomat: { ar: "دبلوماسي", en: "Diplomat" },
      military: { ar: "عسكري", en: "Military" },
      imam: { ar: "إمام", en: "Imam" },
      religious_scholar: { ar: "عالم دين", en: "Religious Scholar" },
      cultural_expert: { ar: "خبير ثقافي", en: "Cultural Expert" },
      journalist: { ar: "صحفي", en: "Journalist" },
      translator: { ar: "مترجم", en: "Translator" },
      artist: { ar: "فنان", en: "Artist" },
      other: { ar: "أخرى", en: "Other" },
    };

    return names[profession][locale];
  }

  static getRoleDisplayName(
    role: IraqiAdminRole,
    locale: "ar" | "en" = "ar",
  ): string {
    const names: { [K in IraqiAdminRole]: { ar: string; en: string } } = {
      "super-admin": { ar: "مدير نظام عام", en: "Super Admin" },
      "system-admin": { ar: "مدير نظام", en: "System Admin" },
      "organization-admin": { ar: "مدير مؤسسة", en: "Organization Admin" },
      "cultural-validator": { ar: "مدقق ثقافي", en: "Cultural Validator" },
      "compliance-officer": { ar: "مسؤول امتثال", en: "Compliance Officer" },
      "domain-expert": { ar: "خبير مجال", en: "Domain Expert" },
      "user-manager": { ar: "مدير مستخدمين", en: "User Manager" },
      "content-moderator": { ar: "مشرف محتوى", en: "Content Moderator" },
      analyst: { ar: "محلل", en: "Analyst" },
      viewer: { ar: "مشاهد", en: "Viewer" },
    };

    return names[role][locale];
  }
}

export default IraqiAdminService;
