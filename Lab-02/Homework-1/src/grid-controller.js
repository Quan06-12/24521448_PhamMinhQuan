import { initialQuery, queryMembers, updateQuery, sortQuery, selectMember } from './query.js';
import { renderGrid } from './grid-view.js';

/** One delegated event hub for this directory; render never adds listeners. */
export function createGridController(root, { data, columns, ariaLabel, onRowSelect }) {
  const table = root.querySelector('table');
  const status = root.querySelector('#result-status');
  const selectedCount = root.querySelector('#selected-count');
  const empty = root.querySelector('#empty-state');
  const pageLabel = root.querySelector('#page-label');
  const previous = root.querySelector('[data-page="previous"]');
  const next = root.querySelector('[data-page="next"]');
  const clearSelection = root.querySelector('[data-action="clear-selection"]');
  let query = initialQuery;
  let selected = new Set();
  let focus = { rowId: null, column: 1 };
  let destroyed = false;

  function cellFrom(target) {
    const cell = target.closest('th, td');
    return cell && table.contains(cell) ? cell : null;
  }

  function remember(cell) {
    focus = { rowId: cell.parentElement.dataset.rowId ?? null, column: cell.cellIndex };
  }

  function render(message = '') {
    if (destroyed) return;
    const focused = document.activeElement;
    const restoreFocus = table.contains(focused);
    const result = queryMembers(data, query);
    query = Object.freeze({ ...query, page: result.page });
    const active = renderGrid(table, { columns, ariaLabel, query, result, selected }, focus);
    remember(active);
    if (restoreFocus) active.focus({ preventScroll: true });
    empty.hidden = result.total !== 0;
    previous.disabled = result.page === 1;
    next.disabled = result.page === result.pageCount;
    // Native disabled buttons lose focus. Keep pagination actionable; when no
    // page direction is available, return to the page-size control instead.
    if ((focused === previous || focused === next) && focused.disabled) {
      const opposite = focused === previous ? next : previous;
      (opposite.disabled ? root.querySelector('#page-size') : opposite).focus();
    }
    pageLabel.textContent = `Page ${result.page} of ${result.pageCount}`;
    selectedCount.textContent = `${selected.size} selected`;
    clearSelection.disabled = selected.size === 0;
    const range = result.total ? `${result.start}–${result.end} of ${result.total} members` : 'No members found';
    status.textContent = `${message ? `${message} ` : ''}${range}. ${selected.size} selected.`;
  }

  function select(id, toggle) {
    const member = data.find((item) => item.id === id);
    if (!member) return;
    const wasSelected = selected.has(id);
    selected = selectMember(selected, id, toggle);
    const isSelected = selected.has(id);
    render(`${member.name} ${isSelected ? 'selected' : 'deselected'}.`);
    if (wasSelected !== isSelected) onRowSelect?.(member);
  }

  function click(event) {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    const cell = cellFrom(button);
    if (cell) remember(cell);
    if (button.dataset.sort) {
      query = sortQuery(query, button.dataset.sort);
      render(`Sorted ${button.textContent.replace(/[↑↓↕]/gu, '').trim().toLowerCase()} ${query.sortDirection}.`);
    } else if (button.dataset.select) select(button.dataset.select, true);
    else if (button.dataset.page) {
      query = updateQuery(query, { page: query.page + (button.dataset.page === 'next' ? 1 : -1) });
      render();
    } else if (button.dataset.action === 'clear-selection') {
      selected = new Set();
      render('Selection cleared.');
    } else if (button.dataset.action === 'clear-filters') {
      root.querySelector('#search').value = '';
      root.querySelector('#team-filter').value = '';
      root.querySelector('#status-filter').value = '';
      query = updateQuery(query, { search: '', team: '', status: '' });
      render('Filters cleared.');
      root.querySelector('#search').focus();
    }
  }

  function input(event) {
    if (event.target.id !== 'search') return;
    query = updateQuery(query, { search: event.target.value });
    render();
  }

  function change(event) {
    const fields = { 'team-filter': 'team', 'status-filter': 'status', 'page-size': 'pageSize' };
    const field = fields[event.target.id];
    if (!field) return;
    const value = field === 'pageSize' ? Number(event.target.value) : event.target.value;
    query = updateQuery(query, { [field]: value });
    render();
  }

  function keydown(event) {
    const cell = cellFrom(event.target);
    if (!cell || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      const rows = [...table.rows];
      const rowIndex = rows.indexOf(cell.parentElement);
      const targetRow = rows[Math.max(0, Math.min(rows.length - 1, rowIndex + move[0]))];
      const targetCell = targetRow.cells[Math.max(0, Math.min(targetRow.cells.length - 1, cell.cellIndex + move[1]))];
      table.querySelector('[tabindex="0"]').tabIndex = -1;
      targetCell.tabIndex = 0;
      remember(targetCell);
      targetCell.focus({ preventScroll: true });
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (event.repeat) return;
      remember(cell);
      const id = cell.parentElement.dataset.rowId;
      if (id) select(id, event.key === ' ');
      else cell.querySelector('[data-sort]')?.click();
    }
  }

  function focusin(event) {
    const cell = cellFrom(event.target);
    if (!cell) return;
    const previousCell = table.querySelector('[tabindex="0"]');
    if (previousCell !== cell) {
      if (previousCell) previousCell.tabIndex = -1;
      cell.tabIndex = 0;
    }
    remember(cell);
    // Browser focus scrolling can expose only a sliver of a wide table cell.
    // Reveal the whole focused cell with the smallest scroll in each axis.
    cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  const listeners = { click, input, change, keydown, focusin };
  Object.entries(listeners).forEach(([type, listener]) => root.addEventListener(type, listener));
  render();
  return {
    render,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      Object.entries(listeners).forEach(([type, listener]) => root.removeEventListener(type, listener));
    },
  };
}
