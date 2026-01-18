
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
  { label: 'Trust', value: 84, benchmark: 72, description: 'Relaxed eye contact and natural smile create an immediate sense of reliability and honesty.' },
  { label: 'Magnetism', value: 76, benchmark: 65, description: 'Strong facial symmetry and engaging expression naturally draw attention in any room.' },
  { label: 'Spark', value: 91, benchmark: 78, description: 'Unique combination of intensity in your gaze and warmth makes you highly memorable.' },
  { label: 'Warmth', value: 62, benchmark: 70, description: 'Subtle tension in your expression slightly reduces perceived approachability to strangers.' },
  { label: 'Power', value: 88, benchmark: 68, description: 'Defined jawline and direct gaze project strong confidence and natural authority.' },
  { label: 'Mystery', value: 72, benchmark: 60, description: 'Depth in your eyes and composed expression create an intriguing, enigmatic presence.' },
  { label: 'Sophistication', value: 79, benchmark: 65, description: 'Refined features and poised demeanor suggest cultural awareness and refined taste.' },
  { label: 'Drive', value: 85, benchmark: 70, description: 'Focused gaze and forward-leaning energy convey strong ambition and determination.' },
  { label: 'Vibe', value: 77, benchmark: 68, description: 'Overall energy feels grounded yet dynamic, creating positive first impressions.' },
  { label: 'Prestige', value: 73, benchmark: 62, description: 'Your presentation and composure signal someone of notable standing and influence.' },
  { label: 'Strictness', value: 68, benchmark: 55, description: 'Structured expression indicates discipline and seriousness without appearing rigid.' },
  { label: 'Openness', value: 81, benchmark: 72, description: 'Relaxed brow and attentive eyes show genuine curiosity and receptiveness to others.' },
  { label: 'Pragmatism', value: 74, benchmark: 65, description: 'Grounded expression suggests a practical, no-nonsense approach to life and decisions.' },
  { label: 'Resilience', value: 86, benchmark: 70, description: 'Strong facial structure and calm demeanor project inner strength and endurance.' },
  { label: 'Congruence', value: 82, benchmark: 75, description: 'Expression and features align naturally, suggesting authenticity and self-awareness.' },
  { label: 'Stature', value: 78, benchmark: 68, description: 'Overall presence commands attention and respect in professional and social settings.' }
];

export const INSIGHTS = [
  "Your direct gaze significantly boosts your Power signal.",
  "Softer lighting could increase your Warmth marker.",
  "Your expression projects high Trust — a rare combination with Power."
];
