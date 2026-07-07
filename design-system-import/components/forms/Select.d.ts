import React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'style'> {
  label?: string;
  hint?: string;
  options?: (string | SelectOption)[];
  style?: React.CSSProperties;
}

/** Labelled select dropdown, styled to match Input. */
export function Select(props: SelectProps): JSX.Element;
