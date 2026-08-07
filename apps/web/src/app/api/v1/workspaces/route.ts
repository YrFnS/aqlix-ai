import { createWorkspaceInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  createWorkspace,
  listWorkspaceAccess,
  WorkspaceRepositoryError,
} from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";

function parseIncludeArchived(request: Request): boolean | null {
  const value = new URL(request.url).searchParams.get("includeArchived");
  if (value === null || value === "false") return false;
  if (value === "true") return true;
  return null;
}

export async function GET(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const includeArchived = parseIncludeArchived(request);
  if (includeArchived === null) {
    return jsonFailure(
      "VALIDATION_ERROR",
      "includeArchived must be true or false.",
      {
        status: 422,
        requestId: auth.context.requestId,
        fieldErrors: {
          includeArchived: ["Expected true or false."],
        },
      },
    );
  }

  try {
    const workspaces = await listWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      { includeArchived },
    );

    return jsonSuccess(
      {
        workspaces,
        activeCount: workspaces.filter(
          (workspace) => workspace.archivedAt === null,
        ).length,
        archivedCount: workspaces.filter(
          (workspace) => workspace.archivedAt !== null,
        ).length,
      },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof WorkspaceRepositoryError) {
      console.error("Workspace collection query failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected workspace collection query failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace data could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonFailure("VALIDATION_ERROR", "Request body must be valid JSON.", {
      status: 422,
      requestId: auth.context.requestId,
    });
  }

  const parsed = createWorkspaceInputSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFailure(
      "VALIDATION_ERROR",
      "Workspace input is invalid.",
      {
        status: 422,
        requestId: auth.context.requestId,
        fieldErrors: zodFieldErrors(parsed.error),
      },
    );
  }

  try {
    const workspace = await createWorkspace(
      auth.context.supabase,
      auth.context.user.id,
      parsed.data,
    );

    return jsonSuccess(
      { workspace },
      { status: 201, requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof WorkspaceRepositoryError) {
      console.error("Workspace creation failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected workspace creation failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace could not be created.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
