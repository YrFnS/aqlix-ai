import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";
const desktopViewport = { width: 1440, height: 900 };

export default defineConfig({
  testDir: "./tests/e2e/p5",
  outputDir: "test-results/p5-authenticated/artifacts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["line"],
    [
      "html",
      {
        outputFolder: "playwright-report/p5-authenticated",
        open: "never",
      },
    ],
    ["junit", { outputFile: "test-results/p5-authenticated/junit.xml" }],
    ["json", { outputFile: "test-results/p5-authenticated/results.json" }],
  ],
  use: {
    baseURL,
    viewport: desktopViewport,
    locale: "ar-IQ",
    timezoneId: "Asia/Baghdad",
    actionTimeout: 20000,
    navigationTimeout: 45000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "p5-authenticated-chromium",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
        viewport: desktopViewport,
      },
    },
    {
      name: "p5-authenticated-firefox",
      use: {
        ...devices["Desktop Firefox"],
        browserName: "firefox",
        viewport: desktopViewport,
      },
    },
    {
      name: "p5-authenticated-webkit",
      use: {
        ...devices["Desktop Safari"],
        browserName: "webkit",
        viewport: desktopViewport,
      },
    },
  ],
  webServer: {
    command: "bun run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
  timeout: 300000,
  expect: {
    timeout: 25000,
  },
});
