import {
  createConversationInputSchema,
  workspaceIdInputSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  createConversation,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
import { listConversationSummaries } from "@/lib/conversations/summaries";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ workspaceId: string }>;
};

function includeArchivedValue(request: Request): boolean | null {
  const value = new URL(request.url).searchParams.get("includeArchived");
  if (value === null || value === "false") return false;
  if (value === "true") return true;
  return null;
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = workspaceIdInputSchema.safeParse(await context.params);
  if (!params.success) {
    return jsonFailure("VALIDATION_ERROR", "Workspace ID is invalid.", {
      status: 422,
      requestId: auth.context.requestId,
      fieldErrors: zodFieldErrors(params.error),
    });
  }

  const includeArchived = includeArchivedValue(request);
  if (includeArchived === null) {
    return jsonFailure(
      "VALIDATION_ERROR",
      "includeArchived must be true or false.",
      {
        status: 422,
        requestId: auth.context.requestId,
        fieldErrors: { includeArchived: ["Expected true or false."] },
      },
    );
  }

  try {
    const access = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      params.data.workspaceId,
    );

    if (!access) {
      return jsonFailure(
        "NOT_FOUND",
        "Workspace was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const conversations = await listConversationSummaries(
      auth.context.supabase,
      params.data.workspaceId,
      { includeArchived },
    );

    return jsonSuccess(
      {
        conversations,
        workspaceRole: access.role,
        workspaceArchived: access.archivedAt !== null,
      },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    console.error("Conversation collection query failed", {
      requestId: auth.context.requestId,
      error,
    });

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Conversation data could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

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
  const parsed = createConversationInputSchema.safeParse({
    workspaceId,
    title: bodyRecord.title,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Conversation input is invalid.", {
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

    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before creating a conversation.",
        { status: 409, requestId: auth.context.requestId },
      );
    }

    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit conversation creation.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const conversation = await createConversation(
      auth.context.supabase,
      auth.context.user.id,
      parsed.data,
    );

    return jsonSuccess(
      { conversation },
      { status: 201, requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof ConversationRepositoryError) {
      console.error("Conversation creation failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected conversation creation failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Conversation could not be created.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
