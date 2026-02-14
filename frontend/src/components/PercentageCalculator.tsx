import React, { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";

const PercentageCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [value, setValue] = useState(100);
  const [percent, setPercent] = useState(10);

  const [percentageValue, setPercentageValue] = useState(0);
  const [increaseValue, setIncreaseValue] = useState(0);
  const [decreaseValue, setDecreaseValue] = useState(0);
  const [whatPercent, setWhatPercent] = useState(0);

  useEffect(() => {
    const pValue = (value * percent) / 100;
    setPercentageValue(pValue);
    setIncreaseValue(value + pValue);
    setDecreaseValue(value - pValue);

    if (value !== 0) {
      setWhatPercent((pValue / value) * 100);
    }
  }, [value, percent]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
        Percentage Calculator
      </h2>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">Percentage (%)</label>
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-3 bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
        <p className="text-slate-900 dark:text-white">
          <b>{percent}% of {value}</b> = {percentageValue.toFixed(2)}
        </p>
        <p className="text-slate-900 dark:text-white">
          Increase by {percent}% ={" "}
          <b>{increaseValue.toFixed(2)}</b>
        </p>
        <p className="text-slate-900 dark:text-white">
          Decrease by {percent}% ={" "}
          <b>{decreaseValue.toFixed(2)}</b>
        </p>
        <p className="text-slate-900 dark:text-white">
          {percentageValue.toFixed(2)} is{" "}
          <b>{whatPercent.toFixed(2)}%</b> of {value}
        </p>
      </div>
    </div>
  );
};

export default PercentageCalculator;
