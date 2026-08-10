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

describe("P5 AI resource-control boundary", () => {
  test("ships owner controls and a same-origin limits API", () => {
    for (const path of [
      "src/app/api/v1/workspaces/[workspaceId]/ai/limits/route.ts",
      "src/components/ai/workspace-ai-limits.tsx",
      "src/lib/ai/controlled-provider.ts",
      "src/lib/ai/controls.ts",
    ]) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("reserves workspace capacity before delegating to any provider", () => {
    const controlled = readWeb("src/lib/ai/controlled-provider.ts");
    const factory = readWeb("src/lib/ai/index.ts");

    expect(controlled).toContain("reserveAiGenerationPermit");
    expect(controlled.indexOf("reserveAiGenerationPermit")).toBeLessThan(
      controlled.indexOf("yield* this.delegate.stream(input)"),
    );
    expect(factory).toContain("new ControlledAiProvider");
    expect(factory).toContain("config.maxOutputTokens");
    expect(factory).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("enforces requests tokens concurrency and owner-only configuration in PostgreSQL", () => {
    const migration = readRepo(
      "supabase/migrations/202608080016_p5_ai_generation_controls.sql",
    );

    expect(migration).toContain("create table public.workspace_ai_limits");
    expect(migration).toContain("daily_request_limit integer");
    expect(migration).toContain("daily_input_token_limit integer");
    expect(migration).toContain("daily_output_token_limit integer");
    expect(migration).toContain("max_concurrent_generations integer");
    expect(migration).toContain("create table public.ai_generation_permits");
    expect(migration).toContain("PROVIDER_DISABLED");
    expect(migration).toContain("PROVIDER_CONCURRENCY_LIMIT");
    expect(migration).toContain("PROVIDER_BUDGET_EXCEEDED");
    expect(migration).toContain("array['owner']");
    expect(migration).toContain("array['owner', 'editor']");
    expect(migration).toContain("for update");
  });

  test("settles usage atomically from durable terminal generation state", () => {
    const settlement = readRepo(
      "supabase/migrations/202608080017_p5_ai_permit_settlement_triggers.sql",
    );
    const controls = readWeb("src/lib/ai/controls.ts");

    expect(settlement).toContain("message_generations_settle_ai_permit");
    expect(settlement).toContain("draft_generations_settle_ai_permit");
    expect(settlement).toContain("settle_ai_generation_permit_from_terminal");
    expect(settlement).toContain("permit.reserved_input_tokens");
    expect(settlement).toContain("permit.reserved_output_tokens");
    expect(controls).not.toContain("finishPermittedConversationGeneration");
    expect(controls).not.toContain("finishPermittedDraftGeneration");
  });

  test("turns an expired lease into an honest failed generation", () => {
    const expiry = readRepo(
      "supabase/migrations/202608080020_p5_ai_permit_expiry_recovery.sql",
    );

    expect(expiry).toContain("ai_generation_permits_fail_expired_target");
    expect(expiry).toContain("old.status <> 'reserved'");
    expect(expiry).toContain("new.status <> 'expired'");
    expect(expiry).toContain("failure_code = 'PROVIDER_TIMEOUT'");
    expect(expiry).toContain("message.status in ('pending', 'streaming')");
    expect(expiry).toContain("generation.status in ('pending', 'streaming')");
  });

  test("keeps limit reads member-visible and mutations owner-only", () => {
    const route = readWeb(
      "src/app/api/v1/workspaces/[workspaceId]/ai/limits/route.ts",
    );
    const panel = readWeb("src/components/ai/workspace-ai-limits.tsx");

    expect(route).toContain("requireApiUser");
    expect(route).toContain("getWorkspaceAccess");
    expect(route).toContain('access.role !== "owner"');
    expect(route).toContain("updateWorkspaceAiLimitsInputSchema");
    expect(route).toContain("Archived workspaces are read-only");
    expect(route).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(panel).toContain("Requests today");
    expect(panel).toContain("Input tokens today");
    expect(panel).toContain("Output tokens today");
    expect(panel).toContain("Active generations");
    expect(panel.replace(/\s+/g, " ")).toContain("Only the workspace owner");
  });

  test("runs a dedicated database lifecycle gate", () => {
    const workflow = readRepo(".github/workflows/p5-ai-controls.yml");

    expect(workflow).toContain("p5_ai_generation_controls.test.sql");
    expect(workflow).toContain("P5 AI Resource Controls Success Gate");
    expect(workflow).toContain("bunx supabase start");
    expect(workflow).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });
});
