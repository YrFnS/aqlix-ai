"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceSourcesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Source route rendering failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
      <section className="w-full rounded-3xl border border-destructive/25 bg-card p-6 text-center shadow-lg shadow-foreground/5 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold text-destructive">
          P3 · Explicit source failure
        </p>
        <h1 className="mt-3 font-arabic-heading text-3xl font-semibold">
          تعذر تحميل الملفات والمقاطع
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-muted-foreground">
          لم تُعرض ملفات مثال أو مقاطع بديلة. أعد المحاولة لتحميل حالة Storage
          وPostgreSQL المصرح بها.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset} className="rounded-full px-6">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            إعادة المحاولة
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/workspaces">العودة إلى مساحات العمل</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
