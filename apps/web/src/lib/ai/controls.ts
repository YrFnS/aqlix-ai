import "server-only";

import {
  aiGenerationDenialCodeSchema,
  workspaceAiLimitsSchema,
  type AiGenerationOperation,
  type UpdateWorkspaceAiLimitsInput,
  type WorkspaceAiLimits,
} from "@iraqi-ai/types";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";
import { z } from "zod";
import { AiProviderError, type AiInputMessage } from "./provider";

interface RpcErrorShape {
  message: string;
  code?: string;
}

interface RpcResponseShape {
  data: unknown;
  error: RpcErrorShape | null;
}

interface UntypedRpcClient {
  rpc(
    functionName: string,
    args: Record<string, unknown>,
  ): PromiseLike<RpcResponseShape>;
}

function rpcClient(supabase: SupabaseServerClient): UntypedRpcClient {
  return supabase as unknown as UntypedRpcClient;
}

export class AiControlRepositoryError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
    public readonly databaseCode?: string,
  ) {
    super(message);
    this.name = "AiControlRepositoryError";
  }
}

const limitsRowSchema = z.object({
  workspace_id: z.string().uuid(),
  enabled: z.boolean(),
  daily_request_limit: z.number().int(),
  daily_input_token_limit: z.number().int(),
  daily_output_token_limit: z.number().int(),
  max_concurrent_generations: z.number().int(),
  requests_used: z.coerce.number().int(),
  input_tokens_used: z.coerce.number().int(),
  output_tokens_used: z.coerce.number().int(),
  active_generations: z.coerce.number().int(),
  resets_at: z.string(),
  updated_at: z.string(),
});

const permitRowSchema = z.object({
  permit_id: z.string().uuid().nullable(),
  allowed: z.boolean(),
  denial_code: z.string().nullable(),
});

function mapLimitsRow(value: unknown): WorkspaceAiLimits {
  const row = limitsRowSchema.parse(value);
  return workspaceAiLimitsSchema.parse({
    workspaceId: row.workspace_id,
    enabled: row.enabled,
    dailyRequestLimit: row.daily_request_limit,
    dailyInputTokenLimit: row.daily_input_token_limit,
    dailyOutputTokenLimit: row.daily_output_token_limit,
    maxConcurrentGenerations: row.max_concurrent_generations,
    requestsUsed: row.requests_used,
    inputTokensUsed: row.input_tokens_used,
    outputTokensUsed: row.output_tokens_used,
    activeGenerations: row.active_generations,
    resetsAt: row.resets_at,
    updatedAt: row.updated_at,
  });
}

function repositoryFailure(
  operation: string,
  error: RpcErrorShape | null,
): never {
  throw new AiControlRepositoryError(
    operation,
    error?.message || "The AI control operation returned no durable result.",
    error?.code,
  );
}

export async function getWorkspaceAiLimits(
  supabase: SupabaseServerClient,
  workspaceId: string,
): Promise<WorkspaceAiLimits> {
  const { data, error } = await rpcClient(supabase).rpc(
    "get_workspace_ai_limits",
    { target_workspace_id: workspaceId },
  );

  if (error) repositoryFailure("get-workspace-ai-limits", error);
  const rows = z.array(z.unknown()).parse(data ?? []);
  if (!rows[0]) repositoryFailure("get-workspace-ai-limits", null);
  return mapLimitsRow(rows[0]);
}

export async function updateWorkspaceAiLimits(
  supabase: SupabaseServerClient,
  input: UpdateWorkspaceAiLimitsInput,
): Promise<WorkspaceAiLimits> {
  const { data, error } = await rpcClient(supabase).rpc(
    "set_workspace_ai_limits",
    {
      target_workspace_id: input.workspaceId,
      requested_enabled: input.enabled,
      requested_daily_request_limit: input.dailyRequestLimit,
      requested_daily_input_token_limit: input.dailyInputTokenLimit,
      requested_daily_output_token_limit: input.dailyOutputTokenLimit,
      requested_max_concurrent_generations: input.maxConcurrentGenerations,
    },
  );

  if (error || data !== true) {
    repositoryFailure("update-workspace-ai-limits", error);
  }

  return getWorkspaceAiLimits(supabase, input.workspaceId);
}

export function estimateProviderInputTokens(
  messages: AiInputMessage[],
  instructions?: string,
): number {
  const encoder = new TextEncoder();
  let bytes = instructions ? encoder.encode(instructions).byteLength : 0;

  for (const message of messages) {
    bytes += encoder.encode(message.role).byteLength;
    bytes += encoder.encode(message.content).byteLength;
    bytes += 16;
  }

  // Reservation is intentionally conservative and provider-independent. Final
  // accounting is replaced atomically with provider-reported token usage when
  // the durable generation reaches a terminal state.
  return Math.min(10_000_000, Math.max(1, bytes));
}

function denialMessage(
  code:
    | "PROVIDER_DISABLED"
    | "PROVIDER_BUDGET_EXCEEDED"
    | "PROVIDER_CONCURRENCY_LIMIT",
): string {
  switch (code) {
    case "PROVIDER_DISABLED":
      return "AI generation is disabled for this workspace.";
    case "PROVIDER_CONCURRENCY_LIMIT":
      return "This workspace already has the maximum number of active generations.";
    case "PROVIDER_BUDGET_EXCEEDED":
      return "This workspace has reached its current daily AI budget.";
  }
}

export async function reserveAiGenerationPermit(
  supabase: SupabaseServerClient,
  input: {
    workspaceId: string;
    operation: AiGenerationOperation;
    generationId: string;
    estimatedInputTokens: number;
    reservedOutputTokens: number;
  },
): Promise<string> {
  const { data, error } = await rpcClient(supabase).rpc(
    "reserve_ai_generation_permit",
    {
      target_workspace_id: input.workspaceId,
      requested_operation: input.operation,
      requested_generation_id: input.generationId,
      estimated_input_tokens: input.estimatedInputTokens,
      requested_output_tokens: input.reservedOutputTokens,
    },
  );

  if (error) repositoryFailure("reserve-ai-generation-permit", error);
  const rows = z.array(permitRowSchema).parse(data ?? []);
  const row = rows[0];
  if (!row) repositoryFailure("reserve-ai-generation-permit", null);

  if (!row.allowed) {
    const code = aiGenerationDenialCodeSchema.parse(row.denial_code);
    throw new AiProviderError(
      code,
      denialMessage(code),
      code !== "PROVIDER_DISABLED",
      429,
    );
  }

  if (!row.permit_id) repositoryFailure("reserve-ai-generation-permit", null);
  return row.permit_id;
}
