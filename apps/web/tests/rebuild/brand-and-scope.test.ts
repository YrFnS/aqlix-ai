import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { brand } from "../../src/config/brand";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

const publicSurface = [
  "src/app/(marketing)/page.tsx",
  "src/app/docs/page.tsx",
  "src/app/(app)/dashboard/page.tsx",
  "src/app/(auth)/login/page.tsx",
  "src/components/marketing/product-journey-preview.tsx",
  "src/components/navigation/marketing-nav.tsx",
  "src/components/navigation/app-nav.tsx",
  "src/app/components/footer.tsx",
  "src/lib/documents/processor.ts",
]
  .map(readSource)
  .join("\n");

describe("Tuppra brand and public scope", () => {
  test("uses one bilingual Tuppra identity", () => {
    expect(brand.name).toBe("Tuppra");
    expect(brand.shortName).toBe("Tuppra");
    expect(brand.category.length).toBeGreaterThan(10);
    expect(brand.categoryAr).toMatch(/[\u0600-\u06ff]/u);
    expect(brand.descriptionAr).toMatch(/[\u0600-\u06ff]/u);
    expect(brand.links.workspace).toBe("/workspaces");
  });

  test("does not expose retired identities or rebuild language on primary surfaces", () => {
    expect(publicSurface).not.toMatch(/Iraqi AI Chat System/iu);
    expect(publicSurface).not.toMatch(/Aqlix AI/iu);
    expect(publicSurface).not.toMatch(/\bKiteb\b/iu);
    expect(publicSurface).not.toMatch(/Product rebuild|Product reset/iu);
    expect(publicSurface).not.toMatch(
      /إعادة بناء المنتج|خطة إعادة البناء|اسم المنتج النهائي قيد المراجعة/iu,
    );
  });

  test("does not publish unsupported readiness or compliance metrics", () => {
    const unsupportedClaims = [
      /bank-grade/iu,
      /production[- ]ready/iu,
      /verified Islamic compliance/iu,
      /(?:85|95|99|100)%\+?/u,
    ];

    for (const claim of unsupportedClaims) {
      expect(publicSurface).not.toMatch(claim);
    }
  });

  test("keeps deferred capabilities out of primary navigation", () => {
    const navigation = [
      readSource("src/components/navigation/marketing-nav.tsx"),
      readSource("src/components/navigation/app-nav.tsx"),
    ].join("\n");

    expect(navigation).not.toMatch(
      /payment|workflow builder|medical|legal agent/iu,
    );
  });
});
