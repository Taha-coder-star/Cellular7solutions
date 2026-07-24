---
target: Shop page (client/src/pages/Shop.jsx)
total_score: 25
p0_count: 2
p1_count: 1
timestamp: 2026-07-21T09-10-44Z
slug: client-src-pages-shop-jsx
---
Method: dual-agent (A: general-purpose ab2d7990 · B: general-purpose ae71df4a)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Every product shows $0.00 — the single most important status signal is broken across the entire grid |
| 2 | Match System / Real World | 3 | Category/brand language reads naturally |
| 3 | User Control and Freedom | 3 | Chips + "Clear all" work well; radio-style single-select per group limits multi-select (can't pick two brands) |
| 4 | Consistency and Standards | 2 | Sidebar filter panel AND a "Filters" trigger button both visible simultaneously at desktop width (confirmed 1920px) |
| 5 | Error Prevention | 3 | Empty/error states exist and are graceful |
| 6 | Recognition Rather Than Recall | 2 | 13 categories render flat, always-open, pushing Brand/Condition off-screen |
| 7 | Flexibility and Efficiency | 3 | URL-param-driven filters are deep-linkable/shareable |
| 8 | Aesthetic and Minimalist Design | 2 | Grid itself is clean, but duplicate stock photos visually clutter the catalog |
| 9 | Error Recovery | 3 | Clear one-click recovery actions on error/empty states |
| 10 | Help and Documentation | 2 | n/a for a shop grid, scored neutral |
| **Total** | | **25/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment**: Structurally this doesn't look "AI slop" — no gradient text, no glassmorphism, no numbered eyebrows, no hero-metric template. The native `<details>` accordion and native `<dialog>` mobile filter sheet show real restraint. The slop signal here is data, not UI: three unrelated products render the exact same stock photo, and every visible price is $0.00. Polished chrome around broken/generic content reads as "assembled by a script," which undercuts the brand's core "trust before transaction" mandate.

**Deterministic scan**: `detect.mjs` found 3 findings — `design-system-radius` on Shop.jsx:50 (4px, off the DESIGN.md rounded scale) and Checkbox.jsx:35 (6px), and `design-system-font-size` on Select.jsx:48 (12px, off the type ramp). All minor, polish-tier. No findings on ProductCard.jsx, Badge.jsx, or MainLayout.jsx. Browser-injected detector flagged one console finding: `overused-font` ("Primary font: inter, 99% of text") — **this is a false positive against this project's own system**: DESIGN.md's "One Weight Family Rule" explicitly mandates Inter throughout with no second typeface, so the detector's generic heuristic doesn't apply here.

**Visual overlays**: Browser evidence confirms two of the most severe LLM-flagged issues directly in the screenshot: all visible prices read "$0.00," and three cards ("Smart Video Calling Camera," "Luxury Smartwatch Gift Set," "H30 7-in-1 Smartwatch Set") share the identical stock photo. It also confirms the brand eyebrow text literally reads "VARIOUS" on most cards, and that a "Filters" button renders in the main content area at the same time the full sidebar filter panel is present — corroborating the LLM's redundant-entry-point finding at desktop width.

## Overall Impression

The UI chrome is well-built and brand-compliant (native semantics, correct cobalt/graphite separation, clean skeleton states), but the page is undermined by three data-integrity failures — broken prices, duplicate photography, and a placeholder-looking "VARIOUS" brand label — that read as exactly the "generic reseller" look the brand explicitly wants to avoid. The single biggest opportunity: fix the price pipeline and image-fallback logic before any further visual polish, since no amount of design refinement rescues a shop where every product costs $0.00.

## What's Working

- `FilterSection` uses native `<details>/<summary>` for the accordion (Shop.jsx:183-198) — free keyboard/AT semantics, no custom state machine.
- Mobile filter sheet uses a native `<dialog>` (Shop.jsx:524-559) with correct ease-out motion, no bounce/elastic.
- The Reserved Accent Rule is respected throughout: `Button.jsx` separates `product` (graphite) from `service` (cobalt) variants, `ProductCard.jsx:77` always uses `variant="product"`, and `Select.jsx` uses cobalt only for the focus ring.

## Priority Issues

**[P0] All product prices render $0.00**
- Why it matters: price is the #1 purchase-decision input; a first-time visitor sees what looks like a broken or fake shop before evaluating anything else, directly undermining "trust before transaction."
- Fix: `normalizeProduct` in Shop.jsx (lines 24-34) maps `p.price` correctly in code, so the defect is upstream — trace `server/seed.js` / the inventory import script for a price field that didn't map from the Excel catalog for the 51 imported products.
- Suggested command: /impeccable harden

**[P0] Duplicate/mismatched stock photography in the grid**
- Why it matters: multiple unrelated products (a phone-lens clip, a smartwatch gift set, a 7-in-1 smartwatch set) share the identical photo; two RC car products share another identical photo. This reads as a copy-paste storefront, the fastest way to lose a sight-unseen buyer's trust.
- Fix: in the image-backfill script, mark products that received a generic category-level fallback (vs. a real per-product photo) and route low-confidence matches to the existing icon-fallback path in `ProductCard.jsx:51` instead of a wrong photo.
- Suggested command: /impeccable harden

**[P1] Category filter list is too tall, buries other filter groups**
- Why it matters: 13 categories render flat and always-open (Shop.jsx:227-234), pushing Brand/Condition off-screen on both breakpoints — breaches the working-memory / progressive-disclosure guidance (>4 items visible without disclosure).
- Fix: cap the visible list at ~6 with a "Show all categories" toggle, or set Category to `defaultOpen={false}` like Brand already is.
- Suggested command: /impeccable layout

**[P2] Redundant filter entry points at desktop width**
- Why it matters: both the sidebar filter panel and a separate "Filters" trigger button render simultaneously at desktop width (confirmed at 1920px in browser evidence) — two ways to reach the same control is confusing and suggests a breakpoint/Tailwind config mismatch.
- Fix: verify the `lg` breakpoint config lines up with the intended cutoff so `lg:hidden` / `hidden lg:block` don't both resolve visible at the same width.
- Suggested command: /impeccable adapt

**[P3] Brand shown as literal "VARIOUS" on most cards**
- Why it matters: "VARIOUS" reads as a placeholder/lorem value rather than an intentional label, reinforcing the "unfinished catalog" impression.
- Fix: confirm whether "Various" is an intentional seeded brand entity; if it represents "no specific brand," omit the eyebrow line entirely — `ProductCard.jsx:59` already conditionally renders `brand && …`, so passing `''`/`null` from the seed suppresses it cleanly.
- Suggested command: /impeccable clarify

## Persona Red Flags

**Jordan (First-Timer, comparing phones)**: Sees $0.00 on every product on first load — cannot compare price, the exact task she came to do. Two products she scans past share the identical photo, making her question whether the catalog is real. The flat 13-item category list means she scrolls past Category before reaching Brand, adding friction to a simple "show me Phones" task.

**Riley (Stress Tester)**: Long product names wrapped cleanly at two lines with no overflow. Price-range min/max inputs (Shop.jsx:256-258) have no visible validation preventing an inverted range — worth confirming the backend handles this gracefully rather than silently returning an unexplained empty state. The empty-filter state itself (Shop.jsx:485-495) is handled well, with a clear one-click recovery CTA.

## Minor Observations

- Radio-based single-select for Category/Brand/Condition (rather than checkboxes) prevents selecting e.g. "Apple + Samsung" simultaneously — reasonable as a lean v1 scope decision, not a bug.
- The site-wide repair-focused announcement bar ("You Break It. We Make It Again.") leads above the Shop page's own H1, slightly undercutting "buy-now is default path," though it correctly stays graphite/black rather than cobalt.
- `design-system-radius`/`font-size` deviations on Shop.jsx:50, Checkbox.jsx:35, Select.jsx:48 are minor token drift, not visible brand violations.
- Skeleton loading state (`ProductCardSkeleton`, Shop.jsx:42-57) is well-built and matches real card proportions.

## Questions to Consider

- Does the price pipeline need a data-integrity check (e.g. reject/flag $0 prices at import time) so this class of bug can't reach production again?
- Should low-confidence image matches be visibly distinguishable from confirmed per-product photos, even before this specific duplicate issue is fixed?
- Is "Various" ever a real, intentional brand value anywhere else in the catalog, or is it purely a null-fallback artifact?
