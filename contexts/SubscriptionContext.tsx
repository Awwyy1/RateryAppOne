import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  isPremium: boolean;
  scanCount: number;
  freeScansLeft: number;
  canScan: boolean;
  incrementScanCount: () => void;
  setPremium: (status: boolean) => void;
  checkoutUrl: string | null;
  setCheckoutUrl: (url: string | null) => void;
}

const FREE_SCANS_LIMIT = 3;

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Load subscription data from localStorage
  useEffect(() => {
    if (user) {
      const savedCount = localStorage.getItem(`ratery_scan_count_${user.uid}`);
      const savedPremium = localStorage.getItem(`ratery_premium_${user.uid}`);

      if (savedCount) {
        setScanCount(parseInt(savedCount, 10));
      }
      if (savedPremium === 'true') {
        setIsPremium(true);
      }
    }
  }, [user]);

  // Calculate free scans left
  const freeScansLeft = Math.max(0, FREE_SCANS_LIMIT - scanCount);
  const canScan = isPremium || freeScansLeft > 0;

  // Increment scan count
  const incrementScanCount = () => {
    if (user && !isPremium) {
      const newCount = scanCount + 1;
      setScanCount(newCount);
      localStorage.setItem(`ratery_scan_count_${user.uid}`, newCount.toString());
    }
  };

  // Set premium status
  const setPremium = (status: boolean) => {
    setIsPremium(status);
    if (user) {
      localStorage.setItem(`ratery_premium_${user.uid}`, status.toString());
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        scanCount,
        freeScansLeft,
        canScan,
        incrementScanCount,
        setPremium,
        checkoutUrl,
        setCheckoutUrl
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
