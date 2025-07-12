'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import axios from 'axios';
import { User } from '@organisms/UserCard/IUserCard';
import '../Dashboard/Dashboard.css';
import { PiggyBank } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
        callback: function(tickValue: string | number) { 
          if (typeof tickValue === 'number' && tickValue >= 1000) return tickValue/1000 + 'k';
          return tickValue;
        },
      },
    },
  },
};

const mockIncomeEntries = [
  { date: '2024-07-01', source: 'Salary', amount: 2000 },
  { date: '2024-06-15', source: 'Freelance', amount: 500 },
  { date: '2024-06-10', source: 'Gift', amount: 200 },
  { date: '2024-06-01', source: 'Salary', amount: 2000 },
  { date: '2024-05-15', source: 'Bonus', amount: 300 },
];

const Income = () => {
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
    
          } catch (error) {
            console.error('Error loading dashboard data:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserData();
      }, []);
  

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #fff 70%, #f8f6ff 100%)' }}>
      <Sidebar />
      {user && <UserCard name={user.name} />}
      <div className="mainContent">
        <h1 className="header">Income</h1>
        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon"><PiggyBank /></span>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">${totalIncome.toLocaleString()}</span>
          </div>
        </div>
        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Income Trend</h2>
            <div className="filterGroup chartFilters">
              <button className="chartFilter active">1m</button>
              <button className="chartFilter">6m</button>
              <button className="chartFilter">1y</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 340 }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
        <div className="tableContainer">
          <div className="chartHeader">
            <h2>Recent Income</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ color: '#471d8b', fontWeight: 700, fontSize: 16 }}>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Source</th>
                <th style={{ textAlign: 'right', padding: '10px 0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockIncomeEntries.map((entry, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ede9fe' }}>
                  <td style={{ padding: '10px 0' }}>{entry.date}</td>
                  <td style={{ padding: '10px 0' }}>{entry.source}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', color: '#22c55e', fontWeight: 600 }}>
                    ${entry.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Income; 