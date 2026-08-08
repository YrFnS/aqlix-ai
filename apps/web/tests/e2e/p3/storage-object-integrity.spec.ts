import { expect, test, type Page } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@iraqi-ai/types";
import { DOCUMENT_STORAGE_BUCKET } from "@iraqi-ai/types";

const password = "P3-Storage-Integrity-Test-2026!";

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for the P3 Storage test.`);
  return value;
}

const supabaseUrl = requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL");
const publicKey = requiredEnvironment("NEXT_PUBLIC_SUPABASE_ANON_KEY");

function uniqueEmail(): string {
  return `p3-storage-${crypto.randomUUID()}@example.test`;
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await page.getByLabel(/البريد الإلكتروني/).fill(email);
  await page.getByLabel(/^كلمة المرور/).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/);
}

async function signedClient(email: string): Promise<SupabaseClient<Database>> {
  const client = createClient<Database>(supabaseUrl, publicKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

test("binds private objects to registered attachments and normalizes mixed-script queries", async ({
  context,
  page,
}) => {
  const email = uniqueEmail();
  const workspaceName = "P3 Storage Integrity";
  const documentText = [
    "# Mixed search",
    "",
    "الأولوية وEnglish roadmap محفوظة داخل المصدر.",
  ].join("\n");

  await register(page, email);
  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\?status=created$/,
  );
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toMatch(/^[0-9a-f-]{36}$/);

  await page.getByRole("link", { name: /فتح المصادر/ }).click();
  await page.locator("#document-file").setInputFiles({
    name: "mixed.md",
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

  const ownerClient = await signedClient(email);
  const orphanPath = `${workspaceId}/${crypto.randomUUID()}/document.txt`;
  const orphanUpload = await ownerClient.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .upload(orphanPath, Buffer.from("orphan bytes"), {
      contentType: "text/plain",
      upsert: false,
    });
  expect(orphanUpload.error).toBeTruthy();

  const mixedQuery = "وEnglish";
  const searchResponse = await context.request.get(
    `/api/v1/workspaces/${workspaceId}/sources?q=${encodeURIComponent(mixedQuery)}`,
  );
  expect(searchResponse.status()).toBe(200);
  const searchPayload = (await searchResponse.json()) as {
    ok?: boolean;
    data?: {
      results?: Array<{ attachmentId?: string; content?: string }>;
    };
  };
  expect(searchPayload.ok).toBe(true);
  expect(searchPayload.data?.results?.[0]?.attachmentId).toBe(attachmentId);
  expect(searchPayload.data?.results?.[0]?.content).toContain("وEnglish");

  const deleteResponse = await context.request.delete(
    `/api/v1/workspaces/${workspaceId}/sources/${attachmentId}`,
  );
  expect(deleteResponse.status()).toBe(200);

  const orphanDownload = await ownerClient.storage
    .from(DOCUMENT_STORAGE_BUCKET)
    .download(orphanPath);
  expect(orphanDownload.error).toBeTruthy();
});
