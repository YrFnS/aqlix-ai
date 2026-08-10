import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

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
    const errors = [
      "src/app/error.tsx",
      "src/app/global-error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/conversations/error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/sources/error.tsx",
      "src/app/(app)/workspaces/[workspaceId]/drafts/error.tsx",
    ].map(readSource);

    expect(failureState).toContain("RouteFailureState");
    expect(failureState).toContain('role="alert"');
    expect(failureState).toContain("مرجع الخطأ");

    for (const source of errors) {
      expect(source).toContain("RouteFailureState");
      expect(source).not.toMatch(/P[0-9]\s*[·–-]/u);
      expect(source).not.toMatch(/bg-blue|text-blue|bg-gray|text-gray|bg-red-100/u);
      expect(source).not.toContain("Something went wrong");
      expect(source).not.toContain("Application Error");
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
});
