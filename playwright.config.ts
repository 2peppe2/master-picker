import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
    {
      name: "mobile-chrome-landscape",
      use: { ...devices["Pixel 7 landscape"] },
    },
    {
      name: "mobile-safari-landscape",
      use: { ...devices["iPhone 13 landscape"] },
    },
    {
      name: "tablet-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 800, height: 1280 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "tablet-chrome-landscape",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "tablet-chrome-wide",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 1366 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
