import React from 'react';

export interface Product {
  name: string;
  brand?: string;
  price: number;
  image?: string;
  condition?: 'new' | 'used';
  rating?: number;
  reviews?: number;
  stock?: number;
}

/**
 * Product listing card — image, condition, brand, name, rating, price, Add to Cart (graphite).
 * @startingPoint section="Commerce" subtitle="Shopping product card" viewport="320x420"
 */
export interface ProductCardProps {
  product: Product;
  onAdd?: () => void;
  style?: React.CSSProperties;
}

/** Product listing card — image, condition, brand, name, rating, price, Add to Cart (graphite). */
export function ProductCard(props: ProductCardProps): JSX.Element;
