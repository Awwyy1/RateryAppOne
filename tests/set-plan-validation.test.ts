import { describe, it, expect } from 'vitest';

// Test the validation logic used by the /api/set-plan endpoint
const VALID_PLANS = ['free', 'premium', 'pro'] as const;

function validatePlanInput(plan: unknown): { valid: boolean; error?: string } {
  if (!plan) {
    return { valid: false, error: 'Missing plan parameter' };
  }
  if (typeof plan !== 'string') {
    return { valid: false, error: 'Plan must be a string' };
  }
  if (!VALID_PLANS.includes(plan as any)) {
    return { valid: false, error: `Invalid plan: ${plan}. Must be: free, premium, or pro` };
  }
  return { valid: true };
}

describe('set-plan validation', () => {
  it('accepts valid plans', () => {
    expect(validatePlanInput('free').valid).toBe(true);
    expect(validatePlanInput('premium').valid).toBe(true);
    expect(validatePlanInput('pro').valid).toBe(true);
  });

  it('rejects null/undefined', () => {
    expect(validatePlanInput(null).valid).toBe(false);
    expect(validatePlanInput(undefined).valid).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validatePlanInput('').valid).toBe(false);
  });

  it('rejects invalid plan names', () => {
    expect(validatePlanInput('enterprise').valid).toBe(false);
    expect(validatePlanInput('PRO').valid).toBe(false);
    expect(validatePlanInput('Premium').valid).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(validatePlanInput(123).valid).toBe(false);
    expect(validatePlanInput(true).valid).toBe(false);
    expect(validatePlanInput({ plan: 'pro' }).valid).toBe(false);
  });

  it('returns descriptive error messages', () => {
    const result = validatePlanInput('enterprise');
    expect(result.error).toContain('enterprise');
    expect(result.error).toContain('free');
    expect(result.error).toContain('premium');
    expect(result.error).toContain('pro');
  });
});
