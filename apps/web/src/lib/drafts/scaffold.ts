import type { DraftKind } from "@iraqi-ai/types";

export interface DraftScaffold {
  title: string;
  content: string;
  direction: "auto";
  kind: Exclude<DraftKind, "freeform">;
}

function boundedConversationTitle(value: string): string {
  const normalized = value.trim() || "محادثة";
  return normalized.length <= 140
    ? normalized
    : `${normalized.slice(0, 137).trimEnd()}…`;
}

function normalizeSourceContent(value: string): string {
  return value.replace(/\r\n?/gu, "\n").trim();
}

function checklistItems(value: string): string[] {
  const paragraphs = value
    .split(/\n\s*\n/gu)
    .map((paragraph) => paragraph.replace(/\s+/gu, " ").trim())
    .filter(Boolean);

  if (paragraphs.length > 1) return paragraphs;

  return value
    .split(/\n|(?<=[.!?؟])\s+/gu)
    .map((item) => item.replace(/^[-*•]\s*/u, "").trim())
    .filter(Boolean);
}

export function createDraftScaffold(input: {
  kind: Exclude<DraftKind, "freeform">;
  conversationTitle: string;
  messageContent: string;
}): DraftScaffold {
  const conversationTitle = boundedConversationTitle(input.conversationTitle);
  const source = normalizeSourceContent(input.messageContent);

  switch (input.kind) {
    case "summary":
      return {
        kind: input.kind,
        direction: "auto",
        title: `ملخص — ${conversationTitle}`,
        content: `# ملخص\n\n${source}`,
      };
    case "comparison":
      return {
        kind: input.kind,
        direction: "auto",
        title: `مقارنة — ${conversationTitle}`,
        content: [
          "# مقارنة",
          "",
          "## المادة الأساسية",
          "",
          source,
          "",
          "## أوجه التشابه",
          "",
          "- ",
          "",
          "## أوجه الاختلاف",
          "",
          "- ",
          "",
          "## الخلاصة",
          "",
        ].join("\n"),
      };
    case "email":
      return {
        kind: input.kind,
        direction: "auto",
        title: `رسالة — ${conversationTitle}`,
        content: [
          `الموضوع: ${conversationTitle}`,
          "",
          "مرحباً،",
          "",
          source,
          "",
          "مع التحية،",
        ].join("\n"),
      };
    case "memo":
      return {
        kind: input.kind,
        direction: "auto",
        title: `مذكرة — ${conversationTitle}`,
        content: [
          "# مذكرة",
          "",
          `**الموضوع:** ${conversationTitle}`,
          "",
          "## السياق",
          "",
          source,
          "",
          "## التوصية",
          "",
        ].join("\n"),
      };
    case "checklist": {
      const items = checklistItems(source);
      return {
        kind: input.kind,
        direction: "auto",
        title: `قائمة عمل — ${conversationTitle}`,
        content: [
          "# قائمة عمل",
          "",
          ...(items.length > 0
            ? items.map((item) => `- [ ] ${item}`)
            : ["- [ ] "]),
        ].join("\n"),
      };
    }
    case "decision_note":
      return {
        kind: input.kind,
        direction: "auto",
        title: `قرار — ${conversationTitle}`,
        content: [
          "# ملاحظة قرار",
          "",
          "## القرار",
          "",
          "",
          "## السياق",
          "",
          source,
          "",
          "## المبررات",
          "",
          "",
          "## الخطوات التالية",
          "",
          "- [ ] ",
        ].join("\n"),
      };
  }
}
