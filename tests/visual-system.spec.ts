import { test, expect } from "@playwright/test";

test("page uses ink background and Bricolage", async ({ page }) => {
  await page.goto("/");
  const s = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    return { bg: cs.backgroundColor, font: cs.fontFamily };
  });
  expect(s.bg).toBe("rgb(13, 13, 11)");
  expect(s.font).toMatch(/Bricolage/i);
});

test("header shows a typeset wordmark instead of the PNG logo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header img")).toHaveCount(0);
  await expect(page.locator("header").getByText("QuickLabs", { exact: true })).toBeVisible();
});
