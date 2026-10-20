import { test, expect } from "@playwright/test";

for (const path of ["/", "/web-design"]) {
  test(`${path}: contact is mailto only`, async ({ page }) => {
    await page.goto(path);
    const mail = page.locator("#contact a[href^='mailto:']");
    await expect(mail.first()).toHaveAttribute("href", "mailto:info@quicklabs.ai");
    await expect(page.locator("a[href*='mail.google.com']")).toHaveCount(0);
    await expect(page.locator("#contact a[href='https://rounds.health']")).toHaveCount(1);
  });
}

test("loading /#contact lands on the contact section", async ({ page }) => {
  await page.goto("/#contact");
  await page.waitForTimeout(2000);
  const top = await page.locator("#contact").evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top)).toBeLessThan(120);
});

test("mobile: email button is a large tap target", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const btn = page.locator("#contact").getByRole("link", { name: /Email us/ });
  await btn.scrollIntoViewIfNeeded();
  const box = await btn.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(48);
  expect(box!.width).toBeGreaterThan(page.viewportSize()!.width * 0.8);
});

test("no separate site footer outside the closer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body > footer, main + footer")).toHaveCount(0);
});
