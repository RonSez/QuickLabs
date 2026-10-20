import { test, expect } from "@playwright/test";
import { scrollThrough } from "./helpers";

for (const path of ["/", "/web-design"]) {
  test(`${path}: no AI tells in the rendered page`, async ({ page }) => {
    await page.goto(path);
    await scrollThrough(page);
    const report = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll<HTMLElement>("body *"));
      const cs = (el: Element) => getComputedStyle(el);
      return {
        roundedControls: all.filter(
          (el) => (el.tagName === "A" || el.tagName === "BUTTON") && parseFloat(cs(el).borderTopLeftRadius) > 4,
        ).length,
        radialGradients: all.filter((el) => /radial-gradient/.test(cs(el).backgroundImage)).length,
        monoText: all.filter((el) => /mono/i.test(cs(el).fontFamily)).length,
        uppercaseText: all.filter(
          (el) => el.childElementCount === 0 && el.textContent?.trim() && cs(el).textTransform === "uppercase",
        ).length,
        canvases: document.querySelectorAll("canvas").length,
        svgIcons: document.querySelectorAll("svg").length,
      };
    });
    expect(report).toEqual({
      roundedControls: 0,
      radialGradients: 0,
      monoText: 0,
      uppercaseText: 0,
      canvases: 0,
      svgIcons: 0,
    });
  });
}
