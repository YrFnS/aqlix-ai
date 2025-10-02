/**
 * Supabase client for Server Components and Server Actions
 * Properly handles cookies for authentication in Next.js App Router
 * Uses @supabase/ssr for server-side rendering support
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@iraqi-ai/types';
import { getServerEnv } from './env';

/**
 * Create a Supabase client for Server Components
 *
 * IMPORTANT: Create fresh instances, DO NOT use singleton pattern
 * CRITICAL: Must call cookies() to opt out of Next.js caching
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * @example
 * import { createClient } from '@iraqi-ai/supabase-client/server';
 *
 * export default async function ServerComponent() {
 *   const supabase = createClient();
 *   const { data } = await supabase.from('users').select();
 *   return <div>{JSON.stringify(data)}</div>;
 * }
 */
export async function createClient() {
  const { url, anonKey } = getServerEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Server Component cannot set cookies after rendering
          // This is expected during Server Component rendering
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Server Component cannot remove cookies after rendering
        }
      },
    },
  });
}

/**
 * Create a Supabase client for Server Actions and Route Handlers
 * Allows setting and removing cookies during mutations
 *
 * @example
 * 'use server';
 * import { createActionClient } from '@iraqi-ai/supabase-client/server';
 *
 * export async function signIn(formData: FormData) {
 *   const supabase = createActionClient();
 *   await supabase.auth.signInWithPassword({
 *     email: formData.get('email') as string,
 *     password: formData.get('password') as string,
 *   });
 * }
 */
export async function createActionClient() {
  const { url, anonKey } = getServerEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}

/**
 * Type-safe reference to Supabase server client instance
 */
export type SupabaseServerClient = ReturnType<typeof createClient>;
