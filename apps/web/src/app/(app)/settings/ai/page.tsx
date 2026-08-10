import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, KeyRound, Router, ShieldCheck } from "lucide-react";
import type { UserAiSettings } from "@iraqi-ai/types";
import { OpenRouterSettings } from "@/components/ai/openrouter-settings";
import { ClientReadyBoundary } from "@/components/system/client-ready-boundary";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
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
    <PageShell width="wide" className="space-y-8">
      <PageHeader
        eyebrow="اتصال الذكاء الاصطناعي"
        title="مفتاحك، نموذجك، وحدودك"
        description="اربط مفتاح OpenRouter الخاص بحسابك، ثم اختر نموذجاً من القائمة الحية. لا تعتمد المنصة على مفتاح مركزي ولا تفرض نموذجاً ثابتاً قد يتغير أو يختفي."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/workspaces">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              مساحات العمل
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Surface
          tone="raised"
          elevation="xs"
          radius="xl"
          padding="sm"
          className="flex items-center gap-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <KeyRound className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-ink-muted">ملكية المفتاح</p>
            <p className="mt-1 text-sm font-semibold">BYOK</p>
          </div>
        </Surface>
        <Surface
          tone="raised"
          elevation="xs"
          radius="xl"
          padding="sm"
          className="flex items-center gap-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <Router className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-ink-muted">قائمة النماذج</p>
            <p className="mt-1 text-sm font-semibold">Live catalog</p>
          </div>
        </Surface>
        <Surface
          tone="raised"
          elevation="xs"
          radius="xl"
          padding="sm"
          className="flex items-center gap-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-ink-muted">تخزين بيانات الاعتماد</p>
            <p className="mt-1 text-sm font-semibold">Supabase Vault</p>
          </div>
        </Surface>
      </div>

      {persistenceFailed ? (
        <Surface
          tone="raised"
          elevation="xs"
          radius="2xl"
          padding="lg"
          className="border-destructive/25 bg-destructive/10"
        >
          <h2 className="font-arabic-heading text-2xl font-semibold">
            تعذر تحميل اتصال الذكاء الاصطناعي
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            لم تُعرض حالة افتراضية على أنها محفوظة. تحقق من تطبيق migrations وVault
            ثم أعد تحميل الصفحة.
          </p>
        </Surface>
      ) : (
        <ClientReadyBoundary name="openrouter-settings">
          <OpenRouterSettings initialSettings={settings} />
        </ClientReadyBoundary>
      )}

      <Surface
        tone="muted"
        elevation="none"
        radius="xl"
        padding="sm"
      >
        <div className="flex items-start gap-3 text-sm leading-7 text-ink-muted">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            يُخزن المفتاح مشفراً في Supabase Vault ولا يظهر مجدداً في الواجهة.
            حدّد أيضاً سقف إنفاق للمفتاح من OpenRouter؛ توفر النماذج وأسعارها
            وحدودها قد تتغير، لذلك تُقرأ القائمة عند الاستخدام بدلاً من تثبيتها
            في الكود.
          </p>
        </div>
      </Surface>
    </PageShell>
  );
}
