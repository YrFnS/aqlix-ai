import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const password = "P5-OpenRouter-BYOK-Test-2026!";
const apiKey = "openrouter-test-user-owned-key-2026";
const freeModelId = "fixture/live-free-model:free";

function uniqueEmail(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}@example.test`;
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
}

async function conversationPayload(
  request: APIRequestContext,
  workspaceId: string,
  conversationId: string,
) {
  const response = await request.get(
    `/api/v1/workspaces/${workspaceId}/conversations/${conversationId}`,
  );
  expect(response.status()).toBe(200);
  return (await response.json()) as {
    ok: true;
    data: {
      messages: Array<{
        role: string;
        status: string;
        content: string;
        generation: null | {
          provider: string;
          requestedModel: string;
          returnedModel: string | null;
          status: string;
          totalTokens: number | null;
          failureCode: string | null;
        };
      }>;
    };
  };
}

test("connects a user key, selects a live model, streams, isolates, and disconnects", async ({
  browser,
  context,
  page,
}) => {
  const ownerEmail = uniqueEmail("p5-openrouter-owner");
  const outsiderEmail = uniqueEmail("p5-openrouter-outsider");
  const workspaceName = "OpenRouter BYOK Workspace";
  const conversationTitle = "Live selected model";

  await register(page, ownerEmail);
  await page
    .getByRole("link", { name: "إعدادات الذكاء الاصطناعي" })
    .click();
  await expect(
    page.getByRole("heading", { name: "إعدادات الذكاء الاصطناعي" }),
  ).toBeVisible();

  await page.getByLabel("OpenRouter API key").fill(apiKey);
  await page.getByRole("button", { name: "Validate and connect" }).click();
  await expect(page.getByText(/متصل · •••• 2026/)).toBeVisible();
  await expect(page.getByText(/مفتاح خطة مجانية/)).toBeVisible();
  await expect(page.getByLabel("OpenRouter API key")).toHaveCount(0);

  await page.getByLabel("Search OpenRouter models").fill("fixture");
  await page.getByLabel("Free only").check();
  const freeCard = page
    .locator("article")
    .filter({ hasText: "Live Free Fixture Model" });
  await expect(freeCard).toBeVisible();
  await expect(
    page.locator("article").filter({ hasText: "Live Paid Fixture Model" }),
  ).toHaveCount(0);
  await freeCard.getByRole("button", { name: "Use model" }).click();
  await expect(
    page.getByText(`تم اختيار النموذج: ${freeModelId}`),
  ).toBeVisible();
  await expect(
    page.locator("aside").getByText(freeModelId, { exact: true }),
  ).toBeVisible();

  const outsiderContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const outsiderPage = await outsiderContext.newPage();
  await register(outsiderPage, outsiderEmail);
  await outsiderPage.goto("/settings/ai");
  await expect(outsiderPage.getByLabel("OpenRouter API key")).toBeVisible();
  await expect(outsiderPage.getByText(/متصل · ••••/)).toHaveCount(0);
  const outsiderSettings = await outsiderContext.request.get(
    "/api/v1/ai/settings",
  );
  expect(outsiderSettings.status()).toBe(200);
  expect(await outsiderSettings.json()).toMatchObject({
    ok: true,
    data: {
      settings: {
        provider: "openrouter",
        connected: false,
        modelId: null,
        keyLastFour: null,
      },
    },
  });
  await outsiderContext.close();

  await page.goto("/workspaces");
  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(/\/workspaces\/[0-9a-f-]+\?status=created$/);
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await page.getByRole("link", { name: /فتح المحادثات/ }).click();
  await page.getByLabel("عنوان اختياري").fill(conversationTitle);
  await page
    .getByRole("button", { name: "إنشاء وفتح المحادثة" })
    .click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/conversations\/[0-9a-f-]+\?status=created$/,
  );
  const conversationId = new URL(page.url()).pathname.split("/").pop();
  expect(conversationId).toBeTruthy();

  await page
    .getByLabel("اكتب رسالة")
    .fill("اختبر OpenRouter بالعربية وEnglish مع الرقم 2026");
  await page.getByRole("button", { name: "إرسال" }).click();
  const assistantMessage = page
    .locator('article[data-message-id]')
    .filter({ hasText: /استجابة OpenRouter اختبارية محفوظة/ })
    .first();
  await expect(assistantMessage).toBeVisible();
  await expect(assistantMessage).toContainText(freeModelId);

  let payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  expect(payload.data.messages.at(-1)).toMatchObject({
    role: "assistant",
    status: "complete",
    generation: {
      provider: "openrouter",
      requestedModel: freeModelId,
      returnedModel: freeModelId,
      status: "complete",
      totalTokens: 32,
      failureCode: null,
    },
  });

  await page.goto("/settings/ai");
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Disconnect" }).click();
  await expect(page.getByLabel("OpenRouter API key")).toBeVisible();

  await page.goto(
    `/workspaces/${workspaceId}/conversations/${conversationId}`,
  );
  await page.getByLabel("اكتب رسالة").fill("This must fail without a user key.");
  await page.getByRole("button", { name: "إرسال" }).click();
  await expect(
    page.getByText("PROVIDER_UNCONFIGURED", { exact: true }),
  ).toBeVisible();

  payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  expect(payload.data.messages.at(-1)).toMatchObject({
    role: "assistant",
    status: "failed",
    generation: {
      provider: "openrouter",
      requestedModel: "unconfigured",
      status: "failed",
      failureCode: "PROVIDER_UNCONFIGURED",
    },
  });
});
