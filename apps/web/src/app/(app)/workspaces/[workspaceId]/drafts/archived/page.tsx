import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowRight, FileClock, Search, X } from "lucide-react";
import type { Draft, WorkspaceAccess } from "@iraqi-ai/types";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { DraftCard } from "@/components/drafts/draft-card";
import { DraftStatusNotice } from "@/components/drafts/draft-status-notice";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageSection,
  PageShell,
} from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
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
  const search = firstValue(query.q)?.trim() ?? "";
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
      <PageShell width="default">
        <DraftStatusNotice status="persistence-error" />
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href="/workspaces">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى المساحات
          </Link>
        </Button>
      </PageShell>
    );
  }

  const status = persistenceFailed
    ? "persistence-error"
    : workspace.archivedAt
      ? "workspace-archived"
      : firstValue(query.status);
  const normalizedSearch = search.toLocaleLowerCase("ar");
  const visibleDrafts = normalizedSearch
    ? drafts.filter((draft) =>
        `${draft.title} ${draft.content} ${draft.kind}`
          .toLocaleLowerCase("ar")
          .includes(normalizedSearch),
      )
    : drafts;

  return (
    <PageShell width="wide" className="space-y-8">
      <PageHeader
        eyebrow="أرشيف العمل"
        title={<span dir="auto">أرشيف مسودات {workspace.name}</span>}
        description="تظل المسودات المؤرشفة قابلة للقراءة والتصدير مع كل إصداراتها ومنشأها. استعد مسودة من داخلها قبل التعديل أو طلب اقتراح جديد."
        actions={
          <>
            <Button asChild className="rounded-full">
              <Link href={`/workspaces/${workspace.id}/drafts`}>
                <FileClock className="h-4 w-4" aria-hidden="true" />
                العمل النشط
              </Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href={`/workspaces/${workspace.id}`}>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                مساحة العمل
              </Link>
            </Button>
          </>
        }
      />

      <DraftStatusNotice status={status} />

      <PageSection
        title="المسودات المؤرشفة"
        description="ابحث في العنوان أو المحتوى، ثم افتح التاريخ الكامل أو استعد المسودة إلى العمل النشط."
        actions={
          <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-ink-muted">
            {drafts.length.toLocaleString("ar-IQ")} مسودة
          </span>
        }
      >
        <Surface
          tone="raised"
          elevation="xs"
          radius="2xl"
          padding="sm"
        >
          <form method="get" className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="archived-draft-query" className="sr-only">
              البحث في أرشيف المسودات
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute inset-y-0 start-4 my-auto h-4 w-4 text-ink-subtle"
                aria-hidden="true"
              />
              <input
                id="archived-draft-query"
                name="q"
                defaultValue={search}
                maxLength={500}
                dir="auto"
                placeholder="ابحث في الأرشيف"
                className="min-h-12 w-full rounded-xl border border-input bg-surface-raised ps-11 pe-4 text-sm outline-none placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
              />
            </div>
            <Button type="submit" className="rounded-xl px-5">
              <Search className="h-4 w-4" aria-hidden="true" />
              بحث
            </Button>
            {search ? (
              <Button asChild variant="ghost" className="rounded-xl">
                <Link href={`/workspaces/${workspace.id}/drafts/archived`}>
                  <X className="h-4 w-4" aria-hidden="true" />
                  مسح
                </Link>
              </Button>
            ) : null}
          </form>
        </Surface>

        {visibleDrafts.length > 0 ? (
          <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleDrafts.map((draft) => (
              <StaggerItem key={draft.id} className="h-full">
                <DraftCard draft={draft} />
              </StaggerItem>
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
            <Archive className="mx-auto h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-arabic-heading text-2xl font-semibold">
              {search ? "لا توجد نتيجة مطابقة" : "الأرشيف فارغ"}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-muted">
              {search
                ? "غيّر عبارة البحث أو امسحها لعرض كل المسودات المؤرشفة."
                : "نقل المسودة إلى الأرشيف لا يحذف محتواها أو إصداراتها أو منشأها."}
            </p>
          </Surface>
        )}
      </PageSection>
    </PageShell>
  );
}
