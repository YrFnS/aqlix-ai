"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Archive, ArrowRight, MessageSquareText, Search } from "lucide-react";
import type { ConversationSummary } from "@iraqi-ai/types";
import { cn } from "@/lib/utils";

function formatTimestamp(value: string | null): string {
  if (!value) return "لا توجد رسائل";

  return new Intl.DateTimeFormat("ar-IQ", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ConversationSwitcher({
  workspaceId,
  currentConversationId,
  conversations,
}: {
  workspaceId: string;
  currentConversationId: string;
  conversations: ConversationSummary[];
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    if (!normalized) return conversations;

    return conversations.filter((conversation) =>
      conversation.title.toLocaleLowerCase("ar").includes(normalized),
    );
  }, [conversations, query]);

  return (
    <div className="flex min-h-full flex-col p-3">
      <div className="px-1 pb-3">
        <p className="text-xs font-semibold text-primary">سجل المساحة</p>
        <h2 className="mt-1 font-arabic-heading text-lg font-semibold">
          المحادثات
        </h2>
      </div>

      <label className="relative block">
        <span className="sr-only">البحث في المحادثات</span>
        <Search
          className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          dir="auto"
          placeholder="ابحث في العناوين…"
          className="min-h-11 w-full rounded-xl border border-line/80 bg-surface-raised px-3 pe-10 text-sm outline-none transition-[border-color,box-shadow] duration-fast placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
        />
      </label>

      <div className="mt-3 min-h-0 flex-1 space-y-1">
        {filtered.length > 0 ? (
          filtered.map((conversation) => {
            const active = conversation.id === currentConversationId;
            return (
              <Link
                key={conversation.id}
                href={`/workspaces/${workspaceId}/conversations/${conversation.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group block rounded-xl border px-3 py-3 outline-none transition-[border-color,background-color,box-shadow] duration-fast focus-visible:ring-4 focus-visible:ring-ring/20",
                  active
                    ? "border-primary/25 bg-brand-soft/65 shadow-surface-xs"
                    : "border-transparent hover:border-line/80 hover:bg-surface-raised",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-sunken text-primary",
                    )}
                  >
                    <MessageSquareText
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      dir="auto"
                      className="block truncate text-sm font-semibold text-foreground"
                    >
                      {conversation.title}
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2 text-[0.68rem] text-ink-muted">
                      <span>{conversation.messageCount} رسالة</span>
                      <time dateTime={conversation.lastMessageAt ?? conversation.updatedAt}>
                        {formatTimestamp(
                          conversation.lastMessageAt ?? conversation.updatedAt,
                        )}
                      </time>
                    </span>
                    {conversation.status === "archived" ? (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2 py-0.5 text-[0.65rem] font-semibold text-ink-muted">
                        <Archive className="h-3 w-3" aria-hidden="true" />
                        مؤرشفة
                      </span>
                    ) : null}
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-line p-4 text-center text-xs leading-6 text-ink-muted">
            لا توجد محادثة تطابق البحث.
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1 border-t border-line/70 pt-3">
        <Link
          href={`/workspaces/${workspaceId}/conversations#new-conversation`}
          className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm font-semibold text-primary outline-none transition-colors hover:bg-brand-soft focus-visible:ring-4 focus-visible:ring-ring/20"
        >
          محادثة جديدة
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href={`/workspaces/${workspaceId}/conversations/archived`}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted outline-none transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/20"
        >
          <Archive className="h-4 w-4" aria-hidden="true" />
          أرشيف المحادثات
        </Link>
      </div>
    </div>
  );
}
