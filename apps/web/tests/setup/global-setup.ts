/**
 * Global test setup for Iraqi AI Chat System
 * Configures environment, imports testing utilities, and sets up cultural context
 */

import "@iraqi-ai/testing-utils";
import "@iraqi-ai/cultural-validators";
import "@iraqi-ai/arabic-test-utils";

// Set global environment variables for testing
process.env.NODE_ENV = "test";
process.env.CULTURAL_COMPLIANCE = "strict";
process.env.RTL_TESTING = "enabled";
process.env.ARABIC_VALIDATION = "enabled";
process.env.ISLAMIC_COMPLIANCE = "strict";

// Configure Iraqi timezone for testing
process.env.TZ = "Asia/Baghdad";

// Configure test timeouts
const DEFAULT_TIMEOUT = 30000; // 30 seconds for cultural validation
const RTL_TIMEOUT = 10000; // 10 seconds for RTL rendering
const FONT_TIMEOUT = 5000; // 5 seconds for Arabic font loading

export const TEST_TIMEOUTS = {
  default: DEFAULT_TIMEOUT,
  rtl: RTL_TIMEOUT,
  font: FONT_TIMEOUT,
};

// Test configuration
export const TEST_CONFIG = {
  culturalCompliance: {
    minScore: 0.95,
    islamicCompliance: true,
    politicalNeutrality: true,
  },
  arabicTesting: {
    rtlAccuracy: 0.99,
    dialectRecognition: 0.85,
    fontRendering: 0.95,
  },
  performance: {
    maxCulturalValidationTime: 200, // ms
    maxArabicProcessingTime: 100, // ms
  },
};

// Global test utilities
export const IRAQI_TEST_CONTEXT = {
  timezone: "Asia/Baghdad",
  locale: "ar-IQ",
  currency: "IQD",
  defaultDialect: "baghdad" as const,
  supportedDialects: [
    "baghdad",
    "basra",
    "mosul",
    "kurdish",
    "standard",
  ] as const,
};

// Export for use in tests
if (typeof global !== "undefined") {
  (global as any).TEST_TIMEOUTS = TEST_TIMEOUTS;
  (global as any).TEST_CONFIG = TEST_CONFIG;
  (global as any).IRAQI_TEST_CONTEXT = IRAQI_TEST_CONTEXT;
}

console.log("✅ Global test setup completed - Iraqi AI Chat System");
console.log(
  `   - Cultural compliance: ${TEST_CONFIG.culturalCompliance.minScore * 100}%`,
);
console.log(
  `   - RTL accuracy: ${TEST_CONFIG.arabicTesting.rtlAccuracy * 100}%`,
);
console.log(
  `   - Dialect recognition: ${TEST_CONFIG.arabicTesting.dialectRecognition * 100}%`,
);
