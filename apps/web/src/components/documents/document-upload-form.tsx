"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, RefreshCw, Upload } from "lucide-react";
import { DOCUMENT_MAX_BYTES } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";

interface DocumentUploadFormProps {
  workspaceId: string;
  canWrite: boolean;
  workspaceArchived: boolean;
}

interface ApiFailurePayload {
  ok?: false;
  error?: {
    message?: string;
    fieldErrors?: Record<string, string[]>;
  };
}

interface ApiSuccessPayload {
  ok?: true;
  data?: {
    document?: {
      attachment?: { id?: string };
    };
  };
}

function localFileError(file: File): string | null {
  const extension = file.name.split(".").at(-1)?.toLowerCase() ?? "";
  if (!extension || !["txt", "md", "markdown"].includes(extension)) {
    return "يدعم هذا المسار ملفات TXT وMarkdown فقط / Only TXT and Markdown are supported.";
  }

  if (file.size < 1) {
    return "الملف فارغ / The file is empty.";
  }

  if (file.size > DOCUMENT_MAX_BYTES) {
    return "حجم الملف يتجاوز 2 MiB / The file exceeds the 2 MiB limit.";
  }

  return null;
}

export function DocumentUploadForm({
  workspaceId,
  canWrite,
  workspaceArchived,
}: DocumentUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || isUploading || !canWrite || workspaceArchived) return;

    const validationError = localFileError(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/sources`,
        {
          method: "POST",
          body: formData,
        },
      );
      const payload = (await response.json()) as
        | ApiFailurePayload
        | ApiSuccessPayload;

      if (!response.ok || payload.ok !== true) {
        const failure = payload as ApiFailurePayload;
        const code = failure.error?.fieldErrors?.file?.[0];
        throw new Error(
          [failure.error?.message, code].filter(Boolean).join(" · ") ||
            "Document upload failed.",
        );
      }

      const attachmentId = payload.data?.document?.attachment?.id;
      if (!attachmentId) {
        throw new Error("The finalized document identity is missing.");
      }

      router.push(
        `/workspaces/${workspaceId}/sources/${attachmentId}?status=uploaded`,
      );
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "تعذر رفع المستند / Document upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!canWrite || workspaceArchived) {
    return (
      <div className="rounded-2xl border border-border bg-secondary/55 p-4 text-sm leading-7 text-muted-foreground">
        {workspaceArchived
          ? "مساحة العمل مؤرشفة. يمكن قراءة المصادر الحالية، لكن يجب استعادة المساحة قبل رفع مستند جديد."
          : "عضويتك للقراءة فقط. يمكنك البحث وفتح المقاطع، لكن الرفع والحذف يحتاجان دور المحرر أو المالك."}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label
        htmlFor="document-file"
        className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background p-6 text-center transition-colors hover:bg-secondary/45"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {file ? (
            <FileText className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Upload className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
        <span dir="auto" className="mt-4 break-all text-sm font-semibold">
          {file?.name ?? "اختر ملف TXT أو Markdown"}
        </span>
        <span className="mt-2 text-xs leading-6 text-muted-foreground">
          UTF-8 فقط · حد أقصى 2 MiB · لا PDF أو OCR في هذه المرحلة
        </span>
      </label>
      <input
        id="document-file"
        name="file"
        type="file"
        accept=".txt,.md,.markdown,text/plain,text/markdown"
        className="sr-only"
        disabled={isUploading}
        onChange={(event) => {
          const selected = event.target.files?.[0] ?? null;
          setFile(selected);
          setError(selected ? localFileError(selected) : null);
        }}
      />

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={!file || isUploading || Boolean(error)}
      >
        {isUploading ? (
          <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="h-4 w-4" aria-hidden="true" />
        )}
        {isUploading ? "جاري التحقق والحفظ…" : "رفع واستخراج المقاطع"}
      </Button>
    </form>
  );
}
