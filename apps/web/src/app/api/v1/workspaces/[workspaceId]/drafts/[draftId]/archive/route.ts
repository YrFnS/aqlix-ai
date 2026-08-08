import {
  setDraftArchivedInputSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  getDraft,
  setDraftArchived,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; draftId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonFailure("VALIDATION_ERROR", "Request body must be valid JSON.", {
      status: 422,
      requestId: auth.context.requestId,
    });
  }

  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const parsed = setDraftArchivedInputSchema.safeParse({
    workspaceId: params.workspaceId,
    draftId: params.draftId,
    archived: record.archived,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Draft lifecycle is invalid.", {
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
        "Draft was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before changing draft state.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit draft lifecycle changes.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const draft = await getDraft(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!draft) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const changed = await setDraftArchived(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
      parsed.data.archived,
    );
    const updated = await getDraft(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );

    if (!updated) {
      return jsonFailure(
        "PERSISTENCE_ERROR",
        "The draft lifecycle changed but could not be reloaded.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { draft: updated, changed },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof DraftRepositoryError) {
      console.error("Draft lifecycle persistence failure", {
        requestId: auth.context.requestId,
        operation: error.operation,
        databaseCode: error.databaseCode,
        message: error.message,
      });
    } else {
      console.error("Unexpected draft lifecycle failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The draft lifecycle could not be changed.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
