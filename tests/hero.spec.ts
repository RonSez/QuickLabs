import { test, expect } from "@playwright/test";

/** "1" when every hero mask part sits at rest and every fade is fully opaque. */
const heroOpacity = (page: import("@playwright/test").Page) =>
  page.locator("#top [data-anim]").evaluate((gate) => {
    const partsAtRest = Array.from(gate.querySelectorAll("[data-mask-part]")).every(
      (p) => Math.abs(new DOMMatrix(getComputedStyle(p).transform).m42) < 1,
    );
    const fadesOpaque = Array.from(gate.querySelectorAll("[data-load-fade]")).every(
      (f) => getComputedStyle(f).opacity === "1",
    );
    return partsAtRest && fadesOpaque ? "1" : "0";
  });

test("hero wordmark is the h1 and is fully visible after load", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText("QuickLabs/studio");
  expect(await heroOpacity(page)).toBe("1");
  await expect(page.locator("canvas")).toHaveCount(0);
});

for (const path of ["/", "/web-design"]) {
  test(`${path}: hero reveal does not wait for app JavaScript (LCP)`, async ({ page }) => {
    await page.route("**/_next/static/chunks/**/*.js", (r) => r.abort());
    await page.goto(path);
    await page.waitForTimeout(1500);
    const state = await page.locator("main [data-anim]").first().evaluate((gate) => ({
      opacity: getComputedStyle(gate).opacity,
      parts: Array.from(gate.querySelectorAll("[data-mask-part]")).map(
        (p) => new DOMMatrix(getComputedStyle(p).transform).m42,
      ),
    }));
    expect(state.opacity).toBe("1");
    for (const y of state.parts) expect(Math.abs(y)).toBeLessThan(1);
  });
}

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

for (const path of ["/", "/web-design"]) {
  test(`phone landscape ${path}: headline and CTA both fit in the first screen`, async ({ page }, info) => {
    test.skip(info.project.name !== "mobile");
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(path);
    await page.waitForTimeout(2000);
    const cta = page.locator("main a", { hasText: "Start a project" }).filter({ visible: true }).first();
    const box = await cta.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(390);
    const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(h1!.y).toBeGreaterThanOrEqual(0);
  });
}

test("mobile: primary CTA is a full-width tap target", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const cta = page.locator("#top a", { hasText: "Start a project" }).filter({ visible: true });
  const box = await cta.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(48);
  expect(box!.width).toBeGreaterThan(page.viewportSize()!.width * 0.8);
});
