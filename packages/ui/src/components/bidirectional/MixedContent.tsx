/**
 * MixedContent - Mixed Arabic-English Content Renderer
 *
 * Renders mixed bidirectional content with proper text isolation.
 * Uses unicode-bidi: plaintext for natural bidirectional flow.
 *
 * @module components/bidirectional/MixedContent
 */

import React from "react";
import type { MixedContentSegment } from "../../types/bidirectional";

/**
 * MixedContent Props
 */
export interface MixedContentProps {
  /** Mixed language content */
  content: string;

  /** Additional CSS classes */
  className?: string;

  /** Render as inline or block element */
  inline?: boolean;

  /** Segment formatter function */
  formatSegments?: (content: string) => MixedContentSegment[];
}

/**
 * Default segment formatter
 *
 * Splits content by Arabic/non-Arabic boundaries
 */
function defaultFormatSegments(content: string): MixedContentSegment[] {
  const segments: MixedContentSegment[] = [];
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

  // Split by whitespace while preserving it
  const words = content.split(/(\s+)/);

  let currentSegment = "";
  let currentDirection: "rtl" | "ltr" | null = null;
  let startPosition = 0;

  words.forEach((word) => {
    const wordDirection = arabicRegex.test(word) ? "rtl" : "ltr";

    if (currentDirection === null) {
      currentDirection = wordDirection;
      currentSegment = word;
    } else if (currentDirection === wordDirection) {
      currentSegment += word;
    } else {
      if (currentSegment.trim()) {
        segments.push({
          direction: currentDirection,
          content: currentSegment,
          start: startPosition,
          end: startPosition + currentSegment.length,
        });
      }

      startPosition += currentSegment.length;
      currentDirection = wordDirection;
      currentSegment = word;
    }
  });

  // Add final segment
  if (currentSegment.trim() && currentDirection !== null) {
    segments.push({
      direction: currentDirection,
      content: currentSegment,
      start: startPosition,
      end: startPosition + currentSegment.length,
    });
  }

  return segments;
}

/**
 * Mixed Content Component
 *
 * Renders bidirectional content with proper segment isolation.
 * Handles mixed Arabic-English text rendering.
 *
 * @example
 * ```tsx
 * <MixedContent content="مرحبا Hello العالم World" />
 * // Renders with proper RTL/LTR segmentation
 *
 * <MixedContent content="Name: أحمد محمد" inline />
 * // Inline rendering for mixed content
 * ```
 */
export const MixedContent = React.memo<MixedContentProps>(
  ({
    content,
    className = "",
    inline = false,
    formatSegments = defaultFormatSegments,
  }) => {
    // Format content into directional segments
    const segments = React.useMemo(
      () => formatSegments(content),
      [content, formatSegments],
    );

    // Use span for inline, div for block
    const ContainerTag = inline ? "span" : "div";

    return (
      <ContainerTag
        className={`mixed-content ${className}`.trim()}
        style={{ unicodeBidi: "plaintext" }}
      >
        {segments.map((segment, index) => (
          <span
            key={index}
            dir={segment.direction}
            className={`segment-${segment.direction}`}
            style={{
              unicodeBidi: "embed",
              textAlign: segment.direction === "rtl" ? "right" : "left",
            }}
          >
            {segment.content}
          </span>
        ))}
      </ContainerTag>
    );
  },
);

MixedContent.displayName = "MixedContent";
