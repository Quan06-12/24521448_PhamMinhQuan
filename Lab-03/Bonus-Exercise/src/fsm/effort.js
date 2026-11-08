// Pure scoring over the signal log. Called during render, never stored in state.

// Work in tenths so 0.1 multipliers do not drift (0.1 * 3 !== 0.3 in floats)
const toTenths = (n) => Math.round(n * 10);

/**
 * @param {{ actor: 'EM' | 'AI_DO', steps: number, multiplier: number }[]} signals
 * @param {string} phase
 */
export function deriveEffort(signals, phase) {
  let emTenths = 0;
  let aiDoTenths = 0;
  for (const signal of signals) {
    const impact = toTenths(signal.steps * signal.multiplier);
    if (signal.actor === 'EM') emTenths += impact;
    else aiDoTenths += impact;
  }

  const emScore = emTenths / 10;
  const aiDoScore = aiDoTenths / 10;
  const total = emScore + aiDoScore;

  return {
    emScore,
    aiDoScore,
    // null when Ai Đó has not shown up yet (dividing by 0 would print Infinity)
    ratio: aiDoScore === 0 ? null : emScore / aiDoScore,
    // Em's share of all effort, 0..1; an empty log counts as balanced
    meterValue: total === 0 ? 0.5 : emScore / total,
    // Only a red flag while "dating but not in love" and Ai Đó outweighs Em
    isRedFlag: phase === 'DATING_NO_LOVE' && emScore < aiDoScore,
  };
}

export const formatScore = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 1 });
