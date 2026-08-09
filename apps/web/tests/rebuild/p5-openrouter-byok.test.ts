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

describe("P5 OpenRouter BYOK boundary", () => {
  test("ships the authenticated settings, catalog, and model routes", () => {
    for (const path of [
      "src/app/(app)/settings/ai/page.tsx",
      "src/app/api/v1/ai/settings/route.ts",
      "src/app/api/v1/ai/models/route.ts",
      "src/app/api/v1/ai/model/route.ts",
      "src/components/ai/openrouter-settings.tsx",
      "src/lib/ai/openrouter-client.ts",
      "src/lib/ai/openrouter-endpoint.ts",
      "src/lib/ai/openrouter-provider.ts",
      "src/lib/ai/user-settings.ts",
    ]) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("stores user credentials in Vault and exposes only masked settings", () => {
    const migration = readRepo(
      "supabase/migrations/202608080018_p5_user_openrouter_settings.sql",
    );
    const repository = readWeb("src/lib/ai/user-settings.ts");
    const settingsRoute = readWeb("src/app/api/v1/ai/settings/route.ts");
    const settingsUi = readWeb("src/components/ai/openrouter-settings.tsx");

    expect(migration).toContain(
      "create extension if not exists supabase_vault",
    );
    expect(migration).toContain("vault.create_secret");
    expect(migration).toContain("vault.update_secret");
    expect(migration).toContain("vault.decrypted_secrets");
    expect(migration).toContain("user_ai_settings_select_own");
    expect(migration).toContain(
      "revoke all on vault.decrypted_secrets from anon, authenticated",
    );
    expect(repository).toContain("keyLastFour");
    expect(repository).not.toContain("localStorage");
    expect(settingsRoute).toContain("saveUserOpenRouterCredential");
    expect(settingsRoute).not.toContain("jsonSuccess({ apiKey");
    expect(settingsRoute).not.toContain("console.log(parsed.data.apiKey");
    expect(settingsUi).toContain('type="password"');
    expect(settingsUi).not.toContain("localStorage");
    expect(settingsUi).not.toContain("sessionStorage");
  });

  test("loads the current user-filtered OpenRouter catalog live", () => {
    const client = readWeb("src/lib/ai/openrouter-client.ts");
    const route = readWeb("src/app/api/v1/ai/models/route.ts");
    const ui = readWeb("src/components/ai/openrouter-settings.tsx");

    expect(client).toContain('openRouterGet("/models/user", apiKey)');
    expect(client).toContain('cache: "no-store"');
    expect(client).toContain('model.outputModalities.includes("text")');
    expect(client).toContain('id.endsWith(":free")');
    expect(route).toContain("openRouterModelCatalogQuerySchema");
    expect(ui).toContain("Search by model name or ID");
    expect(ui).toContain("Free only");
    expect(ui).toContain("Validate and use");
  });

  test("validates an exact live model before persisting its ID", () => {
    const client = readWeb("src/lib/ai/openrouter-client.ts");
    const modelRoute = readWeb("src/app/api/v1/ai/model/route.ts");

    expect(client).toContain("candidate.id === modelId");
    expect(modelRoute).toContain("requireOpenRouterModel");
    expect(modelRoute).toContain("selectUserOpenRouterModel");
    expect(modelRoute).toContain("OPENROUTER_MODEL_UNAVAILABLE");
  });

  test("streams through the selected OpenRouter model without a fixed model name", () => {
    const config = readWeb("src/lib/ai/config.ts");
    const provider = readWeb("src/lib/ai/openrouter-provider.ts");
    const factory = readWeb("src/lib/ai/index.ts");

    expect(config).toContain('default("openrouter")');
    expect(config).toContain("resolveUserOpenRouterRuntime");
    expect(config).toContain("requestedModel: runtime.modelId");
    expect(provider).toContain("/chat/completions");
    expect(provider).toContain("model: this.requestedModel");
    expect(provider).toContain("stream: true");
    expect(factory).toContain("new OpenRouterChatProvider(config)");
    expect(config).not.toContain('default("gpt-');
    expect(provider).not.toContain('model: "');
  });

  test("allows a local fixture endpoint only outside staging and production", () => {
    const endpoint = readWeb("src/lib/ai/openrouter-endpoint.ts");
    const client = readWeb("src/lib/ai/openrouter-client.ts");

    expect(endpoint).toContain("https://openrouter.ai/api/v1");
    expect(endpoint).toContain('environment === "development"');
    expect(endpoint).toContain('environment === "test"');
    expect(endpoint).not.toContain('environment === "production" ||');
    expect(client).toContain("resolveOpenRouterBaseUrl");
  });

  test("deploys without a platform-owned model key or model ID", () => {
    const blueprint = readRepo("render.yaml");
    const releaseTemplate = readWeb(".env.release.example");
    const runtime = readWeb("src/lib/operations/runtime-contract.ts");

    expect(blueprint).toContain("key: AI_PROVIDER\n        value: openrouter");
    expect(blueprint).not.toContain("OPENAI_API_KEY");
    expect(blueprint).not.toContain("OPENAI_MODEL");
    expect(blueprint).not.toContain("OPENROUTER_API_KEY");
    expect(releaseTemplate).toContain("AI_PROVIDER=openrouter");
    expect(releaseTemplate).not.toContain("OPENAI_API_KEY=");
    expect(releaseTemplate).not.toContain("OPENROUTER_API_KEY=");
    expect(runtime).toContain(
      'provider: environment.AI_PROVIDER?.trim() || "openrouter"',
    );
  });
});
