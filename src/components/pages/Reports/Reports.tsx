import React from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import '../Dashboard/Dashboard.css';
import { PiggyBank, Wallet, Activity } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { User } from '@organisms/UserCard/IUserCard';
import Copyright from '@/components/atoms/Copyright/Copyright';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Income',
      data: [1200, 1900, 1700, 2200, 2000, 2500, 2300],
      backgroundColor: '#6c63ff',
      borderRadius: 8,
      maxBarThickness: 32,
    },
    {
      label: 'Expenses',
      data: [900, 1500, 1200, 1800, 1600, 2100, 1900],
      backgroundColor: '#a5b4fc',
      borderRadius: 8,
      maxBarThickness: 32,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#471d8b',
        font: { size: 14, weight: 'bold' as const },
      },
    },
    title: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#3b277a',
      bodyColor: '#3b277a',
      borderColor: '#ede9fe',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
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

const mockMonthlySummary = [
  { month: 'July', income: 2300, expenses: 1900, net: 400 },
  { month: 'June', income: 2500, expenses: 2100, net: 400 },
  { month: 'May', income: 2000, expenses: 1600, net: 400 },
  { month: 'April', income: 2200, expenses: 1800, net: 400 },
];

const Reports = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      console.error('No user session found.');
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`${apiUrl}/users/${id}`);
        const { name, email } = userRes.data;
        setUser({ name, email, avatarUrl: '' });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff 70%, #f8f6ff 100%)',
      }}
    >
      <Sidebar />
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>
        <UserCard name="User" />
      </div>
      <div className="mainContent">
        <h1 className="header">Reports</h1>
        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon">
              <PiggyBank />
            </span>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">$12,000</span>
          </div>
          <div className="card">
            <span className="cardIcon">
              <Wallet />
            </span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">$10,000</span>
          </div>
          <div className="card">
            <span className="cardIcon">
              <Activity />
            </span>
            <span className="cardTitle">Net Balance</span>
            <span className="cardValue">$2,000</span>
          </div>
        </div>
        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Income vs Expenses</h2>
            <div className="filterGroup chartFilters">
              <button className="chartFilter active">1m</button>
              <button className="chartFilter">6m</button>
              <button className="chartFilter">1y</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 340 }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
        <div className="tableContainer">
          <div className="chartHeader">
            <h2>Monthly Summary</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ color: '#471d8b', fontWeight: 700, fontSize: 16 }}>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Month</th>
                <th style={{ textAlign: 'right', padding: '10px 0' }}>Income</th>
                <th style={{ textAlign: 'right', padding: '10px 0' }}>Expenses</th>
                <th style={{ textAlign: 'right', padding: '10px 0' }}>Net</th>
              </tr>
            </thead>
            <tbody>
              {mockMonthlySummary.map((entry, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ede9fe' }}>
                  <td style={{ padding: '10px 0' }}>{entry.month}</td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#22c55e',
                      fontWeight: 600,
                    }}
                  >
                    ${entry.income}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    -${entry.expenses}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#471d8b',
                      fontWeight: 700,
                    }}
                  >
                    ${entry.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Copyright />
      </div>
    </div>
  );
};

export default Reports;
