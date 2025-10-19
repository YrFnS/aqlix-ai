/**
 * Test setup for testing-utils package
 * Configures DOM environment with happy-dom for testing utilities
 */

import { Window } from "happy-dom";

// Setup happy-dom window
const window = new Window();
const document = window.document;

// @ts-expect-error - Set globals for testing
globalThis.window = window as unknown as Window & typeof globalThis;
globalThis.document = document;
globalThis.navigator = window.navigator;
globalThis.HTMLElement = window.HTMLElement as typeof HTMLElement;
globalThis.HTMLInputElement =
  window.HTMLInputElement as typeof HTMLInputElement;
globalThis.HTMLTextAreaElement =
  window.HTMLTextAreaElement as typeof HTMLTextAreaElement;

// Cleanup after all tests
globalThis.addEventListener("beforeExit", () => {
  window.close();
});
