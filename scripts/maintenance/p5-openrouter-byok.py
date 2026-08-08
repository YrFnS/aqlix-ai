#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.lstrip("\n"), encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one match, found {count}: {old[:100]!r}")
    target.write_text(text.replace(old, new, 1), encoding="utf-8")


write(
    "packages/types/src/contracts/ai-client.ts",
    r'''
import { z } from "zod";

const containsNoControlCharacters = (value: string) =>
  !/[\u0000-\u001f\u007f]/u.test(value);

export const userAiProviderSchema = z.enum(["openrouter", "openai"]);
export type UserAiProvider = z.infer<typeof userAiProviderSchema>;

export const userAiModelSchema = z
  .string()
  .trim()
  .min(1, "A model identifier is required")
  .max(160, "Model identifiers must be 160 characters or fewer")
  .refine(containsNoControlCharacters, "Model identifiers cannot contain control characters");

export const userAiRequestConfigSchema = z.object({
  provider: userAiProviderSchema,
  model: userAiModelSchema,
});
export type UserAiRequestConfig = z.infer<typeof userAiRequestConfigSchema>;

const nullablePriceSchema = z.string().nullable();

export const openRouterModelPricingSchema = z.object({
  prompt: nullablePriceSchema,
  completion: nullablePriceSchema,
  request: nullablePriceSchema,
  image: nullablePriceSchema,
  webSearch: nullablePriceSchema,
  internalReasoning: nullablePriceSchema,
});
export type OpenRouterModelPricing = z.infer<
  typeof openRouterModelPricingSchema
>;

export const openRouterModelSchema = z.object({
  id: userAiModelSchema,
  name: z.string().trim().min(1).max(300),
  description: z.string().max(4000),
  contextLength: z.number().int().positive().nullable(),
  createdAt: z.string().datetime().nullable(),
  inputModalities: z.array(z.string().max(64)).max(32),
  outputModalities: z.array(z.string().max(64)).max(32),
  supportedParameters: z.array(z.string().max(100)).max(100),
  pricing: openRouterModelPricingSchema,
  isFree: z.boolean(),
});
export type OpenRouterModel = z.infer<typeof openRouterModelSchema>;

export const openRouterModelCatalogSchema = z.object({
  models: z.array(openRouterModelSchema),
  source: z.enum(["public", "user"]),
  fetchedAt: z.string().datetime(),
});
export type OpenRouterModelCatalog = z.infer<
  typeof openRouterModelCatalogSchema
>;

export const openRouterOauthExchangeInputSchema = z.object({
  code: z.string().trim().min(8).max(4096),
  codeVerifier: z
    .string()
    .trim()
    .min(43)
    .max(128)
    .regex(/^[A-Za-z0-9._~-]+$/u),
});

export const openRouterOauthExchangeResultSchema = z.object({
  key: z.string().trim().min(16).max(2048),
});
''',
)

write(
    "packages/types/src/contracts/ai-client.test.ts",
    r'''
import { describe, expect, test } from "bun:test";
import {
  openRouterModelCatalogSchema,
  openRouterOauthExchangeInputSchema,
  userAiRequestConfigSchema,
} from "./ai-client";

describe("user-owned AI configuration contracts", () => {
  test("accepts provider model identifiers without a hard-coded catalog", () => {
    expect(
      userAiRequestConfigSchema.parse({
        provider: "openrouter",
        model: "future-provider/new-model:free",
      }),
    ).toEqual({
      provider: "openrouter",
      model: "future-provider/new-model:free",
    });
  });

  test("rejects missing models and control characters", () => {
    expect(
      userAiRequestConfigSchema.safeParse({
        provider: "openrouter",
        model: "",
      }).success,
    ).toBe(false);
    expect(
      userAiRequestConfigSchema.safeParse({
        provider: "openai",
        model: "model\nheader",
      }).success,
    ).toBe(false);
  });

  test("validates a normalized live OpenRouter catalog", () => {
    const catalog = openRouterModelCatalogSchema.parse({
      source: "user",
      fetchedAt: "2026-08-08T00:00:00.000Z",
      models: [
        {
          id: "provider/current-model:free",
          name: "Current Model (free)",
          description: "Live model metadata.",
          contextLength: 131072,
          createdAt: "2026-08-01T00:00:00.000Z",
          inputModalities: ["text"],
          outputModalities: ["text"],
          supportedParameters: ["temperature"],
          pricing: {
            prompt: "0",
            completion: "0",
            request: "0",
            image: null,
            webSearch: null,
            internalReasoning: null,
          },
          isFree: true,
        },
      ],
    });

    expect(catalog.models[0]?.isFree).toBe(true);
  });

  test("requires an S256-compatible PKCE verifier", () => {
    expect(
      openRouterOauthExchangeInputSchema.safeParse({
        code: "authorization-code",
        codeVerifier: "short",
      }).success,
    ).toBe(false);
    expect(
      openRouterOauthExchangeInputSchema.safeParse({
        code: "authorization-code",
        codeVerifier: "a".repeat(64),
      }).success,
    ).toBe(true);
  });
});
''',
)

replace_once(
    "packages/types/src/contracts/index.ts",
    'export * from "./api";\n',
    'export * from "./api";\nexport * from "./ai-client";\n',
)

replace_once(
    "packages/types/src/contracts/conversation.ts",
    '  "PROVIDER_AUTHENTICATION",\n',
    '  "PROVIDER_AUTHENTICATION",\n  "PROVIDER_CREDITS_REQUIRED",\n',
)

write(
    "apps/web/src/lib/ai/config.ts",
    r'''
import "server-only";

import {
  userAiRequestConfigSchema,
  type UserAiProvider,
} from "@iraqi-ai/types";
import { z } from "zod";
import { AiProviderError } from "./provider";

const USER_PROVIDER_HEADER = "x-kiteb-ai-provider";
const USER_MODEL_HEADER = "x-kiteb-ai-model";

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
  AI_PROVIDER: z.enum(["byok", "fixture"]).default("byok"),
  AI_REQUEST_TIMEOUT_MS: integerFromEnvironment(60000, 5000, 180000),
  AI_MAX_OUTPUT_TOKENS: integerFromEnvironment(2048, 64, 8192),
  P2_ALLOW_FIXTURE_PROVIDER: z.boolean().default(false),
  APP_ENV: z.enum(["development", "staging", "production", "test"]),
});

export type AiProviderName = UserAiProvider | "fixture";

export interface AiRuntimeConfig {
  provider: AiProviderName;
  requestedModel: string;
  requestTimeoutMs: number;
  maxOutputTokens: number;
  openai?: {
    apiKey: string;
    baseUrl: string;
  };
  openrouter?: {
    apiKey: string;
    baseUrl: string;
    appUrl: string;
    appTitle: string;
  };
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

function runtimeLimits() {
  const parsed = aiEnvironmentSchema.safeParse({
    AI_PROVIDER: process.env.AI_PROVIDER?.trim() || "byok",
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
      "The AI runtime limits are invalid.",
      false,
    );
  }

  return parsed.data;
}

export function readBearerCredential(request: Request): string | null {
  const authorization = request.headers.get("authorization")?.trim();
  if (!authorization) return null;

  const match = /^Bearer\s+(.+)$/iu.exec(authorization);
  const credential = match?.[1]?.trim() ?? "";
  if (
    credential.length < 8 ||
    credential.length > 2048 ||
    /[\u0000-\u001f\u007f]/u.test(credential)
  ) {
    return null;
  }

  return credential;
}

function fixtureConfig(
  limits: ReturnType<typeof runtimeLimits>,
): AiRuntimeConfig {
  if (
    limits.AI_PROVIDER !== "fixture" ||
    !limits.P2_ALLOW_FIXTURE_PROVIDER ||
    (limits.APP_ENV !== "development" && limits.APP_ENV !== "test")
  ) {
    throw new AiProviderError(
      "PROVIDER_UNCONFIGURED",
      "Add your provider key and choose a model in AI settings.",
      false,
    );
  }

  return {
    provider: "fixture",
    requestedModel: "fixture-bilingual-v1",
    requestTimeoutMs: limits.AI_REQUEST_TIMEOUT_MS,
    maxOutputTokens: limits.AI_MAX_OUTPUT_TOKENS,
  };
}

export function resolveAiRequestConfig(request: Request): AiRuntimeConfig {
  const limits = runtimeLimits();
  const providerHeader = request.headers.get(USER_PROVIDER_HEADER)?.trim();
  const modelHeader = request.headers.get(USER_MODEL_HEADER)?.trim();

  if (!providerHeader && !modelHeader) {
    return fixtureConfig(limits);
  }

  const selection = userAiRequestConfigSchema.safeParse({
    provider: providerHeader,
    model: modelHeader,
  });
  if (!selection.success) {
    throw new AiProviderError(
      "PROVIDER_UNCONFIGURED",
      "Choose a valid provider and model in AI settings.",
      false,
    );
  }

  const apiKey = readBearerCredential(request);
  if (!apiKey) {
    throw new AiProviderError(
      "PROVIDER_UNCONFIGURED",
      "Add your own provider API key in AI settings before generating.",
      false,
    );
  }

  const shared = {
    requestedModel: selection.data.model,
    requestTimeoutMs: limits.AI_REQUEST_TIMEOUT_MS,
    maxOutputTokens: limits.AI_MAX_OUTPUT_TOKENS,
  } as const;

  if (selection.data.provider === "openrouter") {
    return {
      provider: "openrouter",
      ...shared,
      openrouter: {
        apiKey,
        baseUrl: "https://openrouter.ai/api/v1",
        appUrl: new URL(request.url).origin,
        appTitle: "Kiteb",
      },
    };
  }

  return {
    provider: "openai",
    ...shared,
    openai: {
      apiKey,
      baseUrl: "https://api.openai.com/v1",
    },
  };
}

export function getRequestedProviderIdentity(
  config: AiRuntimeConfig,
): {
  provider: AiProviderName;
  requestedModel: string;
} {
  return {
    provider: config.provider,
    requestedModel: config.requestedModel,
  };
}
''',
)

write(
    "apps/web/src/lib/ai/openrouter-provider.ts",
    r'''
import "server-only";

import type { AiRuntimeConfig } from "./config";
import {
  AiProviderError,
  emptyProviderUsage,
  type AiProvider,
  type AiProviderStreamEvent,
  type AiProviderStreamInput,
  type AiProviderUsage,
} from "./provider";

interface OpenRouterError {
  code?: string | number;
  message?: string;
  metadata?: {
    error_type?: string;
  };
}

interface OpenRouterChunk {
  id?: string;
  model?: string;
  provider?: string;
  error?: OpenRouterError;
  choices?: Array<{
    delta?: {
      content?: unknown;
    };
    finish_reason?: string | null;
    error?: OpenRouterError;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    completion_tokens_details?: {
      reasoning_tokens?: number;
    };
  };
}

type OpenRouterFrame =
  | { kind: "chunk"; chunk: OpenRouterChunk }
  | { kind: "done" };

const baseInstructions =
  "You are Kiteb, a clear bilingual work assistant. Reply in the language used by the user unless they ask for another language. Preserve code, numbers, URLs, and mixed Arabic-English text accurately. Do not claim access to documents or sources unless explicit source passages are supplied in these instructions.";

function safeProviderMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.slice(0, 500);
}

function errorForStatus(status: number, message: string): AiProviderError {
  if (status === 401 || status === 403) {
    return new AiProviderError(
      "PROVIDER_AUTHENTICATION",
      "OpenRouter rejected this API key.",
      false,
      status,
    );
  }

  if (status === 402) {
    return new AiProviderError(
      "PROVIDER_CREDITS_REQUIRED",
      "This OpenRouter key has insufficient credits for the selected model.",
      false,
      status,
    );
  }

  if (status === 429) {
    return new AiProviderError(
      "PROVIDER_RATE_LIMITED",
      "OpenRouter or the selected model is currently rate limited.",
      true,
      status,
    );
  }

  if (status >= 500) {
    return new AiProviderError(
      "PROVIDER_UNAVAILABLE",
      "OpenRouter or the selected upstream provider is unavailable.",
      true,
      status,
    );
  }

  return new AiProviderError(
    "PROVIDER_RESPONSE_INVALID",
    message || "OpenRouter rejected the selected model request.",
    status === 408 || status === 409,
    status,
  );
}

function errorFromPayload(error: OpenRouterError): AiProviderError {
  const numericCode =
    typeof error.code === "number"
      ? error.code
      : Number.parseInt(String(error.code ?? ""), 10);
  const errorType = error.metadata?.error_type?.toLowerCase() ?? "";
  const message = safeProviderMessage(error.message);

  if (Number.isFinite(numericCode)) {
    return errorForStatus(numericCode, message);
  }
  if (errorType.includes("auth")) {
    return errorForStatus(401, message);
  }
  if (errorType.includes("rate")) {
    return errorForStatus(429, message);
  }
  if (
    errorType.includes("provider") ||
    errorType.includes("unavailable") ||
    errorType.includes("timeout")
  ) {
    return errorForStatus(503, message);
  }

  return new AiProviderError(
    "PROVIDER_RESPONSE_INVALID",
    message || "OpenRouter returned a stream error.",
    true,
  );
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: unknown };
    };
    return safeProviderMessage(body.error?.message);
  } catch {
    return "";
  }
}

async function* parseServerSentEvents(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<OpenRouterFrame, void, undefined> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parseFrame = (frame: string): OpenRouterFrame | null => {
    const data = frame
      .split(/\r?\n/u)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    if (!data) return null;
    if (data === "[DONE]") return { kind: "done" };

    try {
      return {
        kind: "chunk",
        chunk: JSON.parse(data) as OpenRouterChunk,
      };
    } catch {
      throw new AiProviderError(
        "PROVIDER_RESPONSE_INVALID",
        "OpenRouter returned an invalid stream event.",
        true,
      );
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      while (true) {
        const boundary = buffer.match(/\r?\n\r?\n/u);
        if (!boundary || boundary.index === undefined) break;

        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const parsed = parseFrame(frame);
        if (parsed) yield parsed;
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      const parsed = parseFrame(buffer);
      if (parsed) yield parsed;
    }
  } finally {
    reader.releaseLock();
  }
}

function createRequestController(
  sourceSignal: AbortSignal,
  timeoutMs: number,
): {
  controller: AbortController;
  timedOut: () => boolean;
  cleanup: () => void;
} {
  const controller = new AbortController();
  let timeoutTriggered = false;

  const abortFromSource = () => controller.abort(sourceSignal.reason);
  if (sourceSignal.aborted) {
    abortFromSource();
  } else {
    sourceSignal.addEventListener("abort", abortFromSource, { once: true });
  }

  const timeout = setTimeout(() => {
    timeoutTriggered = true;
    controller.abort(new Error("Provider request timeout"));
  }, timeoutMs);

  return {
    controller,
    timedOut: () => timeoutTriggered,
    cleanup: () => {
      clearTimeout(timeout);
      sourceSignal.removeEventListener("abort", abortFromSource);
    },
  };
}

function mapUsage(chunk: OpenRouterChunk): AiProviderUsage | null {
  if (!chunk.usage) return null;
  return {
    inputTokens: chunk.usage.prompt_tokens ?? null,
    outputTokens: chunk.usage.completion_tokens ?? null,
    reasoningTokens:
      chunk.usage.completion_tokens_details?.reasoning_tokens ?? null,
    totalTokens: chunk.usage.total_tokens ?? null,
  };
}

export class OpenRouterChatProvider implements AiProvider {
  readonly name = "openrouter";
  readonly requestedModel: string;

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxOutputTokens: number;
  private readonly appUrl: string;
  private readonly appTitle: string;

  constructor(config: AiRuntimeConfig) {
    if (!config.openrouter) {
      throw new AiProviderError(
        "PROVIDER_UNCONFIGURED",
        "OpenRouter is not configured for this request.",
        false,
      );
    }

    this.apiKey = config.openrouter.apiKey;
    this.baseUrl = config.openrouter.baseUrl;
    this.appUrl = config.openrouter.appUrl;
    this.appTitle = config.openrouter.appTitle;
    this.requestedModel = config.requestedModel;
    this.timeoutMs = config.requestTimeoutMs;
    this.maxOutputTokens = config.maxOutputTokens;
  }

  async *stream(
    input: AiProviderStreamInput,
  ): AsyncGenerator<AiProviderStreamEvent, void, undefined> {
    const request = createRequestController(input.signal, this.timeoutMs);
    let providerResponseId: string | null = null;
    let returnedModel: string | null = null;
    let usage: AiProviderUsage = emptyProviderUsage;
    let finished = false;
    let doneReceived = false;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          "HTTP-Referer": this.appUrl,
          "X-OpenRouter-Title": this.appTitle,
        },
        body: JSON.stringify({
          model: this.requestedModel,
          messages: [
            {
              role: "system",
              content: input.instructions
                ? `${baseInstructions}\n\n${input.instructions}`
                : baseInstructions,
            },
            ...input.messages,
          ],
          max_tokens: this.maxOutputTokens,
          stream: true,
        }),
        signal: request.controller.signal,
      });

      if (!response.ok) {
        throw errorForStatus(
          response.status,
          await readErrorMessage(response),
        );
      }

      if (!response.body) {
        throw new AiProviderError(
          "PROVIDER_RESPONSE_INVALID",
          "OpenRouter returned no response stream.",
          true,
        );
      }

      for await (const frame of parseServerSentEvents(response.body)) {
        if (frame.kind === "done") {
          doneReceived = true;
          break;
        }

        const chunk = frame.chunk;
        if (chunk.error) throw errorFromPayload(chunk.error);

        providerResponseId = chunk.id ?? providerResponseId;
        returnedModel = chunk.model ?? returnedModel;
        const currentUsage = mapUsage(chunk);
        if (currentUsage) usage = currentUsage;

        for (const choice of chunk.choices ?? []) {
          if (choice.error) throw errorFromPayload(choice.error);
          if (choice.finish_reason === "error") {
            throw new AiProviderError(
              "PROVIDER_UNAVAILABLE",
              "The selected OpenRouter provider failed during streaming.",
              true,
            );
          }

          const delta = choice.delta?.content;
          if (typeof delta === "string" && delta.length > 0) {
            yield { type: "delta", delta };
          }

          if (choice.finish_reason) finished = true;
        }
      }

      if (!finished && !doneReceived) {
        throw new AiProviderError(
          "PROVIDER_RESPONSE_INVALID",
          "OpenRouter ended the stream before completion.",
          true,
        );
      }

      yield {
        type: "complete",
        providerResponseId,
        returnedModel,
        usage,
      };
    } catch (error) {
      if (input.signal.aborted) throw error;

      if (request.timedOut()) {
        throw new AiProviderError(
          "PROVIDER_TIMEOUT",
          "OpenRouter did not respond before the timeout.",
          true,
        );
      }

      if (error instanceof AiProviderError) throw error;

      throw new AiProviderError(
        "PROVIDER_UNAVAILABLE",
        "The OpenRouter request failed.",
        true,
      );
    } finally {
      request.cleanup();
    }
  }
}
''',
)

write(
    "apps/web/src/lib/ai/index.ts",
    r'''
import "server-only";

import type { AiRuntimeConfig } from "./config";
import {
  ControlledAiProvider,
  type AiProviderControlContext,
} from "./controlled-provider";
import { FixtureAiProvider } from "./fixture-provider";
import { OpenAiResponsesProvider } from "./openai-provider";
import { OpenRouterChatProvider } from "./openrouter-provider";
import type { AiProvider } from "./provider";

export function createAiProvider(
  config: AiRuntimeConfig,
  controls?: AiProviderControlContext,
): AiProvider {
  const provider =
    config.provider === "fixture"
      ? new FixtureAiProvider()
      : config.provider === "openrouter"
        ? new OpenRouterChatProvider(config)
        : new OpenAiResponsesProvider(config);

  return controls
    ? new ControlledAiProvider(provider, config.maxOutputTokens, controls)
    : provider;
}

export * from "./config";
export * from "./provider";
''',
)

replace_once(
    "apps/web/src/lib/ai/openai-provider.ts",
    '"The model provider rejected the server credentials.",',
    '"OpenAI rejected this API key.",',
)

write(
    "apps/web/src/lib/ai/client-settings.ts",
    r'''
import {
  userAiProviderSchema,
  userAiRequestConfigSchema,
  type UserAiProvider,
} from "@iraqi-ai/types";

export const AI_PROVIDER_HEADER = "x-kiteb-ai-provider";
export const AI_MODEL_HEADER = "x-kiteb-ai-model";
export const AI_SETTINGS_CHANGED_EVENT = "kiteb-ai-settings-change";
export const OPENROUTER_PKCE_VERIFIER_KEY =
  "kiteb.openrouter.pkce-verifier.v1";

const PREFERENCES_KEY = "kiteb.ai.preferences.v1";
const SESSION_KEY = "kiteb.ai.session-key.v1";
const REMEMBERED_KEY = "kiteb.ai.remembered-key.v1";

export interface UserAiSettings {
  provider: UserAiProvider;
  model: string;
  apiKey: string;
  rememberKey: boolean;
}

const defaults: UserAiSettings = {
  provider: "openrouter",
  model: "",
  apiKey: "",
  rememberKey: false,
};

function availableStorage(
  kind: "localStorage" | "sessionStorage",
): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window[kind];
  } catch {
    return null;
  }
}

function parsePreferences(
  value: string | null,
): Pick<UserAiSettings, "provider" | "model" | "rememberKey"> {
  if (!value) return defaults;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const provider = userAiProviderSchema.safeParse(parsed.provider);
    return {
      provider: provider.success ? provider.data : defaults.provider,
      model: typeof parsed.model === "string" ? parsed.model.trim() : "",
      rememberKey: parsed.rememberKey === true,
    };
  } catch {
    return defaults;
  }
}

export function readUserAiSettings(): UserAiSettings {
  const local = availableStorage("localStorage");
  const session = availableStorage("sessionStorage");
  const preferences = parsePreferences(local?.getItem(PREFERENCES_KEY) ?? null);
  const sessionKey = session?.getItem(SESSION_KEY)?.trim() ?? "";
  const rememberedKey = local?.getItem(REMEMBERED_KEY)?.trim() ?? "";

  return {
    ...preferences,
    apiKey: sessionKey || rememberedKey,
  };
}

export function saveUserAiSettings(settings: UserAiSettings): void {
  const local = availableStorage("localStorage");
  const session = availableStorage("sessionStorage");
  const provider = userAiProviderSchema.parse(settings.provider);
  const apiKey = settings.apiKey.trim();

  local?.setItem(
    PREFERENCES_KEY,
    JSON.stringify({
      provider,
      model: settings.model.trim(),
      rememberKey: settings.rememberKey,
    }),
  );

  if (apiKey) {
    session?.setItem(SESSION_KEY, apiKey);
  } else {
    session?.removeItem(SESSION_KEY);
  }

  if (settings.rememberKey && apiKey) {
    local?.setItem(REMEMBERED_KEY, apiKey);
  } else {
    local?.removeItem(REMEMBERED_KEY);
  }

  window.dispatchEvent(new Event(AI_SETTINGS_CHANGED_EVENT));
}

export function clearUserAiKey(): void {
  availableStorage("sessionStorage")?.removeItem(SESSION_KEY);
  availableStorage("localStorage")?.removeItem(REMEMBERED_KEY);
  window.dispatchEvent(new Event(AI_SETTINGS_CHANGED_EVENT));
}

export function hasCompleteUserAiSettings(
  settings = readUserAiSettings(),
): boolean {
  return (
    settings.apiKey.length >= 8 &&
    userAiRequestConfigSchema.safeParse({
      provider: settings.provider,
      model: settings.model,
    }).success
  );
}

export function buildOptionalUserAiRequestHeaders(): Record<string, string> {
  const settings = readUserAiSettings();
  if (!hasCompleteUserAiSettings(settings)) return {};

  return {
    Authorization: `Bearer ${settings.apiKey}`,
    [AI_PROVIDER_HEADER]: settings.provider,
    [AI_MODEL_HEADER]: settings.model,
  };
}

export function maskProviderKey(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length < 10) return "••••••••";
  return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`;
}
''',
)

write(
    "apps/web/src/app/api/v1/ai/openrouter/models/route.ts",
    r'''
import { z } from "zod";
import {
  openRouterModelCatalogSchema,
  type OpenRouterModel,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import { jsonFailure, jsonSuccess } from "@/lib/api/responses";
import { readBearerCredential } from "@/lib/ai/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const rawPriceSchema = z.union([z.string(), z.number(), z.null()]);

const rawModelSchema = z
  .object({
    id: z.string().trim().min(1).max(160),
    name: z.string().trim().min(1).max(300).optional(),
    description: z.string().max(20000).optional(),
    context_length: z.number().int().positive().nullable().optional(),
    created: z.number().int().positive().optional(),
    architecture: z
      .object({
        input_modalities: z.array(z.string()).optional(),
        output_modalities: z.array(z.string()).optional(),
      })
      .passthrough()
      .optional(),
    supported_parameters: z.array(z.string()).optional(),
    pricing: z.record(rawPriceSchema).optional(),
  })
  .passthrough();

const catalogEnvelopeSchema = z.object({
  data: z.array(z.unknown()),
});

function priceValue(
  pricing: Record<string, string | number | null> | undefined,
  key: string,
): string | null {
  const value = pricing?.[key];
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function isZero(value: string | null): boolean {
  if (value === null) return true;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric === 0;
}

function normalizeModel(value: unknown): OpenRouterModel | null {
  const parsed = rawModelSchema.safeParse(value);
  if (!parsed.success) return null;

  const pricing = {
    prompt: priceValue(parsed.data.pricing, "prompt"),
    completion: priceValue(parsed.data.pricing, "completion"),
    request: priceValue(parsed.data.pricing, "request"),
    image: priceValue(parsed.data.pricing, "image"),
    webSearch:
      priceValue(parsed.data.pricing, "web_search") ??
      priceValue(parsed.data.pricing, "web_search_internal"),
    internalReasoning: priceValue(
      parsed.data.pricing,
      "internal_reasoning",
    ),
  };
  const knownPrices = Object.values(pricing).filter(
    (candidate): candidate is string => candidate !== null,
  );

  return {
    id: parsed.data.id,
    name: parsed.data.name || parsed.data.id,
    description: (parsed.data.description ?? "").slice(0, 4000),
    contextLength: parsed.data.context_length ?? null,
    createdAt: parsed.data.created
      ? new Date(parsed.data.created * 1000).toISOString()
      : null,
    inputModalities: (parsed.data.architecture?.input_modalities ?? []).slice(
      0,
      32,
    ),
    outputModalities: (
      parsed.data.architecture?.output_modalities ?? []
    ).slice(0, 32),
    supportedParameters: (parsed.data.supported_parameters ?? []).slice(
      0,
      100,
    ),
    pricing,
    isFree:
      knownPrices.length > 0 &&
      Object.values(pricing).every((candidate) => isZero(candidate)),
  };
}

function providerFailureStatus(status: number): number {
  if (status === 401 || status === 403) return 401;
  if (status === 429) return 429;
  return status >= 500 ? 503 : 502;
}

export async function GET(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const apiKey = readBearerCredential(request);
  const endpoint = apiKey ? "models/user" : "models";
  const url = new URL(`https://openrouter.ai/api/v1/${endpoint}`);
  url.searchParams.set("output_modalities", "text");

  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (query) url.searchParams.set("q", query.slice(0, 120));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return jsonFailure(
        "SERVICE_UNAVAILABLE",
        response.status === 401 || response.status === 403
          ? "OpenRouter rejected this API key."
          : "The current OpenRouter model catalog could not be loaded.",
        {
          status: providerFailureStatus(response.status),
          requestId: auth.context.requestId,
        },
      );
    }

    const envelope = catalogEnvelopeSchema.safeParse(await response.json());
    if (!envelope.success) {
      return jsonFailure(
        "SERVICE_UNAVAILABLE",
        "OpenRouter returned an invalid model catalog.",
        { status: 502, requestId: auth.context.requestId },
      );
    }

    const catalog = openRouterModelCatalogSchema.parse({
      models: envelope.data.data
        .map(normalizeModel)
        .filter((model): model is OpenRouterModel => model !== null)
        .sort(
          (left, right) =>
            Number(right.isFree) - Number(left.isFree) ||
            left.name.localeCompare(right.name),
        ),
      source: apiKey ? "user" : "public",
      fetchedAt: new Date().toISOString(),
    });
    const result = jsonSuccess(
      { catalog },
      { requestId: auth.context.requestId },
    );
    result.headers.set("Cache-Control", "no-store");
    result.headers.set("Pragma", "no-cache");
    return result;
  } catch {
    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "The current OpenRouter model catalog could not be reached.",
      { status: 503, requestId: auth.context.requestId },
    );
  } finally {
    clearTimeout(timeout);
  }
}
''',
)

write(
    "apps/web/src/app/api/v1/ai/openrouter/oauth/exchange/route.ts",
    r'''
import {
  openRouterOauthExchangeInputSchema,
  openRouterOauthExchangeResultSchema,
} from "@iraqi-ai/types";
import { requireApiUser } from "@/lib/api/auth";
import {
  jsonFailure,
  jsonSuccess,
  zodFieldErrors,
} from "@/lib/api/responses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonFailure("VALIDATION_ERROR", "Request body must be valid JSON.", {
      status: 422,
      requestId: auth.context.requestId,
    });
  }

  const parsed = openRouterOauthExchangeInputSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFailure(
      "VALIDATION_ERROR",
      "The OpenRouter authorization response is invalid.",
      {
        status: 422,
        requestId: auth.context.requestId,
        fieldErrors: zodFieldErrors(parsed.error),
      },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/auth/keys",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code: parsed.data.code,
          code_verifier: parsed.data.codeVerifier,
          code_challenge_method: "S256",
        }),
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return jsonFailure(
        "VALIDATION_ERROR",
        "OpenRouter could not authorize this connection. Start the connection again.",
        { status: 422, requestId: auth.context.requestId },
      );
    }

    const result = openRouterOauthExchangeResultSchema.safeParse(
      await response.json(),
    );
    if (!result.success) {
      return jsonFailure(
        "SERVICE_UNAVAILABLE",
        "OpenRouter returned an invalid authorization result.",
        { status: 502, requestId: auth.context.requestId },
      );
    }

    const apiResponse = jsonSuccess(
      { key: result.data.key },
      { requestId: auth.context.requestId },
    );
    apiResponse.headers.set("Cache-Control", "no-store");
    apiResponse.headers.set("Pragma", "no-cache");
    apiResponse.headers.set("Referrer-Policy", "no-referrer");
    return apiResponse;
  } catch {
    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "OpenRouter authorization is temporarily unavailable.",
      { status: 503, requestId: auth.context.requestId },
    );
  } finally {
    clearTimeout(timeout);
  }
}
''',
)

write(
    "apps/web/src/components/ai/openrouter-oauth-callback.tsx",
    r'''
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  OPENROUTER_PKCE_VERIFIER_KEY,
  readUserAiSettings,
  saveUserAiSettings,
} from "@/lib/ai/client-settings";

export function OpenRouterOauthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const exchange = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      const verifier = sessionStorage.getItem(
        OPENROUTER_PKCE_VERIFIER_KEY,
      );

      if (!code || !verifier) {
        if (active) {
          setError(
            "تعذر التحقق من اتصال OpenRouter. ابدأ الاتصال من صفحة إعدادات الذكاء الاصطناعي.",
          );
        }
        return;
      }

      try {
        const response = await fetch(
          "/api/v1/ai/openrouter/oauth/exchange",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, codeVerifier: verifier }),
          },
        );
        const payload = (await response.json()) as {
          ok?: boolean;
          data?: { key?: string };
          error?: { message?: string };
        };

        if (!response.ok || payload.ok !== true || !payload.data?.key) {
          throw new Error(
            payload.error?.message ||
              "OpenRouter authorization could not be completed.",
          );
        }

        const current = readUserAiSettings();
        saveUserAiSettings({
          ...current,
          provider: "openrouter",
          apiKey: payload.data.key,
          rememberKey: false,
        });
        sessionStorage.removeItem(OPENROUTER_PKCE_VERIFIER_KEY);
        router.replace("/settings/ai?connected=openrouter");
        router.refresh();
      } catch (caught) {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : "OpenRouter authorization could not be completed.",
          );
        }
      }
    };

    void exchange();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-border/70 bg-card p-6 text-center shadow-sm sm:p-10">
      {error ? (
        <>
          <AlertTriangle
            className="mx-auto h-10 w-10 text-destructive"
            aria-hidden="true"
          />
          <h1 className="mt-4 font-arabic-heading text-2xl font-semibold">
            تعذر ربط OpenRouter
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {error}
          </p>
          <a
            href="/settings/ai"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold"
          >
            العودة إلى إعدادات AI
          </a>
        </>
      ) : (
        <>
          <Loader2
            className="mx-auto h-10 w-10 animate-spin text-primary"
            aria-hidden="true"
          />
          <h1 className="mt-4 font-arabic-heading text-2xl font-semibold">
            جاري ربط OpenRouter
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            يتم استبدال رمز التفويض بمفتاح يملكه حسابك. المفتاح لن يُحفظ في
            قاعدة بيانات Kiteb.
          </p>
        </>
      )}
    </section>
  );
}
''',
)

write(
    "apps/web/src/components/ai/ai-provider-settings.tsx",
    r'''
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Link2,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import {
  openRouterModelCatalogSchema,
  type OpenRouterModel,
  type OpenRouterModelCatalog,
  type UserAiProvider,
} from "@iraqi-ai/types";
import { Button } from "@/components/ui/button";
import {
  OPENROUTER_PKCE_VERIFIER_KEY,
  clearUserAiKey,
  maskProviderKey,
  readUserAiSettings,
  saveUserAiSettings,
} from "@/lib/ai/client-settings";

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/gu, "-")
    .replace(/\//gu, "_")
    .replace(/=+$/gu, "");
}

async function createPkcePair(): Promise<{
  verifier: string;
  challenge: string;
}> {
  const verifierBytes = new Uint8Array(64);
  crypto.getRandomValues(verifierBytes);
  const verifier = base64Url(verifierBytes);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return {
    verifier,
    challenge: base64Url(new Uint8Array(digest)),
  };
}

function pricePerMillion(value: string | null): string {
  if (value === null) return "—";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  if (numeric === 0) return "$0";
  const perMillion = numeric * 1_000_000;
  if (perMillion >= 1) return `$${perMillion.toFixed(2)}`;
  return `$${perMillion.toPrecision(3)}`;
}

function formatContext(value: number | null): string {
  if (value === null) return "غير معلن";
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function ModelCard({
  model,
  selected,
  onSelect,
}: {
  model: OpenRouterModel;
  selected: boolean;
  onSelect: (modelId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(model.id)}
      className={`w-full rounded-2xl border p-4 text-start transition-colors ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:bg-secondary/50"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold" dir="auto">
            {model.name}
          </p>
          <p
            className="mt-1 break-all text-xs text-muted-foreground"
            dir="ltr"
          >
            {model.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {model.isFree && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[0.68rem] font-semibold text-primary-foreground">
              Free
            </span>
          )}
          {selected && (
            <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          )}
        </div>
      </div>
      {model.description && (
        <p
          className="mt-3 max-h-14 overflow-hidden text-xs leading-6 text-muted-foreground"
          dir="auto"
        >
          {model.description}
        </p>
      )}
      <div
        className="mt-3 flex flex-wrap gap-2 text-[0.68rem] text-muted-foreground"
        dir="ltr"
      >
        <span className="rounded-full bg-secondary px-2.5 py-1">
          context {formatContext(model.contextLength)}
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-1">
          input {pricePerMillion(model.pricing.prompt)} / 1M
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-1">
          output {pricePerMillion(model.pricing.completion)} / 1M
        </span>
      </div>
    </button>
  );
}

export function AiProviderSettings() {
  const [provider, setProvider] =
    useState<UserAiProvider>("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [rememberKey, setRememberKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(true);
  const [catalog, setCatalog] =
    useState<OpenRouterModelCatalog | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadModels = useCallback(async (credential: string) => {
    setIsLoadingModels(true);
    setCatalogError(null);
    try {
      const response = await fetch("/api/v1/ai/openrouter/models", {
        cache: "no-store",
        headers: credential.trim()
          ? { Authorization: `Bearer ${credential.trim()}` }
          : undefined,
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { catalog?: unknown };
        error?: { message?: string };
      };

      if (!response.ok || payload.ok !== true) {
        throw new Error(
          payload.error?.message ||
            "The OpenRouter catalog could not be loaded.",
        );
      }

      const parsed = openRouterModelCatalogSchema.safeParse(
        payload.data?.catalog,
      );
      if (!parsed.success) {
        throw new Error("OpenRouter returned an invalid model catalog.");
      }

      setCatalog(parsed.data);
    } catch (error) {
      setCatalogError(
        error instanceof Error
          ? error.message
          : "The OpenRouter catalog could not be loaded.",
      );
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  useEffect(() => {
    const saved = readUserAiSettings();
    setProvider(saved.provider);
    setApiKey(saved.apiKey);
    setModel(saved.model);
    setRememberKey(saved.rememberKey);
    void loadModels(saved.provider === "openrouter" ? saved.apiKey : "");
  }, [loadModels]);

  const visibleModels = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return (catalog?.models ?? []).filter((candidate) => {
      if (freeOnly && !candidate.isFree) return false;
      if (!needle) return true;
      return `${candidate.name} ${candidate.id} ${candidate.description}`
        .toLocaleLowerCase()
        .includes(needle);
    });
  }, [catalog, freeOnly, query]);

  const save = () => {
    if (!apiKey.trim() || !model.trim()) {
      setNotice("أدخل المفتاح واختر أو اكتب معرّف النموذج أولاً.");
      return;
    }

    saveUserAiSettings({
      provider,
      apiKey,
      model,
      rememberKey,
    });
    setNotice(
      rememberKey
        ? "حُفظ المزود والنموذج والمفتاح على هذا الجهاز."
        : "حُفظ المزود والنموذج، والمفتاح محفوظ لهذه الجلسة فقط.",
    );
  };

  const removeKey = () => {
    clearUserAiKey();
    setApiKey("");
    setRememberKey(false);
    setNotice("تم حذف مفتاح المزود من هذا المتصفح.");
  };

  const connectOpenRouter = async () => {
    const { verifier, challenge } = await createPkcePair();
    sessionStorage.setItem(OPENROUTER_PKCE_VERIFIER_KEY, verifier);

    const callbackUrl = `${window.location.origin}/settings/ai/openrouter/callback`;
    const authorizationUrl = new URL("https://openrouter.ai/auth");
    authorizationUrl.searchParams.set("callback_url", callbackUrl);
    authorizationUrl.searchParams.set("code_challenge", challenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("key_label", "Kiteb");
    window.location.assign(authorizationUrl.toString());
  };

  const providerLabel =
    provider === "openrouter" ? "OpenRouter" : "OpenAI";

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              User-owned AI access
            </p>
            <h1 className="mt-2 font-arabic-heading text-3xl font-semibold sm:text-4xl">
              إعدادات مزود الذكاء الاصطناعي
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-muted-foreground">
              استخدم مفتاحك أنت. لا يُحفظ المفتاح في PostgreSQL أو في إعدادات
              الخادم، ولا يوجد نموذج ثابت داخل التطبيق. يرسل المتصفح المفتاح
              فقط مع طلب التوليد الذي تبدأه.
            </p>
          </div>
        </div>
      </header>

      {notice && (
        <div
          className="rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm leading-7"
          role="status"
        >
          {notice}
        </div>
      )}

      <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold">
            <span>المزود / Provider</span>
            <select
              value={provider}
              onChange={(event) => {
                const next = event.target.value as UserAiProvider;
                setProvider(next);
                setModel("");
                setNotice(null);
                if (next === "openrouter") void loadModels(apiKey);
              }}
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="openrouter">OpenRouter</option>
              <option value="openai">OpenAI — direct BYOK</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold">
            <span>{providerLabel} API key</span>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                autoComplete="new-password"
                spellCheck={false}
                dir="ltr"
                placeholder="Paste your own key"
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 pe-12 font-mono text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowKey((visible) => !visible)}
                aria-label={showKey ? "إخفاء المفتاح" : "إظهار المفتاح"}
                className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {apiKey && (
              <span className="block text-xs font-normal text-muted-foreground">
                Current: {maskProviderKey(apiKey)}
              </span>
            )}
          </label>
        </div>

        {provider === "openrouter" && (
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => void connectOpenRouter()}
              className="rounded-full"
            >
              <Link2 className="h-4 w-4" aria-hidden="true" />
              ربط حساب OpenRouter
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void loadModels(apiKey)}
              disabled={isLoadingModels}
            >
              {isLoadingModels ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              )}
              تحقق من المفتاح وحدّث النماذج
            </Button>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold"
            >
              إدارة المفاتيح في OpenRouter
            </a>
          </div>
        )}

        <label className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-secondary/35 p-4 text-sm">
          <input
            type="checkbox"
            checked={rememberKey}
            onChange={(event) => setRememberKey(event.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span>
            <span className="block font-semibold">
              تذكر المفتاح على هذا الجهاز
            </span>
            <span className="mt-1 block text-xs leading-6 text-muted-foreground">
              غير مفعّل افتراضياً؛ عند إيقافه يبقى المفتاح في sessionStorage
              حتى تغلق جلسة المتصفح. تفعيله ينقله إلى localStorage على مسؤولية
              مستخدم الجهاز.
            </span>
          </span>
        </label>
      </section>

      <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex-1 space-y-2 text-sm font-semibold">
            <span>Model ID</span>
            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              maxLength={160}
              spellCheck={false}
              dir="ltr"
              placeholder={
                provider === "openrouter"
                  ? "Select below or paste any current OpenRouter model ID"
                  : "Paste the OpenAI model ID you want to use"
              }
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 font-mono text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
          {provider === "openrouter" && (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void loadModels(apiKey)}
              disabled={isLoadingModels}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoadingModels ? "animate-spin" : ""
                }`}
                aria-hidden="true"
              />
              تحديث حي
            </Button>
          )}
        </div>

        {provider === "openrouter" ? (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="relative">
                <span className="sr-only">بحث في نماذج OpenRouter</span>
                <Search
                  className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ابحث بالاسم أو Model ID"
                  className="min-h-12 w-full rounded-2xl border border-input bg-background ps-11 pe-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
              <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-background px-4 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(event) => setFreeOnly(event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                النماذج المجانية فقط
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {catalog
                  ? `${visibleModels.length} من ${catalog.models.length} نموذج حي`
                  : "لم يتم تحميل القائمة بعد"}
              </span>
              {catalog && (
                <span>
                  المصدر:{" "}
                  {catalog.source === "user"
                    ? "قائمة حسابك وخصوصيته"
                    : "القائمة العامة"}{" "}
                  · {new Date(catalog.fetchedAt).toLocaleTimeString("ar-IQ")}
                </span>
              )}
            </div>

            {catalogError && (
              <div
                className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {catalogError}
              </div>
            )}

            <div className="mt-4 max-h-[34rem] space-y-3 overflow-y-auto pe-1">
              {isLoadingModels && !catalog ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  تحميل قائمة OpenRouter الحالية…
                </div>
              ) : visibleModels.length > 0 ? (
                visibleModels.map((candidate) => (
                  <ModelCard
                    key={candidate.id}
                    model={candidate}
                    selected={model === candidate.id}
                    onSelect={setModel}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  لا توجد نتائج مطابقة. يمكنك إلغاء فلتر المجاني أو لصق Model
                  ID يدوياً.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-5 rounded-2xl border border-border bg-secondary/35 p-4 text-sm leading-7 text-muted-foreground">
            لا تُثبت Kiteb قائمة نماذج OpenAI. ألصق معرّف النموذج الحالي الذي
            يسمح به مفتاحك، ويمكن تغييره في أي وقت.
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Zap className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
          <p className="text-sm leading-7 text-muted-foreground">
            سيُستخدم <span dir="ltr">{model || "—"}</span> في المحادثات
            ومقترحات المسودات الجديدة. لا تُرسل المفاتيح مع طلبات القراءة
            العادية.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={removeKey}
            disabled={!apiKey}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            حذف المفتاح
          </Button>
          <Button type="button" className="rounded-full" onClick={save}>
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            حفظ الإعدادات
          </Button>
        </div>
      </section>
    </div>
  );
}
''',
)

write(
    "apps/web/src/app/(app)/settings/ai/page.tsx",
    r'''
import type { Metadata } from "next";
import { AiProviderSettings } from "@/components/ai/ai-provider-settings";

export const metadata: Metadata = {
  title: "إعدادات الذكاء الاصطناعي",
  description:
    "User-owned OpenRouter or OpenAI key and live model selection settings.",
};

export default function AiSettingsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <AiProviderSettings />
    </div>
  );
}
''',
)

write(
    "apps/web/src/app/(app)/settings/ai/openrouter/callback/page.tsx",
    r'''
import type { Metadata } from "next";
import { OpenRouterOauthCallback } from "@/components/ai/openrouter-oauth-callback";

export const metadata: Metadata = {
  title: "ربط OpenRouter",
  description: "Complete the user-controlled OpenRouter PKCE connection.",
};

export default function OpenRouterCallbackPage() {
  return (
    <div className="py-10">
      <OpenRouterOauthCallback />
    </div>
  );
}
''',
)

replace_once(
    "apps/web/src/components/navigation/app-nav.tsx",
    "  FileText,\n  LogOut,\n",
    "  FileText,\n  KeyRound,\n  LogOut,\n",
)
replace_once(
    "apps/web/src/components/navigation/app-nav.tsx",
    '''  {
    href: "/docs",
    label: "خطة المنتج",
    icon: FileText,
    exact: true,
  },
''',
    '''  {
    href: "/settings/ai",
    label: "إعدادات AI",
    icon: KeyRound,
    exact: false,
  },
  {
    href: "/docs",
    label: "خطة المنتج",
    icon: FileText,
    exact: true,
  },
''',
)

replace_once(
    "apps/web/src/components/conversations/conversation-shell.tsx",
    'import { Button } from "@/components/ui/button";\n',
    '''import { Button } from "@/components/ui/button";
import {
  AI_SETTINGS_CHANGED_EVENT,
  buildOptionalUserAiRequestHeaders,
  hasCompleteUserAiSettings,
} from "@/lib/ai/client-settings";
''',
)
replace_once(
    "apps/web/src/components/conversations/conversation-shell.tsx",
    '  const [notice, setNotice] = useState<Notice>(null);\n',
    '''  const [notice, setNotice] = useState<Notice>(null);
  const [aiConfigured, setAiConfigured] = useState(false);
''',
)
replace_once(
    "apps/web/src/components/conversations/conversation-shell.tsx",
    '''  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);
''',
    '''  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    const sync = () => setAiConfigured(hasCompleteUserAiSettings());
    sync();
    window.addEventListener(AI_SETTINGS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AI_SETTINGS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
''',
)
replace_once(
    "apps/web/src/components/conversations/conversation-shell.tsx",
    '          headers: { "Content-Type": "application/json" },\n',
    '''          headers: {
            "Content-Type": "application/json",
            ...buildOptionalUserAiRequestHeaders(),
          },
''',
)
replace_once(
    "apps/web/src/components/conversations/conversation-shell.tsx",
    '''          <form onSubmit={submit} className="space-y-3">
            <label
''',
    '''          <form onSubmit={submit} className="space-y-3">
            {!aiConfigured && (
              <div className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="leading-7 text-muted-foreground">
                  أضف مفتاح OpenRouter أو OpenAI واختر النموذج من إعدادات AI.
                  بيئة الاختبار المحلية فقط يمكنها استخدام المزود الحتمي من
                  دون مفتاح.
                </p>
                <a
                  href="/settings/ai"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 font-semibold text-primary-foreground"
                >
                  فتح إعدادات AI
                </a>
              </div>
            )}
            <label
''',
)

replace_once(
    "apps/web/src/components/drafts/draft-editor.tsx",
    'import { Button } from "@/components/ui/button";\n',
    '''import { Button } from "@/components/ui/button";
import { buildOptionalUserAiRequestHeaders } from "@/lib/ai/client-settings";
''',
)
replace_once(
    "apps/web/src/components/drafts/draft-editor.tsx",
    '          headers: { "content-type": "application/json" },\n          body: JSON.stringify({ action, instruction: boundedInstruction }),\n',
    '''          headers: {
            "content-type": "application/json",
            ...buildOptionalUserAiRequestHeaders(),
          },
          body: JSON.stringify({ action, instruction: boundedInstruction }),
''',
)

for route in [
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/stream/route.ts",
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/stream/route.ts",
]:
    replace_once(
        route,
        "  getRequestedProviderIdentity,\n  isAbortError,\n",
        "  getRequestedProviderIdentity,\n  isAbortError,\n  resolveAiRequestConfig,\n",
    )

replace_once(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/stream/route.ts",
    '''  const providerIdentity = getRequestedProviderIdentity();
  let turn: BegunConversationTurn;
''',
    '''  let aiConfig: ReturnType<typeof resolveAiRequestConfig>;
  try {
    aiConfig = resolveAiRequestConfig(request);
  } catch (error) {
    if (error instanceof AiProviderError) {
      return jsonFailure("VALIDATION_ERROR", error.message, {
        status: 422,
        requestId: auth.context.requestId,
      });
    }
    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "AI request configuration could not be resolved.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  const providerIdentity = getRequestedProviderIdentity(aiConfig);
  let turn: BegunConversationTurn;
''',
)
replace_once(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/stream/route.ts",
    '''          const provider = createAiProvider({
            supabase: auth.context.supabase,
''',
    '''          const provider = createAiProvider(aiConfig, {
            supabase: auth.context.supabase,
''',
)

replace_once(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/stream/route.ts",
    '''  const providerIdentity = getRequestedProviderIdentity();
  let begun: BegunDraftGeneration;
''',
    '''  let aiConfig: ReturnType<typeof resolveAiRequestConfig>;
  try {
    aiConfig = resolveAiRequestConfig(request);
  } catch (error) {
    if (error instanceof AiProviderError) {
      return jsonFailure("VALIDATION_ERROR", error.message, {
        status: 422,
        requestId: auth.context.requestId,
      });
    }
    return jsonFailure(
      "SERVICE_UNAVAILABLE",
      "AI request configuration could not be resolved.",
      { status: 503, requestId: auth.context.requestId },
    );
  }

  const providerIdentity = getRequestedProviderIdentity(aiConfig);
  let begun: BegunDraftGeneration;
''',
)
replace_once(
    "apps/web/src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/stream/route.ts",
    '''          const provider = createAiProvider({
            supabase: auth.context.supabase,
''',
    '''          const provider = createAiProvider(aiConfig, {
            supabase: auth.context.supabase,
''',
)

write(
    "apps/web/src/lib/operations/runtime-contract.ts",
    r'''
import { z } from "zod";

export const operationalEnvironmentSchema = z.enum([
  "development",
  "test",
  "staging",
  "production",
]);

export type OperationalEnvironment = z.infer<
  typeof operationalEnvironmentSchema
>;

const publicEnvironmentSchema = z.enum([
  "development",
  "staging",
  "production",
]);

const providerSchema = z.enum(["byok", "fixture"]);

function environmentBoolean(
  value: string | undefined,
  fallback: boolean,
): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  return value.trim().toLowerCase() === "true";
}

function environmentInteger(
  value: string | undefined,
  fallback: number,
): number {
  if (value === undefined || value.trim() === "") return fallback;
  return Number.parseInt(value, 10);
}

export function resolveReleaseSha(
  environment: Readonly<Record<string, string | undefined>>,
): string | null {
  return (
    environment.RELEASE_SHA?.trim() ||
    environment.RENDER_GIT_COMMIT?.trim() ||
    environment.GITHUB_SHA?.trim() ||
    null
  );
}

const runtimeSchema = z
  .object({
    appEnvironment: operationalEnvironmentSchema,
    publicEnvironment: publicEnvironmentSchema,
    releaseSha: z
      .string()
      .trim()
      .regex(/^[0-9a-f]{7,64}$/iu, "Release SHA must be a Git commit SHA")
      .optional(),
    supabaseUrl: z.string().url("Supabase URL must be valid"),
    supabaseAnonKey: z.string().trim().min(1, "Supabase public key is required"),
    provider: providerSchema,
    fixtureProviderAllowed: z.boolean(),
    probeDependencies: z.boolean(),
    readinessTimeoutMs: z.number().int().min(250).max(10000),
  })
  .superRefine((value, context) => {
    if (
      value.appEnvironment === "staging" ||
      value.appEnvironment === "production"
    ) {
      if (value.publicEnvironment !== value.appEnvironment) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["publicEnvironment"],
          message: "Public and server deployment environments must match",
        });
      }

      if (!value.releaseSha) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["releaseSha"],
          message: "A release SHA is required outside local and test environments",
        });
      }

      if (value.provider !== "byok") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["provider"],
          message: "The fixture provider is forbidden in staging and production",
        });
      }
    }

    if (value.provider === "fixture") {
      if (
        !value.fixtureProviderAllowed ||
        (value.appEnvironment !== "development" &&
          value.appEnvironment !== "test")
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["provider"],
          message:
            "The deterministic fixture requires explicit local/test authorization",
        });
      }
    }
  });

export interface OperationalRuntimeContract {
  appEnvironment: OperationalEnvironment;
  publicEnvironment: "development" | "staging" | "production";
  releaseSha: string | null;
  supabaseUrl: string;
  supabaseAnonKey: string;
  provider: "byok" | "fixture";
  probeDependencies: boolean;
  readinessTimeoutMs: number;
}

export class OperationalRuntimeConfigurationError extends Error {
  constructor(public readonly issuePaths: string[]) {
    super("The operational runtime configuration is invalid.");
    this.name = "OperationalRuntimeConfigurationError";
  }
}

export function parseOperationalRuntimeContract(
  environment: Readonly<Record<string, string | undefined>>,
): OperationalRuntimeContract {
  const appEnvironment =
    environment.APP_ENV?.trim() ||
    environment.NEXT_PUBLIC_APP_ENV?.trim() ||
    "development";
  const probeDefault =
    appEnvironment === "staging" || appEnvironment === "production";

  const parsed = runtimeSchema.safeParse({
    appEnvironment,
    publicEnvironment:
      environment.NEXT_PUBLIC_APP_ENV?.trim() || "development",
    releaseSha: resolveReleaseSha(environment) ?? undefined,
    supabaseUrl: environment.NEXT_PUBLIC_SUPABASE_URL?.trim() || "",
    supabaseAnonKey:
      environment.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "",
    provider: environment.AI_PROVIDER?.trim() || "byok",
    fixtureProviderAllowed: environmentBoolean(
      environment.P2_ALLOW_FIXTURE_PROVIDER,
      false,
    ),
    probeDependencies: environmentBoolean(
      environment.READINESS_PROBE_DEPENDENCIES,
      probeDefault,
    ),
    readinessTimeoutMs: environmentInteger(
      environment.READINESS_TIMEOUT_MS,
      2000,
    ),
  });

  if (!parsed.success) {
    const issuePaths = Array.from(
      new Set(
        parsed.error.issues.map((issue) =>
          issue.path.length > 0 ? issue.path.join(".") : "runtime",
        ),
      ),
    ).sort();
    throw new OperationalRuntimeConfigurationError(issuePaths);
  }

  return {
    appEnvironment: parsed.data.appEnvironment,
    publicEnvironment: parsed.data.publicEnvironment,
    releaseSha: parsed.data.releaseSha ?? null,
    supabaseUrl: parsed.data.supabaseUrl.replace(/\/$/u, ""),
    supabaseAnonKey: parsed.data.supabaseAnonKey,
    provider: parsed.data.provider,
    probeDependencies: parsed.data.probeDependencies,
    readinessTimeoutMs: parsed.data.readinessTimeoutMs,
  };
}
''',
)

write(
    "apps/web/.env.release.example",
    r'''
# P5 staging/production runtime contract.
# Copy values into the deployment platform's environment/secret manager.
# Never commit real credentials.

APP_ENV=staging
NEXT_PUBLIC_APP_ENV=staging

# Set RELEASE_SHA on generic platforms. Render supplies RENDER_GIT_COMMIT and
# GitHub Actions supplies GITHUB_SHA, both of which are accepted automatically.
RELEASE_SHA=0123456789abcdef0123456789abcdef01234567

NEXT_PUBLIC_API_URL=https://kiteb-staging.example.test
NEXT_PUBLIC_SUPABASE_URL=https://project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-publishable-key>

# Real generation is BYOK: each signed-in user adds an OpenRouter or OpenAI key
# and live/current model ID in the browser UI. No provider key or model is
# required in the deployment environment.
AI_PROVIDER=byok
AI_REQUEST_TIMEOUT_MS=60000
AI_MAX_OUTPUT_TOKENS=2048
P2_ALLOW_FIXTURE_PROVIDER=false

READINESS_PROBE_DEPENDENCIES=true
READINESS_TIMEOUT_MS=2000

# Pre-deploy migration credentials. Use a dedicated staging project and keep
# these values in the platform secret manager.
SUPABASE_ACCESS_TOKEN=<supabase-personal-access-token>
SUPABASE_DB_PASSWORD=<staging-database-password>
SUPABASE_PROJECT_ID=<staging-project-ref>

# Keep false in staging. A production migration window must explicitly set true
# and receive release/data-owner approval.
ALLOW_PRODUCTION_MIGRATIONS=false

# Optional future observability configuration. Do not enable until the P5
# redaction, retention, ownership, and alerting contract is approved.
NEXT_PUBLIC_SENTRY_DSN=
''',
)

write(
    "render.yaml",
    r'''
services:
  - type: web
    name: kiteb-staging
    runtime: node
    branch: develop
    region: frankfurt
    plan: starter
    autoDeployTrigger: off
    buildCommand: bash scripts/render/build.sh
    preDeployCommand: bash scripts/render/pre-deploy.sh
    startCommand: bun run start:release
    healthCheckPath: /api/health/ready
    maxShutdownDelaySeconds: 60
    envVars:
      - key: NODE_VERSION
        value: 24.14.1
      - key: BUN_VERSION
        value: 1.3.14
      - key: SKIP_INSTALL_DEPS
        value: "true"
      - key: NODE_ENV
        value: production
      - key: APP_ENV
        value: staging
      - key: NEXT_PUBLIC_APP_ENV
        value: staging
      - key: NEXT_TELEMETRY_DISABLED
        value: "1"
      - key: AI_PROVIDER
        value: byok
      - key: P2_ALLOW_FIXTURE_PROVIDER
        value: "false"
      - key: AI_REQUEST_TIMEOUT_MS
        value: "60000"
      - key: AI_MAX_OUTPUT_TOKENS
        value: "2048"
      - key: READINESS_PROBE_DEPENDENCIES
        value: "true"
      - key: READINESS_TIMEOUT_MS
        value: "5000"
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_ACCESS_TOKEN
        sync: false
      - key: SUPABASE_DB_PASSWORD
        sync: false
      - key: SUPABASE_PROJECT_ID
        sync: false
''',
)

replace_once(
    "apps/web/tsconfig.rebuild.json",
    '    "src/app/(app)/dashboard/page.tsx",\n',
    '''    "src/app/(app)/dashboard/page.tsx",
    "src/app/(app)/settings/ai/page.tsx",
    "src/app/(app)/settings/ai/openrouter/callback/page.tsx",
''',
)
replace_once(
    "apps/web/tsconfig.rebuild.json",
    '    "src/app/api/health/ready/route.ts",\n',
    '''    "src/app/api/health/ready/route.ts",
    "src/app/api/v1/ai/openrouter/models/route.ts",
    "src/app/api/v1/ai/openrouter/oauth/exchange/route.ts",
''',
)
replace_once(
    "apps/web/tsconfig.rebuild.json",
    '    "src/components/conversations/conversation-card.tsx",\n',
    '''    "src/components/ai/ai-provider-settings.tsx",
    "src/components/ai/openrouter-oauth-callback.tsx",
    "src/components/conversations/conversation-card.tsx",
''',
)
replace_once(
    "apps/web/tsconfig.rebuild.json",
    '    "src/lib/ai/config.ts",\n',
    '''    "src/lib/ai/client-settings.ts",
    "src/lib/ai/config.ts",
    "src/lib/ai/controlled-provider.ts",
    "src/lib/ai/controls.ts",
''',
)
replace_once(
    "apps/web/tsconfig.rebuild.json",
    '    "src/lib/ai/openai-provider.ts",\n',
    '''    "src/lib/ai/openai-provider.ts",
    "src/lib/ai/openrouter-provider.ts",
''',
)

replace_once(
    "apps/web/tests/rebuild/p5-operational-baseline.test.ts",
    '  test("requires a release identity and provider key in production-like environments", () => {\n',
    '  test("requires release identity but not a server provider key in production", () => {\n',
)
replace_once(
    "apps/web/tests/rebuild/p5-operational-baseline.test.ts",
    '''        AI_PROVIDER: "openai",
      });
      throw new Error("Expected production configuration to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(OperationalRuntimeConfigurationError);
      expect(
        (error as OperationalRuntimeConfigurationError).issuePaths,
      ).toEqual(["openAiApiKey", "releaseSha"]);
''',
    '''        AI_PROVIDER: "byok",
      });
      throw new Error("Expected production configuration to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(OperationalRuntimeConfigurationError);
      expect(
        (error as OperationalRuntimeConfigurationError).issuePaths,
      ).toEqual(["releaseSha"]);
''',
)
replace_once(
    "apps/web/tests/rebuild/p5-operational-baseline.test.ts",
    '''        AI_PROVIDER: "openai",
        OPENAI_API_KEY: "server-only-provider-key",
''',
    '''        AI_PROVIDER: "byok",
''',
)
replace_once(
    "apps/web/tests/rebuild/p5-operational-baseline.test.ts",
    '      provider: "openai",\n',
    '      provider: "byok",\n',
)
replace_once(
    "apps/web/tests/rebuild/p5-operational-baseline.test.ts",
    '''    expect(template).toContain("<server-only-openai-key>");
    expect(template).not.toMatch(/sk-[A-Za-z0-9_-]{20,}/u);
''',
    '''    expect(template).toContain("AI_PROVIDER=byok");
    expect(template).toContain("No provider key or model is");
    expect(template).not.toContain("OPENAI_API_KEY=");
    expect(template).not.toContain("OPENAI_MODEL=");
    expect(template).not.toContain("OPENROUTER_API_KEY=");
    expect(template).not.toMatch(/sk-[A-Za-z0-9_-]{20,}/u);
''',
)
replace_once(
    "apps/web/tests/rebuild/p5-operational-baseline.test.ts",
    '''      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "OPENAI_API_KEY",
      "SUPABASE_ACCESS_TOKEN",
''',
    '''      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_ACCESS_TOKEN",
''',
)
replace_once(
    "apps/web/tests/rebuild/p5-operational-baseline.test.ts",
    '''    expect(blueprint).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(blueprint).not.toContain("ALLOW_PRODUCTION_MIGRATIONS");
''',
    '''    expect(blueprint).toContain("key: AI_PROVIDER\\n        value: byok");
    expect(blueprint).not.toContain("OPENAI_API_KEY");
    expect(blueprint).not.toContain("OPENROUTER_API_KEY");
    expect(blueprint).not.toContain("OPENAI_MODEL");
    expect(blueprint).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(blueprint).not.toContain("ALLOW_PRODUCTION_MIGRATIONS");
''',
)

write(
    "apps/web/tests/rebuild/p5-openrouter-byok.test.ts",
    r'''
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");

describe("P5 OpenRouter and user-owned provider boundary", () => {
  test("ships live model, settings, OAuth, and provider paths", () => {
    for (const path of [
      "src/app/(app)/settings/ai/page.tsx",
      "src/app/(app)/settings/ai/openrouter/callback/page.tsx",
      "src/app/api/v1/ai/openrouter/models/route.ts",
      "src/app/api/v1/ai/openrouter/oauth/exchange/route.ts",
      "src/components/ai/ai-provider-settings.tsx",
      "src/components/ai/openrouter-oauth-callback.tsx",
      "src/lib/ai/client-settings.ts",
      "src/lib/ai/openrouter-provider.ts",
    ]) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("uses request-scoped BYOK without provider secrets in deployment env", () => {
    const config = readWeb("src/lib/ai/config.ts");
    const runtime = readWeb("src/lib/operations/runtime-contract.ts");
    const template = readWeb(".env.release.example");
    const blueprint = readRepo("render.yaml");

    expect(config).toContain("x-kiteb-ai-provider");
    expect(config).toContain("x-kiteb-ai-model");
    expect(config).toContain("readBearerCredential");
    expect(config).not.toContain("process.env.OPENAI_API_KEY");
    expect(config).not.toContain("process.env.OPENROUTER_API_KEY");
    expect(config).not.toContain("process.env.OPENAI_MODEL");
    expect(runtime).toContain('z.enum(["byok", "fixture"])');
    expect(template).toContain("AI_PROVIDER=byok");
    expect(template).not.toContain("OPENAI_API_KEY=");
    expect(template).not.toContain("OPENROUTER_API_KEY=");
    expect(blueprint).not.toContain("OPENAI_API_KEY");
    expect(blueprint).not.toContain("OPENROUTER_API_KEY");
  });

  test("loads OpenRouter models live and respects user catalog filtering", () => {
    const route = readWeb(
      "src/app/api/v1/ai/openrouter/models/route.ts",
    );
    const settings = readWeb(
      "src/components/ai/ai-provider-settings.tsx",
    );

    expect(route).toContain('"models/user"');
    expect(route).toContain('"models"');
    expect(route).toContain('url.searchParams.set("output_modalities", "text")');
    expect(route).toContain('cache: "no-store"');
    expect(settings).toContain("openRouterModelCatalogSchema");
    expect(settings).toContain("النماذج المجانية فقط");
    expect(settings).toContain("تحديث حي");
    expect(settings).toContain("onSelect={setModel}");
    expect(settings).not.toContain("gpt-5");
    expect(settings).not.toContain("claude-");
    expect(settings).not.toContain("gemini-");
  });

  test("supports OpenRouter PKCE without an application client secret", () => {
    const settings = readWeb(
      "src/components/ai/ai-provider-settings.tsx",
    );
    const exchange = readWeb(
      "src/app/api/v1/ai/openrouter/oauth/exchange/route.ts",
    );
    const callback = readWeb(
      "src/components/ai/openrouter-oauth-callback.tsx",
    );

    expect(settings).toContain("code_challenge_method");
    expect(settings).toContain('"S256"');
    expect(settings).toContain("crypto.subtle.digest");
    expect(exchange).toContain("/api/v1/auth/keys");
    expect(exchange).toContain("code_verifier");
    expect(exchange).not.toContain("client_secret");
    expect(callback).toContain("rememberKey: false");
  });

  test("keeps keys client-side unless explicitly remembered", () => {
    const client = readWeb("src/lib/ai/client-settings.ts");
    expect(client).toContain("sessionStorage");
    expect(client).toContain("localStorage");
    expect(client).toContain("settings.rememberKey && apiKey");
    expect(client).toContain("Authorization: `Bearer ${settings.apiKey}`");
    expect(client).not.toContain("fetch(");
  });

  test("resolves credentials before durable conversation or draft creation", () => {
    const conversation = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/conversations/[conversationId]/stream/route.ts",
    );
    const draft = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/stream/route.ts",
    );

    expect(conversation.indexOf("resolveAiRequestConfig(request)")).toBeLessThan(
      conversation.indexOf("beginConversationTurn"),
    );
    expect(draft.indexOf("resolveAiRequestConfig(request)")).toBeLessThan(
      draft.indexOf("beginDraftGeneration"),
    );
    expect(conversation).toContain("createAiProvider(aiConfig, {");
    expect(draft).toContain("createAiProvider(aiConfig, {");
  });

  test("uses OpenRouter chat streaming and preserves quota controls", () => {
    const provider = readWeb("src/lib/ai/openrouter-provider.ts");
    const factory = readWeb("src/lib/ai/index.ts");
    const controlled = readWeb("src/lib/ai/controlled-provider.ts");

    expect(provider).toContain("/chat/completions");
    expect(provider).toContain("this.requestedModel");
    expect(provider).toContain("stream: true");
    expect(provider).toContain("PROVIDER_CREDITS_REQUIRED");
    expect(provider).not.toContain("gpt-");
    expect(factory).toContain("OpenRouterChatProvider");
    expect(factory).toContain("ControlledAiProvider");
    expect(controlled).toContain("reserveAiGenerationPermit");
  });
});
''',
)

write(
    "docs/rebuild/14-P5-OPENROUTER-BYOK.md",
    r'''
# P5 OpenRouter and User-Owned AI Access

## Decision

Kiteb uses request-scoped bring-your-own-key access for real generation.

- OpenRouter and direct OpenAI are supported.
- The application does not require a provider key or model in deployment
  environment variables.
- The signed-in user chooses a provider, supplies their own key, and selects or
  enters a current model identifier in `/settings/ai`.
- OpenRouter models are loaded live from its API. With a valid key the app uses
  the user-filtered catalog; without one it uses the public catalog.
- No model name is compiled as the production default.

## Secret boundary

The provider key:

- is held in browser `sessionStorage` by default;
- moves to browser `localStorage` only after an explicit remember-device choice;
- is sent as an `Authorization: Bearer` header only for model catalog checks,
  conversation generation, draft proposals, or OAuth exchange completion;
- is not included in URLs, request bodies, PostgreSQL, Supabase Storage,
  deployment variables, logs, workflow artifacts, or provider telemetry.

The provider and model identifier are not secrets and remain part of durable
generation telemetry.

## OpenRouter connection

Users may paste an OpenRouter key or connect through its PKCE authorization
flow. PKCE uses an S256 challenge and requires no Kiteb client secret. The
authorization code is exchanged server-side, returned with `no-store`, and
stored only in the user's browser.

## Model selection

The selector displays current OpenRouter metadata including model ID, context
length, modalities, prompt/completion price, and a free badge computed from
the live price fields. Search and free-only filtering are client-side after a
fresh catalog request. Manual model entry remains available so newly released
or private models are not blocked by UI assumptions.

## Existing controls retained

BYOK does not bypass Kiteb's database-enforced controls. Every conversation or
draft provider attempt still reserves the same workspace permit, concurrency
slot, request budget, and token budget before the provider call.

## Explicit boundaries

- A user-owned key can still incur charges according to the provider account.
- A free model can still have stricter availability and rate limits.
- Provider credentials stored in browser storage are exposed to anyone or any
  script that controls that browser profile; session-only is the default.
- Kiteb does not claim model availability, pricing stability, or model quality.
- Production ready: No.
''',
)

replace_once(
    "README.md",
    "- **P4 — durable drafts and reusable work:** implemented on PR `#6`, in final exact-head closeout\n- **Next:** P5 — operational readiness\n",
    "- **P4 — durable drafts and reusable work:** complete and merged\n- **P5 — operational readiness:** in progress on draft PR `#7`\n",
)
replace_once(
    "README.md",
    '''For the real provider adapter, add server-only values:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=<server-only-key>
OPENAI_MODEL=gpt-5-mini
OPENAI_BASE_URL=https://api.openai.com/v1
AI_REQUEST_TIMEOUT_MS=60000
AI_MAX_OUTPUT_TOKENS=2048
```
''',
    '''For real generation, sign in and open `/settings/ai`. Add your own
OpenRouter or OpenAI key and select or enter the current model ID. Provider
keys and model names are not required in server environment variables.

```env
AI_PROVIDER=byok
AI_REQUEST_TIMEOUT_MS=60000
AI_MAX_OUTPUT_TOKENS=2048
```
''',
)
replace_once(
    "README.md",
    "- [P4 draft architecture](./docs/rebuild/11-P4-ARCHITECTURE.md)\n",
    '''- [P4 draft architecture](./docs/rebuild/11-P4-ARCHITECTURE.md)
- [P5 operational readiness](./docs/rebuild/12-P5-OPERATIONAL-READINESS.md)
- [P5 deployment and rollback](./docs/rebuild/13-P5-DEPLOYMENT-AND-ROLLBACK.md)
- [P5 OpenRouter and user-owned AI access](./docs/rebuild/14-P5-OPENROUTER-BYOK.md)
''',
)

replace_once(
    "docs/rebuild/12-P5-OPERATIONAL-READINESS.md",
    "- OpenAI is the initial production generation provider.\n- Provider access remains server-only.\n",
    '''- OpenRouter and direct OpenAI are the initial real-generation adapters.
- Provider calls remain server-side, while each signed-in user supplies their
  own request-scoped key and current model from the browser UI.
''',
)
replace_once(
    "docs/rebuild/12-P5-OPERATIONAL-READINESS.md",
    "- `AI_PROVIDER`\n",
    "- `AI_PROVIDER` (`byok` in staging/production; `fixture` only in approved local tests)\n",
)
replace_once(
    "docs/rebuild/12-P5-OPERATIONAL-READINESS.md",
    '''Staging and production also require:

- `RELEASE_SHA`
- `OPENAI_API_KEY`
''',
    '''Staging and production also require:

- `RELEASE_SHA`

Provider keys and model IDs are intentionally absent from deployment
configuration. Signed-in users configure them in `/settings/ai`.
''',
)
replace_once(
    "docs/rebuild/12-P5-OPERATIONAL-READINESS.md",
    "- `AI_PROVIDER=fixture` is rejected in staging and production.\n",
    "- `AI_PROVIDER=fixture` is rejected in staging and production; real deployments use `AI_PROVIDER=byok`.\n",
)
replace_once(
    "docs/rebuild/12-P5-OPERATIONAL-READINESS.md",
    "| OpenAI API key | Restricted provider secret | Approved secret manager only | No | Provider-cost owner |\n",
    "| User provider API key | User-controlled restricted secret | Browser session storage by default; explicit device storage opt-in | No | Account user |\n",
)

replace_once(
    "docs/rebuild/03-IMPLEMENTATION-TRACKER.md",
    "| Protected live-provider smoke test | PLANNED | Cost-controlled key and explicit evidence |\n",
    "| OpenRouter and direct OpenAI BYOK | DONE | User UI, request-scoped keys, live OpenRouter catalog, PKCE |\n| Protected live-provider smoke test | PLANNED | User-owned key, selected model, explicit evidence |\n",
)

for obsolete in [
    ".github/workflows/p5-wire-provider-controls.yml",
    "scripts/maintenance/p5-wire-provider-controls.py",
    ".github/workflows/p5-openrouter-byok.yml",
    "scripts/maintenance/p5-openrouter-byok.py",
]:
    target = ROOT / obsolete
    if target.exists():
        target.unlink()
