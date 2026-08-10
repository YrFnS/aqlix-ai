import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const routeExists = (path: string) => existsSync(resolve(webRoot, path));

describe("active route scope", () => {
  test("keeps the legacy form demonstration out of the routable app", () => {
    expect(routeExists("src/app/examples/forms/page.tsx")).toBe(false);
  });

  test("keeps the manual error demonstration out of the routable app", () => {
    expect(routeExists("src/app/test-errors/page.tsx")).toBe(false);
  });
});
