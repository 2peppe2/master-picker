import { expect, test } from "@playwright/test";

const dashboardUrl = "/dashboard?program=6CMJU&year=2025&lang=en";

test("dashboard loading shell matches the viewport layout", async ({
  browser,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium");

  const cases = [
    {
      expected: "compact",
      viewport: { width: 390, height: 844 },
    },
    {
      expected: "compact",
      viewport: { width: 800, height: 1280 },
    },
    {
      expected: "landscape",
      viewport: { width: 844, height: 390 },
    },
    {
      expected: "desktop",
      viewport: { width: 1280, height: 800 },
    },
  ] as const;

  for (const testCase of cases) {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: testCase.viewport,
    });
    const page = await context.newPage();
    await page.goto(dashboardUrl);

    await expect(page.locator("[data-dashboard-loading=true]")).toBeVisible();
    await expect(
      page.locator(
        `[data-dashboard-loading-layout=${testCase.expected}]`,
      ),
    ).toBeVisible();
    await expect(
      page.locator("[data-dashboard-loading-layout]:visible"),
    ).toHaveCount(1);

    await context.close();
  }
});
