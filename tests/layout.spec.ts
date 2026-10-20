import { test, expect } from "@playwright/test";
import { WIDTHS, scrollThrough } from "./helpers";

for (const path of ["/", "/web-design"]) {
  for (const width of WIDTHS) {
    test(`no horizontal overflow on ${path} at ${width}px`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "viewport sweep runs once, in the desktop project");
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      await scrollThrough(page, 400);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}
