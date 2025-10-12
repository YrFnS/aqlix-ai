/**
 * useBidirectional Hook
 *
 * Provides direction-aware utilities for bidirectional components.
 * Integrates with DirectionProvider and provides memoized helpers.
 *
 * @module hooks/useBidirectional
 */

import { useMemo } from "react";
import type { TextDirection } from "@iraqi-ai/types";
import type { DirectionalAlignment } from "../types/bidirectional";
import {
  getDirectionalClasses,
  getInlineStart,
  getInlineEnd,
  getFlexDirection,
  getInlineStartClass,
  getInlineEndClass,
  getAlignmentClass,
  getDirectionCSSProperties,
  normalizeDirection,
  getOppositeDirection,
} from "../utils/bidirectional";

/**
 * Direction-aware hook return type
 */
export interface UseBidirectionalReturn {
  /** Normalized direction (rtl or ltr) */
  direction: "rtl" | "ltr";

  /** Whether current direction is RTL */
  isRTL: boolean;

  /** Whether current direction is LTR */
  isLTR: boolean;

  /** Get inline start position */
  getInlineStart: () => "left" | "right";

  /** Get inline end position */
  getInlineEnd: () => "left" | "right";

  /** Get directional classes */
  getDirectionClasses: (baseClasses?: string) => string;

  /** Get flex direction class */
  getFlexDirection: (reverse?: boolean) => string;

  /** Get inline start spacing class */
  getInlineStartClass: (value: string) => string;

  /** Get inline end spacing class */
  getInlineEndClass: (value: string) => string;

  /** Get text alignment class */
  getAlignmentClass: (alignment: DirectionalAlignment) => string;

  /** Get direction CSS custom properties */
  getCSSProperties: () => Record<string, string>;

  /** Get opposite direction */
  getOppositeDirection: () => "rtl" | "ltr";
}

/**
 * Hook for direction-aware component logic
 *
 * Provides memoized utilities for building direction-aware components.
 * Integrates with DirectionProvider context when available.
 *
 * @param overrideDirection - Optional direction override
 * @param text - Optional text for auto direction detection
 * @returns Direction-aware utilities
 *
 * @example
 * ```tsx
 * function MyComponent({ direction, children }) {
 *   const {
 *     isRTL,
 *     getDirectionClasses,
 *     getInlineStartClass
 *   } = useBidirectional(direction);
 *
 *   return (
 *     <div className={getDirectionClasses('container')}>
 *       <span className={getInlineStartClass('4')}>
 *         {children}
 *       </span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBidirectional(
  overrideDirection?: TextDirection,
  text?: string,
): UseBidirectionalReturn {
  // Normalize direction
  const direction = useMemo(
    () => normalizeDirection(overrideDirection || "ltr", text),
    [overrideDirection, text],
  );

  const isRTL = direction === "rtl";
  const isLTR = direction === "ltr";

  // Memoize direction-aware helpers
  const helpers = useMemo(
    () => ({
      getInlineStart: () => getInlineStart(isRTL),
      getInlineEnd: () => getInlineEnd(isRTL),

      getDirectionClasses: (baseClasses = "") =>
        getDirectionalClasses(direction, baseClasses),

      getFlexDirection: (reverse = false) => getFlexDirection(isRTL, reverse),

      getInlineStartClass: (value: string) => getInlineStartClass(isRTL, value),

      getInlineEndClass: (value: string) => getInlineEndClass(isRTL, value),

      getAlignmentClass: (alignment: DirectionalAlignment) =>
        getAlignmentClass(alignment, isRTL),

      getCSSProperties: () => getDirectionCSSProperties(isRTL),

      getOppositeDirection: () =>
        getOppositeDirection(direction) as "rtl" | "ltr",
    }),
    [isRTL, direction],
  );

  return {
    direction,
    isRTL,
    isLTR,
    ...helpers,
  };
}

/**
 * Hook for direction-aware utilities without context dependency
 *
 * Lighter version of useBidirectional that doesn't require DirectionProvider.
 * Useful for standalone components or library usage.
 *
 * @param direction - Text direction
 * @returns Direction-aware utilities
 *
 * @example
 * ```tsx
 * function StandaloneComponent({ direction = 'ltr' }) {
 *   const { isRTL, getInlineStartClass } = useBidirectionalUtils(direction);
 *
 *   return (
 *     <div className={getInlineStartClass('4')}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useBidirectionalUtils(
  direction: "rtl" | "ltr",
): Omit<UseBidirectionalReturn, "direction"> {
  const isRTL = direction === "rtl";
  const isLTR = direction === "ltr";

  const helpers = useMemo(
    () => ({
      getInlineStart: () => getInlineStart(isRTL),
      getInlineEnd: () => getInlineEnd(isRTL),
      getDirectionClasses: (baseClasses = "") =>
        getDirectionalClasses(direction, baseClasses),
      getFlexDirection: (reverse = false) => getFlexDirection(isRTL, reverse),
      getInlineStartClass: (value: string) => getInlineStartClass(isRTL, value),
      getInlineEndClass: (value: string) => getInlineEndClass(isRTL, value),
      getAlignmentClass: (alignment: DirectionalAlignment) =>
        getAlignmentClass(alignment, isRTL),
      getCSSProperties: () => getDirectionCSSProperties(isRTL),
      getOppositeDirection: () =>
        getOppositeDirection(direction) as "rtl" | "ltr",
    }),
    [isRTL, direction],
  );

  return {
    isRTL,
    isLTR,
    ...helpers,
  };
}
