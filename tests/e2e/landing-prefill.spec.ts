import { expect, test } from "@playwright/test";

test("keeps password managers from mutating the landing selectors", async ({
  page,
}) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().toLowerCase().includes("hydrated")
    ) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto("/");

  const selectors = page.locator('[data-protonpass-ignore="true"]');
  await expect(selectors).toHaveCount(1);
  await expect(selectors.locator('button[data-slot="button"]')).toBeDisabled();
  expect(hydrationErrors).toEqual([]);
});

test(
  [
    "prefills a 2022 Mjukvaruteknik schedule when master",
    "selection is deferred",
  ].join(" "),
  async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on("console", (message) => {
      if (
        message.type() === "error" &&
        message.text().toLowerCase().includes("hydrated")
      ) {
        hydrationErrors.push(message.text());
      }
    });

    await page.goto("/?program=6CMJU&year=2022&lang=en");

    const pickLaterButton = page.getByRole("button", {
      name: "Pick master later",
    });
    await expect(pickLaterButton).toBeEnabled();
    expect(hydrationErrors).toEqual([]);
    await pickLaterButton.click();

    await expect(page).toHaveURL(/\/dashboard\?/);
    expect(new URL(page.url()).searchParams.get("schedule")).toBeTruthy();
    await expect(page.locator("[data-semester-index]").first()).toBeVisible();
  },
);
