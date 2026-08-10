import { draftIdInputSchema, saveDraftInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  deleteDraft,
  getDraftDetail,
  saveDraft,
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
    console.error("Draft item persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      databaseCode: error.databaseCode,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected draft item failure", {
    requestId,
    operation,
    error,
  });
}

async function loadAccess(
  auth: Awaited<ReturnType<typeof requireApiUser>> & { ok: true },
  workspaceId: string,
) {
  return getWorkspaceAccess(
    auth.context.supabase,
    auth.context.user.id,
    workspaceId,
  );
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
    const access = await loadAccess(auth, parsed.data.workspaceId);
    if (!access) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft was not found or is unavailable to this account.",
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
        "Draft was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      {
        detail,
        workspaceRole: access.role,
        workspaceArchived: access.archivedAt !== null,
      },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "read");
    return jsonFailure("PERSISTENCE_ERROR", "The draft could not be loaded.", {
      status: 503,
      requestId: auth.context.requestId,
    });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
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
  const parsed = saveDraftInputSchema.safeParse({
    workspaceId: params.workspaceId,
    draftId: params.draftId,
    expectedVersion: record.expectedVersion,
    title: record.title,
    content: record.content,
    direction: record.direction,
    kind: record.kind,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Draft changes are invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(parsed.error),
    });
  }

  try {
    const access = await loadAccess(auth, parsed.data.workspaceId);
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
        "Archived workspaces are read-only. Restore the workspace before saving drafts.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit draft editing.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const existing = await getDraftDetail(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!existing) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (existing.draft.status !== "active") {
      return jsonFailure(
        "CONFLICT",
        "Archived drafts are read-only. Restore the draft before saving changes.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (existing.draft.currentVersion !== parsed.data.expectedVersion) {
      return jsonFailure(
        "CONFLICT",
        "The draft changed in another request. Reload before saving again.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    const result = await saveDraft(auth.context.supabase, parsed.data);
    const detail = await getDraftDetail(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!detail) {
      return jsonFailure(
        "PERSISTENCE_ERROR",
        "The draft was saved but could not be reloaded.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { detail, createdVersion: result.created },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (
      error instanceof DraftRepositoryError &&
      (error.databaseCode === "P4091" || error.databaseCode === "40001")
    ) {
      return jsonFailure(
        "CONFLICT",
        "The draft changed in another request. Reload before saving again.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    logFailure(error, auth.context.requestId, "save");
    return jsonFailure("PERSISTENCE_ERROR", "The draft could not be saved.", {
      status: 503,
      requestId: auth.context.requestId,
    });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
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
    const access = await loadAccess(auth, parsed.data.workspaceId);
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
        "Archived workspaces are read-only. Restore the workspace before deleting drafts.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit draft deletion.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const deleted = await deleteDraft(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.draftId,
    );
    if (!deleted) {
      return jsonFailure(
        "NOT_FOUND",
        "Draft was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { deleted: true, draftId: parsed.data.draftId },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "delete");
    return jsonFailure("PERSISTENCE_ERROR", "The draft could not be deleted.", {
      status: 503,
      requestId: auth.context.requestId,
    });
  }
}
