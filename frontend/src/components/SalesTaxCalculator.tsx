import React, { useState } from "react";
import taxRates from "../data/taxRates.json";
import { useTheme } from "../ThemeContext";

const SalesTaxCalculator: React.FC = () => {
  const { theme } = useTheme();
  const countries = Object.keys(taxRates);

  const [country, setCountry] = useState(countries[0]);
  const [region, setRegion] = useState(
    Object.keys(taxRates[countries[0]])[0]
  );
  const [amount, setAmount] = useState(1000);

  const regions = Object.keys(taxRates[country]);
  const rate = taxRates[country][region];

  const tax = (amount * rate) / 100;
  const total = amount + tax;

  const handleCountryChange = (c: string) => {
    setCountry(c);
    setRegion(Object.keys(taxRates[c])[0]);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
        Sales Tax Calculator
      </h2>

      {/* Amount */}
      <div className="mb-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Amount</label>
        <input
          type="number"
          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      {/* Country */}
      <div className="mb-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Country</label>
        <select
          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Region */}
      <div className="mb-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Region / Tax Type</label>
        <select
          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Result */}
      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl mt-5 space-y-2">
        <p className="text-slate-900 dark:text-white">Tax Rate: <b>{rate}%</b></p>
        <p className="text-slate-900 dark:text-white">Tax Amount: <b>{tax.toFixed(2)}</b></p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          Total: {total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default SalesTaxCalculator;
