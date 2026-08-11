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
    <PageShell width="wide" className="mx-auto max-w-[90rem] space-y-6">
      <PageHeader
        eyebrow="اختر كيف تتصل بالنماذج"
        title="إعدادات الذكاء الاصطناعي"
        description="خطوتان فقط: اربط مفتاح OpenRouter الخاص بك، ثم اختر النموذج الذي يناسب عملك. يمكنك تغيير الاختيار أو فصل الاتصال لاحقاً."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/settings/security">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                أمان الحساب
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/workspaces">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                مساحات العمل
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
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
            <p className="text-xs text-ink-muted">الخطوة 1</p>
            <p className="mt-1 text-sm font-semibold">اربط المفتاح</p>
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
            <p className="text-xs text-ink-muted">الخطوة 2</p>
            <p className="mt-1 text-sm font-semibold">اختر النموذج</p>
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
            تعذر تحميل إعدادات الذكاء الاصطناعي
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            لم نتمكن من قراءة حالة الاتصال الآن. أعد تحميل الصفحة، وإن استمرت
            المشكلة فتحقق من إعدادات الخدمة.
          </p>
        </Surface>
      ) : (
        <ClientReadyBoundary name="openrouter-settings">
          <OpenRouterSettings initialSettings={settings} />
        </ClientReadyBoundary>
      )}

      <Surface tone="muted" elevation="none" radius="xl" padding="sm">
        <div className="flex items-start gap-3 text-sm leading-7 text-ink-muted">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            لا يُعرض المفتاح كاملاً بعد الاتصال. ضع حد إنفاق من حساب OpenRouter
            وراجع سعر النموذج وحدوده قبل استخدامه في عمل طويل.
          </p>
        </div>
      </Surface>
    </PageShell>
  );
}
