import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type {
  Conversation,
  ConversationMessage,
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
  listConversationMessages,
  listConversations,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
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
  let messages: ConversationMessage[] = [];
  let conversations: ConversationSummary[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      [conversation, messages, conversations] = await Promise.all([
        getConversation(supabase, workspaceId, conversationId),
        listConversationMessages(supabase, workspaceId, conversationId),
        listConversations(supabase, workspaceId, { includeArchived: true }),
      ]);
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

      <ConversationWorkspaceFrame
        title={conversation.title}
        subtitle={`${workspace.name} · ${roleLabel} · ${messages.length} رسالة`}
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
            messageCount={messages.length}
            reusableMessages={reusableMessages}
            canWrite={canWrite}
          />
        }
      >
        <ClientReadyBoundary name="conversation">
          <ConversationShell
            workspaceId={workspace.id}
            conversation={conversation}
            initialMessages={messages}
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
