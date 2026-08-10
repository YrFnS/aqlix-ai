import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowRight,
  ExternalLink,
  FileClock,
  GitBranch,
  Quote,
} from "lucide-react";
import type { DraftDetail, WorkspaceAccess } from "@iraqi-ai/types";
import { DraftEditor } from "@/components/drafts/draft-editor";
import { DraftStatusNotice } from "@/components/drafts/draft-status-notice";
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
  description:
    "حرر مسودتك، راجع نسخها ومصادرها، ثم صدّرها عندما تصبح جاهزة.",
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
      <div className="mx-auto max-w-5xl space-y-6">
        <DraftStatusNotice status="persistence-error" />
        <Link
          href={`/workspaces/${workspaceId}/drafts`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى المسودات
        </Link>
      </div>
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
  const liveProvenance = detail.provenance.filter(
    (item) => item.attachmentId !== null && item.sourceId !== null,
  );

  return (
    <div className="mx-auto max-w-[90rem] space-y-5">
      <DraftStatusNotice status={visibleStatus} />

      <header className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/workspaces/${workspace.id}/drafts${
                  detail.draft.status === "archived" ? "/archived" : ""
                }`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                {detail.draft.status === "archived"
                  ? "أرشيف المسودات"
                  : "كل المسودات"}
              </Link>
              <Link
                href={`/workspaces/${workspace.id}`}
                className="inline-flex min-h-10 items-center rounded-full px-4 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                مساحة العمل
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                {kindLabels[detail.draft.kind]}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                {detail.draft.status === "archived" ? (
                  <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {detail.draft.status === "archived" ? "مؤرشفة" : "نشطة"}
              </span>
              {workspaceArchived && (
                <span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  مساحة العمل مؤرشفة
                </span>
              )}
            </div>

            <h1
              dir="auto"
              className="mt-4 break-words font-arabic-heading text-3xl font-semibold sm:text-4xl"
            >
              {detail.draft.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              حرر النص واحفظ نسخة جديدة عند كل تغيير مهم. تبقى المصادر والنسخ
              السابقة والتصدير قريبة، من دون أن تزاحم مساحة الكتابة.
            </p>

            {liveProvenance.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {liveProvenance.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/workspaces/${workspace.id}/sources/${item.attachmentId}#source-${item.sourceId}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-3 text-xs font-semibold transition-colors hover:border-primary/40 hover:bg-secondary"
                    aria-label={`فتح المصدر ${item.label} من ${item.fileNameSnapshot}`}
                  >
                    فتح المصدر {item.label}
                    <span
                      dir="auto"
                      className="max-w-44 truncate text-muted-foreground"
                    >
                      {item.fileNameSnapshot}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-auto lg:min-w-[22rem]">
            <div className="rounded-2xl bg-secondary/55 px-4 py-3">
              <dt className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                الإصدارات
              </dt>
              <dd className="mt-1 text-lg font-semibold">
                {detail.draft.versionCount}
              </dd>
            </div>
            <div className="rounded-2xl bg-secondary/55 px-4 py-3">
              <dt className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Quote className="h-3.5 w-3.5" aria-hidden="true" />
                المصادر
              </dt>
              <dd className="mt-1 text-lg font-semibold">
                {detail.draft.provenanceCount}
              </dd>
            </div>
            <div className="col-span-2 rounded-2xl bg-secondary/55 px-4 py-3 sm:col-span-1">
              <dt className="text-xs text-muted-foreground">آخر حفظ</dt>
              <dd className="mt-1 text-sm font-semibold">
                الإصدار {detail.draft.currentVersion}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <DraftEditor
        workspaceId={workspace.id}
        initialDetail={detail}
        canEdit={canEdit}
        canManageLifecycle={canManageLifecycle}
        workspaceArchived={workspaceArchived}
      />
    </div>
  );
}
