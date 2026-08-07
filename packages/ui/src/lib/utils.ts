import { clsx, type ClassValue } from "clsx";

/**
 * Compose conditional class names for shared UI components.
 *
 * Tailwind conflict resolution remains an application-level concern until the
 * shared UI package dependency contract is reviewed during P1.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
