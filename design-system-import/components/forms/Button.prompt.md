The primary action button — graphite for shopping actions, orange reserved for repair/service actions only.

```jsx
<Button variant="product">Add to Cart</Button>
<Button variant="service" iconLeft={<Icon name="wrench" />}>Book Repair</Button>
```

Variants: `product` (graphite 900), `service` (orange 600 — Book Repair, Get Quote, etc.), `secondary` (outline), `ghost`. Sizes: `sm` / `md` / `lg` (40 / 48 / 52px). Props: `fullWidth`, `disabled`, `iconLeft`, `iconRight`. Never use `service` for shopping actions.
