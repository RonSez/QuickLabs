import { test, expect } from "@playwright/test";

const heroOpacity = (page: import("@playwright/test").Page) =>
  page.locator("#top [data-anim]").evaluate((el) => getComputedStyle(el).opacity);

test("hero wordmark is the h1 and is fully visible after load", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText("QuickLabs/studio");
  expect(await heroOpacity(page)).toBe("1");
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("reduced motion: no motion-ok class and hero visible immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.classList.contains("motion-ok"))).toBe(false);
  expect(await heroOpacity(page)).toBe("1");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("hero is visible", async ({ page }) => {
    await page.goto("/");
    expect(await heroOpacity(page)).toBe("1");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("QuickLabs/studio");
  });
});

test("mobile: primary CTA is a full-width tap target", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const cta = page.locator("#top a", { hasText: "Start a project" }).filter({ visible: true });
  const box = await cta.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(48);
  expect(box!.width).toBeGreaterThan(page.viewportSize()!.width * 0.8);
});
