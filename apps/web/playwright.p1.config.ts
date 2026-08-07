import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e/p1",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["line"],
    ["html", { outputFolder: "playwright-report/p1", open: "never" }],
    ["junit", { outputFile: "test-results/p1-junit.xml" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "p1-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120000,
  },
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});
