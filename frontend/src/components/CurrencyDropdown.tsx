import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";

const apiKey = "3b95f98519c9e410df341b32";

const topCurrencies = [
  "USD","INR","EUR","GBP","AED","SAR","AUD","CAD","JPY","CNY",
  "SGD","NZD","CHF","HKD","SEK","NOK","DKK","ZAR","RUB","BRL"
];

const CurrencyDropdown = ({ value, setValue }: any) => {
  const { theme } = useTheme();
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`)
      .then(res => res.json())
      .then(data => {
        const list = data.supported_codes.map((c: any) => c[0]);
        setCurrencies(list);
      });
  }, []);

  const filtered = currencies.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border border-slate-200 dark:border-slate-600 rounded p-2 bg-white dark:bg-slate-700">
      <input
        placeholder="Search currency..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-slate-200 dark:border-slate-600 p-1 w-full mb-2 bg-white dark:bg-slate-600 text-slate-900 dark:text-white rounded transition-colors"
      />

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border border-slate-200 dark:border-slate-600 p-2 bg-white dark:bg-slate-600 text-slate-900 dark:text-white rounded transition-colors"
      >
        <optgroup label="Top Currencies">
          {topCurrencies.map(c => (
            <option key={c}>{c}</option>
          ))}
        </optgroup>

        <optgroup label="All Currencies">
          {filtered.map(c => (
            <option key={c}>{c}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

export default CurrencyDropdown;