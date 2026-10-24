import { AudioTaskQueue } from './audio-queue.js';
import { createVisualizer } from './visualizer.js';
import { tracks } from './tracks.js';

const main = document.querySelector('main');
const catalog = document.querySelector('#catalog');
const queueList = document.querySelector('#queue-list');
const notice = document.querySelector('#notice');
const rows = new Map();
const finished = new Set(['completed', 'cancelled', 'failed']);
const events = new AbortController();
let context;
let queue;
let visualizer;
let unsubscribe;
let previousActive = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

for (const [index, track] of tracks.entries()) {
  const item = element('li', 'track-card');
  const art = element('div', `track-art art-${index + 1}`);
  art.setAttribute('aria-hidden', 'true');
  art.append(element('span', 'art-orbit'), element('span', 'art-number', `0${index + 1}`));
  const info = element('div', 'track-info');
  info.append(element('h3', '', track.title), element('p', 'track-mood', track.mood), element('span', 'track-duration', `0:${String(track.duration).padStart(2, '0')} · ORIGINAL LOOP`));
  const button = element('button', 'add-button', '+');
  button.type = 'button';
  button.dataset.action = 'add';
  button.dataset.track = track.id;
  button.setAttribute('aria-label', `Add ${track.title} to queue`);
  item.append(art, info, button);
  catalog.append(item);
}

function ensureQueue() {
  if (queue) return queue;
  if (!window.AudioContext) throw new Error('This browser does not support Web Audio. Try a current browser.');
  context = new AudioContext();
  queue = new AudioTaskQueue({ context });
  queue.setBins(Number(document.querySelector('#bins').value));
  queue.setVolume(Number(document.querySelector('#volume').value) / 100);
  visualizer = createVisualizer(document.querySelector('#spectrum'), queue.analyser);
  unsubscribe = queue.subscribe(render);
  return queue;
}

function makeRow(task) {
  const row = element('li', 'queue-row');
  const number = element('span', 'queue-number', String(task.sequence).padStart(2, '0'));
  const info = element('div', 'queue-info');
  const title = element('h3', '', task.track.title);
  const status = element('p', 'task-status');
  info.append(title, status);
  const button = element('button', 'cancel-button', 'Cancel');
  button.type = 'button';
  button.dataset.action = 'cancel';
  button.dataset.task = task.id;
  button.setAttribute('aria-label', `Cancel ${task.track.title}, queue item ${task.sequence}`);
  row.append(number, info, button);
  return { row, status, button };
}

function render(snapshot) {
  const live = snapshot.tasks.filter((task) => !finished.has(task.status));
  const active = snapshot.tasks.find((task) => task.id === snapshot.activeId);
  document.querySelector('#queue-count').textContent = String(live.length);
  document.querySelector('#empty-state').hidden = snapshot.tasks.length > 0;
  document.querySelector('#preparing-status').textContent = `${snapshot.preparing} of ${snapshot.concurrency} preparation slots in use`;
  document.querySelector('#cancel-all-button').disabled = live.length === 0;
  document.querySelector('#clear-button').disabled = snapshot.tasks.every((task) => !finished.has(task.status));
  const playButton = document.querySelector('#play-button');
  playButton.disabled = live.length === 0 || snapshot.running;
  playButton.textContent = snapshot.running && live.length ? '▶ Playback enabled' : '▶ Play queue';
  document.querySelector('#player-title').textContent = active?.track.title ?? (live.length ? 'Good things are lined up.' : 'Your next quiet moment.');
  document.querySelector('#player-subtitle').textContent = active ? `${active.track.artist} · ${active.duration.toFixed(0)} seconds` : live.length ? (snapshot.running ? 'Preparing the next track in your queue.' : 'Press play when you’re ready to listen.') : 'Add a track from the collection, then press play.';
  document.querySelector('#play-state').textContent = active ? 'NOW PLAYING' : snapshot.running && live.length ? 'PREPARING' : 'READY WHEN YOU ARE';
  if (active && !document.hidden) visualizer.start(); else visualizer.stop();
  if (active?.id !== previousActive) {
    if (active) notice.textContent = `Now playing ${active.track.title}, queue item ${active.sequence}.`;
    else if (previousActive && !live.length) notice.textContent = 'Your listening queue has finished.';
    previousActive = active?.id ?? null;
  }
  const ids = new Set(snapshot.tasks.map((task) => task.id));
  for (const [id, entry] of rows) {
    if (!ids.has(id)) { entry.row.remove(); rows.delete(id); }
  }
  for (const task of snapshot.tasks) {
    if (!rows.has(task.id)) {
      const entry = makeRow(task);
      rows.set(task.id, entry);
      queueList.append(entry.row);
    }
    const { row, status, button } = rows.get(task.id);
    if (task.status === 'failed' && row.dataset.status !== 'failed') {
      notice.textContent = `${task.track.title} failed: ${task.error}`;
    }
    row.dataset.status = task.status;
    status.textContent = task.error ? `Failed · ${task.error}` : task.status === 'ready' ? 'Ready · waiting for its turn' : task.status.charAt(0).toUpperCase() + task.status.slice(1);
    button.disabled = finished.has(task.status);
    button.textContent = finished.has(task.status) ? '—' : 'Cancel';
  }
}

main.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button || button.disabled) return;
  try {
    const engine = ensureQueue();
    if (button.dataset.action === 'add') {
      const track = tracks.find((item) => item.id === button.dataset.track);
      engine.enqueue(track);
      notice.textContent = `${track.title} added to your queue.`;
    } else if (button.dataset.action === 'queue-all') {
      tracks.forEach((track) => engine.enqueue(track));
      notice.textContent = 'The collection was added in order: Soft Current, After Hours, First Light.';
    } else if (button.dataset.action === 'play') {
      await engine.start();
    } else if (button.dataset.action === 'cancel') {
      engine.cancel(button.dataset.task);
      notice.textContent = 'Track cancelled. Remaining tracks keep their order.';
    } else if (button.dataset.action === 'cancel-all') {
      engine.cancelAll();
      notice.textContent = 'All tracks cancelled. You can build a new queue.';
    } else if (button.dataset.action === 'clear') {
      engine.clearFinished();
      notice.textContent = 'Finished tracks cleared.';
    }
  } catch (error) {
    notice.textContent = `Audio needs attention: ${error.message}`;
  }
}, { signal: events.signal });

main.addEventListener('input', (event) => {
  if (event.target.id !== 'volume') return;
  document.querySelector('#volume-value').textContent = `${event.target.value}%`;
  queue?.setVolume(Number(event.target.value) / 100);
}, { signal: events.signal });

main.addEventListener('change', (event) => {
  if (event.target.id === 'bins') queue?.setBins(Number(event.target.value));
}, { signal: events.signal });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) visualizer?.stop();
  else if (queue?.getSnapshot().activeId) visualizer?.start();
}, { signal: events.signal });

window.addEventListener('pagehide', () => {
  unsubscribe?.();
  visualizer?.dispose();
  queue?.dispose();
  void context?.close().catch(() => {});
  queue = undefined;
  visualizer = undefined;
  context = undefined;
  rows.clear();
  queueList.replaceChildren();
}, { signal: events.signal });

// The browser can restore the document from its back/forward cache.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    previousActive = null;
    document.querySelector('#play-button').disabled = true;
    document.querySelector('#cancel-all-button').disabled = true;
    document.querySelector('#clear-button').disabled = true;
    document.querySelector('#empty-state').hidden = false;
    document.querySelector('#queue-count').textContent = '0';
    document.querySelector('#player-title').textContent = 'Your next quiet moment.';
    document.querySelector('#player-subtitle').textContent = 'Add a track from the collection, then press play.';
    document.querySelector('#play-state').textContent = 'READY WHEN YOU ARE';
    document.querySelector('#preparing-status').textContent = '0 of 3 preparation slots in use';
    notice.textContent = 'Listening desk restored. Add a track to begin again.';
  }
}, { signal: events.signal });
