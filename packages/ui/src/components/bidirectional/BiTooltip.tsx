/**
 * BiTooltip - Bidirectional Tooltip Component
 *
 * Direction-aware tooltip with proper positioning.
 *
 * @module components/bidirectional/BiTooltip
 */

import React from "react";
import type { BidirectionalProps } from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";

/**
 * BiTooltip Props
 */
export interface BiTooltipProps extends BidirectionalProps {
  /** Tooltip content */
  content: string;

  /** Children to trigger tooltip */
  children: React.ReactElement;

  /** Tooltip position */
  position?: "top" | "bottom" | "left" | "right";
}

/**
 * Bidirectional Tooltip Component
 *
 * @example
 * ```tsx
 * <BiTooltip content="نصيحة مفيدة" direction="rtl">
 *   <button>زر</button>
 * </BiTooltip>
 * ```
 */
export const BiTooltip = React.memo<BiTooltipProps>(
  ({ content, children, direction: propDirection, position = "top" }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const { direction } = useBidirectional(propDirection);
    const tooltipId = React.useId();

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    // Get existing event handlers from child
    const childProps = children.props;
    const originalOnMouseEnter = childProps.onMouseEnter;
    const originalOnMouseLeave = childProps.onMouseLeave;
    const originalOnFocus = childProps.onFocus;
    const originalOnBlur = childProps.onBlur;

    // Create merged handlers
    const handleMouseEnter = (e: React.MouseEvent) => {
      originalOnMouseEnter?.(e);
      setIsVisible(true);
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
      originalOnMouseLeave?.(e);
      setIsVisible(false);
    };

    const handleFocus = (e: React.FocusEvent) => {
      originalOnFocus?.(e);
      setIsVisible(true);
    };

    const handleBlur = (e: React.FocusEvent) => {
      originalOnBlur?.(e);
      setIsVisible(false);
    };

    return (
      <div className="relative inline-block">
        {React.cloneElement(children, {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onFocus: handleFocus,
          onBlur: handleBlur,
          "aria-describedby": isVisible ? tooltipId : undefined,
        })}

        {isVisible && (
          <div
            id={tooltipId}
            role="tooltip"
            aria-hidden={!isVisible}
            className={`absolute z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white ${positionClasses[position]}`}
            dir={direction}
          >
            {content}
          </div>
        )}
      </div>
    );
  },
);

BiTooltip.displayName = "BiTooltip";
