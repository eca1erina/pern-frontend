export interface CurrencyRate {
  currency: string;
  rate: number;
  symbol: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const fetchCurrencyRate = async (
  selectedCurrency: string
): Promise<CurrencyRate | null> => {
  try {
    const res = await fetch(`${apiUrl}/api/exchange-rate?currency=${selectedCurrency}`);
    const data = await res.json();

    if (res.ok) {
      sessionStorage.setItem("currency", data.currency);
      return {
        currency: data.currency,
        rate: data.rate,
        symbol: data.symbol,
      };
    } else {
      console.error("Error fetching currency:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch exchange rate:", err);
    return null;
  }
};
