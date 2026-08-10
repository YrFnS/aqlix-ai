import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpLeft,
  BookOpen,
  FileText,
  Languages,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { isSupabaseConfigured } from "@/config/env";
import { signInAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: `سجّل الدخول إلى ${brand.name} لمتابعة مساحات عملك.`,
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
    message: "تسجيل الدخول غير متاح في هذه البيئة حالياً.",
  },
  "invalid-input": {
    tone: "error",
    message: "اكتب بريداً صحيحاً وكلمة مرور من 8 أحرف على الأقل.",
  },
  "invalid-credentials": {
    tone: "error",
    message: "تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.",
  },
  "check-email": {
    tone: "success",
    message: "أرسلنا رابط التحقق إلى بريدك. افتحه لإكمال إنشاء الحساب.",
  },
  "signed-out": {
    tone: "success",
    message: "تم تسجيل الخروج بأمان.",
  },
  "invalid-link": {
    tone: "error",
    message: "رابط التحقق غير مكتمل أو غير صالح.",
  },
  "verification-failed": {
    tone: "error",
    message: "تعذر التحقق من الرابط. اطلب رابطاً جديداً أو حاول لاحقاً.",
  },
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

function statusClasses(tone: "error" | "success" | "info"): string {
  if (tone === "error") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  if (tone === "success") {
    return "border-primary/30 bg-primary/10 text-foreground";
  }
  return "border-border bg-secondary/60 text-muted-foreground";
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
    <div className="grid overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl shadow-foreground/5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-foreground p-10 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold text-background/60">
            {brand.categoryAr}
          </p>
          <h1 className="mt-5 text-balance font-arabic-heading text-4xl font-semibold leading-tight">
            ارجع إلى عملك، وأكمل من حيث توقفت.
          </h1>
          <p className="mt-5 text-sm leading-8 text-background/65">
            محادثاتك ومصادرك ومسوداتك تبقى منظمة داخل مساحات العمل الخاصة بك.
          </p>
        </div>

        <div className="relative mt-12 space-y-4">
          {[
            {
              title: "العربية وEnglish",
              description: "اكتب باللغة التي تناسب عملك، حتى داخل النص المختلط.",
              icon: Languages,
            },
            {
              title: "سياق لكل مشروع",
              description: "احتفظ بالمحادثات والملفات والمسودات معاً.",
              icon: BookOpen,
            },
            {
              title: "مصادر يمكنك فتحها",
              description: "ارجع إلى المقطع الداعم عندما تحتاج إلى التحقق.",
              icon: FileText,
            },
          ].map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-background/15 bg-background/5 p-4"
            >
              <div className="h-fit rounded-xl bg-background/10 p-2.5">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-6 text-background/55">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-[620px] items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-semibold text-primary">مرحباً بعودتك</p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold">
              تسجيل الدخول
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              استخدم حسابك للوصول إلى مساحات العمل التي تملكها أو تشارك فيها.
            </p>
          </div>

          {status && (
            <div
              className={`mt-6 rounded-2xl border p-4 text-sm leading-7 ${statusClasses(status.tone)}`}
              role={status.tone === "error" ? "alert" : "status"}
            >
              {status.message}
            </div>
          )}

          <form action={signInAction} className="mt-7 space-y-5">
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
                autoComplete="current-password"
                minLength={8}
                maxLength={72}
                required
                disabled={!configured}
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={!configured}
            >
              تسجيل الدخول
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            لا تملك حساباً؟{" "}
            <Link
              href={`/register?next=${encodeURIComponent(nextPath)}`}
              className="font-semibold text-primary hover:underline"
            >
              أنشئ حساباً
            </Link>
          </p>

          {!configured && (
            <p className="mt-5 text-center text-xs leading-6 text-muted-foreground">
              الحسابات غير مفعلة في هذه البيئة حالياً.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
