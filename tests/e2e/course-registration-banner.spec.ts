import { expect, test } from "@playwright/test";

import { isDesktop } from "./utils/viewport";

const DASHBOARD_URL = "/dashboard?program=6CMJU&year=2025&lang=en";
const BEFORE_DEADLINE = new Date("2026-10-09T12:00:00Z");
const AFTER_DEADLINE = new Date("2026-10-10T22:00:00Z");

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install({ time: BEFORE_DEADLINE });
});

test("shows the reminder and Ladok link on every dashboard layout", async ({
  page,
}) => {
  await page.goto(DASHBOARD_URL);
  await expect(page.locator("[data-course-registration-reminder]")).toContainText("October 10 (only one day left).");

  const reminder = page.locator("[data-course-registration-reminder]");
  await expect(reminder).toBeVisible();
  await expect(reminder).toContainText(
    "register for next semester's courses by October 10",
  );
  await expect(reminder).toContainText("October 10 (only one day left).");
  await expect(reminder.getByRole("link", { name: "Ladok" })).toHaveAttribute(
    "href",
    "https://student.ladok.se/student/app/studentwebb/start",
  );
  await expect(page.locator("[data-mobile-support-announcement]")).toHaveCount(
    0,
  );

  const banner = reminder.locator("xpath=ancestor::div[contains(@class,'relative')][1]");
  const link = reminder.getByRole("link", { name: "Ladok" });
  const bannerBounds = await banner.boundingBox();
  const linkBounds = await link.boundingBox();
  expect(bannerBounds).not.toBeNull();
  expect(linkBounds).not.toBeNull();
  expect(linkBounds!.y).toBeGreaterThanOrEqual(bannerBounds!.y);
  expect(linkBounds!.y + linkBounds!.height).toBeLessThanOrEqual(
    bannerBounds!.y + bannerBounds!.height,
  );
});

test("rotates to the disclaimer after 25 seconds and back after 30", async ({
  page,
}) => {
  await page.goto(DASHBOARD_URL);
  await expect(page.locator("[data-course-registration-reminder]")).toContainText("October 10 (only one day left).");

  const reminder = page.locator("[data-course-registration-reminder]");
  const disclaimer = page.getByText("Master Picker is a third-party site");

  await expect(reminder).toBeVisible();
  await page.clock.runFor(24_000);
  await expect(reminder).toBeVisible();
  await page.clock.runFor(1_500);
  await expect(disclaimer).toBeVisible();
  await expect(reminder).toHaveCount(0);

  await page.clock.runFor(30_500);
  await expect(reminder).toBeVisible();
});

test("keeps the desktop dashboard full height on both slides", async ({
  page,
}) => {
  test.skip(!isDesktop(page), "Desktop layout only");

  await page.goto(DASHBOARD_URL);
  await expect(page.locator("[data-course-registration-reminder]")).toContainText("October 10 (only one day left).");

  const root = page.locator(".dashboard-page-root");
  const viewportHeight = page.viewportSize()?.height ?? 0;
  const rootHeight = async () => (await root.boundingBox())?.height ?? 0;

  await expect(page.locator("[data-course-registration-reminder]")).toBeVisible();
  expect(await rootHeight()).toBeCloseTo(viewportHeight, 0);

  await page.clock.runFor(25_500);
  await expect(page.getByText("Master Picker is a third-party site")).toBeVisible();
  expect(await rootHeight()).toBeCloseTo(viewportHeight, 0);
});

test("uses Swedish copy when Swedish is selected", async ({ page }) => {
  await page.goto("/dashboard?program=6CMJU&year=2025&lang=sv");

  const reminder = page.locator("[data-course-registration-reminder]");
  await expect(reminder).toContainText(
    "senast den 10 oktober",
  );
  await expect(reminder).toContainText("10 oktober (bara en dag kvar).");

  const bannerBounds = await reminder.locator("xpath=ancestor::div[contains(@class,'relative')][1]").boundingBox();
  const linkBounds = await reminder.getByRole("link", { name: "Ladok" }).boundingBox();
  expect(bannerBounds).not.toBeNull();
  expect(linkBounds).not.toBeNull();
  expect(linkBounds!.y + linkBounds!.height).toBeLessThanOrEqual(
    bannerBounds!.y + bannerBounds!.height,
  );
});

test("counts Stockholm calendar days and updates at midnight", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-10-03T12:00:00Z"));
  await page.goto(DASHBOARD_URL);
  const reminder = page.locator("[data-course-registration-reminder]");
  await expect(reminder).toContainText("October 10 (only 7 days left).");

  await page.clock.pauseAt(new Date("2026-10-09T21:59:50Z"));
  await page.goto(DASHBOARD_URL);
  await expect(reminder).toContainText("October 10 (only one day left).");
  await page.clock.runFor(11_000);
  await expect(reminder).toContainText("October 10 (last day!).");
});

test("expires at midnight in Stockholm and stays hidden", async ({ page }) => {
  await page.clock.pauseAt(new Date("2026-10-10T21:59:50Z"));
  await page.goto(DASHBOARD_URL);
  await expect(page.locator("[data-course-registration-reminder]")).toContainText("October 10 (last day!).");

  const reminder = page.locator("[data-course-registration-reminder]");
  const disclaimer = page.getByText("Master Picker is a third-party site");
  await expect(reminder).toBeVisible();

  await page.clock.runFor(11_000);
  await expect(reminder).toHaveCount(0);
  await expect(disclaimer).toBeVisible();

  await page.clock.runFor(60_000);
  await expect(reminder).toHaveCount(0);
});

test("starts on the disclaimer after the deadline", async ({ page }) => {
  await page.clock.setFixedTime(AFTER_DEADLINE);
  await page.goto(DASHBOARD_URL);

  await expect(page.locator("[data-course-registration-reminder]")).toHaveCount(0);
  await expect(page.getByText("Master Picker is a third-party site")).toBeVisible();
});

test("does not appear on other pages", async ({ page }) => {
  await page.goto("/about?lang=en");
  await expect(page.locator("[data-course-registration-reminder]")).toHaveCount(
    0,
  );

  await page.goto("/?lang=en");
  await expect(page.locator("[data-course-registration-reminder]")).toHaveCount(
    0,
  );
});
