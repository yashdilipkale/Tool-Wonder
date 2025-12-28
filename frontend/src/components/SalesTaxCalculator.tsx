import React, { useState, useEffect } from 'react';
import { Calculator, Receipt, MapPin, Plus, Minus } from 'lucide-react';

interface TaxRate {
  location: string;
  rate: number;
  type: string;
}

const SalesTaxCalculator: React.FC = () => {
  const [preTaxAmount, setPreTaxAmount] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(8.25);
  const [customRates, setCustomRates] = useState<TaxRate[]>([
    { location: 'California', rate: 8.25, type: 'State' },
    { location: 'New York', rate: 8.875, type: 'State' },
    { location: 'Texas', rate: 6.25, type: 'State' },
    { location: 'Florida', rate: 6.0, type: 'State' },
    { location: 'Illinois', rate: 6.25, type: 'State' }
  ]);
  const [results, setResults] = useState<{
    taxAmount: number;
    totalAmount: number;
    breakdown: { location: string; rate: number; tax: number }[];
  } | null>(null);

  // Predefined tax rates by state/country
  const predefinedRates: TaxRate[] = [
    { location: 'Alabama', rate: 4.0, type: 'State' },
    { location: 'Alaska', rate: 0.0, type: 'State' },
    { location: 'Arizona', rate: 5.6, type: 'State' },
    { location: 'Arkansas', rate: 6.5, type: 'State' },
    { location: 'California', rate: 7.25, type: 'State' },
    { location: 'Colorado', rate: 2.9, type: 'State' },
    { location: 'Connecticut', rate: 6.35, type: 'State' },
    { location: 'Delaware', rate: 0.0, type: 'State' },
    { location: 'Florida', rate: 6.0, type: 'State' },
    { location: 'Georgia', rate: 4.0, type: 'State' },
    { location: 'Hawaii', rate: 4.0, type: 'State' },
    { location: 'Idaho', rate: 6.0, type: 'State' },
    { location: 'Illinois', rate: 6.25, type: 'State' },
    { location: 'Indiana', rate: 7.0, type: 'State' },
    { location: 'Iowa', rate: 6.0, type: 'State' },
    { location: 'Kansas', rate: 6.5, type: 'State' },
    { location: 'Kentucky', rate: 6.0, type: 'State' },
    { location: 'Louisiana', rate: 4.45, type: 'State' },
    { location: 'Maine', rate: 5.5, type: 'State' },
    { location: 'Maryland', rate: 6.0, type: 'State' },
    { location: 'Massachusetts', rate: 6.25, type: 'State' },
    { location: 'Michigan', rate: 6.0, type: 'State' },
    { location: 'Minnesota', rate: 6.875, type: 'State' },
    { location: 'Mississippi', rate: 7.0, type: 'State' },
    { location: 'Missouri', rate: 4.225, type: 'State' },
    { location: 'Montana', rate: 0.0, type: 'State' },
    { location: 'Nebraska', rate: 5.5, type: 'State' },
    { location: 'Nevada', rate: 6.85, type: 'State' },
    { location: 'New Hampshire', rate: 0.0, type: 'State' },
    { location: 'New Jersey', rate: 6.625, type: 'State' },
    { location: 'New Mexico', rate: 5.125, type: 'State' },
    { location: 'New York', rate: 8.875, type: 'State' },
    { location: 'North Carolina', rate: 4.75, type: 'State' },
    { location: 'North Dakota', rate: 5.0, type: 'State' },
    { location: 'Ohio', rate: 5.75, type: 'State' },
    { location: 'Oklahoma', rate: 4.5, type: 'State' },
    { location: 'Oregon', rate: 0.0, type: 'State' },
    { location: 'Pennsylvania', rate: 6.0, type: 'State' },
    { location: 'Rhode Island', rate: 7.0, type: 'State' },
    { location: 'South Carolina', rate: 6.0, type: 'State' },
    { location: 'South Dakota', rate: 4.5, type: 'State' },
    { location: 'Tennessee', rate: 7.0, type: 'State' },
    { location: 'Texas', rate: 6.25, type: 'State' },
    { location: 'Utah', rate: 6.1, type: 'State' },
    { location: 'Vermont', rate: 6.0, type: 'State' },
    { location: 'Virginia', rate: 5.3, type: 'State' },
    { location: 'Washington', rate: 6.5, type: 'State' },
    { location: 'West Virginia', rate: 6.0, type: 'State' },
    { location: 'Wisconsin', rate: 5.0, type: 'State' },
    { location: 'Wyoming', rate: 4.0, type: 'State' },
    { location: 'District of Columbia', rate: 6.0, type: 'Federal District' },
    { location: 'Canada (GST)', rate: 5.0, type: 'National' },
    { location: 'Canada (HST)', rate: 13.0, type: 'National' },
    { location: 'UK (VAT)', rate: 20.0, type: 'National' },
    { location: 'Australia (GST)', rate: 10.0, type: 'National' },
    { location: 'Germany (VAT)', rate: 19.0, type: 'National' },
    { location: 'France (VAT)', rate: 20.0, type: 'National' }
  ];

  const calculateTax = () => {
    const taxAmount = (preTaxAmount * taxRate) / 100;
    const totalAmount = preTaxAmount + taxAmount;

    // Calculate breakdown for multiple rates if any
    const breakdown = [{ location: 'Selected Rate', rate: taxRate, tax: taxAmount }];

    setResults({
      taxAmount,
      totalAmount,
      breakdown
    });
  };

  useEffect(() => {
    calculateTax();
  }, [preTaxAmount, taxRate]);

  const addCustomRate = () => {
    const newRate: TaxRate = { location: 'Custom Location', rate: 0, type: 'Custom' };
    setCustomRates([...customRates, newRate]);
  };

  const updateCustomRate = (index: number, field: 'location' | 'rate', value: string | number) => {
    const updated = [...customRates];
    updated[index] = { ...updated[index], [field]: value };
    setCustomRates(updated);
  };

  const removeCustomRate = (index: number) => {
    setCustomRates(customRates.filter((_, i) => i !== index));
  };

  const selectPredefinedRate = (rate: TaxRate) => {
    setTaxRate(rate.rate);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
          <Calculator size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Sales Tax Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Calculate sales tax for different regions and locations</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pre-tax Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Pre-tax Amount ($)
          </label>
          <input
            type="number"
            value={preTaxAmount}
            onChange={(e) => setPreTaxAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            min="0"
            step="0.01"
            placeholder="Enter amount before tax"
          />
        </div>

        {/* Tax Rate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      </div>

      {/* Predefined Tax Rates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <MapPin size={20} />
          Select Tax Rate by Location
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {predefinedRates.slice(0, 24).map((rate) => (
            <button
              key={`${rate.location}-${rate.rate}`}
              onClick={() => selectPredefinedRate(rate)}
              className={`p-3 text-center rounded-lg border-2 transition-all text-sm ${
                taxRate === rate.rate
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="font-medium">{rate.location}</div>
              <div className="text-xs opacity-75">{rate.rate}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Tax Rates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Custom Tax Rates</h3>
          <button
            onClick={addCustomRate}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <Plus size={16} />
            Add Rate
          </button>
        </div>

        <div className="space-y-3">
          {customRates.map((rate, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <input
                type="text"
                value={rate.location}
                onChange={(e) => updateCustomRate(index, 'location', e.target.value)}
                placeholder="Location"
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="number"
                value={rate.rate}
                onChange={(e) => updateCustomRate(index, 'rate', Number(e.target.value))}
                placeholder="Rate %"
                min="0"
                max="100"
                step="0.01"
                className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                onClick={() => setTaxRate(rate.rate)}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Use
              </button>
              <button
                onClick={() => removeCustomRate(index)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
            <Receipt size={20} />
            Tax Calculation Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pre-tax Amount */}
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ${preTaxAmount.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Pre-tax Amount</div>
            </div>

            {/* Tax Amount */}
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                ${results.taxAmount.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Tax Amount ({taxRate}%)</div>
            </div>

            {/* Total Amount */}
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                ${results.totalAmount.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Amount</div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="border-t border-orange-200 dark:border-orange-700 pt-4">
            <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-3">Tax Breakdown</h4>
            <div className="space-y-2">
              {results.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 dark:text-slate-300">
                    {item.location} ({item.rate}%)
                  </span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">
                    ${item.tax.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tax Information */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">💰 Sales Tax Information</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• Sales tax rates vary by state, county, and city</li>
          <li>• Some states have no sales tax (Alaska, Delaware, Montana, New Hampshire, Oregon)</li>
          <li>• Local taxes may be added to state rates</li>
          <li>• Tax rates can change, always verify current rates</li>
          <li>• Some items may be tax-exempt (food, medicine, clothing)</li>
        </ul>
      </div>
    </div>
  );
};

export default SalesTaxCalculator;
