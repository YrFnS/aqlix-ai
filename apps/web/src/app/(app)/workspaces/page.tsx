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
import {
  Stagger,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageSection,
  PageShell,
} from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
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
  description: "مساحات محفوظة ومنظمة للعمل والمصادر والمسودات.",
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
    <PageShell width="wide">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-primary"
              aria-hidden="true"
            />
            مساحاتك المحفوظة
          </span>
        }
        title="مساحات العمل"
        description="نظّم كل موضوع في مساحة مستقلة، ثم ارجع إلى محادثاته ومصادره ومسوداته من نقطة واحدة واضحة."
        actions={
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/workspaces/archived">
              <Archive className="h-4 w-4" aria-hidden="true" />
              الأرشيف
              {archivedCount > 0 ? (
                <span className="rounded-full bg-surface-sunken px-2 py-0.5 text-xs text-ink-muted">
                  {archivedCount}
                </span>
              ) : null}
            </Link>
          </Button>
        }
      />

      <WorkspaceStatusNotice status={visibleStatus} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(19rem,0.78fr)_minmax(0,1.22fr)] lg:gap-8">
        <Surface
          tone="raised"
          elevation="sm"
          radius="2xl"
          padding="lg"
          className="lg:sticky lg:top-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">مساحة جديدة</p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                ابدأ بسياق واضح
              </h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">
                سمِّ العمل وحدد لغته، وسنحفظ كل ما يتبعه داخل هذه المساحة.
              </p>
            </div>
            <div className="rounded-lg bg-brand-soft p-3 text-primary">
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
                className="min-h-12 w-full rounded-lg border border-input bg-surface-raised px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-fast ease-standard placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
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
                className="w-full resize-y rounded-lg border border-input bg-surface-raised px-4 py-3 text-sm leading-7 text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-fast ease-standard placeholder:text-ink-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
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
                className="min-h-12 w-full rounded-lg border border-input bg-surface-raised px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-fast ease-standard focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
              >
                <option value="auto">تلقائي حسب المحتوى</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-lg">
              إنشاء مساحة العمل
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <Surface
            tone="muted"
            radius="lg"
            padding="sm"
            className="mt-6 border-transparent"
          >
            <div className="flex gap-3 text-xs leading-6 text-ink-muted">
              <ShieldCheck
                className="mt-1 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p>
                تُنشأ عضوية المالك تلقائياً من حسابك الموثّق، وتبقى المساحة
                مرتبطة بصلاحيات أعضائها.
              </p>
            </div>
          </Surface>
        </Surface>

        <PageSection
          className="min-w-0"
          title="أكمل العمل من حيث توقفت"
          description="المساحات النشطة المتاحة لهذا الحساب، مرتبة بحسب آخر تحديث."
          actions={
            <span className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface-raised px-4 text-sm font-semibold text-ink-muted shadow-surface-xs">
              {activeWorkspaces.length} مساحة نشطة
            </span>
          }
        >
          {activeWorkspaces.length > 0 ? (
            <Stagger className="grid gap-4 md:grid-cols-2">
              {activeWorkspaces.map((workspace) => (
                <StaggerItem key={workspace.id} className="h-full">
                  <WorkspaceCard workspace={workspace} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Surface
              tone="muted"
              radius="2xl"
              padding="lg"
              className="flex min-h-80 flex-col items-center justify-center border-dashed text-center"
            >
              <div className="rounded-lg bg-surface-raised p-4 text-primary shadow-surface-xs">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-arabic-heading text-xl font-semibold">
                لا توجد مساحة نشطة بعد
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">
                أنشئ أول مساحة من النموذج. ستبدأ فارغة ولن نضيف بيانات مثال أو
                نشاطاً غير حقيقي إلى حسابك.
              </p>
            </Surface>
          )}
        </PageSection>
      </div>
    </PageShell>
  );
}
