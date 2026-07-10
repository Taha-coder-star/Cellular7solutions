---
target: home
total_score: 22
p0_count: 2
p1_count: 2
timestamp: 2026-07-10T05-40-30Z
slug: client-src-pages-home-jsx
---
Method: dual-agent (A: general-purpose design review · B: general-purpose detector+browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | TopProducts has loading/error/empty states, but no retry action on API error |
| 2 | Match Between System / Real World | 3 | Copy is plain and domain-appropriate |
| 3 | User Control and Freedom | 3 | Standard nav, no traps |
| 4 | Consistency and Standards | 1 | Georgia serif intrusion in TopProducts; cobalt used outside the Reserved Accent Rule in 4+ places |
| 5 | Error Prevention | 3 | No risky interactions on homepage |
| 6 | Recognition Rather Than Recall | 3 | Category icons + labels, mega menu aid scanning |
| 7 | Flexibility and Efficiency | 2 | No shortcuts/personalization; unremarkable but not broken |
| 8 | Aesthetic and Minimalist Design | 1 | 5 competing CTAs, duplicate "Just Landed" eyebrows, mixed typefaces |
| 9 | Error Recovery | 2 | TopProducts error message is generic, no retry |
| 10 | Help and Documentation | 1 | Zero contextual reassurance anywhere (no "how buying used works," no warranty note near products) |
| **Total** | | **22/40** | **Acceptable band — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**Start here. Does this look AI-generated?**

**LLM assessment**: Yes, and clearly so. Five distinct homepage sections each carry an uppercase tracked eyebrow ("Just Landed" ×2, "Browse the store", "Repair & Service", "Customer Stories") — the exact saturated 2023-era AI scaffold the brand register bans outright. "Just Landed" is reused verbatim across two unrelated sections (hero tagline, featured-products grid), which reads as copy-paste template generation rather than a deliberate brand kicker system. Combined with fabricated testimonials and an unexplained serif intrusion "for personality," the page fails the brand slop test: a visitor would ask "which AI made this," not "how was this made."

**Deterministic scan**: `detect.mjs` returned exit code 2 with 8 findings against `client/src/pages/Home.jsx`, `components/home/*`, `Navbar.jsx`, `Button.jsx`, `Card.jsx`:
- 2 **warnings**: `design-system-font` — Georgia in `TopProducts.jsx:71` and `:124`, not declared anywhere in DESIGN.md's Inter-only typography.
- 6 **advisories**: `design-system-font-size` / `design-system-radius` — off-ramp values at `Home.jsx:58` (12px), `Home.jsx:96` (15px), `TopProducts.jsx:24` (4px radius), `TopProducts.jsx:72` (44px), `Navbar.jsx:127` and `:170` (10px).

No false positives — the detector did **not** flag the cobalt eyebrow color or the uppercase-label pattern itself (those are register/voice judgments, not tokenizable rules), so nothing here needs to be discounted. The Georgia warning corroborates Assessment A's independent read: it's a real, deliberate-looking deviation from the documented type system, not an accident, which makes it worse, not better — someone chose to break the One Weight Family Rule.

**Visual evidence** (Playwright, no persistent overlay — screenshots + computed styles captured directly): Desktop (1440px) renders cleanly, no section overlap. The hero's device-photo area is a gray placeholder (matches the "swap this placeholder" code comment — confirmed unshipped, not a bug in the traditional sense). At mobile width (390px), the hero's absolutely-positioned copy block (`right: 64px`) sits roughly **2px** from the absolutely-positioned social-icon rail (`left: 20px`) — the globe icon visually touches the "E" in "Everything Tech." in the captured screenshot. Nothing clips today, but the margin to the fixed 600px section height is thin enough that one more line of copy breaks it. Contrast was checked directly and is not a problem: hero eyebrow (cobalt-300 on graphite-900) ≈9.8:1, hero H1 (white on graphite-900) ≈18.8:1, second-section eyebrow (cobalt-700 on white) ≈6.7:1 — all pass WCAG AA, most pass AAA. Console showed 5 `ERR_CONNECTION_REFUSED` calls to `localhost:5000/api/*` — the backend isn't running in this environment, which is why "Featured this Week" renders its empty-state copy in the screenshot; this is an environment issue, not a frontend defect, but worth knowing before judging that section's current visual weight.

## Overall Impression

The bones are good — the token system, Button/Card component API, and the loading/error/empty state handling in TopProducts show real engineering discipline. But the page doesn't yet look like *this* brand; it looks like a template that happens to use this brand's tokens. The uppercase-eyebrow-per-section pattern, the reused "Just Landed" copy, the fabricated testimonials, and the unexplained serif all point the same direction: sections were assembled independently rather than composed as one story. The single biggest opportunity is enforcing the two Named Rules already written down in DESIGN.md (Reserved Accent, One Weight Family) — most of what's undermining trust and consistency here is the system being ignored, not a system that doesn't exist.

## What's Working

- **TopProducts.jsx** correctly implements a loading skeleton, an error fallback with a recovery link, and an empty state (lines 98–111) — the state-handling discipline missing from the rest of the page.
- **Categories.jsx / RepairCTA.jsx** correctly separate "Book Repair" (service variant) from "Shop" CTAs at the component level — `Button.jsx`'s `product` vs `service` variants prove the underlying color system is sound where it's actually used as designed.
- **Contrast and accessibility basics** are solid throughout: every checked text/background pair passes WCAG AA (several hit AAA), aria-labels are present on icon-only social links.

## Priority Issues

**[P0] Fabricated testimonials presented as real**
Why it matters: `Testimonials.jsx` hardcodes named quotes ("Amina R.", "Bilal K.", "Sara M.") with 5-star ratings, styled identically to genuine reviews — but PRODUCT.md states explicitly that **no real proof exists yet**. This directly contradicts the "Trust before transaction" design principle and the belief ladder this page exists to climb. If a skeptical first-time buyer ever discovers this, it's worse than having shipped no testimonials at all.
Fix: Remove the section until real reviews/quotes exist, or replace with a neutral, verifiable trust element.
Suggested command: `/impeccable harden` (or `/impeccable clarify` for the copy swap)

**[P0] Reserved Accent Rule violated across four non-service sections**
Why it matters: DESIGN.md's Named Rule states cobalt blue means "repair or service," full stop. It's currently used for the hero eyebrow (`Home.jsx:58`), TrustStrip's check-circle icons (`TrustStrip.jsx:14`), the Categories eyebrow (`Categories.jsx:74`), the TopProducts eyebrow (`TopProducts.jsx:62`), the Testimonials eyebrow and star rating (`Testimonials.jsx:18,49`), and the nav active-state underline (`Navbar.jsx:23`). Diluting cobalt across generic content erases the one signal it's supposed to carry — "this is the paid-service path."
Fix: Swap every non-service cobalt instance to graphite (`var(--brand-primary)`) or `var(--text-muted)`; `RepairCTA.jsx` is currently the only correctly-scoped usage — use it as the reference.
Suggested command: `/impeccable colorize` (in "restore discipline," not "add color," direction)

**[P1] Second typeface breaks the One Weight Family Rule**
Why it matters: `TopProducts.jsx:71` and `:124` set `fontFamily: 'Georgia, "Times New Roman", serif'` for the section heading and every product name. This is explicitly banned by DESIGN.md and independently flagged by the detector as a warning (not advisory) — it visually detaches the store's flagship product grid from the rest of the Inter-only system.
Fix: Remove the serif override; use the existing h2/label tokens (Inter, `var(--fw-extrabold)`).
Suggested command: `/impeccable typeset`

**[P1] Hero and repair-CTA ship with icon-on-gradient placeholders, not real imagery**
Why it matters: Both `Home.jsx:31-43` and `RepairCTA.jsx:78-86` render a Lucide icon on a radial gradient with a code comment marking it "temporary." For an image-implying retail/repair brief, this is the site's single highest-trust surface, and per the brand register's imagery rule, shipping a placeholder here is a bug, not restraint.
Fix: Source or commission at minimum one real lifestyle/product photo for the hero and one technician/workbench photo for RepairCTA before this leaves staging.
Suggested command: `/impeccable delight` or direct asset sourcing (not a code-only fix)

**[P2] Hero copy crowds the mobile icon rail — confirmed, not hypothetical**
Why it matters: Measured directly in a 390px-wide screenshot: the absolutely-positioned hero copy block (`right: 64px`) sits ~2px from the absolutely-positioned social-icon rail (`left: 20px`); the globe icon visually touches the "E" in "Everything Tech." Nothing clips today, but there's no margin left for one more line of copy or a longer eyebrow label, and the fixed `height: 600px` with `overflow: hidden` (`Home.jsx:20`) means any overflow is silently cut, not reflowed.
Fix: Convert the hero to responsive flex/grid stacking below ~768px; drop the fixed 600px height for a min-height + content-driven approach.
Suggested command: `/impeccable adapt`

## Persona Red Flags

**Jordan (Confused First-Timer)**: The first action is technically clear ("Shop New Arrivals"), but it's immediately followed by four more competing CTAs (View all products, Book Repair, Get a Free Quote, View all) before any real content loads — no single obvious next step survives past section 3.

**Riley (Deliberate Stress Tester)**: TopProducts' error state is a plain text link with no retry button and no visual distinction from a normal state; long product names have no truncation handling in the grid card, risking layout breakage on real data.

**Casey (Distracted Mobile User)**: Confirmed by direct measurement — the hero's fixed `right: 64px` absolute positioning collides with the 17px social icons at mobile widths, and both sit well under the 44×44pt touch-target minimum.

**Dana (Skeptical Online Shopper — project-specific)**: A first-time visitor deciding whether to trust an unfamiliar phone/electronics retailer with money, having never been to the physical store. Checks reviews before buying, looks for a return/warranty policy, scrutinizes "used" language. Red flags found: fabricated testimonials, no warranty/condition info anywhere near products, and zero real photos of the actual store, staff, or repair bench — nothing on the page that couldn't have been generated for a business that doesn't exist.

## Minor Observations

- Footer and hero social icons link to `href="#"` — dead links undermine the exact legitimacy this page is trying to establish.
- The "Deals" nav link (per Navbar) is styled in warning-amber, which reads close to the discount-sticker accent PRODUCT.md explicitly lists as an anti-reference.
- Six font-size/radius advisories from the detector (`Home.jsx:58,96`, `TopProducts.jsx:24,72`, `Navbar.jsx:127,170`) are all off the documented DESIGN.md scale — low severity individually, but collectively suggest the type/spacing scale isn't being consistently referenced.
- The "Featured this Week" empty-state render in the current screenshot is a backend-connectivity artifact (API on :5000 isn't running in this environment), not a frontend bug — don't chase it as one.

## Questions to Consider

- If cobalt is supposed to mean "this costs a service fee," what does a first-time visitor conclude when it also colors five unrelated things — is the color system doing its job for anyone but the team that built it?
- Would this business publish a customer quote under a stranger's name in an email — and if not, why is it acceptable rendered as pixels on the homepage?
- Is a homepage with five CTAs and zero real photos actually more persuasive than a shorter page with one CTA and one real photo?
