import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  console.log('🧪 Setting up global E2E test environment for Iraqi AI Chat System');

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set Arabic RTL configuration globally
  await page.addInitScript(() => {
    // Set document direction for Arabic RTL testing
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar-IQ');

    // Add global CSS for Arabic font testing
    const style = document.createElement('style');
    style.textContent = `
      .font-arabic {
        font-family: 'Amiri', 'Noto Sans Arabic', 'Arial Unicode MS', sans-serif;
        direction: rtl;
        text-align: right;
      }
      .rtl-layout {
        direction: rtl;
      }
      .ltr-layout {
        direction: ltr;
      }
    `;
    document.head.appendChild(style);
  });

  // Test that the server is running correctly
  try {
    await page.goto('http://127.0.0.1:3000', { timeout: 10000 });
    console.log('✅ Development server is accessible');
  } catch (error) {
    console.error('❌ Development server not accessible:', error);
    throw new Error('Development server must be running for E2E tests');
  }

  await browser.close();

  // Set environment variables for testing
  process.env.TESTING_RTL = 'true';
  process.env.TESTING_ARABIC = 'true';
  process.env.CULTURAL_VALIDATION = 'strict';

  console.log('✅ Global E2E setup completed');
}

export default globalSetup;