import React, { useState, useEffect } from 'react';
import { Ruler, ArrowRight, RefreshCw } from 'lucide-react';

interface Unit {
  name: string;
  symbol: string;
  toBase: number; // multiplier to convert to base unit
  offset?: number; // for temperature conversions
}

interface UnitCategory {
  name: string;
  baseUnit: string;
  units: Record<string, Unit>;
  convert: (value: number, from: string, to: string) => number;
}

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  // Unit categories with conversion data
  const unitCategories: Record<string, UnitCategory> = {
    length: {
      name: 'Length',
      baseUnit: 'meters',
      units: {
        millimeters: { name: 'Millimeters', symbol: 'mm', toBase: 0.001 },
        centimeters: { name: 'Centimeters', symbol: 'cm', toBase: 0.01 },
        meters: { name: 'Meters', symbol: 'm', toBase: 1 },
        kilometers: { name: 'Kilometers', symbol: 'km', toBase: 1000 },
        inches: { name: 'Inches', symbol: 'in', toBase: 0.0254 },
        feet: { name: 'Feet', symbol: 'ft', toBase: 0.3048 },
        yards: { name: 'Yards', symbol: 'yd', toBase: 0.9144 },
        miles: { name: 'Miles', symbol: 'mi', toBase: 1609.344 },
        nautical_miles: { name: 'Nautical Miles', symbol: 'nmi', toBase: 1852 }
      },
      convert: (value, from, to) => {
        const baseValue = value * unitCategories.length.units[from].toBase;
        return baseValue / unitCategories.length.units[to].toBase;
      }
    },
    weight: {
      name: 'Weight',
      baseUnit: 'grams',
      units: {
        milligrams: { name: 'Milligrams', symbol: 'mg', toBase: 0.001 },
        grams: { name: 'Grams', symbol: 'g', toBase: 1 },
        kilograms: { name: 'Kilograms', symbol: 'kg', toBase: 1000 },
        metric_tons: { name: 'Metric Tons', symbol: 't', toBase: 1000000 },
        ounces: { name: 'Ounces', symbol: 'oz', toBase: 28.3495 },
        pounds: { name: 'Pounds', symbol: 'lb', toBase: 453.592 },
        stones: { name: 'Stones', symbol: 'st', toBase: 6350.29 },
        tons: { name: 'US Tons', symbol: 'ton', toBase: 907184.74 }
      },
      convert: (value, from, to) => {
        const baseValue = value * unitCategories.weight.units[from].toBase;
        return baseValue / unitCategories.weight.units[to].toBase;
      }
    },
    temperature: {
      name: 'Temperature',
      baseUnit: 'celsius',
      units: {
        celsius: { name: 'Celsius', symbol: '°C', toBase: 1, offset: 0 },
        fahrenheit: { name: 'Fahrenheit', symbol: '°F', toBase: 1.8, offset: 32 },
        kelvin: { name: 'Kelvin', symbol: 'K', toBase: 1, offset: 273.15 },
        rankine: { name: 'Rankine', symbol: '°R', toBase: 1.8, offset: 491.67 }
      },
      convert: (value, from, to) => {
        // Convert to Celsius first
        let celsius: number;
        const fromUnit = unitCategories.temperature.units[from];

        if (from === 'celsius') {
          celsius = value;
        } else if (from === 'fahrenheit') {
          celsius = (value - 32) * 5/9;
        } else if (from === 'kelvin') {
          celsius = value - 273.15;
        } else if (from === 'rankine') {
          celsius = (value - 491.67) * 5/9;
        } else {
          celsius = value;
        }

        // Convert from Celsius to target unit
        let result: number;
        if (to === 'celsius') {
          result = celsius;
        } else if (to === 'fahrenheit') {
          result = celsius * 9/5 + 32;
        } else if (to === 'kelvin') {
          result = celsius + 273.15;
        } else if (to === 'rankine') {
          result = (celsius + 273.15) * 9/5;
        } else {
          result = celsius;
        }

        return result;
      }
    },
    area: {
      name: 'Area',
      baseUnit: 'square_meters',
      units: {
        square_millimeters: { name: 'Square Millimeters', symbol: 'mm²', toBase: 0.000001 },
        square_centimeters: { name: 'Square Centimeters', symbol: 'cm²', toBase: 0.0001 },
        square_meters: { name: 'Square Meters', symbol: 'm²', toBase: 1 },
        square_kilometers: { name: 'Square Kilometers', symbol: 'km²', toBase: 1000000 },
        square_inches: { name: 'Square Inches', symbol: 'in²', toBase: 0.00064516 },
        square_feet: { name: 'Square Feet', symbol: 'ft²', toBase: 0.092903 },
        square_yards: { name: 'Square Yards', symbol: 'yd²', toBase: 0.836127 },
        acres: { name: 'Acres', symbol: 'ac', toBase: 4046.86 },
        square_miles: { name: 'Square Miles', symbol: 'mi²', toBase: 2589988.11 },
        hectares: { name: 'Hectares', symbol: 'ha', toBase: 10000 }
      },
      convert: (value, from, to) => {
        const baseValue = value * unitCategories.area.units[from].toBase;
        return baseValue / unitCategories.area.units[to].toBase;
      }
    },
    volume: {
      name: 'Volume',
      baseUnit: 'liters',
      units: {
        milliliters: { name: 'Milliliters', symbol: 'mL', toBase: 0.001 },
        liters: { name: 'Liters', symbol: 'L', toBase: 1 },
        cubic_meters: { name: 'Cubic Meters', symbol: 'm³', toBase: 1000 },
        cubic_inches: { name: 'Cubic Inches', symbol: 'in³', toBase: 0.0163871 },
        cubic_feet: { name: 'Cubic Feet', symbol: 'ft³', toBase: 28.3168 },
        fluid_ounces: { name: 'Fluid Ounces', symbol: 'fl oz', toBase: 0.0295735 },
        cups: { name: 'Cups', symbol: 'cup', toBase: 0.236588 },
        pints: { name: 'Pints', symbol: 'pt', toBase: 0.473176 },
        quarts: { name: 'Quarts', symbol: 'qt', toBase: 0.946353 },
        gallons: { name: 'Gallons', symbol: 'gal', toBase: 3.78541 }
      },
      convert: (value, from, to) => {
        const baseValue = value * unitCategories.volume.units[from].toBase;
        return baseValue / unitCategories.volume.units[to].toBase;
      }
    },
    speed: {
      name: 'Speed',
      baseUnit: 'meters_per_second',
      units: {
        meters_per_second: { name: 'Meters per Second', symbol: 'm/s', toBase: 1 },
        kilometers_per_hour: { name: 'Kilometers per Hour', symbol: 'km/h', toBase: 0.277778 },
        miles_per_hour: { name: 'Miles per Hour', symbol: 'mph', toBase: 0.44704 },
        knots: { name: 'Knots', symbol: 'kn', toBase: 0.514444 },
        feet_per_second: { name: 'Feet per Second', symbol: 'ft/s', toBase: 0.3048 }
      },
      convert: (value, from, to) => {
        const baseValue = value * unitCategories.speed.units[from].toBase;
        return baseValue / unitCategories.speed.units[to].toBase;
      }
    },
    time: {
      name: 'Time',
      baseUnit: 'seconds',
      units: {
        nanoseconds: { name: 'Nanoseconds', symbol: 'ns', toBase: 0.000000001 },
        microseconds: { name: 'Microseconds', symbol: 'μs', toBase: 0.000001 },
        milliseconds: { name: 'Milliseconds', symbol: 'ms', toBase: 0.001 },
        seconds: { name: 'Seconds', symbol: 's', toBase: 1 },
        minutes: { name: 'Minutes', symbol: 'min', toBase: 60 },
        hours: { name: 'Hours', symbol: 'h', toBase: 3600 },
        days: { name: 'Days', symbol: 'd', toBase: 86400 },
        weeks: { name: 'Weeks', symbol: 'wk', toBase: 604800 },
        months: { name: 'Months', symbol: 'mo', toBase: 2629746 }, // Average month
        years: { name: 'Years', symbol: 'yr', toBase: 31556952 } // Average year
      },
      convert: (value, from, to) => {
        const baseValue = value * unitCategories.time.units[from].toBase;
        return baseValue / unitCategories.time.units[to].toBase;
      }
    }
  };

  // Convert values when inputs change
  useEffect(() => {
    const convertValue = () => {
      const numValue = parseFloat(fromValue);
      if (isNaN(numValue)) {
        setToValue('');
        return;
      }

      try {
        const result = unitCategories[category].convert(numValue, fromUnit, toUnit);
        setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
      } catch (error) {
        setToValue('Error');
      }
    };

    convertValue();
  }, [fromValue, fromUnit, toUnit, category]);

  // Swap units
  const swapUnits = () => {
    const tempFrom = fromUnit;
    const tempTo = toUnit;
    const tempFromValue = fromValue;
    const tempToValue = toValue;

    setFromUnit(tempTo);
    setToUnit(tempFrom);
    setFromValue(tempToValue);
    setToValue(tempFromValue);
  };

  // Reset to defaults
  const resetConverter = () => {
    setFromValue('1');
    setFromUnit(Object.keys(unitCategories[category].units)[0]);
    setToUnit(Object.keys(unitCategories[category].units)[1] || Object.keys(unitCategories[category].units)[0]);
  };

  // Get available units for current category
  const getAvailableUnits = () => {
    return Object.keys(unitCategories[category].units);
  };

  // Update units when category changes
  useEffect(() => {
    const units = getAvailableUnits();
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  const currentCategory = unitCategories[category];
  const availableUnits = getAvailableUnits();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Ruler className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Unit Converter</h2>
          <p className="text-slate-600 dark:text-slate-400">Convert between different units of measurement</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
            {Object.entries(unitCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  category === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Converter Interface */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {currentCategory.name} Converter
            </h3>
            <button
              onClick={resetConverter}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* From Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                From
              </label>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                placeholder="Enter value"
              />
            </div>

            {/* From Unit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
              >
                {availableUnits.map(unit => (
                  <option key={unit} value={unit}>
                    {currentCategory.units[unit].symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="Swap units"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* To Unit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
              >
                {availableUnits.map(unit => (
                  <option key={unit} value={unit}>
                    {currentCategory.units[unit].symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="mt-4 p-4 bg-white dark:bg-slate-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {fromValue} {currentCategory.units[fromUnit].symbol} equals
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {toValue} {currentCategory.units[toUnit].symbol}
              </div>
            </div>
          </div>
        </div>

        {/* Unit Reference */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            Available Units
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableUnits.map(unit => (
              <div key={unit} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <span className="font-medium text-slate-900 dark:text-white">
                  {currentCategory.units[unit].name}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                  {currentCategory.units[unit].symbol}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Examples */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Quick Examples
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Length:</strong> 1 meter = 3.28084 feet</p>
            <p><strong>Weight:</strong> 1 kilogram = 2.20462 pounds</p>
            <p><strong>Temperature:</strong> 0°C = 32°F = 273.15K</p>
            <p><strong>Area:</strong> 1 square meter = 10.7639 square feet</p>
            <p><strong>Volume:</strong> 1 liter = 0.264172 gallons</p>
            <p><strong>Speed:</strong> 1 m/s = 3.6 km/h = 2.23694 mph</p>
            <p><strong>Time:</strong> 1 hour = 3600 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
