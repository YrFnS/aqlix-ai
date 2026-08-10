import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowRight, MessageSquareText } from "lucide-react";
import type { ConversationSummary, WorkspaceAccess } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { ConversationStatusNotice } from "@/components/conversations/conversation-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { ConversationRepositoryError } from "@/lib/conversations/repository";
import { listConversationSummaries } from "@/lib/conversations/summaries";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "أرشيف المحادثات",
  description: "Archived persistent conversations.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ArchivedConversationsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/conversations/archived`,
  );
  let workspace: WorkspaceAccess | null = null;
  let allConversations: ConversationSummary[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      allConversations = await listConversationSummaries(supabase, workspaceId, {
        includeArchived: true,
      });
    }
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof ConversationRepositoryError
    ) {
      console.error("Archived conversation list failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected archived conversation list failure", error);
    }
  }

  if (!persistenceFailed && !workspace) notFound();

  if (!workspace) {
    return (
      <PageShell width="compact">
        <ConversationStatusNotice status="persistence-error" />
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href="/workspaces">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى المساحات
          </Link>
        </Button>
      </PageShell>
    );
  }

  const conversations = allConversations.filter(
    (conversation) => conversation.status === "archived",
  );
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : firstValue(query.status);

  return (
    <PageShell width="wide">
      <ConversationStatusNotice status={visibleStatus} />

      <PageHeader
        eyebrow={<span dir="auto">{workspace.name}</span>}
        title="أرشيف المحادثات"
        description="الأرشفة توقف الرسائل الجديدة من دون حذف التاريخ أو محاولات التوليد. افتح أي محادثة لمراجعتها أو استعادتها."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/workspaces/${workspace.id}/conversations`}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              المحادثات النشطة
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-3 rounded-xl bg-surface-sunken px-4 py-3 text-sm text-ink-muted">
        <Archive className="h-4 w-4 text-primary" aria-hidden="true" />
        {conversations.length} محادثة مؤرشفة
      </div>

      {conversations.length > 0 ? (
        <section className="space-y-3" aria-label="المحادثات المؤرشفة">
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </section>
      ) : (
        <Surface
          tone="muted"
          radius="2xl"
          padding="lg"
          className="flex min-h-96 flex-col items-center justify-center border-dashed text-center"
        >
          <div className="rounded-xl bg-surface-raised p-4 text-primary shadow-surface-xs">
            <MessageSquareText className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-arabic-heading text-2xl font-semibold">
            الأرشيف فارغ
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-ink-muted">
            عند أرشفة محادثة ستظهر هنا مع رسائلها وحالة محاولات التوليد.
          </p>
        </Surface>
      )}
    </PageShell>
  );
}
