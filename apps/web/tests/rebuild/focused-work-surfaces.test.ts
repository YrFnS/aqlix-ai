import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("focused work surfaces", () => {
  test("keeps the draft editor focused while progressively disclosing secondary tools", () => {
    const page = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/page.tsx",
    );
    const editor = readWeb("src/components/drafts/draft-editor.tsx");
    const controller = readWeb(
      "src/components/drafts/draft-editor-context.tsx",
    );
    const main = readWeb("src/components/drafts/draft-editor-main.tsx");
    const tools = readWeb("src/components/drafts/draft-tools-panel.tsx");
    const surface = [editor, controller, main, tools].join("\n");

    expect(page).toContain('max-w-[90rem]');
    expect(editor).toContain('xl:grid-cols-[minmax(0,1fr)_23rem]');
    expect(controller).toContain(
      "const visibleVersions = detail.versions.slice(0, 3)",
    );
    expect(controller).toContain(
      "const olderVersions = detail.versions.slice(3)",
    );
    expect(main).toContain("خيارات المسودة");
    expect(tools).toContain("المحادثة والمصادر");
    expect(tools).toContain("تصدير النسخة المحفوظة");
    expect(tools).toContain("حذف المسودة نهائياً");
    expect(surface).not.toContain('xl:grid-cols-[1.3fr_0.7fr]');
  });

  test("keeps AI connection simple and bounds the visible model catalog", () => {
    const page = readWeb("src/app/(app)/settings/ai/page.tsx");
    const settings = readWeb("src/components/ai/openrouter-settings.tsx");

    expect(page).toContain("خطوتان فقط");
    expect(settings).toContain("const INITIAL_MODEL_COUNT = 12");
    expect(settings).toContain(
      "const visibleModels = orderedModels.slice(0, visibleCount)",
    );
    expect(settings).toContain('xl:grid-cols-[20rem_minmax(0,1fr)]');
    expect(settings).toContain("التفاصيل والأسعار");
    expect(settings).toContain("عرض المزيد من النماذج");
    expect(settings).not.toContain("OpenRouter BYOK");
    expect(settings).not.toContain("Supabase Vault");
  });
});
