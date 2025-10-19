/**
 * Test setup for @iraqi-ai/arabic-test-utils
 * Configures happy-dom and global test utilities
 */

import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Register happy-dom globals
GlobalRegistrator.register();

// Setup custom error handling for tests
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    console.error("Test error:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled rejection in test:", event.reason);
  });
}

// Cleanup after tests
if (typeof afterAll !== "undefined") {
  afterAll(() => {
    GlobalRegistrator.unregister();
  });
}

export {};
