import "server-only";

import {
  AiProviderError,
  type AiProviderUsage,
} from "./provider";

export interface OpenRouterStreamChunk {
  id?: string;
  model?: string;
  choices?: Array<{
    delta?: { content?: string | null };
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    completion_tokens_details?: {
      reasoning_tokens?: number;
    } | null;
  } | null;
  error?: {
    code?: number | string;
    message?: string;
  };
}

export function safeOpenRouterMessage(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 500) : "";
}

export function openRouterUsage(
  chunk: OpenRouterStreamChunk,
  current: AiProviderUsage,
): AiProviderUsage {
  const usage = chunk.usage;
  if (!usage) return current;

  return {
    inputTokens: usage.prompt_tokens ?? current.inputTokens,
    outputTokens: usage.completion_tokens ?? current.outputTokens,
    reasoningTokens:
      usage.completion_tokens_details?.reasoning_tokens ??
      current.reasoningTokens,
    totalTokens: usage.total_tokens ?? current.totalTokens,
  };
}

export async function* parseOpenRouterStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<OpenRouterStreamChunk, void, undefined> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parseFrame = (frame: string): OpenRouterStreamChunk | null => {
    const data = frame
      .split(/\r?\n/u)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    if (!data || data === "[DONE]") return null;

    try {
      return JSON.parse(data) as OpenRouterStreamChunk;
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
        const chunk = parseFrame(frame);
        if (chunk) yield chunk;
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      const finalChunk = parseFrame(buffer);
      if (finalChunk) yield finalChunk;
    }
  } finally {
    reader.releaseLock();
  }
}
