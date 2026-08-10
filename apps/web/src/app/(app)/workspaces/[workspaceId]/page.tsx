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
import {
  MotionSurface,
  Stagger,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { PageSection, PageShell } from "@/components/ui/page-shell";
import { Surface } from "@/components/ui/surface";
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
    "مساحة محفوظة للمحادثات والمصادر الخاصة والمسودات القابلة للتطوير.",
};

type PageParams = Promise<{ workspaceId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const roleLabels = {
  owner: "مالك المساحة",
  editor: "محرر",
  viewer: "قارئ",
} as const;

const workspaceAreas = [
  {
    key: "conversations",
    eyebrow: "حوار محفوظ",
    title: "المحادثات",
    description:
      "تابع الأسئلة والإجابات داخل سياق المساحة، مع إمكانية الرجوع إلى المحادثات السابقة ومصادرها.",
    action: "فتح المحادثات",
    icon: MessageSquareText,
  },
  {
    key: "sources",
    eyebrow: "مصادر خاصة",
    title: "المصادر",
    description:
      "أضف ملفات نصية إلى هذه المساحة، وابحث داخلها، وافتح المراجع المرتبطة بالمقاطع المستخدمة.",
    action: "فتح المصادر",
    icon: FileSearch,
  },
  {
    key: "drafts",
    eyebrow: "تحرير بإصدارات",
    title: "المسودات",
    description:
      "حوّل الإجابات إلى عمل قابل للتحرير، واحفظ إصداراته، وراجع أصل المحتوى قبل التصدير أو التطبيق.",
    action: "فتح المسودات",
    icon: PenLine,
  },
] as const;

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
      <PageShell width="compact">
        <WorkspaceStatusNotice status="persistence-error" />
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href="/workspaces">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى المساحات
          </Link>
        </Button>
      </PageShell>
    );
  }

  const status = firstValue(query.status);
  const isOwner = workspace.role === "owner";
  const canEdit = workspace.role === "owner" || workspace.role === "editor";
  const isArchived = workspace.archivedAt !== null;
  const defaultLanguage =
    workspace.defaultLanguage === "ar"
      ? "العربية"
      : workspace.defaultLanguage === "en"
        ? "English"
        : "تلقائي حسب المحتوى";

  return (
    <PageShell width="wide">
      <WorkspaceStatusNotice status={status} />

      <Surface
        tone="inverse"
        elevation="lg"
        radius="2xl"
        padding="lg"
        className="overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-background/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <Button
            asChild
            variant="ghost"
            className="rounded-full border border-background/20 bg-background/5 text-background hover:bg-background/10 hover:text-background focus-visible:border-background/40 focus-visible:ring-background/30"
          >
            <Link href={isArchived ? "/workspaces/archived" : "/workspaces"}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              {isArchived ? "العودة إلى الأرشيف" : "العودة إلى المساحات"}
            </Link>
          </Button>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold text-background/80">
                  {roleLabels[workspace.role]}
                </span>
                {isArchived ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-background/20 px-3 py-1.5 text-xs font-semibold text-background/70">
                    <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                    مؤرشفة
                  </span>
                ) : null}
              </div>

              <h1
                dir="auto"
                className="mt-5 text-balance font-arabic-heading text-3xl font-semibold tracking-tight text-background sm:text-5xl"
              >
                {workspace.name}
              </h1>
              <p
                dir="auto"
                className="mt-4 max-w-2xl text-sm leading-8 text-background/70 sm:text-base"
              >
                {workspace.description ||
                  "لم يُضف وصف لهذه المساحة بعد. يمكن للمالك أو المحرر تحديثه من الإعدادات."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {canEdit ? (
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full border border-background/20 bg-background/5 text-background hover:bg-background/10 hover:text-background focus-visible:border-background/40 focus-visible:ring-background/30"
                >
                  <Link href={`/workspaces/${workspace.id}/settings`}>
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    الإعدادات
                  </Link>
                </Button>
              ) : null}

              {isOwner && !isArchived ? (
                <form action={archiveWorkspaceAction}>
                  <input type="hidden" name="workspaceId" value={workspace.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="rounded-full border border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background focus-visible:border-background/40 focus-visible:ring-background/30"
                  >
                    <Archive className="h-4 w-4" aria-hidden="true" />
                    أرشفة
                  </Button>
                </form>
              ) : null}

              {isOwner && isArchived ? (
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
              ) : null}
            </div>
          </div>
        </div>
      </Surface>

      <PageSection
        title="اختر مسار العمل"
        description="انتقل مباشرة إلى الجزء الذي تحتاجه، مع بقاء كل شيء ضمن سياق هذه المساحة وصلاحياتها."
      >
        <Stagger className="grid gap-4 md:grid-cols-3">
          {workspaceAreas.map((area) => {
            const Icon = area.icon;

            return (
              <StaggerItem key={area.key} className="h-full">
                <MotionSurface className="h-full">
                  <Link
                    href={`/workspaces/${workspace.id}/${area.key}`}
                    aria-label={`${area.action}: ${workspace.name}`}
                    className="group block h-full rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  >
                    <Surface
                      tone="raised"
                      elevation="xs"
                      radius="2xl"
                      padding="lg"
                      className="flex h-full flex-col transition-[border-color,box-shadow] duration-base ease-standard group-hover:border-primary/30 group-hover:shadow-surface-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-lg bg-brand-soft p-3 text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-[0.7rem] font-semibold text-ink-muted">
                          {area.eyebrow}
                        </span>
                      </div>

                      <h2 className="mt-6 font-arabic-heading text-xl font-semibold">
                        {area.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-7 text-ink-muted">
                        {area.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        {area.action}
                        <ArrowUpLeft
                          className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Surface>
                  </Link>
                </MotionSurface>
              </StaggerItem>
            );
          })}
        </Stagger>
      </PageSection>

      <Surface tone="muted" radius="2xl" padding="lg">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex gap-4">
            <div className="h-fit rounded-lg bg-brand-soft p-3 text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                حدود واضحة للمساحة
              </p>
              <h2 className="mt-2 font-arabic-heading text-2xl font-semibold">
                سياق واحد، وصلاحيات مرتبطة بالعضوية
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
                المحادثات والمصادر والمراجع والمسودات محفوظة داخل هذه المساحة.
                يبقى العمل المقترح منفصلاً عن المحتوى المقبول حتى تطبّقه صراحةً.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[21rem]">
            <Surface tone="raised" radius="lg" padding="sm" elevation="xs">
              <p className="text-xs font-semibold text-ink-subtle">
                اللغة الافتراضية
              </p>
              <p className="mt-1 text-sm font-semibold">{defaultLanguage}</p>
            </Surface>
            <Surface tone="raised" radius="lg" padding="sm" elevation="xs">
              <p className="text-xs font-semibold text-ink-subtle">
                مستوى الوصول
              </p>
              <p className="mt-1 text-sm font-semibold">
                {roleLabels[workspace.role]}
              </p>
            </Surface>
          </div>
        </div>
      </Surface>
    </PageShell>
  );
}
