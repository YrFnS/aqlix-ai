/**
 * Next.js Middleware for Authentication and Route Protection
 * Features:
 * - Session refresh using Supabase updateSession
 * - Protected route authentication
 * - Cultural context preservation during redirects
 * - Multi-device session support
 * - Iraqi regional context handling
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@iraqi-ai/types";

/**
 * Cultural context returned from database
 */
interface CulturalContext {
  region?: string;
  languagePreference?: string;
  islamicComplianceLevel?: string;
}

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/chat",
  "/documents",
  "/profile",
  "/settings",
];

/**
 * Auth routes that should redirect to dashboard if already authenticated
 */
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/password-reset"];

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/auth/verify-email",
  "/auth/mfa-setup",
  "/privacy",
  "/terms",
  "/help",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session (refresh tokens if needed)
  const response = await updateSession(request);

  // Validate required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    );
  }

  // Create Supabase client to check auth state
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Check if route is an auth route
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Check if route is public (use exact match for homepage, startsWith for others)
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route),
  );

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // Preserve cultural context in redirect
    const culturalContext = getCulturalContextFromCookies(request);
    const loginUrl = new URL("/auth/login", request.url);

    // Add return URL for redirect after login
    loginUrl.searchParams.set("redirect", pathname);

    // Preserve cultural preferences
    if (culturalContext.languagePreference) {
      loginUrl.searchParams.set("lang", culturalContext.languagePreference);
    }
    if (culturalContext.region) {
      loginUrl.searchParams.set("region", culturalContext.region);
    }

    return NextResponse.redirect(loginUrl);
  }

  // Handle auth routes when already authenticated
  if (isAuthRoute && isAuthenticated) {
    // Redirect to dashboard if trying to access login/register while authenticated
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Handle public routes - allow access
  if (isPublicRoute) {
    return response;
  }

  // Add cultural context headers to response
  if (isAuthenticated) {
    const culturalContext = await getCulturalContextFromDatabase(
      supabase,
      user.id,
    );

    // Add cultural context to response headers for server components
    response.headers.set(
      "x-cultural-region",
      culturalContext.region || "baghdad",
    );
    response.headers.set(
      "x-cultural-language",
      culturalContext.languagePreference || "both",
    );
    response.headers.set(
      "x-cultural-islamic-level",
      culturalContext.islamicComplianceLevel || "standard",
    );
  }

  return response;
}

/**
 * Get cultural context from cookies (fallback when user not authenticated)
 */
function getCulturalContextFromCookies(request: NextRequest): CulturalContext {
  return {
    languagePreference: request.cookies.get("cultural_lang")?.value,
    region: request.cookies.get("cultural_region")?.value,
    islamicComplianceLevel: request.cookies.get("cultural_islamic")?.value,
  };
}

/**
 * Get cultural context from database for authenticated users
 */
async function getCulturalContextFromDatabase(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<CulturalContext> {
  try {
    // Note: iraqi_user_authentication table exists in database but not yet in TypeScript types
    // Using type assertion until types are regenerated from Supabase
    const { data, error } = await (supabase as any)
      .from("iraqi_user_authentication")
      .select("region, language_preference, islamic_compliance_level")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching cultural context:", error);
      // Return defaults on error
      return {
        region: "baghdad",
        languagePreference: "both",
        islamicComplianceLevel: "standard",
      };
    }

    // Return user's cultural preferences from database
    return {
      region: (data?.region as string) || "baghdad",
      languagePreference: (data?.language_preference as string) || "both",
      islamicComplianceLevel:
        (data?.islamic_compliance_level as string) || "standard",
    };
  } catch (error) {
    console.error("Error fetching cultural context:", error);
    // Return defaults on exception
    return {
      region: "baghdad",
      languagePreference: "both",
      islamicComplianceLevel: "standard",
    };
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
