import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("bilingual typography system", () => {
  test("wires loaded fonts to the variables consumed by Tailwind", () => {
    const fonts = readSource("src/lib/fonts.ts");
    const layout = readSource("src/app/layout.tsx");
    const tailwind = readSource("tailwind.config.ts");
    const rebuildCss = readSource("src/app/rebuild.css");

    expect(fonts).toContain("Inter");
    expect(fonts).toContain('variable: "--font-arabic-primary"');
    expect(fonts).toContain('variable: "--font-arabic-heading"');
    expect(fonts).toContain('variable: "--font-arabic-formal"');
    expect(fonts).toContain('variable: "--font-inter"');

    expect(tailwind).toContain('"var(--font-arabic-primary)"');
    expect(tailwind).toContain('"var(--font-arabic-heading)"');
    expect(tailwind).toContain('"var(--font-arabic-formal)"');
    expect(tailwind).toContain('"var(--font-inter)"');

    expect(layout).toContain("inter.variable");
    expect(layout).toContain("font-arabic");
    expect(rebuildCss).toContain('[dir="ltr"]');
    expect(rebuildCss).toContain("var(--font-inter)");
  });
});

describe("primary authenticated shell copy", () => {
  test("describes user work instead of implementation phases", () => {
    const navigation = readSource("src/components/navigation/app-nav.tsx");
    const workspaces = readSource("src/app/(app)/workspaces/page.tsx");
    const workspaceDetail = readSource(
      "src/app/(app)/workspaces/[workspaceId]/page.tsx",
    );
    const conversations = readSource(
      "src/app/(app)/workspaces/[workspaceId]/conversations/page.tsx",
    );
    const conversationShell = readSource(
      "src/components/conversations/conversation-shell.tsx",
    );
    const sources = readSource(
      "src/app/(app)/workspaces/[workspaceId]/sources/page.tsx",
    );
    const drafts = readSource(
      "src/app/(app)/workspaces/[workspaceId]/drafts/page.tsx",
    );
    const aiSettings = readSource("src/app/(app)/settings/ai/page.tsx");
    const primaryShell = [
      navigation,
      workspaces,
      workspaceDetail,
      conversations,
      conversationShell,
      sources,
      drafts,
      aiSettings,
    ].join("\n");

    expect(navigation).toContain("من السؤال إلى العمل");
    expect(navigation).toContain("ابدأ بمحادثة");
    expect(navigation).toContain('label: "الدليل"');

    expect(workspaces).toContain("مساحاتك، في مكان واحد");
    expect(workspaces).toContain("اجمع محادثاتك ومصادرك ومسوداتك");
    expect(workspaces).toContain("تبقى المساحة خاصة بحسابك");

    expect(workspaceDetail).toContain("اسأل، استند إلى مصادرك، ثم اكتب");
    expect(workspaceDetail).toContain("حوّل الإجابة إلى عمل");
    expect(conversations).toContain("اسأل، تابع، وارجع إلى إجاباتك");
    expect(conversationShell).toContain("ابدأ محادثتك");
    expect(conversationShell).toContain("استخدام مصادر مساحة العمل");
    expect(sources).toContain("أضف السياق الذي تريد الرجوع إليه");
    expect(drafts).toContain("حوّل الإجابات إلى عمل قابل للاستخدام");
    expect(aiSettings).toContain("اختر كيف تتصل بالنماذج");

    expect(primaryShell).not.toMatch(/\bP[0-5]\b/u);
    expect(primaryShell).not.toMatch(/PostgreSQL|\bRLS\b/iu);
    expect(primaryShell).not.toMatch(/قاعدة البيانات|معاملة قاعدة/iu);
    expect(primaryShell).not.toMatch(/UTF-8|\bBYOK\b|Vault/iu);
    expect(primaryShell).not.toMatch(/Private bucket|immutable versions|provenance/iu);
    expect(primaryShell).not.toMatch(/بانتظار المزود|حالة التوليد/iu);
    expect(primaryShell).not.toMatch(/جاهزية تشغيلية|إطلاق عام/iu);
  });
});
