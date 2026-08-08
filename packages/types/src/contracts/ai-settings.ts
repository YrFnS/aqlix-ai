import { z } from "zod";
import { isoTimestampSchema } from "./workspace";

export const userAiProviderSchema = z.literal("openrouter");
export type UserAiProvider = z.infer<typeof userAiProviderSchema>;

export const openRouterApiKeySchema = z
  .string()
  .trim()
  .min(16, "OpenRouter API key is too short")
  .max(512, "OpenRouter API key is too long")
  .refine((value) => !/\s/u.test(value), "API key must not contain whitespace");

export const openRouterModelIdSchema = z
  .string()
  .trim()
  .min(1, "Model ID is required")
  .max(255, "Model ID must be 255 characters or fewer")
  .regex(
    /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u,
    "Model ID contains unsupported characters",
  );

export const openRouterKeyMetadataSchema = z.object({
  label: z.string().max(120).nullable(),
  usage: z.number().nonnegative().nullable(),
  limit: z.number().nonnegative().nullable(),
  limitRemaining: z.number().nullable(),
  isFreeTier: z.boolean(),
  expiresAt: isoTimestampSchema.nullable(),
});
export type OpenRouterKeyMetadata = z.infer<
  typeof openRouterKeyMetadataSchema
>;

export const userAiSettingsSchema = z.object({
  provider: userAiProviderSchema,
  connected: z.boolean(),
  modelId: openRouterModelIdSchema.nullable(),
  keyLastFour: z.string().regex(/^[A-Za-z0-9_-]{4}$/u).nullable(),
  keyLabel: z.string().max(120).nullable(),
  isFreeTier: z.boolean().nullable(),
  connectedAt: isoTimestampSchema.nullable(),
  updatedAt: isoTimestampSchema.nullable(),
});
export type UserAiSettings = z.infer<typeof userAiSettingsSchema>;

export const saveOpenRouterCredentialInputSchema = z.object({
  apiKey: openRouterApiKeySchema,
});
export type SaveOpenRouterCredentialInput = z.infer<
  typeof saveOpenRouterCredentialInputSchema
>;

export const selectOpenRouterModelInputSchema = z.object({
  modelId: openRouterModelIdSchema,
});
export type SelectOpenRouterModelInput = z.infer<
  typeof selectOpenRouterModelInputSchema
>;

export const openRouterModelSortSchema = z.enum([
  "name",
  "context",
  "prompt_price",
  "completion_price",
  "newest",
]);
export type OpenRouterModelSort = z.infer<typeof openRouterModelSortSchema>;

export const openRouterModelCatalogQuerySchema = z.object({
  query: z.string().trim().max(200).optional().default(""),
  sort: openRouterModelSortSchema.optional().default("name"),
  freeOnly: z.boolean().optional().default(false),
  limit: z.number().int().min(1).max(200).optional().default(100),
});
export type OpenRouterModelCatalogQuery = z.infer<
  typeof openRouterModelCatalogQuerySchema
>;

export const openRouterModelPricingSchema = z.object({
  prompt: z.string().nullable(),
  completion: z.string().nullable(),
  request: z.string().nullable(),
  image: z.string().nullable(),
});
export type OpenRouterModelPricing = z.infer<
  typeof openRouterModelPricingSchema
>;

export const openRouterModelSchema = z.object({
  id: openRouterModelIdSchema,
  canonicalSlug: z.string().max(255).nullable(),
  name: z.string().min(1).max(255),
  description: z.string().max(4000).nullable(),
  createdAt: isoTimestampSchema.nullable(),
  contextLength: z.number().int().positive().nullable(),
  maxCompletionTokens: z.number().int().positive().nullable(),
  inputModalities: z.string().max(32).array(),
  outputModalities: z.string().max(32).array(),
  supportedParameters: z.string().max(80).array(),
  pricing: openRouterModelPricingSchema,
  isFree: z.boolean(),
  expiresAt: isoTimestampSchema.nullable(),
});
export type OpenRouterModel = z.infer<typeof openRouterModelSchema>;

export const openRouterModelCatalogSchema = z.object({
  models: openRouterModelSchema.array(),
  total: z.number().int().nonnegative(),
  filteredForConnectedUser: z.boolean(),
  fetchedAt: isoTimestampSchema,
});
export type OpenRouterModelCatalog = z.infer<
  typeof openRouterModelCatalogSchema
>;
