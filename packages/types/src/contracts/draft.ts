import { z } from "zod";
import { providerFailureCodeSchema } from "./conversation";
import {
  contentDirectionSchema,
  draftKindSchema,
  draftSchema,
  entityIdSchema,
  isoTimestampSchema,
} from "./workspace";

export const DRAFT_MAX_CONTENT_LENGTH = 100000;
export const DRAFT_MAX_INSTRUCTION_LENGTH = 2000;

export const draftVersionSourceSchema = z.enum([
  "initial",
  "manual",
  "ai",
  "restored",
]);
export type DraftVersionSource = z.infer<typeof draftVersionSourceSchema>;

export const draftVersionSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  draftId: entityIdSchema,
  versionNumber: z.number().int().positive(),
  createdBy: entityIdSchema,
  sourceKind: draftVersionSourceSchema,
  title: z.string().min(1).max(200),
  content: z.string().max(DRAFT_MAX_CONTENT_LENGTH),
  direction: contentDirectionSchema,
  kind: draftKindSchema,
  generationId: entityIdSchema.nullable(),
  restoredFromVersion: z.number().int().positive().nullable(),
  createdAt: isoTimestampSchema,
});
export type DraftVersion = z.infer<typeof draftVersionSchema>;

export const draftProvenanceSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  draftId: entityIdSchema,
  conversationId: entityIdSchema.nullable(),
  originMessageId: entityIdSchema.nullable(),
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
export type DraftProvenance = z.infer<typeof draftProvenanceSchema>;

export const draftGenerationActionSchema = z.enum([
  "improve",
  "shorten",
  "expand",
  "translate_ar",
  "translate_en",
  "continue",
  "custom",
]);
export type DraftGenerationAction = z.infer<
  typeof draftGenerationActionSchema
>;

export const draftGenerationStatusSchema = z.enum([
  "pending",
  "streaming",
  "complete",
  "failed",
  "cancelled",
  "applied",
  "discarded",
]);
export type DraftGenerationStatus = z.infer<
  typeof draftGenerationStatusSchema
>;

export const draftGenerationSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  draftId: entityIdSchema,
  createdBy: entityIdSchema,
  baseVersion: z.number().int().positive(),
  action: draftGenerationActionSchema,
  instruction: z.string().min(1).max(DRAFT_MAX_INSTRUCTION_LENGTH),
  provider: z.string().min(1).max(64),
  requestedModel: z.string().min(1).max(255),
  returnedModel: z.string().min(1).max(255).nullable(),
  providerResponseId: z.string().max(255).nullable(),
  status: draftGenerationStatusSchema,
  proposedContent: z.string().max(DRAFT_MAX_CONTENT_LENGTH),
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
  appliedAt: isoTimestampSchema.nullable(),
  discardedAt: isoTimestampSchema.nullable(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});
export type DraftGeneration = z.infer<typeof draftGenerationSchema>;

export const draftDetailSchema = z.object({
  draft: draftSchema,
  versions: draftVersionSchema.array(),
  provenance: draftProvenanceSchema.array(),
  generations: draftGenerationSchema.array(),
});
export type DraftDetail = z.infer<typeof draftDetailSchema>;

export const createDraftFromMessageInputSchema = z.object({
  workspaceId: entityIdSchema,
  conversationId: entityIdSchema,
  messageId: entityIdSchema,
  kind: draftKindSchema.exclude(["freeform"]),
});
export type CreateDraftFromMessageInput = z.infer<
  typeof createDraftFromMessageInputSchema
>;

export const draftIdInputSchema = z.object({
  workspaceId: entityIdSchema,
  draftId: entityIdSchema,
});
export type DraftIdInput = z.infer<typeof draftIdInputSchema>;

export const saveDraftInputSchema = draftIdInputSchema.extend({
  expectedVersion: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  content: z.string().max(DRAFT_MAX_CONTENT_LENGTH),
  direction: contentDirectionSchema,
  kind: draftKindSchema,
});
export type SaveDraftInput = z.infer<typeof saveDraftInputSchema>;

export const restoreDraftVersionInputSchema = draftIdInputSchema.extend({
  expectedVersion: z.number().int().positive(),
  restoreVersion: z.number().int().positive(),
});
export type RestoreDraftVersionInput = z.infer<
  typeof restoreDraftVersionInputSchema
>;

export const setDraftArchivedInputSchema = draftIdInputSchema.extend({
  archived: z.boolean(),
});
export type SetDraftArchivedInput = z.infer<
  typeof setDraftArchivedInputSchema
>;

export const draftExportFormatSchema = z.enum(["txt", "md", "html"]);
export type DraftExportFormat = z.infer<typeof draftExportFormatSchema>;

export const exportDraftInputSchema = draftIdInputSchema.extend({
  format: draftExportFormatSchema,
});
export type ExportDraftInput = z.infer<typeof exportDraftInputSchema>;

const draftInstructionSchema = z
  .string()
  .trim()
  .min(1)
  .max(DRAFT_MAX_INSTRUCTION_LENGTH);

export const continueDraftInputSchema = draftIdInputSchema.extend({
  action: draftGenerationActionSchema,
  instruction: draftInstructionSchema,
});
export type ContinueDraftInput = z.infer<typeof continueDraftInputSchema>;

export const draftGenerationIdInputSchema = draftIdInputSchema.extend({
  generationId: entityIdSchema,
});
export type DraftGenerationIdInput = z.infer<
  typeof draftGenerationIdInputSchema
>;

export const draftProposalReadyEventSchema = z.object({
  type: z.literal("ready"),
  generation: draftGenerationSchema,
});

export const draftProposalDeltaEventSchema = z.object({
  type: z.literal("delta"),
  generationId: entityIdSchema,
  delta: z.string(),
});

export const draftProposalCompleteEventSchema = z.object({
  type: z.literal("complete"),
  generation: draftGenerationSchema,
});

export const draftProposalFailedEventSchema = z.object({
  type: z.literal("failed"),
  generation: draftGenerationSchema,
  code: providerFailureCodeSchema,
  retryable: z.boolean(),
});

export const draftProposalCancelledEventSchema = z.object({
  type: z.literal("cancelled"),
  generation: draftGenerationSchema,
});

export const draftProposalHeartbeatEventSchema = z.object({
  type: z.literal("heartbeat"),
  at: isoTimestampSchema,
});

export const draftProposalStreamEventSchema = z.discriminatedUnion("type", [
  draftProposalReadyEventSchema,
  draftProposalDeltaEventSchema,
  draftProposalCompleteEventSchema,
  draftProposalFailedEventSchema,
  draftProposalCancelledEventSchema,
  draftProposalHeartbeatEventSchema,
]);
export type DraftProposalStreamEvent = z.infer<
  typeof draftProposalStreamEventSchema
>;
