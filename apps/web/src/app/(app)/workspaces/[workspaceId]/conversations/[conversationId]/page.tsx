import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  ArrowRight,
  MessageSquareText,
  PencilLine,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type {
  Conversation,
  ConversationMessage,
  WorkspaceAccess,
} from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { ConversationShell } from "@/components/conversations/conversation-shell";
import { ConversationStatusNotice } from "@/components/conversations/conversation-status-notice";
import { DraftFromConversationPanel } from "@/components/drafts/draft-from-conversation-panel";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  archiveConversationAction,
  deleteConversationAction,
  renameConversationAction,
  restoreConversationAction,
} from "@/lib/conversations/actions";
import {
  getConversation,
  listConversationMessages,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "محادثة",
  description:
    "تابع محادثة بالعربية أو English، واستخدم المصادر، وحوّل الإجابات إلى مسودات.",
};

type PageParams = Promise<{ workspaceId: string; conversationId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId, conversationId } = await params;
  const query = await searchParams;
  const returnTo = `/workspaces/${workspaceId}/conversations/${conversationId}`;
  const { user, supabase } = await requireAuthenticatedUser(returnTo);
  let workspace: WorkspaceAccess | null = null;
  let conversation: Conversation | null = null;
  let messages: ConversationMessage[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      conversation = await getConversation(
        supabase,
        workspaceId,
        conversationId,
      );
      if (conversation) {
        messages = await listConversationMessages(
          supabase,
          workspaceId,
          conversationId,
        );
      }
    }
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof ConversationRepositoryError
    ) {
      console.error("Conversation detail failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected conversation detail failure", error);
    }
  }

  if (!persistenceFailed && (!workspace || !conversation)) notFound();

  if (!workspace || !conversation) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <ConversationStatusNotice status="persistence-error" />
        <Link
          href={`/workspaces/${workspaceId}/conversations`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى المحادثات
        </Link>
      </div>
    );
  }

  const isWorkspaceArchived = workspace.archivedAt !== null;
  const canWrite =
    !isWorkspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");
  const isArchived = conversation.status === "archived";
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : firstValue(query.status);
  const reusableMessages = messages
    .filter(
      (message) => message.role === "assistant" && message.status === "complete",
    )
    .map((message) => ({
      id: message.id,
      sequence: message.sequence,
      content: message.content,
      citationCount: message.citations.length,
    }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <ConversationStatusNotice
        status={isWorkspaceArchived ? "workspace-archived" : visibleStatus}
      />

      <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-foreground p-6 text-background sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/workspaces/${workspace.id}/conversations${
                  isArchived ? "/archived" : ""
                }`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                {isArchived ? "أرشيف المحادثات" : "كل المحادثات"}
              </Link>
              <Link
                href={`/workspaces/${workspace.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 text-sm font-semibold text-background/75 transition-colors hover:bg-background/10 hover:text-background"
              >
                مساحة العمل
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold text-background/80">
                {workspace.role === "owner"
                  ? "مالك"
                  : workspace.role === "editor"
                    ? "محرر"
                    : "قراءة فقط"}
              </span>
              <span className="rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                {isArchived ? "المحادثة مؤرشفة" : "المحادثة نشطة"}
              </span>
              {isWorkspaceArchived && (
                <span className="rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                  مساحة العمل مؤرشفة
                </span>
              )}
            </div>

            <h1
              dir="auto"
              className="mt-5 text-balance font-arabic-heading text-3xl font-semibold sm:text-5xl"
            >
              {conversation.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-background/65 sm:text-base">
              تابع الحوار بالعربية أو English، فعّل مصادر المساحة عندما تحتاج
              إلى مراجع، ثم حوّل الإجابة المناسبة إلى مسودة قابلة للتحرير.
            </p>
          </div>

          {canWrite && (
            <div className="flex flex-wrap gap-3">
              {isArchived ? (
                <form action={restoreConversationAction}>
                  <input type="hidden" name="workspaceId" value={workspace.id} />
                  <input
                    type="hidden"
                    name="conversationId"
                    value={conversation.id}
                  />
                  <Button
                    type="submit"
                    className="rounded-full bg-background text-foreground hover:bg-background/90"
                  >
                    <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
                    استعادة
                  </Button>
                </form>
              ) : (
                <form action={archiveConversationAction}>
                  <input type="hidden" name="workspaceId" value={workspace.id} />
                  <input
                    type="hidden"
                    name="conversationId"
                    value={conversation.id}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-full border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
                  >
                    <Archive className="h-4 w-4" aria-hidden="true" />
                    أرشفة
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </header>

      <ConversationShell
        workspaceId={workspace.id}
        conversation={conversation}
        initialMessages={messages}
        canWrite={canWrite}
        readOnlyReason={isWorkspaceArchived ? "workspace-archived" : "membership"}
      />

      <DraftFromConversationPanel
        workspaceId={workspace.id}
        conversationId={conversation.id}
        messages={reusableMessages}
        canWrite={canWrite}
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-primary/10 p-3 text-primary">
              <PencilLine className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">تنظيم المحادثة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                غيّر العنوان عند الحاجة
              </h2>
            </div>
          </div>

          {canWrite ? (
            <form action={renameConversationAction} className="mt-6 space-y-3">
              <input type="hidden" name="workspaceId" value={workspace.id} />
              <input
                type="hidden"
                name="conversationId"
                value={conversation.id}
              />
              <label htmlFor="conversation-title" className="text-sm font-semibold">
                عنوان المحادثة
              </label>
              <input
                id="conversation-title"
                name="title"
                required
                maxLength={200}
                defaultValue={conversation.title}
                dir="auto"
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Button type="submit" variant="outline" className="rounded-full">
                حفظ العنوان
              </Button>
            </form>
          ) : (
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              {isWorkspaceArchived
                ? "مساحة العمل مؤرشفة، لذلك يبقى عنوان المحادثة للقراءة فقط حتى استعادة المساحة."
                : "يمكنك قراءة المحادثة، لكن تعديل عنوانها يحتاج دور المحرر أو المالك."}
            </p>
          )}

          <div className="mt-6 flex gap-3 rounded-2xl bg-secondary/55 p-4 text-xs leading-6 text-muted-foreground">
            <ShieldCheck
              className="mt-1 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              إذا توقفت استجابة أو فشلت، يبقى ما سبق محفوظاً ويمكنك إعادة
              المحاولة دون فقدان المحادثة.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-destructive/25 bg-card p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-destructive/10 p-3 text-destructive">
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-destructive">إجراء نهائي</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                حذف المحادثة
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                يحذف هذا الإجراء المحادثة ورسائلها ومراجعها نهائياً. لن تتأثر
                بقية محتويات مساحة العمل.
              </p>
            </div>
          </div>

          {canWrite ? (
            <form action={deleteConversationAction} className="mt-6">
              <input type="hidden" name="workspaceId" value={workspace.id} />
              <input
                type="hidden"
                name="conversationId"
                value={conversation.id}
              />
              <Button type="submit" variant="destructive" className="rounded-full">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                حذف المحادثة ورسائلها
              </Button>
            </form>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              {isWorkspaceArchived
                ? "استعد مساحة العمل قبل حذف محادثة منها."
                : "عضوية القراءة لا تسمح بالحذف."}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-border/70 bg-secondary/35 p-5 text-sm leading-7 text-muted-foreground">
        <div className="flex items-start gap-3">
          <MessageSquareText
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            مصادر المساحة اختيارية. عند تفعيلها، تظهر المراجع المستخدمة مع
            روابط إلى المقاطع الداعمة. وعند تحويل إجابة إلى مسودة، تبقى هذه
            المراجع مرتبطة بها للرجوع إليها لاحقاً.
          </p>
        </div>
      </section>
    </div>
  );
}
