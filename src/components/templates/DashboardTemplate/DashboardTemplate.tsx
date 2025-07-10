import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import './DashboardTemplate.css';
import { IDashboardTemplateProps } from './IDashboardTemplate';
import { MetricCard } from '@molecules/MetricCard/MetricCard';
import { ChartSection } from '@organisms/ChartSection/ChartSection';

const overviewCards = [
  {
    icon: '💰',
    title: 'Total Revenue',
    value: 12000,
    trend: 5.2,
  },
  {
    icon: '🛒',
    title: 'Total Expenses',
    value: 8000,
    trend: -2.1,
  },
  {
    icon: '📈',
    title: 'Net Profit',
    value: 4000,
    trend: 3.8,
  },
];

export const DashboardTemplate: React.FC<IDashboardTemplateProps> = ({
  title,
  incomeChartData,
  expensesChartData,
  chartOptions,
  onFilterChange,
  activeFilter = '1m',
  isLoading = false,
}) => {
  // Explicitly type the chart options for each chart type
  const lineChartOptions: ChartOptions<'line'> = chartOptions as ChartOptions<'line'>;
  const barChartOptions: ChartOptions<'bar'> = chartOptions as ChartOptions<'bar'>;

  return (
    <div className="dashboard-template">
      <h1 className="dashboard-header">{title}</h1>
      {isLoading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="dashboard-overview-grid">
            {overviewCards.map((card, index) => (
              <MetricCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={String(card.value)}
                trend={
                  typeof card.trend === 'number'
                    ? { value: card.trend, isPositive: card.trend >= 0 }
                    : undefined
                }
              />
            ))}
          </div>
          <ChartSection
            title="Total Income"
            filters={['1d', '1w', '1m', '1 year']}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            chart={<Line data={incomeChartData} options={lineChartOptions} />}
            height={340}
          />
          <ChartSection
            title="Recent Expenses"
            chart={<Bar data={expensesChartData} options={barChartOptions} />}
            height={220}
          />
        </>
      )}
    </div>
  );
};
