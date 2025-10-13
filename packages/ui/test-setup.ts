/**
 * Test setup for Bun + React Testing Library
 * Configures DOM environment with happy-dom
 */

import { Window } from "happy-dom";

// Setup happy-dom window
const window = new Window();
const document = window.document;

// @ts-expect-error - Set globals for testing (type augmentation preferred in test-globals.d.ts)
globalThis.window = window as unknown as Window & typeof globalThis;
globalThis.document = document;
globalThis.navigator = window.navigator;
globalThis.HTMLElement = window.HTMLElement as typeof HTMLElement;
globalThis.HTMLInputElement =
  window.HTMLInputElement as typeof HTMLInputElement;
globalThis.HTMLTextAreaElement =
  window.HTMLTextAreaElement as typeof HTMLTextAreaElement;

// @ts-expect-error - Mock CompositionEvent for testing (type augmentation preferred in test-globals.d.ts)
globalThis.CompositionEvent = class CompositionEvent extends Event {
  data: string;
  constructor(
    type: string,
    options?: { data?: string; cancelable?: boolean; bubbles?: boolean },
  ) {
    super(type, { cancelable: options?.cancelable, bubbles: options?.bubbles });
    this.data = options?.data || "";
  }
} as unknown as typeof CompositionEvent;

// Cleanup after all tests
globalThis.addEventListener("beforeExit", () => {
  window.close();
});
