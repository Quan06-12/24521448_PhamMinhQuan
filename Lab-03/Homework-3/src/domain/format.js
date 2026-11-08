// Vietnamese dong has no minor unit, so the formatter prints whole numbers
const vndFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

/** @param {number} amount */
export function formatVnd(amount) {
  return vndFormatter.format(amount);
}
