import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './MetricCard.css';
import { MetricCardProps } from './IMetricCard';

export const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend }) => {
  return (
    <div className="metric-card">
      <div className="metric-card-icon">{icon}</div>
      <div className="metric-card-title">{title}</div>
      <div className="metric-card-value">{value}</div>
      {trend && (
        <div className={`metric-card-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
          {trend.isPositive ? (
            <ArrowUp size={16} style={{ marginRight: '4px' }} />
          ) : (
            <ArrowDown size={16} style={{ marginRight: '4px' }} />
          )}
          {trend.value}% {trend.isPositive ? 'increase' : 'decrease'}
        </div>
      )}
    </div>
  );
};
