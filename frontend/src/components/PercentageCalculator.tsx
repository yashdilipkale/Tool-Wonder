import React, { useState, useEffect } from 'react';
import { Percent, Calculator, TrendingUp, TrendingDown } from 'lucide-react';

const PercentageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'increase' | 'decrease'>('basic');
  const [results, setResults] = useState<{
    result: number;
    explanation: string;
  } | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
          <Percent size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Percentage Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Calculate percentages, increases, and decreases with ease</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'basic'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Basic Calculations
        </button>
        <button
          onClick={() => setActiveTab('increase')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'increase'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          % Increase
        </button>
        <button
          onClick={() => setActiveTab('decrease')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'decrease'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          % Decrease
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && <BasicPercentageCalculator onResult={setResults} />}
      {activeTab === 'increase' && <PercentageIncreaseCalculator onResult={setResults} />}
      {activeTab === 'decrease' && <PercentageDecreaseCalculator onResult={setResults} />}

      {/* Results Display */}
      {results && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <Calculator size={20} />
            Result
          </h3>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {results.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {results.explanation}
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">📊 Percentage Calculation Examples</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>What is 15% of 200?</strong> = 30 (15% × 200 = 30)</li>
          <li>• <strong>20 is what % of 50?</strong> = 40% (20 ÷ 50 × 100 = 40%)</li>
          <li>• <strong>Increase 100 by 25%</strong> = 125 (100 + 25% of 100)</li>
          <li>• <strong>Decrease 200 by 10%</strong> = 180 (200 - 10% of 200)</li>
        </ul>
      </div>
    </div>
  );
};

const BasicPercentageCalculator: React.FC<{
  onResult: (result: { result: number; explanation: string }) => void
}> = ({ onResult }) => {
  const [calculationType, setCalculationType] = useState<'percentOf' | 'whatPercent'>('percentOf');
  const [value1, setValue1] = useState<number>(15);
  const [value2, setValue2] = useState<number>(200);

  const calculate = () => {
    let result: number;
    let explanation: string;

    if (calculationType === 'percentOf') {
      result = (value1 / 100) * value2;
      explanation = `What is ${value1}% of ${value2}?`;
    } else {
      result = (value1 / value2) * 100;
      explanation = `What percentage is ${value1} of ${value2}?`;
    }

    onResult({ result, explanation });
  };

  useEffect(() => {
    calculate();
  }, [value1, value2, calculationType]);

  return (
    <div className="space-y-6">
      {/* Calculation Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setCalculationType('percentOf')}
          className={`p-4 text-center rounded-lg border-2 transition-all ${
            calculationType === 'percentOf'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="font-medium mb-1">What is X% of Y?</div>
          <div className="text-sm opacity-75">Calculate percentage of a number</div>
        </button>

        <button
          onClick={() => setCalculationType('whatPercent')}
          className={`p-4 text-center rounded-lg border-2 transition-all ${
            calculationType === 'whatPercent'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="font-medium mb-1">X is what % of Y?</div>
          <div className="text-sm opacity-75">Find percentage from numbers</div>
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {calculationType === 'percentOf' ? 'Percentage (%)' : 'Value (X)'}
          </label>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {calculationType === 'percentOf' ? 'Number (Y)' : 'Total (Y)'}
          </label>
          <input
            type="number"
            value={value2}
            onChange={(e) => setValue2(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
          />
        </div>
      </div>

      {/* Formula Display */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Formula:</strong> {calculationType === 'percentOf'
            ? `${value1}% of ${value2} = (${value1} ÷ 100) × ${value2}`
            : `${value1} is what % of ${value2} = (${value1} ÷ ${value2}) × 100`
          }
        </div>
      </div>
    </div>
  );
};

const PercentageIncreaseCalculator: React.FC<{
  onResult: (result: { result: number; explanation: string }) => void
}> = ({ onResult }) => {
  const [originalValue, setOriginalValue] = useState<number>(100);
  const [increasePercent, setIncreasePercent] = useState<number>(25);

  const calculate = () => {
    const increaseAmount = (originalValue * increasePercent) / 100;
    const newValue = originalValue + increaseAmount;

    onResult({
      result: newValue,
      explanation: `Increasing ${originalValue} by ${increasePercent}% gives ${newValue}`
    });
  };

  useEffect(() => {
    calculate();
  }, [originalValue, increasePercent]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Original Value
          </label>
          <input
            type="number"
            value={originalValue}
            onChange={(e) => setOriginalValue(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Increase Percentage (%)
          </label>
          <input
            type="number"
            value={increasePercent}
            onChange={(e) => setIncreasePercent(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
          />
        </div>
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
          <TrendingUp size={16} />
          Calculation Breakdown
        </h4>
        <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
          <div>Original value: {originalValue}</div>
          <div>Increase amount: {((originalValue * increasePercent) / 100).toFixed(2)}</div>
          <div>New value: {originalValue} + {(originalValue * increasePercent) / 100} = {(originalValue + (originalValue * increasePercent) / 100).toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Formula:</strong> New Value = Original Value × (1 + Percentage/100)
        </div>
      </div>
    </div>
  );
};

const PercentageDecreaseCalculator: React.FC<{
  onResult: (result: { result: number; explanation: string }) => void
}> = ({ onResult }) => {
  const [originalValue, setOriginalValue] = useState<number>(200);
  const [decreasePercent, setDecreasePercent] = useState<number>(10);

  const calculate = () => {
    const decreaseAmount = (originalValue * decreasePercent) / 100;
    const newValue = originalValue - decreaseAmount;

    onResult({
      result: newValue,
      explanation: `Decreasing ${originalValue} by ${decreasePercent}% gives ${newValue}`
    });
  };

  useEffect(() => {
    calculate();
  }, [originalValue, decreasePercent]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Original Value
          </label>
          <input
            type="number"
            value={originalValue}
            onChange={(e) => setOriginalValue(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Decrease Percentage (%)
          </label>
          <input
            type="number"
            value={decreasePercent}
            onChange={(e) => setDecreasePercent(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
          />
        </div>
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <h4 className="font-medium text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
          <TrendingDown size={16} />
          Calculation Breakdown
        </h4>
        <div className="space-y-1 text-sm text-red-700 dark:text-red-300">
          <div>Original value: {originalValue}</div>
          <div>Decrease amount: {((originalValue * decreasePercent) / 100).toFixed(2)}</div>
          <div>New value: {originalValue} - {(originalValue * decreasePercent) / 100} = {(originalValue - (originalValue * decreasePercent) / 100).toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Formula:</strong> New Value = Original Value × (1 - Percentage/100)
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;
