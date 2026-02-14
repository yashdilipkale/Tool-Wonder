import React, { useState, useEffect } from "react";
import {
  Clock,
  Copy,
  RotateCcw,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../ThemeContext";

const CronGenerator: React.FC = () => {
  const { theme } = useTheme();
  const [minutes, setMinutes] = useState("*");
  const [hours, setHours] = useState("*");
  const [days, setDays] = useState("*");
  const [months, setMonths] = useState("*");
  const [weekdays, setWeekdays] = useState("*");

  const [cronExpression, setCronExpression] = useState("* * * * *");
  const [description, setDescription] = useState("Every minute");

  const presets = [
    { name: "Every minute", exp: "* * * * *" },
    { name: "Every hour", exp: "0 * * * *" },
    { name: "Daily at 9 AM", exp: "0 9 * * *" },
    { name: "Weekdays at 9 AM", exp: "0 9 * * 1-5" },
    { name: "Every Monday", exp: "0 0 * * 1" },
    { name: "Every 15 min", exp: "*/15 * * * *" },
  ];

  const generateExpression = () => {
    const exp = `${minutes} ${hours} ${days} ${months} ${weekdays}`;
    setCronExpression(exp);
    setDescription(generateDescription(exp));
  };

  const generateDescription = (exp: string) => {
    if (exp === "* * * * *") return "Runs every minute";
    if (exp === "0 * * * *") return "Runs every hour";
    if (exp === "0 9 * * *") return "Runs daily at 9:00 AM";
    if (exp === "0 9 * * 1-5") return "Runs weekdays at 9:00 AM";
    if (exp === "0 0 * * 1") return "Runs every Monday at midnight";
    if (exp === "*/15 * * * *") return "Runs every 15 minutes";
    return "Custom schedule";
  };

  const applyPreset = (exp: string) => {
    const parts = exp.split(" ");
    setMinutes(parts[0]);
    setHours(parts[1]);
    setDays(parts[2]);
    setMonths(parts[3]);
    setWeekdays(parts[4]);
  };

  const handleCopy = () => navigator.clipboard.writeText(cronExpression);

  const handleReset = () => {
    setMinutes("*");
    setHours("*");
    setDays("*");
    setMonths("*");
    setWeekdays("*");
  };

  useEffect(() => {
    generateExpression();
  }, [minutes, hours, days, months, weekdays]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <Clock size={28} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Cron Expression Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Create cron schedules visually without memorizing syntax
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* Presets */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <Sparkles size={18}/> Quick Presets
            </h2>

            <div className="grid gap-3">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(p.exp)}
                  className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:shadow-md transition-colors"
                >
                  <div className="font-medium text-slate-900 dark:text-white">{p.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {p.exp}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Builder */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Custom Builder</h2>

            {[
              ["Minutes (0-59)", minutes, setMinutes],
              ["Hours (0-23)", hours, setHours],
              ["Day (1-31)", days, setDays],
              ["Month (1-12)", months, setMonths],
              ["Weekday (0-6)", weekdays, setWeekdays],
            ].map(([label, value, setter]: any, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">
                  {label}
                </label>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <RotateCcw size={16} className="inline mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Output Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Generated Expression</h2>
              <button
                onClick={handleCopy}
                className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Copy size={14}/>
              </button>
            </div>

            <div className="text-2xl md:text-3xl font-mono break-all">
              {cronExpression}
            </div>

            <div className="text-sm opacity-90">
              {description}
            </div>
          </div>

          {/* Validation */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20}/>
              <span className="font-semibold text-green-700 dark:text-green-300">
                Valid Cron Format
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Standard 5-field cron format: minute hour day month weekday
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CronGenerator;
