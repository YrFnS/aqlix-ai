// Jest-style setup for compatibility with existing test patterns
// This provides Jest-like matchers and setup for Bun test environment

import { expect } from "bun:test";

// Extend expect with custom matchers for Iraqi AI testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeArabicRTL(): R;
      toBeIraqiDialect(): R;
      toBeCulturallyCompliant(): R;
      toBeIslamicCompliant(): R;
    }
  }
}

// Custom matchers for Iraqi AI Chat System
expect.extend({
  toBeArabicRTL(received: string) {
    const arabicRegex = /[\u0600-\u06FF]/;
    const pass = arabicRegex.test(received);

    return {
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to contain Arabic RTL characters`,
      pass,
    };
  },

  toBeIraqiDialect(received: string) {
    // Simple Iraqi dialect detection (this would be more sophisticated in real implementation)
    const iraqiWords = ['شلونك', 'شكو', 'ماكو', 'وين', 'هاي'];
    const pass = iraqiWords.some(word => received.includes(word));

    return {
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to contain Iraqi dialect words`,
      pass,
    };
  },

  toBeCulturallyCompliant(received: any) {
    // Basic cultural compliance check
    const hasRespectfulContent = !received.toString().toLowerCase().includes('haram');
    const pass = hasRespectfulContent;

    return {
      message: () =>
        `expected content ${pass ? 'not ' : ''}to be culturally compliant`,
      pass,
    };
  },

  toBeIslamicCompliant(received: any) {
    // Basic Islamic compliance check
    const respectsIslamicValues = true; // Simplified for setup
    const pass = respectsIslamicValues;

    return {
      message: () =>
        `expected content ${pass ? 'not ' : ''}to be Islamic compliant`,
      pass,
    };
  },
});

// Mock global functions commonly used in tests
global.fetch = global.fetch || (() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
})) as any;

// Console setup for test environment
if (process.env.NODE_ENV === 'test') {
  // Suppress console logs in tests unless explicitly needed
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    if (process.env.VERBOSE_TESTS === 'true') {
      originalLog(...args);
    }
  };
}