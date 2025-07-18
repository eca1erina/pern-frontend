import React, { useEffect, useState } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';
import '../Dashboard/Dashboard.css';
import { PiggyBank, Wallet, Activity } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { User } from '@organisms/UserCard/IUserCard';
import Copyright from '@/components/atoms/Copyright/Copyright';
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
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TransactionEntry {
  id: number;
  date: string;
  amount: number;
  description?: string;
  type: 'income' | 'expense';
}

const Reports = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [incomeData, setIncomeData] = useState<TransactionEntry[]>([]);
  const [expenseData, setExpenseData] = useState<TransactionEntry[]>([]);
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

    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await axios.get(`${apiUrl}/users/${id}`);
        const { name, email } = userRes.data;
        setUser({ name, email, avatarUrl: '' });

        // Fetch income and expenses
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`${apiUrl}/transactions/income?user_id=${id}`),
          axios.get(`${apiUrl}/transactions/expenses?user_id=${id}`),
        ]);

        setIncomeData(incomeRes.data);
        setExpenseData(expenseRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = expenseData.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  // Helper to group by month (MMM format)
  const groupByMonth = (data: TransactionEntry[]) => {
    return data.reduce<Record<string, number>>((acc, tx) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(tx.amount);
      return acc;
    }, {});
  };

  const incomeByMonth = groupByMonth(incomeData);
  const expensesByMonth = groupByMonth(expenseData);

  // Get all months from both income and expenses
  const allMonths = Array.from(
    new Set([...Object.keys(incomeByMonth), ...Object.keys(expensesByMonth)])
  );

  // Sort months by order in year (Jan - Dec)
  const monthOrder = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  allMonths.sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );

  // Prepare bar chart data
  const barData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Income',
        data: allMonths.map((m) => incomeByMonth[m] || 0),
        backgroundColor: '#6c63ff',
        borderRadius: 8,
        maxBarThickness: 32,
      },
      {
        label: 'Expenses',
        data: allMonths.map((m) => expensesByMonth[m] || 0),
        backgroundColor: '#a5b4fc',
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  };

  // Monthly summary for table: show income, expenses, net by month
  const monthlySummary = allMonths.map((month) => {
    const income = incomeByMonth[month] || 0;
    const expenses = expensesByMonth[month] || 0;
    return {
      month,
      income,
      expenses,
      net: income - expenses,
    };
  }).reverse(); // Reverse to show recent months first

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

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

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
        <UserCard name={user?.name || 'User'} />
      </div>
      <div className="mainContent">
        <h1 className="header">Reports</h1>
        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon"><PiggyBank /></span>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">${totalIncome.toLocaleString()}</span>
          </div>
          <div className="card">
            <span className="cardIcon"><Wallet /></span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="card">
            <span className="cardIcon"><Activity /></span>
            <span className="cardTitle">Net Balance</span>
            <span className="cardValue">${netBalance.toLocaleString()}</span>
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
              {monthlySummary.map((entry, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ede9fe' }}>
                  <td style={{ padding: '10px 0' }}>{entry.month}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', color: '#22c55e', fontWeight: 600 }}>
                    ${entry.income.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 0', color: '#ef4444', fontWeight: 600 }}>
                    -${entry.expenses.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 0', color: '#471d8b', fontWeight: 700 }}>
                    ${entry.net.toLocaleString()}
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
