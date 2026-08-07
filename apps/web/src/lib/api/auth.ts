import type { User } from "@supabase/supabase-js";
import {
  createClient,
  type SupabaseServerClient,
} from "@iraqi-ai/supabase-client/server";
import { isSupabaseConfigured } from "@/config/env";
import { getRequestId, jsonFailure } from "./responses";

export interface ApiAuthContext {
  requestId: string;
  user: User;
  supabase: SupabaseServerClient;
}

type ApiAuthResult =
  | { ok: true; context: ApiAuthContext }
  | { ok: false; response: ReturnType<typeof jsonFailure> };

export async function requireApiUser(request: Request): Promise<ApiAuthResult> {
  const requestId = getRequestId(request);

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      response: jsonFailure(
        "SERVICE_UNAVAILABLE",
        "Account and workspace services are not configured in this environment.",
        { status: 503, requestId },
      ),
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        ok: false,
        response: jsonFailure(
          "UNAUTHENTICATED",
          "A valid account session is required.",
          { status: 401, requestId },
        ),
      };
    }

    return {
      ok: true,
      context: { requestId, user, supabase },
    };
  } catch (error) {
    console.error("API session validation failed", {
      requestId,
      error,
    });

    return {
      ok: false,
      response: jsonFailure(
        "SERVICE_UNAVAILABLE",
        "The account service is temporarily unavailable.",
        { status: 503, requestId },
      ),
    };
  }
}
