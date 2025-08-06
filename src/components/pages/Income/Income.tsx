'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import axios from 'axios';
import { getData, deleteData } from '@/utils/api';
import { User } from '@organisms/UserCard/IUserCard';
import '../Dashboard/Dashboard.css';
import { PiggyBank, Plus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import AddIncomeModal from '@organisms/Modal/AddIncomeModal';
import ConfirmDeleteModal from '@organisms/Modal/ConfirmDeleteModal';
import Copyright from '@/components/atoms/Copyright/Copyright';
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
import { useRouter } from 'next/navigation';
import { useLoader } from '@/context/LoaderContext';
import { useCurrency } from '@/context/CurrencyContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IncomeEntry {
  category_id: string;
  description: string;
  id: number;
  date: string;
  source: string;
  amount: number;
}
interface NewIncomeData {
  date: string;
  source: string;
  amount: number;
  is_recurring?: boolean;
}

interface TransactionEntry {
  id: number;
  date: string;
  amount: number;
  description?: string;
  type: 'income' | 'expense';
  category_id: string;
}

const INCOME_QUERY = `
  query GetUserAndTransactions($id: Int!) {
    getUser(id: $id) {
      id
      name
      email
    }
    getTransactions(user_id: $id) {
      id
      date
      amount
      description
      type
      category_id
    }
  }
`;

const Income = () => {
  const { show, hide } = useLoader();
  useEffect(() => {
    show();
    const t = setTimeout(hide, 1000);
    return () => clearTimeout(t);
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IncomeEntry | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { rate, symbol } = useCurrency();

  const availableYears = Array.from(
    new Set(incomeEntries.map((entry) => new Date(entry.date).getFullYear())),
  ).sort((a, b) => b - a);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const fetchIncomeData = useCallback(async () => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: INCOME_QUERY, variables: { id } }),
      });
      const { data, errors } = await res.json();
      if (errors) {
        setLoading(false);
        return;
      }

      setUser(data.getUser);

      const backendIncome = data.getTransactions.filter(
        (tx: TransactionEntry) => tx.type === 'income',
      );
      const mock = JSON.parse(sessionStorage.getItem('bank_income') || '[]') as TransactionEntry[];

      const merged = [
        ...backendIncome,
        ...mock.map((tx, i) => ({
          ...tx,
          id: tx.id ?? `mock-${i}`,
          amount: Number(tx.amount),
        })),
      ];

      merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setIncomeEntries(merged);
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteClick = (entry: IncomeEntry) => {
    setDeleteTarget(entry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteData(`/transactions/${deleteTarget.id}`);
      setIncomeEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } catch {
      //console.error('Failed to delete transaction:', error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      //console.error('No user session found.');
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);

    const fetchIncomeData = async () => {
      try {
        const userRes = await getData<User>(`/users/${id}`);
        setUser({ name: userRes.name, email: userRes.email, avatarUrl: '' });

        //Backend income
        const backendIncome = await getData<IncomeEntry[]>(`/transactions/income?user_id=${id}`);
        const formattedBackend = backendIncome.map((tx: IncomeEntry) => ({
          id: tx.id,
          date: tx.date,
          source: tx.description || 'Income',
          amount: Number(tx.amount),
        }));

        // Mock bank income
        const rawMockIncome = sessionStorage.getItem('bank_income') || '[]';
        const parsedMock = JSON.parse(rawMockIncome);
        const formattedMock = parsedMock.map((tx: IncomeEntry, idx: number) => ({
          id: tx.id ?? `mock-${idx}`,
          date: tx.date,
          source: tx.description || tx.category_id || 'Bank Income',
          amount: Number(tx.amount),
        }));

        //console.log('Mock income entries:', parsedMock);

        const allIncome = [...formattedBackend, ...formattedMock].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setIncomeEntries(allIncome);
      } catch {
        //console.error('Error loading income data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();

    const handleBankDataChanged = () => {
      fetchIncomeData();
    };

    window.addEventListener('bankDataChanged', handleBankDataChanged);

    return () => {
      window.removeEventListener('bankDataChanged', handleBankDataChanged);
    };
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const addIncome = async (income: NewIncomeData) => {
    const session = sessionStorage.getItem('user');
    if (!session) return;

    const { id: userId } = JSON.parse(session);

    try {
      const payload = {
        user_id: userId,
        type: 'income',
        category_id: 1,
        description: income.source,
        amount: income.amount,
        date: new Date(income.date).toISOString().split('T')[0],
      };

      await axios.post(`${apiUrl}/transactions`, payload);

      await fetchIncomeData();
      closeModal();
    } catch {
      //console.error('Failed to add income:', error);
    }
  };

  const totalIncome = incomeEntries.reduce((sum, i) => sum + i.amount, 0);

  const filteredEntries = incomeEntries.filter(
    (entry) => new Date(entry.date).getFullYear() === selectedYear,
  );

  const groupedIncome: Record<string, number> = {};
  filteredEntries.forEach((entry) => {
    const month = new Date(entry.date).toLocaleString('default', { month: 'short' });
    groupedIncome[month] = (groupedIncome[month] || 0) + entry.amount;
  });

  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const months = monthOrder.filter((month) => month in groupedIncome);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map((month) => (groupedIncome[month] || 0) * rate),
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
          callback: function (tickValue: string | number) {
            if (typeof tickValue === 'number' && tickValue >= 1000) return tickValue / 1000 + 'k';
            return tickValue;
          },
        },
      },
    },
  };

  const incomeMilestones = [5000, 10000, 20000, 50000, 100000];
  const yearlyIncome = filteredEntries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Sidebar />
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>
        <UserCard name={user?.name || 'User'} />
      </div>
      <div className="mainContent">
        <h1 className="header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          Income
          <button className="cardAddBtn add-expand-btn" onClick={openModal} aria-label="Add Income">
            <Plus size={18} color="#fff" />
            <span className="add-btn-text">Add Income</span>
          </button>
        </h1>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 32, marginBottom: 32 }}>
          <div
            className="card"
            style={{ position: 'relative', minWidth: 340, width: 370, paddingRight: 32 }}
          >
            <span className="cardIcon">
              <PiggyBank />
            </span>
            <div
              style={{ position: 'absolute', top: 18, right: 18, minWidth: 110, zIndex: 2 }}
            ></div>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">
              {symbol}
              {(totalIncome * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div
            className="card"
            style={{ position: 'relative', minWidth: 340, width: 370, paddingRight: 32 }}
          >
            <span className="cardIcon">
              <PiggyBank />
            </span>
            <div
              style={{ position: 'absolute', top: 18, right: 18, minWidth: 110, zIndex: 2 }}
            ></div>
            <span className="cardTitle">Monthly Income</span>
            <span className="cardValue">
              {symbol}
              {(
                incomeEntries
                  .filter(
                    (e) =>
                      new Date(e.date).getMonth() === new Date().getMonth() &&
                      new Date(e.date).getFullYear() === new Date().getFullYear(),
                  )
                  .reduce((sum, e) => sum + e.amount, 0) * rate
              ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div
            className="card"
            style={{ position: 'relative', minWidth: 340, width: 370, paddingRight: 32 }}
          >
            <span className="cardIcon">
              <PiggyBank />
            </span>

            <div
              style={{ position: 'absolute', top: 18, right: 18, minWidth: 110, zIndex: 2 }}
            ></div>

            <span className="cardTitle">Top Income Source</span>
            <span className="cardValue">
              {(() => {
                const top = Object.entries(
                  filteredEntries.reduce((acc: Record<string, number>, e) => {
                    acc[e.source] = (acc[e.source] || 0) + e.amount;
                    return acc;
                  }, {}),
                ).sort((a, b) => b[1] - a[1])[0];

                return top
                  ? `${top[0]} - ${symbol}${(top[1] * rate).toLocaleString(undefined)}`
                  : 'N/A';
              })()}
            </span>
          </div>
        </div>

        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Income Trend</h2>
            <div className="filterGroup chartFilters">
              {availableYears.map((year) => (
                <button
                  key={year}
                  className={`chartFilter ${year === selectedYear ? 'active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 340 }}>
            <Line data={chartData} options={chartOptions} />
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
                <th style={{ padding: '10px 0', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeEntries.map((entry) => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #ede9fe' }}>
                  <td style={{ padding: '10px 0' }}>{entry.date}</td>
                  <td style={{ padding: '10px 0' }}>{entry.source}</td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#22c55e',
                      fontWeight: 600,
                    }}
                  >
                    {symbol}
                    {(entry.amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  <td style={{ textAlign: 'center', padding: '10px 0' }}>
                    <button
                      onClick={() => handleDeleteClick(entry)}
                      aria-label={`Delete transaction on ${entry.date}`}
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        color: 'red',
                        borderStyle: 'solid',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        lineHeight: 1,
                        padding: '2%',
                      }}
                      title="Delete transaction"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="milestoneSection">
          <h2>Income Milestones</h2>
          <ul className="milestoneList">
            {incomeMilestones.map((milestone) => {
              const convertedMilestone = milestone * rate;
              const convertedYearly = yearlyIncome * rate;

              const achieved = convertedYearly >= convertedMilestone;
              const progress = Math.min((convertedYearly / convertedMilestone) * 100, 100);

              return (
                <li key={milestone} className={`milestoneItem ${achieved ? 'achieved' : ''}`}>
                  <div className="milestoneHeader">
                    <span>
                      {symbol}
                      {convertedMilestone.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    {achieved ? (
                      <span className="milestoneStatus"> Achieved </span>
                    ) : (
                      <span className="milestoneStatus">{progress.toFixed(0)}%</span>
                    )}
                  </div>
                  {!achieved && (
                    <div className="milestoneProgressBar">
                      <div className="milestoneProgress" style={{ width: `${progress}%` }}></div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <Copyright />
      </div>

      <AddIncomeModal isOpen={modalOpen} onClose={closeModal} onAddIncome={addIncome} />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemDescription={`"${deleteTarget?.source}" on ${deleteTarget?.date}`}
      />
    </>
  );
};

export default Income;
