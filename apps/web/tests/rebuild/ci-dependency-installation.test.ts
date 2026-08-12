import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("CI dependency installation", () => {
  test("blocks dependency lifecycle scripts without disabling workspace scripts", () => {
    const packageJson = JSON.parse(readRepo("package.json")) as {
      trustedDependencies?: string[];
    };
    const installer = readRepo("scripts/ci/install-dependencies.sh");

    expect(packageJson.trustedDependencies).toEqual([]);
    expect(installer).toContain("bun install --frozen-lockfile");
    expect(installer).not.toContain("--ignore-scripts");
    expect(installer).toContain("install-supabase-cli.sh");
    expect(installer).toContain("supabase_cli_timeout_seconds=420");
    expect(installer).toContain("return $?");
    expect(installer).not.toContain(
      "node_modules/supabase/scripts/postinstall",
    );
  });

  test("installs the pinned Supabase CLI with retries and checksum verification", () => {
    const supabaseInstaller = readRepo(
      "scripts/ci/install-supabase-cli.sh",
    );

    expect(supabaseInstaller).toContain(
      'readonly package_json="${package_dir}/package.json"',
    );
    expect(supabaseInstaller).toContain(
      'readonly checksums_name="supabase_${version}_checksums.txt"',
    );
    expect(supabaseInstaller).toContain("--retry 8");
    expect(supabaseInstaller).toContain("--retry-all-errors");
    expect(supabaseInstaller).toContain("--proto '=https'");
    expect(supabaseInstaller).toContain("expected_checksum");
    expect(supabaseInstaller).toContain("actual_checksum");
    expect(supabaseInstaller).toContain("Checksum mismatch");
    expect(supabaseInstaller).toContain(
      'ln -sfn "../supabase/bin/${binary_name}" node_modules/.bin/supabase',
    );
    expect(supabaseInstaller).not.toContain(
      "Skipping checksum verification",
    );
  });
});
