/**
 * Iraqi Enterprise Authentication - Session Management
 * Government-grade session management with cultural awareness
 */

import { IraqiUser, SecurityClearance, IraqiMinistry } from './types';
import { DeviceInfo, CulturalContext } from './authentication';

// Session Management
export interface AuthenticationSession {
  sessionId: string;
  userId: string;
  user: IraqiUser;
  authenticationMethods: string[]; // Methods used to authenticate
  securityLevel: SecurityLevel;
  ministry: IraqiMinistry;
  department: string;
  permissions: SessionPermission[];
  restrictions: SessionRestriction[];
  culturalSettings: SessionCulturalSettings;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress: string;
  deviceInfo: DeviceInfo;
  status: 'active' | 'idle' | 'expired' | 'terminated' | 'suspended';
  mfaVerified: boolean;
  biometricVerified: boolean;
}

export type SecurityLevel = 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';

export interface SessionPermission {
  resource: string;
  actions: PermissionAction[];
  scope: PermissionScope;
  conditions?: PermissionCondition[];
  expiresAt?: Date;
}export type PermissionAction = 
  | 'read' 
  | 'write' 
  | 'execute' 
  | 'delete' 
  | 'approve' 
  | 'audit' 
  | 'export'
  | 'print'
  | 'share';

export interface PermissionScope {
  ministry?: IraqiMinistry;
  department?: string;
  dataClassification?: SecurityLevel;
  geographicScope?: 'local' | 'governorate' | 'national' | 'international';
}

export interface PermissionCondition {
  type: 'time_based' | 'location_based' | 'approval_required' | 'cultural_compliance';
  parameters: Record<string, any>;
  message?: string;
  messageAr?: string;
}

export interface SessionRestriction {
  type: 'ip_whitelist' | 'device_only' | 'location_based' | 'time_window' | 'concurrent_limit';
  parameters: Record<string, any>;
  isActive: boolean;
  reason: string;
  reasonAr: string;
}export interface SessionCulturalSettings {
  prayerTimeNotifications: boolean;
  prayerTimeRestrictions: boolean;
  fridayRestrictions: boolean;
  ramadanMode: boolean;
  islamicCalendarEnabled: boolean;
  arabicInterface: boolean;
  rtlLayout: boolean;
  culturalContentFiltering: boolean;
  isGuardianApprovalRequired: boolean; // For accessing certain data types
}

// Session Events and Monitoring
export interface SessionEvent {
  eventId: string;
  sessionId: string;
  eventType: SessionEventType;
  timestamp: Date;
  details: Record<string, any>;
  riskScore: number; // 0-100
  culturalCompliance: boolean;
  requiresReview: boolean;
}

export type SessionEventType = 
  | 'login'
  | 'logout'
  | 'timeout'
  | 'permission_denied'
  | 'elevation_requested'
  | 'cultural_violation'
  | 'suspicious_activity'
  | 'location_change'
  | 'device_change'
  | 'mfa_challenge'
  | 'prayer_time_restriction';