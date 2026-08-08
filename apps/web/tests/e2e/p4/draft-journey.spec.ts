import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database, DraftKind } from "@iraqi-ai/types";

const password = "P4-Durable-Draft-Test-2026!";

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for the P4 browser journey.`);
  return value;
}

const supabaseUrl = requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL");
const publicKey = requiredEnvironment("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const adminKey = requiredEnvironment("SUPABASE_SERVICE_ROLE_KEY");

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

function isolatedClient(key = publicKey): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

async function userIdForEmail(email: string): Promise<string> {
  const admin = isolatedClient(adminKey);
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) throw error;

  const user = data.users.find((candidate) => candidate.email === email);
  if (!user) throw new Error(`Could not resolve test user ${email}.`);
  return user.id;
}

async function addViewerMembership(
  workspaceId: string,
  viewerEmail: string,
): Promise<void> {
  const admin = isolatedClient(adminKey);
  const viewerId = await userIdForEmail(viewerEmail);
  const { error } = await admin.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: viewerId,
    role: "viewer",
  });
  if (error) throw error;
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
        sequence: number;
        citations: Array<{
          sourceId: string | null;
          attachmentId: string | null;
          label: string;
          fileNameSnapshot: string;
        }>;
      }>;
    };
  };
}

async function draftPayload(
  request: APIRequestContext,
  workspaceId: string,
  draftId: string,
) {
  const response = await request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${draftId}`,
  );
  expect(response.status()).toBe(200);
  expect(response.headers()["x-request-id"]).toBeTruthy();
  return (await response.json()) as {
    ok: true;
    data: {
      detail: {
        draft: {
          id: string;
          title: string;
          content: string;
          kind: DraftKind;
          status: "active" | "archived";
          currentVersion: number;
          versionCount: number;
          provenanceCount: number;
        };
        versions: Array<{
          versionNumber: number;
          sourceKind: string;
          content: string;
          restoredFromVersion: number | null;
        }>;
        provenance: Array<{
          label: string;
          sourceId: string | null;
          attachmentId: string | null;
          fileNameSnapshot: string;
        }>;
        generations: Array<{
          id: string;
          status: string;
          baseVersion: number;
          proposedContent: string;
          failureCode: string | null;
        }>;
      };
    };
  };
}

async function createAdditionalDraft(
  request: APIRequestContext,
  input: {
    workspaceId: string;
    conversationId: string;
    messageId: string;
    kind: Exclude<DraftKind, "freeform">;
  },
): Promise<string> {
  const response = await request.post(
    `/api/v1/workspaces/${input.workspaceId}/drafts`,
    {
      data: {
        conversationId: input.conversationId,
        messageId: input.messageId,
        kind: input.kind,
      },
    },
  );
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as {
    ok?: boolean;
    data?: {
      detail?: { draft?: { id?: string; kind?: string; currentVersion?: number } };
    };
  };
  expect(payload.ok).toBe(true);
  expect(payload.data?.detail?.draft?.kind).toBe(input.kind);
  expect(payload.data?.detail?.draft?.currentVersion).toBe(1);
  const draftId = payload.data?.detail?.draft?.id;
  if (!draftId) throw new Error(`No draft ID returned for ${input.kind}.`);
  return draftId;
}

test("completes Ask Ground Draft Continue with durable versions and provenance", async ({
  browser,
  context,
  page,
}) => {
  const hydrationErrors = collectHydrationErrors(page);
  const ownerEmail = uniqueEmail("p4-owner");
  const viewerEmail = uniqueEmail("p4-viewer");
  const outsiderEmail = uniqueEmail("p4-outsider");
  const workspaceName = "مساحة Draft P4";
  const documentName = "قرار P4.md";
  const documentText = [
    "# قرار P4",
    "",
    "The English roadmap confirms the 2026 launch milestone.",
    "",
    "المراجعة الأسبوعية مسؤولية فريق المنصة.",
  ].join("\n");

  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:3000",
  });
  await register(page, ownerEmail);

  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page
    .getByLabel("وصف مختصر")
    .fill("Ask Ground Draft Continue integration fixture.");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(/\/workspaces\/[0-9a-f-]+\?status=created$/);
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
  await page.getByLabel("عنوان اختياري").fill("P4 launch decision");
  await page
    .getByRole("button", { name: "إنشاء وفتح المحادثة" })
    .click();
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
    page.getByText(/saved workspace passage supports this deterministic answer/i),
  ).toBeVisible();
  await expect(page.getByText(/Response and inspectable citations saved/)).toBeVisible();

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

  await expect(page.getByText(/Draft, version one, and provenance saved/)).toBeVisible();
  await expect(page.getByLabel("عنوان المسودة")).toHaveValue(
    "مذكرة — P4 launch decision",
  );
  await expect(page.getByLabel("محتوى المسودة")).toContainText("[S1]");
  await expect(page.getByRole("link").filter({ hasText: documentName })).toBeVisible();

  let draft = await draftPayload(
    context.request,
    workspaceId!,
    primaryDraftId!,
  );
  expect(draft.data.detail.draft).toMatchObject({
    kind: "memo",
    currentVersion: 1,
    versionCount: 1,
    provenanceCount: 1,
  });
  expect(draft.data.detail.provenance[0]).toMatchObject({
    label: "S1",
    sourceId,
    attachmentId,
    fileNameSnapshot: documentName,
  });

  const additionalKinds: Array<Exclude<DraftKind, "freeform">> = [
    "summary",
    "comparison",
    "email",
    "checklist",
    "decision_note",
  ];
  for (const kind of additionalKinds) {
    const extraDraftId = await createAdditionalDraft(context.request, {
      workspaceId: workspaceId!,
      conversationId: conversationId!,
      messageId: messageId!,
      kind,
    });
    const deleteResponse = await context.request.delete(
      `/api/v1/workspaces/${workspaceId}/drafts/${extraDraftId}`,
    );
    expect(deleteResponse.status()).toBe(200);
  }

  const contentEditor = page.getByLabel("محتوى المسودة");
  const initialContent = await contentEditor.inputValue();
  const editedContent = `${initialContent}\n\nإضافة عربية and English 2026 مع <script>alert('x')</script>.`;
  await contentEditor.fill(editedContent);
  await expect(
    page.getByRole("status").filter({ hasText: "تغييرات غير محفوظة" }),
  ).toBeVisible();
  await contentEditor.press("Control+s");
  await expect(page.getByText(/New immutable version saved/)).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: "محفوظ" }),
  ).toBeVisible();

  draft = await draftPayload(context.request, workspaceId!, primaryDraftId!);
  expect(draft.data.detail.draft.currentVersion).toBe(2);
  expect(draft.data.detail.draft.versionCount).toBe(2);
  expect(draft.data.detail.draft.content).toBe(editedContent);

  await page.reload();
  await expect(page.getByLabel("محتوى المسودة")).toHaveValue(editedContent);
  await page.getByRole("button", { name: "نسخ" }).click();
  await expect(page.getByRole("button", { name: "نُسخ" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    editedContent,
  );

  const htmlExport = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=html`,
  );
  expect(htmlExport.status()).toBe(200);
  expect(htmlExport.headers()["content-type"]).toContain("text/html");
  const htmlBody = await htmlExport.text();
  expect(htmlBody).toContain("&lt;script&gt;");
  expect(htmlBody).not.toContain("<script>");
  expect(htmlBody).toContain('<pre dir="auto">');

  const textExport = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=txt`,
  );
  expect(textExport.status()).toBe(200);
  expect(await textExport.text()).toContain("إضافة عربية and English 2026");

  const markdownExport = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=md`,
  );
  expect(markdownExport.status()).toBe(200);
  expect(await markdownExport.text()).toContain("# مذكرة — P4 launch decision");

  await page.getByRole("button", { name: "استعادة" }).last().click();
  await expect(page.getByText(/Snapshot restored as a new immutable version/)).toBeVisible();
  draft = await draftPayload(context.request, workspaceId!, primaryDraftId!);
  expect(draft.data.detail.draft.currentVersion).toBe(3);
  expect(draft.data.detail.versions[0]).toMatchObject({
    versionNumber: 3,
    sourceKind: "restored",
    restoredFromVersion: 1,
  });
  expect(draft.data.detail.draft.content).toBe(initialContent);

  await page.getByRole("link", { name: /عرض اللقطة/ }).last().click();
  await expect(page.getByRole("heading", { name: "الإصدار 1" })).toBeVisible();
  await expect(page.getByText(/هذه اللقطة غير قابلة للتعديل/)).toBeVisible();
  await page.getByRole("link", { name: "العودة إلى المسودة" }).click();

  await page.getByLabel("إجراء اقتراح المسودة").selectOption("improve");
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(page.getByRole("heading", { name: "جاهز للمراجعة" })).toBeVisible();
  await expect(page.getByText(/صياغة اختبارية محسّنة/)).toBeVisible();
  await page.getByRole("button", { name: "رفض الاقتراح" }).click();
  await expect(page.getByText(/Proposal discarded; accepted work is unchanged/)).toBeVisible();
  draft = await draftPayload(context.request, workspaceId!, primaryDraftId!);
  expect(draft.data.detail.draft.currentVersion).toBe(3);
  expect(draft.data.detail.generations[0]?.status).toBe("discarded");

  await page.getByLabel("إجراء اقتراح المسودة").selectOption("expand");
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(page.getByRole("heading", { name: "جاهز للمراجعة" })).toBeVisible();
  await page.getByRole("button", { name: "تطبيق كإصدار جديد" }).click();
  await expect(page.getByText(/Proposal applied as a new immutable version/)).toBeVisible();
  draft = await draftPayload(context.request, workspaceId!, primaryDraftId!);
  expect(draft.data.detail.draft.currentVersion).toBe(4);
  expect(draft.data.detail.versions[0]?.sourceKind).toBe("ai");
  expect(draft.data.detail.draft.content).toContain("تفصيل اختباري إضافي");

  await page.getByLabel("إجراء اقتراح المسودة").selectOption("continue");
  await page
    .getByLabel("تعليمات اقتراح المسودة")
    .fill("[fixture:slow] Continue slowly and preserve [S1].");
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(page.getByRole("button", { name: "إيقاف وحفظ الجزئي" })).toBeVisible();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "إيقاف وحفظ الجزئي" }).click();
  await expect(page.getByRole("heading", { name: "أُلغي وحُفظ الجزئي" })).toBeVisible();
  draft = await draftPayload(context.request, workspaceId!, primaryDraftId!);
  expect(draft.data.detail.generations[0]).toMatchObject({
    status: "cancelled",
    failureCode: "STREAM_CANCELLED",
  });
  expect(draft.data.detail.generations[0]?.proposedContent.length).toBeGreaterThan(0);

  await page.getByLabel("إجراء اقتراح المسودة").selectOption("custom");
  await page
    .getByLabel("تعليمات اقتراح المسودة")
    .fill("[fixture:fail] Verify explicit proposal failure.");
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "PROVIDER_UNAVAILABLE" }),
  ).toBeVisible();
  draft = await draftPayload(context.request, workspaceId!, primaryDraftId!);
  expect(draft.data.detail.generations[0]).toMatchObject({
    status: "failed",
    failureCode: "PROVIDER_UNAVAILABLE",
  });

  const sourceDelete = await context.request.delete(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  expect(sourceDelete.status()).toBe(200);
  await page.reload();
  await expect(
    page.getByTitle("The original source is no longer available."),
  ).toBeVisible();
  draft = await draftPayload(context.request, workspaceId!, primaryDraftId!);
  expect(draft.data.detail.provenance[0]).toMatchObject({
    label: "S1",
    sourceId: null,
    attachmentId: null,
    fileNameSnapshot: documentName,
  });

  const viewerContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const viewerPage = await viewerContext.newPage();
  const viewerHydrationErrors = collectHydrationErrors(viewerPage);
  await register(viewerPage, viewerEmail);
  await addViewerMembership(workspaceId!, viewerEmail);
  await viewerPage.goto(`/workspaces/${workspaceId}/drafts/${primaryDraftId}`);
  await expect(viewerPage.getByLabel("محتوى المسودة")).not.toBeEditable();
  await expect(viewerPage.getByRole("button", { name: "حفظ إصدار" })).toHaveCount(0);
  await expect(viewerPage.getByRole("button", { name: "بدء اقتراح" })).toHaveCount(0);
  const viewerExport = await viewerContext.request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}/export?format=txt`,
  );
  expect(viewerExport.status()).toBe(200);
  const viewerPatch = await viewerContext.request.patch(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}`,
    {
      data: {
        expectedVersion: draft.data.detail.draft.currentVersion,
        title: draft.data.detail.draft.title,
        content: "viewer write attempt",
        direction: "auto",
        kind: draft.data.detail.draft.kind,
      },
    },
  );
  expect(viewerPatch.status()).toBe(403);
  expect(viewerHydrationErrors).toEqual([]);
  await viewerContext.close();

  const outsiderContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const outsiderPage = await outsiderContext.newPage();
  const outsiderHydrationErrors = collectHydrationErrors(outsiderPage);
  await register(outsiderPage, outsiderEmail);
  const outsiderApi = await outsiderContext.request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}`,
  );
  expect(outsiderApi.status()).toBe(404);
  await outsiderPage.goto(`/workspaces/${workspaceId}/drafts/${primaryDraftId}`);
  await expect(
    outsiderPage.getByRole("heading", { name: "المسودة غير متاحة" }),
  ).toBeVisible();
  expect(outsiderHydrationErrors).toEqual([]);
  await outsiderContext.close();

  await page.getByRole("button", { name: "نقل إلى الأرشيف" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}/drafts\\?status=archived$`),
  );
  await page.getByRole("link", { name: "أرشيف المسودات" }).click();
  await page.getByRole("link", { name: "فتح المسودة" }).click();
  await expect(page.getByLabel("محتوى المسودة")).not.toBeEditable();
  await expect(page.getByRole("button", { name: "استعادة إلى العمل" })).toBeVisible();
  await page.getByRole("button", { name: "استعادة إلى العمل" }).click();
  await expect(page).toHaveURL(
    new RegExp(
      `/workspaces/${workspaceId}/drafts/${primaryDraftId}\\?status=reopened$`,
    ),
  );
  await expect(page.getByLabel("محتوى المسودة")).toBeEditable();

  await page.goto(`/workspaces/${workspaceId}`);
  await page.getByRole("button", { name: "أرشفة" }).click();
  await expect(page).toHaveURL(/\/workspaces\?status=archived$/);
  await page.goto(`/workspaces/${workspaceId}/drafts/${primaryDraftId}`);
  await expect(page.getByLabel("محتوى المسودة")).not.toBeEditable();
  await expect(
    page.getByRole("status").filter({ hasText: "Workspace is archived" }),
  ).toBeVisible();
  const archivedPatch = await context.request.patch(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}`,
    {
      data: {
        expectedVersion: draft.data.detail.draft.currentVersion,
        title: draft.data.detail.draft.title,
        content: draft.data.detail.draft.content,
        direction: "auto",
        kind: draft.data.detail.draft.kind,
      },
    },
  );
  expect(archivedPatch.status()).toBe(409);

  await page.goto(`/workspaces/${workspaceId}`);
  await page.getByRole("button", { name: "استعادة" }).click();
  await expect(page).toHaveURL(/\/workspaces\?status=restored$/);
  await page.goto(`/workspaces/${workspaceId}/drafts/${primaryDraftId}`);
  await expect(page.getByLabel("محتوى المسودة")).toBeEditable();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel("محتوى المسودة")).toBeVisible();
  await expect(page.getByText("Continue with AI")).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });

  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "حذف المسودة" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}/drafts\\?status=deleted$`),
  );
  const deletedApi = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/drafts/${primaryDraftId}`,
  );
  expect(deletedApi.status()).toBe(404);

  await page.getByRole("button", { name: "تسجيل الخروج" }).click();
  await expect(page).toHaveURL(/\/login\?status=signed-out$/);
  expect(hydrationErrors).toEqual([]);
});
