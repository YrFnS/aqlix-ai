import Link from "next/link";
import {
  Archive,
  ArrowUpLeft,
  FileClock,
  GitBranch,
  Quote,
} from "lucide-react";
import type { Draft } from "@iraqi-ai/types";

const kindLabels: Record<Draft["kind"], string> = {
  freeform: "مسودة حرة",
  summary: "ملخص",
  comparison: "مقارنة",
  email: "رسالة",
  memo: "مذكرة",
  checklist: "قائمة عمل",
  decision_note: "ملاحظة قرار",
};

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function preview(value: string): string {
  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized.length <= 190
    ? normalized
    : `${normalized.slice(0, 187).trimEnd()}…`;
}

export function DraftCard({ draft }: { draft: Draft }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
              {kindLabels[draft.kind]}
            </span>
            {draft.status === "archived" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] text-muted-foreground">
                <Archive className="h-3 w-3" aria-hidden="true" />
                مؤرشفة
              </span>
            )}
          </div>
          <h2
            dir="auto"
            className="mt-4 break-words font-arabic-heading text-xl font-semibold"
          >
            {draft.title}
          </h2>
        </div>
        <div className="rounded-2xl bg-secondary p-3 text-primary">
          <FileClock className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <p
        dir="auto"
        className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground"
      >
        {preview(draft.content) || "مسودة محفوظة بلا محتوى بعد."}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            الإصدارات
          </dt>
          <dd className="mt-1 font-semibold text-foreground">
            {draft.versionCount}
          </dd>
        </div>
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt className="flex items-center gap-1.5">
            <Quote className="h-3.5 w-3.5" aria-hidden="true" />
            المراجع
          </dt>
          <dd className="mt-1 font-semibold text-foreground">
            {draft.provenanceCount}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        آخر حفظ: {formatTimestamp(draft.lastSavedAt)}
      </p>

      <Link
        href={`/workspaces/${draft.workspaceId}/drafts/${draft.id}`}
        className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 border-t border-border/70 pt-5 text-sm font-semibold text-primary"
      >
        فتح المسودة
        <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
