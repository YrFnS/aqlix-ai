import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  Hash,
  ShieldCheck,
} from "lucide-react";
import type { DocumentDetail, WorkspaceAccess } from "@iraqi-ai/types";
import { DocumentDeleteButton } from "@/components/documents/document-delete-button";
import { DocumentStatusNotice } from "@/components/documents/document-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  getWorkspaceDocument,
  DocumentRepositoryError,
} from "@/lib/documents/repository";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "مقاطع المصدر",
  description: "راجع المقاطع المحفوظة التي يمكن فتحها والاستشهاد بها.",
};

type PageParams = Promise<{ workspaceId: string; attachmentId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MiB`;
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function locatorFor(source: DocumentDetail["sources"][number]): string {
  if (source.pageNumber) return `صفحة ${source.pageNumber}`;
  if (source.startLine && source.endLine) {
    return `الأسطر ${source.startLine}–${source.endLine}`;
  }
  return `المقطع ${source.ordinal + 1}`;
}

function statusLabel(status: DocumentDetail["attachment"]["status"]): string {
  if (status === "ready") return "جاهز للاستخدام";
  if (status === "failed") return "فشلت المعالجة";
  return "قيد المعالجة";
}

export default async function SourceDocumentPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId, attachmentId } = await params;
  const query = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/sources/${attachmentId}`,
  );

  let workspace: WorkspaceAccess | null = null;
  let document: DocumentDetail | null = null;
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      document = await getWorkspaceDocument(supabase, workspaceId, attachmentId);
    }
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DocumentRepositoryError
    ) {
      console.error("Source document page failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected source document page failure", error);
    }
  }

  if (!persistenceFailed && (!workspace || !document)) notFound();

  if (!workspace || !document) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <DocumentStatusNotice status="persistence-error" />
        <Link
          href={`/workspaces/${workspaceId}/sources`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى المصادر
        </Link>
      </div>
    );
  }

  const workspaceArchived = workspace.archivedAt !== null;
  const canWrite =
    !workspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");
  const attachment = document.attachment;
  const latestRun = document.processingRuns[0] ?? null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <DocumentStatusNotice
        status={
          persistenceFailed
            ? "persistence-error"
            : workspaceArchived
              ? "workspace-archived"
              : firstValue(query.status)
        }
      />

      <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-foreground p-6 text-background sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Link
              href={`/workspaces/${workspace.id}/sources`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              كل المصادر
            </Link>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold text-background/80">
                {statusLabel(attachment.status)}
              </span>
              <span className="rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                {attachment.mediaType}
              </span>
              <span className="rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                {attachment.sourceCount} مقطع
              </span>
            </div>

            <h1
              dir="auto"
              className="mt-5 break-words font-arabic-heading text-3xl font-semibold sm:text-5xl"
            >
              {attachment.fileName}
            </h1>
            <p className="mt-4 text-sm leading-8 text-background/65 sm:text-base">
              المحتوى محفوظ كنص آمن ومقسّم إلى مقاطع ثابتة يمكنك فتحها والرجوع
              إليها من الإجابات والمسودات.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {attachment.status === "ready" && (
              <Link
                href={`/api/v1/workspaces/${workspace.id}/sources/${attachment.id}/download`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                تنزيل الملف
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-border/70 bg-card p-5">
          <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-4 text-xs text-muted-foreground">حجم الملف</p>
          <p dir="ltr" className="mt-1 font-semibold">
            {formatBytes(attachment.byteSize)}
          </p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5">
          <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-4 text-xs text-muted-foreground">تاريخ الإضافة</p>
          <p className="mt-1 text-sm font-semibold">
            {formatTimestamp(attachment.createdAt)}
          </p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5">
          <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-4 text-xs text-muted-foreground">المقاطع المتاحة</p>
          <p className="mt-1 font-semibold">{attachment.sourceCount}</p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-4 text-xs text-muted-foreground">الوصول</p>
          <p className="mt-1 text-sm font-semibold">خاص بمساحة العمل</p>
        </div>
      </section>

      {attachment.status === "failed" && (
        <section className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-destructive/10 p-3 text-destructive">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-destructive">
                {attachment.failureCode ?? "PROCESSING_FAILED"}
              </p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                لم يصبح الملف مصدراً جاهزاً
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {attachment.failureReason ??
                  "فشلت معالجة الملف ولم تُنشأ مقاطع بديلة."}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <div>
          <p className="text-sm font-semibold text-primary">المقاطع المستخرجة</p>
          <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
            راجع النص الذي يمكن الاستشهاد به
          </h2>
        </div>

        {document.sources.length > 0 ? (
          <div className="mt-6 space-y-4">
            {document.sources.map((source) => (
              <article
                key={source.id}
                id={`source-${source.id}`}
                className="scroll-mt-28 rounded-3xl border border-border/70 bg-card p-5 target:border-primary target:ring-2 target:ring-primary/20 sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    S{source.ordinal + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {locatorFor(source)}
                  </span>
                </div>
                <pre
                  dir="auto"
                  className="mt-5 whitespace-pre-wrap break-words font-sans text-sm leading-8 text-foreground"
                >
                  {source.content}
                </pre>
                <a
                  href={`#source-${source.id}`}
                  className="mt-5 inline-flex min-h-10 items-center text-xs font-semibold text-primary"
                >
                  نسخ رابط هذا المقطع
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm leading-7 text-muted-foreground">
            لا توجد مقاطع محفوظة لهذا الملف.
          </div>
        )}
      </section>

      <details className="group rounded-3xl border border-border/70 bg-card">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 [&::-webkit-details-marker]:hidden">
          التفاصيل التقنية وسجل المعالجة
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="space-y-5 border-t border-border/70 p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-secondary/45 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Hash className="h-4 w-4" aria-hidden="true" />
                SHA-256
              </div>
              <p dir="ltr" className="mt-2 break-all font-mono text-xs">
                {attachment.contentSha256 ?? "غير متاح"}
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/45 p-4">
              <p className="text-xs text-muted-foreground">نسخة المعالج</p>
              <p dir="ltr" className="mt-2 break-all font-mono text-xs">
                {latestRun
                  ? `${latestRun.processor}@${latestRun.processorVersion}`
                  : attachment.processorVersion ?? "غير متاح"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {document.processingRuns.map((run) => (
              <div
                key={run.id}
                className="rounded-2xl border border-border/70 bg-background p-4 text-sm"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-semibold">
                    المحاولة {run.attempt} · {run.status}
                  </span>
                  <span dir="ltr" className="text-xs text-muted-foreground">
                    {run.processor}@{run.processorVersion}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {run.sourceCount} مقطع · {run.characterCount} حرف
                </p>
                {run.failureCode && (
                  <p className="mt-2 text-xs text-destructive">
                    {run.failureCode} · {run.failureMessage}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </details>

      <section className="rounded-3xl border border-destructive/25 bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold text-destructive">حذف المصدر</p>
        <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
          احذف الملف والمقاطع المرتبطة به
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          لا تُحذف بيانات المصدر قبل نجاح إزالة الملف الخاص. إذا تعذر حذف الملف،
          يبقى المصدر ظاهراً حتى تستطيع إعادة المحاولة بدلاً من فقدان أثره.
        </p>
        <div className="mt-6">
          {canWrite ? (
            <DocumentDeleteButton
              workspaceId={workspace.id}
              attachmentId={attachment.id}
              fileName={attachment.fileName}
            />
          ) : (
            <div className="rounded-2xl bg-secondary/55 p-4 text-sm leading-7 text-muted-foreground">
              {workspaceArchived
                ? "استعد مساحة العمل قبل حذف مصدر."
                : "عضوية القراءة لا تسمح بالحذف."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
