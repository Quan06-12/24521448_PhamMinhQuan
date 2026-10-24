import { members, columns } from './members.js';
import { createGridController } from './grid-controller.js';

const controller = createGridController(document.querySelector('#directory'), {
  data: members,
  columns,
  ariaLabel: 'Team members',
});

// A page retained in the back-forward cache must keep its delegated listeners.
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) controller.destroy();
});
