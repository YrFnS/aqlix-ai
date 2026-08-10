"use client";

import { DraftAssistantPanel } from "./draft-assistant-panel";
import {
  DraftEditorProvider,
  type DraftEditorProps,
  useDraftEditorContext,
} from "./draft-editor-context";
import { DraftEditorMain } from "./draft-editor-main";
import { DraftToolsPanel } from "./draft-tools-panel";

function DraftEditorWorkspace() {
  const { notice } = useDraftEditorContext();

  return (
    <div className="space-y-5">
      {notice && (
        <div
          role={notice.tone === "error" ? "alert" : "status"}
          className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${
            notice.tone === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : notice.tone === "success"
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-border bg-secondary/60 text-muted-foreground"
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
        <DraftEditorMain />
        <aside className="space-y-4 xl:sticky xl:top-6">
          <DraftAssistantPanel />
          <DraftToolsPanel />
        </aside>
      </div>
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
