import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, PieChart, BarChart3, Crown } from 'lucide-react';

const InvestmentCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sip' | 'lumpsum' | 'comparison'>('sip');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Investment Calculator</h1>
          <div className="flex items-center gap-2 mt-2 justify-center">
            <p className="text-slate-600 dark:text-slate-400">Plan your financial future with accurate investment calculations</p>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full shadow-lg">
              <Crown size={12} />
              Premium
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('sip')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'sip'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          SIP Calculator
        </button>
        <button
          onClick={() => setActiveTab('lumpsum')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'lumpsum'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Lump Sum
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'comparison'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Comparison
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'sip' && <SIPCalculator />}
      {activeTab === 'lumpsum' && <LumpSumCalculator />}
      {activeTab === 'comparison' && <InvestmentComparison />}
    </div>
  );
};

const SIPCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(10);
  const [results, setResults] = useState<{
    totalInvested: number;
    totalReturns: number;
    maturityValue: number;
  } | null>(null);

  const calculateSIP = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = investmentPeriod * 12;

    const maturityValue = monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvested = monthlyInvestment * months;
    const totalReturns = maturityValue - totalInvested;

    setResults({
      totalInvested,
      totalReturns,
      maturityValue
    });
  };

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, annualReturn, investmentPeriod]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Monthly Investment (₹)
          </label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="100"
            step="100"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Expected Return (% per annum)
          </label>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="30"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Investment Period (years)
          </label>
          <input
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="50"
          />
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <Target size={20} />
            Investment Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ₹{results.totalInvested.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Invested</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{results.totalReturns.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Returns</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                ₹{results.maturityValue.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Maturity Value</div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• SIP (Systematic Investment Plan) helps in rupee-cost averaging</li>
          <li>• Start early to benefit from compounding</li>
          <li>• Historical market returns are around 10-12% annually</li>
          <li>• Consider inflation while setting return expectations</li>
        </ul>
      </div>
    </div>
  );
};

const LumpSumCalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(5);
  const [results, setResults] = useState<{
    maturityValue: number;
    totalReturns: number;
    compoundedAmount: number;
  } | null>(null);

  const calculateLumpSum = () => {
    const maturityValue = initialInvestment * Math.pow(1 + annualReturn / 100, investmentPeriod);
    const totalReturns = maturityValue - initialInvestment;

    setResults({
      maturityValue,
      totalReturns,
      compoundedAmount: maturityValue
    });
  };

  useEffect(() => {
    calculateLumpSum();
  }, [initialInvestment, annualReturn, investmentPeriod]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Initial Investment (₹)
          </label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1000"
            step="1000"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Expected Return (% per annum)
          </label>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="30"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Investment Period (years)
          </label>
          <input
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="50"
          />
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <DollarSign size={20} />
            Lump Sum Investment Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ₹{initialInvestment.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Initial Investment</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{results.totalReturns.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Returns</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                ₹{results.maturityValue.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Final Amount</div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• Lump sum investments benefit from market timing</li>
          <li>• Higher initial investment can lead to better compounding</li>
          <li>• Consider tax implications on long-term capital gains</li>
          <li>• Diversify across different asset classes</li>
        </ul>
      </div>
    </div>
  );
};

const InvestmentComparison: React.FC = () => {
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(50000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(5);
  const [comparison, setComparison] = useState<{
    sipMaturity: number;
    lumpSumMaturity: number;
    difference: number;
    percentageDiff: number;
  } | null>(null);

  const calculateComparison = () => {
    // SIP Calculation
    const monthlyRate = annualReturn / 100 / 12;
    const months = investmentPeriod * 12;
    const sipMaturity = sipAmount *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    // Lump Sum Calculation
    const lumpSumMaturity = lumpSumAmount * Math.pow(1 + annualReturn / 100, investmentPeriod);

    const difference = sipMaturity - lumpSumMaturity;
    const percentageDiff = (difference / lumpSumMaturity) * 100;

    setComparison({
      sipMaturity,
      lumpSumMaturity,
      difference,
      percentageDiff
    });
  };

  useEffect(() => {
    calculateComparison();
  }, [sipAmount, lumpSumAmount, annualReturn, investmentPeriod]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">SIP Investment</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Monthly Investment (₹)
              </label>
              <input
                type="number"
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                min="100"
                step="100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Lump Sum Investment</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Initial Investment (₹)
              </label>
              <input
                type="number"
                value={lumpSumAmount}
                onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                min="1000"
                step="1000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Common Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Expected Return (% per annum)
          </label>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="30"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Investment Period (years)
          </label>
          <input
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
            max="50"
          />
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
            <BarChart3 size={20} />
            Investment Comparison
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-emerald-600 dark:text-emerald-400 mb-2">SIP Investment</h4>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ₹{comparison.sipMaturity.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Monthly: ₹{sipAmount.toLocaleString()}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Lump Sum Investment</h4>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ₹{comparison.lumpSumMaturity.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Initial: ₹{lumpSumAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className={`text-xl font-bold ${comparison.difference > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {comparison.difference > 0 ? 'SIP performs better by' : 'Lump Sum performs better by'} ₹{Math.abs(comparison.difference).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              ({Math.abs(comparison.percentageDiff).toFixed(1)}% difference)
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">📊 Comparison Insights</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• SIP reduces market timing risk through rupee-cost averaging</li>
          <li>• Lump sum can be better if you have market timing confidence</li>
          <li>• SIP is more disciplined for long-term wealth creation</li>
          <li>• Consider your risk tolerance and investment horizon</li>
        </ul>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
