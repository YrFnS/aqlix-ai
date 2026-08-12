import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@iraqi-ai/types";

const password = "P5-Authenticated-Product-Test-2026!";

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for the authenticated P5 journey.`);
  }
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

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute(
    "data-app-hydrated",
    "true",
  );
}

async function waitForClientSurface(page: Page, name: string): Promise<void> {
  await expect(
    page
      .locator(
        `[data-client-surface="${name}"][data-client-ready="true"]`,
      )
      .first(),
  ).toHaveAttribute("data-client-ready", "true");
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await waitForHydration(page);
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
  await waitForHydration(page);
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
  return (await response.json()) as {
    ok: true;
    data: {
      detail: {
        draft: {
          title: string;
          content: string;
          kind: string;
          currentVersion: number;
          versionCount: number;
          provenanceCount: number;
        };
        versions: Array<{
          versionNumber: number;
          sourceKind: string;
          content: string;
        }>;
        provenance: Array<{
          label: string;
          sourceId: string | null;
          attachmentId: string | null;
          fileNameSnapshot: string;
        }>;
        generations: Array<{
          status: string;
          proposedContent: string;
          failureCode: string | null;
        }>;
      };
    };
  };
}

function draftContentEditor(page: Page) {
  return page.getByRole("textbox", {
    name: "محتوى المسودة",
    exact: true,
  });
}

test("completes the current source, grounded conversation, citation, draft, proposal, and role journey", async ({
  browser,
  context,
  page,
}) => {
  const hydrationErrors = collectHydrationErrors(page);
  const ownerEmail = uniqueEmail("p5-product-owner");
  const viewerEmail = uniqueEmail("p5-product-viewer");
  const outsiderEmail = uniqueEmail("p5-product-outsider");
  const workspaceName = "مساحة P5 الموثقة";
  const documentName = "قرار P5.md";
  const supportingPassage =
    "The English roadmap confirms the 2026 launch milestone.";
  const documentText = [
    "# قرار P5",
    "",
    supportingPassage,
    "",
    "المراجعة الأسبوعية مسؤولية فريق المنصة.",
  ].join("\n");

  await register(page, ownerEmail);

  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page
    .getByLabel("وصف مختصر")
    .fill("Authenticated P5 source-to-draft browser fixture.");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(/\/workspaces\/[0-9a-f-]+\?status=created$/);
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await page.goto(`/workspaces/${workspaceId}/sources`);
  await waitForHydration(page);
  await page.locator("#document-file").setInputFiles({
    name: documentName,
    mimeType: "text/markdown",
    buffer: Buffer.from(documentText, "utf8"),
  });
  await expect
    .poll(() =>
      page.locator("#document-file").evaluate((element) => {
        const input = element as HTMLInputElement;
        return input.files?.[0]?.name ?? null;
      }),
    )
    .toBe(documentName);
  const uploadButton = page.getByRole("button", {
    name: "رفع واستخراج المقاطع",
  });
  await expect(uploadButton).toBeEnabled();
  await uploadButton.click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/sources\/[0-9a-f-]+\?status=uploaded$/,
  );
  const attachmentId = new URL(page.url()).pathname.split("/").pop();
  expect(attachmentId).toBeTruthy();
  await expect(page.getByRole("heading", { name: documentName })).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: supportingPassage }).first(),
  ).toBeVisible();

  await page.goto(`/workspaces/${workspaceId}/conversations`);
  await waitForHydration(page);
  await page.getByLabel("عنوان اختياري").fill("P5 grounded decision");
  await page
    .getByRole("button", {
      name: "إنشاء وفتح المحادثة",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/conversations\/[0-9a-f-]+\?status=created$/,
  );
  const conversationId = new URL(page.url()).pathname.split("/").pop();
  expect(conversationId).toBeTruthy();
  await waitForClientSurface(page, "conversation");

  const groundingButton = page.getByRole("button", {
    name: "استخدام مصادر مساحة العمل",
    exact: true,
  });
  await groundingButton.click();
  await expect(groundingButton).toHaveAttribute("aria-pressed", "true");
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
    page.getByRole("status").filter({
      hasText: "حُفظت الاستجابة ومراجعها القابلة للفحص.",
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
  expect(assistantMessage?.citations[0]).toMatchObject({
    label: "S1",
    attachmentId,
    fileNameSnapshot: documentName,
  });

  await page
    .getByRole("button", {
      name: new RegExp(`معاينة المرجع S1 من ${documentName}`),
    })
    .click();
  const citationDialog = page.getByRole("dialog", {
    name: "معاينة المرجع S1",
  });
  await expect(citationDialog).toBeVisible();
  await expect(citationDialog).toContainText(supportingPassage);
  await citationDialog
    .getByRole("button", { name: "إغلاق معاينة المرجع" })
    .click();
  await expect(citationDialog).toBeHidden();

  const conversationDetails = page.getByRole("complementary", {
    name: "تفاصيل المحادثة",
  });
  await conversationDetails.getByLabel("نوع البداية").selectOption("memo");
  await conversationDetails
    .getByRole("button", { name: "إنشاء المسودة" })
    .click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/drafts\/[0-9a-f-]+\?status=created$/,
  );
  const draftId = new URL(page.url()).pathname.split("/").pop();
  expect(draftId).toBeTruthy();
  await waitForClientSurface(page, "draft-editor");

  await expect(
    page.getByText(/Draft, version one, and provenance saved/),
  ).toBeVisible();
  await expect(page.getByLabel("عنوان المسودة", { exact: true })).toHaveValue(
    "مذكرة — P5 grounded decision",
  );
  await expect(draftContentEditor(page)).toHaveValue(/\[S1\]/u);
  await expect(page.getByText(documentName, { exact: true })).toBeVisible();

  const initialContent = await draftContentEditor(page).inputValue();
  const editedContent = `${initialContent}\n\nإضافة عربية and English 2026.`;
  await draftContentEditor(page).fill(editedContent);
  await expect(
    page.getByRole("status").filter({ hasText: "تغييرات غير محفوظة" }),
  ).toBeVisible();
  const saveButton = page.getByRole("button", { name: "حفظ إصدار" });
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
  await expect(page.getByText(/New immutable version saved/)).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: "محفوظ · v2" }),
  ).toBeVisible();

  let draft = await draftPayload(context.request, workspaceId!, draftId!);
  expect(draft.data.detail.draft).toMatchObject({
    kind: "memo",
    currentVersion: 2,
    versionCount: 2,
    provenanceCount: 1,
    content: editedContent,
  });
  expect(draft.data.detail.provenance[0]).toMatchObject({
    label: "S1",
    attachmentId,
    fileNameSnapshot: documentName,
  });

  await page.getByRole("button", { name: "الاقتراح", exact: true }).click();
  await page.getByLabel("إجراء اقتراح المسودة").selectOption("expand");
  await page.getByRole("button", { name: "بدء اقتراح" }).click();
  await expect(
    page.getByRole("heading", { name: "جاهز للمراجعة" }),
  ).toBeVisible();
  await expect(page.getByText(/تفصيل اختباري إضافي/)).toBeVisible();
  await page.getByRole("button", { name: "تطبيق كإصدار جديد" }).click();
  await expect(
    page.getByText(/Proposal applied as a new immutable version/),
  ).toBeVisible();

  draft = await draftPayload(context.request, workspaceId!, draftId!);
  expect(draft.data.detail.draft.currentVersion).toBe(3);
  expect(draft.data.detail.draft.versionCount).toBe(3);
  expect(draft.data.detail.versions[0]?.sourceKind).toBe("ai");
  expect(draft.data.detail.draft.content).toContain("تفصيل اختباري إضافي");

  const viewerContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const viewerPage = await viewerContext.newPage();
  const viewerHydrationErrors = collectHydrationErrors(viewerPage);
  await register(viewerPage, viewerEmail);
  await addViewerMembership(workspaceId!, viewerEmail);
  await viewerPage.goto(`/workspaces/${workspaceId}/drafts/${draftId}`);
  await waitForClientSurface(viewerPage, "draft-editor");
  await expect(draftContentEditor(viewerPage)).not.toBeEditable();
  await expect(
    viewerPage.getByRole("button", { name: "حفظ إصدار" }),
  ).toHaveCount(0);
  await viewerPage.getByRole("button", { name: "الاقتراح", exact: true }).click();
  await expect(
    viewerPage.getByRole("button", { name: "بدء اقتراح" }),
  ).toHaveCount(0);
  const viewerPatch = await viewerContext.request.patch(
    `/api/v1/workspaces/${workspaceId}/drafts/${draftId}`,
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
    `/api/v1/workspaces/${workspaceId}/drafts/${draftId}`,
  );
  expect(outsiderApi.status()).toBe(404);
  await outsiderPage.goto(`/workspaces/${workspaceId}/drafts/${draftId}`);
  await waitForHydration(outsiderPage);
  await expect(
    outsiderPage.getByRole("heading", { name: "المسودة غير متاحة" }),
  ).toBeVisible();
  expect(outsiderHydrationErrors).toEqual([]);
  await outsiderContext.close();

  expect(hydrationErrors).toEqual([]);
});
