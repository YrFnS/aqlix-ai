import { test, expect } from '@playwright/test';

test.describe('Arabic RTL Support', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should display Arabic text correctly with RTL direction', async ({ page }) => {
    // Test Arabic text rendering
    const arabicText = 'مرحباً بكم في نظام الذكاء الاصطناعي العراقي';

    // Create a test element with Arabic text
    await page.evaluate((text) => {
      const element = document.createElement('div');
      element.id = 'arabic-test';
      element.textContent = text;
      element.className = 'font-arabic rtl-layout';
      document.body.appendChild(element);
    }, arabicText);

    // Check that the element exists and has correct direction
    const testElement = page.locator('#arabic-test');
    await expect(testElement).toBeVisible();

    // Check RTL direction
    const direction = await testElement.evaluate(el =>
      window.getComputedStyle(el).direction
    );
    expect(direction).toBe('rtl');

    // Check text alignment
    const textAlign = await testElement.evaluate(el =>
      window.getComputedStyle(el).textAlign
    );
    expect(textAlign).toBe('right');
  });

  test('should handle mixed Arabic-English content correctly', async ({ page }) => {
    const mixedText = 'مرحباً Hello العالم World';

    await page.evaluate((text) => {
      const element = document.createElement('div');
      element.id = 'mixed-test';
      element.textContent = text;
      element.className = 'font-arabic';
      document.body.appendChild(element);
    }, mixedText);

    const testElement = page.locator('#mixed-test');
    await expect(testElement).toBeVisible();
    await expect(testElement).toContainText(mixedText);
  });

  test('should support Iraqi dialect text input', async ({ page }) => {
    // Create an input field for testing
    await page.evaluate(() => {
      const input = document.createElement('input');
      input.id = 'iraqi-input';
      input.type = 'text';
      input.className = 'font-arabic rtl-layout';
      input.placeholder = 'اكتب شيء بالعراقي...';
      document.body.appendChild(input);
    });

    const iraqiInput = page.locator('#iraqi-input');
    await expect(iraqiInput).toBeVisible();

    // Test Iraqi dialect input
    const iraqiText = 'شلونك اليوم؟ شكو ماكو؟';
    await iraqiInput.fill(iraqiText);

    await expect(iraqiInput).toHaveValue(iraqiText);
  });

  test('should render Arabic numbers correctly', async ({ page }) => {
    const arabicNumbers = '١٢٣٤٥٦٧٨٩٠';
    const englishNumbers = '1234567890';

    await page.evaluate((arabicNums, englishNums) => {
      const arabicDiv = document.createElement('div');
      arabicDiv.id = 'arabic-numbers';
      arabicDiv.textContent = `Arabic: ${arabicNums}`;
      arabicDiv.className = 'font-arabic';

      const englishDiv = document.createElement('div');
      englishDiv.id = 'english-numbers';
      englishDiv.textContent = `English: ${englishNums}`;

      document.body.appendChild(arabicDiv);
      document.body.appendChild(englishDiv);
    }, arabicNumbers, englishNumbers);

    await expect(page.locator('#arabic-numbers')).toContainText(arabicNumbers);
    await expect(page.locator('#english-numbers')).toContainText(englishNumbers);
  });

  test('should handle responsive design with RTL', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'responsive-test';
      container.style.cssText = `
        width: 100%;
        padding: 16px;
        background: #f0f0f0;
        direction: rtl;
        text-align: right;
      `;
      container.textContent = 'نص تجريبي للتصميم المتجاوب مع العربية';
      document.body.appendChild(container);
    });

    const responsiveElement = page.locator('#responsive-test');
    await expect(responsiveElement).toBeVisible();

    // Check that it adapts to mobile view
    const boundingBox = await responsiveElement.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });

  test('should support keyboard navigation in RTL', async ({ page }) => {
    // Create a form with RTL inputs
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.id = 'rtl-form';
      form.innerHTML = `
        <input id="field1" type="text" placeholder="الحقل الأول" style="direction: rtl; margin: 8px;" />
        <input id="field2" type="text" placeholder="الحقل الثاني" style="direction: rtl; margin: 8px;" />
        <button type="submit" style="margin: 8px;">إرسال</button>
      `;
      document.body.appendChild(form);
    });

    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('#field1')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#field2')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });
});