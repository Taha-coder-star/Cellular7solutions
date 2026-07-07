---
name: cellular-solutions-design
description: Use this skill to generate well-branded interfaces and assets for Cellular Solutions (a premium electronics retailer + device repair/unlock service), for production or throwaway prototypes/mocks. Contains the Graphite+Orange color system, Inter typography, brand logo assets, and reusable React UI kit components.
user-invocable: true
---

Read the `readme.md` file within this skill first — it is the full design guide (brand context, content fundamentals, visual foundations, iconography, and a file index). Then explore the other files as needed.

Key facts to internalize:
- **Theme:** Graphite (`#18181B`) is the dominant color; **Orange (`#EA580C`) is reserved for repair/service actions only** (Book Repair, Get Quote, Request Unlock) — never for shopping actions.
- **Font:** Inter (`tokens/fonts.css`). **Icons:** Lucide (outline). **Pricing:** USD.
- **Tokens:** link `styles.css`; use the CSS custom properties (`--graphite-900`, `--orange-600`, `--radius-card`, `--shadow-sm`, etc.).
- **Components:** compiled to `window.CellularSolutionsDesignSystem_a109cf` via `_ds_bundle.js`. Families: `Button`, `Input`, `Select`, `Checkbox`, `Card`, `Badge`, `StatusBadge`, `Rating`, `ProductCard`, `RepairCard`, `Icon`, `Logo`. See each `.prompt.md` for usage.
- **Assets:** real brand logo/icon/favicon in `assets/` — use the `Logo` component; never redraw the mark.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and produce static HTML files for the user to view. If working on production code, copy assets and apply the rules here to design on-brand.

If the user invokes this skill without other guidance, ask what they want to build, ask a few clarifying questions, then act as an expert designer who outputs HTML artifacts or production code as needed.
