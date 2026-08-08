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
  description: "Connect a user-owned OpenRouter key and select a live model.",
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
              P5 · User-owned AI connection
            </p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              إعدادات الذكاء الاصطناعي
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-background/65 sm:text-base">
              اربط مفتاح OpenRouter الخاص بك واختر نموذجاً من القائمة الحية.
              المنصة لا تحتاج مفتاح نموذج مركزي، ولا تفرض اسماً ثابتاً لنموذج قد
              يتغير أو يختفي لاحقاً.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-2xl border border-background/15 bg-background/5 px-4 py-4">
              <KeyRound className="mx-auto h-5 w-5" aria-hidden="true" />
              <p className="mt-2 font-semibold">BYOK</p>
              <p className="mt-1 text-background/55">Your key</p>
            </div>
            <div className="rounded-2xl border border-background/15 bg-background/5 px-4 py-4">
              <Router className="mx-auto h-5 w-5" aria-hidden="true" />
              <p className="mt-2 font-semibold">Live</p>
              <p className="mt-1 text-background/55">Model catalog</p>
            </div>
          </div>
        </div>
      </header>

      {persistenceFailed ? (
        <section className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 sm:p-8">
          <h2 className="font-arabic-heading text-2xl font-semibold">
            تعذر تحميل اتصال الذكاء الاصطناعي
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            لم تُعرض حالة افتراضية على أنها محفوظة. تحقق من تطبيق migrations وVault
            ثم أعد تحميل الصفحة.
          </p>
        </section>
      ) : (
        <OpenRouterSettings initialSettings={settings} />
      )}

      <section className="rounded-3xl border border-border/70 bg-secondary/35 p-5 text-sm leading-7 text-muted-foreground">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p>
            يُخزن المفتاح مشفراً في Supabase Vault ولا يظهر مجدداً في واجهة
            الإعدادات. حدّد أيضاً سقف إنفاق للمفتاح من OpenRouter؛ النماذج المجانية
            وتوفرها وحدودها قد تتغير، لذلك تُقرأ القائمة عند الاستخدام بدلاً من
            تثبيتها في الكود.
          </p>
        </div>
      </section>
    </div>
  );
}
