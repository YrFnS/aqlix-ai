/**
 * useIconMirror Hook
 *
 * Provides icon mirroring logic for bidirectional components.
 * Determines if an icon should mirror in RTL mode and provides transform CSS.
 *
 * @module hooks/useIconMirror
 */

import { useMemo } from "react";
import {
  shouldMirrorIcon,
  getIconMirrorTransform,
  getIconMirrorClass,
} from "../utils/icon-mirror";

/**
 * Icon mirroring hook return type
 */
export interface UseIconMirrorReturn {
  /** Whether the icon should mirror */
  shouldMirror: boolean;

  /** CSS transform for mirroring (scaleX(-1) or undefined) */
  mirrorTransform: string | undefined;

  /** CSS class for mirrored icon */
  mirrorClass: string;

  /** Complete style object for icon mirroring */
  mirrorStyle: React.CSSProperties;
}

/**
 * Hook for icon mirroring logic
 *
 * Determines if an icon should mirror in RTL mode based on Material Design
 * bidirectionality guidelines. Provides memoized transform and class values.
 *
 * @param iconName - Icon identifier (e.g., 'arrow-right', 'chevron-left')
 * @param isRTL - Whether current direction is RTL
 * @param enabled - Whether mirroring is enabled (default: true)
 * @returns Icon mirroring state and utilities
 *
 * @example
 * ```tsx
 * function IconButton({ icon, direction }) {
 *   const isRTL = direction === 'rtl';
 *   const { shouldMirror, mirrorStyle, mirrorClass } = useIconMirror(
 *     icon,
 *     isRTL
 *   );
 *
 *   return (
 *     <button>
 *       <Icon
 *         name={icon}
 *         style={mirrorStyle}
 *         className={mirrorClass}
 *       />
 *     </button>
 *   );
 * }
 * ```
 */
export function useIconMirror(
  iconName?: string,
  isRTL = false,
  enabled = true,
): UseIconMirrorReturn {
  // Memoize mirroring decision
  const mirrorState = useMemo(() => {
    if (!enabled || !iconName || !isRTL) {
      return {
        shouldMirror: false,
        mirrorTransform: undefined,
        mirrorClass: "",
        mirrorStyle: {},
      };
    }

    const shouldMirror = shouldMirrorIcon(iconName);
    const mirrorTransform = getIconMirrorTransform(iconName, isRTL);
    const mirrorClass = getIconMirrorClass(iconName, isRTL);

    return {
      shouldMirror,
      mirrorTransform,
      mirrorClass,
      mirrorStyle: mirrorTransform
        ? ({ transform: mirrorTransform } as React.CSSProperties)
        : {},
    };
  }, [enabled, iconName, isRTL]);

  return mirrorState;
}

/**
 * Hook for conditional icon mirroring
 *
 * Only applies mirroring if the condition is met. Useful for components
 * that want to control mirroring based on additional logic.
 *
 * @param iconName - Icon identifier
 * @param isRTL - Whether current direction is RTL
 * @param condition - Additional condition for mirroring
 * @returns Icon mirroring state
 *
 * @example
 * ```tsx
 * function NavigationButton({ icon, isBackButton }) {
 *   const isRTL = useIsRTL();
 *   const { mirrorStyle } = useConditionalIconMirror(
 *     icon,
 *     isRTL,
 *     isBackButton // Only mirror back buttons
 *   );
 *
 *   return <Icon name={icon} style={mirrorStyle} />;
 * }
 * ```
 */
export function useConditionalIconMirror(
  iconName?: string,
  isRTL = false,
  condition = true,
): UseIconMirrorReturn {
  return useIconMirror(iconName, isRTL, condition);
}

/**
 * Hook for multiple icon mirroring
 *
 * Handles mirroring state for multiple icons at once.
 * Useful for components with multiple icons.
 *
 * @param iconNames - Array of icon identifiers
 * @param isRTL - Whether current direction is RTL
 * @returns Map of icon names to mirroring states
 *
 * @example
 * ```tsx
 * function Toolbar({ isRTL }) {
 *   const icons = useMultipleIconMirror(
 *     ['arrow-left', 'arrow-right', 'search'],
 *     isRTL
 *   );
 *
 *   return (
 *     <div>
 *       <Icon name="arrow-left" style={icons['arrow-left'].mirrorStyle} />
 *       <Icon name="arrow-right" style={icons['arrow-right'].mirrorStyle} />
 *       <Icon name="search" style={icons['search'].mirrorStyle} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultipleIconMirror(
  iconNames: string[],
  isRTL = false,
): Map<string, UseIconMirrorReturn> {
  return useMemo(() => {
    const mirrorMap = new Map<string, UseIconMirrorReturn>();

    iconNames.forEach((iconName) => {
      const shouldMirror = shouldMirrorIcon(iconName);
      const mirrorTransform = getIconMirrorTransform(iconName, isRTL);
      const mirrorClass = getIconMirrorClass(iconName, isRTL);

      mirrorMap.set(iconName, {
        shouldMirror,
        mirrorTransform,
        mirrorClass,
        mirrorStyle: mirrorTransform
          ? ({ transform: mirrorTransform } as React.CSSProperties)
          : {},
      });
    });

    return mirrorMap;
  }, [iconNames, isRTL]);
}
