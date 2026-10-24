import { formatRemaining } from './timer.js';

const statusText = {
  RESERVED: 'Reserved for you', CHECKING_OUT: 'Confirming payment…',
  PURCHASED: 'Purchased · all yours', EXPIRED: 'Expired · stock returned', RELEASED: 'Released · stock returned',
};
const active = (reservation) => ['RESERVED', 'CHECKING_OUT'].includes(reservation.status);

/** All dynamic content goes through textContent; reservation rows retain their identity. */
export function createSaleView(root) {
  const find = (selector) => root.querySelector(selector);
  const rows = new Map();
  const list = find('#reservation-list');
  const activity = find('#activity-log');
  const clock = find('#countdown');
  let lastSecond = null;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function action(label, name, id) {
    const button = element('button', 'bag-button', label);
    button.type = 'button';
    button.dataset.action = name;
    button.dataset.reservationId = id;
    return button;
  }
  function createRow(reservation, product) {
    const row = element('li', 'reservation-row');
    const name = element('h3', 'reservation-title', product.name);
    const status = element('p', 'reservation-status');
    const remaining = element('span', 'hold-clock');
    const buttons = element('div', 'bag-actions');
    const buy = action('Check out', 'checkout', reservation.id);
    const release = action('Release', 'release', reservation.id);
    buttons.append(buy, release);
    row.append(name, status, remaining, buttons);
    list.append(row);
    const entry = { row, status, remaining, buy, release };
    rows.set(reservation.id, entry);
    return entry;
  }
  function render(snapshot, time) {
    const ended = time >= snapshot.saleEndsAt;
    const totals = { available: 0, held: 0, sold: 0 };
    for (const product of snapshot.products) {
      for (const key of Object.keys(totals)) totals[key] += product[key];
      find(`[data-stock="${product.id}"]`).textContent = `${product.available} available`;
      find(`[data-held="${product.id}"]`).textContent = `${product.held} held`;
      const meter = find(`[data-meter="${product.id}"]`);
      meter.value = product.available;
      meter.textContent = `${product.available} of ${product.total}`;
      const button = find(`[data-action="reserve"][data-product-id="${product.id}"]`);
      button.disabled = ended || product.available === 0;
      button.textContent = ended ? 'Drop closed' : product.available === 0 ? 'No stock available' : 'Reserve one ↗';
    }
    for (const [key, value] of Object.entries(totals)) find(`#total-${key}`).textContent = value;
    const own = snapshot.reservations.filter((reservation) => reservation.buyer === 'You');
    find('#bag-count').textContent = own.filter(active).length;
    find('#empty-bag').hidden = own.length > 0;
    for (const reservation of own) {
      const product = snapshot.products.find((item) => item.id === reservation.productId);
      const entry = rows.get(reservation.id) ?? createRow(reservation, product);
      const terminal = !active(reservation);
      const checkingOut = reservation.status === 'CHECKING_OUT';
      entry.release.textContent = checkingOut ? 'Cancel payment' : 'Release';
      // Move keyboard focus out of controls before their removal from the tab order.
      if (terminal && entry.row.contains(document.activeElement)) {
        find('#bag-title').tabIndex = -1;
        find('#bag-title').focus({ preventScroll: true });
      } else if (checkingOut && document.activeElement === entry.buy) {
        entry.release.focus({ preventScroll: true });
      }
      entry.status.textContent = statusText[reservation.status];
      entry.row.dataset.state = reservation.status.toLowerCase();
      entry.buy.hidden = terminal;
      entry.release.hidden = terminal;
      entry.buy.disabled = reservation.status !== 'RESERVED';
      entry.buy.textContent = checkingOut ? 'Processing…' : 'Check out';
    }
    renderHolds(snapshot, time);
    find('#sale-state').textContent = ended ? 'DROP HAS CLOSED' : 'DROP IS LIVE';
  }
  function renderHolds(snapshot, time) {
    for (const reservation of snapshot.reservations) {
      const entry = rows.get(reservation.id);
      if (!entry) continue;
      const label = active(reservation) ? `${Math.ceil(Math.max(0, reservation.expiresAt - time) / 1000)}s left on your hold` : '';
      if (entry.remaining.textContent !== label) entry.remaining.textContent = label;
    }
  }
  function tick(remaining) {
    clock.textContent = formatRemaining(remaining);
    const second = Math.ceil(remaining / 1000);
    if (second !== lastSecond) {
      find('#countdown-accessible').textContent = `${second} seconds remaining`;
      lastSecond = second;
    }
  }
  function announce(message) {
    find('#announcement').textContent = message;
    const item = element('li', '', message);
    activity.prepend(item);
    while (activity.children.length > 8) activity.lastElementChild.remove();
  }
  function reset() {
    rows.clear();
    list.replaceChildren();
    activity.replaceChildren();
    lastSecond = null;
  }
  return { render, renderHolds, tick, announce, reset };
}
