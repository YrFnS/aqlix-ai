import "server-only";

import { z } from "zod";
import type { ConversationSummary } from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";
import {
  ConversationRepositoryError,
  mapConversationRow,
} from "@/lib/conversations/repository";

const conversationSummaryRowSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  created_by: z.string().uuid(),
  title: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  message_count: z.number().int().nonnegative(),
  last_message_at: z.string().nullable(),
});

type SummaryRpcResult = {
  data: unknown;
  error: { message: string } | null;
};

type SummaryRpc = (
  name: "list_conversation_summaries",
  args: {
    target_workspace_id: string;
    requested_include_archived: boolean;
  },
) => PromiseLike<SummaryRpcResult>;

export async function listConversationSummaries(
  supabase: SupabaseServerClient,
  workspaceId: string,
  options?: { includeArchived?: boolean },
): Promise<ConversationSummary[]> {
  // This migration-defined RPC is validated at runtime until the next full
  // Supabase type regeneration updates database.types.ts.
  const invokeSummaryRpc = supabase.rpc.bind(supabase) as unknown as SummaryRpc;
  const { data, error } = await invokeSummaryRpc(
    "list_conversation_summaries",
    {
      target_workspace_id: workspaceId,
      requested_include_archived: options?.includeArchived === true,
    },
  );

  if (error) {
    throw new ConversationRepositoryError(
      "list-conversation-summaries",
      error.message,
    );
  }

  const parsed = conversationSummaryRowSchema.array().safeParse(data ?? []);
  if (!parsed.success) {
    throw new ConversationRepositoryError(
      "list-conversation-summaries",
      "Conversation summary rows returned an invalid shape.",
    );
  }

  return parsed.data.map((row) => ({
    ...mapConversationRow(row),
    messageCount: row.message_count,
    lastMessageAt: row.last_message_at,
  }));
}
