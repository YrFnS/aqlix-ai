import Link from "next/link";
import { ArrowUpLeft, Archive, UsersRound } from "lucide-react";
import type { WorkspaceAccess } from "@iraqi-ai/types";

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
    <article className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-5 transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary">
              {roleLabels[workspace.role]}
            </span>
            {workspace.archivedAt && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[0.65rem] font-semibold text-muted-foreground">
                <Archive className="h-3 w-3" aria-hidden="true" />
                مؤرشفة
              </span>
            )}
          </div>
          <h2
            dir="auto"
            className="mt-4 truncate font-arabic-heading text-xl font-semibold"
          >
            {workspace.name}
          </h2>
        </div>
        <div className="rounded-2xl bg-secondary p-3 text-primary">
          <UsersRound className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <p
        dir="auto"
        className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-muted-foreground"
      >
        {workspace.description ||
          "لا يوجد وصف بعد. أضف وصفاً يوضّح الغرض من هذه المساحة."}
      </p>

      <div className="mt-auto border-t border-border/70 pt-4">
        <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>آخر تحديث: {formatUpdatedAt(workspace.updatedAt)}</span>
          <Link
            href={`/workspaces/${workspace.id}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            فتح المساحة
            <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
