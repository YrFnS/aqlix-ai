/**
 * Iraqi Enterprise Authentication - Ministry RBAC System
 * Role-Based Access Control for Iraqi Government Ministries
 * 
 * Features:
 * - Ministry-specific role hierarchies
 * - Cross-ministry approval workflows
 * - Security clearance-based permissions
 * - Cultural compliance in authorization
 * - Department-level access controls
 * - Temporary delegation and approval mechanisms
 */

import { EventEmitter } from 'events';
import type { 
  IraqiMinistry, 
  IraqiUser, 
  SecurityClearance,
  MinistryConfiguration 
} from '../interfaces/types';
import type { 
  SessionPermission, 
  PermissionAction, 
  PermissionScope,
  PermissionCondition 
} from '../interfaces/session';

export interface MinistryRole {
  id: string;
  ministry: IraqiMinistry;
  name: string;
  nameAr: string;
  level: number; // 1-10, higher = more authority
  department?: string;
  securityClearanceRequired: SecurityClearance;
  permissions: MinistryPermission[];
  canDelegate: boolean;
  canApprove: string[]; // What types of requests can approve
  restrictions: RoleRestriction[];
  culturalRequirements: CulturalRequirement[];
}export interface MinistryPermission {
  resource: string; // e.g., 'patient_records', 'budget_data', 'citizen_info'
  actions: PermissionAction[];
  scope: MinistryPermissionScope;
  conditions: PermissionCondition[];
  dataClassification: 'public' | 'internal' | 'confidential' | 'secret';
  culturalSensitive: boolean; // Requires cultural compliance validation
  emergencyOverride: boolean; // Can be overridden in emergencies
}

export interface MinistryPermissionScope extends PermissionScope {
  ministry: IraqiMinistry;
  departments?: string[];
  regions?: string[]; // Iraqi governorates
  dataTypes?: string[]; // Specific data type restrictions
  timeWindow?: {
    start: string; // HH:MM
    end: string; // HH:MM
    excludeFridays?: boolean;
    excludeRamadan?: boolean;
  };
}

export interface RoleRestriction {
  type: 'time_based' | 'location_based' | 'approval_required' | 'cultural_compliance';
  parameters: Record<string, any>;
  severity: 'advisory' | 'warning' | 'blocking';
  message: string;
  messageAr: string;
}

export interface CulturalRequirement {
  type: 'islamic_compliance' | 'family_consent' | 'guardian_approval' | 'cultural_sensitivity';
  description: string;
  descriptionAr: string;
  required: boolean;
  conditionalOn?: string; // Condition when this requirement applies
}