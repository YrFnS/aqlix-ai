import AxeBuilder from "@axe-core/playwright";
import {
  expect,
  test,
  type Page,
  type TestInfo,
} from "@playwright/test";

async function settleFonts(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(
    dimensions.scrollWidth,
    `horizontal overflow: ${dimensions.scrollWidth}px content in ${dimensions.clientWidth}px viewport`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 2);
}

async function attachCriticalAxeAudit(
  page: Page,
  testInfo: TestInfo,
): Promise<void> {
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  await testInfo.attach(`axe-${testInfo.project.name}.json`, {
    body: Buffer.from(JSON.stringify(audit.violations, null, 2)),
    contentType: "application/json",
  });

  const critical = audit.violations.filter(
    (violation) => violation.impact === "critical",
  );
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
}

test("homepage keeps RTL, skip navigation, and critical accessibility intact", async ({
  page,
}, testInfo) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await settleFonts(page);

  await expect(page.locator("html")).toHaveAttribute("lang", /^ar(?:-|$)/u);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "أحضر السياق",
  );
  await expectNoHorizontalOverflow(page);

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "تجاوز إلى المحتوى" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main").first()).toBeFocused();

  await attachCriticalAxeAudit(page, testInfo);
  expect(pageErrors).toEqual([]);
});

test("mobile navigation behaves as a modal and restores focus", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "p5-mobile-chromium",
    "The modal navigation path is covered once in the dedicated mobile project.",
  );

  await page.goto("/");
  const trigger = page.getByRole("button", { name: "فتح القائمة" });
  await trigger.focus();
  await trigger.click();

  const dialog = page.getByRole("dialog", {
    name: "قائمة التنقل على الهاتف",
  });
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("hidden");
  await expect
    .poll(() =>
      dialog.evaluate((element) => element.contains(document.activeElement)),
    )
    .toBe(true);

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
});

const publicRoutes = [
  {
    name: "login",
    path: "/login?status=configuration",
    heading: "سجّل الدخول إلى مساحة عملك",
    formLabel: "نموذج تسجيل الدخول",
  },
  {
    name: "registration",
    path: "/register?status=configuration",
    heading: "أنشئ حساباً يحفظ سياقك",
    formLabel: "نموذج إنشاء الحساب",
  },
  {
    name: "not-found",
    path: "/p5-browser-quality-route-that-does-not-exist",
    heading: "الصفحة غير موجودة",
  },
] as const;

for (const route of publicRoutes) {
  test(`${route.name} route remains readable without horizontal overflow`, async ({
    page,
  }) => {
    const response = await page.goto(route.path);
    if (route.name === "not-found") {
      expect(response?.status()).toBe(404);
    } else {
      expect(response?.ok()).toBe(true);
    }

    await settleFonts(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      route.heading,
    );
    await expectNoHorizontalOverflow(page);

    if ("formLabel" in route) {
      await expect(page.getByRole("form", { name: route.formLabel })).toBeVisible();
    }
  });
}

test.describe("user preference modes", () => {
  test("dark and reduced-motion preferences produce a stable page", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.addInitScript(() => {
      document.documentElement.classList.add("dark");
    });
    await page.goto("/");
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await settleFonts(page);

    const preferences = await page.evaluate(() => ({
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      reducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches,
      longestAnimationMs: Math.max(
        0,
        ...document.getAnimations().map((animation) => {
          const duration = animation.effect?.getComputedTiming().duration;
          return typeof duration === "number" && Number.isFinite(duration)
            ? duration
            : 0;
        }),
      ),
    }));

    expect(preferences.colorScheme).toContain("dark");
    expect(preferences.reducedMotion).toBe(true);
    expect(preferences.longestAnimationMs).toBeLessThanOrEqual(20);
    await expectNoHorizontalOverflow(page);
  });
});
