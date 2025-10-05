"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface ErrorFallbackProps {
  error: Error;
  reset?: () => void;
  title?: string;
  message?: string;
}

/**
 * Generic Error Fallback Component
 *
 * Displays user-friendly error information with optional retry action.
 */
export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  message,
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          {message ||
            (isDevelopment ? error.message : "An unexpected error occurred.")}
        </p>
        {reset && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 text-sm underline hover:no-underline"
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Inline Error Display
 *
 * Minimal error display for inline use (e.g., in cards, forms).
 */
export function InlineError({
  error,
  retry,
}: {
  error: Error;
  retry?: () => void;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-800">{error.message}</p>
        {retry && (
          <button
            onClick={retry}
            className="mt-1 text-red-600 hover:text-red-800 underline text-xs"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
