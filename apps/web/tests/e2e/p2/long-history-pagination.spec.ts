import { expect, test, type Page } from "@playwright/test";

const password = "P2-Long-History-2026!";

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

test("paginates long bilingual history with stable scroll and visible citations", async ({
  context,
  page,
}) => {
  const ownerEmail = uniqueEmail("p2-long-owner");
  await register(page, ownerEmail);

  await page.getByLabel("اسم المساحة", { exact: true }).fill("Long History مساحة");
  await page
    .getByLabel("وصف مختصر")
    .fill("Cursor pagination, citations, streaming, and mobile validation.");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await page.getByRole("link", { name: /فتح المحادثات/ }).click();
  await page.getByLabel("عنوان اختياري").fill("84-message bilingual history");
  await page.getByRole("button", { name: "إنشاء وفتح المحادثة" }).click();
  const conversationId = new URL(page.url()).pathname.split("/").pop();
  expect(conversationId).toBeTruthy();

  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data: users, error: usersError } = await admin.auth.admin.listUsers();
  expect(usersError).toBeNull();
  const owner = users.users.find((user) => user.email === ownerEmail);
  expect(owner).toBeTruthy();

  const baseTime = Date.now() - 84_000;
  const messageRows = Array.from({ length: 84 }, (_, sequence) => ({
    id: crypto.randomUUID(),
    workspace_id: workspaceId!,
    conversation_id: conversationId!,
    created_by: owner!.id,
    role: sequence % 2 === 0 ? "user" : "assistant",
    status: "complete",
    content:
      sequence % 2 === 0
        ? `سؤال تاريخي ${sequence} / historical question ${sequence}`
        : `إجابة تاريخية ${sequence} / historical answer ${sequence}`,
    direction: "auto",
    sequence,
    created_at: new Date(baseTime + sequence * 1000).toISOString(),
    updated_at: new Date(baseTime + sequence * 1000).toISOString(),
  }));

  const { error: messageError } = await admin.from("messages").insert(messageRows);
  expect(messageError).toBeNull();

  const assistantRows = messageRows.filter((message) => message.role === "assistant");
  const generationRows = assistantRows.map((message) => ({
    id: crypto.randomUUID(),
    workspace_id: workspaceId!,
    conversation_id: conversationId!,
    message_id: message.id,
    created_by: owner!.id,
    provider: "fixture",
    requested_model: "fixture-bilingual-v1",
    returned_model: "fixture-bilingual-v1",
    provider_response_id: `history-${message.sequence}`,
    status: "complete",
    grounding_mode:
      message.sequence === 5 ? "workspace_sources" : "off",
    retrieved_source_count: message.sequence === 5 ? 1 : 0,
    citation_count: message.sequence === 5 ? 1 : 0,
    input_tokens: 8,
    output_tokens: 12,
    reasoning_tokens: 0,
    total_tokens: 20,
    first_token_latency_ms: 40,
    latency_ms: 120,
    failure_code: null,
    failure_message: null,
    started_at: message.created_at,
    completed_at: message.updated_at,
    created_at: message.created_at,
    updated_at: message.updated_at,
  }));

  const { error: generationError } = await admin
    .from("message_generations")
    .insert(generationRows);
  expect(generationError).toBeNull();

  const citedMessage = messageRows.find((message) => message.sequence === 5)!;
  const { error: citationError } = await admin.from("message_citations").insert({
    workspace_id: workspaceId!,
    conversation_id: conversationId!,
    message_id: citedMessage.id,
    source_id: null,
    attachment_id: null,
    citation_order: 0,
    label: "S1",
    file_name_snapshot: "history-source.md",
    media_type_snapshot: "text/markdown",
    source_ordinal_snapshot: 0,
    page_number_snapshot: null,
    start_line_snapshot: 1,
    end_line_snapshot: 3,
  });
  expect(citationError).toBeNull();

  const { error: conversationUpdateError } = await admin
    .from("conversations")
    .update({ updated_at: new Date(baseTime + 83_000).toISOString() })
    .eq("id", conversationId!);
  expect(conversationUpdateError).toBeNull();

  await page.reload();

  const messages = page.locator('article[data-message-id]');
  await expect(messages).toHaveCount(40);
  await expect(page.getByRole("button", { name: "تحميل رسائل أقدم" })).toBeVisible();
  await expect(page.getByText("history-source.md")).toHaveCount(0);
  await expect(page.locator('[data-message-sequence="44"]')).toBeVisible();
  await expect(page.locator('[data-message-sequence="83"]')).toBeVisible();

  const initialResponse = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/conversations/${conversationId}`,
  );
  expect(initialResponse.status()).toBe(200);
  const initialPayload = await initialResponse.json();
  expect(initialPayload.data.messages).toHaveLength(40);
  expect(initialPayload.data.hasMore).toBe(true);
  expect(initialPayload.data.nextCursor).toBe(44);

  const viewport = page.getByTestId("conversation-viewport");
  await viewport.evaluate((element) => {
    element.scrollTop = 0;
  });
  const anchor = page.locator('[data-message-sequence="44"]');
  const anchorBefore = await anchor.boundingBox();
  expect(anchorBefore).toBeTruthy();

  await page.getByRole("button", { name: "تحميل رسائل أقدم" }).click();
  await expect(messages).toHaveCount(80);
  await expect(page.getByText("history-source.md")).toBeVisible();

  await expect
    .poll(async () => {
      const anchorAfter = await anchor.boundingBox();
      if (!anchorAfter || !anchorBefore) return Number.POSITIVE_INFINITY;
      return Math.abs(anchorAfter.y - anchorBefore.y);
    })
    .toBeLessThan(3);

  const draftSource = page.getByLabel("إجابة المساعد");
  await expect(
    draftSource.locator(`option[value="${citedMessage.id}"]`),
  ).toContainText("#5");
  await expect(
    draftSource.locator(`option[value="${citedMessage.id}"]`),
  ).toContainText("1 refs");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "تحميل رسائل أقدم" })).toBeVisible();
  await expect(page.getByLabel("اكتب رسالة")).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.getByRole("button", { name: "تحميل رسائل أقدم" }).click();
  await expect(messages).toHaveCount(84);
  await expect(page.getByRole("button", { name: "تحميل رسائل أقدم" })).toHaveCount(0);
  await expect(page.locator('[data-message-sequence="0"]')).toBeVisible();

  await page
    .getByLabel("اكتب رسالة")
    .fill("رسالة جديدة بعد السجل الطويل / new message after long history");
  await page.getByRole("button", { name: "إرسال" }).click();
  await expect(page.getByText(/تم حفظ الاستجابة والمحادثة/)).toBeVisible();
  await expect(page.locator('[data-message-sequence="85"]')).toBeVisible();

  const collectionResponse = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/conversations`,
  );
  expect(collectionResponse.status()).toBe(200);
  const collectionPayload = await collectionResponse.json();
  expect(
    collectionPayload.data.conversations.find(
      (conversation: { id: string }) => conversation.id === conversationId,
    ),
  ).toMatchObject({ messageCount: 86 });
});
