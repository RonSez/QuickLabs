import { test, expect } from "@playwright/test";
import { scrollToSection } from "./helpers";

test("desktop: keyboard reaches both pinned products and the focused one is shown", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await scrollToSection(page, "#products", 0.2);
  await page.locator("[data-chapter='rounds'] a[href='https://rounds.health']").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-chapter='redlines'] a[href='https://redlines.legal']")).toBeFocused();
  await page.waitForTimeout(1500);
  const opacity = await page
    .locator("[data-chapter='redlines']")
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(opacity).toBe(1);
});

test("mobile menu: focus moves in, stays out of the page, returns on Escape", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog.getByRole("link", { name: "Products" })).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("main"))).toBe(false);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("reduced motion: open menu locks page scroll", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.mouse.move(200, 400);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

for (const [w, h] of [
  [1366, 650],
  [1280, 600],
  [1024, 768],
  [1440, 900],
] as const) {
  test(`web offer at ${w}x${h}: when pinned, it fits between header and fold`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await scrollToSection(page, "#web-offer", 0.5);
    const m = await page.evaluate(() => {
      const sec = document.querySelector("#web-offer")!;
      const pinned = !!sec.parentElement?.classList.contains("pin-spacer");
      const header = document.querySelector("header")!.getBoundingClientRect().bottom;
      const label = sec.querySelector("h2")!.getBoundingClientRect().top;
      const link = sec.querySelector("a[href='/web-design']")!.getBoundingClientRect().bottom;
      return { pinned, header, label, link, vh: window.innerHeight };
    });
    if (m.pinned) {
      expect(m.label).toBeGreaterThanOrEqual(m.header);
      expect(m.link).toBeLessThanOrEqual(m.vh);
    }
  });
}

test("/web-design social cards use this page's text", async ({ page }) => {
  await page.goto("/web-design");
  await expect(page.locator("meta[name='twitter:title']")).toHaveAttribute("content", /Web design/);
  await expect(page.locator("meta[property='og:site_name']")).toHaveAttribute("content", "QuickLabs");
  await expect(page.locator("meta[property='og:url']")).toHaveAttribute("content", /\/web-design$/);
});
