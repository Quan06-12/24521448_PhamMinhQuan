// Asymmetric weights: a rejection costs less than a like earns, a super like earns double
export const POINTS = { right: 10, up: 20, left: -5 };

// Pure: same history in, same metrics out. Called during render, never stored in state.
export function computeMetrics(history) {
  const counts = { right: 0, up: 0, left: 0 };
  for (const swipe of history) counts[swipe.direction] += 1;

  const total = history.length;
  const score = history.reduce((acc, swipe) => acc + POINTS[swipe.direction], 0);
  const positive = counts.right + counts.up;
  // Share of swipes that were a like or super like (0 when nothing was swiped yet)
  const likeRate = total === 0 ? 0 : positive / total;

  let verdict = 'Chưa vuốt ai cả.';
  if (total > 0 && likeRate === 0) verdict = 'Khó tính quá, không ai lọt vào mắt xanh.';
  else if (likeRate >= 0.75) verdict = 'Dễ rung động – coi chừng lại "hẹn hò nhưng không yêu".';
  else if (likeRate >= 0.4) verdict = 'Cân bằng giữa con tim và lý trí.';
  else if (total > 0) verdict = 'Kén chọn, nhưng vẫn còn hy vọng.';

  return { counts, total, score, likeRate, verdict };
}