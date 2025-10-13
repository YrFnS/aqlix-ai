/**
 * Arabic Input Handling Hook
 * Comprehensive Arabic input with IME support, validation, and normalization
 * @module hooks/useArabicInput
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ARABIC_REGEX } from "../utils/bidirectional";
import { useCompositionTracking } from "./useCompositionTracking";
import { useInputValidation } from "./useInputValidation";
import { useInputNormalization } from "./useInputNormalization";
import type { TextDirection } from "@iraqi-ai/types";
import type {
  UseArabicInputOptions,
  UseArabicInputReturn,
} from "../types/arabic-input";

/**
 * Comprehensive Arabic input handling hook
 *
 * Combines:
 * - Composition event tracking (IME support)
 * - Real-time validation (security + cultural)
 * - Automatic normalization
 * - Direction detection
 *
 * @param options - Configuration options
 * @returns Input state, handlers, and control functions
 *
 * @example
 * ```tsx
 * function ArabicTextInput() {
 *   const input = useArabicInput({
 *     autoDetectDirection: true,
 *     enableValidation: true,
 *     enableNormalization: true,
 *     onChange: (value) => console.log("Value:", value),
 *   });
 *
 *   return (
 *     <div>
 *       <input {...input.inputProps} />
 *
 *       {!input.isValid && input.validation.errorMessage && (
 *         <p className="error">{input.validation.errorMessage}</p>
 *       )}
 *
 *       <p>Direction: {input.direction}</p>
 *       <p>Confidence: {(input.validation.confidence * 100).toFixed(0)}%</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useArabicInput(
  options: UseArabicInputOptions = {},
): UseArabicInputReturn {
  const {
    initialValue = "",
    autoDetectDirection = false,
    enableValidation = false,
    enableNormalization = false,
    validationOptions,
    normalizationOptions,
    onChange,
    onValidationChange,
  } = options;

  const [value, setValue] = useState(initialValue);

  // Composition tracking
  const composition = useCompositionTracking();
  const lastAppliedInitialRef = useRef(initialValue);

  // Sync internal value with external initialValue changes
  useEffect(() => {
    if (composition.state.isComposing) {
      return;
    }

    if (lastAppliedInitialRef.current !== initialValue) {
      lastAppliedInitialRef.current = initialValue;
      setValue(initialValue);
    }
  }, [initialValue, composition.state.isComposing]);

  // Validation
  const validation = useInputValidation({
    validationOptions,
    isComposing: composition.state.isComposing,
    onValidationChange,
  });

  // Normalization
  const normalization = useInputNormalization({
    preset: "light",
    options: normalizationOptions,
    trigger: "on-blur",
  });

  // Direction detection
  const direction = useMemo<TextDirection>(() => {
    if (!autoDetectDirection || !value) return "ltr";
    return ARABIC_REGEX.test(value) ? "rtl" : "ltr";
  }, [autoDetectDirection, value]);

  /**
   * Handle input change
   * Defer onChange callback during composition
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Trigger validation if enabled and not composing
      if (enableValidation && !composition.state.isComposing) {
        validation.validate(newValue);
      }

      // Trigger onChange callback after composition ends
      if (!composition.state.isComposing) {
        onChange?.(newValue);
      }
    },
    [composition.state.isComposing, enableValidation, validation, onChange],
  );

  /**
   * Handle composition end
   * Trigger validation and onChange after composition completes
   */
  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      composition.handlers.onCompositionEnd(e);

      const newValue = e.currentTarget.value;
      setValue(newValue);

      // Validate after composition
      if (enableValidation) {
        validation.validate(newValue);
      }

      // Trigger onChange callback
      onChange?.(newValue);
    },
    [composition.handlers, enableValidation, validation, onChange],
  );

  /**
   * Handle blur event
   * Apply normalization if enabled
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (enableNormalization && normalization.trigger === "on-blur") {
        const normalized = normalization.normalize(e.target.value);
        setValue(normalized);
        onChange?.(normalized);
      }
    },
    [enableNormalization, normalization, onChange],
  );

  /**
   * Manual normalize function
   */
  const normalize = useCallback(() => {
    const normalized = normalization.normalize(value);
    setValue(normalized);
    onChange?.(normalized);
    return normalized;
  }, [normalization, value, onChange]);

  /**
   * Manual validate function
   */
  const validate = useCallback(async () => {
    return validation.validate(value);
  }, [validation, value]);

  /**
   * Reset to initial value
   */
  const reset = useCallback(() => {
    setValue(initialValue);
    onChange?.(initialValue);
  }, [initialValue, onChange]);

  return {
    value,
    direction,
    composition: composition.state,
    validation: validation.state,
    isValid: validation.state.result?.isValid ?? true,

    inputProps: {
      value,
      onChange: handleChange,
      onCompositionStart: composition.handlers.onCompositionStart,
      onCompositionUpdate: composition.handlers.onCompositionUpdate,
      onCompositionEnd: handleCompositionEnd,
      onBlur: handleBlur,
      dir: direction,
    },

    setValue,
    validate,
    normalize,
    reset,
  };
}
