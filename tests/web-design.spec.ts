import { test, expect } from "@playwright/test";
import { opacityOf } from "./helpers";

test("hero, six services and back link", async ({ page }) => {
  await page.goto("/web-design");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Websites, looked after.");
  await expect(page.locator("#build li")).toHaveCount(6);
  await expect(page.locator("a[href='/']", { hasText: "QuickLabs" }).first()).toBeVisible();
});

test("receipt ends with Ask us and shows no price", async ({ page }) => {
  await page.goto("/web-design");
  await expect(page.locator("[data-total]")).toContainText("Ask us");
  expect(await page.locator("body").innerText()).not.toMatch(/€|\$\d/);
});

test("receipt prints in when scrolled into view", async ({ page }) => {
  await page.goto("/web-design");
  await page.locator("[data-receipt]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  expect(await opacityOf(page, "[data-item]:last-child")).toBe(1);
  expect(await opacityOf(page, "[data-total]")).toBe(1);
});

test("reduced motion: receipt and list fully visible without scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/web-design");
  expect(await opacityOf(page, "[data-total]")).toBe(1);
  expect(await opacityOf(page, "#build li:last-child")).toBe(1);
});
