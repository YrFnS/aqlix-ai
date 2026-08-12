import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft, LockKeyhole } from "lucide-react";
import { AuthFrame, AuthNotice } from "@/components/auth/auth-frame";
import { NativeActionForm } from "@/components/auth/native-action-form";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { isSupabaseConfigured } from "@/config/env";
import { signInAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: `Sign in to ${brand.name}`,
};

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

const statusMessages: Record<
  string,
  { tone: "error" | "success" | "info"; message: string }
> = {
  configuration: {
    tone: "info",
    message:
      "خدمة الحساب غير مضبوطة في هذه البيئة بعد / Account service configuration is unavailable in this environment.",
  },
  "invalid-input": {
    tone: "error",
    message:
      "اكتب بريداً صحيحاً وكلمة المرور كاملة / Enter a valid email and your complete password.",
  },
  "invalid-credentials": {
    tone: "error",
    message:
      "تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور / Sign-in failed. Check the email and password.",
  },
  "mfa-check-failed": {
    tone: "error",
    message:
      "تعذر التحقق من مستوى حماية الجلسة. أعد تسجيل الدخول لاحقاً / The session assurance level could not be verified. Sign in again later.",
  },
  "check-email": {
    tone: "success",
    message:
      "أرسل رابط التحقق إلى بريدك. افتحه لإكمال الحساب / A verification link was sent. Open it to finish creating the account.",
  },
  "signed-out": {
    tone: "success",
    message: "تم تسجيل الخروج بأمان / You have been signed out.",
  },
  "invalid-link": {
    tone: "error",
    message:
      "رابط التحقق غير مكتمل أو غير صالح / The verification link is incomplete or invalid.",
  },
  "verification-failed": {
    tone: "error",
    message:
      "تعذر التحقق من الرابط. اطلب رابطاً جديداً أو حاول لاحقاً / The link could not be verified. Request a new link or try again later.",
  },
};

const fieldClassName =
  "min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 text-sm text-foreground shadow-surface-xs outline-none transition-[border-color,box-shadow,background-color] duration-fast placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60";

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getSafeNextPath(value: string | string[] | undefined): string {
  const candidate = firstValue(value);
  if (!candidate?.startsWith("/") || candidate.startsWith("//")) {
    return "/workspaces";
  }
  return candidate;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const nextPath = getSafeNextPath(params.next);
  const statusKey = firstValue(params.status) ?? firstValue(params.reason);
  const status = statusKey ? statusMessages[statusKey] : undefined;

  return (
    <AuthFrame
      eyebrow="مرحباً بعودتك"
      title="سجّل الدخول إلى مساحة عملك"
      description="استخدم حسابك للوصول إلى المساحات والمحادثات والمصادر والمسودات التي تملكها أو تشارك فيها."
      icon={<LockKeyhole className="h-5 w-5" aria-hidden="true" />}
      footer={
        <p>
          لا تملك حساباً؟{" "}
          <Link
            href={`/register?next=${encodeURIComponent(nextPath)}`}
            className="rounded-md font-semibold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            أنشئ حساباً
          </Link>
        </p>
      }
    >
      {status ? (
        <AuthNotice tone={status.tone} className="mb-6">
          {status.message}
        </AuthNotice>
      ) : null}

      <NativeActionForm
        action={signInAction}
        className="space-y-5"
        aria-label="نموذج تسجيل الدخول"
      >
        <input type="hidden" name="next" value={nextPath} />

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">
            البريد الإلكتروني
            <span className="mr-2 text-xs font-normal text-ink-subtle">
              Email
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            disabled={!configured}
            placeholder="name@example.com"
            className={fieldClassName}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold">
            كلمة المرور
            <span className="mr-2 text-xs font-normal text-ink-subtle">
              Password
            </span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            minLength={1}
            maxLength={72}
            required
            disabled={!configured}
            className={fieldClassName}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={!configured}
        >
          تسجيل الدخول
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      </NativeActionForm>

      {!configured ? (
        <AuthNotice tone="info" className="mt-5">
          إعداد خدمة الحساب غير مكتمل في هذه البيئة. حاول مجدداً بعد تفعيلها.
        </AuthNotice>
      ) : null}
    </AuthFrame>
  );
}
