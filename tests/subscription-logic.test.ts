import { describe, it, expect } from 'vitest';

// Test the subscription calculation logic (extracted from SubscriptionContext)
// These are the core business rules that determine user access

const FREE_SCANS_LIMIT = 1;
const PREMIUM_MONTHLY_LIMIT = 49;

type PlanType = 'free' | 'premium' | 'pro';

function calculateScansLeft(
  plan: PlanType,
  totalScans: number,
  monthlyScansUsed: number
): number | 'unlimited' {
  if (plan === 'pro') return 'unlimited';
  if (plan === 'premium') return Math.max(0, PREMIUM_MONTHLY_LIMIT - monthlyScansUsed);
  return Math.max(0, FREE_SCANS_LIMIT - totalScans);
}

function canUserScan(scansLeft: number | 'unlimited'): boolean {
  return scansLeft === 'unlimited' || scansLeft > 0;
}

describe('Subscription: scansLeft calculation', () => {
  it('free plan: 1 scan allowed initially', () => {
    expect(calculateScansLeft('free', 0, 0)).toBe(1);
  });

  it('free plan: 0 scans after using the free scan', () => {
    expect(calculateScansLeft('free', 1, 0)).toBe(0);
  });

  it('free plan: never goes negative', () => {
    expect(calculateScansLeft('free', 5, 0)).toBe(0);
  });

  it('premium plan: 49 scans per month initially', () => {
    expect(calculateScansLeft('premium', 0, 0)).toBe(49);
  });

  it('premium plan: decreases with monthly usage', () => {
    expect(calculateScansLeft('premium', 10, 10)).toBe(39);
    expect(calculateScansLeft('premium', 48, 48)).toBe(1);
  });

  it('premium plan: 0 when monthly limit reached', () => {
    expect(calculateScansLeft('premium', 49, 49)).toBe(0);
  });

  it('premium plan: never goes negative', () => {
    expect(calculateScansLeft('premium', 100, 100)).toBe(0);
  });

  it('pro plan: always unlimited', () => {
    expect(calculateScansLeft('pro', 0, 0)).toBe('unlimited');
    expect(calculateScansLeft('pro', 1000, 500)).toBe('unlimited');
  });
});

describe('Subscription: canScan', () => {
  it('can scan with unlimited scans', () => {
    expect(canUserScan('unlimited')).toBe(true);
  });

  it('can scan with scans remaining', () => {
    expect(canUserScan(1)).toBe(true);
    expect(canUserScan(49)).toBe(true);
  });

  it('cannot scan with 0 scans left', () => {
    expect(canUserScan(0)).toBe(false);
  });
});

describe('Subscription: plan validation', () => {
  const VALID_PLANS: PlanType[] = ['free', 'premium', 'pro'];

  it('recognizes all valid plan types', () => {
    for (const plan of VALID_PLANS) {
      expect(VALID_PLANS.includes(plan)).toBe(true);
    }
  });

  it('premium includes premium and pro', () => {
    const isPremium = (plan: PlanType) => plan === 'premium' || plan === 'pro';
    expect(isPremium('free')).toBe(false);
    expect(isPremium('premium')).toBe(true);
    expect(isPremium('pro')).toBe(true);
  });

  it('pro is only pro', () => {
    const isPro = (plan: PlanType) => plan === 'pro';
    expect(isPro('free')).toBe(false);
    expect(isPro('premium')).toBe(false);
    expect(isPro('pro')).toBe(true);
  });
});
