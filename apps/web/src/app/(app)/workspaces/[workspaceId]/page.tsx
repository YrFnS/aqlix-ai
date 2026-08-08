import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  ArrowRight,
  ArrowUpLeft,
  FileSearch,
  MessageSquareText,
  PenLine,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { WorkspaceAccess } from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import { WorkspaceStatusNotice } from "@/components/workspaces/workspace-status-notice";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  archiveWorkspaceAction,
  restoreWorkspaceAction,
} from "@/lib/workspaces/actions";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "مساحة العمل",
  description:
    "Persistent workspace with conversations, private sources, and durable reusable drafts.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const roleLabels = {
  owner: "مالك المساحة",
  editor: "محرر",
  viewer: "قارئ",
} as const;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const returnTo = `/workspaces/${workspaceId}`;
  const { user, supabase } = await requireAuthenticatedUser(returnTo);
  let workspace: WorkspaceAccess | null = null;
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
  } catch (error) {
    persistenceFailed = true;
    if (error instanceof WorkspaceRepositoryError) {
      console.error("Workspace detail failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected workspace detail failure", error);
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
  const canEdit = workspace.role === "owner" || workspace.role === "editor";
  const isArchived = workspace.archivedAt !== null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <WorkspaceStatusNotice status={status} />

      <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-foreground p-6 text-background sm:p-8">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Link
                href={isArchived ? "/workspaces/archived" : "/workspaces"}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                {isArchived ? "العودة إلى الأرشيف" : "العودة إلى المساحات"}
              </Link>

              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold text-background/80">
                  {roleLabels[workspace.role]}
                </span>
                {isArchived && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                    <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                    مؤرشفة
                  </span>
                )}
              </div>

              <h1
                dir="auto"
                className="mt-5 text-balance font-arabic-heading text-3xl font-semibold sm:text-5xl"
              >
                {workspace.name}
              </h1>
              <p
                dir="auto"
                className="mt-4 max-w-2xl text-sm leading-8 text-background/65 sm:text-base"
              >
                {workspace.description ||
                  "لم يُضف وصف لهذه المساحة بعد. يمكن للمالك أو المحرر تحديثه من الإعدادات."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {canEdit && (
                <Link
                  href={`/workspaces/${workspace.id}/settings`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-background/20 bg-background/10 px-5 text-sm font-semibold text-background transition-colors hover:bg-background/15"
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  الإعدادات
                </Link>
              )}

              {isOwner && !isArchived && (
                <form action={archiveWorkspaceAction}>
                  <input type="hidden" name="workspaceId" value={workspace.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-full border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
                  >
                    <Archive className="h-4 w-4" aria-hidden="true" />
                    أرشفة
                  </Button>
                </form>
              )}

              {isOwner && isArchived && (
                <form action={restoreWorkspaceAction}>
                  <input type="hidden" name="workspaceId" value={workspace.id} />
                  <Button
                    type="submit"
                    className="rounded-full bg-background text-foreground hover:bg-background/90"
                  >
                    <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
                    استعادة
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href={`/workspaces/${workspace.id}/conversations`}
          className="group rounded-3xl border border-primary/30 bg-card p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary">
              P2 + P3 · يعمل
            </span>
          </div>
          <h2 className="mt-6 font-arabic-heading text-xl font-semibold">
            المحادثات
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            رسائل متدفقة ومحفوظة، إيقاف وإعادة محاولة، ووضع مصادر اختياري يحفظ
            مراجع قابلة للفتح إلى المقاطع نفسها.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary">
            فتح المحادثات
            <ArrowUpLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>

        <Link
          href={`/workspaces/${workspace.id}/sources`}
          className="group rounded-3xl border border-primary/30 bg-card p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <FileSearch className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary">
              P3 · يعمل
            </span>
          </div>
          <h2 className="mt-6 font-arabic-heading text-xl font-semibold">
            المصادر
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            ملفات TXT وMarkdown خاصة، تحقق صارم، مقاطع بخطوط حقيقية، بحث داخل
            المساحة، وتنزيل وحذف منسقان.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary">
            فتح المصادر
            <ArrowUpLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>

        <Link
          href={`/workspaces/${workspace.id}/drafts`}
          className="group rounded-3xl border border-primary/30 bg-card p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <PenLine className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary">
              P4 · يعمل
            </span>
          </div>
          <h2 className="mt-6 font-arabic-heading text-xl font-semibold">
            المسودات
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            حوّل الإجابات إلى عمل قابل للتحرير، احفظ إصدارات غير قابلة لإعادة
            الكتابة، افحص المنشأ، صدّر UTF-8، وراجع اقتراحاً قبل تطبيقه.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary">
            فتح المسودات
            <ArrowUpLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
      </section>

      <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                يعمل في P1 + P2 + P3 + P4
              </p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                Ask → Ground → Draft → Continue
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                الحساب والمساحة والمحادثات والمصادر والمراجع والمسودات والإصدارات
                كلها تخضع للجلسة وRLS. الاقتراحات الآلية تبقى منفصلة عن العمل
                المقبول حتى تطبيقها صراحةً كإصدار جديد.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/50 px-5 py-4 text-sm text-muted-foreground">
            اللغة الافتراضية:{" "}
            {workspace.defaultLanguage === "ar"
              ? "العربية"
              : workspace.defaultLanguage === "en"
                ? "English"
                : "تلقائي"}
          </div>
        </div>
      </section>
    </div>
  );
}
