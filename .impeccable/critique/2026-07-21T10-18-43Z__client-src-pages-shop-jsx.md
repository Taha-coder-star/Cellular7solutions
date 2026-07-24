---
target: Shop page (client/src/pages/Shop.jsx)
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-07-21T10-18-43Z
slug: client-src-pages-shop-jsx
---
Method: dual-agent (A: general-purpose aebb2868 · B: general-purpose a98449b7)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading/result-count use `aria-live="polite"`, skeletons present; no progress indicator on price-form Apply submit |
| 2 | Match System / Real World | 3 | Category/brand/condition language is plain and correct |
| 3 | User Control and Freedom | 4 | Per-filter chip removal, "Clear all" in both sidebar and sheet, URL-param back/forward all give clean escape hatches |
| 4 | Consistency and Standards | 4 | Native `<details>` accordion, native `<dialog>` sheet, real radio/checkbox inputs throughout |
| 5 | Error Prevention | 3 | Price min/max requires explicit "Apply" (good), but no guard against min > max |
| 6 | Recognition Rather Than Recall | 4 | Active filters always visible as chips; sidebar counts show live totals |
| 7 | Flexibility and Efficiency | 3 | "Show N more" keeps 13 categories scannable without hiding capability |
| 8 | Aesthetic and Minimalist Design | 3 | Sidebar now well-bounded, grid airy at 280px card cap; long product names untested for overflow |
| 9 | Error Recovery | 3 | Network-failure and empty-state both have message + explicit recovery button |
| 10 | Help and Documentation | 2 | No inline filter help — acceptable for a shop grid, scored neutral |
| **Total** | | **32/40** | **Good — address weak areas, solid foundation** |

## Anti-Patterns Verdict

**LLM assessment**: Clean of slop. No stripe accents, gradient text, glassmorphism, numbered eyebrows, or hero-metric template. The native `<details>`/`<dialog>` disclosure UI and restrained ease-out motion curve read as deliberately engineered, not templated.

**Deterministic scan**: 3 minor token-drift findings, all pre-existing and unchanged from the last run — `design-system-radius` on Shop.jsx:50 (4px) and Checkbox.jsx:35 (6px), `design-system-font-size` on Select.jsx:48 (12px). No findings on ProductCard.jsx, Badge.jsx, or MainLayout.jsx. The browser detector's `overused-font`/`single-font` flags ("100% Inter") are **false positives** against this project's own system — DESIGN.md's One Weight Family Rule explicitly mandates Inter throughout.

**Visual overlays**: Browser evidence confirms all three recent fixes hold up live: at 1920px, the `<aside>` sidebar computes `display: block` while the Filters trigger button computes `display: none` — no redundant control. The single-result search case (`?search=Vintage Brown Wallet Case`) renders one normally-sized, left-aligned card, not a stretched full-row image. The category list shows 6 items plus a working "Show 8 more" toggle.

## Overall Impression

Score moved from 25/40 to 32/40 since the last run. All three targeted fixes (category disclosure, redundant filter button, single-item grid stretch) verified working in the browser with no regressions. Remaining issues are now minor/functional polish (focus management in the mobile sheet, no min>max guard on price) rather than the structural/consistency problems from before. The known data issues (prices, duplicate photos, "VARIOUS" label) are unchanged and intentionally out of scope this round.

## What's Working

- Category disclosure (`VISIBLE_CATEGORY_COUNT = 6`, Shop.jsx:202, 261-266) keeps Brand/Condition reachable without a scroll-hunt; toggle and hover state confirmed working live.
- Redundant filter entry point resolved: at 1920px only `<aside className="hidden lg:block">` renders; `FiltersTriggerButton`'s `lg:hidden` now actually applies (no inline-style conflict).
- Single-result grid renders a normally-bounded card (`minmax(220px, 280px)`), not a stretched hero image.
- Reserved Accent Rule respected: "Add to Cart" stays graphite-900/white; cobalt appears only on the Select/Input focus ring.

## Priority Issues

**[P2] Mobile filter sheet lacks focus management** — `<dialog>` opens via `showModal()` but nothing moves focus to the sheet or its close button, leaving keyboard/AT users' focus landing inconsistent. Fix: focus `SheetCloseButton` or the search input in `openSheet()`. → `/impeccable harden`

**[P2] Price range has no min>max guard** — `submitPrice` (Shop.jsx:239-242) passes minPrice/maxPrice straight through unvalidated; a user typing Min=100/Max=10 gets a silent empty result with no explanation. Fix: swap or reject with an inline hint before firing `onFilterChange`. → `/impeccable harden`

**[P3] "VARIOUS" brand label has no presentation guard** — unlike the empty-brand case (`ProductCard.jsx:59` already conditionally renders `brand && …`), the literal string "VARIOUS" renders with the same visual treatment as a real brand name, independent of when the underlying data gets fixed. → `/impeccable clarify`

**[P3] Long product names could overflow the fixed-width card** — `ProductCard.jsx:64-66` has no line-clamp/overflow guard on the name; not visible in current data but a longer name than any in this catalog would break the card's tidy edge. Fix: add `-webkit-line-clamp: 2; overflow: hidden`. → `/impeccable harden`

**[P3] "Newest" sort has no visual default-vs-chosen distinction** — minor IA nit, low severity.

## Persona Red Flags

**Jordan (First-Timer)**: Landing on `/shop` with 83 results and a collapsed 6-item category list is calm, not intimidating — the disclosure fix directly helps here. Remaining risk: literal "VARIOUS" brand tag under every product still reads as broken/untrustworthy to a skeptical first-time buyer (known data issue, compounds its trust cost even though out of scope).

**Riley (Stress Tester)**: Single-result search passes clean — normal card, no layout break, chip shows exact query text. Filter combos compose cleanly via one `URLSearchParams` merge with no observed conflicts. Gap: entering min=100/max=10 has no defense (see P2) — likely produces a silent zero-result with no explanation.

## Minor Observations

- `ToggleRow`'s `aria-expanded` is set but not wired to `aria-controls` on the category list — nice-to-have, not urgent.
- Skeleton loading state remains well-matched to real card proportions.
- `Chip` remove button correctly gets a distinct `aria-label` per filter type.
- Token-drift findings (Shop.jsx:50, Checkbox.jsx:35, Select.jsx:48) are unchanged from the prior run, still minor/polish-tier.

## Questions to Consider

- Should the mobile filter sheet's initial focus move to the close button or search input when opened?
- Is a min>max guard worth adding now, or does it wait for the broader price/data hardening pass?
- Should the brand eyebrow be suppressed entirely for "Various"-type seed values, ahead of the underlying data fix?
