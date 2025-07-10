import React from 'react';
import './ChartSection.css';
import { FilterButtons } from '@molecules/FilterButtons/FilterButtons';
import { ChartSectionProps } from './IChartSection';

export const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  filters = [],
  activeFilter = '',
  onFilterChange,
  chart,
  height = 340,
}) => {
  return (
    <div className="chart-section">
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        {filters.length > 0 && onFilterChange && (
          <FilterButtons
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        )}
      </div>
      <div className="chart-container" style={{ height }}>
        {chart}
      </div>
    </div>
  );
};
