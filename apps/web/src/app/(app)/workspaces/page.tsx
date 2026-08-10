import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  ArrowUpLeft,
  BookOpen,
  Plus,
  ShieldCheck,
} from "lucide-react";
import type { WorkspaceAccess } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { WorkspaceStatusNotice } from "@/components/workspaces/workspace-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createWorkspaceAction } from "@/lib/workspaces/actions";
import {
  listWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "مساحات العمل",
  description:
    "نظّم محادثاتك ومصادرك ومسوداتك داخل مساحة مستقلة لكل مشروع أو مهمة.",
};

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WorkspacesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser("/workspaces");
  let allWorkspaces: WorkspaceAccess[] = [];
  let persistenceFailed = false;

  try {
    allWorkspaces = await listWorkspaceAccess(supabase, user.id, {
      includeArchived: true,
    });
  } catch (error) {
    persistenceFailed = true;
    if (error instanceof WorkspaceRepositoryError) {
      console.error("Workspace list failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected workspace list failure", error);
    }
  }

  const activeWorkspaces = allWorkspaces.filter(
    (workspace) => workspace.archivedAt === null,
  );
  const archivedCount = allWorkspaces.length - activeWorkspaces.length;
  const requestedStatus = firstValue(params.status);
  const visibleStatus = persistenceFailed
    ? "persistence-error"
    : requestedStatus;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              مساحاتك، في مكان واحد
            </div>
            <h1 className="mt-5 font-arabic-heading text-3xl font-semibold tracking-tight sm:text-5xl">
              مساحات العمل
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
              اجمع محادثاتك ومصادرك ومسوداتك داخل مساحة مستقلة لكل مشروع أو
              مهمة، وارجع إلى عملك من حيث توقفت.
            </p>
          </div>

          <Link
            href="/workspaces/archived"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <Archive className="h-4 w-4" aria-hidden="true" />
            الأرشيف
            {archivedCount > 0 && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {archivedCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <WorkspaceStatusNotice status={visibleStatus} />

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">مساحة جديدة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                أنشئ مساحة لعملك القادم
              </h2>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          <form action={createWorkspaceAction} className="mt-7 space-y-5">
            <div className="space-y-2">
              <label htmlFor="workspace-name" className="text-sm font-semibold">
                اسم المساحة
              </label>
              <input
                id="workspace-name"
                name="name"
                required
                maxLength={120}
                placeholder="مثال: مراجعة عقد المورد"
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workspace-description"
                className="text-sm font-semibold"
              >
                وصف مختصر
              </label>
              <textarea
                id="workspace-description"
                name="description"
                maxLength={1000}
                rows={4}
                placeholder="ما العمل الذي ستحتفظ به هنا؟"
                className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-7 outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workspace-language"
                className="text-sm font-semibold"
              >
                اللغة الافتراضية
              </label>
              <select
                id="workspace-language"
                name="defaultLanguage"
                defaultValue="auto"
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="auto">تلقائي حسب المحتوى</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <Button type="submit" className="w-full rounded-full">
              إنشاء مساحة العمل
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-6 flex gap-3 rounded-2xl bg-secondary/60 p-4 text-xs leading-6 text-muted-foreground">
            <ShieldCheck
              className="mt-1 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              تبقى المساحة خاصة بحسابك وبالأعضاء الذين تمنحهم حق الوصول.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">المساحات النشطة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                أكمل العمل من حيث توقفت
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeWorkspaces.length} مساحة متاحة لحسابك
            </p>
          </div>

          {activeWorkspaces.length > 0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {activeWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          ) : (
            <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/35 p-8 text-center">
              <div className="rounded-2xl bg-background p-4 text-primary shadow-sm">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-arabic-heading text-xl font-semibold">
                لا توجد مساحة نشطة بعد
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                أنشئ أول مساحة، ثم ابدأ محادثة أو أضف مصدراً عندما تحتاجه.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
