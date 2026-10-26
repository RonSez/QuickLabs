import { test, expect } from "@playwright/test";

const goToY = (page: import("@playwright/test").Page, y: number) =>
  page.evaluate((top) => window.scrollTo(0, top), y);

test("scroll reveals replay after scrolling back above them", async ({ page }) => {
  await page.goto("/web-design");
  await page.evaluate(() => document.fonts.ready);
  const top = await page.evaluate(() => {
    const el = document.querySelector("[data-receipt]")!;
    return el.getBoundingClientRect().top + window.scrollY;
  });
  const item = page.locator("[data-receipt] [data-item]").first();
  const opacity = () => item.evaluate((el) => Number(getComputedStyle(el).opacity));

  await goToY(page, top - 200);
  await page.waitForTimeout(1500);
  expect(await opacity()).toBe(1);

  await goToY(page, 0);
  await page.waitForTimeout(600);
  expect(await opacity()).toBe(0);

  await goToY(page, top - 200);
  await page.waitForTimeout(1500);
  expect(await opacity()).toBe(1);
});
