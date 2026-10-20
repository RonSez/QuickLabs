import { test, expect } from "@playwright/test";

for (const path of ["/", "/web-design"]) {
  test(`${path} renders with one h1`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}
