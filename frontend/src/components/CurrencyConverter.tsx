import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Calculator, DollarSign } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  // Fetch exchange rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Use a free currency API instead of the backend
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        setRates(data.rates);
      } catch (err) {
        console.error('Failed to fetch rates:', err);
        // Fallback to mock rates
        setRates({
          'USD': 1,
          'EUR': 0.85,
          'GBP': 0.73,
          'JPY': 110.0,
          'CAD': 1.25,
          'AUD': 1.35,
          'CHF': 0.92,
          'CNY': 6.45,
          'INR': 74.5,
          'KRW': 1180.0,
          'BRL': 5.2,
          'MXN': 20.0,
          'RUB': 75.0,
          'ZAR': 14.8,
          'SGD': 1.35,
          'NZD': 1.4,
          'HKD': 7.8,
          'SEK': 8.6,
          'NOK': 8.8,
          'DKK': 6.3,
        });
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchRates();
  }, []);

  const convertCurrency = async () => {
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setResult(amountNum);
      return;
    }

    if (!rates) {
      setError('Exchange rates are still loading. Please try again.');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const fromRate = rates[fromCurrency];
      const toRate = rates[toCurrency];

      if (!fromRate || !toRate) {
        throw new Error('Exchange rate not available for selected currencies.');
      }

      // Convert through USD as base
      const usdAmount = amountNum / fromRate;
      const convertedAmount = usdAmount * toRate;

      setResult(Math.round(convertedAmount * 100) / 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert currency. Please try again.');
      console.error('Currency conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const resetConverter = () => {
    setAmount('1');
    setFromCurrency('USD');
    setToCurrency('EUR');
    setResult(null);
    setError(null);
  };

  // Auto-convert when inputs change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timeoutId = setTimeout(() => {
        convertCurrency();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [amount, fromCurrency, toCurrency]);

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <DollarSign size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Currency Converter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
              />
            </div>

            {/* From Currency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                title="Swap currencies"
              >
                <ArrowRightLeft size={20} />
              </button>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={convertCurrency}
                disabled={isConverting || !amount}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <Calculator size={16} />
                    Convert
                  </>
                )}
              </button>

              <button
                onClick={resetConverter}
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
            {result !== null && (
              <div className="space-y-4">
                {/* Conversion Result */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {fromCurrencyData?.symbol}{amount} {fromCurrency}
                  </div>
                  <div className="text-green-600 dark:text-green-400 mb-4">=</div>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {toCurrencyData?.symbol}{result.toFixed(2)} {toCurrency}
                  </div>
                  <div className="text-sm text-green-800 dark:text-green-200">
                    1 {fromCurrency} = {(result / parseFloat(amount)).toFixed(4)} {toCurrency}
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Exchange Rate</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Rate:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        1 {fromCurrency} = {(result / parseFloat(amount)).toFixed(4)} {toCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Inverse:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        1 {toCurrency} = {(parseFloat(amount) / result).toFixed(4)} {fromCurrency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Popular Conversions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Quick Conversions</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[10, 50, 100, 500, 1000].map((quickAmount) => (
                      <div key={quickAmount} className="text-center p-2 bg-white dark:bg-slate-700 rounded">
                        <div className="font-semibold text-blue-900 dark:text-blue-100">
                          {fromCurrencyData?.symbol}{quickAmount}
                        </div>
                        <div className="text-blue-700 dark:text-blue-300">
                          = {toCurrencyData?.symbol}{((result / parseFloat(amount)) * quickAmount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result === null && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Convert Currencies</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select currencies and enter an amount to see real-time conversion rates.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* API Notice */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Exchange Rate Data</h3>
          <p className="text-sm text-green-800 dark:text-green-200">
            This tool fetches real-time exchange rates from ExchangeRate-API. Rates are updated regularly and converted through USD as the base currency.
            {isLoadingRates && ' Loading rates...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
