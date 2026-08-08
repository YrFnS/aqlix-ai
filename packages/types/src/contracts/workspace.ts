import { z } from "zod";

export const entityIdSchema = z.string().uuid();
export const isoTimestampSchema = z.string().datetime({ offset: true });

export const contentDirectionSchema = z.enum(["auto", "rtl", "ltr"]);
export type ContentDirection = z.infer<typeof contentDirectionSchema>;

export const workspaceLanguageSchema = z.enum(["auto", "ar", "en"]);
export type WorkspaceLanguage = z.infer<typeof workspaceLanguageSchema>;

export const workspaceRoleSchema = z.enum(["owner", "editor", "viewer"]);
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

export const workspaceSchema = z.object({
  id: entityIdSchema,
  ownerId: entityIdSchema,
  name: z.string().min(1).max(120),
  description: z.string().max(1000).nullable(),
  defaultLanguage: workspaceLanguageSchema,
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
  archivedAt: isoTimestampSchema.nullable(),
});

export type Workspace = z.infer<typeof workspaceSchema>;

export const workspaceMembershipSchema = z.object({
  workspaceId: entityIdSchema,
  userId: entityIdSchema,
  role: workspaceRoleSchema,
  createdAt: isoTimestampSchema,
});

export type WorkspaceMembership = z.infer<typeof workspaceMembershipSchema>;

const workspaceNameSchema = z
  .string()
  .trim()
  .min(1, "Workspace name is required")
  .max(120, "Workspace name must be 120 characters or fewer");

const workspaceDescriptionSchema = z
  .string()
  .trim()
  .max(1000, "Workspace description must be 1000 characters or fewer");

export const createWorkspaceInputSchema = z.object({
  name: workspaceNameSchema,
  description: workspaceDescriptionSchema.optional().default(""),
  defaultLanguage: workspaceLanguageSchema.optional().default("auto"),
});

export type CreateWorkspaceInput = z.infer<
  typeof createWorkspaceInputSchema
>;

export const updateWorkspaceInputSchema = z
  .object({
    workspaceId: entityIdSchema,
    name: workspaceNameSchema.optional(),
    description: workspaceDescriptionSchema.optional(),
    defaultLanguage: workspaceLanguageSchema.optional(),
  })
  .refine(
    (input) =>
      input.name !== undefined ||
      input.description !== undefined ||
      input.defaultLanguage !== undefined,
    {
      message: "At least one workspace field must be supplied",
      path: ["workspaceId"],
    },
  );

export type UpdateWorkspaceInput = z.infer<
  typeof updateWorkspaceInputSchema
>;

export const workspaceIdInputSchema = z.object({
  workspaceId: entityIdSchema,
});

export type WorkspaceIdInput = z.infer<typeof workspaceIdInputSchema>;

export const deleteWorkspaceInputSchema = workspaceIdInputSchema.extend({
  confirmationName: workspaceNameSchema,
});

export type DeleteWorkspaceInput = z.infer<
  typeof deleteWorkspaceInputSchema
>;

export const conversationStatusSchema = z.enum(["active", "archived"]);

export const conversationSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  createdBy: entityIdSchema,
  title: z.string().min(1).max(200),
  status: conversationStatusSchema,
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type Conversation = z.infer<typeof conversationSchema>;

export const messageRoleSchema = z.enum([
  "system",
  "user",
  "assistant",
  "tool",
]);

export const messageStatusSchema = z.enum([
  "pending",
  "streaming",
  "complete",
  "failed",
  "cancelled",
]);

export const messageSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  conversationId: entityIdSchema,
  createdBy: entityIdSchema.nullable(),
  role: messageRoleSchema,
  status: messageStatusSchema,
  content: z.string(),
  direction: contentDirectionSchema,
  sequence: z.number().int().nonnegative(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type Message = z.infer<typeof messageSchema>;

export const attachmentStatusSchema = z.enum([
  "pending",
  "processing",
  "ready",
  "failed",
  "deleted",
]);

export const attachmentSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  uploadedBy: entityIdSchema,
  fileName: z.string().min(1).max(255),
  mediaType: z.string().min(1).max(255),
  byteSize: z.number().int().nonnegative(),
  storagePath: z.string().min(1),
  status: attachmentStatusSchema,
  contentSha256: z.string().regex(/^[0-9a-f]{64}$/u).nullable(),
  failureCode: z.string().min(1).max(80).nullable(),
  failureReason: z.string().nullable(),
  processorVersion: z.string().min(1).max(120).nullable(),
  sourceCount: z.number().int().nonnegative(),
  processedAt: isoTimestampSchema.nullable(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
  deletedAt: isoTimestampSchema.nullable(),
});

export type Attachment = z.infer<typeof attachmentSchema>;

export const sourceSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  attachmentId: entityIdSchema,
  ordinal: z.number().int().nonnegative(),
  content: z.string().min(1).max(4000),
  pageNumber: z.number().int().positive().nullable(),
  startOffset: z.number().int().nonnegative().nullable(),
  endOffset: z.number().int().nonnegative().nullable(),
  startLine: z.number().int().positive().nullable(),
  endLine: z.number().int().positive().nullable(),
  createdAt: isoTimestampSchema,
});

export type Source = z.infer<typeof sourceSchema>;

export const draftStatusSchema = z.enum(["active", "archived"]);

export const draftSchema = z.object({
  id: entityIdSchema,
  workspaceId: entityIdSchema,
  conversationId: entityIdSchema.nullable(),
  createdBy: entityIdSchema,
  title: z.string().min(1).max(200),
  content: z.string(),
  direction: contentDirectionSchema,
  status: draftStatusSchema,
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type Draft = z.infer<typeof draftSchema>;
