/**
 * Supabase client for browser/Client Components
 * Safe for use in React Client Components that run in the browser
 * Uses anon key which is safe when Row Level Security (RLS) is enabled
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@iraqi-ai/types';
import { getBrowserEnv } from './env';

/**
 * Create a Supabase client for browser/Client Components
 *
 * IMPORTANT: Create fresh instances, DO NOT use singleton pattern
 * Source: https://github.com/orgs/supabase/discussions/26936
 *
 * @example
 * 'use client';
 * import { createClient } from '@iraqi-ai/supabase-client/browser';
 *
 * export function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase for queries, auth, etc.
 * }
 */
export function createClient() {
  const { url, anonKey } = getBrowserEnv();

  return createBrowserClient<Database>(url, anonKey);
}

/**
 * Type-safe reference to Supabase client instance
 * Use this type for function parameters and component props
 */
export type SupabaseBrowserClient = ReturnType<typeof createClient>;
