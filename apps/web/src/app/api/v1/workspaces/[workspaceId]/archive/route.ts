import { setWorkspaceArchivedInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  getWorkspaceAccess,
  setWorkspaceArchived,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ workspaceId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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
  const parsed = setWorkspaceArchivedInputSchema.safeParse({
    workspaceId,
    archived: bodyRecord.archived,
  });

  if (!parsed.success) {
    return jsonFailure(
      "VALIDATION_ERROR",
      "Archive command is invalid.",
      {
        status: 422,
        requestId: auth.context.requestId,
        fieldErrors: zodFieldErrors(parsed.error),
      },
    );
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
        "Only the workspace owner can archive or restore this workspace.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const workspace = await setWorkspaceArchived(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.archived,
    );

    if (!workspace) {
      return jsonFailure(
        "NOT_FOUND",
        "Workspace lifecycle state could not be changed.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { workspace: { ...workspace, role: access.role } },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof WorkspaceRepositoryError) {
      console.error("Workspace archive command failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected workspace archive command failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace lifecycle state could not be changed.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
