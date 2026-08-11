"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Clipboard,
  ExternalLink,
  FileClock,
  GitBranch,
  RefreshCw,
  RotateCcw,
  Save,
} from "lucide-react";
import type { DraftDetail, DraftKind } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { useDraftEditorContext } from "./draft-editor-context";
import { formatTimestamp, kindOptions } from "./draft-editor-utils";

function DraftVersionCard({
  version,
}: {
  version: DraftDetail["versions"][number];
}) {
  const {
    workspaceId,
    detail,
    canEdit,
    dirty,
    isSaving,
    restoreVersion,
  } = useDraftEditorContext();

  return (
    <article className="rounded-2xl border border-border/70 bg-background p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              v{version.versionNumber}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              {version.sourceKind}
            </span>
            {version.versionNumber === detail.draft.currentVersion && (
              <span className="text-xs font-semibold text-foreground">
                الحالي
              </span>
            )}
          </div>
          <p dir="auto" className="mt-3 truncate font-semibold">
            {version.title}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">
            {version.content.replace(/\s+/gu, " ") || "Empty snapshot"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatTimestamp(version.createdAt)}
            {version.restoredFromVersion
              ? ` · restored from v${version.restoredFromVersion}`
              : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/workspaces/${workspaceId}/drafts/${detail.draft.id}/versions/${version.versionNumber}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-secondary"
          >
            عرض اللقطة
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          {canEdit && version.versionNumber !== detail.draft.currentVersion && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={dirty || isSaving}
              onClick={() => void restoreVersion(version.versionNumber)}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              استعادة
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function DraftEditorMain() {
  const {
    detail,
    editor,
    canEdit,
    dirty,
    visibleVersions,
    olderVersions,
    saveState,
    isSaving,
    saveError,
    copyState,
    updateEditor,
    saveDraft,
    copyEditor,
  } = useDraftEditorContext();

  return (
    <main className="min-w-0 space-y-5">
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

      <section className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary">سجل النسخ</p>
            <h2 className="mt-1 font-arabic-heading text-xl font-semibold">
              أحدث الإصدارات
            </h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              تظهر أحدث ثلاث لقطات أولاً، وتبقى النسخ الأقدم متاحة عند الحاجة.
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-2.5 text-primary">
            <GitBranch className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {visibleVersions.map((version) => (
            <DraftVersionCard key={version.id} version={version} />
          ))}
        </div>

        {olderVersions.length > 0 && (
          <details className="group mt-3 rounded-2xl border border-border/70 bg-secondary/20">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
              عرض الإصدارات الأقدم
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {olderVersions.length}
                <ChevronDown
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </span>
            </summary>
            <div className="space-y-3 border-t border-border/70 p-3">
              {olderVersions.map((version) => (
                <DraftVersionCard key={version.id} version={version} />
              ))}
            </div>
          </details>
        )}
      </section>
    </main>
  );
}
