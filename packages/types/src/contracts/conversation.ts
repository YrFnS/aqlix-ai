import { z } from "zod";
import {
  contentDirectionSchema,
  conversationSchema,
  entityIdSchema,
  isoTimestampSchema,
  messageSchema,
  messageStatusSchema,
} from "./workspace";

export const conversationTitleSchema = z
  .string()
  .trim()
  .min(1, "Conversation title is required")
  .max(200, "Conversation title must be 200 characters or fewer");

export const createConversationInputSchema = z.object({
  workspaceId: entityIdSchema,
  title: conversationTitleSchema.optional().default("محادثة جديدة"),
});

export type CreateConversationInput = z.infer<
  typeof createConversationInputSchema
>;

export const conversationIdInputSchema = z.object({
  workspaceId: entityIdSchema,
  conversationId: entityIdSchema,
});

export type ConversationIdInput = z.infer<typeof conversationIdInputSchema>;

export const updateConversationInputSchema = conversationIdInputSchema
  .extend({
    title: conversationTitleSchema.optional(),
    status: z.enum(["active", "archived"]).optional(),
  })
  .refine(
    (input) => input.title !== undefined || input.status !== undefined,
    {
      message: "At least one conversation field must be supplied",
      path: ["conversationId"],
    },
  );

export type UpdateConversationInput = z.infer<
  typeof updateConversationInputSchema
>;

export const conversationMessageContentSchema = z
  .string()
  .trim()
  .min(1, "Message content is required")
  .max(20000, "Message content must be 20000 characters or fewer");

export const groundingModeSchema = z.enum(["off", "workspace_sources"]);
export type GroundingMode = z.infer<typeof groundingModeSchema>;

export const streamConversationInputSchema = conversationIdInputSchema
  .extend({
    content: conversationMessageContentSchema.optional(),
    direction: contentDirectionSchema.optional().default("auto"),
    retryMessageId: entityIdSchema.optional(),
    groundingMode: groundingModeSchema.optional().default("off"),
  })
  .superRefine((input, context) => {
    const hasContent = input.content !== undefined;
    const hasRetry = input.retryMessageId !== undefined;

    if (hasContent === hasRetry) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either new message content or a retry message ID",
        path: ["content"],
      });
    }
  });

export type StreamConversationInput = z.infer<
  typeof streamConversationInputSchema
>;

export const generationStatusSchema = messageStatusSchema;
export type GenerationStatus = z.infer<typeof generationStatusSchema>;

export const providerFailureCodeSchema = z.enum([
  "PROVIDER_UNCONFIGURED",
  "PROVIDER_AUTHENTICATION",
  "PROVIDER_RATE_LIMITED",
  "PROVIDER_TIMEOUT",
  "PROVIDER_UNAVAILABLE",
  "PROVIDER_RESPONSE_INVALID",
  "NO_RELEVANT_SOURCES",
  "CITATION_REQUIRED",
  "CITATION_INVALID",
  "STREAM_CANCELLED",
  "PERSISTENCE_ERROR",
  "UNKNOWN_PROVIDER_ERROR",
]);

export type ProviderFailureCode = z.infer<typeof providerFailureCodeSchema>;

export const messageCitationSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  conversationId: entityIdSchema,
  messageId: entityIdSchema,
  sourceId: entityIdSchema.nullable(),
  attachmentId: entityIdSchema.nullable(),
  citationOrder: z.number().int().nonnegative(),
  label: z.string().regex(/^S[1-9][0-9]*$/u),
  fileNameSnapshot: z.string().min(1).max(255),
  mediaTypeSnapshot: z.string().min(1).max(255),
  sourceOrdinalSnapshot: z.number().int().nonnegative(),
  pageNumberSnapshot: z.number().int().positive().nullable(),
  startLineSnapshot: z.number().int().positive().nullable(),
  endLineSnapshot: z.number().int().positive().nullable(),
  createdAt: isoTimestampSchema,
});

export type MessageCitation = z.infer<typeof messageCitationSchema>;

export const messageGenerationSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  conversationId: entityIdSchema,
  messageId: entityIdSchema,
  createdBy: entityIdSchema,
  provider: z.string().min(1).max(64),
  requestedModel: z.string().min(1).max(160),
  returnedModel: z.string().min(1).max(160).nullable(),
  providerResponseId: z.string().max(255).nullable(),
  status: generationStatusSchema,
  groundingMode: groundingModeSchema,
  retrievedSourceCount: z.number().int().nonnegative(),
  citationCount: z.number().int().nonnegative(),
  inputTokens: z.number().int().nonnegative().nullable(),
  outputTokens: z.number().int().nonnegative().nullable(),
  reasoningTokens: z.number().int().nonnegative().nullable(),
  totalTokens: z.number().int().nonnegative().nullable(),
  firstTokenLatencyMs: z.number().int().nonnegative().nullable(),
  latencyMs: z.number().int().nonnegative().nullable(),
  failureCode: z.string().max(120).nullable(),
  failureMessage: z.string().max(2000).nullable(),
  startedAt: isoTimestampSchema,
  completedAt: isoTimestampSchema.nullable(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type MessageGeneration = z.infer<typeof messageGenerationSchema>;

export const conversationMessageSchema = messageSchema.extend({
  generation: messageGenerationSchema.nullable(),
  citations: messageCitationSchema.array(),
});

export type ConversationMessage = z.infer<typeof conversationMessageSchema>;

export const conversationSummarySchema = conversationSchema.extend({
  messageCount: z.number().int().nonnegative(),
  lastMessageAt: isoTimestampSchema.nullable(),
});

export type ConversationSummary = z.infer<typeof conversationSummarySchema>;

export const conversationTurnReadyEventSchema = z.object({
  type: z.literal("ready"),
  conversationId: entityIdSchema,
  userMessage: conversationMessageSchema.nullable(),
  assistantMessage: conversationMessageSchema,
});

export const conversationTurnDeltaEventSchema = z.object({
  type: z.literal("delta"),
  messageId: entityIdSchema,
  delta: z.string(),
});

export const conversationTurnCompleteEventSchema = z.object({
  type: z.literal("complete"),
  message: conversationMessageSchema,
});

export const conversationTurnFailedEventSchema = z.object({
  type: z.literal("failed"),
  message: conversationMessageSchema,
  code: providerFailureCodeSchema,
  retryable: z.boolean(),
});

export const conversationTurnCancelledEventSchema = z.object({
  type: z.literal("cancelled"),
  message: conversationMessageSchema,
});

export const conversationTurnHeartbeatEventSchema = z.object({
  type: z.literal("heartbeat"),
  at: isoTimestampSchema,
});

export const conversationStreamEventSchema = z.discriminatedUnion("type", [
  conversationTurnReadyEventSchema,
  conversationTurnDeltaEventSchema,
  conversationTurnCompleteEventSchema,
  conversationTurnFailedEventSchema,
  conversationTurnCancelledEventSchema,
  conversationTurnHeartbeatEventSchema,
]);

export type ConversationStreamEvent = z.infer<
  typeof conversationStreamEventSchema
>;
