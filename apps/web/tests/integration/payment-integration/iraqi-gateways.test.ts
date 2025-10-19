/**
 * Integration tests for Iraqi Payment Gateway Integration
 * Tests ZainCash, FastPay, and NassWallet with security validation
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { TEST_HELPERS, IRAQI_TEST_CONTEXT } from "../../setup/index.js";
import { createMockPaymentGateway } from "@iraqi-ai/testing-utils/mocks";

describe("Iraqi Payment Gateway Integration", () => {
  const API_BASE = "http://localhost:3000/api";
  let mockUser: ReturnType<typeof TEST_HELPERS.createMockIraqiUser>;
  let sessionToken: string;

  beforeEach(async () => {
    mockUser = TEST_HELPERS.createMockIraqiUser("baghdad");

    // Login and get session token (simplified for tests)
    sessionToken = "mock-session-token-" + Date.now();
  });

  afterEach(() => {
    TEST_HELPERS.clearAllMocks();
  });

  describe("ZainCash Payment Gateway", () => {
    test("should initiate ZainCash payment (minimum 1000 IQD)", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
          "Accept-Language": "ar-IQ",
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 1000,
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("transactionId");
      expect(data).toHaveProperty("paymentUrl");
      expect(data).toHaveProperty("status");
      expect(data.status).toBe("pending");
      expect(data.gateway).toBe("zaincash");
      expect(data.amount).toBe(1000);
      expect(data.currency).toBe("IQD");
    });

    test("should reject ZainCash payment below minimum (< 1000 IQD)", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 500, // Below minimum
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty("error");
      expect(data.error).toMatch(/minimum.*1000/i);
    });

    test("should verify ZainCash payment completion", async () => {
      // Initiate payment
      const initiateResponse = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 5000,
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      const initiateData = await initiateResponse.json();
      const transactionId = initiateData.transactionId;

      // Verify payment (simulated)
      const verifyResponse = await fetch(`${API_BASE}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          transactionId,
          gateway: "zaincash",
        }),
      });

      expect(verifyResponse.status).toBe(200);
      const verifyData = await verifyResponse.json();
      expect(verifyData).toHaveProperty("status");
      expect(["completed", "pending", "failed"]).toContain(verifyData.status);
      expect(verifyData).toHaveProperty("verified");
    });
  });

  describe("FastPay Payment Gateway", () => {
    test("should initiate FastPay payment (minimum 500 IQD)", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "fastpay",
          amount: 500,
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.gateway).toBe("fastpay");
      expect(data.amount).toBe(500);
    });

    test("should reject FastPay payment below minimum (< 500 IQD)", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "fastpay",
          amount: 250, // Below minimum
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toMatch(/minimum.*500/i);
    });
  });

  describe("NassWallet Payment Gateway", () => {
    test("should initiate NassWallet payment (minimum 1000 IQD)", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "nasswallet",
          amount: 1000,
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.gateway).toBe("nasswallet");
      expect(data.amount).toBe(1000);
    });

    test("should reject NassWallet payment below minimum (< 1000 IQD)", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "nasswallet",
          amount: 750, // Below minimum
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("Payment Gateway Failover", () => {
    test("should attempt failover when primary gateway fails", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 5000,
          currency: "IQD",
          userId: mockUser.id,
          enableFailover: true,
          fallbackGateways: ["fastpay", "nasswallet"],
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty("gateway");
      expect(data).toHaveProperty("status");

      // If ZainCash failed, should have attempted fallback
      if (data.status === "failed" && data.failoverAttempted) {
        expect(data).toHaveProperty("fallbackGateway");
        expect(["fastpay", "nasswallet"]).toContain(data.fallbackGateway);
      }
    });
  });

  describe("Payment Security", () => {
    test("should require authentication for payment initiation", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No Authorization header
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 1000,
          currency: "IQD",
        }),
      });

      expect(response.status).toBe(401);
    });

    test("should validate transaction IDs for verification", async () => {
      const response = await fetch(`${API_BASE}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          transactionId: "invalid-transaction-id",
          gateway: "zaincash",
        }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    test("should prevent duplicate payment processing", async () => {
      // Initiate payment
      const initiateResponse = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 2000,
          currency: "IQD",
          userId: mockUser.id,
          idempotencyKey: "test-idempotency-key",
        }),
      });

      expect(initiateResponse.status).toBe(200);

      // Try duplicate with same idempotency key
      const duplicateResponse = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 2000,
          currency: "IQD",
          userId: mockUser.id,
          idempotencyKey: "test-idempotency-key", // Same key
        }),
      });

      // Should return same transaction or reject
      expect([200, 409]).toContain(duplicateResponse.status);
    });

    test("should log all payment attempts for audit", async () => {
      const response = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          gateway: "zaincash",
          amount: 3000,
          currency: "IQD",
          userId: mockUser.id,
        }),
      });

      const data = await response.json();

      // Check audit log
      const auditResponse = await fetch(
        `${API_BASE}/payments/audit?transactionId=${data.transactionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      expect(auditResponse.status).toBe(200);
      const auditData = await auditResponse.json();
      expect(auditData).toHaveProperty("logs");
      expect(Array.isArray(auditData.logs)).toBe(true);
      expect(auditData.logs.length).toBeGreaterThan(0);
    });
  });

  describe("Payment History", () => {
    test("should retrieve user payment history", async () => {
      const response = await fetch(
        `${API_BASE}/payments/history?userId=${mockUser.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Accept-Language": "ar-IQ",
          },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("payments");
      expect(Array.isArray(data.payments)).toBe(true);

      // Each payment should have required fields
      if (data.payments.length > 0) {
        const payment = data.payments[0];
        expect(payment).toHaveProperty("transactionId");
        expect(payment).toHaveProperty("gateway");
        expect(payment).toHaveProperty("amount");
        expect(payment).toHaveProperty("currency");
        expect(payment).toHaveProperty("status");
        expect(payment).toHaveProperty("timestamp");
      }
    });

    test("should filter payment history by gateway", async () => {
      const response = await fetch(
        `${API_BASE}/payments/history?userId=${mockUser.id}&gateway=zaincash`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      );

      const data = await response.json();
      expect(data).toHaveProperty("payments");

      // All payments should be from ZainCash
      data.payments.forEach((payment: any) => {
        expect(payment.gateway).toBe("zaincash");
      });
    });
  });
});
