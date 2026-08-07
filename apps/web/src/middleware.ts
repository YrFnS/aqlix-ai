import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { refreshSession } from "@iraqi-ai/supabase-client/middleware";
import { isSupabaseConfigured } from "@/config/env";

const protectedPrefixes = [
  "/dashboard",
  "/workspaces",
  "/settings",
  "/profile",
];

const accountRoutes = ["/login", "/register"];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function redirectWithCookies(
  url: URL,
  sourceResponse?: NextResponse,
): NextResponse {
  const redirectResponse = NextResponse.redirect(url);

  if (sourceResponse) {
    for (const cookie of sourceResponse.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
  }

  return redirectResponse;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const isProtected = matchesPrefix(pathname, protectedPrefixes);
  const isAccountRoute = accountRoutes.includes(pathname);

  if (!isSupabaseConfigured()) {
    if (isProtected) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "configuration");
      loginUrl.searchParams.set("next", pathname);
      return redirectWithCookies(loginUrl);
    }

    const response = NextResponse.next();
    response.headers.set("x-kiteb-product-phase", "p1");
    response.headers.set("x-kiteb-auth-state", "unconfigured");
    return response;
  }

  const { response, user } = await refreshSession(request);

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return redirectWithCookies(loginUrl, response);
  }

  if (isAccountRoute && user) {
    return redirectWithCookies(new URL("/workspaces", request.url), response);
  }

  response.headers.set("x-kiteb-product-phase", "p1");
  response.headers.set(
    "x-kiteb-auth-state",
    user ? "authenticated" : "anonymous",
  );
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
