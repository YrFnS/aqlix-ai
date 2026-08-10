import Link from "next/link";
import {
  Archive,
  ArrowUpLeft,
  FileClock,
  GitBranch,
  Quote,
} from "lucide-react";
import type { Draft } from "@iraqi-ai/types";
import { MotionSurface } from "@/components/motion/motion-primitives";
import { Surface } from "@/components/ui/surface";

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
    <MotionSurface className="h-full">
      <Link
        href={`/workspaces/${draft.workspaceId}/drafts/${draft.id}`}
        className="group block h-full rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
        aria-label={`فتح المسودة ${draft.title}`}
      >
        <Surface
          tone="raised"
          elevation="xs"
          radius="2xl"
          padding="md"
          className="flex h-full flex-col transition-[border-color,box-shadow] duration-base ease-standard group-hover:border-primary/25 group-hover:shadow-surface-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
                  {kindLabels[draft.kind]}
                </span>
                {draft.status === "archived" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2.5 py-1 text-[0.68rem] font-semibold text-ink-muted">
                    <Archive className="h-3 w-3" aria-hidden="true" />
                    مؤرشفة
                  </span>
                ) : null}
              </div>
              <h2
                dir="auto"
                className="mt-4 line-clamp-2 break-words font-arabic-heading text-xl font-semibold"
              >
                {draft.title}
              </h2>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-surface-sunken text-primary">
              <FileClock className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <p
            dir="auto"
            className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-ink-muted"
          >
            {preview(draft.content) || "مسودة محفوظة بلا محتوى بعد."}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-surface-sunken/70 p-3">
              <dt className="flex items-center gap-1.5 text-ink-subtle">
                <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                الإصدارات
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {draft.versionCount.toLocaleString("ar-IQ")}
              </dd>
            </div>
            <div className="rounded-xl bg-surface-sunken/70 p-3">
              <dt className="flex items-center gap-1.5 text-ink-subtle">
                <Quote className="h-3.5 w-3.5" aria-hidden="true" />
                المراجع
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {draft.provenanceCount.toLocaleString("ar-IQ")}
              </dd>
            </div>
          </dl>

          <time
            dateTime={draft.lastSavedAt}
            className="mt-4 block text-xs leading-6 text-ink-muted"
          >
            آخر حفظ: {formatTimestamp(draft.lastSavedAt)}
          </time>

          <span className="mt-auto flex items-center justify-between border-t border-line/70 pt-4 text-sm font-semibold text-primary">
            فتح مساحة التحرير
            <ArrowUpLeft
              className="h-4 w-4 transition-transform duration-fast group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </Surface>
      </Link>
    </MotionSurface>
  );
}
