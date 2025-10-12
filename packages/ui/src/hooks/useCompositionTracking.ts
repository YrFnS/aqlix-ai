/**
 * Composition Event Tracking Hook
 * Handles Input Method Editor (IME) composition events for Arabic keyboards
 * @module hooks/useCompositionTracking
 */

import { useState, useCallback, useRef } from "react";
import type { CompositionState } from "../types/arabic-input";

/**
 * Track composition events for IME input (Arabic keyboards)
 *
 * Composition events fire when user types with Input Method Editors:
 * - Arabic: typing ش then adding kasra → شِ
 * - Japanese: typing "ka" → か
 *
 * CRITICAL: Don't trigger onChange/validation during composition!
 *
 * @returns Composition state and event handlers
 *
 * @example
 * ```tsx
 * function ArabicInput() {
 *   const composition = useCompositionTracking();
 *
 *   return (
 *     <input
 *       onCompositionStart={composition.handlers.onCompositionStart}
 *       onCompositionEnd={composition.handlers.onCompositionEnd}
 *       onChange={(e) => {
 *         if (!composition.state.isComposing) {
 *           // Safe to process - composition complete
 *           handleChange(e.target.value);
 *         }
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function useCompositionTracking() {
  const [state, setState] = useState<CompositionState>({
    isComposing: false,
    data: "",
    startPosition: 0,
  });

  // Track if compositionEnd fired (React timing workaround)
  const compositionEndFiredRef = useRef(false);

  const handleCompositionStart = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      compositionEndFiredRef.current = false;

      setState({
        isComposing: true,
        data: e.data || "",
        startPosition: e.currentTarget.selectionStart || 0,
      });
    },
    [],
  );

  const handleCompositionUpdate = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setState((prev) => ({
        ...prev,
        data: e.data || "",
      }));
    },
    [],
  );

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      compositionEndFiredRef.current = true;

      setState({
        isComposing: false,
        data: e.data || "",
        startPosition: 0,
      });
    },
    [],
  );

  return {
    state,
    handlers: {
      onCompositionStart: handleCompositionStart,
      onCompositionUpdate: handleCompositionUpdate,
      onCompositionEnd: handleCompositionEnd,
    },
    // Utility to check if we should defer actions
    shouldDefer: () => state.isComposing || !compositionEndFiredRef.current,
  };
}
