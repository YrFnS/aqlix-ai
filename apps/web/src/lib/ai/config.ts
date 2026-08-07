import "server-only";

import { z } from "zod";
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
  AI_PROVIDER: z.enum(["openai", "fixture"]).default("openai"),
  OPENAI_API_KEY: z.string().trim().min(1).optional(),
  OPENAI_MODEL: z.string().trim().min(1).max(160).default("gpt-5-mini"),
  OPENAI_BASE_URL: z
    .string()
    .url()
    .default("https://api.openai.com/v1"),
  AI_REQUEST_TIMEOUT_MS: integerFromEnvironment(60000, 5000, 180000),
  AI_MAX_OUTPUT_TOKENS: integerFromEnvironment(2048, 64, 8192),
  P2_ALLOW_FIXTURE_PROVIDER: z.boolean().default(false),
});

export type AiProviderName = z.infer<
  typeof aiEnvironmentSchema
>["AI_PROVIDER"];

export interface AiRuntimeConfig {
  provider: AiProviderName;
  requestedModel: string;
  requestTimeoutMs: number;
  maxOutputTokens: number;
  openai?: {
    apiKey: string;
    baseUrl: string;
  };
}

function environmentBoolean(value: string | undefined): boolean {
  return value === "true";
}

export function getAiRuntimeConfig(): AiRuntimeConfig {
  const parsed = aiEnvironmentSchema.safeParse({
    AI_PROVIDER: process.env.AI_PROVIDER?.trim() || "openai",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY?.trim() || undefined,
    OPENAI_MODEL: process.env.OPENAI_MODEL?.trim() || "gpt-5-mini",
    OPENAI_BASE_URL:
      process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
    AI_REQUEST_TIMEOUT_MS: process.env.AI_REQUEST_TIMEOUT_MS,
    AI_MAX_OUTPUT_TOKENS: process.env.AI_MAX_OUTPUT_TOKENS,
    P2_ALLOW_FIXTURE_PROVIDER: environmentBoolean(
      process.env.P2_ALLOW_FIXTURE_PROVIDER,
    ),
  });

  if (!parsed.success) {
    throw new AiProviderError(
      "PROVIDER_UNCONFIGURED",
      "The AI provider configuration is invalid.",
      false,
    );
  }

  const config = parsed.data;

  if (config.AI_PROVIDER === "fixture") {
    if (
      !config.P2_ALLOW_FIXTURE_PROVIDER ||
      process.env.NODE_ENV === "production"
    ) {
      throw new AiProviderError(
        "PROVIDER_UNCONFIGURED",
        "The deterministic fixture provider is disabled outside approved tests.",
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

  if (!config.OPENAI_API_KEY) {
    throw new AiProviderError(
      "PROVIDER_UNCONFIGURED",
      "OpenAI generation is not configured in this environment.",
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

export function getRequestedProviderIdentity(): {
  provider: AiProviderName;
  requestedModel: string;
} {
  const provider =
    process.env.AI_PROVIDER?.trim() === "fixture" ? "fixture" : "openai";

  return {
    provider,
    requestedModel:
      provider === "fixture"
        ? "fixture-bilingual-v1"
        : process.env.OPENAI_MODEL?.trim() || "gpt-5-mini",
  };
}
