import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number; // rate relative to USD (1 USD = X of this currency)
}

export const currencies: CurrencyInfo[] = [
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", rate: 0.308 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal", rate: 3.75 },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal", rate: 3.64 },
  { code: "BHD", symbol: "د.ب", name: "Bahraini Dinar", rate: 0.376 },
  { code: "OMR", symbol: "ر.ع", name: "Omani Rial", rate: 0.385 },
  { code: "EGP", symbol: "ج.م", name: "Egyptian Pound", rate: 30.9 },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", rate: 92.5 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.1 },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyInfo>(() => {
    const saved = localStorage.getItem("currency");
    return currencies.find((c) => c.code === saved) || currencies.find((c) => c.code === "USD")!;
  });

  const setCurrencyByCode = useCallback((code: string) => {
    const found = currencies.find((c) => c.code === code);
    if (found) {
      setCurrency(found);
      localStorage.setItem("currency", code);
    }
  }, []);

  const { locale } = useLanguage();

  const formatPrice = useCallback(
    (usdPrice: number) => {
      const converted = usdPrice * currency.rate;
      const decimals = converted >= 100 ? 0 : currency.rate >= 10 ? 0 : 2;
      const formatted = converted.toFixed(decimals);
      const label = locale === "ar" ? currency.symbol : currency.code;
      return `${label} ${formatted}`;
    },
    [currency, locale]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyByCode, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
