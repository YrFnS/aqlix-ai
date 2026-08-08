import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e/p4",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["line"],
    ["html", { outputFolder: "playwright-report/p4", open: "never" }],
    ["junit", { outputFile: "test-results/p4-junit.xml" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "p4-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120000,
  },
  timeout: 150000,
  expect: {
    timeout: 15000,
  },
});
