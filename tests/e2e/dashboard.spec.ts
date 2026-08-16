import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const dashboardUrl = "/dashboard?program=6CMJU&year=2025&lang=en";
const earlierDashboardUrl = "/dashboard?program=6CMJU&year=2022&lang=en";

test.describe("dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(dashboardUrl);
    await expect(page.locator("[data-semester-index]").first()).toBeVisible();
  });

  test("expands and collapses a semester without blocking interaction", async ({
    page,
  }) => {
    const trigger = page
      .locator("[data-semester-index]")
      .first()
      .locator('button[data-slot="collapsible-trigger"]');

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    const startedAt = performance.now();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(performance.now() - startedAt).toBeLessThan(500);
  });

  test("opens and positions the current term in the schedule viewport", async ({
    page,
  }) => {
    await page.goto(earlierDashboardUrl);

    const scheduleScroll = page.locator("[data-dashboard-schedule-scroll]");
    const currentSemester = page.locator('[data-current-semester="true"]');

    await expect(currentSemester).toBeVisible();
    await expect(
      currentSemester.locator('button[data-slot="collapsible-trigger"]'),
    ).toHaveAttribute("aria-expanded", "true", { timeout: 10_000 });

    await expect
      .poll(
        async () =>
          currentSemester.evaluate((semester) => {
            const scrollContainer = semester.closest(
              "[data-dashboard-schedule-scroll]",
            );
            const stickyHeader = scrollContainer?.querySelector(
              "[data-dashboard-schedule-sticky-header]",
            );

            return Math.abs(
              semester.getBoundingClientRect().top -
                ((scrollContainer?.getBoundingClientRect().top ?? 0) +
                  (stickyHeader?.getBoundingClientRect().height ?? 0) +
                  16),
            );
          }),
        { timeout: 10_000 },
      )
      .toBeLessThanOrEqual(2);
    await expect(scheduleScroll).toBeVisible();

    await scheduleScroll.evaluate((element) => {
      element.scrollTop = 0;
    });
    await page.waitForTimeout(100);
    expect(await scheduleScroll.evaluate((element) => element.scrollTop)).toBe(
      0,
    );
  });

  test("keeps semester filters synchronized with semester expansion", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) <= 1023,
      "Desktop filter badge only",
    );

    const semesterCard = page.locator("[data-semester-index]").nth(1);
    const trigger = semesterCard.locator(
      'button[data-slot="collapsible-trigger"]',
    );
    const semester =
      Number(await semesterCard.getAttribute("data-semester-index")) + 1;
    const filter = page.locator('[data-slot="course-filter"]');

    await trigger.click();
    await expect(filter).toContainText(String(semester));

    await trigger.click();
    await expect(filter).not.toContainText(String(semester));
  });

  test("excludes a level from the compact filter panel", async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) > 1023,
      "Compact filter panel only",
    );

    // Phones put the drawer behind a tab; tablets show it alongside.
    const searchTab = page.getByRole("tab", { name: "Search" });
    if (await searchTab.isVisible()) await searchTab.click();

    const chips = page.getByLabel("Active filters");
    const chipCount = await chips.getByRole("button").count();

    await page.getByRole("button", { name: "Filters" }).click();

    // The panel drills down by category, the same way the desktop dropdown
    // does: category, then polarity, then options.
    await page.getByRole("button", { name: "Levels" }).click();
    await page.getByRole("button", { name: "Exclude" }).click();
    await page.getByRole("checkbox", { name: "Advanced" }).check();
    await page.getByRole("button", { name: "Close filters" }).click();

    // The chip only becomes reachable once the sheet stops hiding the page.
    const excludedChip = chips.getByRole("button").last();
    await expect(chips.getByRole("button")).toHaveCount(chipCount + 1);
    await expect(excludedChip).toContainText("Advanced");

    await excludedChip.click();
    await expect(chips.getByRole("button")).toHaveCount(chipCount);
  });

  test("keeps the sidebar back button's hit area on its own content", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) <= 1023,
      "Desktop sidebar header only",
    );

    const back = page.locator('a[href="/"]').first();
    await expect(back).toBeVisible();

    const geometry = await back.evaluate((link) => {
      const label = [...link.querySelectorAll("span")].find(
        (span) => span.textContent?.trim() === "MasterPicker",
      )!;
      const linkRect = link.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const besideLabel = document.elementFromPoint(
        labelRect.right + 25,
        linkRect.top + linkRect.height / 2,
      );

      return {
        overhang: linkRect.right - labelRect.right,
        capturesSpaceBesideLabel: link.contains(besideLabel),
      };
    });

    // The blank space beside the title belongs to the header, not the link.
    expect(geometry.capturesSpaceBesideLabel).toBe(false);
    expect(geometry.overhang).toBeLessThanOrEqual(12);
  });

  test("walks back out of the filter panel by pressing the title", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) > 1023,
      "Compact filter panel only",
    );

    const searchTab = page.getByRole("tab", { name: "Search" });
    if (await searchTab.isVisible()) await searchTab.click();

    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByRole("button", { name: "Levels" }).click();
    await page.getByRole("button", { name: "Exclude" }).click();

    // The heading is part of the back control, not just the chevron.
    await page.getByRole("button", { name: /^Back: Exclude levels$/ }).click();
    await expect(
      page.getByRole("button", { name: /^Back: Levels$/ }),
    ).toBeVisible();

    await page.getByRole("button", { name: /^Back: Levels$/ }).click();
    await expect(page.getByRole("button", { name: "Examinations" })).toBeVisible();
  });

  test("has no automatically detectable accessibility violations", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page }).include("main").analyze();
    expect(results.violations).toEqual([]);
  });

  test(
    [
      "opens course dialogs from title text without",
      "activating its blank area",
    ].join(" "),
    async ({ page }) => {
      if ((page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) <= 1023) {
        await page.locator("#dashboard-search-tab").click();
      }

      const title = page.locator('[data-slot="course-card-title"]').first();
      const titleTrigger = title.locator(
        '[data-slot="course-card-title-trigger"]',
      );
      const code = title
        .locator('xpath=ancestor::*[@data-slot="card"][1]')
        .locator('[data-slot="course-card-code"]');

      const description = title.locator("xpath=..");

      await expect(title).toBeVisible();
      await expect(code).toHaveCSS("font-size", "16px");
      await expect(title).toHaveCSS("-webkit-line-clamp", "2");
      await expect(titleTrigger).toHaveCSS("text-decoration-line", "none");
      expect(await title.getAttribute("class")).toContain(
        "max-w-[calc(100%-1rem)]",
      );

      const descriptionHeights = await page
        .locator('[data-slot="course-card-title"]')
        .evaluateAll((titles) =>
          titles.map(
            (title) => title.parentElement?.getBoundingClientRect().height ?? 0,
          ),
        );
      expect(descriptionHeights.every((height) => height === 40)).toBe(true);

      const supportsHover = await title.evaluate(
        () => window.matchMedia("(hover: hover)").matches,
      );
      if (supportsHover) {
        await titleTrigger.hover();
        await expect(titleTrigger).toHaveCSS(
          "text-decoration-line",
          "underline",
        );
      }

      expect(await titleTrigger.getAttribute("tabindex")).toBeNull();
      await titleTrigger.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();

      const descriptionBox = await description.boundingBox();
      expect(descriptionBox).not.toBeNull();
      await page.mouse.click(
        (descriptionBox?.x ?? 0) + (descriptionBox?.width ?? 0) - 2,
        (descriptionBox?.y ?? 0) + (descriptionBox?.height ?? 0) - 2,
      );
      await expect(page.getByRole("dialog")).not.toBeVisible();
    },
  );

  test("uses the shared 20 px card inset for titles and badges", async ({
    page,
  }) => {
    if ((page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) <= 1023) {
      await page.locator("#dashboard-search-tab").click();
    }

    const title = page.locator('[data-slot="course-card-title"]').first();
    const card = title.locator('xpath=ancestor::*[@data-slot="card"][1]');
    const header = card.locator('[data-slot="card-header"]');
    const footer = card.locator('[data-slot="card-footer"]');

    await expect(title).toBeVisible();
    expect(
      await header.evaluate((element) => getComputedStyle(element).paddingLeft),
    ).toBe("20px");
    expect(
      await footer.evaluate(
        (element) => getComputedStyle(element).paddingRight,
      ),
    ).toBe("20px");
  });

  test("uses the resting card presentation for the inert drag overlay", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) <= 1023,
      "Desktop drag overlay only",
    );

    const restingTitle = page
      .locator('[data-slot="course-card-title"]')
      .first();
    const restingCard = restingTitle.locator(
      'xpath=ancestor::*[@data-slot="card"][1]',
    );
    const cardBox = await restingCard.boundingBox();
    expect(cardBox).not.toBeNull();

    // Start from the non-interactive right edge of the reserved title area.
    await page.mouse.move(
      (cardBox?.x ?? 0) + (cardBox?.width ?? 0) - 10,
      (cardBox?.y ?? 0) + (cardBox?.height ?? 0) / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      (cardBox?.x ?? 0) + (cardBox?.width ?? 0) - 8,
      (cardBox?.y ?? 0) + (cardBox?.height ?? 0) / 2 + 1,
    );

    const overlay = page.locator(
      '[data-slot="card"][aria-hidden="true"][class*="cursor-grabbing"]',
    );
    const overlayTitle = overlay.locator('[data-slot="course-card-title"]');

    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveCSS("pointer-events", "none");
    await expect(overlay.locator('[data-slot="course-card-code"]')).toHaveCSS(
      "font-size",
      await restingCard
        .locator('[data-slot="course-card-code"]')
        .evaluate((element) => getComputedStyle(element).fontSize),
    );
    await expect(overlayTitle).toHaveCSS(
      "-webkit-line-clamp",
      await restingTitle.evaluate(
        (element) => getComputedStyle(element).webkitLineClamp,
      ),
    );
    await expect(overlay.locator('[data-slot="card-footer"]')).toContainText(
      await restingCard.locator('[data-slot="card-footer"]').innerText(),
    );

    await page.mouse.up();
  });

  test(
    ["switches master requirement tooltips immediately", "between badges"].join(
      " ",
    ),
    async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(dashboardUrl);

      const badges = page.locator("[data-master-progress-badge]:visible");
      const tooltip = page.locator(
        '[data-slot="tooltip-content"][data-state$="open"]',
      );

      await expect(badges.nth(1)).toBeVisible();
      await badges.nth(0).hover();
      await expect(tooltip).toHaveCount(1);

      await badges.nth(1).hover();
      await expect(tooltip).toHaveCount(1);
    },
  );

  test("supports keyboard navigation between compact dashboard tabs", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) > 1023,
      "Compact view only",
    );

    const scheduleTab = page.locator("#dashboard-schedule-tab");
    const searchTab = page.locator("#dashboard-search-tab");

    await expect(scheduleTab).toBeVisible();
    await expect(searchTab).toBeVisible();
    await expect
      .poll(async () => {
        const box = await scheduleTab.boundingBox();
        return (box?.y ?? Number.POSITIVE_INFINITY) + (box?.height ?? 0);
      })
      .toBeLessThanOrEqual(
        page.viewportSize()?.height ?? Number.POSITIVE_INFINITY,
      );

    await scheduleTab.focus();
    await scheduleTab.press("ArrowRight");

    await expect(searchTab).toBeFocused();
    await expect(searchTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#dashboard-schedule-panel")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test(
    [
      "adds a selected multi-occasion course from the phone",
      "bottom sheet",
    ].join(" "),
    async ({ page }) => {
      test.skip(
        (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) > 639,
        "Semester choices use a popover outside phone-sized layouts",
      );

      await page.locator("#dashboard-search-tab").click();
      await page.getByRole("textbox", { name: "Search" }).fill("TDDD53");

      await page
        .getByRole("button", { name: "Add TDDD53", exact: true })
        .click();

      const sheet = page.getByRole("dialog");
      const semesterSeven = sheet.locator(
        '[data-course-occasion-semester="7"]',
      );
      const semesterNine = sheet.locator('[data-course-occasion-semester="9"]');

      await expect(semesterSeven).toBeVisible();
      await expect(semesterNine).toBeVisible();
      await expect(sheet).toContainText("Add TDDD53");
      expect(
        await sheet
          .locator("[data-course-occasion-semester]")
          .evaluateAll((rows) =>
            rows.map((row) =>
              row.getAttribute("data-course-occasion-semester"),
            ),
          ),
      ).toEqual(["7", "9"]);

      await semesterNine.getByRole("button", { name: "Add course" }).click();

      await expect(sheet).not.toBeVisible();
      await expect(
        page.locator('#dashboard-schedule-panel [data-course-code="TDDD53"]'),
      ).toBeVisible();
    },
  );

  test("adds a single-occasion course directly on phones", async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) > 639,
      "Semester choices use a popover outside phone-sized layouts",
    );

    await page.locator("#dashboard-search-tab").click();
    await page.getByRole("textbox", { name: "Search" }).fill("TANA21");
    await page.getByRole("button", { name: "Add TANA21", exact: true }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(
      page.locator('#dashboard-schedule-panel [data-course-code="TANA21"]'),
    ).toBeVisible();
  });

  test("opens ordered semester choices in a desktop popover", async ({
    page,
  }) => {
    test.skip(
      (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) <= 1023,
      "Semester choices use a bottom sheet in compact layouts",
    );

    await page.getByRole("button", { name: "Add TDDD04", exact: true }).click();

    const picker = page.locator('[data-slot="popover-content"]');
    const semesterSeven = picker.getByRole("button", { name: /Semester 7/ });
    const semesterNine = picker.getByRole("button", { name: /Semester 9/ });

    await expect(semesterSeven).toBeVisible();
    await expect(semesterNine).toBeVisible();
    expect((await semesterSeven.boundingBox())?.y).toBeLessThan(
      (await semesterNine.boundingBox())?.y ?? Number.POSITIVE_INFINITY,
    );
  });
});
