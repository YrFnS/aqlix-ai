/**
 * BiButton - Bidirectional Button Component
 *
 * Direction-aware button with icon mirroring support.
 * Automatically adapts icon positioning and mirroring based on text direction.
 *
 * @module components/bidirectional/BiButton
 */

import React from "react";
import type {
  BidirectionalProps,
  IconPosition,
} from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";
import { useIconMirror } from "../../hooks/useIconMirror";

/**
 * BiButton Props
 */
export interface BiButtonProps
  extends BidirectionalProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "dir"> {
  /** Button content */
  children?: React.ReactNode;

  /** Icon element */
  icon?: React.ReactNode;

  /** Icon position relative to text */
  iconPosition?: IconPosition;

  /** Icon name for automatic mirroring detection */
  iconName?: string;

  /** Button variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";

  /** Button size */
  size?: "sm" | "md" | "lg";

  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Bidirectional Button Component
 *
 * A direction-aware button that supports:
 * - Automatic icon mirroring for directional icons
 * - Icon positioning that adapts to text direction
 * - CSS logical properties for spacing
 * - Full RTL/LTR support
 *
 * @example
 * ```tsx
 * // RTL mode with arrow icon
 * <BiButton
 *   icon={<ChevronRight />}
 *   iconName="chevron-right"
 *   iconPosition="trailing"
 *   direction="rtl"
 * >
 *   Next
 * </BiButton>
 *
 * // The icon will be mirrored and positioned correctly
 * ```
 */
export const BiButton = React.memo<BiButtonProps>(
  ({
    children,
    icon,
    iconPosition = "leading",
    iconName,
    direction: propDirection,
    mirrorIcons = true,
    directionClasses = "",
    className = "",
    variant = "primary",
    size = "md",
    fullWidth = false,
    ...props
  }) => {
    // Get direction-aware utilities
    const { direction, isRTL, getInlineStartClass, getInlineEndClass } =
      useBidirectional(propDirection);

    // Get icon mirroring state
    const { mirrorStyle, mirrorClass } = useIconMirror(
      iconName,
      isRTL,
      mirrorIcons,
    );

    // Determine icon order based on direction and position
    const iconOrder = React.useMemo(() => {
      // In RTL, visual "trailing" is actually inline-start
      // In LTR, visual "trailing" is inline-end
      if (iconPosition === "trailing") {
        return isRTL ? "order-first" : "order-last";
      }
      return isRTL ? "order-last" : "order-first";
    }, [isRTL, iconPosition]);

    // Base button classes
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    // Variant classes
    const variantClasses = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      ghost:
        "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
    };

    // Size classes using logical properties
    const sizeClasses = {
      sm: "h-9 px-3 text-sm gap-1.5",
      md: "h-10 px-4 py-2 text-base gap-2",
      lg: "h-11 px-8 text-lg gap-2.5",
    };

    // Width class
    const widthClass = fullWidth ? "w-full" : "";

    // Combine all classes
    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${widthClass}
      ${direction}
      ${directionClasses}
      ${className}
    `.trim();

    // Icon spacing class (only if both icon and children exist)
    const iconSpacingClass =
      icon && children
        ? iconPosition === "trailing"
          ? getInlineStartClass("2")
          : getInlineEndClass("2")
        : "";

    return (
      <button className={buttonClasses} dir={direction} {...props}>
        {icon && (
          <span
            className={`${iconOrder} ${mirrorClass} flex-shrink-0`}
            style={mirrorStyle}
          >
            {icon}
          </span>
        )}
        {children && <span className={`${iconSpacingClass}`}>{children}</span>}
      </button>
    );
  },
);

BiButton.displayName = "BiButton";
