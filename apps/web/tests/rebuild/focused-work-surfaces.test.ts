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
    expect(editor).toContain(
      'min-[1800px]:grid-cols-[minmax(0,1fr)_23rem]',
    );
    expect(editor).not.toContain(
      'xl:grid-cols-[minmax(0,1fr)_23rem]',
    );
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

  test("keeps AI connection simple, Arabic-first, and visibly bounded", () => {
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
    expect(settings).toContain("مفتاح OpenRouter API");
    expect(settings).toContain("تحقق واتصل");
    expect(settings).toContain("النماذج المجانية فقط");
    expect(settings).not.toContain(">Validate and connect<");
    expect(settings).not.toContain(">Disconnect<");
    expect(settings).not.toContain(">Free only<");
    expect(settings).not.toContain(">Use model<");
    expect(settings).not.toContain("OpenRouter BYOK");
    expect(settings).not.toContain("Supabase Vault");
  });

  test("keeps draft conversion and source inspection free from phase and database internals", () => {
    const converter = readWeb(
      "src/components/drafts/draft-from-conversation-panel.tsx",
    );
    const sourceDetail = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/sources/[attachmentId]/page.tsx",
    );

    expect(converter).toContain("إجابة محفوظة → مسودة");
    expect(converter).toContain("تُحفظ المراجع المرتبطة مع المسودة");
    expect(converter).not.toMatch(/\bP4\b/u);
    expect(converter).not.toContain("حتمي");
    expect(converter).not.toContain("اتصالاً إضافياً بالمزود");

    expect(sourceDetail).toContain("التفاصيل التقنية وسجل المعالجة");
    expect(sourceDetail).toContain("خاص بمساحة العمل");
    expect(sourceDetail).not.toContain("PostgreSQL");
    expect(sourceDetail).not.toContain("offsets ");
  });
});
