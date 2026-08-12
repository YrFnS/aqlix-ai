import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

describe("web environment boundary", () => {
  test("does not validate runtime credentials while loading Next config", () => {
    const nextConfig = readSource("next.config.ts");

    expect(nextConfig).not.toContain('import "./src/config/env"');
    expect(nextConfig).not.toContain("API_SECRET_KEY");
    expect(nextConfig).not.toContain("LLM_API_KEY");
    expect(nextConfig).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("finalizes split Next builds before starting browser journeys", () => {
    const packageJson = JSON.parse(readSource("package.json")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.build).toBe(
      "next build --experimental-build-mode=compile && next build --experimental-build-mode=generate-env",
    );
  });

  test("keeps server secrets out of the public web configuration module", () => {
    const envModule = readSource("src/config/env.ts");

    expect(envModule).not.toContain("API_SECRET_KEY");
    expect(envModule).not.toContain("LLM_API_KEY");
    expect(envModule).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(envModule).not.toContain("ZAINCASH_API_KEY");
  });

  test("requires optional services only through explicit capability guards", () => {
    const envModule = readSource("src/config/env.ts");

    expect(envModule).toContain("requireSupabasePublicConfig");
    expect(envModule).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(envModule).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  });

  test("keeps deferred public capabilities disabled by default", () => {
    const envModule = readSource("src/config/env.ts");

    expect(envModule).toContain(
      'process.env.NEXT_PUBLIC_ENABLE_MULTIMODAL === "true"',
    );
    expect(envModule).toContain(
      'process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === "true"',
    );
  });
});
