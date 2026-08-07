import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Database } from "@iraqi-ai/types";
import { getServerEnv } from "./env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export interface SessionRefreshResult {
  response: NextResponse;
  user: User | null;
}

/**
 * Refresh the Supabase session once at the Next.js middleware boundary and
 * return the server-validated user for route decisions.
 */
export async function refreshSession(
  request: NextRequest,
): Promise<SessionRefreshResult> {
  const { url, anonKey } = getServerEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
