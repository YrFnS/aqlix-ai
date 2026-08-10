"use client";

import { useEffect } from "react";
import { RouteFailureState } from "@/components/system/route-state";

export default function ConversationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Conversation route rendering failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <RouteFailureState
      eyebrow="تعذر تحميل المحادثات"
      title="تعذر فتح سجل المحادثة"
      description="لم نعرض رسائل بديلة أو استجابة وهمية. أعد المحاولة لتحميل السجل المصرح به وحالات التوليد المحفوظة."
      reset={reset}
      backHref="/workspaces"
      reference={error.digest}
    />
  );
}
