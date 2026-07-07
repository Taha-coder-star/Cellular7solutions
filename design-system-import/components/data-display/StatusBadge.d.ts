import React from 'react';

export type OrderOrRequestStatus =
  | 'pending' | 'processing' | 'confirmed' | 'in-progress'
  | 'shipped' | 'delivered' | 'completed' | 'paid'
  | 'cancelled' | 'rejected';

export interface StatusBadgeProps {
  status: OrderOrRequestStatus;
  style?: React.CSSProperties;
}

/** Colored status pill for orders and service requests (matches backend enums). */
export function StatusBadge(props: StatusBadgeProps): JSX.Element;
