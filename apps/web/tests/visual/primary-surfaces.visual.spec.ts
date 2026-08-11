import { expect, test, type Page, type TestInfo } from "@playwright/test";

const password = "Visual-Regression-2026!";
const sourceText = `# Launch decision

The launch milestone remains scheduled for Q4 after the security review and owner approvals.

قرار الإطلاق يبقى مرتبطاً بإغلاق مراجعة الأمان وتوثيق الموافقات المطلوبة.`;

function projectEmail(testInfo: TestInfo): string {
  const suffix = testInfo.project.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
  return `visual-${suffix}@example.test`;
}

async function stabilize(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
      nextjs-portal, [data-nextjs-toast] { display: none !important; }
    `,
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(150);
}

function dynamicMasks(page: Page) {
  return [
    page.locator("time"),
    page.locator("[data-visual-dynamic]"),
    page.getByText(/آخر تحديث:/u),
    page.getByText(/آخر نشاط:/u),
    page.getByText(/آخر حفظ:/u),
    page.getByText(/تاريخ الإنشاء:/u),
    page.getByText(/تمت المعالجة في:/u),
    page.locator('footer p[dir="ltr"]'),
  ];
}

async function capture(page: Page, name: string): Promise<void> {
  await stabilize(page);
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    mask: dynamicMasks(page),
    maskColor: "#7f7f7f",
  });
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await page.getByLabel(/البريد الإلكتروني/u).fill(email);
  await page.getByLabel(/^كلمة المرور/u).fill(password);
  await page.getByLabel(/تأكيد كلمة المرور/u).fill(password);
  await page.getByRole("button", { name: /إنشاء الحساب/u }).click();
  await expect(page).toHaveURL(/\/workspaces(?:\?.*)?$/u);
}

async function enableWorkspaceGrounding(page: Page): Promise<void> {
  const toggle = page.getByRole("button", {
    name: "استخدام مصادر مساحة العمل",
    exact: true,
  });

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
}

test("keeps the primary Tuppra journey visually stable", async ({
  context,
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /من سؤال مبعثر إلى مسودة موثّقة/u }),
  ).toBeVisible();
  await capture(page, "home.png");

  await page.goto("/docs");
  await expect(
    page.getByRole("heading", {
      name: /ابدأ من السؤال، وانتهِ بعمل يمكنك مراجعته/u,
    }),
  ).toBeVisible();
  await capture(page, "guide.png");

  await page.goto("/login");
  await expect(page.getByRole("button", { name: /تسجيل الدخول/u })).toBeVisible();
  await capture(page, "login.png");

  await register(page, projectEmail(testInfo));
  await page.getByLabel("اسم المساحة", { exact: true }).fill("Visual QA مساحة العمل");
  await page
    .getByLabel("وصف مختصر")
    .fill("مساحة ثابتة لمراجعة الواجهات العربية وEnglish عبر المقاسات المختلفة.");
  await page.getByRole("button", { name: "إنشاء مساحة العمل" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\?status=created$/u,
  );
  const workspaceId = new URL(page.url()).pathname.split("/").pop();
  expect(workspaceId).toBeTruthy();

  await page.goto("/workspaces");
  await expect(page.getByText("Visual QA مساحة العمل", { exact: true })).toBeVisible();
  await capture(page, "workspaces.png");

  await page.goto(`/workspaces/${workspaceId}`);
  await expect(
    page.getByRole("heading", { name: "Visual QA مساحة العمل" }),
  ).toBeVisible();
  await capture(page, "workspace-detail.png");

  const sourceResponse = await context.request.post(
    `/api/v1/workspaces/${workspaceId}/sources`,
    {
      multipart: {
        file: {
          name: "visual-launch-decision.md",
          mimeType: "text/markdown",
          buffer: Buffer.from(sourceText, "utf8"),
        },
      },
    },
  );
  expect(sourceResponse.status()).toBe(201);
  const sourcePayload = (await sourceResponse.json()) as {
    ok: true;
    data: { document: { attachment: { id: string } } };
  };
  const attachmentId = sourcePayload.data.document.attachment.id;
  expect(attachmentId).toBeTruthy();

  await page.goto(
    `/workspaces/${workspaceId}/sources/${attachmentId}?status=uploaded`,
  );
  await expect(
    page.getByText("visual-launch-decision.md", { exact: true }),
  ).toBeVisible();
  await capture(page, "source-detail.png");

  await page.goto(`/workspaces/${workspaceId}/conversations`);
  await page.getByLabel("عنوان اختياري").fill("Visual launch decision");
  await page.getByRole("button", { name: "إنشاء وفتح المحادثة" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/conversations\/[0-9a-f-]+\?status=created$/u,
  );
  await enableWorkspaceGrounding(page);
  await page
    .getByLabel("اكتب رسالة")
    .fill("What does the saved launch decision confirm?");
  await page.getByRole("button", { name: "إرسال" }).click();
  await expect(
    page.getByText(
      "The saved workspace passage supports this deterministic answer [S1].",
      { exact: true },
    ),
  ).toBeVisible();
  await capture(page, "conversation-detail.png");

  await page.getByLabel("البداية").selectOption("memo");
  await page.getByRole("button", { name: "إنشاء المسودة" }).click();
  await expect(page).toHaveURL(
    /\/workspaces\/[0-9a-f-]+\/drafts\/[0-9a-f-]+\?status=created$/u,
  );
  await expect(
    page.getByRole("textbox", { name: "محتوى المسودة", exact: true }),
  ).toBeVisible();
  await capture(page, "draft-detail.png");

  await page.goto("/settings/ai");
  await expect(
    page.getByRole("heading", { name: /إعدادات الذكاء الاصطناعي/u }),
  ).toBeVisible();
  await capture(page, "ai-settings.png");
});
