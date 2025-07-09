import { ReactNode } from 'react';

export interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
