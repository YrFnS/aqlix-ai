/**
 * Iraqi Enterprise Authentication - Threat Detection Engine
 * Real-time security threat detection and response
 *
 * Features:
 * - Anomaly detection for authentication patterns
 * - Geolocation-based threat assessment
 * - Device fingerprinting and behavioral analysis
 * - Cultural context-aware threat detection
 * - Integration with Iraqi security databases
 * - Real-time threat intelligence feeds
 */

import { EventEmitter } from "events";
import type { IraqiUser, IraqiMinistry } from "../interfaces/types";
import type { DeviceInfo } from "../interfaces/authentication";
import type { AuthenticationSession } from "../interfaces/session";

export interface ThreatDetectionResult {
  threatLevel: "none" | "low" | "medium" | "high" | "critical";
  threatScore: number; // 0-100
  threats: DetectedThreat[];
  recommendations: ThreatRecommendation[];
  requiresIntervention: boolean;
  blockAccess: boolean;
  culturalAnomalies: CulturalAnomaly[];
}

export interface DetectedThreat {
  type: ThreatType;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  evidence: Record<string, any>;
  confidence: number; // 0-100
  source: string; // Detection source
  timestamp: Date;
  mitigationRequired: boolean;
}

export type ThreatType =
  | "credential_stuffing"
  | "brute_force_attack"
  | "suspicious_location"
  | "device_anomaly"
  | "behavioral_anomaly"
  | "time_anomaly"
  | "privilege_escalation"
  | "session_hijacking"
  | "cultural_violation"
  | "insider_threat"
  | "foreign_access"
  | "data_exfiltration"
  | "unauthorized_access";

export interface CulturalAnomaly {
  type:
    | "prayer_time_violation"
    | "inappropriate_timing"
    | "cultural_insensitivity";
  description: string;
  severity: "low" | "medium" | "high";
  context: string;
  recommendation: string;
}
