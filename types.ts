
export enum AppStage {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  UPLOAD = 'UPLOAD',
  SCANNING = 'SCANNING',
  DASHBOARD = 'DASHBOARD',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
}

export interface AnalysisResult {
  overallScore: number;
  metrics: MetricData[];
  insights: string[];
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
