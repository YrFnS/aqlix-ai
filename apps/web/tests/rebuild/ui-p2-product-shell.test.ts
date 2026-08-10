import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

describe("UI P2 authenticated product shell", () => {
  test("wraps authenticated routes in one adaptive shell", () => {
    const layout = readSource("src/app/(app)/layout.tsx");
    const shell = readSource("src/components/navigation/app-nav.tsx");

    expect(layout).toContain("<AppNav");
    expect(layout).toContain("{children}");
    expect(layout).not.toContain("<PageReveal");
    expect(shell).toContain('aria-label="شريط مساحة العمل"');
    expect(shell).toContain('aria-label="شريط أوامر التطبيق"');
    expect(shell).toContain('localStorage.getItem("tuppra:rail-collapsed")');
    expect(shell).toContain("setIsCollapsed((collapsed) => !collapsed)");
  });

  test("provides contextual workspace navigation without dead global routes", () => {
    const shell = readSource("src/components/navigation/app-nav.tsx");

    expect(shell).toContain('href: "/workspaces"');
    expect(shell).toContain('href: "/settings/ai"');
    expect(shell).toContain('href: "/docs"');
    expect(shell).toContain('suffix: "/conversations"');
    expect(shell).toContain('suffix: "/sources"');
    expect(shell).toContain('suffix: "/drafts"');
    expect(shell).toContain('suffix: "/settings"');
    expect(shell).toContain('aria-label="تنقل مساحة العمل"');
    expect(shell).not.toContain('href: "/chat"');
    expect(shell).not.toContain('href: "/sources"');
    expect(shell).not.toContain('href: "/drafts"');
  });

  test("ships a keyboard-accessible route command surface", () => {
    const shell = readSource("src/components/navigation/app-nav.tsx");

    expect(shell).toContain("event.metaKey || event.ctrlKey");
    expect(shell).toContain('event.key.toLocaleLowerCase() === "k"');
    expect(shell).toContain('aria-label="لوحة الانتقال"');
    expect(shell).toContain('aria-label="البحث في صفحات التطبيق"');
    expect(shell).toContain('aria-haspopup="dialog"');
    expect(shell).toContain('aria-modal="true"');
    expect(shell).toContain("router.push(first.href)");
  });

  test("uses a responsive sheet and explicit account menu semantics", () => {
    const shell = readSource("src/components/navigation/app-nav.tsx");

    expect(shell).toContain("<AnimatePresence>");
    expect(shell).toContain('aria-label="التنقل على الهاتف"');
    expect(shell).toContain('aria-label="إغلاق قائمة التنقل"');
    expect(shell).toContain("aria-expanded={isOpen}");
    expect(shell).toContain('aria-haspopup="menu"');
    expect(shell).toContain('role="menu"');
    expect(shell).toContain("form action={signOutAction}");
  });

  test("moves route transitions into the shell and respects reduced motion", () => {
    const shell = readSource("src/components/navigation/app-nav.tsx");

    expect(shell).toContain("useReducedMotion");
    expect(shell).toContain('mode="wait"');
    expect(shell).toContain("key={pathname}");
    expect(shell).toContain("shouldReduceMotion ? false");
    expect(shell).toContain("duration: 0");
    expect(shell).toContain("motionDurations.base");
  });

  test("marks active links and keeps implementation phases out of navigation", () => {
    const shell = readSource("src/components/navigation/app-nav.tsx");
    const navLink = readSource("src/components/navigation/nav-link.tsx");

    expect(navLink).toContain('aria-current={isActive ? "page" : undefined}');
    expect(shell).not.toContain("P1–P5");
    expect(shell).not.toContain("رحلة عمل محفوظة");
    expect(shell).not.toContain("Product rebuild");
  });
});
