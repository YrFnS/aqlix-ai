import {
  conversationIdInputSchema,
  updateConversationInputSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  deleteConversation,
  getConversation,
  listConversationMessages,
  updateConversation,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ workspaceId: string; conversationId: string }>;
};

function logFailure(
  error: unknown,
  requestId: string,
  operation: string,
): void {
  if (error instanceof ConversationRepositoryError) {
    console.error("Conversation API persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected conversation API failure", {
    requestId,
    operation,
    error,
  });
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = conversationIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Conversation identity is invalid.", {
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
        "Conversation was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const conversation = await getConversation(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.conversationId,
    );

    if (!conversation) {
      return jsonFailure(
        "NOT_FOUND",
        "Conversation was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const messages = await listConversationMessages(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.conversationId,
    );

    return jsonSuccess(
      { conversation, messages, workspaceRole: access.role },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "read");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Conversation data could not be loaded.",
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

  const bodyRecord =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const parsed = updateConversationInputSchema.safeParse({
    workspaceId: params.workspaceId,
    conversationId: params.conversationId,
    title: bodyRecord.title,
    status: bodyRecord.status,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Conversation update is invalid.", {
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
        "Conversation was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit conversation updates.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const conversation = await updateConversation(
      auth.context.supabase,
      parsed.data,
    );

    if (!conversation) {
      return jsonFailure(
        "NOT_FOUND",
        "Conversation was not found or could not be updated.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { conversation },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "update");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Conversation could not be updated.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const parsed = conversationIdInputSchema.safeParse(await context.params);
  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Conversation identity is invalid.", {
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
        "Conversation was not found or is not available to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit conversation deletion.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const deleted = await deleteConversation(
      auth.context.supabase,
      parsed.data.workspaceId,
      parsed.data.conversationId,
    );

    if (!deleted) {
      return jsonFailure(
        "NOT_FOUND",
        "Conversation was not found or could not be deleted.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { deleted: true, conversationId: parsed.data.conversationId },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "delete");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Conversation could not be deleted.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
