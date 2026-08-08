import {
  createDraftFromMessageInputSchema,
  workspaceIdInputSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  getConversation,
  getConversationMessage,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
import {
  createDraftFromMessage,
  getDraftDetail,
  listDrafts,
  DraftRepositoryError,
} from "@/lib/drafts/repository";
import { createDraftScaffold } from "@/lib/drafts/scaffold";
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
  if (
    error instanceof DraftRepositoryError ||
    error instanceof ConversationRepositoryError
  ) {
    console.error("Draft collection persistence failure", {
      requestId,
      operation,
      repositoryOperation: error.operation,
      message: error.message,
    });
    return;
  }

  console.error("Unexpected draft collection failure", {
    requestId,
    operation,
    error,
  });
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

  try {
    const access = await getWorkspaceAccess(
      auth.context.supabase,
      auth.context.user.id,
      params.data.workspaceId,
    );
    if (!access) {
      return jsonFailure(
        "NOT_FOUND",
        "Drafts were not found or are unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const archived = new URL(request.url).searchParams.get("archived") === "true";
    const drafts = await listDrafts(
      auth.context.supabase,
      params.data.workspaceId,
      archived ? "archived" : "active",
    );

    return jsonSuccess(
      {
        drafts,
        workspaceRole: access.role,
        workspaceArchived: access.archivedAt !== null,
      },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "list");
    return jsonFailure("PERSISTENCE_ERROR", "Drafts could not be loaded.", {
      status: 503,
      requestId: auth.context.requestId,
    });
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
  const parsed = createDraftFromMessageInputSchema.safeParse({
    workspaceId: params.workspaceId,
    conversationId: record.conversationId,
    messageId: record.messageId,
    kind: record.kind,
  });

  if (!parsed.success) {
    return jsonFailure("VALIDATION_ERROR", "Draft creation is invalid.", {
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
        "The origin message was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }
    if (access.archivedAt) {
      return jsonFailure(
        "CONFLICT",
        "Archived workspaces are read-only. Restore the workspace before creating a draft.",
        { status: 409, requestId: auth.context.requestId },
      );
    }
    if (access.role === "viewer") {
      return jsonFailure(
        "FORBIDDEN",
        "Viewer membership does not permit draft creation.",
        { status: 403, requestId: auth.context.requestId },
      );
    }

    const [conversation, message] = await Promise.all([
      getConversation(
        auth.context.supabase,
        parsed.data.workspaceId,
        parsed.data.conversationId,
      ),
      getConversationMessage(
        auth.context.supabase,
        parsed.data.workspaceId,
        parsed.data.conversationId,
        parsed.data.messageId,
      ),
    ]);

    if (
      !conversation ||
      !message ||
      message.role !== "assistant" ||
      message.status !== "complete"
    ) {
      return jsonFailure(
        "NOT_FOUND",
        "A completed assistant message was not found or is unavailable to this account.",
        { status: 404, requestId: auth.context.requestId },
      );
    }

    const scaffold = createDraftScaffold({
      kind: parsed.data.kind,
      conversationTitle: conversation.title,
      messageContent: message.content,
    });
    const created = await createDraftFromMessage(auth.context.supabase, {
      workspaceId: parsed.data.workspaceId,
      conversationId: parsed.data.conversationId,
      messageId: parsed.data.messageId,
      ...scaffold,
    });
    const detail = await getDraftDetail(
      auth.context.supabase,
      parsed.data.workspaceId,
      created.draftId,
    );

    if (!detail) {
      return jsonFailure(
        "PERSISTENCE_ERROR",
        "The draft was created but could not be reloaded.",
        { status: 503, requestId: auth.context.requestId },
      );
    }

    return jsonSuccess(
      { detail },
      { status: 201, requestId: auth.context.requestId },
    );
  } catch (error) {
    logFailure(error, auth.context.requestId, "create");
    return jsonFailure(
      "PERSISTENCE_ERROR",
      "The reusable draft could not be created.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
