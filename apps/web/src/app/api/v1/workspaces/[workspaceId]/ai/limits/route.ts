import {
  updateWorkspaceAiLimitsInputSchema,
  workspaceIdInputSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  AiControlRepositoryError,
  getWorkspaceAiLimits,
  updateWorkspaceAiLimits,
} from "@/lib/ai/controls";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string }>;
};

function logFailure(
  error: unknown,
  requestId: string,
  operation: string,
): void {
  if (error instanceof AiControlRepositoryError) {
    console.error("Workspace AI control persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      databaseCode: error.databaseCode,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected workspace AI control failure", {
    requestId,
    operation,
    error,
  });
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = workspaceIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Workspace identity is invalid.", {
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
        "Workspace AI controls were not found or are unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const limits = await getWorkspaceAiLimits(
      auth.context.supabase,
      parsed.data.workspaceId,
    );

    return jsonSuccess(
      {
        limits,
        workspaceRole: access.role,
        workspaceArchived: access.archivedAt !== null,
      },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "read");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace AI controls could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
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
  const parsed = updateWorkspaceAiLimitsInputSchema.safeParse({
    workspaceId: params.workspaceId,
    enabled: record.enabled,
    dailyRequestLimit: record.dailyRequestLimit,
    dailyInputTokenLimit: record.dailyInputTokenLimit,
    dailyOutputTokenLimit: record.dailyOutputTokenLimit,
    maxConcurrentGenerations: record.maxConcurrentGenerations,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Workspace AI limits are invalid.", {
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
        "Workspace AI controls were not found or are unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before changing AI limits.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role !== "owner") {
      return jsonFailure(
        "FORBIDDEN",
        "Only the workspace owner can change AI limits.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const limits = await updateWorkspaceAiLimits(
      auth.context.supabase,
      parsed.data,
    );

    return jsonSuccess(
      { limits },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "update");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Workspace AI limits could not be updated.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
