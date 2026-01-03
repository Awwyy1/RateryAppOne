
import React from 'react';
import { Shield, Target, Users, Zap, Eye } from 'lucide-react';
import { OnboardingStep, MetricData } from './types';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "The First Second",
    description: "People read your face in under 100ms. This shapes everything.",
    icon: "Eye"
  },
  {
    title: "Hidden Signals",
    description: "Your face sends signals you cannot see — trust, power, warmth.",
    icon: "Users"
  },
  {
    title: "Your Social DNA",
    description: "We call this unique combination your Social DNA.",
    icon: "Target"
  },
  {
    title: "AI Decoder",
    description: "Our AI reads 50+ markers to reveal your true social signals.",
    icon: "Shield"
  },
  {
    title: "Private and Secure",
    description: "Your photo is analyzed instantly and never stored.",
    icon: "Zap"
  }
];

export const MOCK_RESULTS: MetricData[] = [
  { label: 'Trust', value: 84, benchmark: 72, description: 'How reliable you appear to others.' },
  { label: 'Magnetism', value: 76, benchmark: 65, description: 'How much you draw attention.' },
  { label: 'Spark', value: 91, benchmark: 78, description: 'How memorable your presence is.' },
  { label: 'Warmth', value: 62, benchmark: 70, description: 'How approachable you seem.' },
  { label: 'Power', value: 88, benchmark: 68, description: 'How much confidence you project.' },
  { label: 'Mystery', value: 72, benchmark: 60, description: 'How intriguing you are.' }
];

export const INSIGHTS = [
  "Your direct gaze significantly boosts your Power signal.",
  "Softer lighting could increase your Warmth marker.",
  "Your expression projects high Trust — a rare combination with Power."
];
