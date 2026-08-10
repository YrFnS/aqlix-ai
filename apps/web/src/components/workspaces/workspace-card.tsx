import Link from "next/link";
import { ArrowUpLeft, Archive, UsersRound } from "lucide-react";
import type { WorkspaceAccess } from "@iraqi-ai/types";
import { MotionSurface } from "@/components/motion/motion-primitives";
import { Surface } from "@/components/ui/surface";

const roleLabels = {
  owner: "مالك",
  editor: "محرر",
  viewer: "قارئ",
} as const;

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function WorkspaceCard({
  workspace,
}: {
  workspace: WorkspaceAccess;
}) {
  return (
    <article className="h-full">
      <MotionSurface className="h-full">
        <Link
          href={`/workspaces/${workspace.id}`}
          aria-label={`فتح مساحة ${workspace.name}`}
          className="group block h-full rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <Surface
            tone="raised"
            elevation="xs"
            radius="2xl"
            padding="none"
            className="flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-base ease-standard group-hover:border-primary/30 group-hover:shadow-surface-md"
          >
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.7rem] font-semibold text-accent-foreground">
                      {roleLabels[workspace.role]}
                    </span>
                    {workspace.archivedAt ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-sunken px-2.5 py-1 text-[0.7rem] font-semibold text-ink-muted">
                        <Archive className="h-3 w-3" aria-hidden="true" />
                        مؤرشفة
                      </span>
                    ) : null}
                  </div>
                  <h2
                    dir="auto"
                    className="mt-4 line-clamp-2 font-arabic-heading text-xl font-semibold text-foreground"
                  >
                    {workspace.name}
                  </h2>
                </div>
                <div className="rounded-lg bg-surface-sunken p-3 text-primary">
                  <UsersRound className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>

              <p
                dir="auto"
                className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-ink-muted"
              >
                {workspace.description ||
                  "لا يوجد وصف بعد. أضف وصفاً يوضّح الغرض من هذه المساحة."}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-line/70 bg-surface-sunken/50 px-5 py-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <time dateTime={workspace.updatedAt}>
                آخر تحديث: {formatUpdatedAt(workspace.updatedAt)}
              </time>
              <span className="inline-flex items-center gap-2 font-semibold text-primary">
                فتح المساحة
                <ArrowUpLeft
                  className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Surface>
        </Link>
      </MotionSurface>
    </article>
  );
}
