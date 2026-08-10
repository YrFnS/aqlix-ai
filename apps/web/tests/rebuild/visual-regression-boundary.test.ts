import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8").replaceAll("\r\n", "\n");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("desktop and mobile visual regression boundary", () => {
  test("ships a deterministic two-project Playwright configuration", () => {
    const config = readWeb("playwright.visual.config.ts");

    expect(config).toContain('name: "visual-desktop"');
    expect(config).toContain('name: "visual-mobile"');
    expect(config).toContain("deviceScaleFactor: 1");
    expect(config).toContain('colorScheme: "light"');
    expect(config).toContain('locale: "ar-IQ"');
    expect(config).toContain('timezoneId: "Asia/Baghdad"');
    expect(config).toContain('reducedMotion: "reduce"');
    expect(config).toContain("retries: 0");
    expect(config).toContain("maxDiffPixelRatio: 0.003");
    expect(config).toContain("{projectName}-{platform}");
  });

  test("captures the representative public and signed-in product journey", () => {
    const specPath = "tests/visual/primary-surfaces.visual.spec.ts";
    expect(existsSync(resolve(webRoot, specPath))).toBe(true);
    const spec = readWeb(specPath);

    for (const snapshot of [
      "home.png",
      "guide.png",
      "login.png",
      "workspaces.png",
      "workspace-detail.png",
      "source-detail.png",
      "conversation-detail.png",
      "draft-detail.png",
      "ai-settings.png",
    ]) {
      expect(spec).toContain(`capture(page, "${snapshot}")`);
    }

    expect(spec).toContain("animation-duration: 0s");
    expect(spec).toContain("transition-duration: 0s");
    expect(spec).toContain("document.fonts.ready");
    expect(spec).toContain("dynamicMasks(page)");
    expect(spec).toContain("Visual QA مساحة العمل");
    expect(spec).toContain("visual-launch-decision.md");
    expect(spec).toContain("استخدام مصادر مساحة العمل");
    expect(spec).not.toContain("Math.random");
    expect(spec).not.toContain("crypto.randomUUID");
  });

  test("runs one fail-closed visual workflow with baseline evidence", () => {
    const workflow = readRepo(".github/workflows/visual-regression.yml");
    const packageJson = readWeb("package.json");

    expect(workflow).toContain("Desktop & Mobile Visual Baselines");
    expect(workflow).toContain("playwright install chromium --with-deps");
    expect(workflow).toContain("bunx supabase start");
    expect(workflow).toContain("SUPABASE_SERVICE_ROLE_KEY=$ADMIN_KEY");
    expect(workflow).toContain("test:e2e:visual");
    expect(workflow).toContain("test:e2e:visual:update");
    expect(workflow).toContain("Visual Regression Success Gate");
    expect(workflow).toContain("apps/web/tests/visual/**/*-snapshots/*.png");
    expect(workflow).not.toContain("continue-on-error");

    expect(packageJson).toContain('"test:e2e:visual"');
    expect(packageJson).toContain('"test:e2e:visual:update"');
  });
});
