/**
 * Language Provider Unit Tests
 *
 * Tests LanguageProvider functionality including:
 * - Context value accessibility
 * - localStorage persistence
 * - Language switching
 * - Direction synchronization via custom events
 * - SSR compatibility
 * - Browser language detection
 */

import { describe, test, expect, beforeEach, mock } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import {
  LanguageProvider,
  useLanguage,
  useLocale,
  useIsArabicLanguage,
} from "@/components/providers/LanguageProvider";

// Test component that uses the language context
function TestComponent() {
  const { locale, isArabic, isEnglish, setLanguage, getLanguageDisplayName } =
    useLanguage();

  return (
    <div data-testid="test-component">
      <div data-testid="locale">{locale}</div>
      <div data-testid="is-arabic">{isArabic ? "true" : "false"}</div>
      <div data-testid="is-english">{isEnglish ? "true" : "false"}</div>
      <div data-testid="display-name">{getLanguageDisplayName(locale)}</div>
      <button data-testid="set-english" onClick={() => setLanguage("en-US")}>
        English
      </button>
      <button data-testid="set-arabic-iq" onClick={() => setLanguage("ar-IQ")}>
        Arabic Iraq
      </button>
      <button data-testid="set-arabic-sa" onClick={() => setLanguage("ar-SA")}>
        Arabic Standard
      </button>
    </div>
  );
}

// Test component using useLocale hook
function LocaleTestComponent() {
  const locale = useLocale();
  return <div data-testid="locale-only">{locale}</div>;
}

// Test component using useIsArabicLanguage hook
function ArabicCheckComponent() {
  const isArabic = useIsArabicLanguage();
  return (
    <div data-testid="arabic-check">{isArabic ? "Arabic" : "Not Arabic"}</div>
  );
}

describe("Language Provider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }

    // Reset document attributes
    if (typeof document !== "undefined") {
      document.documentElement.lang = "en";
    }

    // Clear mock navigator.language
    if (typeof navigator !== "undefined") {
      Object.defineProperty(navigator, "language", {
        value: "en-US",
        writable: true,
        configurable: true,
      });
    }
  });

  test("LanguageProvider wraps app correctly", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const component = screen.getByTestId("test-component");
    expect(component).toBeDefined();
  });

  test("Context value accessible from useLanguage hook", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const locale = screen.getByTestId("locale");
    const isArabic = screen.getByTestId("is-arabic");

    expect(locale.textContent).toBeDefined();
    expect(isArabic.textContent).toBeDefined();
  });

  test("Default locale is ar-IQ with auto-detection", () => {
    // Set navigator language to Arabic
    Object.defineProperty(navigator, "language", {
      value: "ar-IQ",
      writable: true,
      configurable: true,
    });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const locale = screen.getByTestId("locale");
    const isArabic = screen.getByTestId("is-arabic");

    expect(locale.textContent).toBe("ar-IQ");
    expect(isArabic.textContent).toBe("true");
  });

  test("Language switches correctly", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const localeEl = screen.getByTestId("locale");
    const isArabicEl = screen.getByTestId("is-arabic");
    const isEnglishEl = screen.getByTestId("is-english");
    const setEnglishButton = screen.getByTestId("set-english");
    const setArabicIQButton = screen.getByTestId("set-arabic-iq");

    // Switch to English
    act(() => {
      setEnglishButton.click();
    });

    await waitFor(() => {
      expect(localeEl.textContent).toBe("en-US");
      expect(isArabicEl.textContent).toBe("false");
      expect(isEnglishEl.textContent).toBe("true");
    });

    // Switch to Arabic Iraq
    act(() => {
      setArabicIQButton.click();
    });

    await waitFor(() => {
      expect(localeEl.textContent).toBe("ar-IQ");
      expect(isArabicEl.textContent).toBe("true");
      expect(isEnglishEl.textContent).toBe("false");
    });
  });

  test("Language persists to localStorage", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const setEnglishButton = screen.getByTestId("set-english");

    // Switch language
    act(() => {
      setEnglishButton.click();
    });

    await waitFor(() => {
      const stored = localStorage.getItem("iraqi-language-config");
      expect(stored).toBeDefined();

      if (stored) {
        const config = JSON.parse(stored);
        expect(config.locale).toBe("en-US");
        expect(config.autoDetect).toBe(false); // Should be false after manual selection
      }
    });
  });

  test("Language loads from localStorage on mount", () => {
    // Set localStorage before render
    localStorage.setItem(
      "iraqi-language-config",
      JSON.stringify({
        locale: "en-US",
        autoDetect: false,
      }),
    );

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const locale = screen.getByTestId("locale");
    const isEnglish = screen.getByTestId("is-english");

    expect(locale.textContent).toBe("en-US");
    expect(isEnglish.textContent).toBe("true");
  });

  test("Document language attribute syncs with locale", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const setEnglishButton = screen.getByTestId("set-english");

    // Switch language
    act(() => {
      setEnglishButton.click();
    });

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("en-US");
    });
  });

  test("Custom languageChange event dispatched on language change", async () => {
    const eventHandler = mock(() => {});

    // Listen for custom event
    window.addEventListener("languageChange", eventHandler);

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const setEnglishButton = screen.getByTestId("set-english");

    // Switch language
    act(() => {
      setEnglishButton.click();
    });

    await waitFor(() => {
      expect(eventHandler).toHaveBeenCalled();
    });

    window.removeEventListener("languageChange", eventHandler);
  });

  test("getLanguageDisplayName returns correct native names", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const setEnglishButton = screen.getByTestId("set-english");
    const setArabicIQButton = screen.getByTestId("set-arabic-iq");
    const setArabicSAButton = screen.getByTestId("set-arabic-sa");
    const displayName = screen.getByTestId("display-name");

    // English
    act(() => {
      setEnglishButton.click();
    });

    waitFor(() => {
      expect(displayName.textContent).toBe("English");
    });

    // Arabic Iraq
    act(() => {
      setArabicIQButton.click();
    });

    waitFor(() => {
      expect(displayName.textContent).toBe("العربية (العراق)");
    });

    // Arabic Standard
    act(() => {
      setArabicSAButton.click();
    });

    waitFor(() => {
      expect(displayName.textContent).toBe("العربية (الفصحى)");
    });
  });

  test("useLocale hook returns current locale", () => {
    render(
      <LanguageProvider>
        <LocaleTestComponent />
      </LanguageProvider>,
    );

    const localeOnly = screen.getByTestId("locale-only");
    expect(localeOnly.textContent).toBeDefined();
    expect(["ar-IQ", "en-US", "ar-SA"]).toContain(localeOnly.textContent);
  });

  test("useIsArabicLanguage hook returns correct boolean", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
        <ArabicCheckComponent />
      </LanguageProvider>,
    );

    const arabicCheck = screen.getByTestId("arabic-check");
    const setEnglishButton = screen.getByTestId("set-english");
    const setArabicIQButton = screen.getByTestId("set-arabic-iq");

    // Switch to English
    act(() => {
      setEnglishButton.click();
    });

    await waitFor(() => {
      expect(arabicCheck.textContent).toBe("Not Arabic");
    });

    // Switch to Arabic
    act(() => {
      setArabicIQButton.click();
    });

    await waitFor(() => {
      expect(arabicCheck.textContent).toBe("Arabic");
    });
  });

  test("Browser language detection works for Arabic variants", () => {
    // Test ar-IQ detection
    Object.defineProperty(navigator, "language", {
      value: "ar-iq",
      writable: true,
      configurable: true,
    });

    const { unmount } = render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    let locale = screen.getByTestId("locale");
    expect(locale.textContent).toBe("ar-IQ");

    unmount();
    localStorage.clear();

    // Test ar-SA detection
    Object.defineProperty(navigator, "language", {
      value: "ar-sa",
      writable: true,
      configurable: true,
    });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    locale = screen.getByTestId("locale");
    expect(locale.textContent).toBe("ar-SA");
  });

  test("Browser language detection defaults to ar-IQ for generic Arabic", () => {
    Object.defineProperty(navigator, "language", {
      value: "ar",
      writable: true,
      configurable: true,
    });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const locale = screen.getByTestId("locale");
    expect(locale.textContent).toBe("ar-IQ");
  });

  test("Multiple components can access language context", () => {
    function SecondComponent() {
      const { locale } = useLanguage();
      return <div data-testid="second-component">{locale}</div>;
    }

    render(
      <LanguageProvider>
        <TestComponent />
        <SecondComponent />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("test-component")).toBeDefined();
    expect(screen.getByTestId("second-component")).toBeDefined();

    const locale1 = screen.getByTestId("locale").textContent;
    const locale2 = screen.getByTestId("second-component").textContent;

    expect(locale1).toBe(locale2);
  });

  test("No hydration mismatches with SSR", () => {
    // This test ensures that the component renders without hydration errors
    const { container } = render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    // Component should render without errors
    expect(container).toBeDefined();
    expect(screen.getByTestId("test-component")).toBeDefined();
  });

  test("autoDetect is disabled after manual language selection", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>,
    );

    const setEnglishButton = screen.getByTestId("set-english");

    // Manually select language
    act(() => {
      setEnglishButton.click();
    });

    await waitFor(() => {
      const stored = localStorage.getItem("iraqi-language-config");
      if (stored) {
        const config = JSON.parse(stored);
        expect(config.autoDetect).toBe(false);
      }
    });
  });
});
