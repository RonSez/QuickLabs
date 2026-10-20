import { test, expect } from "@playwright/test";

const titles = ["Compliance first.", "Where people already work.", "Built for specialists."];

test("three statements with intact accessible names", async ({ page }) => {
  await page.goto("/");
  for (const t of titles) {
    await expect(page.locator("#principles").getByRole("heading", { name: t })).toHaveCount(1);
  }
});

test("line masks finish fully revealed after scrolling in", async ({ page }) => {
  await page.goto("/");
  const last = page.locator("#principles h3").last();
  await last.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const offset = await last.evaluate((h) => {
    const line = h.querySelector(".mask-line");
    if (!line) return 0; // reduced motion / not split
    return Math.abs(line.getBoundingClientRect().top - line.parentElement!.getBoundingClientRect().top);
  });
  expect(offset).toBeLessThan(2);
});

test("reduced motion: statements are not split and are visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#principles .mask-line")).toHaveCount(0);
  await expect(page.locator("#principles h3").first()).toHaveText(titles[0]);
});
