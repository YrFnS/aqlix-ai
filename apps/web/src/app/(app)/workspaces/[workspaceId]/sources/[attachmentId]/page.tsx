import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { DocumentDetail, WorkspaceAccess } from "@iraqi-ai/types";
import { DocumentStatusNotice } from "@/components/documents/document-status-notice";
import { DocumentWorkspace } from "@/components/documents/document-workspace";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  getWorkspaceDocument,
  DocumentRepositoryError,
} from "@/lib/documents/repository";
import {
  getWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const metadata: Metadata = {
  title: "مقاطع المصدر",
  description: "Inspect the exact persisted passages extracted from a document.",
};

type PageParams = Promise<{ workspaceId: string; attachmentId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SourceDocumentPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { workspaceId, attachmentId } = await params;
  const query = await searchParams;
  const { user, supabase } = await requireAuthenticatedUser(
    `/workspaces/${workspaceId}/sources/${attachmentId}`,
  );

  let workspace: WorkspaceAccess | null = null;
  let document: DocumentDetail | null = null;
  let persistenceFailed = false;

  try {
    workspace = await getWorkspaceAccess(supabase, user.id, workspaceId);
    if (workspace) {
      document = await getWorkspaceDocument(supabase, workspaceId, attachmentId);
    }
  } catch (error) {
    persistenceFailed = true;
    if (
      error instanceof WorkspaceRepositoryError ||
      error instanceof DocumentRepositoryError
    ) {
      console.error("Source document page failed", {
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected source document page failure", error);
    }
  }

  if (!persistenceFailed && (!workspace || !document)) notFound();

  if (!workspace || !document) {
    return (
      <PageShell width="default">
        <DocumentStatusNotice status="persistence-error" />
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href={`/workspaces/${workspaceId}/sources`}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى المصادر
          </Link>
        </Button>
      </PageShell>
    );
  }

  const workspaceArchived = workspace.archivedAt !== null;
  const canWrite =
    !workspaceArchived &&
    (workspace.role === "owner" || workspace.role === "editor");

  return (
    <PageShell width="fluid" className="space-y-4">
      <DocumentStatusNotice
        status={
          persistenceFailed
            ? "persistence-error"
            : workspaceArchived
              ? "workspace-archived"
              : firstValue(query.status)
        }
      />
      <DocumentWorkspace
        workspaceId={workspace.id}
        document={document}
        canWrite={canWrite}
        workspaceArchived={workspaceArchived}
      />
    </PageShell>
  );
}
