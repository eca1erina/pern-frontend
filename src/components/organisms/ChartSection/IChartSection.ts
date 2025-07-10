import { ReactNode } from 'react';

export interface ChartSectionProps {
  title: string;
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  chart: ReactNode;
  height?: number;
}
