import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const password = "P3-Grounded-Conversation-Test-2026!";

function uniqueEmail(): string {
  return `p3-grounded-${crypto.randomUUID()}@example.test`;
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
}

async function enableWorkspaceGrounding(page: Page): Promise<void> {
  const toggle = page.getByRole("button", {
    name: "استخدام مصادر مساحة العمل",
    exact: true,
  });

  if ((await toggle.getAttribute("aria-pressed")) !== "true") {
    await toggle.click();
  }

  await expect(toggle).toHaveAttribute("aria-pressed", "true");
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
        id: string;
        role: string;
        status: string;
        content: string;
        generation: null | {
          status: string;
          groundingMode: string;
          retrievedSourceCount: number;
          citationCount: number;
          failureCode: string | null;
        };
        citations: Array<{
          id: string;
          label: string;
          sourceId: string | null;
          attachmentId: string | null;
          fileNameSnapshot: string;
          startLineSnapshot: number | null;
          endLineSnapshot: number | null;
        }>;
      }>;
    };
  };
}

test("grounds a streamed answer, opens its passage, and preserves a deleted-source snapshot", async ({
  context,
  page,
}) => {
  const email = uniqueEmail();
  const workspaceName = "مساحة Grounded P3";
  const documentName = "قرار الإطلاق.md";
  const documentText = [
    "# قرار الإطلاق",
    "",
    "The English roadmap confirms that the launch milestone is 2026.",
    "",
    "المراجعة الأسبوعية مسؤولية فريق المنصة.",
  ].join("\n");

  await register(page, email);
  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\?status=created$/,
  );
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await page.getByRole("link", { name: /فتح المصادر/ }).click();
  await page.locator("#document-file").setInputFiles({
    name: documentName,
    mimeType: "text/markdown",
    buffer: Buffer.from(documentText, "utf8"),
  });
  await page
    .getByRole("button", { name: "رفع واستخراج المقاطع" })
    .click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/sources\/[0-9a-f-]+\?status=uploaded$/,
  );
  const attachmentId = new URL(page.url()).pathname.split("/").pop();
  expect(attachmentId).toBeTruthy();

  await page.goto(`/workspaces/${workspaceId}/conversations`);
  await page.getByLabel("عنوان اختياري").fill("Grounded launch review");
  await page
    .getByRole("button", { name: "إنشاء وفتح المحادثة" })
    .click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/conversations\/[0-9a-f-]+\?status=created$/,
  );
  const conversationId = new URL(page.url()).pathname.split("/").pop();
  expect(conversationId).toBeTruthy();
  const conversationUrl = `/workspaces/${workspaceId}/conversations/${conversationId}`;

  await enableWorkspaceGrounding(page);
  await page
    .getByLabel("اكتب رسالة")
    .fill("What does the English roadmap confirm about the launch milestone?");
  await page.getByRole("button", { name: "إرسال" }).click();

  const groundedAssistantMessage = page
    .locator('article[data-message-id]')
    .filter({
      hasText: /saved workspace passage supports this deterministic answer/i,
    })
    .first();
  await expect(groundedAssistantMessage).toBeVisible();
  await expect(
    page.getByText("تم حفظ الاستجابة والمراجع القابلة للفتح.", {
      exact: true,
    }),
  ).toBeVisible();
  const citationLink = page.getByRole("link", {
    name: new RegExp(`فتح المرجع S1 من ${documentName}`),
  });
  await expect(citationLink).toBeVisible();
  await expect(page.getByText(/١ مرجع من ١ مقطع/)).toBeVisible();

  let payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  const groundedMessage = payload.data.messages.at(-1);
  expect(groundedMessage).toMatchObject({
    role: "assistant",
    status: "complete",
    generation: {
      status: "complete",
      groundingMode: "workspace_sources",
      retrievedSourceCount: 1,
      citationCount: 1,
      failureCode: null,
    },
  });
  expect(groundedMessage?.citations).toHaveLength(1);
  expect(groundedMessage?.citations[0]).toMatchObject({
    label: "S1",
    attachmentId,
    fileNameSnapshot: documentName,
  });
  const sourceId = groundedMessage?.citations[0]?.sourceId;
  expect(sourceId).toBeTruthy();

  await citationLink.click();
  await expect(page).toHaveURL(
    new RegExp(
      `/workspaces/${workspaceId}/sources/${attachmentId}#source-${sourceId}$`,
    ),
  );
  await expect(page.locator(`#source-${sourceId}`)).toBeVisible();
  await expect(page.locator(`#source-${sourceId}`)).toContainText(
    "English roadmap",
  );

  const deleteResponse = await context.request.delete(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  expect(deleteResponse.status()).toBe(200);

  await page.goto(conversationUrl);
  await expect(groundedAssistantMessage).toBeVisible();
  await expect(
    page.getByTitle(
      "The original source was deleted or is no longer available.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: new RegExp(`فتح المرجع S1 من ${documentName}`),
    }),
  ).toHaveCount(0);

  payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  expect(payload.data.messages.at(-1)?.citations[0]).toMatchObject({
    label: "S1",
    sourceId: null,
    attachmentId: null,
    fileNameSnapshot: documentName,
  });

  await enableWorkspaceGrounding(page);
  await page
    .getByLabel("اكتب رسالة")
    .fill("What does the English roadmap confirm about the launch milestone?");
  await page.getByRole("button", { name: "إرسال" }).click();
  await expect(
    page.getByText("NO_RELEVANT_SOURCES", { exact: true }),
  ).toBeVisible();

  payload = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  expect(payload.data.messages.at(-1)).toMatchObject({
    role: "assistant",
    status: "failed",
    content: "",
    generation: {
      status: "failed",
      groundingMode: "workspace_sources",
      retrievedSourceCount: 0,
      citationCount: 0,
      failureCode: "NO_RELEVANT_SOURCES",
    },
    citations: [],
  });
});
