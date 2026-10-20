import { test, expect } from "@playwright/test";
import { opacityOf, scrollThrough, scrollToSection } from "./helpers";

const lastInsWord = "[data-chapter='redlines'] [data-ins] [data-w]:last-child";
const lastNoteWord = "[data-chapter='rounds'] dl > div:last-child [data-w]:last-of-type";
const isPinned = (page: import("@playwright/test").Page) =>
  page.locator("#products").evaluate((el) => el.hasAttribute("data-pinned"));

test("desktop: pins and ends on the finished redline", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await scrollToSection(page, "#products", 0.2);
  expect(await isPinned(page)).toBe(true);
  await scrollToSection(page, "#products", 2.05);
  expect(await opacityOf(page, "[data-chapter='redlines']")).toBe(1);
  expect(await opacityOf(page, lastInsWord)).toBe(1);
});

test("desktop → phone resize unpins cleanly", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await scrollToSection(page, "#products", 0.5);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  expect(await isPinned(page)).toBe(false);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await scrollThrough(page);
  await page.waitForTimeout(2500);
  expect(await opacityOf(page, "[data-chapter='rounds']")).toBe(1);
  expect(await opacityOf(page, "[data-chapter='redlines']")).toBe(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("touch: chapters stack and each screen plays on entry", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  expect(await isPinned(page)).toBe(false);
  await page.locator("[data-chapter='redlines'] [data-screen]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  expect(await opacityOf(page, lastInsWord)).toBe(1);
});

test("reduced motion: both screens render finished", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await opacityOf(page, lastNoteWord)).toBe(1);
  expect(await opacityOf(page, lastInsWord)).toBe(1);
});

test("product links open the live sites", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#products a[href='https://rounds.health']")).toHaveCount(1);
  await expect(page.locator("#products a[href='https://redlines.legal']")).toHaveCount(1);
});
