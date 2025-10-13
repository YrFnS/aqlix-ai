/**
 * BiGrid - Bidirectional Grid Component
 *
 * Direction-aware grid with proper flow in RTL/LTR.
 *
 * @module components/bidirectional/BiGrid
 */

import React from "react";
import type { BidirectionalProps } from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";

/**
 * BiGrid Props
 */
export interface BiGridProps
  extends BidirectionalProps,
    React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;

  /** Gap size */
  gap?: "sm" | "md" | "lg";
}

/**
 * Bidirectional Grid Component
 *
 * @example
 * ```tsx
 * <BiGrid direction="rtl" columns={3} gap="md">
 *   <BiCard>بطاقة 1</BiCard>
 *   <BiCard>بطاقة 2</BiCard>
 *   <BiCard>بطاقة 3</BiCard>
 * </BiGrid>
 * ```
 */
export const BiGrid = React.memo<BiGridProps>(
  ({
    children,
    direction: propDirection,
    columns = 3,
    gap = "md",
    className = "",
    ...props
  }) => {
    const { direction } = useBidirectional(propDirection);

    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    const gapClasses = {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    };

    return (
      <div
        className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`.trim()}
        dir={direction}
        {...props}
      >
        {children}
      </div>
    );
  },
);

BiGrid.displayName = "BiGrid";
