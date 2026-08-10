"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  AlertTriangle,
  Bot,
  Clock3,
  Cpu,
  FileSearch,
  Hash,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  UserRound,
} from "lucide-react";
import type {
  Conversation,
  ConversationMessage,
  ConversationMessagePage,
  ConversationStreamEvent,
  GroundingMode,
} from "@iraqi-ai/types";
import {
  conversationMessagePageSchema,
  conversationStreamEventSchema,
} from "@iraqi-ai/types";
import { DraftFromConversationPanel } from "@/components/drafts/draft-from-conversation-panel";
import { Button } from "@/components/ui/button";
import { MessageCitations } from "./message-citations";
import { MessageContent } from "./message-content";

interface ConversationShellProps {
  workspaceId: string;
  conversation: Conversation;
  initialPage: ConversationMessagePage;
  canWrite: boolean;
  readOnlyReason: "workspace-archived" | "membership";
}

type Notice = {
  tone: "error" | "info";
  message: string;
} | null;

type PrependPosition = {
  scrollHeight: number;
  scrollTop: number;
};

const statusLabels = {
  pending: "قيد البدء",
  streaming: "جاري الكتابة",
  complete: "مكتملة",
  failed: "فشلت",
  cancelled: "أُلغيت",
} as const;

const AUTO_SCROLL_THRESHOLD_PX = 120;
const MESSAGE_PAGE_SIZE = 40;

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

function MessageTelemetry({ message }: { message: ConversationMessage }) {
  const generation = message.generation;
  if (!generation) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem] text-muted-foreground">
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
        <Cpu className="h-3 w-3" aria-hidden="true" />
        {generation.returnedModel ?? generation.requestedModel}
      </span>
      {generation.groundingMode === "workspace_sources" && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
          <FileSearch className="h-3 w-3" aria-hidden="true" />
          {formatNumber(generation.citationCount)} مرجع من {formatNumber(
            generation.retrievedSourceCount,
          )} مقطع
        </span>
      )}
      {generation.totalTokens !== null && (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
          <Hash className="h-3 w-3" aria-hidden="true" />
          {formatNumber(generation.totalTokens)} token
        </span>
      )}
      {generation.latencyMs !== null && (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
          <Clock3 className="h-3 w-3" aria-hidden="true" />
          {(generation.latencyMs / 1000).toFixed(1)}s
        </span>
      )}
      <span className="rounded-full bg-secondary/70 px-2.5 py-1">
        {statusLabels[generation.status]}
      </span>
    </div>
  );
}

function MessageBubble({
  workspaceId,
  message,
  canRetry,
  onRetry,
  retryDisabled,
}: {
  workspaceId: string;
  message: ConversationMessage;
  canRetry: boolean;
  onRetry: (messageId: string) => void;
  retryDisabled: boolean;
}) {
  const isUser = message.role === "user";
  const isActive = message.status === "pending" || message.status === "streaming";

  return (
    <article
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
      data-message-id={message.id}
      data-message-sequence={message.sequence}
    >
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </div>
      )}

      <div
        className={
          isUser
            ? "max-w-[88%] rounded-3xl rounded-bl-lg bg-primary px-5 py-4 text-primary-foreground sm:max-w-[78%]"
            : "max-w-[92%] rounded-3xl rounded-br-lg border border-border/70 bg-card px-5 py-4 text-foreground shadow-sm sm:max-w-[82%]"
        }
        aria-live={!isUser && isActive ? "polite" : undefined}
      >
        {message.content ? (
          <MessageContent content={message.content} />
        ) : isActive ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
            {message.status === "pending"
              ? "بانتظار بدء الاستجابة…"
              : "جاري إنشاء الاستجابة…"}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">لا يوجد محتوى محفوظ.</p>
        )}

        {!isUser && <MessageTelemetry message={message} />}
        {!isUser && (
          <MessageCitations
            workspaceId={workspaceId}
            citations={message.citations}
          />
        )}

        {!isUser && message.status === "failed" && (
          <div className="mt-4 rounded-2xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="mt-1 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold">
                  {message.generation?.failureCode ?? "GENERATION_FAILED"}
                </p>
                <p className="mt-1 leading-6 text-foreground/70">
                  {message.generation?.failureMessage ??
                    "تعذر إكمال الاستجابة."}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isUser && canRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 rounded-full"
            disabled={retryDisabled}
            onClick={() => onRetry(message.id)}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            إعادة المحاولة
          </Button>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
          <UserRound className="h-4 w-4" aria-hidden="true" />
        </div>
      )}
    </article>
  );
}

export function ConversationShell({
  workspaceId,
  conversation,
  initialPage,
  canWrite,
  readOnlyReason,
}: ConversationShellProps) {
  const [messages, setMessages] = useState(initialPage.messages);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [input, setInput] = useState("");
  const [groundingMode, setGroundingMode] = useState<GroundingMode>("off");
  const [isStreaming, setIsStreaming] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const loadedOlderRef = useRef(false);
  const prependPositionRef = useRef<PrependPosition | null>(null);
  const pendingDeltasRef = useRef<Map<string, string>>(new Map());
  const deltaFrameRef = useRef<number | null>(null);

  const reusableMessages = useMemo(
    () =>
      messages
        .filter(
          (message) =>
            message.role === "assistant" && message.status === "complete",
        )
        .map((message) => ({
          id: message.id,
          sequence: message.sequence,
          content: message.content,
          citationCount: message.citations.length,
        })),
    [messages],
  );

  const clearPendingDeltas = () => {
    pendingDeltasRef.current.clear();
    if (deltaFrameRef.current !== null) {
      window.cancelAnimationFrame(deltaFrameRef.current);
      deltaFrameRef.current = null;
    }
  };

  const discardPendingDelta = (messageId: string) => {
    pendingDeltasRef.current.delete(messageId);
  };

  const flushPendingDeltas = () => {
    deltaFrameRef.current = null;
    if (pendingDeltasRef.current.size === 0) return;

    const pending = new Map(pendingDeltasRef.current);
    pendingDeltasRef.current.clear();

    setMessages((current) =>
      current.map((message) => {
        const delta = pending.get(message.id);
        if (!delta) return message;

        return {
          ...message,
          status: "streaming",
          content: `${message.content}${delta}`,
        };
      }),
    );
  };

  const queueDelta = (messageId: string, delta: string) => {
    pendingDeltasRef.current.set(
      messageId,
      `${pendingDeltasRef.current.get(messageId) ?? ""}${delta}`,
    );

    if (deltaFrameRef.current === null) {
      deltaFrameRef.current = window.requestAnimationFrame(flushPendingDeltas);
    }
  };

  useEffect(() => {
    return () => {
      clearPendingDeltas();
      controllerRef.current?.abort();
    };
  }, []);

  const updateAutoScrollPreference = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    shouldAutoScrollRef.current =
      distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX;
  };

  useLayoutEffect(() => {
    const position = prependPositionRef.current;
    const viewport = viewportRef.current;
    if (!position || !viewport) return;

    viewport.scrollTop =
      position.scrollTop + (viewport.scrollHeight - position.scrollHeight);
    prependPositionRef.current = null;
  }, [messages]);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages]);

  const fetchMessagePage = async (before?: number) => {
    const query = new URLSearchParams({ limit: String(MESSAGE_PAGE_SIZE) });
    if (before !== undefined) query.set("before", String(before));

    const response = await fetch(
      `/api/v1/workspaces/${workspaceId}/conversations/${conversation.id}/messages?${query.toString()}`,
      { cache: "no-store" },
    );
    const payload = (await response.json()) as {
      ok?: boolean;
      data?: { page?: unknown };
      error?: { message?: string };
    };

    if (!response.ok || payload.ok !== true) {
      throw new Error(
        payload.error?.message || "Conversation history could not be loaded.",
      );
    }

    const parsed = conversationMessagePageSchema.safeParse(payload.data?.page);
    if (!parsed.success) {
      throw new Error("Conversation history returned an invalid page.");
    }

    return parsed.data;
  };

  const loadOlderMessages = async () => {
    if (!hasMore || nextCursor === null || isLoadingOlder) return;

    const viewport = viewportRef.current;
    const position = viewport
      ? {
          scrollHeight: viewport.scrollHeight,
          scrollTop: viewport.scrollTop,
        }
      : null;

    setIsLoadingOlder(true);
    setNotice(null);

    try {
      const page = await fetchMessagePage(nextCursor);
      shouldAutoScrollRef.current = false;
      loadedOlderRef.current = true;
      prependPositionRef.current = position;
      setMessages((current) => mergeMessages(current, page.messages));
      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    } catch (error) {
      prependPositionRef.current = null;
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "تعذر تحميل الرسائل الأقدم.",
      });
    } finally {
      setIsLoadingOlder(false);
    }
  };

  const refreshMessages = async () => {
    const page = await fetchMessagePage();
    clearPendingDeltas();
    setMessages((current) => mergeMessages(current, page.messages));

    if (!loadedOlderRef.current) {
      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    }
  };

  const startTurn = async (command: {
    content?: string;
    retryMessageId?: string;
  }) => {
    if (!canWrite || isStreaming) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    shouldAutoScrollRef.current = true;
    setIsStreaming(true);
    setNotice(null);
    let readyReceived = false;
    let terminalReceived = false;

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
          queueDelta(event.messageId, event.delta);
          return;
        }

        if (event.type === "complete") {
          terminalReceived = true;
          discardPendingDelta(event.message.id);
          setMessages((current) => replaceMessage(current, event.message));
          setNotice({
            tone: "info",
            message:
              event.message.citations.length > 0
                ? "تم حفظ الاستجابة والمراجع القابلة للفتح."
                : "تم حفظ الاستجابة والمحادثة.",
          });
          return;
        }

        if (event.type === "failed") {
          terminalReceived = true;
          discardPendingDelta(event.message.id);
          setMessages((current) => replaceMessage(current, event.message));
          setNotice({
            tone: "error",
            message: `تعذر إكمال الاستجابة: ${event.code}`,
          });
          return;
        }

        if (event.type === "cancelled") {
          terminalReceived = true;
          discardPendingDelta(event.message.id);
          setMessages((current) => replaceMessage(current, event.message));
          setNotice({
            tone: "info",
            message: "تم إيقاف الاستجابة وحفظ النص المكتوب حتى الآن.",
          });
        }
      });

      if (readyReceived && !terminalReceived) {
        await refreshMessages();
      }
    } catch (error) {
      if (controller.signal.aborted) {
        clearPendingDeltas();
        await new Promise((resolve) => setTimeout(resolve, 250));
        try {
          await refreshMessages();
        } catch {
          setNotice({
            tone: "error",
            message:
              "أُوقفت الاستجابة، لكن تعذر تحديث حالتها المحفوظة. أعد تحميل الصفحة للتحقق.",
          });
        }
      } else {
        setNotice({
          tone: "error",
          message:
            error instanceof Error
              ? error.message
              : "تعذر بدء الاستجابة.",
        });

        if (readyReceived && !terminalReceived) {
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
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const content = input.trim();
      if (content) void startTurn({ content });
    }
  };

  const prompts = [
    "لخّص الفكرة التالية بخطوات واضحة",
    "Compare two approaches in Arabic and English",
    "حوّل هذه الملاحظات إلى قرار عملي",
  ];

  const readOnlyMessage =
    readOnlyReason === "workspace-archived"
      ? "مساحة العمل مؤرشفة. يمكنك مراجعة السجل، لكن يجب استعادة المساحة قبل إرسال رسالة أو إعادة محاولة."
      : "عضويتك للقراءة فقط. يمكنك مراجعة الرسائل والردود من دون إرسال أو إعادة محاولة.";

  return (
    <>
      <section className="grid min-h-[70vh] overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm lg:grid-rows-[1fr_auto]">
        <div
          ref={viewportRef}
          data-testid="conversation-viewport"
          onScroll={updateAutoScrollPreference}
          className="min-h-0 overflow-y-auto p-4 sm:p-6 lg:max-h-[calc(100vh-16rem)]"
        >
          {messages.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-arabic-heading text-2xl font-semibold">
                ابدأ محادثتك
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-8 text-muted-foreground">
                اكتب بالعربية أو English. فعّل مصادر المساحة عندما تريد أن ترتبط
                الإجابة بالمقاطع المحفوظة وتعرض مراجع يمكنك فتحها.
              </p>
              {canWrite && (
                <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      dir="auto"
                      className="min-h-11 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      onClick={() => setInput(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={isLoadingOlder}
                    onClick={() => void loadOlderMessages()}
                  >
                    {isLoadingOlder ? (
                      <RefreshCw
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isLoadingOlder ? "جاري التحميل…" : "تحميل رسائل أقدم"}
                  </Button>
                </div>
              )}

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
                  onRetry={(messageId) =>
                    void startTurn({ retryMessageId: messageId })
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border/70 bg-background/85 p-4 backdrop-blur sm:p-5">
          {notice && (
            <div
              className={`mb-3 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                notice.tone === "error"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-border bg-secondary/55 text-muted-foreground"
              }`}
              role={notice.tone === "error" ? "alert" : "status"}
            >
              {notice.message}
            </div>
          )}

          {canWrite && conversation.status === "active" ? (
            <form onSubmit={submit} className="space-y-3">
              <label
                htmlFor="conversation-grounding"
                className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors ${
                  groundingMode === "workspace_sources"
                    ? "border-primary/35 bg-primary/10"
                    : "border-border bg-card hover:bg-secondary/45"
                }`}
              >
                <input
                  id="conversation-grounding"
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-primary"
                  checked={groundingMode === "workspace_sources"}
                  disabled={isStreaming}
                  onChange={(event) =>
                    setGroundingMode(
                      event.target.checked ? "workspace_sources" : "off",
                    )
                  }
                />
                <FileSearch
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-semibold">
                    استخدام مصادر مساحة العمل
                  </span>
                  <span className="mt-1 block text-xs leading-6 text-muted-foreground">
                    يبحث في المقاطع الجاهزة ويضيف روابط إلى المراجع المستخدمة في
                    الإجابة.
                  </span>
                </span>
              </label>

              <label htmlFor="conversation-message" className="sr-only">
                اكتب رسالة
              </label>
              <textarea
                id="conversation-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={20000}
                rows={3}
                dir="auto"
                disabled={isStreaming}
                placeholder="اكتب بالعربية أو English… (Enter للإرسال، Shift+Enter لسطر جديد)"
                className="w-full resize-y rounded-3xl border border-input bg-card px-5 py-4 text-sm leading-7 outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-6 text-muted-foreground">
                  {groundingMode === "workspace_sources"
                    ? "ستتضمن الإجابة مرجعاً قابلاً للفتح من هذه المساحة."
                    : "تُستخدم رسائل هذه المحادثة للحفاظ على السياق."}
                </p>
                {isStreaming ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-full"
                    onClick={() =>
                      controllerRef.current?.abort(
                        new DOMException("Cancelled by user", "AbortError"),
                      )
                    }
                  >
                    <Square className="h-4 w-4" aria-hidden="true" />
                    إيقاف وحفظ الجزئي
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    إرسال
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-sm leading-7 text-muted-foreground">
              {conversation.status === "archived"
                ? "هذه المحادثة مؤرشفة. استعدها قبل إرسال رسالة جديدة."
                : readOnlyMessage}
            </div>
          )}
        </div>
      </section>

      <DraftFromConversationPanel
        workspaceId={workspaceId}
        conversationId={conversation.id}
        messages={reusableMessages}
        canWrite={canWrite}
      />
    </>
  );
}
