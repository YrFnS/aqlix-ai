/**
 * Arabic Input Handling Types
 * @module types/arabic-input
 */

import type * as React from "react";
import type { TextDirection } from "@iraqi-ai/types";
import type { ValidationResult } from "@iraqi-ai/arabic-nlp";

/**
 * Composition tracking state
 */
export interface CompositionState {
  /** Whether composition is currently active */
  isComposing: boolean;
  /** Current composition data */
  data: string;
  /** Composition start position */
  startPosition: number;
}

/**
 * Input validation state with real-time feedback
 */
export interface InputValidationState {
  /** Current validation result */
  result: ValidationResult | null;
  /** Whether validation is in progress */
  isValidating: boolean;
  /** Validation error message (user-friendly) */
  errorMessage: string | null;
  /** Validation confidence (0-1) */
  confidence: number;
}

/**
 * Arabic input hook options
 */
export interface UseArabicInputOptions {
  /** Initial value */
  initialValue?: string;
  /** Auto-detect direction from content */
  autoDetectDirection?: boolean;
  /** Enable real-time validation */
  enableValidation?: boolean;
  /** Enable automatic normalization */
  enableNormalization?: boolean;
  /** Validation options */
  validationOptions?: {
    minLength?: number;
    maxLength?: number;
    allowMixed?: boolean;
    strict?: boolean;
  };
  /** Normalization options */
  normalizationOptions?: {
    removeDiacritics?: boolean;
    normalizeVariants?: boolean;
    removeTatweel?: boolean;
  };
  /** Callback when value changes (after composition) */
  onChange?: (value: string) => void;
  /** Callback when validation completes */
  onValidationChange?: (result: ValidationResult) => void;
}

/**
 * Arabic input hook return value
 */
export interface UseArabicInputReturn {
  /** Current input value */
  value: string;
  /** Detected text direction */
  direction: TextDirection;
  /** Composition tracking state */
  composition: CompositionState;
  /** Validation state */
  validation: InputValidationState;
  /** Whether input is currently valid */
  isValid: boolean;

  // Event handlers to spread on input element
  inputProps: {
    value: string;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onCompositionStart: (
      e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onCompositionUpdate: (
      e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onCompositionEnd: (
      e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onBlur: (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    dir: TextDirection;
  };

  // Manual control functions
  setValue: (value: string) => void;
  validate: () => Promise<ValidationResult>;
  normalize: () => string;
  reset: () => void;
}
