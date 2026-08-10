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
  ShieldCheck,
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <DraftStatusNotice status={visibleStatus} />

      <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-foreground p-6 text-background sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/workspaces/${workspace.id}/drafts${
                  detail.draft.status === "archived" ? "/archived" : ""
                }`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                {detail.draft.status === "archived"
                  ? "أرشيف المسودات"
                  : "كل المسودات"}
              </Link>
              <Link
                href={`/workspaces/${workspace.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 text-sm font-semibold text-background/75 transition-colors hover:bg-background/10 hover:text-background"
              >
                مساحة العمل
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold text-background/80">
                {kindLabels[detail.draft.kind]}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                {detail.draft.status === "archived" ? (
                  <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {detail.draft.status === "archived" ? "مؤرشفة" : "نشطة"}
              </span>
              {workspaceArchived && (
                <span className="rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                  مساحة العمل مؤرشفة
                </span>
              )}
            </div>

            <h1
              dir="auto"
              className="mt-5 break-words font-arabic-heading text-3xl font-semibold sm:text-5xl"
            >
              {detail.draft.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-background/65 sm:text-base">
              حرر النص واحفظ نسخة جديدة عند كل تغيير مهم. يمكنك الرجوع إلى النسخ
              السابقة وفتح المصادر المرتبطة ثم تصدير النتيجة عندما تصبح جاهزة.
            </p>

            {detail.provenance.some(
              (item) => item.attachmentId !== null && item.sourceId !== null,
            ) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {detail.provenance.slice(0, 3).map((item) =>
                  item.attachmentId && item.sourceId ? (
                    <Link
                      key={item.id}
                      href={`/workspaces/${workspace.id}/sources/${item.attachmentId}#source-${item.sourceId}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 text-xs font-semibold text-background transition-colors hover:bg-background/15"
                      aria-label={`فتح المصدر ${item.label} من ${item.fileNameSnapshot}`}
                    >
                      فتح المصدر {item.label}
                      <span dir="auto" className="max-w-48 truncate text-background/65">
                        {item.fileNameSnapshot}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  ) : null,
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-2xl border border-background/15 bg-background/5 px-4 py-3">
              <GitBranch className="mx-auto h-4 w-4" aria-hidden="true" />
              <p className="mt-2 font-semibold">{detail.draft.versionCount}</p>
              <p className="mt-1 text-background/55">نسخ محفوظة</p>
            </div>
            <div className="rounded-2xl border border-background/15 bg-background/5 px-4 py-3">
              <Quote className="mx-auto h-4 w-4" aria-hidden="true" />
              <p className="mt-2 font-semibold">{detail.draft.provenanceCount}</p>
              <p className="mt-1 text-background/55">مصادر</p>
            </div>
            <div className="rounded-2xl border border-background/15 bg-background/5 px-4 py-3">
              <ShieldCheck className="mx-auto h-4 w-4" aria-hidden="true" />
              <p className="mt-2 font-semibold">خاص</p>
              <p className="mt-1 text-background/55">بالمساحة</p>
            </div>
          </div>
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
