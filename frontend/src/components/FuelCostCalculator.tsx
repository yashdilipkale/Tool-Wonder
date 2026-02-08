import React, { useState } from 'react';
import { Calculator, Fuel, Car, MapPin, TrendingUp, DollarSign, Gauge } from 'lucide-react';

const FuelCostCalculator: React.FC = () => {
  const [distance, setDistance] = useState<string>('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'cng' | 'electric'>('petrol');
  const [vehicleType, setVehicleType] = useState<'car' | 'bike' | 'scooter' | 'truck'>('car');
  const [fuelEfficiency, setFuelEfficiency] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [result, setResult] = useState<{
    totalCost: number;
    fuelNeeded: number;
    costPerKm: number;
    co2Emissions: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Indian fuel prices (approximate, in INR per liter/kg)
  const defaultFuelPrices = {
    petrol: 100,
    diesel: 85,
    cng: 70,
    electric: 8 // per kWh
  };

  // Average fuel efficiency by vehicle type (km per liter/kg/kWh)
  const defaultEfficiency = {
    car: { petrol: 15, diesel: 20, cng: 25, electric: 4 },
    bike: { petrol: 45, diesel: 0, cng: 0, electric: 80 },
    scooter: { petrol: 55, diesel: 0, cng: 0, electric: 90 },
    truck: { petrol: 6, diesel: 10, cng: 12, electric: 2 }
  };

  const calculateFuelCost = () => {
    const distanceNum = parseFloat(distance);
    const efficiencyNum = parseFloat(fuelEfficiency);
    const priceNum = parseFloat(fuelPrice);

    if (!distanceNum || distanceNum <= 0) {
      setError('Please enter a valid distance.');
      return;
    }

    if (!efficiencyNum || efficiencyNum <= 0) {
      setError('Please enter a valid fuel efficiency.');
      return;
    }

    if (!priceNum || priceNum <= 0) {
      setError('Please enter a valid fuel price.');
      return;
    }

    setError(null);

    // Calculate fuel needed (in liters/kg/kWh)
    const fuelNeeded = distanceNum / efficiencyNum;
    
    // Calculate total cost
    const totalCost = fuelNeeded * priceNum;
    
    // Calculate cost per km
    const costPerKm = totalCost / distanceNum;

    // Calculate approximate CO2 emissions (kg per liter)
    const co2Factors = {
      petrol: 2.31,
      diesel: 2.68,
      cng: 1.56,
      electric: 0 // Assuming zero direct emissions
    };
    
    const co2Emissions = fuelNeeded * co2Factors[fuelType];

    setResult({
      totalCost,
      fuelNeeded,
      costPerKm,
      co2Emissions
    });
  };

  const resetCalculator = () => {
    setDistance('');
    setFuelType('petrol');
    setVehicleType('car');
    setFuelEfficiency('');
    setFuelPrice('');
    setResult(null);
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

  const getRecommendedEfficiency = () => {
    return defaultEfficiency[vehicleType][fuelType];
  };

  const setDefaultValues = () => {
    setFuelPrice(defaultFuelPrices[fuelType].toString());
    setFuelEfficiency(getRecommendedEfficiency().toString());
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Fuel size={20} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Indian Fuel Cost Calculator</h2>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Premium
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Distance Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Enter distance to travel"
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="0"
                step="0.1"
              />
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['car', 'bike', 'scooter', 'truck'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <input
                      type="radio"
                      name="vehicleType"
                      value={type}
                      checked={vehicleType === type}
                      onChange={(e) => setVehicleType(e.target.value as 'car' | 'bike' | 'scooter' | 'truck')}
                      className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fuel Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['petrol', 'diesel', 'cng', 'electric'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <input
                      type="radio"
                      name="fuelType"
                      value={type}
                      checked={fuelType === type}
                      onChange={(e) => {
                        setFuelType(e.target.value as 'petrol' | 'diesel' | 'cng' | 'electric');
                        setDefaultValues();
                      }}
                      className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Efficiency Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fuel Efficiency (km per {fuelType === 'electric' ? 'kWh' : 'liter/kg'})
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(e.target.value)}
                  placeholder={`e.g., ${getRecommendedEfficiency()}`}
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  step="0.1"
                />
                <button
                  onClick={setDefaultValues}
                  className="px-3 py-3 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 border border-emerald-200 dark:border-emerald-700 rounded-lg"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Recommended: {getRecommendedEfficiency()} km per {fuelType === 'electric' ? 'kWh' : 'liter/kg'}
              </p>
            </div>

            {/* Fuel Price Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fuel Price (₹ per {fuelType === 'electric' ? 'kWh' : 'liter/kg'})
              </label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                placeholder={`e.g., ${defaultFuelPrices[fuelType]}`}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Current average: ₹{defaultFuelPrices[fuelType]} per {fuelType === 'electric' ? 'kWh' : 'liter/kg'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateFuelCost}
                disabled={!distance || !fuelEfficiency || !fuelPrice}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator size={16} />
                Calculate Cost
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
            {result && (
              <div className="space-y-4">
                {/* Main Result */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                    <DollarSign size={20} />
                    Fuel Cost Analysis
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200 dark:border-emerald-700">
                      <span className="text-emerald-800 dark:text-emerald-200">Total Cost:</span>
                      <span className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">{formatCurrency(result.totalCost)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200 dark:border-emerald-700">
                      <span className="text-emerald-800 dark:text-emerald-200">Fuel Needed:</span>
                      <span className="font-semibold text-emerald-900 dark:text-emerald-100">{result.fuelNeeded.toFixed(2)} {fuelType === 'electric' ? 'kWh' : 'liters/kg'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200 dark:border-emerald-700">
                      <span className="text-emerald-800 dark:text-emerald-200">Cost per km:</span>
                      <span className="font-semibold text-emerald-900 dark:text-emerald-100">{formatCurrency(result.costPerKm)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-emerald-800 dark:text-emerald-200">CO₂ Emissions:</span>
                      <span className="font-semibold text-emerald-900 dark:text-emerald-100">{result.co2Emissions.toFixed(2)} kg</span>
                    </div>
                  </div>
                </div>

                {/* Fuel Efficiency */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Fuel Efficiency</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Distance:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Efficiency:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{fuelEfficiency} km per {fuelType === 'electric' ? 'kWh' : 'liter/kg'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Consumption:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{(100 / parseFloat(fuelEfficiency)).toFixed(2)} {fuelType === 'electric' ? 'kWh' : 'liters'} per 100 km</span>
                    </div>
                  </div>
                </div>

                {/* Savings Tips */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">💡 Fuel Saving Tips</h3>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <li>• Maintain proper tire pressure</li>
                    <li>• Drive at steady speeds</li>
                    <li>• Avoid unnecessary idling</li>
                    <li>• Use air conditioning sparingly</li>
                    <li>• Keep your vehicle well-maintained</li>
                  </ul>
                </div>

                {/* Quick Calculations */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">Quick Cost Estimates</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[50, 100, 500, 1000].map((quickDistance) => {
                      const quickCost = (quickDistance / parseFloat(fuelEfficiency)) * parseFloat(fuelPrice);
                      return (
                        <div key={quickDistance} className="text-center p-2 bg-white dark:bg-slate-700 rounded">
                          <div className="font-semibold text-purple-900 dark:text-purple-100">
                            {quickDistance} km
                          </div>
                          <div className="text-purple-700 dark:text-purple-300">
                            {formatCurrency(quickCost)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {!result && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <Fuel size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calculate Fuel Costs</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter distance, vehicle type, and fuel details to calculate your fuel costs and efficiency.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Fuel Efficiency Information</h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              <strong>Fuel Efficiency:</strong> Varies by vehicle type, driving conditions, and maintenance.
            </p>
            <p>
              <strong>Electric Vehicles:</strong> More efficient than internal combustion engines, with lower running costs.
            </p>
            <p>
              <strong>CNG Vehicles:</strong> Lower emissions and fuel costs compared to petrol/diesel.
            </p>
            <p>
              <strong>CO₂ Emissions:</strong> Approximate values for environmental impact assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelCostCalculator;