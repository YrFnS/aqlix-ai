"use client";

import {
  Check,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import type { DraftGenerationAction } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { useDraftEditorContext } from "./draft-editor-context";
import { actionOptions, generationLabel } from "./draft-editor-utils";

export function DraftAssistantPanel() {
  const {
    canEdit,
    workspaceArchived,
    draftArchived,
    dirty,
    action,
    instruction,
    proposal,
    proposalText,
    isGenerating,
    proposalError,
    selectAction,
    setInstruction,
    startProposal,
    stopProposal,
    applyProposal,
    discardProposal,
  } = useDraftEditorContext();

  return (
    <section className="rounded-3xl border border-primary/25 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary">مساعد الكتابة</p>
          <h2 className="mt-1 font-arabic-heading text-xl font-semibold">
            اقترح، راجع، ثم طبّق
          </h2>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            يبقى الاقتراح منفصلاً عن النص المقبول حتى تختار تطبيقه كإصدار جديد.
          </p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {canEdit ? (
        <div className="mt-5 space-y-4">
          <label className="space-y-2 text-sm font-semibold">
            <span>الإجراء</span>
            <select
              aria-label="إجراء اقتراح المسودة"
              value={action}
              disabled={isGenerating}
              onChange={(event) =>
                selectAction(event.target.value as DraftGenerationAction)
              }
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold">
            <span>التعليمات</span>
            <textarea
              aria-label="تعليمات اقتراح المسودة"
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              maxLength={2000}
              rows={5}
              disabled={isGenerating}
              dir="auto"
              className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm font-normal leading-7 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>

          {isGenerating ? (
            <Button
              type="button"
              variant="destructive"
              className="w-full rounded-full"
              onClick={stopProposal}
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              إيقاف وحفظ الجزئي
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full rounded-full"
              disabled={!instruction.trim() || dirty}
              onClick={() => void startProposal()}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              بدء اقتراح
            </Button>
          )}

          {proposalError && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
            >
              {proposalError}
            </div>
          )}

          <div className="rounded-3xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-primary">
                  مراجعة الاقتراح
                </p>
                <h3 className="mt-1 font-arabic-heading text-lg font-semibold">
                  {proposal ? generationLabel(proposal.status) : "لا يوجد اقتراح"}
                </h3>
              </div>
              {proposal && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  base v{proposal.baseVersion}
                </span>
              )}
            </div>

            {proposalText ? (
              <pre
                dir="auto"
                className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-secondary/35 p-4 font-sans text-sm leading-7"
              >
                {proposalText}
              </pre>
            ) : (
              <div className="mt-4 flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 p-5 text-center text-xs leading-6 text-muted-foreground">
                سيظهر الاقتراح هنا من دون تغيير النص المقبول.
              </div>
            )}

            {proposal?.status === "complete" && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <Button
                  type="button"
                  className="rounded-full"
                  disabled={dirty}
                  onClick={() => void applyProposal()}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  تطبيق كإصدار جديد
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => void discardProposal()}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  رفض الاقتراح
                </Button>
              </div>
            )}

            {proposal && (
              <p className="mt-3 truncate text-xs leading-6 text-muted-foreground">
                {proposal.returnedModel ?? proposal.requestedModel}
                {proposal.totalTokens !== null
                  ? ` · ${proposal.totalTokens} tokens`
                  : ""}
                {proposal.latencyMs !== null
                  ? ` · ${(proposal.latencyMs / 1000).toFixed(1)}s`
                  : ""}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-secondary/55 p-4 text-sm leading-7 text-muted-foreground">
          {workspaceArchived
            ? "مساحة العمل مؤرشفة؛ الاقتراحات للقراءة فقط حتى استعادة المساحة."
            : draftArchived
              ? "استعد المسودة قبل طلب اقتراح جديد."
              : "عضوية القراءة لا تسمح بإرسال المسودة إلى المزود."}
        </div>
      )}
    </section>
  );
}
