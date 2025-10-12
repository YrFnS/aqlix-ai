/**
 * Test Setup for Bun
 *
 * Configures happy-dom as the DOM environment for React component testing
 */

import { Window } from "happy-dom";

// Declare proper global types
declare global {
  var window: Window & typeof globalThis;
  var document: Document;
  var navigator: Navigator;
  var localStorage: Storage;
  var sessionStorage: Storage;
  var HTMLElement: typeof globalThis.HTMLElement;
  var Element: typeof globalThis.Element;
}

// Create a happy-dom window and set up globals
const window = new Window({
  url: "http://localhost:3000",
  settings: {
    disableJavaScriptFileLoading: false,
    disableJavaScriptEvaluation: false,
    disableCSSFileLoading: true,
    disableIframePageLoading: true,
  },
});

// Set global objects with proper types
global.window = window as Window & typeof globalThis;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = window.localStorage;
global.sessionStorage = window.sessionStorage;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;
