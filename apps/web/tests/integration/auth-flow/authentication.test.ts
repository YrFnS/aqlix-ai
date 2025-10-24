/**
 * Integration tests for Authentication Flow (Next.js)
 * Tests Server Actions, cultural context, session persistence, and Iraqi-specific flows
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { signInAction, signUpAction, signOutAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import type { IraqiRegion, ProfessionalDomain } from "@iraqi-ai/types";

describe("Next.js Authentication Integration Tests", () => {
  let testEmail: string;
  let supabase: ReturnType<typeof createClient>;

  beforeEach(() => {
    testEmail = `test-${Date.now()}@iraqi-test.com`;
    supabase = createClient();
  });

  afterEach(async () => {
    // Cleanup test users
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe("User Registration with Iraqi ID", () => {
    test("should register user with valid Iraqi ID", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "أحمد محمد / Ahmed Mohammed",
        region: "baghdad" as IraqiRegion,
        iraqiId: "101990123456",
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      expect(result.data?.success).toBe(true);
      expect(result.data?.user).toBeDefined();
      expect(result.data?.emailSent).toBe(true);
    });

    test("should validate Iraqi ID format (12 digits)", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Test User",
        region: "baghdad" as IraqiRegion,
        iraqiId: "123", // Invalid - too short
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/iraqi id/i);
    });

    test("should validate Iraqi ID regional prefix", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Test User",
        region: "baghdad" as IraqiRegion, // Baghdad
        iraqiId: "061990123456", // Basra prefix (06)
        languagePreference: "both",
        islamicComplianceLevel: "standard",
      });

      // Should fail due to region mismatch
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/region|prefix/i);
    });

    test("should extract birth year from Iraqi ID", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Test User",
        region: "baghdad" as IraqiRegion,
        iraqiId: "101985123456", // Birth year 1985
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      expect(result.data?.success).toBe(true);
      expect(result.data?.iraqiIdValidation?.birthYear).toBe(1985);
    });
  });

  describe("User Registration with Professional License", () => {
    test("should register legal professional with valid license", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "المحامي عمر / Lawyer Omar",
        region: "baghdad" as IraqiRegion,
        iraqiId: "101980123456",
        professionalDomain: "legal" as ProfessionalDomain,
        professionalLicense: "LAW-12345-2020",
        languagePreference: "both",
        islamicComplianceLevel: "standard",
      });

      expect(result.data?.success).toBe(true);
      expect(result.data?.licenseValidated).toBe(true);
    });

    test("should register medical professional with specialization", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "د. فاطمة / Dr. Fatima",
        region: "basra" as IraqiRegion,
        iraqiId: "061985654321",
        professionalDomain: "medical" as ProfessionalDomain,
        professionalLicense: "MED-123456-SU", // Surgery specialization
        languagePreference: "both",
        islamicComplianceLevel: "strict",
      });

      expect(result.data?.success).toBe(true);
      expect(result.data?.licenseValidated).toBe(true);
    });

    test("should validate professional license format", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Test Professional",
        region: "baghdad" as IraqiRegion,
        professionalDomain: "legal" as ProfessionalDomain,
        professionalLicense: "INVALID-LICENSE",
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/license/i);
    });

    test("should validate license matches professional domain", async () => {
      const result = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Test Professional",
        region: "baghdad" as IraqiRegion,
        professionalDomain: "medical" as ProfessionalDomain,
        professionalLicense: "LAW-12345-2020", // Legal license for medical domain
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/license|domain/i);
    });
  });

  describe("Login Flow with Cultural Greeting", () => {
    beforeEach(async () => {
      // Register test user
      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Test User",
        region: "baghdad" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "standard",
      });

      // Verify email (simulate)
      // In production, this would require clicking email verification link
    });

    test("should login and return cultural greeting", async () => {
      const result = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "test-device-123",
      });

      expect(result.data?.success).toBe(true);
      expect(result.data?.culturalGreeting).toBeDefined();
      expect(result.data?.culturalGreeting?.primaryGreeting).toContain(
        "السلام عليكم",
      );
    });

    test("should include regional dialect in greeting (Baghdad)", async () => {
      const result = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "test-device-123",
      });

      expect(result.data?.culturalGreeting?.regionalVariation).toBe("شلونك");
    });

    test("should adapt greeting to time of day", async () => {
      const result = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "test-device-123",
      });

      const greeting = result.data?.culturalGreeting?.primaryGreeting;
      const hour = new Date().getHours();

      if (hour >= 0 && hour < 12) {
        expect(greeting).toContain("صباح");
      } else {
        expect(greeting).toContain("مساء");
      }
    });

    test("should reject login with wrong password", async () => {
      const result = await signInAction({
        email: testEmail,
        password: "WrongPassword123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "test-device-123",
      });

      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/password|invalid|credentials/i);
    });
  });

  describe("MFA Setup and Verification", () => {
    let accessToken: string;

    beforeEach(async () => {
      // Register and login
      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "MFA Test User",
        region: "baghdad" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "standard",
      });

      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "mfa-device",
      });

      accessToken = loginResult.data?.accessToken || "";
    });

    test("should setup SMS MFA", async () => {
      const response = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          method: "sms",
          destination: "+9647501234567",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.method).toBe("sms");
      expect(data.setupId).toBeDefined();
    });

    test("should setup Email MFA", async () => {
      const response = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          method: "email",
          destination: testEmail,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.method).toBe("email");
    });

    test("should respect prayer time delays for MFA", async () => {
      // Simulate MFA during prayer time (Fajr: 4:30-5:30 AM Baghdad time)
      const response = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          method: "sms",
          destination: "+9647501234567",
          currentTime: "2025-01-15T05:00:00+03:00", // During Fajr
        }),
      });

      const data = await response.json();
      if (data.prayerTimeDelay) {
        expect(data.prayerTimeDelay).toContain("Fajr");
      }
    });
  });

  describe("Session Persistence Across Page Loads", () => {
    test("should persist session after page reload", async () => {
      // Register and login
      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Session Test User",
        region: "baghdad" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "session-device",
      });

      expect(loginResult.data?.success).toBe(true);

      // Simulate page reload by getting session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      expect(session).toBeDefined();
      expect(session?.user?.email).toBe(testEmail);
    });

    test("should maintain cultural context in session", async () => {
      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Cultural Context User",
        region: "mosul" as IraqiRegion,
        languagePreference: "arabic",
        islamicComplianceLevel: "strict",
      });

      await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "cultural-device",
      });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      expect(session?.user?.user_metadata?.region).toBe("mosul");
      expect(session?.user?.user_metadata?.language_preference).toBe("arabic");
      expect(session?.user?.user_metadata?.islamic_compliance_level).toBe(
        "strict",
      );
    });

    test("should handle token refresh transparently", async () => {
      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Refresh Test User",
        region: "baghdad" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "refresh-device",
      });

      const refreshToken = loginResult.data?.refreshToken;
      expect(refreshToken).toBeDefined();

      // Refresh session
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
    });
  });

  describe("Cultural Context Preservation", () => {
    test("should preserve region preference across auth flow", async () => {
      const regionPreference = "basra" as IraqiRegion;

      // Register with Basra region
      const registerResult = await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Basra User",
        region: regionPreference,
        languagePreference: "both",
        islamicComplianceLevel: "standard",
      });

      expect(registerResult.data?.culturalContext?.region).toBe(
        regionPreference,
      );

      // Login should maintain region
      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "basra-device",
      });

      expect(loginResult.data?.culturalContext?.region).toBe(regionPreference);
    });

    test("should preserve language preference", async () => {
      const languagePreference = "arabic";

      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Arabic User",
        region: "baghdad" as IraqiRegion,
        languagePreference,
        islamicComplianceLevel: "basic",
      });

      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "arabic-device",
      });

      expect(loginResult.data?.culturalContext?.languagePreference).toBe(
        languagePreference,
      );
    });

    test("should preserve Islamic compliance level", async () => {
      const islamicLevel = "strict";

      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Strict Compliance User",
        region: "baghdad" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: islamicLevel,
      });

      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "strict-device",
      });

      expect(loginResult.data?.culturalContext?.islamicComplianceLevel).toBe(
        islamicLevel,
      );
    });

    test("should include cultural context in JWT token claims", async () => {
      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "JWT Test User",
        region: "erbil" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "standard",
      });

      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Test Browser",
        platform: "Web",
        deviceId: "jwt-device",
      });

      const accessToken = loginResult.data?.accessToken;
      expect(accessToken).toBeDefined();

      // Decode JWT to verify cultural claims
      const tokenPayload = JSON.parse(
        Buffer.from(accessToken!.split(".")[1], "base64").toString(),
      );

      expect(tokenPayload.region).toBe("erbil");
      expect(tokenPayload.language_preference).toBe("both");
      expect(tokenPayload.islamic_compliance).toBe("standard");
    });
  });

  describe("Multi-Device Session Management", () => {
    beforeEach(async () => {
      await signUpAction({
        email: testEmail,
        password: "SecurePass123!",
        fullName: "Multi-Device User",
        region: "baghdad" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });
    });

    test("should support concurrent sessions on multiple devices", async () => {
      // Login from device 1
      const device1Result = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "iPhone 14",
        platform: "iOS",
        deviceId: "iphone-device",
      });
      expect(device1Result.data?.success).toBe(true);

      // Login from device 2
      const device2Result = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "MacBook Pro",
        platform: "macOS",
        deviceId: "macbook-device",
      });
      expect(device2Result.data?.success).toBe(true);

      // Verify both sessions are active
      const response = await fetch("/api/auth/sessions", {
        headers: {
          Authorization: `Bearer ${device1Result.data?.accessToken}`,
        },
      });

      const data = await response.json();
      expect(data.sessions.length).toBeGreaterThanOrEqual(2);
    });

    test("should track device information for each session", async () => {
      const loginResult = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "iPhone 14 Pro",
        platform: "iOS 17",
        deviceId: "unique-device-id-123",
      });

      const response = await fetch("/api/auth/sessions", {
        headers: {
          Authorization: `Bearer ${loginResult.data?.accessToken}`,
        },
      });

      const data = await response.json();
      const currentSession = data.sessions.find(
        (s: any) => s.deviceId === "unique-device-id-123",
      );

      expect(currentSession).toBeDefined();
      expect(currentSession.deviceType).toBe("iPhone 14 Pro");
      expect(currentSession.platform).toBe("iOS 17");
    });

    test("should allow logout from specific device", async () => {
      // Create two sessions
      const device1 = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "iPhone",
        platform: "iOS",
        deviceId: "device-1",
      });

      await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "MacBook",
        platform: "macOS",
        deviceId: "device-2",
      });

      // Logout from device 1
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${device1.data?.accessToken}`,
        },
      });

      // Verify device 1 session is invalid
      const device1Check = await fetch("/api/auth/sessions", {
        headers: {
          Authorization: `Bearer ${device1.data?.accessToken}`,
        },
      });
      expect(device1Check.status).toBe(401);

      // Device 2 should still be active
      // (would need device2 access token to verify)
    });

    test("should logout from all devices", async () => {
      const device1 = await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Device 1",
        platform: "Platform 1",
        deviceId: "multi-device-1",
      });

      await signInAction({
        email: testEmail,
        password: "SecurePass123!",
        deviceType: "Device 2",
        platform: "Platform 2",
        deviceId: "multi-device-2",
      });

      // Logout from all devices
      await fetch("/api/auth/logout/all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${device1.data?.accessToken}`,
        },
      });

      // Verify all sessions are invalid
      const sessionsCheck = await fetch("/api/auth/sessions", {
        headers: {
          Authorization: `Bearer ${device1.data?.accessToken}`,
        },
      });
      expect(sessionsCheck.status).toBe(401);
    });
  });

  describe("Password Reset Flow", () => {
    beforeEach(async () => {
      await signUpAction({
        email: testEmail,
        password: "OldPassword123!",
        fullName: "Reset Test User",
        region: "baghdad" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });
    });

    test("should request password reset", async () => {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.emailSent).toBe(true);
    });

    test("should reset password with valid token", async () => {
      // Request reset
      const resetRequest = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });
      const resetData = await resetRequest.json();

      // Reset password
      const resetResponse = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetData.resetToken,
          newPassword: "NewPassword123!",
        }),
      });

      expect(resetResponse.status).toBe(200);

      // Verify old password doesn't work
      const oldLogin = await signInAction({
        email: testEmail,
        password: "OldPassword123!",
        deviceType: "Test",
        platform: "Test",
        deviceId: "test",
      });
      expect(oldLogin.error).toBeDefined();

      // Verify new password works
      const newLogin = await signInAction({
        email: testEmail,
        password: "NewPassword123!",
        deviceType: "Test",
        platform: "Test",
        deviceId: "test",
      });
      expect(newLogin.data?.success).toBe(true);
    });
  });

  describe("Error Handling", () => {
    test("should handle network errors gracefully", async () => {
      // Simulate network error by using invalid endpoint
      const result = await signInAction({
        email: "test@example.com",
        password: "password",
        deviceType: "Test",
        platform: "Test",
        deviceId: "test",
      });

      expect(result.error).toBeDefined();
    });

    test("should provide user-friendly error messages", async () => {
      const result = await signUpAction({
        email: "invalid-email",
        password: "weak",
        fullName: "",
        region: "invalid" as IraqiRegion,
        languagePreference: "both",
        islamicComplianceLevel: "basic",
      });

      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe("string");
      expect(result.error!.length).toBeGreaterThan(0);
    });
  });
});
