import React, { useState } from "react";
import { useTheme } from "../ThemeContext";

const fuelRates = {
  petrol: 100,
  diesel: 85,
  cng: 70,
  electric: 8,
};

const efficiency = {
  petrol: 15,
  diesel: 20,
  cng: 25,
  electric: 4,
};

const FuelCostCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [distance, setDistance] = useState(100);
  const [days, setDays] = useState(22);

  const calcTripCost = (type: keyof typeof fuelRates) =>
    (distance / efficiency[type]) * fuelRates[type];

  const calcMonthlyCost = (type: keyof typeof fuelRates) =>
    calcTripCost(type) * days;

  const cheapestFuel = Object.keys(fuelRates).reduce((a, b) =>
    calcTripCost(a as any) < calcTripCost(b as any) ? a : b
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">
        Fuel Cost Calculator
      </h2>

      {/* Distance */}
      <div className="mb-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Travel Distance (km)</label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg mt-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <div className="flex gap-2 mt-2">
          {[50, 100, 500].map((d) => (
            <button
              key={d}
              onClick={() => setDistance(d)}
              className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 text-slate-900 dark:text-white transition-colors"
            >
              {d} km
            </button>
          ))}
        </div>
      </div>

      {/* Days */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Travel Days per Month</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg mt-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      {/* Comparison */}
      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
        <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">Fuel Comparison</h3>

        {Object.keys(fuelRates).map((type) => {
          const trip = calcTripCost(type as any);
          const monthly = calcMonthlyCost(type as any);

          return (
            <div
              key={type}
              className={`flex justify-between py-2 border-b border-slate-200 dark:border-slate-600 ${
                cheapestFuel === type ? "font-bold text-green-600" : ""
              }`}
            >
              <span className="capitalize text-slate-900 dark:text-white">{type}</span>
              <span className="text-slate-900 dark:text-white">
                Trip ₹{trip.toFixed(2)} | Monthly ₹{monthly.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Suggestion */}
      <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
        Best economical fuel for this trip:{" "}
        <span className="font-semibold capitalize text-green-600">
          {cheapestFuel}
        </span>
      </div>
    </div>
  );
};

export default FuelCostCalculator;
