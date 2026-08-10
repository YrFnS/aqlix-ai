import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowRight,
  FileClock,
  GitBranch,
  Quote,
} from "lucide-react";
import type { DraftDetail, WorkspaceAccess } from "@iraqi-ai/types";
import { DraftEditor } from "@/components/drafts/draft-editor";
import { DraftStatusNotice } from "@/components/drafts/draft-status-notice";
import { ClientReadyBoundary } from "@/components/system/client-ready-boundary";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  getDraftDetail,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "مسودة",
  description: "Editable durable draft with versions, provenance, and proposals.",
};

type PageParams = Promise<{ workspaceId: string; draftId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const kindLabels: Record<DraftDetail["draft"]["kind"], string> = {
  freeform: "مسودة حرة",
  summary: "ملخص",
  comparison: "مقارنة",
  email: "رسالة",
  memo: "مذكرة",
  checklist: "قائمة عمل",
  decision_note: "ملاحظة قرار",
};

export default async function DraftPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId, draftId } = await params;
  const query = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/drafts/${draftId}`,
  );

  let workspace: WorkspaceAccess | null = null;
  let detail: DraftDetail | null = null;
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) detail = await getDraftDetail(supabase, workspaceId, draftId);
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DraftRepositoryError
    ) {
      console.error("Draft canvas failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected draft canvas failure", error);
    }
  }

  if (!persistenceFailed && (!workspace || !detail)) notFound();

  if (!workspace || !detail) {
    return (
      <PageShell width="default">
        <DraftStatusNotice status="persistence-error" />
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href={`/workspaces/${workspaceId}/drafts`}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى المسودات
          </Link>
        </Button>
      </PageShell>
    );
  }

  const workspaceArchived = workspace.archivedAt !== null;
  const canManageLifecycle =
    !workspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");
  const canEdit = canManageLifecycle && detail.draft.status === "active";
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : workspaceArchived
      ? "workspace-archived"
      : firstValue(query.status);
  const archived = detail.draft.status === "archived";

  return (
    <PageShell width="fluid" className="space-y-4">
      <DraftStatusNotice status={visibleStatus} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="ghost" className="rounded-xl">
            <Link
              href={`/workspaces/${workspace.id}/drafts${
                archived ? "/archived" : ""
              }`}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              {archived ? "الأرشيف" : "كل المسودات"}
            </Link>
          </Button>
          <span className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-primary">
            {kindLabels[detail.draft.kind]}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-ink-muted">
            {archived ? (
              <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {archived ? "مؤرشفة" : "نشطة"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-surface-raised px-3 py-1.5">
            <GitBranch className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {detail.draft.versionCount.toLocaleString("ar-IQ")} إصدار
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-surface-raised px-3 py-1.5">
            <Quote className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {detail.draft.provenanceCount.toLocaleString("ar-IQ")} مرجع
          </span>
        </div>
      </div>

      <ClientReadyBoundary name="draft-editor">
        <DraftEditor
          workspaceId={workspace.id}
          initialDetail={detail}
          canEdit={canEdit}
          canManageLifecycle={canManageLifecycle}
          workspaceArchived={workspaceArchived}
        />
      </ClientReadyBoundary>
    </PageShell>
  );
}
