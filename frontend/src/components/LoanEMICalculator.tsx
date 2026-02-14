import React, { useState, useMemo } from "react";
import { useTheme } from "../ThemeContext";

const LoanEMICalculator: React.FC = () => {
  const { theme } = useTheme();
  const [loan, setLoan] = useState<number>(500000);
  const [rate, setRate] = useState<number>(8.5);
  const [months, setMonths] = useState<number>(60);

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;

    const emiValue =
      (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPay = emiValue * months;
    const totalInt = totalPay - loan;

    return {
      emi: emiValue,
      totalPayment: totalPay,
      totalInterest: totalInt,
    };
  }, [loan, rate, months]);

  return (
    <div className="max-w-xl mx-auto p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">
        Loan EMI Calculator
      </h2>

      {/* Loan Amount */}
      <div className="mb-5">
        <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">
          Loan Amount: ₹{loan.toLocaleString()}
        </label>
        <input
          type="range"
          min="10000"
          max="5000000"
          value={loan}
          onChange={(e) => setLoan(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Interest Rate */}
      <div className="mb-5">
        <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">
          Interest Rate: {rate}%
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Tenure */}
      <div className="mb-6">
        <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">
          Tenure: {months} Months
        </label>
        <input
          type="range"
          min="6"
          max="360"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-xl">
          <p className="text-slate-600 dark:text-slate-300 text-sm">Monthly EMI</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ₹{emi.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-slate-700 rounded-xl">
          <p className="text-slate-600 dark:text-slate-300 text-sm">Total Payment</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            ₹{totalPayment.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-red-50 dark:bg-slate-700 rounded-xl">
          <p className="text-slate-600 dark:text-slate-300 text-sm">Total Interest</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            ₹{totalInterest.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanEMICalculator;
