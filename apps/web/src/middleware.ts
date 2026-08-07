import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * P0 middleware is intentionally capability-neutral.
 *
 * The current workspace is a public product-direction preview. P1 will replace
 * this pass-through boundary only after one authentication provider, session
 * lifecycle, persistence model, and authorization contract are selected and
 * tested together.
 */
export function middleware(_request: NextRequest): NextResponse {
  const response = NextResponse.next();
  response.headers.set("x-kiteb-product-phase", "p0");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
