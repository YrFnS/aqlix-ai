import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");

describe("UI P5 authenticated cross-engine readiness", () => {
  test("marks interactive route surfaces only after their client boundary mounts", () => {
    const boundary = readWeb(
      "src/components/system/client-ready-boundary.tsx",
    );
    const aiPage = readWeb("src/app/(app)/settings/ai/page.tsx");
    const conversationPage = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/conversations/[conversationId]/page.tsx",
    );
    const draftPage = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/page.tsx",
    );

    expect(boundary).toContain("useEffect");
    expect(boundary).toContain("setReady(true)");
    expect(boundary).toContain("data-client-surface");
    expect(boundary).toContain("data-client-ready");
    expect(aiPage).toContain(
      '<ClientReadyBoundary name="openrouter-settings">',
    );
    expect(conversationPage).toContain(
      '<ClientReadyBoundary name="conversation">',
    );
    expect(draftPage).toContain(
      '<ClientReadyBoundary name="draft-editor">',
    );
  });

  test("hands a newly created durable draft to a fresh document", () => {
    const conversion = readWeb(
      "src/components/drafts/draft-from-conversation-panel.tsx",
    );

    expect(conversion).toContain("window.location.assign(");
    expect(conversion).toContain(
      "`/workspaces/${workspaceId}/drafts/${draftId}?status=created`",
    );
    expect(conversion).not.toContain("useRouter");
    expect(conversion).not.toContain("router.push");
    expect(conversion).not.toContain("router.refresh();");
  });

  test("waits for route-owned readiness in both authenticated journeys", () => {
    const productJourney = readWeb(
      "tests/e2e/p5/authenticated-product-journey.spec.ts",
    );
    const byokJourney = readWeb(
      "tests/e2e/p5/openrouter-byok-journey.spec.ts",
    );

    for (const journey of [productJourney, byokJourney]) {
      expect(journey).toContain("waitForClientSurface");
      expect(journey).toContain("data-client-surface");
      expect(journey).toContain("data-client-ready");
    }

    expect(productJourney).toContain(
      'waitForClientSurface(page, "draft-editor")',
    );
    expect(productJourney).toContain(
      'waitForClientSurface(page, "conversation")',
    );
    expect(productJourney).not.toContain("grantPermissions");
    expect(byokJourney).toContain(
      'waitForClientSurface(page, "openrouter-settings")',
    );
    expect(byokJourney).toContain(
      'waitForClientSurface(page, "conversation")',
    );
  });

  test("synchronizes native file selection across browser event timing", () => {
    const upload = readWeb(
      "src/components/documents/document-upload-form.tsx",
    );

    expect(upload).toContain('input.addEventListener("input"');
    expect(upload).toContain('input.addEventListener("change"');
    expect(upload).toContain('input.removeEventListener("input"');
    expect(upload).toContain('input.removeEventListener("change"');
    expect(upload).toContain('inputRef.current.value = ""');
  });

  test("keeps all authenticated engines owned by a zero-retry fail-closed workflow", () => {
    const config = readWeb("playwright.p5.authenticated.config.ts");
    const workflow = readRepo(
      ".github/workflows/ui-p5-authenticated-product.yml",
    );

    expect(config).toContain("retries: 0");
    expect(config).toContain('name: "p5-authenticated-chromium"');
    expect(config).toContain('name: "p5-authenticated-firefox"');
    expect(config).toContain('name: "p5-authenticated-webkit"');
    expect(workflow).toContain(
      "playwright install --with-deps chromium firefox webkit",
    );
    expect(workflow).toContain("UI P5 Authenticated Success Gate");
  });
});
