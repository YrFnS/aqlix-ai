/**
 * Direction Provider - RTL Context for Iraqi AI Chat System
 *
 * Provides global RTL state management with:
 * - Automatic direction detection from locale
 * - localStorage persistence for user preferences
 * - Dynamic direction switching without page refresh
 * - Iraqi dialect preference management
 *
 * @module DirectionProvider
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";
import type {
  RTLConfig,
  DirectionContext as DirectionContextType,
  LanguageLocale,
  TextDirection,
} from "@iraqi-ai/types";
import { getLocaleDirection, isArabicText } from "@/lib/utils/rtl";

// Storage key for RTL configuration persistence
const RTL_CONFIG_STORAGE_KEY = "iraqi-rtl-config";

// Default RTL configuration for Iraqi users
const defaultConfig: RTLConfig = {
  locale: "ar-IQ",
  direction: "rtl",
  dialectPreference: "baghdad",
  layoutPreferences: {
    textAlignment: "auto",
    navigationDirection: "rtl",
    contentFlow: "natural",
  },
};

// Create the Direction Context
const DirectionContext = createContext<DirectionContextType | undefined>(
  undefined,
);

/**
 * Direction Provider Component
 *
 * Wraps the application to provide RTL context throughout the component tree.
 * Manages direction state, locale preferences, and localStorage persistence.
 *
 * @param children - Child components to wrap
 *
 * @example
 * ```tsx
 * // In root layout
 * <DirectionProvider>
 *   <App />
 * </DirectionProvider>
 * ```
 */
export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RTLConfig>(() => {
    // SSR-safe: Load configuration from localStorage on client side only
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(RTL_CONFIG_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge with defaults to handle new config properties
          return { ...defaultConfig, ...parsed };
        }
      } catch (error) {
        console.warn("Failed to load RTL config from localStorage:", error);
      }
    }
    return defaultConfig;
  });

  // Persist configuration to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(RTL_CONFIG_STORAGE_KEY, JSON.stringify(config));
      } catch (error) {
        console.warn("Failed to persist RTL config to localStorage:", error);
      }
    }
  }, [config]);

  // Listen for language changes from LanguageProvider
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ locale: LanguageLocale }>;
      const newLocale = customEvent.detail.locale;

      // Update locale and direction when language changes
      setConfig((prev: RTLConfig) => ({
        ...prev,
        locale: newLocale,
        direction: getLocaleDirection(newLocale),
      }));
    };

    window.addEventListener("languageChange", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  // Apply direction and language to document
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Set document direction
      document.dir = config.direction;

      // Set document language
      document.documentElement.lang = config.locale;

      // Add direction class to body for CSS targeting
      document.body.classList.remove("rtl", "ltr");
      if (config.direction !== "auto") {
        document.body.classList.add(config.direction);
      }
    }
  }, [config.direction, config.locale]);

  // Toggle between RTL and LTR
  const toggleDirection = (): void => {
    setConfig((prev: RTLConfig) => ({
      ...prev,
      direction: prev.direction === "rtl" ? "ltr" : "rtl",
    }));
  };

  // Set locale and auto-update direction
  const setLocale = (locale: LanguageLocale): void => {
    setConfig((prev: RTLConfig) => ({
      ...prev,
      locale,
      direction: getLocaleDirection(locale),
    }));
  };

  // Get text direction from content
  const getTextDirection = (text?: string): TextDirection => {
    if (!text) {
      return config.direction;
    }
    return isArabicText(text) ? "rtl" : "ltr";
  };

  // Create context value
  const contextValue: DirectionContextType = {
    config,
    isRTL: config.direction === "rtl",
    isArabic: config.locale.startsWith("ar"),
    toggleDirection,
    setLocale,
    getTextDirection,
  };

  // Normalize direction for Radix (only accepts 'ltr' | 'rtl')
  const radixDirection = config.direction === "auto" ? "ltr" : config.direction;

  return (
    <DirectionContext.Provider value={contextValue}>
      <RadixDirectionProvider dir={radixDirection}>
        {children}
      </RadixDirectionProvider>
    </DirectionContext.Provider>
  );
}

/**
 * Hook to access Direction Context
 *
 * Provides access to RTL state and utilities from any component
 * within the DirectionProvider tree.
 *
 * @returns Direction context with RTL state and utilities
 * @throws Error if used outside DirectionProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isRTL, config, toggleDirection } = useDirection();
 *
 *   return (
 *     <div dir={isRTL ? 'rtl' : 'ltr'}>
 *       <button onClick={toggleDirection}>
 *         Switch to {isRTL ? 'LTR' : 'RTL'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDirection(): DirectionContextType {
  const context = useContext(DirectionContext);

  if (!context) {
    throw new Error("useDirection must be used within DirectionProvider");
  }

  return context;
}

/**
 * Hook to get direction classes for an element
 *
 * Convenience hook that returns direction-aware CSS classes
 * based on current RTL configuration.
 *
 * @param baseClasses - Optional base CSS classes
 * @returns Direction-aware CSS classes
 *
 * @example
 * ```tsx
 * function Card() {
 *   const classes = useDirectionClasses('p-4 rounded');
 *   // Returns: 'p-4 rounded rtl text-right' (in RTL mode)
 *   // Returns: 'p-4 rounded ltr text-left' (in LTR mode)
 *
 *   return <div className={classes}>Content</div>;
 * }
 * ```
 */
export function useDirectionClasses(baseClasses = ""): string {
  const { isRTL } = useDirection();
  const directionClass = isRTL ? "rtl" : "ltr";
  const alignmentClass = isRTL ? "text-right" : "text-left";

  return `${baseClasses} ${directionClass} ${alignmentClass}`.trim();
}

/**
 * Hook to check if current locale is Arabic
 *
 * @returns True if current locale is Arabic
 *
 * @example
 * ```tsx
 * function Greeting() {
 *   const isArabic = useIsArabic();
 *   return <h1>{isArabic ? 'مرحبا' : 'Hello'}</h1>;
 * }
 * ```
 */
export function useIsArabic(): boolean {
  const { isArabic } = useDirection();
  return isArabic;
}

/**
 * Hook to check if current direction is RTL
 *
 * @returns True if current direction is RTL
 *
 * @example
 * ```tsx
 * function Navigation() {
 *   const isRTL = useIsRTL();
 *   const flexDir = isRTL ? 'flex-row-reverse' : 'flex-row';
 *   return <nav className={flexDir}>Navigation items</nav>;
 * }
 * ```
 */
export function useIsRTL(): boolean {
  const { isRTL } = useDirection();
  return isRTL;
}
