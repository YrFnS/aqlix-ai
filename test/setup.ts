// Global test setup for Iraqi AI Chat System
// This file is loaded before all tests via bun.json configuration

import { beforeAll, afterAll, beforeEach, afterEach } from "bun:test";

// Global test environment setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = "test";
  process.env.TESTING = "true";

  // Initialize test database or mocks if needed
  console.log("🧪 Setting up Iraqi AI Chat System test environment...");
});

afterAll(async () => {
  // Cleanup test environment
  console.log("🧹 Cleaning up test environment...");
});

beforeEach(() => {
  // Reset any global state before each test
});

afterEach(() => {
  // Cleanup after each test
});

// Global test utilities
declare global {
  namespace globalThis {
    var testUtils: {
      mockArabicText: (text: string) => string;
      mockIraqiDialect: (text: string) => string;
      createMockUser: () => any;
    };
  }
}

// Test utilities for Iraqi AI specific testing
globalThis.testUtils = {
  mockArabicText: (text: string) => `ar:${text}`,
  mockIraqiDialect: (text: string) => `iq:${text}`,
  createMockUser: () => ({
    id: "test-user-123",
    name: "Test User",
    language: "ar-IQ",
    preferences: {
      rtl: true,
      dialect: "iraqi"
    }
  })
};