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
    <div className="mx-auto max-w-[90rem] space-y-5">
      <header className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Link
              href="/workspaces"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              العودة إلى مساحات العمل
            </Link>

            <p className="mt-5 text-xs font-semibold text-primary">
              اختر كيف تتصل بالنماذج
            </p>
            <h1 className="mt-2 font-arabic-heading text-3xl font-semibold sm:text-4xl">
              إعدادات الذكاء الاصطناعي
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              خطوتان فقط: اربط مفتاح OpenRouter الخاص بك، ثم اختر النموذج الذي
              يناسب عملك. يمكنك تغيير الاختيار أو فصل الاتصال لاحقاً.
            </p>
          </div>

          <ol className="grid gap-2 sm:grid-cols-2 lg:min-w-[27rem]">
            <li className="flex items-center gap-3 rounded-2xl bg-secondary/55 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">الخطوة 1</p>
                <p className="mt-0.5 text-sm font-semibold">اربط المفتاح</p>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-2xl bg-secondary/55 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Router className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">الخطوة 2</p>
                <p className="mt-0.5 text-sm font-semibold">اختر النموذج</p>
              </div>
            </li>
          </ol>
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

      <section className="rounded-3xl border border-border/70 bg-secondary/35 p-4 text-sm leading-7 text-muted-foreground sm:px-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            لا يُعرض المفتاح كاملاً بعد الاتصال. ضع حد إنفاق من حساب OpenRouter
            وراجع سعر النموذج وحدوده قبل استخدامه في عمل طويل.
          </p>
        </div>
      </section>
    </div>
  );
}
