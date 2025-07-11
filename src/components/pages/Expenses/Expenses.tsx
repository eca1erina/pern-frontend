import React, { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import '../Dashboard/Dashboard.css';
import { Wallet } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { User } from '@organisms/UserCard/IUserCard';
import axios from 'axios';
import AddExpenseModal from '@organisms/Modal/AddExpenseModal';
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
        callback: function (tickValue: string | number) {
          if (typeof tickValue === 'number' && tickValue >= 1000) return tickValue / 1000 + 'k';
          return tickValue;
        },
      },
    },
  },
};

const Expenses = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

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

        const expenseRes = await axios.get(
          `http://localhost:3001/transactions/expenses?user_id=${id}`,
        );
        const expenseSum = expenseRes.data.reduce(
          (sum: number, tx: { amount: number | string }) => sum + Number(tx.amount),
          0,
        );
        setTotalExpenses(expenseSum);
        setRecentExpenses(expenseRes.data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddExpense = async (formData: {
    category_id: string;
    amount: number;
    date: string;
    description?: string;
    is_recurring: boolean;
  }) => {
    const session = sessionStorage.getItem('user');
    const userId = session ? JSON.parse(session).id : null;
    if (!userId) return;

    try {
      const res = await axios.post('http://localhost:3001/transactions', {
        ...formData,
        user_id: userId,
        type: 'expense',
      });

      setRecentExpenses((prev) => [res.data, ...prev]);
      setTotalExpenses((prev) => prev + Number(res.data.amount));
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const handleDeleteExpense = async (transactionId: number) => {
  try {
    await axios.delete(`http://localhost:3001/transactions/${transactionId}`);

    setRecentExpenses((prev) => prev.filter((entry) => entry.id !== transactionId));

    // Optionally update total expenses by subtracting deleted amount
    const deletedExpense = recentExpenses.find((e) => e.id === transactionId);
    if (deletedExpense) {
      setTotalExpenses((prev) => prev - Number(deletedExpense.amount));
    }
  } catch (error) {
    console.error('Failed to delete expense:', error);
  }
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
      {user && <UserCard name={user.name} />}
      <div className="mainContent">
        <div
          className="header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 28, margin: 0 }}>Your Expenses</h1>
            <button
              onClick={() => setShowModal(true)}
              style={{
                fontSize: 20,
                padding: '4px 12px',
                borderRadius: 6,
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>

        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon">
              <Wallet />
            </span>
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
        <th style={{ textAlign: 'center', padding: '10px 0', width: 50 }}>
          {/* Optional header for delete button */}
        </th>
      </tr>
    </thead>
    <tbody>
      {recentExpenses.map((entry, idx) => (
        <tr key={idx} style={{ borderBottom: '1px solid #ede9fe' }}>
          <td style={{ padding: '10px 0' }}>{entry.date}</td>
          <td style={{ padding: '10px 0' }}>{entry.category_id}</td>
          <td
            style={{
              textAlign: 'right',
              padding: '10px 0',
              color: '#ef4444',
              fontWeight: 600,
            }}
          >
            -${entry.amount}
          </td>
          <td style={{ textAlign: 'center', padding: '10px 0' }}>
            <button
              onClick={() => handleDeleteExpense(entry.id)} 
              aria-label={`Delete expense on ${entry.date}`}
              style={{
                backgroundColor: 'transparent',
                borderColor: 'red',
                color: 'red',
                borderStyle: 'solid',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                lineHeight: 1,
                padding: '2%',
                borderRadius: 4,
                width: 32,
                height: 32,
              }}
              title="Delete expense"
            >
              &times;
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {showModal && (
          <AddExpenseModal
            onClose={() => setShowModal(false)}
            onSubmit={handleAddExpense}
          />
        )}
      </div>
    </div>
  );
};

export default Expenses;
