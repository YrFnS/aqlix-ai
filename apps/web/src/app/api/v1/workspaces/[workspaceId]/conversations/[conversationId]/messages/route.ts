import { listConversationMessagesInputSchema } from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";
import {
  getConversation,
  ConversationRepositoryError,
} from "@/lib/conversations/repository";
import { listConversationMessagePage } from "@/lib/conversations/message-pages";
import { getWorkspaceAccess } from "@/lib/workspaces/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ workspaceId: string; conversationId: string }>;
};

function integerQueryValue(value: string | null): number | undefined {
  if (value === null) return undefined;
  if (!/^\d+$/u.test(value)) return Number.NaN;
  return Number(value);
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const params = await context.params;
  const search = new URL(request.url).searchParams;
  const parsed = listConversationMessagesInputSchema.safeParse({
    workspaceId: params.workspaceId,
    conversationId: params.conversationId,
    beforeSequence: integerQueryValue(search.get("before")),
    limit: integerQueryValue(search.get("limit")),
  });

  if (!parsed.success) {
    return jsonFailure(
      "VALIDATION_ERROR",
      "Conversation message pagination is invalid.",
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

    const page = await listConversationMessagePage(
      auth.context.supabase,
      parsed.data,
    );

    return jsonSuccess(
      { page },
      { requestId: auth.context.requestId },
    );
  } catch (error) {
    if (error instanceof ConversationRepositoryError) {
      console.error("Conversation message page failed", {
        requestId: auth.context.requestId,
        operation: error.operation,
        message: error.message,
      });
    } else {
      console.error("Unexpected conversation message page failure", {
        requestId: auth.context.requestId,
        error,
      });
    }

    return jsonFailure(
      "PERSISTENCE_ERROR",
      "Conversation messages could not be loaded.",
      { status: 503, requestId: auth.context.requestId },
    );
  }
}
