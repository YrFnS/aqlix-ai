import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");
const readRepoSource = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8");

describe("UI experience P0 foundation", () => {
  test("owns the product tokens in one authoritative stylesheet", () => {
    const layout = readSource("src/app/layout.tsx");
    const globals = readSource("src/app/globals.css");
    const globalNotFound = readSource("src/app/global-not-found.tsx");
    const retiredRebuildStyles = readSource("src/app/rebuild.css");

    expect(layout).toContain('import "./globals.css"');
    expect(layout).not.toContain('import "./rebuild.css"');
    expect(globalNotFound).not.toContain('import "./rebuild.css"');
    expect(globals).toContain("--surface-canvas:");
    expect(globals).toContain("--surface-raised:");
    expect(globals).toContain("--radius-2xl:");
    expect(globals).toContain("--shadow-lg:");
    expect(globals).toContain("--motion-duration-base:");
    expect(retiredRebuildStyles).not.toContain("--background:");
  });

  test("loads explicit Latin and Arabic font variables", () => {
    const fonts = readSource("src/lib/fonts.ts");
    const layout = readSource("src/app/layout.tsx");
    const tailwind = readSource("tailwind.config.ts");

    expect(fonts).toContain("Inter");
    expect(fonts).toContain('variable: "--font-inter"');
    expect(layout).toContain("${inter.variable}");
    expect(tailwind).toContain('"var(--font-inter)"');
    expect(tailwind).toContain('"var(--font-noto-sans-arabic)"');
  });

  test("uses the current Motion package without legacy direct imports", () => {
    const provider = readSource("src/components/providers/MotionProvider.tsx");
    const primitives = readSource(
      "src/components/motion/motion-primitives.tsx",
    );
    const languageSwitcher = readSource(
      "src/components/language/LanguageSwitcher.tsx",
    );
    const motion = readSource("src/lib/motion.ts");
    const webPackage = readSource("package.json");
    const sharedUiPackage = readRepoSource("packages/ui/package.json");
    const lockfile = readRepoSource("bun.lock");

    expect(provider).toContain('from "motion/react"');
    expect(primitives).toContain('from "motion/react"');
    expect(languageSwitcher).toContain('from "motion/react"');
    expect(motion).toContain('from "motion/react"');
    expect(languageSwitcher).not.toContain('from "framer-motion"');
    expect(webPackage).toContain('"motion": "12.43.0"');
    expect(sharedUiPackage).toContain('"motion": "12.43.0"');
    expect(webPackage).not.toContain('"framer-motion"');
    expect(sharedUiPackage).not.toContain('"framer-motion"');
    expect(lockfile).toContain('"motion": ["motion@12.43.0"');
    expect(lockfile).not.toContain('framer-motion@10.18.0');
  });

  test("shares restrained motion defaults and respects user preferences", () => {
    const layout = readSource("src/app/layout.tsx");
    const provider = readSource("src/components/providers/MotionProvider.tsx");
    const motion = readSource("src/lib/motion.ts");
    const globals = readSource("src/app/globals.css");

    expect(layout).toContain("<MotionProvider>{children}</MotionProvider>");
    expect(layout).toContain('data-ui-foundation="p0"');
    expect(provider).toContain('reducedMotion="user"');
    expect(provider).toContain("motionTransition");
    expect(motion).toContain("motionSpring");
    expect(motion).toContain("staggerContainerVariants");
    expect(globals).toContain("@media (prefers-reduced-motion: reduce)");
  });

  test("provides reusable shell and surface primitives on real routes", () => {
    const shell = readSource("src/components/ui/page-shell.tsx");
    const surface = readSource("src/components/ui/surface.tsx");
    const loading = readSource("src/app/loading.tsx");
    const appLayout = readSource("src/app/(app)/layout.tsx");
    const appNavigation = readSource("src/components/navigation/app-nav.tsx");

    expect(shell).toContain('data-slot="page-shell"');
    expect(shell).toContain('data-slot="page-header"');
    expect(surface).toContain('data-slot="surface"');
    expect(surface).toContain("surfaceVariants");
    expect(loading).toContain("<PageShell");
    expect(loading).toContain("<Surface");
    expect(appLayout).toContain("<AppNav");
    expect(appNavigation).toContain("key={pathname}");
  });

  test("migrates representative workspace surfaces to the shared system", () => {
    const listPage = readSource("src/app/(app)/workspaces/page.tsx");
    const detailPage = readSource(
      "src/app/(app)/workspaces/[workspaceId]/page.tsx",
    );
    const card = readSource("src/components/workspaces/workspace-card.tsx");
    const notice = readSource(
      "src/components/workspaces/workspace-status-notice.tsx",
    );

    expect(listPage).toContain("<PageShell");
    expect(listPage).toContain("<PageHeader");
    expect(listPage).toContain("<PageSection");
    expect(listPage).toContain("<Surface");
    expect(listPage).toContain("<Stagger");
    expect(detailPage).toContain("<PageShell");
    expect(detailPage).toContain("<PageSection");
    expect(detailPage).toContain("<Surface");
    expect(detailPage).toContain("<Stagger");
    expect(card).toContain("<MotionSurface");
    expect(card).toContain("<Surface");
    expect(card).toContain("focus-visible:ring-ring/20");
    expect(notice).toContain("<Surface");
    expect(listPage).not.toContain("P1 ·");
    expect(detailPage).not.toContain("P2 + P3");
    expect(detailPage).not.toContain("P3 · يعمل");
    expect(detailPage).not.toContain("P4 · يعمل");
  });

  test("uses semantic focus and elevation tokens in shared buttons", () => {
    const button = readSource("src/components/ui/button.tsx");

    expect(button).toContain("focus-visible:ring-ring/20");
    expect(button).toContain("shadow-surface-xs");
    expect(button).not.toContain("focus-visible:ring-[#2E8B57]");
  });
});
