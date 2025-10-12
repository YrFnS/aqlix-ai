/**
 * BiCard - Bidirectional Card Component
 *
 * Direction-aware card components with proper RTL/LTR support.
 * Uses CSS logical properties for spacing and alignment.
 *
 * @module components/bidirectional/BiCard
 */

import React from "react";
import type {
  BidirectionalProps,
  DirectionalAlignment,
} from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";

/**
 * BiCard Props
 */
export interface BiCardProps
  extends BidirectionalProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * BiCardHeader Props
 */
export interface BiCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Header alignment */
  alignment?: DirectionalAlignment;
}

/**
 * Bidirectional Card Component
 *
 * @example
 * ```tsx
 * <BiCard direction="rtl">
 *   <BiCardHeader>عنوان البطاقة</BiCardHeader>
 *   <BiCardContent>محتوى البطاقة</BiCardContent>
 *   <BiCardFooter>تذييل البطاقة</BiCardFooter>
 * </BiCard>
 * ```
 */
export const BiCard = React.memo<BiCardProps>(
  ({
    children,
    direction: propDirection,
    directionClasses = "",
    className = "",
    ...props
  }) => {
    const { direction } = useBidirectional(propDirection);

    const cardClasses = `
      rounded-lg border bg-card text-card-foreground shadow-sm
      ${direction}
      ${directionClasses}
      ${className}
    `.trim();

    return (
      <div className={cardClasses} dir={direction} {...props}>
        {children}
      </div>
    );
  },
);

BiCard.displayName = "BiCard";

/**
 * Bidirectional Card Header
 *
 * @example
 * ```tsx
 * <BiCardHeader alignment="start">
 *   Card Title
 * </BiCardHeader>
 * ```
 */
export const BiCardHeader = React.memo<BiCardHeaderProps>(
  ({ children, alignment = "start", className = "", ...props }) => {
    const { getAlignmentClass } = useBidirectional();
    const alignClass = getAlignmentClass(alignment);

    const headerClasses = `
      flex flex-col space-y-1.5 p-6
      ${alignClass}
      ${className}
    `.trim();

    return (
      <div className={headerClasses} {...props}>
        {children}
      </div>
    );
  },
);

BiCardHeader.displayName = "BiCardHeader";

/**
 * BiCardTitle Props
 */
export interface BiCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Bidirectional Card Title
 */
export const BiCardTitle = React.memo<BiCardTitleProps>(
  ({ children, className = "", ...props }) => {
    return (
      <h3
        className={`text-2xl font-semibold leading-none tracking-tight ${className}`.trim()}
        {...props}
      >
        {children}
      </h3>
    );
  },
);

BiCardTitle.displayName = "BiCardTitle";

/**
 * BiCardDescription Props
 */
export interface BiCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * Bidirectional Card Description
 */
export const BiCardDescription = React.memo<BiCardDescriptionProps>(
  ({ children, className = "", ...props }) => {
    return (
      <p
        className={`text-sm text-muted-foreground ${className}`.trim()}
        {...props}
      >
        {children}
      </p>
    );
  },
);

BiCardDescription.displayName = "BiCardDescription";

/**
 * BiCardContent Props
 */
export interface BiCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Bidirectional Card Content
 */
export const BiCardContent = React.memo<BiCardContentProps>(
  ({ children, className = "", ...props }) => {
    return (
      <div className={`p-6 pt-0 ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  },
);

BiCardContent.displayName = "BiCardContent";

/**
 * BiCardFooter Props
 */
export interface BiCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer alignment */
  alignment?: DirectionalAlignment;
}

/**
 * Bidirectional Card Footer
 */
export const BiCardFooter = React.memo<BiCardFooterProps>(
  ({ children, alignment = "start", className = "", ...props }) => {
    const { getAlignmentClass } = useBidirectional();
    const alignClass = getAlignmentClass(alignment);

    const footerClasses = `
      flex items-center p-6 pt-0
      ${alignClass}
      ${className}
    `.trim();

    return (
      <div className={footerClasses} {...props}>
        {children}
      </div>
    );
  },
);

BiCardFooter.displayName = "BiCardFooter";
