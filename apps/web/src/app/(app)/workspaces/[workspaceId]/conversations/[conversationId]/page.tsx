import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type {
  Conversation,
  ConversationMessagePage,
  ConversationSummary,
  WorkspaceAccess,
} from "@iraqi-ai/types";
import { ConversationInspector } from "@/components/conversations/conversation-inspector";
import { ConversationShell } from "@/components/conversations/conversation-shell";
import { ConversationStatusNotice } from "@/components/conversations/conversation-status-notice";
import { ConversationSwitcher } from "@/components/conversations/conversation-switcher";
import { ConversationWorkspaceFrame } from "@/components/conversations/conversation-workspace-frame";
import { ClientReadyBoundary } from "@/components/system/client-ready-boundary";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  getConversation,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
import {
  DEFAULT_CONVERSATION_MESSAGE_PAGE_SIZE,
  listConversationMessagePage,
} from "@/lib/conversations/message-pages";
import { listConversationSummaries } from "@/lib/conversations/summaries";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "محادثة",
  description:
    "Persistent bilingual conversation with optional sources and reusable drafts.",
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
  let messagePage: ConversationMessagePage = {
    messages: [],
    hasMore: false,
    nextCursor: null,
  };
  let conversations: ConversationSummary[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      [conversation, conversations] = await Promise.all([
        getConversation(supabase, workspaceId, conversationId),
        listConversationSummaries(supabase, workspaceId, {
          includeArchived: true,
        }),
      ]);

      if (conversation) {
        messagePage = await listConversationMessagePage(supabase, {
          workspaceId,
          conversationId,
          limit: DEFAULT_CONVERSATION_MESSAGE_PAGE_SIZE,
        });
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
      <PageShell width="compact">
        <ConversationStatusNotice status="persistence-error" />
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href={`/workspaces/${workspaceId}/conversations`}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى المحادثات
          </Link>
        </Button>
      </PageShell>
    );
  }

  const isWorkspaceArchived = workspace.archivedAt !== null;
  const canWrite =
    !isWorkspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : firstValue(query.status);
  const reusableMessages = messagePage.messages
    .filter(
      (message) => message.role === "assistant" && message.status === "complete",
    )
    .map((message) => ({
      id: message.id,
      sequence: message.sequence,
      content: message.content,
      citationCount: message.citations.length,
    }));
  const messageCount =
    conversations.find((candidate) => candidate.id === conversation.id)
      ?.messageCount ?? messagePage.messages.length;
  const roleLabel =
    workspace.role === "owner"
      ? "مالك"
      : workspace.role === "editor"
        ? "محرر"
        : "قراءة فقط";

  return (
    <PageShell width="fluid" className="space-y-4">
      <ConversationStatusNotice
        status={isWorkspaceArchived ? "workspace-archived" : visibleStatus}
      />

      <div className="rounded-xl border border-line/70 bg-surface-sunken/55 px-4 py-3 text-sm leading-7 text-ink-muted">
        تابع الحوار بالعربية أو English. إذا توقفت استجابة أو فشلت، يمكنك إعادة المحاولة من الرسالة نفسها من دون فقدان السجل المحفوظ.
      </div>

      <ConversationWorkspaceFrame
        title={conversation.title}
        subtitle={`${workspace.name} · ${roleLabel} · ${messageCount} رسالة`}
        status={conversation.status}
        history={
          <ConversationSwitcher
            workspaceId={workspace.id}
            currentConversationId={conversation.id}
            conversations={conversations}
          />
        }
        inspector={
          <ConversationInspector
            workspace={workspace}
            conversation={conversation}
            messageCount={messageCount}
            reusableMessages={reusableMessages}
            canWrite={canWrite}
          />
        }
      >
        <ClientReadyBoundary name="conversation">
          <ConversationShell
            workspaceId={workspace.id}
            conversation={conversation}
            initialPage={messagePage}
            canWrite={canWrite}
            readOnlyReason={
              isWorkspaceArchived ? "workspace-archived" : "membership"
            }
          />
        </ClientReadyBoundary>
      </ConversationWorkspaceFrame>
    </PageShell>
  );
}
