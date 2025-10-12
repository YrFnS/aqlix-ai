/**
 * Icon Mirroring Utilities
 *
 * Implements Material Design bidirectionality guidelines for icon mirroring.
 * Only directional icons (arrows, navigation) should mirror in RTL mode.
 *
 * Reference: https://m2.material.io/design/usability/bidirectionality.html
 *
 * @module utils/icon-mirror
 */

import type { IconMirrorConfig } from "../types/bidirectional";

/**
 * Icon categories that should mirror in RTL
 *
 * Based on Material Design guidelines:
 * - Navigation icons (arrows, chevrons, back/forward)
 * - Directional indicators
 * - Icons representing movement or direction
 */
const MIRRORED_ICON_PATTERNS = [
  // Navigation arrows
  "arrow",
  "chevron",
  "caret",
  "angle",

  // Navigation actions
  "back",
  "forward",
  "next",
  "previous",
  "prev",
  "undo",
  "redo",

  // Directional movement
  "drawer",
  "menu-open",
  "menu-close",
  "panel",
  "sidebar",

  // List and navigation
  "list",
  "indent",
  "outdent",

  // Specific directional icons
  "rtl",
  "ltr",
  "direction",
];

/**
 * Icon categories that should NOT mirror in RTL
 *
 * These represent content, media, objects, or non-directional concepts.
 */
const NON_MIRRORED_ICON_PATTERNS = [
  // Media controls
  "play",
  "pause",
  "stop",
  "volume",
  "mute",

  // Objects and content
  "user",
  "person",
  "profile",
  "avatar",
  "image",
  "photo",
  "camera",
  "video",
  "file",
  "folder",
  "document",
  "page",

  // Actions (non-directional)
  "search",
  "zoom",
  "settings",
  "gear",
  "cog",
  "edit",
  "pencil",
  "delete",
  "trash",
  "save",
  "download",
  "upload",
  "share",
  "like",
  "heart",
  "star",
  "bookmark",
  "flag",
  "bell",
  "notification",

  // Communication
  "email",
  "mail",
  "message",
  "chat",
  "comment",
  "phone",
  "call",

  // Status
  "check",
  "close",
  "x",
  "plus",
  "minus",
  "info",
  "warning",
  "error",
  "success",

  // Time
  "clock",
  "time",
  "calendar",
  "date",

  // Location
  "location",
  "pin",
  "marker",
  "map",
];

/**
 * Icon mirroring configuration map
 *
 * Provides detailed configuration for common icons with reasons
 * for mirroring decisions.
 */
export const iconMirrorConfig: Record<string, IconMirrorConfig> = {
  // Navigation - Should mirror
  "arrow-right": {
    icon: "arrow-right",
    shouldMirror: true,
    reason: "Directional navigation arrow",
  },
  "arrow-left": {
    icon: "arrow-left",
    shouldMirror: true,
    reason: "Directional navigation arrow",
  },
  "chevron-right": {
    icon: "chevron-right",
    shouldMirror: true,
    reason: "Directional indicator",
  },
  "chevron-left": {
    icon: "chevron-left",
    shouldMirror: true,
    reason: "Directional indicator",
  },
  back: {
    icon: "back",
    shouldMirror: true,
    reason: "Navigation action",
  },
  forward: {
    icon: "forward",
    shouldMirror: true,
    reason: "Navigation action",
  },

  // Content - Should NOT mirror
  search: {
    icon: "search",
    shouldMirror: false,
    reason: "Content icon, represents magnifying glass",
  },
  user: {
    icon: "user",
    shouldMirror: false,
    reason: "Object icon, represents person",
  },
  settings: {
    icon: "settings",
    shouldMirror: false,
    reason: "Action icon, non-directional",
  },
  bell: {
    icon: "bell",
    shouldMirror: false,
    reason: "Object icon, represents notification bell",
  },
};

/**
 * Determines if an icon should mirror in RTL mode
 *
 * Uses pattern matching against icon name to determine mirroring.
 * Follows Material Design bidirectionality guidelines.
 *
 * @param iconName - Icon identifier (e.g., 'arrow-right', 'chevron-left')
 * @returns True if icon should mirror in RTL mode
 *
 * @example
 * ```ts
 * shouldMirrorIcon('arrow-right') // true
 * shouldMirrorIcon('chevron-left') // true
 * shouldMirrorIcon('search') // false
 * shouldMirrorIcon('user') // false
 * ```
 */
export function shouldMirrorIcon(iconName: string): boolean {
  if (!iconName) return false;

  const normalizedName = iconName.toLowerCase().trim();

  // Check explicit configuration first
  const config = iconMirrorConfig[normalizedName];
  if (config) {
    return config.shouldMirror;
  }

  // Check non-mirrored patterns (higher priority)
  for (const pattern of NON_MIRRORED_ICON_PATTERNS) {
    if (normalizedName.includes(pattern)) {
      return false;
    }
  }

  // Check mirrored patterns
  for (const pattern of MIRRORED_ICON_PATTERNS) {
    if (normalizedName.includes(pattern)) {
      return true;
    }
  }

  // Default: don't mirror if uncertain
  return false;
}

/**
 * Gets the mirrored version of an icon name
 *
 * Swaps left/right in icon names for proper mirroring.
 * Note: Visual mirroring should be done via CSS transform.
 *
 * @param iconName - Original icon name
 * @returns Mirrored icon name
 *
 * @example
 * ```ts
 * getMirroredIconName('arrow-right') // 'arrow-left'
 * getMirroredIconName('chevron-left') // 'chevron-right'
 * getMirroredIconName('search') // 'search' (unchanged)
 * ```
 */
export function getMirroredIconName(iconName: string): string {
  if (!shouldMirrorIcon(iconName)) {
    return iconName;
  }

  // Swap left/right in icon names
  if (iconName.includes("right")) {
    return iconName.replace(/right/gi, "left");
  }
  if (iconName.includes("left")) {
    return iconName.replace(/left/gi, "right");
  }

  // Swap next/prev
  if (iconName.includes("next")) {
    return iconName.replace(/next/gi, "previous");
  }
  if (iconName.includes("prev")) {
    return iconName.replace(/prev(ious)?/gi, "next");
  }

  // Swap forward/back
  if (iconName.includes("forward")) {
    return iconName.replace(/forward/gi, "back");
  }
  if (iconName.includes("back")) {
    return iconName.replace(/back/gi, "forward");
  }

  return iconName;
}

/**
 * Gets CSS transform for icon mirroring
 *
 * Returns scaleX(-1) for mirrored icons, which is GPU-accelerated.
 *
 * @param iconName - Icon identifier
 * @param isRTL - Whether current direction is RTL
 * @returns CSS transform string or undefined
 *
 * @example
 * ```ts
 * getIconMirrorTransform('arrow-right', true) // 'scaleX(-1)'
 * getIconMirrorTransform('arrow-right', false) // undefined
 * getIconMirrorTransform('search', true) // undefined
 * ```
 */
export function getIconMirrorTransform(
  iconName: string,
  isRTL: boolean,
): string | undefined {
  if (!isRTL || !shouldMirrorIcon(iconName)) {
    return undefined;
  }

  return "scaleX(-1)";
}

/**
 * Gets CSS class for icon mirroring
 *
 * Returns a class name that can be used for mirrored icons.
 *
 * @param iconName - Icon identifier
 * @param isRTL - Whether current direction is RTL
 * @returns CSS class name or empty string
 *
 * @example
 * ```ts
 * getIconMirrorClass('arrow-right', true) // 'icon-mirrored'
 * getIconMirrorClass('search', true) // ''
 * ```
 */
export function getIconMirrorClass(iconName: string, isRTL: boolean): string {
  if (!isRTL || !shouldMirrorIcon(iconName)) {
    return "";
  }

  return "icon-mirrored";
}
