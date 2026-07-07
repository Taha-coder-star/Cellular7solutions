The shopping product card — image, condition badge, brand, name, rating, USD price, and a graphite Add to Cart button. Never uses orange (that's for service only).

```jsx
<ProductCard
  product={{ name: 'iPhone 15 Pro', brand: 'Apple', price: 999.00, condition: 'new', rating: 4.7, reviews: 214, stock: 12 }}
  onAdd={() => addToCart(id)}
/>
```

Out-of-stock (`stock: 0`) disables the button. Prices display in USD.
