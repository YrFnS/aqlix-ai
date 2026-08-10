"use client";

import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, X } from "lucide-react";
import { DOCUMENT_MAX_BYTES } from "@iraqi-ai/types";
import { ActivityOrb } from "@/components/conversations/activity-orb";
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

function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MiB`;
}

export function DocumentUploadForm({
  workspaceId,
  canWrite,
  workspaceArchived,
}: DocumentUploadFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const selectedBeforeHydration = inputRef.current?.files?.[0] ?? null;
    if (!selectedBeforeHydration) return;

    setFile(selectedBeforeHydration);
    setError(localFileError(selectedBeforeHydration));
  }, []);

  const chooseFile = (selected: File | null) => {
    setFile(selected);
    setError(selected ? localFileError(selected) : null);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files?.[0] ?? null);
  };

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
      <div className="rounded-xl border border-line/80 bg-surface-sunken p-4 text-sm leading-7 text-ink-muted">
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
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center outline-none transition-[border-color,background-color,box-shadow] duration-fast focus-within:ring-4 focus-within:ring-ring/20 ${
          isDragging
            ? "border-primary bg-brand-soft/65 shadow-surface-sm"
            : "border-line-strong/80 bg-surface-sunken/55 hover:border-primary/35 hover:bg-brand-soft/35"
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line/70 bg-surface-raised text-primary shadow-surface-xs">
          {isUploading ? (
            <ActivityOrb state="working" size="sm" />
          ) : file ? (
            <FileText className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Upload className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
        <span className="mt-4 text-sm font-semibold">
          {isUploading
            ? "جاري التحقق والحفظ…"
            : isDragging
              ? "أفلت الملف هنا"
              : file
                ? "اختر ملفاً آخر"
                : "اختر ملفاً أو اسحبه هنا"}
        </span>
        <span className="mt-2 text-xs leading-6 text-ink-muted">
          TXT أو Markdown · UTF-8 · حد أقصى 2 MiB
        </span>
      </label>
      <input
        ref={inputRef}
        id="document-file"
        name="file"
        type="file"
        accept=".txt,.md,.markdown,text/plain,text/markdown"
        className="sr-only"
        disabled={isUploading}
        onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
      />

      {file ? (
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-line/70 bg-surface-raised p-3 text-xs shadow-surface-xs">
          <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p dir="auto" className="truncate font-semibold" title={file.name}>
              {file.name}
            </p>
            <p dir="ltr" className="mt-1 text-ink-muted">
              {formatBytes(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 min-h-9 rounded-lg"
            disabled={isUploading}
            onClick={() => chooseFile(null)}
            aria-label="إزالة الملف المختار"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
        >
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={!file || isUploading || Boolean(error)}
      >
        {isUploading ? (
          <ActivityOrb state="working" size="sm" />
        ) : (
          <Upload className="h-4 w-4" aria-hidden="true" />
        )}
        {isUploading ? "جاري الرفع والاستخراج" : "رفع واستخراج المقاطع"}
      </Button>
    </form>
  );
}
