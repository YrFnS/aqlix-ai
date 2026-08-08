import { attachmentIdInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  deleteAttachmentRecord,
  getWorkspaceDocument,
  removeDocumentObject,
  DocumentRepositoryError,
} from "@/lib/documents/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; attachmentId: string }>;
};

function logFailure(
  error: unknown,
  requestId: string,
  operation: string,
): void {
  if (error instanceof DocumentRepositoryError) {
    console.error("Document item persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      databaseCode: error.databaseCode,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected document item failure", {
    requestId,
    operation,
    error,
  });
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = attachmentIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Document identity is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(parsed.error),
    });
  }

  try {
    const access = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      parsed.data.workspaceId,
    );

    if (!access) {
      return jsonFailure(
        "NOT_FOUND",
        "Document was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const document = await getWorkspaceDocument(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.attachmentId,
    );

    if (!document) {
      return jsonFailure(
        "NOT_FOUND",
        "Document was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      {
        document,
        workspaceRole: access.role,
        workspaceArchived: access.archivedAt !== null,
      },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "read");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The document could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = attachmentIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Document identity is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(parsed.error),
    });
  }

  try {
    const access = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      parsed.data.workspaceId,
    );

    if (!access) {
      return jsonFailure(
        "NOT_FOUND",
        "Document was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before deleting documents.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit document deletion.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const document = await getWorkspaceDocument(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.attachmentId,
    );

    if (!document) {
      return jsonFailure(
        "NOT_FOUND",
        "Document was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    try {
      await removeDocumentObject(
        auth.context.supabase,
        document.attachment.storagePath,
      );
    } catch (error) {
      logFailure(error, auth.context.requestId, "delete-private-object");
      return jsonFailure(
        "SERVICE_UNAVAILABLE",
        "The private document bytes could not be removed. Metadata was preserved for a safe retry.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    const deleted = await deleteAttachmentRecord(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.attachmentId,
    );

    if (!deleted) {
      return jsonFailure(
        "PERSISTENCE_ERROR",
        "The private object was removed, but the document record could not be deleted.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { deleted: true, attachmentId: parsed.data.attachmentId },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "delete");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The document could not be deleted.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
