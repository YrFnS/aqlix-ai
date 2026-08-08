"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2, RefreshCw } from "lucide-react";
import type { DraftKind } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";

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

function preview(value: string): string {
  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized.length <= 90
    ? normalized
    : `${normalized.slice(0, 87).trimEnd()}…`;
}

export function DraftFromConversationPanel({
  workspaceId,
  conversationId,
  messages,
  canWrite,
}: {
  workspaceId: string;
  conversationId: string;
  messages: AssistantMessageOption[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const orderedMessages = useMemo(
    () => [...messages].sort((left, right) => right.sequence - left.sequence),
    [messages],
  );
  const [messageId, setMessageId] = useState(orderedMessages[0]?.id ?? "");
  const [kind, setKind] = useState<Exclude<DraftKind, "freeform">>("summary");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessageId((current) => {
      if (orderedMessages.some((message) => message.id === current)) {
        return current;
      }
      return orderedMessages[0]?.id ?? "";
    });
  }, [orderedMessages]);

  if (messages.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-border bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">P4 · Draft</p>
        <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
          لا توجد إجابة مكتملة بعد
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          أكمل إجابة مساعد أولاً، ثم حوّلها إلى ملخص أو مقارنة أو رسالة أو مذكرة
          أو قائمة عمل أو ملاحظة قرار.
        </p>
      </section>
    );
  }

  if (!canWrite) {
    return (
      <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">P4 · Draft</p>
        <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
          نتائج قابلة للمراجعة
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          عضويتك للقراءة فقط. إنشاء مسودة قابلة للتحرير يحتاج دور المحرر أو
          المالك.
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
    <section className="rounded-3xl border border-primary/25 bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            P4 · Ask → Ground → Draft
          </p>
          <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
            حوّل إجابة محفوظة إلى عمل قابل للتحرير
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            الهيكل الأولي حتمي ومرئي، ولا يجري اتصالاً إضافياً بالمزود. المراجع
            المحفوظة في الإجابة تُنسخ كلقطة منشأ للمسودة.
          </p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <FilePlus2 className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr_auto] lg:items-end">
        <label className="space-y-2 text-sm font-semibold">
          <span>إجابة المساعد</span>
          <select
            value={messageId}
            onChange={(event) => setMessageId(event.target.value)}
            className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {orderedMessages.map((message) => (
              <option key={message.id} value={message.id}>
                #{message.sequence} · {preview(message.content)} · {message.citationCount} refs
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold">
          <span>البداية</span>
          <select
            value={kind}
            onChange={(event) =>
              setKind(
                event.target.value as Exclude<DraftKind, "freeform">,
              )
            }
            className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          className="rounded-full px-6"
          disabled={isCreating || !messageId}
          onClick={() => void createDraft()}
        >
          {isCreating ? (
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          )}
          {isCreating ? "جاري الإنشاء…" : "إنشاء المسودة"}
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-7 text-destructive"
        >
          {error}
        </div>
      )}
    </section>
  );
}
