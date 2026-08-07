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
import { ConversationCard } from "@/components/conversations/conversation-card";
import { ConversationStatusNotice } from "@/components/conversations/conversation-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createConversationAction } from "@/lib/conversations/actions";
import {
  listConversations,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
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
      conversations = await listConversations(supabase, workspaceId);
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

  const isWorkspaceArchived = workspace.archivedAt !== null;
  const canWrite =
    !isWorkspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : firstValue(query.status);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <Link
          href={`/workspaces/${workspace.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى مساحة العمل
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">
              P2 · Persistent bilingual conversation
            </p>
            <h1
              dir="auto"
              className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl"
            >
              محادثات {workspace.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              الرسائل وحالات التوليد محفوظة في PostgreSQL وتخضع لعضوية مساحة
              العمل. العربية وEnglish والنص المختلط تُعرض باتجاه تلقائي.
            </p>
          </div>

          <Link
            href={`/workspaces/${workspace.id}/conversations/archived`}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <Archive className="h-4 w-4" aria-hidden="true" />
            أرشيف المحادثات
          </Link>
        </div>
      </header>

      <ConversationStatusNotice
        status={isWorkspaceArchived ? "workspace-archived" : visibleStatus}
      />

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">محادثة جديدة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                ابدأ من سؤال واضح
              </h2>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          {canWrite ? (
            <form action={createConversationAction} className="mt-7 space-y-5">
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
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full rounded-full">
                إنشاء وفتح المحادثة
                <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          ) : (
            <div className="mt-7 rounded-2xl border border-border bg-secondary/55 p-4 text-sm leading-7 text-muted-foreground">
              {isWorkspaceArchived
                ? "مساحة العمل مؤرشفة. يمكن مراجعة المحادثات، لكن إنشاء محادثة أو إرسال رسالة يتطلب استعادة المساحة أولاً."
                : "عضويتك للقراءة فقط. يمكنك فتح المحادثات الحالية ومراجعة الرسائل وحالة المزود، لكن إنشاء محادثة أو إرسال رسالة يحتاج دور المحرر أو المالك."}
            </div>
          )}

          <div className="mt-6 flex gap-3 rounded-2xl bg-secondary/60 p-4 text-xs leading-6 text-muted-foreground">
            <ShieldCheck
              className="mt-1 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              لا تُستخدم ذاكرة عملية أو محادثة مستضافة عند المزود كمصدر للحقيقة.
              كل استمرارية تُعاد من السجلات المصرح بها داخل هذه المساحة.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">المحادثات النشطة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                أكمل من حيث توقفت
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {conversations.length} محادثة
            </p>
          </div>

          {conversations.length > 0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/35 p-8 text-center">
              <div className="rounded-2xl bg-background p-4 text-primary shadow-sm">
                <MessageSquareText className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-arabic-heading text-xl font-semibold">
                لا توجد محادثة نشطة
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                {canWrite
                  ? "أنشئ أول محادثة. لن نضع رسائل مثال أو استجابات غير صادرة عن المسار الحقيقي."
                  : "لم تُشارك معك محادثة نشطة قابلة للكتابة في هذه المساحة."}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
