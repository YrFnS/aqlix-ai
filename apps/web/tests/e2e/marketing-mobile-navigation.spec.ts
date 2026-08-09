import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile navigation covers the viewport", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "فتح القائمة" }).click();

  const navigation = page.getByRole("navigation", {
    name: "التنقل على الهاتف",
  });
  await expect(navigation).toBeVisible();

  const box = await navigation.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height - 1);
});
