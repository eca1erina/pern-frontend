'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import '../Dashboard/Dashboard.css';
import { Wallet, Plus } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        callback: function (tickValue: string | number) {
          if (typeof tickValue === 'number' && tickValue >= 1000) return tickValue / 1000 + 'k';
          return tickValue;
        },
      },
    },
  },
};

type Expense = {
  date: string;
  category: string;
  amount: number;
  description?: string;
};

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: '',
  });

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/users/${user.id}/transactions`);
      // Filter only expenses:
      const expensesData = res.data.filter((tx: any) => tx.type === 'expense');
      setExpenses(expensesData);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        userId: user.id,
        type: 'expense',
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        is_recurring: false,
      };

      await axios.post('http://localhost:3001/users/transactions', payload);
      setShowForm(false);
      setFormData({ category: '', amount: '', description: '', date: '' });
      fetchExpenses(); // refresh list
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const categoryTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const barData = {
    labels: Object.keys(categoryTotals).length > 0 ? Object.keys(categoryTotals) : ['Groceries', 'Rent', 'Utilities', 'Transport', 'Other'],
    datasets: [
      {
        label: 'Expenses',
        data: Object.values(categoryTotals).length > 0 ? Object.values(categoryTotals) : [400, 1200, 300, 150, 200],
        backgroundColor: '#a5b4fc',
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
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
      <div className="mainContent">
        <h1 className="header">Your Expenses</h1>
        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon">
              <Wallet />
            </span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">
              ${Array.isArray(expenses) ? expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0).toFixed(2) : '0.00'}
            </span>
          </div>
          <button className="addExpenseBtn" onClick={() => setShowForm(true)}>
            <Plus size={20} />
            Add Expense
          </button>
        </div>

        {showForm && (
          <form className="expenseForm" onSubmit={handleSubmit} style={{ marginTop: 20, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category (e.g. Groceries, Rent)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  backgroundColor: '#ddd',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="chartContainer" style={{ marginTop: 32 }}>
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

        <div className="tableContainer" style={{ marginTop: 32 }}>
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
              {expenses.length > 0 ? expenses.map((entry, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ede9fe' }}>
                  <td style={{ padding: '10px 0' }}>{entry.date}</td>
                  <td style={{ padding: '10px 0' }}>{entry.category}</td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    -${Number(entry.amount).toFixed(2)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                    No expense entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
