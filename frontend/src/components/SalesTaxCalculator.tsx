import React, { useState } from 'react';
import { Calculator, Percent, DollarSign, MapPin, Building2 } from 'lucide-react';

const SalesTaxCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [state, setState] = useState<string>('MH');
  const [taxType, setTaxType] = useState<'inter' | 'intra'>('intra');
  const [taxResult, setTaxResult] = useState<{
    subtotal: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
    totalAmount: number;
    taxRate: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Indian GST Rates by State (simplified for demo)
  const stateGSTRates = {
    'MH': { name: 'Maharashtra', cgst: 9, sgst: 9, igst: 18 },
    'DL': { name: 'Delhi', cgst: 9, sgst: 9, igst: 18 },
    'KA': { name: 'Karnataka', cgst: 9, sgst: 9, igst: 18 },
    'TN': { name: 'Tamil Nadu', cgst: 9, sgst: 9, igst: 18 },
    'GJ': { name: 'Gujarat', cgst: 9, sgst: 9, igst: 18 },
    'RJ': { name: 'Rajasthan', cgst: 9, sgst: 9, igst: 18 },
    'UP': { name: 'Uttar Pradesh', cgst: 9, sgst: 9, igst: 18 },
    'WB': { name: 'West Bengal', cgst: 9, sgst: 9, igst: 18 },
    'AP': { name: 'Andhra Pradesh', cgst: 9, sgst: 9, igst: 18 },
    'TS': { name: 'Telangana', cgst: 9, sgst: 9, igst: 18 },
    'PB': { name: 'Punjab', cgst: 9, sgst: 9, igst: 18 },
    'HR': { name: 'Haryana', cgst: 9, sgst: 9, igst: 18 },
    'CT': { name: 'Chhattisgarh', cgst: 9, sgst: 9, igst: 18 },
    'MP': { name: 'Madhya Pradesh', cgst: 9, sgst: 9, igst: 18 },
    'JH': { name: 'Jharkhand', cgst: 9, sgst: 9, igst: 18 },
    'OR': { name: 'Odisha', cgst: 9, sgst: 9, igst: 18 },
    'UK': { name: 'Uttarakhand', cgst: 9, sgst: 9, igst: 18 },
    'HP': { name: 'Himachal Pradesh', cgst: 9, sgst: 9, igst: 18 },
    'AS': { name: 'Assam', cgst: 9, sgst: 9, igst: 18 },
    'BR': { name: 'Bihar', cgst: 9, sgst: 9, igst: 18 },
    'GA': { name: 'Goa', cgst: 9, sgst: 9, igst: 18 },
    'KL': { name: 'Kerala', cgst: 9, sgst: 9, igst: 18 },
    'TR': { name: 'Tripura', cgst: 9, sgst: 9, igst: 18 },
    'MN': { name: 'Manipur', cgst: 9, sgst: 9, igst: 18 },
    'ML': { name: 'Meghalaya', cgst: 9, sgst: 9, igst: 18 },
    'MZ': { name: 'Mizoram', cgst: 9, sgst: 9, igst: 18 },
    'NL': { name: 'Nagaland', cgst: 9, sgst: 9, igst: 18 },
    'SK': { name: 'Sikkim', cgst: 9, sgst: 9, igst: 18 },
    'AR': { name: 'Arunachal Pradesh', cgst: 9, sgst: 9, igst: 18 },
    'CH': { name: 'Chandigarh', cgst: 9, sgst: 9, igst: 18 },
    'DN': { name: 'Dadra & Nagar Haveli', cgst: 9, sgst: 9, igst: 18 },
    'DD': { name: 'Daman & Diu', cgst: 9, sgst: 9, igst: 18 },
    'LD': { name: 'Lakshadweep', cgst: 9, sgst: 9, igst: 18 },
    'AN': { name: 'Andaman & Nicobar', cgst: 9, sgst: 9, igst: 18 },
    'PY': { name: 'Puducherry', cgst: 9, sgst: 9, igst: 18 },
    'JK': { name: 'Jammu & Kashmir', cgst: 9, sgst: 9, igst: 18 },
    'LA': { name: 'Ladakh', cgst: 9, sgst: 9, igst: 18 }
  };

  const states = Object.keys(stateGSTRates);

  const calculateSalesTax = () => {
    const amountNum = parseFloat(amount);
    const stateData = stateGSTRates[state as keyof typeof stateGSTRates];

    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (!stateData) {
      setError('Please select a valid state.');
      return;
    }

    setError(null);

    const taxRate = taxType === 'inter' ? stateData.igst : stateData.cgst + stateData.sgst;
    const totalTax = (amountNum * taxRate) / 100;
    const totalAmount = amountNum + totalTax;

    setTaxResult({
      subtotal: amountNum,
      cgst: taxType === 'intra' ? (amountNum * stateData.cgst) / 100 : 0,
      sgst: taxType === 'intra' ? (amountNum * stateData.sgst) / 100 : 0,
      igst: taxType === 'inter' ? (amountNum * stateData.igst) / 100 : 0,
      totalTax: totalTax,
      totalAmount: totalAmount,
      taxRate: taxRate
    });
  };

  const resetCalculator = () => {
    setAmount('');
    setState('MH');
    setTaxType('intra');
    setTaxResult(null);
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
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
            <Percent size={20} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Indian Sales Tax Calculator</h2>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Premium
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Purchase Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter purchase amount"
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                min="0"
                step="0.01"
              />
            </div>

            {/* Tax Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tax Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taxType"
                    value="intra"
                    checked={taxType === 'intra'}
                    onChange={(e) => setTaxType(e.target.value as 'inter' | 'intra')}
                    className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Intra-State (CGST + SGST)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taxType"
                    value="inter"
                    checked={taxType === 'inter'}
                    onChange={(e) => setTaxType(e.target.value as 'inter' | 'intra')}
                    className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Inter-State (IGST)</span>
                </label>
              </div>
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {states.map((stateCode) => {
                  const stateData = stateGSTRates[stateCode as keyof typeof stateGSTRates];
                  return (
                    <option key={stateCode} value={stateCode}>
                      {stateCode} - {stateData.name} (CGST: {stateData.cgst}%, SGST: {stateData.sgst}%, IGST: {stateData.igst}%)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateSalesTax}
                disabled={!amount}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            {taxResult && (
              <div className="space-y-4">
                {/* Main Result */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                    <DollarSign size={20} />
                    GST Calculation Result
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-red-200 dark:border-red-700">
                      <span className="text-red-800 dark:text-red-200">Original Amount:</span>
                      <span className="font-semibold text-red-900 dark:text-red-100">{formatCurrency(taxResult.subtotal)}</span>
                    </div>
                    {taxType === 'intra' ? (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-red-200 dark:border-red-700">
                          <span className="text-red-800 dark:text-red-200">CGST ({stateGSTRates[state as keyof typeof stateGSTRates].cgst}%):</span>
                          <span className="font-semibold text-red-900 dark:text-red-100">{formatCurrency(taxResult.cgst)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-red-200 dark:border-red-700">
                          <span className="text-red-800 dark:text-red-200">SGST ({stateGSTRates[state as keyof typeof stateGSTRates].sgst}%):</span>
                          <span className="font-semibold text-red-900 dark:text-red-100">{formatCurrency(taxResult.sgst)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center py-2 border-b border-red-200 dark:border-red-700">
                        <span className="text-red-800 dark:text-red-200">IGST ({stateGSTRates[state as keyof typeof stateGSTRates].igst}%):</span>
                        <span className="font-semibold text-red-900 dark:text-red-100">{formatCurrency(taxResult.igst)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-red-800 dark:text-red-200 font-semibold">Total Amount:</span>
                      <span className="font-bold text-red-900 dark:text-red-100 text-lg">{formatCurrency(taxResult.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* GST Breakdown */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">GST Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">CGST (Central):</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(taxResult.cgst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">SGST (State):</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(taxResult.sgst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">IGST (Inter-state):</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(taxResult.igst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200 font-semibold">Total GST:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{formatCurrency(taxResult.totalTax)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                    * CGST and SGST apply to intra-state transactions. IGST applies to inter-state transactions.
                  </p>
                </div>

                {/* Quick Examples */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Quick Calculations</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[500, 1000, 5000, 10000].map((quickAmount) => {
                      const gstForAmount = (quickAmount * taxResult.taxRate) / 100;
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

            {!taxResult && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <Percent size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calculate Indian GST</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter purchase amount and select state to calculate GST for Indian transactions.
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
              <strong>Intra-State:</strong> For transactions within the same state - CGST (Central GST) + SGST (State GST) are applicable.
            </p>
            <p>
              <strong>Inter-State:</strong> For transactions between different states - IGST (Integrated GST) is applicable.
            </p>
            <p>
              <strong>Standard Rate:</strong> Most goods and services are taxed at 18% (9% CGST + 9% SGST for intra-state).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTaxCalculator;