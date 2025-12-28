import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Users, Receipt } from 'lucide-react';

const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<number>(100);
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [results, setResults] = useState<{
    tipAmount: number;
    totalAmount: number;
    perPersonAmount: number;
    perPersonTip: number;
  } | null>(null);

  const calculateTip = () => {
    const tipAmount = (billAmount * tipPercentage) / 100;
    const totalAmount = billAmount + tipAmount;
    const perPersonAmount = totalAmount / numberOfPeople;
    const perPersonTip = tipAmount / numberOfPeople;

    setResults({
      tipAmount,
      totalAmount,
      perPersonAmount,
      perPersonTip
    });
  };

  useEffect(() => {
    calculateTip();
  }, [billAmount, tipPercentage, numberOfPeople]);

  const tipPresets = [10, 15, 20, 25];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
          <Calculator size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Tip Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Calculate tips and split bills with ease</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bill Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Bill Amount (₹)
          </label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="0"
            step="0.01"
            placeholder="Enter bill amount"
          />
        </div>

        {/* Number of People */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Number of People
          </label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="20"
          />
        </div>
      </div>

      {/* Tip Percentage */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Tip Percentage
        </label>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          {tipPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => setTipPercentage(preset)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                tipPercentage === preset
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {preset}%
            </button>
          ))}
          <button
            onClick={() => setTipPercentage(0)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              tipPercentage === 0
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            No Tip
          </button>
        </div>

        {/* Custom Tip Input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={tipPercentage}
            onChange={(e) => setTipPercentage(Number(e.target.value))}
            className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="0"
            max="100"
            step="0.1"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">%</span>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <Receipt size={20} />
            Bill Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Calculations */}
            <div className="space-y-4">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-300">Total Bill</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Bill Amount:</span>
                  <span className="font-medium">₹{billAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Tip ({tipPercentage}%):</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    ₹{results.tipAmount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-emerald-200 dark:border-emerald-700 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Total Amount:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">
                      ₹{results.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Per Person Calculations */}
            {numberOfPeople > 1 && (
              <div className="space-y-4">
                <h4 className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Users size={16} />
                  Per Person ({numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'})
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Tip per person:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      ₹{results.perPersonTip.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-emerald-200 dark:border-emerald-700 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Total per person:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">
                        ₹{results.perPersonAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips and Information */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">💡 Tipping Guidelines</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• Restaurant service: 10-20% depending on service quality</li>
          <li>• Bar service: $1-2 per drink or 15-20% of total bill</li>
          <li>• Takeout/Delivery: 10% or round up the bill</li>
          <li>• Excellent service deserves 20% or more</li>
          <li>• Always check if gratuity is already included in the bill</li>
        </ul>
      </div>
    </div>
  );
};

export default TipCalculator;
