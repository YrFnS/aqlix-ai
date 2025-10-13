/**
 * @iraqi-ai/supabase-client
 *
 * Supabase client utilities for Iraqi AI Chat System
 * Provides type-safe database access with proper Next.js App Router patterns
 *
 * @example
 * // Client Component
 * import { createClient } from '@iraqi-ai/supabase-client/browser';
 *
 * // Server Component
 * import { createClient } from '@iraqi-ai/supabase-client/server';
 *
 * // Admin operations
 * import { createAdminClient } from '@iraqi-ai/supabase-client/admin';
 */

// Re-export environment utilities
export {
  getBrowserEnv,
  getServerEnv,
  getAdminEnv,
  SupabaseEnvError,
} from "./env";
export type { SupabaseEnv } from "./env";

// Re-export client types for convenience
export type { SupabaseBrowserClient } from "./browser";
export type { SupabaseServerClient } from "./server";
export type { SupabaseAdminClient } from "./admin";

// Note: Actual client creation functions are exported from subpaths
// to prevent importing server code in browser and vice versa
