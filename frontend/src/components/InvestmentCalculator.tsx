import React, { useState } from "react";
import { useTheme } from "../ThemeContext";

const InvestmentCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);

  const months = investmentPeriod * 12;
  const monthlyRate = annualReturn / 12 / 100;

  const maturityValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);

  const totalInvested = monthlyInvestment * months;
  const totalReturns = maturityValue - totalInvested;

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Investment Calculator
      </h2>

      {/* Input Section */}
      <div className="space-y-6">

        <p className="text-center text-emerald-600 font-medium">
          Start SIP today → Build your future wealth
        </p>

        {/* Monthly Investment */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Monthly Investment: ₹{monthlyInvestment.toLocaleString()}
          </label>

          <div className="flex gap-2 mb-2">
            {[1000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                onClick={() => setMonthlyInvestment(amt)}
                className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="500"
            max="100000"
            step="500"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Expected Return */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Expected Return: {annualReturn}%
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="0.1"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Investment Period */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Investment Period: {investmentPeriod} Years
          </label>
          <input
            type="range"
            min="1"
            max="40"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 bg-emerald-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-emerald-800">
          Investment Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">You Invest</p>
            <p className="text-xl font-bold">
              {formatCurrency(totalInvested)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">You Earn</p>
            <p className="text-xl font-bold text-emerald-600">
              {formatCurrency(totalReturns)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Final Value</p>
            <p className="text-xl font-bold text-emerald-700">
              {formatCurrency(maturityValue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
