import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { strongPasswordSchema } from "../../src/lib/auth/password-policy";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "../..");
const readWeb = (path: string) =>
  readFileSync(resolve(webRoot, path), "utf8").replaceAll("\r\n", "\n");
const readRepo = (path: string) =>
  readFileSync(resolve(repoRoot, path), "utf8").replaceAll("\r\n", "\n");

describe("account password and MFA hardening", () => {
  test("requires long complex non-common passwords for new accounts", () => {
    expect(
      strongPasswordSchema.safeParse("P5-MFA-Security-Test-2026!").success,
    ).toBe(true);

    for (const weakPassword of [
      "Password1!",
      "password123!",
      "AAAAAAAAAAAA!1a",
      "abcdefghijkl",
      "123456789012",
      "Tuppra123",
    ]) {
      expect(strongPasswordSchema.safeParse(weakPassword).success).toBe(false);
    }

    const policy = readWeb("src/lib/auth/password-policy.ts");
    const registration = readWeb("src/app/(auth)/register/page.tsx");
    const actions = readWeb("src/lib/auth/actions.ts");

    expect(policy).toContain("PASSWORD_MIN_LENGTH = 12");
    expect(policy).toContain("isLowEntropyPassword");
    expect(policy).toContain("Password is too common or predictable");
    expect(registration).toContain("passwordInputPattern");
    expect(registration).toContain("PASSWORD_MIN_LENGTH");
    expect(actions).toContain("password: strongPasswordSchema");
    expect(actions).toContain("signInPasswordSchema");
  });

  test("requires AAL2 only for accounts that enrolled a verified factor", () => {
    const actions = readWeb("src/lib/auth/actions.ts");
    const pageSession = readWeb("src/lib/auth/session.ts");
    const apiSession = readWeb("src/lib/api/auth.ts");
    const challengePage = readWeb("src/app/(auth)/mfa/page.tsx");

    for (const source of [actions, pageSession, apiSession]) {
      expect(source).toContain("getAuthenticatorAssuranceLevel");
      expect(source).toContain('nextLevel === "aal2"');
      expect(source).toContain("currentLevel !== assurance.nextLevel");
    }

    expect(challengePage).toContain("getAuthenticatorAssuranceLevel");
    expect(actions).toContain("mfaRedirect(nextPath)");
    expect(pageSession).toContain("mfaChallengePath(returnTo)");
    expect(apiSession).toContain('"MFA_REQUIRED"');
    expect(apiSession).toContain("status: 403");
    expect(challengePage).toContain('currentLevel === "aal2"');
    expect(challengePage).toContain('nextLevel !== "aal2"');
  });

  test("ships complete TOTP enrollment challenge and removal surfaces", () => {
    const settingsPage = readWeb(
      "src/app/(app)/settings/security/page.tsx",
    );
    const settingsClient = readWeb(
      "src/components/auth/mfa-security-settings-client.tsx",
    );
    const settings = readWeb(
      "src/components/auth/mfa-security-settings.tsx",
    );
    const challenge = readWeb(
      "src/components/auth/mfa-challenge-form.tsx",
    );
    const aiSettings = readWeb("src/app/(app)/settings/ai/page.tsx");

    expect(settingsPage).toContain('name="mfa-security-settings"');
    expect(settingsPage).toContain("MfaSecuritySettingsClient");
    expect(settingsClient).toContain("dynamic(");
    expect(settingsClient).toContain("ssr: false");
    expect(settings).toContain("supabase.auth.mfa.enroll");
    expect(settings).toContain("factorType: \"totp\"");
    expect(settings).toContain("challengeAndVerify");
    expect(settings).toContain("supabase.auth.mfa.unenroll");
    expect(settings).toContain('data-testid="mfa-enrollment-secret"');
    expect(challenge).toContain("useRef<SupabaseBrowserClient | null>");
    expect(challenge).toContain("client.auth.mfa.listFactors");
    expect(challenge).toContain("challengeAndVerify");
    expect(challenge).toContain('autoComplete="one-time-code"');
    expect(challenge).not.toContain("useMemo(() => createClient()");
    expect(aiSettings).toContain('href="/settings/security"');
  });

  test("runs the real TOTP lifecycle across Chromium Firefox and WebKit", () => {
    const spec = readWeb("tests/e2e/p5/mfa-security-journey.spec.ts");
    const config = readWeb("playwright.p5.authenticated.config.ts");
    const workflow = readRepo(".github/workflows/ui-p5-mfa-security.yml");

    expect(spec).toContain("createHmac");
    expect(spec).toContain("totpCode");
    expect(spec).toContain("mfa-enrollment-secret");
    expect(spec).toContain("تحقق وادخل");
    expect(spec).toContain("تمت إزالة وسيلة التحقق من الحساب");
    expect(config).toContain('name: "p5-authenticated-chromium"');
    expect(config).toContain('name: "p5-authenticated-firefox"');
    expect(config).toContain('name: "p5-authenticated-webkit"');
    expect(workflow).toContain(
      "playwright install --with-deps chromium firefox webkit",
    );
    expect(workflow).toContain("mfa-security-journey.spec.ts");
    expect(workflow).toContain("bunx supabase start");
  });

  test("keeps phone MFA and leaked-password claims honest", () => {
    const settingsPage = readWeb(
      "src/app/(app)/settings/security/page.tsx",
    );
    const settings = readWeb(
      "src/components/auth/mfa-security-settings.tsx",
    );

    expect(settingsPage).toContain("يحتاج مزوّد رسائل");
    expect(settingsPage).toContain("يحتاج خطة مدفوعة");
    expect(settings).toContain("WhatsApp");
    expect(settings).toContain("مزوّد رسائل منفصلاً");
    expect(settingsPage).not.toContain("فحص كلمات المرور المسرّبة مفعّل");
    expect(settings).not.toContain("phone: true");
  });
});
