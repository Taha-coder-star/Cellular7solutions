import React from 'react';

export type BadgeTone = 'neutral' | 'dark' | 'orange' | 'new' | 'used' | 'outline';

export interface BadgeProps {
  tone?: BadgeTone;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Small uppercase pill label — condition (new/used), category, etc. */
export function Badge(props: BadgeProps): JSX.Element;
