import { test, expect } from "@playwright/test";

test("desktop nav has the four destinations", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
  await expect(links).toHaveText(["Products", "Services", "Web design", "Contact"]);
  await expect(links.nth(2)).toHaveAttribute("href", "/web-design");
});

test("desktop nav click scrolls to the section", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
  await page.waitForTimeout(2000);
  const top = await page.locator("#contact").evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top)).toBeLessThan(120);
});

test("mobile menu: 44px toggle, opens, closes on Escape", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  const box = await toggle.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Products" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("mobile menu closes and unlocks scroll when resized to desktop", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("skip link is the first tab stop", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
