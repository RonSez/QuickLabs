import { test, expect } from "@playwright/test";
import { scrollThrough } from "./helpers";

for (const path of ["/", "/web-design"]) {
  test(`${path}: every visible link and button is at least 44×44 on phones`, async ({ page }, info) => {
    test.skip(info.project.name !== "mobile");
    await page.goto(path);
    await scrollThrough(page);
    const small = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("a, button"))
        .filter((el) => el.getAttribute("href") !== "#main")
        .filter((el) => {
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return s.visibility !== "hidden" && s.display !== "none" && r.width > 0 && r.height > 0;
        })
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width < 44 || r.height < 44;
        })
        .map(
          (el) =>
            `${el.tagName} "${el.textContent?.trim()}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`,
        ),
    );
    expect(small).toEqual([]);
  });

  test(`${path}: headings start at h1 and skip no level`, async ({ page }) => {
    await page.goto(path);
    const levels = await page.$$eval("h1, h2, h3, h4", (hs) => hs.map((h) => Number(h.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const path of ["/", "/web-design"]) {
    test(`${path}: all section content is present and opaque`, async ({ page }) => {
      await page.goto(path);
      // The caret blinks via CSS by design, so it is excluded.
      const hidden = await page.$$eval("main *:not(.caret)", (els) =>
        els.filter((el) => getComputedStyle(el).opacity === "0").map((el) => el.tagName),
      );
      expect(hidden).toEqual([]);
    });
  }
});
