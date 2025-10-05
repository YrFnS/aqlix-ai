/**
 * Form Persistence Hook
 *
 * Automatically saves and restores form state to localStorage.
 * Useful for multi-step forms, draft saves, or preventing data loss.
 *
 * Features:
 * - Automatic save on form value changes
 * - Debounced writes to localStorage
 * - Restore on mount
 * - Manual save/clear utilities
 * - Type-safe with form schema
 *
 * @example
 * const form = useForm<FormData>({ ... });
 * useFormPersist(form, "contact-form");
 */

import { useEffect, useRef, useCallback } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

export interface UseFormPersistOptions {
  /** Debounce delay in milliseconds (default: 1000) */
  debounceDelay?: number;
  /** Storage key prefix (default: "form") */
  storagePrefix?: string;
  /** Exclude specific fields from persistence */
  exclude?: string[];
  /** Session storage instead of localStorage */
  sessionStorage?: boolean;
}

/**
 * Custom hook for form persistence to localStorage
 *
 * @param form - react-hook-form instance
 * @param storageKey - Unique key for localStorage
 * @param options - Persistence options
 *
 * @example
 * const form = useForm<FormData>({ ... });
 * const { clearStorage } = useFormPersist(form, "my-form", {
 *   debounceDelay: 500,
 *   exclude: ["password"],
 * });
 */
export function useFormPersist<T extends FieldValues>(
  form: UseFormReturn<T>,
  storageKey: string,
  options: UseFormPersistOptions = {},
) {
  const {
    debounceDelay = 1000,
    storagePrefix = "form",
    exclude = [],
    sessionStorage: useSessionStorage = false,
  } = options;

  const storage = useSessionStorage
    ? window.sessionStorage
    : window.localStorage;
  const fullStorageKey = `${storagePrefix}:${storageKey}`;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  /**
   * Save form values to storage
   */
  const saveToStorage = useCallback(
    (values: T) => {
      try {
        // Filter out excluded fields
        const filteredValues = Object.keys(values).reduce((acc, key) => {
          if (!exclude.includes(key)) {
            acc[key as keyof T] = values[key as keyof T];
          }
          return acc;
        }, {} as Partial<T>);

        storage.setItem(fullStorageKey, JSON.stringify(filteredValues));
      } catch (error) {
        console.error("Failed to save form to storage:", error);
      }
    },
    [storage, fullStorageKey, exclude],
  );

  /**
   * Restore form values from storage
   */
  const restoreFromStorage = () => {
    try {
      const stored = storage.getItem(fullStorageKey);
      if (stored) {
        const values = JSON.parse(stored) as Partial<T>;

        isRestoringRef.current = true;

        // Reset form with stored values
        Object.keys(values).forEach((key) => {
          if (values[key as keyof T] !== undefined) {
            form.setValue(key as never, values[key as keyof T] as never, {
              shouldValidate: false,
              shouldDirty: false,
            });
          }
        });

        isRestoringRef.current = false;
      }
    } catch (error) {
      console.error("Failed to restore form from storage:", error);
    }
  };

  /**
   * Clear storage
   */
  const clearStorage = () => {
    try {
      storage.removeItem(fullStorageKey);
    } catch (error) {
      console.error("Failed to clear form storage:", error);
    }
  };

  /**
   * Restore form values on mount
   */
  useEffect(() => {
    restoreFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Save form values on change (debounced)
   */
  useEffect(() => {
    const subscription = form.watch((values) => {
      // Skip saving during restore
      if (isRestoringRef.current) {
        return;
      }

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        saveToStorage(values as T);
      }, debounceDelay);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, debounceDelay, saveToStorage]);

  /**
   * Clear storage on successful form submission (optional)
   * Can be called manually in onSubmit handler
   */
  return {
    clearStorage,
    saveNow: () => saveToStorage(form.getValues()),
    restoreNow: restoreFromStorage,
  };
}
