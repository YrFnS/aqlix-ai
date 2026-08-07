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
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-border bg-foreground px-4 py-3 text-sm text-background shadow-2xl"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        الاتصال غير متاح. اعرض المحتوى المفتوح، وأعد المحاولة بعد عودة الشبكة.
      </span>
    </div>
  );
}
