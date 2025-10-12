/**
 * BiNavigation - Bidirectional Navigation Component
 *
 * Direction-aware navigation with proper flow and icon mirroring.
 *
 * @module components/bidirectional/BiNavigation
 */

import React from "react";
import type { BidirectionalProps } from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";

/**
 * BiNavigation Props
 */
export interface BiNavigationProps
  extends BidirectionalProps,
    React.HTMLAttributes<HTMLElement> {}

/**
 * Bidirectional Navigation Component
 *
 * @example
 * ```tsx
 * <BiNavigation direction="rtl">
 *   <BiButton>الرئيسية</BiButton>
 *   <BiButton>حول</BiButton>
 * </BiNavigation>
 * ```
 */
export const BiNavigation = React.memo<BiNavigationProps>(
  ({ children, direction: propDirection, className = "", ...props }) => {
    const { direction, getFlexDirection } = useBidirectional(propDirection);
    const flexDir = getFlexDirection();

    return (
      <nav
        className={`flex items-center gap-4 ${flexDir} ${className}`.trim()}
        dir={direction}
        {...props}
      >
        {children}
      </nav>
    );
  },
);

BiNavigation.displayName = "BiNavigation";
