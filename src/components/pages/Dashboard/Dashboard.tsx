'use client';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import React from 'react';
import { PiggyBank, Wallet, Activity } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import UserCard from '@/components/organisms/UserCard/UserCard';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import { User } from '@organisms/UserCard/IUserCard';
import { getData } from '@/utils/api';
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
import Copyright from '@/components/atoms/Copyright/Copyright';
import { useRouter } from 'next/navigation';

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

interface TransactionEntry {
  id: number;
  date: string;
  amount: number;
  description?: string;
  type: 'income' | 'expense';
  category?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [incomeData, setIncomeData] = useState<TransactionEntry[]>([]);
  const [expenseData, setExpenseData] = useState<TransactionEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      console.error('No user session found.');
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);

    const fetchUserData = async () => {
      try {
        const userRes = await getData<{ name: string; email: string }>(`/users/${id}`);
        if (userRes) {
          setUser({ name: userRes.name, email: userRes.email, avatarUrl: '' });
        }

        // Fetch all transactions (income + expenses)
        const transactionsRes = await getData<TransactionEntry[]>(`/transactions?user_id=${id}`);
        if (transactionsRes) {
          setIncomeData(transactionsRes.filter(tx => tx.type === 'income'));
          setExpenseData(transactionsRes.filter(tx => tx.type === 'expense'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = expenseData.reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Group income by month
  const groupByMonth = (data: TransactionEntry[]) => {
    return data.reduce<Record<string, number>>((acc, tx) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(tx.amount);
      return acc;
    }, {});
  };

  const incomeByMonth = groupByMonth(incomeData);

const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const months = monthOrder.filter((month) => month in incomeByMonth);

const lineData = {
  labels: months,
  datasets: [
    {
      label: 'Income',
      data: months.map(m => incomeByMonth[m] || 0),
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

const groupByCategory = (data: TransactionEntry[]) => {
  return data.reduce<Record<string, number>>((acc, tx) => {
    const rawCategory = tx.category?.trim();
    const rawDescription = tx.description?.trim();

    const category = rawCategory && rawCategory.length > 0
      ? rawCategory
      : rawDescription && rawDescription.length > 0
      ? rawDescription
      : 'Other';

    acc[category] = (acc[category] || 0) + Number(tx.amount);
    return acc;
  }, {});
};


const expensesByCategory = groupByCategory(expenseData);
const sortedCategories = Object.keys(expensesByCategory).sort((a, b) => a.localeCompare(b));

const barData = {
  labels: sortedCategories,
  datasets: [
    {
      label: 'Expenses',
      data: sortedCategories.map(c => expensesByCategory[c] || 0),
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

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <>
      <Sidebar />
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>
        <UserCard name={user?.name || 'User'} />
      </div>
      <div className="mainContent">
        <h1 className="header">Dashboard</h1>
        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon">
              <PiggyBank />
            </span>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">${totalIncome.toLocaleString()}</span>
          </div>
          <div className="card">
            <span className="cardIcon">
              <Wallet />
            </span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="card">
            <span className="cardIcon">
              <Activity />
            </span>
            <span className="cardTitle">Net Balance</span>
            <span className="cardValue">${(totalIncome - totalExpenses).toLocaleString()}</span>
          </div>
        </div>

        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Total Income</h2>
            <div className="filterGroup chartFilters">
              <button className="chartFilter active">1d</button>
              <button className="chartFilter">1w</button>
              <button className="chartFilter">1m</button>
              <button className="chartFilter">1 year</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 340 }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        <div className="tableContainer">
          <div className="chartHeader">
            <h2>Recent Expenses</h2>
          </div>
          <div style={{ width: '100%', height: 220, margin: '0 auto' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <Copyright />
      </div>
    </>
  );
};

export default Dashboard;
