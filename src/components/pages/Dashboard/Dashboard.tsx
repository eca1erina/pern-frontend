'use client';

import React, { useState, useEffect } from 'react';
import { PiggyBank, Wallet, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Sidebar from '@/components/organisms/Sidebar/Sidebar';
import { DashboardTemplate } from '@/components/templates/DashboardTemplate/DashboardTemplate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('1m');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 1700, 2200, 2000, 2500, 2300],
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108,99,255,0.10)',
        tension: 0.45,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#6c63ff',
        pointBorderColor: '#fff',
        borderWidth: 3,
        pointBorderWidth: 2,
        pointStyle: 'circle',
      },
    ],
  };

  const barData = {
    labels: ['Groceries', 'Rent', 'Utilities', 'Transport', 'Other'],
    datasets: [
      {
        label: 'Expenses',
        data: [400, 1200, 300, 150, 200],
        backgroundColor: '#a5b4fc',
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 10,
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#3b277a',
        bodyColor: '#3b277a',
        borderColor: '#ede9fe',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#a3a3a3',
          font: { size: 14, weight: 'bold' as const },
          padding: 8,
        },
      },
      y: {
        grid: { color: '#ede9fe', lineWidth: 1 },
        border: { display: false },
        ticks: {
          color: '#a3a3a3',
          font: { size: 13 },
          padding: 8,
          callback: function (tickValue: string | number) {
            if (typeof tickValue === 'number' && tickValue >= 1000) return tickValue / 1000 + 'k';
            return tickValue;
          },
        },
      },
    },
  };

  const overviewCards = [
    {
      icon: <PiggyBank />,
      title: 'Total Income',
      value: '$12,000',
      trend: {
        value: 12.5,
        isPositive: true,
      },
    },
    {
      icon: <Wallet />,
      title: 'Total Expenses',
      value: '$10,000',
      trend: {
        value: 8.3,
        isPositive: false,
      },
    },
    {
      icon: <Activity />,
      title: 'Net Balance',
      value: '$2,000',
      trend: {
        value: 23.1,
        isPositive: true,
      },
    },
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Here you would fetch new data based on the filter
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff 70%, #f8f6ff 100%)',
      }}
    >
      <Sidebar />
      <DashboardTemplate
        title="Dashboard"
        overviewCards={overviewCards}
        incomeChartData={lineData}
        expensesChartData={barData}
        chartOptions={chartOptions}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
