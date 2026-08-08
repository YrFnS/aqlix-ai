import "server-only";

import type { ProviderFailureCode } from "@iraqi-ai/types";

export type AiInputRole = "user" | "assistant";

export interface AiInputMessage {
  role: AiInputRole;
  content: string;
}

export interface AiProviderUsage {
  inputTokens: number | null;
  outputTokens: number | null;
  reasoningTokens: number | null;
  totalTokens: number | null;
}

export type AiProviderStreamEvent =
  | {
      type: "delta";
      delta: string;
    }
  | {
      type: "complete";
      providerResponseId: string | null;
      returnedModel: string | null;
      usage: AiProviderUsage;
    };

export interface AiProviderStreamInput {
  messages: AiInputMessage[];
  signal: AbortSignal;
  instructions?: string;
}

export interface AiProvider {
  readonly name: string;
  readonly requestedModel: string;
  stream(
    input: AiProviderStreamInput,
  ): AsyncGenerator<AiProviderStreamEvent, void, undefined>;
}

export class AiProviderError extends Error {
  constructor(
    public readonly code: ProviderFailureCode,
    message: string,
    public readonly retryable: boolean,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

export function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException && error.name === "AbortError"
  ) || (
    error instanceof Error && error.name === "AbortError"
  );
}

export const emptyProviderUsage: AiProviderUsage = {
  inputTokens: null,
  outputTokens: null,
  reasoningTokens: null,
  totalTokens: null,
};
