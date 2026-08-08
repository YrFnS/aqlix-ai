import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  ArrowRight,
  Settings,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import type { WorkspaceAccess, WorkspaceAiLimits } from "@iraqi-ai/types";
import { WorkspaceAiLimitsPanel } from "@/components/ai/workspace-ai-limits";
import { Button } from "@/components/ui/button";
import { WorkspaceStatusNotice } from "@/components/workspaces/workspace-status-notice";
import {
  AiControlRepositoryError,
  getWorkspaceAiLimits,
} from "@/lib/ai/controls";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  archiveWorkspaceAction,
  deleteWorkspaceAction,
  restoreWorkspaceAction,
  updateWorkspaceAction,
} from "@/lib/workspaces/actions";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "إعدادات مساحة العمل",
  description: "Workspace settings, AI resource controls, and lifecycle.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WorkspaceSettingsPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const returnTo = `/workspaces/${workspaceId}/settings`;
  const { user, supabase } = await requireAuthenticatedUser(returnTo);
  let workspace: WorkspaceAccess | null = null;
  let aiLimits: WorkspaceAiLimits | null = null;
  let persistenceFailed = false;
  let aiLimitsFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
  } catch (error) {
    persistenceFailed = true;
    if (error instanceof WorkspaceRepositoryError) {
      console.error("Workspace settings failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected workspace settings failure", error);
    }
  }

  if (workspace) {
    try {
      aiLimits = await getWorkspaceAiLimits(supabase, workspace.id);
    } catch (error) {
      aiLimitsFailed = true;
      if (error instanceof AiControlRepositoryError) {
        console.error("Workspace AI limits failed", {
          operation: error.operation,
          message: error.message,
        });
      } else {
        console.error("Unexpected workspace AI limits failure", error);
      }
    }
  }

  if (!persistenceFailed && !workspace) notFound();

  if (!workspace) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <WorkspaceStatusNotice status="persistence-error" />
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

  const status = firstValue(query.status);
  const isOwner = workspace.role === "owner";
  const canEdit = isOwner || workspace.role === "editor";
  const isArchived = workspace.archivedAt !== null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <Link
          href={`/workspaces/${workspace.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى المساحة
        </Link>

        <div className="mt-6 flex items-start gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              Workspace settings
            </p>
            <h1 className="mt-2 font-arabic-heading text-3xl font-semibold sm:text-4xl">
              إعدادات {workspace.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              دورك الحالي:{" "}
              {workspace.role === "owner"
                ? "مالك"
                : workspace.role === "editor"
                  ? "محرر"
                  : "قارئ"}
              . تتحقق قاعدة البيانات من الدور مرة أخرى عند كل تغيير.
            </p>
          </div>
        </div>
      </header>

      <WorkspaceStatusNotice status={status} />

      {!canEdit ? (
        <section className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-destructive/10 p-3 text-destructive">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-arabic-heading text-2xl font-semibold">
                وصول للقراءة فقط
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                يمكنك فتح محتوى المساحة ومراجعة استهلاك الذكاء الاصطناعي، لكن
                تعديل الاسم أو الوصف أو اللغة يحتاج دور المالك أو المحرر. حدود
                الذكاء الاصطناعي والأرشفة والحذف متاحة للمالك فقط.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold text-primary">
              المعلومات الأساسية
            </p>
            <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
              اسم المساحة ووصفها
            </h2>
          </div>

          <form action={updateWorkspaceAction} className="mt-7 space-y-5">
            <input type="hidden" name="workspaceId" value={workspace.id} />

            <div className="space-y-2">
              <label htmlFor="workspace-name" className="text-sm font-semibold">
                اسم المساحة
              </label>
              <input
                id="workspace-name"
                name="name"
                required
                maxLength={120}
                defaultValue={workspace.name}
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workspace-description"
                className="text-sm font-semibold"
              >
                الوصف
              </label>
              <textarea
                id="workspace-description"
                name="description"
                maxLength={1000}
                rows={5}
                defaultValue={workspace.description ?? ""}
                className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-7 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary"
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
                defaultValue={workspace.defaultLanguage}
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="auto">تلقائي حسب المحتوى</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <Button type="submit" className="rounded-full px-6">
              حفظ التغييرات
            </Button>
          </form>
        </section>
      )}

      {aiLimits ? (
        <WorkspaceAiLimitsPanel
          workspaceId={workspace.id}
          initialLimits={aiLimits}
          workspaceRole={workspace.role}
          workspaceArchived={isArchived}
        />
      ) : (
        <section className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-destructive/10 p-3 text-destructive">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-arabic-heading text-2xl font-semibold">
                تعذر تحميل حدود الذكاء الاصطناعي
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {aiLimitsFailed
                  ? "لم تُعرض أرقام بديلة أو تقديرات. أعد تحميل الصفحة للتحقق من حالة PostgreSQL."
                  : "لا توجد حالة حدود محفوظة لهذه المساحة."}
              </p>
            </div>
          </div>
        </section>
      )}

      {isOwner && (
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <p className="text-sm font-semibold text-primary">
            إدارة دورة الحياة
          </p>
          <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
            الأرشفة والحذف
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            الأرشفة قابلة للعكس. الحذف دائم ويزيل المحتوى المرتبط عبر علاقات قاعدة
            البيانات.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/45 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-background p-2.5 text-primary">
                  {isArchived ? (
                    <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Archive className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {isArchived ? "استعادة المساحة" : "أرشفة المساحة"}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {isArchived
                      ? "تعيد المساحة إلى القائمة النشطة من دون تغيير محتواها."
                      : "تخفي المساحة من القائمة النشطة مع بقاء البيانات والعضوية."}
                  </p>
                </div>
              </div>

              <form
                action={
                  isArchived ? restoreWorkspaceAction : archiveWorkspaceAction
                }
                className="mt-5"
              >
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <Button type="submit" variant="outline" className="rounded-full">
                  {isArchived ? "استعادة" : "أرشفة"}
                </Button>
              </form>
            </div>

            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-destructive/10 p-2.5 text-destructive">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">حذف دائم</h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    اكتب اسم المساحة كما هو لتأكيد حذفها ومحتواها المرتبط.
                  </p>
                </div>
              </div>

              <form action={deleteWorkspaceAction} className="mt-5 space-y-3">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <label htmlFor="confirmation-name" className="sr-only">
                  اسم المساحة للتأكيد
                </label>
                <input
                  id="confirmation-name"
                  name="confirmationName"
                  required
                  autoComplete="off"
                  placeholder={workspace.name}
                  className="min-h-12 w-full rounded-2xl border border-destructive/30 bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                />
                <Button
                  type="submit"
                  variant="destructive"
                  className="rounded-full"
                >
                  حذف مساحة العمل
                </Button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
