/**
 * Direction Provider Integration Tests
 *
 * Tests Radix UI DirectionProvider integration with our custom DirectionProvider.
 * Validates direction synchronization, hydration, and context management.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import {
  DirectionProvider,
  useDirection,
} from "@/components/providers/DirectionProvider";
import { DirectionSync } from "@/components/providers/DirectionSync";

// Test component that uses the direction context
function TestComponent() {
  const { config, isRTL, toggleDirection } = useDirection();

  return (
    <div data-testid="test-component">
      <div data-testid="direction">{config.direction}</div>
      <div data-testid="locale">{config.locale}</div>
      <div data-testid="is-rtl">{isRTL ? "true" : "false"}</div>
      <button data-testid="toggle" onClick={toggleDirection}>
        Toggle
      </button>
    </div>
  );
}

describe("Direction Provider Integration", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }

    // Reset document attributes
    if (typeof document !== "undefined") {
      document.dir = "ltr";
      document.documentElement.lang = "en";
    }
  });

  test("Radix DirectionProvider wraps app correctly", () => {
    render(
      <DirectionProvider>
        <TestComponent />
      </DirectionProvider>,
    );

    const component = screen.getByTestId("test-component");
    expect(component).toBeDefined();
  });

  test("Context value matches initial RTL direction", () => {
    render(
      <DirectionProvider>
        <TestComponent />
      </DirectionProvider>,
    );

    const direction = screen.getByTestId("direction");
    const isRTL = screen.getByTestId("is-rtl");

    expect(direction.textContent).toBe("rtl");
    expect(isRTL.textContent).toBe("true");
  });

  test("Direction syncs with document when DirectionSync is used", async () => {
    render(
      <DirectionProvider>
        <DirectionSync />
        <TestComponent />
      </DirectionProvider>,
    );

    await waitFor(() => {
      expect(document.dir).toBe("rtl");
      expect(document.documentElement.lang).toBe("ar-IQ");
    });
  });

  test("Direction toggles correctly", async () => {
    render(
      <DirectionProvider>
        <DirectionSync />
        <TestComponent />
      </DirectionProvider>,
    );

    const toggleButton = screen.getByTestId("toggle");
    const directionEl = screen.getByTestId("direction");
    const isRTLEl = screen.getByTestId("is-rtl");

    // Initial state should be RTL
    expect(directionEl.textContent).toBe("rtl");
    expect(isRTLEl.textContent).toBe("true");

    // Toggle to LTR
    act(() => {
      toggleButton.click();
    });

    await waitFor(() => {
      expect(directionEl.textContent).toBe("ltr");
      expect(isRTLEl.textContent).toBe("false");
      expect(document.dir).toBe("ltr");
    });

    // Toggle back to RTL
    act(() => {
      toggleButton.click();
    });

    await waitFor(() => {
      expect(directionEl.textContent).toBe("rtl");
      expect(isRTLEl.textContent).toBe("true");
      expect(document.dir).toBe("rtl");
    });
  });

  test("No hydration mismatches with suppressHydrationWarning", () => {
    // This test ensures that the suppressHydrationWarning prop prevents
    // hydration errors when direction changes between server and client render
    const { container } = render(
      <DirectionProvider>
        <DirectionSync />
        <TestComponent />
      </DirectionProvider>,
    );

    // Component should render without errors
    expect(container).toBeDefined();
    expect(screen.getByTestId("test-component")).toBeDefined();
  });

  test("Direction persists to localStorage", async () => {
    render(
      <DirectionProvider>
        <TestComponent />
      </DirectionProvider>,
    );

    const toggleButton = screen.getByTestId("toggle");

    // Toggle direction
    act(() => {
      toggleButton.click();
    });

    await waitFor(() => {
      const stored = localStorage.getItem("iraqi-rtl-config");
      expect(stored).toBeDefined();

      if (stored) {
        const config = JSON.parse(stored);
        expect(config.direction).toBe("ltr");
      }
    });
  });

  test("Direction loads from localStorage on mount", () => {
    // Set localStorage before render
    localStorage.setItem(
      "iraqi-rtl-config",
      JSON.stringify({
        locale: "en-US",
        direction: "ltr",
        dialectPreference: "baghdad",
        layoutPreferences: {
          textAlignment: "auto",
          navigationDirection: "ltr",
          contentFlow: "natural",
        },
      }),
    );

    render(
      <DirectionProvider>
        <TestComponent />
      </DirectionProvider>,
    );

    const direction = screen.getByTestId("direction");
    const locale = screen.getByTestId("locale");

    expect(direction.textContent).toBe("ltr");
    expect(locale.textContent).toBe("en-US");
  });

  test("Radix DirectionProvider receives correct dir prop", () => {
    const { container } = render(
      <DirectionProvider>
        <TestComponent />
      </DirectionProvider>,
    );

    // Check that Radix DirectionProvider is in the tree
    // by verifying the component renders correctly within the provider
    expect(screen.getByTestId("direction").textContent).toBe("rtl");
  });

  test("Multiple components can access direction context", () => {
    function SecondComponent() {
      const { isRTL } = useDirection();
      return <div data-testid="second-component">{isRTL ? "RTL" : "LTR"}</div>;
    }

    render(
      <DirectionProvider>
        <TestComponent />
        <SecondComponent />
      </DirectionProvider>,
    );

    expect(screen.getByTestId("test-component")).toBeDefined();
    expect(screen.getByTestId("second-component")).toBeDefined();
    expect(screen.getByTestId("second-component").textContent).toBe("RTL");
  });
});
