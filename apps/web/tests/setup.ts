/**
 * Test Setup for Bun
 *
 * Configures happy-dom as the DOM environment for React component testing
 */

import { Window } from "happy-dom";

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

// Set global objects
global.window = window as any;
global.document = window.document as any;
global.navigator = window.navigator as any;
global.localStorage = window.localStorage as any;
global.sessionStorage = window.sessionStorage as any;
global.HTMLElement = window.HTMLElement as any;
global.Element = window.Element as any;
