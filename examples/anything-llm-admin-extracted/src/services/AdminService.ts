/**
 * Iraqi AI Admin Service
 * Comprehensive admin management with Iraqi cultural compliance
 *
 * Features:
 * - Arabic-first user management
 * - Cultural compliance monitoring
 * - Iraqi professional role system
 * - Government-grade security
 */

import {
  IraqiUser,
  IraqiOrganization,
  SystemMetrics,
  UserMetrics,
  OrganizationMetrics,
  ComplianceMetrics,
  PerformanceMetrics,
  CulturalMetrics,
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
  SortOptions,
  AuditLog,
  SecurityEvent,
  AdminRole,
  IraqiProfessionalRole,
  ComplianceLevel,
} from '../types/admin';

class IraqiAdminService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // ======================
  // Authentication
  // ======================

  async authenticateAdmin(
    email: string,
    password: string,
    twoFactorCode?: string
  ): Promise<
    ApiResponse<{
      user: IraqiUser;
      token: string;
      refreshToken: string;
      permissions: string[];
    }>
  > {
    const response = await fetch(`${this.baseUrl}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        twoFactorCode,
        culturalContext: 'iraqi_admin',
      }),
    });

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    const response = await fetch(`${this.baseUrl}/admin/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    return response.json();
  }

  // ======================
  // User Management
  // ======================

  async getUsers(
    page: number = 1,
    pageSize: number = 20,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<ApiResponse<PaginatedResponse<IraqiUser>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
      ...(sort && { sortField: sort.field, sortDirection: sort.direction }),
    });

    const response = await fetch(`${this.baseUrl}/admin/users?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async getUser(userId: string): Promise<ApiResponse<IraqiUser>> {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async createUser(userData: Partial<IraqiUser>): Promise<ApiResponse<IraqiUser>> {
    // Validate cultural compliance before creation
    const culturalValidation = await this.validateCulturalCompliance(userData);

    const response = await fetch(`${this.baseUrl}/admin/users`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        culturalValidation,
        createdBy: 'admin_system',
        createdAt: new Date().toISOString(),
      }),
    });

    // Log user creation for audit trail
    await this.logAdminAction('create_user', 'user', userData.id, {
      userEmail: userData.email,
      role: userData.role,
      professionalRole: userData.professionalRole,
      complianceLevel: culturalValidation.complianceLevel,
    });

    return response.json();
  }

  async updateUser(userId: string, updates: Partial<IraqiUser>): Promise<ApiResponse<IraqiUser>> {
    // Validate cultural compliance for updates
    const culturalValidation = await this.validateCulturalCompliance(updates);

    const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updates,
        culturalValidation,
        updatedAt: new Date().toISOString(),
      }),
    });

    // Log user update for audit trail
    await this.logAdminAction('update_user', 'user', userId, {
      changes: updates,
      complianceImpact: culturalValidation.complianceLevel,
    });

    return response.json();
  }

  async deleteUser(userId: string, reason?: string): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason,
        deletedAt: new Date().toISOString(),
      }),
    });

    // Log user deletion for audit trail
    await this.logAdminAction('delete_user', 'user', userId, {
      reason,
      severity: 'high',
    });

    return response.json();
  }

  async activateUser(userId: string): Promise<ApiResponse<IraqiUser>> {
    return this.updateUserStatus(userId, 'active');
  }

  async deactivateUser(userId: string, reason?: string): Promise<ApiResponse<IraqiUser>> {
    return this.updateUserStatus(userId, 'inactive', reason);
  }

  private async updateUserStatus(
    userId: string,
    status: 'active' | 'inactive' | 'suspended',
    reason?: string
  ): Promise<ApiResponse<IraqiUser>> {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        reason,
        updatedAt: new Date().toISOString(),
      }),
    });

    // Log status change for audit trail
    await this.logAdminAction('update_user_status', 'user', userId, {
      newStatus: status,
      reason,
      severity: status === 'suspended' ? 'high' : 'medium',
    });

    return response.json();
  }

  // ======================
  // Organization Management
  // ======================

  async getOrganizations(
    page: number = 1,
    pageSize: number = 20,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<ApiResponse<PaginatedResponse<IraqiOrganization>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
      ...(sort && { sortField: sort.field, sortDirection: sort.direction }),
    });

    const response = await fetch(`${this.baseUrl}/admin/organizations?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async getOrganization(organizationId: string): Promise<ApiResponse<IraqiOrganization>> {
    const response = await fetch(`${this.baseUrl}/admin/organizations/${organizationId}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async createOrganization(
    orgData: Partial<IraqiOrganization>
  ): Promise<ApiResponse<IraqiOrganization>> {
    // Validate Iraqi business registration if provided
    if (orgData.registrationNumber) {
      await this.validateBusinessRegistration(orgData.registrationNumber);
    }

    const response = await fetch(`${this.baseUrl}/admin/organizations`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orgData,
        createdAt: new Date().toISOString(),
        compliance: {
          islamicCompliance: 85, // Default compliance score
          culturalAppropriateness: 90,
          overallScore: 87.5,
        },
      }),
    });

    // Log organization creation
    await this.logAdminAction('create_organization', 'organization', orgData.id, {
      organizationName: orgData.name,
      type: orgData.type,
      governorate: orgData.governorateCode,
    });

    return response.json();
  }

  async updateOrganization(
    organizationId: string,
    updates: Partial<IraqiOrganization>
  ): Promise<ApiResponse<IraqiOrganization>> {
    const response = await fetch(`${this.baseUrl}/admin/organizations/${organizationId}`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString(),
      }),
    });

    // Log organization update
    await this.logAdminAction('update_organization', 'organization', organizationId, {
      changes: updates,
    });

    return response.json();
  }

  // ======================
  // System Metrics and Analytics
  // ======================

  async getSystemMetrics(
    timeRange: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<ApiResponse<SystemMetrics>> {
    const response = await fetch(`${this.baseUrl}/admin/metrics/system?timeRange=${timeRange}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async getUserMetrics(
    timeRange: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<ApiResponse<UserMetrics>> {
    const response = await fetch(`${this.baseUrl}/admin/metrics/users?timeRange=${timeRange}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async getOrganizationMetrics(
    timeRange: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<ApiResponse<OrganizationMetrics>> {
    const response = await fetch(
      `${this.baseUrl}/admin/metrics/organizations?timeRange=${timeRange}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.json();
  }

  async getComplianceMetrics(
    timeRange: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<ApiResponse<ComplianceMetrics>> {
    const response = await fetch(
      `${this.baseUrl}/admin/metrics/compliance?timeRange=${timeRange}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.json();
  }

  async getPerformanceMetrics(
    timeRange: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<ApiResponse<PerformanceMetrics>> {
    const response = await fetch(
      `${this.baseUrl}/admin/metrics/performance?timeRange=${timeRange}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.json();
  }

  async getCulturalMetrics(
    timeRange: '24h' | '7d' | '30d' | '90d' = '24h'
  ): Promise<ApiResponse<CulturalMetrics>> {
    const response = await fetch(`${this.baseUrl}/admin/metrics/cultural?timeRange=${timeRange}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // ======================
  // Cultural Compliance Management
  // ======================

  private async validateCulturalCompliance(data: any): Promise<{
    complianceLevel: ComplianceLevel;
    islamicCompliance: number;
    culturalAppropriateness: number;
    recommendations: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/admin/compliance/validate`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        validationType: 'comprehensive',
        culturalContext: 'iraqi_professional',
      }),
    });

    return response.json();
  }

  async getComplianceReport(
    organizationId?: string,
    userId?: string,
    timeRange: '7d' | '30d' | '90d' = '30d'
  ): Promise<
    ApiResponse<{
      overallScore: number;
      islamicCompliance: number;
      culturalAppropriateness: number;
      professionalStandards: number;
      violations: Array<{
        type: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        timestamp: string;
        resolved: boolean;
      }>;
      recommendations: string[];
    }>
  > {
    const params = new URLSearchParams({
      timeRange,
      ...(organizationId && { organizationId }),
      ...(userId && { userId }),
    });

    const response = await fetch(`${this.baseUrl}/admin/compliance/report?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async resolveComplianceViolation(
    violationId: string,
    resolution: {
      action: string;
      notes: string;
      resolvedBy: string;
    }
  ): Promise<ApiResponse<boolean>> {
    const response = await fetch(
      `${this.baseUrl}/admin/compliance/violations/${violationId}/resolve`,
      {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...resolution,
          resolvedAt: new Date().toISOString(),
        }),
      }
    );

    // Log compliance resolution
    await this.logAdminAction('resolve_compliance_violation', 'compliance_violation', violationId, {
      resolution,
      severity: 'medium',
    });

    return response.json();
  }

  // ======================
  // Audit and Logging
  // ======================

  async getAuditLogs(
    page: number = 1,
    pageSize: number = 50,
    filters?: {
      userId?: string;
      organizationId?: string;
      action?: string;
      severity?: string;
      dateRange?: { start: string; end: string };
    }
  ): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
      ...(filters?.dateRange && {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end,
      }),
    });

    const response = await fetch(`${this.baseUrl}/admin/audit/logs?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  async getSecurityEvents(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      type?: string;
      severity?: string;
      status?: string;
      userId?: string;
      organizationId?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<SecurityEvent>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    });

    const response = await fetch(`${this.baseUrl}/admin/security/events?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  private async logAdminAction(
    action: string,
    resourceType: string,
    resourceId?: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/admin/audit/log`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          resourceType,
          resourceId,
          additionalData,
          timestamp: new Date().toISOString(),
          severity: additionalData?.severity || 'info',
        }),
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  // ======================
  // Role and Permission Management
  // ======================

  async assignRole(
    userId: string,
    role: AdminRole,
    professionalRole?: IraqiProfessionalRole,
    reason?: string
  ): Promise<ApiResponse<IraqiUser>> {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        professionalRole,
        reason,
        assignedAt: new Date().toISOString(),
      }),
    });

    // Log role assignment
    await this.logAdminAction('assign_role', 'user', userId, {
      role,
      professionalRole,
      reason,
      severity: 'high',
    });

    return response.json();
  }

  async getUserPermissions(userId: string): Promise<ApiResponse<string[]>> {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}/permissions`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // ======================
  // Business Registration Validation (Iraqi Specific)
  // ======================

  private async validateBusinessRegistration(registrationNumber: string): Promise<boolean> {
    // This would integrate with Iraqi Ministry of Trade databases
    const response = await fetch(`${this.baseUrl}/admin/validation/business-registration`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationNumber,
        country: 'IQ',
      }),
    });

    const result = await response.json();
    return result.valid;
  }

  // ======================
  // Utility Methods
  // ======================

  private getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'X-Admin-Client': 'iraqi-ai-admin',
      Accept: 'application/json',
      'Accept-Language': 'ar,en',
    };
  }

  // ======================
  // Export and Reporting
  // ======================

  async exportUserReport(
    format: 'csv' | 'excel' | 'pdf',
    filters?: FilterOptions,
    includePersonalData: boolean = false
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      includePersonalData: includePersonalData.toString(),
      ...filters,
    });

    const response = await fetch(`${this.baseUrl}/admin/reports/users?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return response.blob();
  }

  async exportComplianceReport(
    format: 'csv' | 'excel' | 'pdf',
    timeRange: '30d' | '90d' | '1y' = '90d',
    organizationId?: string
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      timeRange,
      ...(organizationId && { organizationId }),
    });

    const response = await fetch(`${this.baseUrl}/admin/reports/compliance?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return response.blob();
  }

  // ======================
  // System Configuration
  // ======================

  async updateSystemSettings(settings: {
    maintenanceMode?: boolean;
    maxConcurrentUsers?: number;
    enableNewRegistrations?: boolean;
    defaultLanguage?: 'ar' | 'en';
    culturalFilteringEnabled?: boolean;
    islamicComplianceRequired?: boolean;
  }): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${this.baseUrl}/admin/system/settings`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...settings,
        updatedAt: new Date().toISOString(),
      }),
    });

    // Log system settings update
    await this.logAdminAction('update_system_settings', 'system', undefined, {
      changes: settings,
      severity: 'critical',
    });

    return response.json();
  }

  async getSystemHealth(): Promise<
    ApiResponse<{
      status: 'healthy' | 'degraded' | 'critical';
      uptime: number;
      services: Array<{
        name: string;
        status: 'online' | 'offline' | 'degraded';
        responseTime: number;
        lastCheck: string;
      }>;
      culturalComplianceStatus: 'operational' | 'degraded' | 'offline';
      arabicProcessingStatus: 'operational' | 'degraded' | 'offline';
    }>
  > {
    const response = await fetch(`${this.baseUrl}/admin/system/health`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }
}

export default IraqiAdminService;
