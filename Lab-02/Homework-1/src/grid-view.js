const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
});

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createHeader(columns, query) {
  const head = element('thead');
  const row = element('tr');
  row.setAttribute('role', 'row');
  row.setAttribute('aria-rowindex', '1');
  const selection = element('th', 'selection-cell', 'Select');
  selection.scope = 'col';
  selection.setAttribute('role', 'columnheader');
  selection.tabIndex = -1;
  row.append(selection);
  columns.forEach((column) => {
    const cell = element('th');
    cell.scope = 'col';
    cell.setAttribute('role', 'columnheader');
    cell.tabIndex = -1;
    if (column.sortable) {
      const sorted = query.sortKey === column.accessorKey;
      cell.setAttribute('aria-sort', sorted ? query.sortDirection : 'none');
      const button = element('button', 'sort-button', column.header);
      button.type = 'button';
      button.tabIndex = -1;
      button.dataset.sort = column.accessorKey;
      const nextDirection = sorted && query.sortDirection === 'ascending' ? 'descending' : 'ascending';
      button.setAttribute('aria-label', `Sort by ${column.header.toLowerCase()}, ${nextDirection}`);
      const arrow = element('span', 'sort-icon', sorted ? (query.sortDirection === 'ascending' ? '↑' : '↓') : '↕');
      arrow.setAttribute('aria-hidden', 'true');
      button.append(arrow);
      cell.append(button);
    } else cell.textContent = column.header;
    row.append(cell);
  });
  head.append(row);
  return head;
}

function createValue(member, key) {
  if (key === 'name') {
    const identity = element('span', 'member-identity');
    const initials = member.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
    const avatar = element('span', 'avatar', initials);
    avatar.setAttribute('aria-hidden', 'true');
    const copy = element('span', 'member-copy');
    copy.append(element('span', 'member-name', member.name), element('span', 'member-title', member.title));
    identity.append(avatar, copy);
    return identity;
  }
  if (key === 'status') {
    const status = element('span', 'status-badge', member.status);
    if (member.status === 'Active') status.classList.add('is-active');
    return status;
  }
  if (key === 'joined') {
    const date = element('time', '', dateFormatter.format(new Date(`${member.joined}T00:00:00Z`)));
    date.dateTime = member.joined;
    return date;
  }
  return document.createTextNode(String(member[key]));
}

function createRow(member, columns, selected, rowIndex) {
  const row = element('tr', selected ? 'is-selected' : '');
  row.dataset.rowId = member.id;
  row.setAttribute('role', 'row');
  row.setAttribute('aria-rowindex', String(rowIndex));
  row.setAttribute('aria-selected', String(selected));
  const selection = element('td', 'selection-cell');
  selection.setAttribute('role', 'gridcell');
  selection.tabIndex = -1;
  const toggle = element('button', 'select-row', selected ? '✓' : '');
  toggle.type = 'button';
  toggle.tabIndex = -1;
  toggle.dataset.select = member.id;
  toggle.setAttribute('aria-label', `Select ${member.name}`);
  toggle.setAttribute('aria-pressed', String(selected));
  selection.append(toggle);
  row.append(selection);
  columns.forEach((column) => {
    const cell = element('td');
    cell.setAttribute('role', 'gridcell');
    cell.tabIndex = -1;
    cell.append(createValue(member, column.accessorKey));
    row.append(cell);
  });
  return row;
}

/** Build only native table elements; record strings always enter as text. */
export function renderGrid(table, { columns, ariaLabel, query, result, selected }, focus = { rowId: null, column: 1 }) {
  table.setAttribute('role', 'grid');
  table.setAttribute('aria-label', ariaLabel);
  table.setAttribute('aria-multiselectable', 'true');
  table.setAttribute('aria-rowcount', String(result.total + 1));
  table.setAttribute('aria-colcount', String(columns.length + 1));
  table.setAttribute('aria-describedby', 'keyboard-help');
  const caption = element('caption', 'sr-only', `${ariaLabel}. Select team members and sort columns.`);
  const body = element('tbody');
  result.rows.forEach((member, index) => {
    body.append(createRow(member, columns, selected.has(member.id), result.start + index + 1));
  });
  table.replaceChildren(caption, createHeader(columns, query), body);
  const rows = [...table.rows];
  const activeRow = focus.rowId === null
    ? rows[0] : rows.find((row) => row.dataset.rowId === focus.rowId) ?? rows[1] ?? rows[0];
  const activeCell = activeRow.cells[Math.min(focus.column, activeRow.cells.length - 1)];
  activeCell.tabIndex = 0;
  return activeCell;
}
