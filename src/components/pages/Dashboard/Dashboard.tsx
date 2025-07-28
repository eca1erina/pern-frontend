'use client';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import React from 'react';
import { PiggyBank, Wallet, Activity } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import UserCard from '@/components/organisms/UserCard/UserCard';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import { User } from '@organisms/UserCard/IUserCard';
import { getData } from '@/utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Copyright from '@/components/atoms/Copyright/Copyright';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Spline from '@splinetool/react-spline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface TransactionEntry {
  id: number;
  date: string;
  amount: number;
  description?: string;
  type: "income" | "expense";
  category?: string;
  source?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [incomeData, setIncomeData] = useState<TransactionEntry[]>([]);
  const [expenseData, setExpenseData] = useState<TransactionEntry[]>([]);
  const [isBankConnected, setIsBankConnected] = useState<boolean>(false);

  const router = useRouter();
  const [currency, setCurrency] = useState<string>('USD');
const [rate, setRate] = useState<number>(1);
const [symbol, setSymbol] = useState<string>('$');

const fetchCurrencyRate = async (selectedCurrency: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/exchange-rate?currency=${selectedCurrency}`);
    const data = await res.json();

    if (res.ok) {
      setCurrency(data.currency);
      setRate(data.rate);
      setSymbol(data.symbol);
      sessionStorage.setItem("currency", data.currency);
    } else {
      console.error("Error fetching currency:", data.message);
    }
  } catch (err) {
    console.error("Failed to fetch exchange rate:", err);
  }
};


  useEffect(() => {
    const session = sessionStorage.getItem("user");
    if (!session) {
      console.error("No user session found.");
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(session);
    const savedCurrency = sessionStorage.getItem("currency") || "USD";
fetchCurrencyRate(savedCurrency);


    const fetchUserData = async () => {
      try {
        const userRes = await getData<{ name: string; email: string }>(`/users/${id}`);
        if (userRes) {
          setUser({ name: userRes.name, email: userRes.email, avatarUrl: "" });
        }

        const transactionsRes = await getData<TransactionEntry[]>(`/transactions?user_id=${id}`);
        const backendIncome = transactionsRes.filter((tx) => tx.type === "income");
        const backendExpense = transactionsRes.filter((tx) => tx.type === "expense");

        const bankIncome = JSON.parse(sessionStorage.getItem("bank_income") || "[]");
        const bankExpense = JSON.parse(sessionStorage.getItem("bank_expense") || "[]");

        if (bankIncome.length > 0 || bankExpense.length > 0) {
          setIsBankConnected(true);
        }

        setIncomeData([...backendIncome, ...bankIncome]);
        setExpenseData([...backendExpense, ...bankExpense]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Convert totals with rate
  const totalIncome = incomeData.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = expenseData.reduce((sum, tx) => sum + Number(tx.amount), 0);

  const convertedIncome = totalIncome * rate;
  const convertedExpenses = totalExpenses * rate;

  const groupByMonth = (data: TransactionEntry[]) => {
    return data.reduce<Record<string, number>>((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + Number(tx.amount);
      return acc;
    }, {});
  };

  const incomeByMonth = groupByMonth(incomeData);
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months = monthOrder.filter((month) => month in incomeByMonth);

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((m) => (incomeByMonth[m] || 0) * rate),
        borderColor: "#6c63ff",
        backgroundColor: "rgba(108,99,255,0.10)",
        tension: 0.45,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#6c63ff",
        pointBorderColor: "#fff",
        borderWidth: 3,
        pointBorderWidth: 2,
        pointStyle: "circle",
      },
    ],
  };

  const groupByCategory = (data: TransactionEntry[]) => {
    return data.reduce<Record<string, number>>((acc, tx) => {
      const rawCategory = tx.category?.trim();
      const rawDescription = tx.description?.trim();
      const category =
        rawCategory && rawCategory.length > 0
          ? rawCategory
          : rawDescription && rawDescription.length > 0
          ? rawDescription
          : "Other";
      acc[category] = (acc[category] || 0) + Number(tx.amount);
      return acc;
    }, {});
  };

  const expensesByCategory = groupByCategory(expenseData);
  const sortedCategories = Object.keys(expensesByCategory).sort((a, b) => a.localeCompare(b));

  const barData = {
    labels: sortedCategories,
    datasets: [
      {
        label: "Expenses",
        data: sortedCategories.map((c) => (expensesByCategory[c] || 0) * rate),
        backgroundColor: "#a5b4fc",
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { left: 0, right: 0, top: 10, bottom: 10 },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#3b277a",
        bodyColor: "#3b277a",
        borderColor: "#ede9fe",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            // Add currency symbol with tooltip amounts
            return `${symbol}${context.parsed.y.toLocaleString(undefined, {
  minimumFractionDigits: 2,
})}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#a3a3a3",
          font: { size: 14, weight: "bold" as const },
          padding: 8,
        },
      },
      y: {
        grid: { color: "#ede9fe", lineWidth: 1 },
        border: { display: false },
        ticks: {
          color: "#a3a3a3",
          font: { size: 13 },
          padding: 8,
          callback: function (tickValue: string | number) {
            if (typeof tickValue === "number" && tickValue >= 1000) return tickValue / 1000 + "k";
            return tickValue;
          },
        },
      },
    },
  };

  const handleConnectBank = async () => {
    const session = sessionStorage.getItem("user");
    if (!session) {
      alert("Please login to connect your bank.");
      return;
    }

    const { id: userId } = JSON.parse(session);

    try {
      const res = await fetch(`${apiUrl}/api/bank/mockbank?user_id=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch bank data");

      const { transactions } = await res.json();

      const income = transactions
        .filter((tx: TransactionEntry) => tx.type === "income")
        .map((tx: TransactionEntry) => ({
          ...tx,
          source: "mock-bank",
        }));

      const expense = transactions
        .filter((tx: TransactionEntry) => tx.type === "expense")
        .map((tx: any) => ({ ...tx, source: "mock-bank" }));

      sessionStorage.setItem("bank_income", JSON.stringify(income));
      sessionStorage.setItem("bank_expense", JSON.stringify(expense));

      setIsBankConnected(true);

      setIncomeData((prev) => [...prev, ...income]);
      setExpenseData((prev) => [...prev, ...expense]);
      window.dispatchEvent(new CustomEvent("bankDataChanged"));
      toast("Bank account connected and transactions loaded!");
    } catch (err) {
      console.error(err);
      toast("Failed to connect bank account.");
    }
  };

  const handleDisconnectBank = () => {
    sessionStorage.removeItem("bank_income");
    sessionStorage.removeItem("bank_expense");

    setIncomeData((prev) => prev.filter((tx) => tx.source !== "mock-bank"));
    setExpenseData((prev) => prev.filter((tx) => tx.source !== "mock-bank"));

    setIsBankConnected(false);

    toast("Bank account disconnected and transactions removed.");
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <>
      <Sidebar />
      <div style={{ cursor: "pointer" }} onClick={() => router.push("/profile")}>
        <UserCard name={user?.name || "User"} />
      </div>
      <div className="mainContent">
        <h1 className="header">Dashboard</h1>

        <div className="overviewGrid">
          <div className="card">
            <span className="cardIcon">
              <PiggyBank />
            </span>
            <span className="cardTitle">Total Income</span>
            <span className="cardValue">
              {symbol}{convertedIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="card">
            <span className="cardIcon">
              <Wallet />
            </span>
            <span className="cardTitle">Total Expenses</span>
            <span className="cardValue">
              {symbol}{convertedExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div
            style={{
              minWidth: 380,
              width: 410,
              height: 220,
              borderRadius: 24,
              overflow: "hidden",
              background: "transparent",
              boxShadow: "0 2px 8px rgba(123, 108, 255, 0.10)",
            }}
          >
            {!isBankConnected ? (
              <button
                onClick={handleConnectBank}
                style={{
                  padding: "10px 16px",
                  background: "#6c63ff",
                  width: "100%",
                  color: "#fff",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Connect Bank Account
              </button>
            ) : (
              <button
                onClick={handleDisconnectBank}
                style={{
                  padding: "10px 16px",
                  background: "#ef4444",
                  color: "#fff",
                  width: "100%",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Disconnect Bank Account
              </button>
            )}
            <Spline scene="https://prod.spline.design/XkyTLSM4UShB7kNW/scene.splinecode" />
          </div>
        </div>

        <div className="chartContainer">
          <div className="chartHeader">
            <h2>Total Income</h2>
          </div>
          <div style={{ width: "100%", height: 340 }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        <div className="tableContainer">
          <div className="chartHeader">
            <h2>Recent Expenses</h2>
          </div>
          <div style={{ width: "100%", height: 220, margin: "0 auto" }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <Copyright />
      </div>
    </>
  );
};

export default Dashboard;
