import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Authentication callbacks are unavailable until P1 establishes one verified
 * provider, session, persistence, and authorization contract.
 */
export function GET(request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("status", "account-rebuild");

  return NextResponse.redirect(loginUrl);
}
