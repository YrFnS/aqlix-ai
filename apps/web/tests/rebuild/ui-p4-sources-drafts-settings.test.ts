import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("UI P4 sources, drafts, and settings experience", () => {
  test("ships focused source and draft workspace components", () => {
    for (const path of [
      "src/components/documents/document-workspace.tsx",
      "src/components/drafts/draft-workspace-frame.tsx",
      "src/components/drafts/draft-editor.tsx",
    ]) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }

    const sourceDetail = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/sources/[attachmentId]/page.tsx",
    );
    const draftDetail = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/page.tsx",
    );

    expect(sourceDetail).toContain("<DocumentWorkspace");
    expect(draftDetail).toContain("<DraftEditor");
    expect(sourceDetail).not.toContain("bg-foreground p-6");
    expect(draftDetail).not.toContain("bg-foreground p-6");
  });

  test("turns source discovery into a searchable document library", () => {
    const page = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/sources/page.tsx",
    );
    const upload = readWeb(
      "src/components/documents/document-upload-form.tsx",
    );

    expect(page).toContain("<PageShell");
    expect(page).toContain("<PageHeader");
    expect(page).toContain("<PageSection");
    expect(page).toContain("<SearchResultCard");
    expect(page).toContain("<DocumentCard");
    expect(page).toContain('name="q"');
    expect(page).toContain("الملف خاص بهذه المساحة");
    expect(page).toContain("دعم PDF وOCR غير متاح حالياً");
    expect(upload).toContain("onDrop={handleDrop}");
    expect(upload).toContain('<ActivityOrb state="working"');
    expect(page).not.toContain("P3 ·");
  });

  test("provides passage navigation, safe reading, and contextual metadata", () => {
    const workspace = readWeb(
      "src/components/documents/document-workspace.tsx",
    );

    expect(workspace).toContain('aria-label="مقاطع المستند"');
    expect(workspace).toContain('aria-label="بيانات المستند"');
    expect(workspace).toContain('role="dialog"');
    expect(workspace).toContain("window.location.hash");
    expect(workspace).toContain("navigator.clipboard.writeText");
    expect(workspace).toContain("whitespace-pre-wrap");
    expect(workspace).toContain("DocumentDeleteButton");
    expect(workspace).not.toContain("dangerouslySetInnerHTML");
  });

  test("makes draft libraries searchable and cards fully interactive", () => {
    const active = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/drafts/page.tsx",
    );
    const archived = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/drafts/archived/page.tsx",
    );
    const card = readWeb("src/components/drafts/draft-card.tsx");

    expect(active).toContain("<PageShell");
    expect(active).toContain('name="q"');
    expect(active).toContain("versionCount");
    expect(active).toContain("provenanceCount");
    expect(archived).toContain('name="q"');
    expect(card).toContain("<MotionSurface");
    expect(card).toContain('aria-label={`فتح المسودة');
    expect(active).not.toContain("P4 ·");
    expect(archived).not.toContain("P4 ·");
  });

  test("separates accepted editing, immutable versions, and proposal review", () => {
    const frame = readWeb(
      "src/components/drafts/draft-workspace-frame.tsx",
    );
    const editor = readWeb("src/components/drafts/draft-editor.tsx");

    expect(frame).toContain('aria-label="سجل إصدارات المسودة"');
    expect(frame).toContain('aria-label="تفاصيل المسودة"');
    expect(frame).toContain('role="dialog"');
    expect(editor).toContain('type ViewMode = "editor" | "proposal"');
    expect(editor).toContain("DraftWorkspaceFrame");
    expect(editor).toContain("العمل المقبول");
    expect(editor).toContain("المقترح");
    expect(editor).toContain('<ActivityOrb state="shaping"');
    expect(editor).toContain("تطبيق كإصدار جديد");
    expect(editor).toContain("رفض الاقتراح");
    expect(editor).toContain("restoreVersion");
    expect(editor).toContain("Ctrl/Cmd+S");
  });

  test("presents AI connection and live model choice as one clear flow", () => {
    const page = readWeb("src/app/(app)/settings/ai/page.tsx");
    const settings = readWeb(
      "src/components/ai/openrouter-settings.tsx",
    );

    expect(page).toContain("<PageShell");
    expect(page).toContain("<PageHeader");
    expect(settings).toContain('type="password"');
    expect(settings).toContain("إعدادات OpenRouter");
    expect(settings).toContain('aria-label="Search OpenRouter models"');
    expect(settings).toContain('aria-label="Free only"');
    expect(settings).toContain('aria-label="Validate and use"');
    expect(settings).toContain("النماذج المجانية فقط");
    expect(settings).toContain("currentModel");
    expect(settings).toContain('<ActivityOrb state="searching"');
    expect(settings).not.toContain("localStorage");
    expect(settings).not.toContain("sessionStorage");
    expect(page).not.toContain("P5 ·");
  });
});
