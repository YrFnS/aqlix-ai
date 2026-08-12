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

describe("account boundary", () => {
  test("keeps deferred account capabilities redirected to the active login route", () => {
    expect(deferredAccountRoutes).toContain('redirect("/login")');
    expect(deferredAccountRoutes).not.toContain("@/components/auth");
    expect(deferredAccountRoutes).not.toContain("@/lib/supabase/server");
  });

  test("activates one Supabase confirmation callback with safe return paths", () => {
    const callback = readSource("src/app/auth/confirm/route.ts");
    const redirects = readSource("src/lib/auth/redirects.ts");

    expect(callback).toContain("createActionClient");
    expect(callback).toContain("exchangeCodeForSession");
    expect(callback).toContain("verifyOtp");
    expect(callback).toContain("getSafeNextPath");
    expect(callback).toContain("getTrustedAppOrigin");
    expect(redirects).toContain(
      "candidate.origin !== SAFE_REDIRECT_ORIGIN",
    );
    expect(redirects).toContain("return DEFAULT_NEXT_PATH");
    expect(callback).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("refreshes server sessions and protects application routes without phase headers", () => {
    const middleware = readSource("src/middleware.ts");

    expect(middleware).toContain("x-ai-workspace-auth-state");
    expect(middleware).not.toContain("x-ai-workspace-product-phase");
    expect(middleware).not.toContain('"p1"');
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

  test("presents configured and unconfigured account states honestly", () => {
    const layout = readSource("src/app/(auth)/layout.tsx");
    const login = readSource("src/app/(auth)/login/page.tsx");
    const register = readSource("src/app/(auth)/register/page.tsx");
    const authFrame = readSource("src/components/auth/auth-frame.tsx");
    const actions = readSource("src/lib/auth/actions.ts");
    const redirects = readSource("src/lib/auth/redirects.ts");
    const accountSurface = `${layout}\n${login}\n${register}`;

    expect(login).toContain("<AuthFrame");
    expect(register).toContain("<AuthFrame");
    expect(authFrame).toContain('data-auth-frame="true"');
    expect(login).toContain("مرحباً بعودتك");
    expect(register).toContain("ابدأ مساحة عملك");
    expect(layout).toContain("مساحة عمل عربية أولاً");
    expect(login).toContain("isSupabaseConfigured");
    expect(register).toContain("isSupabaseConfigured");
    expect(login).toContain("<AuthNotice");
    expect(register).toContain("<AuthNotice");
    expect(actions).toContain("signInWithPassword");
    expect(actions).toContain("auth.signUp");
    expect(actions).toContain("auth.signOut");
    expect(actions).toContain("getSafeNextPath");
    expect(actions).toContain("buildTrustedAppUrl");
    expect(actions).not.toContain("x-forwarded-host");
    expect(redirects).toContain(
      "candidate.origin !== SAFE_REDIRECT_ORIGIN",
    );
    expect(login).not.toContain("<LoginForm");
    expect(register).not.toContain("<RegisterForm");

    expect(accountSurface).not.toContain("P1 · Account access");
    expect(accountSurface).not.toContain("Product rebuild in progress");
    expect(accountSurface).not.toContain("اسم عمل مؤقت");
    expect(accountSurface).not.toContain("متغيري Supabase");
    expect(accountSurface).not.toContain("صلاحيات الوصول من قاعدة البيانات");
  });
});
