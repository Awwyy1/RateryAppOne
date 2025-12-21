
import React from 'react';
import { Shield, Target, Users, Zap, Eye } from 'lucide-react';
import { OnboardingStep, MetricData } from './types';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "The 50ms Rule",
    description: "Humans form a lasting impression in under 50 milliseconds. Ratery measures that split-second impact.",
    icon: "Eye"
  },
  {
    title: "Social Consensus",
    description: "Our engine uses a proprietary blend of crowd analysis and behavioral psychology for objective results.",
    icon: "Users"
  },
  {
    title: "Context Matters",
    description: "Whether it's LinkedIn, Tinder, or a Portfolio, we audit your impression based on your specific goals.",
    icon: "Target"
  },
  {
    title: "Precision Engine",
    description: "Move beyond 'looks good'. Get high-fidelity metrics on trustworthiness, charisma, and authority.",
    icon: "Shield"
  },
  {
    title: "Secure & Verified",
    description: "Your data is encrypted. Sign in to lock your reports and access historical benchmarks.",
    icon: "Zap"
  }
];

export const MOCK_RESULTS: MetricData[] = [
  { label: 'Trustworthiness', value: 84, benchmark: 72, description: 'High probability of perceived reliability.' },
  { label: 'Charisma', value: 76, benchmark: 65, description: 'Strong magnetic presence detected.' },
  { label: 'Intelligence', value: 91, benchmark: 78, description: 'Conveys deep analytical capability.' },
  { label: 'Approachability', value: 62, benchmark: 70, description: 'Slightly guarded; consider softer angles.' },
  { label: 'Authority', value: 88, benchmark: 68, description: 'Commanding leadership presence.' },
  { label: 'Energy', value: 72, benchmark: 60, description: 'High vibration and engagement level.' }
];

export const INSIGHTS = [
  "Your direct eye contact significantly boosts Authority scores.",
  "Consider slightly warmer lighting to improve Approachability.",
  "The current backdrop projects professional stability (Slate/Navy spectrum)."
];
