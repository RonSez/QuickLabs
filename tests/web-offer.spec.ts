import { test, expect } from "@playwright/test";
import { scrollToSection } from "./helpers";

const ctaBg = (page: import("@playwright/test").Page) =>
  page.locator("#web-offer [data-cta]").evaluate((el) => getComputedStyle(el).backgroundColor);

test("desktop: pinned site assembles and its CTA turns solid", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await scrollToSection(page, "#web-offer", 1.05);
  expect(await ctaBg(page)).toBe("rgb(236, 232, 223)");
});

test("touch: site assembles once in view", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  await page.locator("#web-offer [data-site]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  expect(await ctaBg(page)).toBe("rgb(236, 232, 223)");
});

test("links to the web design page and lists the care plan", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#web-offer a[href='/web-design']")).toHaveCount(1);
  await expect(page.locator("#web-offer dl > div")).toHaveCount(5);
});
