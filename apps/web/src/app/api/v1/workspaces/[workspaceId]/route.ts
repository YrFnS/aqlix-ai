import {
  deleteWorkspaceInputSchema,
  updateWorkspaceInputSchema,
  workspaceIdInputSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  deleteWorkspace,
  getWorkspaceAccess,
  updateWorkspace,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ workspaceId: string }>;
};

function logRepositoryFailure(
  error: unknown,
  requestId: string,
  operation: string,
): void {
  if (error instanceof WorkspaceRepositoryError) {
    console.error("Workspace API persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected workspace API failure", {
    requestId,
    operation,
    error,
  });
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = await context.params;
  const idResult = workspaceIdInputSchema.safeParse(params);
  if (!idResult.success) {
    return jsonFailure("VALIDATION_ERROR", "Workspace ID is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(idResult.error),
    });
  }

  try {
    const workspace = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      idResult.data.workspaceId,
    );

    if (!workspace) {
      return jsonFailure(
        "NOT_FOUND",
        "Workspace was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { workspace },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logRepositoryFailure(error, auth.context.requestId, "read");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace data could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const { workspaceId } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonFailure("VALIDATION_ERROR", "Request body must be valid JSON.", {
      status: 422,
      requestId: auth.context.requestId,
    });
  }

  const bodyRecord =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const parsed = updateWorkspaceInputSchema.safeParse({
    workspaceId,
    name: bodyRecord.name,
    description: bodyRecord.description,
    defaultLanguage: bodyRecord.defaultLanguage,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Workspace update is invalid.", {
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
        "Workspace was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit workspace updates.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const workspace = await updateWorkspace(auth.context.supabase, parsed.data);
    if (!workspace) {
      return jsonFailure("NOT_FOUND", "Workspace could not be updated.", {
        status: 404,
        requestId: auth.context.requestId,
      });
    }

    return jsonSuccess(
      { workspace: { ...workspace, role: access.role } },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logRepositoryFailure(error, auth.context.requestId, "update");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace could not be updated.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const { workspaceId } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonFailure("VALIDATION_ERROR", "Request body must be valid JSON.", {
      status: 422,
      requestId: auth.context.requestId,
    });
  }

  const bodyRecord =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const parsed = deleteWorkspaceInputSchema.safeParse({
    workspaceId,
    confirmationName: bodyRecord.confirmationName,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Deletion confirmation is invalid.", {
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
        "Workspace was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (access.role !== "owner") {
      return jsonFailure(
        "FORBIDDEN",
        "Only the workspace owner can delete this workspace.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    if (access.name !== parsed.data.confirmationName) {
      return jsonFailure(
        "CONFLICT",
        "The confirmation name does not match the workspace name.",
        {
          status: 409,
          requestId: auth.context.requestId,
          fieldErrors: {
            confirmationName: ["The name must match exactly."],
          },
        },
      );
    }

    const deleted = await deleteWorkspace(
      auth.context.supabase,
      parsed.data.workspaceId,
    );

    if (!deleted) {
      return jsonFailure("NOT_FOUND", "Workspace could not be deleted.", {
        status: 404,
        requestId: auth.context.requestId,
      });
    }

    return jsonSuccess(
      { deleted: true, workspaceId: parsed.data.workspaceId },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logRepositoryFailure(error, auth.context.requestId, "delete");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace could not be deleted.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
