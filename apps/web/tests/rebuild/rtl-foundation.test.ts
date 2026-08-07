import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getLocaleDirection,
  isArabicText,
} from "../../src/lib/utils/rtl";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

describe("active RTL foundation", () => {
  test("resolves common RTL and LTR locales", () => {
    expect(getLocaleDirection("ar-IQ")).toBe("rtl");
    expect(getLocaleDirection("fa-IR")).toBe("rtl");
    expect(getLocaleDirection("he-IL")).toBe("rtl");
    expect(getLocaleDirection("en-US")).toBe("ltr");
  });

  test("detects Arabic script in Arabic and mixed text", () => {
    expect(isArabicText("مرحبا")).toBe(true);
    expect(isArabicText("Kiteb مساحة عمل")).toBe(true);
    expect(isArabicText("Kiteb workspace")).toBe(false);
  });

  test("ships an Arabic RTL document default", () => {
    const layout = readSource("src/app/layout.tsx");

    expect(layout).toContain('lang="ar"');
    expect(layout).toContain('dir="rtl"');
    expect(layout).toContain("DirectionProvider");
    expect(layout).toContain("DirectionSync");
  });

  test("keeps dynamic direction synchronization in the active graph", () => {
    const provider = readSource(
      "src/components/providers/DirectionProvider.tsx",
    );
    const sync = readSource("src/components/providers/DirectionSync.tsx");

    expect(provider).toContain("getLocaleDirection");
    expect(provider).toContain("localStorage");
    expect(sync).toContain("document.documentElement");
  });
});
