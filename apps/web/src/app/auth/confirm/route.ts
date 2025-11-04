/**
 * Email Confirmation Route Handler
 * Handles Supabase email verification callbacks
 *
 * This route is called when users click the confirmation link in their email.
 * It verifies the token and updates the user's email verification status.
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Validate redirect URL to prevent open redirect attacks
 * Only allows internal relative URLs or safe absolute URLs from the same origin
 */
function validateRedirectUrl(url: string | null, requestUrl: string): string {
  const defaultRedirect = "/dashboard";

  // If no URL provided, use default
  if (!url) {
    return defaultRedirect;
  }

  // Allow relative URLs that start with /
  if (url.startsWith("/") && !url.startsWith("//")) {
    // Prevent protocol-relative URLs (//example.com)
    return url;
  }

  // For absolute URLs, validate they're from the same origin
  try {
    const requestOrigin = new URL(requestUrl).origin;
    const redirectUrl = new URL(url);

    if (redirectUrl.origin === requestOrigin) {
      return redirectUrl.pathname + redirectUrl.search + redirectUrl.hash;
    }

    // External URL detected, use default
    console.warn(`Open redirect attempt blocked: ${url}`);
    return defaultRedirect;
  } catch {
    // Invalid URL, use default
    return defaultRedirect;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next");
  const next = validateRedirectUrl(nextParam, request.url);

  // Preserve cultural context from query params
  const culturalLang = searchParams.get("lang");
  const culturalRegion = searchParams.get("region");

  // Validate required parameters
  if (!token_hash || !type) {
    return redirectToError(
      request,
      "missing_params",
      "رابط التحقق غير صالح / Invalid verification link",
      culturalLang,
      culturalRegion,
    );
  }

  try {
    const supabase = await createClient();

    // Verify the email confirmation token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (error) {
      console.error("Email confirmation error:", error);

      // Handle specific error cases
      if (error.message.includes("expired")) {
        return redirectToError(
          request,
          "token_expired",
          "انتهت صلاحية رابط التحقق / Verification link expired",
          culturalLang,
          culturalRegion,
        );
      }

      if (error.message.includes("invalid")) {
        return redirectToError(
          request,
          "invalid_token",
          "رابط التحقق غير صالح / Invalid verification link",
          culturalLang,
          culturalRegion,
        );
      }

      // Generic error
      return redirectToError(
        request,
        "verification_failed",
        "فشل التحقق / Verification failed",
        culturalLang,
        culturalRegion,
      );
    }

    // Email verification successful
    if (data.user) {
      // Update user verification status in database
      // TODO: Update iraqi_user_authentication table
      // const { error: updateError } = await supabase
      //   .from('iraqi_user_authentication')
      //   .update({ email_verified: true })
      //   .eq('id', data.user.id);

      // Redirect to success page or dashboard
      const successUrl = new URL(next, request.url);

      // Add success message to URL
      successUrl.searchParams.set("verified", "true");

      // Preserve cultural context
      if (culturalLang) {
        successUrl.searchParams.set("lang", culturalLang);
      }
      if (culturalRegion) {
        successUrl.searchParams.set("region", culturalRegion);
      }

      // Set cultural context cookies for future requests
      const response = NextResponse.redirect(successUrl);

      if (culturalLang) {
        response.cookies.set("cultural_lang", culturalLang, {
          maxAge: 60 * 60 * 24 * 365, // 1 year
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      if (culturalRegion) {
        response.cookies.set("cultural_region", culturalRegion, {
          maxAge: 60 * 60 * 24 * 365, // 1 year
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      return response;
    }

    // No user data returned (shouldn't happen)
    return redirectToError(
      request,
      "no_user_data",
      "بيانات المستخدم غير متوفرة / User data not available",
      culturalLang,
      culturalRegion,
    );
  } catch (error) {
    console.error("Unexpected error during email confirmation:", error);

    return redirectToError(
      request,
      "unexpected_error",
      "حدث خطأ غير متوقع / Unexpected error occurred",
      culturalLang,
      culturalRegion,
    );
  }
}

/**
 * Redirect to error page with appropriate error message
 */
function redirectToError(
  request: NextRequest,
  errorCode: string,
  errorMessage: string,
  culturalLang: string | null,
  culturalRegion: string | null,
): NextResponse {
  const errorUrl = new URL("/auth/error", request.url);

  errorUrl.searchParams.set("code", errorCode);
  errorUrl.searchParams.set("message", errorMessage);

  // Preserve cultural context
  if (culturalLang) {
    errorUrl.searchParams.set("lang", culturalLang);
  }
  if (culturalRegion) {
    errorUrl.searchParams.set("region", culturalRegion);
  }

  return NextResponse.redirect(errorUrl);
}
