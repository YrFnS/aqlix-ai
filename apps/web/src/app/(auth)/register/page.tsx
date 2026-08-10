import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft, UserRoundPlus } from "lucide-react";
import { AuthFrame, AuthNotice } from "@/components/auth/auth-frame";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { isSupabaseConfigured } from "@/config/env";
import { signUpAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: `Create an account for ${brand.name}`,
};

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

const statusMessages: Record<
  string,
  { tone: "error" | "info"; message: string }
> = {
  configuration: {
    tone: "info",
    message:
      "خدمة الحساب غير مضبوطة في هذه البيئة بعد / Account service configuration is unavailable in this environment.",
  },
  "invalid-input": {
    tone: "error",
    message:
      "اكتب بريداً صحيحاً، وكلمة مرور من 8 أحرف على الأقل، وتأكد من تطابقها / Enter a valid email, use at least 8 characters, and make sure both passwords match.",
  },
  "registration-failed": {
    tone: "error",
    message:
      "تعذر إنشاء الحساب حالياً. قد يكون البريد مستخدماً أو الخدمة غير متاحة / The account could not be created. The email may already be used or the service may be unavailable.",
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

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const nextPath = getSafeNextPath(params.next);
  const statusKey = firstValue(params.status);
  const status = statusKey ? statusMessages[statusKey] : undefined;

  return (
    <AuthFrame
      eyebrow="ابدأ مساحة عملك"
      title="أنشئ حساباً يحفظ سياقك"
      description="حساب واحد يربطك بمساحات العمل ويجعل صلاحيات الوصول جزءاً من كل محادثة ومصدر ومسودة."
      icon={<UserRoundPlus className="h-5 w-5" aria-hidden="true" />}
      footer={
        <p>
          لديك حساب؟{" "}
          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className="rounded-md font-semibold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            سجّل الدخول
          </Link>
        </p>
      }
    >
      {status ? (
        <AuthNotice tone={status.tone} className="mb-6">
          {status.message}
        </AuthNotice>
      ) : null}

      <form action={signUpAction} className="space-y-5" aria-label="نموذج إنشاء الحساب">
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

        <div className="grid gap-5 sm:grid-cols-2">
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
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              disabled={!configured}
              aria-describedby="password-help"
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold">
              تأكيد كلمة المرور
              <span className="mr-2 text-xs font-normal text-ink-subtle">
                Confirm
              </span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              disabled={!configured}
              aria-describedby="password-help"
              className={fieldClassName}
            />
          </div>
        </div>

        <p id="password-help" className="text-xs leading-6 text-ink-subtle">
          استخدم 8 أحرف على الأقل. قد تطلب البيئة التحقق من البريد قبل إنشاء
          الجلسة الأولى، وتدير خدمة المصادقة كلمة المرور خارج تطبيق الويب.
        </p>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={!configured}
        >
          إنشاء الحساب
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      {!configured ? (
        <AuthNotice tone="info" className="mt-5">
          يلزم ضبط متغيري Supabase العامين لتفعيل الحسابات في هذه البيئة.
        </AuthNotice>
      ) : null}
    </AuthFrame>
  );
}
