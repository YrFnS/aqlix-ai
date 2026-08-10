import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("Tuppra repository and deployment identity", () => {
  test("deploys the current product from main", () => {
    const blueprint = readRepo("render.yaml");
    const buildScript = readRepo("scripts/render/build.sh");
    const releaseTemplate = readRepo("apps/web/.env.release.example");
    const supabaseConfig = readRepo("supabase/config.toml");

    expect(blueprint).toContain("name: tuppra-staging");
    expect(blueprint).toContain("branch: main");
    expect(blueprint).not.toContain("name: kiteb-staging");
    expect(blueprint).not.toContain("branch: develop");

    expect(buildScript).toContain("Building Tuppra release");
    expect(buildScript).not.toMatch(/Building\s+Kiteb/iu);

    expect(releaseTemplate).toContain(
      "NEXT_PUBLIC_API_URL=https://tuppra-staging.example.test",
    );
    expect(releaseTemplate).not.toMatch(/kiteb-staging/iu);

    expect(supabaseConfig).toContain('project_id = "tuppra-local"');
    expect(supabaseConfig).not.toMatch(/project_id\s*=\s*"kiteb/iu);
  });

  test("points package metadata at the current repository", () => {
    const rootPackage = JSON.parse(readRepo("package.json")) as {
      description?: string;
      author?: string;
      repository?: { url?: string };
    };
    const webPackage = JSON.parse(readRepo("apps/web/package.json")) as {
      description?: string;
      author?: string;
      repository?: { url?: string; directory?: string };
    };

    expect(rootPackage.description).toContain("Tuppra");
    expect(rootPackage.author).toBe("Tuppra");
    expect(rootPackage.repository?.url).toBe(
      "https://github.com/YrFnS/tuppra.git",
    );

    expect(webPackage.description).toContain("Tuppra");
    expect(webPackage.author).toBe("Tuppra");
    expect(webPackage.repository).toEqual({
      type: "git",
      url: "https://github.com/YrFnS/tuppra.git",
      directory: "apps/web",
    });

    const publicMetadata = [
      rootPackage.description,
      rootPackage.author,
      rootPackage.repository?.url,
      webPackage.description,
      webPackage.author,
      webPackage.repository?.url,
    ].join("\n");

    expect(publicMetadata).not.toMatch(/Aqlix|Kiteb/iu);
  });
});
