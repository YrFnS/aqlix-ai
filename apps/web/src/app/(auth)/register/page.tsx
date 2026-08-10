import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { isSupabaseConfigured } from "@/config/env";
import { signUpAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: `أنشئ حساباً جديداً في ${brand.name}.`,
};

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

const statusMessages: Record<string, string> = {
  configuration: "إنشاء الحساب غير متاح في هذه البيئة حالياً.",
  "invalid-input":
    "اكتب بريداً صحيحاً، واستخدم كلمة مرور من 8 أحرف على الأقل، وتأكد من تطابقها.",
  "registration-failed":
    "تعذر إنشاء الحساب حالياً. قد يكون البريد مستخدماً أو الخدمة غير متاحة.",
};

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
  const statusMessage = statusKey ? statusMessages[statusKey] : undefined;

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-border/70 bg-card p-6 shadow-2xl shadow-foreground/5 sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <UserRoundPlus className="h-6 w-6" aria-hidden="true" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-semibold text-primary">ابدأ مساحة عملك</p>
        <h1 className="mt-3 font-arabic-heading text-3xl font-semibold">
          إنشاء حساب
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          أنشئ حساباً واحداً لتنظيم محادثاتك ومصادرك ومسوداتك ومتابعتها من أي
          جهاز.
        </p>
      </div>

      {statusMessage && (
        <div
          className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm leading-7 text-destructive"
          role="alert"
        >
          {statusMessage}
        </div>
      )}

      <form action={signUpAction} className="mt-7 space-y-5">
        <input type="hidden" name="next" value={nextPath} />

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">
            البريد الإلكتروني
            <span className="mr-2 text-xs font-normal text-muted-foreground">
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
            className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold">
              كلمة المرور
              <span className="mr-2 text-xs font-normal text-muted-foreground">
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
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold">
              تأكيد كلمة المرور
              <span className="mr-2 text-xs font-normal text-muted-foreground">
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
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <p className="text-xs leading-6 text-muted-foreground">
          قد تحتاج إلى فتح رابط يصل إلى بريدك قبل تسجيل الدخول للمرة الأولى.
          استخدم كلمة مرور قوية لا تستعملها في حساب آخر.
        </p>

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={!configured}
        >
          إنشاء الحساب
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        لديك حساب؟{" "}
        <Link
          href={`/login?next=${encodeURIComponent(nextPath)}`}
          className="font-semibold text-primary hover:underline"
        >
          سجّل الدخول
        </Link>
      </p>

      {!configured && (
        <p className="mt-5 text-center text-xs leading-6 text-muted-foreground">
          الحسابات غير مفعلة في هذه البيئة حالياً.
        </p>
      )}
    </div>
  );
}
