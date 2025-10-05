"use client";

import { useCallback } from "react";

export interface ErrorHandlerOptions {
  /** Log errors to console in development */
  logError?: boolean;
  /** Custom error message for user display */
  userMessage?: string;
  /** Callback when error occurs */
  onError?: (error: Error) => void;
}

/**
 * Generic error handler hook
 *
 * Provides consistent error handling with logging and custom callbacks.
 * Useful for event handlers and async operations.
 *
 * @example
 * const handleError = useErrorHandler({
 *   logError: true,
 *   onError: (error) => toast.error(error.message)
 * });
 *
 * const onClick = () => {
 *   try {
 *     // risky operation
 *   } catch (err) {
 *     handleError(err);
 *   }
 * };
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { logError = true, onError } = options;

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      // Log in development
      if (logError && process.env.NODE_ENV === "development") {
        console.error(`Error${context ? ` in ${context}` : ""}:`, errorObj);
      }

      // Future: Send to error logging service (Sentry)
      // logErrorToService(errorObj, context);

      // Call custom handler
      onError?.(errorObj);

      return errorObj;
    },
    [logError, onError],
  );

  return handleError;
}
