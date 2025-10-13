/**
 * BiTextarea - Bidirectional Textarea Component
 *
 * Direction-aware textarea with proper Arabic text alignment.
 * Supports auto-detection and mixed content.
 *
 * @module components/bidirectional/BiTextarea
 */

import React from "react";
import type { BidirectionalProps } from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";
import { useArabicInput } from "../../hooks/useArabicInput";
import { ARABIC_REGEX } from "../../utils/bidirectional";

/**
 * BiTextarea Props
 */
export interface BiTextareaProps
  extends BidirectionalProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "dir"> {
  /** Auto-detect direction from input value */
  autoDetectDirection?: boolean;

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
 * Bidirectional Textarea Component
 *
 * Textarea with direction-aware alignment and placeholder.
 *
 * @example
 * ```tsx
 * <BiTextarea
 *   placeholder="أدخل نصك هنا..."
 *   direction="rtl"
 *   rows={4}
 * />
 * ```
 */
const BiTextareaInner = React.forwardRef<HTMLTextAreaElement, BiTextareaProps>(
  (
    {
      direction: propDirection,
      autoDetectDirection = false,
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
              } as React.ChangeEvent<HTMLTextAreaElement>;
              onChange(syntheticEvent);
            }
          }
        : undefined,
    });

    // Detect direction from textarea value if auto-detect is enabled (fallback)
    const detectedDirection = React.useMemo(() => {
      if (enableArabicInput && arabicInput) {
        return arabicInput.direction;
      }

      // Only auto-detect when direction is 'auto' or undefined
      if (
        !autoDetectDirection ||
        !value ||
        (propDirection !== "auto" && propDirection !== undefined)
      ) {
        return propDirection;
      }

      const valueStr = String(value);
      return ARABIC_REGEX.test(valueStr) ? "rtl" : "ltr";
    }, [
      enableArabicInput,
      arabicInput,
      autoDetectDirection,
      value,
      propDirection,
    ]);

    const { direction } = useBidirectional(detectedDirection);

    // Base textarea classes
    const baseClasses =
      "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
      "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none " +
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
      "disabled:cursor-not-allowed disabled:opacity-50";

    // Error classes
    const errorClasses = error
      ? "border-destructive focus-visible:ring-destructive"
      : "";

    // Combine all classes
    const textareaClasses = `
      ${baseClasses}
      ${errorClasses}
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
    const textareaProps =
      enableArabicInput && arabicInput
        ? {
            ...arabicInput.inputProps,
            ...props,
            ref,
            className: textareaClasses,
          }
        : {
            ref,
            className: textareaClasses,
            dir: direction,
            value,
            onChange,
            ...props,
          };

    return (
      <div className="relative w-full">
        <textarea {...textareaProps} />

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
              className="absolute top-2 right-2 flex h-2 w-2"
              title="Composing Arabic text..."
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
      </div>
    );
  },
);

export const BiTextarea = React.memo(BiTextareaInner);

BiTextarea.displayName = "BiTextarea";
