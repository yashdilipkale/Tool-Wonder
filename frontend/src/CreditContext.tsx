import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserCredits } from './types';

interface CreditContextType {
  credits: UserCredits;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  resetCredits: () => void;
  hasEnoughCredits: (amount: number) => boolean;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};

interface CreditProviderProps {
  children: ReactNode;
}

export const CreditProvider: React.FC<CreditProviderProps> = ({ children }) => {
  // Initialize with no credits - users must purchase plans
  const [credits, setCredits] = useState<UserCredits>({
    current: 0, // No free credits
    totalEarned: 0,
    plan: 'free',
    lastReset: new Date()
  });

  // Load credits from localStorage on mount
  useEffect(() => {
    const savedCredits = localStorage.getItem('userCredits');
    if (savedCredits) {
      try {
        const parsedCredits = JSON.parse(savedCredits);
        // Convert lastReset back to Date object
        parsedCredits.lastReset = new Date(parsedCredits.lastReset);
        setCredits(parsedCredits);
      } catch (error) {
        console.error('Failed to parse saved credits:', error);
      }
    }
  }, []);

  // Save credits to localStorage whenever credits change
  useEffect(() => {
    localStorage.setItem('userCredits', JSON.stringify(credits));
  }, [credits]);

  const deductCredits = (amount: number): boolean => {
    if (credits.current >= amount) {
      setCredits(prev => ({
        ...prev,
        current: prev.current - amount
      }));
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    setCredits(prev => ({
      ...prev,
      current: prev.current + amount,
      totalEarned: prev.totalEarned + amount
    }));
  };

  const resetCredits = () => {
    // Reset based on plan
    const resetAmounts = {
      basic: 2000, // 2000 credits for Basic yearly
      pro: 5000,   // 5000 credits for Pro yearly
      enterprise: 8000 // 8000 credits for Enterprise yearly
    };

    setCredits(prev => ({
      ...prev,
      current: resetAmounts[prev.plan],
      totalEarned: prev.totalEarned + resetAmounts[prev.plan],
      lastReset: new Date()
    }));
  };

  const hasEnoughCredits = (amount: number): boolean => {
    return credits.current >= amount;
  };

  const value: CreditContextType = {
    credits,
    deductCredits,
    addCredits,
    resetCredits,
    hasEnoughCredits
  };

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  );
};
