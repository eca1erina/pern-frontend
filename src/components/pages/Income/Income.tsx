import React, { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import axios from 'axios';
import { getData, deleteData } from '@/utils/api';
import { User } from '@organisms/UserCard/IUserCard';
import '../Dashboard/Dashboard.css';
import { PiggyBank, Plus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import AddIncomeModal from '@organisms/Modal/AddIncomeModal';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
interface IncomeEntry {
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

const Income = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const fetchIncomeData = async (userId: string) => {
    try {
      const incomeRes = await getData(`/transactions/income?user_id=${userId}`);

      const formattedIncome: IncomeEntry[] = incomeRes.map((tx: any) => ({
        id: tx.id,
        date: tx.date,
        source: tx.description || 'Income',
        amount: Number(tx.amount),
      }));

      formattedIncome.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setIncomeEntries(formattedIncome);
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  };

  const handleDelete = async (transactionId: number) => {
    const session = sessionStorage.getItem('user');
    if (!session) return;

    try {
      await deleteData(`/transactions/${transactionId}`);

      setIncomeEntries((prev) => prev.filter((entry) => entry.id !== transactionId));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

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
        const userRes = await getData(`/users/${id}`);
        const { name, email } = userRes;
        setUser({ name, email, avatarUrl: '' });
        await fetchIncomeData(id);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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

      await fetchIncomeData(userId);
      closeModal();
    } catch (error) {
      console.error('Failed to add income:', error);
    }
  };

  const totalIncome = incomeEntries.reduce((sum, i) => sum + i.amount, 0);

  const groupedIncome: Record<string, number> = {};
  incomeEntries.forEach((entry) => {
    const month = new Date(entry.date).toLocaleString('default', { month: 'short' });
    groupedIncome[month] = (groupedIncome[month] || 0) + entry.amount;
  });

  const months = Object.keys(groupedIncome);
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map((month) => groupedIncome[month]),
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

  return (
    <>
      <Sidebar />
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>
        <UserCard name="User" />
      </div>
      <div className="mainContent">
        <h1 className="header">Income</h1>

        <div className="overviewGrid">
          <div className="card" style={{ position: 'relative' }}>
            <span className="cardIcon">
              <PiggyBank />
            </span>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">${totalIncome.toLocaleString()}</span>
            <button className="cardAddBtn" onClick={openModal} aria-label="Add Income">
              <Plus size={18} color="#fff" />
            </button>
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
                    ${entry.amount}
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 0' }}>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      aria-label={`Delete transaction on ${entry.date}`}
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
        <Copyright />
      </div>

      <AddIncomeModal isOpen={modalOpen} onClose={closeModal} onAddIncome={addIncome} />
    </>
  );
};

export default Income;
