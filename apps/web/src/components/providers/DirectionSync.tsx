/**
 * Direction Sync Component
 *
 * Synchronizes the HTML element's dir attribute with DirectionProvider state.
 * Must be a client component to access the direction context.
 *
 * @module DirectionSync
 */

"use client";

import { useEffect } from "react";
import { useDirection } from "./DirectionProvider";

/**
 * DirectionSync Component
 *
 * Automatically synchronizes document direction with DirectionProvider state.
 * Place this component inside DirectionProvider to enable automatic syncing.
 *
 * @example
 * ```tsx
 * <DirectionProvider>
 *   <DirectionSync />
 *   <App />
 * </DirectionProvider>
 * ```
 */
export function DirectionSync() {
  const { config } = useDirection();

  useEffect(() => {
    // Sync HTML dir attribute with context
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;
      htmlElement.dir = config.direction;
      htmlElement.lang = config.locale;
    }
  }, [config.direction, config.locale]);

  return null;
}
