/**
 * Environment variable validation for Supabase client
 * Ensures required configuration is present before client initialization
 */

export interface SupabaseEnv {
  url: string;
  anonKey: string;
  serviceRoleKey?: string; // Optional, only for server-side admin operations
}

export class SupabaseEnvError extends Error {
  constructor(message: string) {
    super(`Supabase Environment Error: ${message}`);
    this.name = "SupabaseEnvError";
  }
}

/**
 * Validate and retrieve browser-safe Supabase environment variables
 * Uses NEXT_PUBLIC_ prefixed variables safe for client-side
 */
export function getBrowserEnv(): Omit<SupabaseEnv, "serviceRoleKey"> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new SupabaseEnvError(
      "Missing required browser environment variables. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    );
  }

  return { url, anonKey };
}

/**
 * Validate and retrieve server-side Supabase environment variables
 * Uses non-prefixed variables for server-only access
 */
export function getServerEnv(): SupabaseEnv {
  // For server, we can use either NEXT_PUBLIC_ or non-prefixed
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new SupabaseEnvError(
      "Missing required server environment variables. " +
        "Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.",
    );
  }

  return { url, anonKey, serviceRoleKey };
}

/**
 * Validate admin environment variables (requires service role key)
 */
export function getAdminEnv(): Required<SupabaseEnv> {
  const { url, anonKey, serviceRoleKey } = getServerEnv();

  if (!serviceRoleKey) {
    throw new SupabaseEnvError(
      "Missing SUPABASE_SERVICE_ROLE_KEY for admin operations. " +
        "Admin client requires service role key for elevated permissions.",
    );
  }

  return { url, anonKey, serviceRoleKey };
}
