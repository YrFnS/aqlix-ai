import "server-only";

import { z } from "zod";
import type { SupabaseServerClient } from "@iraqi-ai/supabase-client/server";
import {
  resolveUserOpenRouterRuntime,
  UserAiSettingsRepositoryError,
} from "./user-settings";
import { AiProviderError } from "./provider";

const integerFromEnvironment = (
  fallback: number,
  minimum: number,
  maximum: number,
) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null || value === "") return fallback;
      if (typeof value === "number") return value;
      if (typeof value === "string") return Number.parseInt(value, 10);
      return value;
    },
    z.number().int().min(minimum).max(maximum),
  );

const aiEnvironmentSchema = z.object({
  AI_PROVIDER: z
    .enum(["openrouter", "openai", "fixture"])
    .default("openrouter"),
  OPENAI_API_KEY: z.string().trim().min(1).optional(),
  OPENAI_MODEL: z.string().trim().min(1).max(255).optional(),
  OPENAI_BASE_URL: z
    .string()
    .url()
    .default("https://api.openai.com/v1"),
  OPENROUTER_BASE_URL: z
    .string()
    .url()
    .default("https://openrouter.ai/api/v1"),
  AI_REQUEST_TIMEOUT_MS: integerFromEnvironment(60000, 5000, 180000),
  AI_MAX_OUTPUT_TOKENS: integerFromEnvironment(2048, 64, 8192),
  P2_ALLOW_FIXTURE_PROVIDER: z.boolean().default(false),
  APP_ENV: z.enum(["development", "staging", "production", "test"]),
});

export type AiProviderName = z.infer<
  typeof aiEnvironmentSchema
>["AI_PROVIDER"];

export interface AiRuntimeConfig {
  provider: AiProviderName;
  requestedModel: string;
  requestTimeoutMs: number;
  maxOutputTokens: number;
  openrouter?: {
    apiKey: string;
    baseUrl: string;
    appUrl: string | null;
    appTitle: string;
  };
  openai?: {
    apiKey: string;
    baseUrl: string;
  };
}

interface ResolveAiRuntimeOptions {
  requestOrigin?: string;
}

function environmentBoolean(value: string | undefined): boolean {
  return value === "true";
}

function deploymentEnvironment():
  | "development"
  | "staging"
  | "production"
  | "test" {
  const value =
    process.env.APP_ENV?.trim() ||
    process.env.NEXT_PUBLIC_APP_ENV?.trim() ||
    "development";

  if (
    value === "staging" ||
    value === "production" ||
    value === "test"
  ) {
    return value;
  }

  return "development";
}

function parseAiEnvironment() {
  const parsed = aiEnvironmentSchema.safeParse({
    AI_PROVIDER: process.env.AI_PROVIDER?.trim() || "openrouter",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY?.trim() || undefined,
    OPENAI_MODEL: process.env.OPENAI_MODEL?.trim() || undefined,
    OPENAI_BASE_URL:
      process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
    OPENROUTER_BASE_URL:
      process.env.OPENROUTER_BASE_URL?.trim() ||
      "https://openrouter.ai/api/v1",
    AI_REQUEST_TIMEOUT_MS: process.env.AI_REQUEST_TIMEOUT_MS,
    AI_MAX_OUTPUT_TOKENS: process.env.AI_MAX_OUTPUT_TOKENS,
    P2_ALLOW_FIXTURE_PROVIDER: environmentBoolean(
      process.env.P2_ALLOW_FIXTURE_PROVIDER,
    ),
    APP_ENV: deploymentEnvironment(),
  });

  if (!parsed.success) {
    throw new AiProviderError(
      "PROVIDER_UNCONFIGURED",
      "The AI provider configuration is invalid.",
      false,
    );
  }

  return parsed.data;
}

export async function resolveAiRuntimeConfig(
  supabase: SupabaseServerClient,
  options: ResolveAiRuntimeOptions = {},
): Promise<AiRuntimeConfig> {
  const config = parseAiEnvironment();

  if (config.AI_PROVIDER === "fixture") {
    if (
      !config.P2_ALLOW_FIXTURE_PROVIDER ||
      config.APP_ENV === "production" ||
      config.APP_ENV === "staging"
    ) {
      throw new AiProviderError(
        "PROVIDER_UNCONFIGURED",
        "The deterministic fixture provider is disabled outside approved local and test environments.",
        false,
      );
    }

    return {
      provider: "fixture",
      requestedModel: "fixture-bilingual-v1",
      requestTimeoutMs: config.AI_REQUEST_TIMEOUT_MS,
      maxOutputTokens: config.AI_MAX_OUTPUT_TOKENS,
    };
  }

  if (config.AI_PROVIDER === "openai") {
    if (!config.OPENAI_API_KEY || !config.OPENAI_MODEL) {
      throw new AiProviderError(
        "PROVIDER_UNCONFIGURED",
        "Managed OpenAI generation requires both a server key and an explicit model ID.",
        false,
      );
    }

    return {
      provider: "openai",
      requestedModel: config.OPENAI_MODEL,
      requestTimeoutMs: config.AI_REQUEST_TIMEOUT_MS,
      maxOutputTokens: config.AI_MAX_OUTPUT_TOKENS,
      openai: {
        apiKey: config.OPENAI_API_KEY,
        baseUrl: config.OPENAI_BASE_URL.replace(/\/$/u, ""),
      },
    };
  }

  let runtime;
  try {
    runtime = await resolveUserOpenRouterRuntime(supabase);
  } catch (error) {
    if (error instanceof UserAiSettingsRepositoryError) {
      throw new AiProviderError(
        "PERSISTENCE_ERROR",
        "The saved OpenRouter connection could not be resolved.",
        true,
      );
    }
    throw error;
  }

  if (!runtime) {
    throw new AiProviderError(
      "PROVIDER_UNCONFIGURED",
      "Connect an OpenRouter key and select a live model in AI settings before generating.",
      false,
    );
  }

  return {
    provider: "openrouter",
    requestedModel: runtime.modelId,
    requestTimeoutMs: config.AI_REQUEST_TIMEOUT_MS,
    maxOutputTokens: config.AI_MAX_OUTPUT_TOKENS,
    openrouter: {
      apiKey: runtime.apiKey,
      baseUrl: config.OPENROUTER_BASE_URL.replace(/\/$/u, ""),
      appUrl: options.requestOrigin?.replace(/\/$/u, "") ?? null,
      appTitle: "Kiteb",
    },
  };
}

export function getFallbackProviderIdentity(): {
  provider: AiProviderName;
  requestedModel: string;
} {
  const config = parseAiEnvironment();

  if (config.AI_PROVIDER === "fixture") {
    return {
      provider: "fixture",
      requestedModel: "fixture-bilingual-v1",
    };
  }

  if (config.AI_PROVIDER === "openai") {
    return {
      provider: "openai",
      requestedModel: config.OPENAI_MODEL || "unconfigured",
    };
  }

  return {
    provider: "openrouter",
    requestedModel: "unconfigured",
  };
}
