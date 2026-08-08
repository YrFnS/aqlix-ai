import "server-only";

import { isArabicText } from "@/lib/utils/rtl";
import { chunkFixtureText } from "./fixture-chunks";
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

    function abort() {
      clearTimeout(timer);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, milliseconds);

    signal.addEventListener("abort", abort, { once: true });
  });
}

interface FixtureDraftPayload {
  action?: string;
  instruction?: string;
  draftContent?: string;
}

function fixtureDraftResponse(prompt: string): string {
  let payload: FixtureDraftPayload = {};
  try {
    payload = JSON.parse(prompt) as FixtureDraftPayload;
  } catch {
    // Invalid fixture data is handled with a bounded deterministic proposal.
  }

  const content = payload.draftContent ?? "";
  const instruction = payload.instruction?.trim() ?? "";
  const arabic = isArabicText(content);

  switch (payload.action) {
    case "shorten": {
      const compact = content.replace(/\s+/gu, " ").trim();
      return compact.length <= 120
        ? compact
        : `${compact.slice(0, 117).trimEnd()}…`;
    }
    case "expand":
      return `${content}\n\n${
        arabic
          ? "تفصيل اختباري إضافي يوسّع الفكرة ويحافظ على العربية وEnglish والأرقام 2026."
          : "Additional deterministic detail expands the idea while preserving English, العربية, and 2026."
      }`;
    case "translate_ar":
      return `نسخة عربية اختبارية محفوظة.\n\n${content}`;
    case "translate_en":
      return `Deterministic English translation proposal.\n\n${content}`;
    case "continue":
      return `${content}\n\n${
        arabic
          ? "استمرار اختباري جديد للمسودة من النقطة الحالية."
          : "A new deterministic continuation follows from the current ending."
      }`;
    case "custom":
      return `${content}\n\n${
        arabic ? "تعديل مخصص اختباري:" : "Deterministic custom revision:"
      } ${instruction}`.trim();
    case "improve":
    default:
      return `${content}\n\n${
        arabic
          ? "صياغة اختبارية محسّنة بوضوح أكبر مع الحفاظ على المعنى والمراجع [S1]."
          : "A clearer deterministic revision preserves the meaning and citation [S1]."
      }`;
  }
}

function fixtureResponse(prompt: string, instructions?: string): string {
  const grounded = instructions?.includes("KITEB_GROUNDING_V1") ?? false;
  const draftContinuation =
    instructions?.includes("KITEB_DRAFT_CONTINUATION_V1") ?? false;

  if (draftContinuation) {
    return fixtureDraftResponse(prompt);
  }

  if (grounded && prompt.includes("[fixture:no-citation]")) {
    return isArabicText(prompt)
      ? "هذه إجابة اختبارية بلا مرجع مقصود لاختبار الرفض."
      : "This deterministic answer intentionally omits a citation.";
  }

  if (grounded && prompt.includes("[fixture:bad-citation]")) {
    return isArabicText(prompt)
      ? "هذه إجابة اختبارية تحمل مرجعاً غير موجود [S99]."
      : "This deterministic answer cites an unavailable label [S99].";
  }

  if (grounded) {
    return isArabicText(prompt)
      ? "استناداً إلى المقطع المحفوظ، تدعم مساحة العمل هذه الإجابة [S1]."
      : "The saved workspace passage supports this deterministic answer [S1].";
  }

  if (isArabicText(prompt)) {
    return "هذه إجابة اختبارية متدفقة ومحفوظة. تحافظ على العربية وEnglish والأرقام 2026 والروابط كما هي.";
  }

  return "This is a deterministic streamed and persisted test response. It preserves English, العربية, numbers such as 2026, and URLs.";
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

    const response = fixtureResponse(prompt, input.instructions);
    const chunkDelay = prompt.includes("[fixture:slow]") ? 180 : 25;

    for (const chunk of chunkFixtureText(response)) {
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
        totalTokens: Math.max(
          2,
          Math.ceil((prompt.length + response.length) / 4),
        ),
      },
    };
  }
}
