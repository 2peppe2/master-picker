import { expect, test } from "@playwright/test";

import { layoutTier, isLandscapePhone, revealSearchPanel } from "./utils/viewport";

const dashboardUrl = "/dashboard?program=6CMJU&year=2025&lang=en";

/*
 * Which direction an overlay comes from, and whether a full-height one still
 * dresses itself as a sheet. Both are easy to flip by accident: the direction
 * is decided several components above the sheet itself, and the fullscreen
 * treatment is inferred from the snap points rather than passed explicitly.
 */
test.describe("portrait phone sheets", () => {
  test.skip(
    ({ page }) => layoutTier(page) !== "phone" || isLandscapePhone(page),
    "covers the portrait phone shell only",
  );

  test("master requirements come up from the bottom, still a sheet", async ({
    page,
  }) => {
    await page.goto(dashboardUrl);

    const badge = page.locator("[data-master-progress-badge]:visible").first();
    await expect(badge).toBeVisible();
    await badge.click();

    const drawer = page.locator("[data-vaul-drawer]");
    await expect(drawer).toBeVisible();
    await expect(page.locator("[data-slot='sheet-content']")).toHaveCount(0);

    // Opens at the half-height stop, so it keeps its handle and rounded top.
    await expect(page.locator("[data-vaul-handle]")).toBeVisible();
    await expect(drawer).not.toHaveCSS("border-top-left-radius", "0px");
  });

  test("the filter panel opens fullscreen with no handle", async ({ page }) => {
    await page.goto(dashboardUrl);
    await revealSearchPanel(page);

    await page.getByRole("button", { name: "Filters", exact: true }).click();

    const drawer = page.locator("[data-vaul-drawer]");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveCSS("border-top-left-radius", "0px");
    await expect(page.locator("[data-vaul-handle]")).toHaveCount(0);
  });
});
