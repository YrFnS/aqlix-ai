/**
 * Input Normalization Hook
 * Automatic Arabic text normalization with configurable options
 * @module hooks/useInputNormalization
 */

import { useCallback } from "react";
import {
  normalizeArabic,
  lightNormalization,
  fullNormalization,
} from "@iraqi-ai/arabic-nlp";
import type { ArabicNormalizationOptions } from "@iraqi-ai/arabic-nlp";

interface UseInputNormalizationOptions {
  /** Normalization preset: light (preserve diacritics) or full (aggressive) */
  preset?: "light" | "full" | "custom";
  /** Custom normalization options (if preset is 'custom') */
  options?: ArabicNormalizationOptions;
  /** When to normalize: on-blur (default) or on-change */
  trigger?: "on-blur" | "on-change";
}

/**
 * Automatic input normalization for Arabic text
 *
 * Normalization presets:
 * - light: Unicode NFC, remove zero-width, preserve diacritics/variants
 * - full: Remove diacritics, normalize variants, remove tatweel
 * - custom: Fine-grained control with options
 *
 * CRITICAL: Always preserves Iraqi Kurdish characters (چ, گ, ڤ)
 *
 * @param options - Normalization options
 * @returns Normalize function
 *
 * @example
 * ```tsx
 * function NormalizedInput() {
 *   const [value, setValue] = useState("");
 *   const { normalize } = useInputNormalization({ preset: "light" });
 *
 *   return (
 *     <input
 *       value={value}
 *       onChange={(e) => setValue(e.target.value)}
 *       onBlur={(e) => {
 *         const normalized = normalize(e.target.value);
 *         setValue(normalized);
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function useInputNormalization(
  options: UseInputNormalizationOptions = {},
) {
  const {
    preset = "light",
    options: customOptions,
    trigger = "on-blur",
  } = options;

  /**
   * Normalize text based on preset or custom options
   */
  const normalize = useCallback(
    (text: string): string => {
      if (!text || !text.trim()) return text;

      switch (preset) {
        case "light":
          // Preserve diacritics, only security normalization
          return lightNormalization(text);

        case "full":
          // Aggressive normalization (diacritics, variants, tatweel)
          return fullNormalization(text);

        case "custom": {
          // Custom options with full control
          const result = normalizeArabic(text, {
            form: "NFC",
            preserveIraqiChars: true, // ALWAYS preserve Kurdish chars
            ...customOptions,
          });
          return result.text;
        }

        default:
          return text;
      }
    },
    [preset, customOptions],
  );

  return {
    normalize,
    trigger,
  };
}
