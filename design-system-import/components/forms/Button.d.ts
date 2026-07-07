import React from 'react';

export type ButtonVariant = 'product' | 'service' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Primary action button. Graphite for shopping, orange for repair/service only.
 * @startingPoint section="Forms" subtitle="Graphite & orange action buttons" viewport="700x160"
 */
export interface ButtonProps {
  /** product = graphite (shopping); service = orange (repair only); secondary = outline; ghost = tertiary */
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Primary action button. Graphite for shopping, orange for repair/service only.
 */
export function Button(props: ButtonProps): JSX.Element;
