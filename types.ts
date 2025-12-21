
export enum AppStage {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  UPLOAD = 'UPLOAD',
  SCANNING = 'SCANNING',
  DASHBOARD = 'DASHBOARD'
}

export interface MetricData {
  label: string;
  value: number;
  benchmark: number;
  description: string;
}

export interface AuditResults {
  overallScore: number;
  metrics: MetricData[];
  insights: string[];
  photoUrl: string | null;
}

export interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}
