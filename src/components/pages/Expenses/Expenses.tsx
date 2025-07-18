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
import Spline from '@splinetool/react-spline';
import Select from 'react-select';
import { useLoader } from '@/context/LoaderContext';


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
  const { show, hide } = useLoader();
  useEffect(() => {
    show();
    const timer = setTimeout(() => {
      hide();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [categoryChartData, setCategoryChartData] = useState<any>(null);
  const [filterRange, setFilterRange] = useState<'1m' | '6m' | '1y'>('1m');
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  // Currency selector state
  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'RON', symbol: 'RON   ' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'AUD', symbol: 'A$' },
  ];
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

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

      const categoryMap: Record<string, number> = {};
      filteredExpenses.forEach((expense) => {
        const category = expense.description || expense.category_id || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + Number(expense.amount);
      });

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

  const currencyOptions = currencies.map(c => ({ value: c.code, label: c.code, symbol: c.symbol }));

  return (
    <>
      <Sidebar />
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>
        <UserCard name={user?.name || 'User'} />
      </div>
      <div className="mainContent">
        <h1 className="header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          Expenses
          <button
            className="cardAddBtn add-expand-btn"
            onClick={() => setShowModal(true)}
            aria-label="Add Expense"
          >
            <Plus size={18} color="#fff" />
            <span className="add-btn-text">Add Expense</span>
          </button>
        </h1>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 32, marginBottom: 32 }}>
          <div className="card" style={{ position: 'relative', minWidth: 420, width: 470, paddingRight: 32 }}>
            <span className="cardIcon">
              <Wallet />
            </span>
            <div style={{ position: 'absolute', top: 18, right: 18, minWidth: 110, zIndex: 2 }}>
              <Select
                options={currencyOptions}
                value={currencyOptions.find(opt => opt.value === selectedCurrency.code)}
                onChange={opt => setSelectedCurrency(currencies.find(c => c.code === opt?.value) || currencies[0])}
                isSearchable={false}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    background: 'linear-gradient(90deg, #ede7ff 60%, #e0e7ff 100%)',
                    color: 'var(--primary-purple)',
                    border: state.isFocused ? '2px solid #a18aff' : '2px solid #cfc2fa',
                    borderRadius: 16,
                    fontWeight: 700,
                    fontSize: '1rem',
                    minHeight: 'unset',
                    boxShadow: state.isFocused ? '0 0 0 2px #a18aff' : '0 2px 8px rgba(123, 108, 255, 0.10)',
                    padding: '0.1rem 0.2rem',
                    cursor: 'pointer',
                    transition: 'border 0.18s, box-shadow 0.18s',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'var(--primary-purple)',
                    fontWeight: 700,
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: 16,
                    background: '#f4f2fd',
                    boxShadow: '0 2px 8px rgba(123, 108, 255, 0.10)',
                    zIndex: 10,
                    overflow: 'hidden',
                  }),
                  option: (base, state) => ({
                    ...base,
                    color: state.isSelected ? '#fff' : '#471d8b',
                    background: state.isSelected
                      ? 'linear-gradient(90deg, #a18aff 60%, #7b6cff 100%)'
                      : state.isFocused
                        ? 'linear-gradient(90deg, #ede7ff 60%, #e0e7ff 100%)'
                        : 'transparent',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: 16,
                    margin: '2px 8px',
                    transition: 'background 0.18s, transform 0.18s',
                    transform: state.isFocused ? 'scale(1.04)' : 'scale(1)',
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: 'var(--primary-purple)',
                  }),
                  indicatorSeparator: () => ({ display: 'none' }),
                  input: (base) => ({ ...base, color: 'var(--primary-purple)' }),
                }}
              />
            </div>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">{selectedCurrency.symbol}{totalExpenses.toLocaleString()}</span>
          </div>
          <div style={{ minWidth: 380, width: 410, height: 220, borderRadius: 24, overflow: 'hidden', background: 'transparent', boxShadow: '0 2px 8px rgba(123, 108, 255, 0.10)' }}>
            <Spline scene="https://prod.spline.design/XkyTLSM4UShB7kNW/scene.splinecode" />
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
