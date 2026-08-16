import { expect, test } from "@playwright/test";

const isDesktop = (width: number | undefined) => (width ?? 0) >= 1024;

const DASHBOARD_URL = "/dashboard?program=6CMJU&year=2025&lang=en";

test("opens the desktop dashboard on the mobile-support announcement", async ({
  page,
}) => {
  test.skip(!isDesktop(page.viewportSize()?.width), "Desktop-only announcement");

  await page.goto(DASHBOARD_URL);

  const announcement = page.locator("[data-mobile-support-announcement]");
  await expect(announcement).toBeVisible();
  await expect(announcement).toContainText(
    "New: Master Picker now works on mobile.",
  );
  await expect(page.getByRole("button", { name: /dismiss/i })).toHaveCount(0);
});

test("keeps the dashboard full height on both slides", async ({ page }) => {
  test.skip(!isDesktop(page.viewportSize()?.width), "Desktop-only announcement");
  test.setTimeout(120_000);

  await page.goto(DASHBOARD_URL);

  const root = page.locator(".dashboard-page-root");
  const viewportHeight = page.viewportSize()?.height ?? 0;
  const rootHeight = async () => (await root.boundingBox())?.height ?? 0;

  // The rotating banner lives inside the dashboard, so neither slide may
  // shorten the page and expose a strip of background below it.
  await expect(page.locator("[data-mobile-support-announcement]")).toBeVisible();
  expect(await rootHeight()).toBeCloseTo(viewportHeight, 0);

  await expect(
    page.getByText("Master Picker is a third-party site"),
  ).toBeVisible({ timeout: 15_000 });
  expect(await rootHeight()).toBeCloseTo(viewportHeight, 0);
});

test("rotates from the announcement to the disclaimer and back", async ({
  page,
}) => {
  test.skip(!isDesktop(page.viewportSize()?.width), "Desktop-only announcement");
  test.setTimeout(120_000);

  await page.goto(DASHBOARD_URL);

  const announcement = page.locator("[data-mobile-support-announcement]");
  const disclaimer = page.getByText("Master Picker is a third-party site");

  await expect(announcement).toBeVisible();
  await expect(disclaimer).toBeHidden();

  // News holds for 10s, then the disclaimer takes over for 30s.
  await expect(disclaimer).toBeVisible({ timeout: 15_000 });
  await expect(announcement).toBeHidden();

  await expect(announcement).toBeVisible({ timeout: 40_000 });
});

test("does not show the mobile-support announcement on mobile", async ({
  page,
}) => {
  test.skip(isDesktop(page.viewportSize()?.width), "Non-desktop-only assertion");

  await page.goto(DASHBOARD_URL);

  await expect(page.locator("[data-mobile-support-announcement]")).toBeHidden();
  await expect(
    page.getByText("Master Picker is a third-party site"),
  ).toBeVisible();
});

test("does not show the mobile-support announcement at tablet width", async ({
  page,
}) => {
  test.skip(!isDesktop(page.viewportSize()?.width), "Desktop baseline only");

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(DASHBOARD_URL);

  await expect(page.locator("[data-mobile-support-announcement]")).toBeHidden();
});

test("uses Swedish copy when Swedish is selected", async ({ page }) => {
  test.skip(!isDesktop(page.viewportSize()?.width), "Desktop-only announcement");

  await page.goto("/dashboard?program=6CMJU&year=2025&lang=sv");

  await expect(page.locator("[data-mobile-support-announcement]")).toContainText(
    "Nu även på mobilen.",
  );
});

test("does not appear on other pages", async ({ page }) => {
  await page.goto("/about?lang=en");
  await expect(page.locator("[data-mobile-support-announcement]")).toHaveCount(
    0,
  );

  await page.goto("/?lang=en");
  await expect(page.locator("[data-mobile-support-announcement]")).toHaveCount(
    0,
  );
});
