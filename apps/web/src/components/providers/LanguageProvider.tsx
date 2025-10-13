/**
 * Language Provider - Language Context for Iraqi AI Chat System
 *
 * Provides global language state management with:
 * - Multi-language support (ar-IQ, en-US, ar-SA)
 * - localStorage persistence for user preferences
 * - Dynamic language switching without page refresh
 * - Browser language detection on first visit
 * - Integration with DirectionProvider for automatic direction sync
 *
 * @module LanguageProvider
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { LanguageLocale } from "@iraqi-ai/types";

// Storage key for language configuration persistence
const LANGUAGE_CONFIG_STORAGE_KEY = "iraqi-language-config";

/**
 * Language configuration interface
 */
export interface LanguageConfig {
  /** Current language locale */
  locale: LanguageLocale;

  /** Whether to auto-detect language from browser */
  autoDetect: boolean;
}

/**
 * Language context interface
 */
export interface LanguageContext {
  /** Current language configuration */
  config: LanguageConfig;

  /** Current language locale */
  locale: LanguageLocale;

  /** Whether current language is Arabic (ar-IQ or ar-SA) */
  isArabic: boolean;

  /** Whether current language is English */
  isEnglish: boolean;

  /** Switch to a specific language */
  setLanguage: (locale: LanguageLocale) => void;

  /** Get display name for a language */
  getLanguageDisplayName: (locale: LanguageLocale) => string;
}

// Default language configuration (Arabic Iraq for Iraqi users)
const defaultConfig: LanguageConfig = {
  locale: "ar-IQ",
  autoDetect: true,
};

// Language display names
const languageDisplayNames: Record<LanguageLocale, string> = {
  "ar-IQ": "العربية (العراق)",
  "en-US": "English",
  "ar-SA": "العربية (الفصحى)",
};

/**
 * Detects browser language and maps to supported locale
 */
function detectBrowserLanguage(): LanguageLocale {
  if (typeof navigator === "undefined") {
    return "ar-IQ"; // Default for SSR
  }

  const browserLang = navigator.language.toLowerCase();

  // Map browser language to supported locales
  if (browserLang.startsWith("ar-iq")) return "ar-IQ";
  if (browserLang.startsWith("ar-sa")) return "ar-SA";
  if (browserLang.startsWith("ar")) return "ar-IQ"; // Default Arabic to Iraqi
  if (browserLang.startsWith("en")) return "en-US";

  // Default to Arabic Iraqi for Middle Eastern users
  // Cultural reasoning: Prioritizes Iraqi Arabic as primary audience language
  // Islamic compliance: Respects Arabic language primacy
  return "ar-IQ";
}

// Create the Language Context
const LanguageContextInstance = createContext<LanguageContext | undefined>(
  undefined,
);

/**
 * Language Provider Component
 *
 * Wraps the application to provide language context throughout the component tree.
 * Manages language state, locale preferences, and localStorage persistence.
 * Automatically syncs with DirectionProvider when language changes.
 *
 * @param children - Child components to wrap
 *
 * @example
 * ```tsx
 * // In root layout
 * <LanguageProvider>
 *   <DirectionProvider>
 *     <App />
 *   </DirectionProvider>
 * </LanguageProvider>
 * ```
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<LanguageConfig>(() => {
    // SSR-safe: Load configuration from localStorage on client side only
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LANGUAGE_CONFIG_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge with defaults to handle new config properties
          return { ...defaultConfig, ...parsed };
        }
      } catch (error) {
        console.warn(
          "Failed to load language config from localStorage:",
          error,
        );
      }

      // No saved config - detect from browser if autoDetect is enabled
      if (defaultConfig.autoDetect) {
        const detectedLocale = detectBrowserLanguage();
        return { ...defaultConfig, locale: detectedLocale };
      }
    }
    return defaultConfig;
  });

  // Persist configuration to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          LANGUAGE_CONFIG_STORAGE_KEY,
          JSON.stringify(config),
        );
      } catch (error) {
        console.warn(
          "Failed to persist language config to localStorage:",
          error,
        );
      }
    }
  }, [config]);

  // Apply language to document
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Set document language attribute
      document.documentElement.lang = config.locale;
    }
  }, [config.locale]);

  // Dispatch custom event when language changes (for DirectionProvider integration)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("languageChange", {
        detail: { locale: config.locale },
      });
      window.dispatchEvent(event);
    }
  }, [config.locale]);

  // Set language and disable auto-detect
  const setLanguage = (locale: LanguageLocale): void => {
    setConfig({
      locale,
      autoDetect: false, // User manually selected, disable auto-detect
    });
  };

  // Get display name for a language
  const getLanguageDisplayName = (locale: LanguageLocale): string => {
    return languageDisplayNames[locale] || locale;
  };

  // Create context value
  const contextValue: LanguageContext = {
    config,
    locale: config.locale,
    isArabic: config.locale.startsWith("ar"),
    isEnglish: config.locale === "en-US",
    setLanguage,
    getLanguageDisplayName,
  };

  return (
    <LanguageContextInstance.Provider value={contextValue}>
      {children}
    </LanguageContextInstance.Provider>
  );
}

/**
 * Hook to access Language Context
 *
 * Provides access to language state and utilities from any component
 * within the LanguageProvider tree.
 *
 * @returns Language context with language state and utilities
 * @throws Error if used outside LanguageProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { locale, isArabic, setLanguage } = useLanguage();
 *
 *   return (
 *     <div>
 *       <p>Current language: {locale}</p>
 *       <button onClick={() => setLanguage('en-US')}>
 *         Switch to English
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLanguage(): LanguageContext {
  const context = useContext(LanguageContextInstance);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}

/**
 * Hook to get current locale
 *
 * Convenience hook that returns only the current locale
 *
 * @returns Current language locale
 *
 * @example
 * ```tsx
 * function Greeting() {
 *   const locale = useLocale();
 *   return <h1>{locale === 'ar-IQ' ? 'مرحبا' : 'Hello'}</h1>;
 * }
 * ```
 */
export function useLocale(): LanguageLocale {
  const { locale } = useLanguage();
  return locale;
}

/**
 * Hook to check if current language is Arabic
 *
 * @returns True if current language is Arabic (ar-IQ or ar-SA)
 *
 * @example
 * ```tsx
 * function Content() {
 *   const isArabic = useIsArabicLanguage();
 *   return <div className={isArabic ? 'font-arabic' : 'font-sans'}>Content</div>;
 * }
 * ```
 */
export function useIsArabicLanguage(): boolean {
  const { isArabic } = useLanguage();
  return isArabic;
}
