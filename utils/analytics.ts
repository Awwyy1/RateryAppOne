import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

const track = (eventName: string, params?: Record<string, string | number | boolean>) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

export const trackLogin = () => track('login', { method: 'google' });

export const trackScanStarted = () => track('scan_started');

export const trackScanCompleted = (score: number, tier: string) =>
  track('scan_completed', { score, tier });

export const trackScanFailed = (reason: string) =>
  track('scan_failed', { reason });

export const trackPaywallOpened = (currentPlan: string) =>
  track('paywall_opened', { current_plan: currentPlan });

export const trackPlanSelected = (plan: string, billing: string) =>
  track('plan_selected', { plan, billing_cycle: billing });

export const trackPaymentSuccess = (plan: string) =>
  track('payment_success', { plan });

export const trackStageChange = (stage: string) =>
  track('stage_change', { stage });
