"use client";

import { useState, useCallback } from "react";

export interface AsyncErrorState {
  error: Error | null;
  isError: boolean;
}

export interface AsyncErrorHandlers {
  setError: (error: Error | null) => void;
  clearError: () => void;
  handleAsyncError: <T>(promise: Promise<T>) => Promise<T>;
}

/**
 * Hook for handling async operation errors
 *
 * Manages error state for async operations and provides
 * utilities for error handling and clearing.
 *
 * @example
 * const { error, isError, handleAsyncError, clearError } = useAsyncError();
 *
 * const fetchData = async () => {
 *   await handleAsyncError(
 *     fetch('/api/data').then(res => res.json())
 *   );
 * };
 */
export function useAsyncError(): AsyncErrorState & AsyncErrorHandlers {
  const [error, setErrorState] = useState<Error | null>(null);

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

  return {
    error,
    isError: error !== null,
    setError,
    clearError,
    handleAsyncError,
  };
}
