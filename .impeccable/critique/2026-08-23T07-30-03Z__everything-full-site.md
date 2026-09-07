---
target: everything (full site)
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
timestamp: 2026-08-23T07-30-03Z
slug: everything-full-site
---
Method: dual-agent (A: afbc1206bd3e19815 · B: a19748261d8c426b9)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeletons, live result counts, stock-dot status, "Added to Cart" swap all work well |
| 2 | Match System / Real World | 1 | Nav/homepage surface raw DB category names ("Store," "Other Galaxy S," "Other Galaxy A"); catalog references a fictional "iPhone 17 Pro Max" |
| 3 | User Control and Freedom | 2 | Footer "Shop" links silently no-op; mega-menu Escape/keyboard handling is solid |
| 4 | Consistency and Standards | 2 | Cobalt (service-only accent) leaks onto star ratings on every product surface; two unreconciled category systems (curated nav tree vs. flat Shop filter) |
| 5 | Error Prevention | 1 | A $0.00 product can be added to cart and carried to checkout with no price/catalog-completeness guard |
| 6 | Recognition Rather Than Recall | 3 | Breadcrumbs, active filter chips, sort labels all clear |
| 7 | Flexibility and Efficiency | 3 | Inline search-to-filter, mobile filter sheet, keyboard-navigable mega menu |
| 8 | Aesthetic and Minimalist Design | 1 | Category nav row is genuinely crowded (11 wrapping top-level items) against a "generous whitespace" brand mandate; white-on-#f4f4f5 text (1.1:1 contrast) is functionally invisible on Home and Shop |
| 9 | Error Recovery | 2 | Shop page has real retry/empty states; footer dead-links fail with zero feedback |
| 10 | Help and Documentation | 2 | No FAQ/help surface; Repair page copy substitutes reasonably for a service business |
| **Total** | | **20/40** | **Acceptable (borderline Poor)** |

Scored down one point from Assessment A's raw read on Aesthetic/Minimalist Design (2→1) after folding in Assessment B's deterministic contrast findings — invisible body text is a harder failure than "crowded nav" alone.

## Design Specificity Verdict

**LLM assessment (Assessment A):** The homepage hero, TrustStrip, and RepairCTA sections are genuinely authored for this business — graphite/cobalt discipline, the repair-metrics strip, the "sells it, fixes it, buys it back" voice all read as intentional. That authored feeling collapses at the catalog boundary: category nav and homepage "Shop by category" tiles surface raw, uncurated database category names, and the live catalog contains seed-data debris (a $0.00 "Streetwear Companion Red Case" for a nonexistent "iPhone 17 Pro Max"). A generic template wouldn't have this much graphite/cobalt discipline in the hero, but it also wouldn't leak internal data-modeling artifacts into primary navigation the way this build currently does.

**Deterministic scan (Assessment B):** `detect.mjs` against `client/src` returned exit code 2, 18 findings: `design-system-font-size` x12 (sizes outside the documented 12/14/16/32/40/56px ramp - e.g. `Navbar.jsx:107` at 10px, below the system's floor), `design-system-radius` x5-6 (radii outside 8/12/16/20/999px - e.g. `TopProducts.jsx:25` at 4px), and `overused-font` x1 flagging Inter itself - which is a false-positive-by-policy, since DESIGN.md's "One Weight Family Rule" mandates Inter deliberately. Browser-injected scans on 5 live pages additionally caught **7x low-contrast** (white #FFFFFF text on #F4F4F5 background, 1.1:1 - WCAG AA requires 4.5:1) on both Home and Shop, and **11x tight-leading** (1.25x line-height vs. the >=1.3x floor) on category-page product titles. None of these were false positives on manual spot-check.

**Visual overlays:** Browser evidence (Playwright, since the Chrome extension was unavailable) confirms the above on live-rendered pages rather than just source: the $0.00 product and broken/placeholder product images are visible in the Shop grid, a deep category page, and Cart; the mobile category menu (390x844) opens and functions correctly with no overflow.

## Overall Impression

The bones are better than the surface suggests - button variants, focus states, keyboard handling in the mega menu, and the mobile filter sheet are all built with real care. But two things are actively undermining the site's one job (convince a stranger this is trustworthy enough to buy from sight-unseen): a live, purchasable $0.00 fictional product, and navigation/homepage surfaces that expose raw database category names instead of curated ones. Neither is a taste problem; both are shippable-today bugs that directly contradict the brand's own "trust before transaction" principle. The single biggest opportunity is closing the gap between the well-crafted shell and the uncurated data flowing through it.

## What's Working

- **Reserved Accent Rule discipline (mostly):** `RepairCTA.jsx` and `Button.jsx`'s `variant="product"` correctly keep cobalt confined to repair/service surfaces across `ProductCard`, `Cart`, and `ProductDetail` - the one glaring exception is `Rating.jsx` (see Priority Issues).
- **`CategoryNavBar.jsx` keyboard handling:** Escape closes and refocuses the trigger, ArrowDown enters the panel, only one mega-menu open at a time - genuine accessibility engineering, not an afterthought.
- **`Shop.jsx`'s mobile filter sheet:** native `<dialog>`, real exit transition, autofocus management - a thoughtfully engineered interaction most teams would half-bake.

## Priority Issues

**[P0] Live catalog contains a $0.00 fictional product that reaches checkout unguarded.**
- *Why it matters:* The product "Streetwear Companion Red Case" (`/product/6a89d89518a2e16573c56bcf`) is priced $0.00, marked in-stock, and references a nonexistent "iPhone 17 Pro Max." It was added to cart and carried through with a $0.00 total. For a brand whose entire premise is "trust us enough to buy sight-unseen," a free/fictional product live in the catalog is a direct, concrete breach of belief-ladder rung 2 - the first thing a skeptical or adversarial visitor will find.
- *Fix:* Add a server-side gate (price > 0, required fields present) before a product can be `active`/orderable; audit and purge remaining seed/test data from the production DB.
- *Suggested command:* `/impeccable harden`

**[P0] Body text renders at 1.1:1 contrast (white on #F4F4F5) on Home and Shop.**
- *Why it matters:* WCAG AA requires 4.5:1 for body text; 1.1:1 is functionally invisible. This isn't a taste call, it's a hard accessibility failure on two of the highest-traffic pages, and it contradicts PRODUCT.md's own stated WCAG AA baseline.
- *Fix:* Audit every instance flagged by the detector's `low-contrast` rule on Home/Shop and swap white text to graphite-900/700 or move it onto an actual dark surface.
- *Suggested command:* `/impeccable audit`

**[P1] Footer "Shop" links silently do nothing.**
- *Why it matters:* `Footer.jsx`'s `SHOP_LINKS` point at `/shop?category=phones|consoles|laptops|accessories`, but `Shop.jsx` filters on `filters.category === c._id` (a Mongo ObjectId) - these slugs never match, so every footer shop link quietly renders "All Products" instead of what it promised, with zero error feedback.
- *Fix:* Either pass real category `_id`s from the footer or make `Shop.jsx` resolve slugs to ids; add a visible fallback if a category can't be resolved.
- *Suggested command:* `/impeccable harden`

**[P1] Homepage's featured categories expose raw, uncurated DB names.**
- *Why it matters:* `Categories.jsx` picks the top-4 categories by product count with no curation, so "Store" (a legacy catch-all) and "Other Galaxy S"/"Other Galaxy A" become the site's primary "Shop by category" tiles directly below the hero - meaningless to a first-time visitor and visibly unfinished.
- *Fix:* Curate the homepage category set explicitly (editorial allow-list), or exclude catch-all/"Other"-prefixed buckets from this component's selection logic.
- *Suggested command:* `/impeccable clarify`

**[P1] Reserved Accent Rule violation: cobalt star ratings on every product surface.**
- *Why it matters:* `Rating.jsx` fills stars with `var(--cobalt-500)` unconditionally, rendering on `ProductCard`, `ProductDetail`, and reviews - all general shop surfaces. DESIGN.md names this exact pattern as a violation: cobalt must read as "a person is about to help you," never as decoration on ordinary product content.
- *Fix:* Recolor the star fill to graphite-900 or a neutral/gold token outside the reserved service palette.
- *Suggested command:* `/impeccable colorize`

## Persona Red Flags

**Riley (Stress Tester):** Trivially finds and purchases a $0.00 in-stock product through to checkout with zero validation - the single most damaging thing a stress-tester could surface on a storefront that sells itself on trustworthiness.

**Sam (Accessibility-Dependent):** Body text at 1.1:1 contrast on Home and Shop is unreadable regardless of screen-reader use - this fails low-vision users outright and violates the project's own stated WCAG AA baseline, not just best practice.

**Jordan (First-Timer):** Lands on the homepage, sees "Shop by category -> Store, Other Galaxy S, Other Galaxy A, Speakers," and reads this as unfinished/untrustworthy since none of it means anything without DB-schema knowledge. If Jordan then tries a footer "Phones" link, it silently does nothing - no error, no signal anything went wrong.

**Project-specific "Trust-first stranger":** This visitor's entire decision hinges on belief-ladder rungs 1-2 before they'll consider buying used or booking a repair. The $0.00 fictional product and the raw category labels both attack exactly those two rungs, in the first 10 seconds of a session.

## Minor Observations

- Category nav top level shows 11 wrapping brand x part-type items (Accessories, Apple Cases, Samsung Cases, Motorola Cases, Other Cases, Apple Parts, Samsung Parts, Motorola Parts, Other Parts, Repair Tools, Screen Protectors) at 1440px - none are "Phones," "Laptops," or "Tablets," so a stranger's most likely first search has no direct entry point.
- `Shop.jsx`'s sidebar filter is a separate, flat, unordered category list ("Show 575 more") that teaches a different mental model than the curated mega-menu seconds earlier; it also contains at least one duplicate record (two "Antennas" entries with different counts, 0 and 1).
- 11x `tight-leading` (1.25x line-height, floor is 1.3x) on product-card titles on category pages - a real, minor readability drift from the type system.
- 12x `design-system-font-size` and 5-6x `design-system-radius` findings scattered across `RepairCTA.jsx`, `Navbar.jsx`, `AuthShell.jsx`, `Select.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `TopProducts.jsx`, `Checkbox.jsx`, `ProductDetail.jsx`, `Shop.jsx` - all genuine minor deviations from the documented 12/14/16/32/40/56px and 8/12/16/20/999px scales, not detector noise.
- Several product images across Shop and category pages fall back to a generic placeholder icon; this compounds the "is this really stocked?" doubt already caused by the $0.00 product.
- `MainLayout.jsx`'s skip-link is implemented correctly (off-screen until focus) - easy to get wrong, worth calling out as a positive detail.

## Questions to Consider

- If "Store," "Other Galaxy S," and "Other Galaxy A" really are the most-populated categories, should the homepage show "top-4 by count" at all - or does that metric guarantee surfacing the ugliest internal buckets first?
- Does the nav's brand x part-type split match how a customer actually thinks ("I want a case, then for what phone"), or did the IA get built bottom-up from the database schema instead of top-down from the buyer's mental model?
- What currently stands between the product-import/seed pipeline and the live customer-facing catalog, given a $0.00 fictional product reached checkout untouched?
