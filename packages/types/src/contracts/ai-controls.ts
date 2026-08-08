import { z } from "zod";
import { entityIdSchema, isoTimestampSchema } from "./workspace";

export const aiGenerationOperationSchema = z.enum(["conversation", "draft"]);
export type AiGenerationOperation = z.infer<
  typeof aiGenerationOperationSchema
>;

export const aiGenerationDenialCodeSchema = z.enum([
  "PROVIDER_DISABLED",
  "PROVIDER_BUDGET_EXCEEDED",
  "PROVIDER_CONCURRENCY_LIMIT",
]);
export type AiGenerationDenialCode = z.infer<
  typeof aiGenerationDenialCodeSchema
>;

export const workspaceAiLimitsSchema = z.object({
  workspaceId: entityIdSchema,
  enabled: z.boolean(),
  dailyRequestLimit: z.number().int().min(1).max(10000),
  dailyInputTokenLimit: z.number().int().min(1000).max(100000000),
  dailyOutputTokenLimit: z.number().int().min(1000).max(100000000),
  maxConcurrentGenerations: z.number().int().min(1).max(20),
  requestsUsed: z.number().int().nonnegative(),
  inputTokensUsed: z.number().int().nonnegative(),
  outputTokensUsed: z.number().int().nonnegative(),
  activeGenerations: z.number().int().nonnegative(),
  resetsAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type WorkspaceAiLimits = z.infer<typeof workspaceAiLimitsSchema>;

export const updateWorkspaceAiLimitsInputSchema = z.object({
  workspaceId: entityIdSchema,
  enabled: z.boolean(),
  dailyRequestLimit: z.number().int().min(1).max(10000),
  dailyInputTokenLimit: z.number().int().min(1000).max(100000000),
  dailyOutputTokenLimit: z.number().int().min(1000).max(100000000),
  maxConcurrentGenerations: z.number().int().min(1).max(20),
});

export type UpdateWorkspaceAiLimitsInput = z.infer<
  typeof updateWorkspaceAiLimitsInputSchema
>;

export const aiGenerationPermitReservationSchema = z.object({
  permitId: entityIdSchema,
  operation: aiGenerationOperationSchema,
  estimatedInputTokens: z.number().int().min(1).max(10000000),
  reservedOutputTokens: z.number().int().min(1).max(100000),
});

export type AiGenerationPermitReservation = z.infer<
  typeof aiGenerationPermitReservationSchema
>;
