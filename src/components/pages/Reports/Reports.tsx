import React, { useEffect, useState } from 'react';
import UserCard from '@/components/organisms/UserCard/UserCard';
import '../Dashboard/Dashboard.css';
import { PiggyBank, Wallet, Activity } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { User } from '@organisms/UserCard/IUserCard';
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
import Icon from '@/components/atoms/Icon/Icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../organisms/Modal/AddIncomeModal.css';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import { useCurrency } from '@/context/CurrencyContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TransactionEntry {
  id: number;
  date: string;
  amount: number;
  description?: string;
  type: 'income' | 'expense';
  category_id: string;
  origin?: string;
}

const Reports = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [incomeData, setIncomeData] = useState<TransactionEntry[]>([]);
  const [expenseData, setExpenseData] = useState<TransactionEntry[]>([]);
  const router = useRouter();
  const [, setExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [animateExportOut, setAnimateExportOut] = useState(false);
  const { rate, symbol } = useCurrency();

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (!session) {
      //console.error('No user session found.');
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const query = `
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

    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables: { id } }),
        });

        const result = await response.json();

        if (result.errors) {
          //console.error('GraphQL errors:', result.errors);
          setLoading(false);
          return;
        }

        const { getUser, getTransactions } = result.data;
        setUser(getUser);

        // Separate income and expenses from GraphQL data
        const backendIncome = getTransactions.filter(
          (tx: TransactionEntry) => tx.type === 'income',
        );
        const backendExpenses = getTransactions.filter(
          (tx: TransactionEntry) => tx.type === 'expense',
        );

        // Parse mock bank income from sessionStorage
        const mockIncomeRaw = sessionStorage.getItem('bank_income');
        const mockIncome: TransactionEntry[] = mockIncomeRaw
          ? JSON.parse(mockIncomeRaw)
              .map((tx: TransactionEntry, index: number) => {
                const parsedAmount = Number(tx.amount);
                const parsedDate = new Date(tx.date);
                if (isNaN(parsedAmount) || isNaN(parsedDate.getTime())) return null;

                return {
                  id: tx.id ?? -(index + 1),
                  date: tx.date,
                  amount: parsedAmount,
                  description: tx.description || 'Bank Income',
                  type: 'income',
                  category_id: tx.category_id || 'bank',
                  origin: 'mock-bank',
                };
              })
              .filter(Boolean)
          : [];

        // Parse mock bank expenses from sessionStorage
        const mockExpensesRaw = sessionStorage.getItem('bank_expense');
        const mockExpenses: TransactionEntry[] = mockExpensesRaw
          ? JSON.parse(mockExpensesRaw)
              .map((tx: TransactionEntry, index: number) => {
                const parsedAmount = Number(tx.amount);
                const parsedDate = new Date(tx.date);
                if (isNaN(parsedAmount) || isNaN(parsedDate.getTime())) return null;

                return {
                  id: tx.id ?? -(index + 1),
                  date: tx.date,
                  amount: parsedAmount,
                  description: tx.description || 'Bank Expense',
                  type: 'expense',
                  category_id: tx.category_id || 'bank',
                  origin: 'mock-bank',
                };
              })
              .filter(Boolean)
          : [];

        // Combine backend and mock data
        const combinedIncome = [...backendIncome, ...mockIncome];
        const combinedExpenses = [...backendExpenses, ...mockExpenses];

        // Sort by date descending
        combinedIncome.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        combinedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setIncomeData(combinedIncome);
        setExpenseData(combinedExpenses);
      } catch {
        //console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const rawIncome = incomeData.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const rawExpenses = expenseData.reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalIncome = rawIncome * rate;
  const totalExpenses = rawExpenses * rate;
  const netBalance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) =>
    `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const groupByMonth = (data: TransactionEntry[]) => {
    return data.reduce<Record<string, number>>((acc, tx) => {
      const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(tx.amount) * rate;
      return acc;
    }, {});
  };

  const incomeByMonth = groupByMonth(incomeData);
  const expensesByMonth = groupByMonth(expenseData);

  const allMonths = Array.from(
    new Set([...Object.keys(incomeByMonth), ...Object.keys(expensesByMonth)]),
  );

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

  allMonths.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

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

  const monthlySummary = allMonths
    .map((month) => {
      const income = incomeByMonth[month] || 0;
      const expenses = expensesByMonth[month] || 0;
      return {
        month,
        income,
        expenses,
        net: income - expenses,
      };
    })
    .reverse();

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

  const handleExport = async (type: 'income' | 'expenses' | 'both', format: 'csv' | 'pdf') => {
    setExportLoading(true);
    try {
      if (type === 'income') {
        if (format === 'csv') exportIncomeCSV();
        else exportIncomePDF();
      } else if (type === 'expenses') {
        if (format === 'csv') exportExpensesCSV();
        else exportExpensesPDF();
      } else if (type === 'both') {
        if (format === 'csv') exportBothCSV();
        else exportBothPDF();
      }
    } finally {
      setExportLoading(false);
    }
  };

  function exportIncomeCSV() {
    if (!incomeData.length) {
      toast.error('No income data to export!');
      return;
    }

    const header = ['Date', 'Source', 'Amount'];
    const rows = incomeData.map(({ date, description, amount }) => [
      date,
      description || '',
      Number(amount).toFixed(2),
    ]);
    const csvContent = [header, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, 'income.csv');
    toast.success('Income CSV exported!');
  }

  function exportExpensesCSV() {
    if (!expenseData.length) {
      toast.error('No expenses data to export!');
      return;
    }

    const header = ['Date', 'Category ID', 'Amount'];
    const rows = expenseData.map(({ date, category_id, amount }) => [
      date,
      category_id || '',
      Number(amount).toFixed(2),
    ]);
    const csvContent = [header, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, 'expenses.csv');
    toast.success('Expenses CSV exported!');
  }

  function exportBothCSV() {
    if (!incomeData.length && !expenseData.length) {
      toast.error('No data to export!');
      return;
    }

    const header = ['Type', 'Date', 'Description', 'Amount'];
    const incomeRows = incomeData.map(({ date, description, amount }) => [
      'Income',
      date,
      description || '',
      Number(amount).toFixed(2),
    ]);
    const expenseRows = expenseData.map(({ date, category_id, amount }) => [
      'Expense',
      date,
      category_id || '',
      `$${Number(amount).toFixed(2)}`,
    ]);
    const csvContent = [header, ...incomeRows, ...expenseRows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, 'all-transactions.csv');
    toast.success('All data CSV exported!');
  }

  function exportIncomePDF() {
    if (!incomeData.length) {
      toast.error('No income data to export!');
      return;
    }
    const doc = new jsPDF();
    doc.text('Income Transactions', 14, 20);
    const headers = [['Date', 'Description', 'Amount']];
    const data = incomeData.map(({ date, description, amount }) => [
      date,
      description || '',
      `$${Number(amount).toFixed(2)}`,
    ]);
    autoTable(doc, {
      startY: 30,
      head: headers,
      body: data,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [108, 99, 255] },
    });
    doc.save('income.pdf');
    toast.success('Income PDF exported!');
  }

  function exportExpensesPDF() {
    if (!expenseData.length) {
      toast.error('No expenses data to export!');
      return;
    }
    const doc = new jsPDF();
    doc.text('Expenses Report', 14, 20);
    const headers = [['Date', 'Category ID', 'Amount']];
    const data = expenseData.map(({ date, category_id, amount }) => [
      date,
      category_id || 'N/A',
      `$${Number(amount).toFixed(2)}`,
    ]);
    autoTable(doc, {
      startY: 30,
      head: headers,
      body: data,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [165, 180, 252] },
    });
    doc.save('expenses.pdf');
    toast.success('Expenses PDF exported!');
  }

  function exportBothPDF() {
    if (!incomeData.length && !expenseData.length) {
      toast.error('No data to export!');
      return;
    }
    const doc = new jsPDF();
    doc.text('All Transactions', 14, 20);
    const headers = [['Type', 'Date', 'Description', 'Amount']];
    const incomeRows = incomeData.map(({ date, description, amount }) => [
      'Income',
      date,
      description || '',
      `$${Number(amount).toFixed(2)}`,
    ]);
    const expenseRows = expenseData.map(({ date, category_id, amount }) => [
      'Expense',
      date,
      category_id || '',
      `$${Number(amount).toFixed(2)}`,
    ]);
    autoTable(doc, {
      startY: 30,
      head: headers,
      body: [...incomeRows, ...expenseRows],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [108, 99, 255] },
    });
    doc.save('all-transactions.pdf');
    toast.success('All data PDF exported!');
  }

  // Open modal
  const openExportModal = () => {
    setShowExportModal(true);
    setAnimateExportOut(false);
    setExportModalOpen(true);
  };
  // Close modal with animation
  const closeExportModal = () => {
    setAnimateExportOut(true);
    setTimeout(() => {
      setShowExportModal(false);
      setExportModalOpen(false);
    }, 350);
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <>
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/profile')}>
        <UserCard name={user?.name || 'User'} />
      </div>
      <div className="mainContent">
        <h1 className="header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          Reports
          <button
            className="cardAddBtn add-expand-btn"
            onClick={openExportModal}
            aria-label="Export Data"
          >
            <Icon name="Download" size={18} />
            <span className="add-btn-text">Export Data</span>
          </button>
        </h1>
        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon">
              <PiggyBank />
            </span>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="card">
            <span className="cardIcon">
              <Wallet />
            </span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">{formatCurrency(totalExpenses)}</span>
          </div>
          <div className="card">
            <span className="cardIcon">
              <Activity />
            </span>
            <span className="cardTitle">Net Balance</span>
            <span className="cardValue">{formatCurrency(netBalance)}</span>
          </div>
        </div>
        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Income vs Expenses</h2>
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
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#22c55e',
                      fontWeight: 600,
                    }}
                  >
                    +${formatCurrency(entry.income)}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    -${formatCurrency(entry.expenses)}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '10px 0',
                      color: '#471d8b',
                      fontWeight: 700,
                    }}
                  >
                    {entry.net >= 0
                      ? `+${formatCurrency(entry.net)}`
                      : `-${formatCurrency(Math.abs(entry.net))}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showExportModal && (
          <div
            className={`modal-overlay${animateExportOut ? ' modal-overlay-exit' : ' modal-overlay-enter'}`}
            onClick={closeExportModal}
          >
            <div
              className={`modal-card${animateExportOut ? ' modal-card-exit' : ' modal-card-enter'}`}
              onClick={(e) => e.stopPropagation()}
              style={{ minWidth: 340 }}
            >
              <button
                className="modal-close-btn"
                aria-label="Close modal"
                type="button"
                onClick={closeExportModal}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6L16 16M16 6L6 16"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <h2 className="modal-title">Export Data</h2>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#471d8b', marginBottom: 6 }}>Income</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      className="export-btn-slim"
                      disabled={exportLoading}
                      onClick={() => handleExport('income', 'csv')}
                    >
                      <Icon name="FileSpreadsheet" size={18} /> Export CSV
                    </button>
                    <button
                      className="export-btn-slim"
                      disabled={exportLoading}
                      onClick={() => handleExport('income', 'pdf')}
                    >
                      <Icon name="FileSignature" size={18} /> Export PDF
                    </button>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#471d8b', marginBottom: 6 }}>Expenses</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      className="export-btn-slim"
                      disabled={exportLoading}
                      onClick={() => handleExport('expenses', 'csv')}
                    >
                      <Icon name="FileSpreadsheet" size={18} /> Export CSV
                    </button>
                    <button
                      className="export-btn-slim"
                      disabled={exportLoading}
                      onClick={() => handleExport('expenses', 'pdf')}
                    >
                      <Icon name="FileSignature" size={18} /> Export PDF
                    </button>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#471d8b', marginBottom: 6 }}>Both</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      className="export-btn-slim"
                      disabled={exportLoading}
                      onClick={() => handleExport('both', 'csv')}
                    >
                      <Icon name="FileSpreadsheet" size={18} /> Export CSV
                    </button>
                    <button
                      className="export-btn-slim"
                      disabled={exportLoading}
                      onClick={() => handleExport('both', 'pdf')}
                    >
                      <Icon name="FileSignature" size={18} /> Export PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Copyright />
      </div>
    </>
  );
};

export default Reports;
