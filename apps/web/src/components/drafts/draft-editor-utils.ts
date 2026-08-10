import type {
  DraftDetail,
  DraftGeneration,
  DraftGenerationAction,
  DraftKind,
  DraftProposalStreamEvent,
} from "@iraqi-ai/types";
import { draftProposalStreamEventSchema } from "@iraqi-ai/types";

export const kindOptions: Array<{ value: DraftKind; label: string }> = [
  { value: "freeform", label: "مسودة حرة" },
  { value: "summary", label: "ملخص" },
  { value: "comparison", label: "مقارنة" },
  { value: "email", label: "رسالة" },
  { value: "memo", label: "مذكرة" },
  { value: "checklist", label: "قائمة عمل" },
  { value: "decision_note", label: "ملاحظة قرار" },
];

export const actionOptions: Array<{
  value: DraftGenerationAction;
  label: string;
  instruction: string;
}> = [
  {
    value: "improve",
    label: "تحسين الوضوح",
    instruction: "Improve clarity and structure while preserving the meaning.",
  },
  {
    value: "shorten",
    label: "اختصار",
    instruction: "Shorten the draft without losing its essential meaning.",
  },
  {
    value: "expand",
    label: "توسيع",
    instruction: "Expand the draft with useful detail and better transitions.",
  },
  {
    value: "translate_ar",
    label: "ترجمة إلى العربية",
    instruction: "Translate the complete draft into clear Arabic.",
  },
  {
    value: "translate_en",
    label: "Translate to English",
    instruction: "Translate the complete draft into clear English.",
  },
  {
    value: "continue",
    label: "متابعة الكتابة",
    instruction: "Continue the draft naturally from its current ending.",
  },
  {
    value: "custom",
    label: "تعليمات مخصصة",
    instruction: "Revise the draft according to this instruction.",
  },
];

export function mergeGeneration(
  detail: DraftDetail,
  generation: DraftGeneration,
): DraftDetail {
  const byId = new Map(
    detail.generations.map((candidate) => [candidate.id, candidate]),
  );
  byId.set(generation.id, generation);

  return {
    ...detail,
    generations: Array.from(byId.values()).sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    ),
  };
}

export async function parseEventStream(
  response: Response,
  onEvent: (event: DraftProposalStreamEvent) => void,
): Promise<void> {
  if (!response.body) throw new Error("The proposal stream is unavailable.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processFrame = (frame: string) => {
    const data = frame
      .split(/\r?\n/u)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    if (!data) return;

    let value: unknown;
    try {
      value = JSON.parse(data);
    } catch {
      throw new Error("The server returned an invalid proposal event.");
    }

    const parsed = draftProposalStreamEventSchema.safeParse(value);
    if (!parsed.success) {
      throw new Error("The server returned an unsupported proposal event.");
    }

    onEvent(parsed.data);
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
        processFrame(frame);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) processFrame(buffer);
  } finally {
    reader.releaseLock();
  }
}

export function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function provenanceLocator(
  provenance: DraftDetail["provenance"][number],
): string {
  if (provenance.pageNumberSnapshot) {
    return `صفحة ${provenance.pageNumberSnapshot}`;
  }
  if (provenance.startLineSnapshot && provenance.endLineSnapshot) {
    return `الأسطر ${provenance.startLineSnapshot}–${provenance.endLineSnapshot}`;
  }
  return `المقطع ${provenance.sourceOrdinalSnapshot + 1}`;
}

export function generationLabel(status: DraftGeneration["status"]): string {
  const labels: Record<DraftGeneration["status"], string> = {
    pending: "بانتظار المزود",
    streaming: "جاري الاقتراح",
    complete: "جاهز للمراجعة",
    failed: "فشل",
    cancelled: "أُلغي وحُفظ الجزئي",
    applied: "طُبق",
    discarded: "رُفض",
  };
  return labels[status];
}

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
