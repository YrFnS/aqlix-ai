/**
 * Mock utilities for Iraqi payment gateways
 * Provides test mocks for ZainCash, FastPay, and NassWallet APIs
 */

import { mock } from "bun:test";

/**
 * Supported Iraqi payment gateways
 */
export type PaymentGateway = "zaincash" | "fastpay" | "nasswallet";

/**
 * Payment transaction status
 */
export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled";

/**
 * Configuration for mocking a payment gateway
 */
export interface MockPaymentConfig {
  /** Payment gateway to mock */
  gateway: PaymentGateway;
  /** Success rate (0.0 - 1.0) for simulating failures */
  successRate?: number;
  /** Simulated latency in ms */
  latency?: number;
  /** Predefined transaction responses */
  transactions?: Record<string, any>;
}

/**
 * Payment transaction initiation result
 */
export interface PaymentInitiationResult {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  redirectUrl?: string;
}

/**
 * Payment verification result
 */
export interface PaymentVerificationResult {
  transactionId: string;
  status: PaymentStatus;
  verified: boolean;
  amount?: number;
  currency?: string;
  timestamp?: string;
}

/**
 * Creates a mock Iraqi payment gateway for testing
 *
 * @example
 * ```typescript
 * const mockGateway = createMockPaymentGateway({
 *   gateway: "zaincash",
 *   successRate: 0.9
 * });
 *
 * const result = await mockGateway.initiate(1000, "IQD");
 * expect(result.status).toBe("pending");
 * ```
 */
export function createMockPaymentGateway(config: MockPaymentConfig) {
  const {
    gateway,
    successRate = 1.0,
    latency = 100,
    transactions = {},
  } = config;

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const shouldSucceed = () => Math.random() <= successRate;

  return {
    initiate: mock(
      async (
        amount: number,
        currency: string = "IQD",
      ): Promise<PaymentInitiationResult> => {
        await wait(latency);

        if (!shouldSucceed()) {
          throw new Error(
            `${gateway} payment gateway error: Transaction failed`,
          );
        }

        const transactionId = `${gateway}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          transactionId,
          status: "pending",
          amount,
          currency,
          gateway,
          redirectUrl: `https://${gateway}.example.com/payment/${transactionId}`,
        };
      },
    ),

    verify: mock(
      async (transactionId: string): Promise<PaymentVerificationResult> => {
        await wait(latency);

        if (transactions[transactionId]) {
          return transactions[transactionId];
        }

        if (!shouldSucceed()) {
          return {
            transactionId,
            status: "failed",
            verified: false,
          };
        }

        return {
          transactionId,
          status: "completed",
          verified: true,
          amount: 1000,
          currency: "IQD",
          timestamp: new Date().toISOString(),
        };
      },
    ),

    cancel: mock(async (transactionId: string): Promise<boolean> => {
      await wait(latency);
      return shouldSucceed();
    }),

    getStatus: mock(async (transactionId: string): Promise<PaymentStatus> => {
      await wait(latency);
      return transactions[transactionId]?.status || "completed";
    }),
  };
}

/**
 * Creates a mock for ZainCash payment gateway (minimum 1000 IQD)
 */
export function createMockZainCash(config: Partial<MockPaymentConfig> = {}) {
  return createMockPaymentGateway({
    gateway: "zaincash",
    ...config,
  });
}

/**
 * Creates a mock for FastPay payment gateway (minimum 500 IQD)
 */
export function createMockFastPay(config: Partial<MockPaymentConfig> = {}) {
  return createMockPaymentGateway({
    gateway: "fastpay",
    ...config,
  });
}

/**
 * Creates a mock for NassWallet payment gateway (minimum 1000 IQD)
 */
export function createMockNassWallet(config: Partial<MockPaymentConfig> = {}) {
  return createMockPaymentGateway({
    gateway: "nasswallet",
    ...config,
  });
}

/**
 * Creates a mock payment gateway that always fails
 */
export function createMockFailingGateway(gateway: PaymentGateway) {
  return createMockPaymentGateway({
    gateway,
    successRate: 0,
  });
}

/**
 * Creates a mock payment gateway with slow responses
 */
export function createMockSlowGateway(
  gateway: PaymentGateway,
  latencyMs: number = 3000,
) {
  return createMockPaymentGateway({
    gateway,
    latency: latencyMs,
  });
}
