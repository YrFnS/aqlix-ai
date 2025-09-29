/**
 * Iraqi Enterprise Authentication - Comprehensive Test Suite
 * Government-grade testing for authentication system
 *
 * Test Categories:
 * - Unit tests for individual components
 * - Integration tests for ministry SSO
 * - Cultural compliance validation tests
 * - Security penetration testing scenarios
 * - Performance and load testing
 * - Biometric authentication testing
 * - Arabic RTL interface testing
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { IraqiEnterpriseAuth } from "../core/IraqiEnterpriseAuth";
import { BiometricAuthenticator } from "../biometric/BiometricAuthenticator";
import { IslamicComplianceManager } from "../cultural/IslamicComplianceManager";
import { MinistrySSO } from "../sso/MinistrySSO";

import type {
  IraqiUser,
  IraqiMinistry,
  SecurityClearance,
} from "../interfaces/types";
import type {
  AuthenticationCredentials,
  BiometricCredential,
} from "../interfaces/authentication";

// Test data factories
export class TestDataFactory {
  static createTestUser(
    ministry: IraqiMinistry,
    clearance: SecurityClearance,
  ): IraqiUser {
    return {
      id: `test-user-${Date.now()}`,
      employeeId: "EMP001",
      nationalId: "19850101001",
      name: {
        ar: "أحمد محمد علي",
        en: "Ahmed Mohammed Ali",
      },
      email: "ahmed.ali@health.gov.iq",
      phone: "+964770123456",
      ministry,
      department: "IT Department",
      position: "System Administrator",
      securityClearance: clearance,
      culturalProfile: {
        primaryLanguage: "ar",
        preferredScript: "arabic",
        prayerTimeNotifications: true,
        ramadanSchedule: true,
        islamicCalendarPreference: true,
        culturalSensitivityLevel: "standard",
        rtlDisplayPreference: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
    };
  }
}
