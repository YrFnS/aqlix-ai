import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");
const readRepoSource = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");

describe("UI P5 final quality pass", () => {
  test("installs a skip link, route announcer, and modal focus boundary", () => {
    const layout = readSource("src/app/layout.tsx");
    const runtime = readSource(
      "src/components/system/accessibility-runtime.tsx",
    );

    expect(layout).toContain("<AccessibilityRuntime />");
    expect(layout).toContain('import "./quality.css"');
    expect(layout).toContain('viewportFit: "cover"');
    expect(runtime).toContain('href="#main-content"');
    expect(runtime).toContain("تجاوز إلى المحتوى");
    expect(runtime).toContain('document.querySelector<HTMLElement>("main")');
    expect(runtime).toContain('role="status"');
    expect(runtime).toContain('aria-live="polite"');
    expect(runtime).toContain("new MutationObserver");
    expect(runtime).toContain("event.key !== \"Tab\"");
    expect(runtime).toContain('[role="dialog"][aria-modal="true"]');
    expect(runtime).toContain("restoreFocusRef");
    expect(runtime).toContain('dataset.appHydrated = "true"');
  });

  test("turns public mobile navigation into a modal focus boundary", () => {
    const mobileMenu = readSource("src/components/navigation/mobile-menu.tsx");

    expect(mobileMenu).toContain('role="dialog"');
    expect(mobileMenu).toContain('aria-modal="true"');
    expect(mobileMenu).toContain('aria-label="قائمة التنقل على الهاتف"');
    expect(mobileMenu).toContain('document.body.style.overflow = "hidden"');
    expect(mobileMenu).toContain("h-[100dvh]");
    expect(mobileMenu).toContain("safe-block-end");
    expect(mobileMenu).toContain("shouldReduceMotion");
    expect(mobileMenu).toContain("{ duration: 0 }");
  });

  test("adds mobile viewport, contrast, transparency, and forced-colour fallbacks", () => {
    const quality = readSource("src/app/quality.css");

    expect(quality).toContain("text-size-adjust: 100%");
    expect(quality).toContain("@supports (height: 100dvh)");
    expect(quality).toContain("env(safe-area-inset-bottom)");
    expect(quality).toContain("@media (prefers-reduced-transparency: reduce)");
    expect(quality).toContain("@media (prefers-contrast: more)");
    expect(quality).toContain("@media (forced-colors: active)");
    expect(quality).toContain("outline: 3px solid Highlight");
  });

  test("replaces legacy and phase-labelled failure surfaces", () => {
    const failureState = readSource("src/components/system/route-state.tsx");
    const failureSurfaces = [
      "src/app/error.tsx",
      "src/app/global-error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/sources/error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/drafts/error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/[conversationId]/not-found.tsx",
      "src/app/(app)/workspaces/[workspaceId]/sources/[attachmentId]/not-found.tsx",
      "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/not-found.tsx",
    ].map(readSource);

    expect(failureState).toContain("RouteFailureState");
    expect(failureState).toContain('role="alert"');
    expect(failureState).toContain("مرجع الخطأ");

    for (const source of failureSurfaces) {
      expect(source).toContain("RouteFailureState");
      expect(source).not.toMatch(/P[0-9]\s*[·–-]/u);
      expect(source).not.toMatch(/bg-blue|text-blue|bg-gray|text-gray|bg-red-100/u);
      expect(source).not.toContain("Something went wrong");
      expect(source).not.toContain("Application Error");
      expect(source).not.toContain("Missing or forbidden");
    }
  });

  test("uses one responsive loading language across primary work libraries", () => {
    const routeState = readSource("src/components/system/route-state.tsx");
    const loadingFiles = [
      "src/app/loading.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/loading.tsx",
      "src/app/(app)/workspaces/[workspaceId]/sources/loading.tsx",
      "src/app/(app)/workspaces/[workspaceId]/drafts/loading.tsx",
    ].map(readSource);

    expect(routeState).toContain("RouteLoadingState");
    expect(routeState).toContain('aria-busy="true"');
    expect(routeState).toContain("sm:grid-cols-2 xl:grid-cols-4");
    expect(routeState).toContain("skeleton");

    for (const source of loadingFiles) {
      expect(source).toContain("RouteLoadingState");
      expect(source).not.toContain("rounded-3xl border border-border/70 bg-card");
    }
  });

  test("keeps offline state visible, semantic, and safe-area aware", () => {
    const offline = readSource("src/components/system/offline-notice.tsx");

    expect(offline).toContain('data-network-status="offline"');
    expect(offline).toContain('aria-atomic="true"');
    expect(offline).toContain("env(safe-area-inset-bottom)");
    expect(offline).toContain("قبل افتراض");
    expect(offline).toContain("حفظ أو توليد جديد اكتمل");
    expect(offline).not.toContain("bg-foreground px-4 py-3 text-sm text-background");
  });

  test("defines a cross-viewport browser audit with durable artifacts", () => {
    const config = readSource("playwright.p5.config.ts");
    const browserAudit = readSource("tests/e2e/p5/ui-quality.spec.ts");

    expect(config).toContain('name: "p5-desktop-chromium"');
    expect(config).toContain('name: "p5-tablet-chromium"');
    expect(config).toContain('name: "p5-mobile-chromium"');
    expect(config).toContain('timezoneId: "Asia/Baghdad"');
    expect(config).toContain('outputDir: "test-results/p5/artifacts"');
    expect(config).toContain('outputFile: "test-results/p5/results.json"');

    expect(browserAudit).toContain("AxeBuilder");
    expect(browserAudit).toContain("expectNoHorizontalOverflow");
    expect(browserAudit).toContain("تجاوز إلى المحتوى");
    expect(browserAudit).toContain("قائمة التنقل على الهاتف");
    expect(browserAudit).toContain('reducedMotion: "reduce"');
    expect(browserAudit).toContain("longestAnimationMs");
  });

  test("defines isolated authenticated browser journeys for product, role, and BYOK flows", () => {
    const config = readSource("playwright.p5.authenticated.config.ts");
    const productJourney = readSource(
      "tests/e2e/p5/authenticated-product-journey.spec.ts",
    );
    const roleJourney = readSource(
      "tests/e2e/p5/role-matrix-journey.spec.ts",
    );
    const byokJourney = readSource(
      "tests/e2e/p5/openrouter-byok-journey.spec.ts",
    );
    const workflow = readRepoSource(
      ".github/workflows/ui-p5-authenticated-product.yml",
    );

    expect(config).toContain('name: "p5-authenticated-chromium"');
    expect(config).toContain('name: "p5-authenticated-firefox"');
    expect(config).toContain('name: "p5-authenticated-webkit"');
    expect(config).toContain('devices["Desktop Firefox"]');
    expect(config).toContain('devices["Desktop Safari"]');
    expect(config).toContain('timezoneId: "Asia/Baghdad"');
    expect(productJourney).toContain("استخدام مصادر مساحة العمل");
    expect(productJourney).toContain("معاينة المرجع");
    expect(productJourney).toContain("تطبيق كإصدار جديد");
    expect(productJourney).toContain("viewerPatch.status()).toBe(403)");
    expect(productJourney).toContain("outsiderApi.status()).toBe(404)");
    expect(productJourney).toContain("waitForHydration");
    expect(productJourney).not.toContain("grantPermissions");
    expect(roleJourney).toContain('role: "owner"');
    expect(roleJourney).toContain('role: "editor"');
    expect(roleJourney).toContain('role: "viewer"');
    expect(roleJourney).toContain("outsiderReadAttempt.status()).toBe(404)");
    expect(roleJourney).toContain("editorArchiveAttempt.status()).toBe(403)");
    expect(byokJourney).toContain("Free-tier key");
    expect(byokJourney).toContain("PROVIDER_UNCONFIGURED");
    expect(byokJourney).toContain("waitForHydration");
    expect(workflow).toContain(
      "playwright install --with-deps chromium firefox webkit",
    );
    expect(workflow).toContain("role-matrix-journey.spec.ts");
    expect(workflow).toContain("journey across all engines");
    expect(workflow).toContain("bunx supabase start");
    expect(workflow).toContain("p5_user_openrouter_settings.test.sql");
    expect(workflow).toContain("UI P5 Authenticated Success Gate");
  });
});
