// Global test setup for Iraqi AI Chat System
// This file is loaded before all tests via bun.json configuration

import { beforeAll, afterAll, beforeEach, afterEach } from "bun:test";

// Global test environment setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = "test";
  process.env.TESTING = "true";

  // ============================================================================
  // Test Environment Variables Configuration
  // ============================================================================
  // IMPORTANT: .env.local is NOT loaded in test environment by Bun
  // Set all required test environment variables here

  // Required for environment validation
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key-for-testing";
  process.env.NEXT_PUBLIC_CULTURAL_VALIDATION_ENABLED = "true";
  process.env.NEXT_PUBLIC_ARABIC_DIALECT_PROCESSING = "true";
  process.env.NEXT_PUBLIC_APP_ENV = "development";

  // Server-side environment variables (32+ characters for API_SECRET_KEY)
  process.env.API_SECRET_KEY = "test-secret-key-at-least-32-characters-long-for-testing";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key-for-testing";
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
  process.env.LLM_PROVIDER = "openai";
  process.env.LLM_API_KEY = "sk-test-key-for-testing";
  process.env.LLM_MODEL = "gpt-4o-mini";

  // Feature flags for testing
  process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES = "false";
  process.env.NEXT_PUBLIC_ENABLE_MULTIMODAL = "true";
  process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE = "false";

  // Initialize test database or mocks if needed
  console.log("🧪 Setting up Iraqi AI Chat System test environment...");
  console.log("  - NODE_ENV: test");
  console.log("  - Test environment variables configured");
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