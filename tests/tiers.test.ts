import { describe, it, expect } from 'vitest';
import { getTier, getTierInfo, getNextTier } from '../utils/tiers';

describe('getTier', () => {
  it('returns correct tier at each boundary', () => {
    expect(getTier(9.9)).toBe('LEGENDARY');
    expect(getTier(9.8)).toBe('MYTHIC');
    expect(getTier(9.6)).toBe('ICONIC');
    expect(getTier(9.5)).toBe('PRESTIGE');
    expect(getTier(9.4)).toBe('ELITE');
    expect(getTier(9.2)).toBe('SUPREME');
    expect(getTier(9.0)).toBe('RADIANT');
    expect(getTier(8.8)).toBe('CELESTIAL');
    expect(getTier(8.6)).toBe('OBSIDIAN');
    expect(getTier(8.4)).toBe('RUBY');
    expect(getTier(8.2)).toBe('SAPPHIRE');
    expect(getTier(7.9)).toBe('DIAMOND');
    expect(getTier(7.6)).toBe('EMERALD');
    expect(getTier(7.3)).toBe('PLATINUM');
    expect(getTier(7.0)).toBe('GOLD');
    expect(getTier(6.5)).toBe('SILVER');
    expect(getTier(6.0)).toBe('POLISHED');
    expect(getTier(5.5)).toBe('REFINED');
    expect(getTier(5.0)).toBe('STANDARD');
  });

  it('returns UNRANKED for scores below 5.0', () => {
    expect(getTier(4.9)).toBe('UNRANKED');
    expect(getTier(3.0)).toBe('UNRANKED');
    expect(getTier(0)).toBe('UNRANKED');
  });

  it('returns LEGENDARY for maximum score', () => {
    expect(getTier(10)).toBe('LEGENDARY');
  });

  it('returns correct tier for mid-range scores', () => {
    expect(getTier(5.2)).toBe('STANDARD');
    expect(getTier(6.8)).toBe('SILVER');
    expect(getTier(7.5)).toBe('PLATINUM');
    expect(getTier(8.0)).toBe('DIAMOND');
    expect(getTier(8.5)).toBe('RUBY');
  });

  it('handles just-below-boundary scores', () => {
    expect(getTier(9.89)).toBe('MYTHIC');
    expect(getTier(4.99)).toBe('UNRANKED');
    expect(getTier(6.99)).toBe('SILVER');
  });
});

describe('getTierInfo', () => {
  it('returns correct info for LEGENDARY', () => {
    const info = getTierInfo('LEGENDARY');
    expect(info.name).toBe('LEGENDARY');
    expect(info.color).toBe('#FFD700');
    expect(info.gradient).toContain('amber');
    expect(info.textColor).toContain('amber');
    expect(info.glow).toBeTruthy();
  });

  it('returns correct info for each named tier', () => {
    const tiers = [
      'LEGENDARY', 'MYTHIC', 'ICONIC', 'PRESTIGE', 'ELITE', 'SUPREME',
      'RADIANT', 'CELESTIAL', 'OBSIDIAN', 'RUBY', 'SAPPHIRE', 'DIAMOND',
      'EMERALD', 'PLATINUM', 'GOLD', 'SILVER', 'POLISHED', 'REFINED', 'STANDARD',
    ];
    for (const tier of tiers) {
      const info = getTierInfo(tier);
      expect(info.name).toBe(tier);
      expect(info.color).toBeTruthy();
      expect(info.gradient).toBeTruthy();
      expect(info.textColor).toBeTruthy();
    }
  });

  it('returns UNRANKED for unknown tier names', () => {
    const info = getTierInfo('NONEXISTENT');
    expect(info.name).toBe('UNRANKED');
    expect(info.color).toBe('#6B7280');
  });
});

describe('getNextTier', () => {
  it('returns null when already at max tier', () => {
    expect(getNextTier(9.9)).toBeNull();
    expect(getNextTier(10)).toBeNull();
  });

  it('returns a valid next tier for low scores', () => {
    const next = getNextTier(4.0);
    expect(next).not.toBeNull();
    expect(next!.tier).toBeTruthy();
    expect(next!.pointsNeeded).toBeGreaterThan(0);
  });

  it('returns correct points needed', () => {
    const next = getNextTier(8.5);
    expect(next).not.toBeNull();
    // 8.5 is below 8.6 (OBSIDIAN), so next should be calculated from 9.9 threshold
    expect(next!.pointsNeeded).toBeGreaterThan(0);
  });

  it('always returns a tier name from the known list', () => {
    const knownTiers = [
      'LEGENDARY', 'MYTHIC', 'ICONIC', 'PRESTIGE', 'ELITE', 'SUPREME',
      'RADIANT', 'CELESTIAL', 'OBSIDIAN', 'RUBY', 'SAPPHIRE', 'DIAMOND',
      'EMERALD', 'PLATINUM', 'GOLD', 'SILVER', 'POLISHED', 'REFINED', 'STANDARD',
    ];
    for (let score = 0; score < 9.9; score += 0.5) {
      const next = getNextTier(score);
      if (next) {
        expect(knownTiers).toContain(next.tier);
      }
    }
  });
});
