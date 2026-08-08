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
  "src/app/(app)/dashboard/page.tsx",
  "src/app/(auth)/login/page.tsx",
  "src/components/navigation/marketing-nav.tsx",
  "src/components/navigation/app-nav.tsx",
  "src/app/components/footer.tsx",
]
  .map(readSource)
  .join("\n");

describe("rebuild brand and scope", () => {
  test("uses neutral bilingual product copy while the permanent name is pending", () => {
    expect(brand.name).toBe("AI Workspace");
    expect(brand.shortName).toBe("Workspace");
    expect(brand.category.length).toBeGreaterThan(10);
    expect(brand.categoryAr).toMatch(/[\u0600-\u06ff]/u);
    expect(brand.descriptionAr).toMatch(/[\u0600-\u06ff]/u);
    expect(brand.status).toBe("Product name pending");
    expect(brand.links.workspace).toBe("/workspaces");
  });

  test("does not expose retired or rejected product identities on primary surfaces", () => {
    expect(publicSurface).not.toMatch(/Iraqi AI Chat System/i);
    expect(publicSurface).not.toMatch(/Aqlix AI/i);
    expect(publicSurface).not.toMatch(/Kiteb/i);
  });

  test("does not publish unsupported readiness or compliance metrics", () => {
    const unsupportedClaims = [
      /bank-grade/i,
      /production[- ]ready/i,
      /verified Islamic compliance/i,
      /(?:85|95|99|100)%\+?/,
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

    expect(navigation).not.toMatch(/payment|workflow builder|medical|legal agent/i);
  });
});
