import React from 'react';

export interface LogoProps {
  /** "full" = icon + wordmark + tagline; "icon" = square mark only. */
  variant?: 'full' | 'icon';
  /** "dark" for dark backgrounds. */
  tone?: 'light' | 'dark';
  height?: number;
  /** Path prefix to the assets folder, relative to the page. Default "assets". */
  basePath?: string;
  style?: React.CSSProperties;
}

/** The Cellular Solutions logo (real brand asset). */
export function Logo(props: LogoProps): JSX.Element;
