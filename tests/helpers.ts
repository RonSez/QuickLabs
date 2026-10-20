import type { Page } from "@playwright/test";

export const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440] as const;

/** Scrolls the whole page in steps so every scroll-triggered animation fires. */
export async function scrollThrough(page: Page, step = 300) {
  await page.evaluate(async (s) => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += s) {
      window.scrollTo(0, y);
      await wait(40);
    }
  }, step);
  await page.waitForTimeout(800);
}

/** Scrolls so the section's top (or its pin spacer's top) is `offsetViewports` viewports above the viewport top. */
export async function scrollToSection(page: Page, selector: string, offsetViewports = 0) {
  await page.evaluate(
    ({ sel, off }) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`missing ${sel}`);
      const host = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
      const top = host.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + off * window.innerHeight);
    },
    { sel: selector, off: offsetViewports },
  );
  await page.waitForTimeout(1200);
}

export async function opacityOf(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => Number(getComputedStyle(el).opacity));
}
