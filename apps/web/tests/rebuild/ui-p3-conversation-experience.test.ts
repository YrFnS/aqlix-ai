import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

describe("UI P3 workspace and conversation experience", () => {
  test("turns conversation discovery into a focused product surface", () => {
    const list = readSource(
      "src/app/(app)/workspaces/[workspaceId]/conversations/page.tsx",
    );
    const archived = readSource(
      "src/app/(app)/workspaces/[workspaceId]/conversations/archived/page.tsx",
    );
    const card = readSource(
      "src/components/conversations/conversation-card.tsx",
    );

    expect(list).toContain("<PageShell");
    expect(list).toContain("<PageHeader");
    expect(list).toContain('id="new-conversation"');
    expect(list).toContain("<ConversationCard");
    expect(archived).toContain("<PageHeader");
    expect(card).toContain("<MotionSurface");
    expect(card).toContain("<Surface");
    expect(card).toContain('aria-label={`فتح المحادثة:');
    expect(list).not.toContain("P2 ·");
    expect(archived).not.toContain("P2 ·");
  });

  test("separates history, conversation, and secondary controls", () => {
    const detail = readSource(
      "src/app/(app)/workspaces/[workspaceId]/conversations/[conversationId]/page.tsx",
    );
    const frame = readSource(
      "src/components/conversations/conversation-workspace-frame.tsx",
    );
    const inspector = readSource(
      "src/components/conversations/conversation-inspector.tsx",
    );

    expect(detail).toContain("<ConversationWorkspaceFrame");
    expect(detail).toContain("<ConversationSwitcher");
    expect(detail).toContain("<ConversationInspector");
    expect(detail).toContain("<ConversationShell");
    expect(detail).toContain("includeArchived: true");
    expect(detail).not.toContain("renameConversationAction");
    expect(detail).not.toContain("deleteConversationAction");
    expect(frame).toContain('aria-label="قائمة المحادثات"');
    expect(frame).toContain('aria-label="تفاصيل المحادثة"');
    expect(frame).toContain('aria-modal="true"');
    expect(frame).toContain("document.body.style.overflow");
    expect(inspector).toContain("renameConversationAction");
    expect(inspector).toContain("archiveConversationAction");
    expect(inspector).toContain("deleteConversationAction");
    expect(inspector).toContain("<DraftFromConversationPanel");
  });

  test("provides fast conversation switching inside the current workspace", () => {
    const switcher = readSource(
      "src/components/conversations/conversation-switcher.tsx",
    );

    expect(switcher).toContain("currentConversationId");
    expect(switcher).toContain('type="search"');
    expect(switcher).toContain('aria-current={active ? "page" : undefined}');
    expect(switcher).toContain("conversation.messageCount");
    expect(switcher).toContain("/conversations/archived");
    expect(switcher).toContain("#new-conversation");
  });

  test("uses meaningful generation states instead of a generic spinner", () => {
    const shell = readSource(
      "src/components/conversations/conversation-shell.tsx",
    );
    const orb = readSource(
      "src/components/conversations/activity-orb.tsx",
    );

    expect(shell).toContain("<ActivityOrb");
    expect(shell).toContain('"searching"');
    expect(shell).toContain('"composing"');
    expect(shell).not.toContain("animate-spin");
    expect(orb).toContain("useReducedMotion");
    expect(orb).toContain("Number.POSITIVE_INFINITY");
    expect(orb).toContain('role="status"');
  });

  test("opens cited passages inside the conversation before full navigation", () => {
    const shell = readSource(
      "src/components/conversations/conversation-shell.tsx",
    );
    const citations = readSource(
      "src/components/conversations/message-citations.tsx",
    );
    const inspector = readSource(
      "src/components/conversations/citation-inspector.tsx",
    );

    expect(shell).toContain("inspectedCitation");
    expect(shell).toContain("<CitationInspector");
    expect(citations).toContain("onInspect?:");
    expect(citations).toContain("onInspect(citation)");
    expect(inspector).toContain("documentDetailSchema.safeParse");
    expect(inspector).toContain("source.content");
    expect(inspector).toContain("فتح المستند الكامل");
    expect(inspector).toContain('aria-label={`معاينة المرجع');
  });

  test("keeps the composer compact, keyboard-aware, and source explicit", () => {
    const shell = readSource(
      "src/components/conversations/conversation-shell.tsx",
    );

    expect(shell).toContain("textareaRef.current");
    expect(shell).toContain("Math.min(textarea.scrollHeight, 208)");
    expect(shell).toContain("event.nativeEvent.isComposing");
    expect(shell).toContain('aria-pressed={groundingMode === "workspace_sources"}');
    expect(shell).toContain("Shift+Enter");
    expect(shell).toContain("isNearBottom");
    expect(shell).toContain("آخر الرسائل");
    expect(shell).toContain("<details");
    expect(shell).toContain("تفاصيل التوليد");
  });

  test("keeps draft conversion compact and free of implementation labels", () => {
    const draft = readSource(
      "src/components/drafts/draft-from-conversation-panel.tsx",
    );

    expect(draft).toContain("compact?: boolean");
    expect(draft).toContain('data-slot="draft-from-conversation"');
    expect(draft).toContain("<ActivityOrb");
    expect(draft).not.toContain("P4 ·");
    expect(draft).not.toContain("Ask → Ground → Draft");
  });
});
