"use client";

import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  ChevronDown,
  Download,
  ExternalLink,
  FileWarning,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDraftEditorContext } from "./draft-editor-context";
import { DisclosureSummary } from "./draft-editor-disclosure";
import { formatTimestamp, provenanceLocator } from "./draft-editor-utils";

export function DraftToolsPanel() {
  const {
    workspaceId,
    detail,
    canManageLifecycle,
    dirty,
    draftArchived,
    isGenerating,
    download,
    setArchived,
    removeDraft,
  } = useDraftEditorContext();

  return (
    <div className="space-y-4">
      <details className="group rounded-3xl border border-border/70 bg-card">
        <DisclosureSummary
          title="المحادثة والمصادر"
          description="افتح الأصل أو راجع المراجع المرتبطة"
          count={detail.provenance.length}
        />
        <div className="border-t border-border/70 p-4">
          {detail.draft.conversationId && (
            <Link
              href={`/workspaces/${workspaceId}/conversations/${detail.draft.conversationId}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              فتح المحادثة الأصلية
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}

          {detail.provenance.length > 0 ? (
            <div className="mt-4 space-y-2">
              {detail.provenance.map((provenance) => {
                const body = (
                  <>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-primary">
                      [{provenance.label}]
                    </span>
                    <span dir="auto" className="min-w-0 flex-1 truncate">
                      {provenance.fileNameSnapshot}
                    </span>
                    <span className="text-muted-foreground">
                      {provenanceLocator(provenance)}
                    </span>
                  </>
                );

                return provenance.sourceId && provenance.attachmentId ? (
                  <Link
                    key={provenance.id}
                    href={`/workspaces/${workspaceId}/sources/${provenance.attachmentId}#source-${provenance.sourceId}`}
                    className="flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-xs transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    {body}
                    <ExternalLink
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                ) : (
                  <div
                    key={provenance.id}
                    className="flex min-h-11 items-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/45 px-3 py-2 text-xs"
                    title="The original source is no longer available."
                  >
                    {body}
                    <FileWarning
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              أُنشئت هذه المسودة من إجابة بلا مراجع محفوظة. لا تُعرض على أنها
              موثقة تلقائياً.
            </p>
          )}
        </div>
      </details>

      <details className="group rounded-3xl border border-border/70 bg-card">
        <DisclosureSummary
          title="تصدير النسخة المحفوظة"
          description="TXT أو Markdown أو HTML"
        />
        <div className="border-t border-border/70 p-4">
          <p className="text-xs leading-6 text-muted-foreground">
            يستخدم التصدير آخر إصدار محفوظ. PDF وDOCX غير مفعّلين.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(["txt", "md", "html"] as const).map((format) => (
              <Button
                key={format}
                type="button"
                variant="outline"
                className="rounded-2xl px-2 uppercase"
                onClick={() => download(format)}
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                {format}
              </Button>
            ))}
          </div>
        </div>
      </details>

      <section className="rounded-3xl border border-border/70 bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:flex-col xl:items-stretch">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {draftArchived ? "مسودة مؤرشفة" : "مسودة نشطة"}
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              آخر حفظ {formatTimestamp(detail.draft.lastSavedAt)}
            </p>
          </div>
          {canManageLifecycle && (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              disabled={dirty || isGenerating}
              onClick={() => void setArchived(!draftArchived)}
            >
              {draftArchived ? (
                <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Archive className="h-4 w-4" aria-hidden="true" />
              )}
              {draftArchived ? "استعادة إلى العمل" : "نقل إلى الأرشيف"}
            </Button>
          )}
        </div>

        {canManageLifecycle ? (
          <details className="group mt-3 rounded-2xl border border-destructive/20 bg-destructive/5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-sm font-semibold text-destructive outline-none focus-visible:ring-2 focus-visible:ring-destructive [&::-webkit-details-marker]:hidden">
              حذف المسودة
              <ChevronDown
                className="h-4 w-4 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="border-t border-destructive/15 p-3">
              <p className="text-xs leading-6 text-muted-foreground">
                يحذف المسودة وكل إصداراتها ومحاولاتها، ولا يحذف المحادثة أو
                الملفات الأصلية.
              </p>
              <Button
                type="button"
                variant="destructive"
                className="mt-3 w-full rounded-full"
                disabled={dirty || isGenerating}
                onClick={() => void removeDraft()}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                حذف المسودة نهائياً
              </Button>
            </div>
          </details>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            لا تملك صلاحية تغيير حالة هذه المسودة.
          </p>
        )}
      </section>
    </div>
  );
}
