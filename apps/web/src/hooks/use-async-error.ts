"use client";

import { useState, useCallback } from "react";
import {
  retryAsync,
  withTimeout,
  robustAsync,
} from "@/lib/async-error-handling";
import type { RetryOptions, TimeoutOptions } from "@/lib/async-error-handling";

export interface AsyncErrorState {
  error: Error | null;
  isError: boolean;
  isRetrying?: boolean;
}

export interface AsyncErrorHandlers {
  setError: (error: Error | null) => void;
  clearError: () => void;
  handleAsyncError: <T>(promise: Promise<T>) => Promise<T>;
  handleWithRetry: <T>(
    operation: () => Promise<T>,
    options?: RetryOptions,
  ) => Promise<T>;
  handleWithTimeout: <T>(promise: Promise<T>, timeoutMs?: number) => Promise<T>;
  handleRobust: <T>(
    operation: () => Promise<T>,
    options?: { retryOptions?: RetryOptions; timeoutOptions?: TimeoutOptions },
  ) => Promise<T | null>;
}

/**
 * Hook for handling async operation errors
 *
 * Manages error state for async operations and provides
 * utilities for error handling, retries, timeouts, and clearing.
 *
 * @example
 * const { error, isError, handleAsyncError, handleWithRetry } = useAsyncError();
 *
 * const fetchData = async () => {
 *   await handleAsyncError(
 *     fetch('/api/data').then(res => res.json())
 *   );
 * };
 *
 * const fetchWithRetry = async () => {
 *   await handleWithRetry(
 *     () => fetch('/api/data').then(res => res.json()),
 *     { maxRetries: 3 }
 *   );
 * };
 */
export function useAsyncError(): AsyncErrorState & AsyncErrorHandlers {
  const [error, setErrorState] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const setError = useCallback((error: Error | null) => {
    setErrorState(error);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleAsyncError = useCallback(
    async <T>(promise: Promise<T>) => {
      try {
        clearError();
        const result = await promise;
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        throw error; // Re-throw to allow caller to handle if needed
      }
    },
    [clearError, setError],
  );

  const handleWithRetry = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options?: RetryOptions,
    ): Promise<T> => {
      try {
        clearError();
        setIsRetrying(true);

        const result = await retryAsync(operation, {
          ...options,
          onRetry: (attempt, err) => {
            console.warn(`Retrying (attempt ${attempt}):`, err);
            options?.onRetry?.(attempt, err);
          },
        });

        if (!result.success) {
          const err = result.error || new Error("Retry operation failed");
          setError(err);
          throw err;
        }

        // Runtime type guard: ensure data is not null/undefined
        if (result.data === null || result.data === undefined) {
          const err = new Error("Operation succeeded but returned no data");
          setError(err);
          throw err;
        }

        return result.data as T;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        throw error;
      } finally {
        setIsRetrying(false);
      }
    },
    [clearError, setError],
  );

  const handleWithTimeout = useCallback(
    async <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
      try {
        clearError();
        return await withTimeout(promise, { timeoutMs });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Operation timed out");
        setError(error);
        throw error;
      }
    },
    [clearError, setError],
  );

  /**
   * Handles async operations with robust error handling including retry and timeout support.
   *
   * @throws Error when the operation fails after all retries or times out
   * @returns Promise<T> - The successful operation result
   *
   * Note: This function throws errors on failure, consistent with handleWithRetry.
   * Use try-catch blocks when calling this function.
   */
  const handleRobust = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options?: {
        retryOptions?: RetryOptions;
        timeoutOptions?: TimeoutOptions;
      },
    ): Promise<T> => {
      try {
        clearError();
        setIsRetrying(true);

        const result = await robustAsync(operation, options);

        if (!result.success) {
          const err = result.error || new Error("Operation failed");
          setError(err);
          throw err;
        }

        // Runtime type guard: ensure data is not null/undefined
        if (result.data === null || result.data === undefined) {
          const err = new Error("Operation succeeded but returned no data");
          setError(err);
          throw err;
        }

        return result.data as T;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        throw error;
      } finally {
        setIsRetrying(false);
      }
    },
    [clearError, setError],
  );

  return {
    error,
    isError: error !== null,
    isRetrying,
    setError,
    clearError,
    handleAsyncError,
    handleWithRetry,
    handleWithTimeout,
    handleRobust,
  };
}
