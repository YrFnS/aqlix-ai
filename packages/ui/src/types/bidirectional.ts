/**
 * Bidirectional Component Types
 *
 * Type definitions for direction-aware components, icon mirroring,
 * and mixed content handling in the Iraqi AI Chat System.
 *
 * @module types/bidirectional
 */

import type { TextDirection } from "@iraqi-ai/types";

/**
 * Direction-aware component base props
 *
 * Provides optional direction override and icon mirroring control
 * for all bidirectional components.
 */
export interface BidirectionalProps {
  /** Force specific direction (overrides context) */
  direction?: TextDirection;

  /** Whether to mirror icons in RTL mode (default: true) */
  mirrorIcons?: boolean;

  /** Additional direction-aware classes */
  directionClasses?: string;
}

/**
 * Icon mirroring configuration
 *
 * Defines which icons should mirror in RTL mode following
 * Material Design bidirectionality guidelines.
 */
export interface IconMirrorConfig {
  /** Icon name or identifier */
  icon: string;

  /** Whether this icon should mirror in RTL */
  shouldMirror: boolean;

  /** Reason for mirroring decision (for documentation) */
  reason?: string;
}

/**
 * Mixed content segment
 *
 * Represents a text segment with specific direction in mixed
 * Arabic-English content.
 */
export interface MixedContentSegment {
  /** Text content */
  content: string;

  /** Direction of this segment */
  direction: TextDirection;

  /** Start position in original text */
  start?: number;

  /** End position in original text */
  end?: number;
}

/**
 * Directional spacing configuration
 *
 * Uses CSS logical properties for direction-independent spacing.
 */
export interface DirectionalSpacing {
  /** Inline start (right in RTL, left in LTR) */
  inlineStart?: string | number;

  /** Inline end (left in RTL, right in LTR) */
  inlineEnd?: string | number;

  /** Block start (top) */
  blockStart?: string | number;

  /** Block end (bottom) */
  blockEnd?: string | number;
}

/**
 * Direction-aware layout classes
 *
 * Provides CSS class names for direction-aware layouts.
 */
export interface DirectionalClasses {
  container: string;
  content: string;
  icon: string;
  text: string;
}

/**
 * Icon position in bidirectional components
 */
export type IconPosition = "leading" | "trailing";

/**
 * Alignment options for bidirectional components
 */
export type DirectionalAlignment = "start" | "end" | "center";
