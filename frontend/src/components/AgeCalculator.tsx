import React, { useState } from 'react';
import { Calendar, Clock, Calculator } from 'lucide-react';

const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = () => {
    if (!dob) {
      setError('Please select your birth date.');
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    // Validate dates
    if (birthDate > today) {
      setError('Birth date cannot be in the future.');
      return;
    }

    setError(null);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    /* Next birthday */
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diff = nextBirthday.getTime() - today.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, daysLeft });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getZodiacSign = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    return 'Capricorn';
  };

  const getChineseZodiac = (year: number) => {
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    return animals[(year - 4) % 12];
  };

  const resetCalculator = () => {
    setDob("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto p-2 space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <Calendar size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Age Calculator</h2>
        </div>

        <div className="space-y-4">
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={calculateAge}
            disabled={!dob}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Calculator size={16} />
            Calculate Age
          </button>

          <button
            onClick={resetCalculator}
            className="w-full px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Reset
          </button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Your Age</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.years} Years {result.months} Months {result.days} Days
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Next Birthday</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  In {result.daysLeft} days
                </p>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                <Clock size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calculate Your Age</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your birth date and click "Calculate Age" to see your age and next birthday.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
