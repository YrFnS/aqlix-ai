import Link from "next/link";
import { ArrowUpLeft, Archive, MessageSquareText } from "lucide-react";
import type { ConversationSummary } from "@iraqi-ai/types";

function formatTimestamp(value: string | null): string {
  if (!value) return "لا توجد رسائل بعد";

  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ConversationCard({
  conversation,
}: {
  conversation: ConversationSummary;
}) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-5 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary">
              {conversation.messageCount} رسالة
            </span>
            {conversation.status === "archived" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[0.65rem] font-semibold text-muted-foreground">
                <Archive className="h-3 w-3" aria-hidden="true" />
                مؤرشفة
              </span>
            )}
          </div>
          <h2
            dir="auto"
            className="mt-4 truncate font-arabic-heading text-xl font-semibold"
          >
            {conversation.title}
          </h2>
        </div>
        <div className="rounded-2xl bg-secondary p-3 text-primary">
          <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        آخر نشاط: {formatTimestamp(conversation.lastMessageAt ?? conversation.updatedAt)}
      </p>

      <div className="mt-auto border-t border-border/70 pt-4">
        <Link
          href={`/workspaces/${conversation.workspaceId}/conversations/${conversation.id}`}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          فتح المحادثة
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
