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
        ...props
      },
      ref,
    ) => {
      // Detect direction from input value if auto-detect is enabled
      const detectedDirection = React.useMemo(() => {
        if (!autoDetectDirection || !value) return propDirection;

        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        const valueStr = String(value);
        return arabicRegex.test(valueStr) ? "rtl" : "ltr";
      }, [autoDetectDirection, value, propDirection]);

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

      return (
        <div className="relative w-full">
          {leadingIcon && (
            <div
              className={`absolute ${getInlineStartClass("3")} top-1/2 -translate-y-1/2 text-muted-foreground`}
            >
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            className={inputClasses}
            dir={direction}
            value={value}
            onChange={onChange}
            {...props}
          />

          {trailingIcon && (
            <div
              className={`absolute ${getInlineEndClass("3")} top-1/2 -translate-y-1/2 text-muted-foreground`}
            >
              {trailingIcon}
            </div>
          )}

          {error && errorMessage && (
            <p className="mt-1 text-sm text-destructive" dir={direction}>
              {errorMessage}
            </p>
          )}
        </div>
      );
    },
  ),
);

BiInput.displayName = "BiInput";
