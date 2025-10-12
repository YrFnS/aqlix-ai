/**
 * Bidirectional Utility Functions
 *
 * Core utilities for direction-aware layouts using CSS logical properties.
 * Provides functions for generating directional classes, spacing, and alignment.
 *
 * @module utils/bidirectional
 */

import type { TextDirection } from "@iraqi-ai/types";
import type {
  DirectionalSpacing,
  DirectionalClasses,
  DirectionalAlignment,
} from "../types/bidirectional";

/**
 * Generates direction-aware CSS classes
 *
 * Creates classes for text alignment and direction based on the provided direction.
 * Uses text-align: start/end for automatic direction support.
 *
 * @param direction - Text direction
 * @param baseClasses - Base CSS classes to include
 * @returns Combined CSS class string
 *
 * @example
 * ```ts
 * getDirectionalClasses('rtl') // 'rtl text-right'
 * getDirectionalClasses('ltr', 'font-sans') // 'font-sans ltr text-left'
 * getDirectionalClasses('auto', 'container') // 'container auto'
 * ```
 */
export function getDirectionalClasses(
  direction: TextDirection,
  baseClasses = "",
): string {
  const directionClass = direction;
  let alignmentClass = "";

  if (direction === "rtl") {
    alignmentClass = "text-right";
  } else if (direction === "ltr") {
    alignmentClass = "text-left";
  }
  // For 'auto', no alignment class (let browser decide)

  return `${baseClasses} ${directionClass} ${alignmentClass}`.trim();
}

/**
 * Converts directional spacing to CSS logical properties
 *
 * Transforms spacing values into CSS logical property notation.
 * Useful for programmatic style generation.
 *
 * @param spacing - Directional spacing configuration
 * @returns CSS properties object
 *
 * @example
 * ```ts
 * getLogicalSpacing({ inlineStart: '1rem', blockStart: '2rem' })
 * // { paddingInlineStart: '1rem', paddingBlockStart: '2rem' }
 * ```
 */
export function getLogicalSpacing(
  spacing: DirectionalSpacing,
): Record<string, string> {
  const cssProps: Record<string, string> = {};

  if (spacing.inlineStart !== undefined) {
    cssProps.paddingInlineStart =
      typeof spacing.inlineStart === "number"
        ? `${spacing.inlineStart}px`
        : spacing.inlineStart;
  }

  if (spacing.inlineEnd !== undefined) {
    cssProps.paddingInlineEnd =
      typeof spacing.inlineEnd === "number"
        ? `${spacing.inlineEnd}px`
        : spacing.inlineEnd;
  }

  if (spacing.blockStart !== undefined) {
    cssProps.paddingBlockStart =
      typeof spacing.blockStart === "number"
        ? `${spacing.blockStart}px`
        : spacing.blockStart;
  }

  if (spacing.blockEnd !== undefined) {
    cssProps.paddingBlockEnd =
      typeof spacing.blockEnd === "number"
        ? `${spacing.blockEnd}px`
        : spacing.blockEnd;
  }

  return cssProps;
}

/**
 * Normalizes direction value (converts 'auto' to 'rtl' or 'ltr')
 *
 * @param direction - Direction to normalize
 * @param text - Optional text to analyze for 'auto' direction
 * @param defaultDirection - Default direction if unable to determine (default: 'ltr')
 * @returns Normalized direction ('rtl' or 'ltr')
 *
 * @example
 * ```ts
 * normalizeDirection('rtl') // 'rtl'
 * normalizeDirection('auto', 'مرحبا') // 'rtl'
 * normalizeDirection('auto', 'Hello') // 'ltr'
 * normalizeDirection('auto') // 'ltr' (default)
 * ```
 */
export function normalizeDirection(
  direction: TextDirection,
  text?: string,
  defaultDirection: "rtl" | "ltr" = "ltr",
): "rtl" | "ltr" {
  if (direction === "rtl" || direction === "ltr") {
    return direction;
  }

  // Direction is 'auto' - determine from text if provided
  if (text) {
    // Simple Arabic character detection
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text) ? "rtl" : "ltr";
  }

  return defaultDirection;
}

/**
 * Gets the opposite direction
 *
 * @param direction - Current direction
 * @returns Opposite direction (rtl <-> ltr, auto stays auto)
 *
 * @example
 * ```ts
 * getOppositeDirection('rtl') // 'ltr'
 * getOppositeDirection('ltr') // 'rtl'
 * getOppositeDirection('auto') // 'auto'
 * ```
 */
export function getOppositeDirection(direction: TextDirection): TextDirection {
  if (direction === "rtl") return "ltr";
  if (direction === "ltr") return "rtl";
  return "auto";
}

/**
 * Gets inline start position (left in LTR, right in RTL)
 *
 * @param isRTL - Whether current direction is RTL
 * @returns 'left' or 'right'
 *
 * @example
 * ```ts
 * getInlineStart(true) // 'right'
 * getInlineStart(false) // 'left'
 * ```
 */
export function getInlineStart(isRTL: boolean): "left" | "right" {
  return isRTL ? "right" : "left";
}

/**
 * Gets inline end position (right in LTR, left in RTL)
 *
 * @param isRTL - Whether current direction is RTL
 * @returns 'left' or 'right'
 *
 * @example
 * ```ts
 * getInlineEnd(true) // 'left'
 * getInlineEnd(false) // 'right'
 * ```
 */
export function getInlineEnd(isRTL: boolean): "left" | "right" {
  return isRTL ? "left" : "right";
}

/**
 * Gets flex direction for RTL/LTR
 *
 * @param isRTL - Whether current direction is RTL
 * @param reverse - Whether to reverse the direction
 * @returns Flex direction class
 *
 * @example
 * ```ts
 * getFlexDirection(true) // 'flex-row-reverse'
 * getFlexDirection(false) // 'flex-row'
 * getFlexDirection(true, true) // 'flex-row'
 * ```
 */
export function getFlexDirection(isRTL: boolean, reverse = false): string {
  if (isRTL && !reverse) return "flex-row-reverse";
  if (!isRTL && reverse) return "flex-row-reverse";
  return "flex-row";
}

/**
 * Gets Tailwind spacing class for inline start
 *
 * @param isRTL - Whether current direction is RTL
 * @param value - Spacing value (e.g., '4' for 1rem)
 * @returns Tailwind class for inline start spacing
 *
 * @example
 * ```ts
 * getInlineStartClass(true, '4') // 'mr-4'
 * getInlineStartClass(false, '4') // 'ml-4'
 * ```
 */
export function getInlineStartClass(isRTL: boolean, value: string): string {
  return isRTL ? `mr-${value}` : `ml-${value}`;
}

/**
 * Gets Tailwind spacing class for inline end
 *
 * @param isRTL - Whether current direction is RTL
 * @param value - Spacing value (e.g., '4' for 1rem)
 * @returns Tailwind class for inline end spacing
 *
 * @example
 * ```ts
 * getInlineEndClass(true, '4') // 'ml-4'
 * getInlineEndClass(false, '4') // 'mr-4'
 * ```
 */
export function getInlineEndClass(isRTL: boolean, value: string): string {
  return isRTL ? `ml-${value}` : `mr-${value}`;
}

/**
 * Gets text alignment class based on directional alignment
 *
 * @param alignment - Directional alignment
 * @param isRTL - Whether current direction is RTL
 * @returns Tailwind text alignment class
 *
 * @example
 * ```ts
 * getAlignmentClass('start', true) // 'text-right'
 * getAlignmentClass('start', false) // 'text-left'
 * getAlignmentClass('center', true) // 'text-center'
 * ```
 */
export function getAlignmentClass(
  alignment: DirectionalAlignment,
  isRTL: boolean,
): string {
  if (alignment === "center") return "text-center";
  if (alignment === "start") return isRTL ? "text-right" : "text-left";
  if (alignment === "end") return isRTL ? "text-left" : "text-right";
  return "";
}

/**
 * Generates complete directional classes for a component
 *
 * Creates a comprehensive set of classes for different parts of a component.
 *
 * @param direction - Text direction
 * @param baseClasses - Base classes for each part
 * @returns Object with classes for different component parts
 *
 * @example
 * ```ts
 * getComponentClasses('rtl', {
 *   container: 'flex items-center',
 *   content: 'p-4',
 *   icon: 'w-6 h-6',
 *   text: 'font-sans'
 * })
 * // {
 * //   container: 'flex items-center rtl flex-row-reverse',
 * //   content: 'p-4 text-right',
 * //   icon: 'w-6 h-6',
 * //   text: 'font-sans text-right'
 * // }
 * ```
 */
export function getComponentClasses(
  direction: TextDirection,
  baseClasses: Partial<DirectionalClasses> = {},
): DirectionalClasses {
  const isRTL = direction === "rtl";
  const alignmentClass = isRTL ? "text-right" : "text-left";
  const flexClass = getFlexDirection(isRTL);

  return {
    container:
      `${baseClasses.container || ""} ${direction} ${flexClass}`.trim(),
    content: `${baseClasses.content || ""} ${alignmentClass}`.trim(),
    icon: `${baseClasses.icon || ""}`.trim(),
    text: `${baseClasses.text || ""} ${alignmentClass}`.trim(),
  };
}

/**
 * Creates CSS custom properties for direction-aware styling
 *
 * @param isRTL - Whether current direction is RTL
 * @returns Object of CSS custom properties
 *
 * @example
 * ```ts
 * getDirectionCSSProperties(true)
 * // {
 * //   '--inset-start': 'right',
 * //   '--inset-end': 'left',
 * //   '--text-align': 'right',
 * //   '--flex-direction': 'row-reverse'
 * // }
 * ```
 */
export function getDirectionCSSProperties(
  isRTL: boolean,
): Record<string, string> {
  return {
    "--inset-start": isRTL ? "right" : "left",
    "--inset-end": isRTL ? "left" : "right",
    "--text-align": isRTL ? "right" : "left",
    "--flex-direction": isRTL ? "row-reverse" : "row",
  };
}
