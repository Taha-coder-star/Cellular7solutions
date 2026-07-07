import React from 'react';

export interface CardProps {
  padding?: string;
  /** Lift + deepen shadow on hover. */
  hover?: boolean;
  /** Graphite surface for dark sections. */
  dark?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Base surface card — white, 16px radius, thin border, soft shadow. */
export function Card(props: CardProps): JSX.Element;
