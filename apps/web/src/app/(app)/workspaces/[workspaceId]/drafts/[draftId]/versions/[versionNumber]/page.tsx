import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  FileText,
  GitBranch,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { Draft, DraftVersion, WorkspaceAccess } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
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
      <PageShell width="compact">
        <Surface
          tone="raised"
          elevation="xs"
          radius="2xl"
          padding="lg"
          className="border-destructive/25 text-center"
        >
          <h1 className="font-arabic-heading text-3xl font-semibold">
            تعذر تحميل لقطة الإصدار
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            لم تُعرض لقطة بديلة أو محتوى مثال.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link href={`/workspaces/${workspaceId}/drafts/${draftId}`}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              العودة إلى المسودة
            </Link>
          </Button>
        </Surface>
      </PageShell>
    );
  }

  return (
    <PageShell width="default" className="space-y-8">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            لقطة غير قابلة لإعادة الكتابة
          </span>
        }
        title={
          <span>
            الإصدار {version.versionNumber.toLocaleString("ar-IQ")}
          </span>
        }
        description={<span dir="auto">{version.title}</span>}
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/workspaces/${workspace.id}/drafts/${draft.id}`}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              العودة إلى المسودة
            </Link>
          </Button>
        }
      />

      <Surface
        tone="muted"
        elevation="none"
        radius="xl"
        padding="sm"
      >
        <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1.5 shadow-surface-xs">
            <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {formatTimestamp(version.createdAt)}
          </span>
          <span className="rounded-full bg-surface-raised px-3 py-1.5 shadow-surface-xs">
            {version.sourceKind}
          </span>
          <span className="rounded-full bg-surface-raised px-3 py-1.5 shadow-surface-xs">
            {version.kind}
          </span>
          <span className="rounded-full bg-surface-raised px-3 py-1.5 shadow-surface-xs">
            {version.direction}
          </span>
          {version.restoredFromVersion ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1.5 shadow-surface-xs">
              <RotateCcw className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              restored from v{version.restoredFromVersion}
            </span>
          ) : null}
        </div>
      </Surface>

      <Surface
        tone="raised"
        elevation="sm"
        radius="2xl"
        padding="none"
        className="overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line/70 bg-surface-sunken/55 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-primary">Read-only</p>
              <h2 className="mt-1 font-arabic-heading text-lg font-semibold">
                محتوى اللقطة
              </h2>
            </div>
          </div>
          <span className="rounded-full border border-line/70 bg-surface-raised px-3 py-1 text-xs font-semibold text-ink-muted">
            v{version.versionNumber}
          </span>
        </div>
        <pre
          dir={version.direction}
          className="min-h-[28rem] whitespace-pre-wrap break-words px-5 py-7 font-sans text-sm leading-8 text-foreground sm:px-8 sm:py-9 sm:text-[0.95rem] sm:leading-9"
        >
          {version.content}
        </pre>
      </Surface>

      <Surface
        tone="muted"
        elevation="none"
        radius="xl"
        padding="sm"
      >
        <div className="flex items-start gap-3 text-sm leading-7 text-ink-muted">
          <ShieldCheck
            className="mt-1 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            هذه اللقطة غير قابلة للتعديل. استعادتها من مساحة تحرير المسودة تنشئ
            إصداراً جديداً ولا تغيّر التاريخ السابق.
          </p>
        </div>
      </Surface>
    </PageShell>
  );
}
