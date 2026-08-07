import "server-only";

import { isArabicText } from "@/lib/utils/rtl";
import {
  AiProviderError,
  type AiProvider,
  type AiProviderStreamEvent,
  type AiProviderStreamInput,
} from "./provider";

function delay(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, milliseconds);

    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    };

    signal.addEventListener("abort", abort, { once: true });
  });
}

function fixtureResponse(prompt: string): string {
  if (isArabicText(prompt)) {
    return "هذه إجابة اختبارية متدفقة ومحفوظة. تحافظ على العربية وEnglish والأرقام 2026 والروابط كما هي.";
  }

  return "This is a deterministic streamed and persisted test response. It preserves English, العربية, numbers such as 2026, and URLs.";
}

function chunksFor(value: string): string[] {
  const chunks = value.match(/.{1,12}(?:\s|$)/gu);
  return chunks?.filter(Boolean) ?? [value];
}

export class FixtureAiProvider implements AiProvider {
  readonly name = "fixture";
  readonly requestedModel = "fixture-bilingual-v1";

  async *stream(
    input: AiProviderStreamInput,
  ): AsyncGenerator<AiProviderStreamEvent, void, undefined> {
    const prompt = input.messages.at(-1)?.content ?? "";

    if (prompt.includes("[fixture:fail]")) {
      await delay(30, input.signal);
      throw new AiProviderError(
        "PROVIDER_UNAVAILABLE",
        "The deterministic fixture was instructed to fail.",
        true,
      );
    }

    const response = fixtureResponse(prompt);
    const chunkDelay = prompt.includes("[fixture:slow]") ? 180 : 25;

    for (const chunk of chunksFor(response)) {
      await delay(chunkDelay, input.signal);
      yield { type: "delta", delta: chunk };
    }

    yield {
      type: "complete",
      providerResponseId: `fixture_${crypto.randomUUID()}`,
      returnedModel: this.requestedModel,
      usage: {
        inputTokens: Math.max(1, Math.ceil(prompt.length / 4)),
        outputTokens: Math.max(1, Math.ceil(response.length / 4)),
        reasoningTokens: 0,
        totalTokens: Math.max(2, Math.ceil((prompt.length + response.length) / 4)),
      },
    };
  }
}
