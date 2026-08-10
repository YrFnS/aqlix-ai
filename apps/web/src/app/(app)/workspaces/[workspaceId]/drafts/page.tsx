import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowRight,
  FileClock,
  GitBranch,
  MessageSquareText,
  Quote,
  Search,
  X,
} from "lucide-react";
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
  title: "المسودات",
  description: "Durable reusable drafts, versions, provenance, and exports.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WorkspaceDraftsPage({
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
    `/workspaces/${workspaceId}/drafts`,
  );

  let workspace: WorkspaceAccess | null = null;
  let drafts: Draft[] = [];
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) drafts = await listDrafts(supabase, workspaceId, "active");
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DraftRepositoryError
    ) {
      console.error("Draft library failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected draft library failure", error);
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

  const workspaceArchived = workspace.archivedAt !== null;
  const status = persistenceFailed
    ? "persistence-error"
    : workspaceArchived
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
  const versionCount = drafts.reduce(
    (total, draft) => total + draft.versionCount,
    0,
  );
  const provenanceCount = drafts.reduce(
    (total, draft) => total + draft.provenanceCount,
    0,
  );

  return (
    <PageShell width="wide" className="space-y-8">
      <PageHeader
        eyebrow="مكتبة العمل"
        title={<span dir="auto">مسودات {workspace.name}</span>}
        description="حرّر العمل المقبول، راجع الإصدارات غير القابلة لإعادة الكتابة، وافتح منشأ المراجع من مساحة واحدة. تبقى اقتراحات الذكاء الاصطناعي منفصلة حتى تطبيقها صراحةً."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/workspaces/${workspace.id}/drafts/archived`}>
                <Archive className="h-4 w-4" aria-hidden="true" />
                الأرشيف
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

      <Stagger className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "المسودات النشطة", value: drafts.length, icon: FileClock },
          { label: "الإصدارات المحفوظة", value: versionCount, icon: GitBranch },
          { label: "مراجع المنشأ", value: provenanceCount, icon: Quote },
        ].map(({ label, value, icon: Icon }) => (
          <StaggerItem key={label}>
            <Surface
              tone="raised"
              elevation="xs"
              radius="xl"
              padding="sm"
              className="flex h-full items-center gap-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-ink-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold">
                  {value.toLocaleString("ar-IQ")}
                </p>
              </div>
            </Surface>
          </StaggerItem>
        ))}
      </Stagger>

      <PageSection
        title="العمل النشط"
        description="ابحث بالعنوان أو المحتوى، ثم افتح المسودة في محررها وإصداراتها ومراجعة الاقتراحات."
      >
        <Surface
          tone="raised"
          elevation="xs"
          radius="2xl"
          padding="sm"
        >
          <form method="get" className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="draft-query" className="sr-only">
              البحث في المسودات
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute inset-y-0 start-4 my-auto h-4 w-4 text-ink-subtle"
                aria-hidden="true"
              />
              <input
                id="draft-query"
                name="q"
                defaultValue={search}
                maxLength={500}
                dir="auto"
                placeholder="ابحث في العناوين أو المحتوى"
                className="min-h-12 w-full rounded-xl border border-input bg-surface-raised ps-11 pe-4 text-sm outline-none placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
              />
            </div>
            <Button type="submit" className="rounded-xl px-5">
              <Search className="h-4 w-4" aria-hidden="true" />
              بحث
            </Button>
            {search ? (
              <Button asChild variant="ghost" className="rounded-xl">
                <Link href={`/workspaces/${workspace.id}/drafts`}>
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
            <FileClock
              className="mx-auto h-7 w-7 text-primary"
              aria-hidden="true"
            />
            <h2 className="mt-4 font-arabic-heading text-2xl font-semibold">
              {search ? "لا توجد مسودة مطابقة" : "لا توجد مسودة نشطة"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-ink-muted">
              {search
                ? "غيّر عبارة البحث أو امسحها لعرض كل العمل النشط."
                : workspaceArchived
                  ? "مساحة العمل مؤرشفة. يمكن مراجعة المسودات المؤرشفة وتصديرها، لكن إنشاء عمل جديد يحتاج استعادة المساحة."
                  : workspace.role === "viewer"
                    ? "لم يشارك معك محرر أو مالك مسودة في هذه المساحة بعد."
                    : "افتح محادثة فيها إجابة مكتملة، ثم حوّلها إلى عمل قابل للتحرير."}
            </p>
            {!search && !workspaceArchived && workspace.role !== "viewer" ? (
              <Button asChild className="mt-6 rounded-full">
                <Link href={`/workspaces/${workspace.id}/conversations`}>
                  <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                  فتح المحادثات
                </Link>
              </Button>
            ) : null}
          </Surface>
        )}
      </PageSection>
    </PageShell>
  );
}
