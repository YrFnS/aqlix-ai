import type * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Form Error Component
 *
 * Reusable component for displaying form-level errors.
 * Used for errors that don't belong to a specific field.
 *
 * Features:
 * - Accessible with role="alert" for screen readers
 * - Consistent styling with FormMessage
 * - Optional error icon
 * - Supports Error objects or string messages
 *
 * @example
 * <FormError error="Failed to submit form" />
 * <FormError error={errorObject} showIcon />
 */

export interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Error message or Error object */
  error?: string | Error | null;
  /** Show error icon (default: true) */
  showIcon?: boolean;
}

export function FormError({
  error,
  showIcon = true,
  className,
  ...props
}: FormErrorProps) {
  // Extract message from Error object or use string directly
  const message = error instanceof Error ? error.message : error;

  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive",
        className,
      )}
      {...props}
    >
      {showIcon && (
        <AlertCircle
          className="h-4 w-4 mt-0.5 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <p className="flex-1">{message}</p>
    </div>
  );
}
