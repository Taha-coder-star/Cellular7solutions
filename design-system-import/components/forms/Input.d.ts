import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Labelled text input. 48px tall, 12px radius, orange focus ring. */
export function Input(props: InputProps): JSX.Element;
