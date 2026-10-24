import { createInventoryStore } from './inventory.js';
import { createCheckoutController } from './checkout.js';
import { createDeadlineTimer } from './timer.js';
import { runShopperRace } from './race.js';
import { createSaleView } from './view.js';

const catalog = [
  { id: 'buds', name: 'Cloud Buds Pro', price: 599_000, originalPrice: 999_000, total: 5 },
  { id: 'keys', name: 'Daybreak Keyboard', price: 845_000, originalPrice: 1_300_000, total: 4 },
  { id: 'power', name: 'Swift 65W Charger', price: 349_000, originalPrice: 499_000, total: 3 },
];
const messages = {
  PURCHASED: 'Payment approved. Your find is all yours.',
  PAYMENT_FAILED: 'Payment declined. Retry while your original hold is still live.',
  EXPIRED: 'The hold expired. Your payment cannot purchase this item.',
  RELEASED: 'Hold released. The item is available again.',
  CONFLICT: 'Another shopper changed this stock. Please try again.',
  SOLD_OUT: 'No stock is available for this item right now.',
  SALE_ENDED: 'The drop has closed. Start a fresh demo to try again.',
  STALE: 'That action is no longer current. Your inventory is unchanged.',
  INVALID: 'That action could not be started.',
};
const root = document.querySelector('main');
const view = createSaleView(root);
const raceButton = root.querySelector('#race-button');
const raceSummary = root.querySelector('#race-summary');
let store;
let checkout;
let stopTimer = () => {};
let generation = 0;
let requestSequence = 0;
let raceRunning = false;
let cachedSnapshot;
let suspended = false;
const render = () => {
  cachedSnapshot = store.snapshot();
  view.render(cachedSnapshot, Date.now());
  raceButton.disabled = raceRunning || Date.now() >= cachedSnapshot.saleEndsAt;
};
function observe(result) {
  render();
  if (result.code === 'CHECKING_OUT') view.announce('Checking your payment. Your hold keeps its original deadline.');
  else view.announce(messages[result.code] ?? 'The action has completed.');
}
function cleanup() {
  generation++;
  stopTimer();
  checkout?.dispose();
}
function start() {
  cleanup();
  suspended = false;
  view.reset();
  raceRunning = false;
  raceSummary.textContent = 'No race running. Each shopper requests one item.';
  store = createInventoryStore({ products: catalog, saleEndsAt: Date.now() + 120_000 });
  checkout = createCheckoutController({ store, onChange: observe });
  render();
  view.tick(cachedSnapshot.saleEndsAt - Date.now());
  view.announce('The drop is open. Pick something good.');
  stopTimer = createDeadlineTimer({
    deadline: cachedSnapshot.saleEndsAt,
    onTick: (remaining) => {
      view.tick(remaining);
      if (store.sweep()) {
        render();
        view.announce('A reservation expired and its stock returned to the drop.');
      }
      view.renderHolds(cachedSnapshot, Date.now());
    },
    onComplete: () => {
      render();
      view.announce('The drop has closed. Existing purchases are complete; all unpurchased holds have expired.');
    },
  });
}
async function race() {
  if (raceRunning) return;
  const activeGeneration = generation;
  const activeStore = store;
  raceRunning = true;
  render();
  raceSummary.textContent = '20 shoppers are racing for the same inventory version…';
  try {
    const result = await runShopperRace({
      store: activeStore, productId: root.querySelector('#race-product').value,
      runId: `race-${++requestSequence}`, isCancelled: () => generation !== activeGeneration,
    });
    if (generation !== activeGeneration) return;
    raceSummary.textContent = `${result.firstPassWins} first-pass winner · ${result.conflicts} version conflicts · ${result.purchased} purchased after retries · ${result.rejected} unfilled.`;
    view.announce(`Race complete: ${result.purchased} purchases from 20 shoppers. Stock conservation verified.`);
  } catch (error) {
    if (generation === activeGeneration) view.announce(`Race stopped: ${error.message}`);
  } finally {
    if (generation === activeGeneration) { raceRunning = false; render(); }
  }
}
function handleClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('button[data-action]');
  if (!button || !root.contains(button) || button.disabled) return;
  const id = button.dataset.reservationId;
  switch (button.dataset.action) {
    case 'reserve': {
      const product = store.snapshot().products.find((item) => item.id === button.dataset.productId);
      const result = store.reserve({ productId: product.id, buyer: 'You', quantity: 1,
        expectedVersion: product.version, requestId: `you-${++requestSequence}` });
      render();
      view.announce(result.ok ? `${product.name} is reserved for 15 seconds. Check out from your night bag.` : messages[result.code]);
      break;
    }
    case 'checkout':
      void checkout.checkout(id, { delayMs: Number(root.querySelector('#payment-delay').value),
        succeeds: root.querySelector('#payment-outcome').value === 'success' });
      break;
    case 'release': checkout.cancel(id); break;
    case 'race': void race(); break;
    case 'restart': start(); break;
  }
}
root.addEventListener('click', handleClick);
window.addEventListener('pagehide', () => { suspended = true; cleanup(); });
window.addEventListener('pageshow', (event) => { if (event.persisted && suspended) start(); });
start();
