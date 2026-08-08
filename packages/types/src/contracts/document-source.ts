import { z } from "zod";
import {
  attachmentSchema,
  entityIdSchema,
  isoTimestampSchema,
  sourceSchema,
} from "./workspace";

export const DOCUMENT_STORAGE_BUCKET = "workspace-documents";
export const DOCUMENT_MAX_BYTES = 2 * 1024 * 1024;
export const DOCUMENT_MAX_QUERY_LENGTH = 500;
export const DOCUMENT_MAX_RESULTS = 20;

export const documentMediaTypeSchema = z.enum([
  "text/plain",
  "text/markdown",
]);
export type DocumentMediaType = z.infer<typeof documentMediaTypeSchema>;

export const documentExtensionSchema = z.enum(["txt", "md", "markdown"]);
export type DocumentExtension = z.infer<typeof documentExtensionSchema>;

export const documentFailureCodeSchema = z.enum([
  "UNSUPPORTED_FILE_TYPE",
  "FILE_EMPTY",
  "FILE_TOO_LARGE",
  "MEDIA_TYPE_MISMATCH",
  "INVALID_UTF8",
  "DISALLOWED_CONTROL_CONTENT",
  "LINE_TOO_LONG",
  "DUPLICATE_DOCUMENT",
  "STORAGE_UPLOAD_FAILED",
  "EXTRACTION_FAILED",
  "SOURCE_PERSISTENCE_FAILED",
  "STORAGE_DELETE_FAILED",
  "PERSISTENCE_ERROR",
]);
export type DocumentFailureCode = z.infer<
  typeof documentFailureCodeSchema
>;

export const attachmentProcessingStatusSchema = z.enum([
  "processing",
  "complete",
  "failed",
]);
export type AttachmentProcessingStatus = z.infer<
  typeof attachmentProcessingStatusSchema
>;

export const attachmentProcessingRunSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  attachmentId: entityIdSchema,
  createdBy: entityIdSchema,
  attempt: z.number().int().positive(),
  processor: z.string().min(1).max(120),
  processorVersion: z.string().min(1).max(120),
  status: attachmentProcessingStatusSchema,
  sourceCount: z.number().int().nonnegative(),
  characterCount: z.number().int().nonnegative(),
  failureCode: z.string().min(1).max(80).nullable(),
  failureMessage: z.string().max(500).nullable(),
  startedAt: isoTimestampSchema,
  completedAt: isoTimestampSchema.nullable(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});
export type AttachmentProcessingRun = z.infer<
  typeof attachmentProcessingRunSchema
>;

export const beginAttachmentProcessingInputSchema = z.object({
  workspaceId: entityIdSchema,
  fileName: z.string().trim().min(1).max(255),
  mediaType: documentMediaTypeSchema,
  byteSize: z.number().int().min(1).max(DOCUMENT_MAX_BYTES),
  contentSha256: z.string().regex(/^[0-9a-f]{64}$/u),
  processor: z.string().trim().min(1).max(120),
  processorVersion: z.string().trim().min(1).max(120),
});
export type BeginAttachmentProcessingInput = z.infer<
  typeof beginAttachmentProcessingInputSchema
>;

export const begunAttachmentProcessingSchema = z.object({
  attachmentId: entityIdSchema,
  processingRunId: entityIdSchema,
  objectPath: z.string().min(1),
});
export type BegunAttachmentProcessing = z.infer<
  typeof begunAttachmentProcessingSchema
>;

export const extractedPassageInputSchema = z.object({
  ordinal: z.number().int().nonnegative(),
  content: z.string().min(1).max(4000),
  pageNumber: z.number().int().positive().nullable(),
  startOffset: z.number().int().nonnegative(),
  endOffset: z.number().int().positive(),
  startLine: z.number().int().positive(),
  endLine: z.number().int().positive(),
});
export type ExtractedPassageInput = z.infer<
  typeof extractedPassageInputSchema
>;

export const finalizeAttachmentProcessingInputSchema = z.object({
  workspaceId: entityIdSchema,
  attachmentId: entityIdSchema,
  processingRunId: entityIdSchema,
  characterCount: z.number().int().min(1).max(DOCUMENT_MAX_BYTES),
  passages: extractedPassageInputSchema.array().min(1).max(4096),
});
export type FinalizeAttachmentProcessingInput = z.infer<
  typeof finalizeAttachmentProcessingInputSchema
>;

export const failAttachmentProcessingInputSchema = z.object({
  workspaceId: entityIdSchema,
  attachmentId: entityIdSchema,
  processingRunId: entityIdSchema,
  failureCode: documentFailureCodeSchema,
  failureMessage: z.string().max(500),
});
export type FailAttachmentProcessingInput = z.infer<
  typeof failAttachmentProcessingInputSchema
>;

export const attachmentIdInputSchema = z.object({
  workspaceId: entityIdSchema,
  attachmentId: entityIdSchema,
});
export type AttachmentIdInput = z.infer<typeof attachmentIdInputSchema>;

export const sourceIdInputSchema = attachmentIdInputSchema.extend({
  sourceId: entityIdSchema,
});
export type SourceIdInput = z.infer<typeof sourceIdInputSchema>;

export const searchWorkspaceSourcesInputSchema = z.object({
  workspaceId: entityIdSchema,
  query: z.string().trim().min(1).max(DOCUMENT_MAX_QUERY_LENGTH),
  limit: z.number().int().min(1).max(DOCUMENT_MAX_RESULTS).default(8),
});
export type SearchWorkspaceSourcesInput = z.infer<
  typeof searchWorkspaceSourcesInputSchema
>;

export const sourceSearchResultSchema = z.object({
  sourceId: entityIdSchema,
  attachmentId: entityIdSchema,
  fileName: z.string().min(1).max(255),
  mediaType: documentMediaTypeSchema,
  ordinal: z.number().int().nonnegative(),
  content: z.string().min(1).max(4000),
  pageNumber: z.number().int().positive().nullable(),
  startLine: z.number().int().positive().nullable(),
  endLine: z.number().int().positive().nullable(),
  rank: z.number().nonnegative(),
});
export type SourceSearchResult = z.infer<typeof sourceSearchResultSchema>;

export const documentDetailSchema = z.object({
  attachment: attachmentSchema,
  processingRuns: attachmentProcessingRunSchema.array(),
  sources: sourceSchema.array(),
});
export type DocumentDetail = z.infer<typeof documentDetailSchema>;
