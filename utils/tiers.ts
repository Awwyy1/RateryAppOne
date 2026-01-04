// 20-tier Premium/Luxury ranking system

export interface TierInfo {
  name: string;
  color: string;
  gradient: string;
  textColor: string;
  glow?: string;
}

export const getTier = (score: number): string => {
  if (score >= 9.9) return 'LEGENDARY';
  if (score >= 9.8) return 'MYTHIC';
  if (score >= 9.6) return 'ICONIC';
  if (score >= 9.5) return 'PRESTIGE';
  if (score >= 9.4) return 'ELITE';
  if (score >= 9.2) return 'SUPREME';
  if (score >= 9.0) return 'RADIANT';
  if (score >= 8.8) return 'CELESTIAL';
  if (score >= 8.6) return 'OBSIDIAN';
  if (score >= 8.4) return 'RUBY';
  if (score >= 8.2) return 'SAPPHIRE';
  if (score >= 7.9) return 'DIAMOND';
  if (score >= 7.6) return 'EMERALD';
  if (score >= 7.3) return 'PLATINUM';
  if (score >= 7.0) return 'GOLD';
  if (score >= 6.5) return 'SILVER';
  if (score >= 6.0) return 'POLISHED';
  if (score >= 5.5) return 'REFINED';
  if (score >= 5.0) return 'STANDARD';
  return 'UNRANKED';
};

export const getTierInfo = (tier: string): TierInfo => {
  switch (tier) {
    case 'LEGENDARY':
      return {
        name: 'LEGENDARY',
        color: '#FFD700',
        gradient: 'from-amber-300 via-yellow-400 to-amber-500',
        textColor: 'text-amber-400',
        glow: 'shadow-[0_0_40px_rgba(255,215,0,0.6)]'
      };
    case 'MYTHIC':
      return {
        name: 'MYTHIC',
        color: '#FF6B6B',
        gradient: 'from-rose-400 via-pink-500 to-rose-600',
        textColor: 'text-rose-400',
        glow: 'shadow-[0_0_30px_rgba(255,107,107,0.5)]'
      };
    case 'ICONIC':
      return {
        name: 'ICONIC',
        color: '#FF4500',
        gradient: 'from-orange-500 via-red-500 to-orange-600',
        textColor: 'text-orange-500',
        glow: 'shadow-[0_0_25px_rgba(255,69,0,0.4)]'
      };
    case 'PRESTIGE':
      return {
        name: 'PRESTIGE',
        color: '#9400D3',
        gradient: 'from-purple-500 via-violet-400 to-purple-600',
        textColor: 'text-purple-400',
        glow: 'shadow-[0_0_20px_rgba(148,0,211,0.4)]'
      };
    case 'ELITE':
      return {
        name: 'ELITE',
        color: '#8B5CF6',
        gradient: 'from-violet-500 via-purple-400 to-violet-600',
        textColor: 'text-violet-400'
      };
    case 'SUPREME':
      return {
        name: 'SUPREME',
        color: '#EC4899',
        gradient: 'from-pink-500 via-fuchsia-400 to-pink-600',
        textColor: 'text-pink-400'
      };
    case 'RADIANT':
      return {
        name: 'RADIANT',
        color: '#F59E0B',
        gradient: 'from-amber-400 via-orange-300 to-amber-500',
        textColor: 'text-amber-400'
      };
    case 'CELESTIAL':
      return {
        name: 'CELESTIAL',
        color: '#6366F1',
        gradient: 'from-indigo-400 via-blue-400 to-indigo-500',
        textColor: 'text-indigo-400'
      };
    case 'OBSIDIAN':
      return {
        name: 'OBSIDIAN',
        color: '#374151',
        gradient: 'from-gray-700 via-slate-600 to-gray-800',
        textColor: 'text-gray-300'
      };
    case 'RUBY':
      return {
        name: 'RUBY',
        color: '#DC2626',
        gradient: 'from-red-500 via-rose-400 to-red-600',
        textColor: 'text-red-400'
      };
    case 'SAPPHIRE':
      return {
        name: 'SAPPHIRE',
        color: '#2563EB',
        gradient: 'from-blue-500 via-sky-400 to-blue-600',
        textColor: 'text-blue-400'
      };
    case 'DIAMOND':
      return {
        name: 'DIAMOND',
        color: '#B9F2FF',
        gradient: 'from-cyan-300 via-sky-200 to-cyan-400',
        textColor: 'text-cyan-300'
      };
    case 'EMERALD':
      return {
        name: 'EMERALD',
        color: '#10B981',
        gradient: 'from-emerald-400 via-green-400 to-emerald-500',
        textColor: 'text-emerald-400'
      };
    case 'PLATINUM':
      return {
        name: 'PLATINUM',
        color: '#00CED1',
        gradient: 'from-teal-400 via-cyan-400 to-teal-500',
        textColor: 'text-teal-400'
      };
    case 'GOLD':
      return {
        name: 'GOLD',
        color: '#FFD700',
        gradient: 'from-yellow-500 via-amber-400 to-yellow-600',
        textColor: 'text-yellow-500'
      };
    case 'SILVER':
      return {
        name: 'SILVER',
        color: '#C0C0C0',
        gradient: 'from-gray-300 via-slate-200 to-gray-400',
        textColor: 'text-gray-300'
      };
    case 'POLISHED':
      return {
        name: 'POLISHED',
        color: '#A8A29E',
        gradient: 'from-stone-400 via-gray-300 to-stone-500',
        textColor: 'text-stone-400'
      };
    case 'REFINED':
      return {
        name: 'REFINED',
        color: '#78716C',
        gradient: 'from-stone-500 via-gray-400 to-stone-600',
        textColor: 'text-stone-500'
      };
    case 'STANDARD':
      return {
        name: 'STANDARD',
        color: '#57534E',
        gradient: 'from-stone-600 via-gray-500 to-stone-700',
        textColor: 'text-stone-600'
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
    { score: 9.9, tier: 'LEGENDARY' },
    { score: 9.8, tier: 'MYTHIC' },
    { score: 9.6, tier: 'ICONIC' },
    { score: 9.5, tier: 'PRESTIGE' },
    { score: 9.4, tier: 'ELITE' },
    { score: 9.2, tier: 'SUPREME' },
    { score: 9.0, tier: 'RADIANT' },
    { score: 8.8, tier: 'CELESTIAL' },
    { score: 8.6, tier: 'OBSIDIAN' },
    { score: 8.4, tier: 'RUBY' },
    { score: 8.2, tier: 'SAPPHIRE' },
    { score: 7.9, tier: 'DIAMOND' },
    { score: 7.6, tier: 'EMERALD' },
    { score: 7.3, tier: 'PLATINUM' },
    { score: 7.0, tier: 'GOLD' },
    { score: 6.5, tier: 'SILVER' },
    { score: 6.0, tier: 'POLISHED' },
    { score: 5.5, tier: 'REFINED' },
    { score: 5.0, tier: 'STANDARD' },
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
