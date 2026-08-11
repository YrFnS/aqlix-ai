"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@iraqi-ai/supabase-client/browser";
import { Button } from "@/components/ui/button";

interface TotpFactorSummary {
  id: string;
  friendlyName: string;
}

export function MfaChallengeForm({ nextPath }: { nextPath: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [factors, setFactors] = useState<TotpFactorSummary[]>([]);
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFactors = async () => {
    setLoading(true);
    setError(null);

    const { data, error: factorError } =
      await supabase.auth.mfa.listFactors();

    if (factorError) {
      setError("تعذر تحميل وسائل التحقق. أعد المحاولة / Could not load MFA factors.");
      setLoading(false);
      return;
    }

    const verifiedFactors = data.totp
      .filter((factor) => factor.status === "verified")
      .map((factor, index) => ({
        id: factor.id,
        friendlyName:
          factor.friendly_name?.trim() || `Authenticator ${index + 1}`,
      }));

    setFactors(verifiedFactors);
    setFactorId((current) =>
      verifiedFactors.some((factor) => factor.id === current)
        ? current
        : verifiedFactors[0]?.id ?? "",
    );
    setLoading(false);
  };

  useEffect(() => {
    void loadFactors();
    // The browser client is intentionally stable for this component lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!factorId || !/^\d{6,8}$/u.test(code) || verifying) return;

    setVerifying(true);
    setError(null);

    const { error: verifyError } =
      await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });

    if (verifyError) {
      setError(
        "رمز التحقق غير صحيح أو انتهت صلاحيته / The verification code is invalid or expired.",
      );
      setVerifying(false);
      return;
    }

    window.location.replace(nextPath);
  };

  return (
    <form onSubmit={submit} className="space-y-5" aria-label="التحقق بخطوتين">
      <div className="rounded-2xl border border-line/75 bg-surface-sunken/55 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">تحقق من تطبيق المصادقة</p>
            <p className="mt-1 text-xs leading-6 text-ink-muted">
              افتح تطبيق المصادقة وأدخل الرمز الحالي. لا يطلب Tuppra منك سر
              الإعداد أو رمزاً سابقاً.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          role="status"
          className="flex min-h-24 items-center justify-center gap-3 rounded-xl border border-line/70 bg-surface-sunken text-sm text-ink-muted"
        >
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          جاري تحميل وسائل التحقق
        </div>
      ) : factors.length === 0 ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm leading-7 text-destructive">
          لا توجد وسيلة TOTP موثقة لهذا الحساب. سجّل الخروج ثم أعد المحاولة، أو
          افتح إعدادات أمان الحساب من جلسة موثقة.
        </div>
      ) : (
        <>
          {factors.length > 1 ? (
            <div className="space-y-2">
              <label htmlFor="mfa-factor" className="text-sm font-semibold">
                تطبيق المصادقة
              </label>
              <select
                id="mfa-factor"
                value={factorId}
                onChange={(event) => setFactorId(event.target.value)}
                disabled={verifying}
                className="min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
              >
                {factors.map((factor) => (
                  <option key={factor.id} value={factor.id}>
                    {factor.friendlyName}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="mfa-code" className="text-sm font-semibold">
              رمز التحقق
              <span className="mr-2 text-xs font-normal text-ink-subtle">
                One-time code
              </span>
            </label>
            <input
              id="mfa-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,8}"
              minLength={6}
              maxLength={8}
              required
              dir="ltr"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/gu, "").slice(0, 8))
              }
              disabled={verifying}
              className="min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 text-center font-mono text-lg tracking-[0.35em] outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
            />
          </div>
        </>
      )}

      {error ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="submit"
          size="lg"
          className="rounded-full"
          disabled={loading || factors.length === 0 || !factorId || code.length < 6 || verifying}
        >
          {verifying ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <KeyRound className="h-4 w-4" aria-hidden="true" />
          )}
          {verifying ? "جاري التحقق" : "تحقق وادخل"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-full"
          disabled={loading || verifying}
          onClick={() => void loadFactors()}
        >
          إعادة تحميل الوسائل
        </Button>
      </div>
    </form>
  );
}
