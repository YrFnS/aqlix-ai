/**
 * Language Switcher Component
 *
 * Provides UI for switching between supported languages (ar-IQ, en-US, ar-SA).
 * Features:
 * - Dropdown menu with language options
 * - Visual feedback on selection
 * - Smooth animations with framer-motion
 * - Full accessibility support (ARIA labels, keyboard navigation)
 * - RTL-aware positioning
 *
 * @module LanguageSwitcher
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useDirection } from "@/components/providers/DirectionProvider";
import type { LanguageLocale } from "@iraqi-ai/types";

/**
 * Language option configuration
 */
interface LanguageOption {
  locale: LanguageLocale;
  label: string;
  nativeLabel: string;
}

const languageOptions: LanguageOption[] = [
  {
    locale: "ar-IQ",
    label: "Arabic (Iraq)",
    nativeLabel: "العربية (العراق)",
  },
  {
    locale: "en-US",
    label: "English",
    nativeLabel: "English",
  },
  {
    locale: "ar-SA",
    label: "Arabic (Standard)",
    nativeLabel: "العربية (الفصحى)",
  },
];

/**
 * Language Switcher Props
 */
export interface LanguageSwitcherProps {
  /** Show label next to icon */
  showLabel?: boolean;

  /** Custom CSS classes */
  className?: string;

  /** Variant style */
  variant?: "default" | "compact";
}

/**
 * Language Switcher Component
 *
 * @example
 * ```tsx
 * // In navigation
 * <LanguageSwitcher showLabel />
 *
 * // Compact version
 * <LanguageSwitcher variant="compact" />
 * ```
 */
export function LanguageSwitcher({
  showLabel = false,
  className = "",
  variant = "default",
}: LanguageSwitcherProps) {
  const { locale, setLanguage } = useLanguage();
  const { isRTL } = useDirection();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLanguageSelect = (newLocale: LanguageLocale) => {
    setLanguage(newLocale);
    setIsOpen(false);
  };

  const currentLanguage = languageOptions.find((opt) => opt.locale === locale);

  const buttonClasses =
    variant === "compact"
      ? "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      : "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        <Languages className="w-5 h-5" aria-hidden="true" />
        {showLabel && currentLanguage && (
          <span className="text-sm font-medium">
            {currentLanguage.nativeLabel}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${isRTL ? "left-0" : "right-0"} mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-50`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            <div className="py-1">
              {languageOptions.map((option) => {
                const isSelected = option.locale === locale;

                return (
                  <button
                    key={option.locale}
                    onClick={() => handleLanguageSelect(option.locale)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    role="menuitem"
                    aria-current={isSelected ? "true" : undefined}
                    type="button"
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span
                        className={`font-medium ${option.locale.startsWith("ar") ? "font-arabic" : ""}`}
                      >
                        {option.nativeLabel}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Check className="w-5 h-5" aria-hidden="true" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Compact Language Switcher
 *
 * Minimal version showing only the icon
 *
 * @example
 * ```tsx
 * <CompactLanguageSwitcher className="ml-auto" />
 * ```
 */
export function CompactLanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  return <LanguageSwitcher variant="compact" className={className} />;
}

/**
 * Language Switcher with Label
 *
 * Full version showing icon and current language name
 *
 * @example
 * ```tsx
 * <LanguageSwitcherWithLabel />
 * ```
 */
export function LanguageSwitcherWithLabel({
  className = "",
}: {
  className?: string;
}) {
  return <LanguageSwitcher showLabel className={className} />;
}
