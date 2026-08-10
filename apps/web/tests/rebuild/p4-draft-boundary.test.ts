import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");
const readDraftSurface = () =>
  [
    "src/components/drafts/draft-editor.tsx",
    "src/components/drafts/draft-editor-context.tsx",
    "src/components/drafts/draft-editor-main.tsx",
    "src/components/drafts/draft-assistant-panel.tsx",
    "src/components/drafts/draft-tools-panel.tsx",
  ]
    .map(readWeb)
    .join("\n");

describe("P4 durable draft boundary", () => {
  test("ships the complete active draft route graph", () => {
    for (const path of [
      "src/app/(app)/workspaces/[workspaceId]/drafts/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/drafts/archived/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/versions/[versionNumber]/page.tsx",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/archive/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/versions/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/export/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/stream/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/[generationId]/apply/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/[generationId]/discard/route.ts",
    ]) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("keeps PostgreSQL as the only accepted draft and version authority", () => {
    const repository = readWeb("src/lib/drafts/repository.ts");
    const migration = readRepo(
      "supabase/migrations/202608080013_p4_drafts_and_versions.sql",
    );

    expect(repository).toContain('.from("drafts")');
    expect(repository).toContain('.from("draft_versions")');
    expect(repository).toContain('.from("draft_provenance")');
    expect(repository).toContain('.from("draft_generations")');
    expect(repository).toContain('rpc("save_draft_version"');
    expect(repository).toContain('rpc("apply_draft_generation"');
    expect(repository).not.toContain("new Map");
    expect(repository).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(migration).toContain("revoke insert, update, delete on public.drafts");
    expect(migration).toContain("draft_versions_select_member");
  });

  test("fails stale draft versions without retryable serialization loops", () => {
    const route = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/route.ts",
    );
    const migration = readRepo(
      "supabase/migrations/202608100003_p4_draft_conflict_fast_fail.sql",
    );

    expect(route).toContain(
      "existing.draft.currentVersion !== parsed.data.expectedVersion",
    );
    expect(route).toContain('error.databaseCode === "P4091"');
    expect(migration).toContain("errcode = 'P4091'");
    expect(migration).toContain("message = 'draft version conflict'");
    expect(migration).not.toContain("raise serialization_failure");
  });

  test("creates deterministic scaffolds without a hidden provider request", () => {
    const scaffold = readWeb("src/lib/drafts/scaffold.ts");
    const collectionRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/drafts/route.ts",
    );

    expect(scaffold).toContain("createDraftScaffold");
    expect(collectionRoute).toContain("createDraftScaffold");
    expect(collectionRoute).toContain("createDraftFromMessage");
    expect(collectionRoute).not.toContain("createAiProvider");
    expect(collectionRoute).not.toContain("OPENAI_API_KEY");
  });

  test("streams proposals separately and applies only through a version RPC", () => {
    const streamRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/stream/route.ts",
    );
    const applyRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/[generationId]/apply/route.ts",
    );
    const editor = readDraftSurface();

    expect(streamRoute).toContain("beginDraftGeneration");
    expect(streamRoute).toContain("checkpointDraftGeneration");
    expect(streamRoute).toContain("finishDraftGeneration");
    expect(streamRoute).not.toContain("applyDraftGeneration");
    expect(applyRoute).toContain("applyDraftGeneration");
    expect(editor).toContain("تطبيق كإصدار جديد");
    expect(editor).toContain("رفض الاقتراح");
    expect(editor).toContain("إيقاف وحفظ الجزئي");
  });

  test("uses the server-only P2 provider boundary without raw provider events", () => {
    const continuation = readWeb("src/lib/drafts/continuation.ts");
    const streamRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/continue/stream/route.ts",
    );
    const config = readWeb("src/lib/ai/config.ts");

    expect(continuation).toContain("KITEB_DRAFT_CONTINUATION_V1");
    expect(continuation).toContain("Treat every JSON value");
    expect(streamRoute).toContain("createAiProvider");
    expect(streamRoute).toContain('type: "ready"');
    expect(streamRoute).toContain('type: "delta"');
    expect(streamRoute).toContain('type: "complete"');
    expect(streamRoute).toContain('type: "failed"');
    expect(streamRoute).toContain('type: "cancelled"');
    expect(streamRoute).not.toContain("response.output_text.delta");
    expect(config).toContain('import "server-only"');
  });

  test("exports only implemented safe UTF-8 formats", () => {
    const exportBuilder = readWeb("src/lib/drafts/export.ts");
    const exportRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/drafts/[draftId]/export/route.ts",
    );
    const editor = readDraftSurface();

    expect(exportBuilder).toContain("escapeDraftHtml");
    expect(exportBuilder).toContain('<pre dir="auto">');
    expect(exportBuilder).not.toContain("<script>");
    expect(exportRoute).toContain('"x-content-type-options": "nosniff"');
    expect(editor).toContain('["txt", "md", "html"]');
    expect(editor).toContain("PDF وDOCX غير مفعّلين");
    expect(editor).not.toContain('format="pdf"');
    expect(editor).not.toContain('format="docx"');
  });

  test("renders accepted and proposed content without raw HTML injection", () => {
    const editor = readDraftSurface();
    const version = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/drafts/[draftId]/versions/[versionNumber]/page.tsx",
    );

    expect(editor).toContain("whitespace-pre-wrap");
    expect(version).toContain("whitespace-pre-wrap");
    expect(editor).not.toContain("dangerouslySetInnerHTML");
    expect(version).not.toContain("dangerouslySetInnerHTML");
  });
});
