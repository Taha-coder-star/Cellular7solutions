# Cellular Solutions — Design System

> **Theme:** Graphite + Orange · **Tagline:** *"You Break It, We Fix It."*
> A bold, modern, trustworthy design system for a premium repair shop and electronics retailer.

Cellular Solutions is a **mobile-phone, electronics & accessories retailer** that also runs a
**device-repair and unlock service**. The product surfaces are a customer-facing **storefront**
(browse & buy phones, laptops, consoles, accessories; book repairs; request unlocks/buy-sell) and
an **admin dashboard** (products, orders, inventory, and service-request management).

The whole identity turns on one idea: **graphite is the store, orange is the service.**
Graphite (near-black) carries products, shopping, navigation and structure. Orange is an accent
**reserved for repair & service actions only** (Book Repair, Get Quote, Request Unlock). Customers
subconsciously associate orange with *getting help* and graphite with *shopping*.

---

## Sources

This system was derived from materials the client/developer provided. You may not have access, but
they are recorded here for anyone who does:

- **Brand spec:** `uploads/DESIGN_SYSTEM.md` (the authoritative color / type / component brief — ground truth for visuals).
- **GitHub repo:** [`Taha-coder-star/Cellular7solutions`](https://github.com/Taha-coder-star/Cellular7solutions) — a MERN
  e-commerce codebase. The **backend** (`server/models`, `server/controllers`) defines the real data model used
  throughout this system (Product, Order, RepairRequest, UnlockRequest, BuySellRequest, etc.). The **frontend**
  (`client/`) was still scaffolding at import time (empty route components), so **no production UI existed to
  recreate** — the visual language here is built from the brand spec, and the UI kits are faithful *new*
  compositions of it, not copies of existing screens. Explore the repo for the exact schemas and API routes if
  you're building production features.
- **Brand assets:** logo lockups, app icons and favicon (in `assets/`), provided by the client.

> ⚠️ **Font substitution flag:** the spec specifies **Inter**, which is loaded here from Google Fonts (no font
> binaries were provided). If you have licensed/self-hosted Inter files, drop them in and swap `tokens/fonts.css`
> to local `@font-face` rules.

---

## Content Fundamentals

How Cellular Solutions writes.

- **Voice:** confident, plain, and reassuring — a knowledgeable local shop, not a faceless megastore. Professional and trustworthy first; never jokey or slangy.
- **Person:** speak to the customer as **"you"**; the store is **"we"** ("You break it, we fix it," "We'll diagnose it free"). Action labels are imperative verbs.
- **Casing:** **Title Case** for buttons, nav and short headings ("Add to Cart", "Book Repair", "Track Repair"). Sentence case for body copy and form help text. **ALL-CAPS with wide tracking** only for tiny eyebrow labels and the tagline (`YOU BREAK IT · WE FIX IT`).
- **Tagline:** *"You Break It, We Fix It."* — the one line that anchors the brand. The middot form `YOU BREAK IT · WE FIX IT` is the lockup variant used under the logo.
- **CTA copy is split by intent** (mirrors the color rule):
  - *Shopping:* "Add to Cart", "Buy Now", "View Product", "Checkout", "Add to Wishlist".
  - *Service:* "Book Repair", "Get Free Quote", "Start Repair", "Request Unlock", "Track Repair", "Device Diagnosis".
- **Pricing:** always in **USD**, e.g. `$999.00`; repair prices lead with "from $89".
- **Numbers & specs:** concrete and scannable — "45 min", "1–2 days", "Same-day turnaround", "Free diagnostics". Avoid vague marketing adjectives stacked together.
- **Emoji:** **not used** in product UI. (The brand spec uses 🛒/🔧 as internal shorthand for the graphite=products / orange=service mnemonic only — never ship emoji in the interface.)
- **Tone words to hit:** premium, reliable, fast, trustworthy, technology-focused, repair-first, clean.

---

## Visual Foundations

- **Color vibe.** Two-color system. **Graphite** (`#18181B`→`#FAFAFA`) is dominant — near-black structure on white. **Orange** (`#EA580C` / `#F97316`) is a warm, energetic accent used *sparingly* and *only* for service. Backgrounds are overwhelmingly **clean white** (`--surface-page`) with occasional graphite-50 (`--surface-subtle`) sections and bold **graphite-900 dark sections** for heroes/footers. No gradients as a rule; solid fills.
- **Typography.** Single typeface: **Inter**. Headings 700 (hero/display 800) with tight tracking (`-0.02em`); subheads 600; body 400; small labels 500–600. Large, readable, generous. Uppercase + `0.12em` tracking for eyebrow labels and the tagline only.
- **Spacing.** Generous and consistent on a 4px base. Section padding **80px**, card padding **24px**, grid gap **24px**, button height **48–52px**. Layouts breathe — minimal clutter.
- **Corner radii.** Soft, consistent: **buttons/inputs 12px**, **cards 16px**, **modals 20px**, pills fully rounded. Nothing sharp-cornered.
- **Cards.** White background, **16px** radius, **thin gray border** (`--border-subtle`), **soft `shadow-sm`**. On hover they lift `translateY(-2px)` and deepen to `shadow-md`. Premium and clean — never heavy.
- **Shadows.** **Subtle only** — `sm` and `md` for resting/hover; `lg` reserved for modals/popovers. Avoid heavy floating drop-shadows.
- **Borders.** Hairline `1px` graphite-200/300. Dark surfaces use graphite-700 borders.
- **Backgrounds.** Flat color. No repeating patterns, textures, or decorative gradients. Product imagery sits on white/graphite-50; repair imagery is real photography (technicians, tools, store interiors) — warm, natural, not stylized.
- **Imagery vibe.** Products: white/transparent backgrounds, high-res, consistent sizing. Repair/service: warm, human, real-world (technicians, mobile repairs, store, tools, customers).
- **Motion.** Fast, smooth, minimal. Standard transition **0.25s** on `cubic-bezier(0.19, 1, 0.22, 1)` (an ease-out with a gentle settle); quick interactions 0.15s. No bounces, no long or looping decorative animation. Respect `prefers-reduced-motion`.
- **Hover states.** Buttons darken one step (graphite 900→800, orange 600→700); cards lift + deepen shadow; images scale ~1.03 inside their frame. Secondary/ghost buttons fill with `graphite-50`.
- **Press / focus.** Focus shows a **3px orange focus ring** (`rgba(234,88,12,0.15)`) with an orange border. No aggressive shrink on press.
- **Transparency & blur.** Used sparingly — light translucent overlays on imagery for text legibility; not a core motif.
- **Iconography.** Clean **outline** icons (Lucide), see below.

---

## Iconography

- **System:** [**Lucide**](https://lucide.dev) — clean, consistent **outline** icons, the brand spec's first recommendation (Heroicons is an acceptable alternate; same stroke weight / outline style). Default stroke ~2px, size 18–24px, `currentColor` so they inherit graphite text or orange accents.
- **How it's wired here:** the **`Icon`** component renders inline Lucide SVG from the Lucide UMD global. Load it once per page: `<script src="https://unpkg.com/lucide@latest"></script>`. Common names in use: `shopping-cart`, `wrench`, `smartphone`, `unlock`, `laptop`, `headphones`, `search`, `user`, `truck`, `shield-check`, `clock`, `star`, `calendar-check`.
- **Color:** icons are graphite by default; orange only when they sit inside a service context (e.g. the repair-card badge).
- **Emoji / unicode:** **not** used as UI icons. (A `▾` chevron in `Select` is the only incidental unicode glyph.)
- **No colorful icon packs**, no filled multi-color icon sets, no hand-drawn SVG.
- **Brand assets (not icons):** the logo mark, app icons (192/512), and favicon live in `assets/` — real provided brand files, used via the `Logo` component. No brand mark was ever redrawn; only the provided files are used.

---

## Components

Reusable React primitives (compiled to `window.CellularSolutionsDesignSystem_a109cf`). Grouped by concern:

**forms/** — `Button` (product=graphite / service=orange / secondary / ghost), `Input`, `Select`, `Checkbox`
**data-display/** — `Card`, `Badge`, `StatusBadge`, `Rating`, `ProductCard`, `RepairCard`
**media/** — `Icon` (Lucide wrapper), `Logo` (real brand logo)

**Intentional additions** (no production component library existed in the source to enumerate, so a standard set was authored to the brand's needs):
- `Icon` — a thin Lucide wrapper, added so the spec's outline-icon system has one consistent entry point.
- `StatusBadge` — added to render the backend's order/request status enums (pending → … → delivered/completed) consistently.
- `Rating` — added for the product cards the spec describes ("Product image, name, brand, price, rating").

Each component has a sibling `.d.ts` (props contract) and `.prompt.md` (usage). `ProductCard`, `RepairCard`, and `Button` are also **Starting Points**.

---

## Index / Manifest

- **`styles.css`** — global entry point (consumers link this). `@import`s only.
- **`tokens/`** — `colors.css`, `typography.css`, `spacing.css` (spacing + radius + shadow + motion), `fonts.css` (Inter).
- **`components/`** — `forms/`, `data-display/`, `media/` (see above). Each dir has a `*.card.html` specimen.
- **`guidelines/`** — foundation specimen cards: colors (graphite / orange / semantic), type (font / headings / body), spacing (scale / radii / shadows), brand (logo / CTA rules).
- **`ui_kits/storefront/`** — customer storefront recreation (home, shop, product, services). `index.html` is the interactive entry.
- **`ui_kits/admin/`** — admin dashboard recreation (overview, requests).
- **`assets/`** — logo lockups (`cs-logo-full[-dark].svg/png`), icon mark (`cs-icon[-white].svg`, `cs-icon-192/512.png`), favicon.
- **`SKILL.md`** — Agent-Skills-compatible entry.

The **Design System tab** renders every specimen and component card automatically.
