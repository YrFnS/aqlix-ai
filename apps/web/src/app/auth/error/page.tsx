import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication Error | خطأ في المصادقة",
  description: "An error occurred during authentication",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { code?: string; message?: string; lang?: string };
}) {
  const errorCode = searchParams.code || "unknown";
  const errorMessage =
    searchParams.message || "حدث خطأ غير متوقع / An unexpected error occurred";
  const culturalMode = searchParams.lang === "ar-IQ" ? "ar-IQ" : "both";

  // Map error codes to user-friendly messages and suggestions
  const errorDetails = getErrorDetails(errorCode);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <svg
              className="h-16 w-16 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="font-arabic text-2xl font-bold tracking-tight">
            <span className="block">{errorDetails.title.ar}</span>
            <span className="text-muted-foreground block text-base font-normal">
              {errorDetails.title.en}
            </span>
          </h1>
          <p className="font-arabic text-sm text-destructive">{errorMessage}</p>
        </div>

        {/* Error Details */}
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
          <h2 className="font-arabic mb-2 text-sm font-semibold">
            {culturalMode === "ar-IQ"
              ? "تفاصيل المشكلة"
              : "تفاصيل المشكلة / Problem Details"}
          </h2>
          <p className="text-muted-foreground font-arabic text-sm">
            {errorDetails.description}
          </p>
        </div>

        {/* Suggestions */}
        {errorDetails.suggestions.length > 0 && (
          <div className="bg-secondary rounded-lg p-4 text-left">
            <h2 className="font-arabic mb-2 text-sm font-semibold">
              {culturalMode === "ar-IQ"
                ? "الحلول المقترحة"
                : "الحلول المقترحة / Suggested Solutions"}
            </h2>
            <ul className="text-muted-foreground font-arabic space-y-1 text-sm">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/auth/login">
            <Button className="font-arabic w-full">
              {culturalMode === "ar-IQ"
                ? "العودة لتسجيل الدخول"
                : "العودة لتسجيل الدخول / Back to Login"}
            </Button>
          </Link>

          {errorCode === "token_expired" && (
            <Link href="/auth/register">
              <Button variant="outline" className="font-arabic w-full">
                {culturalMode === "ar-IQ"
                  ? "إنشاء حساب جديد"
                  : "إنشاء حساب جديد / Create New Account"}
              </Button>
            </Link>
          )}
        </div>

        {/* Help Link */}
        <div className="text-center">
          <Link
            href="/help"
            className="text-primary hover:underline font-arabic text-sm"
          >
            {culturalMode === "ar-IQ"
              ? "هل تحتاج مساعدة؟"
              : "هل تحتاج مساعدة؟ / Need help?"}
          </Link>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded border border-dashed p-2 text-left">
            <p className="font-mono text-xs text-muted-foreground">
              Error Code: {errorCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Get detailed error information based on error code
 */
function getErrorDetails(errorCode: string): {
  title: { ar: string; en: string };
  description: string;
  suggestions: string[];
} {
  const errorMap: Record<
    string,
    {
      title: { ar: string; en: string };
      description: string;
      suggestions: string[];
    }
  > = {
    missing_params: {
      title: { ar: "رابط غير صالح", en: "Invalid Link" },
      description:
        "رابط التحقق غير مكتمل أو تالف / The verification link is incomplete or corrupted",
      suggestions: [
        "تحقق من نسخ الرابط كاملاً من البريد الإلكتروني / Copy the entire link from email",
        "حاول فتح الرابط في متصفح آخر / Try opening link in another browser",
        "اطلب رابط تحقق جديد / Request a new verification link",
      ],
    },
    token_expired: {
      title: { ar: "انتهت صلاحية الرابط", en: "Link Expired" },
      description:
        "انتهت صلاحية رابط التحقق. الروابط صالحة لمدة 24 ساعة فقط / Verification link has expired. Links are valid for 24 hours only",
      suggestions: [
        "سجل حساباً جديداً / Register a new account",
        "استخدم خيار 'نسيت كلمة المرور' إذا كان لديك حساب / Use 'Forgot Password' if you have an account",
        "تحقق من بريدك الإلكتروني بشكل أسرع في المرة القادمة / Check email more promptly next time",
      ],
    },
    invalid_token: {
      title: { ar: "رمز تحقق غير صالح", en: "Invalid Token" },
      description:
        "رمز التحقق غير صالح أو تم استخدامه بالفعل / Verification token is invalid or already used",
      suggestions: [
        "تحقق من أنك لم تستخدم الرابط من قبل / Verify you haven't used this link before",
        "اطلب رابط تحقق جديد / Request a new verification link",
        "تأكد من نسخ الرابط كاملاً / Ensure you copied the entire link",
      ],
    },
    verification_failed: {
      title: { ar: "فشل التحقق", en: "Verification Failed" },
      description:
        "فشل التحقق من البريد الإلكتروني لأسباب فنية / Email verification failed due to technical reasons",
      suggestions: [
        "حاول مرة أخرى بعد بضع دقائق / Try again in a few minutes",
        "تحقق من اتصالك بالإنترنت / Check your internet connection",
        "اتصل بالدعم الفني إذا استمرت المشكلة / Contact support if issue persists",
      ],
    },
    no_user_data: {
      title: { ar: "بيانات مفقودة", en: "Missing Data" },
      description: "لم يتم العثور على بيانات المستخدم / User data not found",
      suggestions: [
        "سجل حساباً جديداً / Register a new account",
        "تحقق من استخدام البريد الإلكتروني الصحيح / Verify you used the correct email",
        "اتصل بالدعم الفني / Contact support",
      ],
    },
    unexpected_error: {
      title: { ar: "خطأ غير متوقع", en: "Unexpected Error" },
      description:
        "حدث خطأ غير متوقع في النظام / An unexpected system error occurred",
      suggestions: [
        "حاول مرة أخرى / Try again",
        "امسح ذاكرة التخزين المؤقت للمتصفح / Clear browser cache",
        "اتصل بالدعم الفني / Contact support",
      ],
    },
  };

  return (
    errorMap[errorCode] || {
      title: { ar: "خطأ", en: "Error" },
      description: "حدث خطأ / An error occurred",
      suggestions: [
        "حاول مرة أخرى / Try again",
        "اتصل بالدعم الفني / Contact support",
      ],
    }
  );
}
