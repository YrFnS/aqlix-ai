/**
 * Test setup exports for Iraqi AI Chat System
 * Aggregates all test setup utilities for easy imports
 */

// Re-export global setup configuration
export {
  TEST_TIMEOUTS,
  TEST_CONFIG,
  IRAQI_TEST_CONTEXT,
} from "./global-setup.js";

// Re-export test environment
export { window } from "./test-env.js";

// Custom matchers are automatically extended via import
import "./custom-matchers.js";

// Helper utilities for tests
export const TEST_HELPERS = {
  /**
   * Creates a mock Iraqi user for testing
   */
  createMockIraqiUser: (
    dialect: "baghdad" | "basra" | "mosul" | "kurdish" = "baghdad",
  ) => ({
    id: `test-user-${Date.now()}`,
    name: "أحمد التجريبي",
    nameEnglish: "Ahmed Test",
    dialect,
    locale: "ar-IQ",
    timezone: "Asia/Baghdad",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "strict" as const,
    },
  }),

  /**
   * Creates mock Arabic content for testing
   */
  createMockArabicContent: (
    type: "formal" | "informal" | "professional" = "informal",
  ) => {
    const content = {
      formal: "السلام عليكم ورحمة الله وبركاته، نحن نخدم جميع العراقيين",
      informal: "شلونك؟ شكو ماكو اليوم؟",
      professional: "استشارة قانونية وفقاً للقانون العراقي",
    };
    return content[type];
  },

  /**
   * Waits for RTL layout to render
   */
  waitForRTL: async (
    element: HTMLElement,
    timeout: number = 5000,
  ): Promise<boolean> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const computedStyle = getComputedStyle(element);
      if (computedStyle.direction === "rtl") {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return false;
  },

  /**
   * Clears all test mocks
   */
  clearAllMocks: () => {
    if (typeof global !== "undefined" && (global as any).mockRouter) {
      (global as any).mockRouter = {
        ...(global as any).mockRouter,
        push: () => Promise.resolve(true),
        replace: () => Promise.resolve(true),
      };
    }
  },
};
