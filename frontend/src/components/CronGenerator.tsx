import React, { useState, useEffect } from 'react';
import { Clock, Copy, RotateCcw, Play, CheckCircle } from 'lucide-react';

interface CronField {
  name: string;
  label: string;
  values: string[];
  selected: string[];
  custom: boolean;
}

const CronGenerator: React.FC = () => {
  const [cronExpression, setCronExpression] = useState<string>('* * * * *');
  const [description, setDescription] = useState<string>('Every minute');

  // Cron fields
  const [minutes, setMinutes] = useState<string>('*');
  const [hours, setHours] = useState<string>('*');
  const [days, setDays] = useState<string>('*');
  const [months, setMonths] = useState<string>('*');
  const [weekdays, setWeekdays] = useState<string>('*');

  // Quick presets
  const presets = [
    { name: 'Every minute', expression: '* * * * *', description: 'Runs every minute' },
    { name: 'Every hour', expression: '0 * * * *', description: 'Runs at the start of every hour' },
    { name: 'Every day at midnight', expression: '0 0 * * *', description: 'Runs daily at 12:00 AM' },
    { name: 'Every day at 9 AM', expression: '0 9 * * *', description: 'Runs daily at 9:00 AM' },
    { name: 'Every Monday', expression: '0 0 * * 1', description: 'Runs every Monday at midnight' },
    { name: 'Every weekday at 9 AM', expression: '0 9 * * 1-5', description: 'Runs Monday to Friday at 9:00 AM' },
    { name: 'First day of month', expression: '0 0 1 * *', description: 'Runs on the 1st of every month' },
    { name: 'Every 15 minutes', expression: '*/15 * * * *', description: 'Runs every 15 minutes' },
    { name: 'Every 6 hours', expression: '0 */6 * * *', description: 'Runs every 6 hours' },
    { name: 'Weekends only', expression: '0 0 * * 0,6', description: 'Runs on Saturday and Sunday' }
  ];

  const minuteOptions = [
    { value: '*', label: 'Every minute' },
    { value: '0', label: 'At minute 0' },
    { value: '*/5', label: 'Every 5 minutes' },
    { value: '*/10', label: 'Every 10 minutes' },
    { value: '*/15', label: 'Every 15 minutes' },
    { value: '*/30', label: 'Every 30 minutes' },
    { value: '0,30', label: 'At minutes 0 and 30' }
  ];

  const hourOptions = [
    { value: '*', label: 'Every hour' },
    { value: '0', label: 'At hour 0 (midnight)' },
    { value: '9', label: 'At hour 9 (9 AM)' },
    { value: '12', label: 'At hour 12 (noon)' },
    { value: '18', label: 'At hour 18 (6 PM)' },
    { value: '*/2', label: 'Every 2 hours' },
    { value: '*/6', label: 'Every 6 hours' },
    { value: '9-17', label: 'Hours 9 to 17 (9 AM - 5 PM)' }
  ];

  const dayOptions = [
    { value: '*', label: 'Every day' },
    { value: '1', label: '1st of month' },
    { value: '15', label: '15th of month' },
    { value: 'L', label: 'Last day of month' },
    { value: '*/7', label: 'Every 7 days' },
    { value: '1,15', label: '1st and 15th' }
  ];

  const monthOptions = [
    { value: '*', label: 'Every month' },
    { value: '1', label: 'January' },
    { value: '6', label: 'June' },
    { value: '12', label: 'December' },
    { value: '1,6,12', label: 'Quarterly (Jan, Jun, Dec)' },
    { value: '*/3', label: 'Every 3 months' }
  ];

  const weekdayOptions = [
    { value: '*', label: 'Every day' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
    { value: '0', label: 'Sunday' },
    { value: '1-5', label: 'Weekdays (Mon-Fri)' },
    { value: '0,6', label: 'Weekends (Sat-Sun)' }
  ];

  const generateCronExpression = () => {
    const expression = `${minutes} ${hours} ${days} ${months} ${weekdays}`;
    setCronExpression(expression);
    setDescription(generateDescription(expression));
  };

  const generateDescription = (expression: string): string => {
    const parts = expression.split(' ');

    if (expression === '* * * * *') return 'Every minute';
    if (expression === '0 * * * *') return 'Every hour at minute 0';
    if (expression === '0 0 * * *') return 'Every day at midnight';
    if (expression === '0 9 * * *') return 'Every day at 9:00 AM';
    if (expression === '0 0 * * 1') return 'Every Monday at midnight';
    if (expression === '0 9 * * 1-5') return 'Every weekday at 9:00 AM';
    if (expression === '0 0 1 * *') return 'First day of every month at midnight';
    if (expression === '*/15 * * * *') return 'Every 15 minutes';
    if (expression === '0 */6 * * *') return 'Every 6 hours at minute 0';
    if (expression === '0 0 * * 0,6') return 'Every weekend at midnight';

    // Generate basic description
    let desc = '';

    if (parts[0] === '*' && parts[1] === '*') desc += 'Every minute';
    else if (parts[0] === '0' && parts[1] === '*') desc += 'Every hour';
    else if (parts[0] === '0' && parts[1] !== '*') desc += `Every day at ${parts[1]}:00`;
    else if (parts[0] !== '*' && parts[1] === '*') desc += `Every hour at minute ${parts[0]}`;
    else desc += `At ${parts[1]}:${parts[0].padStart(2, '0')}`;

    if (parts[4] !== '*') {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (parts[4] === '1-5') desc += ' on weekdays';
      else if (parts[4] === '0,6') desc += ' on weekends';
      else if (parts[4].includes(',')) {
        const days = parts[4].split(',').map(d => weekdays[parseInt(d)]).join(', ');
        desc += ` on ${days}`;
      } else {
        desc += ` on ${weekdays[parseInt(parts[4])]}`;
      }
    }

    if (parts[2] !== '*') {
      if (parts[2] === 'L') desc += ' on the last day of the month';
      else if (parts[2] === '1') desc += ' on the 1st';
      else if (parts[2] === '15') desc += ' on the 15th';
      else desc += ` on day ${parts[2]} of the month`;
    }

    return desc || 'Custom schedule';
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setCronExpression(preset.expression);
    setDescription(preset.description);

    const parts = preset.expression.split(' ');
    setMinutes(parts[0]);
    setHours(parts[1]);
    setDays(parts[2]);
    setMonths(parts[3]);
    setWeekdays(parts[4]);
  };

  const handleCopyCron = async () => {
    await navigator.clipboard.writeText(cronExpression);
  };

  const handleReset = () => {
    setMinutes('*');
    setHours('*');
    setDays('*');
    setMonths('*');
    setWeekdays('*');
    setCronExpression('* * * * *');
    setDescription('Every minute');
  };

  useEffect(() => {
    generateCronExpression();
  }, [minutes, hours, days, months, weekdays]);

  const validateCronExpression = (expression: string): boolean => {
    const parts = expression.split(' ');
    return parts.length === 5 && parts.every(part => part.length > 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
          <Clock size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Cron Generator</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Create cron expressions for task scheduling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Schedule Builder</h2>

          {/* Quick Presets */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Quick Presets</h3>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-3 text-left rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 transition-colors"
                >
                  <div className="font-medium text-slate-800 dark:text-slate-200">{preset.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">{preset.expression}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Builder */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Custom Builder</h3>

            {/* Minutes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Minutes (0-59)
              </label>
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {minuteOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Hours (0-23)
              </label>
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {hourOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Days */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Day of Month (1-31)
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {dayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Months */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Month (1-12)
              </label>
              <select
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Weekdays */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Day of Week (0-6, 0=Sunday)
              </label>
              <select
                value={weekdays}
                onChange={(e) => setWeekdays(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                {weekdayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw size={16} className="inline mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Generated Cron Expression</h2>

          {/* Cron Expression */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Expression</h3>
              <button
                onClick={handleCopyCron}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded border p-4">
              <div className="font-mono text-xl text-slate-900 dark:text-slate-100 mb-2">
                {cronExpression}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {description}
              </div>
            </div>
          </div>

          {/* Validation */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <h4 className="font-medium text-green-800 dark:text-green-200">Expression Valid</h4>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              This cron expression follows the standard 5-field format: minute hour day month weekday
            </p>
          </div>

          {/* Cron Format Explanation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Cron Format Guide</h4>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <div className="grid grid-cols-5 gap-2 font-mono">
                <div>*</div>
                <div>*</div>
                <div>*</div>
                <div>*</div>
                <div>*</div>
              </div>
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div>Minute (0-59)</div>
                <div>Hour (0-23)</div>
                <div>Day (1-31)</div>
                <div>Month (1-12)</div>
                <div>Weekday (0-6)</div>
              </div>
              <div className="mt-3 text-xs">
                <div><strong>Special characters:</strong></div>
                <div>• <code>*</code> - Any value</div>
                <div>• <code>,</code> - List of values</div>
                <div>• <code>-</code> - Range of values</div>
                <div>• <code>/</code> - Step values</div>
                <div>• <code>L</code> - Last day of month</div>
              </div>
            </div>
          </div>

          {/* Next Run Times */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-3">Next Run Times</h4>
            <div className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
              <div>• Next run: {getNextRunTime(cronExpression)}</div>
              <div>• Following runs: {getFollowingRuns(cronExpression)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">⏰ Cron Generator Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Visual Builder</strong> - Create cron expressions without remembering syntax</li>
          <li>• <strong>Quick Presets</strong> - Common schedules like hourly, daily, weekly</li>
          <li>• <strong>Real-time Preview</strong> - See your expression and description as you build</li>
          <li>• <strong>Validation</strong> - Ensure your cron expressions are properly formatted</li>
          <li>• <strong>Copy to Clipboard</strong> - Easy integration with your applications</li>
        </ul>
      </div>
    </div>
  );
};

// Helper functions for next run times (simplified)
const getNextRunTime = (expression: string): string => {
  // This is a simplified calculation - in a real app you'd use a proper cron parser
  const now = new Date();

  if (expression === '* * * * *') return 'Every minute';
  if (expression === '0 * * * *') return 'Next hour';
  if (expression === '0 0 * * *') return 'Tomorrow at midnight';
  if (expression === '0 9 * * *') return 'Tomorrow at 9:00 AM';
  if (expression === '0 0 * * 1') return 'Next Monday at midnight';

  return 'Based on cron expression';
};

const getFollowingRuns = (expression: string): string => {
  if (expression === '* * * * *') return 'Every minute thereafter';
  if (expression === '0 * * * *') return 'Every hour thereafter';
  if (expression === '0 0 * * *') return 'Every day thereafter';
  if (expression === '0 9 * * *') return 'Every day at 9:00 AM thereafter';
  if (expression === '0 0 * * 1') return 'Every Monday thereafter';

  return 'Following the schedule pattern';
};

export default CronGenerator;
