"use client";

import Link from "next/link";
import { FileSearch, FileWarning, Quote } from "lucide-react";
import type { MessageCitation } from "@iraqi-ai/types";

function citationLocator(citation: MessageCitation): string {
  if (citation.pageNumberSnapshot) {
    return `صفحة ${citation.pageNumberSnapshot}`;
  }
  if (citation.startLineSnapshot && citation.endLineSnapshot) {
    return `الأسطر ${citation.startLineSnapshot}–${citation.endLineSnapshot}`;
  }
  return `المقطع ${citation.sourceOrdinalSnapshot + 1}`;
}

export function MessageCitations({
  workspaceId,
  citations,
  onInspect,
}: {
  workspaceId: string;
  citations: MessageCitation[];
  onInspect?: (citation: MessageCitation) => void;
}) {
  if (citations.length === 0) return null;

  return (
    <div className="mt-4 border-t border-line/70 pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <Quote className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        المراجع المحفوظة
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {citations.map((citation) => {
          const content = (
            <>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-primary">
                [{citation.label}]
              </span>
              <span dir="auto" className="max-w-44 truncate font-semibold">
                {citation.fileNameSnapshot}
              </span>
              <span className="text-ink-muted">{citationLocator(citation)}</span>
            </>
          );

          if (citation.sourceId && citation.attachmentId) {
            const className =
              "inline-flex min-h-10 items-center gap-2 rounded-xl border border-line/80 bg-surface-raised px-3 py-2 text-xs outline-none transition-[border-color,background-color,box-shadow] duration-fast hover:border-primary/35 hover:bg-brand-soft/45 focus-visible:ring-4 focus-visible:ring-ring/20";

            if (onInspect) {
              return (
                <button
                  key={citation.id}
                  type="button"
                  className={className}
                  onClick={() => onInspect(citation)}
                  aria-label={`معاينة المرجع ${citation.label} من ${citation.fileNameSnapshot}`}
                >
                  {content}
                  <FileSearch className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              );
            }

            return (
              <Link
                key={citation.id}
                href={`/workspaces/${workspaceId}/sources/${citation.attachmentId}#source-${citation.sourceId}`}
                className={className}
                aria-label={`فتح المرجع ${citation.label} من ${citation.fileNameSnapshot}`}
              >
                {content}
                <FileSearch className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            );
          }

          return (
            <div
              key={citation.id}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-line bg-surface-sunken px-3 py-2 text-xs"
              title="The original source was deleted or is no longer available."
            >
              {content}
              <FileWarning
                className="h-3.5 w-3.5 text-ink-muted"
                aria-hidden="true"
              />
              <span className="sr-only">المصدر الأصلي غير متاح</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
