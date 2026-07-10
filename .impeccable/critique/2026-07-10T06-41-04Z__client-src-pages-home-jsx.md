---
target: home
total_score: 26
p0_count: 0
p1_count: 3
timestamp: 2026-07-10T06-41-04Z
slug: client-src-pages-home-jsx
---
Method: dual-agent (A: general-purpose design review · B: general-purpose detector+browser evidence)

This is a re-critique of the same target (`home`), first scored 22/40 with 2 P0 / 2 P1.

## Fixes verified since the last run

| Claim | Status | Evidence |
|---|---|---|
| Fabricated testimonials removed | ✅ Verified | `grep -rn "Testimonials" client/src` returns zero matches; no file, no import |
| Cobalt restricted to repair/service (Reserved Accent Rule) | ✅ Verified | Every non-service usage in Home.jsx, TrustStrip.jsx, Categories.jsx, TopProducts.jsx, Navbar.jsx now resolves to graphite tokens; programmatic cobalt-RGB scan across TrustStrip/Categories returned zero matches; RepairCTA correctly keeps cobalt |
| Mobile hero crowding (social-icon rail) | ✅ Verified | No social-rail code exists anywhere in the repo; distinct mobile/desktop gradient paths confirmed via `block md:hidden`/`hidden md:block` |
| Navbar "Deals" amber → graphite | ✅ Verified | `DealsLink` resolves through `var(--brand-primary)`, not warning-amber |
| Navbar focus rings / 44×44 touch targets | ✅ Verified | Computed focus outline renders (graphite, solid) after React re-render settles; Search/Cart/Sign-In all measure exactly 44×44 via `getBoundingClientRect()` |
| Hero real imagery | ✅ Verified | Real photo in place with responsive gradient overlays, descriptive alt text |
| TopProducts Georgia serif | ❌ Still unfixed | Detector flags it as a `warning` at lines 71 and 124; confirmed by direct read |
| RepairCTA placeholder photo | ❌ Still unfixed | Code comment admits it; renders literal "REPAIR PHOTO" text + wrench icon, not a photo |

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good skeleton/loading states in TopProducts, ShopMegaMenu |
| 2 | Match Between System / Real World | 3 | Plain, jargon-free copy |
| 3 | User Control and Freedom | 3 | Mega menu / mobile menu close cleanly |
| 4 | Consistency and Standards | 2 | Georgia serif still breaks the One Weight Family Rule; RepairCTA's two CTAs both route to `/repair` |
| 5 | Error Prevention | 3 | Graceful API-failure fallbacks |
| 6 | Recognition Rather Than Recall | 3 | Icons + labels + counts on categories |
| 7 | Flexibility and Efficiency | 2 | Duplicate repair CTAs offer no meaningfully different path |
| 8 | Aesthetic and Minimalist Design | 2 | Georgia + unproven stat claims + literal "REPAIR PHOTO" placeholder dent premium restraint |
| 9 | Error Recovery | 3 | Clear fallback links on failure states |
| 10 | Help and Documentation | 2 | No visible help/FAQ affordance |
| **Total** | | **26/40** | **Acceptable, up from 22 — real progress, no more P0s** |

## Anti-Patterns Verdict

**LLM assessment**: Mostly clean now — the fabricated testimonials are genuinely gone. But **TrustStrip's unverifiable "10,000+ Repairs" / "Same Day Service" / "Genuine Parts" strip is the same species of unproven trust-claim as the deleted testimonials, just reformatted as stats** — no source, no link, just asserted numbers, on a page whose own PRODUCT.md says "Proof on hand: none currently available." Removing one fabrication while leaving an adjacent one standing is a real gap, not a completed fix.

**Deterministic scan**: `detect.mjs` returned exit 2, 6 findings, all advisory/warning (no blockers): 2 **warnings** confirm the Georgia serif is still present (`TopProducts.jsx:71,124`); 4 advisories for off-scale radius/font-size (`TopProducts.jsx:24,72`, `Navbar.jsx:106`, `ShopMegaMenu.jsx:79`). No placeholder-image rule exists in the detector, so RepairCTA's unfixed placeholder wasn't caught mechanically — confirmed instead by direct code read (the comment literally says "swap this placeholder... when available").

**Visual evidence**: Desktop screenshot confirms the real hero photo with proper gradient legibility; computed contrast on hero text estimated >10:1 (comfortably AA). Focus ring on Navbar confirmed rendering correctly in graphite after allowing the React state update to settle. Touch targets measured exactly 44×44. **Mobile-width rendering could not be directly verified this pass** — the test session's browser window was pinned at 1536×695 regardless of resize requests, an environment limitation, not a finding about the app. The no-crowding conclusion rests on code-level evidence (no social-rail code exists anywhere in the repo) rather than a rendered mobile screenshot; worth a follow-up visual check when the environment allows it.

## Overall Impression

Real, verifiable progress — both original P0s are gone, not just reworded, and the fixes hold up under independent re-checking rather than just trusting the summary. The score moved from 22 to 26. What's left is a smaller, more specific punch list: one unfinished visual-parity item (RepairCTA's placeholder, sitting right next to the hero photo that got the real-photo treatment), one lingering typography violation (Georgia), and one new-shape version of the old trust problem (TrustStrip's unsourced stats) that a testimonials-focused fix pass understandably didn't catch the first time.

## What's Working

- **Hero**: real photography, responsive gradient handling, and a genuinely polished `HeroCTA` press/hover/focus state machine — this is flagship-quality work.
- **Navbar**: real per-state hover/focus tracking (not just CSS `:hover`), consistent 44×44 touch targets, verified by direct measurement rather than assumption.
- **TopProducts / ShopMegaMenu**: thoughtful loading/empty/error state coverage — robust for a homepage widget, unaffected by the Georgia issue sitting alongside it.

## Priority Issues

**[P1] TrustStrip's unsourced trust claims are the testimonials problem in a new shape**
`TrustStrip.jsx` asserts "10,000+ Repairs," "Same Day Service," "Genuine Parts" as flat fact with zero substantiation, on a page whose own PRODUCT.md says no real proof exists yet. This is the same category of issue as the deleted testimonials — fabricated confidence signals — just reformatted as a stat strip instead of named quotes.
Fix: replace with neutral, unfalsifiable value props ("Same-day repairs available," "Genuine parts only") that don't imply an audited number, or footnote/source the numbers if they're real.
Suggested command: `/impeccable clarify` or `/impeccable harden`

**[P1] TopProducts Georgia serif — confirmed still present**
`TopProducts.jsx:71,124`, independently re-flagged by the detector as a warning. Breaks the One Weight Family Rule, creates a jarring seam on an otherwise Inter-only page.
Fix: swap to `var(--font-sans)` with token-based sizing matching the rest of the page's scale.
Suggested command: `/impeccable typeset`

**[P1] RepairCTA placeholder — confirmed still present**
`RepairCTA.jsx:80-88` renders a literal "REPAIR PHOTO" label + wrench icon, not a photo — right in the section meant to build trust for the site's #2 conversion priority (repair/trade-in), immediately after the hero got the real-photo treatment.
Fix: source a real technician/repair-bench photo, same treatment as the hero.

**[P2] RepairCTA's two CTAs route to the identical URL**
"Book Repair" and "Get a Free Quote" (`RepairCTA.jsx:70-75`) both link to `/repair` — a false choice that adds decision cost with zero functional difference, reading as unfinished rather than restrained.
Fix: differentiate the destinations, or collapse to one CTA.

**[P2] HeroCTA's focus ring is low-contrast against its own focus background**
`Home.jsx:38,42-44`: the focus outline is `2px solid var(--white)`, but the button's background also shifts to `var(--graphite-100)` (near-white) on focus — white-on-near-white is a weak focus indicator on the page's single most important CTA.
Fix: use a darker ring (graphite-900, or the design system's own `--focus-ring` cobalt token — which Navbar's own `FOCUS_RING` constant already ignores in favor of hardcoded graphite, a minor token-drift worth reconciling in the same pass).

## Persona Red Flags

- **Jordan (first-timer)**: no red flags — first action obvious in <5s, no jargon.
- **Riley (stress tester)**: `TopProducts.jsx` product names have no truncation/line-clamp in a fixed-aspect grid cell — a long real product name will wrap unpredictably. Also worth confirming `CartContext`'s default `cartCount` isn't `undefined` — Navbar's aria-label template (`Cart (${cartCount} items)`) would otherwise read "Cart (undefined items)" to a screen reader before the context resolves.
- **Casey (mobile)**: touch targets verified solid at 44×44; mobile-width visual crowding couldn't be re-screenshotted this pass (environment limitation), but no crowding code exists anymore at the source level.
- **Sam, the Sight-Unseen Skeptic (project-specific)**: scans for verifiable proof before trusting an unfamiliar retailer, distrusts placeholder imagery, treats duplicate/broken CTAs as a signal of an unfinished site. Red flags found now: TrustStrip's unsourced "10,000+ Repairs" stat, the literal "REPAIR PHOTO" placeholder, and the two identical-destination repair CTAs.

## Minor Observations

`colors.css` defines `--focus-ring: var(--cobalt-600)`, but Navbar's own `FOCUS_RING` constant hardcodes graphite instead — not a rule violation (still graphite, not decorative cobalt) but a small inconsistency with the design system's intended focus-ring token, worth reconciling. Desktop nav still carries 6 top-level items, a standard/acceptable nav exception to the ≤4 chunking guideline.

## Questions to Consider

- If "10,000+ Repairs" isn't backed by anything auditable, is it materially different from the fabricated testimonials that were just removed — or the same fabrication in a shape the last review didn't check?
- Why did RepairCTA's placeholder not get fixed alongside the hero's photo, when repair/trade-in is literally the site's #2 conversion priority?
- Is "Get a Free Quote" going to the exact same page as "Book Repair" a deliberate simplification, or a copy-paste nobody wired up?
