"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@iraqi-ai/types";
import { requireSupabasePublicConfig } from "@/config/env";

export type AuthBrowserClient = SupabaseClient<Database>;

/**
 * Build the browser Auth client inside the Next application so NEXT_PUBLIC_*
 * values are compiled into the client bundle. Do not route browser code through
 * a prebuilt workspace package that reads process.env at runtime.
 */
export function createAuthBrowserClient(): AuthBrowserClient {
  const { url, anonKey } = requireSupabasePublicConfig();
  return createBrowserClient<Database>(url, anonKey);
}
