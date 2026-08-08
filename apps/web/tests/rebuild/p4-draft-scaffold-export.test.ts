import { describe, expect, test } from "bun:test";
import type { Draft } from "@iraqi-ai/types";
import {
  buildDraftExport,
  contentDispositionFileName,
  escapeDraftHtml,
} from "../../src/lib/drafts/export";
import {
  draftEditorValue,
  isDraftEditorDirty,
} from "../../src/lib/drafts/editor-state";
import { createDraftScaffold } from "../../src/lib/drafts/scaffold";

const timestamp = "2026-08-08T00:00:00.000Z";

function draftFixture(overrides: Partial<Draft> = {}): Draft {
  return {
    id: "6d9024cd-8dd2-4be9-9cf8-e7a046a21a8c",
    workspaceId: "3a6d91fa-5aaf-4eb6-8fc5-b47d137fe75f",
    conversationId: "4b7e02ab-6bb0-4fc7-9ad6-c58e2480f86a",
    originMessageId: "5c8f13bc-7cc1-4ad8-8be7-d69f3591097b",
    createdBy: "8fb246ef-aff4-4dfb-be1a-09c268c43cae",
    title: "قرار المشروع / Project Decision",
    content: "العربية and English <script>alert('x')</script> [S1]",
    direction: "auto",
    kind: "decision_note",
    status: "active",
    currentVersion: 2,
    versionCount: 2,
    provenanceCount: 1,
    lastSavedAt: timestamp,
    archivedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

describe("P4 deterministic draft scaffolds", () => {
  const source =
    "النقطة الأولى بالعربية.\n\nSecond English point with 2026 and https://example.test.";

  for (const kind of [
    "summary",
    "comparison",
    "email",
    "memo",
    "checklist",
    "decision_note",
  ] as const) {
    test(`builds a bounded ${kind} scaffold without a provider call`, () => {
      const scaffold = createDraftScaffold({
        kind,
        conversationTitle: "  مراجعة Contract 2026  ",
        messageContent: source,
      });

      expect(scaffold.kind).toBe(kind);
      expect(scaffold.direction).toBe("auto");
      expect(scaffold.title).toContain("مراجعة Contract 2026");
      expect(scaffold.content).toContain("العربية");
      expect(scaffold.content).toContain("English");
      expect(scaffold.content).toContain("2026");
      expect(scaffold.content).toContain("https://example.test");
    });
  }

  test("turns paragraphs into explicit checklist items", () => {
    const scaffold = createDraftScaffold({
      kind: "checklist",
      conversationTitle: "Tasks",
      messageContent: "الأول\n\nSecond task",
    });

    expect(scaffold.content).toContain("- [ ] الأول");
    expect(scaffold.content).toContain("- [ ] Second task");
  });
});

describe("P4 draft exports", () => {
  test("escapes every HTML-sensitive character", () => {
    expect(escapeDraftHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  });

  test("builds UTF-8 TXT and Markdown from the accepted draft", () => {
    const draft = draftFixture();
    const text = buildDraftExport(draft, "txt");
    const markdown = buildDraftExport(draft, "md");

    expect(text.contentType).toBe("text/plain; charset=utf-8");
    expect(text.body).toContain(draft.title);
    expect(text.body).toContain(draft.content);
    expect(text.downloadName).toEndWith(".txt");

    expect(markdown.contentType).toBe("text/markdown; charset=utf-8");
    expect(markdown.body).toStartWith(`# ${draft.title}`);
    expect(markdown.downloadName).toEndWith(".md");
  });

  test("builds standalone safe HTML without scripts or remote resources", () => {
    const html = buildDraftExport(draftFixture(), "html");

    expect(html.contentType).toBe("text/html; charset=utf-8");
    expect(html.body).toContain('<meta charset="utf-8">');
    expect(html.body).toContain('<pre dir="auto">');
    expect(html.body).toContain("&lt;script&gt;");
    expect(html.body).not.toContain("<script>");
    expect(html.body).not.toMatch(/https?:\/\//u);
    expect(html.downloadName).toEndWith(".html");
  });

  test("uses RFC 5987 UTF-8 download filenames with a safe fallback", () => {
    const header = contentDispositionFileName("قرار المشروع.md");

    expect(header).toContain('filename="____ _______.md"');
    expect(header).toContain("filename*=UTF-8''");
    expect(header).toContain("%D9%82%D8%B1%D8%A7%D8%B1");
  });
});

describe("P4 explicit editor state", () => {
  test("reports accepted values as clean", () => {
    const draft = draftFixture();
    expect(isDraftEditorDirty(draft, draftEditorValue(draft))).toBe(false);
  });

  test("detects title, content, direction, and kind changes", () => {
    const draft = draftFixture();
    const accepted = draftEditorValue(draft);

    expect(
      isDraftEditorDirty(draft, { ...accepted, title: "Updated title" }),
    ).toBe(true);
    expect(
      isDraftEditorDirty(draft, { ...accepted, content: "Updated content" }),
    ).toBe(true);
    expect(isDraftEditorDirty(draft, { ...accepted, direction: "ltr" })).toBe(
      true,
    );
    expect(isDraftEditorDirty(draft, { ...accepted, kind: "memo" })).toBe(
      true,
    );
  });
});
