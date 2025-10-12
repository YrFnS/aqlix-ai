# PRP: Arabic Input Handling for Iraqi AI Chat System

**Priority**: High
**Complexity**: Intermediate
**Estimated Time**: 4-6 hours
**Dependencies**: `@iraqi-ai/ui`, `@iraqi-ai/arabic-nlp`, `@iraqi-ai/types`

---

## Goal

Build a comprehensive Arabic input handling system that provides:
- **Real-time input validation** with immediate feedback for Arabic text
- **Composition event handling** for Input Method Editors (IME) and Arabic keyboards
- **Input normalization** to ensure consistent Arabic text processing
- **Direction detection** with automatic RTL/LTR switching during input
- **Cultural compliance** with Islamic values and Iraqi dialect preservation

**End State**: Developers can use hooks and utilities to handle Arabic text input with proper IME support, validation, normalization, and direction handling that works seamlessly across all form components.

---

## Why

### Business Value
- **User Experience**: Smooth Arabic text input without interruptions from composition events
- **Data Quality**: Real-time validation ensures clean, normalized Arabic text in database
- **Cultural Compliance**: Automatic detection of malicious patterns (bidi attacks, zero-width abuse)
- **Developer Efficiency**: Reusable hooks reduce 70% of Arabic input handling code

### Integration Benefits
- **Seamless Forms**: Works with existing BiInput/BiTextarea components
- **Validation System**: Integrates with form validation pipeline
- **Arabic NLP**: Leverages existing validation/normalization utilities
- **Type Safety**: Full TypeScript support with proper type definitions

### Problems This Solves
- **IME Conflicts**: Prevents onChange firing during Arabic composition
- **Validation Timing**: Validates after composition ends, not during
- **Normalization**: Automatically normalizes Arabic input for consistency
- **Security**: Detects and prevents bidi override attacks and malicious patterns
- **Direction Handling**: Auto-detects and switches direction during mixed input

---

## What

### User-Visible Behavior

1. **Smooth Arabic Input**
   - User types Arabic text with IME/keyboard
   - No interruptions during composition (tashkeel, hamza, etc.)
   - Direction auto-switches based on first character
   - Real-time validation feedback after composition ends

2. **Input Validation Feedback**
   - Green checkmark for valid Arabic input
   - Red error message for malicious patterns (bidi attacks)
   - Warning for suspicious patterns (excessive zero-width chars)
   - Character count and validation confidence score

3. **Automatic Normalization**
   - Alef variants (أ, إ, آ) → ا
   - Yeh variants (ى, ي) → ي
   - Remove dangerous characters (RLO, LRO, etc.)
   - Whitespace normalization

### Technical Requirements

1. **Composition Event Handling**
   - Track `isComposing` state
   - Defer validation until `compositionend`
   - Support Arabic keyboard layouts
   - Handle mixed Arabic-English input

2. **Real-time Validation**
   - Validate on compositionend + input events
   - Provide immediate visual feedback
   - Integrate with form validation system
   - Batch validation for performance

3. **Input Normalization**
   - Unicode NFC normalization
   - Character variant normalization
   - Security-focused sanitization
   - Iraqi Kurdish character preservation

4. **Direction Management**
   - Auto-detect first character direction
   - Switch RTL/LTR during input
   - Handle mixed content properly
   - Maintain cursor position

### Success Criteria

- [x] Composition events handled correctly (no onChange during composition)
- [x] Real-time validation with <100ms response time
- [x] 99%+ Arabic text normalization accuracy
- [x] 100% security threat detection (bidi attacks)
- [x] Auto direction detection with 95%+ accuracy
- [x] Zero IME conflicts with Arabic keyboards
- [x] Full TypeScript type safety
- [x] Comprehensive test coverage (unit + integration)

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

# Composition Events (CRITICAL for IME handling)
- url: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
  why: |
    Core concept for handling Arabic IME input. Three events to track:
    - compositionstart: User starts composing (typing ش then keel)
    - compositionupdate: Composition in progress (ش + diacritic)
    - compositionend: Final character produced (شَ)

    CRITICAL: Don't fire onChange/validation during composition!

- url: https://developer.mozilla.org/en-US/docs/Web/API/InputEvent
  why: |
    Modern InputEvent has `isComposing` property to distinguish:
    - isComposing=true → User typing with IME, defer actions
    - isComposing=false → Regular input, safe to validate

    Use this to prevent double-validation and onChange conflicts.

- url: https://github.com/facebook/react/issues/8683
  why: |
    React composition event gotchas:
    - onChange fires before compositionend in some browsers
    - Need to track isComposing manually in state
    - Use event.nativeEvent.isComposing for reliability

# Unicode Normalization (CRITICAL for Arabic)
- url: https://unicode.org/reports/tr15/
  section: "Normalization Forms NFC, NFD"
  critical: |
    Arabic has 4 normalization forms, we use NFC:
    - NFC: Canonical Composition (storage/display)
    - NFD: Canonical Decomposition (diacritic removal)

    GOTCHA: Always normalize AFTER composition ends, not during!

# Arabic RTL Best Practices (2025)
- url: https://medium.com/bumble-tech/interface-localisation-adapting-text-fields-for-rtl-languages-67a386006a17
  why: |
    Modern RTL input best practices:
    - Use dir="auto" for automatic direction detection
    - Set direction based on first strong character
    - Use unicode-bidi: plaintext for mixed content
    - Place cursor correctly for RTL (right side)

# Existing Codebase Patterns
- file: packages/ui/src/components/bidirectional/BiInput.tsx
  why: |
    MIRROR THIS PATTERN for input component integration:
    - Uses useBidirectional hook for direction
    - Auto-detects direction with ARABIC_REGEX
    - Proper icon positioning with getInlineStartClass

    WE WILL EXTEND THIS with composition event handling.

- file: packages/ui/src/components/bidirectional/BiTextarea.tsx
  why: |
    Same pattern as BiInput but for textarea:
    - Auto-detection with autoDetectDirection prop
    - Proper RTL styling
    - Error message display

    ADD composition event handling to this too.

- file: packages/arabic-nlp/src/validation.ts
  why: |
    USE THESE FUNCTIONS for real-time validation:
    - validateArabicText(text, options) → full validation
    - isValidArabicInput(text) → quick boolean check
    - detectBidiThreats(text) → security checks

    CALL AFTER compositionend, not during typing!

- file: packages/arabic-nlp/src/normalization.ts
  why: |
    USE THESE for input normalization:
    - normalizeArabic(text, options) → full normalization
    - lightNormalization(text) → preserve diacritics
    - fullNormalization(text) → aggressive cleanup

    APPLY normalization on blur or form submit.

- file: packages/arabic-nlp/src/__tests__/integration.test.ts
  why: |
    MIRROR THESE TEST PATTERNS:
    - Bun test framework with describe/test/expect
    - Performance tests (<50ms for 1000 chars)
    - Security tests (bidi attacks, zero-width)
    - Iraqi Kurdish preservation tests
```

### Current Codebase Tree

```bash
packages/
├── ui/
│   ├── src/
│   │   ├── components/
│   │   │   └── bidirectional/
│   │   │       ├── BiInput.tsx              # Existing input component
│   │   │       ├── BiTextarea.tsx           # Existing textarea component
│   │   │       └── BiForm.tsx               # Form wrapper
│   │   ├── hooks/
│   │   │   └── useBidirectional.ts          # Direction utilities
│   │   └── utils/
│   │       └── bidirectional.ts             # ARABIC_REGEX constant
│   └── package.json
├── arabic-nlp/
│   ├── src/
│   │   ├── validation.ts                    # Validation functions
│   │   ├── normalization.ts                 # Normalization functions
│   │   ├── sanitization.ts                  # Security sanitization
│   │   ├── constants/
│   │   │   └── security-patterns.ts         # Regex patterns
│   │   └── __tests__/
│   │       └── integration.test.ts          # Test patterns to mirror
│   └── package.json
└── types/
    ├── src/
    │   ├── index.ts                         # Common types
    │   └── rtl.ts                           # Direction types
    └── package.json
```

### Desired Codebase Tree with New Files

```bash
packages/
├── ui/
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── useBidirectional.ts          # [EXISTING]
│   │   │   ├── useArabicInput.ts            # [NEW] Main input handling hook
│   │   │   ├── useCompositionTracking.ts    # [NEW] Composition event handling
│   │   │   ├── useInputValidation.ts        # [NEW] Real-time validation
│   │   │   └── useInputNormalization.ts     # [NEW] Input normalization
│   │   ├── utils/
│   │   │   ├── bidirectional.ts             # [EXISTING]
│   │   │   └── arabic-input.ts              # [NEW] Input utilities
│   │   └── types/
│   │       └── arabic-input.ts              # [NEW] Input types
│   └── __tests__/
│       ├── useArabicInput.test.ts           # [NEW] Hook tests
│       └── arabic-input.test.ts             # [NEW] Utility tests
└── arabic-nlp/
    └── src/
        └── __tests__/
            └── input-handling.test.ts       # [NEW] Integration tests
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: React composition event timing issues

// ❌ WRONG - onChange fires during composition
<input onChange={(e) => validateInput(e.target.value)} />

// ✅ CORRECT - Track composition state
const [isComposing, setIsComposing] = useState(false);
<input
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={(e) => {
    setIsComposing(false);
    validateInput(e.currentTarget.value); // Validate after composition
  }}
  onChange={(e) => {
    if (!isComposing) {
      validateInput(e.target.value); // Only validate if not composing
    }
  }}
/>

// GOTCHA: Bun test framework uses different import syntax than Jest
// ✅ Use this:
import { describe, test, expect } from "bun:test";

// ❌ NOT this:
import { describe, test, expect } from "@jest/globals";

// GOTCHA: Arabic normalization MUST preserve Iraqi Kurdish chars
// ✅ Always use preserveIraqiChars option:
normalizeArabic(text, { preserveIraqiChars: true }); // Preserves چ, گ, ڤ

// ❌ NEVER do this:
normalizeArabic(text, { preserveIraqiChars: false }); // WILL LOSE Kurdish chars!

// GOTCHA: Direction detection regex is already defined
// ✅ Import from existing utils:
import { ARABIC_REGEX } from "../utils/bidirectional";

// ❌ DON'T redefine:
const ARABIC_REGEX = /[\u0600-\u06FF]/; // Duplicate code!

// GOTCHA: TypeScript strict mode requires proper null checks
// ✅ Check before using:
const code = char.codePointAt(0);
if (code !== undefined) {
  // Safe to use code
}

// ❌ Will fail in strict mode:
const code = char.codePointAt(0);
console.log(code.toString(16)); // Error if code is undefined
```

---

## Implementation Blueprint

### File 1: Input Types (`packages/ui/src/types/arabic-input.ts`)

**Purpose**: TypeScript definitions for Arabic input handling system.

```typescript
/**
 * Arabic Input Handling Types
 * @module types/arabic-input
 */

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
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCompositionStart: (e: React.CompositionEvent) => void;
    onCompositionUpdate: (e: React.CompositionEvent) => void;
    onCompositionEnd: (e: React.CompositionEvent) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    dir: TextDirection;
  };

  // Manual control functions
  setValue: (value: string) => void;
  validate: () => Promise<ValidationResult>;
  normalize: () => string;
  reset: () => void;
}
```

### File 2: Composition Tracking Hook (`packages/ui/src/hooks/useCompositionTracking.ts`)

**Purpose**: Low-level composition event tracking for IME support.

```typescript
/**
 * Composition Event Tracking Hook
 * Handles Input Method Editor (IME) composition events for Arabic keyboards
 * @module hooks/useCompositionTracking
 */

import { useState, useCallback, useRef } from "react";
import type { CompositionState } from "../types/arabic-input";

/**
 * Track composition events for IME input (Arabic keyboards)
 *
 * Composition events fire when user types with Input Method Editors:
 * - Arabic: typing ش then adding kasra → شِ
 * - Japanese: typing "ka" → か
 *
 * CRITICAL: Don't trigger onChange/validation during composition!
 *
 * @returns Composition state and event handlers
 *
 * @example
 * ```tsx
 * function ArabicInput() {
 *   const composition = useCompositionTracking();
 *
 *   return (
 *     <input
 *       onCompositionStart={composition.handlers.onCompositionStart}
 *       onCompositionEnd={composition.handlers.onCompositionEnd}
 *       onChange={(e) => {
 *         if (!composition.state.isComposing) {
 *           // Safe to process - composition complete
 *           handleChange(e.target.value);
 *         }
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function useCompositionTracking() {
  const [state, setState] = useState<CompositionState>({
    isComposing: false,
    data: "",
    startPosition: 0,
  });

  // Track if compositionEnd fired (React timing workaround)
  const compositionEndFiredRef = useRef(false);

  const handleCompositionStart = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      compositionEndFiredRef.current = false;

      setState({
        isComposing: true,
        data: e.data || "",
        startPosition: e.currentTarget.selectionStart || 0,
      });
    },
    []
  );

  const handleCompositionUpdate = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setState((prev) => ({
        ...prev,
        data: e.data || "",
      }));
    },
    []
  );

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      compositionEndFiredRef.current = true;

      setState({
        isComposing: false,
        data: e.data || "",
        startPosition: 0,
      });
    },
    []
  );

  return {
    state,
    handlers: {
      onCompositionStart: handleCompositionStart,
      onCompositionUpdate: handleCompositionUpdate,
      onCompositionEnd: handleCompositionEnd,
    },
    // Utility to check if we should defer actions
    shouldDefer: () => state.isComposing || !compositionEndFiredRef.current,
  };
}
```

### File 3: Input Validation Hook (`packages/ui/src/hooks/useInputValidation.ts`)

**Purpose**: Real-time validation with debouncing and composition awareness.

```typescript
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
        return state.result || {
          isValid: true,
          errors: [],
          warnings: [],
          threats: [],
          confidence: 1,
        };
      }

      return new Promise((resolve) => {
        debounceTimerRef.current = setTimeout(async () => {
          setState((prev) => ({ ...prev, isValidating: true }));

          try {
            const result = validateArabicText(text, validationOptions);

            // Generate user-friendly error message
            const errorMessage = result.errors.length > 0
              ? result.errors[0].message
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
              errors: [{ code: "VALIDATION_ERROR", message: "Validation failed", severity: "error" }],
              warnings: [],
              threats: [],
              confidence: 0,
            });
          }
        }, debounceMs) as unknown as number;
      });
    },
    [isComposing, validationOptions, debounceMs, onValidationChange, state.result]
  );

  /**
   * Quick boolean validation (no debounce)
   */
  const quickValidate = useCallback(
    (text: string): boolean => {
      if (isComposing) return true; // Assume valid during composition
      return isValidArabicInput(text, validationOptions);
    },
    [isComposing, validationOptions]
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
```

### File 4: Input Normalization Hook (`packages/ui/src/hooks/useInputNormalization.ts`)

**Purpose**: Automatic text normalization for Arabic input.

```typescript
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
  options: UseInputNormalizationOptions = {}
) {
  const { preset = "light", options: customOptions, trigger = "on-blur" } = options;

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

        case "custom":
          // Custom options with full control
          const result = normalizeArabic(text, {
            form: "NFC",
            preserveIraqiChars: true, // ALWAYS preserve Kurdish chars
            ...customOptions,
          });
          return result.text;

        default:
          return text;
      }
    },
    [preset, customOptions]
  );

  return {
    normalize,
    trigger,
  };
}
```

### File 5: Main Arabic Input Hook (`packages/ui/src/hooks/useArabicInput.ts`)

**Purpose**: High-level hook that combines composition, validation, and normalization.

```typescript
/**
 * Arabic Input Handling Hook
 * Comprehensive Arabic input with IME support, validation, and normalization
 * @module hooks/useArabicInput
 */

import { useState, useCallback, useEffect, useMemo } from "react";
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
  options: UseArabicInputOptions = {}
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
    [composition.state.isComposing, enableValidation, validation, onChange]
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
    [composition.handlers, enableValidation, validation, onChange]
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
    [enableNormalization, normalization, onChange]
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
```

---

## Task List

```yaml
Task 1: Create TypeScript type definitions
  - CREATE packages/ui/src/types/arabic-input.ts
  - DEFINE CompositionState interface
  - DEFINE InputValidationState interface
  - DEFINE UseArabicInputOptions interface
  - DEFINE UseArabicInputReturn interface
  - EXPORT all types from packages/ui/src/types/index.ts

Task 2: Implement composition tracking hook
  - CREATE packages/ui/src/hooks/useCompositionTracking.ts
  - IMPLEMENT handleCompositionStart handler
  - IMPLEMENT handleCompositionUpdate handler
  - IMPLEMENT handleCompositionEnd handler
  - ADD shouldDefer utility function
  - USE useRef for composition end tracking (React timing workaround)

Task 3: Implement input validation hook
  - CREATE packages/ui/src/hooks/useInputValidation.ts
  - IMPORT validateArabicText from @iraqi-ai/arabic-nlp
  - IMPLEMENT validate function with debouncing
  - IMPLEMENT quickValidate function (no debounce)
  - ADD composition awareness (defer validation if isComposing)
  - CLEAN UP debounce timer on unmount

Task 4: Implement input normalization hook
  - CREATE packages/ui/src/hooks/useInputNormalization.ts
  - IMPORT normalizeArabic, lightNormalization, fullNormalization
  - IMPLEMENT normalize function with presets
  - SUPPORT light/full/custom presets
  - ALWAYS preserve Iraqi Kurdish characters

Task 5: Implement main Arabic input hook
  - CREATE packages/ui/src/hooks/useArabicInput.ts
  - COMPOSE useCompositionTracking + useInputValidation + useInputNormalization
  - IMPLEMENT handleChange (defer during composition)
  - IMPLEMENT handleCompositionEnd (validate + onChange)
  - IMPLEMENT handleBlur (normalize if enabled)
  - AUTO-DETECT direction with ARABIC_REGEX
  - RETURN inputProps spread object + control functions

Task 6: Create utility functions
  - CREATE packages/ui/src/utils/arabic-input.ts
  - IMPLEMENT detectArabicKeyboard() - detect Arabic keyboard layout
  - IMPLEMENT formatValidationMessage() - user-friendly error messages
  - IMPLEMENT getInputLength() - proper Unicode grapheme counting
  - EXPORT all utilities

Task 7: Update existing BiInput component
  - MODIFY packages/ui/src/components/bidirectional/BiInput.tsx
  - ADD useArabicInput hook integration
  - ADD validation display (error message)
  - ADD composition state indicator (optional)
  - PRESERVE existing functionality

Task 8: Update existing BiTextarea component
  - MODIFY packages/ui/src/components/bidirectional/BiTextarea.tsx
  - ADD useArabicInput hook integration
  - ADD validation display (error message)
  - ADD composition state indicator (optional)
  - PRESERVE existing functionality

Task 9: Write unit tests for composition tracking
  - CREATE packages/ui/__tests__/useCompositionTracking.test.ts
  - TEST composition start event
  - TEST composition update event
  - TEST composition end event
  - TEST shouldDefer utility

Task 10: Write unit tests for validation hook
  - CREATE packages/ui/__tests__/useInputValidation.test.ts
  - TEST validation with valid Arabic text
  - TEST validation with bidi attack
  - TEST validation deferred during composition
  - TEST debouncing works correctly

Task 11: Write unit tests for normalization hook
  - CREATE packages/ui/__tests__/useInputNormalization.test.ts
  - TEST light normalization preset
  - TEST full normalization preset
  - TEST Iraqi Kurdish character preservation
  - TEST custom normalization options

Task 12: Write integration tests for main hook
  - CREATE packages/ui/__tests__/useArabicInput.test.ts
  - TEST full workflow: type → compose → validate → normalize
  - TEST direction auto-detection
  - TEST onChange deferred during composition
  - TEST validation after composition ends
  - TEST normalization on blur

Task 13: Write Arabic NLP integration tests
  - CREATE packages/arabic-nlp/src/__tests__/input-handling.test.ts
  - TEST real-time validation performance (<100ms)
  - TEST composition + validation integration
  - TEST normalization + validation integration
  - TEST Iraqi Kurdish preservation in full workflow

Task 14: Update hook exports
  - MODIFY packages/ui/src/hooks/index.ts
  - EXPORT useArabicInput
  - EXPORT useCompositionTracking
  - EXPORT useInputValidation
  - EXPORT useInputNormalization

Task 15: Update main package exports
  - MODIFY packages/ui/src/index.ts
  - EXPORT all new hooks
  - EXPORT all new types
  - EXPORT all new utilities

Task 16: Run validation and tests
  - RUN bun run lint packages/ui packages/arabic-nlp
  - RUN bun run typecheck packages/ui packages/arabic-nlp
  - RUN bun test packages/ui/__tests__/
  - RUN bun test packages/arabic-nlp/__tests__/input-handling.test.ts
  - FIX any errors that arise
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run linting and type checking FIRST
cd C:/Users/Itokoro/Documents/projects/aqlix-ai

# Lint packages
bun run lint --filter "@iraqi-ai/ui"
bun run lint --filter "@iraqi-ai/arabic-nlp"

# Type check
bun run typecheck --filter "@iraqi-ai/ui"
bun run typecheck --filter "@iraqi-ai/arabic-nlp"

# Expected: No errors. If errors, READ carefully and fix before proceeding.
```

### Level 2: Unit Tests

```bash
# Test composition tracking hook
bun test packages/ui/__tests__/useCompositionTracking.test.ts -v

# Test validation hook
bun test packages/ui/__tests__/useInputValidation.test.ts -v

# Test normalization hook
bun test packages/ui/__tests__/useInputNormalization.test.ts -v

# Test main hook
bun test packages/ui/__tests__/useArabicInput.test.ts -v

# Expected: All tests passing. If failing, read error and fix logic.
```

### Level 3: Integration Tests

```bash
# Test Arabic NLP integration
bun test packages/arabic-nlp/__tests__/input-handling.test.ts -v

# Expected:
# - Performance: <100ms validation for 1000-char text
# - Security: 100% bidi attack detection
# - Preservation: Iraqi Kurdish chars preserved
```

### Level 4: Manual Testing

```typescript
// Create test file: packages/ui/__tests__/manual-test.tsx
import { useArabicInput } from "../src/hooks/useArabicInput";

function ManualTest() {
  const input = useArabicInput({
    autoDetectDirection: true,
    enableValidation: true,
    enableNormalization: true,
    onChange: (value) => console.log("Value:", value),
  });

  return (
    <div>
      <h2>Arabic Input Manual Test</h2>

      {/* Test Case 1: Arabic text with IME */}
      <input
        {...input.inputProps}
        placeholder="اكتب نصاً عربياً"
      />

      {/* Test Case 2: Mixed Arabic-English */}
      <input
        {...input.inputProps}
        placeholder="Name: الاسم / الاسم: Name"
      />

      {/* Test Case 3: Bidi attack */}
      <input
        {...input.inputProps}
        placeholder="Paste: test‮malicious‬"
      />

      {/* Display state */}
      <div>
        <p>Direction: {input.direction}</p>
        <p>Is Composing: {input.composition.isComposing ? "Yes" : "No"}</p>
        <p>Is Valid: {input.isValid ? "Yes" : "No"}</p>
        {input.validation.errorMessage && (
          <p className="error">{input.validation.errorMessage}</p>
        )}
      </div>
    </div>
  );
}

// Run with:
// bun run dev:web
// Navigate to test page
// Try typing Arabic text with keyboard
// Try copying bidi attack text
// Verify no onChange during composition
// Verify validation after composition ends
```

---

## Final Validation Checklist

- [ ] All tests pass: `bun test packages/ui/__tests__/ packages/arabic-nlp/__tests__/input-handling.test.ts`
- [ ] No linting errors: `bun run lint --filter "@iraqi-ai/ui" --filter "@iraqi-ai/arabic-nlp"`
- [ ] No type errors: `bun run typecheck --filter "@iraqi-ai/ui" --filter "@iraqi-ai/arabic-nlp"`
- [ ] Manual test: Arabic IME input works without interruption
- [ ] Manual test: Validation fires after composition ends, not during
- [ ] Manual test: Normalization preserves Iraqi Kurdish characters
- [ ] Manual test: Direction auto-detection works for Arabic/English
- [ ] Manual test: Bidi attacks detected and prevented
- [ ] Performance: Validation <100ms for 1000-character text
- [ ] Security: 100% bidi attack detection rate
- [ ] Documentation: All functions have JSDoc comments
- [ ] Exports: All hooks/types exported from package index

---

## Anti-Patterns to Avoid

```typescript
// ❌ DON'T validate during composition
<input
  onChange={(e) => validateInput(e.target.value)} // WRONG!
/>

// ✅ DO defer validation until composition ends
<input
  onChange={(e) => {
    if (!isComposing) validateInput(e.target.value);
  }}
  onCompositionEnd={(e) => {
    validateInput(e.currentTarget.value); // CORRECT!
  }}
/>

// ❌ DON'T normalize without preserving Kurdish chars
normalizeArabic(text, { preserveIraqiChars: false }); // WRONG!

// ✅ DO always preserve Iraqi Kurdish characters
normalizeArabic(text, { preserveIraqiChars: true }); // CORRECT!

// ❌ DON'T redefine existing regex patterns
const ARABIC_REGEX = /[\u0600-\u06FF]/; // WRONG! Already defined

// ✅ DO import from existing utils
import { ARABIC_REGEX } from "../utils/bidirectional"; // CORRECT!

// ❌ DON'T use setTimeout without cleanup
setTimeout(() => validate(text), 300); // WRONG! Memory leak

// ✅ DO cleanup timers on unmount
useEffect(() => {
  const timer = setTimeout(() => validate(text), 300);
  return () => clearTimeout(timer); // CORRECT!
}, [text]);

// ❌ DON'T trigger onChange multiple times
onChange(value); // onChange during composition
onChange(value); // onChange after composition
// WRONG! User gets confused

// ✅ DO trigger onChange only after composition
if (!isComposing) {
  onChange(value); // CORRECT! Only once
}
```

---

## PRP Confidence Score

**Score: 9/10**

**Confidence Justification**:
- ✅ Comprehensive context provided (existing patterns, documentation, gotchas)
- ✅ Clear implementation blueprint with TypeScript code examples
- ✅ Executable validation gates with specific commands
- ✅ Detailed task list with file paths and order
- ✅ Real examples from codebase (BiInput, arabic-nlp)
- ✅ Web search results for composition events (2025 best practices)
- ✅ Security and cultural compliance requirements documented
- ⚠️ Minor uncertainty: BiInput/BiTextarea modification extent (preserve existing vs. full replacement)

**Why 9/10 instead of 10/10**:
- Need to see actual component usage patterns to determine exact integration approach
- May need minor adjustments based on existing component props/state

**Expected Implementation Time**: 4-6 hours for one-pass implementation by AI agent.

---

**End of PRP**
