import {
  draftIdInputSchema,
  restoreDraftVersionInputSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  getDraftDetail,
  restoreDraftVersion,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; draftId: string }>;
};

function logFailure(
  error: unknown,
  requestId: string,
  operation: string,
): void {
  if (error instanceof DraftRepositoryError) {
    console.error("Draft version persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      databaseCode: error.databaseCode,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected draft version failure", {
    requestId,
    operation,
    error,
  });
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = draftIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Draft identity is invalid.", {
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
        "Draft versions were not found or are unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const detail = await getDraftDetail(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!detail) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft versions were not found or are unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { versions: detail.versions, currentVersion: detail.draft.currentVersion },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "list");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Draft versions could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

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
  const parsed = restoreDraftVersionInputSchema.safeParse({
    workspaceId: params.workspaceId,
    draftId: params.draftId,
    expectedVersion: record.expectedVersion,
    restoreVersion: record.restoreVersion,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Version restore is invalid.", {
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
        "Draft version was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before restoring a version.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit version restore.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const detail = await getDraftDetail(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!detail) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft version was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (detail.draft.status !== "active") {
      return jsonFailure(
        "CONFLICT",
        "Archived drafts are read-only. Restore the draft before restoring a version.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    const result = await restoreDraftVersion(
      auth.context.supabase,
      parsed.data,
    );
    const updated = await getDraftDetail(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!updated) {
      return jsonFailure(
        "PERSISTENCE_ERROR",
        "The version was restored but the draft could not be reloaded.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { detail: updated, createdVersion: result.created },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof DraftRepositoryError && error.databaseCode === "40001") {
      return jsonFailure(
        "CONFLICT",
        "The draft changed in another request. Reload before restoring a version.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    logFailure(error, auth.context.requestId, "restore");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The draft version could not be restored.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
