/**
 * Test Setup for Bun
 *
 * Configures happy-dom as the DOM environment for React component testing
 */

import { Window } from "happy-dom";

// Declare proper global types
// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var window: Window & typeof globalThis;
  // eslint-disable-next-line no-var
  var document: Document;
  // eslint-disable-next-line no-var
  var navigator: Navigator;
  // eslint-disable-next-line no-var
  var localStorage: Storage;
  // eslint-disable-next-line no-var
  var sessionStorage: Storage;
  // eslint-disable-next-line no-var
  var HTMLElement: typeof globalThis.HTMLElement;
  // eslint-disable-next-line no-var
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
