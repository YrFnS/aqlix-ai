"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import type { ConversationMessage, DraftKind } from "@iraqi-ai/types";
import { conversationMessageSchema } from "@iraqi-ai/types";
import { ActivityOrb } from "@/components/conversations/activity-orb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssistantMessageOption {
  id: string;
  sequence: number;
  content: string;
  citationCount: number;
}

const kindOptions: Array<{
  value: Exclude<DraftKind, "freeform">;
  label: string;
}> = [
  { value: "summary", label: "ملخص" },
  { value: "comparison", label: "مقارنة" },
  { value: "email", label: "رسالة بريد" },
  { value: "memo", label: "مذكرة" },
  { value: "checklist", label: "قائمة عمل" },
  { value: "decision_note", label: "ملاحظة قرار" },
];

const fieldClassName =
  "min-h-11 w-full rounded-xl border border-input bg-surface-raised px-3 text-sm font-normal outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20";

function preview(value: string): string {
  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized.length <= 76
    ? normalized
    : `${normalized.slice(0, 73).trimEnd()}…`;
}

function reusableMessagesFrom(
  messages: ConversationMessage[],
): AssistantMessageOption[] {
  return messages
    .filter(
      (message) => message.role === "assistant" && message.status === "complete",
    )
    .map((message) => ({
      id: message.id,
      sequence: message.sequence,
      content: message.content,
      citationCount: message.citations.length,
    }));
}

export function DraftFromConversationPanel({
  workspaceId,
  conversationId,
  messages,
  canWrite,
  compact = false,
}: {
  workspaceId: string;
  conversationId: string;
  messages: AssistantMessageOption[];
  canWrite: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [availableMessages, setAvailableMessages] = useState(messages);
  const orderedMessages = useMemo(
    () =>
      [...availableMessages].sort(
        (left, right) => right.sequence - left.sequence,
      ),
    [availableMessages],
  );
  const [messageId, setMessageId] = useState(orderedMessages[0]?.id ?? "");
  const [kind, setKind] = useState<Exclude<DraftKind, "freeform">>("summary");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAvailableMessages(messages);
  }, [messages]);

  useEffect(() => {
    setMessageId((current) => {
      if (orderedMessages.some((message) => message.id === current)) {
        return current;
      }
      return orderedMessages[0]?.id ?? "";
    });
  }, [orderedMessages]);

  useEffect(() => {
    if (availableMessages.length > 0) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const loadPersistedMessages = async () => {
      try {
        const response = await fetch(
          `/api/v1/workspaces/${workspaceId}/conversations/${conversationId}`,
          { cache: "no-store" },
        );
        const payload = (await response.json()) as {
          ok?: boolean;
          data?: { messages?: unknown };
        };

        if (response.ok && payload.ok) {
          const parsed = conversationMessageSchema.array().safeParse(
            payload.data?.messages,
          );
          if (parsed.success) {
            const completed = reusableMessagesFrom(parsed.data);
            if (!cancelled && completed.length > 0) {
              setAvailableMessages(completed);
              return;
            }
          }
        }
      } catch {
        // The conversation surface owns visible request failures. This helper
        // only waits for the first persisted assistant answer.
      }

      if (!cancelled) {
        timer = setTimeout(() => void loadPersistedMessages(), 750);
      }
    };

    void loadPersistedMessages();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [availableMessages.length, conversationId, workspaceId]);

  const containerClassName = cn(
    compact
      ? "p-4 sm:p-5"
      : "rounded-2xl border border-primary/25 bg-surface-raised p-5 shadow-surface-xs sm:p-6",
  );

  if (availableMessages.length === 0) {
    return (
      <section className={containerClassName} data-slot="draft-from-conversation">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-brand-soft p-2 text-primary">
            <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-primary">تحويل إلى مسودة</p>
            <h2 className="mt-1 text-sm font-semibold">بانتظار إجابة مكتملة</h2>
            <p className="mt-2 text-xs leading-6 text-ink-muted">
              بعد اكتمال إجابة المساعد يمكنك تحويلها إلى عمل قابل للتحرير مع حفظ
              المراجع كمنشأ للمسودة.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!canWrite) {
    return (
      <section className={containerClassName} data-slot="draft-from-conversation">
        <p className="text-xs font-semibold text-primary">تحويل إلى مسودة</p>
        <h2 className="mt-1 text-sm font-semibold">النتائج متاحة للمراجعة</h2>
        <p className="mt-2 text-xs leading-6 text-ink-muted">
          إنشاء مسودة قابلة للتحرير يحتاج دور المحرر أو المالك.
        </p>
      </section>
    );
  }

  const createDraft = async () => {
    if (!messageId || isCreating) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/workspaces/${workspaceId}/drafts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, messageId, kind }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { detail?: { draft?: { id?: string } } };
        error?: { message?: string };
      };

      if (!response.ok || payload.ok !== true) {
        throw new Error(
          payload.error?.message || "The reusable draft could not be created.",
        );
      }

      const draftId = payload.data?.detail?.draft?.id;
      if (!draftId) {
        throw new Error("The created draft identity is missing.");
      }

      router.push(`/workspaces/${workspaceId}/drafts/${draftId}?status=created`);
      router.refresh();
    } catch (creationError) {
      setError(
        creationError instanceof Error
          ? creationError.message
          : "تعذر إنشاء المسودة / Draft creation failed.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className={containerClassName} data-slot="draft-from-conversation">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-brand-soft p-2 text-primary">
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold text-primary">تحويل إلى مسودة</p>
          <h2 className="mt-1 text-sm font-semibold">ابدأ من إجابة محفوظة</h2>
          <p className="mt-2 text-xs leading-6 text-ink-muted">
            لا يجري هذا الإجراء اتصالاً إضافياً بالمزوّد، ويحتفظ بمنشأ الإجابة
            ومراجعها.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block space-y-1.5 text-xs font-semibold">
          <span>إجابة المساعد</span>
          <select
            value={messageId}
            onChange={(event) => setMessageId(event.target.value)}
            className={fieldClassName}
          >
            {orderedMessages.map((message) => (
              <option key={message.id} value={message.id}>
                #{message.sequence} · {preview(message.content)} · {message.citationCount} refs
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5 text-xs font-semibold">
          <span>نوع البداية</span>
          <select
            value={kind}
            onChange={(event) =>
              setKind(
                event.target.value as Exclude<DraftKind, "freeform">,
              )
            }
            className={fieldClassName}
          >
            {kindOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button
          type="button"
          className="w-full rounded-xl"
          disabled={isCreating || !messageId}
          onClick={() => void createDraft()}
        >
          {isCreating ? (
            <ActivityOrb state="shaping" size="sm" className="border-white/20 bg-white/10" />
          ) : (
            <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          )}
          {isCreating ? "جاري إنشاء المسودة…" : "إنشاء المسودة"}
        </Button>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-6 text-destructive"
        >
          {error}
        </div>
      ) : null}
    </section>
  );
}
