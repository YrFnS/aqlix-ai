/**
 * Test environment configuration for Iraqi AI Chat System
 * Sets up happy-dom and configures React testing environment
 */

import { Window } from "happy-dom";

// Declare proper global types for TypeScript
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
  // eslint-disable-next-line no-var
  var location: Location;
  // eslint-disable-next-line no-var
  var history: History;
  // eslint-disable-next-line no-var
  var fetch: typeof globalThis.fetch;
}

// Create a happy-dom window with Iraqi AI specific configuration
const window = new Window({
  url: "http://localhost:3000",
  settings: {
    disableJavaScriptFileLoading: false,
    disableJavaScriptEvaluation: false,
    disableCSSFileLoading: false, // Enable CSS for RTL testing
    disableIframePageLoading: true,
    disableComputedStyleRendering: false, // Enable computed styles for RTL validation
  },
});

// Configure document for RTL testing by default
window.document.documentElement.setAttribute("dir", "rtl");
window.document.documentElement.setAttribute("lang", "ar-IQ");

// Add Arabic font support
const fontStyle = window.document.createElement("style");
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');

  .font-arabic {
    font-family: 'Noto Sans Arabic', 'Amiri', 'Arial Unicode MS', sans-serif;
    direction: rtl;
    text-align: right;
  }

  .rtl-layout {
    direction: rtl;
  }

  .ltr-layout {
    direction: ltr;
  }

  /* Iraqi AI specific styles */
  body {
    font-family: 'Noto Sans Arabic', sans-serif;
  }
`;
window.document.head.appendChild(fontStyle);

// Set global objects with proper types
global.window = window as Window & typeof globalThis;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = window.localStorage;
global.sessionStorage = window.sessionStorage;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;
global.location = window.location;
global.history = window.history;
global.fetch = window.fetch.bind(window);

// Mock Next.js router for testing
const mockRouter = {
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  reload: () => {},
  back: () => {},
  forward: () => {},
  prefetch: () => Promise.resolve(),
  beforePopState: () => {},
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  basePath: "",
  locale: "ar-IQ",
  locales: ["ar-IQ", "en"],
  defaultLocale: "ar-IQ",
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
  isFallback: false,
  events: {
    on: () => {},
    off: () => {},
    emit: () => {},
  },
};

// Make router available globally
(global as any).mockRouter = mockRouter;

// Mock IntersectionObserver for component testing
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as any;

// Mock ResizeObserver for component testing
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Cleanup after each test
if (typeof afterEach !== "undefined") {
  afterEach(() => {
    // Clear localStorage
    window.localStorage.clear();
    window.sessionStorage.clear();

    // Reset document direction
    window.document.documentElement.setAttribute("dir", "rtl");
    window.document.documentElement.setAttribute("lang", "ar-IQ");

    // Clear document body
    while (window.document.body.firstChild) {
      window.document.body.removeChild(window.document.body.firstChild);
    }
  });
}

// Global cleanup
if (typeof afterAll !== "undefined") {
  afterAll(async () => {
    await window.close();
  });
}

export { window };
