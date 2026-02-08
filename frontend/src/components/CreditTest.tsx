import React, { useState } from 'react';
import { useCredits } from '../CreditContext';
import { useAuth } from '../AuthContext';
import { Coins, Plus, Minus, User } from 'lucide-react';

const CreditTest: React.FC = () => {
  const { credits, addCredits, deductCredits, hasEnoughCredits, resetCredits } = useCredits();
  const { user, login, logout } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('test123');

  const handleTestLogin = async () => {
    // Try to login with test credentials
    const result = await login(testEmail, testPassword);
    if (!result.success) {
      // If login fails, try to signup first
      const signupResult = await login(testEmail, testPassword); // This should be signup, but let's test with login for now
      console.log('Signup result:', signupResult);
    }
  };

  const handleAddCredits = () => {
    addCredits(50);
  };

  const handleDeductCredits = () => {
    const success = deductCredits(10);
    console.log('Deduction result:', success);
  };

  const handleResetCredits = () => {
    resetCredits();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Credit System Test</h1>
      
      {/* User Status */}
      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">User Status</h2>
        {user ? (
          <div className="flex items-center gap-3">
            <User size={24} className="text-green-600" />
            <span className="text-green-600 font-medium">Logged in: {user.email}</span>
            <button
              onClick={logout}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <User size={24} className="text-red-600" />
            <span className="text-red-600 font-medium">Not logged in</span>
            <button
              onClick={handleTestLogin}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Login
            </button>
          </div>
        )}
      </div>

      {/* Credit Display */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Credit Balance</h2>
        <div className="flex items-center gap-4 text-2xl font-bold text-purple-700 dark:text-purple-300">
          <Coins size={32} />
          <span>{credits.current} Credits</span>
        </div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Total Earned: {credits.totalEarned} | Plan: {credits.plan} | Last Reset: {credits.lastReset.toLocaleString()}
        </div>
      </div>

      {/* Credit Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleAddCredits}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          Add 50 Credits
        </button>

        <button
          onClick={handleDeductCredits}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Minus size={20} />
          Deduct 10 Credits
        </button>

        <button
          onClick={handleResetCredits}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Coins size={20} />
          Reset Credits
        </button>
      </div>

      {/* Credit Check Test */}
      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Credit Check Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <span className="text-sm text-slate-600 dark:text-slate-300">Need 5 credits:</span>
            <div className={`mt-1 font-semibold ${hasEnoughCredits(5) ? 'text-green-600' : 'text-red-600'}`}>
              {hasEnoughCredits(5) ? '✓ PASS' : '✗ FAIL'}
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-slate-600 dark:text-slate-300">Need 50 credits:</span>
            <div className={`mt-1 font-semibold ${hasEnoughCredits(50) ? 'text-green-600' : 'text-red-600'}`}>
              {hasEnoughCredits(50) ? '✓ PASS' : '✗ FAIL'}
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-slate-600 dark:text-slate-300">Need 1000 credits:</span>
            <div className={`mt-1 font-semibold ${hasEnoughCredits(1000) ? 'text-green-600' : 'text-red-600'}`}>
              {hasEnoughCredits(1000) ? '✓ PASS' : '✗ FAIL'}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Test Instructions:</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>1. Click "Test Login" to create a test user account</li>
          <li>2. Use the credit buttons to test the credit system</li>
          <li>3. Check the credit balance updates in real-time</li>
          <li>4. Test the credit check functionality</li>
          <li>5. Verify credits are saved to localStorage</li>
        </ul>
      </div>
    </div>
  );
};

export default CreditTest;