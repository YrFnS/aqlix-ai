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

// Add Arabic font support using system fonts (no external dependencies)
// Tests don't need actual font rendering, so we use safe fallback fonts
const fontStyle = window.document.createElement("style");
fontStyle.textContent = `
  .font-arabic {
    font-family: 'Arial Unicode MS', 'DejaVu Sans', sans-serif;
    direction: rtl;
    text-align: right;
  }

  .rtl-layout {
    direction: rtl;
  }

  .ltr-layout {
    direction: ltr;
  }

  /* Iraqi AI specific styles - using system fonts for test reliability */
  body {
    font-family: 'Arial Unicode MS', 'DejaVu Sans', sans-serif;
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
// Properly accepts callback and options to support components that rely on intersection events
global.IntersectionObserver = class IntersectionObserver {
  private callback: IntersectionObserverCallback;
  private options?: IntersectionObserverInit;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.options = options;
  }

  disconnect() {}

  observe(target: Element) {
    // Simulate intersection by triggering callback with mock entry
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }

  unobserve() {}

  takeRecords() {
    return [];
  }
} as any;

// Mock ResizeObserver for component testing
// Properly accepts callback to support components that rely on resize events
global.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  disconnect() {}

  observe(target: Element) {
    // Simulate resize by triggering callback with mock entry
    this.callback(
      [
        {
          target,
          contentRect: {
            width: 1024,
            height: 768,
            top: 0,
            left: 0,
            bottom: 768,
            right: 1024,
            x: 0,
            y: 0,
          } as DOMRectReadOnly,
          borderBoxSize: [] as any,
          contentBoxSize: [] as any,
          devicePixelContentBoxSize: [] as any,
        } as ResizeObserverEntry,
      ],
      this,
    );
  }

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
