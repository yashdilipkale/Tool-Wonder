import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { useTheme } from "../ThemeContext";

const TipCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [billAmount, setBillAmount] = useState(1000);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [people, setPeople] = useState(1);
  const [currency, setCurrency] = useState("INR");

  const currencies: any = {
    INR: "₹",
    USD: "$",
    EUR: "€"
  };

  const tip = (billAmount * tipPercentage) / 100;
  const total = billAmount + tip;
  const perPerson = total / people;

  const format = (n:number) =>
    `${currencies[currency]}${n.toLocaleString(undefined,{maximumFractionDigits:2})}`;

  /* Round off button */
  const roundBill = () => setBillAmount(Math.round(billAmount));

  const tipPercentWidth = (tip / total) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex w-16 h-16 rounded-full items-center justify-center bg-emerald-100 text-emerald-600 mb-3">
          <Calculator size={30}/>
        </div>
        <h1 className="text-3xl font-bold">Smart Tip Calculator</h1>
        <p className="text-slate-500">Split bills instantly with smart calculation</p>
      </div>

      {/* Currency Switch */}
      <div className="flex justify-end">
        <select
          value={currency}
          onChange={(e)=>setCurrency(e.target.value)}
          className="border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>
      </div>

      {/* Bill */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 space-y-3">
        <label className="font-medium text-slate-900 dark:text-white">Bill Amount</label>
        <input
          type="number"
          value={billAmount}
          onChange={(e)=>setBillAmount(Number(e.target.value))}
          className="w-full border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <button
          onClick={roundBill}
          className="text-sm text-emerald-600 font-medium"
        >
          Round off bill
        </button>
      </div>

      {/* Tip */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
        <label className="font-medium text-slate-900 dark:text-white">Tip %</label>
        <input
          type="range"
          min="0"
          max="40"
          value={tipPercentage}
          onChange={(e)=>setTipPercentage(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-slate-900 dark:text-white">{tipPercentage}%</p>
      </div>

      {/* People */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
        <label className="font-medium text-slate-900 dark:text-white">People</label>
        <input
          type="number"
          value={people}
          onChange={(e)=>setPeople(Number(e.target.value))}
          className="border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 w-32 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      {/* Ratio Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
        <p className="text-sm mb-2 text-slate-900 dark:text-white">Bill vs Tip Ratio</p>
        <div className="w-full h-5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${tipPercentWidth}%` }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-slate-700 p-5 rounded-xl text-center">
          <p className="text-sm text-slate-900 dark:text-white">Tip</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{format(tip)}</p>
        </div>

        <div className="bg-emerald-50 dark:bg-slate-700 p-5 rounded-xl text-center">
          <p className="text-sm text-slate-900 dark:text-white">Total</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{format(total)}</p>
        </div>

        <div className="bg-emerald-50 dark:bg-slate-700 p-5 rounded-xl text-center">
          <p className="text-sm text-slate-900 dark:text-white">Per Person</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{format(perPerson)}</p>
        </div>
      </div>

    </div>
  );
};

export default TipCalculator;
