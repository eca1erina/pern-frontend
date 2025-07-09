export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor: string | string[];
    tension?: number;
    fill?: boolean;
    pointRadius?: number;
    pointHoverRadius?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    borderWidth?: number;
    pointBorderWidth?: number;
    pointStyle?: string;
    borderRadius?: number;
    maxBarThickness?: number;
  }[];
}

export interface CardData {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

import { ChartOptions } from 'chart.js';

export interface IDashboardTemplateProps {
  title: string;
  overviewCards: CardData[];
  incomeChartData: ChartData;
  expensesChartData: ChartData;
  chartOptions: ChartOptions;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
  isLoading?: boolean;
}
