import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpLeft,
  FileSearch,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import type {
  Attachment,
  SourceSearchResult,
  WorkspaceAccess,
} from "@iraqi-ai/types";
import { DocumentStatusNotice } from "@/components/documents/document-status-notice";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  listWorkspaceDocuments,
  searchWorkspaceSources,
  DocumentRepositoryError,
} from "@/lib/documents/repository";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "المصادر",
  description: "Private workspace documents and inspectable text passages.",
};

type PageParams = Promise<{ workspaceId: string }>;
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

const statusLabels: Record<Attachment["status"], string> = {
  pending: "بانتظار المعالجة",
  processing: "قيد المعالجة",
  ready: "جاهز",
  failed: "فشل",
  deleted: "محذوف",
};

function DocumentCard({ document }: { document: Attachment }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
              document.status === "ready"
                ? "bg-primary/10 text-primary"
                : document.status === "failed"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-muted-foreground"
            }`}
          >
            {statusLabels[document.status]}
          </span>
          <h2
            dir="auto"
            className="mt-4 break-words font-arabic-heading text-xl font-semibold"
          >
            {document.fileName}
          </h2>
        </div>
        <div className="rounded-2xl bg-secondary p-3 text-primary">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt>الحجم</dt>
          <dd dir="ltr" className="mt-1 font-semibold text-foreground">
            {formatBytes(document.byteSize)}
          </dd>
        </div>
        <div className="rounded-2xl bg-secondary/55 p-3">
          <dt>المقاطع</dt>
          <dd className="mt-1 font-semibold text-foreground">
            {document.sourceCount}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        {formatTimestamp(document.createdAt)} · {document.mediaType}
      </p>

      {document.status === "failed" && (
        <div className="mt-4 rounded-2xl border border-destructive/25 bg-destructive/5 p-3 text-xs leading-6">
          <div className="flex gap-2 text-destructive">
            <AlertTriangle
              className="mt-1 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold">
                {document.failureCode ?? "PROCESSING_FAILED"}
              </p>
              {document.failureReason && (
                <p className="mt-1 text-muted-foreground">
                  {document.failureReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Link
        href={`/workspaces/${document.workspaceId}/sources/${document.id}`}
        className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 border-t border-border/70 pt-5 text-sm font-semibold text-primary"
      >
        فتح المقاطع والحالة
        <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function SearchResultCard({
  workspaceId,
  result,
}: {
  workspaceId: string;
  result: SourceSearchResult;
}) {
  const locator = result.pageNumber
    ? `صفحة ${result.pageNumber}`
    : result.startLine && result.endLine
      ? `الأسطر ${result.startLine}–${result.endLine}`
      : `المقطع ${result.ordinal + 1}`;

  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p dir="auto" className="font-semibold">
            {result.fileName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{locator}</p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] text-muted-foreground">
          rank {result.rank.toFixed(3)}
        </span>
      </div>
      <p
        dir="auto"
        className="mt-4 line-clamp-6 whitespace-pre-wrap text-sm leading-8 text-muted-foreground"
      >
        {result.content}
      </p>
      <Link
        href={`/workspaces/${workspaceId}/sources/${result.attachmentId}#source-${result.sourceId}`}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
      >
        فتح المقطع الداعم
        <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default async function WorkspaceSourcesPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId } = await params;
  const queryParams = await searchParams;
  const query = firstValue(queryParams.q)?.trim() ?? "";
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/sources`,
  );

  let workspace: WorkspaceAccess | null = null;
  let documents: Attachment[] = [];
  let results: SourceSearchResult[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      documents = await listWorkspaceDocuments(supabase, workspaceId);
      if (query) {
        results = await searchWorkspaceSources(supabase, {
          workspaceId,
          query,
          limit: 12,
        });
      }
    }
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DocumentRepositoryError
    ) {
      console.error("Workspace source page failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected workspace source page failure", error);
    }
  }

  if (!persistenceFailed && !workspace) notFound();

  if (!workspace) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <DocumentStatusNotice status="persistence-error" />
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
  const canWrite =
    !workspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : workspaceArchived
      ? "workspace-archived"
      : firstValue(queryParams.status);

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
              P3 · Private documents and inspectable passages
            </p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              مصادر {workspace.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              الملفات أصلية وخاصة، والمقاطع قابلة للبحث والفتح بسطر حقيقي. يدعم
              هذا المسار TXT وMarkdown بصيغة UTF-8 فقط؛ لا يدّعي دعم PDF أو OCR.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Private bucket · RLS · 2 MiB
          </div>
        </div>
      </header>

      <DocumentStatusNotice status={visibleStatus} />

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">إضافة مصدر</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                ملف خاص ومقاطع حقيقية
              </h2>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <FileSearch className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-7">
            <DocumentUploadForm
              workspaceId={workspace.id}
              canWrite={canWrite}
              workspaceArchived={workspaceArchived}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-secondary/55 p-4 text-xs leading-6 text-muted-foreground">
            لا تُرسل الملفات إلى نموذج أثناء الاستخراج. يتم فك UTF-8 وتقسيم النص
            بشكل حتمي، ثم تخزين المقاطع وفهرستها داخل PostgreSQL.
          </div>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">البحث في المقاطع</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                افتح الدليل نفسه
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {documents.length} مستند
            </p>
          </div>

          <form method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="source-query" className="sr-only">
              البحث في المصادر
            </label>
            <input
              id="source-query"
              name="q"
              defaultValue={query}
              maxLength={500}
              dir="auto"
              placeholder="ابحث عن كلمة أو عبارة عربية أو English"
              className="min-h-12 flex-1 rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              بحث
            </button>
          </form>

          {query ? (
            results.length > 0 ? (
              <div className="mt-7 space-y-4">
                {results.map((result) => (
                  <SearchResultCard
                    key={result.sourceId}
                    workspaceId={workspace.id}
                    result={result}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-3xl border border-dashed border-border bg-secondary/35 p-8 text-center">
                <Search
                  className="mx-auto h-6 w-6 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-arabic-heading text-xl font-semibold">
                  لا يوجد مقطع مطابق
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  لم تُنشأ إجابة عامة بديلة. غيّر عبارة البحث أو أضف مستنداً
                  يحتوي على السياق المطلوب.
                </p>
              </div>
            )
          ) : (
            <div className="mt-7 rounded-3xl bg-secondary/35 p-6 text-sm leading-8 text-muted-foreground">
              يستخدم البحث فهرس PostgreSQL داخل مساحة العمل فقط. لا توجد نتائج
              من الإنترنت أو من مساحات أخرى.
            </div>
          )}
        </section>
      </div>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">المستندات المحفوظة</p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              الحالة والمقاطع بعد إعادة التحميل
            </h2>
          </div>
        </div>

        {documents.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <FileText className="h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-arabic-heading text-xl font-semibold">
              لا توجد مصادر محفوظة
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              {canWrite
                ? "ارفع ملف TXT أو Markdown حقيقياً. لن تظهر بيانات مثال أو نتائج مفبركة."
                : "لم يشارك معك مستند محفوظ في هذه المساحة بعد."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
