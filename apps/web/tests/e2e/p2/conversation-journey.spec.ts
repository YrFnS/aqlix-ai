import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const password = "P2-Conversation-Test-2026!";

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

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
}

function clientSurface(page: Page, name: string) {
  return page
    .locator(`[data-client-surface="${name}"][data-client-ready="true"]`)
    .last();
}

async function waitForClientSurface(page: Page, name: string): Promise<void> {
  await expect(clientSurface(page, name)).toHaveAttribute(
    "data-client-ready",
    "true",
  );
}

async function sendMessage(page: Page, content: string): Promise<void> {
  await waitForClientSurface(page, "conversation");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const conversationSurface = clientSurface(page, "conversation");
    const input = conversationSurface.getByLabel("اكتب رسالة");
    const sendButton = conversationSurface.getByRole("button", {
      name: "إرسال",
    });

    await input.fill(content);
    await expect(input).toHaveValue(content);

    try {
      await expect(sendButton).toBeEnabled({ timeout: 4_000 });
      await sendButton.click({ timeout: 4_000 });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await waitForClientSurface(page, "conversation");
    }
  }
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
  expect(response.headers()["x-request-id"]).toBeTruthy();
  return (await response.json()) as {
    ok: true;
    data: {
      messages: Array<{
        id: string;
        role: string;
        status: string;
        content: string;
        sequence: number;
        generation: null | {
          provider: string;
          requestedModel: string;
          status: string;
          totalTokens: number | null;
          failureCode: string | null;
        };
      }>;
    };
  };
}

test("streams, persists, cancels, retries, isolates, and manages a bilingual conversation", async ({
  browser,
  context,
  page,
}) => {
  const hydrationErrors = collectHydrationErrors(page);
  const ownerEmail = uniqueEmail("p2-owner");
  const outsiderEmail = uniqueEmail("p2-outsider");
  const workspaceName = "مساحة Conversation P2";
  const conversationTitle = "Arabic + English Review";

  await register(page, ownerEmail);

  await page
    .getByLabel("اسم المساحة", { exact: true })
    .fill(workspaceName);
  await page
    .getByLabel("وصف مختصر")
    .fill("اختبار streaming وpersistence وretry في 2026.");
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

  await waitForClientSurface(page, "conversation");
  const composer = clientSurface(page, "conversation").getByLabel("اكتب رسالة");
  await expect(composer).toHaveAttribute("dir", "auto");
  await sendMessage(
    page,
    "اشرح الفكرة بالعربية وEnglish مع الرقم 2026 والرابط https://example.test",
  );

  const completedAssistantMessage = page
    .locator('article[data-message-id]')
    .filter({ hasText: /هذه إجابة اختبارية متدفقة ومحفوظة/ })
    .first();
  await expect(completedAssistantMessage).toBeVisible();
  await completedAssistantMessage
    .getByText("تفاصيل التوليد", { exact: true })
    .click();
  await expect(
    completedAssistantMessage.getByText("fixture-bilingual-v1", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("حُفظت الاستجابة داخل المحادثة.", { exact: true }),
  ).toBeVisible();

  let payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  expect(payload.data.messages).toHaveLength(2);
  expect(payload.data.messages[0]).toMatchObject({
    role: "user",
    status: "complete",
    sequence: 0,
  });
  expect(payload.data.messages[1]).toMatchObject({
    role: "assistant",
    status: "complete",
    sequence: 1,
    generation: {
      provider: "fixture",
      requestedModel: "fixture-bilingual-v1",
      status: "complete",
      failureCode: null,
    },
  });
  expect(payload.data.messages[1]?.generation?.totalTokens).toBeGreaterThan(0);

  await page.reload();
  await waitForClientSurface(page, "conversation");
  await expect(completedAssistantMessage).toBeVisible();
  await completedAssistantMessage
    .getByText("تفاصيل التوليد", { exact: true })
    .click();
  await expect(
    completedAssistantMessage.getByText("fixture-bilingual-v1", {
      exact: true,
    }),
  ).toBeVisible();

  await sendMessage(page, "[fixture:slow] أوقف هذه الاستجابة بعد بدء النص");
  const stopButton = clientSurface(page, "conversation").getByRole("button", {
    name: "إيقاف",
    exact: true,
  });
  await expect(stopButton).toBeVisible();
  await stopButton.click();

  await expect
    .poll(async () => {
      const current = await conversationPayload(
        context.request,
        workspaceId!,
        conversationId!,
      );
      return current.data.messages.at(-1)?.status;
    })
    .toBe("cancelled");

  await expect(page.getByText("أُلغيت")).toBeVisible();

  await page.getByRole("button", { name: "إعادة المحاولة" }).last().click();
  await expect(
    page.getByText("حُفظت الاستجابة داخل المحادثة.", { exact: true }),
  ).toBeVisible();

  payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  expect(payload.data.messages).toHaveLength(5);
  expect(payload.data.messages[3]).toMatchObject({
    role: "assistant",
    status: "cancelled",
    sequence: 3,
    generation: {
      status: "cancelled",
      failureCode: "STREAM_CANCELLED",
    },
  });
  expect(payload.data.messages[4]).toMatchObject({
    role: "assistant",
    status: "complete",
    sequence: 4,
  });

  await sendMessage(page, "[fixture:fail] اختبر فشل المزود");
  await expect(
    page.getByText("PROVIDER_UNAVAILABLE", { exact: true }),
  ).toBeVisible();

  payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  expect(payload.data.messages).toHaveLength(7);
  expect(payload.data.messages.at(-1)).toMatchObject({
    role: "assistant",
    status: "failed",
    generation: {
      status: "failed",
      failureCode: "PROVIDER_UNAVAILABLE",
    },
  });

  const outsiderContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const outsiderPage = await outsiderContext.newPage();
  const outsiderHydrationErrors = collectHydrationErrors(outsiderPage);
  await register(outsiderPage, outsiderEmail);

  const outsiderResponse = await outsiderContext.request.get(
    `/api/v1/workspaces/${workspaceId}/conversations/${conversationId}`,
  );
  expect(outsiderResponse.status()).toBe(404);
  expect(await outsiderResponse.json()).toMatchObject({
    ok: false,
    error: { code: "NOT_FOUND" },
  });

  await outsiderPage.goto(
    `/workspaces/${workspaceId}/conversations/${conversationId}`,
  );
  await expect(
    outsiderPage.getByRole("heading", { name: "المحادثة غير متاحة" }),
  ).toBeVisible();
  expect(outsiderHydrationErrors).toEqual([]);
  await outsiderContext.close();

  await page.getByRole("button", { name: "أرشفة" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}/conversations\\?status=archived$`),
  );
  await page.getByRole("link", { name: "أرشيف المحادثات" }).click();
  await page.getByRole("link", { name: "فتح المحادثة" }).click();
  await expect(
    page.getByText("هذه المحادثة مؤرشفة. استعدها قبل إرسال رسالة جديدة."),
  ).toBeVisible();
  await expect(page.getByLabel("اكتب رسالة")).toHaveCount(0);

  await page.getByRole("button", { name: "استعادة" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}/conversations\\?status=restored$`),
  );
  await expect(page.getByText(/أعيدت المحادثة إلى القائمة النشطة/)).toBeVisible();
  await page.getByRole("link", { name: "فتح المحادثة" }).click();
  await expect(page.getByLabel("اكتب رسالة")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel("اكتب رسالة")).toBeVisible();
  await expect(page.getByRole("button", { name: "إرسال" })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page
    .getByRole("button", { name: "حذف المحادثة ورسائلها" })
    .click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}/conversations\\?status=deleted$`),
  );
  await expect(page.getByRole("heading", { name: conversationTitle })).toHaveCount(0);

  await page.getByRole("button", { name: "تسجيل الخروج" }).click();
  await expect(page).toHaveURL(/\/login\?status=signed-out$/);
  expect(hydrationErrors).toEqual([]);
});
