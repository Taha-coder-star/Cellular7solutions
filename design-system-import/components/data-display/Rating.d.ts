import React from 'react';

export interface RatingProps {
  /** 0–5, fractional supported. */
  value?: number;
  /** Review count shown in parentheses. */
  count?: number;
  size?: number;
  showValue?: boolean;
  style?: React.CSSProperties;
}

/** 5-star rating display with orange fill and optional count. */
export function Rating(props: RatingProps): JSX.Element;
