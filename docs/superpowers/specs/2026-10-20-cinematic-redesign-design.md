# QuickLabs cinematic redesign — design spec

**Date:** 2026-10-20
**Status:** Awaiting review
**Scope:** Homepage (`/`) and `/web-design`, including a copy rewrite. Visual mockups from the brainstorm live in `.superpowers/brainstorm/` (git-ignored).

## 1. Goal and success criteria

Redesign the QuickLabs marketing site so it reads as a high-end, hand-crafted agency build, with nothing that looks AI-generated, and so it is **as strong on a phone as on desktop**.

The site serves two audiences equally: businesses buying a website + care plan, and companies in regulated industries hiring QuickLabs for AI/product engineering. Both pages present one studio brand.

Success means:
- None of the "AI tells" in §2 remain in either the visuals or the copy.
- Every scene has a deliberate phone composition (not a scaled-down desktop).
- Lighthouse mobile performance ≥ 90, CLS < 0.05, LCP < 2.0 s on both pages.
- `next build` and `eslint` pass.

### Constraints
- No generated imagery (no Higgsfield) and no photos. All visuals are typography, CSS, and lightweight code-built UI.
- Content stays in typed modules under `src/content/*.ts`. No CMS.
- Contact stays `mailto:` (no forms, no Gmail compose URLs).
- Deployment unchanged (Cloudflare via `wrangler.jsonc`).
- Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (per `AGENTS.md`); this is Next 16 and APIs may differ from older versions.

## 2. What is being removed (the AI tells)

| Remove | Where today |
|---|---|
| Electric-blue accent and radial blue glows / blurred circles | `globals.css`, Hero, ProductDetail, WebDesign, Approach, Contact, `/web-design` |
| three.js shader orb hero | `components/three/*`, `Hero.tsx` |
| Icon-in-rounded-square cards (lucide icons in boxes) | Services, Approach, WebDesign, `/web-design` |
| Mono uppercase eyebrow labels (`[ Software studio · AI products ]`, `01`) | `SectionHeading`, most sections |
| Identical eyebrow → headline → grey paragraph → card-grid rhythm in every section | all sections |
| Pill buttons with glow shadow, pulsing dot, gradient-filled product names | `Button.tsx`, Hero, ProductDetail |
| Geist font | `layout.tsx` |
| Chrome/blue PNG logo in header and footer | `Logo.tsx` (file stays in `/public`, just unused) |
| "AI voice" copy (see §7) | `src/content/*.ts` |

## 3. Visual system

### Palette
Monochrome studio; color appears only inside product scenes.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0D0D0B` | page background |
| `--ink-2` | `#161614` | surfaces (code-built screens, browser frame) |
| `--bone` | `#ECE8DF` | primary text, primary CTA fill, receipt |
| `--ash` | `#8E8B84` | muted text (≈5.6:1 on ink, passes AA) |
| `--line` | `#ECE8DF` at ~10–12% alpha | hairlines |
| `--rounds` | `#7FA88C` | rounds.health scene only |
| `--redlines` | `#E5484D` | redlines.legal scene only |

Text below `--ash` contrast is only allowed for decorative or very large display text (e.g. the dimmed `/studio` suffix, the unlit manifesto words).

### Typography
- **One family:** Bricolage Grotesque (variable, `opsz` 12–96, `wght` 300–800) via `next/font/google`, Latin subset, `display: swap`.
- **Display:** 700, tracking about −0.06em, line-height 0.8–0.9, sized with `clamp()` against viewport width so it fills the width at every breakpoint.
- **Headings:** 600, tracking about −0.03 to −0.045em.
- **Body:** 400, 17–18 px, line-height 1.5, 35–60 chars per line on phones, ≤ 70 on desktop.
- **Labels:** 500, 13 px, sentence case, `--ash`. No monospace and no uppercase tracking anywhere.
- Tabular figures wherever numbers align.

### Shape, texture and controls
- Corner radius 0–2 px everywhere (the phone mockup frame is not part of the site).
- No shadows, gradients or glows. The only texture is a faint static film-grain background (tiny inline SVG noise, not animated).
- **Primary CTA:** a solid bone rectangle with ink text, at most one per screen, at least 48 px tall on touch.
- **Everything else:** text links with an underline that draws in on hover/focus.
- Visible focus rings (bone, 2 px, offset) on all interactive elements.

### Wordmark
The header and footer use a typeset "QuickLabs" in Bricolage 700, in bone. `Logo.tsx` is rewritten to render this text (no image). `favicon.ico` is unchanged.

### Layout
- Mobile-first Tailwind classes (default = phone, then `md:`/`lg:`/`xl:`).
- Breakpoints tested: 375, 390, 430, 768, 1024, 1440.
- Side gutters 20 px on phones, scaling up to 48 px on desktop. Max content width about 1440 px; display type may bleed to the viewport edge.
- Full-height scenes use `svh`/`dvh`, never `100vh`.
- No horizontal overflow at any width (`overflow-x: clip` on the root as a safety net, not a crutch).
- Fixed header respects `env(safe-area-inset-top)`, and bottom CTAs respect `safe-area-inset-bottom`.
- 4/8 px spacing scale.

## 4. Homepage scenes

Each scene is its own component in `src/components/sections/`. "Desktop" means `(min-width: 1024px) and (pointer: fine)`; everything else gets the touch behavior.

1. **Hero**
   - Desktop: a huge `QuickLabs` + dimmed `/studio` wordmark anchored bottom-left, with a short positioning line top-right. A bottom rule holds "Scroll" on the left and a "Start a project →" link on the right.
   - Phone: the wordmark stacks as `Quick` / `Labs` / `/studio` filling the width, the positioning line sits below it, and a full-width solid CTA sits in the thumb zone.
   - Motion: letters mask up on load, once, about 1 s total.
2. **Manifesto**
   - One paragraph, 2–3 sentences, saying who QuickLabs is and why (both audiences).
   - Words go from 0.18 to 1 opacity, scrubbed by scroll, on all devices. It is not pinned, and it is readable with JS off (renders at full opacity).
3. **Products** (signature)
   - Desktop: pinned for about 2 viewport heights. On the left: product label ("Product 01 · Healthcare"), the name split across two lines (`rounds` / `.health`), a one-line description, a "Visit ↗" link and a two-segment progress bar. On the right: a code-built screen.
     - **rounds.health:** an `--ink-2` window where a pre-visit summary types itself out (chief complaint, history, meds), with sage field labels and a caret.
     - **redlines.legal:** a bone "document" in a serif body where a clause gets struck through and replaced in track-changes red (`del`/`ins` semantics).
     - Scroll progress drives the screen's timeline, then crossfades to the second product.
   - Phone: two stacked chapters, each with label, name, line, screen and link. Each screen plays its timeline once when 40% visible.
   - The screen content is static data in `src/content/products.ts`. Accessibility: the screens are `aria-hidden` decoration, and the real product description is in the text.
4. **Services**
   - Desktop: a large type list (Websites / AI products / Integrations / Product design) with hairlines between rows. Hovering or focusing a row keeps it bright, dims the others to about 25%, and slides in its one-line description on the right.
   - Phone: every row shows its title and description stacked; nothing depends on hover.
5. **Web design offer**
   - Desktop: a short pin (about 1 viewport). On the left, a code-built browser window where a wireframe site assembles block by block, ending with the CTA block turning solid bone. On the right, the heading "Websites, looked after." and a ledger (Design & build — once; Hosting, Maintenance, Content changes, Support & monitoring — monthly), with a link to `/web-design`.
   - Phone: the browser window on top (plays once), the ledger below.
6. **Principles**
   - Three oversized statements, each with one short supporting line: Compliance first, Where people already work, Built for specialists.
   - Lines wipe up from a mask on entry. On phones the support line goes under the statement. No cards and no icons.
7. **Contact + footer** (shared `Closer` component)
   - A small intro line, then the email address as a near-full-width headline with an underline that draws on hover. The footer row (product links · nav · ©) sits inside this scene, so there's no separate boxed footer.
   - Phone: the email breaks into `info@` / `quicklabs` / `.ai`, plus a full-width "Email us →" solid button.
   - Both the heading and the button are `mailto:` links.

### Header and navigation
- The header is transparent over the hero and gets a solid ink background with a bottom hairline after 16 px of scroll (no blur).
- Nav: Products (`/#products`), Services (`/#services`), Web design (`/web-design`), Contact (`/#contact`).
- Phone: the wordmark plus a 44×44 menu button that opens a full-screen ink overlay with large stacked links (staggered mask-in), a contact CTA at the bottom, Escape/close support and a body scroll lock. This keeps the current `Header.tsx` behavior, restyled.

## 5. `/web-design` page

1. **Hero:** a "← QuickLabs" back link and a giant two-line headline, "Websites, / looked after." (second line dimmed). Under a rule: one sentence and a single "Start a project →" CTA. On phones the headline stacks into three lines and the CTA is full-width.
2. **What we build:** the six services from the offer as a two-column list of titles with descriptions and hairlines (one column on phones). Rows wipe in with a 40 ms stagger.
3. **Care plan** (signature)
   - On the left, the heading "One plan. Everything covered." and a short line.
   - On the right, a bone receipt with a perforated bottom edge. Header "Care plan · Monthly", then five line items (Hosting, Maintenance & updates, Content & design changes, Technical support, Performance monitoring — each "included"), and a total line that reads **"Ask us"** (no price shown).
   - The line items print in one by one on entry, then the total.
   - Phone: the heading, then a full-width receipt.
4. **Contact + footer:** the shared `Closer` with page-specific intro text. It uses `mailto:`, replacing the current Gmail compose URL.

Metadata and OG text on this page are updated to match the new copy.

## 6. Motion and performance

### Libraries
- **Keep:** `gsap` (core + ScrollTrigger + SplitText, all free and already installed) and `lenis` (already integrated in `SmoothScroll.tsx`).
- **Remove:** `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `motion`, and `lucide-react`. The design uses no icons; arrows (→ ↗ ←) are text glyphs, and the menu toggle is a small inline SVG.
- **Delete:** `components/three/*`, `lib/motion.ts`, `components/ui/Icon.tsx`, `components/ui/Badge.tsx`, and the old `Reveal`/`SplitText` once they're replaced.

### Motion primitives (`src/components/motion/`)
- `MaskText`: line or character masks via GSAP SplitText. Plays once, either on load or in view.
- `ScrubWords`: per-word opacity tied to scroll.
- `PinnedScene`: uses `gsap.matchMedia()` to pin and scrub on desktop+fine-pointer. Otherwise it renders normally and plays the timeline once on entry.
- Scene visuals: `TypewriterNote`, `RedlineDoc`, `SiteAssemble`, `Receipt`. These are plain DOM + CSS driven by GSAP timelines (no canvas, images or WebGL).

### Rules
- Shared tokens: `--ease-out: cubic-bezier(0.22,1,0.36,1)`, `--ease-in-out: cubic-bezier(0.83,0,0.17,1)`. Durations: micro 200 ms, reveal 700–900 ms; exits about 30% faster than entrances.
- Animate only `transform`, `opacity` and `clip-path`.
- One featured animation per viewport.
- All ScrollTriggers are created inside `gsap.context()`/`matchMedia` and reverted on unmount, and refresh after fonts load.
- Touch devices never get pinned or scroll-jacked; Lenis keeps `syncTouch: false`.
- `prefers-reduced-motion: reduce` means no pins, no scrub and no masks. Content renders in its final state (code-built screens show their finished frame) with at most a 200 ms fade.
- Server-render first: every scene's final content is in the HTML, so the page is complete without JS. Hide-before-animate styles only apply after JS confirms motion is allowed, which avoids a blank flash or invisible text.

### Performance
- Hero LCP is text-only.
- One self-hosted variable font.
- Pinned-scene code is client components scoped to their scenes; static sections stay server components.
- Measure JS bundle size before and after, and record it in the PR.

## 7. Copy rewrite

Copy is rewritten in `src/content/*.ts`. Rules:
- Plain, concrete, short sentences. Say what QuickLabs makes and for whom.
- Banned patterns:
  - "We don't X. We Y." / "Most agencies… We…"
  - "not just X, but Y"
  - "for the work that has to be right" and similar slogans
  - rhetorical em-dash asides
  - three-item lists used only for rhythm
  - "real human, not a form receipt"-style quips
  - "seamless", "cutting-edge", "leverage", "empower", "elevate", "unlock"
- No invented facts: no client names, testimonials, metrics, founding year, team size or locations unless supplied by the owner. Compliance claims stay exactly as they are in today's content (HIPAA · SOC 2 · ISO 27001 for rounds).
- Placeholder copy in the brainstorm mockups is a tone reference only.
- **Review gate:** the full rewritten copy is presented to the owner for approval as one content diff before the visual build is considered done.

## 8. File impact (summary)

- **Rewrite:** `app/globals.css` (tokens, grain, base), `app/layout.tsx` (font, header/footer), `app/page.tsx` (scene order), `app/web-design/page.tsx`, `components/layout/Header.tsx`, `components/layout/Footer.tsx` (folded into `Closer`), `components/ui/Button.tsx`, `components/ui/Logo.tsx`, `components/ui/Container.tsx` (gutters), and all `components/sections/*`.
- **New:** `components/sections/Manifesto.tsx`, `components/sections/Closer.tsx`, `components/motion/{MaskText,ScrubWords,PinnedScene}.tsx`, `components/visuals/{TypewriterNote,RedlineDoc,SiteAssemble,Receipt}.tsx`.
- **Delete:** see §6.
- **Content:** `copy.ts`, `products.ts` (add screen data), `services.ts`, `approach.ts`, `webdesign.ts`, `site.ts` (nav) — the icon fields are removed.

## 9. Verification

- `npm run build` and `npm run lint` pass.
- Browser screenshots of both pages at 375, 390, 430, 768, 1024 and 1440, plus phone landscape (e.g. 844×390). Check for horizontal overflow, clipped text and tap-target size.
- Reduced-motion pass (emulated): all content visible, no pins.
- JS-disabled pass: all content visible.
- Keyboard pass: logical tab order, visible focus, menu operable, Escape closes the menu.
- Lighthouse mobile on both pages meets the §1 targets.
- An "AI tell" checklist review against §2 and §7.

## 10. Out of scope

CMS, contact forms, new pages (case studies, blog), real product screenshots (a later swap-in can replace the code-built screens), a logo redesign, analytics, and SEO changes beyond updating metadata text.
