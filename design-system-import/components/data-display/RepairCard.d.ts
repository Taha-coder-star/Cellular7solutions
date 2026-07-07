import React from 'react';

export interface Repair {
  deviceType: string;
  repairType: string;
  /** Estimated turnaround, e.g. "45 min" or "1–2 days". */
  time?: string;
  startingPrice: number;
  /** Lucide icon name for the device/repair. */
  icon?: string;
}

/**
 * Repair service card — device, repair type, ETA, starting price, orange Book Repair.
 * @startingPoint section="Commerce" subtitle="Repair service card (orange)" viewport="320x300"
 */
export interface RepairCardProps {
  repair: Repair;
  onBook?: () => void;
  style?: React.CSSProperties;
}

/** Repair service card — device, repair type, ETA, starting price, orange Book Repair. */
export function RepairCard(props: RepairCardProps): JSX.Element;
