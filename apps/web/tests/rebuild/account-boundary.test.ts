import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readSource = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8");

const deferredAccountRoutes = [
  "src/app/(auth)/password-reset/page.tsx",
  "src/app/(auth)/mfa-setup/page.tsx",
  "src/app/(auth)/verify-email/page.tsx",
  "src/app/auth/error/page.tsx",
]
  .map(readSource)
  .join("\n");

describe("P1 account boundary", () => {
  test("keeps account capabilities outside P1 redirected to the active login route", () => {
    expect(deferredAccountRoutes).toContain('redirect("/login")');
    expect(deferredAccountRoutes).not.toContain("@/components/auth");
    expect(deferredAccountRoutes).not.toContain("@/lib/supabase/server");
  });

  test("activates one Supabase confirmation callback with safe return paths", () => {
    const callback = readSource("src/app/auth/confirm/route.ts");

    expect(callback).toContain("createActionClient");
    expect(callback).toContain("exchangeCodeForSession");
    expect(callback).toContain("verifyOtp");
    expect(callback).toContain('value.startsWith("//")');
    expect(callback).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("refreshes server sessions and protects the P1 application routes", () => {
    const middleware = readSource("src/middleware.ts");

    expect(middleware).toContain("x-ai-workspace-product-phase");
    expect(middleware).toContain('"p1"');
    expect(middleware).toContain("refreshSession");
    expect(middleware).toContain('"/workspaces"');
    expect(middleware).toContain('new URL("/login", request.url)');
    expect(middleware).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(middleware).not.toContain("createServerClient");
  });

  test("validates the user on the server instead of trusting a client identifier", () => {
    const session = readSource("src/lib/auth/session.ts");

    expect(session).toContain("supabase.auth.getUser()");
    expect(session).toContain("requireAuthenticatedUser");
    expect(session).not.toContain("getSession()");
    expect(session).not.toContain("userId:");
  });

  test("presents configured and unconfigured sign-in and registration states honestly", () => {
    const login = readSource("src/app/(auth)/login/page.tsx");
    const register = readSource("src/app/(auth)/register/page.tsx");
    const actions = readSource("src/lib/auth/actions.ts");

    expect(login).toContain("P1 · Account access");
    expect(register).toContain("P1 · Account access");
    expect(login).toContain("isSupabaseConfigured");
    expect(register).toContain("isSupabaseConfigured");
    expect(actions).toContain("signInWithPassword");
    expect(actions).toContain("auth.signUp");
    expect(actions).toContain("auth.signOut");
    expect(actions).toContain('value.startsWith("//")');
    expect(login).not.toContain("<LoginForm");
    expect(register).not.toContain("<RegisterForm");
  });
});
