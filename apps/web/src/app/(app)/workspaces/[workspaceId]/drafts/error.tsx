"use client";

import { useEffect } from "react";
import { RouteFailureState } from "@/components/system/route-state";

export default function DraftLibraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Draft library rendering failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <RouteFailureState
      eyebrow="تعذر تحميل مكتبة العمل"
      title="تعذر تحميل المسودات المحفوظة"
      description="لم نعرض مسودات مثال أو تاريخاً بديلاً. أعد المحاولة لتحميل العمل المقبول وإصداراته المصرح بها."
      reset={reset}
      backHref="/workspaces"
      reference={error.digest}
    />
  );
}
