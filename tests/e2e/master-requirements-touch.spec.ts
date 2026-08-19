import { expect, test } from "@playwright/test";

const dashboardUrl = "/dashboard?program=6CMJU&year=2025&lang=en";
const isTabletProject = () => test.info().project.name.startsWith("tablet-");

test.describe("touch tablet master requirements", () => {
  test.skip(() => !isTabletProject(), "covers touch tablet projects only");

  test("a master badge opens its requirements sheet on tap and keyboard", async ({
    page,
  }) => {
    await page.goto(dashboardUrl);

    const badge = page.locator("[data-master-progress-badge]:visible").first();
    await expect(badge).toBeVisible();
    await badge.tap();

    await expect(page.locator("[data-vaul-drawer]")).toBeVisible();
    await expect(
      page.locator("[data-slot='master-requirement-panel']"),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("[data-vaul-drawer]")).toHaveCount(0);
    await badge.focus();
    await badge.press("Enter");
    await expect(page.locator("[data-vaul-drawer]")).toBeVisible();
  });

  test("an overflow row opens its requirements sheet", async ({ page }) => {
    test.skip(
      test.info().project.name !== "tablet-chrome",
      "one touch project covers the compact overflow path",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(dashboardUrl);

    const moreBadge = page
      .locator(
        "[data-master-overflow-badge]:visible, [data-master-overflow-list-trigger]:visible",
      )
      .first();
    await expect(moreBadge).toBeVisible();
    await moreBadge.tap();

    const listDrawer = page.locator("[data-vaul-drawer]");
    const opensListInDrawer =
      (await moreBadge.getAttribute("data-master-overflow-badge")) !== null;
    if (opensListInDrawer) await expect(listDrawer).toBeVisible();

    const row = opensListInDrawer
      ? listDrawer.locator("[data-master-overflow-row]").first()
      : page.locator("[data-master-overflow-row]:visible").first();
    await expect(row).toBeVisible();
    await row.tap();

    await expect(
      page.locator("[data-slot='master-requirement-panel']"),
    ).toBeVisible();
  });

  test("an overflow sheet hands off to details without nesting drawers", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "tablet-chrome-wide",
      "the wide tablet uses the desktop overflow badge",
    );
    await page.goto(dashboardUrl);

    const moreBadge = page.locator("[data-master-overflow-badge]:visible");
    await expect(moreBadge).toBeVisible();
    await expect(moreBadge).toHaveAttribute(
      "data-master-overflow-presentation",
      "sheet",
    );
    await moreBadge.tap();

    const drawers = page.locator("[data-vaul-drawer]");
    await expect(drawers).toHaveCount(1);
    await drawers.locator("[data-master-overflow-row]").first().tap();

    await expect(drawers).toHaveCount(1);
    await expect(
      page.locator("[data-slot='master-requirement-panel']"),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawers).toHaveCount(0);
    await expect(moreBadge).toHaveAttribute("data-state", "closed");
  });

  test("the compact iPad filter opens from the bottom", async ({ page }) => {
    test.skip(
      test.info().project.name !== "tablet-chrome",
      "the compact portrait iPad renders the overlay filter",
    );
    await page.goto(dashboardUrl);
    await page.getByRole("tab", { name: "Search" }).click();
    await page.getByRole("button", { name: "Filters" }).click();

    const drawer = page.locator("[data-vaul-drawer]");
    await expect(drawer).toBeVisible();
    await expect(page.locator("[data-slot='sheet-content']")).toHaveCount(0);

    const viewport = page.viewportSize()!;
    const box = (await drawer.boundingBox())!;
    expect(box.y + box.height).toBeGreaterThanOrEqual(viewport.height - 2);
    expect(box.width).toBeGreaterThanOrEqual(viewport.width - 2);
  });
});
