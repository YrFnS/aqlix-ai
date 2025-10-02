/**
 * Next.js middleware for authentication and protected routes
 *
 * NOTE: Authentication middleware disabled for basic setup
 * Will be enabled in authentication PRP
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // For now, just pass through all requests
  // Authentication will be added in a separate PRP
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
