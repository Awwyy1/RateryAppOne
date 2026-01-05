import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type PlanType = 'free' | 'premium' | 'pro';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanInfo {
  id: PlanType;
  name: string;
  level: string;
  prices: { monthly: string; yearly: string };
  scansLimit: number | 'unlimited';
  features: string[];
  productIds?: { monthly?: string; yearly?: string };
  popular?: boolean;
  bestValue?: boolean;
}

export const PLANS: PlanInfo[] = [
  {
    id: 'free',
    name: 'Free',
    level: 'LEVEL 1',
    prices: { monthly: '$0', yearly: '$0' },
    scansLimit: 1,
    features: [
      '1 DNA Scan',
      '3 DNA Markers',
      'Basic Analysis',
      'Social DNA Score'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    level: 'LEVEL 2',
    prices: { monthly: '$4.99', yearly: '$38.99' },
    scansLimit: 49,
    features: [
      '49 Scans per Month',
      '7 DNA Markers',
      'Detailed Analytics',
      'Tier Rankings',
      'History & Insights'
    ],
    productIds: {
      monthly: 'prod_3vXfS9qVc8XM8PkK8Cb2Mx',
      yearly: 'prod_Y33LqGJyK35FUiJ5sb74V'
    },
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    level: 'LEVEL 3',
    prices: { monthly: '$6.99', yearly: '$54.99' },
    scansLimit: 'unlimited',
    features: [
      'Unlimited Scans',
      '16 DNA Markers',
      'All Premium Features',
      'Early Access',
      'Exclusive DNA Cards'
    ],
    productIds: {
      monthly: 'prod_2oVK1PibW3x3o1ZviEIfsI',
      yearly: 'prod_12zU7JgI8i47pxfkyfPKLg'
    },
    bestValue: true
  }
];

interface SubscriptionContextType {
  currentPlan: PlanType;
  isPremium: boolean;
  isPro: boolean;
  scanCount: number;
  monthlyScansUsed: number;
  scansLeft: number | 'unlimited';
  canScan: boolean;
  incrementScanCount: () => void;
  setPlan: (plan: PlanType) => void;
  setPremium: (status: boolean) => void; // Legacy support
  getCurrentPlanInfo: () => PlanInfo;
}

const FREE_SCANS_LIMIT = 1;
const PREMIUM_MONTHLY_LIMIT = 49;

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
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [scanCount, setScanCount] = useState(0); // Total scans ever
  const [monthlyScansUsed, setMonthlyScansUsed] = useState(0); // Scans this month
  const [lastResetMonth, setLastResetMonth] = useState<string>('');

  // Load subscription data from localStorage
  useEffect(() => {
    if (user) {
      const savedPlan = localStorage.getItem(`ratery_plan_${user.uid}`) as PlanType | null;
      const savedCount = localStorage.getItem(`ratery_scan_count_${user.uid}`);
      const savedMonthly = localStorage.getItem(`ratery_monthly_scans_${user.uid}`);
      const savedResetMonth = localStorage.getItem(`ratery_reset_month_${user.uid}`);

      // Legacy support: check old premium flag
      const legacyPremium = localStorage.getItem(`ratery_premium_${user.uid}`);

      if (savedPlan) {
        setCurrentPlan(savedPlan);
      } else if (legacyPremium === 'true') {
        setCurrentPlan('premium');
      }

      if (savedCount) {
        setScanCount(parseInt(savedCount, 10));
      }

      // Check if we need to reset monthly scans (new month)
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      if (savedResetMonth !== currentMonth) {
        // New month - reset monthly counter
        setMonthlyScansUsed(0);
        localStorage.setItem(`ratery_monthly_scans_${user.uid}`, '0');
        localStorage.setItem(`ratery_reset_month_${user.uid}`, currentMonth);
        setLastResetMonth(currentMonth);
      } else {
        if (savedMonthly) {
          setMonthlyScansUsed(parseInt(savedMonthly, 10));
        }
        setLastResetMonth(savedResetMonth || currentMonth);
      }
    }
  }, [user]);

  // Calculate scans left based on plan
  const isPremium = currentPlan === 'premium' || currentPlan === 'pro';
  const isPro = currentPlan === 'pro';

  const scansLeft: number | 'unlimited' = (() => {
    if (currentPlan === 'pro') return 'unlimited';
    if (currentPlan === 'premium') return Math.max(0, PREMIUM_MONTHLY_LIMIT - monthlyScansUsed);
    return Math.max(0, FREE_SCANS_LIMIT - scanCount);
  })();

  const canScan = scansLeft === 'unlimited' || scansLeft > 0;

  // For backwards compatibility with header display
  const freeScansLeft = currentPlan === 'free' ? Math.max(0, FREE_SCANS_LIMIT - scanCount) : 0;

  // Increment scan count
  const incrementScanCount = () => {
    if (!user) return;

    const newTotalCount = scanCount + 1;
    setScanCount(newTotalCount);
    localStorage.setItem(`ratery_scan_count_${user.uid}`, newTotalCount.toString());

    if (currentPlan === 'premium') {
      const newMonthly = monthlyScansUsed + 1;
      setMonthlyScansUsed(newMonthly);
      localStorage.setItem(`ratery_monthly_scans_${user.uid}`, newMonthly.toString());
    }
  };

  // Set plan
  const setPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    if (user) {
      localStorage.setItem(`ratery_plan_${user.uid}`, plan);
      // Also set legacy flag for backwards compatibility
      localStorage.setItem(`ratery_premium_${user.uid}`, (plan !== 'free').toString());
    }
  };

  // Legacy support
  const setPremium = (status: boolean) => {
    setPlan(status ? 'premium' : 'free');
  };

  // Get current plan info
  const getCurrentPlanInfo = (): PlanInfo => {
    return PLANS.find(p => p.id === currentPlan) || PLANS[0];
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        isPremium,
        isPro,
        scanCount,
        monthlyScansUsed,
        scansLeft,
        canScan,
        incrementScanCount,
        setPlan,
        setPremium,
        getCurrentPlanInfo
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Helper to get scans left display text
export const getScansLeftText = (scansLeft: number | 'unlimited'): string => {
  if (scansLeft === 'unlimited') return '∞';
  return scansLeft.toString();
};
