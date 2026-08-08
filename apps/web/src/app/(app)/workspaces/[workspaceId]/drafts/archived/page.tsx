import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowRight, FileClock } from "lucide-react";
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
  title: "أرشيف المسودات",
  description: "Archived reusable drafts and immutable history.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ArchivedDraftsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/drafts/archived`,
  );

  let workspace: WorkspaceAccess | null = null;
  let drafts: Draft[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) drafts = await listDrafts(supabase, workspaceId, "archived");
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DraftRepositoryError
    ) {
      console.error("Archived draft library failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected archived draft library failure", error);
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

  const status = persistenceFailed
    ? "persistence-error"
    : workspace.archivedAt
      ? "workspace-archived"
      : firstValue(query.status);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/workspaces/${workspace.id}/drafts`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            المسودات النشطة
          </Link>
          <Link
            href={`/workspaces/${workspace.id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            مساحة العمل
          </Link>
        </div>
        <p className="mt-7 text-sm font-semibold text-primary">P4 · Archive</p>
        <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
          أرشيف مسودات {workspace.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
          المسودة المؤرشفة تبقى قابلة للقراءة والتصدير مع كل إصداراتها ومنشأها.
          لا يمكن تعديلها أو إرسالها إلى المزود قبل استعادتها.
        </p>
      </header>

      <DraftStatusNotice status={status} />

      {drafts.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
        </section>
      ) : (
        <section className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <Archive className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 font-arabic-heading text-2xl font-semibold">
            الأرشيف فارغ
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
            لا توجد مسودة مؤرشفة في هذه المساحة. نقل المسودة إلى الأرشيف لا
            يحذف محتواها أو إصداراتها.
          </p>
          <Link
            href={`/workspaces/${workspace.id}/drafts`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold"
          >
            <FileClock className="h-4 w-4" aria-hidden="true" />
            عرض العمل النشط
          </Link>
        </section>
      )}
    </div>
  );
}
