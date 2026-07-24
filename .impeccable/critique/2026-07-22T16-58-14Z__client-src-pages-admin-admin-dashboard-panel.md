---
target: admin dashboard/panel
total_score: 19
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-07-22T16-58-14Z
slug: client-src-pages-admin-admin-dashboard-panel
---
Method: dual-agent (A: local-agent a79c63ebd30e48253 · B: local-agent a90bf171012c04bc1)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Status dropdowns in Orders/Repairs/Buy&Sell give no confirmation after a successful update; Save button text-swap is the only progress signal anywhere. |
| 2 | Match Between System and Real World | 2 | Domain vocabulary is right (Repairs, Buy & Sell) but nothing visual reflects the domain — no device icons, no product thumbnails. |
| 3 | User Control and Freedom | 2 | Every delete is a blocking native `confirm()` with no undo/soft-delete. |
| 4 | Consistency and Standards | 2 | Shared UI kit (Table/Button/Input/Select) is internally consistent, but the sidebar's active-nav color breaks the project's own documented cobalt rule (see P0). |
| 5 | Error Prevention | 2 | No inline guard against price=0/negative stock beyond `min="0"`; deleting a category doesn't warn if products still reference it. |
| 6 | Recognition Rather Than Recall | 2 | 83 products, no search/filter/sort — must page-hunt across 5 pages. |
| 7 | Flexibility and Efficiency of Use | 1 | No bulk actions, no keyboard shortcuts, no saved filters, anywhere. Applies fully to a daily-use internal tool. |
| 8 | Aesthetic and Minimalist Design | 3 | Genuine strength — Table/Card/StatusBadge stay clean and uncluttered. |
| 9 | Help Users Recognize/Recover from Errors | 2 | Product form surfaces API error text; Orders/Repairs/BuySell status changes have zero error handling — a failed PUT fails silently. |
| 10 | Help and Documentation | 1 | Zero inline help/tooltips anywhere (e.g. what "Various" brand means, delete consequences). |
| **Total** | | **19/40** | **Poor** |

## Design Specificity Verdict

**LLM assessment**: This reads as a generic CRUD scaffold, not a tool built for a phone/accessories/repair shop. Nothing in the product list, order view, or repair queue reflects the domain: no product thumbnails despite images being core to inventory identification, no low-stock signal despite `stock` being tracked, no urgency cues on pending repairs/orders. Swap the nav labels and this could be an admin for a bookstore. The one place it does touch the brand system — reusing the storefront's design tokens — is undermined by a real spec violation (P0 below). Strongest specific work: `StatusBadge.jsx`'s semantic color-per-status mapping, and `Input`/`Select`'s correctly-implemented cobalt focus-glow.

**Deterministic scan**: `detect.mjs` ran clean (exit 2, 5 advisory findings), but none land inside `pages/admin/` or `AdminLayout.jsx` directly — they're in shared primitives the admin panel consumes transitively: `AuthShell.jsx:42,58,70` (font sizes 10px/23px/11px off the DESIGN.md type ramp — this file isn't used by admin, out of scope), `Checkbox.jsx:35` (6px radius outside the rounded scale — used by the product form's "Featured" checkbox; plausibly intentional for a small square control, flagged rather than confirmed), `Select.jsx:48` (12px font size off-ramp — used by every admin dropdown, including the domain-relevant Category/Brand/Condition/status selects). Live-server injection against the mounted Dashboard view reported "No anti-patterns found" (single-route coverage only, by design of the one-injection-pass instruction).

**Visual overlays**: Browser mutation preflight succeeded and injection ran, but only reflects the Dashboard route's DOM at time of injection — Products/Orders/Categories were not re-scanned live. No standing overlay is left in a **[Human]** tab; the live-server process was stopped after the single check. Treat the CLI scan above as the durable deterministic record.

## Overall Impression

Functionally solid — every CRUD path was exercised end-to-end in this session (login gate, product edit round-trip, pagination, categories) and worked. But it's an unstyled-for-purpose shell: the one deliberate brand rule this project cares about (cobalt reserved for service actions) is broken in the very first component a staff member sees every time they open the panel, empty states look like broken pages, and the biggest daily-use pain point — no search across 83 products — was left out entirely. The single biggest opportunity: spend the next pass making this feel authored for *this* business (product thumbnails, low-stock/pending cues, a working search box) rather than a CRUD scaffold that happens to have the right words in the sidebar.

## What's Working

- **Design-token discipline**: `Table.jsx`, `Button.jsx`, `Input.jsx`, `Select.jsx` all pull consistently from the same CSS custom properties (`--radius-btn`, `--fs-sm`, `--border-subtle`) — no ad hoc pixel values scattered around, genuinely reusable.
- **`StatusBadge.jsx`**: a real, considered component — semantic color mapping per status, dot+label pattern, pill radius matching DESIGN.md. The one place domain thought clearly went in.
- **Input/Select focus states**: correctly implement the documented cobalt focus-glow (confirmed live via keyboard tab — clear blue ring on Description textarea and Price input) — the one sanctioned non-service use of cobalt, done right.
- **End-to-end correctness**: live-tested product edit (price change persisted to DB via API), pagination, category add/delete, admin route gate (redirects non-admins to `/login`) — the plumbing works.

## Priority Issues

**[P0] Cobalt "reserved accent" rule violated in the sidebar itself**
- **Why it matters**: DESIGN.md's Named Rule is explicit — cobalt means "a person is about to help you" and is reserved for repair/service/unlock actions; it dilutes the signal everywhere else. `AdminLayout.jsx`'s active-nav background is hardcoded to cobalt-600 for every route, including Products, Categories, and Brands — none of which are service actions. This is the first component staff see on every visit, breaking the one visual rule this brand actually enforces.
- **Fix**: Active nav state should use graphite-900 (matching `--brand-primary`) for all routes, reserving cobalt exclusively for the Repairs / Buy & Sell nav items (or as a small accessory dot rather than the fill color).
- **Suggested command**: `/impeccable polish` (or `/impeccable colorize` if the cobalt-usage fix should be scoped as its own pass)

**[P0] No visible keyboard focus indicator on buttons/links**
- **Why it matters**: `Button.jsx` only wires mouse handlers (`onMouseEnter/Leave/Down/Up`); it has no `:focus-visible` styling at all. Confirmed via source read and live keyboard-tab test on `/admin/categories`'s "Add" button — zero visual change on focus. A keyboard-only staff member cannot tell where focus is on any button, link, or nav item in the panel (this is distinct from Input/Select, which do have a working focus ring — don't conflate the two).
- **Fix**: Add a visible `outline` or `box-shadow` on `:focus-visible` for `Button.jsx` and `NavLink` items, matching the existing Input/Select cobalt-glow pattern for consistency.
- **Suggested command**: `/impeccable audit` (accessibility pass), then `/impeccable harden`

**[P1] Empty states are blank**
- **Why it matters**: `/admin/orders` and `/admin/buysell` render only a header row with nothing below it when the array is empty — no message, icon, or explanation. Confirmed live: looks like a broken/still-loading page on a fresh install, undermining the "Trust before transaction" principle this project holds for its customer-facing side — the same principle should extend to staff confidence in the tool.
- **Fix**: Add an empty-state block (short message + optional icon) when `.length === 0` in `AdminOrders.jsx` and `AdminBuySell.jsx`.
- **Suggested command**: `/impeccable onboard` or `/impeccable polish`

**[P1] Product images absent from the Products table**
- **Why it matters**: `AdminProducts.jsx` is text-only (Name/Category/Brand/Price/Stock). With near-identically-named SKUs ("Streetwear Companion Red Case 17 pro max" vs. "Sport Rugged Contrast-Bezel") across 83 rows, staff must read full names to identify a product rather than glancing at a thumbnail — a real daily cost for an inventory tool.
- **Fix**: Add a small (40×40) thumbnail column pulled from `product.images[0]`.
- **Suggested command**: `/impeccable layout`

**[P2] Delete carries no danger styling, identical visual weight to Edit**
- **Why it matters**: Both actions render as plain ghost-variant text with no color distinction — a destructive, irreversible action looks exactly as safe as a non-destructive one. `colors.css` already defines `--danger-500`; it's unused in the actions column.
- **Fix**: Style the Delete button/link with `color: var(--danger-500)`.
- **Suggested command**: `/impeccable polish`

**[P3] No search/filter/sort on an 83-item, 5-page product list**
- **Why it matters**: Only numbered page buttons exist; finding one SKU means clicking through up to 5 pages. This is the clearest daily-efficiency gap for the "Alex" power-user persona.
- **Fix**: Add a name-search box wired to the existing `search` query param the backend already supports (`getProducts` accepts `search`).
- **Suggested command**: `/impeccable layout` or a dedicated build pass

## Persona Red Flags

**Alex (Power User)**: No bulk select/bulk-delete/bulk-status-update anywhere — every status change or delete is a single-row action. No keyboard shortcuts (no `/` to search, no `n` for new product). No search bar on Products, forcing page-by-page hunting across 83 rows / 5 pages. Native `confirm()` dialogs block the UI thread on every delete. No CSV export/import for the catalog, no column sort to spot outliers like the near-universal Rs. 0 prices. High-friction, high-abandonment-risk for daily use.

**Sam (Accessibility)**: Confirmed zero visible focus indicator on `Button.jsx`-rendered elements (buttons, nav links) — keyboard-only navigation is effectively unusable past the point of reaching a button. The bare `<input type="file" multiple>` in the product form has no `aria-describedby` hint, unlike every other field which uses the accessible `Input`/`Select` wrapper. Status `<Select>` dropdowns in Orders/Repairs/BuySell render with no `label` prop — a screen reader announces only "combobox," not "order status," forcing inference from table position alone. Active sidebar nav state relies on cobalt fill as its only strong signal (text weight doesn't change) — effectively color-only state communication. The existing image thumbnail on the product edit form has an empty `alt=""` on a genuinely content-bearing image.

## Minor Observations

- Nearly every seeded product shows **"Rs. 0"** as price (confirmed live via both the table and the edit form — the Price field genuinely contains `0` in the database). Whether a seed-data artifact or a live bug, dozens of SKUs showing Rs. 0 is a serious trust problem the moment real staff or customers see it.
- The dark sidebar background does not visually extend the full scrollable height on long pages (e.g. the 83-item Products table) — a bare white gutter appears beside the table on scroll.
- Dashboard shows four raw counts and nothing else — no trend, no "view all" link, no low-stock or pending-repair callouts, despite being the first screen staff see each day.
- Categories and Brands pages are pixel-identical with no product-count column, so an admin can't tell if deleting "Sony" would orphan products.
- Table header/secondary text (graphite-500 on white, 12px uppercase) looked borderline on contrast under zoom — worth a precise contrast-ratio check in `/impeccable audit`.
- Shared `Select.jsx` (used by every admin dropdown) and `Checkbox.jsx` (used by "Featured product") carry pre-existing off-DESIGN.md-ramp font-size/radius findings from the detector — not introduced by the admin build, but worth folding into the next design-system pass since the admin panel is now a consumer of both.

## Questions to Consider

- If cobalt is supposed to mean "a person is about to help you," why does opening the admin sidebar light the same color for inventory management as it would for a repair booking — what is that color currently signaling, if not the rule it's meant to enforce?
- With 83 products, no search, and no bulk actions, how long does it actually take a staff member to update stock after a weekend sale — has anyone timed that walk?
- The storefront gets a fully custom `Input`/`Select`/`Checkbox` system; why does the one place staff touch daily to upload product photos fall back to the bare OS file picker?
