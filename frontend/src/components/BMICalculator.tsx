import React, { useState } from 'react';
import { Activity, Calculator, Scale, Crown } from 'lucide-react';

export const calculateBMIAdvanced = (weight, height) => {
  const bmi = weight / (height * height);
  let category = "";
  let suggestion = "";

  if (bmi < 18.5) {
    category = "Underweight";
    suggestion = "Increase calorie intake and maintain balanced diet.";
  } 
  else if (bmi < 25) {
    category = "Normal";
    suggestion = "Maintain healthy lifestyle and balanced diet.";
  } 
  else if (bmi < 30) {
    category = "Overweight";
    suggestion = "Regular exercise and healthy diet recommended.";
  } 
  else {
    category = "Obese";
    suggestion = "Consult doctor and start weight management plan.";
  }

  return {
    bmi: bmi.toFixed(2),
    category,
    suggestion
  };
};

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    description: string;
    color: string;
    healthyRange: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateBMI = () => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!heightNum || !weightNum || heightNum <= 0 || weightNum <= 0) {
      setError('Please enter valid height and weight values.');
      return;
    }

    setError(null);

    let bmi: number;

    if (unit === 'metric') {
      // BMI = weight (kg) / [height (m)]²
      const heightInMeters = heightNum / 100;
      bmi = weightNum / (heightInMeters * heightInMeters);
    } else {
      // BMI = 703 × weight (lbs) / [height (in)]²
      bmi = 703 * weightNum / (heightNum * heightNum);
    }

    const roundedBMI = Math.round(bmi * 10) / 10;
    const category = getBMICategory(roundedBMI);
    const result = {
      bmi: roundedBMI,
      ...category
    };

    setBmiResult(result);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) {
      return {
        category: 'Underweight',
        description: 'You may be underweight. Consider consulting a healthcare professional.',
        color: 'text-blue-600 dark:text-blue-400',
        healthyRange: unit === 'metric' ? '18.5 - 24.9 kg/m²' : '18.5 - 24.9 lbs/in²'
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: 'Normal Weight',
        description: 'You are in the healthy weight range. Keep up the good work!',
        color: 'text-green-600 dark:text-green-400',
        healthyRange: unit === 'metric' ? '18.5 - 24.9 kg/m²' : '18.5 - 24.9 lbs/in²'
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: 'Overweight',
        description: 'You may be overweight. Consider lifestyle changes or consult a healthcare professional.',
        color: 'text-yellow-600 dark:text-yellow-400',
        healthyRange: unit === 'metric' ? '18.5 - 24.9 kg/m²' : '18.5 - 24.9 lbs/in²'
      };
    } else {
      return {
        category: 'Obese',
        description: 'You may be obese. Please consult a healthcare professional for guidance.',
        color: 'text-red-600 dark:text-red-400',
        healthyRange: unit === 'metric' ? '18.5 - 24.9 kg/m²' : '18.5 - 24.9 lbs/in²'
      };
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setBmiResult(null);
    setError(null);
  };

  const getIdealWeightRange = () => {
    if (!bmiResult || !height) return null;

    const heightNum = parseFloat(height);
    let minWeight: number, maxWeight: number;

    if (unit === 'metric') {
      const heightInMeters = heightNum / 100;
      minWeight = 18.5 * (heightInMeters * heightInMeters);
      maxWeight = 24.9 * (heightInMeters * heightInMeters);
    } else {
      minWeight = (18.5 * heightNum * heightNum) / 703;
      maxWeight = (24.9 * heightNum * heightNum) / 703;
    }

    return {
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10,
      unit: unit === 'metric' ? 'kg' : 'lbs'
    };
  };

  const idealWeight = getIdealWeightRange();

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Activity size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">BMI Calculator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Units
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="unit"
                    value="metric"
                    checked={unit === 'metric'}
                    onChange={(e) => setUnit(e.target.value as 'metric')}
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Metric (kg, cm)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="unit"
                    value="imperial"
                    checked={unit === 'imperial'}
                    onChange={(e) => setUnit(e.target.value as 'imperial')}
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Imperial (lbs, in)</span>
                </label>
              </div>
            </div>

            {/* Height Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={`Enter height in ${unit === 'metric' ? 'centimeters' : 'inches'}`}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={`Enter weight in ${unit === 'metric' ? 'kilograms' : 'pounds'}`}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateBMI}
                disabled={!height || !weight}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator size={16} />
                Calculate BMI
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
            {bmiResult && (
              <div className="space-y-4">
                {/* BMI Result */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {bmiResult.bmi}
                  </div>
                  <div className="text-lg text-blue-800 dark:text-blue-200 mb-4">BMI Score</div>
                  <div className={`text-xl font-semibold ${bmiResult.color}`}>
                    {bmiResult.category}
                  </div>
                </div>

                {/* Category Description */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Assessment</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{bmiResult.description}</p>
                </div>

                {/* Healthy Range */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Healthy BMI Range</h3>
                  <p className="text-sm text-green-800 dark:text-green-200">{bmiResult.healthyRange}</p>
                </div>

                {/* Ideal Weight Range */}
                {idealWeight && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Healthy Weight Range</h3>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {idealWeight.min} - {idealWeight.max} {idealWeight.unit}
                      </div>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                        for your height
                      </p>
                    </div>
                  </div>
                )}

                {/* BMI Categories Reference */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">BMI Categories</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Underweight:</span>
                      <span className="text-blue-600 dark:text-blue-400">{'<'} 18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Normal:</span>
                      <span className="text-green-600 dark:text-green-400">18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Overweight:</span>
                      <span className="text-yellow-600 dark:text-yellow-400">25 - 29.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Obese:</span>
                      <span className="text-red-600 dark:text-red-400">{'>='} 30</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!bmiResult && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <Scale size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calculate Your BMI</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter your height and weight to calculate your Body Mass Index and get health insights.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Medical Disclaimer</h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            BMI is a general indicator and may not be accurate for athletes, pregnant women, the elderly, or certain ethnic groups.
            Always consult with a healthcare professional for personalized health advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
