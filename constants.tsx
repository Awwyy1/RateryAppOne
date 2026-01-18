
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

// All 16 DNA Markers
// FREE plan: 3 markers (Trust, Magnetism, Spark)
// PREMIUM plan: 7 markers (+ Warmth, Power, Mystery, Sophistication)
// PRO plan: All 16 markers
export const ALL_DNA_MARKERS = [
  'Trust', 'Magnetism', 'Spark', 'Warmth', 'Power', 'Mystery', 'Sophistication',
  'Drive', 'Vibe', 'Prestige', 'Strictness', 'Openness', 'Pragmatism', 'Resilience', 'Congruence', 'Stature'
];

export const MARKERS_BY_PLAN = {
  free: 3,
  premium: 7,
  pro: 16
};

export const MOCK_RESULTS: MetricData[] = [
  { label: 'Trust', value: 84, benchmark: 72, description: 'How reliable you appear to others.' },
  { label: 'Magnetism', value: 76, benchmark: 65, description: 'How much you draw attention.' },
  { label: 'Spark', value: 91, benchmark: 78, description: 'How memorable your presence is.' },
  { label: 'Warmth', value: 62, benchmark: 70, description: 'How approachable you seem.' },
  { label: 'Power', value: 88, benchmark: 68, description: 'How much confidence you project.' },
  { label: 'Mystery', value: 72, benchmark: 60, description: 'How intriguing you are.' },
  { label: 'Sophistication', value: 79, benchmark: 65, description: 'How refined and cultured you appear.' },
  { label: 'Drive', value: 85, benchmark: 70, description: 'How ambitious and determined you seem.' },
  { label: 'Vibe', value: 77, benchmark: 68, description: 'Your overall energy and aura.' },
  { label: 'Prestige', value: 73, benchmark: 62, description: 'How high-status you appear.' },
  { label: 'Strictness', value: 68, benchmark: 55, description: 'How disciplined and serious you look.' },
  { label: 'Openness', value: 81, benchmark: 72, description: 'How receptive and curious you seem.' },
  { label: 'Pragmatism', value: 74, benchmark: 65, description: 'How practical and grounded you appear.' },
  { label: 'Resilience', value: 86, benchmark: 70, description: 'How strong and enduring you seem.' },
  { label: 'Congruence', value: 82, benchmark: 75, description: 'How authentic and consistent you appear.' },
  { label: 'Stature', value: 78, benchmark: 68, description: 'Your overall presence and standing.' }
];

export const INSIGHTS = [
  "Your direct gaze significantly boosts your Power signal.",
  "Softer lighting could increase your Warmth marker.",
  "Your expression projects high Trust — a rare combination with Power."
];
