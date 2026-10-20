import { test, expect } from "@playwright/test";
import { opacityOf, scrollToSection } from "./helpers";

const lastWord = "#manifesto [data-word]:last-child";

test("words start dim and brighten as the section scrolls past", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.waitForTimeout(500);
  expect(await opacityOf(page, lastWord)).toBeLessThan(0.5);
  await scrollToSection(page, "#manifesto", 1.2);
  expect(await opacityOf(page, lastWord)).toBeGreaterThan(0.95);
});

test("reduced motion: every word fully visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await opacityOf(page, lastWord)).toBe(1);
});

test("old About section is gone", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#about")).toHaveCount(0);
});
