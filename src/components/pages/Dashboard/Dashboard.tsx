'use client';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import React from 'react';
import { PiggyBank, Wallet, Activity } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import UserCard from '@/components/organisms/UserCard/UserCard';
import { User } from '@organisms/UserCard/IUserCard';
import axios from 'axios';
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

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

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
        const userRes = await axios.get(`http://localhost:3001/users/${id}`);
        const { name, email } = userRes.data;

        setUser({ name, email, avatarUrl: '' });

        const incomeRes = await axios.get(
          `http://localhost:3001/transactions/income?user_id=${id}`,
        );
        type Transaction = { amount: number | string };
        const incomeSum = incomeRes.data.reduce(
          (sum: number, tx: Transaction) => sum + Number(tx.amount),
          0,
        );
        setTotalIncome(incomeSum);

        const expenseRes = await axios.get(
          `http://localhost:3001/transactions/expenses?user_id=${id}`,
        );
        const expenseSum = expenseRes.data.reduce(
          (sum: number, tx: Transaction) => sum + Number(tx.amount),
          0,
        );
        setTotalExpenses(expenseSum);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {user && <UserCard name={user.name} />}
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
      </div>
    </>
  );
};

export default Dashboard;
