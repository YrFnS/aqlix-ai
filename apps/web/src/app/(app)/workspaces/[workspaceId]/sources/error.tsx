"use client";

import { useEffect } from "react";
import { RouteFailureState } from "@/components/system/route-state";

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
    <RouteFailureState
      eyebrow="تعذر تحميل مكتبة المصادر"
      title="تعذر تحميل الملفات والمقاطع"
      description="لم نعرض ملفات مثال أو مقاطع بديلة. أعد المحاولة لتحميل حالة التخزين والبيانات المصرح بها داخل مساحة العمل."
      reset={reset}
      backHref="/workspaces"
      reference={error.digest}
    />
  );
}
