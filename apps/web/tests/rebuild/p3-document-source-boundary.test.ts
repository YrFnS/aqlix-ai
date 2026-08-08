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

describe("P3 private document source boundary", () => {
  test("ships the active source route graph", () => {
    for (const path of [
      "src/app/(app)/workspaces/[workspaceId]/sources/page.tsx",
      "src/app/(app)/workspaces/[workspaceId]/sources/[attachmentId]/page.tsx",
      "src/app/api/v1/workspaces/[workspaceId]/sources/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/sources/[attachmentId]/route.ts",
      "src/app/api/v1/workspaces/[workspaceId]/sources/[attachmentId]/download/route.ts",
      "src/components/documents/document-upload-form.tsx",
      "src/components/documents/document-delete-button.tsx",
      "src/lib/documents/processor.ts",
      "src/lib/documents/repository.ts",
    ]) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("keeps normal document traffic on the signed-in RLS client", () => {
    const collectionRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/sources/route.ts",
    );
    const itemRoute = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/sources/[attachmentId]/route.ts",
    );
    const repository = readWeb("src/lib/documents/repository.ts");

    expect(collectionRoute).toContain("requireApiUser");
    expect(itemRoute).toContain("requireApiUser");
    expect(repository).toContain("DOCUMENT_STORAGE_BUCKET");
    expect(repository).toContain('.from(DOCUMENT_STORAGE_BUCKET)');
    expect(repository).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(collectionRoute).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("uses a private bounded bucket and generated UUID paths", () => {
    const migration = readRepo(
      "supabase/migrations/202608080008_p3_document_sources.sql",
    );
    const config = readRepo("supabase/config.toml");

    expect(config).toContain("[storage]\nenabled = true");
    expect(config).toContain('file_size_limit = "2MiB"');
    expect(migration).toContain("'workspace-documents'");
    expect(migration).toContain("false,");
    expect(migration).toContain("generated_attachment_id::text");
    expect(migration).toContain("workspace_documents_select_member");
    expect(migration).toContain("workspace_documents_insert_editor");
    expect(migration).toContain("workspace_documents_delete_editor");
    expect(migration).not.toContain("create public bucket");
  });

  test("removes broad direct attachment and source mutations", () => {
    const migration = readRepo(
      "supabase/migrations/202608080008_p3_document_sources.sql",
    );

    expect(migration).toContain(
      "drop policy attachments_insert_editor on public.attachments",
    );
    expect(migration).toContain(
      "revoke insert, update, delete on public.attachments from authenticated",
    );
    expect(migration).toContain("begin_attachment_processing");
    expect(migration).toContain("finalize_attachment_processing");
    expect(migration).toContain("delete_attachment_record");
  });

  test("does not present unsupported PDF or OCR extraction as implemented", () => {
    const page = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/sources/page.tsx",
    );
    const processor = readWeb("src/lib/documents/processor.ts");
    const inheritedService = readRepo("apps/api/services/documents_service.py");

    expect(page).toContain("لا يدّعي دعم PDF أو OCR");
    expect(processor).toContain("Only UTF-8 text and Markdown");
    expect(processor).not.toContain("pdf");
    expect(processor).not.toContain("ocr");
    expect(inheritedService).toContain("In-memory storage for demo");
  });

  test("renders extracted content without raw HTML injection", () => {
    const detail = readWeb(
      "src/app/(app)/workspaces/[workspaceId]/sources/[attachmentId]/page.tsx",
    );

    expect(detail).toContain('dir="auto"');
    expect(detail).toContain("whitespace-pre-wrap");
    expect(detail).not.toContain("dangerouslySetInnerHTML");
    expect(detail).not.toContain("innerHTML");
  });
});
