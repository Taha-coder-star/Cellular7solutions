---
name: Cellular Solutions
description: Premium, Apple-inspired ecommerce for new & used devices, accessories, and repair services
colors:
  graphite-50: "#FAFAFA"
  graphite-100: "#F4F4F5"
  graphite-200: "#E4E4E7"
  graphite-300: "#D4D4D8"
  graphite-400: "#A1A1AA"
  graphite-500: "#71717A"
  graphite-600: "#52525B"
  graphite-700: "#3F3F46"
  graphite-800: "#27272A"
  graphite-900: "#18181B"
  cobalt-50: "#EFF6FF"
  cobalt-100: "#DBEAFE"
  cobalt-300: "#93C5FD"
  cobalt-500: "#2563EB"
  cobalt-600: "#1D4ED8"
  cobalt-700: "#1E40AF"
  cobalt-800: "#1B3480"
  cobalt-900: "#1E3A8A"
  white: "#FFFFFF"
  black: "#000000"
  success: "#16A34A"
  warning: "#D97706"
  danger: "#DC2626"
  info: "#2563EB"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h1:
    fontFamily: "Inter, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.1
  h2:
    fontFamily: "Inter, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  sm: "8px"
  btn: "12px"
  input: "12px"
  card: "16px"
  modal: "20px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
components:
  button-primary:
    backgroundColor: "{colors.graphite-900}"
    textColor: "{colors.white}"
    rounded: "{rounded.btn}"
    padding: "0 22px"
  button-primary-hover:
    backgroundColor: "{colors.graphite-800}"
    rounded: "{rounded.btn}"
  button-service:
    backgroundColor: "{colors.cobalt-600}"
    textColor: "{colors.white}"
    rounded: "{rounded.btn}"
    padding: "0 22px"
  button-service-hover:
    backgroundColor: "{colors.cobalt-800}"
    rounded: "{rounded.btn}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite-900}"
    rounded: "{rounded.btn}"
    padding: "0 22px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "24px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite-900}"
    rounded: "{rounded.input}"
    height: "48px"
    padding: "0 14px"
---

# Design System: Cellular Solutions

## 1. Overview

**Creative North Star: "The Clean Slate"**

Cellular Solutions is built to convince a stranger, sight-unseen, that this is a real, professional shop worth buying from. The system leans on Apple-store-adjacent minimalism: a dominant graphite neutral scale carries almost every surface, and color is spent deliberately rather than decoratively. Cobalt blue is not a general brand accent — it is reserved strictly for repair and service actions (Book Repair, Get Quote), so the one splash of color in the interface always means "a person is about to help you," never "this is just a button."

This system explicitly rejects the crowded, banner-heavy, discount-sticker look of generic phone/accessory retailer sites. No mismatched promo graphics, no visual noise competing for attention, no more than one accent color doing work on any given screen. Warmth comes from generous whitespace, smooth motion, and approachable rounded geometry — not from busyness.

**Key Characteristics:**
- Graphite-dominant neutral scale; cobalt blue is a service signal, not a brand accent
- Generous whitespace over density; one clear focal action per screen
- Rounded, soft-edged geometry (12–20px radii) that reads warm rather than corporate-sharp
- Flat surfaces at rest, with soft ambient shadows that respond to hover/interaction
- Inter typeface throughout — no secondary display face

## 2. Colors

A near-monochrome graphite system with a single reserved accent; the restraint is the point.

### Primary
- **Graphite 900** (#18181B): the dominant brand color — primary buttons, headings, strong text, dark surfaces. This is what "Cellular Solutions" looks like, not blue.

### Secondary
- **Cobalt Blue 600** (#1D4ED8): reserved exclusively for repair/service actions (Book Repair, Get Quote, focus rings). Never used for general product/shop CTAs.

### Neutral
- **Graphite 50–200** (#FAFAFA–#E4E4E7): page background, subtle surfaces, borders, dividers.
- **Graphite 400–500** (#A1A1AA / #71717A): muted and faint text — placeholders, secondary labels, timestamps.
- **Graphite 700** (#3F3F46): default body text color.
- **White** (#FFFFFF): card and input surfaces, text-on-brand and text-on-dark.

### Named Rules
**The Reserved Accent Rule.** Cobalt blue only ever means "repair or service." If a button, badge, or link isn't part of the repair/unlock/buy-sell flow, it does not get cobalt — it gets graphite. Breaking this rule dilutes the one signal the palette is built to send.

## 3. Typography

**Display Font:** Inter (with -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial fallbacks)
**Body Font:** Inter
**Label/Mono Font:** Inter (medium weight, no distinct face)

**Character:** A single geometric-humanist sans carried across every weight from 400 to 800 — deliberately restrained rather than paired, so hierarchy comes from size and weight, not from mixing typefaces.

### Hierarchy
- **Display** (800, 3.5rem / 56px, line-height 1.1, letter-spacing -0.02em): hero headlines only.
- **Headline (H1)** (700, 2.5rem / 40px, line-height 1.1): page-level titles.
- **Title (H2/H3)** (700/600, 2rem–1.5rem, line-height 1.25): section and card headings.
- **Body** (400, 1rem / 16px, line-height 1.5): default paragraph and UI text; cap prose at 65–75ch.
- **Label** (500, 0.875rem / 14px, line-height 1.25): form labels, small UI text, badges.

### Named Rules
**The One Weight Family Rule.** Every text role is Inter at a different weight/size — never introduce a second typeface for "personality." Contrast comes from the 400→800 weight range and the 12px→56px size range, nothing else.

## 4. Elevation

Surfaces are flat by default. Shadows are soft and ambient (never structural or bold), calibrated to graphite-900 at low opacity so they read as a gentle physical lift rather than a heavy drop shadow. Cards lift by 2px and swap to a slightly larger shadow only on hover — depth is a response to interaction, not a resting state.

### Shadow Vocabulary
- **shadow-sm** (`0 1px 2px rgba(24,24,27,0.06), 0 1px 3px rgba(24,24,27,0.08)`): resting card/input state.
- **shadow-md** (`0 2px 4px rgba(24,24,27,0.06), 0 4px 12px rgba(24,24,27,0.08)`): hover state for interactive cards.
- **shadow-lg** (`0 8px 24px rgba(24,24,27,0.10)`): modals and elevated overlays only.

### Named Rules
**The Ambient-Only Rule.** Shadows never exceed 10% opacity black. If a shadow looks like a "drop shadow" rather than a soft lift, it's too strong for this system.

## 5. Components

Warm and approachable: soft 12px+ radii, unhurried transitions (0.25s ease-out-quint style curve), no bounce or elastic motion anywhere.

### Buttons
- **Shape:** 12px radius (`--radius-btn`), never sharp corners.
- **Primary (product):** graphite-900 background, white text, graphite-800 on hover. This is the default for all shop/buy CTAs.
- **Service:** cobalt-600 background, white text, cobalt-800 on hover. Used only for repair/unlock/buy-sell actions per the Reserved Accent Rule.
- **Secondary:** white background, graphite-900 text, 1px graphite-300 border; hovers to a subtle graphite-50 fill.
- **Ghost:** transparent background and border, graphite-700 text; hovers to graphite-50 fill.
- **Hover / Focus:** all variants transition over 0.25s with the system's ease-out curve; hover swaps background color, never adds a shadow.

### Cards / Containers
- **Corner Style:** 16px radius (`--radius-card`).
- **Background:** white by default; graphite-900 for the rare dark/inverted card, with white text and a graphite-700 border.
- **Shadow Strategy:** shadow-sm at rest, shadow-md + 2px translateY lift on hover when `hover` is enabled — see Elevation.
- **Border:** 1px graphite-200 (graphite-700 on dark cards).
- **Internal Padding:** 24px default (`--pad-card`).

### Inputs / Fields
- **Style:** white background, 1px graphite-300 border, 12px radius, 48px height, 14px horizontal padding (42px when a leading icon is present).
- **Focus:** border swaps to cobalt-600 with a 3px soft cobalt glow ring (`0 0 0 3px rgba(29,78,216,0.15)`) — the one place cobalt appears outside the service flow, since focus is itself a "helping you" moment.
- **Error:** border and hint text swap to danger-500 (#DC2626); hint/error text sits at 12px below the field.

### Navigation
Graphite text on a white bar; active/hover states shift to graphite-900 or the cobalt service accent only where a nav item leads into the repair/service flow. Mobile collapses into a simple stacked menu, no separate visual language.

## 6. Do's and Don'ts

### Do:
- **Do** keep graphite-900 as the default button and heading color — it is the brand color, not a placeholder waiting for blue.
- **Do** reserve cobalt blue strictly for repair/service/unlock actions and input focus states.
- **Do** use soft, ambient shadows (≤10% opacity) that respond to hover, not resting bold drop shadows.
- **Do** keep every text role in Inter; vary weight (400–800) and size (12px–56px) for hierarchy instead.
- **Do** use generous whitespace and rounded 12–20px geometry to keep the premium feel warm rather than cold.

### Don't:
- **Don't** use cobalt blue (or any accent) as a general-purpose brand color on shop/product CTAs — that dilutes the one clear service signal.
- **Don't** ship the crowded, banner-heavy, discount-sticker look of generic phone/accessory retailer sites: no promo badges competing with product photography, no visual clutter.
- **Don't** use `border-left`/`border-right` as a colored accent stripe on cards or list items.
- **Don't** introduce a second typeface "for personality" — Inter carries the whole system.
- **Don't** use bounce, elastic, or overshoot easing anywhere; motion stays ease-out and restrained.
- **Don't** use heavy or dark drop shadows; if a shadow looks structural rather than ambient, it's too strong.
