import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@iraqi-ai/types";
import { getServerEnv } from "./env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

/**
 * Create a request-scoped Supabase client for Server Components, Server
 * Actions, and Route Handlers.
 *
 * The caller's signed session is preserved through Next.js cookies. Database
 * authorization remains enforced by PostgreSQL RLS.
 */
export async function createClient() {
  const { url, anonKey } = getServerEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot mutate response cookies after rendering.
          // Middleware refreshes sessions before protected routes are rendered.
        }
      },
    },
  });
}

/**
 * Semantic alias for mutation-oriented code. Both functions are request-scoped;
 * Server Actions and Route Handlers can persist the returned cookie updates.
 */
export const createActionClient = createClient;

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
