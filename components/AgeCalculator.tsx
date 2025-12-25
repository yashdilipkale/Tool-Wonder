import React, { useState } from 'react';
import { Calendar, Clock, Calculator } from 'lucide-react';

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = () => {
    if (!birthDate) {
      setError('Please select your birth date.');
      return;
    }

    const birth = new Date(birthDate);
    const current = new Date(currentDate);

    // Validate dates
    if (birth > current) {
      setError('Birth date cannot be in the future.');
      return;
    }

    setError(null);

    // Calculate age
    let years = current.getFullYear() - birth.getFullYear();
    let months = current.getMonth() - birth.getMonth();
    let days = current.getDate() - birth.getDate();

    // Adjust for negative months or days
    if (days < 0) {
      months--;
      // Get the number of days in the previous month
      const lastMonth = new Date(current.getFullYear(), current.getMonth() - 1, 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total time lived
    const timeDiff = current.getTime() - birth.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));

    setAgeResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes
    });
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
    setBirthDate('');
    setCurrentDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    setAgeResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <Calendar size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Age Calculator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Date
              </label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateAge}
                disabled={!birthDate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator size={16} />
                Calculate Age
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
            {ageResult && (
              <div className="space-y-4">
                {/* Age Breakdown */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Your Age</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ageResult.years}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Years</div>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ageResult.months}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Months</div>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ageResult.days}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Days</div>
                    </div>
                  </div>
                </div>

                {/* Total Time */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Total Time Lived</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Days:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{ageResult.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Hours:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{ageResult.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-200">Minutes:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">{ageResult.totalMinutes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Fun Facts */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">Fun Facts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-800 dark:text-purple-200">Birth Date:</span>
                      <span className="font-semibold text-purple-900 dark:text-purple-100">{formatDate(birthDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-800 dark:text-purple-200">Zodiac Sign:</span>
                      <span className="font-semibold text-purple-900 dark:text-purple-100">{getZodiacSign(birthDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-800 dark:text-purple-200">Chinese Zodiac:</span>
                      <span className="font-semibold text-purple-900 dark:text-purple-100">{getChineseZodiac(new Date(birthDate).getFullYear())}</span>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">Upcoming Milestones</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-800 dark:text-orange-200">Next Birthday:</span>
                      <span className="font-semibold text-orange-900 dark:text-orange-100">
                        {(() => {
                          const birth = new Date(birthDate);
                          const current = new Date(currentDate);
                          const nextBirthday = new Date(current.getFullYear(), birth.getMonth(), birth.getDate());

                          if (nextBirthday < current) {
                            nextBirthday.setFullYear(current.getFullYear() + 1);
                          }

                          const diffTime = nextBirthday.getTime() - current.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return `${diffDays} days`;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-800 dark:text-orange-200">Next Decade:</span>
                      <span className="font-semibold text-orange-900 dark:text-orange-100">
                        {Math.ceil((ageResult.years + 1) / 10) * 10 - ageResult.years} years
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!ageResult && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <Clock size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Calculate Your Age</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter your birth date and click "Calculate Age" to see detailed age information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
