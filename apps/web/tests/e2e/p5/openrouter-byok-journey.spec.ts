import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const password = "P5-OpenRouter-BYOK-Test-2026!";
const apiKey = "openrouter-test-user-owned-key-2026";
const freeModelId = "fixture/live-free-model:free";

function uniqueEmail(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}@example.test`;
}

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute(
    "data-app-hydrated",
    "true",
  );
}

async function waitForClientSurface(page: Page, name: string): Promise<void> {
  await expect(page.locator(`[data-client-surface="${name}"]`)).toHaveAttribute(
    "data-client-ready",
    "true",
  );
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await waitForHydration(page);
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
}

async function openAiSettings(page: Page): Promise<void> {
  await page.goto("/settings/ai");
  await expect(page).toHaveURL(/\/settings\/ai$/);
  await waitForClientSurface(page, "openrouter-settings");
}

async function sendMessage(page: Page, content: string): Promise<void> {
  await waitForClientSurface(page, "conversation");
  await page.getByLabel("اكتب رسالة").fill(content);
  const sendButton = page.getByRole("button", { name: "إرسال" });
  await expect(sendButton).toBeEnabled();
  await sendButton.click();
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
  await openAiSettings(page);

  const apiKeyField = page.getByLabel("OpenRouter API key");
  const connectButton = page.getByRole("button", {
    name: "Validate and connect",
  });
  await apiKeyField.fill(apiKey);
  await expect(connectButton).toBeEnabled();
  await connectButton.click();
  await expect(page.getByText("Connected", { exact: true })).toBeVisible();
  await expect(page.getByText("•••• 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("Free-tier key", { exact: true })).toBeVisible();
  await expect(page.getByLabel("OpenRouter API key")).toHaveCount(0);

  await page.getByLabel("Search OpenRouter models").fill("fixture");
  const freeOnlyFilter = page.getByLabel("Free only");
  await freeOnlyFilter.check();
  await expect(freeOnlyFilter).toBeChecked();
  const freeCard = page
    .locator("article")
    .filter({ hasText: "Live Free Fixture Model" });
  await expect(freeCard).toBeVisible();
  await expect(
    page.locator("article").filter({ hasText: "Live Paid Fixture Model" }),
  ).toHaveCount(0);
  await freeCard.getByRole("button", { name: "Use model" }).click();
  await expect(page.getByText(`Model selected: ${freeModelId}`)).toBeVisible();
  const currentModelSummary = page
    .getByText("Current model", { exact: true })
    .locator("..");
  await expect(currentModelSummary).toContainText(freeModelId);

  const outsiderContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const outsiderPage = await outsiderContext.newPage();
  await register(outsiderPage, outsiderEmail);
  await openAiSettings(outsiderPage);
  await expect(outsiderPage.getByLabel("OpenRouter API key")).toBeVisible();
  await expect(
    outsiderPage.getByText("Connected", { exact: true }),
  ).toHaveCount(0);
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
  await waitForHydration(page);
  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(/\/workspaces\/[0-9a-f-]+\?status=created$/);
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await page.getByRole("link", { name: /فتح المحادثات/ }).click();
  await page.getByLabel("عنوان اختياري").fill(conversationTitle);
  await page
    .getByRole("button", { name: "إنشاء وفتح", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/conversations\/[0-9a-f-]+\?status=created$/,
  );
  const conversationId = new URL(page.url()).pathname.split("/").pop();
  expect(conversationId).toBeTruthy();

  await sendMessage(
    page,
    "اختبر OpenRouter بالعربية وEnglish مع الرقم 2026",
  );
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

  await openAiSettings(page);
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Disconnect" }).click();
  await expect(page.getByLabel("OpenRouter API key")).toBeVisible();

  await page.goto(
    `/workspaces/${workspaceId}/conversations/${conversationId}`,
  );
  await sendMessage(page, "This must fail without a user key.");
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
