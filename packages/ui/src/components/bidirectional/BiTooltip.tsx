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

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
      <div className="relative inline-block">
        {React.cloneElement(children, {
          onMouseEnter: () => setIsVisible(true),
          onMouseLeave: () => setIsVisible(false),
          onFocus: () => setIsVisible(true),
          onBlur: () => setIsVisible(false),
        })}

        {isVisible && (
          <div
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
