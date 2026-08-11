"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Check,
  Clipboard,
  KeyRound,
  LoaderCircle,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { createClient } from "@iraqi-ai/supabase-client/browser";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";

interface TotpFactorSummary {
  id: string;
  friendlyName: string;
  status: string;
  createdAt: string | null;
}

interface PendingEnrollment {
  factorId: string;
  qrCode: string;
  secret: string;
}

function formatTimestamp(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MfaSecuritySettings({ userEmail }: { userEmail: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [factors, setFactors] = useState<TotpFactorSummary[]>([]);
  const [pending, setPending] = useState<PendingEnrollment | null>(null);
  const [friendlyName, setFriendlyName] = useState("Tuppra Authenticator");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFactors = async () => {
    setLoading(true);
    setError(null);

    const { data, error: factorError } =
      await supabase.auth.mfa.listFactors();

    if (factorError) {
      setError("تعذر تحميل وسائل التحقق / Could not load MFA factors.");
      setLoading(false);
      return;
    }

    setFactors(
      data.totp.map((factor, index) => ({
        id: factor.id,
        friendlyName:
          factor.friendly_name?.trim() || `Authenticator ${index + 1}`,
        status: factor.status,
        createdAt: factor.created_at ?? null,
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    void loadFactors();
    // The browser client is intentionally stable for this component lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const startEnrollment = async () => {
    if (working || pending) return;
    setWorking(true);
    setError(null);
    setNotice(null);

    const { data, error: enrollmentError } =
      await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: friendlyName.trim() || "Tuppra Authenticator",
        issuer: "Tuppra",
      });

    if (enrollmentError || !data.totp) {
      setError(
        "تعذر بدء إعداد تطبيق المصادقة / Could not start authenticator enrollment.",
      );
      setWorking(false);
      return;
    }

    setPending({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    });
    setVerificationCode("");
    setWorking(false);
  };

  const cancelEnrollment = async () => {
    if (!pending || working) return;
    setWorking(true);
    setError(null);

    const factorId = pending.factorId;
    const { error: removalError } = await supabase.auth.mfa.unenroll({
      factorId,
    });

    if (removalError) {
      setError(
        "تعذر إلغاء وسيلة التحقق غير المكتملة / Could not remove the unfinished factor.",
      );
      setWorking(false);
      return;
    }

    setPending(null);
    setVerificationCode("");
    setCopied(false);
    setWorking(false);
    await loadFactors();
  };

  const verifyEnrollment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !pending ||
      !/^\d{6,8}$/u.test(verificationCode) ||
      working
    ) {
      return;
    }

    setWorking(true);
    setError(null);
    setNotice(null);

    const { error: verificationError } =
      await supabase.auth.mfa.challengeAndVerify({
        factorId: pending.factorId,
        code: verificationCode,
      });

    if (verificationError) {
      setError(
        "رمز التحقق غير صحيح أو انتهت صلاحيته / The verification code is invalid or expired.",
      );
      setWorking(false);
      return;
    }

    setPending(null);
    setVerificationCode("");
    setCopied(false);
    setNotice("تم تفعيل التحقق بخطوتين لهذا الحساب.");
    setWorking(false);
    await loadFactors();
  };

  const removeFactor = async (factor: TotpFactorSummary) => {
    if (working) return;
    const confirmed = window.confirm(
      `إزالة وسيلة التحقق «${factor.friendlyName}»؟`,
    );
    if (!confirmed) return;

    setWorking(true);
    setError(null);
    setNotice(null);

    const { error: removalError } = await supabase.auth.mfa.unenroll({
      factorId: factor.id,
    });

    if (removalError) {
      setError(
        "تعذر إزالة وسيلة التحقق. أعد التحقق من الجلسة ثم حاول مجدداً.",
      );
      setWorking(false);
      return;
    }

    setNotice("تمت إزالة وسيلة التحقق من الحساب.");
    setWorking(false);
    await loadFactors();
  };

  const verifiedFactors = factors.filter(
    (factor) => factor.status === "verified",
  );

  return (
    <div className="space-y-6">
      {notice ? (
        <div role="status" className="rounded-xl border border-primary/30 bg-brand-soft px-4 py-3 text-sm leading-7">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Surface tone="raised" elevation="sm" radius="2xl" padding="lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary">تطبيق المصادقة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                التحقق بخطوتين عبر TOTP
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
                بعد التفعيل سيطلب Tuppra رمزاً متغيراً من تطبيق المصادقة بعد
                كلمة المرور. يمكنك إضافة وسيلة ثانية للاحتياط.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          {loading ? (
            <div role="status" className="mt-6 flex min-h-28 items-center justify-center gap-3 rounded-xl border border-line/70 bg-surface-sunken text-sm text-ink-muted">
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              جاري تحميل وسائل التحقق
            </div>
          ) : verifiedFactors.length > 0 ? (
            <div className="mt-6 space-y-3">
              {verifiedFactors.map((factor) => (
                <article
                  key={factor.id}
                  className="flex flex-col gap-4 rounded-2xl border border-line/75 bg-surface-sunken/55 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p dir="auto" className="truncate text-sm font-semibold">
                        {factor.friendlyName}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        موثقة · أضيفت {formatTimestamp(factor.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={working}
                    onClick={() => void removeFactor(factor)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    إزالة
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface-sunken/45 p-5 text-sm leading-7 text-ink-muted">
              لا توجد وسيلة تحقق موثقة بعد. أضف تطبيق مصادقة قبل استخدام الحساب
              في بيئة حساسة.
            </div>
          )}

          {!pending ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="space-y-2">
                <label htmlFor="factor-name" className="text-sm font-semibold">
                  اسم الوسيلة
                </label>
                <input
                  id="factor-name"
                  type="text"
                  maxLength={100}
                  value={friendlyName}
                  onChange={(event) => setFriendlyName(event.target.value)}
                  disabled={working}
                  className="min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                />
              </div>
              <Button
                type="button"
                size="lg"
                className="rounded-full"
                disabled={working || loading}
                onClick={() => void startEnrollment()}
              >
                {working ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Plus className="h-4 w-4" aria-hidden="true" />
                )}
                إضافة تطبيق
              </Button>
            </div>
          ) : null}
        </Surface>

        <Surface tone="muted" elevation="none" radius="2xl" padding="md">
          <div className="flex items-start gap-3">
            <Smartphone className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold">حالة الحساب</h2>
              <p dir="ltr" className="mt-2 break-all text-xs text-ink-muted">
                {userEmail}
              </p>
              <p className="mt-4 text-xs leading-6 text-ink-muted">
                TOTP متاح من دون رسوم رسائل. التحقق بالهاتف أو WhatsApp يحتاج
                مزوّد رسائل منفصلاً قبل تفعيله.
              </p>
            </div>
          </div>
        </Surface>
      </div>

      {pending ? (
        <Surface tone="raised" elevation="sm" radius="2xl" padding="lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary">إعداد وسيلة جديدة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                امسح الرمز ثم تحقق
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl"
              disabled={working}
              onClick={() => void cancelEnrollment()}
              aria-label="إلغاء إعداد وسيلة التحقق"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
            <div className="rounded-2xl border border-line/75 bg-white p-4 shadow-surface-sm">
              {/* Supabase returns the QR code as an SVG data URL. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pending.qrCode}
                alt="رمز QR لإضافة Tuppra إلى تطبيق المصادقة"
                className="mx-auto aspect-square w-full max-w-56"
              />
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold">الإدخال اليدوي</p>
                <p className="mt-2 text-xs leading-6 text-ink-muted">
                  إن تعذر مسح QR، أدخل هذا السر في تطبيق المصادقة. لا تشاركه ولا
                  تحفظه في لقطة شاشة.
                </p>
                <div className="mt-3 flex min-w-0 items-center gap-2 rounded-xl border border-line/75 bg-surface-sunken p-3">
                  <code
                    dir="ltr"
                    data-testid="mfa-enrollment-secret"
                    className="min-w-0 flex-1 break-all font-mono text-xs"
                  >
                    {pending.secret}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 rounded-lg"
                    aria-label="نسخ سر تطبيق المصادقة"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(pending.secret);
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1600);
                      } catch {
                        setCopied(false);
                      }
                    }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Clipboard className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>

              <form onSubmit={verifyEnrollment} className="space-y-3">
                <label htmlFor="enrollment-code" className="text-sm font-semibold">
                  الرمز الحالي من التطبيق
                </label>
                <input
                  id="enrollment-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6,8}"
                  minLength={6}
                  maxLength={8}
                  required
                  dir="ltr"
                  value={verificationCode}
                  onChange={(event) =>
                    setVerificationCode(
                      event.target.value.replace(/\D/gu, "").slice(0, 8),
                    )
                  }
                  disabled={working}
                  className="min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 text-center font-mono text-lg tracking-[0.3em] outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={working || verificationCode.length < 6}
                >
                  {working ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  )}
                  {working ? "جاري التحقق" : "تحقق وفعّل"}
                </Button>
              </form>
            </div>
          </div>
        </Surface>
      ) : null}
    </div>
  );
}
