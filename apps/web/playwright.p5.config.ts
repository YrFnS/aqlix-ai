import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e/p5",
  outputDir: "test-results/p5/artifacts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["line"],
    ["html", { outputFolder: "playwright-report/p5", open: "never" }],
    ["junit", { outputFile: "test-results/p5/junit.xml" }],
    ["json", { outputFile: "test-results/p5/results.json" }],
  ],
  use: {
    baseURL,
    locale: "ar-IQ",
    timezoneId: "Asia/Baghdad",
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "p5-desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "p5-tablet-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 1366 },
        hasTouch: true,
      },
    },
    {
      name: "p5-mobile-chromium",
      use: { ...devices["Pixel 5"] },
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
  timeout: 90000,
  expect: {
    timeout: 15000,
  },
});
