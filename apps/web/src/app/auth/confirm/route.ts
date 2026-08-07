import type { EmailOtpType } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createActionClient } from "@iraqi-ai/supabase-client/server";
import { isSupabaseConfigured } from "@/config/env";

function getSafeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/workspaces";
  }

  return value;
}

function loginRedirect(
  request: NextRequest,
  status: "configuration" | "invalid-link" | "verification-failed",
): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("status", status);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isSupabaseConfigured()) {
    return loginRedirect(request, "configuration");
  }

  const searchParams = request.nextUrl.searchParams;
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const supabase = await createActionClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error
      ? loginRedirect(request, "verification-failed")
      : NextResponse.redirect(new URL(nextPath, request.url));
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    return error
      ? loginRedirect(request, "verification-failed")
      : NextResponse.redirect(new URL(nextPath, request.url));
  }

  return loginRedirect(request, "invalid-link");
}
