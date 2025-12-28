import React, { useState, useEffect } from 'react';
import { Activity, Fuel, Car, Calculator, TrendingUp, DollarSign } from 'lucide-react';

const FuelCostCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trip' | 'efficiency' | 'comparison'>('trip');
  const [results, setResults] = useState<{
    fuelNeeded: number;
    cost: number;
    efficiency: number;
    distance: number;
  } | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
          <Fuel size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Fuel Cost Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Calculate fuel costs, efficiency, and trip expenses</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('trip')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'trip'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Trip Cost
        </button>
        <button
          onClick={() => setActiveTab('efficiency')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'efficiency'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Fuel Efficiency
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'comparison'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Compare Vehicles
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'trip' && <TripCostCalculator onResult={setResults} />}
      {activeTab === 'efficiency' && <FuelEfficiencyCalculator onResult={setResults} />}
      {activeTab === 'comparison' && <VehicleComparisonCalculator onResult={setResults} />}

      {/* Results Display */}
      {results && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
            <Calculator size={20} />
            Calculation Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {results.distance.toFixed(1)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Distance (miles)</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {results.fuelNeeded.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Fuel Needed (gallons)</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                ${results.cost.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Cost</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {results.efficiency.toFixed(1)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">MPG</div>
            </div>
          </div>
        </div>
      )}

      {/* Fuel Tips */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🚗 Fuel Saving Tips</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• Maintain proper tire pressure to improve fuel efficiency by up to 3%</li>
          <li>• Avoid excessive idling - turn off your engine if waiting more than 30 seconds</li>
          <li>• Use cruise control on highways to maintain consistent speed</li>
          <li>• Remove excess weight from your vehicle</li>
          <li>• Regular maintenance improves fuel economy by 4-40%</li>
        </ul>
      </div>
    </div>
  );
};

const TripCostCalculator: React.FC<{
  onResult: (result: { fuelNeeded: number; cost: number; efficiency: number; distance: number }) => void
}> = ({ onResult }) => {
  const [distance, setDistance] = useState<number>(100);
  const [efficiency, setEfficiency] = useState<number>(25); // MPG
  const [fuelPrice, setFuelPrice] = useState<number>(3.50);

  const calculateTripCost = () => {
    const fuelNeeded = distance / efficiency;
    const cost = fuelNeeded * fuelPrice;

    onResult({
      fuelNeeded,
      cost,
      efficiency,
      distance
    });
  };

  useEffect(() => {
    calculateTripCost();
  }, [distance, efficiency, fuelPrice]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distance */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Distance (miles)
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
            step="0.1"
            placeholder="Enter distance"
          />
        </div>

        {/* Fuel Efficiency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Fuel Efficiency (MPG)
          </label>
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="1"
            max="100"
            step="0.1"
            placeholder="Miles per gallon"
          />
        </div>

        {/* Fuel Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Fuel Price ($/gallon)
          </label>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
            step="0.01"
            placeholder="Price per gallon"
          />
        </div>
      </div>

      {/* Common MPG Values */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-800 dark:text-slate-200">Common Fuel Efficiency Examples</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setEfficiency(15)}
            className="p-3 text-center rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500 transition-colors"
          >
            <div className="font-medium">SUV</div>
            <div className="text-sm opacity-75">15 MPG</div>
          </button>
          <button
            onClick={() => setEfficiency(25)}
            className="p-3 text-center rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500 transition-colors"
          >
            <div className="font-medium">Sedan</div>
            <div className="text-sm opacity-75">25 MPG</div>
          </button>
          <button
            onClick={() => setEfficiency(35)}
            className="p-3 text-center rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500 transition-colors"
          >
            <div className="font-medium">Hybrid</div>
            <div className="text-sm opacity-75">35 MPG</div>
          </button>
          <button
            onClick={() => setEfficiency(45)}
            className="p-3 text-center rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500 transition-colors"
          >
            <div className="font-medium">Electric</div>
            <div className="text-sm opacity-75">45+ MPG equiv.</div>
          </button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Formula:</strong> Fuel Cost = (Distance ÷ MPG) × Price per Gallon
        </div>
      </div>
    </div>
  );
};

const FuelEfficiencyCalculator: React.FC<{
  onResult: (result: { fuelNeeded: number; cost: number; efficiency: number; distance: number }) => void
}> = ({ onResult }) => {
  const [distance, setDistance] = useState<number>(200);
  const [fuelUsed, setFuelUsed] = useState<number>(8);
  const [fuelPrice, setFuelPrice] = useState<number>(3.50);

  const calculateEfficiency = () => {
    const efficiency = distance / fuelUsed;
    const cost = fuelUsed * fuelPrice;

    onResult({
      fuelNeeded: fuelUsed,
      cost,
      efficiency,
      distance
    });
  };

  useEffect(() => {
    calculateEfficiency();
  }, [distance, fuelUsed, fuelPrice]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distance Driven */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Distance Driven (miles)
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
            step="0.1"
          />
        </div>

        {/* Fuel Used */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Fuel Used (gallons)
          </label>
          <input
            type="number"
            value={fuelUsed}
            onChange={(e) => setFuelUsed(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
            step="0.01"
          />
        </div>

        {/* Fuel Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Fuel Price ($/gallon)
          </label>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
          <TrendingUp size={16} />
          How to Calculate Your MPG
        </h4>
        <ol className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>1. Fill your tank completely and reset your trip odometer</li>
          <li>2. Drive normally until you need to refill</li>
          <li>3. Note the miles driven and gallons added</li>
          <li>4. Divide miles by gallons to get your MPG</li>
        </ol>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Formula:</strong> MPG = Distance Driven ÷ Gallons of Fuel Used
        </div>
      </div>
    </div>
  );
};

const VehicleComparisonCalculator: React.FC<{
  onResult: (result: { fuelNeeded: number; cost: number; efficiency: number; distance: number }) => void
}> = ({ onResult }) => {
  const [distance, setDistance] = useState<number>(100);
  const [fuelPrice, setFuelPrice] = useState<number>(3.50);
  const [vehicle1, setVehicle1] = useState<{ name: string; mpg: number }>({ name: 'Sedan', mpg: 25 });
  const [vehicle2, setVehicle2] = useState<{ name: string; mpg: number }>({ name: 'SUV', mpg: 18 });

  const calculateComparison = () => {
    const fuel1 = distance / vehicle1.mpg;
    const fuel2 = distance / vehicle2.mpg;
    const cost1 = fuel1 * fuelPrice;
    const cost2 = fuel2 * fuelPrice;

    // Show results for the more efficient vehicle
    const betterVehicle = cost1 <= cost2 ? vehicle1 : vehicle2;
    const fuelNeeded = distance / betterVehicle.mpg;
    const cost = fuelNeeded * fuelPrice;

    onResult({
      fuelNeeded,
      cost,
      efficiency: betterVehicle.mpg,
      distance
    });
  };

  useEffect(() => {
    calculateComparison();
  }, [distance, fuelPrice, vehicle1, vehicle2]);

  return (
    <div className="space-y-6">
      {/* Common Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Distance (miles)
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Fuel Price ($/gallon)
          </label>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Vehicle 1 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Car size={20} />
          Vehicle 1
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={vehicle1.name}
            onChange={(e) => setVehicle1({ ...vehicle1, name: e.target.value })}
            placeholder="Vehicle name"
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <input
            type="number"
            value={vehicle1.mpg}
            onChange={(e) => setVehicle1({ ...vehicle1, mpg: Number(e.target.value) })}
            placeholder="MPG"
            min="1"
            step="0.1"
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Vehicle 2 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Car size={20} />
          Vehicle 2
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={vehicle2.name}
            onChange={(e) => setVehicle2({ ...vehicle2, name: e.target.value })}
            placeholder="Vehicle name"
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <input
            type="number"
            value={vehicle2.mpg}
            onChange={(e) => setVehicle2({ ...vehicle2, mpg: Number(e.target.value) })}
            placeholder="MPG"
            min="1"
            step="0.1"
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Comparison Results */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-4">Cost Comparison</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
            <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-2">{vehicle1.name}</h5>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${(distance / vehicle1.mpg * fuelPrice).toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {(distance / vehicle1.mpg).toFixed(2)} gallons
            </div>
          </div>

          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
            <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-2">{vehicle2.name}</h5>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${(distance / vehicle2.mpg * fuelPrice).toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {(distance / vehicle2.mpg).toFixed(2)} gallons
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {(() => {
              const cost1 = distance / vehicle1.mpg * fuelPrice;
              const cost2 = distance / vehicle2.mpg * fuelPrice;
              const savings = Math.abs(cost1 - cost2);
              const better = cost1 < cost2 ? vehicle1.name : vehicle2.name;
              return `${better} saves $${savings.toFixed(2)} for this trip`;
            })()}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Formula:</strong> Fuel Cost = (Distance ÷ MPG) × Price per Gallon
        </div>
      </div>
    </div>
  );
};

export default FuelCostCalculator;
