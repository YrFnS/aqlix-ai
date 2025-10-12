/**
 * Input Validation Hook
 * Real-time Arabic text validation with composition awareness
 * @module hooks/useInputValidation
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { validateArabicText, isValidArabicInput } from "@iraqi-ai/arabic-nlp";
import type { ValidationResult, ValidationOptions } from "@iraqi-ai/arabic-nlp";
import type { InputValidationState } from "../types/arabic-input";

const DEFAULT_DEBOUNCE_MS = 300;

interface UseInputValidationOptions {
  /** Validation options */
  validationOptions?: ValidationOptions;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Whether composition is active (defer validation if true) */
  isComposing?: boolean;
  /** Callback when validation completes */
  onValidationChange?: (result: ValidationResult) => void;
}

/**
 * Real-time input validation with composition awareness
 *
 * CRITICAL: Validation is deferred during composition to prevent
 * interrupting Arabic IME input.
 *
 * @param options - Validation options
 * @returns Validation state and validate function
 *
 * @example
 * ```tsx
 * function ValidatedInput() {
 *   const [value, setValue] = useState("");
 *   const composition = useCompositionTracking();
 *   const validation = useInputValidation({
 *     isComposing: composition.state.isComposing,
 *     onValidationChange: (result) => {
 *       console.log("Valid:", result.isValid);
 *     },
 *   });
 *
 *   useEffect(() => {
 *     validation.validate(value);
 *   }, [value]);
 *
 *   return (
 *     <div>
 *       <input value={value} onChange={(e) => setValue(e.target.value)} />
 *       {validation.state.errorMessage && (
 *         <p className="error">{validation.state.errorMessage}</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInputValidation(options: UseInputValidationOptions = {}) {
  const {
    validationOptions = {},
    debounceMs = DEFAULT_DEBOUNCE_MS,
    isComposing = false,
    onValidationChange,
  } = options;

  const [state, setState] = useState<InputValidationState>({
    result: null,
    isValidating: false,
    errorMessage: null,
    confidence: 1,
  });

  const debounceTimerRef = useRef<number | null>(null);

  /**
   * Validate input text
   * Deferred if composition is active
   */
  const validate = useCallback(
    async (text: string): Promise<ValidationResult> => {
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Defer validation during composition
      if (isComposing) {
        return (
          state.result || {
            isValid: true,
            errors: [],
            warnings: [],
            threats: [],
            confidence: 1,
          }
        );
      }

      return new Promise((resolve) => {
        debounceTimerRef.current = setTimeout(async () => {
          setState((prev) => ({ ...prev, isValidating: true }));

          try {
            const result = validateArabicText(text, validationOptions);

            // Generate user-friendly error message
            const errorMessage =
              result.errors.length > 0
                ? (result.errors[0]?.message ?? null)
                : null;

            setState({
              result,
              isValidating: false,
              errorMessage,
              confidence: result.confidence,
            });

            onValidationChange?.(result);
            resolve(result);
          } catch (error) {
            console.error("Validation error:", error);
            setState((prev) => ({
              ...prev,
              isValidating: false,
              errorMessage: "Validation failed",
            }));
            resolve({
              isValid: false,
              errors: [
                {
                  code: "VALIDATION_ERROR",
                  message: "Validation failed",
                  severity: "error",
                },
              ],
              warnings: [],
              threats: [],
              confidence: 0,
            });
          }
        }, debounceMs) as unknown as number;
      });
    },
    [
      isComposing,
      validationOptions,
      debounceMs,
      onValidationChange,
      state.result,
    ],
  );

  /**
   * Quick boolean validation (no debounce)
   */
  const quickValidate = useCallback(
    (text: string): boolean => {
      if (isComposing) return true; // Assume valid during composition
      return isValidArabicInput(text, validationOptions);
    },
    [isComposing, validationOptions],
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    state,
    validate,
    quickValidate,
  };
}
