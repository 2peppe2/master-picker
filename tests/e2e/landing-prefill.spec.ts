import { expect, test } from "@playwright/test";

test(
  [
    "prefills a 2022 Mjukvaruteknik schedule when master",
    "selection is deferred",
  ].join(" "),
  async ({ page }) => {
    await page.goto("/?program=6CMJU&year=2022&lang=en");

    await page.getByRole("button", { name: "Pick master later" }).click();

    await expect(page).toHaveURL(/\/dashboard\?/);
    expect(new URL(page.url()).searchParams.get("schedule")).toBeTruthy();
    await expect(page.locator("[data-semester-index]").first()).toBeVisible();
  },
);
