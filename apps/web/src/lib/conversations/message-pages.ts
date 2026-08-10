import "server-only";

import type {
  ConversationMessage,
  ConversationMessagePage,
  ListConversationMessagesInput,
  Tables,
} from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";
import {
  ConversationRepositoryError,
  mapMessageRow,
} from "@/lib/conversations/repository";

type MessageRow = Tables<"messages">;
type GenerationRow = Tables<"message_generations">;
type CitationRow = Tables<"message_citations">;

export const DEFAULT_CONVERSATION_MESSAGE_PAGE_SIZE = 40;
export const MAX_CONVERSATION_MESSAGE_PAGE_SIZE = 50;

function paginationError(operation: string, message: string): never {
  throw new ConversationRepositoryError(operation, message);
}

async function hydrateMessageRows(
  supabase: SupabaseServerClient,
  workspaceId: string,
  conversationId: string,
  messages: MessageRow[],
): Promise<ConversationMessage[]> {
  if (messages.length === 0) return [];

  const assistantMessageIds = messages
    .filter((message) => message.role === "assistant")
    .map((message) => message.id);

  const generationByMessage = new Map<string, GenerationRow>();
  const citationsByMessage = new Map<string, CitationRow[]>();

  if (assistantMessageIds.length > 0) {
    const [generationResult, citationResult] = await Promise.all([
      supabase
        .from("message_generations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("conversation_id", conversationId)
        .in("message_id", assistantMessageIds),
      supabase
        .from("message_citations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("conversation_id", conversationId)
        .in("message_id", assistantMessageIds)
        .order("message_id", { ascending: true })
        .order("citation_order", { ascending: true }),
    ]);

    if (generationResult.error) {
      paginationError(
        "list-visible-message-generations",
        generationResult.error.message,
      );
    }

    if (citationResult.error) {
      paginationError(
        "list-visible-message-citations",
        citationResult.error.message,
      );
    }

    for (const generation of generationResult.data ?? []) {
      generationByMessage.set(generation.message_id, generation);
    }

    for (const citation of citationResult.data ?? []) {
      const current = citationsByMessage.get(citation.message_id) ?? [];
      current.push(citation);
      citationsByMessage.set(citation.message_id, current);
    }
  }

  return messages.map((message) =>
    mapMessageRow(
      message,
      generationByMessage.get(message.id) ?? null,
      citationsByMessage.get(message.id) ?? [],
    ),
  );
}

export async function listConversationMessagePage(
  supabase: SupabaseServerClient,
  input: ListConversationMessagesInput,
): Promise<ConversationMessagePage> {
  const limit = Math.min(
    Math.max(input.limit, 1),
    MAX_CONVERSATION_MESSAGE_PAGE_SIZE,
  );

  let query = supabase
    .from("messages")
    .select("*")
    .eq("workspace_id", input.workspaceId)
    .eq("conversation_id", input.conversationId)
    .order("sequence", { ascending: false })
    .limit(limit + 1);

  if (input.beforeSequence !== undefined) {
    query = query.lt("sequence", input.beforeSequence);
  }

  const { data, error } = await query;
  if (error) {
    paginationError("list-conversation-message-page", error.message);
  }

  const descendingRows = data ?? [];
  const hasMore = descendingRows.length > limit;
  const visibleRows = descendingRows.slice(0, limit).reverse();
  const messages = await hydrateMessageRows(
    supabase,
    input.workspaceId,
    input.conversationId,
    visibleRows,
  );

  return {
    messages,
    hasMore,
    nextCursor:
      hasMore && visibleRows.length > 0 ? visibleRows[0]!.sequence : null,
  };
}
