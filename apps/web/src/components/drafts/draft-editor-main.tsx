"use client";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  Clipboard,
  FileClock,
  RefreshCw,
  Save,
} from "lucide-react";
import type { DraftKind } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { useDraftEditorContext } from "./draft-editor-context";
import { kindOptions } from "./draft-editor-utils";

export function DraftEditorMain() {
  const {
    detail,
    editor,
    canEdit,
    dirty,
    saveState,
    isSaving,
    saveError,
    copyState,
    updateEditor,
    saveDraft,
    copyEditor,
  } = useDraftEditorContext();

  return (
    <main className="min-w-0">
      <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">مساحة الكتابة</p>
            <h2 className="mt-1 font-arabic-heading text-2xl font-semibold">
              الإصدار {detail.draft.currentVersion}
            </h2>
          </div>
          <div
            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold ${
              saveState === "saved"
                ? "bg-primary/10 text-primary"
                : saveState === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-muted-foreground"
            }`}
            role="status"
            aria-live="polite"
          >
            {saveState === "saving" ? (
              <RefreshCw
                className="h-3.5 w-3.5 animate-spin"
                aria-hidden="true"
              />
            ) : saveState === "saved" ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : saveState === "error" ? (
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {saveState === "saving"
              ? "جاري الحفظ"
              : saveState === "saved"
                ? `محفوظ · v${detail.draft.currentVersion}`
                : saveState === "error"
                  ? "فشل الحفظ"
                  : "تغييرات غير محفوظة"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="space-y-2 text-sm font-semibold">
            <span>العنوان</span>
            <input
              aria-label="عنوان المسودة"
              value={editor.title}
              onChange={(event) => updateEditor({ title: event.target.value })}
              maxLength={200}
              readOnly={!canEdit}
              dir="auto"
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary read-only:cursor-default read-only:bg-secondary/45"
            />
          </label>

          <details className="group rounded-2xl border border-border/70 bg-secondary/25">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
              خيارات المسودة
              <ChevronDown
                className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid gap-4 border-t border-border/70 p-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold">
                <span>نوع العمل</span>
                <select
                  aria-label="نوع المسودة"
                  value={editor.kind}
                  onChange={(event) =>
                    updateEditor({ kind: event.target.value as DraftKind })
                  }
                  disabled={!canEdit}
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
                >
                  {kindOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-semibold">
                <span>اتجاه المحتوى</span>
                <select
                  aria-label="اتجاه محتوى المسودة"
                  value={editor.direction}
                  onChange={(event) =>
                    updateEditor({
                      direction: event.target.value as
                        | "auto"
                        | "rtl"
                        | "ltr",
                    })
                  }
                  disabled={!canEdit}
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:bg-secondary/45"
                >
                  <option value="auto">تلقائي</option>
                  <option value="rtl">RTL</option>
                  <option value="ltr">LTR</option>
                </select>
              </label>
            </div>
          </details>

          <label className="space-y-2 text-sm font-semibold">
            <span>المحتوى</span>
            <textarea
              aria-label="محتوى المسودة"
              value={editor.content}
              onChange={(event) => updateEditor({ content: event.target.value })}
              maxLength={100000}
              rows={24}
              readOnly={!canEdit}
              dir={editor.direction}
              className="w-full resize-y rounded-3xl border border-input bg-background px-5 py-4 text-sm font-normal leading-8 outline-none focus-visible:ring-2 focus-visible:ring-primary read-only:cursor-default read-only:bg-secondary/35"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted-foreground">
            {editor.content.length.toLocaleString("ar-IQ")} / 100,000 · Ctrl/Cmd+S
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void copyEditor()}
            >
              <Clipboard className="h-4 w-4" aria-hidden="true" />
              {copyState === "copied"
                ? "نُسخ"
                : copyState === "failed"
                  ? "فشل النسخ"
                  : "نسخ"}
            </Button>
            {canEdit && (
              <Button
                type="button"
                className="rounded-full"
                disabled={!dirty || isSaving}
                onClick={() => void saveDraft()}
              >
                {isSaving ? (
                  <RefreshCw
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Save className="h-4 w-4" aria-hidden="true" />
                )}
                حفظ إصدار
              </Button>
            )}
          </div>
        </div>

        {saveError && (
          <p className="mt-3 text-sm leading-7 text-destructive" role="alert">
            {saveError}
          </p>
        )}
      </section>
    </main>
  );
}
