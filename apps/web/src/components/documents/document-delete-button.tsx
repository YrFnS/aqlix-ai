"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentDeleteButton({
  workspaceId,
  attachmentId,
  fileName,
}: {
  workspaceId: string;
  attachmentId: string;
  fileName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      `حذف ${fileName} والملف الخاص والمقاطع المستخرجة؟\n\nDelete the private file and all extracted passages?`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
        { method: "DELETE" },
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: { message?: string };
      };

      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error?.message || "Document deletion failed.");
      }

      router.push(`/workspaces/${workspaceId}/sources?status=deleted`);
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "تعذر حذف المستند / Document deletion failed.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="destructive"
        className="rounded-full"
        disabled={isDeleting}
        onClick={() => void remove()}
      >
        {isDeleting ? (
          <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        )}
        {isDeleting ? "جاري الحذف…" : "حذف الملف والمقاطع"}
      </Button>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
        >
          {error}
        </div>
      )}
    </div>
  );
}
