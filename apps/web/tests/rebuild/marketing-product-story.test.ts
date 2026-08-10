import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("Tuppra marketing product story", () => {
  test("presents one outcome-led landing journey", () => {
    const page = readWeb("src/app/(marketing)/page.tsx");
    const preview = readWeb(
      "src/components/marketing/product-journey-preview.tsx",
    );
    const navigation = readWeb(
      "src/components/navigation/marketing-nav.tsx",
    );

    expect(page).toContain("من سؤال مبعثر إلى");
    expect(page).toContain("مسودة موثّقة");
    expect(page).toContain("ProductJourneyPreview");
    expect(page).toContain('id="how-it-works"');
    expect(page).toContain('id="why-tuppra"');
    expect(page).toContain('id="use-cases"');
    expect(page).toContain("Ask");
    expect(page).toContain("Ground");
    expect(page).toContain("Draft");
    expect(page).toContain("Continue");
    expect(page).not.toMatch(/rebuild|reset|P[0-5]/iu);

    expect(preview).toContain('aria-pressed={active}');
    expect(preview).toContain('data-preview-step={activeStage}');
    expect(preview).toContain('useState<JourneyStage["id"]>("ground")');
    expect(preview).toContain("قرار-المشروع.md");
    expect(preview).toContain("ملاحظات-الفريق.txt");
    expect(preview).not.toContain("setInterval");

    expect(navigation).toContain('/#how-it-works');
    expect(navigation).toContain('/#why-tuppra');
    expect(navigation).toContain('label: "الدليل"');
  });

  test("turns docs into a practical guide with honest support boundaries", () => {
    const guide = readWeb("src/app/docs/page.tsx");

    expect(guide).toContain("البدء السريع");
    expect(guide).toContain("اربط OpenRouter");
    expect(guide).toContain("أنشئ مساحة عمل");
    expect(guide).toContain("Ask → Ground → Draft → Continue");
    expect(guide).toContain("ملفات TXT وMarkdown");
    expect(guide).toContain("تصدير آخر إصدار محفوظ");
    expect(guide).toContain("استخراج PDF أو DOCX أو OCR");
    expect(guide).toContain("حل المشكلات");
    expect(guide).not.toMatch(/\bP[0-5]\b/u);
    expect(guide).not.toMatch(/PostgreSQL|\bRLS\b|Vault|BYOK/iu);
    expect(guide).not.toMatch(/Production ready|خطة المنتج/iu);
  });

  test("keeps the shared footer product-facing", () => {
    const footer = readWeb("src/app/components/footer.tsx");

    expect(footer).toContain("يوضح الدليل أنواع الملفات");
    expect(footer).toContain("Arabic-first bilingual AI workspace");
    expect(footer).not.toMatch(/rebuild|قيد المراجعة/iu);
  });
});
