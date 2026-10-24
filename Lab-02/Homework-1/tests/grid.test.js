import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './dom-fixture.js';
import { members, columns } from '../src/members.js';
import { createGridController } from '../src/grid-controller.js';

function setup(options = {}) {
  const dom = fixture();
  globalThis.document = dom.document;
  const controller = createGridController(dom.root, { data: members, columns, ariaLabel: 'Team members', ...options });
  return { ...dom, controller };
}

function filter(root, id, value) {
  const control = root.querySelector(`#${id}`);
  control.value = value;
  control.emit(id === 'search' ? 'input' : 'change');
}

test('view exposes semantic grid metadata, pagination offsets, and one tab stop', () => {
  const { root, table } = setup();
  assert.equal(table.getAttribute('role'), 'grid');
  assert.equal(table.getAttribute('aria-rowcount'), '33');
  assert.equal(table.getAttribute('aria-colcount'), '6');
  assert.equal(table.rows.length, 9);
  assert.equal(table.querySelectorAll('[tabindex="0"]').length, 1);
  assert.ok(table.rows[0].cells.every((cell) => cell.scope === 'col' && cell.getAttribute('role') === 'columnheader'));
  assert.ok(table.rows.slice(1).every((row) => row.getAttribute('role') === 'row'
    && row.cells.every((cell) => cell.getAttribute('role') === 'gridcell')));
  assert.equal(table.rows[0].cells[1].getAttribute('aria-sort'), 'ascending');
  root.querySelector('[data-page="next"]').click();
  assert.equal(table.rows[1].getAttribute('aria-rowindex'), '10');
  assert.equal(root.querySelector('#page-label').textContent, 'Page 2 of 4');
});

test('arrows clamp without wrapping; Enter selects once and Space toggles with focus retained', () => {
  const selected = [];
  const { document, table } = setup({ onRowSelect: (member) => selected.push(member.id) });
  const header = table.querySelector('[tabindex="0"]');
  header.focus();
  assert.equal(header.emit('keydown', { key: 'ArrowUp' }).defaultPrevented, true);
  assert.equal(document.activeElement, header);
  header.emit('keydown', { key: 'ArrowDown' });
  const id = document.activeElement.parentElement.dataset.rowId;
  document.activeElement.emit('keydown', { key: 'Enter' });
  assert.equal(document.activeElement.parentElement.dataset.rowId, id);
  assert.equal(document.activeElement.parentElement.getAttribute('aria-selected'), 'true');
  document.activeElement.emit('keydown', { key: 'Enter' });
  assert.deepEqual(selected, [id]);
  document.activeElement.emit('keydown', { key: ' ' });
  assert.equal(document.activeElement.parentElement.getAttribute('aria-selected'), 'false');
  assert.deepEqual(selected, [id, id]);
  for (let index = 0; index < 10; index += 1) document.activeElement.emit('keydown', { key: 'ArrowRight' });
  assert.equal(document.activeElement.cellIndex, 5);
  for (let index = 0; index < 10; index += 1) document.activeElement.emit('keydown', { key: 'ArrowLeft' });
  assert.equal(document.activeElement.cellIndex, 0);
  for (let index = 0; index < 20; index += 1) document.activeElement.emit('keydown', { key: 'ArrowDown' });
  assert.equal(document.activeElement.parentElement, table.rows.at(-1));
  for (let index = 0; index < 20; index += 1) document.activeElement.emit('keydown', { key: 'ArrowUp' });
  assert.equal(document.activeElement.parentElement, table.rows[0]);
  assert.equal(table.querySelectorAll('[tabindex="0"]').length, 1);
});

test('sorting from a keyboard header changes direction and retains header focus', () => {
  const { document, table } = setup();
  table.rows[0].cells[1].focus();
  document.activeElement.emit('keydown', { key: 'Enter' });
  assert.equal(table.rows[0].cells[1].getAttribute('aria-sort'), 'descending');
  assert.equal(table.rows[1].dataset.rowId, 'm32');
  assert.equal(document.activeElement, table.rows[0].cells[1]);
  document.activeElement.emit('keydown', { key: ' ' });
  assert.equal(table.rows[0].cells[1].getAttribute('aria-sort'), 'ascending');
});

test('selection survives sorting, pagination, and combined filtering; empty controls clamp', () => {
  const { root, table } = setup();
  table.rows[1].cells[0].querySelector('button').click();
  table.rows[0].cells[1].querySelector('button').click();
  assert.equal(root.querySelector('#selected-count').textContent, '1 selected');
  assert.equal(table.rows[1].dataset.rowId, 'm32');
  table.rows[0].cells[1].querySelector('button').click();
  assert.equal(table.rows[1].getAttribute('aria-selected'), 'true');
  root.querySelector('[data-page="next"]').click();
  assert.equal(root.querySelector('#selected-count').textContent, '1 selected');
  filter(root, 'team-filter', 'Engineering');
  filter(root, 'status-filter', 'Active');
  filter(root, 'search', 'London');
  assert.deepEqual(table.rows.slice(1).map((row) => row.dataset.rowId), ['m13', 'm30']);
  assert.equal(root.querySelector('[data-page="next"]').disabled, true);
  filter(root, 'search', 'unfindable');
  assert.equal(table.rows.length, 1);
  assert.equal(root.querySelector('#empty-state').hidden, false);
  assert.equal(root.querySelector('[data-page="previous"]').disabled, true);
  root.querySelector('[data-action="clear-filters"]').click();
  assert.equal(root.querySelector('#empty-state').hidden, true);
  assert.equal(table.rows[1].getAttribute('aria-selected'), 'true');
  root.querySelector('[data-action="clear-selection"]').click();
  assert.equal(table.rows[1].getAttribute('aria-selected'), 'false');
});

test('filtering retains input focus; redraw retains a visible record and column', () => {
  const { document, root, table, controller } = setup();
  const search = root.querySelector('#search');
  search.focus();
  filter(root, 'search', 'London');
  assert.equal(document.activeElement, search);
  table.rows[2].cells[3].focus();
  const id = document.activeElement.parentElement.dataset.rowId;
  controller.render();
  assert.equal(document.activeElement.parentElement.dataset.rowId, id);
  assert.equal(document.activeElement.cellIndex, 3);
  filter(root, 'page-size', '16');
  assert.equal(root.querySelector('#page-label').textContent, 'Page 1 of 1');
});

test('pagination transfers focus only when its focused direction becomes disabled', () => {
  const { document, root } = setup();
  const previous = root.querySelector('[data-page="previous"]');
  const next = root.querySelector('[data-page="next"]');
  next.focus();
  next.click();
  assert.equal(document.activeElement, next, 'keep focus while more pages remain');
  next.click();
  next.click();
  assert.equal(root.querySelector('#page-label').textContent, 'Page 4 of 4');
  assert.equal(next.disabled, true);
  assert.equal(document.activeElement, previous, 'last page offers the enabled return direction');
  previous.click();
  previous.click();
  previous.click();
  assert.equal(root.querySelector('#page-label').textContent, 'Page 1 of 4');
  assert.equal(previous.disabled, true);
  assert.equal(document.activeElement, next, 'first page offers the enabled forward direction');
});

test('grid focus requests nearest visibility through navigation and redraw only', () => {
  const { document, root, table, controller } = setup();
  assert.equal(document.scrollRequests.length, 0, 'initial render must not scroll the page');
  table.rows[1].cells[4].focus();
  document.activeElement.emit('keydown', { key: 'ArrowRight' });
  assert.equal(document.activeElement.cellIndex, 5);
  assert.deepEqual(document.scrollRequests.at(-1), {
    target: document.activeElement, options: { block: 'nearest', inline: 'nearest' },
  });
  const oldCell = document.activeElement;
  controller.render();
  assert.notEqual(document.activeElement, oldCell, 'redraw replaces the focused cell');
  assert.equal(document.activeElement.cellIndex, 5);
  assert.equal(document.scrollRequests.at(-1).target, document.activeElement, 'restored focus also reveals its cell');
  const count = document.scrollRequests.length;
  root.querySelector('#search').focus();
  filter(root, 'search', 'London');
  assert.equal(document.scrollRequests.length, count, 'filtering with input focus must not scroll the grid');
});

test('pagination preserves unrelated focus and uses page size when no direction remains', () => {
  const { document, root, table } = setup();
  const search = root.querySelector('#search');
  const previous = root.querySelector('[data-page="previous"]');
  const next = root.querySelector('[data-page="next"]');
  filter(root, 'page-size', '16');
  search.focus();
  next.click();
  assert.equal(next.disabled, true);
  assert.equal(document.activeElement, search, 'programmatic activation must not steal input focus');
  table.rows[1].cells[2].focus();
  previous.click();
  assert.equal(previous.disabled, true);
  assert.equal(table.contains(document.activeElement), true, 'grid focus survives unrelated pagination');
  assert.equal(document.activeElement.cellIndex, 2);
  next.focus();
  filter(root, 'search', 'unfindable');
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, true);
  assert.equal(document.activeElement, root.querySelector('#page-size'));
});

test('hostile record content stays text and delegated listener allocation stays constant', () => {
  const hostile = '<img src=x onerror=alert(1)>';
  const data = [{ ...members[0], name: hostile, location: '<script>bad()</script>' }];
  const { root, table, controller } = setup({ data });
  assert.ok(table.textContent.includes(hostile));
  assert.equal(table.querySelector('img'), null);
  assert.equal(table.querySelector('script'), null);
  assert.equal([...root.listeners.values()].reduce((sum, set) => sum + set.size, 0), 5);
  for (let index = 0; index < 5; index += 1) controller.render();
  assert.equal([...root.listeners.values()].reduce((sum, set) => sum + set.size, 0), 5);
  controller.destroy();
  controller.destroy();
  assert.equal([...root.listeners.values()].reduce((sum, set) => sum + set.size, 0), 0);
  root.querySelector('[data-select]').click();
  assert.equal(root.querySelector('#selected-count').textContent, '0 selected');
});
