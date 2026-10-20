import { test } from "@playwright/test";
import { scrollThrough } from "./helpers";

const SIZES = [
  [375, 812],
  [390, 844],
  [430, 932],
  [844, 390],
  [768, 1024],
  [1024, 768],
  [1440, 900],
] as const;

for (const path of ["/", "/web-design"]) {
  for (const [w, h] of SIZES) {
    test(`screens ${path} ${w}x${h}`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop" || !process.env.SCREENS, "run with SCREENS=1");
      await page.setViewportSize({ width: w, height: h });
      await page.goto(path);
      await scrollThrough(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      const name = `${path === "/" ? "home" : "web-design"}-${w}x${h}`;
      await page.screenshot({ path: `test-results/screens/${name}.png`, fullPage: true });
    });
  }
}
