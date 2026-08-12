import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import { MfaSecuritySettingsClient } from "@/components/auth/mfa-security-settings-client";
import { ClientReadyBoundary } from "@/components/system/client-ready-boundary";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "أمان الحساب",
  description: "Manage password guidance and authenticator-based MFA.",
};

export default async function AccountSecurityPage() {
  const { user } = await requireAuthenticatedUser("/settings/security");

  return (
    <PageShell width="wide" className="mx-auto max-w-[90rem] space-y-6">
      <PageHeader
        eyebrow="الحساب"
        title="أمان الحساب"
        description="فعّل تطبيق مصادقة لحماية الجلسة بعد كلمة المرور، واحتفظ بكلمة مرور طويلة وفريدة داخل مدير كلمات مرور."
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
            <p className="text-xs text-ink-muted">كلمة المرور</p>
            <p className="mt-1 text-sm font-semibold">12 حرفاً ومعايير تعقيد</p>
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
            <p className="text-xs text-ink-muted">TOTP</p>
            <p className="mt-1 text-sm font-semibold">متاح بلا رسوم رسائل</p>
          </div>
        </Surface>

        <Surface
          tone="raised"
          elevation="xs"
          radius="xl"
          padding="sm"
          className="flex items-center gap-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-sunken text-ink-muted">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-ink-muted">الهاتف / WhatsApp</p>
            <p className="mt-1 text-sm font-semibold">يحتاج مزوّد رسائل</p>
          </div>
        </Surface>
      </div>

      <ClientReadyBoundary name="mfa-security-settings">
        <MfaSecuritySettingsClient
          userEmail={user.email ?? "Authenticated account"}
        />
      </ClientReadyBoundary>

      <Surface tone="muted" elevation="none" radius="xl" padding="sm">
        <div className="flex items-start gap-3 text-sm leading-7 text-ink-muted">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            فحص كلمات المرور المسرّبة من Supabase يحتاج خطة مدفوعة. لذلك يفرض
            التطبيق حالياً طولاً وتعقيداً أعلى ويرفض كلمات شائعة، لكن هذا لا
            يساوي فحص قاعدة بيانات كلمات المرور المسرّبة.
          </p>
        </div>
      </Surface>
    </PageShell>
  );
}
