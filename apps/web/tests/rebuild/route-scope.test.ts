import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

describe("active route scope", () => {
  test("quarantines legacy form demonstrations", () => {
    const route = readSource("src/app/examples/forms/page.tsx");

    expect(route).toContain('redirect("/dashboard")');
    expect(route).not.toContain("@/components/forms");
    expect(route).not.toContain("next/dynamic");
  });

  test("quarantines the manual error demonstration", () => {
    const route = readSource("src/app/test-errors/page.tsx");

    expect(route).toContain('redirect("/dashboard")');
    expect(route).not.toContain("useAsyncError");
    expect(route).not.toContain("ErrorBoundary");
  });
});
