'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import { User } from '@organisms/UserCard/IUserCard';
import '../Dashboard/Dashboard.css';
import { Wallet } from 'lucide-react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

const mockExpenses = [
  { date: '2024-07-03', category: 'Groceries', amount: 120 },
  { date: '2024-07-01', category: 'Rent', amount: 800 },
  { date: '2024-06-28', category: 'Utilities', amount: 60 },
  { date: '2024-06-25', category: 'Transport', amount: 30 },
  { date: '2024-06-20', category: 'Other', amount: 50 },
];

const Expenses = () => {
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
            `http://localhost:3001/transactions/expense?user_id=${id}`,
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
      <Sidebar />
      {user && <UserCard name={user.name} />}
      <div className="mainContent">
        <h1 className="header">Your Expenses</h1>
        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon"><Wallet /></span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">${totalExpenses.toLocaleString()}</span>
          </div>
        </div>
        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Expenses by Category</h2>
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
            <h2>Recent Expenses</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ color: '#471d8b', fontWeight: 700, fontSize: 16 }}>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Category</th>
                <th style={{ textAlign: 'right', padding: '10px 0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockExpenses.map((entry, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ede9fe' }}>
                  <td style={{ padding: '10px 0' }}>{entry.date}</td>
                  <td style={{ padding: '10px 0' }}>{entry.category}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', color: '#ef4444', fontWeight: 600 }}>
                    -${entry.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Expenses; 