import type {
  AiInputMessage,
} from "@/lib/ai/provider";
import type {
  Conversation,
  ConversationMessage,
  ConversationSummary,
  CreateConversationInput,
  MessageGeneration,
  ProviderFailureCode,
  Tables,
  TablesUpdate,
  UpdateConversationInput,
} from "@iraqi-ai/types";
import {
  contentDirectionSchema,
  conversationStatusSchema,
  messageRoleSchema,
  messageStatusSchema,
} from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";

type ConversationRow = Tables<"conversations">;
type MessageRow = Tables<"messages">;
type GenerationRow = Tables<"message_generations">;

export class ConversationRepositoryError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
  ) {
    super(message);
    this.name = "ConversationRepositoryError";
  }
}

function repositoryError(operation: string, message: string): never {
  throw new ConversationRepositoryError(operation, message);
}

function parseConversationStatus(value: string): "active" | "archived" {
  const parsed = conversationStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : "active";
}

function parseMessageRole(
  value: string,
): "system" | "user" | "assistant" | "tool" {
  const parsed = messageRoleSchema.safeParse(value);
  return parsed.success ? parsed.data : "assistant";
}

function parseMessageStatus(
  value: string,
): "pending" | "streaming" | "complete" | "failed" | "cancelled" {
  const parsed = messageStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : "failed";
}

function parseDirection(value: string): "auto" | "rtl" | "ltr" {
  const parsed = contentDirectionSchema.safeParse(value);
  return parsed.success ? parsed.data : "auto";
}

export function mapConversationRow(row: ConversationRow): Conversation {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    createdBy: row.created_by,
    title: row.title,
    status: parseConversationStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapGenerationRow(row: GenerationRow): MessageGeneration {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    conversationId: row.conversation_id,
    messageId: row.message_id,
    createdBy: row.created_by,
    provider: row.provider,
    requestedModel: row.requested_model,
    returnedModel: row.returned_model,
    providerResponseId: row.provider_response_id,
    status: parseMessageStatus(row.status),
    inputTokens: row.input_tokens,
    outputTokens: row.output_tokens,
    reasoningTokens: row.reasoning_tokens,
    totalTokens: row.total_tokens,
    firstTokenLatencyMs: row.first_token_latency_ms,
    latencyMs: row.latency_ms,
    failureCode: row.failure_code,
    failureMessage: row.failure_message,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMessageRow(
  row: MessageRow,
  generation: GenerationRow | null = null,
): ConversationMessage {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    conversationId: row.conversation_id,
    createdBy: row.created_by,
    role: parseMessageRole(row.role),
    status: parseMessageStatus(row.status),
    content: row.content,
    direction: parseDirection(row.direction),
    sequence: row.sequence,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    generation: generation ? mapGenerationRow(generation) : null,
  };
}

export async function listConversations(
  supabase: SupabaseServerClient,
  workspaceId: string,
  options?: { includeArchived?: boolean },
): Promise<ConversationSummary[]> {
  const conversationResult = options?.includeArchived
    ? await supabase
        .from("conversations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("updated_at", { ascending: false })
    : await supabase
        .from("conversations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .order("updated_at", { ascending: false });

  if (conversationResult.error) {
    repositoryError("list-conversations", conversationResult.error.message);
  }

  const rows = conversationResult.data ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const { data: messageRows, error: messageError } = await supabase
    .from("messages")
    .select("conversation_id, created_at")
    .eq("workspace_id", workspaceId)
    .in("conversation_id", ids);

  if (messageError) {
    repositoryError("list-conversation-message-metadata", messageError.message);
  }

  const metadata = new Map<
    string,
    { count: number; lastMessageAt: string | null }
  >();

  for (const message of messageRows ?? []) {
    const current = metadata.get(message.conversation_id) ?? {
      count: 0,
      lastMessageAt: null,
    };

    current.count += 1;
    if (
      current.lastMessageAt === null ||
      message.created_at > current.lastMessageAt
    ) {
      current.lastMessageAt = message.created_at;
    }
    metadata.set(message.conversation_id, current);
  }

  return rows.map((row) => {
    const messageMetadata = metadata.get(row.id);
    return {
      ...mapConversationRow(row),
      messageCount: messageMetadata?.count ?? 0,
      lastMessageAt: messageMetadata?.lastMessageAt ?? null,
    };
  });
}

export async function getConversation(
  supabase: SupabaseServerClient,
  workspaceId: string,
  conversationId: string,
): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", conversationId)
    .maybeSingle();

  if (error) repositoryError("get-conversation", error.message);
  return data ? mapConversationRow(data) : null;
}

export async function createConversation(
  supabase: SupabaseServerClient,
  userId: string,
  input: CreateConversationInput,
): Promise<Conversation> {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      workspace_id: input.workspaceId,
      created_by: userId,
      title: input.title,
      status: "active",
    })
    .select("*")
    .single();

  if (error) repositoryError("create-conversation", error.message);
  return mapConversationRow(data);
}

export async function updateConversation(
  supabase: SupabaseServerClient,
  input: UpdateConversationInput,
): Promise<Conversation | null> {
  const updates: TablesUpdate<"conversations"> = {};
  if (input.title !== undefined) updates.title = input.title;
  if (input.status !== undefined) updates.status = input.status;

  const { data, error } = await supabase
    .from("conversations")
    .update(updates)
    .eq("workspace_id", input.workspaceId)
    .eq("id", input.conversationId)
    .select("*")
    .maybeSingle();

  if (error) repositoryError("update-conversation", error.message);
  return data ? mapConversationRow(data) : null;
}

export async function deleteConversation(
  supabase: SupabaseServerClient,
  workspaceId: string,
  conversationId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("workspace_id", workspaceId)
    .eq("id", conversationId)
    .select("id");

  if (error) repositoryError("delete-conversation", error.message);
  return Boolean(data && data.length > 0);
}

export async function listConversationMessages(
  supabase: SupabaseServerClient,
  workspaceId: string,
  conversationId: string,
): Promise<ConversationMessage[]> {
  const { data: messages, error: messageError } = await supabase
    .from("messages")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("conversation_id", conversationId)
    .order("sequence", { ascending: true });

  if (messageError) {
    repositoryError("list-conversation-messages", messageError.message);
  }

  if (!messages || messages.length === 0) return [];

  const assistantMessageIds = messages
    .filter((message) => message.role === "assistant")
    .map((message) => message.id);

  const generationByMessage = new Map<string, GenerationRow>();
  if (assistantMessageIds.length > 0) {
    const { data: generations, error: generationError } = await supabase
      .from("message_generations")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("conversation_id", conversationId)
      .in("message_id", assistantMessageIds);

    if (generationError) {
      repositoryError("list-message-generations", generationError.message);
    }

    for (const generation of generations ?? []) {
      generationByMessage.set(generation.message_id, generation);
    }
  }

  return messages.map((message) =>
    mapMessageRow(message, generationByMessage.get(message.id) ?? null),
  );
}

export async function getConversationMessage(
  supabase: SupabaseServerClient,
  workspaceId: string,
  conversationId: string,
  messageId: string,
): Promise<ConversationMessage | null> {
  const { data: message, error: messageError } = await supabase
    .from("messages")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("conversation_id", conversationId)
    .eq("id", messageId)
    .maybeSingle();

  if (messageError) repositoryError("get-message", messageError.message);
  if (!message) return null;

  let generation: GenerationRow | null = null;
  if (message.role === "assistant") {
    const { data, error } = await supabase
      .from("message_generations")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("conversation_id", conversationId)
      .eq("message_id", messageId)
      .maybeSingle();

    if (error) repositoryError("get-message-generation", error.message);
    generation = data;
  }

  return mapMessageRow(message, generation);
}

export interface BegunConversationTurn {
  userMessageId: string | null;
  assistantMessageId: string;
  generationId: string;
  userSequence: number | null;
  assistantSequence: number;
  promptContent: string;
}

export async function beginConversationTurn(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    conversationId: string;
    content: string | null;
    direction: "auto" | "rtl" | "ltr";
    provider: string;
    requestedModel: string;
    retryMessageId?: string;
  },
): Promise<BegunConversationTurn> {
  const { data, error } = await supabase.rpc("begin_conversation_turn", {
    target_workspace_id: input.workspaceId,
    target_conversation_id: input.conversationId,
    message_content: input.content,
    message_direction: input.direction,
    requested_provider: input.provider,
    requested_model: input.requestedModel,
    retry_message_id: input.retryMessageId ?? null,
  });

  if (error) repositoryError("begin-conversation-turn", error.message);
  const row = data?.[0];
  if (!row) repositoryError("begin-conversation-turn", "No turn was created");

  return {
    userMessageId: row.user_message_id,
    assistantMessageId: row.assistant_message_id,
    generationId: row.generation_id,
    userSequence: row.user_sequence,
    assistantSequence: row.assistant_sequence,
    promptContent: row.prompt_content,
  };
}

export async function checkpointConversationGeneration(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    conversationId: string;
    messageId: string;
    generationId: string;
    content: string;
    firstTokenLatencyMs: number | null;
  },
): Promise<void> {
  const { error } = await supabase.rpc("checkpoint_conversation_generation", {
    target_workspace_id: input.workspaceId,
    target_conversation_id: input.conversationId,
    target_message_id: input.messageId,
    target_generation_id: input.generationId,
    partial_content: input.content,
    first_token_ms: input.firstTokenLatencyMs,
  });

  if (error) repositoryError("checkpoint-generation", error.message);
}

export async function finishConversationGeneration(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    conversationId: string;
    messageId: string;
    generationId: string;
    status: "complete" | "failed" | "cancelled";
    content: string;
    returnedModel: string | null;
    providerResponseId: string | null;
    inputTokens: number | null;
    outputTokens: number | null;
    reasoningTokens: number | null;
    totalTokens: number | null;
    firstTokenLatencyMs: number | null;
    latencyMs: number;
    failureCode: ProviderFailureCode | null;
    failureMessage: string | null;
  },
): Promise<void> {
  const { error } = await supabase.rpc("finish_conversation_generation", {
    target_workspace_id: input.workspaceId,
    target_conversation_id: input.conversationId,
    target_message_id: input.messageId,
    target_generation_id: input.generationId,
    final_status: input.status,
    final_content: input.content,
    returned_provider_model: input.returnedModel,
    provider_response_identifier: input.providerResponseId,
    provider_input_tokens: input.inputTokens,
    provider_output_tokens: input.outputTokens,
    provider_reasoning_tokens: input.reasoningTokens,
    provider_total_tokens: input.totalTokens,
    first_token_ms: input.firstTokenLatencyMs,
    total_latency_ms: input.latencyMs,
    provider_failure_code: input.failureCode,
    provider_failure_message: input.failureMessage,
  });

  if (error) repositoryError("finish-generation", error.message);
}

export async function getConversationProviderHistory(
  supabase: SupabaseServerClient,
  workspaceId: string,
  conversationId: string,
  limit = 40,
): Promise<AiInputMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content, sequence")
    .eq("workspace_id", workspaceId)
    .eq("conversation_id", conversationId)
    .eq("status", "complete")
    .in("role", ["user", "assistant"])
    .order("sequence", { ascending: false })
    .limit(limit);

  if (error) repositoryError("get-provider-history", error.message);

  return (data ?? [])
    .reverse()
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    }));
}
