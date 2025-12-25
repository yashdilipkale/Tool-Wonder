import React, { useState } from 'react';
import { Calculator, Percent, DollarSign } from 'lucide-react';

const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [gstRate, setGstRate] = useState<string>('18');
  const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [gstResult, setGstResult] = useState<{
    originalAmount: number;
    gstAmount: number;
    totalAmount: number;
    breakdown: {
      cgst: number;
      sgst: number;
      igst: number;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gstRates = [
    { value: '0', label: '0% - Exempted items' },
    { value: '5', label: '5% - Essential goods' },
    { value: '12', label: '12% - Processed foods' },
    { value: '18', label: '18% - Standard rate' },
    { value: '28', label: '28% - Luxury items' },
  ];

  const calculateGST = () => {
    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(gstRate);

    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (!rateNum || rateNum < 0 || rateNum > 100) {
      setError('Please enter a valid GST rate (0-100%).');
      return;
    }

    setError(null);

    let gstAmount: number;
    let originalAmount: number;
    let totalAmount: number;

    if (calculationType === 'exclusive') {
      // Amount is without GST, calculate GST and total
      originalAmount = amountNum;
      gstAmount = (amountNum * rateNum) / 100;
      totalAmount = amountNum + gstAmount;
    } else {
      // Amount includes GST, calculate GST and original amount
      totalAmount = amountNum;
      gstAmount = (amountNum * rateNum) / (100 + rateNum);
      originalAmount = amountNum - gstAmount;
    }

    // For intra-state transactions (CGST + SGST = GST/2 each)
    // For inter-state transactions (IGST = GST)
    const halfGst = gstAmount / 2;

    setGstResult({
      originalAmount: Math.round(originalAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      breakdown: {
        cgst: Math.round(halfGst * 100) / 100,
        sgst: Math.round(halfGst * 100) / 100,
        igst: Math.round(gstAmount * 100) / 100,
      }
    });
  };

  const resetCalculator = () => {
    setAmount('');
    setGstRate('18');
    setCalculationType('exclusive');
    setGstResult(null);
    setError(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
            <Percent size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">GST Calculator</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
                step="0.01"
              />
            </div>

            {/* Calculation Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Calculation Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculationType"
                    value="exclusive"
                    checked={calculationType === 'exclusive'}
                    onChange={(e) => setCalculationType(e.target.value as 'exclusive')}
                    className="w-4 h-4 text-orange-600 bg-slate-100 border-slate-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Exclusive of GST</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calculationType"
                    value="inclusive"
                    checked={calculationType === 'inclusive'}
                    onChange={(e) => setCalculationType(e.target.value as 'inclusive')}
                    className="w-4 h-4 text-orange-600 bg-slate-100 border-slate-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Inclusive of GST</span>
                </label>
              </div>
            </div>

            {/* GST Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                GST Rate (%)
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {gstRates.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateGST}
                disabled={!amount}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator size={16} />
                Calculate GST
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
            {gstResult && (
              <div className="space-y-4">
                {/* Main Result */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">
                    GST Calculation Result
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-orange-200 dark:border-orange-700">
                      <span className="text-orange-800 dark:text-orange-200">Original Amount:</span>
                      <span className="font-bold text-orange-900 dark:text-orange-100">{formatCurrency(gstResult.originalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200 dark:border-orange-700">
                      <span className="text-orange-800 dark:text-orange-200">GST Amount ({gstRate}%):</span>
                      <span className="font-bold text-orange-900 dark:text-orange-100">{formatCurrency(gstResult.gstAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-orange-800 dark:text-orange-200 font-semibold">Total Amount:</span>
                      <span className="font-bold text-orange-900 dark:text-orange-100 text-lg">{formatCurrency(gstResult.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* GST Breakdown */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">GST Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">CGST (Intra-state):</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(gstResult.breakdown.cgst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">SGST (Intra-state):</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(gstResult.breakdown.sgst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">IGST (Inter-state):</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(gstResult.breakdown.igst)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                    * CGST and SGST apply to intra-state transactions. IGST applies to inter-state transactions.
                  </p>
                </div>

                {/* Quick Calculations */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Quick Calculations</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[500, 1000, 5000, 10000].map((quickAmount) => {
                      const gstForAmount = (quickAmount * parseFloat(gstRate)) / 100;
                      const totalForAmount = quickAmount + gstForAmount;
                      return (
                        <div key={quickAmount} className="text-center p-2 bg-white dark:bg-slate-700 rounded">
                          <div className="font-semibold text-green-900 dark:text-green-100">
                            {formatCurrency(quickAmount)}
                          </div>
                          <div className="text-green-700 dark:text-green-300">
                            Total: {formatCurrency(totalForAmount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {!gstResult && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <Percent size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calculate GST</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter amount and GST rate to calculate Goods and Services Tax for Indian transactions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">GST Information</h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              <strong>GST (Goods and Services Tax)</strong> is a comprehensive indirect tax levied on the supply of goods and services in India.
            </p>
            <p>
              <strong>Current GST rates in India:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>0% - Exempted items (salt, jaggery, etc.)</li>
              <li>5% - Essential goods (sugar, tea, coffee, etc.)</li>
              <li>12% - Processed foods, computers, etc.</li>
              <li>18% - Standard rate for most goods and services</li>
              <li>28% - Luxury items (cars, cigarettes, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTCalculator;
