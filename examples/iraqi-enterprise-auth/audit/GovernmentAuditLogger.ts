/**
 * Iraqi Enterprise Authentication - Government Audit Logger
 * Comprehensive audit logging for Iraqi government compliance
 *
 * Features:
 * - 7-year retention for government compliance
 * - Ministry-specific audit requirements
 * - Real-time security monitoring
 * - Cultural compliance tracking
 * - Encrypted audit trail with integrity verification
 * - Export capabilities for government oversight
 */

import { EventEmitter } from "events";
import type {
  IraqiMinistry,
  IraqiUser,
  SecurityClearance,
} from "../interfaces/types";
import type {
  AuthenticationSession,
  SessionEvent,
} from "../interfaces/session";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  hijriDate: string; // Islamic calendar date
  eventType: AuditEventType;
  severity: "info" | "warning" | "error" | "critical";

  // User information
  userId: string;
  sessionId?: string;
  ministry: IraqiMinistry;
  department?: string;
  securityClearance: SecurityClearance;

  // Authentication context
  authMethod: string[];
  deviceId: string;
  ipAddress: string;
  location?: {
    country: string;
    governorate: string;
    city: string;
  };

  // Event details
  resource: string;
  action: string;
  result: "success" | "failure" | "blocked" | "pending";
  details: Record<string, any>;

  // Cultural and compliance
  culturalCompliance: boolean;
  islamicCompliance: boolean;
  prayerTimeContext?: string;

  // Security and risk assessment
  riskLevel: "low" | "medium" | "high" | "critical";
  threatScore: number; // 0-100
  anomalyScore: number; // 0-100

  // Integrity and verification
  hash: string; // SHA-256 hash of entry
  signature?: string; // Digital signature
  verified: boolean;
}
export type AuditEventType =
  | "authentication_attempt"
  | "authentication_success"
  | "authentication_failure"
  | "session_created"
  | "session_expired"
  | "session_terminated"
  | "permission_granted"
  | "permission_denied"
  | "privilege_escalation"
  | "cross_ministry_access"
  | "biometric_enrollment"
  | "biometric_authentication"
  | "mfa_challenge"
  | "mfa_success"
  | "mfa_failure"
  | "cultural_violation"
  | "prayer_time_restriction"
  | "security_incident"
  | "data_access"
  | "data_modification"
  | "data_export"
  | "policy_violation"
  | "threat_detected"
  | "anomaly_detected"
  | "system_error";

export interface AuditConfiguration {
  retentionYears: number; // Default: 7 for government compliance
  encryptionEnabled: boolean;
  compressionEnabled: boolean;
  realtimeMonitoring: boolean;
  exportEnabled: boolean;
  integrityValidation: boolean;

  // Ministry-specific settings
  ministryReporting: boolean;
  crossMinistryTracking: boolean;
  culturalComplianceTracking: boolean;

  // Storage and performance
  batchSize: number;
  flushInterval: number; // milliseconds
  archiveAfterMonths: number;

  // Alerts and monitoring
  alertOnCritical: boolean;
  alertOnAnomalies: boolean;
  alertThreshold: number; // Anomaly score threshold
}
