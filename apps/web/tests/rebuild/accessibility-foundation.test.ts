import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

describe("P0 accessibility safeguards", () => {
  test("allows browser zoom instead of disabling it", () => {
    const layout = readSource("src/app/layout.tsx");

    expect(layout).toContain("userScalable: true");
    expect(layout).toContain("maximumScale: 5");
    expect(layout).not.toContain("userScalable: false");
  });

  test("provides at least 44px shared button targets", () => {
    const button = readSource("src/components/ui/button.tsx");

    expect(button).toContain("min-h-[44px]");
    expect(button).toContain("min-w-[44px]");
  });

  test("connects the mobile menu trigger to a labelled panel", () => {
    const menu = readSource("src/components/navigation/mobile-menu.tsx");

    expect(menu).toContain("aria-expanded={isOpen}");
    expect(menu).toContain("aria-controls={panelId}");
    expect(menu).toContain('aria-label="التنقل على الهاتف"');
    expect(menu).toContain('aria-label="إغلاق قائمة التنقل"');
  });

  test("labels the application navigation and mobile dismiss control", () => {
    const navigation = readSource("src/components/navigation/app-nav.tsx");

    expect(navigation).toContain('aria-label="التنقل الرئيسي"');
    expect(navigation).toContain('aria-label="إغلاق قائمة التنقل"');
    expect(navigation).toContain("aria-expanded={isOpen}");
  });

  test("marks decorative icons as hidden on primary rebuilt surfaces", () => {
    const rebuiltSurfaces = [
      readSource("src/app/(marketing)/page.tsx"),
      readSource("src/app/(app)/dashboard/page.tsx"),
      readSource("src/app/(auth)/login/page.tsx"),
    ].join("\n");

    expect(rebuiltSurfaces).toContain('aria-hidden="true"');
  });
});
