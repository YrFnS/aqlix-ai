import Link from "next/link";
import { ArrowRight, Archive, MessageSquareText } from "lucide-react";
import type { ConversationSummary } from "@iraqi-ai/types";
import { MotionSurface } from "@/components/motion/motion-primitives";
import { Surface } from "@/components/ui/surface";

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
  const lastActivity = conversation.lastMessageAt ?? conversation.updatedAt;

  return (
    <article>
      <MotionSurface>
        <Link
          href={`/workspaces/${conversation.workspaceId}/conversations/${conversation.id}`}
          className="group block rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label={`فتح المحادثة: ${conversation.title}`}
        >
          <Surface
            tone="raised"
            elevation="xs"
            radius="2xl"
            padding="md"
            className="grid gap-4 transition-[border-color,box-shadow] duration-base ease-standard group-hover:border-primary/30 group-hover:shadow-surface-md sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-primary">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </span>

            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <span
                  dir="auto"
                  className="truncate font-arabic-heading text-lg font-semibold text-foreground"
                >
                  {conversation.title}
                </span>
                {conversation.status === "archived" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2 py-0.5 text-[0.65rem] font-semibold text-ink-muted">
                    <Archive className="h-3 w-3" aria-hidden="true" />
                    مؤرشفة
                  </span>
                ) : null}
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                <span>{conversation.messageCount} رسالة</span>
                <time dateTime={lastActivity}>
                  آخر نشاط: {formatTimestamp(lastActivity)}
                </time>
              </span>
            </span>

            <span className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary sm:justify-self-end">
              فتح
              <ArrowRight
                className="h-4 w-4 transition-transform duration-fast group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Surface>
        </Link>
      </MotionSurface>
    </article>
  );
}
