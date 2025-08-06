'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CurrencyContextValue {
  currency: string;
  rate: number;
  symbol: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  rate: 1,
  symbol: '$',
  setCurrency: () => {},
});

const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<string>('USD');
  const [rate, setRate] = useState<number>(1);
  const [symbol, setSymbol] = useState<string>('$');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchCurrencyRate = async (target: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/exchange-rate?currency=${target}`);
      if (!res.ok) throw new Error('Failed to fetch exchange rate');
      const data = await res.json();

      setRate(data.rate);
      setSymbol(data.symbol);
      setCurrencyState(data.currency);
      sessionStorage.setItem('currency', data.currency);
    } catch {
      //console.error('Exchange rate fetch error:', err);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('currency') || 'USD';
    fetchCurrencyRate(saved);
  });

  const setCurrency = (newCurrency: string) => {
    fetchCurrencyRate(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, rate, symbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
export { CurrencyProvider };
