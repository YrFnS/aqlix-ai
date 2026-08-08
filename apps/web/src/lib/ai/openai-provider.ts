import "server-only";

import type { AiRuntimeConfig } from "./config";
import {
  AiProviderError,
  emptyProviderUsage,
  type AiProvider,
  type AiProviderStreamEvent,
  type AiProviderStreamInput,
} from "./provider";

interface OpenAiEvent {
  type?: string;
  delta?: string;
  message?: string;
  code?: string;
  response?: {
    id?: string;
    model?: string;
    status?: string;
    error?: {
      code?: string;
      message?: string;
    } | null;
    incomplete_details?: {
      reason?: string;
    } | null;
    usage?: {
      input_tokens?: number;
      output_tokens?: number;
      total_tokens?: number;
      output_tokens_details?: {
        reasoning_tokens?: number;
      };
    } | null;
  };
}

const baseInstructions =
  "You are Kiteb, a clear bilingual work assistant. Reply in the language used by the user unless they ask for another language. Preserve code, numbers, URLs, and mixed Arabic-English text accurately. Do not claim access to documents or sources unless explicit source passages are supplied in these instructions.";

function providerErrorForStatus(
  status: number,
  message: string,
): AiProviderError {
  if (status === 401 || status === 403) {
    return new AiProviderError(
      "PROVIDER_AUTHENTICATION",
      "The model provider rejected the server credentials.",
      false,
      status,
    );
  }

  if (status === 429) {
    return new AiProviderError(
      "PROVIDER_RATE_LIMITED",
      "The model provider is temporarily rate limited.",
      true,
      status,
    );
  }

  if (status >= 500) {
    return new AiProviderError(
      "PROVIDER_UNAVAILABLE",
      "The model provider is temporarily unavailable.",
      true,
      status,
    );
  }

  return new AiProviderError(
    "PROVIDER_RESPONSE_INVALID",
    message || "The model provider rejected the request.",
    status === 408 || status === 409,
    status,
  );
}

function safeProviderMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.slice(0, 500);
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
): AsyncGenerator<OpenAiEvent, void, undefined> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parseFrame = (frame: string): OpenAiEvent | null => {
    const data = frame
      .split(/\r?\n/u)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    if (!data || data === "[DONE]") return null;

    try {
      return JSON.parse(data) as OpenAiEvent;
    } catch {
      throw new AiProviderError(
        "PROVIDER_RESPONSE_INVALID",
        "The model provider returned an invalid stream event.",
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
        const event = parseFrame(frame);
        if (event) yield event;
      }
    }

    buffer += decoder.decode();
    const finalEvent = parseFrame(buffer);
    if (finalEvent) yield finalEvent;
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

export class OpenAiResponsesProvider implements AiProvider {
  readonly name = "openai";
  readonly requestedModel: string;

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxOutputTokens: number;

  constructor(config: AiRuntimeConfig) {
    if (!config.openai) {
      throw new AiProviderError(
        "PROVIDER_UNCONFIGURED",
        "OpenAI generation is not configured in this environment.",
        false,
      );
    }

    this.apiKey = config.openai.apiKey;
    this.baseUrl = config.openai.baseUrl;
    this.requestedModel = config.requestedModel;
    this.timeoutMs = config.requestTimeoutMs;
    this.maxOutputTokens = config.maxOutputTokens;
  }

  async *stream(
    input: AiProviderStreamInput,
  ): AsyncGenerator<AiProviderStreamEvent, void, undefined> {
    const request = createRequestController(input.signal, this.timeoutMs);
    let completed = false;

    try {
      const response = await fetch(`${this.baseUrl}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          model: this.requestedModel,
          instructions: input.instructions
            ? `${baseInstructions}\n\n${input.instructions}`
            : baseInstructions,
          input: input.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          max_output_tokens: this.maxOutputTokens,
          stream: true,
          store: false,
        }),
        signal: request.controller.signal,
      });

      if (!response.ok) {
        throw providerErrorForStatus(
          response.status,
          await readErrorMessage(response),
        );
      }

      if (!response.body) {
        throw new AiProviderError(
          "PROVIDER_RESPONSE_INVALID",
          "The model provider returned no response stream.",
          true,
        );
      }

      for await (const event of parseServerSentEvents(response.body)) {
        if (event.type === "response.output_text.delta") {
          if (typeof event.delta === "string" && event.delta.length > 0) {
            yield { type: "delta", delta: event.delta };
          }
          continue;
        }

        if (event.type === "response.completed") {
          const providerResponse = event.response;
          if (!providerResponse || providerResponse.status !== "completed") {
            throw new AiProviderError(
              "PROVIDER_RESPONSE_INVALID",
              "The model provider did not complete the response.",
              true,
            );
          }

          const usage = providerResponse.usage;
          completed = true;
          yield {
            type: "complete",
            providerResponseId: providerResponse.id ?? null,
            returnedModel: providerResponse.model ?? null,
            usage: usage
              ? {
                  inputTokens: usage.input_tokens ?? null,
                  outputTokens: usage.output_tokens ?? null,
                  reasoningTokens:
                    usage.output_tokens_details?.reasoning_tokens ?? null,
                  totalTokens: usage.total_tokens ?? null,
                }
              : emptyProviderUsage,
          };
          continue;
        }

        if (event.type === "response.failed") {
          throw new AiProviderError(
            "PROVIDER_UNAVAILABLE",
            safeProviderMessage(event.response?.error?.message) ||
              "The model provider failed to generate a response.",
            true,
          );
        }

        if (event.type === "response.incomplete") {
          throw new AiProviderError(
            "PROVIDER_RESPONSE_INVALID",
            safeProviderMessage(event.response?.incomplete_details?.reason) ||
              "The model provider returned an incomplete response.",
            true,
          );
        }

        if (event.type === "error") {
          throw new AiProviderError(
            "PROVIDER_UNAVAILABLE",
            safeProviderMessage(event.message) ||
              "The model provider stream failed.",
            true,
          );
        }
      }

      if (!completed) {
        throw new AiProviderError(
          "PROVIDER_RESPONSE_INVALID",
          "The model provider stream ended before completion.",
          true,
        );
      }
    } catch (error) {
      if (input.signal.aborted) throw error;

      if (request.timedOut()) {
        throw new AiProviderError(
          "PROVIDER_TIMEOUT",
          "The model provider did not respond before the timeout.",
          true,
        );
      }

      if (error instanceof AiProviderError) throw error;

      throw new AiProviderError(
        "PROVIDER_UNAVAILABLE",
        "The model provider request failed.",
        true,
      );
    } finally {
      request.cleanup();
    }
  }
}
