import { createHmac } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

const password = "P5-MFA-Security-Test-2026!";
const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function uniqueEmail(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}@example.test`;
}

function decodeBase32(value: string): Buffer {
  const normalized = value
    .toUpperCase()
    .replace(/=+$/u, "")
    .replace(/[^A-Z2-7]/gu, "");
  let bits = "";

  for (const character of normalized) {
    const index = base32Alphabet.indexOf(character);
    if (index < 0) throw new Error("Invalid Base32 TOTP secret.");
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let position = 0; position + 8 <= bits.length; position += 8) {
    bytes.push(Number.parseInt(bits.slice(position, position + 8), 2));
  }

  return Buffer.from(bytes);
}

function totpCode(secret: string, stepOffset = 0): string {
  const counter = BigInt(Math.floor(Date.now() / 30_000) + stepOffset);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(counter);

  const digest = createHmac("sha1", decodeBase32(secret))
    .update(counterBuffer)
    .digest();
  const offset = digest[digest.length - 1]! & 0x0f;
  const binary =
    ((digest[offset]! & 0x7f) << 24) |
    ((digest[offset + 1]! & 0xff) << 16) |
    ((digest[offset + 2]! & 0xff) << 8) |
    (digest[offset + 3]! & 0xff);

  return String(binary % 1_000_000).padStart(6, "0");
}

async function waitForClientSurface(page: Page, name: string): Promise<void> {
  await expect(
    page
      .locator(
        `[data-client-surface="${name}"][data-client-ready="true"]`,
      )
      .last(),
  ).toHaveAttribute("data-client-ready", "true");
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
}

async function signOut(page: Page): Promise<void> {
  await page.getByRole("button", { name: "فتح قائمة الحساب" }).click();
  await page.getByRole("menuitem", { name: "تسجيل الخروج" }).click();
  await expect(page).toHaveURL(/\/login\?status=signed-out$/);
}

async function signIn(page: Page, email: string): Promise<void> {
  await page.goto("/login?next=%2Fworkspaces");
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
}

test("enrolls TOTP, requires AAL2 after sign-in, and removes the factor", async ({
  page,
}) => {
  const email = uniqueEmail("p5-mfa-owner");

  await register(page, email);
  await page.goto("/settings/security");
  await waitForClientSurface(page, "mfa-security-settings");

  await page.getByLabel("اسم الوسيلة").fill("P5 Browser Authenticator");
  await page.getByRole("button", { name: "إضافة تطبيق" }).click();

  const secretLocator = page.locator(
    '[data-testid="mfa-enrollment-secret"]',
  );
  await expect(secretLocator).toBeVisible();
  const secret = (await secretLocator.textContent())?.trim();
  expect(secret).toBeTruthy();

  await page.getByLabel("الرمز الحالي من التطبيق").fill(totpCode(secret!));
  await page.getByRole("button", { name: "تحقق وفعّل" }).click();
  await expect(
    page.getByText("تم تفعيل التحقق بخطوتين لهذا الحساب.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("P5 Browser Authenticator")).toBeVisible();

  await signOut(page);
  await signIn(page, email);
  await expect(page).toHaveURL(/\/mfa\?next=%2Fworkspaces$/);
  await waitForClientSurface(page, "mfa-challenge");

  await page.getByLabel("رمز التحقق").fill(totpCode(secret!));
  await page.getByRole("button", { name: "تحقق وادخل" }).click();
  await expect(page).toHaveURL(/\/workspaces$/);

  await page.goto("/settings/security");
  await waitForClientSurface(page, "mfa-security-settings");
  page.once("dialog", (dialog) => void dialog.accept());
  await page
    .locator("article")
    .filter({ hasText: "P5 Browser Authenticator" })
    .getByRole("button", { name: "إزالة" })
    .click();
  await expect(
    page.getByText("تمت إزالة وسيلة التحقق من الحساب.", { exact: true }),
  ).toBeVisible();

  await signOut(page);
  await signIn(page, email);
  await expect(page).toHaveURL(/\/workspaces$/);
});
