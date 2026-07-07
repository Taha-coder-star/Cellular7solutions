import React from 'react';

export interface IconProps {
  /** Lucide icon name — kebab or PascalCase (e.g. "shopping-cart" or "Wrench"). */
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/** Inline Lucide icon. Requires the Lucide UMD script on the page. */
export function Icon(props: IconProps): JSX.Element;
