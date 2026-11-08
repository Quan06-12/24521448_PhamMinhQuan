// Vietnamese dong has no minor unit, so the formatter prints whole numbers
const vndFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

/** @param {number} amount */
export function formatVnd(amount) {
  return vndFormatter.format(amount);
}

/**
 * mm:ss under one hour, hh:mm:ss above. Rounds up so "00:01" is shown until
 * the very last millisecond and the label hits 00:00 exactly when the drop opens.
 * @param {number} remainingMs
 */
export function formatCountdown(remainingMs) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/** ISO 8601 duration for the <time datetime> attribute, e.g. PT1M30S */
export function toIsoDuration(remainingMs) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `PT${hours}H${minutes}M${seconds}S`;
}
