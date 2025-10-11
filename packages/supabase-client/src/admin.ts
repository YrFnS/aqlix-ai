/**
 * Supabase admin client for backend operations
 * Uses service role key for elevated permissions
 * BYPASSES Row Level Security (RLS) - use with extreme caution!
 *
 * SECURITY WARNING:
 * - Service role key has admin privileges
 * - Bypasses all RLS policies
 * - Should NEVER be exposed to client-side code
 * - Use only in server-side code (API routes, Server Actions)
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@iraqi-ai/types";
import { getAdminEnv } from "./env";

/**
 * Create a Supabase admin client with service role key
 *
 * SECURITY: Service role key bypasses Row Level Security!
 * Only use for:
 * - Administrative operations
 * - System-level data access
 * - Backend automation tasks
 *
 * DO NOT use for:
 * - User-facing queries (use server client instead)
 * - Any client-side code
 * - Operations that should respect RLS
 *
 * @example
 * import { createAdminClient } from '@iraqi-ai/supabase-client/admin';
 *
 * export async function deleteUser(userId: string) {
 *   const supabase = createAdminClient();
 *   // Admin operations that bypass RLS
 *   await supabase.auth.admin.deleteUser(userId);
 * }
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = getAdminEnv();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Type-safe reference to Supabase admin client instance
 */
export type SupabaseAdminClient = ReturnType<typeof createAdminClient>;
