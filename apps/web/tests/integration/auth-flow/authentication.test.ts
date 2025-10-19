/**
 * Integration tests for Authentication Flow
 * Tests Supabase auth integration with Iraqi cultural context
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { TEST_HELPERS, IRAQI_TEST_CONTEXT } from "../../setup/index.js";

describe("Authentication Flow Integration", () => {
  const API_BASE = "http://localhost:3000/api";
  let testUser: {
    email: string;
    password: string;
    profile: ReturnType<typeof TEST_HELPERS.createMockIraqiUser>;
  };

  beforeEach(() => {
    testUser = {
      email: `test-${Date.now()}@iraqi-ai.test`,
      password: "TestPassword123!",
      profile: TEST_HELPERS.createMockIraqiUser("baghdad"),
    };
  });

  afterEach(() => {
    TEST_HELPERS.clearAllMocks();
  });

  describe("User Registration", () => {
    test("should register new user with Iraqi profile", async () => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar-IQ",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: {
            name: testUser.profile.name,
            nameEnglish: testUser.profile.nameEnglish,
            dialect: testUser.profile.dialect,
            locale: testUser.profile.locale,
            timezone: testUser.profile.timezone,
          },
        }),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty("user");
      expect(data).toHaveProperty("session");
      expect(data.user).toHaveProperty("id");
      expect(data.user.email).toBe(testUser.email);

      // Verify Iraqi profile fields
      expect(data.user.profile).toHaveProperty("dialect");
      expect(data.user.profile.dialect).toBe("baghdad");
      expect(data.user.profile.locale).toBe("ar-IQ");
      expect(data.user.profile.timezone).toBe("Asia/Baghdad");
    });

    test("should validate Arabic name in profile", async () => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: {
            name: testUser.profile.name, // Arabic name
          },
        }),
      });

      const data = await response.json();
      expect(data.user.profile.name).toBeValidArabicText();
    });

    test("should set Baghdad timezone by default", async () => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: {
            name: testUser.profile.name,
          },
        }),
      });

      const data = await response.json();
      expect(data.user.profile.timezone).toBe(IRAQI_TEST_CONTEXT.timezone);
    });

    test("should reject weak passwords", async () => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: "weak",
          profile: testUser.profile,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty("error");
      expect(data.error).toMatch(/password/i);
    });

    test("should reject duplicate email registration", async () => {
      // First registration
      await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: testUser.profile,
        }),
      });

      // Duplicate registration
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: testUser.profile,
        }),
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      // Register user for login tests
      await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: testUser.profile,
        }),
      });
    });

    test("should login with valid credentials", async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar-IQ",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("user");
      expect(data).toHaveProperty("session");
      expect(data).toHaveProperty("accessToken");
      expect(data).toHaveProperty("refreshToken");

      // Verify session includes Iraqi context
      expect(data.session).toHaveProperty("locale");
      expect(data.session.locale).toBe("ar-IQ");
    });

    test("should reject invalid credentials", async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: "wrongpassword",
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    test("should return user profile with dialect preference", async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      const data = await response.json();
      expect(data.user.profile).toHaveProperty("dialect");
      expect(["baghdad", "basra", "mosul", "kurdish", "standard"]).toContain(
        data.user.profile.dialect,
      );
    });
  });

  describe("Session Management", () => {
    let sessionToken: string;

    beforeEach(async () => {
      // Register and login
      await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: testUser.profile,
        }),
      });

      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      const loginData = await loginResponse.json();
      sessionToken = loginData.accessToken;
    });

    test("should access protected routes with valid session", async () => {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Accept-Language": "ar-IQ",
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("profile");
    });

    test("should reject access without session token", async () => {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "GET",
      });

      expect(response.status).toBe(401);
    });

    test("should refresh session token", async () => {
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      const loginData = await loginResponse.json();
      const refreshToken = loginData.refreshToken;

      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("accessToken");
      expect(data).toHaveProperty("refreshToken");
    });

    test("should logout and invalidate session", async () => {
      const logoutResponse = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      expect(logoutResponse.status).toBe(200);

      // Try to access protected route after logout
      const protectedResponse = await fetch(`${API_BASE}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      expect(protectedResponse.status).toBe(401);
    });
  });

  describe("Profile Updates", () => {
    let sessionToken: string;

    beforeEach(async () => {
      // Setup authenticated user
      await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          profile: testUser.profile,
        }),
      });

      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      const loginData = await loginResponse.json();
      sessionToken = loginData.accessToken;
    });

    test("should update dialect preference", async () => {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          dialect: "basra",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.profile.dialect).toBe("basra");
    });

    test("should update cultural compliance preference", async () => {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          preferences: {
            culturalCompliance: "relaxed",
          },
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.profile.preferences.culturalCompliance).toBe("relaxed");
    });
  });
});
