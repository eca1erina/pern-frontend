'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import { User } from '@organisms/UserCard/IUserCard';
import '../Dashboard/Dashboard.css';
import { Wallet, Plus } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { getData, postData, deleteData } from '@/utils/api';
import AddExpenseModal from '@organisms/Modal/AddExpenseModal';
import ConfirmDeleteModal from '@organisms/Modal/ConfirmDeleteModal';
import Copyright from '@/components/atoms/Copyright/Copyright';
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

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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

const Expenses = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [categoryChartData, setCategoryChartData] = useState<any>(null);
  const [filterRange, setFilterRange] = useState<'1m' | '6m' | '1y'>('1m');
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  const router = useRouter();

  const fetchUserData = async () => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      console.error('No user session found.');
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);

    try {
      const userRes = await getData(`/users/${id}`);
      const { name, email } = userRes;
      setUser({ name, email, avatarUrl: '' });

      const expenseData = await getData(`/transactions/expenses?user_id=${id}`);

      const now = new Date();
      let filteredExpenses = [...expenseData];

      if (filterRange === '1m') {
        filteredExpenses = filteredExpenses.filter(
          (e) => new Date(e.date) >= new Date(new Date().setMonth(now.getMonth() - 1))
        );
      } else if (filterRange === '6m') {
        filteredExpenses = filteredExpenses.filter(
          (e) => new Date(e.date) >= new Date(new Date().setMonth(now.getMonth() - 6))
        );
      } else if (filterRange === '1y') {
        filteredExpenses = filteredExpenses.filter(
          (e) => new Date(e.date) >= new Date(new Date().setFullYear(now.getFullYear() - 1))
        );
      }

      const expenseSum = filteredExpenses.reduce((sum, tx) => sum + Number(tx.amount), 0);
      setTotalExpenses(expenseSum);
      setRecentExpenses(filteredExpenses);

      // ✅ Group by category
      const categoryMap: Record<string, number> = {};
      filteredExpenses.forEach((expense) => {
        const category = expense.description || expense.category_id || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + Number(expense.amount);
      });

      // ✅ Sort categories alphabetically for consistent chart display
      const sortedCategories = Object.keys(categoryMap).sort((a, b) => a.localeCompare(b));

      setCategoryChartData({
        labels: sortedCategories,
        datasets: [
          {
            label: 'Expenses',
            data: sortedCategories.map((cat) => categoryMap[cat]),
            backgroundColor: '#a5b4fc',
            borderRadius: 8,
            maxBarThickness: 32,
          },
        ],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [filterRange]);

  const handleAddExpense = async (expense: {
    date: string;
    category: string;
    amount: number;
    description: string;
    is_recurring: boolean;
  }) => {
    const session = sessionStorage.getItem('user');
    const userId = session ? JSON.parse(session).id : null;
    if (!userId) return;

    try {
      await postData(`/transactions`, {
        category_id: expense.category,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
        is_recurring: expense.is_recurring,
        user_id: userId,
        type: 'expense',
      });

      setShowModal(false);
      fetchUserData();
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpenseId) return;

    try {
      await deleteData(`/transactions/${selectedExpenseId}`);
      setConfirmDeleteOpen(false);
      setSelectedExpenseId(null);
      fetchUserData();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const exportToCSV = () => {
  if (!recentExpenses.length) return;

  const headers = ['Date', 'Category', 'Amount'];
  const rows = recentExpenses.map((e) => [
    e.date,
    e.description || e.category_id,
    e.amount,
  ]);
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'expenses.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text('Expenses Report', 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['Date', 'Category', 'Amount']],
    body: recentExpenses.map((e) => [
      e.date,
      e.description || e.category_id,
      `$${Number(e.amount).toFixed(2)}`,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [165, 180, 252] },
  });

  doc.save('expenses.pdf');
};

  return (
    <>
      <Sidebar />
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>
        <UserCard name={user?.name || 'User'} />
      </div>
      <div className="mainContent">
        <h1 className="header">Expenses</h1>

        <div className="overviewGrid">
          <div className="card" style={{ position: 'relative' }}>
            <span className="cardIcon">
              <Wallet />
            </span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">${totalExpenses.toLocaleString()}</span>
            <button
              className="cardAddBtn"
              onClick={() => setShowModal(true)}
              aria-label="Add Expense"
            >
              <Plus size={18} color="#fff" />
            </button>
          </div>
          <div className="card" style={{ position: 'relative' }}>
  <span className="cardTitle">Export Data</span>
  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
    <button
      onClick={exportToCSV}
      style={{
        backgroundColor: '#4f46e5',
        border: 'none',
        padding: '8px 12px',
        color: '#fff',
        borderRadius: 6,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Export CSV
    </button>
    <button
      onClick={exportToPDF}
      style={{
        backgroundColor: '#10b981',
        border: 'none',
        padding: '8px 12px',
        color: '#fff',
        borderRadius: 6,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Export PDF
    </button>
  </div>
</div>

        </div>

        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Expenses by Category</h2>
            <div className="filterGroup chartFilters">
              {['1m', '6m', '1y'].map((range) => (
                <button
                  key={range}
                  className={`chartFilter ${filterRange === range ? 'active' : ''}`}
                  onClick={() => setFilterRange(range as '1m' | '6m' | '1y')}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 340 }}>
            {categoryChartData ? (
              <Bar data={categoryChartData} options={chartOptions} />
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>Loading chart...</p>
            )}
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
                <th style={{ textAlign: 'center', padding: '10px 0' }}></th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((entry) => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #ede9fe' }}>
                  <td style={{ padding: '10px 0' }}>{entry.date}</td>
                  <td style={{ padding: '10px 0' }}>{entry.description || entry.category_id}</td>
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
                      onClick={() => {
                        setSelectedExpenseId(entry.id);
                        setConfirmDeleteOpen(true);
                      }}
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
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onAddExpense={handleAddExpense}
          />
        )}

        {confirmDeleteOpen && (
          <ConfirmDeleteModal
            isOpen={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
            onConfirm={handleDeleteExpense}
          />
        )}

        <Copyright />
      </div>
    </>
  );
};

export default Expenses;
