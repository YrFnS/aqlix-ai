import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { createClient } from "@iraqi-ai/supabase-client/server";
import { AuthFrame, AuthNotice } from "@/components/auth/auth-frame";
import { MfaChallengeForm } from "@/components/auth/mfa-challenge-form";
import { ClientReadyBoundary } from "@/components/system/client-ready-boundary";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { isSupabaseConfigured } from "@/config/env";
import { signOutAction } from "@/lib/auth/actions";
import {
  getValidatedSessionAssurance,
  SessionAssuranceError,
} from "@/lib/auth/assurance";

export const metadata: Metadata = {
  title: "التحقق بخطوتين",
  description: `Complete multi-factor verification for ${brand.name}`,
};

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

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

export default async function MfaChallengePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);

  if (!isSupabaseConfigured()) {
    redirect(
      `/login?status=configuration&next=${encodeURIComponent(nextPath)}`,
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  try {
    const assurance = await getValidatedSessionAssurance(supabase, user);
    if (!assurance.hasVerifiedFactor || assurance.currentLevel === "aal2") {
      redirect(nextPath);
    }
  } catch (assuranceError) {
    if (assuranceError instanceof SessionAssuranceError) {
      redirect(
        `/login?status=mfa-check-failed&next=${encodeURIComponent(nextPath)}`,
      );
    }
    throw assuranceError;
  }

  return (
    <AuthFrame
      eyebrow="حماية الحساب"
      title="أكمل التحقق بخطوتين"
      description="كلمة المرور صحيحة. أدخل الرمز الحالي من تطبيق المصادقة لرفع الجلسة إلى مستوى الحماية المطلوب."
      icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
      footer={
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="rounded-full"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            تسجيل الخروج واستخدام حساب آخر
          </Button>
        </form>
      }
    >
      <AuthNotice tone="info" className="mb-6">
        الحساب: <bdi dir="ltr">{user.email ?? "Authenticated account"}</bdi>
      </AuthNotice>

      <ClientReadyBoundary name="mfa-challenge">
        <MfaChallengeForm nextPath={nextPath} />
      </ClientReadyBoundary>
    </AuthFrame>
  );
}
