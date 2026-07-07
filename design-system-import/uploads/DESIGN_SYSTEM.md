# Cellular Solutions — Design System

> **Theme:** Graphite + Orange
> **Brand Identity:** Bold, modern, trustworthy, and built for a premium repair shop and electronics retailer.

---

# Brand Philosophy

**Tagline**

> **"You Break It, We Fix It."**

The visual identity is built around two core colors:

* **Graphite** represents the **store**, technology, premium electronics, and reliability.
* **Orange** represents **repair services**, action, speed, and customer support.

This creates an intuitive visual language:

* 🛒 **Dark (Graphite) = Products**
* 🔧 **Orange = Repair & Services**

Customers subconsciously associate orange with getting help and graphite with shopping.

---

# Color Palette

## Graphite (Primary)

| Shade   | Hex         |
| ------- | ----------- |
| 50      | `#FAFAFA`   |
| 100     | `#F4F4F5`   |
| 200     | `#E4E4E7`   |
| 400     | `#A1A1AA`   |
| 500     | `#71717A`   |
| 700     | `#3F3F46`   |
| 800     | `#27272A`   |
| **900** | **#18181B** |

**Usage**

* Navigation
* Headers
* Footer
* Product CTAs
* Icons
* Dark sections
* Text

---

## Brand Orange (Accent)

| Shade   | Hex         |
| ------- | ----------- |
| 50      | `#FFF7ED`   |
| 100     | `#FFEDD5`   |
| 300     | `#FDBA74`   |
| 500     | `#F97316`   |
| **600** | **#EA580C** |
| 700     | `#C2410C`   |
| 900     | `#7C2D12`   |

**Usage**

Use orange **only** for service-related actions.

Examples:

* Book Repair
* Get Quote
* Schedule Repair
* Track Repair
* Contact Technician
* Service Banner
* Repair Status

Avoid using orange for normal shopping actions.

---

# CTA Color Rules

## Product Actions (Graphite)

Examples:

* Add to Cart
* Buy Now
* View Product
* Wishlist
* Checkout

Button Style:

* Background: Graphite 900
* Text: White
* Hover: Graphite 800

---

## Service Actions (Orange)

Examples:

* Book Repair
* Get Free Quote
* Start Repair
* Request Unlock
* Device Diagnosis

Button Style:

* Background: Orange 600
* Text: White
* Hover: Orange 700

---

# Typography

## Font

**Inter**

Reasons:

* Modern
* Highly readable
* Professional
* Excellent for dashboards
* Great mobile experience

Weights:

* Heading: 700
* Subheading: 600
* Body: 400
* Small labels: 500

---

# Border Radius

| Component | Radius |
| --------- | ------ |
| Buttons   | 12px   |
| Cards     | 16px   |
| Modals    | 20px   |
| Inputs    | 12px   |

---

# Shadows

Keep shadows subtle.

Recommended:

```
shadow-sm
shadow-md
```

Avoid heavy floating effects.

---

# Spacing

Use a generous spacing system.

Recommended:

* Section Padding: 80px
* Card Padding: 24px
* Button Height: 48–52px
* Grid Gap: 24px

---

# Card Design

Style:

* White background
* 16px border radius
* Soft shadow
* Thin gray border
* Comfortable padding

Cards should feel premium and clean.

---

# Icons

Use clean outline icons.

Suggested libraries:

* Lucide
* Heroicons

Avoid colorful icon packs.

---

# Images

Products:

* White or transparent backgrounds
* High resolution
* Consistent sizing

Repair section:

* Technicians
* Mobile repairs
* Store interiors
* Repair tools
* Customer interactions

---

# Animation

Keep interactions fast and smooth.

```
::view-transition-group(*),
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}
```

Principles:

* Fast
* Responsive
* Smooth
* Minimal

---

# Tailwind Configuration

```js
theme: {
  extend: {
    colors: {
      graphite: {
        50: '#FAFAFA',
        100: '#F4F4F5',
        200: '#E4E4E7',
        400: '#A1A1AA',
        500: '#71717A',
        700: '#3F3F46',
        800: '#27272A',
        900: '#18181B',
      },
      brand: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        300: '#FDBA74',
        500: '#F97316',
        600: '#EA580C',
        700: '#C2410C',
        900: '#7C2D12',
      },
    },
    borderRadius: {
      btn: '12px',
      card: '16px',
      modal: '20px',
    },
  },
}
```

---

# Design Principles

Every page should follow these rules:

* Premium, modern aesthetic
* Clean white backgrounds
* Graphite as the dominant color
* Orange reserved for repair/service actions
* Large readable typography
* Spacious layouts
* Consistent spacing
* Minimal visual clutter
* Mobile-first responsiveness
* Fast page transitions
* High accessibility and contrast

---

# Claude Design Prompt Reference

When generating new pages, use the following design specification:

> **Graphite (#18181B) as the primary color, Orange (#EA580C) as the accent reserved only for service-related CTAs. Use white backgrounds, 16px card radius, subtle shadows, Inter font, premium modern layouts, responsive design, and display all pricing in USD.**

---

# UI Components

## Primary Product Button

* Graphite background
* White text
* Rounded 12px

---

## Primary Service Button

* Orange background
* White text
* Rounded 12px

---

## Product Cards

Include:

* Product image
* Product name
* Brand
* Price
* Rating
* Add to Cart button

---

## Repair Cards

Include:

* Device type
* Repair type
* Estimated time
* Starting price
* Book Repair button

---

# Overall Brand Personality

The interface should communicate:

* Professional
* Reliable
* Premium
* Fast
* Trustworthy
* Technology-focused
* Repair-first
* Clean and modern
* Easy to navigate
* Built for both shopping and service
