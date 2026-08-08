import "server-only";

import type { AiRuntimeConfig } from "./config";
import {
  parseOpenRouterStream,
  openRouterUsage,
  safeOpenRouterMessage,
} from "./openrouter-stream";
import {
  AiProviderError,
  emptyProviderUsage,
  type AiProvider,
  type AiProviderStreamEvent,
  type AiProviderStreamInput,
} from "./provider";

const baseInstructions =
  "You are Kiteb, a clear bilingual work assistant. Reply in the user's language unless asked otherwise. Preserve code, numbers, URLs, citations, and mixed Arabic-English text accurately. Do not claim access to sources unless source passages are explicitly supplied.";

function errorForStatus(status: number, detail = ""): AiProviderError {
  if (status === 401 || status === 403) {
    return new AiProviderError(
      "PROVIDER_AUTHENTICATION",
      "OpenRouter rejected the saved user credential.",
      false,
      status,
    );
  }
  if (status === 402) {
    return new AiProviderError(
      "PROVIDER_BUDGET_EXCEEDED",
      "The OpenRouter key has insufficient credits or reached its limit.",
      false,
      status,
    );
  }
  if (status === 408) {
    return new AiProviderError(
      "PROVIDER_TIMEOUT",
      "OpenRouter timed out.",
      true,
      status,
    );
  }
  if (status === 429) {
    return new AiProviderError(
      "PROVIDER_RATE_LIMITED",
      "OpenRouter temporarily rate limited this key or model.",
      true,
      status,
    );
  }
  if (status >= 500) {
    return new AiProviderError(
      "PROVIDER_UNAVAILABLE",
      "OpenRouter or the selected model provider is temporarily unavailable.",
      true,
      status,
    );
  }

  return new AiProviderError(
    "PROVIDER_RESPONSE_INVALID",
    detail || "OpenRouter rejected the request.",
    status === 409,
    status,
  );
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: unknown };
    };
    return safeOpenRouterMessage(body.error?.message);
  } catch {
    return "";
  }
}

function requestController(source: AbortSignal, timeoutMs: number) {
  const controller = new AbortController();
  let timedOut = false;
  const abortFromSource = () => controller.abort(source.reason);

  if (source.aborted) abortFromSource();
  else source.addEventListener("abort", abortFromSource, { once: true });

  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort(new Error("OpenRouter timeout"));
  }, timeoutMs);

  return {
    controller,
    timedOut: () => timedOut,
    cleanup: () => {
      clearTimeout(timeout);
      source.removeEventListener("abort", abortFromSource);
    },
  };
}

export class OpenRouterChatProvider implements AiProvider {
  readonly name = "openrouter";
  readonly requestedModel: string;

  private readonly connection: NonNullable<AiRuntimeConfig["openrouter"]>;
  private readonly timeoutMs: number;
  private readonly maxOutputTokens: number;

  constructor(config: AiRuntimeConfig) {
    if (!config.openrouter) {
      throw new AiProviderError(
        "PROVIDER_UNCONFIGURED",
        "OpenRouter is not connected for this user.",
        false,
      );
    }

    this.connection = config.openrouter;
    this.requestedModel = config.requestedModel;
    this.timeoutMs = config.requestTimeoutMs;
    this.maxOutputTokens = config.maxOutputTokens;
  }

  async *stream(
    input: AiProviderStreamInput,
  ): AsyncGenerator<AiProviderStreamEvent, void, undefined> {
    const request = requestController(input.signal, this.timeoutMs);
    let completed = false;
    let providerResponseId: string | null = null;
    let returnedModel: string | null = null;
    let usage = emptyProviderUsage;

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${this.connection.apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "X-OpenRouter-Title": this.connection.appTitle,
      };
      if (this.connection.appUrl) {
        headers["HTTP-Referer"] = this.connection.appUrl;
      }

      const instructions = input.instructions
        ? `${baseInstructions}\n\n${input.instructions}`
        : baseInstructions;
      const response = await fetch(
        `${this.connection.baseUrl}/chat/completions`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: this.requestedModel,
            messages: [
              { role: "system", content: instructions },
              ...input.messages.map((message) => ({
                role: message.role,
                content: message.content,
              })),
            ],
            max_tokens: this.maxOutputTokens,
            stream: true,
          }),
          signal: request.controller.signal,
        },
      );

      if (!response.ok) {
        throw errorForStatus(response.status, await responseError(response));
      }
      if (!response.body) {
        throw new AiProviderError(
          "PROVIDER_RESPONSE_INVALID",
          "OpenRouter returned no response stream.",
          true,
        );
      }

      providerResponseId = response.headers.get("X-Generation-Id");

      for await (const chunk of parseOpenRouterStream(response.body)) {
        if (chunk.error) {
          const status = Number(chunk.error.code);
          throw Number.isFinite(status)
            ? errorForStatus(status, safeOpenRouterMessage(chunk.error.message))
            : new AiProviderError(
                "PROVIDER_UNAVAILABLE",
                safeOpenRouterMessage(chunk.error.message) ||
                  "OpenRouter reported a generation error.",
                true,
              );
        }

        providerResponseId = chunk.id ?? providerResponseId;
        returnedModel = chunk.model ?? returnedModel;
        usage = openRouterUsage(chunk, usage);

        const text = chunk.choices?.[0]?.delta?.content;
        if (typeof text === "string" && text.length > 0) {
          yield { type: "delta", delta: text };
        }

        if (chunk.choices?.[0]?.finish_reason) completed = true;
      }

      if (!completed) {
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
          "OpenRouter did not respond before the configured timeout.",
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
