"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Clock3,
  Cpu,
  FileSearch,
  Hash,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  UserRound,
} from "lucide-react";
import type {
  Conversation,
  ConversationMessage,
  ConversationStreamEvent,
  GroundingMode,
  MessageCitation,
} from "@iraqi-ai/types";
import {
  conversationMessageSchema,
  conversationStreamEventSchema,
} from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { ActivityOrb } from "./activity-orb";
import { CitationInspector } from "./citation-inspector";
import { MessageCitations } from "./message-citations";
import { MessageContent } from "./message-content";

interface ConversationShellProps {
  workspaceId: string;
  conversation: Conversation;
  initialMessages: ConversationMessage[];
  canWrite: boolean;
  readOnlyReason: "workspace-archived" | "membership";
}

type Notice = {
  tone: "error" | "info";
  message: string;
} | null;

const statusLabels = {
  pending: "بانتظار المزود",
  streaming: "جاري الكتابة",
  complete: "مكتملة",
  failed: "فشلت",
  cancelled: "أُلغيت",
} as const;

function mergeMessages(
  current: ConversationMessage[],
  additions: Array<ConversationMessage | null>,
): ConversationMessage[] {
  const byId = new Map(current.map((message) => [message.id, message]));

  for (const message of additions) {
    if (message) byId.set(message.id, message);
  }

  return Array.from(byId.values()).sort(
    (left, right) => left.sequence - right.sequence,
  );
}

function replaceMessage(
  current: ConversationMessage[],
  replacement: ConversationMessage,
): ConversationMessage[] {
  return mergeMessages(current, [replacement]);
}

async function parseEventStream(
  response: Response,
  onEvent: (event: ConversationStreamEvent) => void,
): Promise<void> {
  if (!response.body) throw new Error("The response stream is unavailable.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processFrame = (frame: string) => {
    const data = frame
      .split(/\r?\n/u)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    if (!data) return;

    let value: unknown;
    try {
      value = JSON.parse(data);
    } catch {
      throw new Error("The server returned an invalid stream event.");
    }

    const parsed = conversationStreamEventSchema.safeParse(value);
    if (!parsed.success) {
      throw new Error("The server returned an unsupported stream event.");
    }

    onEvent(parsed.data);
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const boundary = buffer.match(/\r?\n\r?\n/u);
        if (!boundary || boundary.index === undefined) break;

        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        processFrame(frame);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) processFrame(buffer);
  } finally {
    reader.releaseLock();
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-IQ").format(value);
}

function formatMessageTime(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function MessageTelemetry({ message }: { message: ConversationMessage }) {
  const generation = message.generation;
  if (!generation) return null;

  return (
    <details className="group mt-4 rounded-xl border border-line/70 bg-surface-sunken/55 text-xs">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 px-3 font-semibold text-ink-muted outline-none focus-visible:ring-4 focus-visible:ring-ring/20">
        <span className="inline-flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
          تفاصيل التوليد
        </span>
        <span className="text-[0.68rem] font-normal">
          {statusLabels[generation.status]}
        </span>
      </summary>
      <div className="flex flex-wrap gap-2 border-t border-line/70 p-3 text-[0.68rem] text-ink-muted">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2.5 py-1">
          <Cpu className="h-3 w-3" aria-hidden="true" />
          {generation.returnedModel ?? generation.requestedModel}
        </span>
        {generation.groundingMode === "workspace_sources" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-primary">
            <FileSearch className="h-3 w-3" aria-hidden="true" />
            {formatNumber(generation.citationCount)} مرجع من {formatNumber(
              generation.retrievedSourceCount,
            )} مقطع
          </span>
        ) : null}
        {generation.totalTokens !== null ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2.5 py-1">
            <Hash className="h-3 w-3" aria-hidden="true" />
            {formatNumber(generation.totalTokens)} token
          </span>
        ) : null}
        {generation.latencyMs !== null ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2.5 py-1">
            <Clock3 className="h-3 w-3" aria-hidden="true" />
            {(generation.latencyMs / 1000).toFixed(1)}s
          </span>
        ) : null}
      </div>
    </details>
  );
}

function MessageBubble({
  workspaceId,
  message,
  canRetry,
  onRetry,
  onInspectCitation,
  retryDisabled,
}: {
  workspaceId: string;
  message: ConversationMessage;
  canRetry: boolean;
  onRetry: (messageId: string) => void;
  onInspectCitation: (citation: MessageCitation) => void;
  retryDisabled: boolean;
}) {
  const isUser = message.role === "user";
  const isActive = message.status === "pending" || message.status === "streaming";
  const activityState =
    message.generation?.groundingMode === "workspace_sources" &&
    message.status === "pending"
      ? "searching"
      : "composing";

  if (isUser) {
    return (
      <article
        className="mx-auto flex w-full max-w-4xl justify-end gap-3"
        data-message-id={message.id}
      >
        <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-primary px-4 py-3 text-primary-foreground shadow-surface-xs sm:max-w-[75%] sm:px-5 sm:py-4">
          <MessageContent content={message.content} />
          <time
            dateTime={message.createdAt}
            className="mt-2 block text-[0.68rem] text-primary-foreground/65"
          >
            {formatMessageTime(message.createdAt)}
          </time>
        </div>
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
          <UserRound className="h-4 w-4" aria-hidden="true" />
        </div>
      </article>
    );
  }

  return (
    <article
      className="mx-auto grid w-full max-w-4xl grid-cols-[auto_minmax(0,1fr)] gap-3"
      data-message-id={message.id}
    >
      {isActive ? (
        <ActivityOrb state={activityState} size="sm" className="mt-1" />
      ) : (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-primary">
          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      )}

      <div
        className="min-w-0 rounded-2xl border border-transparent px-1 py-1 text-foreground"
        aria-live={isActive ? "polite" : undefined}
      >
        <div className="mb-2 flex items-center gap-2 text-[0.68rem] text-ink-subtle">
          <span className="font-semibold text-ink-muted">Tuppra</span>
          <span aria-hidden="true">·</span>
          <time dateTime={message.createdAt}>
            {formatMessageTime(message.createdAt)}
          </time>
          {isActive ? (
            <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-primary">
              {activityState === "searching"
                ? "يبحث في المصادر"
                : "ينشئ الاستجابة"}
            </span>
          ) : null}
        </div>

        {message.content ? (
          <div className="text-sm leading-8 sm:text-[0.95rem]">
            <MessageContent content={message.content} />
          </div>
        ) : isActive ? (
          <div className="flex items-center gap-3 rounded-xl bg-surface-sunken/60 px-4 py-3 text-sm text-ink-muted">
            <ActivityOrb state={activityState} size="sm" />
            <span>
              {activityState === "searching"
                ? "جاري البحث عن مقاطع داعمة داخل مساحة العمل…"
                : "جاري إنشاء الاستجابة وحفظ حالتها…"}
            </span>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">لا يوجد محتوى محفوظ.</p>
        )}

        <MessageCitations
          workspaceId={workspaceId}
          citations={message.citations}
          onInspect={onInspectCitation}
        />
        <MessageTelemetry message={message} />

        {message.status === "failed" ? (
          <div className="mt-4 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="mt-1 h-4 w-4 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-destructive">
                  {message.generation?.failureCode ?? "GENERATION_FAILED"}
                </p>
                <p className="mt-1 leading-6 text-ink-muted">
                  {message.generation?.failureMessage ??
                    "تعذر إكمال الاستجابة."}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {canRetry ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 rounded-xl"
            disabled={retryDisabled}
            onClick={() => onRetry(message.id)}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            إعادة المحاولة
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function ConversationShell({
  workspaceId,
  conversation,
  initialMessages,
  canWrite,
  readOnlyReason,
}: ConversationShellProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const composerHintId = useId();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [groundingMode, setGroundingMode] = useState<GroundingMode>("off");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [notice, setNotice] = useState<Notice>(null);
  const [inspectedCitation, setInspectedCitation] =
    useState<MessageCitation | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ block: "end" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isNearBottom) return;
    endRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [isNearBottom, messages, shouldReduceMotion]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 208)}px`;
  }, [input]);

  const refreshMessages = async () => {
    const response = await fetch(
      `/api/v1/workspaces/${workspaceId}/conversations/${conversation.id}`,
      { cache: "no-store" },
    );
    const payload = (await response.json()) as {
      ok?: boolean;
      data?: { messages?: unknown };
      error?: { message?: string };
    };

    if (!response.ok || !payload.ok) {
      throw new Error(
        payload.error?.message || "Conversation history could not be refreshed.",
      );
    }

    const parsed = conversationMessageSchema.array().safeParse(
      payload.data?.messages,
    );
    if (!parsed.success) {
      throw new Error("Conversation history returned an invalid shape.");
    }

    setMessages(parsed.data);
    router.refresh();
  };

  const startTurn = async (command: {
    content?: string;
    retryMessageId?: string;
  }) => {
    if (!canWrite || isStreaming) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    setIsNearBottom(true);
    setIsStreaming(true);
    setNotice(null);
    let readyReceived = false;

    try {
      const response = await fetch(
        `/api/v1/workspaces/${workspaceId}/conversations/${conversation.id}/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...command,
            direction: "auto",
            groundingMode,
          }),
          signal: controller.signal,
        },
      );

      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.includes("text/event-stream")) {
        const payload = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(
          payload?.error?.message ||
            `Generation request failed with status ${response.status}.`,
        );
      }

      await parseEventStream(response, (event) => {
        if (event.type === "ready") {
          readyReceived = true;
          setMessages((current) =>
            mergeMessages(current, [event.userMessage, event.assistantMessage]),
          );
          if (command.content) setInput("");
          return;
        }

        if (event.type === "delta") {
          setMessages((current) =>
            current.map((message) =>
              message.id === event.messageId
                ? {
                    ...message,
                    status: "streaming",
                    content: `${message.content}${event.delta}`,
                  }
                : message,
            ),
          );
          return;
        }

        if (event.type === "complete") {
          setMessages((current) => replaceMessage(current, event.message));
          setNotice({
            tone: "info",
            message:
              event.message.citations.length > 0
                ? "حُفظت الاستجابة ومراجعها القابلة للفحص."
                : "حُفظت الاستجابة داخل المحادثة.",
          });
          return;
        }

        if (event.type === "failed") {
          setMessages((current) => replaceMessage(current, event.message));
          setNotice({
            tone: "error",
            message: `تعذر إكمال الاستجابة / Generation failed: ${event.code}`,
          });
          return;
        }

        if (event.type === "cancelled") {
          setMessages((current) => replaceMessage(current, event.message));
          setNotice({
            tone: "info",
            message: "أُوقفت الاستجابة وحُفظ النص الجزئي.",
          });
        }
      });

      await refreshMessages();
    } catch (error) {
      if (controller.signal.aborted) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        try {
          await refreshMessages();
        } catch {
          setNotice({
            tone: "error",
            message:
              "أُوقفت الاستجابة، لكن تعذر تحديث الحالة المحفوظة / Generation stopped, but the saved state could not be refreshed.",
          });
        }
      } else {
        setNotice({
          tone: "error",
          message:
            error instanceof Error
              ? error.message
              : "تعذر بدء الاستجابة / Generation could not start.",
        });

        if (readyReceived) {
          try {
            await refreshMessages();
          } catch {
            // Keep the streamed state visible when refresh also fails.
          }
        }
      }
    } finally {
      controllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = input.trim();
    if (!content) return;
    void startTurn({ content });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const content = input.trim();
      if (content) void startTurn({ content });
    }
  };

  const handleScroll = () => {
    const element = scrollAreaRef.current;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    setIsNearBottom(distance < 120);
  };

  const scrollToLatest = () => {
    setIsNearBottom(true);
    endRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "end",
    });
  };

  const prompts = [
    "لخّص الفكرة التالية بخطوات واضحة",
    "Compare two approaches in Arabic and English",
    "حوّل هذه الملاحظات إلى قرار عملي",
  ];

  const readOnlyMessage =
    readOnlyReason === "workspace-archived"
      ? "مساحة العمل مؤرشفة. يمكنك مراجعة السجل، لكن يجب استعادة المساحة قبل إرسال رسالة أو إعادة محاولة."
      : "عضويتك للقراءة فقط. يمكنك مراجعة الرسائل وحالة التوليد من دون إرسال أو إعادة محاولة.";

  const streamingState =
    groundingMode === "workspace_sources" ? "searching" : "composing";

  return (
    <section className="relative flex min-h-0 flex-1 flex-col bg-surface">
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-6 lg:px-8"
        aria-label="رسائل المحادثة"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-brand-soft text-primary shadow-surface-xs">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-arabic-heading text-2xl font-semibold">
              ابدأ من سؤال واحد
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-8 text-ink-muted">
              اكتب بالعربية أو English. فعّل المصادر فقط عندما تريد إجابة تعتمد
              على المقاطع المحفوظة وتعرض مراجع يمكن فتحها هنا.
            </p>
            {canWrite ? (
              <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    dir="auto"
                    className="min-h-11 rounded-xl border border-line/80 bg-surface-raised px-4 py-2 text-sm text-ink-muted outline-none transition-[border-color,background-color,color,box-shadow] duration-fast hover:border-primary/25 hover:bg-brand-soft/45 hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/20"
                    onClick={() => {
                      setInput(prompt);
                      textareaRef.current?.focus();
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                workspaceId={workspaceId}
                message={message}
                canRetry={
                  canWrite &&
                  message.role === "assistant" &&
                  (message.status === "failed" ||
                    message.status === "cancelled")
                }
                retryDisabled={isStreaming}
                onInspectCitation={setInspectedCitation}
                onRetry={(messageId) =>
                  void startTurn({ retryMessageId: messageId })
                }
              />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {!isNearBottom ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute bottom-36 left-1/2 z-10 -translate-x-1/2 rounded-full bg-surface-overlay shadow-surface-md backdrop-blur"
          onClick={scrollToLatest}
        >
          آخر الرسائل
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      ) : null}

      <div className="border-t border-line/75 bg-surface-overlay/92 p-3 backdrop-blur-xl sm:p-4">
        {notice ? (
          <div
            className={`mb-3 rounded-xl border px-3 py-2 text-xs leading-6 ${
              notice.tone === "error"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-line bg-surface-sunken text-ink-muted"
            }`}
            role={notice.tone === "error" ? "alert" : "status"}
            aria-live={notice.tone === "error" ? "assertive" : "polite"}
          >
            {notice.message}
          </div>
        ) : null}

        {isStreaming ? (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-brand-soft/55 px-3 py-2 text-xs text-ink-muted">
            <ActivityOrb state={streamingState} size="sm" />
            <span>
              {streamingState === "searching"
                ? "يبحث في مصادر مساحة العمل ثم ينشئ الإجابة."
                : "ينشئ الاستجابة ويحفظ تقدمها في السجل."}
            </span>
          </div>
        ) : null}

        {canWrite && conversation.status === "active" ? (
          <form onSubmit={submit}>
            <div className="overflow-hidden rounded-2xl border border-line-strong/80 bg-surface-raised shadow-surface-sm transition-[border-color,box-shadow] duration-fast focus-within:border-primary/45 focus-within:shadow-surface-md">
              <label htmlFor="conversation-message" className="sr-only">
                اكتب رسالة
              </label>
              <textarea
                ref={textareaRef}
                id="conversation-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={20000}
                rows={1}
                dir="auto"
                disabled={isStreaming}
                placeholder="اكتب بالعربية أو English…"
                aria-describedby={composerHintId}
                className="max-h-52 min-h-20 w-full resize-none border-0 bg-transparent px-4 py-3 text-sm leading-7 outline-none ring-0 placeholder:text-ink-subtle focus:border-0 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70 sm:px-5 sm:py-4"
              />

              <div className="flex flex-wrap items-center gap-2 border-t border-line/70 bg-surface-sunken/45 px-2.5 py-2 sm:px-3">
                <button
                  type="button"
                  aria-pressed={groundingMode === "workspace_sources"}
                  disabled={isStreaming}
                  onClick={() =>
                    setGroundingMode((current) =>
                      current === "workspace_sources"
                        ? "off"
                        : "workspace_sources",
                    )
                  }
                  className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold outline-none transition-[border-color,background-color,color] duration-fast focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                    groundingMode === "workspace_sources"
                      ? "border-primary/30 bg-brand-soft text-primary"
                      : "border-line/80 bg-surface-raised text-ink-muted hover:text-foreground"
                  }`}
                >
                  <FileSearch className="h-3.5 w-3.5" aria-hidden="true" />
                  مصادر المساحة
                </button>

                <span className="me-auto text-[0.68rem] text-ink-subtle">
                  {formatNumber(input.length)} / ٢٠٬٠٠٠
                </span>

                {isStreaming ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-xl"
                    onClick={() =>
                      controllerRef.current?.abort(
                        new DOMException("Cancelled by user", "AbortError"),
                      )
                    }
                  >
                    <Square className="h-4 w-4" aria-hidden="true" />
                    إيقاف
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="rounded-xl"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    إرسال
                  </Button>
                )}
              </div>
            </div>
            <p
              id={composerHintId}
              className="mt-2 px-1 text-[0.68rem] leading-5 text-ink-subtle"
            >
              Enter للإرسال · Shift+Enter لسطر جديد ·
              {groundingMode === "workspace_sources"
                ? " الإجابة المكتملة تتطلب مرجعاً صالحاً من هذه المساحة."
                : " الاستمرارية تُعاد من الرسائل المحفوظة فقط."}
            </p>
          </form>
        ) : (
          <div className="rounded-xl bg-surface-sunken px-4 py-3 text-sm leading-7 text-ink-muted">
            {conversation.status === "archived"
              ? "هذه المحادثة مؤرشفة. استعدها قبل إرسال رسالة جديدة."
              : readOnlyMessage}
          </div>
        )}
      </div>

      <CitationInspector
        workspaceId={workspaceId}
        citation={inspectedCitation}
        onClose={() => setInspectedCitation(null)}
      />
    </section>
  );
}
