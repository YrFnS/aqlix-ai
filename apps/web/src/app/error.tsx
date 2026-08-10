"use client";

import { useEffect } from "react";
import { RouteFailureState } from "@/components/system/route-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <RouteFailureState
      eyebrow="تعذر فتح الصفحة"
      title="حدث خطأ غير متوقع"
      description={
        process.env.NODE_ENV === "development"
          ? error.message
          : "لم نعرض محتوى بديلاً أو حالة وهمية. أعد المحاولة، أو ارجع إلى مساحات العمل ثم افتح الصفحة من جديد."
      }
      reset={reset}
      backHref="/workspaces"
      reference={error.digest}
    />
  );
}
