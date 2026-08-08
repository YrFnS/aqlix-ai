import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const password = "P1-Workspace-Test-2026!";

function uniqueEmail(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}@example.test`;
}

function collectHydrationErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|did not match|server rendered html/i.test(message.text())
    ) {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    if (/hydration|did not match|server rendered html/i.test(error.message)) {
      errors.push(error.message);
    }
  });

  return errors;
}

async function registerWithForm(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByLabel(/البريد الإلكتروني/)).toHaveAttribute(
    "dir",
    "ltr",
  );

  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();

  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
  await expect(
    page.getByRole("heading", { name: "مساحات العمل" }),
  ).toBeVisible();
}

async function registerWithKeyboard(page: Page, email: string): Promise<void> {
  await page.goto("/register");

  const emailInput = page.getByLabel(/البريد الإلكتروني/);
  await emailInput.focus();
  await page.keyboard.type(email);
  await page.keyboard.press("Tab");
  await expect(page.getByLabel(/^كلمة المرور/)).toBeFocused();
  await page.keyboard.type(password);
  await page.keyboard.press("Tab");
  await expect(page.getByLabel(/تأكيد كلمة المرور/)).toBeFocused();
  await page.keyboard.type(password);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: /إنشاء الحساب/ }),
  ).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
}

async function assertOutsiderIsolation(
  context: BrowserContext,
  workspaceId: string,
): Promise<void> {
  const response = await context.request.get(
    `/api/v1/workspaces/${workspaceId}`,
  );
  expect(response.status()).toBe(404);
  expect(response.headers()["x-request-id"]).toBeTruthy();

  const payload = await response.json();
  expect(payload).toMatchObject({
    ok: false,
    error: {
      code: "NOT_FOUND",
    },
  });
}

test("persists and isolates the complete P1 workspace lifecycle", async ({
  browser,
  context,
  page,
}) => {
  const hydrationErrors = collectHydrationErrors(page);
  const ownerEmail = uniqueEmail("owner");
  const outsiderEmail = uniqueEmail("outsider");
  const initialName = "مراجعة Contract 2026";
  const updatedName = "مراجعة Contract 2026 — نسخة 2";

  await registerWithForm(page, ownerEmail);

  await page.getByLabel("اسم المساحة", { exact: true }).fill(initialName);
  await page
    .getByLabel("وصف مختصر")
    .fill("سياق عربي English مع الرقم 2026 للتحقق من الاتجاه المختلط.");
  await page.getByLabel("اللغة الافتراضية").selectOption("auto");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();

  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\?status=created$/,
  );
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await expect(
    page.getByRole("heading", { name: initialName }),
  ).toBeVisible();
  await expect(page.getByText("تم إنشاء مساحة العمل")).toBeVisible();

  const ownerApiResponse = await context.request.get(
    `/api/v1/workspaces/${workspaceId}`,
  );
  expect(ownerApiResponse.status()).toBe(200);
  expect(ownerApiResponse.headers()["x-request-id"]).toBeTruthy();
  expect(await ownerApiResponse.json()).toMatchObject({
    ok: true,
    data: {
      workspace: {
        id: workspaceId,
        name: initialName,
        role: "owner",
      },
    },
  });

  await page.reload();
  await expect(
    page.getByRole("heading", { name: initialName }),
  ).toBeVisible();

  const outsiderContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const outsiderPage = await outsiderContext.newPage();
  const outsiderHydrationErrors = collectHydrationErrors(outsiderPage);

  await registerWithKeyboard(outsiderPage, outsiderEmail);
  await assertOutsiderIsolation(outsiderContext, workspaceId!);
  await outsiderPage.goto(`/workspaces/${workspaceId}`);
  await expect(
    outsiderPage.getByRole("heading", { name: "مساحة العمل غير متاحة" }),
  ).toBeVisible();
  expect(outsiderHydrationErrors).toEqual([]);
  await outsiderContext.close();

  await page.getByRole("link", { name: "الإعدادات" }).click();
  await page.getByLabel("اسم المساحة", { exact: true }).fill(updatedName);
  await page
    .getByLabel("الوصف")
    .fill("Updated English وعربي مع اتجاه تلقائي محفوظ في PostgreSQL.");
  await page.getByLabel("اللغة الافتراضية").selectOption("en");
  await page.getByRole("button", { name: "حفظ التغييرات" }).click();

  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}\\?status=updated$`),
  );
  await expect(page.getByText("تم حفظ إعدادات مساحة العمل")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: updatedName }),
  ).toBeVisible();

  await page.getByRole("button", { name: "أرشفة" }).click();
  await expect(page).toHaveURL(/\/workspaces\?status=archived$/);
  await expect(page.getByText("نُقلت مساحة العمل إلى الأرشيف")).toBeVisible();

  await page.getByRole("link", { name: /الأرشيف/ }).click();
  await expect(
    page.getByRole("heading", { name: "أرشيف مساحات العمل" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: updatedName })).toBeVisible();
  await page.getByRole("link", { name: "فتح المساحة" }).click();

  await page.getByRole("button", { name: "استعادة" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}\\?status=restored$`),
  );
  await expect(page.getByText("أعيدت مساحة العمل")).toBeVisible();

  await context.setOffline(true);
  await expect(page.getByText(/الاتصال غير متاح/)).toBeVisible();
  await context.setOffline(false);

  await page.setViewportSize({ width: 390, height: 844 });
  const menuButton = page.getByRole("button", { name: "فتح التنقل" });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.getByText(ownerEmail)).toBeVisible();
  await page.getByRole("button", { name: "إغلاق التنقل" }).click();

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole("link", { name: "الإعدادات" }).click();
  await page.getByLabel("اسم المساحة للتأكيد").fill(updatedName);
  await page.getByRole("button", { name: "حذف مساحة العمل" }).click();

  await expect(page).toHaveURL(/\/workspaces\?status=deleted$/);
  await expect(page.getByText("حُذفت مساحة العمل")).toBeVisible();
  await expect(page.getByRole("heading", { name: updatedName })).toHaveCount(0);

  await page.getByRole("button", { name: "تسجيل الخروج" }).click();
  await expect(page).toHaveURL(/\/login\?status=signed-out$/);
  await expect(page.getByText("تم تسجيل الخروج بأمان")).toBeVisible();

  expect(hydrationErrors).toEqual([]);
});
