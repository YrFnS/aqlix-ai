import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OperationalRuntimeConfigurationError,
  parseOperationalRuntimeContract,
} from "../../src/lib/operations/runtime-contract";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");

const localEnvironment = {
  APP_ENV: "test",
  NEXT_PUBLIC_APP_ENV: "development",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "local-public-key",
  AI_PROVIDER: "fixture",
  P2_ALLOW_FIXTURE_PROVIDER: "true",
  READINESS_PROBE_DEPENDENCIES: "true",
  READINESS_TIMEOUT_MS: "1500",
} as const;

describe("P5 operational runtime contract", () => {
  test("accepts an explicitly authorized local test environment", () => {
    expect(parseOperationalRuntimeContract(localEnvironment)).toMatchObject({
      appEnvironment: "test",
      publicEnvironment: "development",
      releaseSha: null,
      provider: "fixture",
      probeDependencies: true,
      readinessTimeoutMs: 1500,
    });
  });

  test("rejects the fixture provider in staging", () => {
    expect(() =>
      parseOperationalRuntimeContract({
        ...localEnvironment,
        APP_ENV: "staging",
        NEXT_PUBLIC_APP_ENV: "staging",
        RELEASE_SHA: "abcdef1234567",
      }),
    ).toThrow(OperationalRuntimeConfigurationError);
  });

  test("requires a release identity and provider key in production-like environments", () => {
    try {
      parseOperationalRuntimeContract({
        APP_ENV: "production",
        NEXT_PUBLIC_APP_ENV: "production",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key",
        AI_PROVIDER: "openai",
      });
      throw new Error("Expected production configuration to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(OperationalRuntimeConfigurationError);
      expect(
        (error as OperationalRuntimeConfigurationError).issuePaths,
      ).toEqual(["openAiApiKey", "releaseSha"]);
    }
  });

  test("accepts a bounded production runtime contract", () => {
    expect(
      parseOperationalRuntimeContract({
        APP_ENV: "production",
        NEXT_PUBLIC_APP_ENV: "production",
        RELEASE_SHA: "abcdef1234567890",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co/",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key",
        AI_PROVIDER: "openai",
        OPENAI_API_KEY: "server-only-provider-key",
      }),
    ).toMatchObject({
      appEnvironment: "production",
      publicEnvironment: "production",
      releaseSha: "abcdef1234567890",
      supabaseUrl: "https://example.supabase.co",
      provider: "openai",
      probeDependencies: true,
      readinessTimeoutMs: 2000,
    });
  });
});

describe("P5 health and release boundaries", () => {
  test("ships separate liveness and readiness routes", () => {
    for (const path of [
      "src/app/api/health/live/route.ts",
      "src/app/api/health/ready/route.ts",
      "src/lib/operations/runtime-contract.ts",
      "src/lib/operations/readiness.ts",
    ]) {
      expect(existsSync(resolve(webRoot, path))).toBe(true);
    }
  });

  test("keeps liveness independent from database and provider dependencies", () => {
    const liveness = readWeb("src/app/api/health/live/route.ts");

    expect(liveness).toContain('status: "alive"');
    expect(liveness).toContain('service: "kiteb-web"');
    expect(liveness).not.toContain("Supabase");
    expect(liveness).not.toContain("OPENAI_API_KEY");
    expect(liveness).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("fails readiness closed without exposing secrets", () => {
    const readiness = readWeb("src/lib/operations/readiness.ts");
    const route = readWeb("src/app/api/health/ready/route.ts");

    expect(readiness).toContain("CONFIGURATION_INVALID");
    expect(readiness).toContain("SUPABASE_AUTH_UNREACHABLE");
    expect(readiness).toContain("/auth/v1/health");
    expect(route).toContain("readiness.ready ? 200 : 503");
    expect(route).not.toContain("supabaseAnonKey");
    expect(route).not.toContain("OPENAI_API_KEY");
    expect(route).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("defines the P5 topology, ownership, and release gates", () => {
    const architecture = readRepo(
      "docs/rebuild/12-P5-OPERATIONAL-READINESS.md",
    );

    expect(architecture).toContain("one stateless Next.js web service");
    expect(architecture).toContain("Hosted Supabase");
    expect(architecture).toContain("Release authority");
    expect(architecture).toContain("Incident authority");
    expect(architecture).toContain("Production ready: No");
  });

  test("exposes a Bun-only release path and focused fatal typecheck", () => {
    const webPackage = readWeb("package.json");
    const rootPackage = readRepo("package.json");
    const nextConfig = readWeb("next.config.ts");
    const preflight = readRepo(
      "scripts/operations/validate-runtime-env.ts",
    );

    expect(webPackage).toContain('"build:release": "next build"');
    expect(webPackage).toContain(
      '"start:release": "next start -H 0.0.0.0"',
    );
    expect(rootPackage).toContain('"build:release"');
    expect(rootPackage).toContain('"start:release"');
    expect(rootPackage).toContain('"validate:release-env"');
    expect(nextConfig).toContain('tsconfigPath: "tsconfig.rebuild.json"');
    expect(nextConfig).toContain("ignoreBuildErrors: false");
    expect(nextConfig).not.toContain("ignoreBuildErrors: true");
    expect(preflight).toContain("parseOperationalRuntimeContract");
    expect(preflight).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(rootPackage).not.toContain('"build:release": "npm');
    expect(rootPackage).not.toContain('"build:release": "yarn');
  });

  test("commits only a non-secret release environment template", () => {
    const template = readWeb(".env.release.example");

    expect(template).toContain("APP_ENV=staging");
    expect(template).toContain("RELEASE_SHA=");
    expect(template).toContain("READINESS_PROBE_DEPENDENCIES=true");
    expect(template).toContain("<server-only-openai-key>");
    expect(template).not.toMatch(/sk-[A-Za-z0-9_-]{20,}/u);
    expect(template).not.toContain("SUPABASE_SERVICE_ROLE_KEY=");
  });

  test("runs the release startup and health probe in CI", () => {
    const workflow = readRepo(
      ".github/workflows/p5-operational-baseline.yml",
    );

    expect(workflow).toContain("bun run validate:release-env");
    expect(workflow).toContain("bun run build:release");
    expect(workflow).toContain("bun run start:release");
    expect(workflow).toContain("/api/health/live");
    expect(workflow).toContain("/api/health/ready");
  });
});
