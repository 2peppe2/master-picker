import { expect, test } from "@playwright/test";

import { isLandscapePhone } from "./utils/viewport";

const dashboardUrl = "/dashboard?program=6CMJU&year=2025&lang=en";

/*
 * These encode the arithmetic the landscape layout is built on, because that
 * is the part that silently drifts: the tile grid resolving to three lanes,
 * tiles staying square, and controls keeping a thumb-sized target even though
 * --spacing is scaled down around them.
 */
test.describe("landscape phone layout", () => {
  test.skip(
    ({ page }) => !isLandscapePhone(page),
    "covers the landscape phone shell only",
  );

  test("drawer lays out exactly three square tiles per row", async ({
    page,
  }) => {
    await page.goto(dashboardUrl);

    const tiles = page.locator("#dashboard-search-panel [data-slot='card']");
    await expect(tiles.first()).toBeVisible();

    const boxes = await tiles.evaluateAll((nodes) =>
      nodes.slice(0, 6).map((node) => {
        const { left, width, height } = node.getBoundingClientRect();
        return { left: Math.round(left), width, height };
      }),
    );

    expect(boxes.length).toBeGreaterThanOrEqual(3);

    // Three distinct left offsets among the first row-and-a-bit of tiles.
    const lanes = new Set(boxes.map((box) => box.left));
    expect(lanes.size).toBe(3);

    for (const box of boxes) {
      expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
    }
  });

  test("controls keep a thumb-sized target despite the density scale", async ({
    page,
  }) => {
    await page.goto(dashboardUrl);
    await expect(
      page.locator("#dashboard-search-panel [data-slot='card']").first(),
    ).toBeVisible();

    const undersized = await page
      .locator("[data-dashboard-landscape] [data-slot='button']")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const { width, height } = node.getBoundingClientRect();
            return width > 0 && height > 0;
          })
          .map((node) => {
            // The add button trades footprint for an ::after target, so measure
            // what a thumb can actually hit rather than the box itself.
            const after = getComputedStyle(node, "::after");
            const inset =
              after.content === "none" ? 0 : Math.abs(parseFloat(after.top)) || 0;
            const { width, height } = node.getBoundingClientRect();

            return {
              label: node.getAttribute("aria-label") ?? node.textContent ?? "",
              width: width + inset * 2,
              height: height + inset * 2,
            };
          })
          .filter((box) => box.width < 32 || box.height < 32),
      );

    expect(undersized).toEqual([]);
  });

  test("the master badge opens on tap", async ({ page }) => {
    await page.goto(dashboardUrl);

    // :visible skips the off-screen measurement template the overflow layout
    // keeps around to size the real badges. Keyed on the badge's own attribute
    // rather than data-slot, which the sheet trigger overwrites when it wraps.
    const badge = page
      .locator(
        "[data-dashboard-landscape] header [data-master-progress-badge]:visible",
      )
      .first();
    await expect(badge).toBeVisible();
    await badge.click();

    // A side sheet, not the hover-only tooltip a width breakpoint would have
    // given, and not a bottom sheet -- there is no height for one here.
    await expect(page.locator("[data-slot='sheet-content']")).toBeVisible();
    await expect(page.locator("[data-vaul-drawer]")).toHaveCount(0);
  });

  test("the settings menu opens from the side, not the bottom", async ({
    page,
  }) => {
    await page.goto(dashboardUrl);

    // Scoped to the header: the semesters have their own settings triggers.
    await page
      .locator("[data-dashboard-landscape] header")
      .getByRole("button", { name: "Settings" })
      .click();

    const sheet = page.locator("[data-slot='sheet-content']");
    await expect(sheet).toBeVisible();

    // A side sheet reaches the full height and hugs the right edge; a bottom
    // sheet would do the opposite.
    const viewport = page.viewportSize()!;
    const box = (await sheet.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(viewport.height - 2);
    expect(box.x + box.width).toBeGreaterThanOrEqual(viewport.width - 2);
    expect(box.width).toBeLessThan(viewport.width);
  });

  test("the course dialog goes fullscreen with a vertical rail", async ({
    page,
  }) => {
    await page.goto(dashboardUrl);

    const code = page.locator("[data-slot='course-card-code']").first();
    await expect(code).toBeVisible();
    await code.click();

    const content = page.locator("[data-slot='dialog-content']");
    await expect(content).toBeVisible();

    const viewport = page.viewportSize()!;
    const box = (await content.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(viewport.width - 2);
    expect(box.height).toBeGreaterThanOrEqual(viewport.height - 2);

    // The rail sits left of the panels, not above them.
    const list = page.locator("[data-slot='dialog-content'] [role='tablist']");
    await expect(list).toHaveAttribute("data-orientation", "vertical");

    const listBox = (await list.boundingBox())!;
    const panel = (
      await page
        .locator("[data-slot='dialog-content'] [role='tabpanel']")
        .first()
        .boundingBox()
    )!;
    expect(listBox.x + listBox.width).toBeLessThanOrEqual(panel.x + 1);
  });
});

test.describe("landscape phone pages do not overflow sideways", () => {
  test.skip(
    ({ page }) => !isLandscapePhone(page),
    "covers the landscape phone shell only",
  );

  for (const path of ["/", "/about"]) {
    test(`${path} fits its viewport width`, async ({ page }) => {
      await page.goto(path);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );

      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
