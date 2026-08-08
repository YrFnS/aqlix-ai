import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");

describe("P3 Storage object and retrieval integrity", () => {
  test("binds each private object to an exact registered attachment path", () => {
    const migration = readRepo(
      "supabase/migrations/202608080010_p3_storage_object_integrity.sql",
    );

    expect(migration).toContain("attachment_id_from_storage_path");
    expect(migration).toContain("attachment.storage_path = object_name");
    expect(migration).toContain("attachment.uploaded_by = auth.uid()");
    expect(migration).toContain("attachment.status = 'processing'");
    expect(migration).toContain("can_read_workspace_document_object");
    expect(migration).toContain("can_insert_workspace_document_object");
    expect(migration).toContain("can_delete_workspace_document_object");
    expect(migration).not.toContain("upsert = true");
  });

  test("normalizes Arabic-Latin boundaries in both indexed text and queries", () => {
    const indexMigration = readRepo(
      "supabase/migrations/202608080009_p3_mixed_script_search.sql",
    );
    const policyMigration = readRepo(
      "supabase/migrations/202608080010_p3_storage_object_integrity.sql",
    );

    expect(indexMigration).toContain("normalize_mixed_script_search_text");
    expect(indexMigration).toContain("([؀-ۿ])([A-Za-z0-9])");
    expect(policyMigration).toContain(
      "public.normalize_mixed_script_search_text(btrim(source_query))",
    );
  });

  test("ranks strict matches first while allowing broad natural questions", () => {
    const migration = readRepo(
      "supabase/migrations/202608080012_p3_ranked_broad_source_search.sql",
    );

    expect(migration).toContain("strict_query");
    expect(migration).toContain("broad_query");
    expect(migration).toContain("tsvector_to_array");
    expect(migration).toContain("string_agg(quote_literal(lexeme), ' | '");
    expect(migration).toContain("source.search_vector @@ broad_query");
    expect(migration).toContain("source.search_vector @@ strict_query");
    expect(migration).toContain("limit 24");
  });

  test("keeps Storage authorization in PostgreSQL policies rather than app claims", () => {
    const migration = readRepo(
      "supabase/migrations/202608080010_p3_storage_object_integrity.sql",
    );

    expect(migration).toContain("on storage.objects");
    expect(migration).toContain("to authenticated");
    expect(migration).toContain("public.is_workspace_member");
    expect(migration).toContain("public.has_workspace_role");
    expect(migration).toContain("public.is_workspace_active");
    expect(migration).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });
});
