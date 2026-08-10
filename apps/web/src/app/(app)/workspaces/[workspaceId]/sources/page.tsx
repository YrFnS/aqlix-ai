import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpLeft,
  CheckCircle2,
  FileSearch,
  FileText,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import type {
  Attachment,
  SourceSearchResult,
  WorkspaceAccess,
} from "@iraqi-ai/types";
import {
  MotionSurface,
  Stagger,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { DocumentStatusNotice } from "@/components/documents/document-status-notice";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageSection,
  PageShell,
} from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
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
  ready: "جاهز للبحث",
  failed: "تعذرت المعالجة",
  deleted: "محذوف",
};

function DocumentCard({ document }: { document: Attachment }) {
  const ready = document.status === "ready";
  const failed = document.status === "failed";

  return (
    <StaggerItem className="h-full">
      <MotionSurface className="h-full">
        <Link
          href={`/workspaces/${document.workspaceId}/sources/${document.id}`}
          className="group block h-full rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          aria-label={`فتح المصدر ${document.fileName}`}
        >
          <Surface
            tone="raised"
            elevation="xs"
            radius="2xl"
            padding="md"
            className="flex h-full flex-col transition-[border-color,box-shadow] duration-base ease-standard group-hover:border-primary/25 group-hover:shadow-surface-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
                    ready
                      ? "bg-brand-soft text-primary"
                      : failed
                        ? "bg-destructive/10 text-destructive"
                        : "bg-surface-sunken text-ink-muted"
                  }`}
                >
                  {ready ? (
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  ) : failed ? (
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-current"
                      aria-hidden="true"
                    />
                  )}
                  {statusLabels[document.status]}
                </span>
                <h2
                  dir="auto"
                  className="mt-4 line-clamp-2 break-words font-arabic-heading text-xl font-semibold"
                >
                  {document.fileName}
                </h2>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-surface-sunken text-primary">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-surface-sunken/70 p-3">
                <dt className="text-ink-subtle">الحجم</dt>
                <dd dir="ltr" className="mt-1 font-semibold text-foreground">
                  {formatBytes(document.byteSize)}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-sunken/70 p-3">
                <dt className="text-ink-subtle">المقاطع</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {document.sourceCount.toLocaleString("ar-IQ")}
                </dd>
              </div>
            </dl>

            {failed ? (
              <p className="mt-4 line-clamp-2 text-xs leading-6 text-destructive">
                {document.failureReason ??
                  "فشلت المعالجة ولم تُنشأ مقاطع بديلة."}
              </p>
            ) : (
              <p className="mt-4 text-xs leading-6 text-ink-muted">
                {formatTimestamp(document.createdAt)} · {document.mediaType}
              </p>
            )}

            <span className="mt-auto flex items-center justify-between border-t border-line/70 pt-4 text-sm font-semibold text-primary">
              فتح المستند والمقاطع
              <ArrowUpLeft
                className="h-4 w-4 transition-transform duration-fast group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </Surface>
        </Link>
      </MotionSurface>
    </StaggerItem>
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
    <Link
      href={`/workspaces/${workspaceId}/sources/${result.attachmentId}#source-${result.sourceId}`}
      className="group block rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
      aria-label={`فتح ${locator} من ${result.fileName}`}
    >
      <Surface
        tone="raised"
        elevation="xs"
        radius="2xl"
        padding="md"
        className="transition-[border-color,box-shadow] duration-fast group-hover:border-primary/25 group-hover:shadow-surface-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p dir="auto" className="truncate font-semibold text-foreground">
              {result.fileName}
            </p>
            <p className="mt-1 text-xs text-ink-muted">{locator}</p>
          </div>
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
            مقطع مطابق
          </span>
        </div>
        <p
          dir="auto"
          className="mt-4 line-clamp-5 whitespace-pre-wrap text-sm leading-8 text-ink-muted"
        >
          {result.content}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">
          فحص المقطع داخل المستند
          <ArrowUpLeft
            className="h-3.5 w-3.5 transition-transform duration-fast group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </Surface>
    </Link>
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
      <PageShell width="default">
        <DocumentStatusNotice status="persistence-error" />
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href="/workspaces">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى المساحات
          </Link>
        </Button>
      </PageShell>
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
  const readyCount = documents.filter(
    (document) => document.status === "ready",
  ).length;
  const failedCount = documents.filter(
    (document) => document.status === "failed",
  ).length;
  const passageCount = documents.reduce(
    (total, document) => total + document.sourceCount,
    0,
  );

  return (
    <PageShell width="wide" className="space-y-8">
      <PageHeader
        eyebrow="مكتبة المصادر"
        title="أضف السياق الذي تريد الرجوع إليه"
        description={
          <>
            ارفع مستندات نصية خاصة، ابحث في المقاطع المستخرجة، ثم افتح الدليل
            نفسه داخل المستند. يدعم هذا المسار ملفات TXT وMarkdown النصية فقط.
            دعم PDF وOCR غير متاح حالياً.
          </>
        }
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/workspaces/${workspace.id}`}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              مساحة العمل
            </Link>
          </Button>
        }
      />

      <DocumentStatusNotice status={visibleStatus} />

      <Stagger className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "المستندات", value: documents.length },
          { label: "جاهزة للبحث", value: readyCount },
          { label: "المقاطع", value: passageCount },
          { label: "تحتاج انتباهاً", value: failedCount },
        ].map((metric) => (
          <StaggerItem key={metric.label}>
            <Surface
              tone="raised"
              elevation="xs"
              radius="xl"
              padding="sm"
              className="h-full"
            >
              <p className="text-xs text-ink-muted">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {metric.value.toLocaleString("ar-IQ")}
              </p>
            </Surface>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="grid gap-8 xl:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Surface
            tone="raised"
            elevation="sm"
            radius="2xl"
            padding="md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-primary">مصدر جديد</p>
                <h2 className="mt-2 font-arabic-heading text-xl font-semibold">
                  أضف ملفاً إلى هذه المساحة
                </h2>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <FileSearch className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              يبقى الملف خاصاً بالمساحة، وتُستخرج المقاطع حتمياً من دون إرسال
              الملف إلى نموذج أثناء المعالجة.
            </p>
            <div className="mt-5">
              <DocumentUploadForm
                workspaceId={workspace.id}
                canWrite={canWrite}
                workspaceArchived={workspaceArchived}
              />
            </div>
          </Surface>

          <Surface
            tone="muted"
            elevation="none"
            radius="xl"
            padding="sm"
            className="mt-4 text-xs leading-6 text-ink-muted"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-1 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p>
                الملف خاص بهذه المساحة، والبحث يقتصر على المقاطع التي أضفتها
                أنت أو أعضاء المساحة.
              </p>
            </div>
          </Surface>
        </aside>

        <div className="min-w-0 space-y-10">
          <PageSection
            title="ابحث داخل المقاطع"
            description="استخدم كلمة أو عبارة عربية أو English للعثور على المقاطع المحفوظة وفتحها في موضعها الأصلي."
          >
            <Surface
              tone="raised"
              elevation="xs"
              radius="2xl"
              padding="sm"
            >
              <form method="get" className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="source-query" className="sr-only">
                  البحث في المصادر
                </label>
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute inset-y-0 start-4 my-auto h-4 w-4 text-ink-subtle"
                    aria-hidden="true"
                  />
                  <input
                    id="source-query"
                    name="q"
                    defaultValue={query}
                    maxLength={500}
                    dir="auto"
                    placeholder="ابحث عن كلمة أو عبارة عربية أو English"
                    className="min-h-12 w-full rounded-xl border border-input bg-surface-raised ps-11 pe-4 text-sm outline-none transition-[border-color,box-shadow] duration-fast placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                  />
                </div>
                <Button type="submit" className="rounded-xl px-5">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  بحث
                </Button>
                {query ? (
                  <Button asChild variant="ghost" className="rounded-xl">
                    <Link href={`/workspaces/${workspace.id}/sources`}>
                      <X className="h-4 w-4" aria-hidden="true" />
                      مسح
                    </Link>
                  </Button>
                ) : null}
              </form>
            </Surface>

            {query ? (
              results.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-ink-muted">
                    {results.length.toLocaleString("ar-IQ")} مقطعاً مطابقاً لعبارة
                    البحث
                  </p>
                  {results.map((result) => (
                    <SearchResultCard
                      key={result.sourceId}
                      workspaceId={workspace.id}
                      result={result}
                    />
                  ))}
                </div>
              ) : (
                <Surface
                  tone="muted"
                  elevation="none"
                  radius="2xl"
                  padding="lg"
                  className="text-center"
                >
                  <Search
                    className="mx-auto h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-arabic-heading text-xl font-semibold">
                    لا يوجد مقطع مطابق
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-muted">
                    غيّر عبارة البحث أو أضف مستنداً يحتوي على السياق المطلوب. لا
                    تُنشأ إجابة عامة بديلة عند غياب دليل محفوظ.
                  </p>
                </Surface>
              )
            ) : null}
          </PageSection>

          <PageSection
            title="المستندات"
            description="كل بطاقة تفتح المستند، مقاطعه، سجل المعالجة، وبياناته الخاصة."
            actions={
              <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-ink-muted">
                {documents.length.toLocaleString("ar-IQ")} مستند
              </span>
            }
          >
            {documents.length > 0 ? (
              <Stagger className="grid gap-4 md:grid-cols-2">
                {documents.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </Stagger>
            ) : (
              <Surface
                tone="muted"
                elevation="none"
                radius="2xl"
                padding="lg"
                className="text-center"
              >
                <FileText
                  className="mx-auto h-7 w-7 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-arabic-heading text-2xl font-semibold">
                  المكتبة فارغة
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-muted">
                  {canWrite
                    ? "أضف أول ملف TXT أو Markdown. لن نعرض مستندات مثال أو مقاطع غير مستخرجة من الملف الحقيقي."
                    : "لم يُضف محرر أو مالك مستنداً إلى هذه المساحة بعد."}
                </p>
              </Surface>
            )}
          </PageSection>
        </div>
      </div>
    </PageShell>
  );
}
