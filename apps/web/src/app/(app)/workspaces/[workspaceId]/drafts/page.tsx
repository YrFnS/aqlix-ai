import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowRight,
  FileClock,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import type { Draft, WorkspaceAccess } from "@iraqi-ai/types";
import { DraftCard } from "@/components/drafts/draft-card";
import { DraftStatusNotice } from "@/components/drafts/draft-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  listDrafts,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "المسودات",
  description:
    "حوّل الإجابات إلى مستندات قابلة للتحرير والحفظ والمراجعة والتصدير.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WorkspaceDraftsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/drafts`,
  );

  let workspace: WorkspaceAccess | null = null;
  let drafts: Draft[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) drafts = await listDrafts(supabase, workspaceId, "active");
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DraftRepositoryError
    ) {
      console.error("Draft library failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected draft library failure", error);
    }
  }

  if (!persistenceFailed && !workspace) notFound();

  if (!workspace) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <DraftStatusNotice status="persistence-error" />
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

  const workspaceArchived = workspace.archivedAt !== null;
  const status = persistenceFailed
    ? "persistence-error"
    : workspaceArchived
      ? "workspace-archived"
      : firstValue(query.status);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/workspaces/${workspace.id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى مساحة العمل
          </Link>
          <Link
            href={`/workspaces/${workspace.id}/drafts/archived`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <Archive className="h-4 w-4" aria-hidden="true" />
            أرشيف المسودات
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">
              حوّل الإجابات إلى عمل قابل للاستخدام
            </p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              مسودات {workspace.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              أنشئ ملخصاً أو رسالة أو مذكرة من إجابة مكتملة، ثم حررها واحفظ
              نسخها وراجع مصدرها قبل التصدير أو المشاركة.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            نسخ محفوظة · مصدر واضح
          </div>
        </div>
      </header>

      <DraftStatusNotice status={status} />

      {drafts.length > 0 ? (
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">العمل النشط</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                {drafts.length} مسودة قابلة للمتابعة
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {drafts.map((draft) => (
              <DraftCard key={draft.id} draft={draft} />
            ))}
          </div>
        </section>
      ) : (
        <section className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileClock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-arabic-heading text-2xl font-semibold">
            لا توجد مسودة نشطة
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-8 text-muted-foreground">
            {workspaceArchived
              ? "مساحة العمل مؤرشفة. يمكنك مراجعة المسودات المؤرشفة وتصديرها، لكن إنشاء عمل جديد يحتاج إلى استعادة المساحة."
              : workspace.role === "viewer"
                ? "لم يشارك معك محرر أو مالك مسودة في هذه المساحة بعد."
                : "افتح محادثة فيها إجابة مكتملة، ثم حوّلها إلى ملخص أو مقارنة أو رسالة أو مذكرة أو قائمة عمل أو ملاحظة قرار."}
          </p>
          {!workspaceArchived && workspace.role !== "viewer" && (
            <Link
              href={`/workspaces/${workspace.id}/conversations`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              فتح المحادثات
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
