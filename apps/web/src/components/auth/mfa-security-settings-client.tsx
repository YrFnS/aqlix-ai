"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MfaSecuritySettings = dynamic(
  () =>
    import("./mfa-security-settings").then(
      (module) => module.MfaSecuritySettings,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-line/75 bg-surface-raised text-sm text-ink-muted shadow-surface-sm"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        جاري تحميل إعدادات أمان الحساب
      </div>
    ),
  },
);

export function MfaSecuritySettingsClient({
  userEmail,
}: {
  userEmail: string;
}) {
  return <MfaSecuritySettings userEmail={userEmail} />;
}
