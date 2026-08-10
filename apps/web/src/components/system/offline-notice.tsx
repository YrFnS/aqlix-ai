"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => setIsOffline(!navigator.onLine);
    updateStatus();

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="fixed inset-x-3 z-[90] mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-line-strong/80 bg-surface-overlay/95 px-4 py-3 text-sm text-foreground shadow-surface-lg backdrop-blur-xl sm:inset-x-auto sm:end-4 sm:w-[min(28rem,calc(100vw-2rem))]"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-network-status="offline"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
        <WifiOff className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold">أنت غير متصل بالشبكة</p>
        <p className="mt-1 text-xs leading-6 text-ink-muted">
          يمكنك مراجعة المحتوى المفتوح. أعد المحاولة بعد عودة الاتصال قبل افتراض
          أن أي حفظ أو توليد جديد اكتمل.
        </p>
      </div>
    </div>
  );
}
