import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar, Percent, Crown } from 'lucide-react';

const LoanEMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTenure, setLoanTenure] = useState<string>('');
  const [tenureUnit, setTenureUnit] = useState<'months' | 'years'>('years');
  const [emiResult, setEmiResult] = useState<{
    emi: number;
    totalAmount: number;
    totalInterest: number;
    amortization: Array<{
      month: number;
      emi: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    let tenure = parseFloat(loanTenure);

    if (!principal || !rate || !tenure || principal <= 0 || rate <= 0 || tenure <= 0) {
      setError('Please enter valid loan details.');
      return;
    }

    setError(null);

    // Convert tenure to months if it's in years
    if (tenureUnit === 'years') {
      tenure = tenure * 12;
    }

    // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    // Generate amortization schedule (first 12 months + last month)
    const amortization = [];
    let balance = principal;

    for (let month = 1; month <= Math.min(tenure, 13); month++) {
      const interestPayment = balance * rate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      if (month <= 12 || month === tenure) {
        amortization.push({
          month,
          emi: Math.round(emi),
          principal: Math.round(principalPayment),
          interest: Math.round(interestPayment),
          balance: Math.max(0, Math.round(balance))
        });
      }
    }

    // Add a note if tenure > 12 months
    if (tenure > 12) {
      amortization.splice(12, 0, { month: 13, emi: 0, principal: 0, interest: 0, balance: 0 });
    }

    setEmiResult({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      amortization
    });
  };

  const resetCalculator = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTenure('');
    setTenureUnit('years');
    setEmiResult(null);
    setError(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Calculator size={20} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Loan EMI Calculator</h2>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full shadow-lg">
              <Crown size={12} />
              Premium
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
                step="1000"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
                max="50"
                step="0.1"
              />
            </div>

            {/* Loan Tenure */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tenure
                </label>
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  placeholder="Enter tenure"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                  max={tenureUnit === 'years' ? 30 : 360}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Unit
                </label>
                <select
                  value={tenureUnit}
                  onChange={(e) => setTenureUnit(e.target.value as 'months' | 'years')}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateEMI}
                disabled={!loanAmount || !interestRate || !loanTenure}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator size={16} />
                Calculate EMI
              </button>

              <button
                onClick={resetCalculator}
                className="px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Reset
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {emiResult && (
              <div className="space-y-4">
                {/* EMI Result */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {formatCurrency(emiResult.emi)}
                  </div>
                  <div className="text-lg text-indigo-800 dark:text-indigo-200 mb-4">Monthly EMI</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-indigo-900 dark:text-indigo-100">
                        {formatCurrency(emiResult.totalAmount)}
                      </div>
                      <div className="text-indigo-700 dark:text-indigo-300">Total Amount</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(emiResult.totalInterest)}
                      </div>
                      <div className="text-indigo-700 dark:text-indigo-300">Total Interest</div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Loan Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Principal Amount:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(parseFloat(loanAmount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Interest Rate:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{interestRate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Tenure:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {loanTenure} {tenureUnit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amortization Table Preview */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Amortization Schedule (Preview)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-green-200 dark:border-green-700">
                          <th className="text-left py-2 text-green-800 dark:text-green-200">Month</th>
                          <th className="text-right py-2 text-green-800 dark:text-green-200">EMI</th>
                          <th className="text-right py-2 text-green-800 dark:text-green-200">Principal</th>
                          <th className="text-right py-2 text-green-800 dark:text-green-200">Interest</th>
                          <th className="text-right py-2 text-green-800 dark:text-green-200">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emiResult.amortization.slice(0, 12).map((row, index) => (
                          <tr key={index} className="border-b border-green-100 dark:border-green-800">
                            <td className="py-1 text-green-900 dark:text-green-100">{row.month}</td>
                            <td className="py-1 text-right text-green-900 dark:text-green-100">{formatCurrency(row.emi)}</td>
                            <td className="py-1 text-right text-green-900 dark:text-green-100">{formatCurrency(row.principal)}</td>
                            <td className="py-1 text-right text-green-900 dark:text-green-100">{formatCurrency(row.interest)}</td>
                            <td className="py-1 text-right text-green-900 dark:text-green-100">{formatCurrency(row.balance)}</td>
                          </tr>
                        ))}
                        {parseFloat(loanTenure) * (tenureUnit === 'years' ? 12 : 1) > 12 && (
                          <tr>
                            <td colSpan={5} className="py-2 text-center text-green-700 dark:text-green-300 italic">
                              ... {Math.max(0, parseFloat(loanTenure) * (tenureUnit === 'years' ? 12 : 1) - 12)} more months
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {!emiResult && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calculate Loan EMI</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter loan amount, interest rate, and tenure to calculate your Equated Monthly Installment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Financial Disclaimer</h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            This calculator provides estimates based on the information you provide. Actual loan terms may vary based on lender policies,
            credit score, and other factors. Please consult with financial institutions for accurate loan calculations and terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanEMICalculator;
