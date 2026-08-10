"use client";

import { useEffect } from "react";
import { RouteFailureState } from "@/components/system/route-state";
import { amiri, cairo, inter, notoSansArabic } from "@/lib/fonts";
import "./globals.css";
import "./quality.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`
        ${inter.variable}
        ${notoSansArabic.variable}
        ${cairo.variable}
        ${amiri.variable}
      `.trim()}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <RouteFailureState
          eyebrow="تعذر تشغيل Tuppra"
          title="تعذر تحميل التطبيق"
          description={
            process.env.NODE_ENV === "development"
              ? error.message
              : "حدث خطأ قبل اكتمال واجهة التطبيق. أعد المحاولة؛ لم نعرض بيانات بديلة أو ندّعِ حفظ أي تغيير لم يكتمل."
          }
          reset={reset}
          backHref="/"
          backLabel="العودة إلى البداية"
          reference={error.digest}
        />
      </body>
    </html>
  );
}
