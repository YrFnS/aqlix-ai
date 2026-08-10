import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const appRoot = resolve(webRoot, "src/app");
const marketingComponentRoot = resolve(webRoot, "src/components/marketing");

function collectNamedFiles(
  directory: string,
  predicate: (name: string) => boolean,
): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectNamedFiles(absolute, predicate);
    if (entry.isFile() && predicate(entry.name)) return [absolute];
    return [];
  });
}

const removedLegacyPages = [
  "src/app/(marketing)/about/page.tsx",
  "src/app/(marketing)/pricing/page.tsx",
  "src/app/(marketing)/contact/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/docs/[slug]/page.tsx",
  "src/app/(app)/profile/page.tsx",
  "src/app/(app)/settings/page.tsx",
  "src/app/test-fonts/page.tsx",
  "src/app/ui-test/page.tsx",
  "src/app/examples/forms/page.tsx",
  "src/app/test-errors/page.tsx",
] as const;

const sharedPublicFiles = [
  "src/components/navigation/marketing-nav.tsx",
  "src/app/components/footer.tsx",
  "src/config/brand.ts",
].map((path) => resolve(webRoot, path));

const retiredOrUnsupportedClaims = [
  /Iraqi AI Chat System/iu,
  /Aqlix AI/iu,
  /\bKiteb\b/iu,
  /Product rebuild|Product reset/iu,
  /إعادة بناء المنتج|خطة إعادة البناء|اسم المنتج النهائي قيد المراجعة/iu,
  /95%\+?\s+accuracy/iu,
  /SLA guarantees/iu,
  /Unlimited AI responses/iu,
  /verified Islamic compliance/iu,
  /ANTHROPIC_API_KEY/u,
  /contact@iraqiai\.com/iu,
  /\+964\s+XXX/iu,
  /POST\s+\/api\/chat/iu,
  /production[- ]ready/iu,
  /bank-grade/iu,
] as const;

describe("complete public route surface", () => {
  test("does not ship retired marketing, placeholder, or internal demo pages", () => {
    for (const page of removedLegacyPages) {
      expect(existsSync(resolve(webRoot, page)), page).toBe(false);
    }
  });

  test("scans routable pages and their shared marketing components", () => {
    const pageFiles = collectNamedFiles(appRoot, (name) => name === "page.tsx");
    const marketingComponents = collectNamedFiles(
      marketingComponentRoot,
      (name) => name.endsWith(".tsx"),
    );
    const publicFiles = [
      ...pageFiles,
      ...marketingComponents,
      ...sharedPublicFiles,
    ].sort();
    expect(pageFiles.length).toBeGreaterThan(0);
    expect(marketingComponents.length).toBeGreaterThan(0);

    const publicSurface = publicFiles
      .map((file) => {
        const label = relative(webRoot, file);
        return `\n/* ${label} */\n${readFileSync(file, "utf8")}`;
      })
      .join("\n");

    for (const claim of retiredOrUnsupportedClaims) {
      expect(publicSurface).not.toMatch(claim);
    }
  });
});
