/**
 * DirectionalIcon - Icon Wrapper with Automatic Mirroring
 *
 * Wraps icons with direction awareness and automatic mirroring for directional icons.
 * Follows Material Design bidirectionality guidelines.
 *
 * @module components/bidirectional/DirectionalIcon
 */

import React from "react";
import { useIconMirror } from "../../hooks/useIconMirror";

/**
 * DirectionalIcon Props
 */
export interface DirectionalIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Icon element to wrap */
  icon: React.ReactNode;

  /** Icon name for mirroring detection */
  iconName?: string;

  /** Whether current direction is RTL */
  isRTL?: boolean;

  /** Whether to enable mirroring */
  enableMirroring?: boolean;

  /** Custom mirror rules override */
  forceMirror?: boolean;
}

/**
 * Directional Icon Component
 *
 * Automatically mirrors icons based on text direction and icon type.
 * Only directional icons (arrows, navigation) are mirrored.
 *
 * @example
 * ```tsx
 * // Directional icon - will mirror in RTL
 * <DirectionalIcon
 *   icon={<ChevronRight />}
 *   iconName="chevron-right"
 *   isRTL={true}
 * />
 *
 * // Content icon - won't mirror
 * <DirectionalIcon
 *   icon={<Search />}
 *   iconName="search"
 *   isRTL={true}
 * />
 * ```
 */
export const DirectionalIcon = React.memo<DirectionalIconProps>(
  ({
    icon,
    iconName,
    isRTL = false,
    enableMirroring = true,
    forceMirror,
    className = "",
    style,
    ...props
  }) => {
    // Get icon mirroring state
    const { mirrorStyle, mirrorClass, shouldMirror } = useIconMirror(
      iconName,
      isRTL,
      enableMirroring,
    );

    // Determine if icon should mirror
    const applyMirror = forceMirror !== undefined ? forceMirror : shouldMirror;

    // Combine styles
    const combinedStyle = {
      ...style,
      ...(applyMirror ? mirrorStyle : {}),
    };

    // Combine classes
    const combinedClasses = `
      directional-icon
      ${applyMirror ? mirrorClass : ""}
      ${className}
    `.trim();

    return (
      <span className={combinedClasses} style={combinedStyle} {...props}>
        {icon}
      </span>
    );
  },
);

DirectionalIcon.displayName = "DirectionalIcon";
