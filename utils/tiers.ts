// 20-tier ranking system for competitive retention

export interface TierInfo {
  name: string;
  color: string;
  gradient: string;
  textColor: string;
  glow?: string;
}

export const getTier = (score: number): string => {
  if (score >= 9.8) return 'LEGENDARY';
  if (score >= 9.6) return 'GRANDMASTER';
  if (score >= 9.3) return 'MASTER I';
  if (score >= 9.1) return 'MASTER II';
  if (score >= 8.8) return 'MASTER III';
  if (score >= 8.6) return 'DIAMOND I';
  if (score >= 8.4) return 'DIAMOND II';
  if (score >= 8.1) return 'DIAMOND III';
  if (score >= 7.8) return 'PLATINUM I';
  if (score >= 7.5) return 'PLATINUM II';
  if (score >= 7.2) return 'PLATINUM III';
  if (score >= 6.9) return 'GOLD I';
  if (score >= 6.6) return 'GOLD II';
  if (score >= 6.3) return 'GOLD III';
  if (score >= 6.0) return 'SILVER I';
  if (score >= 5.5) return 'SILVER II';
  if (score >= 5.0) return 'SILVER III';
  if (score >= 4.5) return 'BRONZE I';
  if (score >= 4.0) return 'BRONZE II';
  if (score >= 3.0) return 'BRONZE III';
  return 'UNRANKED';
};

export const getTierInfo = (tier: string): TierInfo => {
  switch (tier) {
    case 'LEGENDARY':
      return {
        name: 'LEGENDARY',
        color: '#FFD700',
        gradient: 'from-amber-400 via-yellow-300 to-amber-500',
        textColor: 'text-amber-400',
        glow: 'shadow-[0_0_30px_rgba(255,215,0,0.5)]'
      };
    case 'GRANDMASTER':
      return {
        name: 'GRANDMASTER',
        color: '#FF4500',
        gradient: 'from-orange-500 via-red-500 to-orange-600',
        textColor: 'text-orange-500',
        glow: 'shadow-[0_0_20px_rgba(255,69,0,0.4)]'
      };
    case 'MASTER I':
    case 'MASTER II':
    case 'MASTER III':
      return {
        name: tier,
        color: '#9400D3',
        gradient: 'from-purple-600 via-violet-500 to-purple-700',
        textColor: 'text-purple-500'
      };
    case 'DIAMOND I':
    case 'DIAMOND II':
    case 'DIAMOND III':
      return {
        name: tier,
        color: '#B9F2FF',
        gradient: 'from-cyan-300 via-sky-200 to-cyan-400',
        textColor: 'text-cyan-300'
      };
    case 'PLATINUM I':
    case 'PLATINUM II':
    case 'PLATINUM III':
      return {
        name: tier,
        color: '#00CED1',
        gradient: 'from-teal-400 via-cyan-400 to-teal-500',
        textColor: 'text-teal-400'
      };
    case 'GOLD I':
    case 'GOLD II':
    case 'GOLD III':
      return {
        name: tier,
        color: '#FFD700',
        gradient: 'from-yellow-500 via-amber-400 to-yellow-600',
        textColor: 'text-yellow-500'
      };
    case 'SILVER I':
    case 'SILVER II':
    case 'SILVER III':
      return {
        name: tier,
        color: '#C0C0C0',
        gradient: 'from-gray-300 via-slate-200 to-gray-400',
        textColor: 'text-gray-300'
      };
    case 'BRONZE I':
    case 'BRONZE II':
    case 'BRONZE III':
      return {
        name: tier,
        color: '#CD7F32',
        gradient: 'from-orange-700 via-amber-600 to-orange-800',
        textColor: 'text-orange-600'
      };
    default:
      return {
        name: 'UNRANKED',
        color: '#6B7280',
        gradient: 'from-gray-500 to-gray-600',
        textColor: 'text-gray-500'
      };
  }
};

// Get next tier info for motivation
export const getNextTier = (score: number): { tier: string; pointsNeeded: number } | null => {
  const thresholds = [
    { score: 9.8, tier: 'LEGENDARY' },
    { score: 9.6, tier: 'GRANDMASTER' },
    { score: 9.3, tier: 'MASTER I' },
    { score: 9.1, tier: 'MASTER II' },
    { score: 8.8, tier: 'MASTER III' },
    { score: 8.6, tier: 'DIAMOND I' },
    { score: 8.4, tier: 'DIAMOND II' },
    { score: 8.1, tier: 'DIAMOND III' },
    { score: 7.8, tier: 'PLATINUM I' },
    { score: 7.5, tier: 'PLATINUM II' },
    { score: 7.2, tier: 'PLATINUM III' },
    { score: 6.9, tier: 'GOLD I' },
    { score: 6.6, tier: 'GOLD II' },
    { score: 6.3, tier: 'GOLD III' },
    { score: 6.0, tier: 'SILVER I' },
    { score: 5.5, tier: 'SILVER II' },
    { score: 5.0, tier: 'SILVER III' },
    { score: 4.5, tier: 'BRONZE I' },
    { score: 4.0, tier: 'BRONZE II' },
    { score: 3.0, tier: 'BRONZE III' },
  ];

  for (const threshold of thresholds) {
    if (score < threshold.score) {
      return {
        tier: threshold.tier,
        pointsNeeded: Math.round((threshold.score - score) * 10) / 10
      };
    }
  }
  return null; // Already at max
};

// For gradient CSS classes
export const getTierGradient = (tier: string): string => {
  const info = getTierInfo(tier);
  return info.gradient;
};
