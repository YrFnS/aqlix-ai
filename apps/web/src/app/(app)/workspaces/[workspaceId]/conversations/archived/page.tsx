import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowRight, MessageSquareText } from "lucide-react";
import type { ConversationSummary, WorkspaceAccess } from "@iraqi-ai/types";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { ConversationStatusNotice } from "@/components/conversations/conversation-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  listConversations,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
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
      allConversations = await listConversations(supabase, workspaceId, {
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
      <div className="mx-auto max-w-5xl space-y-6">
        <ConversationStatusNotice status="persistence-error" />
        <Link
          href="/workspaces"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى المساحات
        </Link>
      </div>
    );
  }

  const conversations = allConversations.filter(
    (conversation) => conversation.status === "archived",
  );
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : firstValue(query.status);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <Link
          href={`/workspaces/${workspace.id}/conversations`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          المحادثات النشطة
        </Link>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">P2 · Archive state</p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              أرشيف المحادثات
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              الأرشفة توقف الرسائل الجديدة من دون حذف التاريخ أو محاولات التوليد.
              يمكن للمالك أو المحرر استعادة المحادثة من داخلها.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            <Archive className="h-4 w-4 text-primary" aria-hidden="true" />
            {conversations.length} محادثة مؤرشفة
          </div>
        </div>
      </header>

      <ConversationStatusNotice status={visibleStatus} />

      {conversations.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </section>
      ) : (
        <section className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <div className="rounded-2xl bg-secondary p-4 text-primary">
            <MessageSquareText className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-arabic-heading text-2xl font-semibold">
            الأرشيف فارغ
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
            عند أرشفة محادثة ستظهر هنا مع رسائلها وحالة محاولات التوليد.
          </p>
        </section>
      )}
    </div>
  );
}
