/**
 * Test setup for Bun + React Testing Library
 * Configures DOM environment with happy-dom
 */

import { Window } from "happy-dom";

// Setup happy-dom window
const window = new Window();
const document = window.document;

// @ts-ignore - Set globals for testing
globalThis.window = window as unknown as Window & typeof globalThis;
globalThis.document = document;
globalThis.navigator = window.navigator;
globalThis.HTMLElement = window.HTMLElement as typeof HTMLElement;
globalThis.HTMLInputElement =
  window.HTMLInputElement as typeof HTMLInputElement;
globalThis.HTMLTextAreaElement =
  window.HTMLTextAreaElement as typeof HTMLTextAreaElement;

// @ts-ignore - Mock CompositionEvent for testing
globalThis.CompositionEvent = class CompositionEvent extends Event {
  data: string;
  constructor(
    type: string,
    options?: { data?: string; cancelable?: boolean; bubbles?: boolean },
  ) {
    super(type, { cancelable: options?.cancelable, bubbles: options?.bubbles });
    this.data = options?.data || "";
  }
} as any;

// Cleanup after all tests
globalThis.addEventListener("beforeExit", () => {
  window.close();
});
