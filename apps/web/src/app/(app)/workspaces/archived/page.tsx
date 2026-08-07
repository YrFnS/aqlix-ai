import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Archive, BookOpen } from "lucide-react";
import type { WorkspaceAccess } from "@iraqi-ai/types";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { WorkspaceStatusNotice } from "@/components/workspaces/workspace-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  listWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "أرشيف مساحات العمل",
  description: "Archived persistent workspaces.",
};

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ArchivedWorkspacesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    "/workspaces/archived",
  );
  let allWorkspaces: WorkspaceAccess[] = [];
  let persistenceFailed = false;

  try {
    allWorkspaces = await listWorkspaceAccess(supabase, user.id, {
      includeArchived: true,
    });
  } catch (error) {
    persistenceFailed = true;
    if (error instanceof WorkspaceRepositoryError) {
      console.error("Archived workspace list failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected archived workspace list failure", error);
    }
  }

  const archivedWorkspaces = allWorkspaces.filter(
    (workspace) => workspace.archivedAt !== null,
  );
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : firstValue(params.status);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <Link
          href="/workspaces"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          المساحات النشطة
        </Link>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">P1 · Archive state</p>
            <h1 className="mt-3 font-arabic-heading text-3xl font-semibold sm:text-5xl">
              أرشيف مساحات العمل
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              الأرشفة لا تحذف البيانات. يبقى الوصول خاضعاً للعضوية، ويمكن للمالك
              استعادة المساحة أو حذفها من صفحة الإعدادات.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            <Archive className="h-4 w-4 text-primary" aria-hidden="true" />
            {archivedWorkspaces.length} مساحة مؤرشفة
          </div>
        </div>
      </header>

      <WorkspaceStatusNotice status={visibleStatus} />

      {archivedWorkspaces.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {archivedWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </section>
      ) : (
        <section className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <div className="rounded-2xl bg-secondary p-4 text-primary">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-arabic-heading text-2xl font-semibold">
            الأرشيف فارغ
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
            عند أرشفة مساحة ستظهر هنا. لا توجد سجلات مخفية أو عناصر تجريبية.
          </p>
        </section>
      )}
    </div>
  );
}
