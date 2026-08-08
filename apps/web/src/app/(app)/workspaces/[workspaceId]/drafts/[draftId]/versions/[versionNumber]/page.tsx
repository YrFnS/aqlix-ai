import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  FileText,
  GitBranch,
  RotateCcw,
} from "lucide-react";
import type { Draft, DraftVersion, WorkspaceAccess } from "@iraqi-ai/types";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  getDraft,
  getDraftVersion,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "إصدار مسودة",
  description: "Read-only immutable draft version snapshot.",
};

type PageParams = Promise<{
  workspaceId: string;
  draftId: string;
  versionNumber: string;
}>;

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DraftVersionPage({
  params,
}: {
  params: PageParams;
}) {
  const { workspaceId, draftId, versionNumber } = await params;
  const parsedVersion = Number.parseInt(versionNumber, 10);
  if (!Number.isInteger(parsedVersion) || parsedVersion < 1) notFound();

  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/drafts/${draftId}/versions/${versionNumber}`,
  );
  let workspace: WorkspaceAccess | null = null;
  let draft: Draft | null = null;
  let version: DraftVersion | null = null;
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      [draft, version] = await Promise.all([
        getDraft(supabase, workspaceId, draftId),
        getDraftVersion(supabase, workspaceId, draftId, parsedVersion),
      ]);
    }
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DraftRepositoryError
    ) {
      console.error("Draft version inspector failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected draft version inspector failure", error);
    }
  }

  if (!persistenceFailed && (!workspace || !draft || !version)) notFound();
  if (!workspace || !draft || !version) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border border-destructive/25 bg-card p-8 text-center">
        <h1 className="font-arabic-heading text-3xl font-semibold">
          تعذر تحميل لقطة الإصدار
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          لم تُعرض لقطة بديلة أو محتوى مثال.
        </p>
        <Link
          href={`/workspaces/${workspaceId}/drafts/${draftId}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى المسودة
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <Link
          href={`/workspaces/${workspace.id}/drafts/${draft.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى المسودة
        </Link>

        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Immutable snapshot
            </p>
            <h1 className="mt-2 font-arabic-heading text-3xl font-semibold sm:text-4xl">
              الإصدار {version.versionNumber}
            </h1>
            <p dir="auto" className="mt-3 text-lg font-semibold">
              {version.title}
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <GitBranch className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {formatTimestamp(version.createdAt)}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1.5">
            {version.sourceKind}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1.5">
            {version.kind}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1.5">
            {version.direction}
          </span>
          {version.restoredFromVersion && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              restored from v{version.restoredFromVersion}
            </span>
          )}
        </div>
      </header>

      <article className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-secondary p-3 text-primary">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Read-only</p>
            <h2 className="font-arabic-heading text-xl font-semibold">
              محتوى اللقطة
            </h2>
          </div>
        </div>
        <pre
          dir={version.direction}
          className="mt-6 whitespace-pre-wrap break-words rounded-3xl bg-secondary/35 p-5 font-sans text-sm leading-8"
        >
          {version.content}
        </pre>
      </article>

      <section className="rounded-3xl border border-border/70 bg-secondary/35 p-5 text-sm leading-7 text-muted-foreground">
        هذه اللقطة غير قابلة للتعديل. استعادتها من صفحة المسودة ينشئ إصداراً
        جديداً ولا يغيّر التاريخ السابق.
      </section>
    </div>
  );
}
