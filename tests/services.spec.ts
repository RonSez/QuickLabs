import { test, expect } from "@playwright/test";

test("touch: every service shows its description", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const rows = page.locator("#services .svc-row");
  await expect(rows).toHaveCount(4);
  for (const row of await rows.all()) {
    await row.scrollIntoViewIfNeeded();
    await expect(row.locator("p")).toBeVisible();
  }
});

test("desktop: hovering a row dims the others", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const rows = page.locator("#services .svc-row");
  await rows.nth(1).scrollIntoViewIfNeeded();
  await rows.nth(1).hover();
  await page.waitForTimeout(500);
  const first = await rows.nth(0).evaluate((el) => Number(getComputedStyle(el).opacity));
  const hovered = await rows.nth(1).evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(first).toBeLessThan(0.5);
  expect(hovered).toBe(1);
});

test("no icon boxes in services", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#services svg")).toHaveCount(0);
});
