import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowRight,
  MessageSquarePlus,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import type { ConversationSummary, WorkspaceAccess } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { PageHeader, PageSection, PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { ConversationStatusNotice } from "@/components/conversations/conversation-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createConversationAction } from "@/lib/conversations/actions";
import { ConversationRepositoryError } from "@/lib/conversations/repository";
import { listConversationSummaries } from "@/lib/conversations/summaries";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "المحادثات",
  description: "Persistent bilingual conversations inside an authorized workspace.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ConversationsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/conversations`,
  );
  let workspace: WorkspaceAccess | null = null;
  let conversations: ConversationSummary[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      conversations = await listConversationSummaries(supabase, workspaceId);
    }
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof ConversationRepositoryError
    ) {
      console.error("Conversation list failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected conversation list failure", error);
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

  const isWorkspaceArchived = workspace.archivedAt !== null;
  const canWrite =
    !isWorkspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : firstValue(query.status);

  return (
    <PageShell width="wide">
      <ConversationStatusNotice
        status={isWorkspaceArchived ? "workspace-archived" : visibleStatus}
      />

      <PageHeader
        eyebrow={<span dir="auto">{workspace.name}</span>}
        title="اسأل، تابع، وارجع إلى إجاباتك"
        description="ابدأ سؤالاً جديداً أو أكمل محادثة سابقة بالعربية أو English. فعّل مصادر المساحة فقط عندما تحتاج إلى سياق أدق ومراجع قابلة للفحص."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/workspaces/${workspace.id}`}>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                مساحة العمل
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/workspaces/${workspace.id}/conversations/archived`}>
                <Archive className="h-4 w-4" aria-hidden="true" />
                الأرشيف
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <PageSection
          title="المحادثات النشطة"
          description="مرتبة حسب آخر نشاط حتى تستطيع متابعة العمل من حيث توقف."
          actions={
            <span className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-primary">
              {conversations.length} محادثة
            </span>
          }
        >
          {conversations.length > 0 ? (
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </div>
          ) : (
            <Surface
              tone="muted"
              radius="2xl"
              padding="lg"
              className="flex min-h-80 flex-col items-center justify-center border-dashed text-center"
            >
              <div className="rounded-xl bg-surface-raised p-4 text-primary shadow-surface-xs">
                <MessageSquareText className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-arabic-heading text-xl font-semibold">
                لا توجد محادثة نشطة
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">
                {canWrite
                  ? "أنشئ أول محادثة من اللوحة الجانبية. لن نضيف رسائل مثال أو استجابات غير صادرة عن المسار الحقيقي."
                  : "لم تُشارك معك محادثة نشطة قابلة للكتابة في هذه المساحة."}
              </p>
            </Surface>
          )}
        </PageSection>

        <Surface
          id="new-conversation"
          tone="raised"
          elevation="sm"
          radius="2xl"
          padding="lg"
          className="scroll-mt-28 lg:sticky lg:top-24"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary">محادثة جديدة</p>
              <h2 className="mt-2 font-arabic-heading text-xl font-semibold">
                ابدأ من سؤال واضح
              </h2>
            </div>
            <div className="rounded-xl bg-brand-soft p-3 text-primary">
              <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          {canWrite ? (
            <form action={createConversationAction} className="mt-6 space-y-4">
              <input type="hidden" name="workspaceId" value={workspace.id} />
              <div className="space-y-2">
                <label
                  htmlFor="conversation-title"
                  className="text-sm font-semibold"
                >
                  عنوان اختياري
                </label>
                <input
                  id="conversation-title"
                  name="title"
                  maxLength={200}
                  dir="auto"
                  placeholder="محادثة جديدة"
                  className="min-h-12 w-full rounded-xl border border-input bg-surface-raised px-4 text-sm outline-none transition-[border-color,box-shadow] duration-fast placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                />
              </div>
              <Button type="submit" className="w-full rounded-xl">
                <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                إنشاء وفتح
              </Button>
            </form>
          ) : (
            <div className="mt-6 rounded-xl bg-surface-sunken p-4 text-sm leading-7 text-ink-muted">
              {isWorkspaceArchived
                ? "مساحة العمل مؤرشفة. استعدها أولاً لإنشاء محادثة جديدة."
                : "عضويتك للقراءة فقط. إنشاء محادثة يحتاج دور المحرر أو المالك."}
            </div>
          )}

          <div className="mt-5 flex items-start gap-3 border-t border-line/70 pt-5 text-xs leading-6 text-ink-muted">
            <ShieldCheck
              className="mt-1 h-3.5 w-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              استمرارية المحادثة تُعاد من السجلات المصرح بها داخل هذه المساحة، لا
              من ذاكرة مستضافة عند المزود.
            </p>
          </div>
        </Surface>
      </div>
    </PageShell>
  );
}
