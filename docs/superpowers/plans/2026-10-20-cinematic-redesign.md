# QuickLabs Cinematic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage and `/web-design` as a dark, cinematic, typography-led site with code-built product visuals, equal quality on phones, and no AI-looking patterns.

**Architecture:** This is a Next 16 App Router site with static export (`output: "export"`). Styling uses Tailwind v4 tokens in `globals.css`. All motion runs through one engine (GSAP + ScrollTrigger + SplitText, with Lenis smooth scroll). A single `useMotion` hook wraps `gsap.matchMedia()`, so every component automatically gets three modes: *pin* (desktop + fine pointer), *play-once* (touch / small screens) and *static* (reduced motion). The server-rendered HTML is always the final visual state, and animations start from it with `from()` tweens. Content stays in `src/content/*.ts`.

**Tech Stack:** Next 16.2.4, React 19.2, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis 1.3, and Playwright for end-to-end and content tests.

**Spec:** `docs/superpowers/specs/2026-10-20-cinematic-redesign-design.md`. Read it before starting any task.

## Global Constraints

- Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (`AGENTS.md`). The font guide is `01-app/01-getting-started/13-fonts.md`.
- Palette: `--ink #0D0D0B`, `--ink-2 #161614`, `--bone #ECE8DF`, `--ash #8E8B84`, `--line` = bone at about 11% alpha, `--rounds #7FA88C`, `--redlines #E5484D`. Product colors only appear inside the products scene.
- One font: Bricolage Grotesque via `next/font/google` (`axes: ["opsz"]`). No monospace, no uppercase-tracked labels.
- Corner radius 0–2 px. No shadows, gradients or glows. No lucide icons; arrows are text glyphs (→ ↗ ←).
- At most one solid bone CTA per screen; it must be at least 48 px tall on touch. Every other link is a text link using the `link-draw` utility.
- Every tap target on phones must be at least 44×44 px.
- Animate only `transform`, `opacity`, `clip-path` and colors. GSAP eases: `power3.out` (out), `power4.inOut` (in-out). Durations: micro 0.2 s, reveal 0.8 s, load 1 s.
- Pinning only happens under `(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)`.
- Server-rendered markup is always the final state. Content must be fully visible with JS disabled and with reduced motion.
- Contact is always `mailto:info@quicklabs.ai`.
- Copy rules (spec §7):
  - no "We don't X. We Y."
  - no "most agencies"
  - no "not just"
  - no em dashes in content
  - no "seamless / cutting-edge / leverage / empower / elevate / unlock"
  - no slogans
  - no invented facts
- Do not rename Tailwind custom utilities to start with `text-`, because `tailwind-merge` would treat them as colors. Use the `type-*` names defined in Task 2.
- Shell: Git Bash on Windows. Run all commands from the repo root.

## Review Focus

1. **Resizing or rotating between desktop and touch modes while a pinned scene is active.** Expected: the pin spacer disappears, `data-pinned` is removed, nothing stays hidden and nothing overflows horizontally. Pinned by the resize test in Task 6.
2. **Arriving at a section by anchor (`/#contact`, nav clicks) when pins have changed page height.** Expected: the target section lands in view. Pinned by the anchor tests in Tasks 4 and 10.
3. **Fonts loading late, so SplitText lines and ScrollTrigger positions get measured against fallback metrics.** Expected: the headings' accessible names stay intact and masks finish fully visible. Pinned by the accessible-name and mask tests in Tasks 3 and 9, plus the `fonts.ready` refresh in Task 3.
4. **Narrowest phones (320 px) with giant type and the full-width email.** Expected: no horizontal scroll. Pinned by the 320 px sweep in Task 1, re-run in every task.
5. **Mobile menu open while the viewport crosses to desktop width.** Expected: the menu closes and page scrolling is unlocked. Pinned by the menu test in Task 4.

---

## File structure (end state)

```
src/app/globals.css                    tokens, utilities, grain, failsafe, services hover, receipt edge
src/app/layout.tsx                     font, motion boot script, Header, <main id="main">
src/app/page.tsx                       Hero, Manifesto, Products, Services, WebOffer, Principles, Closer
src/app/web-design/page.tsx            WebHero, BuildList, CarePlan, Closer
src/lib/gsap.ts                        plugin registration (ScrollTrigger, SplitText)
src/lib/lenis.ts                       Lenis singleton getter/setter
src/lib/motion-tokens.ts               EASE, DUR, MOTION_CONDITIONS, MOTION_BOOT
src/lib/scene.ts                       pinTimeline(), playOnEnter()
src/components/motion/useMotion.ts     useMotion(), useScene(), useLoadMask()
src/components/motion/SmoothScroll.tsx Lenis + anchor handling + fonts.ready refresh
src/components/motion/MaskText.tsx     SplitText line masks on view
src/components/motion/ScrubWords.tsx   scroll-scrubbed word opacity
src/components/motion/RevealGroup.tsx  staggered children reveal on view
src/components/visuals/Words.tsx       word spans helper
src/components/visuals/TypewriterNote.tsx
src/components/visuals/RedlineDoc.tsx
src/components/visuals/SiteAssemble.tsx
src/components/visuals/Receipt.tsx
src/components/visuals/timelines.ts    buildNoteTimeline, buildRedlineTimeline, buildSiteTimeline, buildReceiptTimeline
src/components/layout/Header.tsx
src/components/sections/{Hero,Manifesto,Products,Services,WebOffer,Principles,Closer}.tsx
src/components/sections/webdesign/{WebHero,BuildList,CarePlan}.tsx
src/components/ui/{Button,Container,Logo}.tsx
src/content/{site,copy,products,services,approach,webdesign}.ts
tests/helpers.ts, tests/*.spec.ts, tests/*.unit.ts, playwright.config.ts
```

Deleted by the end: `components/three/*`, `components/motion/{Reveal,SplitText}.tsx`, `components/sections/{About,Approach,Contact,ProductDetail,WebDesign}.tsx`, `components/layout/Footer.tsx`, `components/ui/{Badge,Icon,SectionHeading}.tsx`, `lib/motion.ts`.

---

### Task 1: Test harness and baseline

**Files:**
- Create: `playwright.config.ts`, `tests/helpers.ts`, `tests/smoke.spec.ts`, `tests/layout.spec.ts`, `docs/superpowers/notes/bundle-baseline.txt`
- Modify: `package.json` (scripts, devDependencies), `.gitignore`

**Interfaces:**
- Produces:
  - `WIDTHS`
  - `scrollThrough(page, step?)`
  - `scrollToSection(page, selector, offsetViewports?)`
  - `opacityOf(page, selector): Promise<number>`
  - Playwright projects named `unit`, `desktop` and `mobile`.

- [ ] **Step 1: Install tooling**

```bash
npm install -D @playwright/test@1.55.0 serve@14.2.4
npx playwright install chromium
```

- [ ] **Step 2: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "playwright test",
  "test:unit": "playwright test --project=unit"
}
```

- [ ] **Step 3: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run build && npx serve out -l ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    { name: "unit", testMatch: /.*\.unit\.ts/ },
    {
      name: "desktop",
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],
});
```

Note for every later task: the server is reused when one is already running on port 4173. After changing code, stop any running `serve` so Playwright rebuilds; otherwise you'll test a stale build.

- [ ] **Step 4: Create `tests/helpers.ts`**

```ts
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
```

- [ ] **Step 5: Create `tests/smoke.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

for (const path of ["/", "/web-design"]) {
  test(`${path} renders with one h1`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}
```

- [ ] **Step 6: Create `tests/layout.spec.ts`**

```ts
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
```

- [ ] **Step 7: Ignore test output in `.gitignore`**

Append:

```
# playwright / lighthouse
/test-results/
/playwright-report/
/lh-*.json
```

- [ ] **Step 8: Run the suite against the current site**

Run: `npx playwright test`
Expected: smoke passes in both projects. The layout sweep is expected to pass. If any width fails on the old design, write the failing widths in the commit message body. They must pass by Task 14.

- [ ] **Step 9: Record the JS bundle baseline**

```bash
mkdir -p docs/superpowers/notes
echo "chunks_kb_before=$(du -sk out/_next/static/chunks | cut -f1)" > docs/superpowers/notes/bundle-baseline.txt
cat docs/superpowers/notes/bundle-baseline.txt
```

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json playwright.config.ts tests .gitignore docs/superpowers/notes
git commit -m "Add Playwright harness, layout sweep and bundle baseline"
```

---

### Task 2: Visual system (tokens, font, base UI)

**Files:**
- Modify: `src/app/globals.css` (full rewrite), `src/app/layout.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Container.tsx`, `src/components/ui/Logo.tsx`, `src/components/layout/Header.tsx` (Logo call only), `src/components/layout/Footer.tsx` (Logo call only), `src/content/site.ts` (drop `logo`)
- Test: `tests/visual-system.spec.ts`

**Interfaces:**
- Produces:
  - Tailwind colors: `ink`, `ink-2`, `bone`, `ash`, `line`, `line-strong`, `rounds`, `redlines`.
  - Utilities: `px-gutter`, `type-body`, `type-label`, `type-title`, `type-heading`, `type-display`, `link-draw` (thickness via `--draw`).
  - Classes: `.grain`, `.caret`, `.receipt`, `.svc-list`/`.svc-row`.
  - `Button` props `{ href?: string; variant?: "primary" | "link"; className?: string; children; external?: boolean; type?; onClick? }`.
  - `Logo({ className? })` renders the text "QuickLabs".
  - `Container({ children, className? })`.
- Legacy aliases (`bg`, `fg`, `accent`, …) stay mapped to the new values until Task 13, so old sections still compile.

- [ ] **Step 1: Write the failing test `tests/visual-system.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("page uses ink background and Bricolage", async ({ page }) => {
  await page.goto("/");
  const s = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    return { bg: cs.backgroundColor, font: cs.fontFamily };
  });
  expect(s.bg).toBe("rgb(13, 13, 11)");
  expect(s.font).toMatch(/Bricolage/i);
});

test("header shows a typeset wordmark instead of the PNG logo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header img")).toHaveCount(0);
  await expect(page.locator("header").getByText("QuickLabs", { exact: true })).toBeVisible();
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/visual-system.spec.ts --project=desktop`
Expected: FAIL (background is `rgb(0, 0, 0)`, font is Geist, and the header contains an img).

- [ ] **Step 3: Rewrite `src/app/globals.css`**

```css
@import "tailwindcss";

:root {
  --ink: #0d0d0b;
  --ink-2: #161614;
  --bone: #ece8df;
  --ash: #8e8b84;
  --line: rgb(236 232 223 / 0.11);
  --line-strong: rgb(236 232 223 / 0.22);
  --rounds: #7fa88c;
  --redlines: #e5484d;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.83, 0, 0.17, 1);
  --gutter: clamp(1.25rem, 4vw, 3rem);

  /* LEGACY (old sections only) — removed in Task 13 */
  --bg: var(--ink);
  --bg-elev: var(--ink-2);
  --bg-elev-2: var(--ink-2);
  --fg: var(--bone);
  --fg-muted: var(--ash);
  --fg-dim: var(--ash);
  --border: var(--line);
  --border-strong: var(--line-strong);
  --accent: var(--bone);
  --accent-2: var(--bone);
  --accent-glow: transparent;
  --health: var(--rounds);
  --health-2: var(--rounds);
  --legal: var(--redlines);
  --legal-2: var(--redlines);
}

@theme inline {
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-bone: var(--bone);
  --color-ash: var(--ash);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-rounds: var(--rounds);
  --color-redlines: var(--redlines);

  --font-sans: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;

  /* LEGACY (old sections only) — removed in Task 13 */
  --color-bg: var(--ink);
  --color-bg-elev: var(--ink-2);
  --color-bg-elev-2: var(--ink-2);
  --color-fg: var(--bone);
  --color-fg-muted: var(--ash);
  --color-fg-dim: var(--ash);
  --color-border: var(--line);
  --color-border-strong: var(--line-strong);
  --color-accent: var(--bone);
  --color-accent-2: var(--bone);
  --color-health: var(--rounds);
  --color-health-2: var(--rounds);
  --color-legal: var(--redlines);
  --color-legal-2: var(--redlines);
  --text-xs: 0.9375rem;
  --text-sm: 1.09375rem;
  --text-base: 1.25rem;
  --text-lg: 1.40625rem;
  --text-xl: 1.5625rem;
  --text-2xl: 1.875rem;
  --text-3xl: 2.34375rem;
  --text-4xl: 2.8125rem;
  --text-5xl: 3.75rem;
  --text-6xl: 4.6875rem;
  --text-7xl: 5.625rem;
}

@utility px-gutter {
  padding-inline: var(--gutter);
}
@utility type-body {
  font-size: clamp(1.0625rem, 1rem + 0.25vw, 1.125rem);
  line-height: 1.5;
}
@utility type-label {
  font-size: 0.8125rem;
  line-height: 1.3;
  font-weight: 500;
}
@utility type-title {
  font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-weight: 600;
}
@utility type-heading {
  font-size: clamp(2rem, 1.2rem + 3.2vw, 3.25rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 600;
}
@utility type-display {
  font-size: clamp(3rem, 1rem + 8vw, 8rem);
  line-height: 0.85;
  letter-spacing: -0.055em;
  font-weight: 700;
}
@utility link-draw {
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% var(--draw, 1px);
  transition: background-size 300ms var(--ease-out);
  &:hover,
  &:focus-visible {
    background-size: 100% var(--draw, 1px);
  }
}

* {
  border-color: var(--line);
}

html {
  background: var(--ink);
  color: var(--bone);
  color-scheme: dark;
  overflow-x: clip;
}

body {
  background: var(--ink);
  color: var(--bone);
  font-family: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
  font-size: 1.0625rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-variant-numeric: tabular-nums;
}

::selection {
  background: var(--bone);
  color: var(--ink);
}

:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--bone);
  outline-offset: 3px;
  border-radius: 1px;
}

/* Static film grain — the only texture on the site */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  opacity: 0.045;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

/* Load-in gating: only hidden when JS + motion are confirmed; failsafe reveals after 2.5s */
html.motion-ok [data-anim="pending"] {
  opacity: 0;
  animation: anim-failsafe 0s linear 2.5s forwards;
}
@keyframes anim-failsafe {
  to {
    opacity: 1;
  }
}

/* Blinking caret in the code-built note */
.caret {
  display: inline-block;
  width: 0.5em;
  height: 1.1em;
  vertical-align: -0.15em;
  background: currentColor;
  animation: caret-blink 1s steps(1) infinite;
}
@keyframes caret-blink {
  50% {
    opacity: 0;
  }
}

/* Services list: dim siblings on hover (fine pointers only) */
.svc-row {
  transition: opacity 300ms var(--ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .svc-list:has(.svc-row:hover) .svc-row:not(:hover) {
    opacity: 0.25;
  }
}

/* Receipt perforated bottom edge */
.receipt::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 6px;
  background: radial-gradient(circle at 5px 0, transparent 4px, var(--bone) 4.5px) 0 0 / 10px 6px repeat-x;
}

/* Lenis smooth-scroll integration */
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Switch the font in `src/app/layout.tsx`**

Replace the Geist imports and constants with:

```tsx
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});
```

Change the `<html>` and `<body>` lines to:

```tsx
<html lang="en" className={`${bricolage.variable} h-full`}>
  <body className="grain min-h-full bg-ink text-bone">
```

- [ ] **Step 5: Rewrite `src/components/ui/Logo.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-[1.125rem] font-bold tracking-[-0.03em] text-bone", className)}>
      QuickLabs
    </span>
  );
}
```

Update the two call sites: in `Header.tsx` replace `<Logo size="sm" priority />` with `<Logo />`, and in `Footer.tsx` replace `<Logo size="lg" />` with `<Logo className="text-[1.75rem]" />`. Then remove the `logo` block from `src/content/site.ts` and confirm it's unused: `grep -rn "site.logo" src` should print nothing.

- [ ] **Step 6: Rewrite `src/components/ui/Button.tsx`**

```tsx
import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "link";

type CommonProps = {
  /** "secondary" | "ghost" are legacy aliases for "link"; removed in Task 13. */
  variant?: ButtonVariant | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
};

type AsLink = CommonProps & { href: string; external?: boolean };
type AsButton = CommonProps & { href?: never; type?: "button" | "submit"; onClick?: () => void };

const base =
  "inline-flex items-center gap-2 font-semibold tracking-[-0.01em] touch-manipulation transition-[background-color,color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.98]";

const variantClass: Record<ButtonVariant, string> = {
  primary: "min-h-12 justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] text-ink hover:bg-bone/90",
  link: "min-h-11 text-[0.9375rem] text-bone link-draw",
};

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const v: ButtonVariant = variant === "primary" ? "primary" : "link";
  const cls = cn(base, variantClass[v], className);

  if ("href" in props && props.href) {
    const { href } = props;
    if (/^(mailto:|tel:|#)/.test(href)) {
      return <a href={href} className={cls}>{children}</a>;
    }
    if (/^https?:\/\//.test(href)) {
      const newTab = props.external ?? true;
      return (
        <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
          {children}
        </a>
      );
    }
    return <Link href={href} className={cls}>{children}</Link>;
  }

  const { type = "button", onClick } = props as AsButton;
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
```

- [ ] **Step 7: Rewrite `src/components/ui/Container.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[90rem] px-gutter", className)}>{children}</div>;
}
```

- [ ] **Step 8: Run tests, lint and build**

Run: `npx playwright test tests/visual-system.spec.ts tests/smoke.spec.ts tests/layout.spec.ts`
Expected: PASS.
Run: `npm run lint`
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add -A src tests
git commit -m "Add ink/bone design tokens, Bricolage font and typeset wordmark"
```

---

### Task 3: Motion foundation + Hero

**Files:**
- Create: `src/lib/motion-tokens.ts`, `src/lib/lenis.ts`, `src/lib/scene.ts`, `src/components/motion/useMotion.ts`
- Modify: `src/lib/gsap.ts`, `src/components/motion/SmoothScroll.tsx`, `src/app/layout.tsx`, `src/components/sections/Hero.tsx` (rewrite), `src/content/copy.ts` (`hero` key)
- Delete: `src/components/three/HeroCanvas.tsx`, `src/components/three/ShaderOrb.tsx`
- Test: `tests/hero.spec.ts`

**Interfaces:**
- Produces:
  - `EASE = { out: "power3.out", inOut: "power4.inOut" }`
  - `DUR = { micro: 0.2, reveal: 0.8, load: 1 }`
  - `MOTION_CONDITIONS = { pin, play }`
  - `type MotionConditions = { pin: boolean; play: boolean }`
  - `MOTION_BOOT: string`
  - `ensureGsap(): { gsap, ScrollTrigger, SplitText }`
  - `getLenis(): Lenis | null`, `setLenis(l: Lenis | null): void`
  - `useMotion(scope: RefObject<HTMLElement | null>, setup: (root: HTMLElement, c: MotionConditions) => void | (() => void), deps?: DependencyList)`
  - `useScene(scope, handlers: { pin?: SceneHandler; play?: SceneHandler })` where `type SceneHandler = (root: HTMLElement) => void | (() => void)`. If `pin` is absent, `play` runs in desktop mode too.
  - `useLoadMask(scope)`: inside `scope`, the element with `data-anim="pending"` is revealed and `[data-mask-part]` children slide up from their masks. `[data-load-fade]` children fade in.
  - `pinTimeline(root: HTMLElement, viewports: number): gsap.core.Timeline`
  - `playOnEnter(el: HTMLElement, build: (el: HTMLElement) => gsap.core.Timeline, start?: string): void`

- [ ] **Step 1: Write the failing test `tests/hero.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const heroOpacity = (page: import("@playwright/test").Page) =>
  page.locator("#top [data-anim]").evaluate((el) => getComputedStyle(el).opacity);

test("hero wordmark is the h1 and is fully visible after load", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText("QuickLabs/studio");
  expect(await heroOpacity(page)).toBe("1");
  await expect(page.locator("canvas")).toHaveCount(0);
});

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

test("mobile: primary CTA is a full-width tap target", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const cta = page.locator("#top a", { hasText: "Start a project" }).filter({ visible: true });
  const box = await cta.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(48);
  expect(box!.width).toBeGreaterThan(page.viewportSize()!.width * 0.8);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/hero.spec.ts`
Expected: FAIL (the h1 text is the old headline, there's no `[data-anim]`, and a canvas is present).

- [ ] **Step 3: Create `src/lib/motion-tokens.ts`**

```ts
export const EASE = { out: "power3.out", inOut: "power4.inOut" } as const;
export const DUR = { micro: 0.2, reveal: 0.8, load: 1 } as const;

export const MOTION_CONDITIONS = {
  pin: "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  play: "(prefers-reduced-motion: no-preference)",
} as const;

export type MotionConditions = { pin: boolean; play: boolean };

/** Inline <head> script: marks <html> before first paint when motion is allowed. */
export const MOTION_BOOT =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}";
```

- [ ] **Step 4: Update `src/lib/gsap.ts`**

```ts
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function ensureGsap() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText };
}

export { gsap, ScrollTrigger, SplitText };
```

- [ ] **Step 5: Create `src/lib/lenis.ts`**

```ts
import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}
```

- [ ] **Step 6: Create `src/lib/scene.ts`**

```ts
"use client";

import { ensureGsap } from "@/lib/gsap";

/** Pinned, scrubbed timeline for desktop scenes. `viewports` = scroll distance while pinned. */
export function pinTimeline(root: HTMLElement, viewports: number) {
  const { gsap } = ensureGsap();
  return gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${window.innerHeight * viewports}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

/** Builds a paused timeline and plays it once when `el` reaches `start`. */
export function playOnEnter(
  el: HTMLElement,
  build: (el: HTMLElement) => gsap.core.Timeline,
  start = "top 60%",
) {
  const { ScrollTrigger } = ensureGsap();
  const tl = build(el);
  ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tl.play() });
}
```

- [ ] **Step 7: Create `src/components/motion/useMotion.ts`**

```ts
"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE, MOTION_CONDITIONS, type MotionConditions } from "@/lib/motion-tokens";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Cleanup = void | (() => void);
export type SceneHandler = (root: HTMLElement) => Cleanup;

/**
 * Runs `setup` inside a gsap.matchMedia scoped to `scope`. Re-runs when the pin/play
 * conditions change (resize, rotation, reduced-motion toggle) and reverts every tween,
 * ScrollTrigger and SplitText created inside, plus any returned cleanup.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (root: HTMLElement, c: MotionConditions) => Cleanup,
  deps: DependencyList = [],
) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_CONDITIONS, (ctx) => setup(root, ctx.conditions as MotionConditions));
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Desktop pin handler, touch play-once handler, nothing under reduced motion. */
export function useScene(
  scope: RefObject<HTMLElement | null>,
  handlers: { pin?: SceneHandler; play?: SceneHandler },
) {
  useMotion(scope, (root, c) => {
    if (c.pin && handlers.pin) return handlers.pin(root);
    if (c.play && handlers.play) return handlers.play(root);
  });
}

/** Load-in for page heroes: masks `[data-mask-part]` up, fades `[data-load-fade]`. */
export function useLoadMask(scope: RefObject<HTMLElement | null>) {
  useMotion(scope, (root, c) => {
    const gate = root.querySelector<HTMLElement>("[data-anim]");
    if (!c.play) {
      if (gate) gate.dataset.anim = "done";
      return;
    }
    const { gsap } = ensureGsap();
    const parts = root.querySelectorAll("[data-mask-part]");
    const fades = root.querySelectorAll("[data-load-fade]");
    gsap.set(parts, { yPercent: 110 });
    gsap.set(fades, { autoAlpha: 0, y: 12 });
    if (gate) gate.dataset.anim = "done";
    gsap.to(parts, { yPercent: 0, duration: DUR.load, ease: EASE.out, stagger: 0.08 });
    gsap.to(fades, { autoAlpha: 1, y: 0, duration: DUR.reveal, ease: EASE.out, delay: 0.45, stagger: 0.08 });
  });
}
```

- [ ] **Step 8: Rewrite `src/components/motion/SmoothScroll.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

function scrollToTarget(el: HTMLElement, lenis: Lenis | null, immediate: boolean) {
  if (lenis) lenis.scrollTo(el, { immediate, force: true });
  else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    const update = (time: number) => lenis?.raf(time * 1000);
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, touchMultiplier: 1.5, syncTouch: false });
      setLenis(lenis);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
    }

    // Same-page anchor links: resolve positions at click time (pins change page height).
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("data-native-anchor")) return;
      const url = new URL(a.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el, lenis, false);
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    // After fonts load: re-measure triggers, then honour a hash in the URL.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el) scrollToTarget(el, lenis, true);
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(update);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 9: Add the boot script and `main` id in `src/app/layout.tsx`**

```tsx
import { MOTION_BOOT } from "@/lib/motion-tokens";
// …
<html lang="en" className={`${bricolage.variable} h-full`} suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
  </head>
  <body className="grain min-h-full bg-ink text-bone">
    <SmoothScroll>
      <Header />
      <main id="main" className="relative">{children}</main>
      <Footer />
    </SmoothScroll>
  </body>
</html>
```

- [ ] **Step 10: Replace the `hero` key in `src/content/copy.ts`**

```ts
hero: {
  line: "We design websites and build AI products for healthcare, legal and finance. We also run two products of our own.",
  cta: { label: "Start a project", href: "#contact" },
},
```

- [ ] **Step 11: Rewrite `src/components/sections/Hero.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { copy } from "@/content/copy";
import { useLoadMask } from "@/components/motion/useMotion";

function MaskPart({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden pb-[0.06em] align-bottom ${className ?? ""}`}>
      <span data-mask-part className="inline-block">
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useLoadMask(ref);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col px-gutter pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pt-28"
    >
      <div data-anim="pending" className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-end gap-8 lg:justify-between">
          <p
            data-load-fade
            className="type-body order-2 max-w-[24rem] text-bone/80 lg:order-1 lg:self-end lg:text-right"
          >
            {copy.hero.line}
          </p>
          <h1 className="order-1 font-bold leading-[0.8] tracking-[-0.065em] lg:order-2 lg:-ml-[0.04em] lg:whitespace-nowrap lg:text-[11vw]">
            <MaskPart className="block text-[28vw] lg:inline-block lg:text-[length:inherit]">Quick</MaskPart>
            <MaskPart className="block text-[28vw] lg:inline-block lg:text-[length:inherit]">Labs</MaskPart>
            <MaskPart className="mt-2 block text-[13vw] font-light text-bone/30 lg:mt-0 lg:inline-block lg:text-[length:inherit]">
              /studio
            </MaskPart>
          </h1>
        </div>

        <div data-load-fade className="mt-8 flex items-center justify-between gap-6 border-t border-line pt-4">
          <span className="type-label hidden text-ash lg:inline">Scroll</span>
          <a
            href={copy.hero.cta.href}
            className="flex min-h-12 w-full items-center justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink lg:hidden"
          >
            {copy.hero.cta.label} <span aria-hidden>→</span>
          </a>
          <a
            href={copy.hero.cta.href}
            className="link-draw hidden min-h-11 items-center gap-2 text-[0.9375rem] font-semibold lg:inline-flex"
          >
            {copy.hero.cta.label} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 12: Delete the three.js hero files**

```bash
git rm src/components/three/HeroCanvas.tsx src/components/three/ShaderOrb.tsx
```

- [ ] **Step 13: Run tests and check the layout visually**

Run: `npx playwright test tests/hero.spec.ts tests/layout.spec.ts tests/smoke.spec.ts`
Expected: PASS. If the 1024 or 1440 overflow check fails, the desktop wordmark is too wide. Lower `lg:text-[11vw]` in steps of 0.5vw until it passes.

Then take one screenshot per project and look at it:

```bash
npx playwright screenshot --viewport-size=1440,900 http://localhost:4173/ test-results/hero-1440.png
npx playwright screenshot --device="Pixel 7" http://localhost:4173/ test-results/hero-pixel7.png
```

(Run `npx serve out -l 4173` in the background first if the server isn't running.) Open both PNGs with the Read tool and check that the wordmark fills the width without clipping, and that on the phone the CTA sits at the bottom.

- [ ] **Step 14: Commit**

```bash
git add -A src tests
git commit -m "Add motion foundation and typographic hero; remove WebGL orb"
```

---

### Task 4: Header and mobile menu

**Files:**
- Modify: `src/components/layout/Header.tsx` (rewrite), `src/content/site.ts` (tagline, description, nav)
- Test: `tests/header.spec.ts`

**Interfaces:**
- Consumes: `getLenis()` (Task 3), `Logo` (Task 2), `site.email`.
- Produces: `nav: readonly { label: string; href: string }[]` with hrefs `/#products`, `/#services`, `/web-design` and `/#contact`. A skip link to `#main` marked `data-native-anchor`.

- [ ] **Step 1: Write the failing test `tests/header.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("desktop nav has the four destinations", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
  await expect(links).toHaveText(["Products", "Services", "Web design", "Contact"]);
  await expect(links.nth(2)).toHaveAttribute("href", "/web-design");
});

test("desktop nav click scrolls to the section", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
  await page.waitForTimeout(2000);
  const top = await page.locator("#contact").evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top)).toBeLessThan(120);
});

test("mobile menu: 44px toggle, opens, closes on Escape", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  const box = await toggle.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Products" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("mobile menu closes and unlocks scroll when resized to desktop", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("skip link is the first tab stop", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/header.spec.ts`
Expected: FAIL (the old nav has five links, there's no dialog role and no skip link).

- [ ] **Step 3: Update `src/content/site.ts`**

```ts
export const site = {
  name: "QuickLabs",
  tagline: "Websites and AI products for regulated industries",
  description:
    "QuickLabs is a software studio. We design websites, build AI products for healthcare, legal and finance, and run two products of our own: rounds.health and redlines.legal.",
  url: "https://quicklabs.ai",
  email: "info@quicklabs.ai",
} as const;

export const nav = [
  { label: "Products", href: "/#products" },
  { label: "Services", href: "/#services" },
  { label: "Web design", href: "/web-design" },
  { label: "Contact", href: "/#contact" },
] as const;
```

- [ ] **Step 4: Rewrite `src/components/layout/Header.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/cn";

type NavItem = (typeof nav)[number];

function NavLink({ item, className, onClick, style }: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  // Hash links are plain anchors so SmoothScroll can resolve them; page links use next/link.
  if (item.href.includes("#")) {
    return <a href={item.href} className={className} onClick={onClick} style={style}>{item.label}</a>;
  }
  return <Link href={item.href} className={className} onClick={onClick} style={style}>{item.label}</Link>;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 16;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const solid = scrolled || open;
  const close = () => setOpen(false);

  return (
    <>
      <a
        href="#main"
        data-native-anchor
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-bone focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300",
          solid ? "border-line bg-ink" : "border-transparent bg-transparent",
        )}
      >
        <div className="flex h-16 items-center justify-between px-gutter lg:h-20">
          <Link href="/" aria-label={`${site.name}, home`} onClick={close} className="inline-flex min-h-11 items-center">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <NavLink key={item.href} item={item} className="link-draw text-[0.9375rem] text-bone/70 hover:text-bone" />
            ))}
          </nav>

          <button
            type="button"
            className="relative -mr-3 inline-flex size-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className={cn("absolute h-[1.5px] w-6 bg-bone transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span aria-hidden className={cn("absolute h-[1.5px] w-6 bg-bone transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-lenis-prevent
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-between bg-ink px-gutter pt-[calc(5rem+env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-[opacity,visibility] duration-300 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <ul className="flex flex-col">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <NavLink
                item={item}
                onClick={close}
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
                className={cn(
                  "type-heading block py-4 transition-transform duration-500 ease-[var(--ease-out)]",
                  open ? "translate-y-0" : "translate-y-full",
                )}
              />
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${site.email}`}
          className="flex min-h-12 items-center justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink"
        >
          Email us <span aria-hidden>→</span>
        </a>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Run tests and lint**

Run: `npx playwright test tests/header.spec.ts tests/layout.spec.ts tests/visual-system.spec.ts && npm run lint`
Expected: PASS. The "nav click scrolls" test targets the old `#contact` section, which still exists.

- [ ] **Step 6: Commit**

```bash
git add -A src tests
git commit -m "Rebuild header with four-item nav, skip link and full-screen mobile menu"
```

---

### Task 5: Manifesto (replaces About)

**Files:**
- Create: `src/components/motion/ScrubWords.tsx`, `src/components/sections/Manifesto.tsx`
- Modify: `src/app/page.tsx`, `src/content/copy.ts` (add `manifesto`, remove `about`)
- Delete: `src/components/sections/About.tsx`
- Test: `tests/manifesto.spec.ts`

**Interfaces:**
- Consumes: `useMotion`, `ensureGsap`.
- Produces: `ScrubWords({ text: string; className?: string })`, which renders a `<p>` with `[data-word]` spans. Section id `manifesto`.

- [ ] **Step 1: Write the failing test `tests/manifesto.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { opacityOf, scrollToSection } from "./helpers";

const lastWord = "#manifesto [data-word]:last-child";

test("words start dim and brighten as the section scrolls past", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.waitForTimeout(500);
  expect(await opacityOf(page, lastWord)).toBeLessThan(0.5);
  await scrollToSection(page, "#manifesto", 1.2);
  expect(await opacityOf(page, lastWord)).toBeGreaterThan(0.95);
});

test("reduced motion: every word fully visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await opacityOf(page, lastWord)).toBe(1);
});

test("old About section is gone", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#about")).toHaveCount(0);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/manifesto.spec.ts`
Expected: FAIL (`#manifesto` doesn't exist yet).

- [ ] **Step 3: Update `src/content/copy.ts`**

Delete the `about` key and add:

```ts
manifesto:
  "We build software for clinics, law firms and the companies that serve them. We also run two products of our own, rounds.health and redlines.legal, so we know what it takes to keep software working long after launch. Client projects get the same care.",
```

- [ ] **Step 4: Create `src/components/motion/ScrubWords.tsx`**

```tsx
"use client";

import { Fragment, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { useMotion } from "./useMotion";

export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useMotion(ref, (root, c) => {
    if (!c.play) return;
    const { gsap } = ensureGsap();
    gsap.fromTo(
      root.querySelectorAll("[data-word]"),
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
  });

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span data-word>{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
```

- [ ] **Step 5: Create `src/components/sections/Manifesto.tsx`**

```tsx
import { copy } from "@/content/copy";
import { ScrubWords } from "@/components/motion/ScrubWords";

export function Manifesto() {
  return (
    <section id="manifesto" aria-label="About QuickLabs" className="px-gutter py-28 lg:py-44">
      <ScrubWords
        text={copy.manifesto}
        className="max-w-[22ch] text-[clamp(1.75rem,1rem+3.6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.035em] sm:max-w-[26ch]"
      />
    </section>
  );
}
```

- [ ] **Step 6: Swap About for Manifesto in `src/app/page.tsx`, then delete About**

In `page.tsx`, replace `import { About } …` with `import { Manifesto } from "@/components/sections/Manifesto";` and `<About />` with `<Manifesto />`. Then:

```bash
git rm src/components/sections/About.tsx
```

- [ ] **Step 7: Run tests**

Run: `npx playwright test tests/manifesto.spec.ts tests/layout.spec.ts tests/smoke.spec.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A src tests
git commit -m "Replace About with scroll-scrubbed manifesto"
```

---

### Task 6: Products scene (pinned signature)

**Files:**
- Create: `src/components/visuals/Words.tsx`, `src/components/visuals/TypewriterNote.tsx`, `src/components/visuals/RedlineDoc.tsx`, `src/components/visuals/timelines.ts`
- Modify: `src/content/products.ts` (rewrite), `src/content/copy.ts` (`products` key), `src/components/sections/Products.tsx` (rewrite)
- Delete: `src/components/sections/ProductDetail.tsx`
- Test: `tests/products.spec.ts`

**Interfaces:**
- Consumes: `useScene`, `pinTimeline`, `playOnEnter`, `ensureGsap`, `DUR`, `EASE`.
- Produces:
  - `type ProductScreen = { kind: "note"; title: string; fields: { label: string; text: string }[] } | { kind: "redline"; title: string; before: string; deleted: string; inserted: string; after: string }`
  - `type Product = { slug: "rounds" | "redlines"; name: string; domain: string; url: string; vertical: string; tagline: string; facts: string; screen: ProductScreen }`
  - `Words({ text })` renders `[data-w]` spans.
  - `buildNoteTimeline(el)` and `buildRedlineTimeline(el)`, both of which return paused timelines.
  - DOM hooks: `#products[data-pinned]`, `[data-chapter="<slug>"]`, `[data-screen]`, `[data-del]`, `[data-ins]`.

- [ ] **Step 1: Write the failing test `tests/products.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { opacityOf, scrollThrough, scrollToSection } from "./helpers";

const lastInsWord = "[data-chapter='redlines'] [data-ins] [data-w]:last-child";
const lastNoteWord = "[data-chapter='rounds'] dl > div:last-child [data-w]:last-of-type";
const isPinned = (page: import("@playwright/test").Page) =>
  page.locator("#products").evaluate((el) => el.hasAttribute("data-pinned"));

test("desktop: pins and ends on the finished redline", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await scrollToSection(page, "#products", 0.2);
  expect(await isPinned(page)).toBe(true);
  await scrollToSection(page, "#products", 2.05);
  expect(await opacityOf(page, "[data-chapter='redlines']")).toBe(1);
  expect(await opacityOf(page, lastInsWord)).toBe(1);
});

test("desktop → phone resize unpins cleanly", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await scrollToSection(page, "#products", 0.5);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  expect(await isPinned(page)).toBe(false);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await scrollThrough(page);
  await page.waitForTimeout(2500);
  expect(await opacityOf(page, "[data-chapter='rounds']")).toBe(1);
  expect(await opacityOf(page, "[data-chapter='redlines']")).toBe(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("touch: chapters stack and each screen plays on entry", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  expect(await isPinned(page)).toBe(false);
  await page.locator("[data-chapter='redlines'] [data-screen]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  expect(await opacityOf(page, lastInsWord)).toBe(1);
});

test("reduced motion: both screens render finished", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await opacityOf(page, lastNoteWord)).toBe(1);
  expect(await opacityOf(page, lastInsWord)).toBe(1);
});

test("product links open the live sites", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#products a[href='https://rounds.health']")).toHaveCount(1);
  await expect(page.locator("#products a[href='https://redlines.legal']")).toHaveCount(1);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/products.spec.ts`
Expected: FAIL (there are no `[data-chapter]` elements).

- [ ] **Step 3: Rewrite `src/content/products.ts`**

```ts
export type ProductSlug = "rounds" | "redlines";

export type ProductScreen =
  | { kind: "note"; title: string; fields: { label: string; text: string }[] }
  | { kind: "redline"; title: string; before: string; deleted: string; inserted: string; after: string };

export type Product = {
  slug: ProductSlug;
  name: string;
  domain: string;
  url: string;
  vertical: string;
  tagline: string;
  facts: string;
  screen: ProductScreen;
};

export const products: Product[] = [
  {
    slug: "rounds",
    name: "rounds.health",
    domain: "rounds.health",
    url: "https://rounds.health",
    vertical: "Healthcare",
    tagline: "An AI assistant for specialists that handles the work around each visit: intake, notes and follow-up.",
    facts: "HIPAA · SOC 2 · ISO 27001",
    screen: {
      kind: "note",
      title: "Pre-visit summary · J. Alvarez, 54",
      fields: [
        { label: "Chief complaint", text: "Right knee pain for three weeks, worse on stairs." },
        { label: "History", text: "Meniscus repair in 2019. No new injury." },
        { label: "Medications", text: "Ibuprofen as needed." },
        { label: "For this visit", text: "Examine the knee and review the MRI from the referral." },
      ],
    },
  },
  {
    slug: "redlines",
    name: "redlines.legal",
    domain: "redlines.legal",
    url: "https://redlines.legal",
    vertical: "Legal",
    tagline: "Contract redlining inside Microsoft Word, applied against your firm's playbook.",
    facts: "Word add-in · Contract text is never stored",
    screen: {
      kind: "redline",
      title: "Supply Agreement · Clause 9.2",
      before: "The Supplier shall indemnify the Customer",
      deleted: "against any and all losses, however arising,",
      inserted: "against direct losses, capped at the fees paid in the previous 12 months,",
      after: "arising from a breach of this Agreement.",
    },
  },
];
```

(The facts are taken from today's badges and the "transient processing" feature text; they aren't new claims.)

- [ ] **Step 4: Replace the `products` key in `src/content/copy.ts`**

```ts
products: {
  label: "Products",
  visit: "Visit",
},
```

- [ ] **Step 5: Create `src/components/visuals/Words.tsx`**

```tsx
import { Fragment } from "react";

/** Splits text into word spans (`data-w`) so timelines can reveal word by word. */
export function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span data-w className="inline-block">{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
```

- [ ] **Step 6: Create `src/components/visuals/timelines.ts`**

```ts
"use client";

import { ensureGsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion-tokens";

const typeWords = (tl: gsap.core.Timeline, words: NodeListOf<Element> | Element[]) =>
  tl.from(words, { autoAlpha: 0, duration: 0.01, stagger: 0.06, ease: "none" });

export function buildNoteTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  typeWords(tl, el.querySelectorAll("[data-w]"));
  return tl;
}

export function buildRedlineTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  tl.from(el.querySelector("[data-del]"), {
    color: "#0d0d0b",
    textDecorationColor: "rgba(229,72,77,0)",
    duration: 0.4,
    ease: EASE.out,
  });
  typeWords(tl, el.querySelectorAll("[data-ins] [data-w]"));
  return tl;
}

export function buildSiteTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  tl.from(el.querySelectorAll("[data-block]"), {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 0.5,
    ease: EASE.out,
    stagger: 0.12,
  }).from(el.querySelector("[data-cta]"), { backgroundColor: "rgba(236,232,223,0.12)", duration: 0.4 });
  return tl;
}

export function buildReceiptTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  tl.from(el.querySelectorAll("[data-item]"), { autoAlpha: 0, y: -6, duration: 0.35, ease: EASE.out, stagger: 0.12 })
    .from(el.querySelector("[data-total]"), { autoAlpha: 0, y: 8, duration: 0.5, ease: EASE.out });
  return tl;
}
```

`buildSiteTimeline` and `buildReceiptTimeline` are defined here so all timelines live in one place. Tasks 8 and 11 use them.

- [ ] **Step 7: Create `src/components/visuals/TypewriterNote.tsx`**

```tsx
import type { ProductScreen } from "@/content/products";
import { Words } from "./Words";

type NoteScreen = Extract<ProductScreen, { kind: "note" }>;

export function TypewriterNote({ screen }: { screen: NoteScreen }) {
  return (
    <div className="rounded-[2px] border border-line bg-ink-2 p-5 text-[0.9375rem] leading-relaxed sm:p-7">
      <div className="mb-5 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-bone/15" />
        ))}
      </div>
      <p className="mb-4 font-semibold">{screen.title}</p>
      <dl className="grid gap-3">
        {screen.fields.map((f, i) => (
          <div key={f.label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="text-[var(--product)]">{f.label}</dt>
            <dd className="text-bone/75">
              <Words text={f.text} />
              {i === screen.fields.length - 1 ? <i className="caret ml-1 text-[var(--product)]" /> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

The caret is an `<i>` (not a `span`) so `[data-w]:last-of-type` in the tests always targets the last word.

- [ ] **Step 8: Create `src/components/visuals/RedlineDoc.tsx`**

```tsx
import type { ProductScreen } from "@/content/products";
import { Words } from "./Words";

type RedlineScreen = Extract<ProductScreen, { kind: "redline" }>;

export function RedlineDoc({ screen }: { screen: RedlineScreen }) {
  return (
    <div className="rounded-[2px] bg-bone p-5 text-ink sm:p-7">
      <p className="type-label mb-4 text-ink/60">{screen.title}</p>
      <p className="font-[ui-serif,Georgia,'Times_New_Roman',serif] text-[1.0625rem] leading-relaxed sm:text-[1.1875rem]">
        {screen.before}{" "}
        <del data-del className="text-redlines decoration-redlines decoration-[1.5px]">
          {screen.deleted}
        </del>{" "}
        <ins data-ins className="text-redlines underline decoration-redlines/60 underline-offset-[3px]">
          <Words text={screen.inserted} />
        </ins>{" "}
        {screen.after}
      </p>
    </div>
  );
}
```

- [ ] **Step 9: Rewrite `src/components/sections/Products.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { copy } from "@/content/copy";
import { products, type Product } from "@/content/products";
import { ensureGsap } from "@/lib/gsap";
import { pinTimeline, playOnEnter } from "@/lib/scene";
import { useScene } from "@/components/motion/useMotion";
import { TypewriterNote } from "@/components/visuals/TypewriterNote";
import { RedlineDoc } from "@/components/visuals/RedlineDoc";
import { buildNoteTimeline, buildRedlineTimeline } from "@/components/visuals/timelines";

const buildFor = (p: Product) => (p.screen.kind === "note" ? buildNoteTimeline : buildRedlineTimeline);

function Chapter({ product, index }: { product: Product; index: number }) {
  const dot = product.name.indexOf(".");
  return (
    <article
      data-chapter={product.slug}
      style={{ ["--product" as string]: `var(--${product.slug})` }}
      className="grid gap-10 border-t border-line px-gutter py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 group-data-[pinned]:h-svh group-data-[pinned]:border-t-0 group-data-[pinned]:py-0 group-data-[pinned]:[grid-area:1/1]"
    >
      <div className="flex flex-col gap-6">
        <p className="type-label text-ash">
          Product 0{index + 1} · {product.vertical}
        </p>
        <h3 className="type-display">
          {product.name.slice(0, dot)}
          <br />
          {product.name.slice(dot)}
        </h3>
        <p className="type-body max-w-[30rem] text-bone/80">{product.tagline}</p>
        <p className="type-label text-ash">{product.facts}</p>
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer noopener"
          className="link-draw inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-semibold"
        >
          {copy.products.visit} {product.domain} <span aria-hidden>↗</span>
        </a>
        <div className="flex max-w-[16rem] gap-1.5" aria-hidden>
          {products.map((p, i) => (
            <span key={p.slug} className={`h-0.5 flex-1 ${i === index ? "bg-[var(--product)]" : "bg-bone/15"}`} />
          ))}
        </div>
      </div>
      <div data-screen aria-hidden>
        {product.screen.kind === "note" ? (
          <TypewriterNote screen={product.screen} />
        ) : (
          <RedlineDoc screen={product.screen} />
        )}
      </div>
    </article>
  );
}

export function Products() {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, {
    pin: (root) => {
      root.dataset.pinned = "";
      const { gsap } = ensureGsap();
      const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
      const tl = pinTimeline(root, 2);
      chapters.forEach((chapter, i) => {
        const screen = chapter.querySelector<HTMLElement>("[data-screen]")!;
        if (i > 0) {
          gsap.set(chapter, { autoAlpha: 0 });
          tl.to(chapters[i - 1], { autoAlpha: 0, duration: 0.3 }).to(chapter, { autoAlpha: 1, duration: 0.3 }, "<");
        }
        tl.add(buildFor(products[i])(screen).paused(false));
      });
      return () => {
        delete root.dataset.pinned;
      };
    },
    play: (root) => {
      root.querySelectorAll<HTMLElement>("[data-chapter]").forEach((chapter, i) => {
        playOnEnter(chapter.querySelector<HTMLElement>("[data-screen]")!, buildFor(products[i]));
      });
    },
  });

  return (
    <section id="products" ref={ref} className="group relative bg-ink">
      <h2 className="sr-only">{copy.products.label}</h2>
      <div className="group-data-[pinned]:grid">
        {products.map((p, i) => (
          <Chapter key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Set the final section order and delete the old detail component**

In `src/app/page.tsx`, make the order Hero, Manifesto, Products, Services, (old) WebDesign, (old) Approach, (old) Contact. Products now comes before Services, as in spec §4.

```bash
git rm src/components/sections/ProductDetail.tsx
```

`Footer.tsx` only reads `p.url`, `p.slug` and `p.name`, so it still compiles. Confirm with `npx tsc --noEmit`.

- [ ] **Step 11: Run tests**

Run: `npx playwright test tests/products.spec.ts tests/layout.spec.ts tests/smoke.spec.ts`
Expected: PASS.

- [ ] **Step 12: Check the phone layout visually**

With `npx serve out -l 4173` running:

```bash
npx playwright screenshot --device="Pixel 7" --full-page --wait-for-timeout=1500 http://localhost:4173/ test-results/products-pixel7.png
```

Read the PNG and check that the two chapters stack with the screen under the text, the note is legible, and the redline shows the red strike and insert. (The screens may still show partially typed text in a static screenshot; that's expected. Task 14 reviews desktop pins.)

- [ ] **Step 13: Commit**

```bash
git add -A src tests
git commit -m "Add pinned products scene with code-built note and redline screens"
```

---

### Task 7: Services type list

**Files:**
- Modify: `src/content/services.ts` (rewrite), `src/content/copy.ts` (`services` key), `src/components/sections/Services.tsx` (rewrite)
- Test: `tests/services.spec.ts`

**Interfaces:**
- Produces: `type Service = { title: string; body: string }` (the `icon` field is removed). Section id `services`, with `.svc-list` and `.svc-row` hooks (CSS from Task 2).

- [ ] **Step 1: Write the failing test `tests/services.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("touch: every service shows its description", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  const rows = page.locator("#services .svc-row");
  await expect(rows).toHaveCount(4);
  for (const row of await rows.all()) {
    await row.scrollIntoViewIfNeeded();
    await expect(row.locator("p")).toBeVisible();
  }
});

test("desktop: hovering a row dims the others", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const rows = page.locator("#services .svc-row");
  await rows.nth(1).scrollIntoViewIfNeeded();
  await rows.nth(1).hover();
  await page.waitForTimeout(500);
  const first = await rows.nth(0).evaluate((el) => Number(getComputedStyle(el).opacity));
  const hovered = await rows.nth(1).evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(first).toBeLessThan(0.5);
  expect(hovered).toBe(1);
});

test("no icon boxes in services", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#services svg")).toHaveCount(0);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/services.spec.ts`
Expected: FAIL (there are no `.svc-row` elements, and the old cards use svg icons).

- [ ] **Step 3: Rewrite `src/content/services.ts`**

```ts
export type Service = { title: string; body: string };

export const services: Service[] = [
  {
    title: "Websites",
    body: "Custom company sites and landing pages, designed and built in-house, then hosted and maintained.",
  },
  {
    title: "AI products",
    body: "AI products from first prototype to production: model choice, evaluation, retrieval and the interface people use.",
  },
  {
    title: "Integrations",
    body: "AI inside the tools people already use: clinical EMRs, Microsoft Word, Google Workspace and CRMs.",
  },
  {
    title: "Product design",
    body: "Interface design, information architecture and design systems for professional tools.",
  },
];
```

- [ ] **Step 4: Replace the `services` key in `src/content/copy.ts`**

```ts
services: { label: "Services" },
```

- [ ] **Step 5: Rewrite `src/components/sections/Services.tsx`**

```tsx
import { copy } from "@/content/copy";
import { services } from "@/content/services";

export function Services() {
  return (
    <section id="services" className="px-gutter py-24 lg:py-36">
      <h2 className="type-label mb-8 text-ash lg:mb-12">{copy.services.label}</h2>
      <ul className="svc-list border-b border-line">
        {services.map((s) => (
          <li
            key={s.title}
            className="svc-row group grid gap-2 border-t border-line py-6 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-baseline lg:gap-10 lg:py-8"
          >
            <h3 className="text-[clamp(2rem,1rem+4.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] transition-transform duration-300 ease-[var(--ease-out)] lg:group-hover:translate-x-3">
              {s.title}
            </h3>
            <p className="type-body text-ash lg:text-right">{s.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

(Departure from the spec, made on purpose: descriptions are always visible in `--ash` instead of sliding in on hover. That way keyboard and screen-reader users get the same content, and hover still emphasizes one row by dimming the others.)

- [ ] **Step 6: Run tests**

Run: `npx playwright test tests/services.spec.ts tests/layout.spec.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A src tests
git commit -m "Replace service cards with large type list"
```

---

### Task 8: Web design offer scene

**Files:**
- Create: `src/components/visuals/SiteAssemble.tsx`, `src/components/sections/WebOffer.tsx`
- Modify: `src/content/webdesign.ts` (add `webOffer`, keep the rest until Task 11), `src/app/page.tsx`
- Delete: `src/components/sections/WebDesign.tsx`
- Test: `tests/web-offer.spec.ts`

**Interfaces:**
- Consumes: `buildSiteTimeline` (Task 6), `useScene`, `pinTimeline`, `playOnEnter`.
- Produces: `webOffer = { label, title, body, ledger: { item: string; term: string }[], link: { label, href } }`. Section id `web-offer` with `[data-site]` and `[data-cta]` hooks.

- [ ] **Step 1: Write the failing test `tests/web-offer.spec.ts`**

```ts
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
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/web-offer.spec.ts`
Expected: FAIL (`#web-offer` doesn't exist).

- [ ] **Step 3: Add `webOffer` to `src/content/webdesign.ts`**

Add at the top of the file (leave the existing exports for now; Task 11 replaces them):

```ts
export const webOffer = {
  label: "Web design",
  title: "Websites, looked after.",
  body: "We design and build custom sites for businesses, then host and maintain them for one monthly fee.",
  ledger: [
    { item: "Design & build", term: "Once" },
    { item: "Hosting", term: "Monthly" },
    { item: "Maintenance", term: "Monthly" },
    { item: "Content changes", term: "Monthly" },
    { item: "Support & monitoring", term: "Monthly" },
  ],
  link: { label: "See the web design offer", href: "/web-design" },
} as const;
```

- [ ] **Step 4: Create `src/components/visuals/SiteAssemble.tsx`**

```tsx
export function SiteAssemble() {
  return (
    <div data-site aria-hidden className="overflow-hidden rounded-[2px] border border-line bg-ink-2">
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-bone/15" />
        ))}
        <span className="ml-3 block h-3 w-32 rounded-[2px] bg-bone/10 sm:w-48" />
      </div>
      <div className="grid gap-3 p-5 sm:p-8">
        <span data-block className="block h-3 w-1/4 bg-bone/15" />
        <span data-block className="block h-10 w-5/6 bg-bone/15 sm:h-14" />
        <span data-block className="block h-3 w-3/5 bg-bone/15" />
        <span data-cta className="mt-2 block h-9 w-32 rounded-[2px] bg-bone" />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} data-block className="block aspect-[4/3] bg-bone/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/sections/WebOffer.tsx`**

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { webOffer } from "@/content/webdesign";
import { pinTimeline, playOnEnter } from "@/lib/scene";
import { useScene } from "@/components/motion/useMotion";
import { SiteAssemble } from "@/components/visuals/SiteAssemble";
import { buildSiteTimeline } from "@/components/visuals/timelines";

export function WebOffer() {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, {
    pin: (root) => {
      const tl = pinTimeline(root, 1);
      tl.add(buildSiteTimeline(root.querySelector<HTMLElement>("[data-site]")!).paused(false));
    },
    play: (root) => playOnEnter(root.querySelector<HTMLElement>("[data-site]")!, buildSiteTimeline),
  });

  return (
    <section
      id="web-offer"
      ref={ref}
      className="grid gap-12 border-t border-line px-gutter py-24 lg:min-h-svh lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-0"
    >
      <SiteAssemble />
      <div>
        <h2 className="type-label mb-6 text-ash">{webOffer.label}</h2>
        <p className="type-display">{webOffer.title}</p>
        <p className="type-body mt-6 max-w-[28rem] text-bone/80">{webOffer.body}</p>
        <dl className="mt-8 border-b border-line">
          {webOffer.ledger.map((row) => (
            <div key={row.item} className="flex justify-between gap-6 border-t border-line py-3 text-[0.9375rem]">
              <dt>{row.item}</dt>
              <dd className="text-ash">{row.term}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={webOffer.link.href}
          className="link-draw mt-8 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold"
        >
          {webOffer.link.label} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Swap the section in `src/app/page.tsx` and delete the old one**

Replace the `WebDesign` import and element with `WebOffer` from `@/components/sections/WebOffer`. Then:

```bash
git rm src/components/sections/WebDesign.tsx
```

- [ ] **Step 7: Run tests**

Run: `npx playwright test tests/web-offer.spec.ts tests/products.spec.ts tests/layout.spec.ts`
Expected: PASS. Products runs again because two pins now stack.

- [ ] **Step 8: Commit**

```bash
git add -A src tests
git commit -m "Add web design offer scene with self-assembling site"
```

---

### Task 9: Principles

**Files:**
- Create: `src/components/motion/MaskText.tsx`, `src/components/sections/Principles.tsx`
- Modify: `src/content/approach.ts` (rewrite), `src/content/copy.ts` (`approach` → `principles`), `src/app/page.tsx`
- Delete: `src/components/sections/Approach.tsx`
- Test: `tests/principles.spec.ts`

**Interfaces:**
- Produces:
  - `MaskText({ as?: "h2" | "h3" | "p"; className?: string; children: string })`: SplitText lines with class `mask-line`, revealed on view.
  - `type Principle = { title: string; body: string }`.
  - Section id `principles`.

- [ ] **Step 1: Write the failing test `tests/principles.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const titles = ["Compliance first.", "Where people already work.", "Built for specialists."];

test("three statements with intact accessible names", async ({ page }) => {
  await page.goto("/");
  for (const t of titles) {
    await expect(page.locator("#principles").getByRole("heading", { name: t })).toHaveCount(1);
  }
});

test("line masks finish fully revealed after scrolling in", async ({ page }) => {
  await page.goto("/");
  const last = page.locator("#principles h3").last();
  await last.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const offset = await last.evaluate((h) => {
    const line = h.querySelector(".mask-line");
    if (!line) return 0; // reduced motion / not split
    return Math.abs(line.getBoundingClientRect().top - line.parentElement!.getBoundingClientRect().top);
  });
  expect(offset).toBeLessThan(2);
});

test("reduced motion: statements are not split and are visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#principles .mask-line")).toHaveCount(0);
  await expect(page.locator("#principles h3").first()).toHaveText(titles[0]);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/principles.spec.ts`
Expected: FAIL (`#principles` doesn't exist).

- [ ] **Step 3: Rewrite `src/content/approach.ts`**

```ts
export type Principle = { title: string; body: string };

export const principles: Principle[] = [
  {
    title: "Compliance first.",
    body: "We plan security and compliance (HIPAA, SOC 2, ISO 27001) from the start of a project.",
  },
  {
    title: "Where people already work.",
    body: "We put software inside the EMR, Word or CRM your team already uses, so nobody has to learn another tool.",
  },
  {
    title: "Built for specialists.",
    body: "Surgeons, partners and senior operators have little patience for bad software. We design for them first.",
  },
];
```

- [ ] **Step 4: Replace the `approach` key in `src/content/copy.ts`**

```ts
principles: { label: "How we work" },
```

- [ ] **Step 5: Create `src/components/motion/MaskText.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion-tokens";
import { useMotion } from "./useMotion";

type Props = { as?: "h2" | "h3" | "p"; className?: string; children: string };

export function MaskText({ as: Tag = "h3", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root, c) => {
    if (!c.play) return;
    const { gsap, SplitText } = ensureGsap();
    SplitText.create(root, {
      type: "lines",
      mask: "lines",
      linesClass: "mask-line",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: DUR.reveal,
          ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        }),
    });
  });

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
```

- [ ] **Step 6: Create `src/components/sections/Principles.tsx`**

```tsx
import { copy } from "@/content/copy";
import { principles } from "@/content/approach";
import { MaskText } from "@/components/motion/MaskText";

export function Principles() {
  return (
    <section id="principles" className="border-t border-line px-gutter py-24 lg:py-36">
      <h2 className="type-label mb-10 text-ash lg:mb-16">{copy.principles.label}</h2>
      <div className="grid gap-14 lg:gap-20">
        {principles.map((p) => (
          <article key={p.title} className="grid gap-3 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-end lg:gap-12">
            <MaskText className="text-[clamp(2.25rem,1rem+5vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.05em]">
              {p.title}
            </MaskText>
            <p className="type-body text-ash lg:text-right">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Swap in `src/app/page.tsx` and delete Approach**

Replace the `Approach` import and element with `Principles` from `@/components/sections/Principles`. Then:

```bash
git rm src/components/sections/Approach.tsx
```

- [ ] **Step 8: Run tests**

Run: `npx playwright test tests/principles.spec.ts tests/layout.spec.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A src tests
git commit -m "Replace approach cards with masked principle statements"
```

---

### Task 10: Closer (contact + footer)

**Files:**
- Create: `src/components/sections/Closer.tsx`
- Modify: `src/content/copy.ts` (`contact` → `closer`), `src/app/page.tsx`, `src/app/layout.tsx` (remove Footer), `src/app/web-design/page.tsx` (render Closer instead of its contact section)
- Delete: `src/components/sections/Contact.tsx`, `src/components/layout/Footer.tsx`
- Test: `tests/closer.spec.ts`

**Interfaces:**
- Consumes: `site`, `nav`, `products`.
- Produces:
  - `Closer({ intro: string })`, which renders `section#contact` with a footer row.
  - `splitEmail(email: string): [string, string, string]`, exported from `Closer.tsx`.
  - `copy.closer = { homeIntro, webDesignIntro, button }`.

- [ ] **Step 1: Write the failing test `tests/closer.spec.ts`**

```ts
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
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/closer.spec.ts`
Expected: FAIL (/web-design uses a Gmail link, and the old Footer sits after `main`).

- [ ] **Step 3: Replace the `contact` key in `src/content/copy.ts`**

```ts
closer: {
  label: "Contact",
  homeIntro: "Tell us what you're building. We reply within one working day.",
  webDesignIntro: "Tell us about your business and the site you have in mind. We reply within one working day.",
  button: "Email us",
},
```

- [ ] **Step 4: Create `src/components/sections/Closer.tsx`**

```tsx
import Link from "next/link";
import { copy } from "@/content/copy";
import { nav, site } from "@/content/site";
import { products } from "@/content/products";

export function splitEmail(email: string): [string, string, string] {
  const [local, domain] = email.split("@");
  const dot = domain.lastIndexOf(".");
  return [`${local}@`, domain.slice(0, dot), domain.slice(dot)];
}

const footerLink = "link-draw inline-flex min-h-11 items-center hover:text-bone";

export function Closer({ intro }: { intro: string }) {
  const mailto = `mailto:${site.email}`;
  const [a, b, c] = splitEmail(site.email);

  return (
    <section
      id="contact"
      className="flex min-h-svh flex-col justify-between gap-16 border-t border-line px-gutter pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pt-32"
    >
      <div>
        <h2 className="type-label text-ash">{copy.closer.label}</h2>
        <p className="type-body mt-4 max-w-[28rem] text-bone/80">{intro}</p>
        <a
          href={mailto}
          className="link-draw mt-10 inline-block text-[15vw] font-bold leading-[0.88] tracking-[-0.055em] [--draw:3px] lg:text-[8vw]"
        >
          <span className="block lg:inline">{a}</span>
          <span className="block lg:inline">{b}</span>
          <span className="block lg:inline">{c}</span>
        </a>
        <a
          href={mailto}
          className="mt-10 flex min-h-12 w-full items-center justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink lg:hidden"
        >
          {copy.closer.button} <span aria-hidden>→</span>
        </a>
      </div>

      <footer className="type-label grid gap-2 border-t border-line pt-4 text-ash md:grid-cols-3 md:items-center">
        <ul className="flex flex-wrap gap-x-6">
          {products.map((p) => (
            <li key={p.slug}>
              <a href={p.url} target="_blank" rel="noreferrer noopener" className={footerLink}>
                {p.domain}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-6 md:justify-center">
          {nav.map((item) =>
            item.href.includes("#") ? (
              <li key={item.href}>
                <a href={item.href} className={footerLink}>{item.label}</a>
              </li>
            ) : (
              <li key={item.href}>
                <Link href={item.href} className={footerLink}>{item.label}</Link>
              </li>
            ),
          )}
        </ul>
        <p className="flex min-h-11 items-center md:justify-end">
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </section>
  );
}
```

- [ ] **Step 5: Wire it up**

- In `src/app/page.tsx`, replace `Contact` with `<Closer intro={copy.closer.homeIntro} />` (import `copy` and `Closer`).
- In `src/app/layout.tsx`, remove the `Footer` import and `<Footer />`.
- In `src/app/web-design/page.tsx`, delete the whole `{/* Contact */}` section and the `composeUrl` constant, and render `<Closer intro={copy.closer.webDesignIntro} />` as the last child (import `copy` from `@/content/copy` and `Closer`).

```bash
git rm src/components/sections/Contact.tsx src/components/layout/Footer.tsx
```

- [ ] **Step 6: Run tests**

Run: `npx playwright test tests/closer.spec.ts tests/header.spec.ts tests/layout.spec.ts`
Expected: PASS. The header "nav click" test now targets the new `#contact`.

- [ ] **Step 7: Commit**

```bash
git add -A src tests
git commit -m "Add email-led closer with merged footer; mailto on both pages"
```

---

### Task 11: `/web-design` page

**Files:**
- Create: `src/components/motion/RevealGroup.tsx`, `src/components/visuals/Receipt.tsx`, `src/components/sections/webdesign/WebHero.tsx`, `src/components/sections/webdesign/BuildList.tsx`, `src/components/sections/webdesign/CarePlan.tsx`
- Modify: `src/content/webdesign.ts` (replace everything except `webOffer`), `src/app/web-design/page.tsx` (rewrite)
- Test: `tests/web-design.spec.ts`

**Interfaces:**
- Consumes: `useLoadMask`, `useScene`, `playOnEnter`, `buildReceiptTimeline`, `Closer`.
- Produces:
  - `webDesignPage = { meta: { title, description }, hero: { back, titleA, titleB, body, cta }, build: { label, items: { title: string; body: string }[] }, care: { label, title, body, receipt: { title, period, items: string[], included, totalLabel, totalValue } } }`
  - `Receipt(props: typeof webDesignPage.care.receipt)`
  - `RevealGroup({ as?: "ul" | "div"; className?: string; children })`

- [ ] **Step 1: Write the failing test `tests/web-design.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { opacityOf } from "./helpers";

test("hero, six services and back link", async ({ page }) => {
  await page.goto("/web-design");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Websites, looked after.");
  await expect(page.locator("#build li")).toHaveCount(6);
  await expect(page.locator("a[href='/']", { hasText: "QuickLabs" }).first()).toBeVisible();
});

test("receipt ends with Ask us and shows no price", async ({ page }) => {
  await page.goto("/web-design");
  await expect(page.locator("[data-total]")).toContainText("Ask us");
  expect(await page.locator("body").innerText()).not.toMatch(/€|\$\d/);
});

test("receipt prints in when scrolled into view", async ({ page }) => {
  await page.goto("/web-design");
  await page.locator("[data-receipt]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  expect(await opacityOf(page, "[data-item]:last-child")).toBe(1);
  expect(await opacityOf(page, "[data-total]")).toBe(1);
});

test("reduced motion: receipt and list fully visible without scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/web-design");
  expect(await opacityOf(page, "[data-total]")).toBe(1);
  expect(await opacityOf(page, "#build li:last-child")).toBe(1);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/web-design.spec.ts`
Expected: FAIL (the h1 text differs and there's no `#build` or receipt).

- [ ] **Step 3: Rewrite `src/content/webdesign.ts`**

Keep the `webOffer` export from Task 8 at the top and replace every other export with:

```ts
export const webDesignPage = {
  meta: {
    title: "Web design & care plan",
    description:
      "Custom websites for businesses, designed and built by QuickLabs, then hosted and maintained under one monthly care plan.",
  },
  hero: {
    back: "QuickLabs",
    titleA: "Websites,",
    titleB: "looked after.",
    body: "We design and build custom websites for businesses, then host and maintain them every month.",
    cta: { label: "Start a project", href: "#contact" },
  },
  build: {
    label: "What we build",
    items: [
      { title: "Custom design & build", body: "Designed from scratch for your business. No templates." },
      { title: "Mobile-first", body: "Designed for phones first, then scaled up to larger screens." },
      { title: "Fast by default", body: "Pages that load quickly on any connection." },
      { title: "Landing & company sites", body: "A single focused landing page or a full company website." },
      { title: "Updates & support", body: "We handle changes, so you don't need to hire a developer." },
      { title: "Hosting & maintenance", body: "Hosting, security updates and monitoring, set up and handled by us." },
    ],
  },
  care: {
    label: "Care plan",
    title: "One plan. Everything covered.",
    body: "One monthly plan covers hosting, updates, changes and support, so there are no separate quotes.",
    receipt: {
      title: "Care plan",
      period: "Monthly",
      items: [
        "Hosting",
        "Maintenance & updates",
        "Content & design changes",
        "Technical support",
        "Performance monitoring",
      ],
      included: "Included",
      totalLabel: "Total",
      totalValue: "Ask us",
    },
  },
} as const;
```

- [ ] **Step 4: Create `src/components/motion/RevealGroup.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion-tokens";
import { useMotion } from "./useMotion";

type Props = { as?: "ul" | "div"; className?: string; children: React.ReactNode };

export function RevealGroup({ as: Tag = "ul", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root, c) => {
    if (!c.play) return;
    const { gsap } = ensureGsap();
    gsap.from(root.children, {
      autoAlpha: 0,
      y: 24,
      duration: DUR.reveal,
      ease: EASE.out,
      stagger: 0.04,
      scrollTrigger: { trigger: root, start: "top 85%", once: true },
    });
  });

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
```

- [ ] **Step 5: Create `src/components/visuals/Receipt.tsx`**

```tsx
type ReceiptProps = {
  title: string;
  period: string;
  items: readonly string[];
  included: string;
  totalLabel: string;
  totalValue: string;
};

export function Receipt({ title, period, items, included, totalLabel, totalValue }: ReceiptProps) {
  return (
    <div data-receipt className="receipt relative bg-bone p-6 text-ink sm:p-8">
      <div className="flex justify-between border-b border-dashed border-ink/30 pb-3 font-semibold">
        <span>{title}</span>
        <span>{period}</span>
      </div>
      <ul className="py-2">
        {items.map((item) => (
          <li data-item key={item} className="flex justify-between gap-4 py-2 text-[0.9375rem]">
            <span>{item}</span>
            <span className="text-ink/55">{included}</span>
          </li>
        ))}
      </ul>
      <div data-total className="flex items-baseline justify-between border-t border-ink pt-3">
        <span>{totalLabel}</span>
        <span className="text-[clamp(1.75rem,1rem+2vw,2.5rem)] font-bold tracking-[-0.04em]">{totalValue}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create `src/components/sections/webdesign/WebHero.tsx`**

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { webDesignPage } from "@/content/webdesign";
import { useLoadMask } from "@/components/motion/useMotion";

export function WebHero() {
  const ref = useRef<HTMLElement>(null);
  useLoadMask(ref);
  const h = webDesignPage.hero;

  return (
    <section
      ref={ref}
      className="flex min-h-svh flex-col px-gutter pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pt-28"
    >
      <div data-anim="pending" className="flex flex-1 flex-col justify-between gap-10">
        <Link href="/" data-load-fade className="type-label inline-flex min-h-11 items-center gap-2 self-start text-ash hover:text-bone">
          <span aria-hidden>←</span> {h.back}
        </Link>
        <h1 className="text-[clamp(3.5rem,1rem+12vw,13rem)] font-bold leading-[0.84] tracking-[-0.06em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-mask-part className="inline-block">{h.titleA}</span>
          </span>{" "}
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-mask-part className="inline-block font-light text-bone/30">{h.titleB}</span>
          </span>
        </h1>
        <div data-load-fade className="flex flex-col gap-6 border-t border-line pt-4 lg:flex-row lg:items-end lg:justify-between">
          <p className="type-body max-w-[30rem] text-bone/80">{h.body}</p>
          <a
            href={h.cta.href}
            className="flex min-h-12 items-center justify-between gap-6 rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink"
          >
            {h.cta.label} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Create `src/components/sections/webdesign/BuildList.tsx`**

```tsx
import { webDesignPage } from "@/content/webdesign";
import { RevealGroup } from "@/components/motion/RevealGroup";

export function BuildList() {
  const b = webDesignPage.build;
  return (
    <section id="build" className="border-t border-line px-gutter py-24 lg:py-36">
      <h2 className="type-label mb-10 text-ash">{b.label}</h2>
      <RevealGroup className="grid border-b border-line md:grid-cols-2 md:gap-x-12">
        {b.items.map((item) => (
          <li key={item.title} className="border-t border-line py-6">
            <h3 className="type-title">{item.title}</h3>
            <p className="type-body mt-2 text-ash">{item.body}</p>
          </li>
        ))}
      </RevealGroup>
    </section>
  );
}
```

- [ ] **Step 8: Create `src/components/sections/webdesign/CarePlan.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { webDesignPage } from "@/content/webdesign";
import { playOnEnter } from "@/lib/scene";
import { useScene } from "@/components/motion/useMotion";
import { Receipt } from "@/components/visuals/Receipt";
import { buildReceiptTimeline } from "@/components/visuals/timelines";

export function CarePlan() {
  const ref = useRef<HTMLElement>(null);
  const care = webDesignPage.care;

  useScene(ref, {
    play: (root) => playOnEnter(root.querySelector<HTMLElement>("[data-receipt]")!, buildReceiptTimeline, "top 75%"),
  });

  return (
    <section
      id="care-plan"
      ref={ref}
      className="grid gap-12 border-t border-line px-gutter py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-36"
    >
      <div>
        <h2 className="type-label mb-6 text-ash">{care.label}</h2>
        <p className="type-display">{care.title}</p>
        <p className="type-body mt-6 max-w-[28rem] text-bone/80">{care.body}</p>
      </div>
      <div className="lg:max-w-[30rem] lg:justify-self-end lg:w-full">
        <Receipt {...care.receipt} />
      </div>
    </section>
  );
}
```

- [ ] **Step 9: Rewrite `src/app/web-design/page.tsx`**

```tsx
import type { Metadata } from "next";
import { webDesignPage } from "@/content/webdesign";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import { WebHero } from "@/components/sections/webdesign/WebHero";
import { BuildList } from "@/components/sections/webdesign/BuildList";
import { CarePlan } from "@/components/sections/webdesign/CarePlan";
import { Closer } from "@/components/sections/Closer";

export const metadata: Metadata = {
  title: webDesignPage.meta.title,
  description: webDesignPage.meta.description,
  openGraph: {
    title: `${webDesignPage.meta.title} · ${site.name}`,
    description: webDesignPage.meta.description,
    type: "website",
  },
};

export default function WebDesignPage() {
  return (
    <>
      <WebHero />
      <BuildList />
      <CarePlan />
      <Closer intro={copy.closer.webDesignIntro} />
    </>
  );
}
```

- [ ] **Step 10: Run tests**

Run: `npx playwright test tests/web-design.spec.ts tests/closer.spec.ts tests/layout.spec.ts tests/smoke.spec.ts`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add -A src tests
git commit -m "Rebuild /web-design with type index and printed care-plan receipt"
```

---

### Task 12: Copy rules check + owner review gate

**Files:**
- Create: `tests/copy.unit.ts`
- Modify: `src/content/*.ts` and `src/app/layout.tsx` metadata (only if the test finds violations)

**Interfaces:**
- Consumes: every `src/content/*.ts` file.

- [ ] **Step 1: Write the test `tests/copy.unit.ts`**

```ts
import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src/content");

const BANNED: [RegExp, string][] = [
  [/\bwe don['’]t\b/i, "\"We don't X. We Y.\" construction"],
  [/most agencies/i, "agency comparison cliché"],
  [/\bnot just\b/i, "\"not just X\" construction"],
  [/—/, "em dash"],
  [/\b(seamless|cutting[- ]edge|leverag|empower|elevat|unlock|world[- ]class|next[- ]level|game[- ]chang)/i, "AI-sounding buzzword"],
  [/has to be right|can['’]t afford|real human|form receipt/i, "slogan or quip"],
  [/^\s*\[.*\]\s*$/, "bracketed eyebrow label"],
];

for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
  test(`copy rules: ${file}`, () => {
    const src = readFileSync(path.join(dir, file), "utf8");
    const strings = [...src.matchAll(/"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)].map((m) => m[1] ?? m[2]);
    for (const s of strings) {
      for (const [re, why] of BANNED) {
        expect(s, `${file}: ${why} in "${s}"`).not.toMatch(re);
      }
    }
  });
}
```

- [ ] **Step 2: Run it**

Run: `npm run test:unit`
Expected: PASS, since Tasks 3–11 wrote compliant copy. If it fails, rewrite the flagged strings by the spec §7 rules (plain, concrete, no invented facts) and run it again until it passes.

- [ ] **Step 3: Clean up leftover keys**

Run: `grep -n "eyebrow\|headline\|sub:\|primaryCta\|secondaryCta" src/content/*.ts`
Expected: no output. If any old keys remain unused, delete them and run `npx tsc --noEmit`.

- [ ] **Step 4: Commit**

```bash
git add -A src tests
git commit -m "Add copy rules check over content modules"
```

- [ ] **Step 5: Owner review gate (STOP)**

Produce a readable dump of all user-facing copy for the owner:

```bash
git diff main -- src/content
```

Present the new copy to the owner grouped by page and section, as plain text rather than a raw diff. **Do not continue to Task 13 until the owner approves or edits the copy.** Apply any edits, re-run `npm run test:unit`, and commit with "Apply owner copy edits".

---

### Task 13: Cleanup (dependencies, dead files, legacy tokens)

**Files:**
- Modify: `package.json`, `src/app/globals.css` (delete LEGACY blocks), `src/components/ui/Button.tsx` (drop legacy variants)
- Delete: `src/components/motion/Reveal.tsx`, `src/components/motion/SplitText.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/Icon.tsx`, `src/components/ui/SectionHeading.tsx`, `src/lib/motion.ts`, the `src/components/three/` dir if it's empty
- Test: `tests/tells.spec.ts`, `tests/deps.unit.ts`

- [ ] **Step 1: Write the failing tests**

`tests/deps.unit.ts`:

```ts
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test("heavy or AI-tell dependencies are gone", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of ["three", "@react-three/fiber", "@react-three/drei", "@types/three", "motion", "lucide-react"]) {
    expect(all[name], name).toBeUndefined();
  }
});
```

`tests/tells.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run them to see what fails**

Run: `npx playwright test tests/deps.unit.ts tests/tells.spec.ts`
Expected: `deps.unit.ts` FAILS (the packages are still installed). `tells.spec.ts` should already pass. If it doesn't, the report names the offending category; fix the component responsible before continuing.

- [ ] **Step 3: Remove the dependencies and dead files**

```bash
npm uninstall three @react-three/fiber @react-three/drei @types/three motion lucide-react
git rm src/components/motion/Reveal.tsx src/components/motion/SplitText.tsx src/components/ui/Badge.tsx src/components/ui/Icon.tsx src/components/ui/SectionHeading.tsx src/lib/motion.ts
grep -rn "lucide-react\|motion/react\|@react-three\|from \"three\"\|SectionHeading\|ui/Icon\|ui/Badge\|lib/motion\"" src || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Remove the legacy tokens**

In `src/app/globals.css`, delete both blocks marked `LEGACY (old sections only) — removed in Task 13` (the `:root` legacy vars and the `@theme` legacy colors and text scale). Then confirm nothing still uses them:

```bash
grep -rnE "\b(bg-bg|bg-bg-elev|text-fg|text-fg-muted|border-border|text-accent|bg-accent|var\(--(fg|bg|accent|health|legal|border)))" src || echo "clean"
```

Expected: `clean`. If anything matches, switch it to the new token (`ink`, `ink-2`, `bone`, `ash`, `line`).

- [ ] **Step 5: Drop the legacy Button variants**

In `src/components/ui/Button.tsx`, change `variant?: ButtonVariant | "secondary" | "ghost";` to `variant?: ButtonVariant;`, replace `const v: ButtonVariant = variant === "primary" ? "primary" : "link";` with `const v = variant;`, and delete the JSDoc line above `variant`. Run `grep -rn "Button" src --include=*.tsx`. If `Button` is no longer imported anywhere, delete `src/components/ui/Button.tsx` too. Do the same check for `Container` (`grep -rn "ui/Container" src`) and delete it if unused.

- [ ] **Step 6: Run the full suite, lint and build**

Run: `npx tsc --noEmit && npm run lint && npx playwright test`
Expected: all PASS.

- [ ] **Step 7: Measure the bundle**

```bash
echo "chunks_kb_after=$(du -sk out/_next/static/chunks | cut -f1)" >> docs/superpowers/notes/bundle-baseline.txt
cat docs/superpowers/notes/bundle-baseline.txt
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Remove three.js, Motion and lucide; drop legacy tokens and dead components"
```

Put the before and after KB numbers in the commit body.

---

### Task 14: Final verification

**Files:**
- Create: `tests/a11y.spec.ts`, `tests/screens.spec.ts`

- [ ] **Step 1: Write `tests/a11y.spec.ts`**

```ts
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
        .map((el) => `${el.tagName} "${el.textContent?.trim()}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`),
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
      const hidden = await page.$$eval("main *", (els) =>
        els.filter((el) => getComputedStyle(el).opacity === "0").map((el) => el.tagName),
      );
      expect(hidden).toEqual([]);
    });
  }
});
```

- [ ] **Step 2: Run it and fix any failures**

Run: `npx playwright test tests/a11y.spec.ts`
Expected: PASS. If the tap-target test lists an element, add `min-h-11` / `inline-flex items-center` (or `size-11`) to that element in its component and re-run.

- [ ] **Step 3: Write `tests/screens.spec.ts` for manual review (not asserting)**

```ts
import { test } from "@playwright/test";
import { scrollThrough } from "./helpers";

const SIZES = [
  [375, 812], [390, 844], [430, 932], [844, 390], [768, 1024], [1024, 768], [1440, 900],
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
```

- [ ] **Step 4: Generate and review the screenshots**

Run: `SCREENS=1 npx playwright test tests/screens.spec.ts --project=desktop`
Open each PNG in `test-results/screens/` with the Read tool and check it against spec §3–§5 and these points:
- Display type fills the width without clipping.
- Nothing overlaps the fixed header.
- Phone CTAs sit in the thumb zone.
- In landscape (844×390), the hero still shows the wordmark and the CTA.
- No blue, no glows, no icons and no rounded pills anywhere.

Fix anything off, then re-run the affected tests.

- [ ] **Step 5: Lighthouse (mobile) on both pages**

With `npx serve out -l 4173` running:

```bash
npx lighthouse@12 http://localhost:4173/ --form-factor=mobile --only-categories=performance --chrome-flags="--headless=new" --output=json --output-path=./lh-home.json --quiet
npx lighthouse@12 http://localhost:4173/web-design --form-factor=mobile --only-categories=performance --chrome-flags="--headless=new" --output=json --output-path=./lh-web.json --quiet
node -e "for (const f of ['lh-home.json','lh-web.json']) { const r=require('./'+f); const a=r.audits; console.log(f, 'perf', Math.round(r.categories.performance.score*100), 'LCP', a['largest-contentful-paint'].displayValue, 'CLS', a['cumulative-layout-shift'].displayValue); }"
```

Expected: perf ≥ 90, LCP < 2.0 s, CLS < 0.05 on both pages. If LCP misses, check that the hero has no client-only blocking work. If CLS misses, look at font swap metrics or the header height.

- [ ] **Step 6: AI-tell review against the spec**

Read spec §2 and §7 line by line against the running site (both pages, phone and desktop). Make a list of anything that still reads as templated and fix it. If nothing needs fixing, say so explicitly in the final report.

- [ ] **Step 7: Full suite, lint, build**

Run: `npx tsc --noEmit && npm run lint && npx playwright test`
Expected: all PASS, including the 320 px overflow sweep.

- [ ] **Step 8: Commit**

```bash
git add tests
git commit -m "Add accessibility checks and screenshot sweep; final verification"
```

Report to the owner:
- the Lighthouse numbers
- the bundle size before and after
- the screenshot folder
- any spec deviations (Services descriptions are always visible; `PinnedScene` is implemented as the `useScene` hook)
