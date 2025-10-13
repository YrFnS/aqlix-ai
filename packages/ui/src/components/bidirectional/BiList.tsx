/**
 * BiList - Bidirectional List Component
 *
 * Direction-aware list with proper item alignment.
 *
 * @module components/bidirectional/BiList
 */

import React from "react";
import type { BidirectionalProps } from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";

/**
 * BiList Props
 */
export interface BiListProps
  extends BidirectionalProps,
    React.HTMLAttributes<HTMLUListElement> {}

/**
 * BiListItem Props
 */
export interface BiListItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

/**
 * Bidirectional List Component
 *
 * @example
 * ```tsx
 * <BiList direction="rtl">
 *   <BiListItem>العنصر الأول</BiListItem>
 *   <BiListItem>العنصر الثاني</BiListItem>
 * </BiList>
 * ```
 */
export const BiList = React.memo<BiListProps>(
  ({ children, direction: propDirection, className = "", ...props }) => {
    const { direction } = useBidirectional(propDirection);

    return (
      <ul
        className={`space-y-2 ${className}`.trim()}
        dir={direction}
        {...props}
      >
        {children}
      </ul>
    );
  },
);

BiList.displayName = "BiList";

/**
 * Bidirectional List Item
 */
export const BiListItem = React.memo<BiListItemProps>(
  ({ children, className = "", ...props }) => {
    return (
      <li className={`text-sm ${className}`.trim()} {...props}>
        {children}
      </li>
    );
  },
);

BiListItem.displayName = "BiListItem";
