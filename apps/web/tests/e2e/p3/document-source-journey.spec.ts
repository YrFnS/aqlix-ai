import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@iraqi-ai/types";
import { DOCUMENT_MAX_BYTES, DOCUMENT_STORAGE_BUCKET } from "@iraqi-ai/types";

const password = "P3-Document-Source-Test-2026!";

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for the P3 browser journey.`);
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

function isolatedSupabaseClient(key = publicKey): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

async function signedUserClient(email: string): Promise<SupabaseClient<Database>> {
  const client = isolatedSupabaseClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

async function userIdForEmail(email: string): Promise<string> {
  const admin = isolatedSupabaseClient(adminKey);
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) throw error;

  const user = data.users.find((candidate) => candidate.email === email);
  if (!user) throw new Error(`Could not resolve the test user ${email}.`);
  return user.id;
}

async function addViewerMembership(
  workspaceId: string,
  viewerEmail: string,
): Promise<void> {
  const admin = isolatedSupabaseClient(adminKey);
  const viewerId = await userIdForEmail(viewerEmail);
  const { error } = await admin.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: viewerId,
    role: "viewer",
  });
  if (error) throw error;
}

async function documentPayload(
  request: APIRequestContext,
  workspaceId: string,
  attachmentId: string,
) {
  const response = await request.get(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  expect(response.status()).toBe(200);
  expect(response.headers()["x-request-id"]).toBeTruthy();
  return (await response.json()) as {
    ok: true;
    data: {
      document: {
        attachment: {
          id: string;
          fileName: string;
          status: string;
          storagePath: string;
          sourceCount: number;
          contentSha256: string;
        };
        sources: Array<{
          id: string;
          ordinal: number;
          content: string;
          startLine: number | null;
          endLine: number | null;
        }>;
      };
    };
  };
}

async function expectApiFailure(
  response: Awaited<ReturnType<APIRequestContext["post"]>>,
  status: number,
  code: string,
): Promise<void> {
  expect(response.status()).toBe(status);
  const payload = (await response.json()) as {
    ok?: boolean;
    error?: {
      code?: string;
      fieldErrors?: Record<string, string[]>;
    };
  };
  expect(payload.ok).toBe(false);
  expect(
    payload.error?.fieldErrors?.file?.includes(code) ||
      payload.error?.code === code,
  ).toBe(true);
}

test("stores, searches, isolates, downloads, archives, and deletes private source passages", async ({
  browser,
  context,
  page,
}) => {
  const hydrationErrors = collectHydrationErrors(page);
  const ownerEmail = uniqueEmail("p3-owner");
  const viewerEmail = uniqueEmail("p3-viewer");
  const outsiderEmail = uniqueEmail("p3-outsider");
  const workspaceName = "مساحة مصادر P3";
  const markdownFileName = "قرار المشروع.md";
  const markdownText = [
    "# قرار المشروع",
    "",
    "الأولويات العربية وEnglish roadmap 2026 محفوظة داخل المصدر.",
    "",
    "المسؤول عن التنفيذ هو فريق المنصة مع مراجعة أسبوعية.",
  ].join("\n");
  const markdownBytes = Buffer.from(markdownText, "utf8");

  await register(page, ownerEmail);
  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page
    .getByLabel("وصف مختصر")
    .fill("Private TXT and Markdown source validation.");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(/\/workspaces\/[0-9a-f-]+\?status=created$/);

  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await page.getByRole("link", { name: /فتح المصادر/ }).click();
  await expect(
    page.getByRole("heading", { name: `مصادر ${workspaceName}` }),
  ).toBeVisible();
  await page.locator("#document-file").setInputFiles({
    name: markdownFileName,
    mimeType: "text/markdown",
    buffer: markdownBytes,
  });
  await page
    .getByRole("button", { name: "رفع واستخراج المقاطع" })
    .click();

  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/sources\/[0-9a-f-]+\?status=uploaded$/,
  );
  const attachmentId = new URL(page.url()).pathname.split("/").pop();
  expect(attachmentId).toBeTruthy();

  await expect(
    page.getByRole("heading", { name: markdownFileName }),
  ).toBeVisible();
  await expect(page.getByText(/Private document stored/)).toBeVisible();
  await expect(page.getByText("S1", { exact: true })).toBeVisible();
  await expect(page.getByText(/English roadmap 2026/)).toBeVisible();
  await expect(page.getByText(/الأسطر/)).toBeVisible();

  const payload = await documentPayload(
    context.request,
    workspaceId!,
    attachmentId!,
  );
  expect(payload.data.document.attachment).toMatchObject({
    id: attachmentId,
    fileName: markdownFileName,
    status: "ready",
  });
  expect(payload.data.document.attachment.sourceCount).toBeGreaterThan(0);
  expect(payload.data.document.attachment.contentSha256).toHaveLength(64);
  expect(payload.data.document.sources[0]).toMatchObject({
    ordinal: 0,
    startLine: 1,
  });
  const storagePath = payload.data.document.attachment.storagePath;
  const firstSourceId = payload.data.document.sources[0]?.id;
  expect(storagePath).toMatch(
    new RegExp(`^${workspaceId}/[0-9a-f-]+/document\\.md$`),
  );
  expect(storagePath).not.toContain("قرار");
  expect(firstSourceId).toBeTruthy();

  await page.reload();
  await expect(
    page.getByRole("heading", { name: markdownFileName }),
  ).toBeVisible();
  await expect(page.getByText(/English roadmap 2026/)).toBeVisible();

  const redirectResponse = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}/download`,
    { maxRedirects: 0 },
  );
  expect([302, 307]).toContain(redirectResponse.status());
  const signedLocation = redirectResponse.headers().location;
  expect(signedLocation).toBeTruthy();
  const downloaded = await context.request.get(signedLocation!);
  expect(downloaded.status()).toBe(200);
  expect(Buffer.from(await downloaded.body()).toString("utf8")).toBe(markdownText);

  const ownerStorageClient = await signedUserClient(ownerEmail);
  const ownerDownload = await ownerStorageClient.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .download(storagePath);
  expect(ownerDownload.error).toBeNull();
  expect(await ownerDownload.data?.text()).toBe(markdownText);

  await page.getByRole("link", { name: "كل المصادر" }).click();
  await page.getByLabel("البحث في المصادر").fill("English");
  await page.getByRole("button", { name: "بحث" }).click();
  await expect(page).toHaveURL(/\?q=English$/);
  const supportingLink = page.getByRole("link", { name: "فتح المقطع الداعم" });
  await expect(supportingLink).toBeVisible();
  await supportingLink.click();
  await expect(page).toHaveURL(
    new RegExp(
      `/workspaces/${workspaceId}/sources/${attachmentId}#source-${firstSourceId}$`,
    ),
  );
  await expect(page.locator(`#source-${firstSourceId}`)).toBeVisible();

  await page.getByRole("link", { name: "كل المصادر" }).click();
  await page.locator("#document-file").setInputFiles({
    name: "نسخة.md",
    mimeType: "text/markdown",
    buffer: markdownBytes,
  });
  await page
    .getByRole("button", { name: "رفع واستخراج المقاطع" })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "DUPLICATE_DOCUMENT" }),
  ).toBeVisible();

  await page.locator("#document-file").setInputFiles({
    name: "report.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7"),
  });
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Only TXT and Markdown are supported" }),
  ).toBeVisible();

  const invalidUtf8 = await context.request.post(
    `/api/v1/workspaces/${workspaceId}/sources`,
    {
      multipart: {
        file: {
          name: "invalid.txt",
          mimeType: "text/plain",
          buffer: Buffer.from([0xff, 0xfe]),
        },
      },
    },
  );
  await expectApiFailure(invalidUtf8, 422, "INVALID_UTF8");

  const oversized = await context.request.post(
    `/api/v1/workspaces/${workspaceId}/sources`,
    {
      multipart: {
        file: {
          name: "large.txt",
          mimeType: "text/plain",
          buffer: Buffer.alloc(DOCUMENT_MAX_BYTES + 1, 97),
        },
      },
    },
  );
  await expectApiFailure(oversized, 413, "FILE_TOO_LARGE");

  const viewerContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const viewerPage = await viewerContext.newPage();
  const viewerHydrationErrors = collectHydrationErrors(viewerPage);
  await register(viewerPage, viewerEmail);
  await addViewerMembership(workspaceId!, viewerEmail);
  await viewerPage.goto(`/workspaces/${workspaceId}/sources`);
  await expect(
    viewerPage.getByRole("heading", { name: markdownFileName }),
  ).toBeVisible();
  await expect(viewerPage.locator("#document-file")).toHaveCount(0);
  await expect(viewerPage.getByText(/عضويتك للقراءة فقط/)).toBeVisible();

  const viewerUpload = await viewerContext.request.post(
    `/api/v1/workspaces/${workspaceId}/sources`,
    {
      multipart: {
        file: {
          name: "viewer.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("viewer write attempt"),
        },
      },
    },
  );
  expect(viewerUpload.status()).toBe(403);

  const viewerStorageClient = await signedUserClient(viewerEmail);
  const viewerDownload = await viewerStorageClient.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .download(storagePath);
  expect(viewerDownload.error).toBeNull();
  const viewerDirectUpload = await viewerStorageClient.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .upload(
      `${workspaceId}/${crypto.randomUUID()}/document.txt`,
      Buffer.from("viewer cannot upload"),
      { contentType: "text/plain", upsert: false },
    );
  expect(viewerDirectUpload.error).toBeTruthy();
  expect(viewerHydrationErrors).toEqual([]);
  await viewerContext.close();

  const outsiderContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const outsiderPage = await outsiderContext.newPage();
  const outsiderHydrationErrors = collectHydrationErrors(outsiderPage);
  await register(outsiderPage, outsiderEmail);

  const outsiderApi = await outsiderContext.request.get(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  expect(outsiderApi.status()).toBe(404);
  await outsiderPage.goto(
    `/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  await expect(
    outsiderPage.getByRole("heading", { name: "المستند غير متاح" }),
  ).toBeVisible();
  const outsiderStorageClient = await signedUserClient(outsiderEmail);
  const outsiderDownload = await outsiderStorageClient.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .download(storagePath);
  expect(outsiderDownload.error).toBeTruthy();
  expect(outsiderHydrationErrors).toEqual([]);
  await outsiderContext.close();

  await page.goto(`/workspaces/${workspaceId}`);
  await page.getByRole("button", { name: "أرشفة" }).click();
  await expect(page).toHaveURL(/\/workspaces\?status=archived$/);
  await page.goto(`/workspaces/${workspaceId}/sources`);
  await expect(page.locator("#document-file")).toHaveCount(0);
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "مساحة العمل مؤرشفة وتعمل بوضع القراءة فقط" }),
  ).toBeVisible();

  const archivedUpload = await context.request.post(
    `/api/v1/workspaces/${workspaceId}/sources`,
    {
      multipart: {
        file: {
          name: "archived.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("archived write attempt"),
        },
      },
    },
  );
  expect(archivedUpload.status()).toBe(409);

  await page.goto(`/workspaces/${workspaceId}`);
  await page.getByRole("button", { name: "استعادة" }).click();
  await expect(page).toHaveURL(/\/workspaces\?status=restored$/);
  await page.goto(`/workspaces/${workspaceId}/sources/${attachmentId}`);
  await expect(
    page.getByRole("heading", { name: markdownFileName }),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByText("S1", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });

  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "حذف الملف والمقاطع" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/workspaces/${workspaceId}/sources\\?status=deleted$`),
  );
  await expect(
    page.getByRole("heading", { name: markdownFileName }),
  ).toHaveCount(0);

  const deletedApi = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  expect(deletedApi.status()).toBe(404);
  const deletedObject = await ownerStorageClient.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .download(storagePath);
  expect(deletedObject.error).toBeTruthy();

  await page.getByRole("button", { name: "تسجيل الخروج" }).click();
  await expect(page).toHaveURL(/\/login\?status=signed-out$/);
  expect(hydrationErrors).toEqual([]);
});
