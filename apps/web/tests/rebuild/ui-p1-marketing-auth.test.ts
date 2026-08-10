import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

describe("UI P1 marketing and authentication experience", () => {
  test("presents an interactive Ask, Ground, Draft product story", () => {
    const page = readSource("src/app/(marketing)/page.tsx");
    const preview = readSource(
      "src/components/marketing/workflow-preview.tsx",
    );

    expect(page).toContain("<WorkflowPreview />");
    expect(page).toContain('id="product"');
    expect(page).toContain('id="capabilities"');
    expect(page).toContain('id="principles"');
    expect(page).toContain("TXT وMarkdown");
    expect(page).not.toMatch(/\.pdf|PDF|OCR/u);
    expect(page).not.toContain("إعادة بناء المنتج");
    expect(page).not.toContain("Product reset");
    expect(page).not.toContain("قيد البناء");

    expect(preview).toContain("AnimatePresence");
    expect(preview).toContain("useReducedMotion");
    expect(preview).toContain("aria-pressed={isActive}");
    expect(preview).toContain('type="button"');
    expect(preview).not.toContain("repeat: Infinity");
  });

  test("uses one shared authentication shell without implementation labels", () => {
    const layout = readSource("src/app/(auth)/layout.tsx");
    const login = readSource("src/app/(auth)/login/page.tsx");
    const register = readSource("src/app/(auth)/register/page.tsx");
    const frame = readSource("src/components/auth/auth-frame.tsx");

    expect(layout).toContain("<BrandMark");
    expect(login).toContain("<AuthFrame");
    expect(register).toContain("<AuthFrame");
    expect(frame).toContain('data-auth-frame="true"');
    expect(frame).toContain("export function AuthNotice");
    expect(login).toContain('aria-label="نموذج تسجيل الدخول"');
    expect(register).toContain('aria-label="نموذج إنشاء الحساب"');
    expect(login).not.toContain("P1 · Account access");
    expect(register).not.toContain("P1 · Account access");
    expect(layout).not.toContain("Product rebuild in progress");
    expect(layout).not.toContain("اسم عمل مؤقت");
  });

  test("keeps navigation polished and accessible across viewport sizes", () => {
    const navigation = readSource(
      "src/components/navigation/marketing-nav.tsx",
    );
    const mobileMenu = readSource(
      "src/components/navigation/mobile-menu.tsx",
    );
    const footer = readSource("src/app/components/footer.tsx");

    expect(navigation).toContain('aria-label="التنقل الرئيسي"');
    expect(navigation).toContain("<BrandMark");
    expect(navigation).toContain('href: "/#capabilities"');
    expect(mobileMenu).toContain("AnimatePresence");
    expect(mobileMenu).toContain("useReducedMotion");
    expect(mobileMenu).toContain("aria-expanded={isOpen}");
    expect(mobileMenu).toContain('aria-label="التنقل على الهاتف"');
    expect(footer).toContain('aria-label="روابط تذييل الصفحة"');
    expect(footer).not.toContain("Product rebuild in progress");
  });
});
