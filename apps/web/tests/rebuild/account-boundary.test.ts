import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

const deferredAccountRoutes = [
  "src/app/(auth)/register/page.tsx",
  "src/app/(auth)/password-reset/page.tsx",
  "src/app/(auth)/mfa-setup/page.tsx",
  "src/app/(auth)/verify-email/page.tsx",
  "src/app/auth/error/page.tsx",
]
  .map(readSource)
  .join("\n");

describe("P1 account boundary", () => {
  test("keeps deferred account routes on the honest status surface", () => {
    expect(deferredAccountRoutes).toContain('redirect("/login")');
    expect(deferredAccountRoutes).not.toContain("@/components/auth");
    expect(deferredAccountRoutes).not.toContain("@/lib/auth/actions");
  });

  test("quarantines the legacy confirmation callback", () => {
    const callback = readSource("src/app/auth/confirm/route.ts");

    expect(callback).toContain('new URL("/login", request.url)');
    expect(callback).not.toContain("@/lib/supabase/server");
    expect(callback).not.toContain("verifyOtp");
  });

  test("keeps P0 middleware free from unfinished auth dependencies", () => {
    const middleware = readSource("src/middleware.ts");

    expect(middleware).toContain("x-kiteb-product-phase");
    expect(middleware).toContain('"p0"');
    expect(middleware).not.toContain("@/lib/supabase/middleware");
    expect(middleware).not.toContain("createServerClient");
    expect(middleware).not.toContain("PROTECTED_ROUTES");
    expect(middleware).not.toContain("NEXT_PUBLIC_SUPABASE");
  });

  test("does not present account access as an implemented capability", () => {
    const login = readSource("src/app/(auth)/login/page.tsx");

    expect(login).toContain("P1 · Account boundary");
    expect(login).toContain("قيد إعادة البناء");
    expect(login).not.toContain("<LoginForm");
  });
});
