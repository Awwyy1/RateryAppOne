import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
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
  setPremium: (status: boolean) => void;
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
  const [scanCount, setScanCount] = useState(0);
  const [monthlyScansUsed, setMonthlyScansUsed] = useState(0);

  // Sync subscription data from Firestore (real-time listener)
  useEffect(() => {
    if (!user) {
      setCurrentPlan('free');
      setScanCount(0);
      setMonthlyScansUsed(0);
      return;
    }

    // Load cached plan from localStorage for instant UI while Firestore loads
    const cachedPlan = localStorage.getItem(`ratery_plan_${user.uid}`) as PlanType | null;
    if (cachedPlan) {
      setCurrentPlan(cachedPlan);
    }

    // Listen for real-time updates from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const plan = (data.plan || 'free') as PlanType;
          setCurrentPlan(plan);
          setScanCount(data.totalScans || 0);

          const currentMonth = new Date().toISOString().slice(0, 7);
          if (data.monthReset === currentMonth) {
            setMonthlyScansUsed(data.scansThisMonth || 0);
          } else {
            setMonthlyScansUsed(0);
          }

          // Cache in localStorage for fast next load
          localStorage.setItem(`ratery_plan_${user.uid}`, plan);
        }
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        // Fall back to localStorage if Firestore is unreachable
        const savedPlan = localStorage.getItem(`ratery_plan_${user.uid}`) as PlanType | null;
        if (savedPlan) setCurrentPlan(savedPlan);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const isPremium = currentPlan === 'premium' || currentPlan === 'pro';
  const isPro = currentPlan === 'pro';

  const scansLeft: number | 'unlimited' = (() => {
    if (currentPlan === 'pro') return 'unlimited';
    if (currentPlan === 'premium') return Math.max(0, PREMIUM_MONTHLY_LIMIT - monthlyScansUsed);
    return Math.max(0, FREE_SCANS_LIMIT - scanCount);
  })();

  const canScan = scansLeft === 'unlimited' || scansLeft > 0;

  // Optimistic UI update — real data arrives via Firestore onSnapshot after backend writes
  const incrementScanCount = () => {
    setScanCount(prev => prev + 1);
    if (currentPlan === 'premium') {
      setMonthlyScansUsed(prev => prev + 1);
    }
  };

  // Set plan — writes to Firestore + localStorage cache
  // In production, plan should ONLY be set via server-side webhook from payment provider
  const setPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    if (user) {
      localStorage.setItem(`ratery_plan_${user.uid}`, plan);
      setDoc(doc(db, 'users', user.uid), { plan }, { merge: true }).catch(console.error);
    }
  };

  const setPremium = (status: boolean) => {
    setPlan(status ? 'premium' : 'free');
  };

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

export const getScansLeftText = (scansLeft: number | 'unlimited'): string => {
  if (scansLeft === 'unlimited') return '∞';
  return scansLeft.toString();
};
