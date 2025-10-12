/**
 * BiInput - Bidirectional Input Component
 *
 * Direction-aware input with proper Arabic text alignment and placeholder handling.
 * Automatically detects content direction for mixed Arabic-English input.
 *
 * @module components/bidirectional/BiInput
 */

import React from "react";
import type { BidirectionalProps } from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";
import { useArabicInput } from "../../hooks/useArabicInput";
import { ARABIC_REGEX } from "../../utils/bidirectional";

/**
 * BiInput Props
 */
export interface BiInputProps
  extends BidirectionalProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "dir"> {
  /** Auto-detect direction from input value */
  autoDetectDirection?: boolean;

  /** Leading icon */
  leadingIcon?: React.ReactNode;

  /** Trailing icon */
  trailingIcon?: React.ReactNode;

  /** Error state */
  error?: boolean;

  /** Error message */
  errorMessage?: string;

  /** Enable Arabic input handling with IME support (composition events, validation, normalization) */
  enableArabicInput?: boolean;

  /** Enable real-time validation for Arabic input */
  enableValidation?: boolean;

  /** Enable automatic normalization for Arabic input */
  enableNormalization?: boolean;
}

/**
 * Bidirectional Input Component
 *
 * Input field with direction-aware placeholder and text alignment.
 * Supports auto-detection of Arabic/English content.
 *
 * @example
 * ```tsx
 * // Auto-detect direction based on input
 * <BiInput
 *   placeholder="أدخل اسمك / Enter your name"
 *   autoDetectDirection
 * />
 *
 * // Fixed RTL direction
 * <BiInput
 *   direction="rtl"
 *   placeholder="أدخل اسمك"
 * />
 *
 * // With icons
 * <BiInput
 *   leadingIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 * ```
 */
export const BiInput = React.memo<BiInputProps>(
  React.forwardRef<HTMLInputElement, BiInputProps>(
    (
      {
        direction: propDirection,
        autoDetectDirection = false,
        leadingIcon,
        trailingIcon,
        error = false,
        errorMessage,
        className = "",
        value,
        onChange,
        enableArabicInput = false,
        enableValidation = false,
        enableNormalization = false,
        ...props
      },
      ref,
    ) => {
      // Use Arabic input hook if enabled
      const arabicInput = useArabicInput({
        initialValue: value ? String(value) : "",
        autoDetectDirection: enableArabicInput ? autoDetectDirection : false,
        enableValidation: enableArabicInput ? enableValidation : false,
        enableNormalization: enableArabicInput ? enableNormalization : false,
        onChange: enableArabicInput
          ? (newValue) => {
              // Trigger parent onChange with synthetic event
              if (onChange) {
                const syntheticEvent = {
                  target: { value: newValue },
                  currentTarget: { value: newValue },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
              }
            }
          : undefined,
      });

      // Detect direction from input value if auto-detect is enabled (fallback)
      const detectedDirection = React.useMemo(() => {
        if (enableArabicInput && arabicInput) {
          return arabicInput.direction;
        }

        if (!autoDetectDirection || !value) return propDirection ?? "ltr";

        const valueStr = String(value);
        return ARABIC_REGEX.test(valueStr) ? "rtl" : "ltr";
      }, [
        enableArabicInput,
        arabicInput,
        autoDetectDirection,
        value,
        propDirection,
      ]);

      const { direction, getInlineStartClass, getInlineEndClass } =
        useBidirectional(detectedDirection);

      // Base input classes
      const baseClasses =
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

      // Error classes
      const errorClasses = error
        ? "border-destructive focus-visible:ring-destructive"
        : "";

      // Icon padding
      const paddingClasses =
        `${leadingIcon ? getInlineStartClass("10") : ""} ${trailingIcon ? getInlineEndClass("10") : ""}`.trim();

      // Combine all classes
      const inputClasses = `
      ${baseClasses}
      ${errorClasses}
      ${paddingClasses}
      ${className}
    `.trim();

      // Determine final error state (component error or validation error)
      const hasError =
        error || (enableArabicInput && arabicInput && !arabicInput.isValid);
      const finalErrorMessage =
        errorMessage ||
        (enableArabicInput && arabicInput?.validation.errorMessage) ||
        undefined;

      // Spread Arabic input props if enabled
      const inputProps =
        enableArabicInput && arabicInput
          ? {
              ...arabicInput.inputProps,
              ...props,
              ref,
              className: inputClasses,
            }
          : {
              ref,
              className: inputClasses,
              dir: direction,
              value,
              onChange,
              ...props,
            };

      return (
        <div className="relative w-full">
          {leadingIcon && (
            <div
              className={`absolute ${getInlineStartClass("3")} top-1/2 -translate-y-1/2 text-muted-foreground`}
            >
              {leadingIcon}
            </div>
          )}

          <input {...inputProps} />

          {trailingIcon && (
            <div
              className={`absolute ${getInlineEndClass("3")} top-1/2 -translate-y-1/2 text-muted-foreground`}
            >
              {trailingIcon}
            </div>
          )}

          {hasError && finalErrorMessage && (
            <p className="mt-1 text-sm text-destructive" dir={direction}>
              {finalErrorMessage}
            </p>
          )}

          {/* Optional: Show composition indicator when typing with Arabic keyboard */}
          {enableArabicInput &&
            arabicInput &&
            arabicInput.composition.isComposing && (
              <span
                className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2 w-2"
                title="Composing Arabic text..."
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
        </div>
      );
    },
  ),
);

BiInput.displayName = "BiInput";
