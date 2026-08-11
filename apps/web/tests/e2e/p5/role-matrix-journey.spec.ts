import { expect, test, type Page } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@iraqi-ai/types";

const password = "P5-Role-Matrix-Test-2026!";

type WorkspaceRole = "editor" | "viewer";

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for the P5 role-matrix journey.`);
  }
  return value;
}

const supabaseUrl = requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL");
const publicKey = requiredEnvironment("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const adminKey = requiredEnvironment("SUPABASE_SERVICE_ROLE_KEY");

function uniqueEmail(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}@example.test`;
}

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute(
    "data-app-hydrated",
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

async function addMembership(
  workspaceId: string,
  email: string,
  role: WorkspaceRole,
): Promise<void> {
  const admin = isolatedClient(adminKey);
  const userId = await userIdForEmail(email);
  const { error } = await admin.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: userId,
    role,
  });
  if (error) throw error;
}

test("enforces owner, editor, viewer, and outsider workspace capabilities", async ({
  browser,
  context,
  page,
}) => {
  const ownerEmail = uniqueEmail("p5-role-owner");
  const editorEmail = uniqueEmail("p5-role-editor");
  const viewerEmail = uniqueEmail("p5-role-viewer");
  const outsiderEmail = uniqueEmail("p5-role-outsider");
  const workspaceName = "مساحة اختبار الأدوار P5";

  await register(page, ownerEmail);
  await page.getByLabel("اسم المساحة", { exact: true }).fill(workspaceName);
  await page
    .getByLabel("وصف مختصر")
    .fill("Owner, editor, viewer, and outsider role verification.");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(/\/workspaces\/[0-9a-f-]+\?status=created$/);

  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  const ownerAccess = await context.request.get(
    `/api/v1/workspaces/${workspaceId}`,
  );
  expect(ownerAccess.status()).toBe(200);
  expect(await ownerAccess.json()).toMatchObject({
    ok: true,
    data: {
      workspace: {
        id: workspaceId,
        role: "owner",
      },
    },
  });

  const editorContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const editorPage = await editorContext.newPage();
  await register(editorPage, editorEmail);
  await addMembership(workspaceId!, editorEmail, "editor");

  const editorAccess = await editorContext.request.get(
    `/api/v1/workspaces/${workspaceId}`,
  );
  expect(editorAccess.status()).toBe(200);
  expect(await editorAccess.json()).toMatchObject({
    ok: true,
    data: {
      workspace: {
        id: workspaceId,
        role: "editor",
      },
    },
  });

  await editorPage.goto(`/workspaces/${workspaceId}/conversations`);
  await waitForHydration(editorPage);
  await editorPage
    .getByLabel("عنوان اختياري")
    .fill("Editor-created role-matrix conversation");
  await editorPage
    .getByRole("button", {
      name: "إنشاء وفتح المحادثة",
      exact: true,
    })
    .click();
  await expect(editorPage).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/conversations\/[0-9a-f-]+\?status=created$/,
  );

  const editorArchiveAttempt = await editorContext.request.post(
    `/api/v1/workspaces/${workspaceId}/archive`,
    { data: { archived: true } },
  );
  expect(editorArchiveAttempt.status()).toBe(403);
  await editorContext.close();

  const viewerContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const viewerPage = await viewerContext.newPage();
  await register(viewerPage, viewerEmail);
  await addMembership(workspaceId!, viewerEmail, "viewer");

  const viewerList = await viewerContext.request.get(
    `/api/v1/workspaces/${workspaceId}/conversations`,
  );
  expect(viewerList.status()).toBe(200);
  expect(await viewerList.json()).toMatchObject({
    ok: true,
    data: {
      workspaceRole: "viewer",
    },
  });

  const viewerCreateAttempt = await viewerContext.request.post(
    `/api/v1/workspaces/${workspaceId}/conversations`,
    { data: { title: "Viewer write attempt" } },
  );
  expect(viewerCreateAttempt.status()).toBe(403);

  await viewerPage.goto(`/workspaces/${workspaceId}/conversations`);
  await waitForHydration(viewerPage);
  await expect(
    viewerPage.getByRole("button", {
      name: "إنشاء وفتح المحادثة",
      exact: true,
    }),
  ).toHaveCount(0);
  await viewerContext.close();

  const outsiderContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const outsiderPage = await outsiderContext.newPage();
  await register(outsiderPage, outsiderEmail);

  const outsiderReadAttempt = await outsiderContext.request.get(
    `/api/v1/workspaces/${workspaceId}`,
  );
  expect(outsiderReadAttempt.status()).toBe(404);

  const outsiderCreateAttempt = await outsiderContext.request.post(
    `/api/v1/workspaces/${workspaceId}/conversations`,
    { data: { title: "Outsider write attempt" } },
  );
  expect(outsiderCreateAttempt.status()).toBe(404);

  await outsiderPage.goto(`/workspaces/${workspaceId}`);
  await waitForHydration(outsiderPage);
  await expect(
    outsiderPage.getByRole("heading", { name: "مساحة العمل غير متاحة" }),
  ).toBeVisible();
  await outsiderContext.close();
});
