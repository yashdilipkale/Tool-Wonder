import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Plus, X, RefreshCw } from 'lucide-react';

interface TimeZone {
  name: string;
  city: string;
  offset: number; // offset from UTC in hours
  abbreviation: string;
  country: string;
}

const TimeZoneConverter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [baseTimezone, setBaseTimezone] = useState('UTC');
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']);
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);

  // Comprehensive timezone data
  const timezones: Record<string, TimeZone> = {
    'UTC': { name: 'UTC', city: 'Coordinated Universal Time', offset: 0, abbreviation: 'UTC', country: 'Global' },
    'America/New_York': { name: 'Eastern Time', city: 'New York', offset: -5, abbreviation: 'EST/EDT', country: 'United States' },
    'America/Chicago': { name: 'Central Time', city: 'Chicago', offset: -6, abbreviation: 'CST/CDT', country: 'United States' },
    'America/Denver': { name: 'Mountain Time', city: 'Denver', offset: -7, abbreviation: 'MST/MDT', country: 'United States' },
    'America/Los_Angeles': { name: 'Pacific Time', city: 'Los Angeles', offset: -8, abbreviation: 'PST/PDT', country: 'United States' },
    'America/Anchorage': { name: 'Alaska Time', city: 'Anchorage', offset: -9, abbreviation: 'AKST/AKDT', country: 'United States' },
    'Pacific/Honolulu': { name: 'Hawaii Time', city: 'Honolulu', offset: -10, abbreviation: 'HST', country: 'United States' },
    'Europe/London': { name: 'Greenwich Mean Time', city: 'London', offset: 0, abbreviation: 'GMT/BST', country: 'United Kingdom' },
    'Europe/Paris': { name: 'Central European Time', city: 'Paris', offset: 1, abbreviation: 'CET/CEST', country: 'France' },
    'Europe/Berlin': { name: 'Central European Time', city: 'Berlin', offset: 1, abbreviation: 'CET/CEST', country: 'Germany' },
    'Europe/Rome': { name: 'Central European Time', city: 'Rome', offset: 1, abbreviation: 'CET/CEST', country: 'Italy' },
    'Europe/Madrid': { name: 'Central European Time', city: 'Madrid', offset: 1, abbreviation: 'CET/CEST', country: 'Spain' },
    'Europe/Amsterdam': { name: 'Central European Time', city: 'Amsterdam', offset: 1, abbreviation: 'CET/CEST', country: 'Netherlands' },
    'Europe/Moscow': { name: 'Moscow Time', city: 'Moscow', offset: 3, abbreviation: 'MSK', country: 'Russia' },
    'Asia/Dubai': { name: 'Gulf Standard Time', city: 'Dubai', offset: 4, abbreviation: 'GST', country: 'United Arab Emirates' },
    'Asia/Kolkata': { name: 'India Standard Time', city: 'Kolkata', offset: 5.5, abbreviation: 'IST', country: 'India' },
    'Asia/Dhaka': { name: 'Bangladesh Time', city: 'Dhaka', offset: 6, abbreviation: 'BST', country: 'Bangladesh' },
    'Asia/Bangkok': { name: 'Indochina Time', city: 'Bangkok', offset: 7, abbreviation: 'ICT', country: 'Thailand' },
    'Asia/Singapore': { name: 'Singapore Time', city: 'Singapore', offset: 8, abbreviation: 'SGT', country: 'Singapore' },
    'Asia/Shanghai': { name: 'China Standard Time', city: 'Shanghai', offset: 8, abbreviation: 'CST', country: 'China' },
    'Asia/Tokyo': { name: 'Japan Standard Time', city: 'Tokyo', offset: 9, abbreviation: 'JST', country: 'Japan' },
    'Asia/Seoul': { name: 'Korea Standard Time', city: 'Seoul', offset: 9, abbreviation: 'KST', country: 'South Korea' },
    'Australia/Sydney': { name: 'Australian Eastern Time', city: 'Sydney', offset: 10, abbreviation: 'AEST/AEDT', country: 'Australia' },
    'Australia/Melbourne': { name: 'Australian Eastern Time', city: 'Melbourne', offset: 10, abbreviation: 'AEST/AEDT', country: 'Australia' },
    'Australia/Perth': { name: 'Australian Western Time', city: 'Perth', offset: 8, abbreviation: 'AWST', country: 'Australia' },
    'Pacific/Auckland': { name: 'New Zealand Time', city: 'Auckland', offset: 12, abbreviation: 'NZST/NZDT', country: 'New Zealand' },
    'America/Sao_Paulo': { name: 'Brasília Time', city: 'São Paulo', offset: -3, abbreviation: 'BRT', country: 'Brazil' },
    'America/Mexico_City': { name: 'Central Time', city: 'Mexico City', offset: -6, abbreviation: 'CST/CDT', country: 'Mexico' },
    'America/Toronto': { name: 'Eastern Time', city: 'Toronto', offset: -5, abbreviation: 'EST/EDT', country: 'Canada' },
    'America/Vancouver': { name: 'Pacific Time', city: 'Vancouver', offset: -8, abbreviation: 'PST/PDT', country: 'Canada' },
    'Africa/Cairo': { name: 'Eastern European Time', city: 'Cairo', offset: 2, abbreviation: 'EET', country: 'Egypt' },
    'Africa/Johannesburg': { name: 'South Africa Time', city: 'Johannesburg', offset: 2, abbreviation: 'SAST', country: 'South Africa' },
    'Asia/Jakarta': { name: 'Western Indonesian Time', city: 'Jakarta', offset: 7, abbreviation: 'WIB', country: 'Indonesia' },
    'Asia/Karachi': { name: 'Pakistan Standard Time', city: 'Karachi', offset: 5, abbreviation: 'PKT', country: 'Pakistan' }
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get time for a specific timezone
  const getTimeForTimezone = (timezoneKey: string): Date => {
    if (useCustomTime && customTime) {
      // Use custom time as base
      const baseTime = new Date(customTime);
      const offset = timezones[timezoneKey]?.offset || 0;
      return new Date(baseTime.getTime() + (offset * 60 * 60 * 1000));
    } else {
      // Use current time
      const offset = timezones[timezoneKey]?.offset || 0;
      return new Date(currentTime.getTime() + (offset * 60 * 60 * 1000));
    }
  };

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get time difference from base timezone
  const getTimeDifference = (timezoneKey: string): string => {
    const baseOffset = timezones[baseTimezone]?.offset || 0;
    const targetOffset = timezones[timezoneKey]?.offset || 0;
    const diff = targetOffset - baseOffset;

    if (diff === 0) return '';
    const sign = diff > 0 ? '+' : '';
    const hours = Math.floor(Math.abs(diff));
    const minutes = Math.round((Math.abs(diff) - hours) * 60);

    if (minutes === 0) {
      return `${sign}${hours}h`;
    }
    return `${sign}${hours}h ${minutes}m`;
  };

  // Add a timezone
  const addTimezone = (timezoneKey: string) => {
    if (!selectedTimezones.includes(timezoneKey)) {
      setSelectedTimezones([...selectedTimezones, timezoneKey]);
    }
  };

  // Remove a timezone
  const removeTimezone = (timezoneKey: string) => {
    if (selectedTimezones.length > 1) {
      setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezoneKey));
    }
  };

  // Get available timezones to add
  const getAvailableTimezones = () => {
    return Object.keys(timezones).filter(tz => !selectedTimezones.includes(tz));
  };

  // Group timezones by region
  const groupTimezonesByRegion = () => {
    const groups: Record<string, string[]> = {};
    Object.keys(timezones).forEach(tz => {
      const region = tz.split('/')[0];
      if (!groups[region]) groups[region] = [];
      groups[region].push(tz);
    });
    return groups;
  };

  const timezoneGroups = groupTimezonesByRegion();
  const availableTimezones = getAvailableTimezones();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Time Zone Converter</h2>
          <p className="text-slate-600 dark:text-slate-400">Convert time between different time zones</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Time Display */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Current Time</h3>
            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomTime}
                  onChange={(e) => setUseCustomTime(e.target.checked)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Use custom time</span>
              </label>
            </div>
          </div>

          {useCustomTime ? (
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
              />
              <button
                onClick={() => setCustomTime(new Date().toISOString().slice(0, 16))}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Now
              </button>
            </div>
          ) : (
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(currentTime)}
            </div>
          )}
        </div>

        {/* Base Timezone Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Base Time Zone (Reference)
          </label>
          <select
            value={baseTimezone}
            onChange={(e) => setBaseTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            {selectedTimezones.map(tz => (
              <option key={tz} value={tz}>
                {timezones[tz]?.city} ({timezones[tz]?.abbreviation})
              </option>
            ))}
          </select>
        </div>

        {/* Timezone Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Time Zones</h3>
            <button
              onClick={() => setSelectedTimezones(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'])}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {selectedTimezones.map(timezoneKey => {
            const timezone = timezones[timezoneKey];
            if (!timezone) return null;

            const time = getTimeForTimezone(timezoneKey);
            const timeDiff = getTimeDifference(timezoneKey);
            const isBase = timezoneKey === baseTimezone;

            return (
              <div
                key={timezoneKey}
                className={`relative p-4 rounded-lg border transition-colors ${
                  isBase
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {timezone.city}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        ({timezone.country})
                      </span>
                      {isBase && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded">
                          Base
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatTime(time)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(time)}
                      </div>
                      {timeDiff && (
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {timeDiff}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {timezone.name} ({timezone.abbreviation})
                    </div>
                  </div>

                  {!isBase && selectedTimezones.length > 1 && (
                    <button
                      onClick={() => removeTimezone(timezoneKey)}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Remove timezone"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Timezone */}
        {availableTimezones.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Add Time Zone</h3>
            <div className="space-y-3">
              {Object.entries(timezoneGroups).map(([region, timezonesInRegion]) => (
                <div key={region}>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 capitalize">
                    {region.replace('_', ' ')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {timezonesInRegion
                      .filter(tz => availableTimezones.includes(tz))
                      .map(tz => (
                        <button
                          key={tz}
                          onClick={() => addTimezone(tz)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                          {timezones[tz]?.city}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* World Clock Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Time Zone Tips</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>UTC</strong> is the primary time standard worldwide</p>
            <p><strong>DST</strong> (Daylight Saving Time) affects many regions</p>
            <p><strong>Offsets</strong> show hours ahead (+) or behind (-) UTC</p>
            <p><strong>Abbreviations</strong> may change with DST (EST/EDT)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;
