import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const password = "P4-Draft-Test-2026!";
const documentText = `# Launch decision

The English roadmap confirms that the launch milestone is scheduled for Q4 after the final security review.

الخطة العربية تؤكد أن الإطلاق يعتمد على إغلاق مراجعة الأمان النهائية وحفظ القرار مع مراجعه.`;

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

async function createWorkspace(page: Page, name: string): Promise<string> {
  await page.getByLabel("اسم المساحة", { exact: true }).fill(name);
  await page
    .getByLabel("وصف مختصر")
    .fill("P4 durable draft and provenance browser validation.");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\?status=created$/,
  );
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();
  return workspaceId!;
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
  return response.json() as Promise<{
    ok: true;
    data: {
      conversation: { id: string };
      messages: Array<{
        id: string;
        role: string;
        status: string;
        content: string;
        citations: Array<{
          sourceId: string | null;
        }>;
      }>;
    };
  }>;
}

type DraftPayloadDetail = {
  draft: {
    id: string;
    title: string;
    content: string;
    kind: string;
    currentVersion: number;
    versionCount: number;
    provenanceCount: number;
    status: string;
    archivedAt: string | null;
  };
  provenance: Array<{
    sourceId: string | null;
    originMessageId: string | null;
  }>;
  versions: Array<{
    versionNumber: number;
    sourceKind: string;
    content: string;
    generationId: string | null;
    restoredFromVersion: number | null;
  }>;
};

async function draftPayload(
  request: APIRequestContext,
  workspaceId: string,
  draftId: string,
): Promise<{ ok: true; data: DraftPayloadDetail }> {
  const response = await request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${draftId}`,
  );
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    ok: true;
    data: { detail: DraftPayloadDetail };
  };
  return { ok: payload.ok, data: payload.data.detail };
}

async function requestJson(
  request: APIRequestContext,
  method: "post" | "patch" | "delete",
  url: string,
  data: unknown,
) {
  const response = await request[method](url, { data });
  const payload = await response.json();
  return { response, payload };
}

async function createDraftFromMessage(
  request: APIRequestContext,
  workspaceId: string,
  conversationId: string,
  messageId: string,
  kind: string,
) {
  const { response, payload } = await requestJson(
    request,
    "post",
    `/api/v1/workspaces/${workspaceId}/drafts`,
    {
      conversationId,
      messageId,
      kind,
    },
  );
  expect(response.status()).toBe(201);
  expect(payload).toMatchObject({
    ok: true,
    data: {
      detail: {
        draft: {
          kind,
          currentVersion: 1,
          provenanceCount: 1,
        },
      },
    },
  });
  return payload.data.detail.draft.id as string;
}

async function expectDraftListContains(
  request: APIRequestContext,
  workspaceId: string,
  draftId: string,
  status: "active" | "archived",
) {
  const response = await request.get(
    `/api/v1/workspaces/${workspaceId}/drafts?archived=${status === "archived"}`,
  );
  expect(response.status()).toBe(200);
  const payload = await response.json();
  expect(payload.ok).toBe(true);
  expect(
    payload.data.drafts.some((draft: { id: string }) => draft.id === draftId),
  ).toBe(true);
}

async function inspectDownload(
  request: APIRequestContext,
  url: string,
  expectedContentType: RegExp,
  expectedExtension: RegExp,
) {
  const response = await request.get(url);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(expectedContentType);
  expect(response.headers()["content-disposition"]).toMatch(expectedExtension);
  const body = await response.text();
  expect(body).toContain("Launch");
  expect(body).toContain("Q4");
  return body;
}

async function waitForProposal(
  page: Page,
  instruction: string,
): Promise<void> {
  await page.getByLabel("تعليمات اقتراح المسودة").fill(instruction);
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(page.getByText("جاهز للمراجعة", { exact: true })).toBeVisible();
}

function versionCard(page: Page, version: number) {
  return page
    .locator("article")
    .filter({ has: page.getByText(`v${version}`, { exact: true }) });
}

test("completes Ask Ground Draft Continue with durable versions and provenance", async ({
  browser,
  context,
  page,
}) => {
  const ownerEmail = uniqueEmail("p4-owner");
  const viewerEmail = uniqueEmail("p4-viewer");
  const workspaceName = "P4 قرار الإطلاق";

  await register(page, ownerEmail);
  const workspaceId = await createWorkspace(page, workspaceName);

  await page.getByRole("link", { name: "المصادر" }).click();
  await page.getByLabel("ملف TXT أو Markdown").setInputFiles({
    name: "launch-decision.md",
    mimeType: "text/markdown",
    buffer: Buffer.from(documentText, "utf8"),
  });
  await page.getByRole("button", { name: "رفع واستخراج المقاطع" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/sources\/[0-9a-f-]+\?status=uploaded$/,
  );
  const attachmentId = new URL(page.url()).pathname.split("/").pop();
  expect(attachmentId).toBeTruthy();

  await page.goto(`/workspaces/${workspaceId}/conversations`);
  await page.getByLabel("عنوان اختياري").fill("P4 launch decision");
  await page.getByRole("button", { name: "إنشاء وفتح المحادثة" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/conversations\/[0-9a-f-]+\?status=created$/,
  );
  const conversationId = new URL(page.url()).pathname.split("/").pop();
  expect(conversationId).toBeTruthy();

  await page.getByLabel(/استخدام مصادر مساحة العمل/).check();
  await page
    .getByLabel("اكتب رسالة")
    .fill("What does the English roadmap confirm about the launch milestone?");
  await page.getByRole("button", { name: "إرسال" }).click();
  await expect(
    page.getByText(
      "The saved workspace passage supports this deterministic answer [S1].",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("تم حفظ الاستجابة والمراجع القابلة للفتح.", {
      exact: true,
    }),
  ).toBeVisible();

  const conversation = await conversationPayload(
    context.request,
    workspaceId!,
    conversationId!,
  );
  const assistantMessage = conversation.data.messages.at(-1);
  expect(assistantMessage).toMatchObject({
    role: "assistant",
    status: "complete",
  });
  expect(assistantMessage?.citations).toHaveLength(1);
  const messageId = assistantMessage?.id;
  const sourceId = assistantMessage?.citations[0]?.sourceId;
  expect(messageId).toBeTruthy();
  expect(sourceId).toBeTruthy();

  await page.getByLabel("البداية").selectOption("memo");
  await page.getByRole("button", { name: "إنشاء المسودة" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/drafts\/[0-9a-f-]+\?status=created$/,
  );
  const primaryDraftId = new URL(page.url()).pathname.split("/").pop();
  expect(primaryDraftId).toBeTruthy();

  await expect(
    page.getByText(/Draft, version one, and provenance saved/),
  ).toBeVisible();
  const sourceLink = page.getByRole("link", {
    name: /فتح المصدر S1 من launch-decision\.md/,
  });
  await expect(sourceLink).toBeVisible();
  await expect(sourceLink).toHaveAttribute(
    "href",
    new RegExp(
      `/workspaces/${workspaceId}/sources/${attachmentId}#source-${sourceId}`,
    ),
  );

  let primaryDraft = await draftPayload(
    context.request,
    workspaceId!,
    primaryDraftId!,
  );
  expect(primaryDraft.data.draft).toMatchObject({
    kind: "memo",
    currentVersion: 1,
    versionCount: 1,
    provenanceCount: 1,
  });
  expect(primaryDraft.data.provenance).toEqual([
    expect.objectContaining({
      sourceId,
      originMessageId: messageId,
    }),
  ]);

  const savedContent = `${primaryDraft.data.draft.content}\n\nقرار بشري محفوظ 2026`;
  await page.getByLabel("محتوى المسودة").fill(savedContent);
  await page.getByRole("button", { name: "حفظ إصدار" }).click();
  await expect(page.getByText(/New immutable version saved/)).toBeVisible();

  primaryDraft = await draftPayload(
    context.request,
    workspaceId!,
    primaryDraftId!,
  );
  expect(primaryDraft.data.draft).toMatchObject({
    currentVersion: 2,
    versionCount: 2,
  });
  expect(primaryDraft.data.draft.content).toContain("قرار بشري محفوظ 2026");

  const noOp = await requestJson(
    context.request,
    "patch",
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}`,
    {
      expectedVersion: 2,
      title: primaryDraft.data.draft.title,
      content: primaryDraft.data.draft.content,
      direction: "auto",
      kind: "memo",
    },
  );
  expect(noOp.response.status()).toBe(200);
  expect(noOp.payload.data).toMatchObject({
    createdVersion: false,
    detail: { draft: { currentVersion: 2 } },
  });

  const staleWrite = await requestJson(
    context.request,
    "patch",
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}`,
    {
      expectedVersion: 1,
      title: "stale update",
      content: "stale update",
      direction: "auto",
      kind: "memo",
    },
  );
  expect(staleWrite.response.status()).toBe(409);
  expect(staleWrite.payload).toMatchObject({
    ok: false,
    error: { code: "CONFLICT" },
  });

  await versionCard(page, 1).getByRole("link", { name: "عرض اللقطة" }).click();
  await expect(page).toHaveURL(
    new RegExp(
      `/workspaces/${workspaceId}/drafts/${primaryDraftId}/versions/1$`,
    ),
  );
  await expect(
    page.getByRole("heading", { name: "الإصدار 1" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "العودة إلى المسودة" }).click();
  await versionCard(page, 1).getByRole("button", { name: "استعادة" }).click();
  await expect(
    page.getByText(/Snapshot restored as a new immutable version/),
  ).toBeVisible();

  primaryDraft = await draftPayload(
    context.request,
    workspaceId!,
    primaryDraftId!,
  );
  expect(primaryDraft.data.draft).toMatchObject({
    currentVersion: 3,
    versionCount: 3,
  });
  expect(primaryDraft.data.versions).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        versionNumber: 3,
        sourceKind: "restored",
        restoredFromVersion: 1,
      }),
    ]),
  );

  const txtBody = await inspectDownload(
    context.request,
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=txt`,
    /^text\/plain; charset=utf-8$/,
    /\.txt/,
  );
  const markdownBody = await inspectDownload(
    context.request,
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=md`,
    /^text\/markdown; charset=utf-8$/,
    /\.md/,
  );
  const htmlBody = await inspectDownload(
    context.request,
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=html`,
    /^text\/html; charset=utf-8$/,
    /\.html/,
  );
  expect(txtBody).not.toContain("<script");
  expect(markdownBody).not.toContain("<script");
  expect(htmlBody).toContain("<!doctype html>");
  expect(htmlBody).not.toContain("<script");
  expect(htmlBody).not.toContain("http://");
  expect(htmlBody).not.toContain("https://");

  await waitForProposal(page, "Add one concise implementation risk.");
  await expect(
    page.getByText(/deterministic draft continuation/),
  ).toBeVisible();
  await page.getByRole("button", { name: "رفض الاقتراح" }).click();
  await expect(page.getByText(/Proposal discarded/)).toBeVisible();

  await waitForProposal(page, "Apply a final concise implementation step.");
  await page.getByRole("button", { name: "تطبيق كإصدار جديد" }).click();
  await expect(
    page.getByText(/Proposal applied as a new immutable version/),
  ).toBeVisible();

  primaryDraft = await draftPayload(
    context.request,
    workspaceId!,
    primaryDraftId!,
  );
  expect(primaryDraft.data.draft).toMatchObject({
    currentVersion: 4,
    versionCount: 4,
  });
  expect(primaryDraft.data.versions).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        versionNumber: 4,
        sourceKind: "ai",
      }),
    ]),
  );

  await page
    .getByLabel("تعليمات اقتراح المسودة")
    .fill("SLOW STREAM cancel this");
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(
    page.getByRole("button", { name: "إيقاف وحفظ الجزئي" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "إيقاف وحفظ الجزئي" }).click();
  await expect(
    page.getByText("أُلغي وحُفظ الجزئي", { exact: true }),
  ).toBeVisible();

  await page
    .getByLabel("تعليمات اقتراح المسودة")
    .fill("PROVIDER_FAILURE validate failure persistence");
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(page.getByText(/PROVIDER_FAILURE/)).toBeVisible();

  for (const kind of [
    "summary",
    "comparison",
    "email",
    "checklist",
    "decision_note",
  ]) {
    const draftId = await createDraftFromMessage(
      context.request,
      workspaceId!,
      conversationId!,
      messageId!,
      kind,
    );
    const created = await draftPayload(context.request, workspaceId!, draftId);
    expect(created.data.draft).toMatchObject({
      kind,
      currentVersion: 1,
      provenanceCount: 1,
    });
  }

  const viewerContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const viewerPage = await viewerContext.newPage();
  await register(viewerPage, viewerEmail);

  const { createClient } = await import("@supabase/supabase-js");
  const statusResponse = await context.request.get("/api/health/live");
  expect(statusResponse.status()).toBe(200);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: viewerUser } = await admin.auth.admin.listUsers();
  const viewer = viewerUser.users.find((user) => user.email === viewerEmail);
  expect(viewer).toBeTruthy();
  const { error: membershipError } = await admin
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: viewer!.id,
      role: "viewer",
    });
  expect(membershipError).toBeNull();

  await viewerPage.goto(`/workspaces/${workspaceId}/drafts/${primaryDraftId}`);
  await expect(
    viewerPage.getByRole("heading", { name: primaryDraft.data.draft.title }),
  ).toBeVisible();
  await expect(viewerPage.getByLabel("محتوى المسودة")).toHaveAttribute(
    "readonly",
    "",
  );
  await expect(
    viewerPage.getByRole("button", { name: "حفظ إصدار" }),
  ).toHaveCount(0);
  await expect(
    viewerPage.getByRole("button", { name: "بدء اقتراح" }),
  ).toHaveCount(0);
  const viewerExport = await viewerContext.request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=md`,
  );
  expect(viewerExport.status()).toBe(200);
  await viewerContext.close();

  const deleteSource = await context.request.delete(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  expect(deleteSource.status()).toBe(200);
  const afterSourceDelete = await draftPayload(
    context.request,
    workspaceId!,
    primaryDraftId!,
  );
  expect(afterSourceDelete.data.provenance[0]).toMatchObject({
    sourceId: null,
    originMessageId: messageId,
  });

  const deleteConversation = await context.request.delete(
    `/api/v1/workspaces/${workspaceId}/conversations/${conversationId}`,
  );
  expect(deleteConversation.status()).toBe(200);
  const afterConversationDelete = await draftPayload(
    context.request,
    workspaceId!,
    primaryDraftId!,
  );
  expect(afterConversationDelete.data.provenance[0]).toMatchObject({
    sourceId: null,
    originMessageId: null,
  });

  const archive = await requestJson(
    context.request,
    "post",
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/archive`,
    { archived: true },
  );
  expect(archive.response.status()).toBe(200);
  await expectDraftListContains(
    context.request,
    workspaceId!,
    primaryDraftId!,
    "archived",
  );

  const restore = await requestJson(
    context.request,
    "post",
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/archive`,
    { archived: false },
  );
  expect(restore.response.status()).toBe(200);
  await expectDraftListContains(
    context.request,
    workspaceId!,
    primaryDraftId!,
    "active",
  );

  await page.goto(`/workspaces/${workspaceId}/drafts/${primaryDraftId}`);
  await page.getByRole("button", { name: "نقل إلى الأرشيف" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}/drafts\\?status=archived$`),
  );
  await page.getByRole("link", { name: "أرشيف المسودات" }).click();
  await page
    .locator("article")
    .filter({ hasText: primaryDraft.data.draft.title })
    .getByRole("link", { name: "فتح المسودة" })
    .click();
  await page.getByRole("button", { name: "استعادة إلى العمل" }).click();
  await expect(page).toHaveURL(
    new RegExp(
      `/workspaces/${workspaceId}/drafts/${primaryDraftId}\\?status=reopened$`,
    ),
  );
  await expect(page.getByText(/Draft restored to active work/)).toBeVisible();

  await page.goto(`/workspaces/${workspaceId}`);
  await page.getByRole("button", { name: "أرشفة" }).click();
  await page.goto(`/workspaces/${workspaceId}/drafts/${primaryDraftId}`);
  await expect(page.getByLabel("محتوى المسودة")).toHaveAttribute(
    "readonly",
    "",
  );
  await expect(
    page.getByRole("button", { name: "بدء اقتراح" }),
  ).toHaveCount(0);

  const deleteDraft = await context.request.delete(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}`,
  );
  expect(deleteDraft.status()).toBe(409);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "فتح التنقل" })).toBeVisible();
});
