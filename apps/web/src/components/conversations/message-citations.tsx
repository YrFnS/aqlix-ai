import Link from "next/link";
import { ExternalLink, FileWarning, Quote } from "lucide-react";
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
}: {
  workspaceId: string;
  citations: MessageCitation[];
}) {
  if (citations.length === 0) return null;

  return (
    <div className="mt-4 border-t border-border/70 pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <Quote className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        المقاطع الداعمة المحفوظة
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {citations.map((citation) => {
          const content = (
            <>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-primary">
                [{citation.label}]
              </span>
              <span dir="auto" className="max-w-48 truncate font-semibold">
                {citation.fileNameSnapshot}
              </span>
              <span className="text-muted-foreground">
                {citationLocator(citation)}
              </span>
            </>
          );

          if (citation.sourceId && citation.attachmentId) {
            return (
              <Link
                key={citation.id}
                href={`/workspaces/${workspaceId}/sources/${citation.attachmentId}#source-${citation.sourceId}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-xs transition-colors hover:border-primary/40 hover:bg-secondary"
                aria-label={`فتح المرجع ${citation.label} من ${citation.fileNameSnapshot}`}
              >
                {content}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            );
          }

          return (
            <div
              key={citation.id}
              className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/45 px-3 py-2 text-xs"
              title="The original source was deleted or is no longer available."
            >
              {content}
              <FileWarning
                className="h-3.5 w-3.5 text-muted-foreground"
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
