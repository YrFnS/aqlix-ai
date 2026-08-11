"use client";

import Link from "next/link";
import { ExternalLink, FileClock, RotateCcw } from "lucide-react";
import { ActivityOrb } from "@/components/conversations/activity-orb";
import { Button } from "@/components/ui/button";
import { DraftAssistantPanel } from "./draft-assistant-panel";
import {
  DraftEditorProvider,
  type DraftEditorProps,
  useDraftEditorContext,
} from "./draft-editor-context";
import { DraftEditorMain } from "./draft-editor-main";
import { DraftToolsPanel } from "./draft-tools-panel";
import { DraftWorkspaceFrame } from "./draft-workspace-frame";

// The workbench keeps accepted writing and AI proposal review as separate modes.
type ViewMode = "editor" | "proposal";

function DraftVersionSidebar() {
  const {
    workspaceId,
    detail,
    canEdit,
    dirty,
    isSaving,
    restoreVersion,
  } = useDraftEditorContext();

  return (
    <div className="space-y-2 p-3">
      <div className="px-2 pb-2">
        <p className="text-xs font-semibold text-primary">سجل الإصدارات</p>
        <p className="mt-1 text-xs leading-6 text-ink-muted">
          كل حفظ مهم يضيف لقطة جديدة بدلاً من استبدال التاريخ.
        </p>
      </div>
      {detail.versions.map((version) => (
        <article
          key={version.id}
          className="rounded-xl border border-line/75 bg-surface-raised p-3 shadow-surface-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-brand-soft px-2 py-1 text-[0.68rem] font-semibold text-primary">
              v{version.versionNumber}
            </span>
            <span className="text-[0.68rem] text-ink-subtle">
              {version.sourceKind}
            </span>
          </div>
          <p dir="auto" className="mt-2 line-clamp-2 text-xs font-semibold">
            {version.title}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-lg">
              <Link
                href={`/workspaces/${workspaceId}/drafts/${detail.draft.id}/versions/${version.versionNumber}`}
              >
                فتح
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
            {canEdit && version.versionNumber !== detail.draft.currentVersion ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={dirty || isSaving}
                onClick={() => void restoreVersion(version.versionNumber)}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                استعادة
              </Button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function DraftEditorWorkspace() {
  const {
    workspaceId,
    detail,
    notice,
    proposal,
    isGenerating,
  } = useDraftEditorContext();
  const viewMode: ViewMode = proposal ? "proposal" : "editor";

  return (
    <div className="space-y-4" data-view-mode={viewMode}>
      <span className="sr-only">
        العمل المقبول منفصل عن المقترح. يمكنك تطبيق كإصدار جديد أو رفض الاقتراح.
        استخدم Ctrl/Cmd+S للحفظ.
      </span>

      {notice ? (
        <div
          role={notice.tone === "error" ? "alert" : "status"}
          className={`rounded-xl border px-4 py-3 text-sm leading-7 ${
            notice.tone === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : notice.tone === "success"
                ? "border-primary/30 bg-brand-soft text-foreground"
                : "border-line bg-surface-sunken text-ink-muted"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <DraftWorkspaceFrame
        title={detail.draft.title}
        subtitle={`الإصدار ${detail.draft.currentVersion} · ${detail.draft.provenanceCount} مرجع · Ctrl/Cmd+S`}
        status={detail.draft.status}
        backHref={`/workspaces/${workspaceId}/drafts${
          detail.draft.status === "archived" ? "/archived" : ""
        }`}
        toolbar={
          isGenerating ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <ActivityOrb state="shaping" size="sm" />
              تشكيل المقترح
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-surface-sunken px-3 py-1.5 text-xs text-ink-muted">
              <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
              {detail.draft.status === "archived" ? "مؤرشفة" : "مسودة نشطة"}
            </span>
          )
        }
        versions={<DraftVersionSidebar />}
        inspector={<DraftToolsPanel />}
      >
        <div className="grid min-h-0 gap-4 overflow-y-auto p-3 sm:p-4 min-[1800px]:grid-cols-[minmax(0,1fr)_23rem] min-[1800px]:items-start">
          <DraftEditorMain />
          <aside className="space-y-4 min-[1800px]:sticky min-[1800px]:top-0">
            <DraftAssistantPanel />
          </aside>
        </div>
      </DraftWorkspaceFrame>
    </div>
  );
}

export function DraftEditor(props: DraftEditorProps) {
  return (
    <DraftEditorProvider {...props}>
      <DraftEditorWorkspace />
    </DraftEditorProvider>
  );
}
