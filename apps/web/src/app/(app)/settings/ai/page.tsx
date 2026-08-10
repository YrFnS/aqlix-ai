import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, KeyRound, Router, ShieldCheck } from "lucide-react";
import type { UserAiSettings } from "@iraqi-ai/types";
import { OpenRouterSettings } from "@/components/ai/openrouter-settings";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  getUserAiSettings,
  UserAiSettingsRepositoryError,
} from "@/lib/ai/user-settings";

export const metadata: Metadata = {
  title: "إعدادات الذكاء الاصطناعي",
  description: "اربط مفتاح OpenRouter الخاص بك واختر النموذج الذي ستستخدمه.",
};

const disconnectedSettings: UserAiSettings = {
  provider: "openrouter",
  connected: false,
  modelId: null,
  keyLastFour: null,
  keyLabel: null,
  isFreeTier: null,
  connectedAt: null,
  updatedAt: null,
};

export default async function AiSettingsPage() {
  const { supabase } = await requireAuthenticatedUser("/settings/ai");
  let settings = disconnectedSettings;
  let persistenceFailed = false;

  try {
    settings = await getUserAiSettings(supabase);
  } catch (error) {
    persistenceFailed = true;
    if (error instanceof UserAiSettingsRepositoryError) {
      console.error("AI settings page persistence failure", {
        operation: error.operation,
        databaseCode: error.databaseCode,
        message: error.message,
      });
    } else {
      console.error("Unexpected AI settings page failure", error);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-foreground p-6 text-background sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Link
              href="/workspaces"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              العودة إلى مساحات العمل
            </Link>

            <p className="mt-7 text-sm font-semibold text-primary-foreground/80">
              اختر كيف تتصل بالنماذج
            </p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              إعدادات الذكاء الاصطناعي
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-background/65 sm:text-base">
              اربط مفتاح OpenRouter الخاص بك، ثم اختر النموذج الذي يناسب عملك.
              يمكنك تغيير النموذج أو فصل المفتاح لاحقاً من الصفحة نفسها.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-2xl border border-background/15 bg-background/5 px-4 py-4">
              <KeyRound className="mx-auto h-5 w-5" aria-hidden="true" />
              <p className="mt-2 font-semibold">مفتاحك الخاص</p>
              <p className="mt-1 text-background/55">تحكم كامل بالاتصال</p>
            </div>
            <div className="rounded-2xl border border-background/15 bg-background/5 px-4 py-4">
              <Router className="mx-auto h-5 w-5" aria-hidden="true" />
              <p className="mt-2 font-semibold">نماذج متاحة</p>
              <p className="mt-1 text-background/55">اختر ما يناسبك</p>
            </div>
          </div>
        </div>
      </header>

      {persistenceFailed ? (
        <section className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 sm:p-8">
          <h2 className="font-arabic-heading text-2xl font-semibold">
            تعذر تحميل إعدادات الذكاء الاصطناعي
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            لم نتمكن من قراءة حالة الاتصال الآن. أعد تحميل الصفحة، وإن استمرت
            المشكلة فتحقق من إعدادات الخدمة.
          </p>
        </section>
      ) : (
        <OpenRouterSettings initialSettings={settings} />
      )}

      <section className="rounded-3xl border border-border/70 bg-secondary/35 p-5 text-sm leading-7 text-muted-foreground">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            يُحفظ مفتاحك مشفراً ولا يُعرض مرة أخرى بعد الاتصال. من الأفضل أيضاً
            وضع حد إنفاق من حساب OpenRouter، لأن توفر النماذج وأسعارها وحدودها قد
            يتغير مع الوقت.
          </p>
        </div>
      </section>
    </div>
  );
}
