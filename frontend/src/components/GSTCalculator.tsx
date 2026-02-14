import React, { useState } from "react";
import { useTheme } from "../ThemeContext";

type CountryTax = {
  rate: number;
  currency: string;
};

const taxRates: Record<string, CountryTax> = {
  India: { rate: 18, currency: "₹" },
  UAE: { rate: 5, currency: "د.إ" },
  Singapore: { rate: 9, currency: "S$" },
  Australia: { rate: 10, currency: "A$" },
  UK: { rate: 20, currency: "£" },
  Germany: { rate: 19, currency: "€" },
  France: { rate: 20, currency: "€" },
  Canada: { rate: 13, currency: "C$" },
};

const GlobalGSTCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [country, setCountry] = useState("India");
  const [amount, setAmount] = useState<number>(1000);
  const [search, setSearch] = useState("");

  const filteredCountries = Object.keys(taxRates).filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const { rate, currency } = taxRates[country];

  const tax = (amount * rate) / 100;
  const total = amount + tax;

  const format = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="max-w-xl mx-auto p-6 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm bg-white dark:bg-slate-800">
      <h2 className="text-xl font-bold mb-4 text-center text-slate-900 dark:text-white">
        Global GST / VAT Calculator
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2 mb-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
      />

      {/* Country */}
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2 mb-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
      >
        {filteredCountries.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-slate-700 dark:text-slate-200">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      {/* Result */}
      <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 space-y-2">
        <p className="text-slate-900 dark:text-white">Country: {country}</p>
        <p className="text-slate-900 dark:text-white">Tax Rate: {rate}%</p>
        <p className="text-slate-900 dark:text-white">
          Tax Amount: {currency}
          {format(tax)}
        </p>
        <p className="font-semibold text-lg text-slate-900 dark:text-white">
          Total Payable: {currency}
          {format(total)}
        </p>
      </div>
    </div>
  );
};

export default GlobalGSTCalculator;
