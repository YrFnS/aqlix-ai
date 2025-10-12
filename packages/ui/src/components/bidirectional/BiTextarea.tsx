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
      ...props
    },
    ref,
  ) => {
    // Detect direction from textarea value if auto-detect is enabled
    const detectedDirection = React.useMemo(() => {
      // Only auto-detect when direction is 'auto' or undefined
      if (!autoDetectDirection || !value || (propDirection !== 'auto' && propDirection !== undefined)) {
        return propDirection;
      }

      const valueStr = String(value);
      return ARABIC_REGEX.test(valueStr) ? "rtl" : "ltr";
    }, [autoDetectDirection, value, propDirection]);

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

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={textareaClasses}
          dir={direction}
          value={value}
          onChange={onChange}
          {...props}
        />

        {error && errorMessage && (
          <p className="mt-1 text-sm text-destructive" dir={direction}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

export const BiTextarea = React.memo(BiTextareaInner);

BiTextarea.displayName = "BiTextarea";
